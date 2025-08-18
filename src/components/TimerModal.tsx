import React from "react";
import {Modal, Box, Typography, Button} from "@mui/material";

interface TimerModalProps {
    open: boolean;
    onExtend: () => void;
    onContinue: () => void;
}

const TimerModal: React.FC<TimerModalProps> = ({open, onExtend, onContinue}) => {
    return (
        <Modal
            open={open}
            onClose={onContinue}
            aria-labelledby="timer-modal-title"
            aria-describedby="timer-modal-description"
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: {xs: "90%", sm: 400},
                    bgcolor: "white",
                    borderRadius: "8px",
                    boxShadow: 24,
                    p: 4,
                    textAlign: "center",
                }}
            >
                <Typography
                    id="timer-modal-title"
                    variant="h6"
                    component="h2"
                    sx={{color: "#27337C", mb: 2}}
                >
                    Time Almost Up!
                </Typography>
                <Typography id="timer-modal-description" sx={{mb: 3, color: "#27337C"}}>
                    You have 2 minutes left to complete your seat selection. Would you like to
                    extend your time by 5 minutes?
                </Typography>
                <Box sx={{display: "flex", justifyContent: "center", gap: 2}}>
                    <Button
                        onClick={onContinue}
                        variant="outlined"
                        sx={{
                            color: "#27337C",
                            borderColor: "#27337C",
                            "&:hover": {bgcolor: "blue.50"},
                        }}
                    >
                        Continue
                    </Button>
                    <Button
                        onClick={onExtend}
                        variant="contained"
                        sx={{
                            bgcolor: "#27337C",
                            "&:hover": {bgcolor: "#1e264f"},
                            color: "white",
                        }}
                    >
                        Extend 5 Minutes
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default TimerModal;