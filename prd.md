# PRD Backend Aplikasi Chatbot AI Berbasis RAG

## 1. Informasi Dokumen

| Item | Keterangan |
|---|---|
| Nama Dokumen | Product Requirements Document Backend |
| Nama Produk | Chatbot AI RAG Instansi Pemerintah |
| Versi | 1.0 |
| Area Fokus | Backend Service |
| Tech Stack Backend | Python FastAPI, Gemini, Gemini Embedding, ChromaDB, MySQL |
| Target Deployment | Backend API, MySQL lokal Laragon untuk development, ChromaDB Railway untuk vector database |
| Tanggal | 19 Juni 2026 |

---

## 2. Ringkasan Produk

Aplikasi ini adalah sistem chatbot AI berbasis RAG atau Retrieval Augmented Generation yang digunakan untuk membantu masyarakat mendapatkan informasi resmi dari instansi pemerintah. Chatbot akan menjawab pertanyaan pengguna berdasarkan data resmi seperti FAQ, SOP, daftar layanan instansi, PDF resmi, website resmi, dokumen peraturan, dan panduan pelayanan.

Backend bertugas sebagai pusat proses utama aplikasi. Backend akan menerima pertanyaan dari frontend, mencari dokumen yang relevan di ChromaDB, mengirim konteks ke Gemini, lalu mengembalikan jawaban kepada pengguna beserta sumber referensi dokumen.

Backend juga menyediakan API admin untuk mengelola dokumen sumber, melakukan proses ingest data, mengelola metadata dokumen, melihat riwayat chat, dan memantau status knowledge base.

---

## 3. Tujuan Backend

Tujuan utama backend adalah:

1. Menyediakan API chatbot untuk menerima pertanyaan dan mengembalikan jawaban berbasis dokumen resmi.
2. Menghubungkan aplikasi dengan Gemini sebagai LLM.
3. Menghubungkan aplikasi dengan Gemini Embedding untuk mengubah teks menjadi vector embedding.
4. Menghubungkan aplikasi dengan ChromaDB sebagai vector database.
5. Menghubungkan aplikasi dengan MySQL sebagai database relasional.
6. Menyediakan fitur upload, kelola, hapus, dan re-index dokumen.
7. Menyediakan proses ingest data dari PDF, teks, FAQ, SOP, website resmi, dokumen peraturan, dan panduan pelayanan.
8. Menyimpan riwayat percakapan chatbot.
9. Menyediakan API admin untuk kebutuhan dashboard pengelolaan data.
10. Membuat struktur backend yang modular, aman, dan mudah dikembangkan.

---

## 4. Ruang Lingkup Backend

### 4.1 Termasuk dalam Scope

Backend mencakup fitur berikut:

- Authentication admin.
- Manajemen user admin.
- Upload dokumen sumber.
- Manajemen metadata dokumen.
- Penyimpanan dokumen sumber.
- Parsing dokumen.
- Cleaning teks.
- Chunking dokumen.
- Generate embedding menggunakan Gemini Embedding.
- Penyimpanan embedding ke ChromaDB.
- Retrieval dokumen relevan.
- Generate jawaban menggunakan Gemini.
- Penyimpanan chat history ke MySQL.
- API chatbot untuk frontend.
- API admin untuk dashboard.
- API status health check.
- Audit log aktivitas admin.
- Konfigurasi environment.
- Struktur deployment backend.

### 4.2 Tidak Termasuk dalam Scope Awal

Fitur berikut tidak menjadi prioritas pada versi awal:

- Multi-tenant untuk banyak instansi.
- Sistem pembayaran.
- Voice chatbot.
- Fine-tuning model.
- Training model LLM sendiri.
- Real-time websocket chat.
- Integrasi WhatsApp atau Telegram.
- Role kompleks selain admin dan user publik.

---

## 5. Target Pengguna Backend

### 5.1 User Publik

User publik adalah masyarakat umum yang menggunakan chatbot dari frontend. User publik dapat:

- Mengirim pertanyaan.
- Menerima jawaban chatbot.
- Melihat sumber referensi jawaban.
- Melanjutkan percakapan dalam satu sesi.

### 5.2 Admin

Admin adalah pengelola sistem dari pihak instansi. Admin dapat:

- Login ke dashboard admin.
- Upload dokumen sumber.
- Melihat daftar dokumen.
- Mengubah metadata dokumen.
- Menghapus dokumen.
- Melakukan ingest dokumen.
- Melakukan re-index dokumen.
- Melihat riwayat percakapan.
- Melihat statistik dokumen.
- Melihat statistik chatbot.
- Melihat log aktivitas sistem.

