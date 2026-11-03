-- Analysis snapshots for incremental analysis
CREATE TABLE IF NOT EXISTS analysis_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_id UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (repo_id, file_path)
);

CREATE INDEX IF NOT EXISTS idx_analysis_snapshots_repo ON analysis_snapshots(repo_id);

ALTER TABLE analysis_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "snapshots_read_owner" ON analysis_snapshots FOR SELECT USING (
  repo_id IN (SELECT id FROM repositories WHERE user_id = auth.uid())
);

CREATE POLICY "snapshots_write_owner" ON analysis_snapshots FOR INSERT WITH CHECK (
  repo_id IN (SELECT id FROM repositories WHERE user_id = auth.uid())
);

CREATE POLICY "snapshots_update_owner" ON analysis_snapshots FOR UPDATE USING (
  repo_id IN (SELECT id FROM repositories WHERE user_id = auth.uid())
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trigger_analysis_snapshots_updated ON analysis_snapshots;
CREATE TRIGGER trigger_analysis_snapshots_updated BEFORE UPDATE ON analysis_snapshots FOR EACH ROW EXECUTE FUNCTION update_updated_at();