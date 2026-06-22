export function getErrorMessage(error) {
  const message = error.response?.data?.message || error.message;

  if (error.response?.status === 401) {
    return "Sesi login sudah habis. Silakan login kembali.";
  }

  if (message) {
    return message;
  }

  return "Terjadi kesalahan. Silakan coba lagi.";
}
