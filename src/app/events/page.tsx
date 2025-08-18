// "use client"
// import {useState} from "react";
// import HeroSection from "@/components/HeroSection";
// import Pagination from "@/components/Pagination";
// import EventFilter from "@/components/Filter";
// import SectionTitle from "@/components/SectionTitle";
// import * as React from "react";
// import EventCard from "@/components/EventCard";
//
// interface HeroProps {
//     image: string;
//     title: string;
//     subTitle: string
// }
//
// interface Artist {
//     id: number;
//     name: string;
// }
//
// interface Location {
//     id: number;
//     name: string;
// }
//
// interface EventFilters {
//     startDate: Date | null;
//     endDate: Date | null;
//     artist: Artist | null;
//     location: Location | null;
//     priceRange: number[];
// }
//
// const EventsPage = () => {
//
//     const [filters, setFilters] = useState<EventFilters | null>(null);
//
//     const hero: HeroProps = {
//         image: "/event-hero.png",
//         title: "Explore Our Events",
//         subTitle: "Discover your favorite entertainment right here",
//     }
//
//     const events = [
//         {
//             image: "/event1.png",
//             title: "Dawasak Live In Concert",
//             date: "Apr 19, 2025",
//             time: "08.00 AM IST",
//             location: "Musaeus College Auditorium",
//             price: "5,000 LKR",
//         },
//         {
//             image: "/event2.png",
//             title: "80'S 90'S RETRO PARTY",
//             date: "Apr 19, 2025",
//             time: "08.00 AM IST",
//             location: "Musaeus College Auditorium",
//             price: "4,500 LKR",
//         },
//         {
//             image: "/event3.png",
//             title: "Sancharayak",
//             date: "Apr 19, 2025",
//             time: "08.00 AM IST",
//             location: "Musaeus College Auditorium",
//             price: "5,000 LKR",
//         },
//         {
//             image: "/event4.png",
//             title: "Camellia",
//             date: "Apr 19, 2025",
//             time: "08.00 AM IST",
//             location: "Musaeus College Auditorium",
//             price: "5,000 LKR",
//         },
//         {
//             image: "/event1.png",
//             title: "Dawasak Live In Concert",
//             date: "Apr 19, 2025",
//             time: "08.00 AM IST",
//             location: "Musaeus College Auditorium",
//             price: "5,000 LKR",
//         },
//         {
//             image: "/event2.png",
//             title: "80'S 90'S RETRO PARTY",
//             date: "Apr 19, 2025",
//             time: "08.00 AM IST",
//             location: "Musaeus College Auditorium",
//             price: "4,500 LKR",
//         },
//         {
//             image: "/event3.png",
//             title: "Sancharayak",
//             date: "Apr 19, 2025",
//             time: "08.00 AM IST",
//             location: "Musaeus College Auditorium",
//             price: "5,000 LKR",
//         },
//         {
//             image: "/event4.png",
//             title: "Camellia",
//             date: "Apr 19, 2025",
//             time: "08.00 AM IST",
//             location: "Musaeus College Auditorium",
//             price: "5,000 LKR",
//         },
//     ];
//
//     const handleFilterChange = (newFilters: EventFilters) => {
//         setFilters(newFilters);
//         console.log(filters);
//         console.log('Filters applied:', newFilters);
//     };
//
//     return (
//         <div className="min-h-screen">
//             <HeroSection hero={hero}/>
//             <div className="py-8 px-4 sm:px-6 lg:px-20">
//                 <div className="py-2 sm:py-10 px-4 sm:px-6 max-w-7xl mx-auto">
//                     <SectionTitle title="Latest Events"/>
//                 </div>
//                 <div className="py-5 px-4 sm:px-6 lg:px-12">
//                     <EventFilter onFilterChange={handleFilterChange}/>
//                 </div>
//                 <section className="px-4 sm:px-6 lg:px-8 bg-white">
//                     <div className="max-w-7xl mx-auto">
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
//                             {events.map((event, index) => (
//                                 <EventCard key={index} {...event} />
//                             ))}
//                         </div>
//                     </div>
//                 </section>
//                 <div className="my-10 flex justify-center">
//                     <Pagination/>
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// export default EventsPage;

