import axiosInstance from "@/util/axiosinstance";
import {AxiosError} from "axios";

interface ErrorResponse {
    message?: string;
}

export interface SeatData {
    price: number;
    seatId: string;
    status: 'available' | 'booked' | 'selected' | 'unavailable';
    type_id: number;
    ticketTypeName?: string;
    color: string;
}

interface RawSeatData {
    price?: string | number | null;
    seatId?: string | null;
    status?: string | null;
    type_id?: string | number | null;
    ticketTypeName?: string | null;
    color: string;
}


// export const getEventSeats = async (id: string | Array<string> | undefined) => {
//     // const response = await axiosInstance.get(`/get-event-seats/${id}`);
//     // return response.data;
//
//     try {
//         const response = await axiosInstance.get(`/get-event-seats/${id}`);
//         const rawResponseData = response.data; // This is the data Axios gives you
//
//         console.log("HOOK_FN: Raw data from Axios (response.data):", rawResponseData);
//         console.log("HOOK_FN: Type of raw data from Axios:", typeof rawResponseData);
//         console.log("HOOK_FN: Is rawResponseData an Array?", Array.isArray(rawResponseData));
//
//         let parsedData: unknown;
//
//         // *** THIS IS THE CRITICAL LOGIC ***
//         if (typeof rawResponseData === 'string') {
//             console.log("HOOK_FN: rawResponseData is a string, attempting JSON.parse...");
//             try {
//                 parsedData = JSON.parse(rawResponseData); // Explicitly parse the JSON string
//                 console.log("HOOK_FN: Manually parsed data from string:", parsedData);
//                 console.log("HOOK_FN: Is manually parsed data an Array?", Array.isArray(parsedData));
//             } catch (jsonError) {
//                 console.error("HOOK_FN: Failed to JSON.parse rawResponseData string:", jsonError, "Raw string was:", rawResponseData);
//                 throw new Error("Invalid JSON string received from API. Could not parse.");
//             }
//         } else if (Array.isArray(rawResponseData)) {
//             // This case occurs if Axios automatically parsed it (e.g., proper Content-Type: application/json)
//             console.log("HOOK_FN: Axios already provided data as an array.");
//             parsedData = rawResponseData;
//         } else if (rawResponseData && typeof rawResponseData === 'object' && Array.isArray(rawResponseData.data)) {
//             // Fallback for if the API wraps it in a 'data' property
//             console.log("HOOK_FN: rawResponseData is an object with a .data array property.");
//             parsedData = rawResponseData.data;
//         } else if (rawResponseData && typeof rawResponseData === 'object' && Array.isArray(rawResponseData.seats)) {
//             // Fallback for if the API wraps it in a 'seats' property
//             console.log("HOOK_FN: rawResponseData is an object with a .seats array property.");
//             parsedData = rawResponseData.seats;
//         } else {
//             console.error("HOOK_FN: Unexpected data format from Axios after initial checks:", rawResponseData);
//             throw new Error("API response is in an unexpected format. Expected array or stringified array.");
//         }
//
//         // Final validation to ensure we're returning an array
//         if (!Array.isArray(parsedData)) {
//             console.error("HOOK_FN: Final parsed data is NOT an array:", parsedData);
//             throw new Error("API response, even after parsing attempts, is not a valid SeatData array.");
//         }
//
//         console.log("HOOK_FN: Returning final processed data (should be array):", parsedData);
//         return parsedData as SeatData[];
//
//     } catch (error: unknown) {
//         if (error instanceof AxiosError && error.response?.data) {
//             throw new Error(
//                 (error.response.data as ErrorResponse).message || "get event seats"
//             );
//         }
//         throw new Error("get event seats");
//     }
// }

const isValidStatus = (status: unknown): status is SeatData['status'] =>
    typeof status === "string" &&
    ["available", "booked", "selected", "unavailable"].includes(status);

