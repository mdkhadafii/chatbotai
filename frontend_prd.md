# PRD Frontend Aplikasi Chatbot AI Berbasis RAG

## 1. Informasi Dokumen

| Item | Keterangan |
|---|---|
| Nama Dokumen | Product Requirements Document Frontend |
| Nama Produk | Chatbot AI RAG Instansi Pemerintah |
| Versi | 1.0 |
| Area Fokus | Frontend Web Application |
| Tech Stack | React, Vite, React Router, Axios/Fetch API |
| Backend | FastAPI |
| Deployment | Vercel |
| Target Pengguna | User publik dan Admin Instansi |

---

## 2. Ringkasan Produk

Frontend Chatbot AI RAG adalah aplikasi web yang menjadi antarmuka utama bagi masyarakat dan admin instansi.

Aplikasi memiliki dua area utama:

1. **Chatbot Publik**  
   Digunakan masyarakat untuk bertanya seputar FAQ, SOP, layanan instansi, PDF resmi, website resmi, dokumen peraturan, dan panduan pelayanan.

2. **Dashboard Admin**  
   Digunakan admin untuk login, upload dokumen, mengelola dokumen, menjalankan ingest atau indexing, melihat riwayat chat, menjalankan retrieval test, melihat audit log, dan memantau status sistem.

Frontend berkomunikasi dengan backend menggunakan REST API dengan base URL:

```txt
http://127.0.0.1:8000
```

Semua endpoint API memakai prefix:

```txt
/api
```

---

## 3. Tujuan Frontend

Tujuan frontend adalah:

1. Menyediakan halaman chatbot yang sederhana, responsif, dan mudah digunakan.
2. Menampilkan jawaban chatbot dari backend beserta sumber dokumen.
3. Menyediakan halaman login admin.
4. Menyediakan dashboard admin untuk memantau sistem.
5. Menyediakan fitur manajemen dokumen knowledge base.
6. Menyediakan fitur upload dokumen.
7. Menyediakan fitur ingest, bulk ingest, dan reindex.
8. Menyediakan halaman riwayat chat.
9. Menyediakan halaman retrieval test untuk menguji hasil pencarian ChromaDB.
10. Menyediakan halaman audit log.
11. Menangani JWT token untuk endpoint admin.
12. Menangani loading, error, empty state, dan validasi form.

---

## 4. Ruang Lingkup

### 4.1 Termasuk

Frontend versi awal harus mencakup:

- Halaman chatbot publik.
- Halaman login admin.
- Protected route admin.
- Dashboard admin.
- Manajemen dokumen.
- Upload dokumen.
- Ingest dokumen.
- Bulk ingest dokumen.
- Reindex dokumen.
- Riwayat chat.
- Detail chat.
- Retrieval test.
- Audit log.
- Health check.
- Service API.
- Layout publik.
- Layout admin.
- Komponen UI reusable.
- Environment config.
- Deployment ke Vercel.

### 4.2 Tidak Termasuk Versi Awal

Fitur berikut tidak menjadi prioritas awal:

- WebSocket realtime.
- Multi-role selain admin.
- Login user publik.
- Chatbot voice.
- Integrasi WhatsApp/Telegram.
- Dark mode.
- Multi bahasa.
- Advanced analytics kompleks.

---

## 5. Role Pengguna

## 5.1 User Publik

User publik dapat:

- Membuka halaman chatbot.
- Mengirim pertanyaan.
- Melihat jawaban chatbot.
- Melihat sumber jawaban jika tersedia.
- Melanjutkan percakapan dalam session yang sama.

## 5.2 Admin

Admin dapat:

- Login.
- Logout.
- Melihat dashboard.
- Upload dokumen.
- Melihat daftar dokumen.
- Mengubah metadata dokumen.
- Menghapus dokumen.
- Menjalankan ingest.
- Menjalankan bulk ingest.
- Menjalankan reindex.
- Melihat riwayat chat.
- Menghapus riwayat chat.
- Menjalankan retrieval test.
- Melihat audit log.
- Melihat status koneksi MySQL, ChromaDB, dan Gemini.