// "use client";
// import {Suspense, useState} from "react";
// import HeroSection from "@/components/HeroSection";
// import Pagination from "@/components/Pagination";
// import EventFilter from "@/components/Filter";
// import SectionTitle from "@/components/SectionTitle";
// import * as React from "react";
// import EventCard from "@/components/EventCard";
// import {useSearchParams} from "next/navigation";
// import NewsLetter from "@/components/NewsLetter";
// import {useEvents} from "@/hooks/useEvent";
// import {getLocalDateTime} from "@/util/util";
//
// interface HeroProps {
//     image: string;
//     title: string;
//     subTitle: string;
// }
//
// interface Artist {
//     id: number;
//     name: string;
// }
//
// interface Location {
//     id: number;
//     name: string;
// }
//
// interface EventFilters {
//     startDate: Date | null;
//     endDate: Date | null;
//     artist: Artist | null;
//     location: Location | null;
//     priceRange: number[];
// }
//
//
// const hero: HeroProps = {
//     image: "/event-he.png",
//     title: "Explore Our Events",
//     subTitle: "Discover your favorite entertainment right here",
// };
//
// const EventsContent = () => {
//     const [filters, setFilters] = useState<EventFilters | null>(null);
//     const [currentPage, setCurrentPage] = useState(1);
//     const eventsPerPage = 12;
//     const searchParams = useSearchParams();
//     const searchQuery = searchParams.get("search")?.toLowerCase() || "";
//
//
//     const {data: eventData, isLoading, error} = useEvents();
//     console.log("------------raw data", eventData);
//     const eventDataArr = eventData?.events || [];
//
//     const handleFilterChange = (newFilters: EventFilters) => {
//         setFilters(newFilters);
//         setCurrentPage(1);
//     };
//
//     const transformedEvents = Array.isArray(eventDataArr)
//         ? eventDataArr.map((event) => {
//             const {localDate, localTime} = getLocalDateTime(event.start_date_time);
//             return {
//                 id: event.id,
//                 title: event.name,
//                 artist: {
//                     id: event.artist_details[0]?.artistId || 0,
//                     name: event.artist_details[0]?.artistName || "Unknown Artist",
//                 },
//                 location: event.location,
//                 date: localDate, // Local date (e.g., "2025-05-24")
//                 time: localTime, // Local time (e.g., "11:30 PM")
//                 price: `${Math.min(...(event.ticket_details?.map((t: { price: string; }) => t.price) || [0]))} LKR`,
//                 slug: event.slug,
//                 description: event.description,
//                 banner_image: event.banner_image,
//                 image: event.featured_image,
//                 ticket_details: event.ticket_details,
//                 artist_details: event.artist_details,
//                 status: event.status,
//             };
//         })
//         : [];
//
//
//     // Function to parse price from string to number
//     const parsePrice = (price: string): number => {
//         return parseInt(price.replace(/[^0-9]/g, ""));
//     };
//
//     // Function to parse date string to Date object
//     const parseEventDate = (date: string): Date => {
//         return new Date(date);
//     };
//
//     const filteredEvents = transformedEvents.filter((event) => {
//         const eventDate = parseEventDate(event.date);
//         const eventPrice = parsePrice(event.price);
//
//         // Search query filter
//         const searchMatch =
//             !searchQuery ||
//             event.title.toLowerCase().includes(searchQuery) ||
//             event.artist.name.toLowerCase().includes(searchQuery);
//
//         // EventFilter filters
//         const dateMatch =
//             !filters?.startDate ||
//             !filters?.endDate ||
//             (eventDate >= filters.startDate && eventDate <= filters.endDate);
//
//         const artistMatch = !filters?.artist || event.artist.id === filters.artist.id;
//
//         const locationMatch =
//             !filters?.location || event.location === filters.location.name;
//
//         const priceMatch =
//             !filters?.priceRange ||
//             (eventPrice >= filters.priceRange[0] && eventPrice <= filters.priceRange[1]);
//
//         return searchMatch && dateMatch && artistMatch && locationMatch && priceMatch;
//     });
//
//     const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
//     const startIndex = (currentPage - 1) * eventsPerPage;
//     const paginatedEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);
//
//     console.log(setFilters);
//
//
//     if (isLoading) {
//         return <div className="flex justify-center items-center min-h-screen">
//             Loading...
//         </div>
//     }
//
//     if (error) {
//         return <div className="text-center text-red-500 p-8">Error fetching events</div>
//     }
//
//     return (
//         <div className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
//             {/*<div className="py-2 sm:py-10 px-4 sm:px-6 max-w-7xl mx-auto">*/}
//             <div className="max-w-7xl mx-auto">
//                 <div>
//                     <SectionTitle title="Latest Events"/>
//                 </div>
//                 <div className="py-6 sm:py-10">
//                     <EventFilter onFilterChange={handleFilterChange}/>
//                 </div>
//                 <section className="">
//                     <div className="max-w-7xl mx-auto">
//                         {paginatedEvents.length > 0 ? (
//                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
//                                 {paginatedEvents.map((event, index) => (
//                                     <EventCard key={index} {...event} />
//                                 ))}
//                             </div>
//                         ) : (
//                             <div className="text-center py-10">
//                                 <p className="text-gray-500 font-semibold">No events match the selected filters.</p>
//                             </div>
//                         )}
//                     </div>
//                 </section>
//                 <div className="my-10 flex justify-center">
//                     <Pagination
//                         currentPage={currentPage}
//                         totalPages={totalPages}
//                         onPageChange={setCurrentPage}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// const EventsPage = () => {
//     return (
//         <div className="min-h-screen">
//             <HeroSection hero={hero}/>
//             <Suspense fallback={<div className="text-center py-10">Loading events...</div>}>
//                 <EventsContent/>
//             </Suspense>
//             <NewsLetter/>
//         </div>
//     );
// };
//
// export default EventsPage;

