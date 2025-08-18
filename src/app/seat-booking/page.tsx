// "use client";
//
// import HeroSection from "@/components/HeroSection";
// import SectionTitle from "@/components/SectionTitle";
// import SeatSelection from "@/components/SeatSelection";
// import {
//     Alert,
//     CircularProgress,
//     Paper,
//     Table,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     TableBody,
// } from "@mui/material";
// import React, {useState, useEffect, useCallback, Suspense, useRef} from "react";
// import {useSeatByEventId, useUnseatSelectApi} from "@/hooks/useBooking";
// import {useRouter, useSearchParams} from "next/navigation";
// import LoginGuestModal from "@/components/LoginGuestModal";
// import {useCurrentUser} from "@/util/auth";
// import SeatBookingPageSkeleton from "@/components/skeletons/SeatBookingPageSkeleton";
//
// interface SeatData {
//     price: number;
//     seatId: string;
//     status: string;
//     type_id: number;
//     ticketTypeName?: string;
//     color?: string;
// }
//
// interface ApiSeat {
//     price: number;
//     seatId: string;
//     status: string;
//     type_id: number;
//     ticketTypeName?: string;
//     color?: string;
// }
//
// type UseSeatByEventIdData = ApiSeat[] | { data: ApiSeat[] } | { seats: ApiSeat[] } | null | undefined;
//
// interface Category {
//     name: string;
//     price: number;
//     ticketTypeId: number;
// }
//
// interface TableRowData {
//     category: string;
//     price: string;
//     tickets: string;
//     amount: string;
//     ticketTypeId: number;
//     enableManualSelection: boolean;
// }
//
// interface Hero {
//     image: string;
//     title: string;
//     subTitle: string;
// }
//
// interface TicketFromEventPage {
//     price: number;
//     ticketCount: number | null;
//     ticketTypeId: number;
//     ticketTypeName: string;
// }
//
// interface StoredBookingData {
//     selectedSeats: SeatData[];
//     manualTicketCounts: Record<number, number>;
//     eventTicketDetails: TicketFromEventPage[];
// }
//
// const SeatBookingContent: React.FC = () => {
//     const searchParams = useSearchParams();
//     const router = useRouter();
//     const eventId = searchParams.get("eventId") || "3";
//     const rawTicketDetails = searchParams.get("ticketDetails");
//     const location = searchParams.get("location");
//     const mapId = location?.split(" ")[0].toLowerCase();
//
//     const user = useCurrentUser();
//     const isAuthenticated = !!user;
//
//     // const unselectSeatMutation = useUnseatSelectApi();
//     // const resetSeatsMutation = useResetSeatApi();
//     const unselectSeatMutation = useUnseatSelectApi();
//
//     const [eventTicketDetails, setEventTicketDetails] = useState<TicketFromEventPage[]>([]);
//     const [currentSeatData, setCurrentSeatData] = useState<SeatData[]>([]);
//     const [selectedSeats, setSelectedSeats] = useState<SeatData[]>([]);
//     const [manualTicketCounts, setManualTicketCounts] = useState<Record<number, number>>({});
//     const [ticketTypesExistInApi, setTicketTypesExistInApi] = useState<Record<number, boolean>>({});
//     const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//     const [timeLeft, setTimeLeft] = useState<number | null>(null);
//     const timerRef = useRef<NodeJS.Timeout | null>(null);
//     const hasStartedTimer = useRef<boolean>(false);
//     const [errorMessage, setErrorMessage] = useState<string | null>(null);
//
//
//     const {data: apiSeatData, isLoading, error: eventError} = useSeatByEventId(eventId) as {
//         data: UseSeatByEventIdData;
//         isLoading: boolean;
//         error: Error | null;
//     };
//
//     // Load initial ticket details from URL and restore booking data from localStorage
//     useEffect(() => {
//         // Parse ticket details from URL
//         if (rawTicketDetails) {
//             try {
//                 const parsedDetails: TicketFromEventPage[] = JSON.parse(rawTicketDetails);
//                 setEventTicketDetails(parsedDetails);
//                 const initialManualCounts: Record<number, number> = {};
//                 parsedDetails.forEach((ticket) => {
//                     initialManualCounts[ticket.ticketTypeId] = 0;
//                 });
//
//                 // Restore booking data from localStorage if it exists
//                 const storedData = localStorage.getItem("tempBookingData");
//                 if (storedData) {
//                     try {
//                         const parsedStoredData: StoredBookingData = JSON.parse(storedData);
//                         if (parsedStoredData.eventTicketDetails?.length === parsedDetails.length &&
//                             parsedStoredData.eventTicketDetails.every((storedTicket, index) =>
//                                 storedTicket.ticketTypeId === parsedDetails[index].ticketTypeId &&
//                                 storedTicket.ticketTypeName === parsedDetails[index].ticketTypeName &&
//                                 storedTicket.price === parsedDetails[index].price
//                             )) {
//                             setSelectedSeats(parsedStoredData.selectedSeats || []);
//                             setManualTicketCounts(parsedStoredData.manualTicketCounts || initialManualCounts);
//                         } else {
//                             // If event ticket details don't match, reset localStorage
//                             setManualTicketCounts(initialManualCounts);
//                             localStorage.removeItem("tempBookingData");
//                             localStorage.removeItem("bookingSummaryToBill");
//                         }
//                     } catch (e) {
//                         console.error("Failed to parse stored booking data:", e);
//                         setManualTicketCounts(initialManualCounts);
//                         localStorage.removeItem("tempBookingData");
//                         localStorage.removeItem("bookingSummaryToBill");
//                     }
//                 } else {
//                     setManualTicketCounts(initialManualCounts);
//                 }
//             } catch (e) {
//                 console.error("Failed to parse ticket details from URL:", e);
//                 setEventTicketDetails([]);
//                 setManualTicketCounts({});
//                 localStorage.removeItem("tempBookingData");
//                 localStorage.removeItem("bookingSummaryToBill");
//             }
//         }
//     }, [rawTicketDetails]);
//
//     // Process API seat data
//     useEffect(() => {
//         let dataToProcess: ApiSeat[] = [];
//         const isDataWithSeatsProperty = (data: UseSeatByEventIdData): data is { seats: ApiSeat[] } => {
//             return typeof data === 'object' && data !== null && 'seats' in data && Array.isArray(data.seats);
//         };
//
//         const isDataWithDataProperty = (data: UseSeatByEventIdData): data is { data: ApiSeat[] } => {
//             return typeof data === 'object' && data !== null && 'data' in data && Array.isArray(data.data);
//         };
//
//         if (Array.isArray(apiSeatData)) {
//             dataToProcess = apiSeatData;
//         } else if (isDataWithDataProperty(apiSeatData)) {
//             dataToProcess = apiSeatData.data;
//         } else if (isDataWithSeatsProperty(apiSeatData)) {
//             dataToProcess = apiSeatData.seats;
//         } else {
//             console.warn('PAGE: useEffect - apiSeatData is not in an expected array format, defaulting to empty array.');
//         }
//
//         const transformedData: SeatData[] = dataToProcess
//             .filter((seat) => seat.seatId && seat.seatId.trim() !== "")
//             .map((seat) => {
//                 const validStatuses = ["available", "booked", "selected", "unavailable"] as const;
//                 const status = validStatuses.includes(seat.status as "available" | "booked" | "selected" | "unavailable")
//                     ? (seat.status as SeatData['status'])
//                     : 'unavailable';
//                 const price = parseFloat(String(seat.price)) || 0;
//                 const type_id = parseInt(String(seat.type_id), 10) || 0;
//
//                 const matchingEventTicket = eventTicketDetails.find(
//                     (eventTicket) => eventTicket.ticketTypeId === type_id
//                 );
//
//                 return {
//                     seatId: seat.seatId,
//                     status: status === "selected" || status === "unavailable" ? "unavailable" : status,
//                     price,
//                     type_id,
//                     ticketTypeName: matchingEventTicket
//                         ? matchingEventTicket.ticketTypeName
//                         : seat.ticketTypeName,
//                     color: seat.color,
//                 };
//             });
//
//         const ticketTypeExistence: Record<number, boolean> = {};
//         eventTicketDetails.forEach((eventTicket) => {
//             const hasSeatsInApi = transformedData.some(
//                 (seat) => seat.type_id === eventTicket.ticketTypeId
//             );
//             ticketTypeExistence[eventTicket.ticketTypeId] = hasSeatsInApi;
//         });
//         setTicketTypesExistInApi(ticketTypeExistence);
//         setCurrentSeatData(transformedData);
//     }, [apiSeatData, eventTicketDetails]);
//
//
//     // useEffect(() => {
//     //     const hasSelections =
//     //         selectedSeats.length > 0 ||
//     //         Object.values(manualTicketCounts).some((count) => count > 0);
//     //
//     //     if (hasSelections && !hasStartedTimer.current) {
//     //         // Start the timer only if it hasn't been started yet
//     //         hasStartedTimer.current = true;
//     //         setTimeLeft(2 * 60); // 2 minutes in seconds (adjust as needed)
//     //         timerRef.current = setInterval(() => {
//     //             setTimeLeft((prev) => {
//     //                 if (prev === null || prev <= 1) {
//     //                     // Reset all selections when timer reaches 0
//     //                     setSelectedSeats([]);
//     //                     const resetManualCounts: Record<number, number> = {};
//     //                     eventTicketDetails.forEach((ticket) => {
//     //                         resetManualCounts[ticket.ticketTypeId] = 0;
//     //                     });
//     //                     setManualTicketCounts(resetManualCounts);
//     //                     localStorage.removeItem("tempBookingData");
//     //                     localStorage.removeItem("bookingSummaryToBill");
//     //                     if (timerRef.current) {
//     //                         clearInterval(timerRef.current);
//     //                         timerRef.current = null;
//     //                         hasStartedTimer.current = false;
//     //                     }
//     //                     return null;
//     //                 }
//     //                 return prev - 1;
//     //             });
//     //         }, 1000);
//     //     } else if (!hasSelections && timerRef.current) {
//     //         // Clear the timer if no selections remain
//     //         clearInterval(timerRef.current);
//     //         timerRef.current = null;
//     //         setTimeLeft(null);
//     //         hasStartedTimer.current = false;
//     //     }
//     //
//     //     // Save booking data to localStorage
//     //     const dataToStore: StoredBookingData = {
//     //         selectedSeats,
//     //         manualTicketCounts,
//     //         eventTicketDetails,
//     //     };
//     //     localStorage.setItem("tempBookingData", JSON.stringify(dataToStore));
//     //
//     //     // Cleanup on unmount
//     //     return () => {
//     //         if (timerRef.current) {
//     //             clearInterval(timerRef.current);
//     //             timerRef.current = null;
//     //         }
//     //     };
//     // }, [selectedSeats, manualTicketCounts, eventTicketDetails]);
//
//
//     useEffect(() => {
//         const hasSelections =
//             selectedSeats.length > 0 ||
//             Object.values(manualTicketCounts).some((count) => count > 0);
//
//         if (hasSelections && !hasStartedTimer.current) {
//             hasStartedTimer.current = true;
//             setTimeLeft(2 * 60); // 15 minutes in seconds
//             timerRef.current = setInterval(() => {
//                 setTimeLeft((prev) => {
//                     if (prev === null || prev <= 1) {
//                         setSelectedSeats([]);
//                         const resetManualCounts: Record<number, number> = {};
//                         eventTicketDetails.forEach((ticket) => {
//                             resetManualCounts[ticket.ticketTypeId] = 0;
//                         });
//                         setManualTicketCounts(resetManualCounts);
//                         localStorage.removeItem("tempBookingData");
//                         localStorage.removeItem("bookingSummaryToBill");
//                         if (timerRef.current) {
//                             clearInterval(timerRef.current);
//                             timerRef.current = null;
//                             hasStartedTimer.current = false;
//                         }
//                         setErrorMessage("Booking time expired. Please select your seats again.");
//                         return null;
//                     }
//                     return prev - 1;
//                 });
//             }, 1000);
//         } else if (!hasSelections && timerRef.current) {
//             clearInterval(timerRef.current);
//             timerRef.current = null;
//             setTimeLeft(null);
//             hasStartedTimer.current = false;
//         }
//
//         // Cleanup on unmount
//         return () => {
//             if (!hasSelections && timerRef.current) {
//                 clearInterval(timerRef.current);
//                 timerRef.current = null;
//             }
//         };
//     }, [selectedSeats.length, manualTicketCounts, eventTicketDetails]);
//
//     // Handle seat selection changes
//     const handleSelectedSeatsChange = useCallback((newSelectedSeats: SeatData[]) => {
//         setSelectedSeats(newSelectedSeats);
//     }, []);
//
//     // Handle manual ticket count changes
//     const handleTicketCountChange = useCallback(
//         (ticketTypeId: number, delta: number) => {
//             setManualTicketCounts((prevCounts) => {
//                 const newCount = Math.max(0, (prevCounts[ticketTypeId] || 0) + delta);
//                 return {
//                     ...prevCounts,
//                     [ticketTypeId]: newCount,
//                 };
//             });
//         },
//         []
//     );
//
//     // Determine if manual ticket selection is enabled
//     const shouldEnableManualSelection = (ticketTypeId: number): boolean => {
//         return ticketTypesExistInApi[ticketTypeId] === false;
//     };
//
//     // Prepare table data
//     const categories: Category[] = eventTicketDetails
//         .map((ticket) => ({
//             name: ticket.ticketTypeName,
//             price: ticket.price,
//             ticketTypeId: ticket.ticketTypeId,
//         }))
//         .sort((a, b) => a.price - b.price);
//
//     const rows: TableRowData[] = categories
//         .map(({name, price, ticketTypeId}) => {
//             const enableManualSelection = shouldEnableManualSelection(ticketTypeId);
//             const ticketsFromMap = selectedSeats.filter((seat) => {
//                 const originalSeatData = currentSeatData.find(
//                     (cs) => cs.seatId === seat.seatId
//                 );
//                 return originalSeatData?.type_id === ticketTypeId;
//             }).length;
//             const manualCount = manualTicketCounts[ticketTypeId] || 0;
//             const combinedTickets = enableManualSelection
//                 ? ticketsFromMap + manualCount
//                 : ticketsFromMap;
//             const amount = combinedTickets * price;
//
//             return {
//                 category: name,
//                 price: `${price.toFixed(2)} LKR`,
//                 tickets: combinedTickets.toString().padStart(2, "0"),
//                 amount: `${amount.toFixed(2)} LKR`,
//                 ticketTypeId: ticketTypeId,
//                 enableManualSelection,
//             };
//         })
//         .filter((row) => parseFloat(row.amount.replace(" LKR", "")) > 0 || row.enableManualSelection);
//
//     const totalTickets = rows
//         .reduce((sum, row) => sum + parseInt(row.tickets), 0)
//         .toString()
//         .padStart(2, "0");
//     const totalAmount =
//         rows
//             .reduce((sum, row) => sum + parseFloat(row.amount.replace(" LKR", "")), 0)
//             .toFixed(2) + " LKR";
//     const selectedSeatNumbers = selectedSeats
//         .filter((seat) => ticketTypesExistInApi[seat.type_id] === true)
//         .map((seat) => seat.seatId)
//         .join(", ");
//
//     // Save booking summary to local storage
//     const saveBookingDataToLocalStorage = useCallback(() => {
//         const bookingSummaryData = {
//             rows: rows.filter((row) => parseFloat(row.amount.replace(" LKR", "")) > 0),
//             totalTickets,
//             totalAmount,
//             selectedSeatNumbers,
//         };
//         localStorage.setItem("bookingSummaryToBill", JSON.stringify(bookingSummaryData));
//     }, [rows, totalTickets, totalAmount, selectedSeatNumbers]);
//
//     // Handle proceed to billing
//     const handleProceed = useCallback(() => {
//         const totalSelectedTickets = rows.reduce(
//             (sum, row) => sum + parseInt(row.tickets),
//             0
//         );
//         if (totalSelectedTickets === 0) {
//             alert("Please select at least one seat or add tickets manually to proceed.");
//             return;
//         }
//
//         saveBookingDataToLocalStorage();
//
//         if (isAuthenticated) {
//             router.push(
//                 `/billing-details?summary=${encodeURIComponent(
//                     localStorage.getItem("bookingSummaryToBill") || "{}"
//                 )}&eventId=${eventId}`
//             );
//         } else {
//             setIsLoginModalOpen(true);
//         }
//     }, [rows, isAuthenticated, router, saveBookingDataToLocalStorage, eventId]);
//
//     // Handle modal actions
//     const handleSignInAndProceed = useCallback(() => {
//         setIsLoginModalOpen(false);
//         router.push(
//             `/billing-details?summary=${encodeURIComponent(
//                 localStorage.getItem("bookingSummaryToBill") || "{}"
//             )}&eventId=${eventId}`
//         );
//     }, [router, eventId]);
//
//     const handleContinueAsGuestAndProceed = useCallback(() => {
//         setIsLoginModalOpen(false);
//         router.push(
//             `/billing-details?summary=${encodeURIComponent(
//                 localStorage.getItem("bookingSummaryToBill") || "{}"
//             )}&eventId=${eventId}`
//         );
//     }, [router, eventId]);
//
//     // const handleReset = useCallback(async () => {
//     //     try {
//     //         // Unselect all selected seats via API
//     //         if (selectedSeats.length > 0) {
//     //             const unselectPromises = selectedSeats.map((seat) =>
//     //                 resetSeatsMutation.mutateAsync({
//     //                     event_id: eventId,
//     //                     seat_ids: [seat.seatId],
//     //                 })
//     //             );
//     //             await Promise.all(unselectPromises);
//     //             console.log("All selected seats have been unselected via API.");
//     //         }
//     //     } catch (error) {
//     //         console.error("Error unseating seats:", error);
//     //         setErrorMessage("Failed to unselect seats. Please try again.");
//     //
//     //     }
//     //
//     //     // Clear selected seats and reset manual counts
//     //     setSelectedSeats([]);
//     //     const resetManualCounts: Record<number, number> = {};
//     //     eventTicketDetails.forEach((ticket) => {
//     //         resetManualCounts[ticket.ticketTypeId] = 0;
//     //     });
//     //     setManualTicketCounts(resetManualCounts);
//     //
//     //     // Clear local storage
//     //     localStorage.removeItem("tempBookingData");
//     //     localStorage.removeItem("bookingSummaryToBill");
//     //
//     //     // Clear the timer
//     //     if (timerRef.current) {
//     //         clearInterval(timerRef.current);
//     //         timerRef.current = null;
//     //         setTimeLeft(null);
//     //         hasStartedTimer.current = false;
//     //     }
//     // }, [eventId, selectedSeats, eventTicketDetails, resetSeatsMutation]);
//
//
//     const handleReset = useCallback(async () => {
//         try {
//             if (selectedSeats.length > 0) {
//                 const unselectPromises = selectedSeats.map((seat) =>
//                     unselectSeatMutation.mutateAsync({
//                         event_id: eventId,
//                         seat_id: seat.seatId,
//                     })
//                 );
//                 await Promise.all(unselectPromises);
//                 console.log("All selected seats have been unselected via API.");
//             }
//         } catch (error) {
//             console.error("Error unseating seats:", error);
//             setErrorMessage("Failed to unselect seats. Please try again.");
//         }
//
//         setSelectedSeats([]);
//         const resetManualCounts: Record<number, number> = {};
//         eventTicketDetails.forEach((ticket) => {
//             resetManualCounts[ticket.ticketTypeId] = 0;
//         });
//         setManualTicketCounts(resetManualCounts);
//
//         localStorage.removeItem("tempBookingData");
//         localStorage.removeItem("bookingSummaryToBill");
//
//         if (timerRef.current) {
//             clearInterval(timerRef.current);
//             timerRef.current = null;
//             setTimeLeft(null);
//             hasStartedTimer.current = false;
//         }
//     }, [eventId, selectedSeats, eventTicketDetails, unselectSeatMutation]);
//
//     const formatTimeLeft = (seconds: number | null): { minutes: string; seconds: string } => {
//         if (seconds === null) return {minutes: "", seconds: ""};
//         const minutes = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return {
//             minutes: minutes.toString().padStart(2, "0"),
//             seconds: secs.toString().padStart(2, "0"),
//         };
//     };
//
//     if (isLoading) {
//         return (
//             <div className="py-4 px-2 sm:px-4 lg:px-6">
//                 <div className="max-w-7xl mx-auto">
//                     <SectionTitle title="Seat Booking"/>
//                     <div className="mt-4 sm:mt-6 py-8 sm:py-12">
//                         <SeatBookingPageSkeleton/>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
//
//     if (eventError) {
//         return (
//             <div className="min-h-screen flex justify-center items-center p-4">
//                 <Alert severity="error" sx={{maxWidth: 500}}>
//                     <div className="text-lg font-semibold mb-2">
//                         Error Loading Seat Information
//                     </div>
//                     <div>{eventError && <div>Seat data error: {eventError.message}</div>}</div>
//                     <div className="mt-2 text-sm">Please refresh the page to try again.</div>
//                 </Alert>
//             </div>
//         );
//     }
//
//     return (
//         <div className="py-4 px-2 sm:px-4 lg:px-6">
//             <div className="max-w-7xl mx-auto">
//                 <SectionTitle title="Seat Booking"/>
//                 <div className="mt-1 sm:mt-6 py-4 sm:py-12">
//                     {errorMessage && (
//                         <Alert severity="error" sx={{mb: 2}} onClose={() => setErrorMessage(null)}>
//                             {errorMessage}
//                         </Alert>
//                     )}
//                     <div className="w-full overflow-x-auto">
//                         {timeLeft !== null ? (
//                             <div
//                                 className="text-right relative w-full md:w-2/3 flex flex-row gap-5 items-center mx-auto justify-end p-4 overflow-hidden">
//                                 <h3 className="text-[#27337C] font-semibold text-sm md:text-base lg:text-lg">
//                                     Time remaining for
//                                     booking:
//                                 </h3>
//                                 <div className="flex items-center gap-2">
//                                     <div
//                                         className="bg-white rounded-sm text-center justify-center w-8 h-8 md:w-10 md:h-10 border-2 border-[#27337C]">
//                                         <div
//                                             className="text-sm justify-center md:text-lg lg:text-xl font-inter text-[#27337C] font-semibold">
//                                             {formatTimeLeft(timeLeft).minutes}
//                                         </div>
//                                     </div>
//                                     <div className="flex flex-col space-y-2 justify-center items-center px-1">
//                                         <div className="w-1.5 h-1.5 rounded-md bg-[#27337C]"/>
//                                         <div className="w-1.5 h-1.5 rounded-md bg-[#27337C]"/>
//                                     </div>
//                                     <div
//                                         className="bg-white text-blue-900 rounded-sm justify-center text-center w-8 h-8 md:w-10 md:h-10 border-2 border-[#27337C]">
//                                         <div
//                                             className="text-sm md:text-lg lg:text-xl font-inter text-[#27337C] font-semibold">
//                                             {formatTimeLeft(timeLeft).seconds}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ) : (
//                             <h3 className="text-[#27337C] font-semibold text-sm md:text-base lg:text-lg text-right relative w-full md:w-2/3 flex flex-row gap-5 items-center mx-auto justify-end p-4 overflow-hidden">
//                                 Please select your tickets
//                             </h3>
//                         )}
//
//
//                         <SeatSelection
//                             mapId={mapId}
//                             eventId={eventId}
//                             initialSeatData={currentSeatData}
//                             onSeatSelect={handleSelectedSeatsChange}
//                             selectedSeatsFromParent={selectedSeats}
//                             // resetTrigger={resetTrigger}
//                         />
//                     </div>
//                     <div className="py-4 px-2 sm:px-4 lg:px-6">
//                         <div className="max-w-4xl mx-auto">
//                             <TableContainer
//                                 component={Paper}
//                                 sx={{
//                                     border: "none",
//                                     boxShadow: "none",
//                                     borderRadius: "8px",
//                                     overflowX: "auto",
//                                 }}
//                             >
//                                 <Table
//                                     sx={{
//                                         minWidth: {xs: 300, sm: 600, md: 650},
//                                         "& .MuiTableCell-root": {
//                                             borderColor: "#E7EAE9",
//                                             padding: {xs: "8px 4px", sm: "12px 8px", md: "16px"},
//                                         },
//                                     }}
//                                     aria-label="Seat booking summary table"
//                                 >
//                                     <TableHead>
//                                         <TableRow>
//                                             <TableCell align="center">
//                                                 <div
//                                                     className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#2D2A70]">
//                                                     Category
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell align="center">
//                                                 <div
//                                                     className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#2D2A70]">
//                                                     Price
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell align="center">
//                                                 <div
//                                                     className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#2D2A70]">
//                                                     Tickets
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell align="center">
//                                                 <div
//                                                     className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#2D2A70]">
//                                                     Amount
//                                                 </div>
//                                             </TableCell>
//                                         </TableRow>
//                                     </TableHead>
//                                     <TableBody>
//                                         {categories.map(({name, price, ticketTypeId}) => {
//                                             const enableManualSelection = shouldEnableManualSelection(
//                                                 ticketTypeId
//                                             );
//                                             const ticketsFromMap = selectedSeats.filter((seat) => {
//                                                 const originalSeatData = currentSeatData.find(
//                                                     (cs) => cs.seatId === seat.seatId
//                                                 );
//                                                 return originalSeatData?.type_id === ticketTypeId;
//                                             }).length;
//                                             const manualCount = manualTicketCounts[ticketTypeId] || 0;
//                                             const displayTickets = enableManualSelection
//                                                 ? ticketsFromMap + manualCount
//                                                 : ticketsFromMap;
//                                             const displayAmount = (displayTickets * price).toFixed(2);
//
//                                             if (displayTickets === 0 && !enableManualSelection) {
//                                                 return null;
//                                             }
//
//                                             return (
//                                                 <TableRow
//                                                     key={ticketTypeId}
//                                                     sx={{
//                                                         backgroundColor: "#F1F5F9",
//                                                         "&:last-child td, &:last-child th": {border: 0},
//                                                     }}
//                                                 >
//                                                     <TableCell align="center">
//                                                         <div
//                                                             className="font-inter font-medium text-xs sm:text-sm md:text-base lg:text-lg text-[#27337C]">
//                                                             {name}
//                                                         </div>
//                                                     </TableCell>
//                                                     <TableCell align="center">
//                                                         <div
//                                                             className="font-inter font-medium text-xs sm:text-sm md:text-base text-[#27337C]">
//                                                             {price.toFixed(2)} LKR
//                                                         </div>
//                                                     </TableCell>
//                                                     <TableCell align="center">
//                                                         {enableManualSelection ? (
//                                                             <div className="flex items-center justify-center space-x-2">
//                                                                 <button
//                                                                     onClick={() =>
//                                                                         handleTicketCountChange(ticketTypeId, -1)
//                                                                     }
//                                                                     className="p-1 rounded-full bg-[#E0E0E0] hover:bg-[#D0D0D0] transition-colors cursor-pointer"
//                                                                     aria-label={`Decrease ${name} tickets`}
//                                                                 >
//                                                                     <svg
//                                                                         xmlns="http://www.w3.org/2000/svg"
//                                                                         width="24"
//                                                                         height="24"
//                                                                         viewBox="0 0 24 24"
//                                                                     >
//                                                                         <path fill="#000"
//                                                                               d="M18 11H6a2 2 0 0 0 0 4h12a2 2 0 0 0 0-4"/>
//                                                                     </svg>
//                                                                 </button>
//                                                                 <span
//                                                                     className="font-inter text-xs sm:text-sm md:text-base text-[#000000]">
//                                   {displayTickets.toString().padStart(2, "0")}
//                                 </span>
//                                                                 <button
//                                                                     onClick={() =>
//                                                                         handleTicketCountChange(ticketTypeId, 1)
//                                                                     }
//                                                                     className="p-1 rounded-full bg-[#E0E0E0] hover:bg-[#D0D0D0] transition-colors cursor-pointer"
//                                                                     aria-label={`Increase ${name} tickets`}
//                                                                 >
//                                                                     <svg
//                                                                         xmlns="http://www.w3.org/2000/svg"
//                                                                         width="24"
//                                                                         height="24"
//                                                                         viewBox="0 0 24 24"
//                                                                     >
//                                                                         <path
//                                                                             fill="#000"
//                                                                             d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4"
//                                                                         />
//                                                                     </svg>
//                                                                 </button>
//                                                             </div>
//                                                         ) : (
//                                                             <div
//                                                                 className="font-inter text-xs sm:text-sm md:text-base text-[#000000]">
//                                                                 {displayTickets.toString().padStart(2, "0")}
//                                                             </div>
//                                                         )}
//                                                     </TableCell>
//                                                     <TableCell align="center">
//                                                         <div
//                                                             className="font-inter text-xs sm:text-sm md:text-base text-[#000000]">
//                                                             {displayAmount} LKR
//                                                         </div>
//                                                     </TableCell>
//                                                 </TableRow>
//                                             );
//                                         })}
//                                         <TableRow sx={{backgroundColor: "#F1F5F9"}}>
//                                             <TableCell align="center">
//                                                 <div
//                                                     className="font-inter font-semibold text-sm sm:text-base md:text-lg text-[#27337C]">
//                                                     Total
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell align="center"></TableCell>
//                                             <TableCell align="center">
//                                                 <div
//                                                     className="font-inter font-bold text-xs sm:text-sm md:text-base text-[#27337C]">
//                                                     {totalTickets}
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell align="center">
//                                                 <div
//                                                     className="font-inter font-bold text-xs sm:text-sm md:text-base text-[#27337C]">
//                                                     {totalAmount}
//                                                 </div>
//                                             </TableCell>
//                                         </TableRow>
//                                     </TableBody>
//                                 </Table>
//                             </TableContainer>
//                             <div
//                                 className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#F1F5F9] rounded-md px-4 sm:px-8 lg:px-12 py-3 sm:py-4 mt-4 gap-2 sm:gap-4">
//                                 <div
//                                     className="font-inter text-[#27337C] text-sm sm:text-base md:text-lg font-semibold">
//                                     Seat Numbers
//                                 </div>
//                                 <div
//                                     className="font-inter font-medium text-[#27337C] text-xs sm:text-sm md:text-base flex-1 text-left sm:text-center">
//                                     {selectedSeatNumbers || "None"}
//                                 </div>
//                                 <div className="flex gap-2 sm:gap-4">
//                                     <button
//                                         onClick={handleReset}
//                                         className="bg-white cursor-pointer font-inter font-medium text-xs sm:text-sm md:text-base text-[#27337C] border-2 border-[#27337C] px-6 sm:px-8 md:px-10 py-2 rounded-md hover:bg-blue-50 transition-colors w-full sm:w-auto"
//                                     >
//                                         Reset
//                                     </button>
//                                     <button
//                                         onClick={handleProceed}
//                                         className="bg-[#27337C] cursor-pointer font-inter font-medium text-xs sm:text-sm md:text-base text-white px-6 sm:px-8 md:px-10 py-2 rounded-md hover:bg-[#1e264f] transition-colors w-full sm:w-auto"
//                                     >
//                                         Proceed
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//
//             <LoginGuestModal
//                 isOpen={isLoginModalOpen}
//                 onClose={() => setIsLoginModalOpen(false)}
//                 onSignIn={handleSignInAndProceed}
//                 onContinueAsGuest={handleContinueAsGuestAndProceed}
//             />
//         </div>
//     );
// };
//
// const SeatBookingPage: React.FC = () => {
//     const hero: Hero = {
//         image: "/payment-successful-hero.png",
//         title: "Seat Booking",
//         subTitle: "Discover your favorite entertainment right here",
//     };
//
//     return (
//         <div className="min-h-screen bg-white">
//             <HeroSection hero={hero}/>
//             <Suspense
//                 fallback={
//                     <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
//                         <CircularProgress size={50} sx={{color: "#27337C"}}/>
//                         <div className="mt-4 text-lg text-gray-600">Loading seat booking...</div>
//                     </div>
//                 }
//             >
//                 <SeatBookingContent/>
//             </Suspense>
//         </div>
//     );
// };
//
// export default SeatBookingPage;

