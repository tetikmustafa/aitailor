<p align="center">
  <strong>✨ AiTailor</strong><br/>
  <em>AI-Powered CV Tailoring & LaTeX-to-PDF Compilation Platform</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Cloudflare_Workers-Edge-F38020?logo=cloudflare&logoColor=white" alt="Cloudflare Workers" />
  <img src="https://img.shields.io/badge/License-Private-red" alt="License" />
</p>

---

## 📖 Overview

**AiTailor** is a full-stack web application that uses AI to automatically tailor LaTeX-based resumes (CVs) for specific job descriptions and generate professional cover emails. It features an intelligent multi-step pipeline that includes ATS (Applicant Tracking System) optimization, one-page enforcement through compile-verify-shrink/grow loops, and real-time LaTeX-to-PDF compilation — all running on Cloudflare's edge network for minimal latency worldwide.

**Live:** [aitailor.mustafatetik.com](https://aitailor.mustafatetik.com)

---

## ✨ Key Features

### 🤖 AI-Powered CV Tailoring
- Paste a job description and get an ATS-optimized, tailored version of your LaTeX CV in seconds
- Intelligent content selection: the AI analyzes the JD, selects the most relevant projects (exactly 2), curates experience bullets, synthesizes a targeted "About" section, and trims the tech stack — all while preserving a **Hidden Archive** of unused content for future applications
- Custom instructions support (e.g., *"Focus on backend skills"*, *"Remove cybersecurity projects"*)
- Automatic **cover email generation** referencing concrete points from the tailored CV

### 📏 One-Page Enforcement Pipeline
- After the initial AI tailoring, the system compiles the LaTeX to PDF and **measures** the actual page count and line usage
- **Shrink loop**: If the result exceeds one page, the system sends the measured overflow (in exact lines) back to the AI for precision trimming (up to 2 attempts)
- **Grow-back pass**: If the one-page result has significant slack (≥ 6 lines unused), the system restores archived content to maximize page utilization
- All measurements are real — extracted from compiled PDFs using `unpdf`, not estimated

### 🔗 Multi-Provider LLM Abstraction Layer
- Provider-agnostic architecture supporting **5 LLM providers**: OpenRouter, Google Gemini, OpenAI, Anthropic, and DeepSeek
- **Automatic fallback chain**: Configurable via `LLM_PROVIDER_CHAIN` env var — walks providers in order, retrying the next on retryable errors (429, 5xx, timeout)
- Fatal errors (400/401/403) surface immediately without unnecessary retries
- Structured JSON output with schema enforcement across all providers

### 📝 In-Browser LaTeX Editor
- Full-featured **Monaco Editor** (VS Code's editor engine) with LaTeX syntax highlighting
- Dark/light theme synchronization with the app theme
- Mobile-responsive: graceful fallback to a read-only `<pre>` view on small screens
- Copy-to-clipboard and real-time editing support

### 📄 LaTeX-to-PDF Compilation
- Dual-service compilation with automatic failover:
  - **Primary**: [ytotech LaTeX API](https://latex.ytotech.com) (`pdflatex` engine)
  - **Fallback**: [latexonline.cc](https://latexonline.cc)
- In-browser PDF preview via `<iframe>`
- Custom filename support for downloads
- 15-second timeout per service with graceful degradation

### 🛡️ Security & Rate Limiting
- **Cloudflare Turnstile** (CAPTCHA alternative) verification on all API endpoints — both server-side token validation and client-side widget integration
- **Upstash Redis** rate limiting with sliding 24h windows:
  - Compile: 100 requests/IP/day
  - Tailor: 50 requests/IP/day
- Input size guards (50K chars LaTeX, 10K chars JD, 2K chars custom instructions)
- Privacy-conscious logging: IPs are hashed before any log output

### 🔧 Developer Mode (Dev Panel)
- Accessed via `?devKey=<secret>` query parameter
- Override LLM provider and model at runtime
- View and edit the system prompt per-request (changes are ephemeral)
- Useful for A/B testing prompt strategies and comparing model outputs

### 🎨 UI/UX
- Dark/light theme toggle with system preference detection and localStorage persistence
- Glassmorphism header with backdrop blur
- Smooth fade-up entrance animations
- Responsive design with mobile-first breakpoints
- Real-time progress bar with step-by-step NDJSON streaming updates during tailoring

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         Client (React 19)                        │
│                                                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │ Master CV    │  │ AI Tailor    │  │ Results                │  │
│  │ (Monaco      │  │ (Job Desc +  │  │ (Tailored CV editor +  │  │
│  │  Editor)     │  │  Instructions│  │  Cover Mail + PDF      │  │
│  │              │  │  + Turnstile)│  │  preview & download)   │  │
│  └──────┬───────┘  └──────┬───────┘  └────────────┬───────────┘  │
│         │                 │                        │              │
└─────────┼─────────────────┼────────────────────────┼──────────────┘
          │                 │                        │
          ▼                 ▼                        ▼
┌──────────────────────────────────────────────────────────────────┐
│                    Next.js API Routes (Edge)                     │
│                                                                  │
│  POST /api/compile         POST /api/tailor                      │
│  ├─ Turnstile verify       ├─ Turnstile verify                   │
│  ├─ Rate limit check       ├─ Rate limit check                   │
│  └─ Compile LaTeX→PDF      ├─ LLM call (fallback chain)          │
│     ├─ ytotech (primary)   ├─ Compile + analyze pages            │
│     └─ latexonline (fb)    ├─ Shrink loop (if >1 page)           │
│                            ├─ Grow-back (if slack ≥6 lines)      │
│                            └─ Stream NDJSON progress + result     │
└──────────────────────────────────────────────────────────────────┘
          │                           │
          ▼                           ▼
┌──────────────────┐    ┌──────────────────────────┐
│  LaTeX Services  │    │   LLM Provider Registry  │
│  • ytotech       │    │   ┌──────────────────┐   │
│  • latexonline   │    │   │ OpenRouter       │   │
└──────────────────┘    │   │ Gemini           │   │
                        │   │ OpenAI           │   │
┌──────────────────┐    │   │ Anthropic        │   │
│  Upstash Redis   │    │   │ DeepSeek         │   │
│  (Rate Limiting) │    │   └──────────────────┘   │
└──────────────────┘    └──────────────────────────┘
```

---

## 📂 Project Structure

```
aitailor/
├── app/
│   ├── api/
│   │   ├── compile/
│   │   │   └── route.ts            # POST /api/compile — LaTeX → PDF
│   │   └── tailor/
│   │       ├── route.ts            # POST /api/tailor — AI tailoring pipeline
│   │       └── system-prompt/
│   │           └── route.ts        # GET — dev panel system prompt endpoint
│   ├── globals.css                 # Design tokens, theme variables, animations
│   ├── layout.tsx                  # Root layout with SEO metadata & theme script
│   └── page.tsx                    # Home page — renders CvBuilderClient
│
├── components/
│   ├── AppHeader.tsx               # Glassmorphism header with theme toggle & links
│   ├── cv-builder/
│   │   ├── CvBuilderClient.tsx     # Main tab controller (Master → Tailor → Results)
│   │   ├── MasterCvTab.tsx         # LaTeX editor + compile/preview for master CV
│   │   ├── AiTailorTab.tsx         # Job description input + AI tailoring trigger
│   │   ├── ResultsTab.tsx          # Tailored CV editor + cover mail + PDF download
│   │   ├── LaTeXEditor.tsx         # Monaco Editor wrapper with mobile fallback
│   │   └── TurnstileWidget.tsx     # Cloudflare Turnstile CAPTCHA component
│   └── ui/
│       ├── badge.tsx               # Badge component (CVA-based)
│       └── dialog.tsx              # Dialog component (Radix UI)
│
├── lib/
│   ├── compile/
│   │   └── compileLatex.ts         # Dual-service LaTeX compilation (ytotech + latexonline)
│   ├── llm/
│   │   ├── types.ts                # LLMProvider interface, error classes
│   │   ├── registry.ts             # Provider registry + fallback chain logic
│   │   ├── openrouter.ts           # OpenRouter adapter
│   │   ├── gemini.ts               # Google Gemini adapter
│   │   ├── openai.ts               # OpenAI adapter
│   │   ├── anthropic.ts            # Anthropic adapter
│   │   └── deepseek.ts             # DeepSeek adapter
│   ├── pdf/
│   │   └── analyzePages.ts         # PDF page/line analysis via unpdf
│   ├── tailor/
│   │   ├── systemPrompt.ts         # The comprehensive AI system prompt
│   │   └── constants.ts            # Page capacity, slack threshold, overflow buffer
│   ├── constants.ts                # Input limits, timeouts, service URLs
│   ├── rate-limit.ts               # Upstash Redis rate limiting
│   ├── turnstile.ts                # Server-side Turnstile verification
│   └── utils.ts                    # Shared utilities (cn helper)
│
├── public/
│   └── data/
│       └── master.tex              # Default master CV template (LaTeX)
│
├── next.config.mjs                 # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS with HSL design token system
├── wrangler.toml                   # Cloudflare Workers deployment config
├── open-next.config.ts             # OpenNext adapter configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20.0.0
- **npm** (comes with Node.js)
- An [Upstash Redis](https://upstash.com) database (for rate limiting)
- A [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) site key & secret
- At least one LLM provider API key (OpenRouter, Gemini, OpenAI, Anthropic, or DeepSeek)

### Installation

```bash
# Clone the repository
git clone https://github.com/tetikmustafa/aitailor.git
cd aitailor

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# ── Upstash Redis (required for rate limiting) ──
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# ── Cloudflare Turnstile (required for bot protection) ──
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
TURNSTILE_SECRET_KEY=your_turnstile_secret_key

# ── LLM Provider Chain ──
# Comma-separated list of providers to try in order (fallback chain)
LLM_PROVIDER_CHAIN=openrouter

# ── OpenRouter ──
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=deepseek/deepseek-v3.2

# ── Google Gemini ──
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash-lite

# ── OpenAI ──
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini

# ── Anthropic ──
ANTHROPIC_API_KEY=your_anthropic_api_key
ANTHROPIC_MODEL=claude-sonnet-4-20250514

# ── DeepSeek ──
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_MODEL=deepseek-chat

# ── Dev Panel (optional) ──
DEV_PANEL_SECRET=your_dev_panel_secret
```

> **Note:** You only need to configure the providers you plan to use. The system automatically skips providers without API keys.

### Development

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment

AiTailor is designed to run on **Cloudflare Workers/Pages** via the [OpenNext](https://opennext.js.org/) adapter.

### Preview (Local Cloudflare Simulation)

```bash
npm run preview
```

This builds the application with the OpenNext adapter and runs it in a local Wrangler preview environment.

### Production Deployment

```bash
npm run deploy
```

This builds and deploys directly to your Cloudflare Workers project.

> **Important:** Production secrets (`GEMINI_API_KEY`, `OPENROUTER_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `TURNSTILE_SECRET_KEY`, etc.) must be configured in the **Cloudflare Dashboard** under your project's settings — they are not committed to `wrangler.toml`.

---

## 🔄 How the Tailoring Pipeline Works

1. **User Input** → The user provides their master LaTeX CV, a job description, and optional custom instructions.

2. **Security Check** → Cloudflare Turnstile token is verified server-side; IP-based rate limiting is enforced via Upstash Redis.

3. **AI Tailoring** → The system prompt instructs the LLM to:
   - Analyze the job description for core focus areas and must-have technologies
   - Select/synthesize the most relevant "About" section
   - Filter experience bullets (keeping all 3 entries, never removing entire blocks)
   - Select exactly 2 most relevant projects
   - Curate the tech stack to match the JD
   - Generate a professional cover email

4. **Compile & Measure** → The tailored LaTeX is compiled to PDF, and `unpdf` extracts the actual page count and line counts per page.

5. **Shrink Loop** (if needed) → If the PDF exceeds one page, the exact overflow (in lines) is sent back to the AI with a precision trimming prompt. Up to 2 shrink attempts are allowed.

6. **Grow-Back Pass** (if applicable) → If the one-page result has ≥ 6 lines of unused space, archived content is restored to maximize page utilization. The grow-back result is compiled and verified — if it pushes back to 2 pages, the pre-grow version is kept.

7. **Stream Results** → Progress updates and final results are streamed to the client via NDJSON.

---

## 🛠️ Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run preview` | Build with OpenNext and preview on local Wrangler |
| `npm run deploy` | Build with OpenNext and deploy to Cloudflare Workers |

---

## 🧰 Tech Stack

| Category | Technologies |
|---|---|
| **Framework** | Next.js 15 (App Router), React 19 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3.4, CSS custom properties (HSL design tokens) |
| **UI Components** | Radix UI (Dialog), Lucide React (icons), CVA (class-variance-authority) |
| **Code Editor** | Monaco Editor (`@monaco-editor/react`) |
| **PDF Processing** | `unpdf` (edge-compatible PDF text extraction) |
| **AI/LLM** | OpenRouter, Google Gemini, OpenAI, Anthropic, DeepSeek (multi-provider abstraction) |
| **Rate Limiting** | Upstash Redis (`@upstash/ratelimit`) |
| **Bot Protection** | Cloudflare Turnstile |
| **LaTeX Compilation** | ytotech LaTeX API, latexonline.cc (dual-service with failover) |
| **Deployment** | Cloudflare Workers/Pages via `@opennextjs/cloudflare`, Wrangler CLI |

---

## 👤 Author

**Mustafa Tetik**

- Portfolio: [mustafatetik.com](https://mustafatetik.com)
- GitHub: [@tetikmustafa](https://github.com/tetikmustafa)
- LinkedIn: [mustafa-tetik](https://linkedin.com/in/mustafa-tetik)

---

## 📄 License

This project is **private** and not licensed for public use or distribution.
