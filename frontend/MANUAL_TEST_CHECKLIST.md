# Manual Test Checklist

Gunakan checklist ini sebelum deploy frontend ke Vercel.

## Public

- Buka halaman `/` dan pastikan CTA menuju chatbot dan admin tampil.
- Buka `/chatbot`, kirim pertanyaan valid, dan pastikan jawaban tampil.
- Pastikan loading "Mencari jawaban dari dokumen resmi..." tampil saat request berjalan.
- Pastikan sumber jawaban tampil jika backend mengembalikan `sources`.
- Klik "Sesi Baru" dan pastikan percakapan reset dengan session ID baru.
- Matikan backend sementara, kirim pertanyaan, dan pastikan error state tampil.

## Admin Auth

- Buka `/admin/dashboard` tanpa login dan pastikan diarahkan ke `/admin/login`.
- Login dengan akun admin valid.
- Login dengan password salah dan pastikan error state tampil.
- Refresh halaman admin dan pastikan session tetap valid jika token belum expired.

## Admin Dashboard

- Buka `/admin/dashboard` dan pastikan ringkasan, status sistem, status dokumen, source type, dan frequent questions tampil.
- Klik Refresh dan pastikan loading state tampil.
- Pastikan empty state tampil saat backend mengembalikan list kosong.

## Documents

- Buka `/admin/documents` dan pastikan tabel dokumen tampil.
- Filter berdasarkan search, source type, dan status.
- Upload dokumen valid.
- Buka detail dokumen, edit metadata, lalu simpan.
- Jalankan ingest untuk dokumen uploaded.
- Jalankan reindex untuk dokumen indexed.
- Jalankan bulk ingest.
- Hapus dokumen dan pastikan data hilang dari list.

## Chat History

- Buka `/admin/chat-history` dan pastikan pagination berfungsi.
- Buka detail chat dan pastikan pertanyaan, jawaban, confidence, dan sumber tampil.
- Hapus chat history.

## Retrieval Test

- Buka `/admin/retrieval-test`.
- Jalankan query dengan top K valid.
- Filter source type dan pastikan hasil berubah sesuai backend.
- Isi top K di luar rentang 1-20 dan pastikan validasi tampil.

## Audit Log

- Buka `/admin/audit-logs`.
- Filter berdasarkan user ID dan action.
- Ubah limit data.
- Klik pagination sebelumnya/berikutnya.
- Pastikan empty state tampil saat filter tidak memiliki hasil.

## Responsive

- Cek viewport mobile 375px, tablet 768px, dan desktop 1440px.
- Pastikan tabel horizontal scroll tanpa memotong tombol aksi.
- Pastikan header, sidebar admin, chat panel, dan form tidak overlap.

## Deploy

- Set Root Directory Vercel ke `frontend`.
- Set `VITE_API_BASE_URL` ke URL backend production.
- Deploy dan buka route langsung `/chatbot`, `/admin/login`, dan `/admin/dashboard`.
- Pastikan route langsung tidak 404 karena rewrite SPA aktif.
