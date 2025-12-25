# 📊 NotePPT: NotebookLM PDF to AI-Powered PPTX

> **"Turn NotebookLM PDFs into editable PPTX with AI-generated Speaker Notes in seconds."**

NotePPT is a production-ready SaaS application designed to solve the limitations of NotebookLM-generated PDFs. It not only converts non-editable PDF slides into editable PPTX files but also uses state-of-the-art AI (Gemini, GPT-4, Claude, Grok) to write high-quality speaker notes for every slide.

---

## 🔥 Key Features

- **Editable PPTX**: Converts PDF slides into Microsoft PowerPoint format with high fidelity.
- **AI Speaker Notes**: Automatically generates professional narration for each slide using vision-capable AI models.
- **Poppler-Free Engine**: Uses a lightweight PyMuPDF-based processing engine, making deployment on Vercel/Cloud Run seamless.
- **Neo-brutalism UI**: A bold, high-contrast, and modern user interface that stands out.
- **SaaS Architecture**: Ready for multi-user support with Google Login (Firebase Auth).

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14+** (App Router)
- **Tailwind CSS**
- **Framer Motion** (Animations)
- **Lucide React** (Icons)
- **Firebase Auth** (Authentication)

### Backend
- **FastAPI** (Python 3.11+)
- **PyMuPDF (fitz)** (PDF Rendering)
- **python-pptx** (PPTX Creation)
- **AI Models**: Gemini 2.0 Flash, GPT-4o, Claude 3.5 Sonnet, Grok-2.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js & npm
- Python 3.11+
- Firebase Project for Auth

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Make sure to create `.env.local` with your Firebase config.

### 3. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 🌐 Deployment Plan

- **Frontend**: Deploy to **Vercel**.
- **Backend**: Package as a Docker container and deploy to **Google Cloud Run**.
- **Auth/Storage**: Managed by **Firebase**.

---

## 📬 Created by **배움의 달인**
- 📺 **YouTube**: [@배움의달인](https://www.youtube.com/@%EB%B0%B0%EC%9B%80%EC%9D%98%EB%8B%AC%EC%9D%B8-p5v)
- 𝕏 **X (Twitter)**: [@reallygood83](https://x.com/reallygood83)

---

Enjoy your effortless presentation creation! 🚀
