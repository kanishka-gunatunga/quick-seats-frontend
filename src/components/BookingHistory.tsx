// "use client";
// import React, { useState, useCallback, memo, useMemo } from "react";
// import Pagination from "@/components/Pagination";
// import { useBookingHistory } from "@/hooks/useUser";
// import dayjs from "dayjs";
// import utc from "dayjs/plugin/utc";
// import timezone from "dayjs/plugin/timezone";
//
// dayjs.extend(utc);
// dayjs.extend(timezone);
//
// interface TicketType {
//     type: string;
//     count: number;
// }
//
// interface BookingItem {
//     event_name: string;
//     start_date_time: string;
//     tickets: TicketType[];
// }
//
// interface BookingHistoryResponse {
//     booking_history: BookingItem[];
// }
//
// interface EventCardProps {
//     eventName: string;
//     date: string;
//     time: string;
//     tickets: TicketType[];
//     status: "Issued" | "Upcoming";
// }
//
// interface TicketDetails {
//     eventName: string;
//     date: string;
//     time: string;
//     tickets: TicketType[];
//     status: "Issued" | "Upcoming";
// }
//
// const EventCard: React.FC<TicketDetails> = memo(
//     ({ eventName, date, time, tickets, status }) => {
//         const statusClasses =
//             status === "Issued"
//                 ? "bg-[#FDF7EA] text-[#FFC217]"
//                 : "bg-[#E8F2ED] text-[#117F45]";
//         const statusDotClasses =
//             status === "Issued" ? "bg-[#FFC217]" : "bg-[#117F45]";
//
//         const totalTickets = tickets.reduce((sum, ticket) => sum + ticket.count, 0);
//
//         return (
//             <div
//                 className="px-4 py-6 border border-[#E7EAE9] rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow w-full max-w-full mx-auto"
//                 role="article"
//                 aria-label={`Event card for ${eventName}`}
//             >
//                 <div className="flex flex-col px-8 sm:flex-row justify-between items-start sm:items-center gap-4">
//                     {/* Event Details */}
//                     <div className="flex-1">
//                         <h3 className="text-lg sm:text-xl font-inter font-semibold text-[#000000]">
//                             {eventName}
//                         </h3>
//                         <p className="text-sm text-[#6B7280] font-inter font-medium mt-1">
//                             {date} • {time}
//                         </p>
//                     </div>
//
//                     {/* Ticket Details */}
//                     <div className="flex-1 text-sm sm:text-base text-[#6B7280] font-inter">
//                         {tickets.map((ticket, index) => (
//                             <div key={index}>
//                                 {ticket.type} • {ticket.count} Ticket{ticket.count !== 1 ? "s" : ""}
//                             </div>
//                         ))}
//                         <div className="font-semibold mt-1">
//                             Total: {totalTickets} Ticket{totalTickets !== 1 ? "s" : ""}
//                         </div>
//                     </div>
//
//                     {/* Status Badge */}
//                     <div
//                         className={`px-2 py-1 flex items-center text-xs font-medium rounded-md ${statusClasses}`}
//                         aria-label={`Status: ${status}`}
//                     >
//             <span className="mr-1">
//               <div className={`h-1.5 w-1.5 rounded-full ${statusDotClasses}`} />
//             </span>
//                         {status}
//                     </div>
//                 </div>
//             </div>
//         );
//     }
// );
// EventCard.displayName = "EventCard";
//
// const BookingHistory = ({ userId }: { userId: string }) => {
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 5;
//
//     const {
//         data: bookingResponse,
//         isLoading,
//         isError,
//         error,
//     } = useBookingHistory(userId) as {
//         data: BookingHistoryResponse | undefined;
//         isLoading: boolean;
//         isError: boolean;
//         error: Error | null;
//     };
//
//     const processedBookingHistory = useMemo(() => {
//         if (!bookingResponse?.booking_history) return [];
//
//         const history: EventCardProps[] = [];
//         bookingResponse.booking_history.forEach((bookingItem) => {
//             const dateTime = dayjs
//                 .utc(bookingItem.start_date_time)
//                 .tz("Asia/Kolkata")
//                 .subtract(5, "hour");
//             const date = dateTime.format("MMM DD, YYYY");
//             const time = dateTime.format("hh:mm A [IST]");
//
//             const status: "Issued" | "Upcoming" = dateTime.isAfter(dayjs())
//                 ? "Upcoming"
//                 : "Issued";
//
//             history.push({
//                 eventName: bookingItem.event_name,
//                 date,
//                 time,
//                 tickets: bookingItem.tickets.length
//                     ? bookingItem.tickets
//                     : [{ type: "N/A", count: 0 }],
//                 status,
//             });
//         });
//         return history;
//     }, [bookingResponse]);
//
//     const totalItems = processedBookingHistory.length;
//     const totalPages = Math.ceil(totalItems / itemsPerPage);
//
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     const currentItems = processedBookingHistory.slice(startIndex, endIndex);
//
//     const handlePageChange = useCallback((page: number) => {
//         setCurrentPage(page);
//     }, []);
//
//     if (isLoading) {
//         return (
//             <div className="py-8 px-4 sm:px-6 lg:px-8 text-center text-gray-600">
//                 Loading booking history...
//             </div>
//         );
//     }
//
//     if (isError) {
//         return (
//             <div className="py-8 px-4 sm:px-6 lg:px-8 text-center text-red-500">
//                 Error: {error?.message || "Failed to load booking history."}
//             </div>
//         );
//     }
//
//     if (!processedBookingHistory.length) {
//         return (
//             <div className="py-8 px-4 sm:px-6 lg:px-8 text-center text-gray-600">
//                 No booking history found.
//             </div>
//         );
//     }
//
//     return (
//         <div className="py-8 px-4 sm:px-6 lg:px-8">
//             <div className="w-full mx-auto">
//                 <div className="space-y-8">
//                     {currentItems.map((event, index) => (
//                         <EventCard key={`${event.eventName}-${index}`} {...event} />
//                     ))}
//                 </div>
//                 {totalPages > 1 && (
//                     <div className="mt-10 flex justify-center">
//                         <Pagination
//                             currentPage={currentPage}
//                             totalPages={totalPages}
//                             onPageChange={handlePageChange}
//                         />
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };
//
// export default memo(BookingHistory);