---

## 6. Tech Stack Frontend

| Komponen | Teknologi |
|---|---|
| Framework | React |
| Build Tool | Vite |
| Routing | React Router DOM |
| API Client | Axios atau Fetch API |
| Styling | CSS / Tailwind CSS |
| State Management | React Context dan Hooks |
| Deployment | Vercel |
| Authentication | JWT Bearer Token |

---

## 7. Struktur Folder Frontend

```txt
frontend/
├── public/
│   └── favicon.ico
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── EmptyState.jsx
│   │   │
│   │   ├── chatbot/
│   │   │   ├── ChatBox.jsx
│   │   │   ├── ChatInput.jsx
│   │   │   ├── ChatMessage.jsx
│   │   │   └── ChatSourceList.jsx
│   │   │
│   │   └── admin/
│   │       ├── Sidebar.jsx
│   │       ├── Topbar.jsx
│   │       ├── DashboardCard.jsx
│   │       ├── DocumentTable.jsx
│   │       ├── UploadDocumentForm.jsx
│   │       ├── ChatHistoryTable.jsx
│   │       ├── RetrievalTestForm.jsx
│   │       └── AuditLogTable.jsx
│   │
│   ├── layouts/
│   │   ├── PublicLayout.jsx
│   │   └── AdminLayout.jsx
│   │
│   ├── pages/
│   │   ├── public/
│   │   │   ├── HomePage.jsx
│   │   │   └── ChatbotPage.jsx
│   │   │
│   │   └── admin/
│   │       ├── LoginPage.jsx
│   │       ├── DashboardPage.jsx
│   │       ├── DocumentsPage.jsx
│   │       ├── DocumentDetailPage.jsx
│   │       ├── ChatHistoryPage.jsx
│   │       ├── ChatHistoryDetailPage.jsx
│   │       ├── RetrievalTestPage.jsx
│   │       └── AuditLogPage.jsx
│   │
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── services/
│   │   ├── apiClient.js
│   │   ├── authService.js
│   │   ├── chatbotService.js
│   │   ├── documentService.js
│   │   ├── ingestService.js
│   │   ├── dashboardService.js
│   │   ├── retrievalService.js
│   │   ├── auditLogService.js
│   │   └── healthService.js
│   │
│   ├── contexts/
│   │   └── AuthContext.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── usePagination.js
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── formatDate.js
│   │   ├── formatStatus.js
│   │   └── errorHandler.js
│   │
│   ├── styles/
│   │   ├── global.css
│   │   ├── chatbot.css
│   │   └── admin.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env.example
├── package.json
└── README.md
```

---

## 8. Routing

### 8.1 Public Routes

| Route | Halaman | Keterangan |
|---|---|---|
| `/` | HomePage | Halaman utama |
| `/chatbot` | ChatbotPage | Halaman chatbot publik |

### 8.2 Admin Routes

| Route | Halaman | Proteksi |
|---|---|---|
| `/admin/login` | LoginPage | Tidak perlu token |
| `/admin/dashboard` | DashboardPage | Perlu token |
| `/admin/documents` | DocumentsPage | Perlu token |
| `/admin/documents/:id` | DocumentDetailPage | Perlu token |
| `/admin/chat-history` | ChatHistoryPage | Perlu token |
| `/admin/chat-history/:id` | ChatHistoryDetailPage | Perlu token |
| `/admin/retrieval-test` | RetrievalTestPage | Perlu token |
| `/admin/audit-logs` | AuditLogPage | Perlu token |

---

## 9. Environment Variable

