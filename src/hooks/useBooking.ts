import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    checkoutApi, checkSeatCountApi,
    getCheckoutStatusApi,
    getEventSeats, getOrderInfoApi,
    resetSeatApi, SeatData,
    selectSeatApi,
    unselectSeatApi
} from "@/services/bookingService";
import {AxiosError} from "axios";
import {useDispatch} from "react-redux";
import {setCurrentSeatData} from "@/store/bookingSlice";
import {useEffect} from "react";

// const defaultQueryOptions = {
//     staleTime: 5 * 60 * 1000,
//     gcTime: 10 * 60 * 1000,
//     retry: 3,
//     refetchOnWindowFocus: false,
// };

// export const useSeatByEventId = (eventId: string) => {
//     return useQuery<SeatData[], Error>({
//         queryKey: ["eventSeats", eventId],
//         queryFn: () => getEventSeats(eventId),
//         enabled: !!eventId,
//         retry: 1,
//         staleTime: 60000,
//     });
// };

// export const useSeatByEventId = (eventId: string) => {
//     const dispatch = useDispatch();
//     return useQuery({
//         queryKey: ["eventSeats", eventId],
//         queryFn: () => getEventSeats(eventId),
//         onSuccess: (data) => {
//             dispatch(setCurrentSeatData(data));
//         },
//     });
// };

export const useSeatByEventId = (eventId: string) => {
    const dispatch = useDispatch();

    const query = useQuery<SeatData[], Error>({
        queryKey: ["eventSeats", eventId],
        queryFn: () => getEventSeats(eventId),
        enabled: !!eventId, // Only run query if eventId is defined
    });

    useEffect(() => {
        if (query.data) {
            dispatch(setCurrentSeatData(query.data));
        }
    }, [query.data, dispatch]);

    return query;
};


interface SelectSeatPayload {
    event_id: string;
    seat_id: string;
}


export const useSeatSelectApi = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: SelectSeatPayload) => selectSeatApi(data),
        onSuccess: (_, {event_id, seat_id}) => {
            queryClient.setQueryData<SeatData[]>(["seatData", event_id], (oldData) => {
                if (!oldData) return oldData;
                return oldData.map((seat) =>
                    seat.seatId === seat_id ? {...seat, status: "selected"} : seat
                );
            });
            // CHANGED: Invalidate queries to fetch latest seat data
            // queryClient.invalidateQueries({queryKey: ["seatData", event_id]});
        },
        onError: (error) => {
            console.error("Seat selection failed:", error);
        },
    });
};

export const useUnseatSelectApi = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: SelectSeatPayload) => unselectSeatApi(data),
        onSuccess: (_, {event_id, seat_id}) => {
            queryClient.setQueryData<SeatData[]>(["seatData", event_id], (oldData) => {
                if (!oldData) return oldData;
                return oldData.map((seat) =>
                    seat.seatId === seat_id ? {...seat, status: "available"} : seat
                );
            });
            // CHANGED: Invalidate queries to fetch latest seat data
            // queryClient.invalidateQueries({queryKey: ["seatData", event_id]});
        },
        onError: (error) => {
            console.error("Seat unselection failed:", error);
            // CHANGED: Removed revert logic to avoid auto-selection
        },
    });
};

// export const useSeatSelectApi = () => {
//     const queryClient = useQueryClient();
//     return useMutation<unknown, Error, SelectSeatPayload>({
//         mutationFn: selectSeatApi,
//         onSuccess: () => {
//             queryClient.invalidateQueries({queryKey: ["eventSeats"]});
//         },
//     });
// };
//
// export const useUnseatSelectApi = () => {
//     const queryClient = useQueryClient();
//     return useMutation<unknown, Error, SelectSeatPayload>({
//         mutationFn: unselectSeatApi,
//         onSuccess: () => {
//             queryClient.invalidateQueries({queryKey: ["eventSeats"]});
//         },
//     });
// };

// interface Seat {
//     seat_id: string;
// }

interface ResetSeatPayload {
    event_id: string;
    seat_ids: string[];
}


export const useResetSeatApi = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, Error, ResetSeatPayload>({
        mutationFn: async (variables: ResetSeatPayload) => {
            console.log("Mutation variables:", variables);
            return resetSeatApi(variables);
        },
        onSuccess: () => {
            console.log("Seats reset successfully!");
            queryClient.invalidateQueries({queryKey: ["booking"]});
        },
        onError: (error) => {
            console.log("--------------------error resetting seats: ", error);
        }
    });
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

interface ErrorResponse {
    message?: string;
    errors?: { fieldErrors?: Record<string, string[]> };
}

interface CheckoutResponse {
    redirectUrl: string;
    params: Record<string, string>;
}

export const useCheckoutApi = () => {
    const queryClient = useQueryClient();
    return useMutation<CheckoutResponse, AxiosError<ErrorResponse>, CheckoutData>({
        mutationFn: async (variable) => {
            console.log("Mutation variable:", variable);
            return checkoutApi(variable);
        },
        onSuccess: () => {
            console.log("Seat checkout successfully!");
            queryClient.invalidateQueries({queryKey: ["booking"]});
        },
        onError: (error) => {
            console.log("--------------------error checkout: ", error);
        }
    });
};


export const useGetCheckoutStatusApi = (order_id: string) => {
    return useQuery({
        queryKey: ["orders", order_id],
        queryFn: () => getCheckoutStatusApi(order_id),
        // ...defaultQueryOptions,
        // refetchInterval: 10000,
        retry: 3
    })
}

export const useGetOrderInfoApi = (order_id: string) => {
    return useQuery({
        queryKey: ["orders", order_id],
        queryFn: () => getOrderInfoApi(order_id),
        retry: 3
    })
}


interface CheckSeatCountPayload {
    event_id: string;
    ticket_type_id: string;
    count: string;
}

interface CheckSeatCountResponse {
    message: string;
    available: boolean;
}

export const useCheckSeatCountApi = () => {
    return useMutation<CheckSeatCountResponse, Error, CheckSeatCountPayload>({
        mutationFn: async (variables: CheckSeatCountPayload) => {
            return checkSeatCountApi(variables);
        },
        onError: (error) => {
            console.error("Seat count check failed:", error);
        },
    });
};