"use client";
import React, {useState, useCallback, memo, useMemo} from "react";
import Pagination from "@/components/Pagination";
import {useBookingHistory} from "@/hooks/useUser";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // Import UTC plugin
import timezone from "dayjs/plugin/timezone"
import {Alert, Box, CircularProgress, Typography} from "@mui/material";


dayjs.extend(utc);
dayjs.extend(timezone);

interface TicketType {
    type: string;
    count: number;
}

interface BookingItem {
    event_name: string;
    start_date_time: string;
    tickets: TicketType[];
}

interface BookingHistoryResponse {
    booking_history: BookingItem[];
}

interface EventCardProps {
    eventName: string;
    date: string;
    time: string;
    ticketType: string;
    ticketCount: number;
    status: "Issued" | "Upcoming";
}

interface TicketDetails {
    eventName: string;
    date: string;
    time: string;
    ticketType: string;
    ticketCount: number;
    price?: string;
    status: "Issued" | "Upcoming";
}

const EventCard: React.FC<TicketDetails> = memo(
    ({eventName, date, time, ticketType, ticketCount, status}) => {
        const statusClasses =
            status === "Issued"
                ? "bg-[#FDF7EA] text-[#FFC217]"
                : "bg-[#E8F2ED] text-[#117F45]";
        const statusDotClasses =
            status === "Issued" ? "bg-[#FFC217]" : "bg-[#117F45]";

        return (
            <div
                className="px-4 py-6 border border-[#E7EAE9] rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow w-full max-w-full mx-auto"
                role="article"
                aria-label={`Event card for ${eventName}`}
            >
                <div className="flex flex-col px-8 sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* Event Details */}
                    <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-inter font-semibold text-[#000000]">
                            {eventName}
                        </h3>
                        <p className="text-sm text-[#6B7280] font-inter font-medium mt-1">
                            {date} • {time}
                        </p>
                    </div>

                    {/* Ticket Details */}
                    <div className="flex-1 text-sm sm:text-base text-[#6B7280] font-inter">
                        {ticketType} • {ticketCount} Ticket{ticketCount !== 1 ? "s" : ""}
                        {/*• {price}*/}
                    </div>

                    {/* Status Badge */}
                    <div
                        className={`px-2 py-1 flex items-center text-xs font-medium rounded-md ${statusClasses}`}
                        aria-label={`Status: ${status}`}
                    >
            <span className="mr-1">
              <div className={`h-1.5 w-1.5 rounded-full ${statusDotClasses}`}/>
            </span>
                        {status}
                    </div>
                </div>
            </div>
        );
    }
);
EventCard.displayName = "EventCard";

const BookingHistory = ({userId}: { userId: string }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const {
        data: bookingResponse,
        isLoading,
        isError,
        error,
    } = useBookingHistory(userId) as {
        data: BookingHistoryResponse | undefined;
        isLoading: boolean;
        isError: boolean;
        error: Error | null;
    };


    console.log(bookingResponse);

    const processedBookingHistory = useMemo(() => {
        if (!bookingResponse?.booking_history) return [];

        const history: EventCardProps[] = [];
        bookingResponse.booking_history.forEach((bookingItem) => {
            // const dateTime = dayjs(bookingItem.start_date_time);
            const dateTime = dayjs.utc(bookingItem.start_date_time).tz("Asia/Kolkata").subtract(5, "hour").subtract(30, "minute");
            const date = dateTime.format("MMM DD, YYYY");
            const time = dateTime.format("hh:mm A [IST]");

            const status: "Issued" | "Upcoming" = dateTime.isAfter(dayjs())
                ? "Upcoming"
                : "Issued";

            // bookingItem.tickets.forEach((ticket) => {
            //     history.push({
            //         eventName: bookingItem.event_name,
            //         date,
            //         time,
            //         ticketType: ticket.type,
            //         ticketCount: ticket.count,
            //         // price: "Price Not Available", // <--- IMPORTANT: You need to derive or fetch actual price
            //         status: status,
            //     });
            // });

            if (!bookingItem.tickets.length) {
                history.push({
                    eventName: bookingItem.event_name,
                    date,
                    time,
                    ticketType: "N/A",
                    ticketCount: 0,
                    status: status,
                });
            } else {
                // Process tickets as before
                bookingItem.tickets.forEach((ticket) => {
                    history.push({
                        eventName: bookingItem.event_name,
                        date,
                        time,
                        ticketType: ticket.type,
                        ticketCount: ticket.count,
                        status: status,
                    });
                });
            }
        });
        return history;
    }, [bookingResponse]);


    const totalItems = processedBookingHistory.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = processedBookingHistory.slice(startIndex, endIndex);


    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        // Optionally fetch new data for the page
    }, []);


    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px" p={4}>
                <CircularProgress sx={{color: "#2D3192"}}/>
                <Typography variant="body1" sx={{ml: 2, color: "#2D3192"}}>
                    Loading booking history...
                </Typography>
            </Box>
        );
    }

    if (isError) {
        const errorMessage = error instanceof Error ? error.message : "Failed to load booking history.";
        return (
            <Box maxWidth="4xl" mx="auto" p={4}>
                <Alert severity="error" sx={{borderRadius: "8px"}}>
                    {errorMessage}
                </Alert>
            </Box>
        );
    }

    if (!processedBookingHistory.length) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px" p={4}>
                {/*<CircularProgress sx={{ color: "#2D3192" }} />*/}
                <Typography variant="body1" sx={{ml: 2, color: "#2D3192"}}>
                    Loading booking history...
                </Typography>
            </Box>
        );
    }

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-full mx-auto">
                <div className="space-y-8">
                    {currentItems.map((ticket, index) => (
                        <EventCard key={`${ticket.eventName}-${index}`} {...ticket} />
                    ))}
                </div>
                {totalPages > 1 && (
                    <div className="mt-10 flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(BookingHistory);