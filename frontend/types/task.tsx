export type TaskStatus = "to-do" | "in-progress" | "completed";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
}