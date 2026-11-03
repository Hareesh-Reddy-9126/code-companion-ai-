-- Add execute_sql RPC for metrics (secure, service-role only)
CREATE OR REPLACE FUNCTION execute_sql(sql TEXT)
RETURNS SETOF RECORD
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY EXECUTE sql;
END;
$$;

REVOKE ALL ON FUNCTION execute_sql(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION execute_sql(TEXT) TO service_role;

-- Rate limit cleanup job (run via pg_cron or external scheduler)
CREATE OR REPLACE FUNCTION cleanup_rate_limits()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM rate_limit_counters
  WHERE window_start < EXTRACT(EPOCH FROM NOW()) * 1000 - 86400000; -- older than 24h
END;
$$;