// ------------------ uda tiyenne wada karana update timer ekata kalin eka


// ----------------------------------- final eka ------------------------
// "use client";
//
// import HeroSection from "@/components/HeroSection";
// import SectionTitle from "@/components/SectionTitle";
// import SeatSelection from "@/components/SeatSelection";
// import {
//     Alert,
//     CircularProgress,
//     Paper,
//     Table,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     TableBody, Snackbar,
// } from "@mui/material";
// import React, {useState, useEffect, useCallback, Suspense, useRef} from "react";
// import {useSeatByEventId, useUnseatSelectApi} from "@/hooks/useBooking";
// import {useRouter, useSearchParams} from "next/navigation";
// import LoginGuestModal from "@/components/LoginGuestModal";
// import {useCurrentUser} from "@/util/auth";
// import SeatBookingPageSkeleton from "@/components/skeletons/SeatBookingPageSkeleton";
// import {useTimer} from "@/context/TimerContext";
//
// interface SeatData {
//     price: number;
//     seatId: string;
//     status: string;
//     type_id: number;
//     ticketTypeName?: string;
//     color?: string;
// }
//
// interface ApiSeat {
//     price: number;
//     seatId: string;
//     status: string;
//     type_id: number;
//     ticketTypeName?: string;
//     color?: string;
// }
//
// type UseSeatByEventIdData = ApiSeat[] | { data: ApiSeat[] } | { seats: ApiSeat[] } | null | undefined;
//
// interface Category {
//     name: string;
//     price: number;
//     ticketTypeId: number;
// }
//
// interface TableRowData {
//     category: string;
//     price: string;
//     tickets: string;
//     amount: string;
//     ticketTypeId: number;
//     enableManualSelection: boolean;
// }
//
// interface Hero {
//     image: string;
//     title: string;
//     subTitle: string;
// }
//
// interface TicketFromEventPage {
//     price: number;
//     ticketCount: number | null;
//     ticketTypeId: number;
//     ticketTypeName: string;
// }
//
// interface StoredBookingData {
//     selectedSeats: SeatData[];
//     manualTicketCounts: Record<number, number>;
//     eventTicketDetails: TicketFromEventPage[];
//     eventId: string;
//     timestamp: number;
// }
//
// const SeatBookingContent: React.FC = () => {
//     const searchParams = useSearchParams();
//     const router = useRouter();
//     const eventId = searchParams.get("eventId") || "3";
//     const rawTicketDetails = searchParams.get("ticketDetails");
//     const location = searchParams.get("location");
//     const mapId = location?.split(" ")[0].toLowerCase();
//
//     const user = useCurrentUser();
//     const isAuthenticated = !!user;
//
//     const unselectSeatMutation = useUnseatSelectApi();
//
//     const [eventTicketDetails, setEventTicketDetails] = useState<TicketFromEventPage[]>([]);
//     const [currentSeatData, setCurrentSeatData] = useState<SeatData[]>([]);
//     const [selectedSeats, setSelectedSeats] = useState<SeatData[]>([]);
//     const [manualTicketCounts, setManualTicketCounts] = useState<Record<number, number>>({});
//     const [ticketTypesExistInApi, setTicketTypesExistInApi] = useState<Record<number, boolean>>({});
//     const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//     const [errorMessage, setErrorMessage] = useState<string | null>(null);
//     const [isResetting, setIsResetting] = useState(false);
//     const [showResetDialog, setShowResetDialog] = useState(false);
//     const [restorationStatus, setRestorationStatus] = useState<'loading' | 'success' | 'failed' | null>(null);
//
//     const {timeLeft, startTimer, stopTimer, resetTimer, isWarning} = useTimer();
//     const isInitialLoad = useRef(true);
//
//     const {data: apiSeatData, isLoading, error: eventError} = useSeatByEventId(eventId) as {
//         data: UseSeatByEventIdData;
//         isLoading: boolean;
//         error: Error | null;
//     };
//
//     console.log(showResetDialog, restorationStatus);
//
//     // Save booking data to localStorage
//     const saveBookingDataToLocalStorage = useCallback((
//         seats: SeatData[],
//         manualCounts: Record<number, number>,
//         ticketDetails: TicketFromEventPage[]
//     ) => {
//         const bookingData: StoredBookingData = {
//             selectedSeats: seats,
//             manualTicketCounts: manualCounts,
//             eventTicketDetails: ticketDetails,
//             eventId: eventId,
//             timestamp: Date.now()
//         };
//         localStorage.setItem("tempBookingData", JSON.stringify(bookingData));
//     }, [eventId]);
//
//     // Load initial ticket details from URL and restore booking data
//     useEffect(() => {
//         if (rawTicketDetails) {
//             try {
//                 const parsedDetails: TicketFromEventPage[] = JSON.parse(rawTicketDetails);
//                 setEventTicketDetails(parsedDetails);
//
//                 const initialManualCounts: Record<number, number> = {};
//                 parsedDetails.forEach((ticket) => {
//                     initialManualCounts[ticket.ticketTypeId] = 0;
//                 });
//
//                 // Try to restore booking data from localStorage
//                 const storedData = localStorage.getItem("tempBookingData");
//                 if (storedData && isInitialLoad.current) {
//                     try {
//                         const parsedStoredData: StoredBookingData = JSON.parse(storedData);
//
//                         // Check if stored data is for the same event and not too old (1 hour)
//                         const isDataValid = parsedStoredData.eventId === eventId &&
//                             parsedStoredData.eventTicketDetails?.length === parsedDetails.length &&
//                             parsedStoredData.eventTicketDetails.every((storedTicket, index) =>
//                                 storedTicket.ticketTypeId === parsedDetails[index].ticketTypeId &&
//                                 storedTicket.ticketTypeName === parsedDetails[index].ticketTypeName &&
//                                 storedTicket.price === parsedDetails[index].price
//                             ) &&
//                             (Date.now() - parsedStoredData.timestamp) < 3600000; // 1 hour
//
//                         if (isDataValid) {
//                             setRestorationStatus('loading');
//                             setSelectedSeats(parsedStoredData.selectedSeats || []);
//                             setManualTicketCounts(parsedStoredData.manualTicketCounts || initialManualCounts);
//
//                             // Show restoration success message
//                             setTimeout(() => {
//                                 setRestorationStatus('success');
//                                 setTimeout(() => setRestorationStatus(null), 3000);
//                             }, 1000);
//                         } else {
//                             // Clear invalid data
//                             setManualTicketCounts(initialManualCounts);
//                             localStorage.removeItem("tempBookingData");
//                             localStorage.removeItem("bookingSummaryToBill");
//                         }
//                     } catch (e) {
//                         console.error("Failed to parse stored booking data:", e);
//                         setManualTicketCounts(initialManualCounts);
//                         localStorage.removeItem("tempBookingData");
//                         localStorage.removeItem("bookingSummaryToBill");
//                         setRestorationStatus('failed');
//                         setTimeout(() => setRestorationStatus(null), 3000);
//                     }
//                 } else {
//                     setManualTicketCounts(initialManualCounts);
//                 }
//             } catch (e) {
//                 console.error("Failed to parse ticket details from URL:", e);
//                 setEventTicketDetails([]);
//                 setManualTicketCounts({});
//                 localStorage.removeItem("tempBookingData");
//                 localStorage.removeItem("bookingSummaryToBill");
//             }
//         }
//         isInitialLoad.current = false;
//     }, [rawTicketDetails, eventId]);
//
//     // Process API seat data
//     useEffect(() => {
//         let dataToProcess: ApiSeat[] = [];
//         const isDataWithSeatsProperty = (data: UseSeatByEventIdData): data is { seats: ApiSeat[] } => {
//             return typeof data === 'object' && data !== null && 'seats' in data && Array.isArray(data.seats);
//         };
//
//         const isDataWithDataProperty = (data: UseSeatByEventIdData): data is { data: ApiSeat[] } => {
//             return typeof data === 'object' && data !== null && 'data' in data && Array.isArray(data.data);
//         };
//
//         if (Array.isArray(apiSeatData)) {
//             dataToProcess = apiSeatData;
//         } else if (isDataWithDataProperty(apiSeatData)) {
//             dataToProcess = apiSeatData.data;
//         } else if (isDataWithSeatsProperty(apiSeatData)) {
//             dataToProcess = apiSeatData.seats;
//         } else {
//             console.warn('PAGE: useEffect - apiSeatData is not in an expected array format, defaulting to empty array.');
//         }
//
//         const transformedData: SeatData[] = dataToProcess
//             .filter((seat) => seat.seatId && seat.seatId.trim() !== "")
//             .map((seat) => {
//                 const validStatuses = ["available", "booked", "selected", "unavailable"] as const;
//                 const status = validStatuses.includes(seat.status as "available" | "booked" | "selected" | "unavailable")
//                     ? (seat.status as SeatData['status'])
//                     : 'unavailable';
//                 const price = parseFloat(String(seat.price)) || 0;
//                 const type_id = parseInt(String(seat.type_id), 10) || 0;
//
//                 const matchingEventTicket = eventTicketDetails.find(
//                     (eventTicket) => eventTicket.ticketTypeId === type_id
//                 );
//
//                 return {
//                     seatId: seat.seatId,
//                     status: status === "selected" || status === "unavailable" ? "unavailable" : status,
//                     price,
//                     type_id,
//                     ticketTypeName: matchingEventTicket
//                         ? matchingEventTicket.ticketTypeName
//                         : seat.ticketTypeName,
//                     color: seat.color,
//                 };
//             });
//
//         const ticketTypeExistence: Record<number, boolean> = {};
//         eventTicketDetails.forEach((eventTicket) => {
//             const hasSeatsInApi = transformedData.some(
//                 (seat) => seat.type_id === eventTicket.ticketTypeId
//             );
//             ticketTypeExistence[eventTicket.ticketTypeId] = hasSeatsInApi;
//         });
//         setTicketTypesExistInApi(ticketTypeExistence);
//         setCurrentSeatData(transformedData);
//     }, [apiSeatData, eventTicketDetails]);
//
//     // Auto-save booking data whenever selections change
//     useEffect(() => {
//         if (selectedSeats.length > 0 || Object.values(manualTicketCounts).some(count => count > 0)) {
//             saveBookingDataToLocalStorage(selectedSeats, manualTicketCounts, eventTicketDetails);
//         }
//     }, [selectedSeats, manualTicketCounts, eventTicketDetails, saveBookingDataToLocalStorage]);
//
//     // Timer management
//     useEffect(() => {
//         const hasSelections = selectedSeats.length > 0 || Object.values(manualTicketCounts).some((count) => count > 0);
//
//         if (hasSelections && timeLeft === null) {
//             startTimer(3 * 60); // Start timer at 15 minutes
//         } else if (!hasSelections && timeLeft !== null) {
//             stopTimer();
//         }
//     }, [selectedSeats.length, manualTicketCounts, timeLeft, startTimer, stopTimer]);
//
//     // Enhanced reset function with better error handling
//     // const handleReset = useCallback(async () => {
//     //     if (isResetting) return;
//     //
//     //     setIsResetting(true);
//     //     setErrorMessage(null);
//     //
//     //     try {
//     //         // Unselect all seats via API
//     //         if (selectedSeats.length > 0) {
//     //             console.log("Unselecting seats:", selectedSeats.map(s => s.seatId));
//     //
//     //             const unselectPromises = selectedSeats.map(async (seat) => {
//     //                 try {
//     //                     await unselectSeatMutation.mutateAsync({
//     //                         event_id: eventId,
//     //                         seat_id: seat.seatId,
//     //                     });
//     //                     console.log(`Successfully unselected seat: ${seat.seatId}`);
//     //                 } catch (error) {
//     //                     console.error(`Failed to unselect seat ${seat.seatId}:`, error);
//     //                     throw error;
//     //                 }
//     //             });
//     //
//     //             await Promise.all(unselectPromises);
//     //             console.log("All selected seats have been unselected via API.");
//     //         }
//     //
//     //         // Reset local state
//     //         setSelectedSeats([]);
//     //         const resetManualCounts: Record<number, number> = {};
//     //         eventTicketDetails.forEach((ticket) => {
//     //             resetManualCounts[ticket.ticketTypeId] = 0;
//     //         });
//     //         setManualTicketCounts(resetManualCounts);
//     //
//     //         // Clear localStorage
//     //         localStorage.removeItem("tempBookingData");
//     //         localStorage.removeItem("bookingSummaryToBill");
//     //
//     //         // Reset timer
//     //         resetTimer();
//     //
//     //         setShowResetDialog(false);
//     //     } catch (error) {
//     //         console.error("Error during reset:", error);
//     //         setErrorMessage("Failed to reset some seats. Please try again or refresh the page.");
//     //     } finally {
//     //         setIsResetting(false);
//     //     }
//     // }, [eventId, selectedSeats, eventTicketDetails, unselectSeatMutation, resetTimer, isResetting]);
//
//     // const handleReset = useCallback(async (isTimerExpired = false) => {
//     //     if (isResetting) return;
//     //
//     //     setIsResetting(true);
//     //     setErrorMessage(null);
//     //
//     //     try {
//     //         // Only show dialog if manually triggered, not when timer expires
//     //         if (!isTimerExpired) {
//     //             setShowResetDialog(false);
//     //         }
//     //
//     //         // Unselect all seats via API
//     //         if (selectedSeats.length > 0) {
//     //             console.log("Unselecting seats:", selectedSeats.map(s => s.seatId));
//     //
//     //             const unselectPromises = selectedSeats.map(async (seat) => {
//     //                 try {
//     //                     await unselectSeatMutation.mutateAsync({
//     //                         event_id: eventId,
//     //                         seat_id: seat.seatId,
//     //                     });
//     //                     console.log(`Successfully unselected seat: ${seat.seatId}`);
//     //                 } catch (error) {
//     //                     console.error(`Failed to unselect seat ${seat.seatId}:`, error);
//     //                     throw error;
//     //                 }
//     //             });
//     //
//     //             await Promise.all(unselectPromises);
//     //             console.log("All selected seats have been unselected via API.");
//     //         }
//     //
//     //         // Reset local state
//     //         setSelectedSeats([]);
//     //         const resetManualCounts: Record<number, number> = {};
//     //         eventTicketDetails.forEach((ticket) => {
//     //             resetManualCounts[ticket.ticketTypeId] = 0;
//     //         });
//     //         setManualTicketCounts(resetManualCounts);
//     //
//     //         // Clear localStorage
//     //         localStorage.removeItem("tempBookingData");
//     //         localStorage.removeItem("bookingSummaryToBill");
//     //
//     //         // Reset timer
//     //         resetTimer();
//     //
//     //         // Show appropriate message
//     //         if (isTimerExpired) {
//     //             setErrorMessage("Your booking time has expired. All selected seats have been reset.");
//     //             setTimeout(() => setErrorMessage(null), 5000);
//     //         }
//     //
//     //     } catch (error) {
//     //         console.error("Error during reset:", error);
//     //         setErrorMessage("Failed to reset some seats. Please try again or refresh the page.");
//     //     } finally {
//     //         setIsResetting(false);
//     //     }
//     // }, [eventId, selectedSeats, eventTicketDetails, unselectSeatMutation, resetTimer, isResetting]);
//
//     const handleReset = useCallback(async (isTimerExpired = false) => {
//         if (isResetting) return;
//
//         setIsResetting(true);
//         setErrorMessage(null);
//
//         try {
//             // Only show dialog if manually triggered, not when timer expires
//             if (!isTimerExpired) {
//                 setShowResetDialog(false);
//             }
//
//             // Unselect all seats via API, but continue even if some fail
//             if (selectedSeats.length > 0) {
//                 console.log("Unselecting seats:", selectedSeats.map(s => s.seatId));
//
//                 const unselectPromises = selectedSeats.map(async (seat) => {
//                     try {
//                         await unselectSeatMutation.mutateAsync({
//                             event_id: eventId,
//                             seat_id: seat.seatId,
//                         });
//                         console.log(`Successfully unselected seat: ${seat.seatId}`);
//                     } catch (error) {
//                         console.warn(`Failed to unselect seat ${seat.seatId}:`, error);
//                         // Continue without throwing to avoid blocking the reset
//                     }
//                 });
//
//                 await Promise.all(unselectPromises);
//                 console.log("Finished attempting to unselect seats via API.");
//             }
//
//             // Reset local state
//             setSelectedSeats([]);
//             const resetManualCounts: Record<number, number> = {};
//             eventTicketDetails.forEach((ticket) => {
//                 resetManualCounts[ticket.ticketTypeId] = 0;
//             });
//             setManualTicketCounts(resetManualCounts);
//
//             // Clear localStorage
//             localStorage.removeItem("tempBookingData");
//             localStorage.removeItem("bookingSummaryToBill");
//
//             // Reset timer
//             resetTimer();
//
//             // Show appropriate message
//             if (isTimerExpired) {
//                 setErrorMessage("Your booking time has expired. All selected seats have been reset.");
//                 setTimeout(() => setErrorMessage(null), 5000);
//             }
//         } catch (error) {
//             console.error("Unexpected error during reset:", error);
//             setErrorMessage("An unexpected error occurred. Please try again or refresh the page.");
//         } finally {
//             setIsResetting(false);
//         }
//     }, [eventId, selectedSeats, eventTicketDetails, unselectSeatMutation, resetTimer, isResetting]);
//
//     // Reset seats when timer reaches 0
//     // useEffect(() => {
//     //     if (timeLeft === 0) {
//     //         console.log("Timer expired - auto-resetting seats");
//     //         handleReset();
//     //     }
//     // }, [timeLeft, handleReset]);
//
//     useEffect(() => {
//         if (timeLeft === 0) {
//             console.log("Timer expired - auto-resetting seats");
//             handleReset(true); // Pass true to indicate timer expiration
//         }
//     }, [timeLeft, handleReset]);
//
//     const handleManualReset = useCallback(() => {
//         handleReset(false); // Pass false for manual reset
//     }, [handleReset]);
//
//     // Handle seat selection changes
//     const handleSelectedSeatsChange = useCallback((newSelectedSeats: SeatData[]) => {
//         setSelectedSeats(newSelectedSeats);
//     }, []);
//
//     // Handle manual ticket count changes
//     const handleTicketCountChange = useCallback(
//         (ticketTypeId: number, delta: number) => {
//             setManualTicketCounts((prevCounts) => {
//                 const newCount = Math.max(0, (prevCounts[ticketTypeId] || 0) + delta);
//                 return {
//                     ...prevCounts,
//                     [ticketTypeId]: newCount,
//                 };
//             });
//         },
//         []
//     );
//
//     // Determine if manual ticket selection is enabled
//     const shouldEnableManualSelection = (ticketTypeId: number): boolean => {
//         return ticketTypesExistInApi[ticketTypeId] === false;
//     };
//
//     // Prepare table data
//     const categories: Category[] = eventTicketDetails
//         .map((ticket) => ({
//             name: ticket.ticketTypeName,
//             price: ticket.price,
//             ticketTypeId: ticket.ticketTypeId,
//         }))
//         .sort((a, b) => a.price - b.price);
//
//     const rows: TableRowData[] = categories
//         .map(({name, price, ticketTypeId}) => {
//             const enableManualSelection = shouldEnableManualSelection(ticketTypeId);
//             const ticketsFromMap = selectedSeats.filter((seat) => {
//                 const originalSeatData = currentSeatData.find(
//                     (cs) => cs.seatId === seat.seatId
//                 );
//                 return originalSeatData?.type_id === ticketTypeId;
//             }).length;
//             const manualCount = manualTicketCounts[ticketTypeId] || 0;
//             const combinedTickets = enableManualSelection
//                 ? ticketsFromMap + manualCount
//                 : ticketsFromMap;
//             const amount = combinedTickets * price;
//
//             return {
//                 category: name,
//                 price: `${price.toFixed(2)} LKR`,
//                 tickets: combinedTickets.toString().padStart(2, "0"),
//                 amount: `${amount.toFixed(2)} LKR`,
//                 ticketTypeId: ticketTypeId,
//                 enableManualSelection,
//             };
//         })
//         .filter((row) => parseFloat(row.amount.replace(" LKR", "")) > 0 || row.enableManualSelection);
//
//     const totalTickets = rows
//         .reduce((sum, row) => sum + parseInt(row.tickets), 0)
//         .toString()
//         .padStart(2, "0");
//     const totalAmount =
//         rows
//             .reduce((sum, row) => sum + parseFloat(row.amount.replace(" LKR", "")), 0)
//             .toFixed(2) + " LKR";
//     const selectedSeatNumbers = selectedSeats
//         .filter((seat) => ticketTypesExistInApi[seat.type_id] === true)
//         .map((seat) => seat.seatId)
//         .join(", ");
//
//     // Save booking summary to local storage
//     const saveBookingSummaryToLocalStorage = useCallback(() => {
//         const bookingSummaryData = {
//             rows: rows.filter((row) => parseFloat(row.amount.replace(" LKR", "")) > 0),
//             totalTickets,
//             totalAmount,
//             selectedSeatNumbers,
//         };
//         localStorage.setItem("bookingSummaryToBill", JSON.stringify(bookingSummaryData));
//     }, [rows, totalTickets, totalAmount, selectedSeatNumbers]);
//
//     // Handle proceed to billing
//     const handleProceed = useCallback(() => {
//         const totalSelectedTickets = rows.reduce(
//             (sum, row) => sum + parseInt(row.tickets),
//             0
//         );
//         if (totalSelectedTickets === 0) {
//             alert("Please select at least one seat or add tickets manually to proceed.");
//             return;
//         }
//
//         saveBookingSummaryToLocalStorage();
//
//         if (isAuthenticated) {
//             router.push(
//                 `/billing-details?summary=${encodeURIComponent(
//                     localStorage.getItem("bookingSummaryToBill") || "{}"
//                 )}&eventId=${eventId}`
//             );
//         } else {
//             setIsLoginModalOpen(true);
//         }
//     }, [rows, isAuthenticated, router, saveBookingSummaryToLocalStorage, eventId]);
//
//     // Handle modal actions
//     const handleSignInAndProceed = useCallback(() => {
//         setIsLoginModalOpen(false);
//         router.push(
//             `/billing-details?summary=${encodeURIComponent(
//                 localStorage.getItem("bookingSummaryToBill") || "{}"
//             )}&eventId=${eventId}`
//         );
//     }, [router, eventId]);
//
//     const handleContinueAsGuestAndProceed = useCallback(() => {
//         setIsLoginModalOpen(false);
//         router.push(
//             `/billing-details?summary=${encodeURIComponent(
//                 localStorage.getItem("bookingSummaryToBill") || "{}"
//             )}&eventId=${eventId}`
//         );
//     }, [router, eventId]);
//
//     const formatTimeLeft = (seconds: number | null): { minutes: string; seconds: string } => {
//         if (seconds === null) return {minutes: "", seconds: ""};
//         const minutes = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return {
//             minutes: minutes.toString().padStart(2, "0"),
//             seconds: secs.toString().padStart(2, "0"),
//         };
//     };
//
//     if (isLoading) {
//         return (
//             <div className="py-4 px-2 sm:px-4 lg:px-6">
//                 <div className="max-w-7xl mx-auto">
//                     <SectionTitle title="Seat Booking"/>
//                     <div className="mt-4 sm:mt-6 py-8 sm:py-12">
//                         <SeatBookingPageSkeleton/>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
//
//     if (eventError) {
//         return (
//             <div className="min-h-screen flex justify-center items-center p-4">
//                 <Alert severity="error" sx={{maxWidth: 500}}>
//                     <div className="text-lg font-semibold mb-2">
//                         Error Loading Seat Information
//                     </div>
//                     <div>{eventError && <div>Seat data error: {eventError.message}</div>}</div>
//                     <div className="mt-2 text-sm">Please refresh the page to try again.</div>
//                 </Alert>
//             </div>
//         );
//     }
//
//     return (
//         <div className="py-4 px-2 sm:px-4 lg:px-6">
//             <div className="max-w-7xl mx-auto">
//                 <SectionTitle title="Seat Booking"/>
//                 <div className="mt-1 sm:mt-6 py-4 sm:py-12">
//                     {/*{errorMessage && (*/}
//                     {/*    <Alert severity="error" sx={{mb: 2}} onClose={() => setErrorMessage(null)}>*/}
//                     {/*        {errorMessage}*/}
//                     {/*    </Alert>*/}
//                     {/*)}*/}
//                     {errorMessage && (
//                         <Alert severity="error" sx={{mb: 2}} onClose={() => setErrorMessage(null)}>
//                             {errorMessage}
//                         </Alert>
//                     )}
//                     <Snackbar open={isWarning} anchorOrigin={{vertical: "top", horizontal: "center"}}>
//                         <Alert severity="warning">
//                             Your booking time is almost up! Only {timeLeft} seconds remain.
//                         </Alert>
//                     </Snackbar>
//                     <div className="w-full overflow-x-auto">
//                         {/*{timeLeft !== null ? (*/}
//                         {/*    <div*/}
//                         {/*        className="text-right relative w-full md:w-2/3 flex flex-row gap-5 items-center mx-auto justify-end p-4 overflow-hidden">*/}
//                         {/*        <h3 className="text-[#27337C] font-semibold text-sm md:text-base lg:text-lg">*/}
//                         {/*            Time remaining for*/}
//                         {/*            booking:*/}
//                         {/*        </h3>*/}
//                         {/*        <div className="flex items-center gap-2">*/}
//                         {/*            <div*/}
//                         {/*                className="bg-white rounded-sm text-center justify-center w-8 h-8 md:w-10 md:h-10 border-2 border-[#27337C]">*/}
//                         {/*                <div*/}
//                         {/*                    className="text-sm justify-center md:text-lg lg:text-xl font-inter text-[#27337C] font-semibold">*/}
//                         {/*                    {formatTimeLeft(timeLeft).minutes}*/}
//                         {/*                </div>*/}
//                         {/*            </div>*/}
//                         {/*            <div className="flex flex-col space-y-2 justify-center items-center px-1">*/}
//                         {/*                <div className="w-1.5 h-1.5 rounded-md bg-[#27337C]"/>*/}
//                         {/*                <div className="w-1.5 h-1.5 rounded-md bg-[#27337C]"/>*/}
//                         {/*            </div>*/}
//                         {/*            <div*/}
//                         {/*                className="bg-white text-blue-900 rounded-sm justify-center text-center w-8 h-8 md:w-10 md:h-10 border-2 border-[#27337C]">*/}
//                         {/*                <div*/}
//                         {/*                    className="text-sm md:text-lg lg:text-xl font-inter text-[#27337C] font-semibold">*/}
//                         {/*                    {formatTimeLeft(timeLeft).seconds}*/}
//                         {/*                </div>*/}
//                         {/*            </div>*/}
//                         {/*        </div>*/}
//                         {/*    </div>*/}
//                         {/*) : (*/}
//                         {/*    <h3 className="text-[#27337C] font-semibold text-sm md:text-base lg:text-lg text-right relative w-full md:w-2/3 flex flex-row gap-5 items-center mx-auto justify-end p-4 overflow-hidden">*/}
//                         {/*        Please select your tickets*/}
//                         {/*    </h3>*/}
//                         {/*)}*/}
//
//                         {timeLeft !== null ? (
//                             <div
//                                 className={`text-right relative w-full md:w-2/3 flex flex-row gap-5 items-center mx-auto justify-end p-4 overflow-hidden transition-all duration-300 ${
//                                     isWarning ? "bg-yellow-100 rounded-lg" : ""
//                                 }`}
//                             >
//                                 <h3 className="text-[#27337C] font-semibold text-sm md:text-base lg:text-lg">
//                                     Time remaining for booking:
//                                 </h3>
//                                 <div className="flex items-center gap-2">
//                                     <div
//                                         className={`bg-white rounded-sm text-center justify-center w-8 h-8 md:w-10 md:h-10 border-2 border-[#27337C] ${
//                                             isWarning ? "animate-pulse" : ""
//                                         }`}
//                                     >
//                                         <div
//                                             className="text-sm justify-center md:text-lg lg:text-xl font-inter text-[#27337C] font-semibold">
//                                             {formatTimeLeft(timeLeft).minutes}
//                                         </div>
//                                     </div>
//                                     <div className="flex flex-col space-y-2 justify-center items-center px-1">
//                                         <div className="w-1.5 h-1.5 rounded-md bg-[#27337C]"/>
//                                         <div className="w-1.5 h-1.5 rounded-md bg-[#27337C]"/>
//                                     </div>
//                                     <div
//                                         className={`bg-white text-blue-900 rounded-sm justify-center text-center w-8 h-8 md:w-10 md:h-10 border-2 border-[#27337C] ${
//                                             isWarning ? "animate-pulse" : ""
//                                         }`}
//                                     >
//                                         <div
//                                             className="text-sm md:text-lg lg:text-xl font-inter text-[#27337C] font-semibold">
//                                             {formatTimeLeft(timeLeft).seconds}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ) : (
//                             <h3 className="text-[#27337C] font-semibold text-sm md:text-base lg:text-lg text-right relative w-full md:w-2/3 flex flex-row gap-5 items-center mx-auto justify-end p-4 overflow-hidden">
//                                 Please select your tickets
//                             </h3>
//                         )}
//
//
//                         <SeatSelection
//                             mapId={mapId}
//                             eventId={eventId}
//                             initialSeatData={currentSeatData}
//                             onSeatSelect={handleSelectedSeatsChange}
//                             selectedSeatsFromParent={selectedSeats}
//                             // resetTrigger={resetTrigger}
//                         />
//                     </div>
//                     <div className="py-4 px-2 sm:px-4 lg:px-6">
//                         <div className="max-w-4xl mx-auto">
//                             <TableContainer
//                                 component={Paper}
//                                 sx={{
//                                     border: "none",
//                                     boxShadow: "none",
//                                     borderRadius: "8px",
//                                     overflowX: "auto",
//                                 }}
//                             >
//                                 <Table
//                                     sx={{
//                                         minWidth: {xs: 300, sm: 600, md: 650},
//                                         "& .MuiTableCell-root": {
//                                             borderColor: "#E7EAE9",
//                                             padding: {xs: "8px 4px", sm: "12px 8px", md: "16px"},
//                                         },
//                                     }}
//                                     aria-label="Seat booking summary table"
//                                 >
//                                     <TableHead>
//                                         <TableRow>
//                                             <TableCell align="center">
//                                                 <div
//                                                     className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#2D2A70]">
//                                                     Category
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell align="center">
//                                                 <div
//                                                     className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#2D2A70]">
//                                                     Price
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell align="center">
//                                                 <div
//                                                     className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#2D2A70]">
//                                                     Tickets
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell align="center">
//                                                 <div
//                                                     className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#2D2A70]">
//                                                     Amount
//                                                 </div>
//                                             </TableCell>
//                                         </TableRow>
//                                     </TableHead>
//                                     <TableBody>
//                                         {categories.map(({name, price, ticketTypeId}) => {
//                                             const enableManualSelection = shouldEnableManualSelection(
//                                                 ticketTypeId
//                                             );
//                                             const ticketsFromMap = selectedSeats.filter((seat) => {
//                                                 const originalSeatData = currentSeatData.find(
//                                                     (cs) => cs.seatId === seat.seatId
//                                                 );
//                                                 return originalSeatData?.type_id === ticketTypeId;
//                                             }).length;
//                                             const manualCount = manualTicketCounts[ticketTypeId] || 0;
//                                             const displayTickets = enableManualSelection
//                                                 ? ticketsFromMap + manualCount
//                                                 : ticketsFromMap;
//                                             const displayAmount = (displayTickets * price).toFixed(2);
//
//                                             if (displayTickets === 0 && !enableManualSelection) {
//                                                 return null;
//                                             }
//
//                                             return (
//                                                 <TableRow
//                                                     key={ticketTypeId}
//                                                     sx={{
//                                                         backgroundColor: "#F1F5F9",
//                                                         "&:last-child td, &:last-child th": {border: 0},
//                                                     }}
//                                                 >
//                                                     <TableCell align="center">
//                                                         <div
//                                                             className="font-inter font-medium text-xs sm:text-sm md:text-base lg:text-lg text-[#27337C]">
//                                                             {name}
//                                                         </div>
//                                                     </TableCell>
//                                                     <TableCell align="center">
//                                                         <div
//                                                             className="font-inter font-medium text-xs sm:text-sm md:text-base text-[#27337C]">
//                                                             {price.toFixed(2)} LKR
//                                                         </div>
//                                                     </TableCell>
//                                                     <TableCell align="center">
//                                                         {enableManualSelection ? (
//                                                             <div className="flex items-center justify-center space-x-2">
//                                                                 <button
//                                                                     onClick={() =>
//                                                                         handleTicketCountChange(ticketTypeId, -1)
//                                                                     }
//                                                                     className="p-1 rounded-full bg-[#E0E0E0] hover:bg-[#D0D0D0] transition-colors cursor-pointer"
//                                                                     aria-label={`Decrease ${name} tickets`}
//                                                                 >
//                                                                     <svg
//                                                                         xmlns="http://www.w3.org/2000/svg"
//                                                                         width="24"
//                                                                         height="24"
//                                                                         viewBox="0 0 24 24"
//                                                                     >
//                                                                         <path fill="#000"
//                                                                               d="M18 11H6a2 2 0 0 0 0 4h12a2 2 0 0 0 0-4"/>
//                                                                     </svg>
//                                                                 </button>
//                                                                 <span
//                                                                     className="font-inter text-xs sm:text-sm md:text-base text-[#000000]">
//                                   {displayTickets.toString().padStart(2, "0")}
//                                 </span>
//                                                                 <button
//                                                                     onClick={() =>
//                                                                         handleTicketCountChange(ticketTypeId, 1)
//                                                                     }
//                                                                     className="p-1 rounded-full bg-[#E0E0E0] hover:bg-[#D0D0D0] transition-colors cursor-pointer"
//                                                                     aria-label={`Increase ${name} tickets`}
//                                                                 >
//                                                                     <svg
//                                                                         xmlns="http://www.w3.org/2000/svg"
//                                                                         width="24"
//                                                                         height="24"
//                                                                         viewBox="0 0 24 24"
//                                                                     >
//                                                                         <path
//                                                                             fill="#000"
//                                                                             d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4"
//                                                                         />
//                                                                     </svg>
//                                                                 </button>
//                                                             </div>
//                                                         ) : (
//                                                             <div
//                                                                 className="font-inter text-xs sm:text-sm md:text-base text-[#000000]">
//                                                                 {displayTickets.toString().padStart(2, "0")}
//                                                             </div>
//                                                         )}
//                                                     </TableCell>
//                                                     <TableCell align="center">
//                                                         <div
//                                                             className="font-inter text-xs sm:text-sm md:text-base text-[#000000]">
//                                                             {displayAmount} LKR
//                                                         </div>
//                                                     </TableCell>
//                                                 </TableRow>
//                                             );
//                                         })}
//                                         <TableRow sx={{backgroundColor: "#F1F5F9"}}>
//                                             <TableCell align="center">
//                                                 <div
//                                                     className="font-inter font-semibold text-sm sm:text-base md:text-lg text-[#27337C]">
//                                                     Total
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell align="center"></TableCell>
//                                             <TableCell align="center">
//                                                 <div
//                                                     className="font-inter font-bold text-xs sm:text-sm md:text-base text-[#27337C]">
//                                                     {totalTickets}
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell align="center">
//                                                 <div
//                                                     className="font-inter font-bold text-xs sm:text-sm md:text-base text-[#27337C]">
//                                                     {totalAmount}
//                                                 </div>
//                                             </TableCell>
//                                         </TableRow>
//                                     </TableBody>
//                                 </Table>
//                             </TableContainer>
//                             <div
//                                 className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#F1F5F9] rounded-md px-4 sm:px-8 lg:px-12 py-3 sm:py-4 mt-4 gap-2 sm:gap-4">
//                                 <div
//                                     className="font-inter text-[#27337C] text-sm sm:text-base md:text-lg font-semibold">
//                                     Seat Numbers
//                                 </div>
//                                 <div
//                                     className="font-inter font-medium text-[#27337C] text-xs sm:text-sm md:text-base flex-1 text-left sm:text-center">
//                                     {selectedSeatNumbers || "None"}
//                                 </div>
//                                 <div className="flex gap-2 sm:gap-4">
//                                     {/*<button*/}
//                                     {/*    onClick={handleReset}*/}
//                                     {/*    className="bg-white cursor-pointer font-inter font-medium text-xs sm:text-sm md:text-base text-[#27337C] border-2 border-[#27337C] px-6 sm:px-8 md:px-10 py-2 rounded-md hover:bg-blue-50 transition-colors w-full sm:w-auto"*/}
//                                     {/*>*/}
//                                     {/*    Reset*/}
//                                     {/*</button>*/}
//                                     <button
//                                         onClick={handleManualReset}
//                                         disabled={isResetting}
//                                         className="bg-white cursor-pointer font-inter font-medium text-xs sm:text-sm md:text-base text-[#27337C] border-2 border-[#27337C] px-6 sm:px-8 md:px-10 py-2 rounded-md hover:bg-blue-50 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
//                                     >
//                                         {isResetting ? 'Resetting...' : 'Reset'}
//                                     </button>
//                                     <button
//                                         onClick={handleProceed}
//                                         className="bg-[#27337C] cursor-pointer font-inter font-medium text-xs sm:text-sm md:text-base text-white px-6 sm:px-8 md:px-10 py-2 rounded-md hover:bg-[#1e264f] transition-colors w-full sm:w-auto"
//                                     >
//                                         Proceed
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//
//             <LoginGuestModal
//                 isOpen={isLoginModalOpen}
//                 onClose={() => setIsLoginModalOpen(false)}
//                 onSignIn={handleSignInAndProceed}
//                 onContinueAsGuest={handleContinueAsGuestAndProceed}
//             />
//         </div>
//     );
// };
//
// const SeatBookingPage: React.FC = () => {
//     const hero: Hero = {
//         image: "/payment-successful-hero.png",
//         title: "Seat Booking",
//         subTitle: "Discover your favorite entertainment right here",
//     };
//
//     return (
//         <div className="min-h-screen bg-white">
//             <HeroSection hero={hero}/>
//             <Suspense
//                 fallback={
//                     <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
//                         <CircularProgress size={50} sx={{color: "#27337C"}}/>
//                         <div className="mt-4 text-lg text-gray-600">Loading seat booking...</div>
//                     </div>
//                 }
//             >
//                 <SeatBookingContent/>
//             </Suspense>
//         </div>
//     );
// };
//
// export default SeatBookingPage;

// ------------------------------------------------------------------------

//wada krapu eka without countdown
// "use client";
//
// import HeroSection from "@/components/HeroSection";
// import SectionTitle from "@/components/SectionTitle";
// import SeatSelection from "@/components/SeatSelection";
// import {
//     Alert,
//     CircularProgress,
//     Paper,
//     Table,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     TableBody,
// } from "@mui/material";
// import React, {useState, useEffect, useCallback, Suspense} from "react";
// import {useSeatByEventId, useUnseatSelectApi} from "@/hooks/useBooking";
// import {useRouter, useSearchParams} from "next/navigation";
// import LoginGuestModal from "@/components/LoginGuestModal";
// import {useCurrentUser} from "@/util/auth";
// import SeatBookingPageSkeleton from "@/components/skeletons/SeatBookingPageSkeleton";
//
// interface SeatData {
//     price: number;
//     seatId: string;
//     status: string;
//     type_id: number;
//     ticketTypeName?: string;
//     color?: string;
// }
//
// interface ApiSeat {
//     price: number;
//     seatId: string;
//     status: string;
//     type_id: number;
//     ticketTypeName?: string;
//     color?: string;
// }
//
// type UseSeatByEventIdData = ApiSeat[] | { data: ApiSeat[] } | { seats: ApiSeat[] } | null | undefined;
//
// interface Category {
//     name: string;
//     price: number;
//     ticketTypeId: number;
// }
//
// interface TableRowData {
//     category: string;
//     price: string;
//     tickets: string;
//     amount: string;
//     ticketTypeId: number;
//     enableManualSelection: boolean;
// }
//
// interface Hero {
//     image: string;
//     title: string;
//     subTitle: string;
// }
//
// interface TicketFromEventPage {
//     price: number;
//     ticketCount: number | null;
//     ticketTypeId: number;
//     ticketTypeName: string;
// }
//
// interface StoredBookingData {
//     selectedSeats: SeatData[];
//     manualTicketCounts: Record<number, number>;
//     eventTicketDetails: TicketFromEventPage[];
// }
//
// const SeatBookingContent: React.FC = () => {
//     const searchParams = useSearchParams();
//     const router = useRouter();
//     const eventId = searchParams.get("eventId") || "3";
//     const rawTicketDetails = searchParams.get("ticketDetails");
//     const location = searchParams.get("location");
//     const mapId = location?.split(" ")[0].toLowerCase();
//
//     const user = useCurrentUser();
//     const isAuthenticated = !!user;
//
//     const [eventTicketDetails, setEventTicketDetails] = useState<TicketFromEventPage[]>([]);
//     const [currentSeatData, setCurrentSeatData] = useState<SeatData[]>([]);
//     const [selectedSeats, setSelectedSeats] = useState<SeatData[]>([]);
//     const [manualTicketCounts, setManualTicketCounts] = useState<Record<number, number>>({});
//     const [ticketTypesExistInApi, setTicketTypesExistInApi] = useState<Record<number, boolean>>({});
//     const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//
//     const {data: apiSeatData, isLoading, error: eventError} = useSeatByEventId(eventId) as {
//         data: UseSeatByEventIdData;
//         isLoading: boolean;
//         error: Error | null;
//     };
//
//     const unselectSeatMutation = useUnseatSelectApi();
//
//     // Load initial ticket details from URL and restore booking data from localStorage
//     useEffect(() => {
//         // Parse ticket details from URL
//         if (rawTicketDetails) {
//             try {
//                 const parsedDetails: TicketFromEventPage[] = JSON.parse(rawTicketDetails);
//                 setEventTicketDetails(parsedDetails);
//                 const initialManualCounts: Record<number, number> = {};
//                 parsedDetails.forEach((ticket) => {
//                     initialManualCounts[ticket.ticketTypeId] = 0;
//                 });
//
//                 // Restore booking data from localStorage if it exists
//                 const storedData = localStorage.getItem("tempBookingData");
//                 if (storedData) {
//                     try {
//                         const parsedStoredData: StoredBookingData = JSON.parse(storedData);
//                         if (parsedStoredData.eventTicketDetails?.length === parsedDetails.length &&
//                             parsedStoredData.eventTicketDetails.every((storedTicket, index) =>
//                                 storedTicket.ticketTypeId === parsedDetails[index].ticketTypeId &&
//                                 storedTicket.ticketTypeName === parsedDetails[index].ticketTypeName &&
//                                 storedTicket.price === parsedDetails[index].price
//                             )) {
//                             setSelectedSeats(parsedStoredData.selectedSeats || []);
//                             setManualTicketCounts(parsedStoredData.manualTicketCounts || initialManualCounts);
//                         } else {
//                             // If event ticket details don't match, reset localStorage
//                             setManualTicketCounts(initialManualCounts);
//                             localStorage.removeItem("tempBookingData");
//                             localStorage.removeItem("bookingSummaryToBill");
//                         }
//                     } catch (e) {
//                         console.error("Failed to parse stored booking data:", e);
//                         setManualTicketCounts(initialManualCounts);
//                         localStorage.removeItem("tempBookingData");
//                         localStorage.removeItem("bookingSummaryToBill");
//                     }
//                 } else {
//                     setManualTicketCounts(initialManualCounts);
//                 }
//             } catch (e) {
//                 console.error("Failed to parse ticket details from URL:", e);
//                 setEventTicketDetails([]);
//                 setManualTicketCounts({});
//                 localStorage.removeItem("tempBookingData");
//                 localStorage.removeItem("bookingSummaryToBill");
//             }
//         }
//     }, [rawTicketDetails]);
//
//     // Process API seat data
//     useEffect(() => {
//         let dataToProcess: ApiSeat[] = [];
//         const isDataWithSeatsProperty = (data: UseSeatByEventIdData): data is { seats: ApiSeat[] } => {
//             return typeof data === 'object' && data !== null && 'seats' in data && Array.isArray(data.seats);
//         };
//
//         const isDataWithDataProperty = (data: UseSeatByEventIdData): data is { data: ApiSeat[] } => {
//             return typeof data === 'object' && data !== null && 'data' in data && Array.isArray(data.data);
//         };
//
//         if (Array.isArray(apiSeatData)) {
//             dataToProcess = apiSeatData;
//         } else if (isDataWithDataProperty(apiSeatData)) {
//             dataToProcess = apiSeatData.data;
//         } else if (isDataWithSeatsProperty(apiSeatData)) {
//             dataToProcess = apiSeatData.seats;
//         } else {
//             console.warn('PAGE: useEffect - apiSeatData is not in an expected array format, defaulting to empty array.');
//         }
//
//         const transformedData: SeatData[] = dataToProcess
//             .filter((seat) => seat.seatId && seat.seatId.trim() !== "")
//             .map((seat) => {
//                 const validStatuses = ["available", "booked", "selected", "unavailable"] as const;
//                 const status = validStatuses.includes(seat.status as "available" | "booked" | "selected" | "unavailable")
//                     ? (seat.status as SeatData['status'])
//                     : 'unavailable';
//                 const price = parseFloat(String(seat.price)) || 0;
//                 const type_id = parseInt(String(seat.type_id), 10) || 0;
//
//                 const matchingEventTicket = eventTicketDetails.find(
//                     (eventTicket) => eventTicket.ticketTypeId === type_id
//                 );
//
//                 return {
//                     seatId: seat.seatId,
//                     status: status === "selected" || status === "unavailable" ? "unavailable" : status,
//                     price,
//                     type_id,
//                     ticketTypeName: matchingEventTicket
//                         ? matchingEventTicket.ticketTypeName
//                         : seat.ticketTypeName,
//                     color: seat.color,
//                 };
//             });
//
//         const ticketTypeExistence: Record<number, boolean> = {};
//         eventTicketDetails.forEach((eventTicket) => {
//             const hasSeatsInApi = transformedData.some(
//                 (seat) => seat.type_id === eventTicket.ticketTypeId
//             );
//             ticketTypeExistence[eventTicket.ticketTypeId] = hasSeatsInApi;
//         });
//         setTicketTypesExistInApi(ticketTypeExistence);
//         setCurrentSeatData(transformedData);
//     }, [apiSeatData, eventTicketDetails]);
//
//     // Save booking data to localStorage whenever selectedSeats or manualTicketCounts change
//     useEffect(() => {
//         const dataToStore: StoredBookingData = {
//             selectedSeats,
//             manualTicketCounts,
//             eventTicketDetails,
//         };
//         localStorage.setItem("tempBookingData", JSON.stringify(dataToStore));
//     }, [selectedSeats, manualTicketCounts, eventTicketDetails]);
//
//     // Handle seat selection changes
//     const handleSelectedSeatsChange = useCallback((newSelectedSeats: SeatData[]) => {
//         setSelectedSeats(newSelectedSeats);
//     }, []);
//
//     // Handle manual ticket count changes
//     const handleTicketCountChange = useCallback(
//         (ticketTypeId: number, delta: number) => {
//             setManualTicketCounts((prevCounts) => {
//                 const newCount = Math.max(0, (prevCounts[ticketTypeId] || 0) + delta);
//                 return {
//                     ...prevCounts,
//                     [ticketTypeId]: newCount,
//                 };
//             });
//         },
//         []
//     );
//
//     // Determine if manual ticket selection is enabled
//     const shouldEnableManualSelection = (ticketTypeId: number): boolean => {
//         return ticketTypesExistInApi[ticketTypeId] === false;
//     };
//
//     // Prepare table data
//     const categories: Category[] = eventTicketDetails
//         .map((ticket) => ({
//             name: ticket.ticketTypeName,
//             price: ticket.price,
//             ticketTypeId: ticket.ticketTypeId,
//         }))
//         .sort((a, b) => a.price - b.price);
//
//     const rows: TableRowData[] = categories
//         .map(({name, price, ticketTypeId}) => {
//             const enableManualSelection = shouldEnableManualSelection(ticketTypeId);
//             const ticketsFromMap = selectedSeats.filter((seat) => {
//                 const originalSeatData = currentSeatData.find(
//                     (cs) => cs.seatId === seat.seatId
//                 );
//                 return originalSeatData?.type_id === ticketTypeId;
//             }).length;
//             const manualCount = manualTicketCounts[ticketTypeId] || 0;
//             const combinedTickets = enableManualSelection
//                 ? ticketsFromMap + manualCount
//                 : ticketsFromMap;
//             const amount = combinedTickets * price;
//
//             return {
//                 category: name,
//                 price: `${price.toFixed(2)} LKR`,
//                 tickets: combinedTickets.toString().padStart(2, "0"),
//                 amount: `${amount.toFixed(2)} LKR`,
//                 ticketTypeId: ticketTypeId,
//                 enableManualSelection,
//             };
//         })
//         .filter((row) => parseFloat(row.amount.replace(" LKR", "")) > 0 || row.enableManualSelection);
//
//     const totalTickets = rows
//         .reduce((sum, row) => sum + parseInt(row.tickets), 0)
//         .toString()
//         .padStart(2, "0");
//     const totalAmount =
//         rows
//             .reduce((sum, row) => sum + parseFloat(row.amount.replace(" LKR", "")), 0)
//             .toFixed(2) + " LKR";
//     const selectedSeatNumbers = selectedSeats
//         .filter((seat) => ticketTypesExistInApi[seat.type_id] === true)
//         .map((seat) => seat.seatId)
//         .join(", ");
//
//     // Save booking summary to local storage
//     const saveBookingDataToLocalStorage = useCallback(() => {
//         const bookingSummaryData = {
//             rows: rows.filter((row) => parseFloat(row.amount.replace(" LKR", "")) > 0),
//             totalTickets,
//             totalAmount,
//             selectedSeatNumbers,
//         };
//         localStorage.setItem("bookingSummaryToBill", JSON.stringify(bookingSummaryData));
//     }, [rows, totalTickets, totalAmount, selectedSeatNumbers]);
//
//     // Handle proceed to billing
//     const handleProceed = useCallback(() => {
//         const totalSelectedTickets = rows.reduce(
//             (sum, row) => sum + parseInt(row.tickets),
//             0
//         );
//         if (totalSelectedTickets === 0) {
//             alert("Please select at least one seat or add tickets manually to proceed.");
//             return;
//         }
//
//         saveBookingDataToLocalStorage();
//
//         if (isAuthenticated) {
//             router.push(
//                 `/billing-details?summary=${encodeURIComponent(
//                     localStorage.getItem("bookingSummaryToBill") || "{}"
//                 )}&eventId=${eventId}`
//             );
//         } else {
//             setIsLoginModalOpen(true);
//         }
//     }, [rows, saveBookingDataToLocalStorage, isAuthenticated, router, eventId]);
//
//     // Handle modal actions
//     const handleSignInAndProceed = useCallback(() => {
//         setIsLoginModalOpen(false);
//         router.push(
//             `/billing-details?summary=${encodeURIComponent(
//                 localStorage.getItem("bookingSummaryToBill") || "{}"
//             )}&eventId=${eventId}`
//         );
//     }, [eventId, router]);
//
//     const handleContinueAsGuestAndProceed = useCallback(() => {
//         setIsLoginModalOpen(false);
//         router.push(
//             `/billing-details?summary=${encodeURIComponent(
//                 localStorage.getItem("bookingSummaryToBill") || "{}"
//             )}&eventId=${eventId}`
//         );
//     }, [eventId, router]);
//
//     // Handle reset of selections
//     // const handleReset = useCallback(() => {
//     //     setSelectedSeats([]);
//     //     const resetManualCounts: Record<number, number> = {};
//     //     eventTicketDetails.forEach((ticket) => {
//     //         resetManualCounts[ticket.ticketTypeId] = 0;
//     //     });
//     //     setManualTicketCounts(resetManualCounts);
//     //     localStorage.removeItem("tempBookingData");
//     //     localStorage.removeItem("bookingSummaryToBill");
//     // }, [eventTicketDetails]);
//
//
//     const handleReset = useCallback(async () => {
//         try {
//             if (selectedSeats.length > 0) {
//                 const unselectPromises = selectedSeats.map((seat) =>
//                     unselectSeatMutation.mutateAsync({
//                         event_id: eventId,
//                         seat_id: seat.seatId,
//                     })
//                 );
//                 await Promise.all(unselectPromises);
//                 console.log("All selected seats have been unselected via API.");
//             }
//         } catch (error) {
//             console.error("Error unseating seats:", error);
//             // setErrorMessage("Failed to unselect seats. Please try again.");
//         }
//
//         setSelectedSeats([]);
//         const resetManualCounts: Record<number, number> = {};
//         eventTicketDetails.forEach((ticket) => {
//             resetManualCounts[ticket.ticketTypeId] = 0;
//         });
//         setManualTicketCounts(resetManualCounts);
//
//         localStorage.removeItem("tempBookingData");
//         localStorage.removeItem("bookingSummaryToBill");
//
//         // if (timerRef.current) {
//         //     clearInterval(timerRef.current);
//         //     timerRef.current = null;
//         //     setTimeLeft(null);
//         //     hasStartedTimer.current = false;
//         // }
//     }, [eventTicketDetails, selectedSeats, unselectSeatMutation, eventId]);
//
//
//     if (isLoading) {
//         return (
//             <div className="py-4 px-2 sm:px-4 lg:px-6">
//                 <div className="max-w-7xl mx-auto">
//                     <SectionTitle title="Seat Booking"/>
//                     <div className="mt-4 sm:mt-6 py-8 sm:py-12">
//                         <SeatBookingPageSkeleton/>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
//
//     if (eventError) {
//         return (
//             <div className="min-h-screen flex justify-center items-center p-4">
//                 <Alert severity="error" sx={{maxWidth: 500}}>
//                     <div className="text-lg font-semibold mb-2">
//                         Error Loading Seat Information
//                     </div>
//                     <div>{eventError && <div>Seat data error: {eventError.message}</div>}</div>
//                     <div className="mt-2 text-sm">Please refresh the page to try again.</div>
//                 </Alert>
//             </div>
//         );
//     }
//
//     return (
//         <div className="py-4 px-2 sm:px-4 lg:px-6">
//             <div className="max-w-7xl mx-auto">
//                 <SectionTitle title="Seat Booking"/>
//                 <div className="mt-4 sm:mt-6 py-8 sm:py-12">
//                     <div className="w-full overflow-x-auto">
//                         <div
//                             className="text-right relative w-full md:w-2/3 flex flex-row gap-5 items-center mx-auto justify-end p-4 overflow-hidden">
//                             <h3 className="text-[#27337C] font-semibold text-sm md:text-base lg:text-lg">Please Waiting
//                                 For Your Booking</h3>
//                             <div className="flex items-center gap-2">
//                                 <div
//                                     className="bg-white text-blue-900 rounded-sm text-center w-10 h-10 border-2 border-[#27337C]">
//                                     <div
//                                         className="text-sm md:text-lg lg:text-xl font-inter text-[#27337C] font-semibold">67
//                                     </div>
//                                 </div>
//                                 <div
//                                     className="hidden md:block md:flex flex-col space-y-2 justify-center items-center px-1">
//                                     <div className="w-1.5 h-1.5 rounded-md bg-[#27337C]"/>
//                                     <div className="w-1.5 h-1.5 rounded-md bg-[#27337C]"/>
//                                 </div>
//                                 <div
//                                     className="bg-white text-blue-900 rounded-sm justify-center text-center w-10 h-10 border-2 border-[#27337C]">
//                                     <div
//                                         className="text-sm md:text-lg lg:text-xl font-inter text-[#27337C] font-semibold">65
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <SeatSelection
//                             mapId={mapId}
//                             eventId={eventId}
//                             initialSeatData={currentSeatData}
//                             onSeatSelect={handleSelectedSeatsChange}
//                             selectedSeatsFromParent={selectedSeats}
//                         />
//                     </div>
//                     <div className="py-4 px-2 sm:px-4 lg:px-6">
//                         <div className="max-w-4xl mx-auto">
//                             <TableContainer
//                                 component={Paper}
//                                 sx={{
//                                     border: "none",
//                                     boxShadow: "none",
//                                     borderRadius: "8px",
//                                     overflowX: "auto",
//                                 }}
//                             >
//                                 <Table
//                                     sx={{
//                                         minWidth: {xs: 300, sm: 600, md: 650},
//                                         "& .MuiTableCell-root": {
//                                             borderColor: "#E7EAE9",
//                                             padding: {xs: "8px 4px", sm: "12px 8px", md: "16px"},
//                                         },
//                                     }}
//                                     aria-label="Seat booking summary table"
//                                 >
//                                     <TableHead>
//                                         <TableRow>
//                                             <TableCell align="center">
//                                                 <div
//                                                     className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#2D2A70]">
//                                                     Category
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell align="center">
//                                                 <div
//                                                     className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#2D2A70]">
//                                                     Price
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell align="center">
//                                                 <div
//                                                     className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#2D2A70]">
//                                                     Tickets
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell align="center">
//                                                 <div
//                                                     className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#2D2A70]">
//                                                     Amount
//                                                 </div>
//                                             </TableCell>
//                                         </TableRow>
//                                     </TableHead>
//                                     <TableBody>
//                                         {categories.map(({name, price, ticketTypeId}) => {
//                                             const enableManualSelection = shouldEnableManualSelection(
//                                                 ticketTypeId
//                                             );
//                                             const ticketsFromMap = selectedSeats.filter((seat) => {
//                                                 const originalSeatData = currentSeatData.find(
//                                                     (cs) => cs.seatId === seat.seatId
//                                                 );
//                                                 return originalSeatData?.type_id === ticketTypeId;
//                                             }).length;
//                                             const manualCount = manualTicketCounts[ticketTypeId] || 0;
//                                             const displayTickets = enableManualSelection
//                                                 ? ticketsFromMap + manualCount
//                                                 : ticketsFromMap;
//                                             const displayAmount = (displayTickets * price).toFixed(2);
//
//                                             if (displayTickets === 0 && !enableManualSelection) {
//                                                 return null;
//                                             }
//
//                                             return (
//                                                 <TableRow
//                                                     key={ticketTypeId}
//                                                     sx={{
//                                                         backgroundColor: "#F1F5F9",
//                                                         "&:last-child td, &:last-child th": {border: 0},
//                                                     }}
//                                                 >
//                                                     <TableCell align="center">
//                                                         <div
//                                                             className="font-inter font-medium text-xs sm:text-sm md:text-base lg:text-lg text-[#27337C]">
//                                                             {name}
//                                                         </div>
//                                                     </TableCell>
//                                                     <TableCell align="center">
//                                                         <div
//                                                             className="font-inter font-medium text-xs sm:text-sm md:text-base text-[#27337C]">
//                                                             {price.toFixed(2)} LKR
//                                                         </div>
//                                                     </TableCell>
//                                                     <TableCell align="center">
//                                                         {enableManualSelection ? (
//                                                             <div className="flex items-center justify-center space-x-2">
//                                                                 <button
//                                                                     onClick={() =>
//                                                                         handleTicketCountChange(ticketTypeId, -1)
//                                                                     }
//                                                                     className="p-1 rounded-full bg-[#E0E0E0] hover:bg-[#D0D0D0] transition-colors cursor-pointer"
//                                                                     aria-label={`Decrease ${name} tickets`}
//                                                                 >
//                                                                     <svg
//                                                                         xmlns="http://www.w3.org/2000/svg"
//                                                                         width="24"
//                                                                         height="24"
//                                                                         viewBox="0 0 24 24"
//                                                                     >
//                                                                         <path fill="#000"
//                                                                               d="M18 11H6a2 2 0 0 0 0 4h12a2 2 0 0 0 0-4"/>
//                                                                     </svg>
//                                                                 </button>
//                                                                 <span
//                                                                     className="font-inter text-xs sm:text-sm md:text-base text-[#000000]">
//                                   {displayTickets.toString().padStart(2, "0")}
//                                 </span>
//                                                                 <button
//                                                                     onClick={() =>
//                                                                         handleTicketCountChange(ticketTypeId, 1)
//                                                                     }
//                                                                     className="p-1 rounded-full bg-[#E0E0E0] hover:bg-[#D0D0D0] transition-colors cursor-pointer"
//                                                                     aria-label={`Increase ${name} tickets`}
//                                                                 >
//                                                                     <svg
//                                                                         xmlns="http://www.w3.org/2000/svg"
//                                                                         width="24"
//                                                                         height="24"
//                                                                         viewBox="0 0 24 24"
//                                                                     >
//                                                                         <path
//                                                                             fill="#000"
//                                                                             d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4"
//                                                                         />
//                                                                     </svg>
//                                                                 </button>
//                                                             </div>
//                                                         ) : (
//                                                             <div
//                                                                 className="font-inter text-xs sm:text-sm md:text-base text-[#000000]">
//                                                                 {displayTickets.toString().padStart(2, "0")}
//                                                             </div>
//                                                         )}
//                                                     </TableCell>
//                                                     <TableCell align="center">
//                                                         <div
//                                                             className="font-inter text-xs sm:text-sm md:text-base text-[#000000]">
//                                                             {displayAmount} LKR
//                                                         </div>
//                                                     </TableCell>
//                                                 </TableRow>
//                                             );
//                                         })}
//                                         <TableRow sx={{backgroundColor: "#F1F5F9"}}>
//                                             <TableCell align="center">
//                                                 <div
//                                                     className="font-inter font-semibold text-sm sm:text-base md:text-lg text-[#27337C]">
//                                                     Total
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell align="center"></TableCell>
//                                             <TableCell align="center">
//                                                 <div
//                                                     className="font-inter font-bold text-xs sm:text-sm md:text-base text-[#27337C]">
//                                                     {totalTickets}
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell align="center">
//                                                 <div
//                                                     className="font-inter font-bold text-xs sm:text-sm md:text-base text-[#27337C]">
//                                                     {totalAmount}
//                                                 </div>
//                                             </TableCell>
//                                         </TableRow>
//                                     </TableBody>
//                                 </Table>
//                             </TableContainer>
//                             <div
//                                 className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#F1F5F9] rounded-md px-4 sm:px-8 lg:px-12 py-3 sm:py-4 mt-4 gap-2 sm:gap-4">
//                                 <div
//                                     className="font-inter text-[#27337C] text-sm sm:text-base md:text-lg font-semibold">
//                                     Seat Numbers
//                                 </div>
//                                 <div
//                                     className="font-inter font-medium text-[#27337C] text-xs sm:text-sm md:text-base flex-1 text-left sm:text-center">
//                                     {selectedSeatNumbers || "None"}
//                                 </div>
//                                 <div className="flex gap-2 sm:gap-4">
//                                     <button
//                                         onClick={handleReset}
//                                         className="bg-white cursor-pointer font-inter font-medium text-xs sm:text-sm md:text-base text-[#27337C] border-2 border-[#27337C] px-6 sm:px-8 md:px-10 py-2 rounded-md hover:bg-blue-50 transition-colors w-full sm:w-auto"
//                                     >
//                                         Reset
//                                     </button>
//                                     <button
//                                         onClick={handleProceed}
//                                         className="bg-[#27337C] cursor-pointer font-inter font-medium text-xs sm:text-sm md:text-base text-white px-6 sm:px-8 md:px-10 py-2 rounded-md hover:bg-[#1e264f] transition-colors w-full sm:w-auto"
//                                     >
//                                         Proceed
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//
//             <LoginGuestModal
//                 isOpen={isLoginModalOpen}
//                 onClose={() => setIsLoginModalOpen(false)}
//                 onSignIn={handleSignInAndProceed}
//                 onContinueAsGuest={handleContinueAsGuestAndProceed}
//             />
//         </div>
//     );
// };
//
// const SeatBookingPage: React.FC = () => {
//     const hero: Hero = {
//         image: "/payment-successful-hero.png",
//         title: "Seat Booking",
//         subTitle: "Discover your favorite entertainment right here",
//     };
//
//     return (
//         <div className="min-h-screen bg-white">
//             <HeroSection hero={hero}/>
//             <Suspense
//                 fallback={
//                     <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
//                         <CircularProgress size={50} sx={{color: "#27337C"}}/>
//                         <div className="mt-4 text-lg text-gray-600">Loading seat booking...</div>
//                     </div>
//                 }
//             >
//                 <SeatBookingContent/>
//             </Suspense>
//         </div>
//     );
// };
//
// export default SeatBookingPage;


// "use client";
//
// import { useState, useEffect, useCallback, useMemo, Suspense, useRef } from "react";
// import { useSeatByEventId, useUnseatSelectApi } from "@/hooks/useBooking";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useCurrentUser } from "@/util/auth";
// import { useTimer } from "@/context/TimerContext";
// import { debounce } from "lodash";
// import {
//     Alert,
//     CircularProgress,
//     Paper,
//     Table,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     TableBody,
//     Snackbar,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     Button,
// } from "@mui/material";
// import HeroSection from "@/components/HeroSection";
// import SectionTitle from "@/components/SectionTitle";
// import dynamic from "next/dynamic";
// import LoginGuestModal from "@/components/LoginGuestModal";
// import SeatBookingPageSkeleton from "@/components/skeletons/SeatBookingPageSkeleton";
//
// const SeatSelection = dynamic(() => import("@/components/SeatSelection"), {
//     ssr: false,
//     loading: () => <CircularProgress sx={{ color: "#27337C", mx: "auto", my: 4 }} />,
// });
//
// interface SeatData {
//     price: number;
//     seatId: string;
//     status: string;
//     type_id: number;
//     ticketTypeName?: string;
//     color?: string;
// }
//
// interface ApiSeat {
//     price: number;
//     seatId: string;
//     status: string;
//     type_id: number;
//     ticketTypeName?: string;
//     color?: string;
// }
//
// type UseSeatByEventIdData = ApiSeat[] | { data: ApiSeat[] } | { seats: ApiSeat[] } | null | undefined;
//
// interface TicketFromEventPage {
//     price: number;
//     ticketCount: number | null;
//     ticketTypeId: number;
//     ticketTypeName: string;
// }
//
// interface StoredBookingData {
//     selectedSeats: SeatData[];
//     manualTicketCounts: Record<number, number>;
//     eventTicketDetails: TicketFromEventPage[];
//     eventId: string;
//     timestamp: number;
// }
//
// interface Category {
//     name: string;
//     price: number;
//     ticketTypeId: number;
// }
//
// interface TableRowData {
//     category: string;
//     price: string;
//     tickets: string;
//     amount: string;
//     ticketTypeId: number;
//     enableManualSelection: boolean;
// }
//
// interface Hero {
//     image: string;
//     title: string;
//     subTitle: string;
// }
//
// const TimerDisplay: React.FC<{ timeLeft: number | null; isWarning: boolean }> = ({ timeLeft, isWarning }) => {
//     if (timeLeft === null) {
//         return (
//             <h3 className="text-[#27337C] font-semibold text-sm md:text-base lg:text-lg text-right w-full md:w-2/3 mx-auto p-4">
//                 Please select your tickets
//             </h3>
//         );
//     }
//
//     const percentage = (timeLeft / (3 * 60)) * 100; // 3 minutes for demo
//     const { minutes, seconds } = formatTimeLeft(timeLeft);
//
//     return (
//         <div className={`w-full md:w-2/3 mx-auto p-4 ${isWarning ? "bg-yellow-100 rounded-lg" : ""}`}>
//             <div className="text-right text-[#27337C] font-semibold text-sm md:text-base lg:text-lg">
//                 Time remaining: {minutes}:{seconds}
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
//                 <div
//                     className={`h-2.5 rounded-full ${isWarning ? "bg-yellow-500" : "bg-[#27337C]"}`}
//                     style={{ width: `${percentage}%` }}
//                 ></div>
//             </div>
//         </div>
//     );
// };
//
// const formatTimeLeft = (seconds: number | null): { minutes: string; seconds: string } => {
//     if (seconds === null) return { minutes: "", seconds: "" };
//     const minutes = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return {
//         minutes: minutes.toString().padStart(2, "0"),
//         seconds: secs.toString().padStart(2, "0"),
//     };
// };
//
// const SeatBookingContent: React.FC = () => {
//     const searchParams = useSearchParams();
//     const router = useRouter();
//     const eventId = searchParams.get("eventId") || "3";
//     const rawTicketDetails = searchParams.get("ticketDetails");
//     const location = searchParams.get("location");
//     const mapId = location?.split(" ")[0].toLowerCase();
//
//     const user = useCurrentUser();
//     const isAuthenticated = !!user;
//     const unselectSeatMutation = useUnseatSelectApi();
//     const { timeLeft, startTimer, stopTimer, resetTimer, isWarning, isExtensionDialogOpen } = useTimer();
//     const isInitialLoad = useRef(true);
//
//     const [bookingState, setBookingState] = useState<{
//         selectedSeats: SeatData[];
//         manualTicketCounts: Record<number, number>;
//     }>({
//         selectedSeats: [],
//         manualTicketCounts: {},
//     });
//     const [eventTicketDetails, setEventTicketDetails] = useState<TicketFromEventPage[]>([]);
//     const [currentSeatData, setCurrentSeatData] = useState<SeatData[]>([]);
//     const [ticketTypesExistInApi, setTicketTypesExistInApi] = useState<Record<number, boolean>>({});
//     const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//     const [errorMessage, setErrorMessage] = useState<string | null>(null);
//     const [isResetting, setIsResetting] = useState(false);
//     const [showResetDialog, setShowResetDialog] = useState(false);
//     const [restorationStatus, setRestorationStatus] = useState<'loading' | 'success' | 'failed' | null>(null);
//
//     const { data: apiSeatData, isLoading, error: eventError } = useSeatByEventId(eventId) as {
//         data: UseSeatByEventIdData;
//         isLoading: boolean;
//         error: Error | null;
//     };
//
//     // Prefetch billing page
//     useEffect(() => {
//         router.prefetch("/billing-details");
//     }, [router]);
//
//     // Save booking data to localStorage
//     const saveBookingDataToLocalStorage = useCallback(
//         (seats: SeatData[], manualCounts: Record<number, number>, ticketDetails: TicketFromEventPage[]) => {
//             const bookingData: StoredBookingData = {
//                 selectedSeats: seats,
//                 manualTicketCounts: manualCounts,
//                 eventTicketDetails: ticketDetails,
//                 eventId,
//                 timestamp: Date.now(),
//             };
//             localStorage.setItem("tempBookingData", JSON.stringify(bookingData));
//         },
//         [eventId]
//     );
//
//     const debouncedSaveBookingData = useCallback(
//         debounce((seats, manualCounts, ticketDetails) => {
//             saveBookingDataToLocalStorage(seats, manualCounts, ticketDetails);
//         }, 500),
//         [saveBookingDataToLocalStorage]
//     );
//
//     // Load initial ticket details and restore booking data
//     useEffect(() => {
//         if (rawTicketDetails) {
//             try {
//                 const parsedDetails: TicketFromEventPage[] = JSON.parse(rawTicketDetails);
//                 setEventTicketDetails(parsedDetails);
//
//                 const initialManualCounts: Record<number, number> = {};
//                 parsedDetails.forEach((ticket) => {
//                     initialManualCounts[ticket.ticketTypeId] = 0;
//                 });
//
//                 const storedData = localStorage.getItem("tempBookingData");
//                 if (storedData && isInitialLoad.current) {
//                     const parsedStoredData: StoredBookingData = JSON.parse(storedData);
//                     if (
//                         parsedStoredData.eventId === eventId &&
//                         parsedStoredData.eventTicketDetails?.length === parsedDetails.length &&
//                         parsedStoredData.eventTicketDetails.every(
//                             (storedTicket, index) =>
//                                 storedTicket.ticketTypeId === parsedDetails[index].ticketTypeId &&
//                                 storedTicket.ticketTypeName === parsedDetails[index].ticketTypeName &&
//                                 storedTicket.price === parsedDetails[index].price
//                         ) &&
//                         Date.now() - parsedStoredData.timestamp < 3600000
//                     ) {
//                         setRestorationStatus("loading");
//                         setBookingState({
//                             selectedSeats: parsedStoredData.selectedSeats || [],
//                             manualTicketCounts: parsedStoredData.manualTicketCounts || initialManualCounts,
//                         });
//                         setRestorationStatus("success");
//                         setTimeout(() => setRestorationStatus(null), 3000);
//                     } else {
//                         setBookingState({ selectedSeats: [], manualTicketCounts: initialManualCounts });
//                         localStorage.removeItem("tempBookingData");
//                         localStorage.removeItem("bookingSummaryToBill");
//                         setRestorationStatus("failed");
//                         setTimeout(() => setRestorationStatus(null), 3000);
//                     }
//                 } else {
//                     setBookingState({ selectedSeats: [], manualTicketCounts: initialManualCounts });
//                 }
//             } catch (e) {
//                 console.error("Failed to parse ticket details:", e);
//                 setBookingState({ selectedSeats: [], manualTicketCounts: {} });
//                 localStorage.removeItem("tempBookingData");
//                 localStorage.removeItem("bookingSummaryToBill");
//                 setErrorMessage("Failed to load ticket details. Please try again.");
//             }
//         }
//         isInitialLoad.current = false;
//     }, [rawTicketDetails, eventId]);
//
//     // Process API seat data
//     useEffect(() => {
//         let dataToProcess: ApiSeat[] = [];
//         if (Array.isArray(apiSeatData)) {
//             dataToProcess = apiSeatData;
//         } else if (apiSeatData?.data && Array.isArray(apiSeatData.data)) {
//             dataToProcess = apiSeatData.data;
//         } else if (apiSeatData?.seats && Array.isArray(apiSeatData.seats)) {
//             dataToProcess = apiSeatData.seats;
//         }
//
//         const seatTypeMap = new Set(dataToProcess.map((seat) => seat.type_id));
//         const ticketTypeExistence: Record<number, boolean> = {};
//         eventTicketDetails.forEach((eventTicket) => {
//             ticketTypeExistence[eventTicket.ticketTypeId] = seatTypeMap.has(eventTicket.ticketTypeId);
//         });
//
//         const transformedData: SeatData[] = dataToProcess
//             .filter((seat) => seat.seatId && seat.seatId.trim() !== "")
//             .map((seat) => {
//                 const validStatuses = ["available", "booked", "selected", "unavailable"] as const;
//                 const status = validStatuses.includes(seat.status as any) ? seat.status : "unavailable";
//                 const price = parseFloat(String(seat.price)) || 0;
//                 const type_id = parseInt(String(seat.type_id), 10) || 0;
//                 const matchingEventTicket = eventTicketDetails.find(
//                     (eventTicket) => eventTicket.ticketTypeId === type_id
//                 );
//
//                 return {
//                     seatId: seat.seatId,
//                     status: status === "selected" || status === "unavailable" ? "unavailable" : status,
//                     price,
//                     type_id,
//                     ticketTypeName: matchingEventTicket?.ticketTypeName ?? seat.ticketTypeName,
//                     color: seat.color,
//                 };
//             });
//
//         setCurrentSeatData(transformedData);
//         setTicketTypesExistInApi(ticketTypeExistence);
//     }, [apiSeatData, eventTicketDetails]);
//
//     // Auto-save booking data
//     useEffect(() => {
//         if (
//             bookingState.selectedSeats.length > 0 ||
//             Object.values(bookingState.manualTicketCounts).some((count) => count > 0)
//         ) {
//             debouncedSaveBookingData(bookingState.selectedSeats, bookingState.manualTicketCounts, eventTicketDetails);
//         }
//     }, [bookingState, eventTicketDetails, debouncedSaveBookingData]);
//
//     // Timer management
//     useEffect(() => {
//         const hasSelections =
//             bookingState.selectedSeats.length > 0 ||
//             Object.values(bookingState.manualTicketCounts).some((count) => count > 0);
//
//         if (hasSelections && timeLeft === null) {
//             startTimer(3 * 60); // 3 minutes for demo
//         } else if (!hasSelections && timeLeft !== null) {
//             stopTimer();
//         }
//     }, [bookingState, timeLeft, startTimer, stopTimer]);
//
//     // Handle seat selection changes
//     const handleSelectedSeatsChange = useCallback((newSelectedSeats: SeatData[]) => {
//         setBookingState((prev) => ({ ...prev, selectedSeats: newSelectedSeats }));
//     }, []);
//
//     // Handle manual ticket count changes
//     const handleTicketCountChange = useCallback((ticketTypeId: number, delta: number) => {
//         setBookingState((prev) => ({
//             ...prev,
//             manualTicketCounts: {
//                 ...prev.manualTicketCounts,
//                 [ticketTypeId]: Math.max(0, (prev.manualTicketCounts[ticketTypeId] || 0) + delta),
//             },
//         }));
//     }, []);
//
//     // Determine if manual ticket selection is enabled
//     const shouldEnableManualSelection = useCallback(
//         (ticketTypeId: number): boolean => {
//             return ticketTypesExistInApi[ticketTypeId] === false;
//         },
//         [ticketTypesExistInApi]
//     );
//
//     // Memoized table data
//     const categories = useMemo(
//         () =>
//             eventTicketDetails
//                 .map(({ ticketTypeName, price, ticketTypeId }) => ({
//                     name: ticketTypeName,
//                     price,
//                     ticketTypeId,
//                 }))
//                 .sort((a, b) => a.price - b.price),
//         [eventTicketDetails]
//     );
//
//     const rows = useMemo(() => {
//         return categories
//             .map(({ name, price, ticketTypeId }) => {
//                 const enableManualSelection = shouldEnableManualSelection(ticketTypeId);
//                 const ticketsFromMap = bookingState.selectedSeats.filter(
//                     (seat) => currentSeatData.find((cs) => cs.seatId === seat.seatId)?.type_id === ticketTypeId
//                 ).length;
//                 const manualCount = bookingState.manualTicketCounts[ticketTypeId] || 0;
//                 const combinedTickets = enableManualSelection ? ticketsFromMap + manualCount : ticketsFromMap;
//                 const amount = combinedTickets * price;
//
//                 return {
//                     category: name,
//                     price: `${price.toFixed(2)} LKR`,
//                     tickets: combinedTickets.toString().padStart(2, "0"),
//                     amount: `${amount.toFixed(2)} LKR`,
//                     ticketTypeId,
//                     enableManualSelection,
//                 };
//             })
//             .filter((row) => parseFloat(row.amount.replace(" LKR", "")) > 0 || row.enableManualSelection);
//     }, [categories, bookingState, currentSeatData, shouldEnableManualSelection]);
//
//     const totalTickets = useMemo(
//         () => rows.reduce((sum, row) => sum + parseInt(row.tickets), 0).toString().padStart(2, "0"),
//         [rows]
//     );
//
//     const totalAmount = useMemo(
//         () => rows.reduce((sum, row) => sum + parseFloat(row.amount.replace(" LKR", "")), 0).toFixed(2) + " LKR",
//         [rows]
//     );
//
//     const selectedSeatNumbers = useMemo(
//         () =>
//             bookingState.selectedSeats
//                 .filter((seat) => ticketTypesExistInApi[seat.type_id] === true)
//                 .map((seat) => seat.seatId)
//                 .join(", "),
//         [bookingState.selectedSeats, ticketTypesExistInApi]
//     );
//
//     // Save booking summary to localStorage
//     const saveBookingSummaryToLocalStorage = useCallback(() => {
//         const bookingSummaryData = {
//             rows: rows.filter((row) => parseFloat(row.amount.replace(" LKR", "")) > 0),
//             totalTickets,
//             totalAmount,
//             selectedSeatNumbers,
//         };
//         localStorage.setItem("bookingSummaryToBill", JSON.stringify(bookingSummaryData));
//     }, [rows, totalTickets, totalAmount, selectedSeatNumbers]);
//
//     // Handle reset
//     const handleReset = useCallback(
//         async (isTimerExpired = false) => {
//             if (isResetting) return;
//             setIsResetting(true);
//             setErrorMessage(null);
//
//             try {
//                 if (!isTimerExpired) {
//                     setShowResetDialog(false);
//                 }
//
//                 if (bookingState.selectedSeats.length > 0) {
//                     const results = await unselectSeatMutation.mutateAsync({
//                         event_id: eventId,
//                         seat_ids: bookingState.selectedSeats.map((seat) => seat.seatId),
//                     });
//                     const failedSeats = results?.failed_seats || [];
//                     if (failedSeats.length > 0) {
//                         setErrorMessage(`Failed to unselect seats: ${failedSeats.join(", ")}. Please try again.`);
//                     }
//                 }
//
//                 setBookingState({
//                     selectedSeats: [],
//                     manualTicketCounts: eventTicketDetails.reduce((acc, ticket) => {
//                         acc[ticket.ticketTypeId] = 0;
//                         return acc;
//                     }, {} as Record<number, number>),
//                 });
//
//                 localStorage.removeItem("tempBookingData");
//                 localStorage.removeItem("bookingSummaryToBill");
//                 resetTimer();
//
//                 if (isTimerExpired) {
//                     setErrorMessage("Your booking time has expired. All selected seats have been reset.");
//                     setTimeout(() => setErrorMessage(null), 5000);
//                 }
//             } catch (error) {
//                 console.error("Reset failed:", error);
//                 setErrorMessage("Failed to reset seats. Please try again.");
//             } finally {
//                 setIsResetting(false);
//             }
//         },
//         [eventId, bookingState.selectedSeats, eventTicketDetails, unselectSeatMutation, resetTimer, isResetting]
//     );
//
//     // Handle timer expiration
//     useEffect(() => {
//         if (timeLeft === 0) {
//             handleReset(true);
//         }
//     }, [timeLeft, handleReset]);
//
//     // Handle manual reset
//     const handleManualReset = useCallback(() => {
//         setShowResetDialog(true);
//     }, []);
//
//     // Handle proceed to billing
//     const handleProceed = useCallback(() => {
//         const totalSelectedTickets = rows.reduce((sum, row) => sum + parseInt(row.tickets), 0);
//         if (totalSelectedTickets === 0) {
//             setErrorMessage("Please select at least one seat or add tickets manually to proceed.");
//             setTimeout(() => setErrorMessage(null), 5000);
//             return;
//         }
//
//         saveBookingSummaryToLocalStorage();
//
//         if (isAuthenticated) {
//             router.push(
//                 `/billing-details?summary=${encodeURIComponent(
//                     localStorage.getItem("bookingSummaryToBill") || "{}"
//                 )}&eventId=${eventId}`
//             );
//         } else {
//             setIsLoginModalOpen(true);
//         }
//     }, [rows, isAuthenticated, router, saveBookingSummaryToLocalStorage, eventId]);
//
//     // Handle modal actions
//     const handleSignInAndProceed = useCallback(() => {
//         setIsLoginModalOpen(false);
//         router.push(
//             `/billing-details?summary=${encodeURIComponent(
//                 localStorage.getItem("bookingSummaryToBill") || "{}"
//             )}&eventId=${eventId}`
//         );
//     }, [router, eventId]);
//
//     const handleContinueAsGuestAndProceed = useCallback(() => {
//         setIsLoginModalOpen(false);
//         router.push(
//             `/billing-details?summary=${encodeURIComponent(
//                 localStorage.getItem("bookingSummaryToBill") || "{}"
//             )}&eventId=${eventId}`
//         );
//     }, [router, eventId]);
//
//     if (isLoading) {
//         return (
//             <div className="py-4 px-2 sm:px-4 lg:px-6">
//                 <div className="max-w-7xl mx-auto">
//                     <SectionTitle title="Seat Booking" />
//                     <div className="mt-4 sm:mt-6 py-8 sm:py-12">
//                         <SeatBookingPageSkeleton />
//                     </div>
//                 </div>
//             </div>
//         );
//     }
//
//     if (eventError) {
//         return (
//             <div className="min-h-screen flex justify-center items-center p-4">
//                 <Alert severity="error" sx={{ maxWidth: 500 }}>
//                     <div className="text-lg font-semibold mb-2">Error Loading Seat Information</div>
//                     <div>{eventError.message}</div>
//                     <div className="mt-2 text-sm">Please refresh the page to try again.</div>
//                 </Alert>
//             </div>
//         );
//     }
//
//     return (
//         <div className="py-4 px-2 sm:px-4 lg:px-6">
//             <div className="max-w-7xl mx-auto">
//                 <SectionTitle title="Seat Booking" />
//                 <div className="mt-1 sm:mt-6 py-4 sm:py-12">
//                     {errorMessage && (
//                         <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage(null)}>
//                             {errorMessage}
//                         </Alert>
//                     )}
//                     {restorationStatus === "success" && (
//                         <Alert severity="success" sx={{ mb: 2 }}>
//                             Booking data restored from previous session.
//                         </Alert>
//                     )}
//                     {restorationStatus === "failed" && (
//                         <Alert severity="warning" sx={{ mb: 2 }}>
//                             Failed to restore previous booking data. Starting fresh.
//                         </Alert>
//                     )}
//                     <TimerDisplay timeLeft={timeLeft} isWarning={isWarning && !isExtensionDialogOpen} />
//                     <div className="w-full overflow-x-auto">
//                         <SeatSelection
//                             mapId={mapId}
//                             eventId={eventId}
//                             initialSeatData={currentSeatData}
//                             onSeatSelect={handleSelectedSeatsChange}
//                             selectedSeatsFromParent={bookingState.selectedSeats}
//                         />
//                     </div>
//                     <div className="py-4 px-2 sm:px-4 lg:px-6">
//                         <div className="max-w-4xl mx-auto">
//                             <TableContainer
//                                 component={Paper}
//                                 sx={{
//                                     border: "none",
//                                     boxShadow: "none",
//                                     borderRadius: "8px",
//                                     overflowX: "auto",
//                                 }}
//                             >
//                                 <Table
//                                     sx={{
//                                         minWidth: { xs: 300, sm: 600, md: 650 },
//                                         "& .MuiTableCell-root": {
//                                             borderColor: "#E7EAE9",
//                                             padding: { xs: "8px 4px", sm: "12px 8px", md: "16px" },
//                                         },
//                                     }}
//                                     aria-label="Seat booking summary table"
//                                 >
//                                     <TableHead>
//                                         <TableRow>
//                                             <TableCell align="center">
//                                                 <div className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#2D2A70]">
//                                                     Category
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell align="center">
//                                                 <div className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#2D2A70]">
//                                                     Price
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell align="center">
//                                                 <div className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#2D2A70]">
//                                                     Tickets
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell align="center">
//                                                 <div className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#2D2A70]">
//                                                     Amount
//                                                 </div>
//                                             </TableCell>
//                                         </TableRow>
//                                     </TableHead>
//                                     <TableBody>
//                                         {categories.map(({ name, price, ticketTypeId }) => {
//                                             const enableManualSelection = shouldEnableManualSelection(ticketTypeId);
//                                             const ticketsFromMap = bookingState.selectedSeats.filter(
//                                                 (seat) => currentSeatData.find((cs) => cs.seatId === seat.seatId)?.type_id === ticketTypeId
//                                             ).length;
//                                             const manualCount = bookingState.manualTicketCounts[ticketTypeId] || 0;
//                                             const displayTickets = enableManualSelection ? ticketsFromMap + manualCount : ticketsFromMap;
//                                             const displayAmount = (displayTickets * price).toFixed(2);
//
//                                             if (displayTickets === 0 && !enableManualSelection) {
//                                                 return null;
//                                             }
//
//                                             return (
//                                                 <TableRow
//                                                     key={ticketTypeId}
//                                                     sx={{
//                                                         backgroundColor: "#F1F5F9",
//                                                         "&:last-child td, &:last-child th": { border: 0 },
//                                                     }}
//                                                 >
//                                                     <TableCell align="center">
//                                                         <div className="font-inter font-medium text-xs sm:text-sm md:text-base lg:text-lg text-[#27337C]">
//                                                             {name}
//                                                         </div>
//                                                     </TableCell>
//                                                     <TableCell align="center">
//                                                         <div className="font-inter font-medium text-xs sm:text-sm md:text-base text-[#27337C]">
//                                                             {price.toFixed(2)} LKR
//                                                         </div>
//                                                     </TableCell>
//                                                     <TableCell align="center">
//                                                         {enableManualSelection ? (
//                                                             <div className="flex items-center justify-center space-x-2">
//                                                                 <button
//                                                                     onClick={() => handleTicketCountChange(ticketTypeId, -1)}
//                                                                     className="p-1 rounded-full bg-[#E0E0E0] hover:bg-[#D0D0D0] transition-colors cursor-pointer"
//                                                                     aria-label={`Decrease ${name} tickets`}
//                                                                 >
//                                                                     <svg
//                                                                         xmlns="http://www.w3.org/2000/svg"
//                                                                         width="24"
//                                                                         height="24"
//                                                                         viewBox="0 0 24 24"
//                                                                     >
//                                                                         <path fill="#000" d="M18 11H6a2 2 0 0 0 0 4h12a2 2 0 0 0 0-4" />
//                                                                     </svg>
//                                                                 </button>
//                                                                 <span className="font-inter text-xs sm:text-sm md:text-base text-[#000000]">
//                                   {displayTickets.toString().padStart(2, "0")}
//                                 </span>
//                                                                 <button
//                                                                     onClick={() => handleTicketCountChange(ticketTypeId, 1)}
//                                                                     className="p-1 rounded-full bg-[#E0E0E0] hover:bg-[#D0D0D0] transition-colors cursor-pointer"
//                                                                     aria-label={`Increase ${name} tickets`}
//                                                                 >
//                                                                     <svg
//                                                                         xmlns="http://www.w3.org/2000/svg"
//                                                                         width="24"
//                                                                         height="24"
//                                                                         viewBox="0 0 24 24"
//                                                                     >
//                                                                         <path
//                                                                             fill="#000"
//                                                                             d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4"
//                                                                         />
//                                                                     </svg>
//                                                                 </button>
//                                                             </div>
//                                                         ) : (
//                                                             <div className="font-inter text-xs sm:text-sm md:text-base text-[#000000]">
//                                                                 {displayTickets.toString().padStart(2, "0")}
//                                                             </div>
//                                                         )}
//                                                     </TableCell>
//                                                     <TableCell align="center">
//                                                         <div className="font-inter text-xs sm:text-sm md:text-base text-[#000000]">
//                                                             {displayAmount} LKR
//                                                         </div>
//                                                     </TableCell>
//                                                 </TableRow>
//                                             );
//                                         })}
//                                         <TableRow sx={{ backgroundColor: "#F1F5F9" }}>
//                                             <TableCell align="center">
//                                                 <div className="font-inter font-semibold text-sm sm:text-base md:text-lg text-[#27337C]">
//                                                     Total
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell align="center"></TableCell>
//                                             <TableCell align="center">
//                                                 <div className="font-inter font-bold text-xs sm:text-sm md:text-base text-[#27337C]">
//                                                     {totalTickets}
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell align="center">
//                                                 <div className="font-inter font-bold text-xs sm:text-sm md:text-base text-[#27337C]">
//                                                     {totalAmount}
//                                                 </div>
//                                             </TableCell>
//                                         </TableRow>
//                                     </TableBody>
//                                 </Table>
//                             </TableContainer>
//                             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#F1F5F9] rounded-md px-4 sm:px-8 lg:px-12 py-3 sm:py-4 mt-4 gap-2 sm:gap-4">
//                                 <div className="font-inter text-[#27337C] text-sm sm:text-base md:text-lg font-semibold">
//                                     Seat Numbers
//                                 </div>
//                                 <div className="font-inter font-medium text-[#27337C] text-xs sm:text-sm md:text-base flex-1 text-left sm:text-center">
//                                     {selectedSeatNumbers || "None"}
//                                 </div>
//                                 <div className="flex gap-2 sm:gap-4">
//                                     <button
//                                         onClick={handleManualReset}
//                                         disabled={isResetting}
//                                         className="bg-white cursor-pointer font-inter font-medium text-xs sm:text-sm md:text-base text-[#27337C] border-2 border-[#27337C] px-6 sm:px-8 md:px-10 py-2 rounded-md hover:bg-blue-50 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
//                                         aria-label="Reset selection"
//                                     >
//                                         {isResetting ? "Resetting..." : "Reset"}
//                                     </button>
//                                     <button
//                                         onClick={handleProceed}
//                                         className="bg-[#27337C] cursor-pointer font-inter font-medium text-xs sm:text-sm md:text-base text-white px-6 sm:px-8 md:px-10 py-2 rounded-md hover:bg-[#1e264f] transition-colors w-full sm:w-auto"
//                                         aria-label="Proceed to billing"
//                                     >
//                                         Proceed
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <Dialog open={showResetDialog} onClose={() => setShowResetDialog(false)}>
//                         <DialogTitle>Confirm Reset</DialogTitle>
//                         <DialogContent>Are you sure you want to reset all selected seats and tickets?</DialogContent>
//                         <DialogActions>
//                             <Button onClick={() => setShowResetDialog(false)}>Cancel</Button>
//                             <Button onClick={() => handleReset(false)} color="error">
//                                 Reset
//                             </Button>
//                         </DialogActions>
//                     </Dialog>
//                     <LoginGuestModal
//                         isOpen={isLoginModalOpen}
//                         onClose={() => setIsLoginModalOpen(false)}
//                         onSignIn={handleSignInAndProceed}
//                         onContinueAsGuest={handleContinueAsGuestAndProceed}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// const SeatBookingPage: React.FC = () => {
//     const hero: Hero = {
//         image: "/payment-successful-hero.png",
//         title: "Seat Booking",
//         subTitle: "Discover your favorite entertainment right here",
//     };
//
//     return (
//         <div className="min-h-screen bg-white">
//             <HeroSection hero={hero} />
//             <Suspense
//                 fallback={
//                     <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
//                         <CircularProgress size={50} sx={{ color: "#27337C" }} />
//                         <div className="mt-4 text-lg text-gray-600">Loading seat booking...</div>
//                     </div>
//                 }
//             >
//                 <SeatBookingContent />
//             </Suspense>
//         </div>
//     );
// };
//
// export default SeatBookingPage;


// "use client";
//
// import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useRouter, useSearchParams } from "next/navigation";
// import {
//     Alert,
//     Paper,
//     Table,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     TableBody,
// } from "@mui/material";
// import HeroSection from "@/components/HeroSection";
// import SectionTitle from "@/components/SectionTitle";
// import SeatSelection from "@/components/SeatSelection";
// import LoginGuestModal from "@/components/LoginGuestModal";
// import { useCurrentUser } from "@/util/auth";
// import SeatBookingPageSkeleton from "@/components/skeletons/SeatBookingPageSkeleton";
// import {
//     resetBooking,
//     selectEventTicketDetails,
//     selectSelectedSeats,
//     selectManualTicketCounts,
//     setEventTicketDetails,
//     setManualTicketCounts,
//     setRestorationStatus,
// } from "@/store/bookingSlice";
// import { RootState } from "@/store/store";
// import { useSeatByEventId } from "@/hooks/useBooking";
//
// interface Hero {
//     image: string;
//     title: string;
//     subTitle: string;
// }
//
// interface TicketFromEventPage {
//     price: number;
//     ticketCount: number | null;
//     ticketTypeId: number;
//     ticketTypeName: string;
// }
//
// interface StoredBookingData {
//     selectedSeats: SeatData[];
//     manualTicketCounts: Record<number, number>;
//     eventTicketDetails: TicketFromEventPage[];
//     eventId: string;
//     timestamp: number;
// }
//
// interface SeatData {
//     price: number;
//     seatId: string;
//     status: string;
//     type_id: number;
//     ticketTypeName?: string;
//     color?: string;
// }
//
// interface TableRowData {
//     category: string;
//     price: string;
//     tickets: string;
//     amount: string;
//     ticketTypeId: number;
//     enableManualSelection: boolean;
// }
//
// const SeatBookingPage: React.FC = () => {
//     const dispatch = useDispatch();
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const eventId = searchParams.get("eventId") || "";
//     const rawTicketDetails = searchParams.get("ticketDetails");
//     const location = searchParams.get("location");
//     const mapId = location?.split(" ")[0].toLowerCase();
//
//     const user = useCurrentUser();
//     const isAuthenticated = !!user;
//
//     const eventTicketDetails = useSelector((state: RootState) => selectEventTicketDetails(state));
//     const selectedSeats = useSelector((state: RootState) => selectSelectedSeats(state));
//     const manualTicketCounts = useSelector((state: RootState) => selectManualTicketCounts(state));
//     const ticketTypesExistInApi = useSelector((state: RootState) => state.booking.ticketTypesExistInApi);
//     const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//     const [errorMessage, setErrorMessage] = useState<string | null>(null);
//
//     const { data: apiSeatData, isLoading, error: eventError } = useSeatByEventId(eventId);
//
//     useEffect(() => {
//         if (rawTicketDetails) {
//             try {
//                 const parsedDetails: TicketFromEventPage[] = JSON.parse(rawTicketDetails);
//                 dispatch(setEventTicketDetails(parsedDetails));
//
//                 const initialManualCounts: Record<number, number> = {};
//                 parsedDetails.forEach((ticket) => {
//                     initialManualCounts[ticket.ticketTypeId] = 0;
//                 });
//
//                 const storedData = localStorage.getItem("tempBookingData");
//                 if (storedData) {
//                     try {
//                         const parsedStoredData: StoredBookingData = JSON.parse(storedData);
//                         if (
//                             parsedStoredData.eventId === eventId &&
//                             parsedStoredData.eventTicketDetails?.length === parsedDetails.length &&
//                             parsedStoredData.eventTicketDetails.every(
//                                 (storedTicket, index) =>
//                                     storedTicket.ticketTypeId === parsedDetails[index].ticketTypeId &&
//                                     storedTicket.ticketTypeName === parsedDetails[index].ticketTypeName &&
//                                     storedTicket.price === parsedDetails[index].price
//                             ) &&
//                             Date.now() - parsedStoredData.timestamp < 3600000
//                         ) {
//                             dispatch(setRestorationStatus("loading"));
//                             dispatch(setManualTicketCounts(parsedStoredData.manualTicketCounts || initialManualCounts));
//                             setTimeout(() => {
//                                 dispatch(setRestorationStatus("success"));
//                                 setTimeout(() => dispatch(setRestorationStatus(null)), 3000);
//                             }, 1000);
//                         } else {
//                             dispatch(setManualTicketCounts(initialManualCounts));
//                             localStorage.removeItem("tempBookingData");
//                             localStorage.removeItem("bookingSummaryToBill");
//                         }
//                     } catch (e) {
//                         console.error("Failed to parse stored booking data:", e);
//                         dispatch(setManualTicketCounts(initialManualCounts));
//                         localStorage.removeItem("tempBookingData");
//                         localStorage.removeItem("bookingSummaryToBill");
//                         dispatch(setRestorationStatus("failed"));
//                         setTimeout(() => dispatch(setRestorationStatus(null)), 3000);
//                     }
//                 } else {
//                     dispatch(setManualTicketCounts(initialManualCounts));
//                 }
//             } catch (e) {
//                 console.error("Failed to parse ticket details from URL:", e);
//                 dispatch(setEventTicketDetails([]));
//                 dispatch(setManualTicketCounts({}));
//                 localStorage.removeItem("tempBookingData");
//                 localStorage.removeItem("bookingSummaryToBill");
//             }
//         }
//     }, [rawTicketDetails, eventId, dispatch]);
//
//     const categories = useMemo(
//         () =>
//             eventTicketDetails
//                 .map((ticket) => ({
//                     name: ticket.ticketTypeName,
//                     price: ticket.price,
//                     ticketTypeId: ticket.ticketTypeId,
//                 }))
//                 .sort((a, b) => a.price - b.price),
//         [eventTicketDetails]
//     );
//
//     const rows = useMemo(
//         () =>
//             categories
//                 .map(({ name, price, ticketTypeId }) => {
//                     const enableManualSelection = ticketTypesExistInApi[ticketTypeId] === false;
//                     const ticketsFromMap = selectedSeats.filter((seat) => seat.type_id === ticketTypeId).length;
//                     const manualCount = manualTicketCounts[ticketTypeId] || 0;
//                     const combinedTickets = enableManualSelection ? ticketsFromMap + manualCount : ticketsFromMap;
//                     const amount = combinedTickets * price;
//
//                     return {
//                         category: name,
//                         price: `${price.toFixed(2)} LKR`,
//                         tickets: combinedTickets.toString().padStart(2, "0"),
//                         amount: `${amount.toFixed(2)} LKR`,
//                         ticketTypeId,
//                         enableManualSelection,
//                     };
//                 })
//                 .filter((row) => parseFloat(row.amount.replace(" LKR", "")) > 0 || row.enableManualSelection),
//         [categories, selectedSeats, manualTicketCounts, ticketTypesExistInApi]
//     );
//
//     const totalTickets = useMemo(
//         () => rows.reduce((sum, row) => sum + parseInt(row.tickets), 0).toString().padStart(2, "0"),
//         [rows]
//     );
//
//     const totalAmount = useMemo(
//         () => rows.reduce((sum, row) => sum + parseFloat(row.amount.replace(" LKR", "")), 0).toFixed(2) + " LKR",
//         [rows]
//     );
//
//     const selectedSeatNumbers = useMemo(
//         () =>
//             selectedSeats
//                 .filter((seat) => ticketTypesExistInApi[seat.type_id] === true)
//                 .map((seat) => seat.seatId)
//                 .join(", "),
//         [selectedSeats, ticketTypesExistInApi]
//     );
//
//     const saveBookingSummaryToLocalStorage = useCallback(() => {
//         const bookingSummaryData = {
//             rows: rows.filter((row) => parseFloat(row.amount.replace(" LKR", "")) > 0),
//             totalTickets,
//             totalAmount,
//             selectedSeatNumbers,
//         };
//         localStorage.setItem("bookingSummaryToBill", JSON.stringify(bookingSummaryData));
//     }, [rows, totalTickets, totalAmount, selectedSeatNumbers]);
//
//     const handleProceed = useCallback(() => {
//         const totalSelectedTickets = rows.reduce((sum, row) => sum + parseInt(row.tickets), 0);
//         if (totalSelectedTickets === 0) {
//             setErrorMessage("Please select at least one seat or add tickets manually to proceed.");
//             setTimeout(() => setErrorMessage(null), 5000);
//             return;
//         }
//
//         saveBookingSummaryToLocalStorage();
//
//         if (isAuthenticated) {
//             router.push(
//                 `/billing-details?summary=${encodeURIComponent(
//                     localStorage.getItem("bookingSummaryToBill") || "{}"
//                 )}&eventId=${eventId}`
//             );
//         } else {
//             setIsLoginModalOpen(true);
//         }
//     }, [rows, isAuthenticated, router, saveBookingSummaryToLocalStorage, eventId]);
//
//     const handleSignInAndProceed = useCallback(() => {
//         setIsLoginModalOpen(false);
//         router.push(
//             `/billing-details?summary=${encodeURIComponent(
//                 localStorage.getItem("bookingSummaryToBill") || "{}"
//             )}&eventId=${eventId}`
//         );
//     }, [router, eventId]);
//
//     const handleContinueAsGuestAndProceed = useCallback(() => {
//         setIsLoginModalOpen(false);
//         router.push(
//             `/billing-details?summary=${encodeURIComponent(
//                 localStorage.getItem("bookingSummaryToBill") || "{}"
//             )}&eventId=${eventId}`
//         );
//     }, [router, eventId]);
//
//     if (isLoading) {
//         return (
//             <div className="py-4 px-2 sm:px-4 lg:px-6">
//                 <div className="max-w-7xl mx-auto">
//                     <SectionTitle title="Seat Booking" />
//                     <div className="mt-4 sm:mt-6 py-8 sm:py-12">
//                         <SeatBookingPageSkeleton />
//                     </div>
//                 </div>
//             </div>
//         );
//     }
//
//     if (eventError) {
//         return (
//             <div className="min-h-screen flex justify-center items-center p-4">
//                 <Alert severity="error" sx={{ maxWidth: 500 }}>
//                     <div className="text-lg font-semibold mb-2">Error Loading Seat Information</div>
//                     <div>{eventError && <div>Seat data error: {eventError.message}</div>}</div>
//                     <div className="mt-2 text-sm">Please refresh the page to try again.</div>
//                 </Alert>
//             </div>
//         );
//     }
//
//     const hero: Hero = {
//         image: "/payment-successful-hero.png",
//         title: "Seat Booking",
//         subTitle: "Discover your favorite entertainment right here",
//     };
//
//     return (
//         <div className="min-h-screen bg-white">
//             <HeroSection hero={hero} />
//             <div className="py-4 px-2 sm:px-4 lg:px-6">
//                 <div className="max-w-7xl mx-auto">
//                     <SectionTitle title="Seat Booking" />
//                     <div className="mt-1 sm:mt-6 py-4 sm:py-12">
//                         {errorMessage && (
//                             <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage(null)}>
//                                 {errorMessage}
//                             </Alert>
//                         )}
//                         <div className="w-full overflow-x-auto">
//                             <SeatSelection mapId={mapId} eventId={eventId} />
//                         </div>
//                         <div className="py-4 px-2 sm:px-4 lg:px-6">
//                             <div className="max-w-4xl mx-auto">
//                                 <TableContainer
//                                     component={Paper}
//                                     sx={{
//                                         border: "none",
//                                         boxShadow: "none",
//                                         borderRadius: "8px",
//                                         overflowX: "auto",
//                                     }}
//                                 >
//                                     <Table
//                                         sx={{
//                                             minWidth: { xs: 300, sm: 600, md: 650 },
//                                             "& .MuiTableCell-root": {
//                                                 borderColor: "#E7EAE9",
//                                                 padding: { xs: "8px 4px", sm: "12px 8px", md: "16px" },
//                                             },
//                                         }}
//                                         aria-label="Seat booking summary table"
//                                     >
//                                         <TableHead>
//                                             <TableRow>
//                                                 <TableCell align="center">
//                                                     <div className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#2D2A70]">
//                                                         Category
//                                                     </div>
//                                                 </TableCell>
//                                                 <TableCell align="center">
//                                                     <div className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#2D2A70]">
//                                                         Price
//                                                     </div>
//                                                 </TableCell>
//                                                 <TableCell align="center">
//                                                     <div className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#2D2A70]">
//                                                         Tickets
//                                                     </div>
//                                                 </TableCell>
//                                                 <TableCell align="center">
//                                                     <div className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#2D2A70]">
//                                                         Amount
//                                                     </div>
//                                                 </TableCell>
//                                             </TableRow>
//                                         </TableHead>
//                                         <TableBody>
//                                             {categories.map(({ name, price, ticketTypeId }) => {
//                                                 const enableManualSelection = ticketTypesExistInApi[ticketTypeId] === false;
//                                                 const ticketsFromMap = selectedSeats.filter((seat) => seat.type_id === ticketTypeId).length;
//                                                 const manualCount = manualTicketCounts[ticketTypeId] || 0;
//                                                 const displayTickets = enableManualSelection ? ticketsFromMap + manualCount : ticketsFromMap;
//                                                 const displayAmount = (displayTickets * price).toFixed(2);
//
//                                                 if (displayTickets === 0 && !enableManualSelection) {
//                                                     return null;
//                                                 }
//
//                                                 return (
//                                                     <TableRow
//                                                         key={ticketTypeId}
//                                                         sx={{
//                                                             backgroundColor: "#F1F5F9",
//                                                             "&:last-child td, &:last-child th": { border: 0 },
//                                                         }}
//                                                     >
//                                                         <TableCell align="center">
//                                                             <div className="font-inter font-medium text-xs sm:text-sm md:text-base lg:text-lg text-[#27337C]">
//                                                                 {name}
//                                                             </div>
//                                                         </TableCell>
//                                                         <TableCell align="center">
//                                                             <div className="font-inter font-medium text-xs sm:text-sm md:text-base text-[#27337C]">
//                                                                 {price.toFixed(2)} LKR
//                                                             </div>
//                                                         </TableCell>
//                                                         <TableCell align="center">
//                                                             {enableManualSelection ? (
//                                                                 <div className="flex items-center justify-center space-x-2">
//                                                                     <button
//                                                                         onClick={() => dispatch(setManualTicketCounts({ ticketTypeId, delta: -1 }))}
//                                                                         className="p-1 rounded-full bg-[#E0E0E0] hover:bg-[#D0D0D0] transition-colors cursor-pointer"
//                                                                         aria-label={`Decrease ${name} tickets`}
//                                                                     >
//                                                                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
//                                                                             <path fill="#000" d="M18 11H6a2 2 0 0 0 0 4h12a2 2 0 0 0 0-4" />
//                                                                         </svg>
//                                                                     </button>
//                                                                     <span className="font-inter text-xs sm:text-sm md:text-base text-[#000000]">
//                                     {displayTickets.toString().padStart(2, "0")}
//                                   </span>
//                                                                     <button
//                                                                         onClick={() => dispatch(setManualTicketCounts({ ticketTypeId, delta: 1 }))}
//                                                                         className="p-1 rounded-full bg-[#E0E0E0] hover:bg-[#D0D0D0] transition-colors cursor-pointer"
//                                                                         aria-label={`Increase ${name} tickets`}
//                                                                     >
//                                                                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
//                                                                             <path
//                                                                                 fill="#000"
//                                                                                 d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4"
//                                                                             />
//                                                                         </svg>
//                                                                     </button>
//                                                                 </div>
//                                                             ) : (
//                                                                 <div className="font-inter text-xs sm:text-sm md:text-base text-[#000000]">
//                                                                     {displayTickets.toString().padStart(2, "0")}
//                                                                 </div>
//                                                             )}
//                                                         </TableCell>
//                                                         <TableCell align="center">
//                                                             <div className="font-inter text-xs sm:text-sm md:text-base text-[#000000]">
//                                                                 {displayAmount} LKR
//                                                             </div>
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 );
//                                             })}
//                                             <TableRow sx={{ backgroundColor: "#F1F5F9" }}>
//                                                 <TableCell align="center">
//                                                     <div className="font-inter font-semibold text-sm sm:text-base md:text-lg text-[#27337C]">
//                                                         Total
//                                                     </div>
//                                                 </TableCell>
//                                                 <TableCell align="center"></TableCell>
//                                                 <TableCell align="center">
//                                                     <div className="font-inter font-bold text-xs sm:text-sm md:text-base text-[#27337C]">
//                                                         {totalTickets}
//                                                     </div>
//                                                 </TableCell>
//                                                 <TableCell align="center">
//                                                     <div className="font-inter font-bold text-xs sm:text-sm md:text-base text-[#27337C]">
//                                                         {totalAmount}
//                                                     </div>
//                                                 </TableCell>
//                                             </TableRow>
//                                         </TableBody>
//                                     </Table>
//                                 </TableContainer>
//                                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#F1F5F9] rounded-md px-4 sm:px-8 lg:px-12 py-3 sm:py-4 mt-4 gap-2 sm:gap-4">
//                                     <div className="font-inter text-[#27337C] text-sm sm:text-base md:text-lg font-semibold">
//                                         Seat Numbers
//                                     </div>
//                                     <div className="font-inter font-medium text-[#27337C] text-xs sm:text-sm md:text-base flex-1 text-left sm:text-center">
//                                         {selectedSeatNumbers || "None"}
//                                     </div>
//                                     <div className="flex gap-2 sm:gap-4">
//                                         <button
//                                             onClick={() => dispatch(resetBooking({ eventId }))}
//                                             className="bg-white cursor-pointer font-inter font-medium text-xs sm:text-sm md:text-base text-[#27337C] border-2 border-[#27337C] px-6 sm:px-8 md:px-10 py-2 rounded-md hover:bg-blue-50 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
//                                         >
//                                             Reset
//                                         </button>
//                                         <button
//                                             onClick={handleProceed}
//                                             className="bg-[#27337C] cursor-pointer font-inter font-medium text-xs sm:text-sm md:text-base text-white px-6 sm:px-8 md:px-10 py-2 rounded-md hover:bg-[#1e264f] transition-colors w-full sm:w-auto"
//                                         >
//                                             Proceed
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <LoginGuestModal
//                     isOpen={isLoginModalOpen}
//                     onClose={() => setIsLoginModalOpen(false)}
//                     onSignIn={handleSignInAndProceed}
//                     onContinueAsGuest={handleContinueAsGuestAndProceed}
//                 />
//             </div>
//         </div>
//     );
// };
//
// export default memo(SeatBookingPage);


// "use client";
//
// import React, {useEffect, useState, useCallback, useMemo, memo} from "react";
// import {useSelector, useDispatch} from "react-redux";
// import {useRouter, useSearchParams} from "next/navigation";
// import {
//     Alert,
//     Paper,
//     Table,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     TableBody,
//     Typography,
//     Box,
// } from "@mui/material";
// import HeroSection from "@/components/HeroSection";
// import SectionTitle from "@/components/SectionTitle";
// import SeatSelection from "@/components/SeatSelection";
// import LoginGuestModal from "@/components/LoginGuestModal";
// import TimerModal from "@/components/TimerModal";
// import {useCurrentUser} from "@/util/auth";
// import SeatBookingPageSkeleton from "@/components/skeletons/SeatBookingPageSkeleton";
// import {
//     resetBooking,
//     selectEventTicketDetails,
//     selectSelectedSeats,
//     selectManualTicketCounts,
//     setEventTicketDetails,
//     setManualTicketCounts,
//     setRestorationStatus,
// } from "@/store/bookingSlice";
// import {RootState} from "@/store/store";
// import {useSeatByEventId} from "@/hooks/useBooking";
//
// interface Hero {
//     image: string;
//     title: string;
//     subTitle: string;
// }
//
// interface TicketFromEventPage {
//     price: number;
//     ticketCount: number | null;
//     ticketTypeId: number;
//     ticketTypeName: string;
// }
//
// interface StoredBookingData {
//     selectedSeats: SeatData[];
//     manualTicketCounts: Record<number, number>;
//     eventTicketDetails: TicketFromEventPage[];
//     eventId: string;
//     timestamp: number;
// }
//
// interface SeatData {
//     price: number;
//     seatId: string;
//     status: string;
//     type_id: number;
//     ticketTypeName?: string;
//     color?: string;
// }
//
// interface TableRowData {
//     category: string;
//     price: string;
//     tickets: string;
//     amount: string;
//     ticketTypeId: number;
//     enableManualSelection: boolean;
// }
//
// const SeatBookingPage: React.FC = () => {
//     const dispatch = useDispatch();
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const eventId = searchParams.get("eventId") || "";
//     const rawTicketDetails = searchParams.get("ticketDetails");
//     const location = searchParams.get("location");
//     const mapId = location?.split(" ")[0].toLowerCase();
//
//     const user = useCurrentUser();
//     const isAuthenticated = !!user;
//
//     const eventTicketDetails = useSelector((state: RootState) =>
//         selectEventTicketDetails(state)
//     );
//     const selectedSeats = useSelector((state: RootState) =>
//         selectSelectedSeats(state)
//     );
//     const manualTicketCounts = useSelector((state: RootState) =>
//         selectManualTicketCounts(state)
//     );
//     const ticketTypesExistInApi = useSelector(
//         (state: RootState) => state.booking.ticketTypesExistInApi
//     );
//     const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//     const [errorMessage, setErrorMessage] = useState<string | null>(null);
//     const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
//     const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
//     const [hasExtended, setHasExtended] = useState(false);
//     const [isExpired, setIsExpired] = useState(false);
//
//     const {data: apiSeatData, isLoading, error: eventError} =
//         useSeatByEventId(eventId);
//
//     // Start timer when first seat is selected or manual count is added
//     useEffect(() => {
//         const totalTickets = Object.values(manualTicketCounts).reduce(
//             (sum, count) => sum + count,
//             0
//         ) + selectedSeats.length;
//
//         if (totalTickets > 0 && timerSeconds === null) {
//             setTimerSeconds(60); // 15 minutes
//         }
//     }, [selectedSeats, manualTicketCounts, timerSeconds]);
//
//     // Timer countdown logic
//     useEffect(() => {
//         if (timerSeconds === null || isExpired) return;
//
//         if (timerSeconds <= 0) {
//             setIsExpired(true);
//             dispatch(resetBooking({eventId}));
//             setErrorMessage("Your seat selection time has expired. Please start again.");
//             setTimeout(() => setErrorMessage(null), 5000);
//             return;
//         }
//
//         if (timerSeconds === 30 && !hasExtended) {
//             setIsTimerModalOpen(true);
//         }
//
//         const interval = setInterval(() => {
//             setTimerSeconds((prev) => (prev !== null ? prev - 1 : null));
//         }, 1000);
//
//         return () => clearInterval(interval);
//     }, [timerSeconds, dispatch, eventId, hasExtended, isExpired]);
//
//     const handleExtendTimer = useCallback(() => {
//         setTimerSeconds((prev) => (prev !== null ? prev + 300 : 300)); // Add 5 minutes
//         setIsTimerModalOpen(false);
//         setHasExtended(true);
//     }, []);
//
//     const handleContinueTimer = useCallback(() => {
//         setIsTimerModalOpen(false);
//     }, []);
//
//     useEffect(() => {
//         if (rawTicketDetails) {
//             try {
//                 const parsedDetails: TicketFromEventPage[] = JSON.parse(rawTicketDetails);
//                 dispatch(setEventTicketDetails(parsedDetails));
//
//                 const initialManualCounts: Record<number, number> = {};
//                 parsedDetails.forEach((ticket) => {
//                     initialManualCounts[ticket.ticketTypeId] = 0;
//                 });
//
//                 const storedData = localStorage.getItem("tempBookingData");
//                 if (storedData) {
//                     try {
//                         const parsedStoredData: StoredBookingData = JSON.parse(storedData);
//                         if (
//                             parsedStoredData.eventId === eventId &&
//                             parsedStoredData.eventTicketDetails?.length ===
//                             parsedDetails.length &&
//                             parsedStoredData.eventTicketDetails.every(
//                                 (storedTicket, index) =>
//                                     storedTicket.ticketTypeId === parsedDetails[index].ticketTypeId &&
//                                     storedTicket.ticketTypeName ===
//                                     parsedDetails[index].ticketTypeName &&
//                                     storedTicket.price === parsedDetails[index].price
//                             ) &&
//                             Date.now() - parsedStoredData.timestamp < 3600000
//                         ) {
//                             dispatch(setRestorationStatus("loading"));
//                             Object.entries(parsedStoredData.manualTicketCounts).forEach(
//                                 ([ticketTypeId, count]) => {
//                                     dispatch(
//                                         setManualTicketCounts({
//                                             ticketTypeId: Number(ticketTypeId),
//                                             delta: count,
//                                         })
//                                     );
//                                 }
//                             );
//                             setTimeout(() => {
//                                 dispatch(setRestorationStatus("success"));
//                                 setTimeout(() => dispatch(setRestorationStatus(null)), 3000);
//                             }, 1000);
//                         } else {
//                             Object.entries(initialManualCounts).forEach(
//                                 ([ticketTypeId, count]) => {
//                                     dispatch(
//                                         setManualTicketCounts({
//                                             ticketTypeId: Number(ticketTypeId),
//                                             delta: count,
//                                         })
//                                     );
//                                 }
//                             );
//                             localStorage.removeItem("tempBookingData");
//                             localStorage.removeItem("bookingSummaryToBill");
//                         }
//                     } catch (e) {
//                         console.error("Failed to parse stored booking data:", e);
//                         Object.entries(initialManualCounts).forEach(
//                             ([ticketTypeId, count]) => {
//                                 dispatch(
//                                     setManualTicketCounts({
//                                         ticketTypeId: Number(ticketTypeId),
//                                         delta: count,
//                                     })
//                                 );
//                             }
//                         );
//                         localStorage.removeItem("tempBookingData");
//                         localStorage.removeItem("bookingSummaryToBill");
//                         dispatch(setRestorationStatus("failed"));
//                         setTimeout(() => dispatch(setRestorationStatus(null)), 3000);
//                     }
//                 } else {
//                     Object.entries(initialManualCounts).forEach(([ticketTypeId, count]) => {
//                         dispatch(
//                             setManualTicketCounts({
//                                 ticketTypeId: Number(ticketTypeId),
//                                 delta: count,
//                             })
//                         );
//                     });
//                 }
//             } catch (e) {
//                 console.error("Failed to parse ticket details from URL:", e);
//                 dispatch(setEventTicketDetails([]));
//                 Object.entries({}).forEach(([ticketTypeId, count]) => {
//                     dispatch(
//                         setManualTicketCounts({
//                             ticketTypeId: Number(ticketTypeId),
//                             delta: count,
//                         })
//                     );
//                 });
//                 localStorage.removeItem("tempBookingData");
//                 localStorage.removeItem("bookingSummaryToBill");
//             }
//         }
//     }, [rawTicketDetails, eventId, dispatch]);
//
//     const categories = useMemo(
//         () =>
//             eventTicketDetails
//                 .map((ticket) => ({
//                     name: ticket.ticketTypeName,
//                     price: ticket.price,
//                     ticketTypeId: ticket.ticketTypeId,
//                 }))
//                 .sort((a, b) => a.price - b.price),
//         [eventTicketDetails]
//     );
//
//     const rows = useMemo(
//         () =>
//             categories
//                 .map(({name, price, ticketTypeId}) => {
//                     const enableManualSelection = ticketTypesExistInApi[ticketTypeId] === false;
//                     const ticketsFromMap = selectedSeats.filter(
//                         (seat) => seat.type_id === ticketTypeId
//                     ).length;
//                     const manualCount = manualTicketCounts[ticketTypeId] || 0;
//                     const combinedTickets = enableManualSelection
//                         ? ticketsFromMap + manualCount
//                         : ticketsFromMap;
//                     const amount = combinedTickets * price;
//
//                     return {
//                         category: name,
//                         price: `${price.toFixed(2)} LKR`,
//                         tickets: combinedTickets.toString().padStart(2, "0"),
//                         amount: `${amount.toFixed(2)} LKR`,
//                         ticketTypeId,
//                         enableManualSelection,
//                     };
//                 })
//                 .filter(
//                     (row) =>
//                         parseFloat(row.amount.replace(" LKR", "")) > 0 ||
//                         row.enableManualSelection
//                 ),
//         [categories, selectedSeats, manualTicketCounts, ticketTypesExistInApi]
//     );
//
//     const totalTickets = useMemo(
//         () =>
//             rows
//                 .reduce((sum, row) => sum + parseInt(row.tickets), 0)
//                 .toString()
//                 .padStart(2, "0"),
//         [rows]
//     );
//
//     const totalAmount = useMemo(
//         () =>
//             `${rows
//                 .reduce((sum, row) => sum + parseFloat(row.amount.replace(" LKR", "")), 0)
//                 .toFixed(2)} LKR`,
//         [rows]
//     );
//
//     const selectedSeatNumbers = useMemo(
//         () =>
//             selectedSeats
//                 .filter((seat) => ticketTypesExistInApi[seat.type_id] === true)
//                 .map((seat) => seat.seatId)
//                 .join(", "),
//         [selectedSeats, ticketTypesExistInApi]
//     );
//
//     const saveBookingSummaryToLocalStorage = useCallback(() => {
//         const bookingSummaryData = {
//             rows: rows.filter((row) => parseFloat(row.amount.replace(" ", "")) > 0),
//             totalTickets: totalTickets,
//             totalAmount,
//             selectedSeatNumbers,
//         };
//         localStorage.setItem(
//             "bookingSummaryToBill",
//             JSON.stringify(bookingSummaryData)
//         );
//     }, [rows, totalTickets, totalAmount, selectedSeatNumbers]);
//
//     const handleProceed = useCallback(() => {
//         const totalSelectedTickets = rows.reduce(
//             (sum, row) => sum + parseInt(row.tickets),
//             0
//         );
//         if (totalSelectedTickets === 0) {
//             setErrorMessage(
//                 "Please select at least one seat or add tickets manually to proceed."
//             );
//             setTimeout(() => setErrorMessage(null), 5000);
//             return;
//         }
//
//         saveBookingSummaryToLocalStorage();
//
//         if (isAuthenticated) {
//             router.push(
//                 `/billing-details?summary=${encodeURIComponent(
//                     localStorage.getItem("bookingSummaryToBill") || "{}"
//                 )}&eventId=${encodeURIComponent(eventId)}`
//             );
//         } else {
//             setIsLoginModalOpen(true);
//         }
//     }, [rows, isAuthenticated, router, eventId, saveBookingSummaryToLocalStorage]);
//
//     const handleSignInAndProceed = useCallback(() => {
//         setIsLoginModalOpen(false);
//         router.push(
//             `/billing-details?summary=${encodeURIComponent(
//                 localStorage.getItem("bookingSummaryToBill") || "{}"
//             )}&eventId=${encodeURIComponent(eventId)}`
//         );
//     }, [router, eventId]);
//
//     const handleContinueAsGuestAndProceed = useCallback(() => {
//         setIsLoginModalOpen(false);
//         router.push(
//             `/billing-details?summary=${encodeURIComponent(
//                 localStorage.getItem("bookingSummaryToBill") || "{}"
//             )}&eventId=${encodeURIComponent(eventId)}`
//         );
//     }, [router, eventId]);
//
//     const formatTimerDisplay = (seconds: number | null) => {
//         if (seconds === null) return "--:--";
//         const minutes = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return `${minutes.toString().padStart(2, "0")}:${secs
//             .toString()
//             .padStart(2, "0")}`;
//     };
//
//     if (isLoading) {
//         return (
//             <div className="py-4 px-2 sm:px-4 lg:px-6">
//                 <div className="max-w-7xl mx-auto">
//                     <SectionTitle title="Seat Booking"/>
//                     <div className="mt-4 sm:mt-6 py-8 sm:py-12">
//                         <SeatBookingPageSkeleton/>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
//
//     if (eventError) {
//         return (
//             <div className="min-h-screen flex justify-center items-center p-4">
//                 <Alert severity="error" sx={{maxWidth: 500}}>
//                     <div className="text-lg font-semibold mb-2">
//                         Error Loading Seat Information
//                     </div>
//                     <div>{eventError && <div>Seat data error: {eventError.message}</div>}</div>
//                     <div className="mt-2 text-sm">Please refresh the page to try again.</div>
//                 </Alert>
//             </div>
//         );
//     }
//
//     const hero: Hero = {
//         image: "/payment-successful-hero.png",
//         title: "Seat Booking",
//         subTitle: "Discover your favorite entertainment right here",
//     };
//
//     return (
//         <div className="min-h-screen bg-white">
//             <HeroSection hero={hero}/>
//             <div className="py-4 px-2 sm:px-4 lg:px-6">
//                 <div className="max-w-7xl mx-auto">
//                     <SectionTitle title="Seat Booking"/>
//                     <div className="mt-1 sm:mt-6 py-4 sm:py-12">
//                         {errorMessage && (
//                             <Alert
//                                 severity="error"
//                                 sx={{mb: 2}}
//                                 onClose={() => setErrorMessage(null)}
//                             >
//                                 {errorMessage}
//                             </Alert>
//                         )}
//                         <div className="w-full overflow-x-auto">
//                             <SeatSelection mapId={mapId} eventId={eventId}/>
//                         </div>
//                         <div className="py-4 px-2 sm:px-4 lg:px-6">
//                             <div className="max-w-4xl mx-auto">
//                                 <TableContainer
//                                     component={Paper}
//                                     sx={{
//                                         border: "none",
//                                         boxShadow: "none",
//                                         borderRadius: "8px",
//                                         overflowX: "auto",
//                                     }}
//                                 >
//                                     <Table
//                                         sx={{
//                                             minWidth: {xs: 300, sm: 600, md: 650},
//                                             "& .MuiTableCell-root": {
//                                                 borderColor: "#E7EAE9",
//                                                 padding: {xs: "8px 4px", sm: "12px 8px", md: "16px"},
//                                             },
//                                         }}
//                                         aria-label="Seat booking summary table"
//                                     >
//                                         <TableHead>
//                                             <TableRow>
//                                                 <TableCell align="center">
//                                                     <div
//                                                         className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#27337C]">
//                                                         Category
//                                                     </div>
//                                                 </TableCell>
//                                                 <TableCell align="center">
//                                                     <div
//                                                         className="font-inter grotesk text-sm sm:text-base md:text-sm font-semibold text-[#27337C]">
//                                                         Price
//                                                     </div>
//                                                 </TableCell>
//                                                 <TableCell align="center">
//                                                     <div
//                                                         className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#27337C]">
//                                                         Tickets
//                                                     </div>
//                                                 </TableCell>
//                                                 <TableCell align="center">
//                                                     <div
//                                                         className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#27337C]">
//                                                         Amount
//                                                     </div>
//                                                 </TableCell>
//                                             </TableRow>
//                                         </TableHead>
//                                         <TableBody>
//                                             {categories.map(({name, price, ticketTypeId}) => {
//                                                 const enableManualSelection =
//                                                     ticketTypesExistInApi[ticketTypeId] === false;
//                                                 const ticketsFromMap = selectedSeats.filter(
//                                                     (seat) => seat.type_id === ticketTypeId
//                                                 ).length;
//                                                 const manualCount = manualTicketCounts[ticketTypeId] || 0;
//                                                 const displayTickets = enableManualSelection
//                                                     ? ticketsFromMap + manualCount
//                                                     : ticketsFromMap;
//                                                 const displayAmount = (displayTickets * price).toFixed(2);
//
//                                                 if (displayTickets === 0 && !enableManualSelection) {
//                                                     return null;
//                                                 }
//
//                                                 return (
//                                                     <TableRow
//                                                         key={ticketTypeId}
//                                                         sx={{
//                                                             backgroundColor: "#F1F5F9",
//                                                             "&:last-child td, &:last-child th": {border: 0},
//                                                         }}
//                                                     >
//                                                         <TableCell align="center">
//                                                             <div
//                                                                 className="font-inter font-medium text-xs sm:text-sm md:text-base lg:text-lg text-[#27337C]">
//                                                                 {name}
//                                                             </div>
//                                                         </TableCell>
//                                                         <TableCell align="center">
//                                                             <div
//                                                                 className="font-inter font-medium text-xs sm:text-sm md:text-base text-[#27337C]">
//                                                                 {price.toFixed(2)} LKR
//                                                             </div>
//                                                         </TableCell>
//                                                         <TableCell align="center">
//                                                             {enableManualSelection ? (
//                                                                 <div
//                                                                     className="flex items-center justify-center space-x-2">
//                                                                     <button
//                                                                         onClick={() =>
//                                                                             dispatch(
//                                                                                 setManualTicketCounts({
//                                                                                     ticketTypeId,
//                                                                                     delta: -1,
//                                                                                 })
//                                                                             )
//                                                                         }
//                                                                         className="p-1 rounded-full bg-[#E0E0E0] hover:bg-[#D0D0D0] transition-colors cursor-pointer"
//                                                                         aria-label={`Decrease ${name} tickets`}
//                                                                     >
//                                                                         <svg
//                                                                             xmlns="http://www.w3.org/2000/svg"
//                                                                             width="24"
//                                                                             height="24"
//                                                                             viewBox="0 0 24 24"
//                                                                         >
//                                                                             <path
//                                                                                 fill="#000"
//                                                                                 d="M18 11H6a2 2 0 0 0 0 4h12a2 2 0 0 0 0-4"
//                                                                             />
//                                                                         </svg>
//                                                                     </button>
//                                                                     <span
//                                                                         className="font-inter text-xs sm:text-sm md:text-base text-[#000000]">
//                                     {displayTickets.toString().padStart(2, "0")}
//                                   </span>
//                                                                     <button
//                                                                         onClick={() =>
//                                                                             dispatch(
//                                                                                 setManualTicketCounts({
//                                                                                     ticketTypeId,
//                                                                                     delta: 1,
//                                                                                 })
//                                                                             )
//                                                                         }
//                                                                         className="p-1 rounded-full bg-[#E0E0E0] hover:bg-[#D0D0D0] transition-colors cursor-pointer"
//                                                                         aria-label={`Increase ${name} tickets`}
//                                                                     >
//                                                                         <svg
//                                                                             xmlns="http://www.w3.org/2000/svg"
//                                                                             width="24"
//                                                                             height="24"
//                                                                             viewBox="0 0 24 24"
//                                                                         >
//                                                                             <path
//                                                                                 fill="#000"
//                                                                                 d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4"
//                                                                             />
//                                                                         </svg>
//                                                                     </button>
//                                                                 </div>
//                                                             ) : (
//                                                                 <div
//                                                                     className="font-inter text-xs sm:text-sm md:text-base text-[#000000]">
//                                                                     {displayTickets.toString().padStart(2, "0")}
//                                                                 </div>
//                                                             )}
//                                                         </TableCell>
//                                                         <TableCell align="center">
//                                                             <div
//                                                                 className="font-inter text-xs sm:text-sm md:text-base text-[#000000]">
//                                                                 {displayAmount} LKR
//                                                             </div>
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 );
//                                             })}
//                                             <TableRow sx={{backgroundColor: "#F1F5F9"}}>
//                                                 <TableCell align="center">
//                                                     <div
//                                                         className="font-inter font-semibold text-sm sm:text-base md:text-lg text-[#27337C]">
//                                                         Total
//                                                     </div>
//                                                 </TableCell>
//                                                 <TableCell align="center"></TableCell>
//                                                 <TableCell align="center">
//                                                     <div
//                                                         className="font-inter font-bold text-xs sm:text-sm md:text-base text-[#27337C]">
//                                                         {totalTickets}
//                                                     </div>
//                                                 </TableCell>
//                                                 <TableCell align="center">
//                                                     <div
//                                                         className="font-inter font-bold text-xs sm:text-sm md:text-base text-[#27337C]">
//                                                         {totalAmount}
//                                                     </div>
//                                                 </TableCell>
//                                             </TableRow>
//                                         </TableBody>
//                                     </Table>
//                                 </TableContainer>
//                                 <div
//                                     className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#F1F5F9] rounded-md px-4 sm:px-8 lg:px-12 py-3 sm:py-4 mt-4 gap-2 sm:gap-4">
//                                     <div
//                                         className="font-inter text-[#27337C] text-sm sm:text-base md:text-lg font-semibold">
//                                         Seat Numbers
//                                     </div>
//                                     <div
//                                         className="font-inter font-medium text-[#27337C] text-xs sm:text-sm md:text-base flex-1 text-left sm:text-center">
//                                         {selectedSeatNumbers || "None"}
//                                     </div>
//                                     <div
//                                         className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
//                                         {timerSeconds !== null && (
//                                             <Box
//                                                 sx={{
//                                                     display: "flex",
//                                                     alignItems: "center",
//                                                     color: timerSeconds <= 120 ? "#d32f2f" : "#27337C",
//                                                     fontWeight: "medium",
//                                                     fontSize: {xs: "0.75rem", sm: "0.875rem"},
//                                                 }}
//                                             >
//                                                 <Typography>
//                                                     Time Left: {formatTimerDisplay(timerSeconds)}
//                                                 </Typography>
//                                             </Box>
//                                         )}
//                                         <div className="flex gap-2 sm:gap-4">
//                                             <button
//                                                 onClick={() => dispatch(resetBooking({eventId}))}
//                                                 className="bg-white cursor-pointer font-inter font-medium text-xs sm:text-sm md:text-base text-[#27337C] border-2 border-[#27337C] px-6 sm:px-8 md:px-10 py-2 rounded-md hover:bg-blue-50 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
//                                             >
//                                                 Reset
//                                             </button>
//                                             <button
//                                                 onClick={handleProceed}
//                                                 className="bg-[#27337C] cursor-pointer font-inter font-medium text-xs sm:text-sm md:text-base text-white px-6 sm:px-8 md:px-10 py-2 rounded-md hover:bg-[#1e264f] transition-colors w-full sm:w-auto"
//                                             >
//                                                 Proceed
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <LoginGuestModal
//                     isOpen={isLoginModalOpen}
//                     onClose={() => setIsLoginModalOpen(false)}
//                     onSignIn={handleSignInAndProceed}
//                     onContinueAsGuest={handleContinueAsGuestAndProceed}
//                 />
//                 <TimerModal
//                     open={isTimerModalOpen}
//                     onExtend={handleExtendTimer}
//                     onContinue={handleContinueTimer}
//                 />
//             </div>
//         </div>
//     );
// };
//
// export default memo(SeatBookingPage);


