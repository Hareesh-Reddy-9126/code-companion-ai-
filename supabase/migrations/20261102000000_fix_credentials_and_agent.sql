-- ============================================================================
-- Fix github_credentials schema drift + add autonomous agent tables
-- Safe to run multiple times.
-- ============================================================================

-- crypto.ts embeds the IV inside the ciphertext (base64(iv + ciphertext)),
-- so the separate `iv` column is unused and its NOT NULL constraint breaks
-- every GitHub token save.
ALTER TABLE public.github_credentials
  DROP COLUMN IF EXISTS iv;

-- ---------------------------------------------------------------------------
-- autonomous_fixes — records for the autonomous PR fixing agent
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.autonomous_fixes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  repo_id UUID REFERENCES public.repositories(id) ON DELETE CASCADE,
  repo_name TEXT,
  pr_number INTEGER NOT NULL,
  pr_title TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  issues_found INTEGER NOT NULL DEFAULT 0,
  fixes_applied INTEGER NOT NULL DEFAULT 0,
  confidence_score INTEGER NOT NULL DEFAULT 0,
  summary TEXT,
  report_json JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.autonomous_fixes ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own autonomous fixes' AND tablename = 'autonomous_fixes') THEN
    CREATE POLICY "Users can view their own autonomous fixes" ON public.autonomous_fixes FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own autonomous fixes' AND tablename = 'autonomous_fixes') THEN
    CREATE POLICY "Users can insert their own autonomous fixes" ON public.autonomous_fixes FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own autonomous fixes' AND tablename = 'autonomous_fixes') THEN
    CREATE POLICY "Users can update their own autonomous fixes" ON public.autonomous_fixes FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_autonomous_fixes_user_created
  ON public.autonomous_fixes(user_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- Prevent duplicate repository rows during repeated GitHub syncs
-- ---------------------------------------------------------------------------
CREATE UNIQUE INDEX IF NOT EXISTS idx_repositories_user_github_repo
  ON public.repositories(user_id, github_repo_id);
