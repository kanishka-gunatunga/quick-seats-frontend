"use client";

import React, {useEffect, useState, useCallback, useMemo, memo, Suspense} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useRouter, useSearchParams} from "next/navigation";
import {
    Alert,
    Paper,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableBody,
    Typography,
    Box,
    CircularProgress,
    Tooltip,
    Fab,
    Snackbar
} from "@mui/material";
import {useQueryClient} from "@tanstack/react-query";
import HeroSection from "@/components/HeroSection";
import SectionTitle from "@/components/SectionTitle";
import SeatSelection from "@/components/SeatSelection";
import LoginGuestModal from "@/components/LoginGuestModal";
import TimerModal from "@/components/TimerModal";
import {useCurrentUser} from "@/util/auth";
import SeatBookingPageSkeleton from "@/components/skeletons/SeatBookingPageSkeleton";
import {
    resetBooking,
    selectEventTicketDetails,
    selectSelectedSeats,
    selectManualTicketCounts,
    setEventTicketDetails,
    setManualTicketCounts,
    setRestorationStatus,
} from "@/store/bookingSlice";
import {RootState} from "@/store/store";
import {useSeatByEventId, useUnseatSelectApi, useCheckSeatCountApi} from "@/hooks/useBooking";

// import {AxiosError} from "axios";

interface Hero {
    image: string;
    title: string;
    subTitle: string;
}

interface TicketFromEventPage {
    price: number;
    ticketCount: number | null;
    ticketTypeId: number;
    ticketTypeName: string;
}

interface StoredBookingData {
    selectedSeats: SeatData[];
    manualTicketCounts: Record<number, number>;
    eventTicketDetails: TicketFromEventPage[];
    eventId: string;
    timestamp: number;
}

interface SeatData {
    price: number;
    seatId: string;
    status: string;
    type_id: number;
    ticketTypeName?: string;
    color?: string;
}

// interface TableRowData {
//     category: string;
//     price: string;
//     tickets: string;
//     amount: string;
//     ticketTypeId: number;
//     enableManualSelection: boolean;
// }

