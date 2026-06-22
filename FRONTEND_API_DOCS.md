# Dokumentasi API Backend untuk Frontend

Dokumen ini menjelaskan cara frontend berintegrasi dengan Backend Chatbot AI RAG.

## Base URL

Development lokal:

```txt
http://127.0.0.1:8000
```

Swagger:

```txt
http://127.0.0.1:8000/docs
```

Semua endpoint API memakai prefix:

```txt
/api
```

## Format Response

Response sukses:

```json
{
  "success": true,
  "message": "Operasi berhasil",
  "data": {}
}
```

Response error:

```json
{
  "success": false,
  "message": "Operasi gagal",
  "errors": {}
}
```

Response pagination:

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

## Authentication Admin

Endpoint admin wajib memakai JWT Bearer token.

Header:

```txt
Authorization: Bearer <access_token>
```

### Login

```http
POST /api/auth/login
Content-Type: application/json
```

Request:

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "access_token": "jwt_access_token",
    "refresh_token": "jwt_refresh_token",
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

Frontend disarankan menyimpan `access_token` di memory state dan `refresh_token` secara aman sesuai strategi frontend.

### Refresh Token

```http
POST /api/auth/refresh
Content-Type: application/json
```

Request:

```json
{
  "refresh_token": "jwt_refresh_token"
}
```

Response sama seperti login.

### Current Admin

