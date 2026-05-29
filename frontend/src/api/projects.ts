import { api } from "./client";
import type { Project } from "../types";

export const getProjects = () => api.get<Project[]>("/projects").then((res) => res.data);
export const createProject = (payload: Partial<Project>) => api.post<Project>("/projects", payload).then((res) => res.data);