const SeatBookingContent: React.FC = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    const eventId = searchParams.get("eventId") || "";
    const rawTicketDetails = searchParams.get("ticketDetails");
    const location = searchParams.get("location");
    const mapId = location?.split(" ")[0].toLowerCase();

    const user = useCurrentUser();
    const isAuthenticated = !!user;

    const eventTicketDetails = useSelector((state: RootState) =>
        selectEventTicketDetails(state)
    );
    const selectedSeats = useSelector((state: RootState) =>
        selectSelectedSeats(state)
    );
    const manualTicketCounts = useSelector((state: RootState) =>
        selectManualTicketCounts(state)
    );
    const ticketTypesExistInApi = useSelector(
        (state: RootState) => state.booking.ticketTypesExistInApi
    );
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
    const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
    const [hasExtended, setHasExtended] = useState(false);
    const [isExpired, setIsExpired] = useState(false);
    // manual ticket count
    // const [ticketAvailability, setTicketAvailability] = useState<Record<number, number | null>>({});

    const [ticketAvailability, setTicketAvailability] = useState<Record<number, number | null>>({});
    const [checkingAvailability, setCheckingAvailability] = useState<Record<number, boolean>>({});


    const {isLoading, error: eventError} =
        useSeatByEventId(eventId);
    const unselectSeatMutation = useUnseatSelectApi();
    const checkSeatCount = useCheckSeatCountApi();


    // Start/stop timer based on ticket count
    // CHANGED: Restored timer to 900 seconds (15 minutes) and fixed stop/restart logic
    useEffect(() => {
        const totalTickets = Object.values(manualTicketCounts).reduce(
            (sum, count) => sum + count,
            0
        ) + selectedSeats.length;

        if (totalTickets === 0 && timerSeconds !== null) {
            setTimerSeconds(null);
            setIsTimerModalOpen(false);
            setHasExtended(false);
            setIsExpired(false);
        } else if (totalTickets > 0 && timerSeconds === null) {
            setTimerSeconds(900); // Restored to 900 seconds (15 minutes)
            setHasExtended(false);
            setIsExpired(false);
        }
    }, [selectedSeats, manualTicketCounts, timerSeconds]);

    // Timer countdown logic
    // CHANGED: Restored modal trigger to 120 seconds (2 minutes), improved error handling for unselect
    useEffect(() => {
        if (timerSeconds === null || isExpired) return;

        if (timerSeconds <= 0) {
            setIsExpired(true);
            // CHANGED: Improved error handling for unselect on expiration
            const unselectPromises = selectedSeats.map((seat) =>
                unselectSeatMutation.mutateAsync({event_id: eventId, seat_id: seat.seatId}).catch((error) => {
                    console.error(`Failed to unselect seat ${seat.seatId} on expiration:`, error);
                    return Promise.resolve(); // Continue with other unselects
                })
            );
            Promise.all(unselectPromises)
                .then(() => {
                    dispatch(resetBooking());
                    queryClient.invalidateQueries({queryKey: ["seatData", eventId]});
                    setErrorMessage("Your seat selection time has expired. Please start again.");
                    setTimeout(() => setErrorMessage(null), 5000);
                })
                .catch((error) => {
                    console.error("Failed to unselect all seats on expiration:", error);
                    setErrorMessage("Failed to reset seats on expiration. Please try again.");
                    setTimeout(() => setErrorMessage(null), 5000);
                });
            return;
        }

        if (timerSeconds === 120 && !hasExtended) {
            setIsTimerModalOpen(true); // Restored to 120 seconds
        }

        const interval = setInterval(() => {
            setTimerSeconds((prev) => (prev !== null ? prev - 1 : null));
        }, 1000);

        return () => clearInterval(interval);
    }, [timerSeconds, dispatch, eventId, hasExtended, isExpired, queryClient, selectedSeats, unselectSeatMutation]);

    const handleExtendTimer = useCallback(() => {
        setTimerSeconds((prev) => (prev !== null ? prev + 300 : 300)); // Add 5 minutes
        setIsTimerModalOpen(false);
        setHasExtended(true);
    }, []);

    const handleContinueTimer = useCallback(() => {
        setIsTimerModalOpen(false);
    }, []);

    // Handle ticket details and restoration
    useEffect(() => {
        if (rawTicketDetails) {
            try {
                const parsedDetails: TicketFromEventPage[] = JSON.parse(rawTicketDetails);
                dispatch(setEventTicketDetails(parsedDetails));

                const initialManualCounts: Record<number, number> = {};
                parsedDetails.forEach((ticket) => {
                    initialManualCounts[ticket.ticketTypeId] = 0;
                });

                const storedData = localStorage.getItem("tempBookingData");
                if (storedData) {
                    try {
                        const parsedStoredData: StoredBookingData = JSON.parse(storedData);
                        if (
                            parsedStoredData.eventId === eventId &&
                            parsedStoredData.eventTicketDetails?.length === parsedDetails.length &&
                            parsedStoredData.eventTicketDetails.every(
                                (storedTicket, index) =>
                                    storedTicket.ticketTypeId === parsedDetails[index].ticketTypeId &&
                                    storedTicket.ticketTypeName === parsedDetails[index].ticketTypeName &&
                                    storedTicket.price === parsedDetails[index].price
                            ) &&
                            Date.now() - parsedStoredData.timestamp < 3600000 && // 1 hour validity
                            parsedStoredData.selectedSeats.length > 0
                        ) {
                            dispatch(setRestorationStatus("loading"));
                            Object.entries(parsedStoredData.manualTicketCounts).forEach(
                                ([ticketTypeId, count]) => {
                                    dispatch(
                                        setManualTicketCounts({
                                            ticketTypeId: Number(ticketTypeId),
                                            delta: count,
                                        })
                                    );
                                }
                            );
                            setTimeout(() => {
                                dispatch(setRestorationStatus("success"));
                                setTimeout(() => dispatch(setRestorationStatus(null)), 3000);
                            }, 1000);
                        } else {
                            Object.entries(initialManualCounts).forEach(
                                ([ticketTypeId, count]) => {
                                    dispatch(
                                        setManualTicketCounts({
                                            ticketTypeId: Number(ticketTypeId),
                                            delta: count,
                                        })
                                    );
                                }
                            );
                            localStorage.removeItem("tempBookingData");
                            localStorage.removeItem("bookingSummaryToBill");
                        }
                    } catch (e) {
                        console.error("Failed to parse stored booking data:", e);
                        Object.entries(initialManualCounts).forEach(
                            ([ticketTypeId, count]) => {
                                dispatch(
                                    setManualTicketCounts({
                                        ticketTypeId: Number(ticketTypeId),
                                        delta: count,
                                    })
                                );
                            }
                        );
                        localStorage.removeItem("tempBookingData");
                        localStorage.removeItem("bookingSummaryToBill");
                        dispatch(setRestorationStatus("failed"));
                        setTimeout(() => dispatch(setRestorationStatus(null)), 3000);
                    }
                } else {
                    Object.entries(initialManualCounts).forEach(([ticketTypeId, count]) => {
                        dispatch(
                            setManualTicketCounts({
                                ticketTypeId: Number(ticketTypeId),
                                delta: count,
                            })
                        );
                    });
                }
            } catch (e) {
                console.error("Failed to parse ticket details from URL:", e);
                dispatch(setEventTicketDetails([]));
                localStorage.removeItem("tempBookingData");
                localStorage.removeItem("bookingSummaryToBill");
            }
        }
    }, [rawTicketDetails, eventId, dispatch]);

    const categories = useMemo(
        () =>
            eventTicketDetails
                .map((ticket) => ({
                    name: ticket.ticketTypeName,
                    price: ticket.price,
                    ticketTypeId: ticket.ticketTypeId,
                }))
                .sort((a, b) => a.price - b.price),
        [eventTicketDetails]
    );


    const fetchAvailability = useCallback(
        async (ticketTypeId: number) => {
            setCheckingAvailability((prev) => ({...prev, [ticketTypeId]: true}));
            try {
                // Try a high count to trigger the API's availability limit message
                const data = await checkSeatCount.mutateAsync({
                    event_id: eventId,
                    ticket_type_id: ticketTypeId.toString(),
                    count: "100", // Arbitrary high number to get the max available
                });

                let availableSeats: number;
                if (data.available) {
                    // If 100 seats are available, assume a high limit (adjust as needed)
                    availableSeats = 100;
                } else {
                    // Parse the message to extract the number of available seats
                    const match = data.message.match(/Only (\d+) seats are available/);
                    availableSeats = match ? parseInt(match[1], 10) : 0; // Default to 0 if parsing fails
                }

                setTicketAvailability((prev) => ({...prev, [ticketTypeId]: availableSeats}));
                return availableSeats;
            } catch (error) {
                console.error(`Failed to fetch availability for ticket type ${ticketTypeId}:`, error);
                setTicketAvailability((prev) => ({...prev, [ticketTypeId]: 0}));
                return 0;
            } finally {
                setCheckingAvailability((prev) => ({...prev, [ticketTypeId]: false}));
            }
        },
        [checkSeatCount, eventId]
    );


    const handleIncrease = useCallback(
        async (ticketTypeId: number) => {
            if (checkingAvailability[ticketTypeId]) return;

            const currentCount = manualTicketCounts[ticketTypeId] || 0;
            const newCount = currentCount + 1;

            // Fetch availability if not already known
            let avail = ticketAvailability[ticketTypeId];
            if (avail === null || avail === undefined) {
                avail = await fetchAvailability(ticketTypeId);
            }

            const category = categories.find((c) => c.ticketTypeId === ticketTypeId)?.name || "this category";

            if (newCount > avail) {
                setErrorMessage(`Only ${avail} tickets available for ${category}.`);
                setTimeout(() => setErrorMessage(null), 5000);
                return;
            }

            dispatch(setManualTicketCounts({ticketTypeId, delta: 1}));
        },
        [checkingAvailability, manualTicketCounts, ticketAvailability, fetchAvailability, dispatch, categories]
    );


    const handleDecrease = useCallback(
        (ticketTypeId: number) => {
            const currentCount = manualTicketCounts[ticketTypeId] || 0;
            if (currentCount > 0) {
                dispatch(setManualTicketCounts({ticketTypeId, delta: -1}));
            }
        },
        [dispatch, manualTicketCounts]
    );


    useEffect(() => {
        const initialAvailability: Record<number, number | null> = {};
        eventTicketDetails.forEach((ticket) => {
            initialAvailability[ticket.ticketTypeId] = null;
        });
        setTicketAvailability(initialAvailability);
    }, [eventTicketDetails]);


    const rows = useMemo(
        () =>
            categories
                .map(({name, price, ticketTypeId}) => {
                    const enableManualSelection = ticketTypesExistInApi[ticketTypeId] === false;
                    const ticketsFromMap = selectedSeats.filter(
                        (seat) => seat.type_id === ticketTypeId
                    ).length;
                    const manualCount = manualTicketCounts[ticketTypeId] || 0;
                    const combinedTickets = enableManualSelection
                        ? ticketsFromMap + manualCount
                        : ticketsFromMap;
                    const amount = combinedTickets * price;

                    return {
                        category: name,
                        price: `${price.toFixed(2)} LKR`,
                        tickets: combinedTickets.toString().padStart(2, "0"),
                        amount: `${amount.toFixed(2)} LKR`,
                        ticketTypeId,
                        enableManualSelection,
                        //seat availability
                        maxAvailableTickets: ticketAvailability[ticketTypeId] ?? null,
                    };
                })
                .filter(
                    (row) =>
                        parseFloat(row.amount.replace(" LKR", "")) > 0 ||
                        row.enableManualSelection
                ),
        [categories, selectedSeats, manualTicketCounts, ticketTypesExistInApi, ticketAvailability]
    );

    const totalTickets = useMemo(
        () =>
            rows
                .reduce((sum, row) => sum + parseInt(row.tickets), 0)
                .toString()
                .padStart(2, "0"),
        [rows]
    );

    const totalAmount = useMemo(
        () =>
            `${rows
                .reduce((sum, row) => sum + parseFloat(row.amount.replace(" LKR", "")), 0)
                .toFixed(2)} LKR`,
        [rows]
    );

    const selectedSeatNumbers = useMemo(
        () =>
            selectedSeats
                .filter((seat) => ticketTypesExistInApi[seat.type_id] === true)
                .map((seat) => seat.seatId)
                .join(", "),
        [selectedSeats, ticketTypesExistInApi]
    );

    const saveBookingSummaryToLocalStorage = useCallback(() => {
        const bookingSummaryData = {
            rows: rows.filter((row) => parseFloat(row.amount.replace(" ", "")) > 0),
            totalTickets: totalTickets,
            totalAmount,
            selectedSeatNumbers,
        };
        localStorage.setItem(
            "bookingSummaryToBill",
            JSON.stringify(bookingSummaryData)
        );
    }, [rows, totalTickets, totalAmount, selectedSeatNumbers]);

    const handleProceed = useCallback(() => {
        const totalSelectedTickets = rows.reduce(
            (sum, row) => sum + parseInt(row.tickets),
            0
        );

        //seat availability
        // const hasInvalidCounts = Object.entries(manualTicketCounts).some(
        //     ([ticketTypeId, count]) =>
        //         count > 0 && ticketAvailability[Number(ticketTypeId)] === 0
        // );

        if (totalSelectedTickets === 0) {
            setErrorMessage(
                "Please select at least one seat or add tickets manually to proceed."
            );
            setTimeout(() => setErrorMessage(null), 5000);
            return;
        }

        //seat availability
        // if (hasInvalidCounts) {
        //     setErrorMessage(
        //         "Cannot proceed: Some ticket counts exceed available seats."
        //     );
        //     setTimeout(() => setErrorMessage(null), 5000);
        //     return;
        // }

        saveBookingSummaryToLocalStorage();

        if (isAuthenticated) {
            router.push(
                `/billing-details?summary=${encodeURIComponent(
                    localStorage.getItem("bookingSummaryToBill") || "{}"
                )}&eventId=${encodeURIComponent(eventId)}`
            );
        } else {
            setIsLoginModalOpen(true);
        }
    }, [rows, isAuthenticated, router, eventId, saveBookingSummaryToLocalStorage]);

    const handleSignInAndProceed = useCallback(() => {
        setIsLoginModalOpen(false);
        router.push(
            `/billing-details?summary=${encodeURIComponent(
                localStorage.getItem("bookingSummaryToBill") || "{}"
            )}&eventId=${encodeURIComponent(eventId)}`
        );
    }, [router, eventId]);

    const handleContinueAsGuestAndProceed = useCallback(() => {
        setIsLoginModalOpen(false);
        router.push(
            `/billing-details?summary=${encodeURIComponent(
                localStorage.getItem("bookingSummaryToBill") || "{}"
            )}&eventId=${encodeURIComponent(eventId)}`
        );
    }, [router, eventId]);

    // CHANGED: Improved handleReset to handle unselect errors gracefully
    const handleReset = useCallback(async () => {
        const seatIds = selectedSeats.map((seat) => seat.seatId);
        try {
            const unselectPromises = seatIds.map((seatId) =>
                unselectSeatMutation.mutateAsync({event_id: eventId, seat_id: seatId}).catch((error) => {
                    console.error(`Failed to unselect seat ${seatId}:`, error);
                    return Promise.resolve(); // Continue with other unselects
                })
            );
            await Promise.all(unselectPromises);
            dispatch(resetBooking());
            queryClient.invalidateQueries({queryKey: ["seatData", eventId]});
            localStorage.removeItem("tempBookingData");
            localStorage.removeItem("bookingSummaryToBill");
        } catch (error) {
            console.error("Failed to reset seats:", error);
            setErrorMessage("Failed to reset seats. Please try again.");
            setTimeout(() => setErrorMessage(null), 5000);
        }
    }, [dispatch, eventId, queryClient, selectedSeats, unselectSeatMutation]);

    const formatTimerDisplay = (seconds: number | null) => {
        if (seconds === null) return "--:--";
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };


    const handleCloseError = useCallback(() => {
        setErrorMessage(null);
    }, []);


    if (isLoading) {
        return (
            <div className="py-4 px-2 sm:px-4 lg:px-6">
                <div className="max-w-7xl mx-auto">
                    <SectionTitle title="Seat Booking"/>
                    <div className="mt-4 sm:mt-6 py-8 sm:py-12">
                        <SeatBookingPageSkeleton/>
                    </div>
                </div>
            </div>
        );
    }

    if (eventError) {
        return (
            <div className="min-h-screen flex justify-center items-center p-4">
                <Alert severity="error" sx={{maxWidth: 500}}>
                    <div className="text-lg font-semibold mb-2">
                        Error Loading Seat Information
                    </div>
                    <div>{eventError && <div>Seat data error: {eventError.message}</div>}</div>
                    <div className="mt-2 text-sm">Please refresh the page to try again.</div>
                </Alert>
            </div>
        );
    }


    return (
        // <div className="min-h-screen bg-white">
        //     <HeroSection hero={hero}/>
        <div className="py-4 px-2 sm:px-4 lg:px-6">
            <div className="max-w-7xl mx-auto">
                <SectionTitle title="Seat Booking"/>
                <div className="mt-1 sm:mt-6 py-4 sm:py-12">
                    {/*{errorMessage && (*/}
                    {/*    <Alert*/}
                    {/*        severity="error"*/}
                    {/*        sx={{mb: 2}}*/}
                    {/*        onClose={() => setErrorMessage(null)}*/}
                    {/*    >*/}
                    {/*        {errorMessage}*/}
                    {/*    </Alert>*/}
                    {/*)}*/}


                    <Snackbar
                        open={!!errorMessage}
                        autoHideDuration={5000}
                        onClose={handleCloseError}
                        anchorOrigin={{vertical: "top", horizontal: "right"}}
                        sx={{
                            "& .MuiSnackbarContent-root": {
                                backgroundColor: "#FF6B6B",
                                color: "#1A1A1A",
                                borderRadius: "8px",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                                fontFamily: "Inter, sans-serif",
                                fontSize: {xs: "0.9rem", sm: "1rem"},
                                fontWeight: 500,
                                padding: "12px 24px",
                                maxWidth: "400px",
                                transition: "background-color 0.2s ease-in-out",
                                "&:hover": {
                                    backgroundColor: "#FF5A5A",
                                },
                            },
                        }}
                    >
                        <Alert
                            onClose={handleCloseError}
                            severity="error"
                            sx={{
                                width: "100%",
                                backgroundColor: "#FF6B6B",
                                color: "#1A1A1A",
                                "& .MuiAlert-icon": {
                                    color: "#F5F5F5",
                                },
                                "& .MuiAlert-action": {
                                    color: "#F5F5F5",
                                    "&:hover": {
                                        color: "#FFFFFF",
                                    },
                                },
                            }}
                        >
                            {errorMessage}
                        </Alert>
                    </Snackbar>


                    <Box sx={{display: "flex", justifyContent: "center", mb: 4}}>
                        {timerSeconds !== null && (
                            // <Tooltip
                            //     title="Time remaining to complete your seat selection"
                            //     placement="top"
                            // >
                            //     <Box
                            //         sx={{
                            //             position: "relative",
                            //             width: {xs: 60, sm: 80},
                            //             height: {xs: 60, sm: 80},
                            //             display: "flex",
                            //             alignItems: "center",
                            //             justifyContent: "center",
                            //             animation:
                            //                 timerSeconds <= 120
                            //                     ? "pulse 1.5s infinite"
                            //                     : "none",
                            //             "@keyframes pulse": {
                            //                 "0%": {transform: "scale(1)"},
                            //                 "50%": {transform: "scale(1.1)"},
                            //                 "100%": {transform: "scale(1)"},
                            //             },
                            //         }}
                            //     >
                            //         <CircularProgress
                            //             variant="determinate"
                            //             value={(timerSeconds / 900) * 100} // CHANGED: Corrected progress calculation for 900 seconds
                            //             size={80}
                            //             thickness={4}
                            //             sx={{
                            //                 color: timerSeconds <= 120 ? "#d32f2f" : "#27337C",
                            //                 position: "absolute",
                            //                 top: 0,
                            //                 left: 0,
                            //             }}
                            //         />
                            //         <Typography
                            //             sx={{
                            //                 color: timerSeconds <= 120 ? "#d32f2f" : "#27337C",
                            //                 fontWeight: "bold",
                            //                 fontSize: {xs: "0.9rem", sm: "1.1rem"},
                            //             }}
                            //         >
                            //             {formatTimerDisplay(timerSeconds)}
                            //         </Typography>
                            //     </Box>
                            // </Tooltip>

                            <Tooltip
                                title="Time remaining to complete your seat selection"
                                placement="top"
                            >
                                <Fab
                                    sx={{
                                        position: "fixed",
                                        bottom: {xs: 16, sm: 24},
                                        right: {xs: 16, sm: 24},
                                        width: {xs: 80, sm: 80},
                                        height: {xs: 80, sm: 80},
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: "relative",
                                            width: {xs: 80, sm: 80},
                                            height: {xs: 80, sm: 80},
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            animation:
                                                timerSeconds <= 120
                                                    ? "pulse 1.5s infinite"
                                                    : "none",
                                            "@keyframes pulse": {
                                                "0%": {transform: "scale(1)"},
                                                "50%": {transform: "scale(1.1)"},
                                                "100%": {transform: "scale(1)"},
                                            },
                                        }}
                                    >
                                        <CircularProgress
                                            variant="determinate"
                                            value={(timerSeconds / 900) * 100} // CHANGED: Corrected progress calculation for 900 seconds
                                            size={80}
                                            thickness={4}
                                            sx={{
                                                color: timerSeconds <= 120 ? "#d32f2f" : "#27337C",
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                            }}
                                        />
                                        <Typography
                                            sx={{
                                                color: timerSeconds <= 120 ? "#d32f2f" : "#27337C",
                                                fontWeight: "bold",
                                                fontSize: {xs: "0.9rem", sm: "1.1rem"},
                                            }}
                                        >
                                            {formatTimerDisplay(timerSeconds)}
                                        </Typography>
                                    </Box>
                                </Fab>
                            </Tooltip>
                        )}
                    </Box>
                    <div className="w-full overflow-x-auto">
                        <SeatSelection mapId={mapId} eventId={eventId}/>
                    </div>
                    <div className="py-4 px-2 sm:px-4 lg:px-6">
                        <div className="max-w-4xl mx-auto">
                            <TableContainer
                                component={Paper}
                                sx={{
                                    border: "none",
                                    boxShadow: "none",
                                    borderRadius: "8px",
                                    overflowX: "auto",
                                }}
                            >
                                <Table
                                    sx={{
                                        minWidth: {xs: 300, sm: 600, md: 650},
                                        "& .MuiTableCell-root": {
                                            borderColor: "#E7EAE9",
                                            padding: {xs: "8px 4px", sm: "12px 8px", md: "16px"},
                                        },
                                    }}
                                    aria-label="Seat booking summary table"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">
                                                <div
                                                    className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#27337C]">
                                                    Category
                                                </div>
                                            </TableCell>
                                            <TableCell align="center">
                                                <div
                                                    className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#27337C]">
                                                    Price
                                                </div>
                                            </TableCell>
                                            <TableCell align="center">
                                                <div
                                                    className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#27337C]">
                                                    Tickets
                                                </div>
                                            </TableCell>
                                            <TableCell align="center">
                                                <div
                                                    className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#27337C]">
                                                    Amount
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {categories.map(({name, price, ticketTypeId}) => {
                                            const enableManualSelection =
                                                ticketTypesExistInApi[ticketTypeId] === false;
                                            const ticketsFromMap = selectedSeats.filter(
                                                (seat) => seat.type_id === ticketTypeId
                                            ).length;
                                            const manualCount = manualTicketCounts[ticketTypeId] || 0;
                                            const displayTickets = enableManualSelection
                                                ? ticketsFromMap + manualCount
                                                : ticketsFromMap;
                                            const displayAmount = (displayTickets * price).toFixed(2);
                                            //seat availability
                                            // const maxAvailableTickets = ticketAvailability[ticketTypeId];

                                            if (displayTickets === 0 && !enableManualSelection) {
                                                return null;
                                            }

                                            return (
                                                <TableRow
                                                    key={ticketTypeId}
                                                    sx={{
                                                        backgroundColor: "#F1F5F9",
                                                        "&:last-child td, &:last-child th": {border: 0},
                                                    }}
                                                >
                                                    <TableCell align="center">
                                                        <div
                                                            className="font-inter font-medium text-xs sm:text-sm md:text-base lg:text-lg text-[#27337C]">
                                                            {name}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <div
                                                            className="font-inter font-medium text-xs sm:text-sm md:text-base text-[#27337C]">
                                                            {price.toFixed(2)} LKR
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {enableManualSelection ? (
                                                            <div
                                                                className="flex items-center justify-center space-x-2">
                                                                <button
                                                                    // onClick={() =>
                                                                    //     dispatch(
                                                                    //         setManualTicketCounts({
                                                                    //             ticketTypeId,
                                                                    //             delta: -1,
                                                                    //         })
                                                                    //     )
                                                                    // }
                                                                    onClick={() => handleDecrease(ticketTypeId)}
                                                                    disabled={(manualCount === 0) || checkingAvailability[ticketTypeId]}
                                                                    className={`p-1 rounded-full bg-[#E0E0E0] hover:bg-[#D0D0D0] transition-colors cursor-pointer ${
                                                                        (manualCount === 0 || checkingAvailability[ticketTypeId]) ? 'opacity-50 cursor-not-allowed' : ''
                                                                    }`}
                                                                    aria-label={`Decrease ${name} tickets`}
                                                                    //seat availability
                                                                    // disabled={displayTickets === 0}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="24"
                                                                        height="24"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            fill="#000"
                                                                            d="M18 11H6a2 2 0 0 0 0 4h12a2 2 0 0 0 0-4"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                                <span
                                                                    className="font-inter text-xs sm:text-sm md:text-base text-[#000000]">
                                                                        {displayTickets.toString().padStart(2, "0")}
                                                                    </span>
                                                                <button
                                                                    // onClick={() =>
                                                                    //     dispatch(
                                                                    //         setManualTicketCounts({
                                                                    //             ticketTypeId,
                                                                    //             delta: 1,
                                                                    //         })
                                                                    //     )
                                                                    // }

                                                                    onClick={() => handleIncrease(ticketTypeId)}
                                                                    disabled={checkingAvailability[ticketTypeId]}
                                                                    className={`p-1 rounded-full bg-[#E0E0E0] hover:bg-[#D0D0D0] transition-colors cursor-pointer ${
                                                                        checkingAvailability[ticketTypeId] ? 'opacity-50 cursor-not-allowed' : ''
                                                                    }`}
                                                                    aria-label={`Increase ${name} tickets`}
                                                                    // seat availability
                                                                    // disabled={
                                                                    //     maxAvailableTickets !== null &&
                                                                    //     maxAvailableTickets !== undefined &&
                                                                    //     displayTickets >= maxAvailableTickets
                                                                    // }
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="24"
                                                                        height="24"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            fill="#000"
                                                                            d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                className="font-inter text-xs sm:text-sm md:text-base text-[#000000]">
                                                                {displayTickets.toString().padStart(2, "0")}
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <div
                                                            className="font-inter text-xs sm:text-sm md:text-base text-[#000000]">
                                                            {displayAmount} LKR
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                        <TableRow sx={{backgroundColor: "#F1F5F9"}}>
                                            <TableCell align="center">
                                                <div
                                                    className="font-inter font-semibold text-sm sm:text-base md:text-lg text-[#27337C]">
                                                    Total
                                                </div>
                                            </TableCell>
                                            <TableCell align="center"></TableCell>
                                            <TableCell align="center">
                                                <div
                                                    className="font-inter font-bold text-xs sm:text-sm md:text-base text-[#27337C]">
                                                    {totalTickets}
                                                </div>
                                            </TableCell>
                                            <TableCell align="center">
                                                <div
                                                    className="font-inter font-bold text-xs sm:text-sm md:text-base text-[#27337C]">
                                                    {totalAmount}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <div
                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#F1F5F9] rounded-md px-4 sm:px-8 lg:px-12 py-3 sm:py-4 mt-4 gap-2 sm:gap-4">
                                <div
                                    className="font-inter text-[#27337C] text-sm sm:text-base md:text-lg font-semibold">
                                    Seat Numbers
                                </div>
                                <div
                                    className="font-inter font-medium text-[#27337C] text-xs sm:text-sm md:text-base flex-1 text-left sm:text-center">
                                    {selectedSeatNumbers || "None"}
                                </div>
                                <div className="flex gap-2 sm:gap-4">
                                    <button
                                        onClick={handleReset}
                                        className="bg-white cursor-pointer font-inter font-medium text-xs sm:text-sm md:text-base text-[#27337C] border-2 border-[#27337C] px-6 sm:px-8 md:px-10 py-2 rounded-md hover:bg-blue-50 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={handleProceed}
                                        className="bg-[#27337C] cursor-pointer font-inter font-medium text-xs sm:text-sm md:text-base text-white px-6 sm:px-8 md:px-10 py-2 rounded-md hover:bg-[#1e264f] transition-colors w-full sm:w-auto"
                                    >
                                        Proceed
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <LoginGuestModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onSignIn={handleSignInAndProceed}
                onContinueAsGuest={handleContinueAsGuestAndProceed}
            />
            <TimerModal
                open={isTimerModalOpen}
                onExtend={handleExtendTimer}
                onContinue={handleContinueTimer}
            />
        </div>
    );
};


const SeatBookingPage: React.FC = () => {
    const hero: Hero = {
        image: "/payment-successful-hero.png",
        title: "Seat Booking",
        subTitle: "Discover your favorite entertainment right here",
    };

    return (
        <div className="min-h-screen bg-white">
            <HeroSection hero={hero}/>
            <Suspense
                fallback={
                    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
                        <CircularProgress size={50} sx={{color: "#27337C"}}/>
                        <div className="mt-4 text-lg text-gray-600">Loading seat booking...</div>
                    </div>
                }
            >
                <SeatBookingContent/>
            </Suspense>
        </div>
    );
};

export default memo(SeatBookingPage);