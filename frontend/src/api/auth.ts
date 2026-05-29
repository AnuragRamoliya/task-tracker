import { api } from "./client";

export const login = (payload: { email: string; password: string }) =>
  api.post("/auth/login", payload).then((res) => res.data);

export const register = (payload: { name: string; email: string; password: string; organizationName?: string }) =>
  api.post("/auth/register", payload).then((res) => res.data);

export const logout = () => api.post("/auth/logout");