---

## 6. Tech Stack Backend

| Komponen | Teknologi |
|---|---|
| Backend Framework | Python FastAPI |
| LLM | Gemini |
| Embedding Model | Gemini Embedding |
| Vector Database | ChromaDB |
| Database Relasional | MySQL |
| Local Database Tool | Laragon |
| ORM | SQLAlchemy |
| Migration Tool | Alembic atau SQL migration manual |
| Validation | Pydantic |
| Authentication | JWT |
| File Storage Local | Folder backend/storage/uploads |
| Deployment ChromaDB | Railway |
| Frontend Deployment | Vercel |
| Dokumentasi API | Swagger bawaan FastAPI |

---

## 7. Jenis Data Knowledge Base

Backend harus mendukung data berikut:

### 7.1 FAQ

FAQ berisi pertanyaan dan jawaban yang sering ditanyakan masyarakat.

Contoh data:

- Pertanyaan tentang layanan.
- Pertanyaan tentang syarat dokumen.
- Pertanyaan tentang jam layanan.
- Pertanyaan tentang alur pengajuan layanan.

### 7.2 SOP

SOP berisi prosedur resmi pelayanan instansi.

Contoh data:

- SOP pengajuan layanan.
- SOP pengaduan masyarakat.
- SOP verifikasi dokumen.
- SOP pelayanan informasi publik.

### 7.3 Daftar Layanan Instansi

Data ini berisi informasi layanan yang disediakan oleh instansi.

Contoh data:

- Nama layanan.
- Deskripsi layanan.
- Syarat layanan.
- Alur layanan.
- Unit penanggung jawab.
- Waktu layanan.
- Kontak layanan.

### 7.4 PDF Resmi

PDF resmi adalah dokumen formal yang diterbitkan oleh instansi atau lembaga pemerintah terkait.

Contoh data:

- Buku panduan.
- Peraturan resmi.
- Dokumen informasi publik.
- Laporan atau pedoman pelayanan.

### 7.5 Website Resmi

Website resmi adalah halaman web instansi yang berisi informasi layanan atau informasi publik.

Contoh data:

- Halaman profil instansi.
- Halaman layanan.
- Halaman berita.
- Halaman informasi publik.

### 7.6 Dokumen Peraturan

Dokumen peraturan berisi aturan hukum atau kebijakan resmi.

Contoh data:

- Peraturan pemerintah.
- Peraturan menteri.
- Peraturan daerah.
- Surat edaran.
- Keputusan kepala dinas.

### 7.7 Panduan Pelayanan

Panduan pelayanan berisi instruksi yang membantu masyarakat memahami cara menggunakan layanan instansi.

Contoh data:

- Panduan pengajuan layanan.
- Panduan pengisian formulir.
- Panduan penggunaan aplikasi layanan.
- Panduan pengaduan.

---

## 8. Prinsip Jawaban Chatbot

Backend harus memastikan jawaban chatbot mengikuti prinsip berikut:

1. Jawaban harus berdasarkan dokumen resmi yang tersedia di knowledge base.
2. Jawaban tidak boleh mengarang jika konteks dokumen tidak ditemukan.
3. Jika informasi tidak ditemukan, chatbot harus menjawab bahwa data belum tersedia.
4. Jawaban harus menggunakan bahasa Indonesia yang sopan, jelas, dan mudah dipahami.
5. Jawaban harus menyertakan sumber dokumen jika tersedia.
6. Jawaban harus ringkas, tetapi tetap informatif.
7. Untuk layanan publik, jawaban harus menyebutkan syarat, alur, waktu, atau unit terkait jika data tersedia.
8. Jika pertanyaan ambigu, chatbot boleh meminta pengguna memperjelas pertanyaan.

---

## 9. Arsitektur Backend

Backend menggunakan arsitektur modular dengan pemisahan tanggung jawab.

Struktur utama:

```txt
backend/
├── app/
│   ├── main.py
│   ├── core/
│   ├── db/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── api/
│   ├── utils/
│   └── prompts/
├── storage/
├── requirements.txt
├── .env.example
└── README.md
```

### 9.1 Layer API

Layer ini menerima request dari frontend dan mengembalikan response.

Contoh:

- chatbot_api.py
- admin_api.py
- auth_api.py
- document_api.py
- ingest_api.py

### 9.2 Layer Service

Layer ini berisi logic utama aplikasi.

Contoh:

- gemini_llm_service.py
- gemini_embedding_service.py
- rag_service.py
- retrieval_service.py
- ingest_service.py
- document_service.py

### 9.3 Layer Database

