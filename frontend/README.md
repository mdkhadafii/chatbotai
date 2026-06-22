# Frontend — Chatbot AI RAG

Antarmuka pengguna berbasis **React + Vite + Tailwind CSS** untuk aplikasi Chatbot AI RAG Instansi Pemerintah.

---

## Struktur Folder

```
frontend/
├── src/
│   ├── components/      # Komponen UI reusable
│   ├── pages/           # Halaman aplikasi
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API client & fetcher
│   ├── store/           # State management
│   └── utils/           # Helper utilities
├── public/              # Aset statis
├── .env                 # Konfigurasi lokal (buat dari .env.example)
├── .env.example         # Template konfigurasi
├── index.html           # HTML entry point
├── package.json         # Dependency Node.js
└── vite.config.js       # Konfigurasi Vite
```

---

## Prasyarat

| Tool | Versi Minimum | Cek |
|------|--------------|-----|
| Node.js | 18+ | `node --version` |
| npm | 9+ | `npm --version` |

> Pastikan **backend sudah berjalan** di `http://localhost:8000` sebelum membuka frontend.

---

## Cara Menjalankan (Development)

### 1. Masuk ke folder frontend

```bash
cd frontend
```

### 2. Install dependency

```bash
npm install
```

### 3. Buat file konfigurasi

```bash
copy .env.example .env
```

Isi file `.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_APP_NAME=Chatbot AI RAG
VITE_APP_ENV=development
```

### 4. Jalankan development server

```bash
npm run dev
```

Frontend akan berjalan di:

| URL | Keterangan |
|-----|-----------|
| `http://localhost:5173` | Halaman publik chatbot |
| `http://localhost:5173/admin` | Halaman login admin |
| `http://localhost:5173/admin/dashboard` | Dashboard admin (perlu login) |

---

## Akun Admin untuk Login

```
Email    : admin@example.com
Password : password123
```

*(Dikonfigurasi di `.env` backend)*

---

## Build untuk Production

```bash
npm run build
```

Output build ada di folder `dist/`.

---

## Deploy ke Vercel

1. Set **Root Directory** Vercel ke `frontend`
2. Set environment variable production:

```env
VITE_API_BASE_URL=https://url-backend-production-kamu.com
VITE_APP_NAME=Chatbot AI RAG
VITE_APP_ENV=production
```

File `vercel.json` sudah dikonfigurasi untuk:
- Build command otomatis
- Output directory ke `dist/`
- Rewrite SPA agar semua route (misal `/admin/dashboard`) tetap membuka aplikasi React

---

## Fitur Utama

- **Chatbot Publik** — Tanya jawab berbasis RAG dengan tampilan sumber dokumen
- **Login Admin** — Protected route dengan JWT token refresh otomatis
- **Dashboard Admin** — Statistik dokumen, chat, health check, dan status sistem
- **Manajemen Dokumen** — Upload, list, filter, edit metadata, delete, ingest, bulk ingest, reindex
- **Riwayat Chat** — List, detail, dan hapus riwayat percakapan
- **Retrieval Test** — Uji pencarian ChromaDB langsung dari dashboard
- **Audit Log** — Log aktivitas admin dengan filter dan pagination
- **Dark Mode** — Tema gelap & terang dengan layout responsif