// --------------------------------------------------

// "use client";
// import * as React from "react";
// import {Suspense, useState} from "react";
// import HeroSection from "@/components/HeroSection";
// import Pagination from "@/components/Pagination";
// import EventFilter from "@/components/Filter";
// import SectionTitle from "@/components/SectionTitle";
// import EventCard from "@/components/EventCard";
// import {useSearchParams} from "next/navigation";
// import NewsLetter from "@/components/NewsLetter";
// import {useEvents} from "@/hooks/useEvent";
// import {getLocalDateTime} from "@/util/util";
// import EventCardSkeleton from "@/components/skeletons/EventCardSkeleton"; // Import the skeleton component
//
// interface HeroProps {
//     image: string;
//     title: string;
//     subTitle: string;
// }
//
// interface Artist {
//     id: number;
//     name: string;
// }
//
// interface Location {
//     id: number;
//     name: string;
// }
//
// interface EventFilters {
//     startDate: Date | null;
//     endDate: Date | null;
//     artist: Artist | null;
//     location: Location | null;
//     priceRange: number[];
// }
//
// const hero: HeroProps = {
//     image: "/event-he.png",
//     title: "Explore Our Events",
//     subTitle: "Discover your favorite entertainment right here",
// };
//
// const EventsContent = () => {
//     const [filters, setFilters] = useState<EventFilters | null>(null);
//     const [currentPage, setCurrentPage] = useState(1);
//     const eventsPerPage = 12;
//     const searchParams = useSearchParams();
//     const searchQuery = searchParams.get("search")?.toLowerCase() || "";
//
//     const {data: eventData, isLoading, error} = useEvents();
//     const eventDataArr = eventData?.events || [];
//
//     const handleFilterChange = (newFilters: EventFilters) => {
//         setFilters(newFilters);
//         setCurrentPage(1); // Reset to first page on filter change
//     };
//
//     const transformedEvents = Array.isArray(eventDataArr)
//         ? eventDataArr.map((event) => {
//             const {localDate, localTime} = getLocalDateTime(event.start_date_time);
//             return {
//                 id: event.id,
//                 title: event.name,
//                 artist: {
//                     id: event.artist_details[0]?.artistId || 0,
//                     name: event.artist_details[0]?.artistName || "Unknown Artist",
//                 },
//                 location: event.location,
//                 date: localDate, // Local date (e.g., "2025-05-24")
//                 time: localTime, // Local time (e.g., "11:30 PM")
//                 price: `${Math.min(...(event.ticket_details?.map((t: { price: string; }) => t.price) || [0]))} LKR`,
//                 slug: event.slug,
//                 description: event.description,
//                 banner_image: event.banner_image,
//                 image: event.featured_image,
//                 ticket_details: event.ticket_details,
//                 artist_details: event.artist_details,
//                 status: event.status,
//             };
//         })
//         : [];
//
//     // Function to parse price from string to number
//     const parsePrice = (price: string): number => {
//         return parseInt(price.replace(/[^0-9]/g, ""));
//     };
//
//     // Function to parse date string to Date object
//     const parseEventDate = (date: string): Date => {
//         // Assuming date is in a format directly parsable by Date constructor, e.g., "YYYY-MM-DD"
//         return new Date(date);
//     };
//
//     const filteredEvents = transformedEvents.filter((event) => {
//         const eventDate = parseEventDate(event.date);
//         const eventPrice = parsePrice(event.price);
//
//         // Search query filter
//         const searchMatch =
//             !searchQuery ||
//             event.title.toLowerCase().includes(searchQuery) ||
//             event.artist.name.toLowerCase().includes(searchQuery);
//
//         // EventFilter filters
//         const dateMatch =
//             !filters?.startDate ||
//             !filters?.endDate ||
//             (eventDate >= filters.startDate && eventDate <= filters.endDate);
//
//         const artistMatch = !filters?.artist || event.artist.id === filters.artist.id;
//
//         const locationMatch =
//             !filters?.location || event.location === filters.location.name;
//
//         const priceMatch =
//             !filters?.priceRange ||
//             (eventPrice >= filters.priceRange[0] && eventPrice <= filters.priceRange[1]);
//
//         return searchMatch && dateMatch && artistMatch && locationMatch && priceMatch;
//     });
//
//     const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
//     const startIndex = (currentPage - 1) * eventsPerPage;
//
//     // Determine what to render based on loading state
//     let contentToRender;
//
//     if (isLoading) {
//         // Render skeletons when loading
//          // Show skeletons for the full page
//         contentToRender = (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
//                 {Array.from({ length: eventsPerPage }).map((_, index) => (
//                     <EventCardSkeleton key={index} />
//                 ))}
//             </div>
//         );
//     } else if (error) {
//         // Render error message
//         contentToRender = (
//             <div className="text-center py-10">
//                 <p className="text-red-500 font-semibold">Error fetching events. Please try again later.</p>
//             </div>
//         );
//     } else if (filteredEvents.length > 0) {
//         // Render actual events if available
//         const paginatedEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);
//         contentToRender = (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
//                 {paginatedEvents.map((event) => (
//                     <EventCard key={event.id} {...event} />
//                 ))}
//             </div>
//         );
//     } else {
//         // Render no events message
//         contentToRender = (
//             <div className="text-center py-10">
//                 <p className="text-gray-500 font-semibold">No events match the selected filters.</p>
//             </div>
//         );
//     }
//
//     return (
//         <div className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
//             <div className="max-w-7xl mx-auto">
//                 <div>
//                     <SectionTitle title="Latest Events"/>
//                 </div>
//                 <div className="py-6 sm:py-10">
//                     {/* Disable filter interaction while loading */}
//                     <EventFilter onFilterChange={handleFilterChange} disabled={isLoading} />
//                 </div>
//                 <section className="">
//                     <div className="max-w-7xl mx-auto">
//                         {contentToRender}
//                     </div>
//                 </section>
//                 <div className="my-10 flex justify-center">
//                     {/* Only show pagination if not loading and there are events */}
//                     {!isLoading && filteredEvents.length > 0 && (
//                         <Pagination
//                             currentPage={currentPage}
//                             totalPages={totalPages}
//                             onPageChange={setCurrentPage}
//                         />
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// const EventsPage = () => {
//     return (
//         <div className="min-h-screen">
//             <HeroSection hero={hero}/>
//             <Suspense fallback={<div className="text-center py-10">Loading section...</div>}>
//                 <EventsContent/>
//             </Suspense>
//             <NewsLetter/>
//         </div>
//     );
// };
//
// export default EventsPage;


