# Backend — Chatbot AI RAG

Backend berbasis **FastAPI** + **ChromaDB** + **MySQL** untuk aplikasi Chatbot AI RAG Instansi Pemerintah, menggunakan Google Gemini sebagai LLM dan embedding model.

---

## Struktur Folder

```
backend/
├── app/
│   ├── main.py          # Entry point FastAPI
│   ├── api/             # Route handler (auth, admin, chatbot, dll.)
│   ├── core/            # Config, exceptions, security
│   ├── db/              # Koneksi database & init
│   ├── models/          # SQLAlchemy models
│   ├── schemas/         # Pydantic schemas
│   ├── services/        # Business logic
│   ├── utils/           # Helper utilities
│   └── prompts/         # Template prompt RAG
├── storage/
│   ├── uploads/         # File yang diupload admin
│   ├── processed/       # Teks hasil ekstraksi
│   └── chroma/          # Data vektor ChromaDB
├── tests/               # Unit tests
├── .env                 # Konfigurasi lokal (buat dari .env.example)
├── .env.example         # Template konfigurasi
└── requirements.txt     # Dependency Python
```

---

## Prasyarat

Pastikan semua tools berikut sudah terinstall:

| Tool | Versi Minimum | Cek |
|------|--------------|-----|
| Python | 3.11+ | `python --version` |
| MySQL / Laragon | 8.0+ | pastikan service berjalan |
| Git | — | `git --version` |

---

## Cara Menjalankan (Development)

### 1. Masuk ke folder backend

```bash
cd backend
```

### 2. Buat virtual environment

```bash
python -m venv .venv
```

### 3. Aktifkan virtual environment

**Windows (PowerShell):**
```powershell
.venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```cmd
.venv\Scripts\activate.bat
```

**Linux / macOS:**
```bash
source .venv/bin/activate
```

### 4. Install dependency

```bash
pip install -r requirements.txt
```

### 5. Buat file konfigurasi

```bash
copy .env.example .env
```

Lalu edit `.env` dan sesuaikan nilai berikut:

```env
# Database MySQL
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=db_chatbot
MYSQL_USER=root
MYSQL_PASSWORD=

# Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here
```

### 6. Buat database MySQL

Buka MySQL (via Laragon, phpMyAdmin, atau terminal):

```sql
CREATE DATABASE db_chatbot CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 7. Jalankan ChromaDB

Buka **terminal baru** (tetap aktifkan venv), lalu jalankan ChromaDB:

```bash
python -m chromadb.cli.cli run --host 127.0.0.1 --port 8001 --path storage/chroma
```

ChromaDB akan berjalan di: `http://127.0.0.1:8001`

> Biarkan terminal ChromaDB tetap terbuka.

### 8. Jalankan FastAPI

Buka **terminal lain** (tetap di folder `backend/`, venv aktif):

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

FastAPI akan berjalan di:

| URL | Keterangan |
|-----|-----------|
| `http://localhost:8000/docs` | Swagger UI (dokumentasi API interaktif) |
| `http://localhost:8000/redoc` | ReDoc dokumentasi |
| `http://localhost:8000/api/health` | Health check endpoint |

---

## Akun Admin Default

Saat pertama kali dijalankan, sistem otomatis membuat akun admin:

```
Email    : admin@example.com
Password : password123
```

> Ubah kredensial ini di `.env` sebelum deploy ke production.

---

## Menghentikan Aplikasi

- Tekan `Ctrl+C` di terminal FastAPI untuk menghentikan server.
- Tekan `Ctrl+C` di terminal ChromaDB untuk menghentikan ChromaDB.
- Jalankan `deactivate` untuk keluar dari virtual environment.

---

## Referensi API

Lihat file [`../FRONTEND_API_DOCS.md`](../FRONTEND_API_DOCS.md) untuk dokumentasi lengkap endpoint yang digunakan frontend.

---

## Fitur yang Tersedia

### Autentikasi
- `POST /api/auth/login` — Login admin
- `POST /api/auth/refresh` — Refresh token
- `POST /api/auth/logout` — Logout
- `GET /api/auth/me` — Info user aktif

### Manajemen Dokumen (Admin)
- `POST /api/admin/documents/upload` — Upload dokumen
- `GET /api/admin/documents` — List dokumen
- `GET /api/admin/documents/{id}` — Detail dokumen
- `PUT /api/admin/documents/{id}` — Update metadata
- `DELETE /api/admin/documents/{id}` — Hapus dokumen

### Ingestion Pipeline (Admin)
- `POST /api/admin/ingest/{document_id}` — Ingest satu dokumen ke ChromaDB
- `POST /api/admin/ingest/bulk` — Bulk ingest
- `POST /api/admin/ingest/reindex/{document_id}` — Reindex dokumen

### Chatbot RAG (Publik)
- `POST /api/chat` — Kirim pertanyaan, terima jawaban berbasis RAG
- `GET /api/chat/history` — Riwayat chat
- `GET /api/chat/history/{id}` — Detail riwayat
- `DELETE /api/chat/history/{id}` — Hapus riwayat

### Dashboard & Monitoring (Admin)
- `GET /api/admin/dashboard/summary` — Ringkasan statistik
- `POST /api/admin/retrieval/test` — Test retrieval ChromaDB
- `GET /api/admin/audit-logs` — Audit log aktivitas
- `GET /api/health` — Status kesehatan sistem

---

## Format File yang Didukung untuk Ingestion

- PDF (`.pdf`)
- Word (`.docx`)
- Teks (`.txt`)
- CSV (`.csv`)
- JSON (`.json`)
- HTML (`.html`)
