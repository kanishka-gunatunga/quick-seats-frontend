
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "@/store/store";

interface SeatData {
    price: number;
    seatId: string;
    status: string;
    type_id: number;
    ticketTypeName?: string;
    color?: string;
}

interface TicketFromEventPage {
    price: number;
    ticketCount: number | null;
    ticketTypeId: number;
    ticketTypeName: string;
}

interface BookingState {
    selectedSeats: SeatData[];
    manualTicketCounts: Record<number, number>;
    eventTicketDetails: TicketFromEventPage[];
    currentSeatData: SeatData[];
    ticketTypesExistInApi: Record<number, boolean>;
    restorationStatus: "loading" | "success" | "failed" | null;
    eventId?: string;
}

const initialState: BookingState = {
    selectedSeats: [],
    manualTicketCounts: {},
    eventTicketDetails: [],
    currentSeatData: [],
    ticketTypesExistInApi: {},
    restorationStatus: null,
};

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        selectSeats(state, action: PayloadAction<{ seats: SeatData[]; eventId: string }>) {
            const { seats, eventId } = action.payload;
            state.eventId = eventId;
            const newSeats = seats.filter(
                (newSeat) => !state.selectedSeats.some((seat) => seat.seatId === newSeat.seatId)
            );
            state.selectedSeats = [...state.selectedSeats, ...newSeats];
            state.currentSeatData = state.currentSeatData.map((seat) =>
                newSeats.some((s) => s.seatId === seat.seatId) ? {...seat, status: "selected"} : seat
            );
            localStorage.setItem(
                "tempBookingData",
                JSON.stringify({
                    selectedSeats: state.selectedSeats,
                    manualTicketCounts: state.manualTicketCounts,
                    eventTicketDetails: state.eventTicketDetails,
                    // eventId: action.payload[0]?.eventId || "",
                    eventId,
                    timestamp: Date.now(),
                })
            );
        },
        unselectSeats(state, action: PayloadAction<{ seatIds: string[]; eventId: string }>) {
            const { seatIds, eventId } = action.payload;
            state.eventId = eventId;
            state.selectedSeats = state.selectedSeats.filter(
                (seat) => !seatIds.includes(seat.seatId)
            );
            state.currentSeatData = state.currentSeatData.map((seat) =>
                seatIds.includes(seat.seatId) ? {...seat, status: "available"} : seat
            );
            localStorage.setItem(
                "tempBookingData",
                JSON.stringify({
                    selectedSeats: state.selectedSeats,
                    manualTicketCounts: state.manualTicketCounts,
                    eventTicketDetails: state.eventTicketDetails,
                    eventId: state.eventTicketDetails[0]?.ticketTypeId || "",
                    timestamp: Date.now(),
                })
            );
        },
        setManualTicketCounts(
            state,
            action: PayloadAction<{ ticketTypeId: number; delta: number }>
        ) {
            const {ticketTypeId, delta} = action.payload;
            const newCount = Math.max(
                0,
                (state.manualTicketCounts[ticketTypeId] || 0) + delta
            );
            state.manualTicketCounts = {
                ...state.manualTicketCounts,
                [ticketTypeId]: newCount,
            };
            localStorage.setItem(
                "tempBookingData",
                JSON.stringify({
                    selectedSeats: state.selectedSeats,
                    manualTicketCounts: state.manualTicketCounts,
                    eventTicketDetails: state.eventTicketDetails,
                    eventId: state.eventTicketDetails[0]?.ticketTypeId || "",
                    timestamp: Date.now(),
                })
            );
        },
        setEventTicketDetails(state, action: PayloadAction<TicketFromEventPage[]>) {
            state.eventTicketDetails = action.payload;
        },
        setCurrentSeatData(state, action: PayloadAction<SeatData[]>) {
            state.currentSeatData = action.payload.map((seat) =>
                state.selectedSeats.some((s) => s.seatId === seat.seatId)
                    ? {...seat, status: "selected"}
                    : {...seat, status: seat.status || "available"}
            );
            const ticketTypeExistence: Record<number, boolean> = {};
            state.eventTicketDetails.forEach((eventTicket) => {
                ticketTypeExistence[eventTicket.ticketTypeId] = action.payload.some(
                    (seat) => seat.type_id === eventTicket.ticketTypeId
                );
            });
            state.ticketTypesExistInApi = ticketTypeExistence;
        },
        setRestorationStatus(
            state,
            action: PayloadAction<"loading" | "success" | "failed" | null>
        ) {
            state.restorationStatus = action.payload;
        },
        resetBooking(state) {
            const unselectedSeatIds = state.selectedSeats.map((seat) => seat.seatId);
            state.selectedSeats = [];
            state.manualTicketCounts = state.eventTicketDetails.reduce(
                (acc, ticket) => {
                    acc[ticket.ticketTypeId] = 0;
                    return acc;
                },
                {} as Record<number, number>
            );
            state.currentSeatData = state.currentSeatData.map((seat) =>
                unselectedSeatIds.includes(seat.seatId)
                    ? {...seat, status: "available"}
                    : seat
            );
            localStorage.removeItem("tempBookingData");
            localStorage.removeItem("bookingSummaryToBill");
        },
    },
});

export const {
    selectSeats,
    unselectSeats,
    setManualTicketCounts,
    setEventTicketDetails,
    setCurrentSeatData,
    setRestorationStatus,
    resetBooking,
} = bookingSlice.actions;

export const selectSelectedSeats = (state: RootState) => state.booking.selectedSeats;
export const selectManualTicketCounts = (state: RootState) =>
    state.booking.manualTicketCounts;
export const selectEventTicketDetails = (state: RootState) =>
    state.booking.eventTicketDetails;

export default bookingSlice.reducer;