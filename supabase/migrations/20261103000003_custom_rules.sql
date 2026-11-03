-- Custom Rules Engine
CREATE TABLE IF NOT EXISTS custom_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  language TEXT, -- e.g., 'ts', 'js', 'py', 'go', 'rs', 'java'
  pattern TEXT NOT NULL, -- regex pattern
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  category TEXT NOT NULL DEFAULT 'best-practice' CHECK (category IN ('security', 'performance', 'bug', 'style', 'best-practice')),
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_custom_rules_org ON custom_rules(org_id);
CREATE INDEX IF NOT EXISTS idx_custom_rules_enabled ON custom_rules(org_id, enabled) WHERE enabled = true;

ALTER TABLE custom_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rules_read_org" ON custom_rules FOR SELECT USING (
  org_id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid())
);

CREATE POLICY "rules_manage_admin" ON custom_rules FOR ALL USING (
  org_id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trigger_custom_rules_updated ON custom_rules;
CREATE TRIGGER trigger_custom_rules_updated BEFORE UPDATE ON custom_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed with common security rules (inserted per-org on creation, but here are templates)
-- These would be copied to each new org via a trigger or application logic