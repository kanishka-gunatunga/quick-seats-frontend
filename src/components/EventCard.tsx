"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
    image: string;
    title: string;
    date: string;
    time: string;
    location: string;
    price: string;
    slug: string;
    all_seats_booked: number;
    all_ticket_without_seats_booked: number;
    ticket_details: { price: number; ticketCount: number | null; ticketTypeId: number; hasTicketCount: boolean; bookedTicketCount: number; ticketTypeName: string }[];
}

const EventCard: React.FC<EventCardProps> = ({
                                                 image,
                                                 title,
                                                 date,
                                                 time,
                                                 location,
                                                 price,
                                                 slug,
                                                 all_seats_booked,
                                                 all_ticket_without_seats_booked,
                                                 ticket_details,
                                             }) => {

    const hasNullTicketCount = ticket_details.some((ticket) => ticket.ticketCount === null);

    // const isSoldOut = all_seats_booked === 1 && all_ticket_without_seats_booked === 1;

    const isSoldOut = hasNullTicketCount
        ? all_seats_booked === 1
        : all_seats_booked === 1 && all_ticket_without_seats_booked === 1;

    const button = (
        <button
            className={`mt-6 w-full px-6 py-3 font-inter font-medium text-sm rounded-b-md border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                ${isSoldOut
                ? "bg-red-600 text-white border-red-600 opacity-50 cursor-not-allowed"
                : "bg-[#27337C] text-white border-[#27337C] cursor-pointer hover:bg-indigo-800"}`}
            disabled={isSoldOut}
            aria-disabled={isSoldOut}
        >
            {isSoldOut ? "Sold Out" : "Buy Tickets"}
        </button>
    );

    return (
        <article className="w-full max-w-[296px] mx-auto">
            <div className="border-2 border-violet-100 rounded-md">
                <div className="p-3">
                    <Image
                        src={image}
                        alt={title}
                        width={280}
                        height={238}
                        className="object-cover w-full rounded-md aspect-[1.18]"
                    />
                    <div className="px-2 justify-between">
                        <h3 className="mt-4 text-xl font-medium groteskMedium text-[#011C2A]">{title}</h3>
                        <div className="flex gap-4 sm:gap-6 mt-4">
                            <div className="flex gap-3 text-xs font-inter font-medium text-[#6B7280]">
                                <Image
                                    src="/calendar.png"
                                    alt=""
                                    width={15}
                                    height={15}
                                    className="object-contain"
                                />
                                <time>{date}</time>
                            </div>
                            <div className="flex gap-3 text-xs font-inter font-medium text-[#6B7280]">
                                <Image
                                    src="/clock.png"
                                    alt=""
                                    width={18}
                                    height={18}
                                    className="object-contain"
                                />
                                <time>{time}</time>
                            </div>
                        </div>
                        <div
                            className="flex justify-start items-center gap-3 mt-3 text-xs font-inter font-medium text-[#6B7280]">
                            <Image
                                src="/location.png"
                                alt=""
                                width={19}
                                height={19}
                                className="object-contain"
                            />
                            <p>{location}</p>
                        </div>
                        <div className="flex gap-2 mt-4 font-semibold ">
                            <p className="text-xl groteskSemiBold font-semibold text-[#011C2A]">{price}</p>
                            <p className="text-xs text-gray-500 self-center">Upwards</p>
                        </div>
                    </div>
                </div>
                {/*<Link href={isSoldOut ? "" : `/events/${slug}`}>*/}
                {/*    <button*/}
                {/*        className={`mt-6 w-full px-6 py-3 font-inter font-medium text-sm cursor-pointer rounded-b-md border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 */}
                {/*        ${isSoldOut*/}
                {/*            ? "bg-red-600 text-white border-red-600 disabled:opacity-50 disabled:pointer-events-none cursor-not-allowed" : "bg-[#27337C] text-white border-[#27337C] hover:bg-indigo-800"}`}*/}
                {/*        disabled={isSoldOut}*/}
                {/*    >*/}
                {/*        {isSoldOut ? "Sold Out" : "Buy Tickets"}*/}
                {/*    </button>*/}
                {/*</Link>*/}

                {isSoldOut ? button : <Link href={`/events/${slug}`}>{button}</Link>}
            </div>
        </article>
    );
};

export default EventCard;
