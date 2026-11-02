# Production Deployment Guide

Zero-cost stack: Cloudflare Workers (static assets) + Supabase (Auth, Postgres, Edge Functions) + NVIDIA NIM free tier + GitHub OAuth.

## 1. Accounts and keys

| Service | Where | Keys |
|---|---|---|
| Supabase | https://supabase.com/dashboard | Project URL, publishable key, secret/service key |
| NVIDIA NIM | https://build.nvidia.com/settings/api-keys | `nvapi-...` API key |
| GitHub | Settings -> Developer settings -> OAuth Apps | Client ID, client secret |
| Cloudflare | https://dash.cloudflare.com | API token, account ID (for CLI deploys) |

## 2. Supabase

```bash
npx supabase link --project-ref <project-ref>
npx supabase db push
```

If the database already exists, apply the SQL in `supabase/migrations/` through the SQL editor or:

```bash
npx supabase db query --linked --project-ref <project-ref> -f supabase/migrations/<file>.sql
```

Set the edge function secrets:

```bash
npx supabase secrets set \
  NVIDIA_API_KEY="nvapi-..." \
  GITHUB_CLIENT_ID="..." \
  GITHUB_CLIENT_SECRET="..." \
  ENCRYPTION_KEY="<64 random hex chars>" \
  APP_URL="https://code-companion-ai.hareeshreddy916.workers.dev" \
  --project-ref <project-ref>
```

`SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are injected by the platform for edge functions.

Deploy functions:

```bash
npx supabase functions deploy --project-ref <project-ref>
```

Check:

```bash
curl https://<project-ref>.supabase.co/functions/v1/health
```

Expected: `{"status":"healthy","checks":{"database":"ok",...}}`.

## 3. GitHub OAuth

Create an OAuth app:

- Homepage URL: `https://code-companion-ai.hareeshreddy916.workers.dev`
- Authorization callback URL: `https://code-companion-ai.hareeshreddy916.workers.dev/auth/github/callback`

For local development, add a second OAuth app with callback
`http://localhost:8080/auth/github/callback`, because GitHub allows one callback
URL per app.

Scopes requested: `repo` (read repository contents, post PR comments).

## 4. Frontend

Build and deploy:

```bash
npm ci
npm run build
npx wrangler deploy
```

The site is configured in `wrangler.jsonc` as a Worker with static assets and
SPA fallback. Cloudflare's Git integration deploys `main` automatically; the
manual command is the fallback.

Environment variables for the build:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## 5. CI/CD

- `.github/workflows/ci.yml` - lint, typecheck, test, build on every push/PR.
- `.github/workflows/deploy.yml` - verifies the build and deploys edge functions when `SUPABASE_ACCESS_TOKEN` is configured.
- `.github/workflows/keep-alive.yml` - pings the health endpoint every 6 hours to keep the free Supabase project active.

Required GitHub secrets:

| Secret | Purpose |
|---|---|
| `SUPABASE_ACCESS_TOKEN` | Deploy edge functions |
| `SUPABASE_PROJECT_REF` | Target project (defaults to `gcszjbtdofquemrbumvg`) |
| `VITE_SUPABASE_URL` | Build-time frontend config |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Build-time frontend config |

## 6. Post-deploy checklist

1. `GET /functions/v1/health` returns 200.
2. Sign up with email and confirm the account.
3. Connect GitHub and confirm the repository list syncs.
4. Run an analysis and confirm scores render in the dashboard.
5. Dispatch the agent on a test PR and confirm a comment is posted.
6. Confirm `/dashboard` redirects to `/login` when signed out.
7. Check the Cloudflare deployment URL and custom domain.

## 7. Operations

- Logs: Supabase Dashboard -> Edge Functions -> Logs.
- Errors: `error_events` table.
- Admin metrics: `GET /functions/v1/admin-stats` with an admin JWT.
- Rotate secrets: `npx supabase secrets set ...`; rotating `ENCRYPTION_KEY` requires users to reconnect GitHub.

## 8. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `Invalid redirect URI` | Callback not in `APP_URL` allowlist | Update `APP_URL` secret or the OAuth app callback |
| `GitHub not connected` | No `github_credentials` row | Reconnect GitHub from Settings |
| `All NVIDIA models failed` | Invalid key or provider outage | Check `NVIDIA_API_KEY`, retry |
| 401 on function | Missing/expired JWT | Sign in again |
| Blank page after deploy | Assets not uploaded | Run `npx wrangler deploy` and check `dist/` |