// ---------------------------------------------------------


// -------------------------- 2025.08.18
// "use client";
// import * as React from "react";
// import {Suspense, useState} from "react";
// import HeroSection from "@/components/HeroSection";
// import Pagination from "@/components/Pagination";
// import EventFilter from "@/components/Filter";
// import SectionTitle from "@/components/SectionTitle";
// import EventCard from "@/components/EventCard";
// import {useSearchParams} from "next/navigation";
// import NewsLetter from "@/components/NewsLetter";
// import {useAllEvents} from "@/hooks/useEvent";
// import {getLocalDateTime} from "@/util/util";
// import EventCardSkeleton from "@/components/skeletons/EventCardSkeleton"; // Import the skeleton component
//
// interface HeroProps {
//     image: string;
//     title: string;
//     subTitle: string;
// }
//
// interface Artist {
//     id: number;
//     name: string;
// }
//
// interface Location {
//     id: number;
//     name: string;
// }
//
// interface EventFilters {
//     startDate: Date | null;
//     endDate: Date | null;
//     artist: Artist | null;
//     location: Location | null;
//     priceRange: number[];
// }
//
// const hero: HeroProps = {
//     image: "/event-he.png",
//     title: "Explore Our Events",
//     subTitle: "Discover your favorite entertainment right here",
// };
//
// const EventsContent = () => {
//     const [filters, setFilters] = useState<EventFilters | null>({
//         startDate: null,
//         endDate: null,
//         artist: null,
//         location: null,
//         priceRange: [1000, 10000],
//     });
//     const [currentPage, setCurrentPage] = useState(1);
//     const eventsPerPage = 12;
//     const searchParams = useSearchParams();
//     const searchQuery = searchParams.get("search")?.toLowerCase() || "";
//
//     const {data: eventData, isLoading, error} = useAllEvents(filters);
//     const eventDataArr = eventData?.events || [];
//
//     const handleFilterChange = (newFilters: EventFilters) => {
//         setFilters(newFilters);
//         setCurrentPage(1); // Reset to first page on filter change
//     };
//
//     const transformedEvents = Array.isArray(eventDataArr)
//         ? eventDataArr.filter(event => event.status === "active").map((event) => {
//             const {localDate, localTime} = getLocalDateTime(event.start_date_time);
//             const minPrice =
//                 Math.min(
//                     ...(event.ticket_details?.map((t: { price: number }) => parseFloat(String(t.price))) || [
//                         0,
//                     ])
//                 ) || 0;
//
//             return {
//                 id: event.id,
//                 title: event.name,
//                 artist: {
//                     id: event.artist_details[0]?.artistId || 0,
//                     name: event.artist_details[0]?.artistName || "Unknown Artist",
//                 },
//                 location: event.location,
//                 date: localDate, // Local date (e.g., "2025-05-24")
//                 time: localTime, // Local time (e.g., "11:30 PM")
//                 price: `${minPrice} LKR`,
//                 slug: event.slug,
//                 description: event.description,
//                 banner_image: event.banner_image,
//                 image: event.featured_image,
//                 ticket_details: event.ticket_details,
//                 artist_details: event.artist_details,
//                 status: event.status,
//                 all_seats_booked: event.all_seats_booked,
//                 all_ticket_without_seats_booked: event.all_ticket_without_seats_booked
//             };
//         })
//         : [];
//
//     const filteredEvents = transformedEvents.filter((event) => {
//         const searchMatch =
//             !searchQuery ||
//             event.title.toLowerCase().includes(searchQuery) ||
//             event.artist.name.toLowerCase().includes(searchQuery);
//
//         return searchMatch;
//     });
//
//     const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
//     const startIndex = (currentPage - 1) * eventsPerPage;
//     const paginatedEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);
//
//     // Determine what to render based on loading state
//     let contentToRender;
//
//     if (isLoading) {
//         contentToRender = (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
//                 {Array.from({length: eventsPerPage}).map((_, index) => (
//                     <EventCardSkeleton key={index}/>
//                 ))}
//             </div>
//         );
//     } else if (error) {
//         contentToRender = (
//             <div className="text-center py-10">
//                 <p className="text-red-500 font-semibold">Error fetching events. Please try again later.</p>
//             </div>
//         );
//     } else if (filteredEvents.length > 0) {
//         contentToRender = (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
//                 {paginatedEvents.map((event) => (
//                     <EventCard key={event.id} {...event} />
//                 ))}
//             </div>
//         );
//     } else {
//         contentToRender = (
//             <div className="text-center py-10">
//                 <p className="text-gray-500 font-semibold">No events match the selected filters.</p>
//             </div>
//         );
//     }
//
//     return (
//         <div className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
//             <div className="max-w-7xl mx-auto">
//                 <div>
//                     <SectionTitle title="Latest Events"/>
//                 </div>
//                 <div className="py-6 sm:py-10">
//                     {/* Disable filter interaction while loading */}
//                     <EventFilter onFilterChange={handleFilterChange} disabled={isLoading}/>
//                 </div>
//                 <section className="">
//                     <div className="max-w-7xl mx-auto">
//                         {contentToRender}
//                     </div>
//                 </section>
//                 <div className="my-10 flex justify-center">
//                     {/* Only show pagination if not loading and there are events */}
//                     {!isLoading && filteredEvents.length > 0 && (
//                         <Pagination
//                             currentPage={currentPage}
//                             totalPages={totalPages}
//                             onPageChange={setCurrentPage}
//                         />
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// const EventsPage = () => {
//     return (
//         <div className="min-h-screen">
//             <HeroSection hero={hero}/>
//             <Suspense fallback={<div className="text-center py-10">Loading section...</div>}>
//                 <EventsContent/>
//             </Suspense>
//             <NewsLetter/>
//         </div>
//     );
// };
//
// export default EventsPage;


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
import EventCardSkeleton from "@/components/skeletons/EventCardSkeleton"; // Import the skeleton component

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
                        all_ticket_without_seats_booked: event.all_ticket_without_seats_booked
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