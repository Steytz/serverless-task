import axios from "axios";
import { Task, TaskStatus } from "../../types/task";

const API_BASE_URL = "https://z0ye3ae28k.execute-api.us-east-1.amazonaws.com/Prod";

export const getTasks = async (): Promise<Task[]> => {
  const response = await axios.get(`${API_BASE_URL}/tasks`);
  return response.data;
};

export const createTask = async (title: string): Promise<Task> => {
  const response = await axios.post(`${API_BASE_URL}/tasks`, { title });
  return response.data.task;
};

export const updateTask = async (id: string, task: {status?: TaskStatus, title?: string} ): Promise<void> => {
  await axios.put(`${API_BASE_URL}/tasks/${id}`, task);
};

export const deleteTask = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/tasks/${id}`);
};