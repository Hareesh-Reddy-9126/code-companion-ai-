-- Multi-tenant Organizations & Memberships
-- Run after existing schema

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'professional', 'enterprise')),
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Organization members (many-to-many users <-> orgs)
CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, user_id)
);

-- Add org_id to existing tables
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id) ON DELETE SET NULL;
ALTER TABLE repositories ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE pr_analyses ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE github_credentials ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE analysis_jobs ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE autonomous_fixes ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE error_events ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- GitHub App installations per organization
CREATE TABLE IF NOT EXISTS github_app_installations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  installation_id TEXT NOT NULL,
  app_id TEXT NOT NULL,
  encrypted_token TEXT NOT NULL,
  target_type TEXT CHECK (target_type IN ('Organization', 'User')),
  account_login TEXT,
  permissions JSONB,
  repository_selection TEXT CHECK (repository_selection IN ('all', 'selected')),
  suspended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, installation_id)
);

-- Rate limit counters
CREATE TABLE IF NOT EXISTS rate_limit_counters (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  window_start BIGINT NOT NULL
);

-- Audit logs (append-only, immutable)
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_organization_members_user ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_org ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_profiles_org ON profiles(org_id);
CREATE INDEX IF NOT EXISTS idx_repositories_org ON repositories(org_id);
CREATE INDEX IF NOT EXISTS idx_analyses_org ON analyses(org_id);
CREATE INDEX IF NOT EXISTS idx_pr_analyses_org ON pr_analyses(org_id);
CREATE INDEX IF NOT EXISTS idx_github_credentials_org ON github_credentials(org_id);
CREATE INDEX IF NOT EXISTS idx_analysis_jobs_org ON analysis_jobs(org_id);
CREATE INDEX IF NOT EXISTS idx_autonomous_fixes_org ON autonomous_fixes(org_id);
CREATE INDEX IF NOT EXISTS idx_error_events_org ON error_events(org_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org_created ON audit_logs(org_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_created ON audit_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rate_limit_window ON rate_limit_counters(window_start);

-- RLS Policies
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_app_installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limit_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Organizations: members can read their orgs
CREATE POLICY "org_read_member" ON organizations FOR SELECT USING (
  id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid())
);

-- Organizations: owners/admins can update
CREATE POLICY "org_update_admin" ON organizations FOR UPDATE USING (
  id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))
);

-- Organization members: users can read their memberships
CREATE POLICY "member_read_own" ON organization_members FOR SELECT USING (user_id = auth.uid());

-- Organization members: owners/admins can manage members
CREATE POLICY "member_manage_admin" ON organization_members FOR ALL USING (
  organization_id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))
);

-- GitHub App installations: org admins can manage
CREATE POLICY "github_app_admin" ON github_app_installations FOR ALL USING (
  organization_id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))
);

-- Rate limit: service role only (via edge functions)
CREATE POLICY "rate_limit_service" ON rate_limit_counters FOR ALL USING (false);

-- Audit logs: org admins can read
CREATE POLICY "audit_read_admin" ON audit_logs FOR SELECT USING (
  org_id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))
);

-- Audit logs: service role can insert
CREATE POLICY "audit_insert_service" ON audit_logs FOR INSERT WITH CHECK (false);

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trigger_organizations_updated ON organizations;
CREATE TRIGGER trigger_organizations_updated BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_github_app_installations_updated ON github_app_installations;
CREATE TRIGGER trigger_github_app_installations_updated BEFORE UPDATE ON github_app_installations FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Helper: create personal org for new users
CREATE OR REPLACE FUNCTION create_personal_org()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  org_id UUID;
BEGIN
  INSERT INTO organizations (name, slug)
  VALUES (NEW.raw_user_meta_data->>'full_name' || '''s Workspace', 'ws-' || NEW.id::text)
  RETURNING id INTO org_id;

  INSERT INTO organization_members (organization_id, user_id, role, joined_at)
  VALUES (org_id, NEW.id, 'owner', now());

  UPDATE profiles SET org_id = org_id WHERE user_id = NEW.id;

  RETURN NEW;
END;
$$;

-- Drop existing if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION create_personal_org();