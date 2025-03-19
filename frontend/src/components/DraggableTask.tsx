import { Task } from "../../types/task.tsx";
import { useDraggable } from "@dnd-kit/core";
import { Box, Button, CircularProgress, Paper, SxProps, Theme, Typography } from "@mui/material";
import {FC, useMemo} from "react";

interface Props {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
    loadingTaskId: string | null;
}

const paperStyle: SxProps<Theme> = { padding: 1, marginTop: 1 };
const handleBoxButtonStyle: (isTaskLoading: boolean) => SxProps<Theme> = (isTaskLoading) => ({ display: "flex", gap: 1, flexDirection: "row", justifyContent: isTaskLoading ? "center" : "flex-end"});
const typographyStyle: SxProps<Theme> = { cursor: "grab" };
const circularProgressStyle: SxProps<Theme> = { mt: 1 };

const DraggableTask: FC<Props> = ({ task, onEdit, onDelete, loadingTaskId }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task.id, data: { status: task.status } });
    const isTaskLoading = loadingTaskId === task.id
    const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : {};


    const boxContentFactory = useMemo(() => {
        if (isTaskLoading) return <CircularProgress sx={circularProgressStyle} size={20} />

        return (
            <>
                <Button color="inherit" onClick={() => onEdit(task)} size="small" disableRipple>Edit</Button>
                <Button color="error" onClick={() => onDelete(task.id)} size="small"  disableRipple>Delete</Button>
            </>
        )
    }, [isTaskLoading, onEdit, onDelete]);

    return (
        <Paper ref={setNodeRef} style={style} sx={paperStyle}>
            <Typography {...listeners} {...attributes} sx={typographyStyle}>{task.title}</Typography>
            <Box sx={handleBoxButtonStyle(isTaskLoading)}>{boxContentFactory}</Box>
        </Paper>
    );
};

export default DraggableTask;
