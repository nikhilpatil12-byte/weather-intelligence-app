# Weather Intelligence App 🌤️

An AI-driven weather dashboard built using React, Vite, and Tailwind CSS. The application provides real-time atmospheric data, 5-day weather outlooks, and AI-generated environmental intelligence insights.

---

## 🚀 Live Demo
* **Live Web App:** [https://weather-intelligence-app-8ia.pages.dev](https://weather-intelligence-app-8ia.pages.dev)
* **GitHub Repository:** [https://github.com/nikhilpatil12-byte/weather-intelligence-app](https://github.com/nikhilpatil12-byte/weather-intelligence-app)

---

## 🛠️ Deployment Workflow (Google AI Studio $\rightarrow$ GitHub $\rightarrow$ Cloudflare Pages)

### Phase 1: Application Generation (Google AI Studio)
1. Designed and iterated on the application prompt within **Google AI Studio**.
2. Generated a full-stack React + Vite web application featuring responsive weather cards, dynamic search, and AI insights.
3. Exported the project source files ensuring standard React project layout (`src/`, `package.json`, `index.html`, `vite.config.ts`).

---

### Phase 2: Code Versioning (GitHub)
1. Created a public repository on GitHub: `nikhilpatil12-byte/weather-intelligence-app`.
2. Committed the codebase directly to the root level of the `main` branch to prepare for CI/CD integration.

---

### Phase 3: Live Hosting (Cloudflare Pages)
1. Linked the GitHub account to **Cloudflare Pages**.
2. Created a new Pages project targeting `nikhilpatil12-byte/weather-intelligence-app` on the `main` branch.
3. Configured production build parameters:
   * **Framework preset:** `None` / `Vite`
   * **Build command:** `npm run build`
   * **Build output directory:** `dist`
4. Triggered deployment pipeline for automatic continuous integration on every commit.

---

## ⚙️ Local Development Setup

To run this project locally on your machine:

```bash
# 1. Clone repository
git clone [https://github.com/nikhilpatil12-byte/weather-intelligence-app.git](https://github.com/nikhilpatil12-byte/weather-intelligence-app.git)

# 2. Navigate to project directory
cd weather-intelligence-app

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
