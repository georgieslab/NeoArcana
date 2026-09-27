# 🌌 NeoArcana — Cosmic Tarot Experience

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-blueviolet?style=for-the-badge&logo=render)](https://neoarcana-2.onrender.com/)
[![React](https://img.shields.io/badge/React%2018-Vite-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-3D%20Graphics-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python%203.11-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Anthropic Claude](https://img.shields.io/badge/Claude%203-AWS%20Bedrock-D97706?style=for-the-badge&logo=anthropic)](https://anthropic.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

> **A bridge between the physical and digital cosmos.** NeoArcana merges physical NFC-enabled sacred art with an interactive 3D WebGL cosmos, real-time astronomical ephemeris calculations, and generative AI divination.

---

## 🔮 Live Production Application
👉 **[Experience NeoArcana Live](https://neoarcana-2.onrender.com/)**

---

## ✨ Key Features & Architectural Highlights

### 1. 🪐 Interactive 3D Three.js Galaxy
- Real-time 3D particle universe rendered with **Three.js** and WebGL.
- Features dynamic parallax mouse interaction, depth-based star luminance, smooth orbital drift, and camera zoom transitions.

### 2. 🎴 Physical-to-Digital Bridge (IoT / NFC)
- Integrated NFC poster and card hardware recognition. Tapping an NFC tag or scanning a QR code passes unique authentication tokens, retrieving saved astrological profiles and persisting daily divination cycles.

### 3. 🌙 Real-Time Cosmic Ephemeris Engine
- Powered by `pyephem` and astronomical algorithms to calculate:
  - Exact lunar phases (New Moon, Waxing Crescent, Full Moon, Waning Gibbous, etc.)
  - Planetary day rulers and celestial planetary hours
  - Pythagorean date numerology and seasonal astrological transitions

### 4. 🧠 Multi-Lingual Generative AI Oracles
- Dynamic prompt engineering leveraging **Claude 3 (via AWS Bedrock / Anthropic)**.
- Formulates multi-paragraph readings tailored to the user's focus area (Love, Career, Inner Healing, Spiritual Awakening).
- Multi-lingual synthesis supporting fluent, poetic **English** and **Georgian (ქართული)** translations.
- Built-in resilience with an automated high-tier esoteric dynamic fallback pipeline ensuring 100% uptime.

### 5. 💬 Conversational "Chat with the Universe"
- Floating, interactive chat agent anchored directly to the user's specific drawn cards.
- Allows real-time dialogue and esoteric inquiry using contextual memory and streaming response architecture.

---

## 🏛️ System Architecture

```text
┌────────────────────────────────────────────────────────┐
│                   CLIENT (Browser)                     │
│  React 18 + Vite  •  Three.js 3D Galaxy  •  Tailwind   │
│  Step Flow (Landing ➜ Details ➜ 3D Reveal ➜ Oracle)   │
└───────────────────────────▲────────────────────────────┘
                            │ REST / JSON
┌───────────────────────────▼────────────────────────────┐
│               BACKEND REVERSE PROXY (WSGI)             │
│            Gunicorn / Python 3.11 on Render            │
└───────────────────────────▲────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                    FastAPI Engine                      │
│  - Ephemeris & Astronomical Calculation Engine         │
│  - Three-Card Spread Generation & Numerology           │
│  - Multi-Lingual Prompt Engineering Pipeline           │
└─────────────▲───────────────────────────▲──────────────┘
              │                           │
┌─────────────▼──────────────┐ ┌──────────▼──────────────┐
│  AI Provider (Bedrock / AI) │ │  Firebase / Firestore  │
│  Claude 3 Haiku / Sonnet   │ │  User Cache & Profiles │
└────────────────────────────┘ └─────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Three.js, CSS Glassmorphism, Modern Vanilla CSS3 Animations |
| **Backend** | Python 3.11, FastAPI, Pydantic v2, Gunicorn, Starlette, Uvicorn |
| **Cosmic Engine**| `ephem` (PyEphem), Astronomical Algorithms, Astrological Wheel Utilities |
| **AI / LLM** | AWS Bedrock (Claude 3 Haiku / Sonnet), Anthropic Async API |
| **Database** | Google Cloud Firestore / Firebase Admin SDK |
| **Deployment** | Docker / Render Linux Web Service, Production Build Pipelines |

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18+) & npm
- Python 3.11+
- Virtualenv

### 1. Clone Repository
```bash
git clone https://github.com/georgieslab/NeoArcana.git
cd NeoArcana
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run build     # Compiles production assets into frontend/dist
npm run dev       # Starts Vite dev server with Hot Module Replacement
```

### 3. Backend Setup
```bash
# In the root repository directory
python -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Run Application
```bash
python app.py
```
Open `http://localhost:10000` in your browser.

---

## 📄 License
This project is licensed under the MIT License.
