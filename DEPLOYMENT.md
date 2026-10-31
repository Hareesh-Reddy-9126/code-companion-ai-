# Code Companion AI — Production Deployment Guide (Zero Cost)

## Prerequisites (all free, no credit card)

| Service | Account | What to copy |
|---------|---------|--------------|
| NVIDIA NIM | [build.nvidia.com](https://build.nvidia.com/settings/api-keys) | `NVIDIA_API_KEY` |
| Supabase | [supabase.com](https://supabase.com/dashboard/new) | URL, anon key, service_role key |
| GitHub | [github.com/settings/developers](https://github.com/settings/developers) | OAuth Client ID + Secret |
| Cloudflare | [dash.cloudflare.com](https://dash.cloudflare.com) | API token, account ID |
| Sentry | [sentry.io](https://sentry.io) | DSN (optional) |
| UptimeRobot | [uptimerobot.com](https://uptimerobot.com) | Monitor URL (optional) |

## Step 1: Create Accounts & Collect Keys

1. **NVIDIA**: Sign in with Gmail at build.nvidia.com, verify phone, create API key at `/settings/api-keys`.
2. **Supabase**: Create new free project. Copy from Settings → API: Project URL, anon public key, service_role key.
3. **GitHub**: New OAuth App. Callback URL: `https://YOUR-PAGES-DOMAIN/auth/github/callback`. Copy Client ID + Secret.
4. **Cloudflare**: Connect GitHub repo to Pages. Build command: `npm run build`, output: `dist`. Add env vars below.

## Step 2: Configure `.env`

Copy `.env.example` to `.env` and fill in:

```bash
cp .env.example .env
```

Required values:
- `VITE_SUPABASE_URL` — from Supabase Settings → API
- `VITE_SUPABASE_PUBLISHABLE_KEY` — from Supabase Settings → API (anon key)
- `SUPABASE_SERVICE_ROLE_KEY` — from Supabase Settings → API (service_role, secret)
- `NVIDIA_API_KEY` — from NVIDIA build.nvidia.com
- `GITHUB_CLIENT_ID` — from GitHub OAuth app
- `GITHUB_CLIENT_SECRET` — from GitHub OAuth app
- `APP_URL` — your Cloudflare Pages URL (e.g. `https://code-companion-ai.pages.dev`)
- `ENCRYPTION_KEY` — any random 32+ character string

## Step 3: Database Migration

In Supabase Dashboard → SQL Editor, run the full contents of:

```
supabase/migrations/20261031000000_security_and_jobs.sql
```

## Step 4: Set Edge Function Secrets

In Supabase Dashboard → Edge Functions → Secrets, add:

```
ENCRYPTION_KEY=<same as .env>
NVIDIA_API_KEY=<same as .env>
GITHUB_CLIENT_ID=<same as .env>
GITHUB_CLIENT_SECRET=<same as .env>
APP_URL=<your Cloudflare Pages URL>
```

Then deploy functions:

```bash
npm install -g supabase@latest
supabase login
supabase functions deploy analyze-repo
supabase functions deploy analyze-pr
supabase functions deploy github-callback
supabase functions deploy github-auth-url
supabase functions deploy health
supabase functions deploy admin-stats
supabase functions deploy revoke-github
```

## Step 5: Deploy Frontend

Connect your GitHub repo to Cloudflare Pages:
- Build command: `npm run build`
- Build output: `dist`
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`

## Step 6: GitHub Secrets (for auto-deploy)

In GitHub repo → Settings → Secrets and variables → Actions, add:

```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
SUPABASE_ACCESS_TOKEN
SUPABASE_PROJECT_REF
```

## Step 7: Monitoring (Optional, Free)

- **UptimeRobot**: Create HTTP monitor for `https://YOUR-DOMAIN/functions/v1/health` (5 min interval)
- **Sentry**: Add DSN to `src/main.tsx` if desired

## Free Tier Limits to Watch

| Resource | Limit | What happens if exceeded |
|----------|-------|-------------------------|
| NVIDIA requests | ~40/min, ~10k/day | Rate limit errors (function falls back to next model) |
| Supabase DB | 500 MB | Read-only mode |
| Supabase edge invocations | 500k/month | Grace period, then restrictions |
| Supabase project | Pauses after 7 days idle | Keep-alive cron in `.github/workflows/deploy.yml` pings every 6 hours |

## Rollback

Revert the GitHub push; Cloudflare Pages deploys from git, so the previous commit is automatically served.
