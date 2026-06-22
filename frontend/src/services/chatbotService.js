import { apiClient } from "./apiClient.js";

export const chatbotService = {
  async sendMessage(payload) {
    const response = await apiClient.post("/api/chat", payload, {
      skipAuth: true,
      skipRefresh: true,
    });
    return response.data;
  },
  async getChatHistory(params) {
    const response = await apiClient.get("/api/chat/history", { params });
    return {
      data: response.data,
      pagination: response.pagination,
    };
  },
  async getChatHistoryById(id) {
    const response = await apiClient.get(`/api/chat/history/${id}`);
    return response.data;
  },
  async deleteChatHistory(id) {
    const response = await apiClient.delete(`/api/chat/history/${id}`);
    return response.data;
  },
};