File `.env.example` frontend:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_APP_NAME=Chatbot AI RAG
VITE_APP_ENV=development
```

Untuk production di Vercel:

```env
VITE_API_BASE_URL=https://backend-production-url.com
VITE_APP_NAME=Chatbot AI RAG
VITE_APP_ENV=production
```

---

## 10. Standar Response API

Frontend wajib membaca format response berikut.

### 10.1 Response Sukses

```json
{
  "success": true,
  "message": "Operasi berhasil",
  "data": {}
}
```

### 10.2 Response Error

```json
{
  "success": false,
  "message": "Operasi gagal",
  "errors": {}
}
```

### 10.3 Response Pagination

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

## 11. Requirement Halaman Chatbot Publik

### 11.1 Tujuan

Halaman chatbot digunakan masyarakat untuk bertanya mengenai layanan dan informasi resmi instansi.

### 11.2 API

```http
POST /api/chat
```

### 11.3 Request

```json
{
  "session_id": "session-123",
  "question": "Apa saja syarat pengajuan layanan informasi publik?"
}
```

`session_id` bersifat opsional. Jika kosong, backend akan membuat session baru.

### 11.4 Data yang Ditampilkan

Frontend harus menampilkan:

- Pertanyaan user.
- Jawaban chatbot.
- Sumber dokumen.
- Confidence score.
- Loading saat menunggu jawaban.
- Error jika request gagal.

### 11.5 Behavior

1. Saat halaman chatbot dibuka, frontend membuat `session_id` dan menyimpannya di localStorage.
2. User mengetik pertanyaan.
3. Frontend mengirim request ke `/api/chat`.
4. Saat request berjalan, tampilkan loading bubble.
5. Jika sukses, tampilkan jawaban.
6. Jika `sources` tidak kosong, tampilkan daftar sumber.
7. Jika backend menjawab informasi belum tersedia, tampilkan sebagai jawaban normal.
8. Jika error, tampilkan pesan sederhana.

### 11.6 Acceptance Criteria

- User bisa mengirim pertanyaan.
- Jawaban chatbot tampil.
- Sumber jawaban tampil jika tersedia.
- Loading state tersedia.
- Error state tersedia.
- Session percakapan tersimpan.

---

## 12. Requirement Authentication Admin

### 12.1 API

```http
POST /api/auth/login
POST /api/auth/refresh
GET /api/auth/me
POST /api/auth/logout
```

### 12.2 Halaman Login

Form login berisi:

- Email.
- Password.
- Tombol login.
- Alert error.
- Loading saat login.

### 12.3 Token Handling

Frontend harus:

1. Menyimpan `access_token`.
2. Menyimpan `refresh_token`.
3. Mengirim header Authorization pada semua endpoint admin.
4. Melakukan refresh token jika response `401`.
5. Menghapus token saat logout.
6. Redirect ke login jika token tidak valid.

Header:

```txt
Authorization: Bearer <access_token>
```

### 12.4 Acceptance Criteria

- Admin bisa login.
- Admin bisa logout.
- Route admin terlindungi.
- Token dikirim ke endpoint admin.
- Jika token invalid, user diarahkan ke login.

---

## 13. Requirement Dashboard Admin

### 13.1 API

```http
GET /api/admin/dashboard/summary
GET /api/health
```

### 13.2 Data yang Ditampilkan

Dashboard menampilkan:

- Total dokumen.
- Total dokumen indexed.
- Total dokumen failed.
- Total chat.
- Total chunks.
- Dokumen berdasarkan source type.
- Dokumen berdasarkan status.
- Frequent questions.
- Status MySQL.
- Status ChromaDB.
- Status Gemini.

### 13.3 Acceptance Criteria

- Dashboard menampilkan ringkasan data.
- Status sistem tampil dengan badge.
- Loading dan error state tersedia.

---

## 14. Requirement Manajemen Dokumen

### 14.1 API

```http
GET /api/admin/documents
POST /api/admin/documents/upload
GET /api/admin/documents/{document_id}
PUT /api/admin/documents/{document_id}
DELETE /api/admin/documents/{document_id}
```

### 14.2 Halaman Dokumen

Fitur yang wajib tersedia:

- Tabel dokumen.
- Search dokumen.
- Filter source type.
- Filter status.
- Pagination.
- Upload dokumen.
- Detail dokumen.
- Edit metadata.
- Delete dokumen.
- Tombol ingest/reindex sesuai status.

### 14.3 Kolom Tabel

- ID.
- Judul.
- Source type.
- File type.
- Status.
- Total chunks.
- Created at.
- Aksi.

### 14.4 Source Type

Value yang digunakan frontend:

```txt
faq
sop
layanan_instansi
pdf_resmi
website_resmi
dokumen_peraturan
panduan_pelayanan
```

Label tampilan:

| Value | Label |
|---|---|
| faq | FAQ |
| sop | SOP |
| layanan_instansi | Layanan Instansi |
| pdf_resmi | PDF Resmi |
| website_resmi | Website Resmi |
| dokumen_peraturan | Dokumen Peraturan |
| panduan_pelayanan | Panduan Pelayanan |

### 14.5 Status Dokumen

| Status | Label |
|---|---|
| uploaded | Uploaded |
| processing | Processing |
| indexed | Indexed |
| failed | Failed |
| deleted | Deleted |

### 14.6 Upload Dokumen

Form upload berisi:

- File.
- Title.
- Source type.
- Description.

Format file yang didukung:

```txt
pdf, txt, docx, csv, json, html
```

### 14.7 Acceptance Criteria

- Admin bisa upload dokumen.
- Admin bisa melihat daftar dokumen.
- Admin bisa filter dan search dokumen.
- Admin bisa edit metadata.
- Admin bisa delete dokumen.
- Status dokumen tampil jelas.

---

## 15. Requirement Ingestion

### 15.1 API

```http
POST /api/admin/ingest/{document_id}
POST /api/admin/ingest/bulk
POST /api/admin/ingest/reindex/{document_id}
```

### 15.2 Behavior

- Status `uploaded`: tampilkan tombol **Ingest**.
- Status `indexed`: tampilkan tombol **Reindex**.
- Status `processing`: disable tombol aksi.
- Status `failed`: tampilkan tombol **Retry Ingest**.
- Setelah proses berhasil, refresh data dokumen.
- Jika gagal, tampilkan error toast.

### 15.3 Acceptance Criteria

- Admin bisa ingest satu dokumen.
- Admin bisa bulk ingest.
- Admin bisa reindex dokumen.
- UI menampilkan loading saat proses berjalan.

---

## 16. Requirement Chat History Admin

### 16.1 API

```http
GET /api/chat/history?page=1&limit=10
GET /api/chat/history/{chat_history_id}
DELETE /api/chat/history/{chat_history_id}
```

### 16.2 Halaman Chat History

Fitur:

- Tabel chat history.
- Pagination.
- Detail chat.
- Delete chat.
- Tampilkan confidence score.
- Tampilkan created at.

### 16.3 Detail Chat

Detail menampilkan:

- Session ID.
- Pertanyaan.
- Jawaban.
- Confidence score.
- Sumber jawaban.
- Tanggal.

### 16.4 Acceptance Criteria

- Admin bisa melihat riwayat chat.
- Admin bisa melihat detail chat.
- Admin bisa menghapus chat.
- Pagination berjalan.

---

## 17. Requirement Retrieval Test

### 17.1 API

```http
POST /api/admin/retrieval/test
```

### 17.2 Form

Form berisi:

- Query.
- Top K.
- Source type opsional.

### 17.3 Output

Frontend menampilkan:

- Query.
- Top K.
- Chunk result.
- Score.
- Metadata.
- Title dokumen.
- Source type.
- Page jika ada.

### 17.4 Acceptance Criteria

- Admin bisa menjalankan retrieval test.
- Hasil retrieval tampil.
- Empty state tampil jika hasil kosong.

---

## 18. Requirement Audit Log

### 18.1 API

```http
GET /api/admin/audit-logs?page=1&limit=10&user_id=1&action=login
```

### 18.2 Fitur

- Tabel audit log.
- Filter action.
- Filter user ID.
- Pagination.
- Tampilkan IP address.
- Tampilkan user agent.
- Tampilkan tanggal aktivitas.

### 18.3 Acceptance Criteria

- Admin bisa melihat audit log.
- Filter berjalan.
- Pagination berjalan.

---

## 19. Requirement Health Check

### 19.1 API

```http
GET /api/health
```

### 19.2 Data yang Ditampilkan

- Backend status.
- MySQL status.
- ChromaDB status.
- Gemini status.

### 19.3 Acceptance Criteria

- Status service tampil di dashboard.
- Jika service bermasalah, badge warning ditampilkan.

---

## 20. UI/UX Requirements

Frontend harus memiliki desain:

- Bersih.
- Modern.
- Responsif.
- Mudah digunakan.
- Cocok untuk website instansi pemerintah.
- Navigasi jelas.
- Warna tidak terlalu ramai.
- Font mudah dibaca.

Rekomendasi warna:

| Elemen | Warna |
|---|---|
| Primary | Biru instansi |
| Secondary | Hijau/cyan lembut |
| Background | Putih/abu muda |
| Text | Hitam/abu gelap |
| Success | Hijau |
| Warning | Kuning |
| Error | Merah |
| Info | Biru muda |

---

## 21. Error Handling

Frontend harus menangani HTTP status berikut:

| Status | Tindakan |
|---|---|
| 200 | Tampilkan data |
| 400 | Tampilkan request tidak valid |
| 401 | Refresh token atau redirect login |
| 403 | Tampilkan akses ditolak |
| 404 | Tampilkan data tidak ditemukan |
| 422 | Tampilkan error validasi |
| 500 | Tampilkan error server |
| 502 | Tampilkan error Gemini/ChromaDB |

Contoh pesan error:

```txt
Terjadi kesalahan. Silakan coba lagi.
```

```txt
Sesi login sudah habis. Silakan login kembali.
```

---

## 22. Security Requirements

Frontend harus:

1. Tidak menyimpan Gemini API Key.
2. Tidak hardcode token.
3. Menggunakan environment variable untuk API base URL.
4. Mengirim Bearer token hanya untuk endpoint admin.
5. Redirect ke login jika token tidak valid.
6. Menghapus token saat logout.
7. Melakukan validasi form sebelum request.
8. Tidak menampilkan error teknis sensitif ke user umum.

---

## 23. Service API Requirements

### apiClient.js

Berisi:

- Base URL dari `.env`.
- Header default.
- Interceptor request token.
- Interceptor response error.
- Logic refresh token jika digunakan.

### authService.js

Fungsi:

- `login(payload)`
- `refreshToken(payload)`
- `getCurrentUser()`
- `logout()`

### chatbotService.js

Fungsi:

- `sendMessage(payload)`

### documentService.js

Fungsi:

- `getDocuments(params)`
- `getDocumentById(id)`
- `uploadDocument(formData)`
- `updateDocument(id, payload)`
- `deleteDocument(id)`

### ingestService.js

Fungsi:

- `ingestDocument(documentId)`
- `bulkIngest()`
- `reindexDocument(documentId)`

### dashboardService.js

Fungsi:

- `getDashboardSummary()`

### retrievalService.js

Fungsi:

- `testRetrieval(payload)`

### auditLogService.js

Fungsi:

- `getAuditLogs(params)`

### healthService.js

Fungsi:

- `getHealthStatus()`

---

## 24. Prioritas Pengembangan

### Phase 1: Frontend Foundation

- Setup React + Vite.
- Setup routing.
- Setup folder.
- Setup global style.
- Setup layout.
- Setup apiClient.
- Setup komponen UI dasar.

### Phase 2: Public Chatbot

- Buat halaman chatbot.
- Buat chat components.
- Integrasi `/api/chat`.
- Tampilkan sources.
- Simpan session_id.
- Handle loading dan error.

### Phase 3: Admin Authentication

- Buat login page.
- Integrasi login.
- Buat AuthContext.
- Buat ProtectedRoute.
- Integrasi `/api/auth/me`.
- Buat logout.

### Phase 4: Admin Dashboard

- Buat dashboard page.
- Integrasi summary.
- Integrasi health check.
- Tampilkan statistik dan status sistem.

### Phase 5: Document Management

- Buat halaman dokumen.
- Buat upload dokumen.
- Buat detail dokumen.
- Buat edit metadata.
- Buat delete dokumen.
- Tambahkan search, filter, pagination.

### Phase 6: Ingestion

- Buat ingest.
- Buat bulk ingest.
- Buat reindex.
- Refresh status dokumen.

### Phase 7: Chat History

- Buat list chat history.
- Buat detail chat.
- Buat delete chat.

### Phase 8: Retrieval Test dan Audit Log

- Buat retrieval test page.
- Buat audit log page.
- Tambahkan filter dan pagination.

### Phase 9: Finalization

- Rapikan responsive design.
- Rapikan loading, error, dan empty state.
- Testing manual.
- Deploy ke Vercel.

---

## 25. Acceptance Criteria Utama

Frontend dianggap selesai jika:

1. User publik bisa membuka halaman chatbot.
2. User publik bisa mengirim pertanyaan.
3. Jawaban chatbot tampil.
4. Sumber jawaban tampil jika tersedia.
5. Admin bisa login.
6. Admin route terlindungi.
7. Admin bisa melihat dashboard.
8. Admin bisa upload dokumen.
9. Admin bisa melihat daftar dokumen.
10. Admin bisa edit dokumen.
11. Admin bisa delete dokumen.
12. Admin bisa ingest dokumen.
13. Admin bisa bulk ingest.
14. Admin bisa reindex.
15. Admin bisa melihat chat history.
16. Admin bisa menjalankan retrieval test.
17. Admin bisa melihat audit log.
18. Loading state tersedia.
19. Error state tersedia.
20. Empty state tersedia.
21. Frontend bisa dideploy ke Vercel.

---

## 26. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Backend belum aktif | Data tidak muncul | Tampilkan error dan cek `/api/health` |
| Token expired | Admin keluar | Refresh token atau redirect login |
| Upload gagal | Dokumen tidak masuk | Validasi file dan tampilkan error |
| Ingest lama | User bingung | Tampilkan loading dan status processing |
| Response chatbot lambat | User menunggu | Tampilkan typing indicator |
| API berubah | Frontend error | Gunakan service layer |
| CORS error | Gagal akses backend | Pastikan backend mengizinkan domain Vercel |

---

## 27. Definisi Selesai

Fitur frontend dianggap selesai jika:

1. UI sudah dibuat.
2. API sudah terhubung.
3. Loading state tersedia.
4. Error handling tersedia.
5. Empty state tersedia.
6. Validasi form tersedia.
7. Responsive untuk desktop dan mobile.
8. Tidak ada token atau secret hardcoded.
9. Sudah diuji manual.
10. Struktur kode rapi dan modular.

---

## 28. Kesimpulan

Frontend Chatbot AI RAG dibangun sebagai aplikasi React yang memiliki dua bagian utama, yaitu chatbot publik dan dashboard admin. Frontend harus mampu berkomunikasi dengan backend FastAPI, menampilkan jawaban chatbot berbasis dokumen resmi, serta menyediakan fitur admin untuk mengelola knowledge base.

Dengan routing yang jelas, service API modular, protected route, dan deployment ke Vercel, frontend ini siap dikembangkan secara bertahap menuju production.