Layer ini mengatur koneksi database.

Contoh:

- mysql.py
- chroma.py

### 9.4 Layer Model

Layer ini berisi model database MySQL.

Contoh:

- user_model.py
- document_model.py
- chat_history_model.py
- audit_log_model.py

### 9.5 Layer Schema

Layer ini berisi validasi request dan response.

Contoh:

- chat_schema.py
- document_schema.py
- auth_schema.py
- admin_schema.py

### 9.6 Layer Utility

Layer ini berisi helper umum.

Contoh:

- file_reader.py
- text_splitter.py
- validator.py
- logger.py
- response_formatter.py

---

## 10. Alur Kerja RAG

### 10.1 Alur Pertanyaan User

1. User mengirim pertanyaan dari frontend.
2. Backend menerima request melalui endpoint `/api/chat`.
3. Backend membersihkan pertanyaan user.
4. Backend membuat embedding dari pertanyaan menggunakan Gemini Embedding.
5. Backend mencari chunk dokumen relevan di ChromaDB.
6. Backend mengambil top-k dokumen paling relevan.
7. Backend menyusun prompt RAG berisi:
   - pertanyaan user,
   - konteks dokumen,
   - instruksi jawaban,
   - aturan agar tidak mengarang.
8. Backend mengirim prompt ke Gemini.
9. Gemini menghasilkan jawaban.
10. Backend menyimpan pertanyaan, jawaban, dan sumber ke MySQL.
11. Backend mengembalikan jawaban ke frontend.

### 10.2 Alur Ingest Dokumen

1. Admin upload dokumen.
2. Backend menyimpan file ke folder storage.
3. Backend menyimpan metadata dokumen ke MySQL.
4. Backend membaca isi dokumen.
5. Backend membersihkan teks.
6. Backend memecah teks menjadi beberapa chunk.
7. Backend membuat embedding untuk setiap chunk.
8. Backend menyimpan chunk dan embedding ke ChromaDB.
9. Backend memperbarui status dokumen menjadi indexed.
10. Backend mencatat aktivitas ke audit log.

---

## 11. Modul Backend

# 11.1 Modul Authentication

## Deskripsi

Modul ini digunakan untuk login admin dan mengamankan endpoint admin.

## Fitur

- Login admin.
- Generate access token.
- Refresh token.
- Logout.
- Middleware proteksi endpoint admin.

## Endpoint

### POST `/api/auth/login`

Digunakan untuk login admin.

Request:

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

