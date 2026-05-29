import { create } from "zustand";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (accessToken: string, user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem("tracker_user") || "null"),
  accessToken: localStorage.getItem("tracker_access_token"),
  setAuth: (accessToken, user) => {
    localStorage.setItem("tracker_access_token", accessToken);
    localStorage.setItem("tracker_user", JSON.stringify(user));
    set({ accessToken, user });
  },
  clearAuth: () => {
    localStorage.removeItem("tracker_access_token");
    localStorage.removeItem("tracker_user");
    set({ accessToken: null, user: null });
  }
}));
