import axiosInstance from "@/util/axiosinstance";

export const getAllEvents = async () => {
    const response = await axiosInstance.get(`/get-all-events`);
    return response.data;
}

export const getTrendingEvents = async () => {
    const response = await axiosInstance.get(`/get-trending-events`);
    return response.data;
}

export const getUpcomingEvents = async () => {
    const response = await axiosInstance.get(`/get-upcoming-events`);
    return response.data;
}

export const getEventById = async (id: string | Array<string> | undefined) => {
    const response = await axiosInstance.get(`/get-event-details/${id}`);
    return response.data;
}

export const getLocations = async () => {
    const response = await axiosInstance.get('/get-locations');
    return response.data;
}

export const getArtists = async () => {
    const response = await axiosInstance.get('/get-artists');
    return response.data;
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
//
// export const getEvents = async (filters: EventFilters): Promise<Event[]> => {
//
//     const { startDate, endDate, artist, location, priceRange } = filters;
//     const params: Record<string, unknown> = {};
//
//     if (startDate) {
//         params.startDate = startDate.toISOString().split('T')[0];
//     }
//     if (endDate) {
//         params.endDate = endDate.toISOString().split('T')[0];
//     }
//     if (artist) {
//         params.artistId = artist.id;
//     }
//     if (location) {
//         params.location = location.name;
//     }
//     if (priceRange) {
//         params.minPrice = priceRange[0];
//         params.maxPrice = priceRange[1];
//     }
//
//     const response = await axiosInstance.get('/get-all-events', {
//         params,
//     });
//     return response.data;
// }


export interface Event {
    id: number;
    title: string;
    date: string;
    location: string;
    artist: string;
    price: number;
    start_date_time: string;
    name: string;
    artist_details: { artistId: number; artistName: string }[];
    ticket_details: { price: number; ticketCount: number | null; ticketTypeId: number; hasTicketCount: boolean; bookedTicketCount: number; ticketTypeName: string }[];
    slug: string;
    description: string;
    banner_image: string;
    featured_image: string;
    status: string;
    all_seats_booked: number;
    all_ticket_without_seats_booked: number;
}

export interface ApiEventResponse {
    events: Event[];
}

export interface EventFilters {
    startDate: Date | null;
    endDate: Date | null;
    artist: { id: number; name: string } | null;
    location: { id: number; name: string } | null;
    priceRange?: number[];
}


export const getEvents = async (
    filters: EventFilters
): Promise<ApiEventResponse> => {
    const {startDate, endDate, artist, location, priceRange} = filters;
    const params: Record<string, unknown> = {};

    if (startDate) {
        params.startDate = startDate.toISOString().split("T")[0];
    }
    if (endDate) {
        params.endDate = endDate.toISOString().split("T")[0];
    }
    if (artist) {
        params.artistId = artist.id;
    }
    if (location) {
        params.location = location.name; // Assuming the API expects the location name
    }
    if (priceRange && priceRange.length === 2) {
        params.minPrice = priceRange[0];
        params.maxPrice = priceRange[1];
    }

    const response = await axiosInstance.get("/get-all-events", {
        params,
    });
    return response.data;
}