# Security Policy

## Reporting a vulnerability

Email `security@codecompanion.ai` with:

- A description of the issue and its impact.
- Steps to reproduce, including a request or proof of concept if possible.
- The affected URL or function name.

We aim to acknowledge reports within 72 hours and to provide a remediation
timeline within 7 days. Please do not open a public issue for a security report.

## Controls in place

| Area | Control |
|---|---|
| Authentication | Supabase Auth (email/password, JWT access + refresh tokens) |
| Authorization | Row-level security on every user table; admin role in `user_roles` |
| Token storage | GitHub access tokens encrypted with AES-256-GCM, random IV, key held only in edge function secrets |
| Transport | TLS 1.3 (Cloudflare and Supabase managed) |
| Edge functions | JWT verification enabled except for `health` and `github-auth-url` |
| OAuth | Redirect URI allowlist derived from `APP_URL`; state handled by the authenticated browser session |
| CORS | Explicit allowlist in `supabase/functions/_shared/cors.ts` |
| Input limits | File count and size caps before AI calls; GitHub URL validation |
| Error handling | Errors logged to `error_events`; secrets never logged |
| Dependencies | Dependabot updates; CI lint, typecheck, tests and build |

## Secret management

- `.env` is ignored by git and must never be committed.
- Production secrets live in Supabase Edge Function secrets and GitHub Actions secrets.
- Rotate `NVIDIA_API_KEY`, `GITHUB_CLIENT_SECRET` and `ENCRYPTION_KEY` immediately if a leak is suspected.
- Rotating `ENCRYPTION_KEY` invalidates stored GitHub tokens; users must reconnect GitHub.

## Data handling

- Repository metadata and analysis reports are stored in Supabase (EU region).
- Source files are sent to NVIDIA NIM for inference and are not used to train models.
- GitHub tokens are never returned to the browser.
- Deleting an account cascades to repositories, analyses, jobs and credentials.

## Compliance status

SOC 2 Type II is **not yet certified**. Controls are being aligned with the
trust services criteria. Do not represent the product as SOC 2 certified until
an audit report exists. GDPR-aligned data handling practices are documented in
`infra/compliance/`.
