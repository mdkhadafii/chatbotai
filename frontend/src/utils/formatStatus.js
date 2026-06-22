export function statusTone(status) {
  const toneMap = {
    connected: "success",
    available: "success",
    indexed: "success",
    uploaded: "info",
    processing: "warning",
    failed: "danger",
    disconnected: "danger",
    not_configured: "warning",
  };
  return toneMap[status] || "neutral";
}

export function formatStatus(status) {
  if (!status) return "-";
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
