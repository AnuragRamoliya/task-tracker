export type Role = "ADMIN" | "MANAGER" | "MEMBER";
export type Priority = "LOW" | "MEDIUM" | "HIGH";
export type Status = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE" | "BLOCKED";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  organization_id: number;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
}

export interface Task {
  id: number;
  project_id: number;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  assignee_id: number;
  due_date?: string;
  completed_at?: string;
  assignee?: User;
  Project?: Project;
}

export interface Paginated<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}