export const getEventSeats = async (id: string | Array<string> | undefined): Promise<SeatData[]> => {
    if (!id || (Array.isArray(id) && id.length === 0)) {
        throw new Error("Invalid event ID");
    }

    try {
        const response = await axiosInstance.get(`/get-event-seats/${id}`);
        const rawResponseData = response.data;

        let parsedData: unknown;

        if (typeof rawResponseData === "string") {
            try {
                parsedData = JSON.parse(rawResponseData);
            } catch (jsonError) {
                console.error("Failed to parse JSON string from API:", jsonError, "Raw string:", rawResponseData);
                throw new Error("Invalid JSON string received from API");
            }
        } else if (Array.isArray(rawResponseData)) {
            parsedData = rawResponseData;
        } else if (rawResponseData && typeof rawResponseData === "object" && Array.isArray(rawResponseData.data)) {
            parsedData = rawResponseData.data;
        } else if (rawResponseData && typeof rawResponseData === "object" && Array.isArray(rawResponseData.seats)) {
            parsedData = rawResponseData.seats;
        } else {
            console.error("Unexpected API response format:", rawResponseData);
            throw new Error("API response is in an unexpected format");
        }

        if (!Array.isArray(parsedData)) {
            console.error("Parsed data is not an array:", parsedData);
            throw new Error("API response is not a valid SeatData array");
        }

        return parsedData
            .map((seat: RawSeatData): SeatData => {
                // const validStatuses = ["available", "booked", "selected", "unavailable"] as const;
                const status = isValidStatus(seat.status) ? seat.status : "unavailable";
                return {
                    price: parseFloat(String(seat.price)) || 0,
                    seatId: seat.seatId || "",
                    status: status as SeatData['status'],
                    type_id: parseInt(String(seat.type_id), 10) || 0,
                    ticketTypeName: seat.ticketTypeName || undefined,
                    color: seat.color,
                };
            })
            .filter((seat: SeatData) => seat.seatId && seat.seatId.trim() !== "");
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw new Error((error.response.data as ErrorResponse).message || "Failed to fetch event seats");
        }
        throw new Error("Failed to fetch event seats");
    }
};

interface SelectSeatPayload {
    event_id: string;
    seat_id: string;
}

export const selectSeatApi = async (data: SelectSeatPayload) => {
    try {
        const response = await axiosInstance.post('/select-seat', data);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.data) {
            throw new Error(
                (error.response.data as ErrorResponse).message || "Failed to seat select"
            );
        }
        throw new Error("Failed to seat select");
    }
};


export const unselectSeatApi = async (data: SelectSeatPayload) => {
    try {
        const response = await axiosInstance.post('/unselect-seat', data);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.data) {
            throw new Error(
                (error.response.data as ErrorResponse).message || "Failed to unseat select"
            );
        }
        throw new Error("Failed to unseat select");
    }
};


// interface Seat {
//     seat_id: string;
// }

interface ResetSeatPayload {
    event_id: string;
    seat_ids: string[];
}

export const resetSeatApi = async (data: ResetSeatPayload) => {
    try {
        const response = await axiosInstance.post('/reset-seats', data);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.data) {
            throw new Error(
                (error.response.data as ErrorResponse).message || "Failed to reset seats"
            );
        }
        throw new Error("Failed to reset seats");
    }
};


interface CheckoutData {
    email: string;
    first_name: string;
    last_name: string;
    contact_number: string;
    nic_passport: string;
    country: string;
    address: string;
    city: string;
    event_id?: string;
    seat_ids: string[];
    tickets_without_seats: { ticket_type_id: number; ticket_count: number }[];
    user_id: string;
}

interface CheckoutResponse {
    redirectUrl: string;
    params: Record<string, string>;
}


export const checkoutApi = async (data: CheckoutData) => {
    try {
        const response = await axiosInstance.post<CheckoutResponse>('/checkout', data);
        console.log('--------checkout response: ', response.data);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.data) {
            throw new Error(
                (error.response.data as ErrorResponse).message || "Failed to checkout"
            );
        }
        throw new Error("Failed to checkout");
    }
};

export const getCheckoutStatusApi = async (order_id: string) => {
    try {
        const response = await axiosInstance.post('/get-checkout-status', {order_id: order_id});
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.data) {
            throw new Error(
                (error.response.data as ErrorResponse).message || "Failed to getCheckoutStatus"
            );
        }
        throw new Error("Failed to getCheckoutStatus");
    }
};

export const getOrderInfoApi = async (order_id: string) => {
    try {
        const response = await axiosInstance.get(`/order-info/${order_id}`);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.data) {
            throw new Error(
                (error.response.data as ErrorResponse).message || "Failed to getOrderInfo"
            );
        }
        throw new Error("Failed to getOrderInfo");
    }
};

interface CheckSeatCountPayload {
    event_id: string;
    ticket_type_id: string;
    count: string;
}

interface CheckSeatCountResponse {
    message: string;
    available: boolean;
}

export const checkSeatCountApi = async ({ event_id, ticket_type_id, count }: CheckSeatCountPayload): Promise<CheckSeatCountResponse> => {
    try {
        const response = await axiosInstance.post<CheckSeatCountResponse>('/check-seat-count', { event_id, ticket_type_id, count });
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.data) {
            throw new Error(
                (error.response.data as ErrorResponse).message || "Failed to check seat count"
            );
        }
        throw new Error("Failed to check seat count");
    }
};