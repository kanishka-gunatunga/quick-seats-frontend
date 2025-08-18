"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { unselectSeats, resetBooking } from "@/store/bookingSlice";

export interface StoredBookingData {
    selectedSeats: Array<{
        price: number;
        seatId: string;
        status: string;
        type_id: number;
        ticketTypeName?: string;
        color?: string;
    }>;
    manualTicketCounts: Record<number, number>;
    eventTicketDetails: Array<{
        price: number;
        ticketCount: number | null;
        ticketTypeId: number;
        ticketTypeName: string;
    }>;
    eventId: string;
    timestamp: number;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const useBookingCleanup = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
            const storedData = localStorage.getItem("tempBookingData");
            if (storedData) {
                try {
                    const parsed: StoredBookingData = JSON.parse(storedData);
                    const total = parsed.selectedSeats.length + Object.values(parsed.manualTicketCounts).reduce((sum, count) => sum + count, 0);
                    if (total > 0) {
                        console.debug("BeforeUnload: Active booking detected, initiating cleanup", {
                            selectedSeats: parsed.selectedSeats.length,
                            manualTicketCounts: parsed.manualTicketCounts,
                        });
                        e.preventDefault();

                        if (parsed.selectedSeats.length > 0) {
                            dispatch(unselectSeats({
                                seatIds: parsed.selectedSeats.map((seat) => seat.seatId),
                                eventId: parsed.eventId,
                            }));
                        } else {
                            dispatch(resetBooking());
                        }
                        localStorage.removeItem("tempBookingData");
                        localStorage.removeItem("bookingSummaryToBill");

                        // Send unselect requests to backend
                        for (const seat of parsed.selectedSeats) {
                            const data = {
                                event_id: parsed.eventId,
                                seat_id: seat.seatId,
                                token: localStorage.getItem("authToken") || "", // Add token if required
                            };
                            console.debug(`Sending unselect request for seat ${seat.seatId} in event ${parsed.eventId} to ${BACKEND_URL}/unselect-seat`);
                            try {
                                await fetch(`${BACKEND_URL}/unselect-seat`, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify(data),
                                    keepalive: true,
                                });
                                console.debug(`Unselect request sent for seat ${seat.seatId}`);
                            } catch (error) {
                                console.error(`Failed to send unselect request for seat ${seat.seatId}:`, error);
                            }
                        }
                    }
                } catch (error) {
                    console.error("Failed to parse stored booking data in beforeunload:", error);
                }
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [dispatch]);
};