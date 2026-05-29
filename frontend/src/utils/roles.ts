import type { Role } from "../types";

export const canManage = (role?: Role) => role === "ADMIN" || role === "MANAGER";
export const isAdmin = (role?: Role) => role === "ADMIN";