```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

Response:

```json
{
  "success": true,
  "message": "Data user berhasil diambil",
  "data": {
    "id": 1,
    "name": "Admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### Logout

```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

Logout bersifat stateless. Frontend cukup menghapus token di sisi client.

## Public Chatbot

Endpoint ini publik dan tidak membutuhkan token.

### Kirim Pertanyaan

```http
POST /api/chat
Content-Type: application/json
```

Request:

```json
{
  "session_id": "session-123",
  "question": "Apa saja syarat pengajuan layanan informasi publik?"
}
```

`session_id` opsional. Jika kosong, backend akan membuat session baru.

Response:

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

Jika konteks dokumen tidak ditemukan, backend tetap mengembalikan `success: true` dengan jawaban:

```txt
Maaf, informasi tersebut belum tersedia di dokumen resmi yang ada saat ini.
```

## Chat History Admin

Semua endpoint ini membutuhkan token admin.

### List Chat History

```http
GET /api/chat/history?page=1&limit=10
Authorization: Bearer <access_token>
```

Response pagination:

```json
{
  "success": true,
  "message": "Riwayat chat berhasil diambil",
  "data": [
    {
      "id": 1,
      "session_id": "session-123",
      "question": "Apa syarat layanan?",
      "answer": "Syarat layanan adalah ...",
      "confidence_score": 0.91,
      "created_at": "2026-06-19T03:00:00"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "total_pages": 1
  }
}
```

### Detail Chat History

```http
GET /api/chat/history/{chat_history_id}
Authorization: Bearer <access_token>
```

### Delete Chat History

```http
DELETE /api/chat/history/{chat_history_id}
Authorization: Bearer <access_token>
```

## Document Management Admin

Semua endpoint membutuhkan token admin.

### Upload Dokumen

```http
POST /api/admin/documents/upload
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

Form fields:

| Field | Type | Required |
|---|---|---|
| file | File | Yes |
| title | String | Yes |
| source_type | String | Yes |
| description | String | No |

Source type yang valid:

```txt
faq
sop
layanan_instansi
pdf_resmi
website_resmi
dokumen_peraturan
panduan_pelayanan
```

Format file yang didukung:

```txt
pdf, txt, docx, csv, json, html
```

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

### List Dokumen

```http
GET /api/admin/documents?page=1&limit=10&search=faq&source_type=faq&status=uploaded
Authorization: Bearer <access_token>
```

Query parameter:

| Parameter | Type | Required |
|---|---|---|
| page | Number | No |
| limit | Number | No |
| search | String | No |
| source_type | String | No |
| status | String | No |

Status dokumen:

```txt
uploaded
processing
indexed
failed
deleted
```

### Detail Dokumen

```http
GET /api/admin/documents/{document_id}
Authorization: Bearer <access_token>
```

### Update Dokumen

```http
PUT /api/admin/documents/{document_id}
Authorization: Bearer <access_token>
Content-Type: application/json
```

Request:

```json
{
  "title": "Judul baru",
  "source_type": "faq",
  "description": "Deskripsi baru",
  "status": "uploaded"
}
```

Semua field opsional.

### Delete Dokumen

```http
DELETE /api/admin/documents/{document_id}
Authorization: Bearer <access_token>
```

Delete dokumen menggunakan soft delete dengan status `deleted`.

## Ingestion Admin

Semua endpoint membutuhkan token admin.

### Ingest Satu Dokumen

```http
POST /api/admin/ingest/{document_id}
Authorization: Bearer <access_token>
```

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

### Bulk Ingest

```http
POST /api/admin/ingest/bulk
Authorization: Bearer <access_token>
```

Memproses semua dokumen dengan status `uploaded`.

### Reindex Dokumen

```http
POST /api/admin/ingest/reindex/{document_id}
Authorization: Bearer <access_token>
```

Menghapus chunk/vector lama lalu membuat index baru.

## Dashboard Admin

### Summary

```http
GET /api/admin/dashboard/summary
Authorization: Bearer <access_token>
```

Response:

```json
{
  "success": true,
  "message": "Data dashboard berhasil diambil",
  "data": {
    "total_documents": 10,
    "total_indexed_documents": 8,
    "total_failed_documents": 1,
    "total_chat": 20,
    "total_chunks": 120,
    "documents_by_source_type": [
      {
        "source_type": "faq",
        "total": 5
      }
    ],
    "documents_by_status": [
      {
        "status": "indexed",
        "total": 8
      }
    ],
    "frequent_questions": [
      {
        "question": "Apa syarat layanan?",
        "total": 3
      }
    ],
    "system_status": {
      "mysql": "connected",
      "chromadb": "connected",
      "gemini": "available"
    }
  }
}
```

## Retrieval Test Admin

```http
POST /api/admin/retrieval/test
Authorization: Bearer <access_token>
Content-Type: application/json
```

Request:

```json
{
  "query": "Syarat pengajuan layanan informasi publik",
  "top_k": 5,
  "source_type": "faq"
}
```

`source_type` opsional.

Response:

```json
{
  "success": true,
  "message": "Hasil retrieval berhasil diambil",
  "data": {
    "query": "Syarat pengajuan layanan informasi publik",
    "top_k": 5,
    "results": [
      {
        "chunk_id": "doc-1-chunk-0",
        "document_id": 1,
        "content": "Isi chunk dokumen...",
        "score": 0.88,
        "metadata": {
          "title": "FAQ Layanan",
          "source_type": "faq",
          "page": 1
        }
      }
    ]
  }
}
```

## Audit Log Admin

```http
GET /api/admin/audit-logs?page=1&limit=10&user_id=1&action=login
Authorization: Bearer <access_token>
```

Query parameter:

| Parameter | Type | Required |
|---|---|---|
| page | Number | No |
| limit | Number | No |
| user_id | Number | No |
| action | String | No |

## Health Check

```http
GET /api/health
```

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

## HTTP Status yang Perlu Ditangani Frontend

| Status | Makna |
|---|---|
| 200 | Berhasil |
| 400 | Request tidak valid |
| 401 | Token tidak valid atau login gagal |
| 403 | Akses ditolak |
| 404 | Data tidak ditemukan |
| 422 | Validasi input gagal |
| 500 | Error server atau MySQL |
| 502 | Error Gemini atau ChromaDB |

## Rekomendasi Integrasi Frontend

1. Saat admin login, simpan `access_token` dan data user.
2. Untuk semua endpoint admin, kirim header `Authorization`.
3. Jika mendapat status `401`, coba refresh token. Jika refresh gagal, arahkan user ke halaman login.
4. Setelah upload dokumen sukses, tampilkan status `uploaded`.
5. Admin perlu menjalankan ingest agar status dokumen menjadi `indexed`.
6. Chatbot publik dapat dipakai setelah minimal ada dokumen `indexed`.
7. Tampilkan `sources` pada jawaban chatbot jika array tidak kosong.
8. Gunakan `system_status` dari dashboard atau `/api/health` untuk indikator koneksi.
