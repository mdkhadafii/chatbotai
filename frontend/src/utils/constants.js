export const AUTH_STORAGE_KEYS = {
  accessToken: "chatbot_rag_access_token",
  refreshToken: "chatbot_rag_refresh_token",
  user: "chatbot_rag_user",
};

export const CHATBOT_STORAGE_KEYS = {
  sessionId: "chatbot_rag_public_session_id",
};

export const SOURCE_TYPES = [
  { value: "faq", label: "FAQ" },
  { value: "sop", label: "SOP" },
  { value: "layanan_instansi", label: "Layanan Instansi" },
  { value: "pdf_resmi", label: "PDF Resmi" },
  { value: "website_resmi", label: "Website Resmi" },
  { value: "dokumen_peraturan", label: "Dokumen Peraturan" },
  { value: "panduan_pelayanan", label: "Panduan Pelayanan" },
];

export const DOCUMENT_STATUSES = [
  { value: "uploaded", label: "Uploaded" },
  { value: "processing", label: "Processing" },
  { value: "indexed", label: "Indexed" },
  { value: "failed", label: "Failed" },
  { value: "deleted", label: "Deleted" },
];
