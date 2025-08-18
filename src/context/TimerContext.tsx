"use client";

import React, {createContext, useContext, useEffect, useState, useRef, useCallback} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Snackbar,
    Alert
} from "@mui/material";

interface TimerContextType {
    timeLeft: number | null;
    startTimer: (seconds: number) => void;
    stopTimer: () => void;
    resetTimer: () => void;
    isWarning: boolean;
    isExtensionDialogOpen: boolean;
    handleExtendTimer: () => void;
    handleDeclineExtension: () => void;
    extensionsUsed: number;
    maxExtensions: number;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [isWarning, setIsWarning] = useState(false);
    const [isExtensionDialogOpen, setIsExtensionDialogOpen] = useState(false);
    const [extensionsUsed, setExtensionsUsed] = useState(0);
    const [hasShownExtensionDialog, setHasShownExtensionDialog] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const extensionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const maxExtensions = 2; // Maximum number of extensions allowed
    const extensionDuration = 2 * 60; // 5 minutes in seconds
    const warningThreshold = 2 * 60; // Show extension dialog at 2 minutes
    const finalWarningThreshold = 30; // Show final warning at 30 seconds

    // Load timer and extensions from localStorage on mount
    useEffect(() => {
        const storedTime = localStorage.getItem("bookingTimer");
        const storedExtensions = localStorage.getItem("timerExtensions");
        const storedExtensionDialog = localStorage.getItem("extensionDialogShown");

        if (storedTime) {
            const parsedTime = parseInt(storedTime, 10);
            if (parsedTime > 0) {
                setTimeLeft(parsedTime);
                startTimerInternal(parsedTime);
            }
        }

        if (storedExtensions) {
            setExtensionsUsed(parseInt(storedExtensions, 10));
        }

        if (storedExtensionDialog) {
            setHasShownExtensionDialog(true);
        }
    }, []);

    const startTimerInternal = useCallback((seconds: number) => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        console.log(seconds);

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev === null || prev <= 1) {
                    clearInterval(timerRef.current!);
                    timerRef.current = null;
                    localStorage.removeItem("bookingTimer");
                    localStorage.removeItem("timerExtensions");
                    localStorage.removeItem("extensionDialogShown");
                    setIsWarning(false);
                    setIsExtensionDialogOpen(false);
                    setHasShownExtensionDialog(false);
                    return 0; // Return 0 instead of null to trigger reset
                }

                const newTime = prev - 1;
                localStorage.setItem("bookingTimer", newTime.toString());

                // Show extension dialog at 2 minutes if user hasn't seen it and has extensions left
                if (newTime === warningThreshold &&
                    !hasShownExtensionDialog &&
                    extensionsUsed < maxExtensions) {
                    setIsExtensionDialogOpen(true);
                    setHasShownExtensionDialog(true);
                    localStorage.setItem("extensionDialogShown", "true");
                }

                // Show final warning at 30 seconds
                setIsWarning(newTime <= finalWarningThreshold);

