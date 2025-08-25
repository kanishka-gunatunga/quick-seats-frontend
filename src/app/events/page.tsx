"use client";
import * as React from "react";
import {Suspense, useMemo, useState} from "react";
import HeroSection from "@/components/HeroSection";
import Pagination from "@/components/Pagination";
import EventFilter from "@/components/Filter";
import SectionTitle from "@/components/SectionTitle";
import EventCard from "@/components/EventCard";
import {useSearchParams} from "next/navigation";
import NewsLetter from "@/components/NewsLetter";
import {useAllEvents} from "@/hooks/useEvent";
import {getLocalDateTime} from "@/util/util";
import EventCardSkeleton from "@/components/skeletons/EventCardSkeleton";

interface HeroProps {
    image: string;
    title: string;
    subTitle: string;
}

interface Artist {
    id: number;
    name: string;
}

interface Location {
    id: number;
    name: string;
}

interface EventFilters {
    startDate: Date | null;
    endDate: Date | null;
    artist: Artist | null;
    location: Location | null;
    priceRange?: number[];
}

const hero: HeroProps = {
    image: "/event-he.png",
    title: "Explore Our Events",
    subTitle: "Discover your favorite entertainment right here",
};

const EventsContent = () => {
    const [filters, setFilters] = useState<EventFilters | null>({
        startDate: null,
        endDate: null,
        artist: null,
        location: null,
        // priceRange: [1000, 10000],
    });
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 12;
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("search")?.toLowerCase() || "";

    const {data: eventData, isLoading, error} = useAllEvents(filters);
    const eventDataArr = eventData?.events || [];

    const handleFilterChange = (newFilters: EventFilters) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to first page on filter change
    };

    // const transformedEvents = Array.isArray(eventDataArr)
    //     ? eventDataArr.filter(event => event.status === "active").map((event) => {
    //         const {localDate, localTime} = getLocalDateTime(event.start_date_time);
    //         const minPrice =
    //             Math.min(
    //                 ...(event.ticket_details?.map((t: { price: number }) => parseFloat(String(t.price))) || [
    //                     0,
    //                 ])
    //             ) || 0;
    //
    //         return {
    //             id: event.id,
    //             title: event.name,
    //             artist: {
    //                 id: event.artist_details[0]?.artistId || 0,
    //                 name: event.artist_details[0]?.artistName || "Unknown Artist",
    //             },
    //             location: event.location,
    //             date: localDate, // Local date (e.g., "2025-05-24")
    //             time: localTime, // Local time (e.g., "11:30 PM")
    //             price: `${minPrice} LKR`,
    //             slug: event.slug,
    //             description: event.description,
    //             banner_image: event.banner_image,
    //             image: event.featured_image,
    //             ticket_details: event.ticket_details,
    //             artist_details: event.artist_details,
    //             status: event.status,
    //             all_seats_booked: event.all_seats_booked,
    //             all_ticket_without_seats_booked: event.all_ticket_without_seats_booked
    //         };
    //     })
    //     : [];

    const transformedEvents = useMemo(() =>
            Array.isArray(eventDataArr)
                ? eventDataArr.filter(event => event.status === "active").map((event) => {
                    const {localDate, localTime} = getLocalDateTime(event.start_date_time);
                    const minPrice =
                        Math.min(
                            ...(event.ticket_details?.map((t: { price: number }) => parseFloat(String(t.price))) || [
                                0,
                            ])
                        ) || 0;

                    return {
                        id: event.id,
                        title: event.name,
                        artist: {
                            id: event.artist_details[0]?.artistId || 0,
                            name: event.artist_details[0]?.artistName || "Unknown Artist",
                        },
                        location: event.location,
                        date: localDate, // Local date (e.g., "2025-05-24")
                        time: localTime, // Local time (e.g., "11:30 PM")
                        price: `${minPrice} LKR`,
                        slug: event.slug,
                        description: event.description,
                        banner_image: event.banner_image,
                        image: event.featured_image,
                        ticket_details: event.ticket_details,
                        artist_details: event.artist_details,
                        status: event.status,
                        all_seats_booked: event.all_seats_booked,
                        all_ticket_without_seats_booked: event.all_ticket_without_seats_booked,
                        upcoming_event: event.upcoming_event
                    };
                })
                : []
        , [eventDataArr]);

    // const filteredEvents = transformedEvents.filter((event) => {
    //     const searchMatch =
    //         !searchQuery ||
    //         event.title.toLowerCase().includes(searchQuery) ||
    //         event.artist.name.toLowerCase().includes(searchQuery);
    //
    //     return searchMatch;
    // });

    const filteredEvents = useMemo(() =>
            transformedEvents.filter((event) => {
                const searchMatch =
                    !searchQuery ||
                    event.title.toLowerCase().includes(searchQuery) ||
                    event.artist.name.toLowerCase().includes(searchQuery);

                return searchMatch;
            })
        , [transformedEvents, searchQuery]);

    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
    const startIndex = (currentPage - 1) * eventsPerPage;
    const paginatedEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

    // Determine what to render based on loading state
    let contentToRender;

    if (isLoading) {
        contentToRender = (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {Array.from({length: eventsPerPage}).map((_, index) => (
                    <EventCardSkeleton key={index}/>
                ))}
            </div>
        );
    } else if (error) {
        contentToRender = (
            <div className="text-center py-10">
                <p className="text-red-500 font-semibold">Error fetching events. Please try again later.</p>
            </div>
        );
    } else if (filteredEvents.length > 0) {
        contentToRender = (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {paginatedEvents.map((event) => (
                    <EventCard key={event.id} {...event} />
                ))}
            </div>
        );
    } else {
        contentToRender = (
            <div className="text-center py-10">
                <p className="text-gray-500 font-semibold">No events match the selected filters.</p>
            </div>
        );
    }

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                <div>
                    <SectionTitle title="Latest Events"/>
                </div>
                <div className="py-6 sm:py-10">
                    {/* Disable filter interaction while loading */}
                    <EventFilter onFilterChange={handleFilterChange} disabled={isLoading}/>
                </div>
                <section className="">
                    <div className="max-w-7xl mx-auto">
                        {contentToRender}
                    </div>
                </section>
                <div className="my-10 flex justify-center">
                    {/* Only show pagination if not loading and there are events */}
                    {!isLoading && filteredEvents.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

const EventsPage = () => {
    return (
        <div className="min-h-screen">
            <HeroSection hero={hero}/>
            <Suspense fallback={<div className="text-center py-10">Loading section...</div>}>
                <EventsContent/>
            </Suspense>
            <NewsLetter/>
        </div>
    );
};

export default EventsPage;