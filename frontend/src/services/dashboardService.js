import { apiClient } from "./apiClient.js";

export const dashboardService = {
  async getDashboardSummary() {
    const response = await apiClient.get("/api/admin/dashboard/summary");
    return response.data;
  },
};
