"use client";

import React from "react";
import { Skeleton } from "@mui/material";

const SeatBookingPageSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            {/*<div className="relative w-full min-h-[250px] sm:min-h-[400px] lg:min-h-[600px] bg-gray-300 rounded-b-[40px] sm:rounded-b-[60px] lg:rounded-b-[80px] 2xl:rounded-b-[100px] overflow-hidden">*/}
            {/*    <Skeleton variant="rectangular" width="100%" height="100%" />*/}
            {/*    <div className="absolute inset-0 bg-gradient-to-r from-[#011C2A]/20 to-[#000000]/20 rounded-b-[40px] sm:rounded-b-[60px] lg:rounded-b-[80px] 2xl:rounded-b-[100px]"></div>*/}
            {/*    <div className="absolute z-10 flex flex-col w-full max-w-screen-2xl mx-auto px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12 xl:px-16 2xl:px-20">*/}
            {/*        <Skeleton variant="rectangular" width={120} height={40} className="rounded-md" /> /!* Nav placeholder *!/*/}
            {/*        <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-16 xl:mt-20 2xl:mt-24 py-6 sm:py-8 md:pb-10 md:pt-28 flex flex-col items-start max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">*/}
            {/*            <Skeleton variant="text" width="60%" height={50} /> /!* Title *!/*/}
            {/*            <Skeleton variant="text" width="40%" height={30} className="mt-3" /> /!* Subtitle *!/*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* Main Content Area Skeleton */}
            <div className="py-4 px-2 sm:px-4 lg:px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Section Title Skeleton */}
                    {/*<SectionTitle title="Seat Booking" /> /!* Keep the actual title, or replace with skeleton *!/*/}
                    <div className="">
                        {/* Seat Map Area Skeleton */}
                        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                            <Skeleton variant="rectangular" width="90%" height="90%" className="rounded-lg" />
                        </div>

                        {/* Summary Table Skeleton */}
                        <div className="py-4 px-2 sm:px-4 lg:px-6">
                            <div className="max-w-4xl mx-auto mt-8">
                                <Skeleton variant="rectangular" width="100%" height={40} className="rounded-t-md" /> {/* Table Head */}
                                <div className="space-y-2">
                                    {[...Array(3)].map((_, index) => ( // Example rows
                                        <Skeleton key={index} variant="rectangular" width="100%" height={40} />
                                    ))}
                                </div>
                                <Skeleton variant="rectangular" width="100%" height={40} className="rounded-b-md" /> {/* Total Row */}

                                {/* Seat Numbers and Buttons Skeleton */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-200 rounded-md px-4 sm:px-8 lg:px-12 py-3 sm:py-4 mt-4 gap-2 sm:gap-4">
                                    <Skeleton variant="text" width="20%" height={30} /> {/* Seat Numbers Label */}
                                    <Skeleton variant="text" width="40%" height={30} /> {/* Seat Numbers Placeholder */}
                                    <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
                                        <Skeleton variant="rectangular" width={100} height={40} className="rounded-md" /> {/* Reset Button */}
                                        <Skeleton variant="rectangular" width={100} height={40} className="rounded-md" /> {/* Proceed Button */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatBookingPageSkeleton;