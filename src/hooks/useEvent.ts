import {useQuery} from "@tanstack/react-query";
import {
    ApiEventResponse,
    EventFilters,
    getAllEvents,
    getArtists,
    getEventById, getEvents,
    getLocations,
    getTrendingEvents,
    getUpcomingEvents
} from "@/services/eventService";


const defaultQueryOptions = {
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    refetchOnWindowFocus: false,
};


export const useEvents = () => {
    return useQuery({
        queryKey: ["events"],
        queryFn: () => getAllEvents(),
        ...defaultQueryOptions,
        refetchInterval: 10000,
    });
};

export const useUpcomingEvents = () => {
    return useQuery({
        queryKey: ["upcoming events"],
        queryFn: () => getUpcomingEvents(),
        ...defaultQueryOptions,
        refetchInterval: 10000,
    });
};

export const useTrendingEvents = () => {
    return useQuery({
        queryKey: ["trending events"],
        queryFn: () => getTrendingEvents(),
        ...defaultQueryOptions,
        refetchInterval: 10000,
    });
};

export const useEventById = (id: string | Array<string> | undefined) => {
    return useQuery({
        queryKey: ["events", id],
        queryFn: () => getEventById(id),
        ...defaultQueryOptions,
        refetchInterval: 10000,
    })
}

export const useLocations = () => {
    return useQuery({
        queryKey: ["locations"],
        queryFn: () => getLocations(),
        ...defaultQueryOptions,
        refetchInterval: 10000,
    })
}

export const useArtists = () => {
    return useQuery({
        queryKey: ["artists"],
        queryFn: () => getArtists(),
        ...defaultQueryOptions,
        refetchInterval: 10000,
    })
}

// interface Event {
//     id: number;
//     title: string;
//     date: string;
//     location: string;
//     artist: string;
//     price: number;
// }
//
// interface EventFilters {
//     startDate: Date | null;
//     endDate: Date | null;
//     artist: { id: number; name: string } | null;
//     location: { id: number; name: string } | null;
//     priceRange: number[];
// }
//
// export const useEvents = (filters: EventFilters | null) => {
//     return useQuery<Event[],Error>({
//         queryKey: ["events", filters],
//         queryFn: () => getEvents(filters!),
//         enabled: !!filters
//     });
// }



export const useAllEvents = (filters: EventFilters | null) => {
    return useQuery<ApiEventResponse, Error>({
        queryKey: ["events", filters],
        queryFn: () => getEvents(filters!),
        enabled: !!filters,
    });
};