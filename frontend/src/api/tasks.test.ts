import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { getTasks, createTask, updateTask, deleteTask } from "../api/tasks";
import { Task } from "../../types/task";

const baseUrl = "https://z0ye3ae28k.execute-api.us-east-1.amazonaws.com/Prod";

describe("Task API", () => {
    let mock: MockAdapter;

    beforeEach(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.restore();
    });

    test("should fetch tasks", async () => {
        const mockTasks: Task[] = [{ id: "1", title: "Test Task", status: "to-do" }];
        mock.onGet(`${baseUrl}/tasks`).reply(200, mockTasks);

        const tasks = await getTasks();
        expect(tasks).toEqual(mockTasks);
    });

    test("should create a task", async () => {
        const newTask: Task = { id: "2", title: "New Task", status: "to-do" };
        mock.onPost(`${baseUrl}/tasks`).reply(201, { task: newTask });

        const result = await createTask("New Task");
        expect(result).toEqual(newTask);
    });

    test("should update a task", async () => {
        mock.onPut(`${baseUrl}/tasks/1`).reply(200);

        await expect(updateTask("1", { title: "Updated Task" })).resolves.toBeUndefined();
    });

    test("should delete a task", async () => {
        mock.onDelete(`${baseUrl}/tasks/1`).reply(200);

        await expect(deleteTask("1")).resolves.toBeUndefined();
    });
});
