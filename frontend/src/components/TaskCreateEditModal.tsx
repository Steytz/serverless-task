import {Box, Button, Modal, SxProps, TextField, Theme, Typography} from "@mui/material";
import {ChangeEvent, FC} from "react";

interface Props {
    open: boolean;
    onClose: () => void;
    title: string;
    taskTitle: string;
    setTaskTitle: (title: string) => void;
    onSave: () => void;
}

const boxStyle: SxProps<Theme> = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2
}

const saveButtonStyle: SxProps<Theme> = {mt: 2}
const cancelButtonStyle: SxProps<Theme> = {mt: 2, ml: 2}

const TaskCreateEditModal: FC<Props> = ({open, onClose, title, taskTitle, setTaskTitle, onSave}) => {
    const onChangeTextField = (e: ChangeEvent<HTMLInputElement>) => {
        setTaskTitle(e.target.value);
    }
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={boxStyle}>
                <Typography color="black" variant="h6">{title}</Typography>
                <TextField fullWidth label="Task Title" value={taskTitle} onChange={onChangeTextField} margin="normal"/>
                <Button variant="contained" onClick={onSave} sx={saveButtonStyle}>Save</Button>
                <Button variant="text" onClick={onClose} sx={cancelButtonStyle}>Cancel</Button>
            </Box>
        </Modal>
    );
}

export default TaskCreateEditModal