Response sukses:

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "token_type": "Bearer",
    "user": {
      "id": 1,
      "name": "Admin",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

### POST `/api/auth/refresh`

Digunakan untuk memperbarui access token.

### POST `/api/auth/logout`

Digunakan untuk logout admin.

### GET `/api/auth/me`

Digunakan untuk mengambil data admin yang sedang login.

---

# 11.2 Modul Chatbot

## Deskripsi

Modul chatbot digunakan untuk menerima pertanyaan user dan mengembalikan jawaban berbasis RAG.

## Fitur

- Kirim pertanyaan.
- Generate jawaban dari Gemini.
- Retrieval dokumen relevan dari ChromaDB.
- Menyertakan sumber jawaban.
- Menyimpan riwayat chat.
- Mendukung session_id untuk percakapan berkelanjutan.

## Endpoint

### POST `/api/chat`

Request:

```json
{
  "session_id": "session-123",
  "question": "Apa saja syarat pengajuan layanan informasi publik?"
}
```

Response sukses:

```json
{
  "success": true,
  "message": "Jawaban berhasil dibuat",
  "data": {
    "session_id": "session-123",
    "question": "Apa saja syarat pengajuan layanan informasi publik?",
    "answer": "Syarat pengajuan layanan informasi publik adalah ...",
    "sources": [
      {
        "document_id": 10,
        "title": "SOP Layanan Informasi Publik",
        "source_type": "sop",
        "page": 2,
        "score": 0.91
      }
    ],
    "confidence_score": 0.91
  }
}
```

### GET `/api/chat/history`

Digunakan admin untuk melihat riwayat chat.

### GET `/api/chat/history/{id}`

Digunakan admin untuk melihat detail riwayat chat.

### DELETE `/api/chat/history/{id}`

Digunakan admin untuk menghapus riwayat chat tertentu.

---

# 11.3 Modul Document Management

## Deskripsi

Modul ini digunakan admin untuk mengelola dokumen knowledge base.

## Fitur

- Upload dokumen.
- Melihat daftar dokumen.
- Melihat detail dokumen.
- Update metadata dokumen.
- Hapus dokumen.
- Mengubah status dokumen.
- Filter dokumen berdasarkan tipe sumber.
- Search dokumen berdasarkan judul.

## Tipe Dokumen

- faq
- sop
- layanan_instansi
- pdf_resmi
- website_resmi
- dokumen_peraturan
- panduan_pelayanan

## Endpoint

### POST `/api/admin/documents/upload`

Request multipart form-data:

| Field | Tipe | Keterangan |
|---|---|---|
| file | File | File dokumen |
| title | String | Judul dokumen |
| source_type | String | Jenis sumber dokumen |
| description | String | Deskripsi singkat dokumen |

Response:

```json
{
  "success": true,
  "message": "Dokumen berhasil diupload",
  "data": {
    "id": 1,
    "title": "FAQ Layanan Publik",
    "file_name": "faq_layanan.pdf",
    "source_type": "faq",
    "status": "uploaded"
  }
}
```

### GET `/api/admin/documents`

Query parameter:

- `page`
- `limit`
- `search`
- `source_type`
- `status`

### GET `/api/admin/documents/{id}`

Melihat detail dokumen.

### PUT `/api/admin/documents/{id}`

Mengubah metadata dokumen.

### DELETE `/api/admin/documents/{id}`

Menghapus dokumen dari MySQL, file storage, dan ChromaDB.

---

# 11.4 Modul Ingestion

## Deskripsi

Modul ingestion digunakan untuk memproses dokumen menjadi data vector di ChromaDB.

## Fitur

- Ingest satu dokumen.
- Ingest semua dokumen yang belum diproses.
- Re-ingest dokumen.
- Chunking teks.
- Generate embedding.
- Simpan chunk ke ChromaDB.
- Update status dokumen.

## Status Dokumen

| Status | Keterangan |
|---|---|
| uploaded | Dokumen sudah diupload |
| processing | Dokumen sedang diproses |
| indexed | Dokumen sudah masuk ChromaDB |
| failed | Dokumen gagal diproses |
| deleted | Dokumen dihapus |

## Endpoint

### POST `/api/admin/ingest/{document_id}`

Melakukan ingest dokumen tertentu.

### POST `/api/admin/ingest/bulk`

Melakukan ingest semua dokumen yang belum diproses.

### POST `/api/admin/ingest/reindex/{document_id}`

Melakukan indexing ulang dokumen tertentu.

Response:

```json
{
  "success": true,
  "message": "Dokumen berhasil di-index",
  "data": {
    "document_id": 1,
    "total_chunks": 25,
    "status": "indexed"
  }
}
```

---

# 11.5 Modul Retrieval

## Deskripsi

Modul retrieval digunakan untuk mencari chunk dokumen paling relevan berdasarkan pertanyaan user.

## Fitur

- Semantic search ke ChromaDB.
- Top-k retrieval.
- Filter berdasarkan source_type.
- Mengembalikan skor relevansi.
- Mengembalikan metadata dokumen.

## Endpoint Internal

### POST `/api/admin/retrieval/test`

Endpoint ini digunakan admin atau developer untuk menguji hasil retrieval.

Request:

```json
{
  "query": "Syarat pengajuan layanan informasi publik",
  "top_k": 5
}
```

Response:

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "chunk_id": "chunk-001",
        "document_id": 1,
        "content": "Isi potongan dokumen...",
        "score": 0.89,
        "metadata": {
          "title": "SOP Layanan Informasi Publik",
          "source_type": "sop",
          "page": 1
        }
      }
    ]
  }
}
```

---

# 11.6 Modul Gemini LLM Service

## Deskripsi

Modul ini menghubungkan backend dengan Gemini sebagai model AI utama.

## Fitur

- Mengirim prompt ke Gemini.
- Mengatur system instruction.
- Mengatur temperature.
- Mengatur max output token.
- Menangani error dari API Gemini.
- Menangani timeout.
- Menyusun prompt akhir untuk jawaban chatbot.

## Aturan Prompt

Prompt Gemini harus berisi instruksi:

1. Jawab hanya berdasarkan konteks dokumen.
2. Jangan mengarang jawaban.
3. Jika informasi tidak ada dalam konteks, sampaikan bahwa informasi belum tersedia.
4. Gunakan bahasa Indonesia yang sederhana dan sopan.
5. Sertakan rujukan sumber jika tersedia.

---

# 11.7 Modul Gemini Embedding Service

## Deskripsi

Modul ini bertugas membuat embedding dari teks dokumen dan pertanyaan user.

## Fitur

- Generate embedding untuk chunk dokumen.
- Generate embedding untuk query user.
- Batch embedding untuk proses ingest.
- Error handling jika API Gemini gagal.
- Retry sederhana jika request gagal.

---

# 11.8 Modul ChromaDB Service

## Deskripsi

Modul ini menghubungkan backend dengan ChromaDB di Railway.

## Fitur

- Membuat collection.
- Menambahkan document chunk.
- Melakukan query vector.
- Menghapus vector berdasarkan document_id.
- Update metadata vector.
- Health check koneksi ChromaDB.

## Collection Utama

Nama collection:

```txt
instansi_knowledge_base
```

Metadata yang disimpan:

- document_id
- title
- source_type
- page
- chunk_index
- uploaded_at
- file_name

---

# 11.9 Modul MySQL Service

## Deskripsi

Modul ini digunakan untuk menyimpan data relasional aplikasi.

## Data yang Disimpan

- User admin.
- Metadata dokumen.
- Riwayat chat.
- Sumber jawaban.
- Audit log.
- Status ingest dokumen.

---

# 11.10 Modul Website Scraper

## Deskripsi

Modul ini digunakan untuk mengambil konten dari website resmi instansi.

## Fitur

- Input URL website resmi.
- Ambil konten halaman.
- Membersihkan HTML.
- Menyimpan konten sebagai dokumen website.
- Ingest konten website ke ChromaDB.

## Endpoint

### POST `/api/admin/websites/crawl`

Request:

```json
{
  "url": "https://contoh-instansi.go.id/layanan",
  "source_type": "website_resmi"
}
```

Response:

```json
{
  "success": true,
  "message": "Konten website berhasil diproses",
  "data": {
    "document_id": 12,
    "url": "https://contoh-instansi.go.id/layanan",
    "status": "indexed"
  }
}
```

---

# 11.11 Modul Dashboard Admin

## Deskripsi

Modul ini menyediakan data ringkasan untuk frontend admin.

## Fitur

- Total dokumen.
- Total dokumen berdasarkan tipe.
- Total dokumen yang sudah indexed.
- Total dokumen gagal diproses.
- Total chat.
- Pertanyaan paling sering diajukan.
- Status koneksi Gemini.
- Status koneksi ChromaDB.
- Status koneksi MySQL.

## Endpoint

### GET `/api/admin/dashboard/summary`

Response:

```json
{
  "success": true,
  "data": {
    "total_documents": 50,
    "total_indexed_documents": 45,
    "total_failed_documents": 2,
    "total_chat": 120,
    "total_chunks": 1300
  }
}
```

---

# 11.12 Modul Audit Log

## Deskripsi

Audit log digunakan untuk mencatat aktivitas penting admin.

## Aktivitas yang Dicatat

- Login admin.
- Upload dokumen.
- Update dokumen.
- Delete dokumen.
- Ingest dokumen.
- Re-index dokumen.
- Crawl website.
- Hapus riwayat chat.

## Endpoint

### GET `/api/admin/audit-logs`

Query parameter:

- `page`
- `limit`
- `user_id`
- `action`
- `start_date`
- `end_date`

---

# 11.13 Modul Health Check

## Deskripsi

Modul ini digunakan untuk memeriksa status sistem.

## Endpoint

### GET `/api/health`

Response:

```json
{
  "success": true,
  "message": "Backend service is running",
  "data": {
    "mysql": "connected",
    "chromadb": "connected",
    "gemini": "available"
  }
}
```

---

## 12. Database Design MySQL

### 12.1 Table `users`

Menyimpan data admin.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | BIGINT PK | ID user |
| name | VARCHAR(100) | Nama admin |
| email | VARCHAR(150) UNIQUE | Email admin |
| password_hash | VARCHAR(255) | Password yang sudah di-hash |
| role | ENUM | admin |
| is_active | BOOLEAN | Status aktif |
| created_at | DATETIME | Tanggal dibuat |
| updated_at | DATETIME | Tanggal diperbarui |

---

### 12.2 Table `documents`

Menyimpan metadata dokumen.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | BIGINT PK | ID dokumen |
| title | VARCHAR(255) | Judul dokumen |
| description | TEXT | Deskripsi dokumen |
| file_name | VARCHAR(255) | Nama file |
| file_path | VARCHAR(255) | Path file |
| file_type | VARCHAR(50) | pdf, docx, txt, csv, html |
| source_type | VARCHAR(50) | faq, sop, layanan_instansi, pdf_resmi, website_resmi, dokumen_peraturan, panduan_pelayanan |
| source_url | TEXT | URL jika berasal dari website |
| status | VARCHAR(50) | uploaded, processing, indexed, failed, deleted |
| uploaded_by | BIGINT FK | ID admin |
| created_at | DATETIME | Tanggal dibuat |
| updated_at | DATETIME | Tanggal diperbarui |

---

### 12.3 Table `document_chunks`

Menyimpan informasi chunk dokumen di MySQL sebagai metadata tambahan.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | BIGINT PK | ID chunk |
| document_id | BIGINT FK | ID dokumen |
| chunk_id | VARCHAR(255) | ID chunk di ChromaDB |
| chunk_index | INT | Urutan chunk |
| content_preview | TEXT | Potongan teks |
| token_count | INT | Jumlah token perkiraan |
| created_at | DATETIME | Tanggal dibuat |

---

### 12.4 Table `chat_histories`

Menyimpan riwayat percakapan.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | BIGINT PK | ID chat |
| session_id | VARCHAR(255) | ID sesi percakapan |
| question | TEXT | Pertanyaan user |
| answer | TEXT | Jawaban chatbot |
| confidence_score | DECIMAL(5,2) | Skor relevansi |
| created_at | DATETIME | Tanggal dibuat |

---

### 12.5 Table `chat_sources`

Menyimpan sumber dokumen dari jawaban chatbot.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | BIGINT PK | ID sumber |
| chat_history_id | BIGINT FK | ID chat |
| document_id | BIGINT FK | ID dokumen |
| chunk_id | VARCHAR(255) | ID chunk |
| title | VARCHAR(255) | Judul dokumen |
| source_type | VARCHAR(50) | Jenis sumber |
| score | DECIMAL(5,2) | Skor relevansi |
| page | INT NULL | Halaman dokumen jika ada |
| created_at | DATETIME | Tanggal dibuat |

---

### 12.6 Table `audit_logs`

Menyimpan aktivitas admin.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | BIGINT PK | ID log |
| user_id | BIGINT FK | ID admin |
| action | VARCHAR(100) | Nama aktivitas |
| description | TEXT | Deskripsi aktivitas |
| ip_address | VARCHAR(100) | IP address |
| user_agent | TEXT | Browser atau client |
| created_at | DATETIME | Tanggal dibuat |

---

## 13. API Response Standard

Semua response API harus menggunakan format standar.

### 13.1 Response Sukses

```json
{
  "success": true,
  "message": "Operasi berhasil",
  "data": {}
}
```

### 13.2 Response Error

```json
{
  "success": false,
  "message": "Operasi gagal",
  "errors": {}
}
```

### 13.3 Pagination Response

```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "total_pages": 10
  }
}
```

---

## 14. Environment Variable

File `.env.example` backend harus berisi:

```env
APP_NAME=Chatbot RAG Gemini
APP_ENV=development
APP_DEBUG=true
APP_HOST=0.0.0.0
APP_PORT=8000

