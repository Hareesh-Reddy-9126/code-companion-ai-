# Code Companion AI


# Project Description
Code Companion AI is a developer-focused tool for code review, repository analysis, security scanning, and performance insights. Built with React, TypeScript, and Supabase, it provides a modern dashboard for managing your codebase and collaborating with your team.

# Features
- Code review automation
- Repository analysis
- Security vulnerability scanning
- Performance insights
- GitHub integration
- Authentication with Supabase

# Tech Stack
- React (TypeScript)
- Vite
- Tailwind CSS
- Shadcn UI (Radix UI)
- Supabase
- Deno Edge Functions
- Vitest (Testing)

# Installation
1. Clone the repository:
	```bash
	git clone https://github.com/your-org/code-companion-ai.git
	cd code-companion-ai
	```
2. Install dependencies:
	```bash
	npm install
	```
3. Set up environment variables in `.env`:
	```env
	VITE_SUPABASE_URL="<your-supabase-url>"
	VITE_SUPABASE_PUBLISHABLE_KEY="<your-supabase-key>"
	```

# Running Locally
Start the development server:
```bash
npm run dev
```
The app will be available at http://localhost:8080

# Folder Structure
```
src/
  components/
  pages/
  hooks/
  contexts/
  integrations/
  lib/
  test/
supabase/
  functions/
  migrations/
public/
```
