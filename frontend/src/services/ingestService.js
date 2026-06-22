import { apiClient } from "./apiClient.js";

export const ingestService = {
  async ingestDocument(documentId) {
    const response = await apiClient.post(`/api/admin/ingest/${documentId}`);
    return response.data;
  },
  async bulkIngest() {
    const response = await apiClient.post("/api/admin/ingest/bulk");
    return response.data;
  },
  async reindexDocument(documentId) {
    const response = await apiClient.post(`/api/admin/ingest/reindex/${documentId}`);
    return response.data;
  },
};
