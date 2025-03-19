import { Task, TaskStatus } from "../../types/task.tsx";
import { useCallback, useEffect, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask } from "../api/tasks.tsx";
import { DragEndEvent } from "@dnd-kit/core";

const useTasksHelper = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [openTaskModal, setOpenTaskModal] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);

    const fetchTasks = useCallback(async () => {
        try {
            const data = await getTasks();
            setTasks(data);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        }
    }, []);

    const handleDeleteTask = useCallback(async (taskId: string) => {
        setLoadingTaskId(taskId);
        setTasks((prev) => prev.filter((task) => task.id !== taskId));

        try {
            await deleteTask(taskId);
        } catch (error) {
            console.error("Failed to delete task:", error);
            fetchTasks();
        } finally {
            setLoadingTaskId(null);
        }
    }, [fetchTasks]);

    const handleOpenCreateTask = useCallback(() => {
        setNewTaskTitle("");
        setEditingTask(null);
        setOpenTaskModal(true);
    }, [])

    const handleOpenEditTask = (task: Task) => {
        setEditingTask(task);
        setOpenTaskModal(true);
    };

    const handleTaskDrag = useCallback(async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const taskId = active.id as string
        const newStatus = over.id as TaskStatus;

        const currentTask = tasks.find((t) => t.id === taskId);
        if (!currentTask|| currentTask.status === newStatus) return;

        setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))

        try { await updateTask(taskId, { status: newStatus });
        } catch (error) {
            console.error("Failed to update task status", error);
            fetchTasks();
        }
    }, [tasks, fetchTasks]);


    const handleSaveNewTask = useCallback(async () => {
        if (!newTaskTitle.trim()) return;

        const newTask: Task = { id: Math.random().toString(), title: newTaskTitle, status: "to-do" };
        setTasks((prev) => [...prev, newTask]);
        setOpenTaskModal(false);
        setLoadingTaskId(newTask.id);

        try {
            await createTask(newTaskTitle);
            fetchTasks();
        } catch (error) {
            console.error("Failed to create task", error);
            setTasks((prev) => prev.filter((task) => task.id !== newTask.id));
        } finally {
            setLoadingTaskId(null);
        }
    }, [newTaskTitle, fetchTasks]);

    const handleSaveEditedTask = useCallback(async () => {
        if (!editingTask || !editingTask.title.trim()) return;
        setOpenTaskModal(false);

        const currentTask = tasks.find((t) => t.id === editingTask?.id);
        if (!currentTask || currentTask.title === editingTask.title) return;

        setTasks((prev) => prev.map((task) => (task.id === editingTask.id ? { ...task, title: editingTask.title } : task)));
        setLoadingTaskId(editingTask.id);

        try {
            await updateTask(editingTask.id, { title: editingTask.title });
        } catch (error) {
            console.error("Failed to update task title", error);
            fetchTasks();
        } finally {
            setLoadingTaskId(null);
            setEditingTask(null);
        }
    }, [editingTask, fetchTasks]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return {
        tasks,
        openTaskModal,
        setOpenTaskModal,
        newTaskTitle,
        setNewTaskTitle,
        editingTask,
        setEditingTask,
        loadingTaskId,
        handleOpenCreateTask,
        handleOpenEditTask,
        handleDeleteTask,
        handleTaskDrag,
        handleSaveNewTask,
        handleSaveEditedTask,
    };
};

export default useTasksHelper;
