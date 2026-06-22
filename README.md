# Chatbot AI RAG

Aplikasi Chatbot berbasis **Retrieval-Augmented Generation (RAG)** untuk Instansi Pemerintah, dibangun dengan FastAPI (backend) + React/Vite (frontend) + Google Gemini sebagai AI engine.

---

## Struktur Proyek

```
chatbotai/
├── backend/             # FastAPI + ChromaDB + MySQL
│   ├── app/             # Source code aplikasi
│   ├── storage/         # Penyimpanan file & vektor
│   ├── tests/           # Unit tests
│   ├── .env.example     # Template konfigurasi backend
│   └── requirements.txt # Dependency Python
│
├── frontend/            # React + Vite + Tailwind CSS
│   ├── src/             # Source code React
│   ├── .env.example     # Template konfigurasi frontend
│   └── package.json     # Dependency Node.js
│
├── FRONTEND_API_DOCS.md # Dokumentasi API untuk frontend
└── README.md            # File ini
```

---

## Cara Menjalankan Aplikasi

> **Urutan penting:** Backend (ChromaDB + FastAPI) harus dijalankan **sebelum** frontend.

### Langkah 1 — Jalankan Backend

Buka terminal, masuk ke folder backend:

```bash
cd backend
```

Buat & aktifkan virtual environment, install dependency, lalu jalankan ChromaDB dan FastAPI. Lihat panduan lengkap di:

📄 **[backend/README.md](backend/README.md)**

**Ringkasan cepat:**
```bash
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1      # Windows PowerShell
pip install -r requirements.txt

# Terminal 1: ChromaDB
chroma run --host 127.0.0.1 --port 8001 --path storage/chroma

# Terminal 2: FastAPI
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend tersedia di `http://localhost:8000` | Swagger: `http://localhost:8000/docs`

---

### Langkah 2 — Jalankan Frontend

Buka terminal baru, masuk ke folder frontend:

```bash
cd frontend
```

Lihat panduan lengkap di:

📄 **[frontend/README.md](frontend/README.md)**

**Ringkasan cepat:**
```bash
cd frontend
npm install
npm run dev
```

Frontend tersedia di `http://localhost:5173`

---

## Tech Stack

| Layer | Teknologi |
|-------|----------|
| Backend Framework | FastAPI (Python) |
| Database Relasional | MySQL |
| Vector Database | ChromaDB |
| AI / LLM | Google Gemini 2.5 Flash |
| Embedding | Gemini Embedding 001 |
| Frontend Framework | React + Vite |
| Styling | Tailwind CSS |
| Deploy Frontend | Vercel |

---

## Dokumentasi Tambahan

- [backend/README.md](backend/README.md) — Panduan setup & menjalankan backend
- [frontend/README.md](frontend/README.md) — Panduan setup & menjalankan frontend
- [FRONTEND_API_DOCS.md](FRONTEND_API_DOCS.md) — Dokumentasi endpoint API
