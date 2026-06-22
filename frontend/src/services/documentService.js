import { apiClient } from "./apiClient.js";

export const documentService = {
  async getDocuments(params) {
    const response = await apiClient.get("/api/admin/documents", { params });
    return {
      data: response.data,
      pagination: response.pagination,
    };
  },
  async getDocumentById(id) {
    const response = await apiClient.get(`/api/admin/documents/${id}`);
    return response.data;
  },
  async uploadDocument(formData) {
    const response = await apiClient.post("/api/admin/documents/upload", formData);
    return response.data;
  },
  async updateDocument(id, payload) {
    const response = await apiClient.put(`/api/admin/documents/${id}`, payload);
    return response.data;
  },
  async deleteDocument(id) {
    const response = await apiClient.delete(`/api/admin/documents/${id}`);
    return response.data;
  },
};
