import { apiClient } from "./apiClient.js";

export const auditLogService = {
  async getAuditLogs(params) {
    const response = await apiClient.get("/api/admin/audit-logs", { params });
    return {
      data: response.data,
      pagination: response.pagination,
    };
  },
};
