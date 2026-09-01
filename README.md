# 🦁 FinQuest - NISM Financial Literacy & AI Voice Engine

> **Learn Money by Managing Money** | Powered by Team Aurelius & NISM Curriculum

FinQuest is an interactive financial literacy platform and trading sandbox featuring the Aurelius AI Voice Co-Pilot, NISM certified curriculum, dynamic concept simulators (SIP, Inflation Real Return, Credit Card Traps), and paper trading.

---

## 🌐 Live Website

- **GitHub Pages Live Demo**: [https://rattinoor18.github.io/FinQuest/](https://rattinoor18.github.io/FinQuest/)

---

## 🚀 Key Features

- **NISM Certified Bharat Curriculum**: 5 comprehensive financial modules with interactive quizzes and certificates.
- **Aurelius AI Voice Co-Pilot**: Voice-activated AI copilot providing financial advice and triggering interactive labs in real-time.
- **Paper Trading Exchange**: Live simulated exchange for stocks and index funds with portfolio analytics and health scoring.
- **Interactive Financial Labs**:
  - **50/30/20 Budgeting Lab**
  - **Real Return & Inflation Calculator**
  - **30-Year SIP Compounding Sandbox**
  - **Credit Card Debt Trap Simulator**
  - **Scam & Fraud Radar**

---

## 🛠️ Local Development & Testing

### 1. Frontend (Vite + React + TypeScript + Tailwind CSS)

```bash
cd finquest-app/frontend
npm install
npm run dev
```

Visit `http://localhost:5173`.

### 2. Backend (Python + FastAPI)

```bash
cd finquest-app/backend
pip install -r requirements.txt  # or: pip install fastapi uvicorn pydantic
python main.py
```

FastAPI server runs on `http://127.0.0.1:8000`.

---

## 📦 Production Build & Live Deployment

The project includes an automated GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and publishes the site to GitHub Pages whenever changes are pushed to the `main` branch.

To manually trigger a build locally:

```bash
cd finquest-app/frontend
npm run build
npm run preview
```

---

## 📄 License

MIT License © 2026 Team Aurelius & Ratti Noor Singh.
