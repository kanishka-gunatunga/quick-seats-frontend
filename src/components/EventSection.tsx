"use client";

import React, {useRef} from "react";
import EventCard from "@/components/EventCard";
import SectionTitle from "@/components/SectionTitle";
import Link from "next/link";
import {useUpcomingEvents} from "@/hooks/useEvent";
import {getLocalDateTime} from "@/util/util";
import EventCardSkeleton from "./skeletons/EventCardSkeleton";

const EventsSection = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const {data: eventData, isLoading, error} = useUpcomingEvents();
    console.log("------------raw data", eventData);
    const eventDataArr = eventData?.events || [];

    const transformedEvents = Array.isArray(eventDataArr)
        ? eventDataArr.filter(event => event.status === "active").map((event) => {
            const {localDate, localTime} = getLocalDateTime(event.start_date_time);
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
                price: `${Math.min(...(event.ticket_details?.map((t: { price: string; }) => t.price) || [0]))} LKR`,
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
        : [];

    // Number of skeletons to display. Adjust as needed.
    // For a 4-column grid, 4 skeletons make sense.
    const numberOfSkeletons = 4;

    if (error) {
        return <div className="text-center text-red-500 p-8">Error fetching events</div>;
    }

    return (
        <section className="py-6 md:py-10 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                <SectionTitle title="Upcoming Events"/>

                {/* Large screen layout (hidden on small screens) */}
                <div className="hidden lg:block">
                    <div className="grid lg:grid-cols-4 py-4 gap-6 mt-8">
                        {isLoading ? (
                            Array.from({length: numberOfSkeletons}).map((_, index) => (
                                <EventCardSkeleton key={index}/>
                            ))
                        ) : (
                            transformedEvents.map((event) => (
                                <EventCard key={event.id} {...event} />
                            ))
                        )}
                    </div>
                </div>

                {/* Small screen layout (hidden on large screens) */}
                {/* Removed the duplicate scrollRef div */}
                <div className="block lg:hidden mt-6">
                    <div
                        ref={scrollRef}
                        className="grid grid-flow-col auto-cols-[minmax(280px,1fr)] sm:auto-cols-[minmax(296px,1fr)] gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth py-4 scrollbar-hide"
                        style={{scrollbarWidth: "none", msOverflowStyle: "none"}}
                    >
                        {isLoading ? (
                            Array.from({length: numberOfSkeletons}).map((_, index) => (
                                <div key={index} className="snap-start">
                                    <EventCardSkeleton/>
                                </div>
                            ))
                        ) : (
                            transformedEvents.map((event) => (
                                <div key={event.id} className="snap-start">
                                    <EventCard {...event} />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex justify-center mt-4 sm:mt-6">
                    <Link href="/events">
                        <button
                            className="w-max bg-[#27337C] font-inter font-medium text-xs sm:text-sm text-white py-2 sm:py-3 px-4 sm:px-6 rounded-md hover:bg-blue-800 transition-colors"
                            disabled={isLoading} // Disable button while loading
                        >
                            View More
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default EventsSection;
