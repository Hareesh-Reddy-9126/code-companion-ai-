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
<div align="center">
  <img src="https://raw.githubusercontent.com/Hareesh-Reddy-9126/code-companion-ai-/main/public/logo.png" alt="Code Companion AI Logo" width="120" />
  
  <h1>Code Companion AI</h1>
  <p><b>Modern Code Review & Repository Analysis Dashboard</b></p>
  <p>Empowering developers with automated insights, security scanning, and performance analytics.</p>
</div>


<div align="center">
  <img src="https://img.shields.io/github/license/Hareesh-Reddy-9126/code-companion-ai-?style=flat-square" alt="License" />
  <img src="https://img.shields.io/github/stars/Hareesh-Reddy-9126/code-companion-ai-?style=flat-square" alt="Stars" />
  <img src="https://img.shields.io/badge/tech-stack-React%20%7C%20TypeScript%20%7C%20Vite%20%7C%20Supabase%20%7C%20Tailwind-blue?style=flat-square" alt="Tech Stack" />
  <img src="https://img.shields.io/badge/status-active-success?style=flat-square" alt="Status" />
</div>

---

## 🚀 Project Description

Code Companion AI is a developer-focused dashboard for code review, repository analysis, security scanning, and performance insights. Built with React, TypeScript, and Supabase, it streamlines codebase management and collaboration for modern teams.

---

## ✨ Features

| 🚦 | Automated Code Review | 🔍 | Repository Analysis |
|----|-----------------------|----|--------------------|
| 🛡️ | Security Vulnerability Scanning | ⚡ | Performance Insights |
| 🔗 | GitHub Integration | 🔑 | Supabase Authentication |
| 📊 | Architecture Analysis | 🕒 | History Tracking |

---

## 🏗️ System Architecture

```
Frontend (React + Vite + Tailwind)
	│
	├── Authentication (Supabase)
	├── API Integration (Supabase Edge Functions)
	├── GitHub OAuth & Data Fetching
	└── Dashboard UI (Shadcn/Radix UI)

Backend (Supabase Edge Functions)
	│
	├── Analyze PRs & Repositories
	├── Security & Performance Scans
	└── Store Results in Supabase DB

Cloud (Supabase Hosting)
```

---

## 📁 Project Folder Structure

```text
code-companion-ai/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── contexts/
│   ├── integrations/
│   ├── lib/
│   └── test/
├── supabase/
│   ├── functions/
│   └── migrations/
├── public/
│   └── robots.txt
├── .env
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🛠️ Tech Stack

<div align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-blue?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Vite-5.4.21-purple?logo=vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.17-teal?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Supabase-2.98.0-green?logo=supabase" />
  <img src="https://img.shields.io/badge/Deno%20Edge%20Functions-1.0.0-black?logo=deno" />
  <img src="https://img.shields.io/badge/Vitest-3.2.4-yellow?logo=vitest" />
</div>

---

## ⚙️ Installation

1. **Clone the repository:**
	```bash
	git clone https://github.com/Hareesh-Reddy-9126/code-companion-ai-.git
	cd code-companion-ai-
	```
2. **Install dependencies:**
	```bash
	npm install
	```
3. **Set up environment variables:**
	Create a `.env` file in the root directory:
	```env
	VITE_SUPABASE_URL="<your-supabase-url>"
	VITE_SUPABASE_PUBLISHABLE_KEY="<your-supabase-key>"
	```

---

## ▶️ Running Locally

Start the development server:
```bash
npm run dev
```
The app will be available at [http://localhost:8080](http://localhost:8080)

---

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase public API key |

---

## 🖼️ Screenshots

> _Add screenshots here to showcase the dashboard UI, code review, security scan, and performance analytics._

<div align="center">
  <img src="https://via.placeholder.com/800x400?text=Dashboard+Screenshot" alt="Dashboard Screenshot" />
  <img src="https://via.placeholder.com/800x400?text=Code+Review+Screenshot" alt="Code Review Screenshot" />
</div>

---

## 🌱 Future Improvements

- [ ] Add more integrations (Bitbucket, GitLab)
- [ ] Advanced analytics & visualizations
- [ ] Team collaboration features
- [ ] Customizable notification system
- [ ] Mobile responsive enhancements
- [ ] Improved onboarding & documentation

---

## 👤 Author

**Hareesh Reddy**  
[GitHub](https://github.com/Hareesh-Reddy-9126)  
[LinkedIn](https://www.linkedin.com/in/hareesh-reddy-9126/)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