FRONTEND_URL=http://localhost:5173

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=chatbot_rag_db
MYSQL_USER=root
MYSQL_PASSWORD=

JWT_SECRET_KEY=change_this_secret
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7

GEMINI_API_KEY=your_gemini_api_key
GEMINI_LLM_MODEL=gemini-1.5-flash
GEMINI_EMBEDDING_MODEL=text-embedding-004

CHROMA_HOST=localhost
CHROMA_PORT=8001
CHROMA_COLLECTION_NAME=instansi_knowledge_base

UPLOAD_DIR=storage/uploads
PROCESSED_DIR=storage/processed

CHUNK_SIZE=1000
CHUNK_OVERLAP=200
TOP_K_RETRIEVAL=5
SIMILARITY_THRESHOLD=0.60
```

---

## 15. Security Requirements

Backend harus menerapkan keamanan dasar berikut:

1. Password admin wajib di-hash.
2. Endpoint admin wajib menggunakan JWT authentication.
3. Endpoint publik hanya boleh mengakses API chatbot.
4. Validasi file upload wajib dilakukan.
5. File upload hanya menerima tipe file yang diizinkan.
6. Ukuran file upload harus dibatasi.
7. CORS hanya mengizinkan domain frontend yang valid.
8. API key Gemini tidak boleh disimpan di frontend.
9. Environment variable tidak boleh di-commit ke repository.
10. Error response tidak boleh membocorkan detail sensitif sistem.
11. Input user harus divalidasi untuk menghindari injection.
12. Rate limit disarankan untuk endpoint chatbot.

---

## 16. File Upload Requirements

### 16.1 Format File yang Didukung

- PDF
- TXT
- DOCX
- CSV
- JSON
- HTML hasil scraping website

### 16.2 Batas Ukuran File

Default maksimal:

```txt
10 MB per file
```

### 16.3 Validasi Upload

Backend harus memvalidasi:

- Ekstensi file.
- MIME type.
- Ukuran file.
- Nama file.
- Duplikasi dokumen.
- Source type dokumen.

---

## 17. Chunking Requirements

Dokumen yang sudah dibaca harus dipotong menjadi chunk agar mudah dicari oleh vector database.

Default konfigurasi:

```txt
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
```

Setiap chunk harus memiliki metadata:

- document_id
- chunk_id
- title
- source_type
- file_name
- page
- chunk_index

---

## 18. Retrieval Requirements

Retrieval harus menggunakan semantic search dari ChromaDB.

Default konfigurasi:

```txt
TOP_K_RETRIEVAL=5
SIMILARITY_THRESHOLD=0.60
```

Aturan retrieval:

1. Ambil chunk paling relevan berdasarkan query user.
2. Jika skor relevansi terlalu rendah, chatbot harus memberi jawaban bahwa data belum ditemukan.
3. Retrieval harus mengembalikan metadata sumber.
4. Retrieval harus dapat difilter berdasarkan source_type jika dibutuhkan.

---

## 19. Prompt RAG Requirements

Prompt RAG minimal harus memiliki bagian:

1. System instruction.
2. Pertanyaan user.
3. Konteks dokumen.
4. Aturan jawaban.
5. Format jawaban.

Contoh instruksi utama:

```txt
Kamu adalah asisten chatbot resmi instansi pemerintah.
Jawab pertanyaan user hanya berdasarkan konteks dokumen yang diberikan.
Jika jawaban tidak ditemukan pada konteks, jawab bahwa informasi tersebut belum tersedia di dokumen resmi.
Gunakan bahasa Indonesia yang sopan, jelas, dan mudah dipahami.
Jangan mengarang data, nomor, syarat, jadwal, atau peraturan.
```

---

## 20. Error Handling

Backend harus menangani error berikut:

| Error | Response |
|---|---|
| File tidak valid | 400 Bad Request |
| Dokumen tidak ditemukan | 404 Not Found |
| Token tidak valid | 401 Unauthorized |
| Akses ditolak | 403 Forbidden |
| Validasi input gagal | 422 Unprocessable Entity |
| Gemini API error | 502 Bad Gateway |
| ChromaDB error | 502 Bad Gateway |
| MySQL error | 500 Internal Server Error |

---

## 21. Logging Requirements

Backend harus mencatat log untuk:

- Request API penting.
- Error aplikasi.
- Error Gemini API.
- Error ChromaDB.
- Error MySQL.
- Proses upload dokumen.
- Proses ingest dokumen.
- Aktivitas admin.

Log minimal berisi:

- Timestamp.
- Level log.
- Module.
- Message.
- Error detail jika ada.

---

## 22. Deployment Requirements

### 22.1 Development Local

Untuk development lokal:

- Backend FastAPI berjalan di `localhost:8000`.
- MySQL berjalan melalui Laragon.
- ChromaDB dapat berjalan lokal menggunakan Docker atau diarahkan ke Railway.
- Frontend React berjalan di `localhost:5173`.

### 22.2 Production

Untuk production:

- Frontend deploy di Vercel.
- ChromaDB deploy di Railway.
- Backend dapat deploy di Railway, Render, VPS, atau platform lain yang mendukung Python FastAPI.
- Environment variable wajib diatur pada platform deployment.
- CORS harus diarahkan ke domain frontend Vercel.
- Database MySQL production disarankan menggunakan layanan cloud database.

---

## 23. Struktur Folder Backend yang Direkomendasikan

```txt
backend/
├── app/
│   ├── main.py
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   └── exceptions.py
│   ├── db/
│   │   ├── mysql.py
│   │   └── chroma.py
│   ├── models/
│   │   ├── user_model.py
│   │   ├── document_model.py
│   │   ├── document_chunk_model.py
│   │   ├── chat_history_model.py
│   │   ├── chat_source_model.py
│   │   └── audit_log_model.py
│   ├── schemas/
│   │   ├── auth_schema.py
│   │   ├── chat_schema.py
│   │   ├── document_schema.py
│   │   ├── ingest_schema.py
│   │   └── common_schema.py
│   ├── api/
│   │   ├── auth_api.py
│   │   ├── chatbot_api.py
│   │   ├── admin_api.py
│   │   ├── document_api.py
│   │   ├── ingest_api.py
│   │   └── health_api.py
│   ├── services/
│   │   ├── gemini_llm_service.py
│   │   ├── gemini_embedding_service.py
│   │   ├── rag_service.py
│   │   ├── retrieval_service.py
│   │   ├── ingest_service.py
│   │   ├── document_service.py
│   │   ├── website_scraper_service.py
│   │   └── audit_log_service.py
│   ├── utils/
│   │   ├── file_reader.py
│   │   ├── text_cleaner.py
│   │   ├── text_splitter.py
│   │   ├── validator.py
│   │   ├── logger.py
│   │   └── response.py
│   └── prompts/
│       ├── system_prompt.txt
│       └── rag_prompt.txt
├── storage/
│   ├── uploads/
│   └── processed/
├── tests/
├── requirements.txt
├── .env.example
└── README.md
```

---

## 24. Acceptance Criteria

Backend dianggap selesai untuk versi awal jika memenuhi kriteria berikut:

1. Admin dapat login menggunakan email dan password.
2. Admin dapat upload dokumen.
3. Metadata dokumen tersimpan di MySQL.
4. Dokumen dapat diproses menjadi chunk.
5. Chunk dapat dibuat embedding menggunakan Gemini Embedding.
6. Embedding dan metadata chunk tersimpan di ChromaDB.
7. User dapat mengirim pertanyaan ke endpoint chatbot.
8. Backend dapat melakukan retrieval dokumen relevan dari ChromaDB.
9. Backend dapat mengirim konteks ke Gemini.
10. Backend dapat mengembalikan jawaban chatbot ke frontend.
11. Jawaban chatbot menyertakan sumber dokumen.
12. Chat history tersimpan di MySQL.
13. Admin dapat melihat daftar dokumen.
14. Admin dapat menghapus dokumen.
15. Admin dapat melakukan re-index dokumen.
16. Admin dapat melihat riwayat chat.
17. Health check API tersedia.
18. Error handling berjalan dengan format response standar.
19. File `.env.example` tersedia.
20. Struktur folder backend sudah modular dan siap dikembangkan.

---

## 25. Prioritas Pengembangan

### Phase 1: Backend Foundation

- Setup FastAPI.
- Setup konfigurasi environment.
- Setup MySQL connection.
- Setup ChromaDB connection.
- Setup struktur folder.
- Setup response standard.
- Setup health check.

### Phase 2: Authentication dan Admin

- Login admin.
- JWT authentication.
- Middleware proteksi endpoint.
- CRUD dokumen.
- Audit log dasar.

### Phase 3: Ingestion Pipeline

- Upload file.
- File reader.
- Text cleaner.
- Text splitter.
- Gemini Embedding.
- Insert vector ke ChromaDB.
- Update status dokumen.

### Phase 4: Chatbot RAG

- Chat endpoint.
- Query embedding.
- Retrieval ChromaDB.
- Prompt RAG.
- Generate answer Gemini.
- Save chat history.
- Return source citation.

### Phase 5: Dashboard dan Monitoring

- Statistik dokumen.
- Statistik chat.
- Retrieval test.
- Health status.
- Log error.

---

## 26. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Gemini API gagal | Chatbot tidak bisa menjawab | Buat error handling dan retry |
| ChromaDB tidak aktif | Retrieval gagal | Tambahkan health check |
| Dokumen PDF sulit dibaca | Data tidak lengkap | Gunakan file parser yang sesuai |
| Jawaban chatbot mengarang | Informasi tidak akurat | Gunakan prompt ketat dan similarity threshold |
| File terlalu besar | Ingest lambat | Batasi ukuran file |
| Data tidak resmi masuk sistem | Jawaban tidak valid | Admin wajib mengatur source_type dan validasi dokumen |
| Environment bocor | Risiko keamanan | Gunakan .env dan jangan commit secret |

---

## 27. Definisi Selesai

Sebuah fitur dianggap selesai jika:

1. Endpoint tersedia dan berjalan.
2. Request dan response sesuai schema.
3. Validasi input berjalan.
4. Error handling tersedia.
5. Data tersimpan dengan benar.
6. Fitur sudah diuji manual melalui Swagger atau Postman.
7. Dokumentasi endpoint diperbarui.
8. Tidak ada secret key yang tertulis langsung di source code.

---

## 28. Kesimpulan

Backend Chatbot AI RAG ini dirancang sebagai sistem modular yang bertugas mengelola dokumen resmi, memproses dokumen menjadi vector embedding, melakukan retrieval informasi, dan menghasilkan jawaban chatbot menggunakan Gemini.

Dengan menggunakan FastAPI, MySQL, ChromaDB, Gemini, dan Gemini Embedding, backend ini dapat menjadi fondasi kuat untuk aplikasi chatbot instansi pemerintah yang rapi, mudah dikembangkan, dan siap menuju production.
