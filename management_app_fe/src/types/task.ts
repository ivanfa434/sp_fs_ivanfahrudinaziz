import type { User } from "./user";
import type { Project } from "./project";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  projectId: string;
  assigneeId?: string;
  createdAt: Date;
  updatedAt: Date;
  project?: Project;
  assignee?: User;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  projectId: string;
  assigneeId?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: "TODO" | "IN_PROGRESS" | "DONE";
  assigneeId?: string;
}

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export type TaskStatusType = keyof typeof TaskStatus;
