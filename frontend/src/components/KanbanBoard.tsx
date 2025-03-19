import {useCallback, useMemo} from "react";
import {Container, Typography, Button, Grid2, SxProps, Theme} from "@mui/material";
import { DndContext } from "@dnd-kit/core";
import useTasksHelper from "./useTasksHelper.ts";
import DroppableColumn from "./DroppableColumn.tsx";
import DraggableTask from "./DraggableTask.tsx";
import TaskCreateEditModal from "./TaskCreateEditModal.tsx";
import {Task, TaskStatus} from "../../types/task.tsx";
import AddIcon from "@mui/icons-material/Add";

const statuses: TaskStatus[] = ["to-do", "in-progress", "completed"];

const boardContainerStyle: SxProps<Theme> = {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
};

const statusGridStyle: SxProps<Theme> = { width: "80%", maxWidth: "800px", justifyContent: "center" };
const addTaskButtonStyle: SxProps<Theme> = { mb: 2 };
const addIconStyle: SxProps<Theme> = { mb: 0.25 };

const KanbanBoard = () => {
    const {
        tasks,
        handleDeleteTask,
        handleOpenEditTask,
        handleOpenCreateTask,
        handleTaskDrag,
        handleSaveNewTask,
        handleSaveEditedTask,
        openTaskModal,
        setOpenTaskModal,
        newTaskTitle,
        setNewTaskTitle,
        editingTask,
        setEditingTask,
        loadingTaskId
    } = useTasksHelper();

    const taskColumnFactory = useMemo(() => {
        return statuses.map((status) => (
            <DroppableColumn key={status} status={status}>
                {tasks
                    .filter((task) => task.status === status)
                    .map((task) => (
                        <DraggableTask loadingTaskId={loadingTaskId} key={task.id} task={task} onEdit={handleOpenEditTask} onDelete={handleDeleteTask} />
                    ))}
            </DroppableColumn>
        ));
    }, [statuses, tasks, handleDeleteTask, handleOpenEditTask]);

    const createEditModalSetterFunction = useCallback((title: Task["title"]) => {
        if (editingTask) return setEditingTask({ ...editingTask, title });
        setNewTaskTitle(title);
    }, [editingTask])

    return (
        <DndContext onDragEnd={handleTaskDrag}>
            <Container maxWidth={false} sx={boardContainerStyle}>
                <Typography variant="h4" gutterBottom>Task Kanban Board (Draggable)</Typography>
                <Button variant="contained" onClick={handleOpenCreateTask} sx={addTaskButtonStyle} startIcon={<AddIcon sx={addIconStyle} />}>Add Task</Button>
                <Grid2 container spacing={2} sx={statusGridStyle}>{taskColumnFactory}</Grid2>
                <TaskCreateEditModal
                    open={openTaskModal}
                    onClose={() => setOpenTaskModal(false)}
                    title={editingTask ? "Edit Task" : "Create Task"}
                    taskTitle={editingTask ? editingTask.title : newTaskTitle}
                    setTaskTitle={createEditModalSetterFunction}
                    onSave={editingTask ? handleSaveEditedTask : handleSaveNewTask}
                />
            </Container>
        </DndContext>
    );
};

export default KanbanBoard;