                return newTime;
            });
        }, 1000);
    }, [extensionsUsed, hasShownExtensionDialog, maxExtensions, warningThreshold, finalWarningThreshold]);

    const startTimer = useCallback((seconds: number) => {
        setTimeLeft(seconds);
        setHasShownExtensionDialog(false);
        localStorage.setItem("bookingTimer", seconds.toString());
        localStorage.removeItem("extensionDialogShown");
        startTimerInternal(seconds);
    }, [startTimerInternal]);

    const stopTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        if (extensionTimeoutRef.current) {
            clearTimeout(extensionTimeoutRef.current);
            extensionTimeoutRef.current = null;
        }
        setTimeLeft(null);
        setIsWarning(false);
        setIsExtensionDialogOpen(false);
        setHasShownExtensionDialog(false);
        localStorage.removeItem("bookingTimer");
        localStorage.removeItem("timerExtensions");
        localStorage.removeItem("extensionDialogShown");
    }, []);

    // const resetTimer = useCallback(() => {
    //     stopTimer();
    //     setExtensionsUsed(0);
    // }, [stopTimer]);

    const resetTimer = useCallback(() => {
        stopTimer();
        setExtensionsUsed(0);
        setHasShownExtensionDialog(false);
        localStorage.removeItem("bookingTimer");
        localStorage.removeItem("timerExtensions");
        localStorage.removeItem("extensionDialogShown");
    }, [stopTimer]);

    const handleExtendTimer = useCallback(() => {
        if (extensionsUsed >= maxExtensions) return;

        setTimeLeft((prev) => {
            if (prev === null) return null;
            const newTime = prev + extensionDuration;
            localStorage.setItem("bookingTimer", newTime.toString());
            return newTime;
        });

        const newExtensionsUsed = extensionsUsed + 1;
        setExtensionsUsed(newExtensionsUsed);
        localStorage.setItem("timerExtensions", newExtensionsUsed.toString());
        setIsExtensionDialogOpen(false);
        setHasShownExtensionDialog(false);
        localStorage.removeItem("extensionDialogShown");
    }, [extensionsUsed, maxExtensions, extensionDuration]);

    const handleDeclineExtension = useCallback(() => {
        setIsExtensionDialogOpen(false);
        // Set a timeout to auto-decline if user doesn't respond within 30 seconds
        extensionTimeoutRef.current = setTimeout(() => {
            setIsExtensionDialogOpen(false);
        }, 30000);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (extensionTimeoutRef.current) {
                clearTimeout(extensionTimeoutRef.current);
            }
        };
    }, []);

    const contextValue: TimerContextType = {
        timeLeft,
        startTimer,
        stopTimer,
        resetTimer,
        isWarning,
        isExtensionDialogOpen,
        handleExtendTimer,
        handleDeclineExtension,
        extensionsUsed,
        maxExtensions
    };

    return (
        <TimerContext.Provider value={contextValue}>
            {children}

            {/* Extension Dialog */}
            <Dialog
                open={isExtensionDialogOpen}
                onClose={() => {
                }} // Prevent closing by clicking outside
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    style: {
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        padding: '8px'
                    }
                }}
            >
                <DialogTitle sx={{
                    textAlign: 'center',
                    color: '#27337C',
                    fontWeight: 'bold',
                    fontSize: '1.5rem'
                }}>
                    ⏰ Time Running Out!
                </DialogTitle>
                <DialogContent>
                    <Box sx={{textAlign: 'center', py: 2}}>
                        <Typography variant="body1" sx={{mb: 2, color: '#333'}}>
                            You have less than 2 minutes left to complete your booking.
                        </Typography>
                        <Typography variant="body1" sx={{mb: 2, color: '#333'}}>
                            Would you like to extend your booking time by 5 minutes?
                        </Typography>
                        <Typography variant="body2" sx={{color: '#666', fontStyle: 'italic'}}>
                            Extensions remaining: {maxExtensions - extensionsUsed}
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{justifyContent: 'center', gap: 2, pb: 3}}>
                    <Button
                        onClick={handleDeclineExtension}
                        variant="outlined"
                        sx={{
                            color: '#666',
                            borderColor: '#666',
                            '&:hover': {
                                borderColor: '#999',
                                backgroundColor: '#f5f5f5'
                            }
                        }}
                    >
                        No, Continue
                    </Button>
                    <Button
                        onClick={handleExtendTimer}
                        variant="contained"
                        sx={{
                            backgroundColor: '#27337C',
                            '&:hover': {
                                backgroundColor: '#1e264f'
                            }
                        }}
                    >
                        Yes, Extend Time
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Warning Snackbar */}
            <Snackbar
                open={isWarning && !isExtensionDialogOpen}
                anchorOrigin={{vertical: "top", horizontal: "center"}}
                sx={{zIndex: 9999}}
            >
                <Alert severity="warning" sx={{fontSize: '1rem'}}>
                    Only {timeLeft} seconds remaining! Complete your booking soon.
                </Alert>
            </Snackbar>
        </TimerContext.Provider>
    );
};

export const useTimer = () => {
    const context = useContext(TimerContext);
    if (!context) {
        throw new Error("useTimer must be used within a TimerProvider");
    }
    return context;
};