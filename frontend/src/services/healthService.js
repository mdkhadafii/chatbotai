import { apiClient } from "./apiClient.js";

export const healthService = {
  async getHealthStatus() {
    const response = await apiClient.get("/api/health", {
      skipAuth: true,
      skipRefresh: true,
    });
    return response.data;
  },
};
