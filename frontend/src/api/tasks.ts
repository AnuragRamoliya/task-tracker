import { api } from "./client";
import type { Paginated, Status, Task } from "../types";

export interface TaskFilters {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  assignee?: string;
}

export const getTasks = (filters: TaskFilters) =>
  api.get<Paginated<Task>>("/tasks", { params: filters }).then((res) => res.data);

export const getTask = (id: string) => api.get<Task>(`/tasks/${id}`).then((res) => res.data);
export const createTask = (payload: Record<string, unknown>) => api.post<Task>("/tasks", payload).then((res) => res.data);
export const updateTask = (id: number, payload: Partial<Task>) => api.patch<Task>(`/tasks/${id}`, payload).then((res) => res.data);
export const updateTaskStatus = (id: number, status: Status) =>
  api.patch<Task>(`/tasks/${id}/status`, { status }).then((res) => res.data);
export const deleteTask = (id: number) => api.delete(`/tasks/${id}`);
