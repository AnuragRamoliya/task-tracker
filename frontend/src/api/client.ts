import axios from "axios";
import { useAuthStore } from "../store/authStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = await api.post("/auth/refresh");
      useAuthStore.getState().setAuth(refresh.data.accessToken, refresh.data.user);
      original.headers.Authorization = `Bearer ${refresh.data.accessToken}`;
      return api(original);
    }
    return Promise.reject(error);
  }
);