// "use client";
//
// import React, {useEffect, useState, useCallback, useMemo, memo} from "react";
// import {useSelector, useDispatch} from "react-redux";
// import {useRouter, useSearchParams} from "next/navigation";
// import {
//     Alert,
//     Paper,
//     Table,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     TableBody,
//     Typography,
//     Box,
//     CircularProgress,
//     Tooltip,
// } from "@mui/material";
// import {useQueryClient} from "@tanstack/react-query";
// import HeroSection from "@/components/HeroSection";
// import SectionTitle from "@/components/SectionTitle";
// import SeatSelection from "@/components/SeatSelection";
// import LoginGuestModal from "@/components/LoginGuestModal";
// import TimerModal from "@/components/TimerModal";
// import {useCurrentUser} from "@/util/auth";
// import SeatBookingPageSkeleton from "@/components/skeletons/SeatBookingPageSkeleton";
// import {
//     resetBooking,
//     selectEventTicketDetails,
//     selectSelectedSeats,
//     selectManualTicketCounts,
//     setEventTicketDetails,
//     setManualTicketCounts,
//     setRestorationStatus,
// } from "@/store/bookingSlice";
// import {RootState} from "@/store/store";
// import {useSeatByEventId} from "@/hooks/useBooking";
//
// interface Hero {
//     image: string;
//     title: string;
//     subTitle: string;
// }
//
// interface TicketFromEventPage {
//     price: number;
//     ticketCount: number | null;
//     ticketTypeId: number;
//     ticketTypeName: string;
// }
//
// interface StoredBookingData {
//     selectedSeats: SeatData[];
//     manualTicketCounts: Record<number, number>;
//     eventTicketDetails: TicketFromEventPage[];
//     eventId: string;
//     timestamp: number;
// }
//
// interface SeatData {
//     price: number;
//     seatId: string;
//     status: string;
//     type_id: number;
//     ticketTypeName?: string;
//     color?: string;
// }
//
// interface TableRowData {
//     category: string;
//     price: string;
//     tickets: string;
//     amount: string;
//     ticketTypeId: number;
//     enableManualSelection: boolean;
// }
//
// const SeatBookingPage: React.FC = () => {
//     const dispatch = useDispatch();
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const queryClient = useQueryClient();
//     const eventId = searchParams.get("eventId") || "";
//     const rawTicketDetails = searchParams.get("ticketDetails");
//     const location = searchParams.get("location");
//     const mapId = location?.split(" ")[0].toLowerCase();
//
//     const user = useCurrentUser();
//     const isAuthenticated = !!user;
//
//     const eventTicketDetails = useSelector((state: RootState) =>
//         selectEventTicketDetails(state)
//     );
//     const selectedSeats = useSelector((state: RootState) =>
//         selectSelectedSeats(state)
//     );
//     const manualTicketCounts = useSelector((state: RootState) =>
//         selectManualTicketCounts(state)
//     );
//     const ticketTypesExistInApi = useSelector(
//         (state: RootState) => state.booking.ticketTypesExistInApi
//     );
//     const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//     const [errorMessage, setErrorMessage] = useState<string | null>(null);
//     const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
//     const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
//     const [hasExtended, setHasExtended] = useState(false);
//     const [isExpired, setIsExpired] = useState(false);
//
//     const {data: apiSeatData, isLoading, error: eventError} =
//         useSeatByEventId(eventId);
//
//     // Start/stop timer based on ticket count
//     useEffect(() => {
//         const totalTickets = Object.values(manualTicketCounts).reduce(
//             (sum, count) => sum + count,
//             0
//         ) + selectedSeats.length;
//
//         if (totalTickets === 0 && timerSeconds !== null) {
//             setTimerSeconds(null);
//             setIsTimerModalOpen(false);
//             setHasExtended(false);
//             setIsExpired(false);
//         } else if (totalTickets > 0 && timerSeconds === null) {
//             setTimerSeconds(60); // 15 minutes
//             setHasExtended(false);
//             setIsExpired(false);
//         }
//     }, [selectedSeats, manualTicketCounts, timerSeconds]);
//
//     // Timer countdown logic
//     useEffect(() => {
//         if (timerSeconds === null || isExpired) return;
//
//         if (timerSeconds <= 0) {
//             setIsExpired(true);
//             dispatch(resetBooking({eventId}));
//             setErrorMessage("Your seat selection time has expired. Please start again.");
//             setTimeout(() => setErrorMessage(null), 5000);
//             queryClient.invalidateQueries({queryKey: ["seatData", eventId]});
//             return;
//         }
//
//         if (timerSeconds === 30 && !hasExtended) {
//             setIsTimerModalOpen(true);
//         }
//
//         const interval = setInterval(() => {
//             setTimerSeconds((prev) => (prev !== null ? prev - 1 : null));
//         }, 1000);
//
//         return () => clearInterval(interval);
//     }, [timerSeconds, dispatch, eventId, hasExtended, isExpired, queryClient]);
//
//     const handleExtendTimer = useCallback(() => {
//         setTimerSeconds((prev) => (prev !== null ? prev + 300 : 300)); // Add 5 minutes
//         setIsTimerModalOpen(false);
//         setHasExtended(true);
//     }, []);
//
//     const handleContinueTimer = useCallback(() => {
//         setIsTimerModalOpen(false);
//     }, []);
//
//     useEffect(() => {
//         if (rawTicketDetails) {
//             try {
//                 const parsedDetails: TicketFromEventPage[] = JSON.parse(rawTicketDetails);
//                 dispatch(setEventTicketDetails(parsedDetails));
//
//                 const initialManualCounts: Record<number, number> = {};
//                 parsedDetails.forEach((ticket) => {
//                     initialManualCounts[ticket.ticketTypeId] = 0;
//                 });
//
//                 const storedData = localStorage.getItem("tempBookingData");
//                 if (storedData) {
//                     try {
//                         const parsedStoredData: StoredBookingData = JSON.parse(storedData);
//                         if (
//                             parsedStoredData.eventId === eventId &&
//                             parsedStoredData.eventTicketDetails?.length ===
//                             parsedDetails.length &&
//                             parsedStoredData.eventTicketDetails.every(
//                                 (storedTicket, index) =>
//                                     storedTicket.ticketTypeId === parsedDetails[index].ticketTypeId &&
//                                     storedTicket.ticketTypeName ===
//                                     parsedDetails[index].ticketTypeName &&
//                                     storedTicket.price === parsedDetails[index].price
//                             ) &&
//                             Date.now() - parsedStoredData.timestamp < 3600000 &&
//                             parsedStoredData.selectedSeats.length > 0 // Only restore if seats were selected
//                         ) {
//                             dispatch(setRestorationStatus("loading"));
//                             Object.entries(parsedStoredData.manualTicketCounts).forEach(
//                                 ([ticketTypeId, count]) => {
//                                     dispatch(
//                                         setManualTicketCounts({
//                                             ticketTypeId: Number(ticketTypeId),
//                                             delta: count,
//                                         })
//                                     );
//                                 }
//                             );
//                             setTimeout(() => {
//                                 dispatch(setRestorationStatus("success"));
//                                 setTimeout(() => dispatch(setRestorationStatus(null)), 3000);
//                             }, 1000);
//                         } else {
//                             Object.entries(initialManualCounts).forEach(
//                                 ([ticketTypeId, count]) => {
//                                     dispatch(
//                                         setManualTicketCounts({
//                                             ticketTypeId: Number(ticketTypeId),
//                                             delta: count,
//                                         })
//                                     );
//                                 }
//                             );
//                             localStorage.removeItem("tempBookingData");
//                             localStorage.removeItem("bookingSummaryToBill");
//                         }
//                     } catch (e) {
//                         console.error("Failed to parse stored booking data:", e);
//                         Object.entries(initialManualCounts).forEach(
//                             ([ticketTypeId, count]) => {
//                                 dispatch(
//                                     setManualTicketCounts({
//                                         ticketTypeId: Number(ticketTypeId),
//                                         delta: count,
//                                     })
//                                 );
//                             }
//                         );
//                         localStorage.removeItem("tempBookingData");
//                         localStorage.removeItem("bookingSummaryToBill");
//                         dispatch(setRestorationStatus("failed"));
//                         setTimeout(() => dispatch(setRestorationStatus(null)), 3000);
//                     }
//                 } else {
//                     Object.entries(initialManualCounts).forEach(([ticketTypeId, count]) => {
//                         dispatch(
//                             setManualTicketCounts({
//                                 ticketTypeId: Number(ticketTypeId),
//                                 delta: count,
//                             })
//                         );
//                     });
//                 }
//             } catch (e) {
//                 console.error("Failed to parse ticket details from URL:", e);
//                 dispatch(setEventTicketDetails([]));
//                 localStorage.removeItem("tempBookingData");
//                 localStorage.removeItem("bookingSummaryToBill");
//             }
//         }
//     }, [rawTicketDetails, eventId, dispatch]);
//
//     const categories = useMemo(
//         () =>
//             eventTicketDetails
//                 .map((ticket) => ({
//                     name: ticket.ticketTypeName,
//                     price: ticket.price,
//                     ticketTypeId: ticket.ticketTypeId,
//                 }))
//                 .sort((a, b) => a.price - b.price),
//         [eventTicketDetails]
//     );
//
//     const rows = useMemo(
//         () =>
//             categories
//                 .map(({name, price, ticketTypeId}) => {
//                     const enableManualSelection = ticketTypesExistInApi[ticketTypeId] === false;
//                     const ticketsFromMap = selectedSeats.filter(
//                         (seat) => seat.type_id === ticketTypeId
//                     ).length;
//                     const manualCount = manualTicketCounts[ticketTypeId] || 0;
//                     const combinedTickets = enableManualSelection
//                         ? ticketsFromMap + manualCount
//                         : ticketsFromMap;
//                     const amount = combinedTickets * price;
//
//                     return {
//                         category: name,
//                         price: `${price.toFixed(2)} LKR`,
//                         tickets: combinedTickets.toString().padStart(2, "0"),
//                         amount: `${amount.toFixed(2)} LKR`,
//                         ticketTypeId,
//                         enableManualSelection,
//                     };
//                 })
//                 .filter(
//                     (row) =>
//                         parseFloat(row.amount.replace(" LKR", "")) > 0 ||
//                         row.enableManualSelection
//                 ),
//         [categories, selectedSeats, manualTicketCounts, ticketTypesExistInApi]
//     );
//
//     const totalTickets = useMemo(
//         () =>
//             rows
//                 .reduce((sum, row) => sum + parseInt(row.tickets), 0)
//                 .toString()
//                 .padStart(2, "0"),
//         [rows]
//     );
//
//     const totalAmount = useMemo(
//         () =>
//             `${rows
//                 .reduce((sum, row) => sum + parseFloat(row.amount.replace(" LKR", "")), 0)
//                 .toFixed(2)} LKR`,
//         [rows]
//     );
//
//     const selectedSeatNumbers = useMemo(
//         () =>
//             selectedSeats
//                 .filter((seat) => ticketTypesExistInApi[seat.type_id] === true)
//                 .map((seat) => seat.seatId)
//                 .join(", "),
//         [selectedSeats, ticketTypesExistInApi]
//     );
//
//     const saveBookingSummaryToLocalStorage = useCallback(() => {
//         const bookingSummaryData = {
//             rows: rows.filter((row) => parseFloat(row.amount.replace(" ", "")) > 0),
//             totalTickets: totalTickets,
//             totalAmount,
//             selectedSeatNumbers,
//         };
//         localStorage.setItem(
//             "bookingSummaryToBill",
//             JSON.stringify(bookingSummaryData)
//         );
//     }, [rows, totalTickets, totalAmount, selectedSeatNumbers]);
//
//     const handleProceed = useCallback(() => {
//         const totalSelectedTickets = rows.reduce(
//             (sum, row) => sum + parseInt(row.tickets),
//             0
//         );
//         if (totalSelectedTickets === 0) {
//             setErrorMessage(
//                 "Please select at least one seat or add tickets manually to proceed."
//             );
//             setTimeout(() => setErrorMessage(null), 5000);
//             return;
//         }
//
//         saveBookingSummaryToLocalStorage();
//
//         if (isAuthenticated) {
//             router.push(
//                 `/billing-details?summary=${encodeURIComponent(
//                     localStorage.getItem("bookingSummaryToBill") || "{}"
//                 )}&eventId=${encodeURIComponent(eventId)}`
//             );
//         } else {
//             setIsLoginModalOpen(true);
//         }
//     }, [rows, isAuthenticated, router, eventId, saveBookingSummaryToLocalStorage]);
//
//     const handleSignInAndProceed = useCallback(() => {
//         setIsLoginModalOpen(false);
//         router.push(
//             `/billing-details?summary=${encodeURIComponent(
//                 localStorage.getItem("bookingSummaryToBill") || "{}"
//             )}&eventId=${encodeURIComponent(eventId)}`
//         );
//     }, [router, eventId]);
//
//     const handleContinueAsGuestAndProceed = useCallback(() => {
//         setIsLoginModalOpen(false);
//         router.push(
//             `/billing-details?summary=${encodeURIComponent(
//                 localStorage.getItem("bookingSummaryToBill") || "{}"
//             )}&eventId=${encodeURIComponent(eventId)}`
//         );
//     }, [router, eventId]);
//
//     const formatTimerDisplay = (seconds: number | null) => {
//         if (seconds === null) return "--:--";
//         const minutes = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return `${minutes.toString().padStart(2, "0")}:${secs
//             .toString()
//             .padStart(2, "0")}`;
//     };
//
//     if (isLoading) {
//         return (
//             <div className="py-4 px-2 sm:px-4 lg:px-6">
//                 <div className="max-w-7xl mx-auto">
//                     <SectionTitle title="Seat Booking"/>
//                     <div className="mt-4 sm:mt-6 py-8 sm:py-12">
//                         <SeatBookingPageSkeleton/>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
//
//     if (eventError) {
//         return (
//             <div className="min-h-screen flex justify-center items-center p-4">
//                 <Alert severity="error" sx={{maxWidth: 500}}>
//                     <div className="text-lg font-semibold mb-2">
//                         Error Loading Seat Information
//                     </div>
//                     <div>{eventError && <div>Seat data error: {eventError.message}</div>}</div>
//                     <div className="mt-2 text-sm">Please refresh the page to try again.</div>
//                 </Alert>
//             </div>
//         );
//     }
//
//     const hero: Hero = {
//         image: "/payment-successful-hero.png",
//         title: "Seat Booking",
//         subTitle: "Discover your favorite entertainment right here",
//     };
//
//     return (
//         <div className="min-h-screen bg-white">
//             <HeroSection hero={hero}/>
//             <div className="py-4 px-2 sm:px-4 lg:px-6">
//                 <div className="max-w-7xl mx-auto">
//                     <SectionTitle title="Seat Booking"/>
//                     <div className="mt-1 sm:mt-6 py-4 sm:py-12">
//                         {errorMessage && (
//                             <Alert
//                                 severity="error"
//                                 sx={{mb: 2}}
//                                 onClose={() => setErrorMessage(null)}
//                             >
//                                 {errorMessage}
//                             </Alert>
//                         )}
//                         <Box sx={{display: "flex", justifyContent: "center", mb: 4}}>
//                             {timerSeconds !== null && (
//                                 <Tooltip
//                                     title="Time remaining to complete your seat selection"
//                                     placement="top"
//                                 >
//                                     <Box
//                                         sx={{
//                                             position: "relative",
//                                             width: {xs: 60, sm: 80},
//                                             height: {xs: 60, sm: 80},
//                                             display: "flex",
//                                             alignItems: "center",
//                                             justifyContent: "center",
//                                             animation:
//                                                 timerSeconds <= 120
//                                                     ? "pulse 1.5s infinite"
//                                                     : "none",
//                                             "@keyframes pulse": {
//                                                 "0%": {transform: "scale(1)"},
//                                                 "50%": {transform: "scale(1.1)"},
//                                                 "100%": {transform: "scale(1)"},
//                                             },
//                                         }}
//                                     >
//                                         <CircularProgress
//                                             variant="determinate"
//                                             value={(timerSeconds / 900) * 100}
//                                             size={80}
//                                             thickness={4}
//                                             sx={{
//                                                 color: timerSeconds <= 120 ? "#d32f2f" : "#27337C",
//                                                 position: "absolute",
//                                                 top: 0,
//                                                 left: 0,
//                                             }}
//                                         />
//                                         <Typography
//                                             sx={{
//                                                 color: timerSeconds <= 120 ? "#d32f2f" : "#27337C",
//                                                 fontWeight: "bold",
//                                                 fontSize: {xs: "0.9rem", sm: "1.1rem"},
//                                             }}
//                                         >
//                                             {formatTimerDisplay(timerSeconds)}
//                                         </Typography>
//                                     </Box>
//                                 </Tooltip>
//                             )}
//                         </Box>
//                         <div className="w-full overflow-x-auto">
//                             <SeatSelection mapId={mapId} eventId={eventId}/>
//                         </div>
//                         <div className="py-4 px-2 sm:px-4 lg:px-6">
//                             <div className="max-w-4xl mx-auto">
//                                 <TableContainer
//                                     component={Paper}
//                                     sx={{
//                                         border: "none",
//                                         boxShadow: "none",
//                                         borderRadius: "8px",
//                                         overflowX: "auto",
//                                     }}
//                                 >
//                                     <Table
//                                         sx={{
//                                             minWidth: {xs: 300, sm: 600, md: 650},
//                                             "& .MuiTableCell-root": {
//                                                 borderColor: "#E7EAE9",
//                                                 padding: {xs: "8px 4px", sm: "12px 8px", md: "16px"},
//                                             },
//                                         }}
//                                         aria-label="Seat booking summary table"
//                                     >
//                                         <TableHead>
//                                             <TableRow>
//                                                 <TableCell align="center">
//                                                     <div
//                                                         className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#27337C]">
//                                                         Category
//                                                     </div>
//                                                 </TableCell>
//                                                 <TableCell align="center">
//                                                     <div
//                                                         className="font-inter grotesk text-sm sm:text-base md:text-sm font-semibold text-[#27337C]">
//                                                         Price
//                                                     </div>
//                                                 </TableCell>
//                                                 <TableCell align="center">
//                                                     <div
//                                                         className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#27337C]">
//                                                         Tickets
//                                                     </div>
//                                                 </TableCell>
//                                                 <TableCell align="center">
//                                                     <div
//                                                         className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#27337C]">
//                                                         Amount
//                                                     </div>
//                                                 </TableCell>
//                                             </TableRow>
//                                         </TableHead>
//                                         <TableBody>
//                                             {categories.map(({name, price, ticketTypeId}) => {
//                                                 const enableManualSelection =
//                                                     ticketTypesExistInApi[ticketTypeId] === false;
//                                                 const ticketsFromMap = selectedSeats.filter(
//                                                     (seat) => seat.type_id === ticketTypeId
//                                                 ).length;
//                                                 const manualCount = manualTicketCounts[ticketTypeId] || 0;
//                                                 const displayTickets = enableManualSelection
//                                                     ? ticketsFromMap + manualCount
//                                                     : ticketsFromMap;
//                                                 const displayAmount = (displayTickets * price).toFixed(2);
//
//                                                 if (displayTickets === 0 && !enableManualSelection) {
//                                                     return null;
//                                                 }
//
//                                                 return (
//                                                     <TableRow
//                                                         key={ticketTypeId}
//                                                         sx={{
//                                                             backgroundColor: "#F1F5F9",
//                                                             "&:last-child td, &:last-child th": {border: 0},
//                                                         }}
//                                                     >
//                                                         <TableCell align="center">
//                                                             <div
//                                                                 className="font-inter font-medium text-xs sm:text-sm md:text-base lg:text-lg text-[#27337C]">
//                                                                 {name}
//                                                             </div>
//                                                         </TableCell>
//                                                         <TableCell align="center">
//                                                             <div
//                                                                 className="font-inter font-medium text-xs sm:text-sm md:text-base text-[#27337C]">
//                                                                 {price.toFixed(2)} LKR
//                                                             </div>
//                                                         </TableCell>
//                                                         <TableCell align="center">
//                                                             {enableManualSelection ? (
//                                                                 <div
//                                                                     className="flex items-center justify-center space-x-2">
//                                                                     <button
//                                                                         onClick={() =>
//                                                                             dispatch(
//                                                                                 setManualTicketCounts({
//                                                                                     ticketTypeId,
//                                                                                     delta: -1,
//                                                                                 })
//                                                                             )
//                                                                         }
//                                                                         className="p-1 rounded-full bg-[#E0E0E0] hover:bg-[#D0D0D0] transition-colors cursor-pointer"
//                                                                         aria-label={`Decrease ${name} tickets`}
//                                                                     >
//                                                                         <svg
//                                                                             xmlns="http://www.w3.org/2000/svg"
//                                                                             width="24"
//                                                                             height="24"
//                                                                             viewBox="0 0 24 24"
//                                                                         >
//                                                                             <path
//                                                                                 fill="#000"
//                                                                                 d="M18 11H6a2 2 0 0 0 0 4h12a2 2 0 0 0 0-4"
//                                                                             />
//                                                                         </svg>
//                                                                     </button>
//                                                                     <span
//                                                                         className="font-inter text-xs sm:text-sm md:text-base text-[#000000]">
//                                     {displayTickets.toString().padStart(2, "0")}
//                                   </span>
//                                                                     <button
//                                                                         onClick={() =>
//                                                                             dispatch(
//                                                                                 setManualTicketCounts({
//                                                                                     ticketTypeId,
//                                                                                     delta: 1,
//                                                                                 })
//                                                                             )
//                                                                         }
//                                                                         className="p-1 rounded-full bg-[#E0E0E0] hover:bg-[#D0D0D0] transition-colors cursor-pointer"
//                                                                         aria-label={`Increase ${name} tickets`}
//                                                                     >
//                                                                         <svg
//                                                                             xmlns="http://www.w3.org/2000/svg"
//                                                                             width="24"
//                                                                             height="24"
//                                                                             viewBox="0 0 24 24"
//                                                                         >
//                                                                             <path
//                                                                                 fill="#000"
//                                                                                 d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4"
//                                                                             />
//                                                                         </svg>
//                                                                     </button>
//                                                                 </div>
//                                                             ) : (
//                                                                 <div
//                                                                     className="font-inter text-xs sm:text-sm md:text-base text-[#000000]">
//                                                                     {displayTickets.toString().padStart(2, "0")}
//                                                                 </div>
//                                                             )}
//                                                         </TableCell>
//                                                         <TableCell align="center">
//                                                             <div
//                                                                 className="font-inter text-xs sm:text-sm md:text-base text-[#000000]">
//                                                                 {displayAmount} LKR
//                                                             </div>
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 );
//                                             })}
//                                             <TableRow sx={{backgroundColor: "#F1F5F9"}}>
//                                                 <TableCell align="center">
//                                                     <div
//                                                         className="font-inter font-semibold text-sm sm:text-base md:text-lg text-[#27337C]">
//                                                         Total
//                                                     </div>
//                                                 </TableCell>
//                                                 <TableCell align="center"></TableCell>
//                                                 <TableCell align="center">
//                                                     <div
//                                                         className="font-inter font-bold text-xs sm:text-sm md:text-base text-[#27337C]">
//                                                         {totalTickets}
//                                                     </div>
//                                                 </TableCell>
//                                                 <TableCell align="center">
//                                                     <div
//                                                         className="font-inter font-bold text-xs sm:text-sm md:text-base text-[#27337C]">
//                                                         {totalAmount}
//                                                     </div>
//                                                 </TableCell>
//                                             </TableRow>
//                                         </TableBody>
//                                     </Table>
//                                 </TableContainer>
//                                 <div
//                                     className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#F1F5F9] rounded-md px-4 sm:px-8 lg:px-12 py-3 sm:py-4 mt-4 gap-2 sm:gap-4">
//                                     <div
//                                         className="font-inter text-[#27337C] text-sm sm:text-base md:text-lg font-semibold">
//                                         Seat Numbers
//                                     </div>
//                                     <div
//                                         className="font-inter font-medium text-[#27337C] text-xs sm:text-sm md:text-base flex-1 text-left sm:text-center">
//                                         {selectedSeatNumbers || "None"}
//                                     </div>
//                                     <div className="flex gap-2 sm:gap-4">
//                                         <button
//                                             onClick={() => {
//                                                 dispatch(resetBooking({eventId}));
//                                                 queryClient.invalidateQueries({queryKey: ["seatData", eventId]});
//                                                 localStorage.removeItem("tempBookingData");
//                                                 localStorage.removeItem("bookingSummaryToBill");
//                                             }}
//                                             className="bg-white cursor-pointer font-inter font-medium text-xs sm:text-sm md:text-base text-[#27337C] border-2 border-[#27337C] px-6 sm:px-8 md:px-10 py-2 rounded-md hover:bg-blue-50 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
//                                         >
//                                             Reset
//                                         </button>
//                                         <button
//                                             onClick={handleProceed}
//                                             className="bg-[#27337C] cursor-pointer font-inter font-medium text-xs sm:text-sm md:text-base text-white px-6 sm:px-8 md:px-10 py-2 rounded-md hover:bg-[#1e264f] transition-colors w-full sm:w-auto"
//                                         >
//                                             Proceed
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <LoginGuestModal
//                     isOpen={isLoginModalOpen}
//                     onClose={() => setIsLoginModalOpen(false)}
//                     onSignIn={handleSignInAndProceed}
//                     onContinueAsGuest={handleContinueAsGuestAndProceed}
//                 />
//                 <TimerModal
//                     open={isTimerModalOpen}
//                     onExtend={handleExtendTimer}
//                     onContinue={handleContinueTimer}
//                 />
//             </div>
//         </div>
//     );
// };
//
// export default memo(SeatBookingPage);


// ------------------ 2025.08.13 timer , commented check manual count

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
                                        width: {xs: 60, sm: 80},
                                        height: {xs: 60, sm: 80},
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: "relative",
                                            width: {xs: 60, sm: 80},
                                            height: {xs: 60, sm: 80},
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

// export default memo(SeatBookingPageContent);


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


