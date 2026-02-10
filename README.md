# 🏙️ AnimeStuffHub

**A high-performance discovery platform for curated anime merchandise.**

AnimeStuffHub solves the "data noise" problem of global marketplaces. By using custom heuristic algorithms and **AI (Google Gemini)**, it transforms messy, keyword-spammed listings into a clean, categorized, and searchable experience for anime fans.

## 🚀 Key Features

* **🧠 AI Curator:** Integration with Google Gemini to analyze user reviews and provide an honest "Verdict" on products.
* **🔍 Smart Filtering:** Custom classification engine that identifies anime series (Naruto, One Piece, etc.) and categories (Figures, Streetwear, Cosplay) from raw marketplace titles.
* **💎 Cyberpunk UI:** A responsive, dark-themed interface built with **Glassmorphism** principles for an authentic "Otaku" feel.
* **⚡ Serverless Architecture:** Optimized for speed using Next.js API routes and high-speed data fetching.

## 🛠️ Tech Stack

* **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
* **AI:** Google Gemini API (Generative AI)
* **Backend:** Next.js Serverless Functions (Node.js)
* **Icons:** Lucide React
* **Deployment:** Vercel

---

## ⚙️ Getting Started

Follow these steps to run the project locally.

### 1. Prerequisites
* Node.js v18+
* An AliExpress Affiliate API Key (for product data)
* A Google Gemini API Key (for AI reviews)

### 2. Installation
```bash
# Clone the repository
git clone [https://github.com/Pathowl/AnimestuffHub2.git](https://github.com/Pathowl/AnimestuffHub2.git)

# Navigate to the directory
cd AnimestuffHub2

# Install dependencies
npm install
```

3. Configuration
Create a .env.local file in the root directory and add your keys:

```
# AliExpress API (Backend)
ALI_APP_KEY=your_key_here
ALI_APP_SECRET=your_secret_here

# Google Gemini API (Frontend)
VITE_GEMINI_API_KEY=your_gemini_key_here
```

4. Run Development Server
Bash
```
npm run dev
```
Open http://localhost:3000 to view the app.
