# Backend Chatbot AI RAG

Backend FastAPI untuk aplikasi chatbot AI berbasis RAG sesuai PRD. Implementasi saat ini mencakup Phase 1 foundation, Phase 2 authentication/admin, Phase 3 ingestion pipeline, Phase 4 chatbot RAG, dan Phase 5 dashboard/monitoring.

## Struktur Folder

```txt
app/
  main.py
  core/
  db/
  models/
  schemas/
  api/
  services/
  utils/
  prompts/
storage/
  uploads/
  processed/
tests/
requirements.txt
.env
.env.example
```

## Cara Menjalankan

1. Pastikan Python 3.11 atau lebih baru sudah terinstall dan tersedia di PATH.

```bash
python --version
```

2. Buat virtual environment.

```bash
python -m venv .venv
```

3. Aktifkan virtual environment.

```bash
.venv\Scripts\activate
```

4. Install dependency.

```bash
pip install -r requirements.txt
```

5. Buat database MySQL di Laragon.

```sql
CREATE DATABASE chatbot_rag_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

6. Sesuaikan konfigurasi di `.env`.

7. Jalankan ChromaDB lokal.

```bash
.\.venv\Scripts\chroma.exe run --host 127.0.0.1 --port 8001 --path storage/chroma --log-path storage/chroma/chroma.log
```

8. Jalankan backend.

```bash
uvicorn app.main:app --reload
```

9. Buka health check.

```txt
http://localhost:8000/api/health
```

Swagger tersedia di:

```txt
http://localhost:8000/docs
```

## Phase 2

Fitur yang sudah tersedia:

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/admin/documents/upload`
- `GET /api/admin/documents`
- `GET /api/admin/documents/{id}`
- `PUT /api/admin/documents/{id}`
- `DELETE /api/admin/documents/{id}`
- `GET /api/admin/audit-logs`

Admin default development dibuat otomatis saat aplikasi start jika belum ada:

```txt
email: admin@example.com
password: password123
```

Ubah nilai `ADMIN_DEFAULT_EMAIL` dan `ADMIN_DEFAULT_PASSWORD` di `.env` untuk development lokal.

## Phase 3

Fitur ingestion yang sudah tersedia:

- `POST /api/admin/ingest/{document_id}`
- `POST /api/admin/ingest/bulk`
- `POST /api/admin/ingest/reindex/{document_id}`

Pipeline ingestion:

1. Membaca file dari `storage/uploads`.
2. Membersihkan teks.
3. Memecah teks menjadi chunk berdasarkan `CHUNK_SIZE` dan `CHUNK_OVERLAP`.
4. Membuat embedding dengan Gemini Embedding.
5. Menyimpan vector dan metadata ke ChromaDB.
6. Menyimpan metadata chunk ke MySQL.
7. Menyimpan teks bersih ke `storage/processed`.
8. Mengubah status dokumen menjadi `indexed` atau `failed`.

Format file yang didukung:

- PDF
- TXT
- DOCX
- CSV
- JSON
- HTML

## Phase 4

Fitur chatbot RAG yang sudah tersedia:

- `POST /api/chat`
- `GET /api/chat/history`
- `GET /api/chat/history/{chat_history_id}`
- `DELETE /api/chat/history/{chat_history_id}`

Alur `POST /api/chat`:

1. Membersihkan pertanyaan user.
2. Membuat query embedding dengan Gemini Embedding.
3. Retrieval chunk relevan dari ChromaDB.
4. Jika skor relevansi di bawah `SIMILARITY_THRESHOLD`, backend menjawab bahwa informasi belum tersedia.
5. Jika konteks ditemukan, backend menyusun prompt RAG.
6. Mengirim prompt ke Gemini LLM.
7. Menyimpan chat history dan sumber dokumen ke MySQL.
8. Mengembalikan jawaban, sumber, dan confidence score.

Contoh request:

```json
{
  "session_id": "session-123",
  "question": "Apa saja syarat pengajuan layanan informasi publik?"
}
```

## Phase 5

Fitur dashboard dan monitoring yang sudah tersedia:

- `GET /api/admin/dashboard/summary`
- `POST /api/admin/retrieval/test`
- `GET /api/health`
- `GET /api/admin/audit-logs`

Dashboard summary mengembalikan:

- Total dokumen.
- Total dokumen indexed.
- Total dokumen failed.
- Total chat.
- Total chunk.
- Dokumen berdasarkan source type.
- Dokumen berdasarkan status.
- Pertanyaan paling sering diajukan.
- Status koneksi MySQL, ChromaDB, dan Gemini.

Contoh request retrieval test:

```json
{
  "query": "Syarat pengajuan layanan informasi publik",
  "top_k": 5,
  "source_type": "faq"
}
```
