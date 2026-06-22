import { apiClient } from "./apiClient.js";

export const authService = {
  async login(payload) {
    const response = await apiClient.post("/api/auth/login", payload, {
      skipAuth: true,
      skipRefresh: true,
    });
    return response.data;
  },
  async refreshToken(payload) {
    const response = await apiClient.post("/api/auth/refresh", payload, {
      skipAuth: true,
      skipRefresh: true,
    });
    return response.data;
  },
  async getCurrentUser() {
    const response = await apiClient.get("/api/auth/me");
    return response.data;
  },
  async logout() {
    const response = await apiClient.post("/api/auth/logout");
    return response.data;
  },
};
