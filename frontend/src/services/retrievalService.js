import { apiClient } from "./apiClient.js";

export const retrievalService = {
  async testRetrieval(payload) {
    const response = await apiClient.post("/api/admin/retrieval/test", payload);
    return response.data;
  },
};