// "use client";
//
// import React, {useEffect, useState, useCallback, useMemo, memo, Suspense} from "react";
// import {useSelector, useDispatch} from "react-redux";
// import {useRouter, useSearchParams} from "next/navigation";
// import {
//     Alert,
//     Paper,
//     Table,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     TableBody,
//     Typography,
//     Box,
//     CircularProgress,
//     Tooltip,
//     Fab,
//     Snackbar
// } from "@mui/material";
// import {useQueryClient} from "@tanstack/react-query";
// import HeroSection from "@/components/HeroSection";
// import SectionTitle from "@/components/SectionTitle";
// import SeatSelection from "@/components/SeatSelection";
// import LoginGuestModal from "@/components/LoginGuestModal";
// import TimerModal from "@/components/TimerModal";
// import {useCurrentUser} from "@/util/auth";
// import SeatBookingPageSkeleton from "@/components/skeletons/SeatBookingPageSkeleton";
// import {
//     resetBooking,
//     selectEventTicketDetails,
//     selectSelectedSeats,
//     selectManualTicketCounts,
//     setEventTicketDetails,
//     setManualTicketCounts,
//     setRestorationStatus,
// } from "@/store/bookingSlice";
// import {RootState} from "@/store/store";
// import {useSeatByEventId, useUnseatSelectApi, useCheckSeatCountApi} from "@/hooks/useBooking";
//
// // import {AxiosError} from "axios";
//
// interface Hero {
//     image: string;
//     title: string;
//     subTitle: string;
// }
//
// interface TicketFromEventPage {
//     price: number;
//     ticketCount: number | null;
//     ticketTypeId: number;
//     ticketTypeName: string;
// }
//
// interface StoredBookingData {
//     selectedSeats: SeatData[];
//     manualTicketCounts: Record<number, number>;
//     eventTicketDetails: TicketFromEventPage[];
//     eventId: string;
//     timestamp: number;
// }
//
// interface SeatData {
//     price: number;
//     seatId: string;
//     status: string;
//     type_id: number;
//     ticketTypeName?: string;
//     color?: string;
// }
//
// const SeatBookingContent: React.FC = () => {
//     const dispatch = useDispatch();
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const queryClient = useQueryClient();
//     const eventId = searchParams.get("eventId") || "";
//     const rawTicketDetails = searchParams.get("ticketDetails");
//     const location = searchParams.get("location");
//     const mapId = location?.split(" ")[0].toLowerCase();
//
//     const user = useCurrentUser();
//     const isAuthenticated = !!user;
//
//     const eventTicketDetails = useSelector((state: RootState) =>
//         selectEventTicketDetails(state)
//     );
//     const selectedSeats = useSelector((state: RootState) =>
//         selectSelectedSeats(state)
//     );
//     const manualTicketCounts = useSelector((state: RootState) =>
//         selectManualTicketCounts(state)
//     );
//     const ticketTypesExistInApi = useSelector(
//         (state: RootState) => state.booking.ticketTypesExistInApi
//     );
//     const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//     const [errorMessage, setErrorMessage] = useState<string | null>(null);
//     const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
//     const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
//     const [hasExtended, setHasExtended] = useState(false);
//     const [isExpired, setIsExpired] = useState(false);
//     const [ticketAvailability, setTicketAvailability] = useState<Record<number, number | null>>({});
//     const [checkingAvailability, setCheckingAvailability] = useState<Record<number, boolean>>({});
//
//     const {isLoading, error: eventError} =
//         useSeatByEventId(eventId);
//     const unselectSeatMutation = useUnseatSelectApi();
//     const checkSeatCount = useCheckSeatCountApi();
//     // CHANGED: Restored timer to 900 seconds (15 minutes) and fixed stop/restart logic
//     useEffect(() => {
//         const totalTickets = Object.values(manualTicketCounts).reduce(
//             (sum, count) => sum + count,
//             0
//         ) + selectedSeats.length;
//
//         if (totalTickets === 0 && timerSeconds !== null) {
//             setTimerSeconds(null);
//             setIsTimerModalOpen(false);
//             setHasExtended(false);
//             setIsExpired(false);
//         } else if (totalTickets > 0 && timerSeconds === null) {
//             setTimerSeconds(900); // Restored to 900 seconds (15 minutes)
//             setHasExtended(false);
//             setIsExpired(false);
//         }
//     }, [selectedSeats, manualTicketCounts, timerSeconds]);
//
//     // Timer countdown logic
//     // CHANGED: Restored modal trigger to 120 seconds (2 minutes), improved error handling for unselect
//     useEffect(() => {
//         if (timerSeconds === null || isExpired) return;
//
//         if (timerSeconds <= 0) {
//             setIsExpired(true);
//             // CHANGED: Improved error handling for unselect on expiration
//             const unselectPromises = selectedSeats.map((seat) =>
//                 unselectSeatMutation.mutateAsync({event_id: eventId, seat_id: seat.seatId}).catch((error) => {
//                     console.error(`Failed to unselect seat ${seat.seatId} on expiration:`, error);
//                     return Promise.resolve(); // Continue with other unselects
//                 })
//             );
//             Promise.all(unselectPromises)
//                 .then(() => {
//                     dispatch(resetBooking());
//                     queryClient.invalidateQueries({queryKey: ["seatData", eventId]});
//                     setErrorMessage("Your seat selection time has expired. Please start again.");
//                     setTimeout(() => setErrorMessage(null), 5000);
//                 })
//                 .catch((error) => {
//                     console.error("Failed to unselect all seats on expiration:", error);
//                     setErrorMessage("Failed to reset seats on expiration. Please try again.");
//                     setTimeout(() => setErrorMessage(null), 5000);
//                 });
//             return;
//         }
//
//         if (timerSeconds === 120 && !hasExtended) {
//             setIsTimerModalOpen(true); // Restored to 120 seconds
//         }
//
//         const interval = setInterval(() => {
//             setTimerSeconds((prev) => (prev !== null ? prev - 1 : null));
//         }, 1000);
//
//         return () => clearInterval(interval);
//     }, [timerSeconds, dispatch, eventId, hasExtended, isExpired, queryClient, selectedSeats, unselectSeatMutation]);
//
//     const handleExtendTimer = useCallback(() => {
//         setTimerSeconds((prev) => (prev !== null ? prev + 300 : 300)); // Add 5 minutes
//         setIsTimerModalOpen(false);
//         setHasExtended(true);
//     }, []);
//
//     const handleContinueTimer = useCallback(() => {
//         setIsTimerModalOpen(false);
//     }, []);
//
//     // Handle ticket details and restoration
//     useEffect(() => {
//         if (rawTicketDetails) {
//             try {
//                 const parsedDetails: TicketFromEventPage[] = JSON.parse(rawTicketDetails);
//                 dispatch(setEventTicketDetails(parsedDetails));
//
//                 const initialManualCounts: Record<number, number> = {};
//                 parsedDetails.forEach((ticket) => {
//                     initialManualCounts[ticket.ticketTypeId] = 0;
//                 });
//
//                 const storedData = localStorage.getItem("tempBookingData");
//                 if (storedData) {
//                     try {
//                         const parsedStoredData: StoredBookingData = JSON.parse(storedData);
//                         if (
//                             parsedStoredData.eventId === eventId &&
//                             parsedStoredData.eventTicketDetails?.length === parsedDetails.length &&
//                             parsedStoredData.eventTicketDetails.every(
//                                 (storedTicket, index) =>
//                                     storedTicket.ticketTypeId === parsedDetails[index].ticketTypeId &&
//                                     storedTicket.ticketTypeName === parsedDetails[index].ticketTypeName &&
//                                     storedTicket.price === parsedDetails[index].price
//                             ) &&
//                             Date.now() - parsedStoredData.timestamp < 3600000 && // 1 hour validity
//                             parsedStoredData.selectedSeats.length > 0
//                         ) {
//                             dispatch(setRestorationStatus("loading"));
//                             Object.entries(parsedStoredData.manualTicketCounts).forEach(
//                                 ([ticketTypeId, count]) => {
//                                     dispatch(
//                                         setManualTicketCounts({
//                                             ticketTypeId: Number(ticketTypeId),
//                                             delta: count,
//                                         })
//                                     );
//                                 }
//                             );
//                             setTimeout(() => {
//                                 dispatch(setRestorationStatus("success"));
//                                 setTimeout(() => dispatch(setRestorationStatus(null)), 3000);
//                             }, 1000);
//                         } else {
//                             Object.entries(initialManualCounts).forEach(
//                                 ([ticketTypeId, count]) => {
//                                     dispatch(
//                                         setManualTicketCounts({
//                                             ticketTypeId: Number(ticketTypeId),
//                                             delta: count,
//                                         })
//                                     );
//                                 }
//                             );
//                             localStorage.removeItem("tempBookingData");
//                             localStorage.removeItem("bookingSummaryToBill");
//                         }
//                     } catch (e) {
//                         console.error("Failed to parse stored booking data:", e);
//                         Object.entries(initialManualCounts).forEach(
//                             ([ticketTypeId, count]) => {
//                                 dispatch(
//                                     setManualTicketCounts({
//                                         ticketTypeId: Number(ticketTypeId),
//                                         delta: count,
//                                     })
//                                 );
//                             }
//                         );
//                         localStorage.removeItem("tempBookingData");
//                         localStorage.removeItem("bookingSummaryToBill");
//                         dispatch(setRestorationStatus("failed"));
//                         setTimeout(() => dispatch(setRestorationStatus(null)), 3000);
//                     }
//                 } else {
//                     Object.entries(initialManualCounts).forEach(([ticketTypeId, count]) => {
//                         dispatch(
//                             setManualTicketCounts({
//                                 ticketTypeId: Number(ticketTypeId),
//                                 delta: count,
//                             })
//                         );
//                     });
//                 }
//             } catch (e) {
//                 console.error("Failed to parse ticket details from URL:", e);
//                 dispatch(setEventTicketDetails([]));
//                 localStorage.removeItem("tempBookingData");
//                 localStorage.removeItem("bookingSummaryToBill");
//             }
//         }
//     }, [rawTicketDetails, eventId, dispatch]);
//
//     const categories = useMemo(
//         () =>
//             eventTicketDetails
//                 .map((ticket) => ({
//                     name: ticket.ticketTypeName,
//                     price: ticket.price,
//                     ticketTypeId: ticket.ticketTypeId,
//                 }))
//                 .sort((a, b) => a.price - b.price),
//         [eventTicketDetails]
//     );
//
//     // const fetchAvailability = useCallback(async (ticketTypeId: number) => {
//     //     let low = 0;
//     //     let high = 5; // Arbitrary upper bound; adjust based on expected max tickets
//     //     while (low <= high) {
//     //         const mid = Math.floor((low + high) / 2);
//     //         let available = false;
//     //         try {
//     //             const data = await checkSeatCount.mutateAsync({
//     //                 event_id: eventId,
//     //                 ticket_type_id: ticketTypeId.toString(),
//     //                 count: mid.toString(),
//     //             });
//     //             available = data.available;
//     //         } catch (error) {
//     //             console.error(`Failed to check availability for count ${mid}:`, error);
//     //             available = false;
//     //         }
//     //         if (available) {
//     //             low = mid + 1;
//     //         } else {
//     //             high = mid - 1;
//     //         }
//     //     }
//     //     setTicketAvailability((prev) => ({...prev, [ticketTypeId]: high}));
//     //     return high;
//     // }, [checkSeatCount, eventId]);
//
//     const fetchAvailability = useCallback(
//         async (ticketTypeId: number) => {
//             setCheckingAvailability((prev) => ({...prev, [ticketTypeId]: true}));
//             try {
//                 // Try a high count to trigger the API's availability limit message
//                 const data = await checkSeatCount.mutateAsync({
//                     event_id: eventId,
//                     ticket_type_id: ticketTypeId.toString(),
//                     count: "100", // Arbitrary high number to get the max available
//                 });
//
//                 let availableSeats: number;
//                 if (data.available) {
//                     // If 100 seats are available, assume a high limit (adjust as needed)
//                     availableSeats = 100;
//                 } else {
//                     // Parse the message to extract the number of available seats
//                     const match = data.message.match(/Only (\d+) seats are available/);
//                     availableSeats = match ? parseInt(match[1], 10) : 0; // Default to 0 if parsing fails
//                 }
//
//                 setTicketAvailability((prev) => ({...prev, [ticketTypeId]: availableSeats}));
//                 return availableSeats;
//             } catch (error) {
//                 console.error(`Failed to fetch availability for ticket type ${ticketTypeId}:`, error);
//                 setTicketAvailability((prev) => ({...prev, [ticketTypeId]: 0}));
//                 return 0;
//             } finally {
//                 setCheckingAvailability((prev) => ({...prev, [ticketTypeId]: false}));
//             }
//         },
//         [checkSeatCount, eventId]
//     );
//
//
//     // const handleIncrease = useCallback(
//     //     async (ticketTypeId: number) => {
//     //         if (checkingAvailability[ticketTypeId]) return;
//     //         setCheckingAvailability((prev) => ({ ...prev, [ticketTypeId]: true }));
//     //
//     //         const currentCount = manualTicketCounts[ticketTypeId] || 0;
//     //         const newCount = currentCount + 1;
//     //         let avail = ticketAvailability[ticketTypeId];
//     //
//     //         if (avail === null) {
//     //             avail = await fetchAvailability(ticketTypeId);
//     //         }
//     //
//     //         const category = categories.find((c) => c.ticketTypeId === ticketTypeId)?.name || "this category";
//     //
//     //         if (newCount > avail) {
//     //             const newAvail = await fetchAvailability(ticketTypeId);
//     //             if (newCount > newAvail) {
//     //                 setErrorMessage(`Only ${newAvail} tickets available for ${category}.`);
//     //                 setTimeout(() => setErrorMessage(null), 5000);
//     //                 setCheckingAvailability((prev) => ({ ...prev, [ticketTypeId]: false }));
//     //                 return;
//     //             } else {
//     //                 avail = newAvail;
//     //             }
//     //         }
//     //
//     //         dispatch(setManualTicketCounts({ ticketTypeId, delta: 1 }));
//     //         setCheckingAvailability((prev) => ({ ...prev, [ticketTypeId]: false }));
//     //     },
//     //     [checkingAvailability, manualTicketCounts, ticketAvailability, fetchAvailability, dispatch, categories]
//     // );
//
//     const handleIncrease = useCallback(
//         async (ticketTypeId: number) => {
//             if (checkingAvailability[ticketTypeId]) return;
//
//             const currentCount = manualTicketCounts[ticketTypeId] || 0;
//             const newCount = currentCount + 1;
//
//             // Fetch availability if not already known
//             let avail = ticketAvailability[ticketTypeId];
//             if (avail === null || avail === undefined) {
//                 avail = await fetchAvailability(ticketTypeId);
//             }
//
//             const category = categories.find((c) => c.ticketTypeId === ticketTypeId)?.name || "this category";
//
//             if (newCount > avail) {
//                 setErrorMessage(`Only ${avail} tickets available for ${category}.`);
//                 setTimeout(() => setErrorMessage(null), 5000);
//                 return;
//             }
//
//             dispatch(setManualTicketCounts({ticketTypeId, delta: 1}));
//         },
//         [checkingAvailability, manualTicketCounts, ticketAvailability, fetchAvailability, dispatch, categories]
//     );
//
//     // const handleDecrease = useCallback(
//     //     (ticketTypeId: number) => {
//     //         const currentCount = manualTicketCounts[ticketTypeId] || 0;
//     //         if (currentCount > 0) {
//     //             dispatch(setManualTicketCounts({ticketTypeId, delta: -1}));
//     //         }
//     //     },
//     //     [dispatch, manualTicketCounts]
//     // );
//
//     const handleDecrease = useCallback(
//         (ticketTypeId: number) => {
//             const currentCount = manualTicketCounts[ticketTypeId] || 0;
//             if (currentCount > 0) {
//                 dispatch(setManualTicketCounts({ticketTypeId, delta: -1}));
//             }
//         },
//         [dispatch, manualTicketCounts]
//     );
//
//     useEffect(() => {
//         const initialAvailability: Record<number, number | null> = {};
//         eventTicketDetails.forEach((ticket) => {
//             initialAvailability[ticket.ticketTypeId] = null;
//         });
//         setTicketAvailability(initialAvailability);
//     }, [eventTicketDetails]);
//
//     const rows = useMemo(
//         () =>
//             categories
//                 .map(({name, price, ticketTypeId}) => {
//                     const enableManualSelection = ticketTypesExistInApi[ticketTypeId] === false;
//                     const ticketsFromMap = selectedSeats.filter(
//                         (seat) => seat.type_id === ticketTypeId
//                     ).length;
//                     const manualCount = manualTicketCounts[ticketTypeId] || 0;
//                     const combinedTickets = enableManualSelection
//                         ? ticketsFromMap + manualCount
//                         : ticketsFromMap;
//                     const amount = combinedTickets * price;
//
//                     return {
//                         category: name,
//                         price: `${price.toFixed(2)} LKR`,
//                         tickets: combinedTickets.toString().padStart(2, "0"),
//                         amount: `${amount.toFixed(2)} LKR`,
//                         ticketTypeId,
//                         enableManualSelection,
//                         maxAvailableTickets: ticketAvailability[ticketTypeId] ?? null,
//                     };
//                 })
//                 .filter(
//                     (row) =>
//                         parseFloat(row.amount.replace(" LKR", "")) > 0 ||
//                         row.enableManualSelection
//                 ),
//         [categories, selectedSeats, manualTicketCounts, ticketTypesExistInApi, ticketAvailability]
//     );
//
//     const totalTickets = useMemo(
//         () =>
//             rows
//                 .reduce((sum, row) => sum + parseInt(row.tickets), 0)
//                 .toString()
//                 .padStart(2, "0"),
//         [rows]
//     );
//
//     const totalAmount = useMemo(
//         () =>
//             `${rows
//                 .reduce((sum, row) => sum + parseFloat(row.amount.replace(" LKR", "")), 0)
//                 .toFixed(2)} LKR`,
//         [rows]
//     );
//
//     const selectedSeatNumbers = useMemo(
//         () =>
//             selectedSeats
//                 .filter((seat) => ticketTypesExistInApi[seat.type_id] === true)
//                 .map((seat) => seat.seatId)
//                 .join(", "),
//         [selectedSeats, ticketTypesExistInApi]
//     );
//
//     const saveBookingSummaryToLocalStorage = useCallback(() => {
//         const bookingSummaryData = {
//             rows: rows.filter((row) => parseFloat(row.amount.replace(" ", "")) > 0),
//             totalTickets: totalTickets,
//             totalAmount,
//             selectedSeatNumbers,
//         };
//         localStorage.setItem(
//             "bookingSummaryToBill",
//             JSON.stringify(bookingSummaryData)
//         );
//     }, [rows, totalTickets, totalAmount, selectedSeatNumbers]);
//
//     const handleProceed = useCallback(() => {
//         const totalSelectedTickets = rows.reduce(
//             (sum, row) => sum + parseInt(row.tickets),
//             0
//         );
//
//         if (totalSelectedTickets === 0) {
//             setErrorMessage(
//                 "Please select at least one seat or add tickets manually to proceed."
//             );
//             setTimeout(() => setErrorMessage(null), 5000);
//             return;
//         }
//
//         saveBookingSummaryToLocalStorage();
//
//         if (isAuthenticated) {
//             router.push(
//                 `/billing-details?summary=${encodeURIComponent(
//                     localStorage.getItem("bookingSummaryToBill") || "{}"
//                 )}&eventId=${encodeURIComponent(eventId)}`
//             );
//         } else {
//             setIsLoginModalOpen(true);
//         }
//     }, [rows, isAuthenticated, router, eventId, saveBookingSummaryToLocalStorage]);
//
//     const handleSignInAndProceed = useCallback(() => {
//         setIsLoginModalOpen(false);
//         router.push(
//             `/billing-details?summary=${encodeURIComponent(
//                 localStorage.getItem("bookingSummaryToBill") || "{}"
//             )}&eventId=${encodeURIComponent(eventId)}`
//         );
//     }, [router, eventId]);
//
//     const handleContinueAsGuestAndProceed = useCallback(() => {
//         setIsLoginModalOpen(false);
//         router.push(
//             `/billing-details?summary=${encodeURIComponent(
//                 localStorage.getItem("bookingSummaryToBill") || "{}"
//             )}&eventId=${encodeURIComponent(eventId)}`
//         );
//     }, [router, eventId]);
//
//     // CHANGED: Improved handleReset to handle unselect errors gracefully
//     const handleReset = useCallback(async () => {
//         const seatIds = selectedSeats.map((seat) => seat.seatId);
//         try {
//             const unselectPromises = seatIds.map((seatId) =>
//                 unselectSeatMutation.mutateAsync({event_id: eventId, seat_id: seatId}).catch((error) => {
//                     console.error(`Failed to unselect seat ${seatId}:`, error);
//                     return Promise.resolve();
//                 })
//             );
//             await Promise.all(unselectPromises);
//             dispatch(resetBooking());
//             queryClient.invalidateQueries({queryKey: ["seatData", eventId]});
//             localStorage.removeItem("tempBookingData");
//             localStorage.removeItem("bookingSummaryToBill");
//         } catch (error) {
//             console.error("Failed to reset seats:", error);
//             setErrorMessage("Failed to reset seats. Please try again.");
//             setTimeout(() => setErrorMessage(null), 5000);
//         }
//     }, [dispatch, eventId, queryClient, selectedSeats, unselectSeatMutation]);
//
//     const formatTimerDisplay = (seconds: number | null) => {
//         if (seconds === null) return "--:--";
//         const minutes = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return `${minutes.toString().padStart(2, "0")}:${secs
//             .toString()
//             .padStart(2, "0")}`;
//     };
//
//
//
//     const handleCloseError = useCallback(() => {
//         setErrorMessage(null);
//     }, []);
//
//
//     if (isLoading) {
//         return (
//             <div className="py-4 px-2 sm:px-4 lg:px-6">
//                 <div className="max-w-7xl mx-auto">
//                     <SectionTitle title="Seat Booking"/>
//                     <div className="mt-4 sm:mt-6 py-8 sm:py-12">
//                         <SeatBookingPageSkeleton/>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
//
//     if (eventError) {
//         return (
//             <div className="min-h-screen flex justify-center items-center p-4">
//                 <Alert severity="error" sx={{maxWidth: 500}}>
//                     <div className="text-lg font-semibold mb-2">
//                         Error Loading Seat Information
//                     </div>
//                     <div>{eventError && <div>Seat data error: {eventError.message}</div>}</div>
//                     <div className="mt-2 text-sm">Please refresh the page to try again.</div>
//                 </Alert>
//             </div>
//         );
//     }
//
//
//     return (
//         <div className="py-4 px-2 sm:px-4 lg:px-6">
//             <div className="max-w-7xl mx-auto">
//                 <SectionTitle title="Seat Booking"/>
//                 <div className="mt-1 sm:mt-6 py-4 sm:py-12">
//                     {/*{errorMessage && (*/}
//                     {/*    <Alert*/}
//                     {/*        severity="error"*/}
//                     {/*        sx={{mb: 2}}*/}
//                     {/*        onClose={() => setErrorMessage(null)}*/}
//                     {/*    >*/}
//                     {/*        {errorMessage}*/}
//                     {/*    </Alert>*/}
//                     {/*)}*/}
//
//                     <Snackbar
//                         open={!!errorMessage}
//                         autoHideDuration={5000}
//                         onClose={handleCloseError}
//                         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//                         sx={{
//                             "& .MuiSnackbarContent-root": {
//                                 backgroundColor: "#FF6B6B",
//                                 color: "#1A1A1A",
//                                 borderRadius: "8px",
//                                 boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
//                                 fontFamily: "Inter, sans-serif",
//                                 fontSize: { xs: "0.9rem", sm: "1rem" },
//                                 fontWeight: 500,
//                                 padding: "12px 24px",
//                                 maxWidth: "400px",
//                                 transition: "background-color 0.2s ease-in-out",
//                                 "&:hover": {
//                                     backgroundColor: "#FF5A5A",
//                                 },
//                             },
//                         }}
//                     >
//                         <Alert
//                             onClose={handleCloseError}
//                             severity="error"
//                             sx={{
//                                 width: "100%",
//                                 backgroundColor: "#FF6B6B",
//                                 color: "#1A1A1A",
//                                 "& .MuiAlert-icon": {
//                                     color: "#F5F5F5",
//                                 },
//                                 "& .MuiAlert-action": {
//                                     color: "#F5F5F5",
//                                     "&:hover": {
//                                         color: "#FFFFFF",
//                                     },
//                                 },
//                             }}
//                         >
//                             {errorMessage}
//                         </Alert>
//                     </Snackbar>
//
//
//                     <Box sx={{display: "flex", justifyContent: "center", mb: 4}}>
//                         {timerSeconds !== null && (
//                             <Tooltip
//                                 title="Time remaining to complete your seat selection"
//                                 placement="top"
//                             >
//                                 <Fab
//                                     sx={{
//                                         position: "fixed",
//                                         bottom: {xs: 16, sm: 24},
//                                         right: {xs: 16, sm: 24},
//                                         width: {xs: 60, sm: 80},
//                                         height: {xs: 60, sm: 80},
//                                     }}
//                                 >
//                                     <Box
//                                         sx={{
//                                             position: "relative",
//                                             width: {xs: 60, sm: 80},
//                                             height: {xs: 60, sm: 80},
//                                             display: "flex",
//                                             alignItems: "center",
//                                             justifyContent: "center",
//                                             animation:
//                                                 timerSeconds <= 120
//                                                     ? "pulse 1.5s infinite"
//                                                     : "none",
//                                             "@keyframes pulse": {
//                                                 "0%": {transform: "scale(1)"},
//                                                 "50%": {transform: "scale(1.1)"},
//                                                 "100%": {transform: "scale(1)"},
//                                             },
//                                         }}
//                                     >
//                                         <CircularProgress
//                                             variant="determinate"
//                                             value={(timerSeconds / 900) * 100} // CHANGED: Corrected progress calculation for 900 seconds
//                                             size={80}
//                                             thickness={4}
//                                             sx={{
//                                                 color: timerSeconds <= 120 ? "#d32f2f" : "#27337C",
//                                                 position: "absolute",
//                                                 top: 0,
//                                                 left: 0,
//                                             }}
//                                         />
//                                         <Typography
//                                             sx={{
//                                                 color: timerSeconds <= 120 ? "#d32f2f" : "#27337C",
//                                                 fontWeight: "bold",
//                                                 fontSize: {xs: "0.9rem", sm: "1.1rem"},
//                                             }}
//                                         >
//                                             {formatTimerDisplay(timerSeconds)}
//                                         </Typography>
//                                     </Box>
//                                 </Fab>
//                             </Tooltip>
//                         )}
//                     </Box>
//                     <div className="w-full overflow-x-auto">
//                         <SeatSelection mapId={mapId} eventId={eventId}/>
//                     </div>
//                     <div className="py-4 px-2 sm:px-4 lg:px-6">
//                         <div className="max-w-4xl mx-auto">
//                             <TableContainer
//                                 component={Paper}
//                                 sx={{
//                                     border: "none",
//                                     boxShadow: "none",
//                                     borderRadius: "8px",
//                                     overflowX: "auto",
//                                 }}
//                             >
//                                 <Table
//                                     sx={{
//                                         minWidth: {xs: 300, sm: 600, md: 650},
//                                         "& .MuiTableCell-root": {
//                                             borderColor: "#E7EAE9",
//                                             padding: {xs: "8px 4px", sm: "12px 8px", md: "16px"},
//                                         },
//                                     }}
//                                     aria-label="Seat booking summary table"
//                                 >
//                                     <TableHead>
//                                         <TableRow>
//                                             <TableCell align="center">
//                                                 <div
//                                                     className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#27337C]">
//                                                     Category
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell align="center">
//                                                 <div
//                                                     className="font-inter grotesk text-sm sm:text-base md:text-sm font-semibold text-[#27337C]">
//                                                     Price
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell align="center">
//                                                 <div
//                                                     className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#27337C]">
//                                                     Tickets
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell align="center">
//                                                 <div
//                                                     className="font-inter grotesk text-sm sm:text-base md:text-lg font-semibold text-[#27337C]">
//                                                     Amount
//                                                 </div>
//                                             </TableCell>
//                                         </TableRow>
//                                     </TableHead>
//                                     <TableBody>
//                                         {categories.map(({name, price, ticketTypeId}) => {
//                                             const enableManualSelection =
//                                                 ticketTypesExistInApi[ticketTypeId] === false;
//                                             const ticketsFromMap = selectedSeats.filter(
//                                                 (seat) => seat.type_id === ticketTypeId
//                                             ).length;
//                                             const manualCount = manualTicketCounts[ticketTypeId] || 0;
//                                             const displayTickets = enableManualSelection
//                                                 ? ticketsFromMap + manualCount
//                                                 : ticketsFromMap;
//                                             const displayAmount = (displayTickets * price).toFixed(2);
//
//                                             if (displayTickets === 0 && !enableManualSelection) {
//                                                 return null;
//                                             }
//
//                                             return (
//                                                 <TableRow
//                                                     key={ticketTypeId}
//                                                     sx={{
//                                                         backgroundColor: "#F1F5F9",
//                                                         "&:last-child td, &:last-child th": {border: 0},
//                                                     }}
//                                                 >
//                                                     <TableCell align="center">
//                                                         <div
//                                                             className="font-inter font-medium text-xs sm:text-sm md:text-base lg:text-lg text-[#27337C]">
//                                                             {name}
//                                                         </div>
//                                                     </TableCell>
//                                                     <TableCell align="center">
//                                                         <div
//                                                             className="font-inter font-medium text-xs sm:text-sm md:text-base text-[#27337C]">
//                                                             {price.toFixed(2)} LKR
//                                                         </div>
//                                                     </TableCell>
//                                                     <TableCell align="center">
//                                                         {enableManualSelection ? (
//                                                             <div
//                                                                 className="flex items-center justify-center space-x-2">
//                                                                 <button
//                                                                     onClick={() => handleDecrease(ticketTypeId)}
//                                                                     disabled={(manualCount === 0) || checkingAvailability[ticketTypeId]}
//                                                                     className={`p-1 rounded-full bg-[#E0E0E0] hover:bg-[#D0D0D0] transition-colors cursor-pointer ${
//                                                                         (manualCount === 0 || checkingAvailability[ticketTypeId]) ? 'opacity-50 cursor-not-allowed' : ''
//                                                                     }`}
//                                                                     aria-label={`Decrease ${name} tickets`}
//                                                                 >
//                                                                     <svg
//                                                                         xmlns="http://www.w3.org/2000/svg"
//                                                                         width="24"
//                                                                         height="24"
//                                                                         viewBox="0 0 24 24"
//                                                                         fill="none"
//                                                                         stroke="currentColor"
//                                                                         strokeWidth="2"
//                                                                         strokeLinecap="round"
//                                                                         strokeLinejoin="round"
//                                                                     >
//                                                                         <path d="M5 12h14"/>
//                                                                     </svg>
//                                                                 </button>
//                                                                 <span
//                                                                     className="font-inter text-xs sm:text-sm md:text-base text-[#000000]">
//                                                                         {displayTickets.toString().padStart(2, "0")}
//                                                                     </span>
//                                                                 <button
//                                                                     onClick={() => handleIncrease(ticketTypeId)}
//                                                                     disabled={checkingAvailability[ticketTypeId]}
//                                                                     className={`p-1 rounded-full bg-[#E0E0E0] hover:bg-[#D0D0D0] transition-colors cursor-pointer ${
//                                                                         checkingAvailability[ticketTypeId] ? 'opacity-50 cursor-not-allowed' : ''
//                                                                     }`}
//                                                                     aria-label={`Increase ${name} tickets`}
//                                                                 >
//                                                                     <svg
//                                                                         xmlns="http://www.w3.org/2000/svg"
//                                                                         width="24"
//                                                                         height="24"
//                                                                         viewBox="0 0 24 24"
//                                                                         fill="none"
//                                                                         stroke="currentColor"
//                                                                         strokeWidth="2"
//                                                                         strokeLinecap="round"
//                                                                         strokeLinejoin="round"
//                                                                     >
//                                                                         <path d="M12 5v14M5 12h14"/>
//                                                                     </svg>
//                                                                 </button>
//                                                             </div>
//                                                         ) : (
//                                                             <div
//                                                                 className="font-inter text-xs sm:text-sm md:text-base text-[#000000]">
//                                                                 {displayTickets.toString().padStart(2, "0")}
//                                                             </div>
//                                                         )}
//                                                     </TableCell>
//                                                     <TableCell align="center">
//                                                         <div
//                                                             className="font-inter text-xs sm:text-sm md:text-base text-[#000000]">
//                                                             {displayAmount} LKR
//                                                         </div>
//                                                     </TableCell>
//                                                 </TableRow>
//                                             );
//                                         })}
//                                         <TableRow sx={{backgroundColor: "#F1F5F9"}}>
//                                             <TableCell align="center">
//                                                 <div
//                                                     className="font-inter font-semibold text-sm sm:text-base md:text-lg text-[#27337C]">
//                                                     Total
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell align="center"></TableCell>
//                                             <TableCell align="center">
//                                                 <div
//                                                     className="font-inter font-bold text-xs sm:text-sm md:text-base text-[#27337C]">
//                                                     {totalTickets}
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell align="center">
//                                                 <div
//                                                     className="font-inter font-bold text-xs sm:text-sm md:text-base text-[#27337C]">
//                                                     {totalAmount}
//                                                 </div>
//                                             </TableCell>
//                                         </TableRow>
//                                     </TableBody>
//                                 </Table>
//                             </TableContainer>
//                             <div
//                                 className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#F1F5F9] rounded-md px-4 sm:px-8 lg:px-12 py-3 sm:py-4 mt-4 gap-2 sm:gap-4">
//                                 <div
//                                     className="font-inter text-[#27337C] text-sm sm:text-base md:text-lg font-semibold">
//                                     Seat Numbers
//                                 </div>
//                                 <div
//                                     className="font-inter font-medium text-[#27337C] text-xs sm:text-sm md:text-base flex-1 text-left sm:text-center">
//                                     {selectedSeatNumbers || "None"}
//                                 </div>
//                                 <div className="flex gap-2 sm:gap-4">
//                                     <button
//                                         onClick={handleReset}
//                                         className="bg-white cursor-pointer font-inter font-medium text-xs sm:text-sm md:text-base text-[#27337C] border-2 border-[#27337C] px-6 sm:px-8 md:px-10 py-2 rounded-md hover:bg-blue-50 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
//                                     >
//                                         Reset
//                                     </button>
//                                     <button
//                                         onClick={handleProceed}
//                                         className="bg-[#27337C] cursor-pointer font-inter font-medium text-xs sm:text-sm md:text-base text-white px-6 sm:px-8 md:px-10 py-2 rounded-md hover:bg-[#1e264f] transition-colors w-full sm:w-auto"
//                                     >
//                                         Proceed
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <LoginGuestModal
//                 isOpen={isLoginModalOpen}
//                 onClose={() => setIsLoginModalOpen(false)}
//                 onSignIn={handleSignInAndProceed}
//                 onContinueAsGuest={handleContinueAsGuestAndProceed}
//             />
//             <TimerModal
//                 open={isTimerModalOpen}
//                 onExtend={handleExtendTimer}
//                 onContinue={handleContinueTimer}
//             />
//         </div>
//     );
// };
//
// // export default memo(SeatBookingPageContent);
//
//
// const SeatBookingPage: React.FC = () => {
//     const hero: Hero = {
//         image: "/payment-successful-hero.png",
//         title: "Seat Booking",
//         subTitle: "Discover your favorite entertainment right here",
//     };
//
//     return (
//         <div className="min-h-screen bg-white">
//             <HeroSection hero={hero}/>
//             <Suspense
//                 fallback={
//                     <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
//                         <CircularProgress size={50} sx={{color: "#27337C"}}/>
//                         <div className="mt-4 text-lg text-gray-600">Loading seat booking...</div>
//                     </div>
//                 }
//             >
//                 <SeatBookingContent/>
//             </Suspense>
//         </div>
//     );
// };
//
// export default memo(SeatBookingPage);