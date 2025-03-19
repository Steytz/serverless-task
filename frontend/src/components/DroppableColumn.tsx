import {TaskStatus} from "../../types/task.tsx";
import {useDroppable} from "@dnd-kit/core";
import {Grid2, Paper, SxProps, Theme, Typography} from "@mui/material";
import {FC, PropsWithChildren} from "react";

interface Props {
    status: TaskStatus
}

const handlePaperStyle = (isDraggingOverDifferentColumn: boolean): SxProps<Theme> => ({
    padding: 2,
    opacity: isDraggingOverDifferentColumn ? 0.7 : 1,
    transition: "opacity 0.2s ease-in-out",
})

const DroppableColumn: FC<PropsWithChildren<Props>> = ({status, children}) => {
    const {setNodeRef, isOver, active} = useDroppable({id: status});
    const isDraggingOverDifferentColumn = isOver && active?.data?.current?.status !== status;

    return (
        <Grid2 size={{xs: 12, sm: 4}} ref={setNodeRef}>
            <Paper sx={handlePaperStyle(isDraggingOverDifferentColumn)}>
                <Typography variant="h6">{status.toUpperCase()}</Typography>
                {children}
            </Paper>
        </Grid2>
    );
};

export default DroppableColumn;