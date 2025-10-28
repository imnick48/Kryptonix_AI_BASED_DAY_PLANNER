# 🧠 Kryptonix AI-Based Day Planner

Kryptonix is an AI-powered day planner that lets users describe their daily activities in plain language, and automatically turns them into a structured meeting schedule.  
It uses the **OpenRouter AI API** to understand natural language and generate meeting data with proper titles, dates, and times.  
Users can also manually add or edit meetings — combining smart automation with full control.

---

## 🚀 Features

- ✨ **AI-Powered Scheduling:** Describe your day in natural language — the AI builds your full-day plan.
- 📝 **Manual Input:** Add, edit, or delete meetings manually.
- 🧩 **Smart Integration:** Backend connects securely to OpenRouter API.
- 💾 **Persistent Storage:** All meetings are stored in a database for future access.
- 🖥️ **Clean UI:** Simple and responsive frontend built with React + Vite.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React (Vite) |
| **Backend** | Node.js + Express |
| **AI API** | OpenRouter (DeepSeek Chat) |
| **Database** | SQLite |
| **Environment** | dotenv for secure key management |

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/imnick48/Kryptonix_AI_BASED_DAY_PLANNER.git
cd Kryptonix_AI_BASED_DAY_PLANNER
```
## Backend Setup
cd backend
npm install
Change the api key in .env.
OPENROUTER_API_KEY=your_openrouter_api_key
## Run the backend:

node server.js

3. Frontend Setup
npm install
npm run dev

Then open http://localhost:5173 in your browser.
