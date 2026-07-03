<div align="center">

# 🎯 Jobbr AI

### AI-Powered Interview Simulation Platform

Interview-grade feedback to help engineering students prepare for technical interviews — no login required.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/AI-Gemini_1.5_Flash-4285F4?logo=google)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#-license)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)

</div>

---

## 📖 Overview

**Jobbr AI** simulates a real, end-to-end technical interview process — written test, technical round, and HR/behavioral round — and gives candidates detailed, personalized feedback on where they stand and how to improve. It's built for engineering students who want realistic interview practice without scheduling a mock interview with another person.

---

## ✨ Features

### 🧩 Three Interview Rounds

| Round | Description |
|---|---|
| 📝 **Written Test** | Timed assessment covering Aptitude, DSA, and CS fundamentals |
| 💻 **Technical Interview** | AI-led mock interview with adaptive, difficulty-scaling questions |
| 🗣️ **HR / Behavioral Interview** | STAR-method based behavioral evaluation |

### 📊 Comprehensive Feedback

- ✅ Section-wise scoring
- ✅ Detailed explanations of mistakes
- ✅ Weakness heatmap
- ✅ Resume vs. Job Description gap analysis
- ✅ Personalized 7–14 day improvement roadmap

### 🔐 No Login Required

Jump straight in — sessions are handled with temporary local storage, no account needed.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14, React, TypeScript, Tailwind CSS |
| **Backend** | Next.js API Routes |
| **AI** | Google AI Studio — Gemini 1.5 Flash |
| **Storage** | Browser `localStorage` (temporary, session-based) |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Google AI Studio](https://makersuite.google.com/app/apikey) API key

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/tarun-vitb/interview-simulator.git
cd interview-simulator

# 2. Install dependencies
npm install
```

### Environment Setup

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

> Get your free API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

### Run Locally

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser. 🎉

---

## 🧭 Usage

1. **Upload** your resume (PDF or DOC)
2. **Enter** the job description or target role
3. **Select** your experience level
4. **Complete** the three interview rounds, in any order
5. **Review** detailed feedback after each round
6. **Explore** your final comprehensive dashboard

---

## 🔒 Privacy

- Resume and session data are stored **temporarily** in browser `localStorage`
- Data is **automatically cleared** once feedback is generated
- No data is sent anywhere except to the AI provider for processing

---

## ☁️ Deployment

Deploy in one command with [Vercel](https://vercel.com):

```bash
vercel
```

Make sure to add your `GEMINI_API_KEY` as an environment variable in your Vercel project settings.

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

Built with ❤️ to help engineers land their next role.

</div>
