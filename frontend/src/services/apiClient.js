import axios from "axios";

import { AUTH_STORAGE_KEYS } from "../utils/constants.js";
import { getErrorMessage } from "../utils/errorHandler.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

function clearStoredAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken);
  localStorage.removeItem(AUTH_STORAGE_KEYS.refreshToken);
  localStorage.removeItem(AUTH_STORAGE_KEYS.user);
}

function storeAuthSession(session) {
  if (session?.access_token) {
    localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, session.access_token);
  }

  if (session?.refresh_token) {
    localStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, session.refresh_token);
  }

  if (session?.user) {
    localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(session.user));
  }
}

apiClient.interceptors.request.use((config) => {
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  const token = localStorage.getItem(AUTH_STORAGE_KEYS.accessToken);
  if (token && !config.skipAuth) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.skipRefresh
    ) {
      const refreshToken = localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken);

      if (refreshToken) {
        originalRequest._retry = true;

        try {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refresh_token: refreshToken,
          });
          const session = response.data?.data;
          storeAuthSession(session);
          window.dispatchEvent(new Event("auth:session-updated"));
          originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          clearStoredAuthSession();
          window.dispatchEvent(new Event("auth:expired"));
          return Promise.reject({
            status: refreshError.response?.status || 401,
            message: "Sesi login sudah habis. Silakan login kembali.",
            errors: refreshError.response?.data?.errors || {},
          });
        }
      }

      clearStoredAuthSession();
      window.dispatchEvent(new Event("auth:expired"));
    }

    const normalizedError = {
      status: error.response?.status,
      message: getErrorMessage(error),
      errors: error.response?.data?.errors || {},
    };
    return Promise.reject(normalizedError);
  },
);
