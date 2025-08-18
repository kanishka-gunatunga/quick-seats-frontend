"use client";

import React from "react";
import {Skeleton} from "@mui/material";

const EventPageSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen">
            <div
                className="relative w-full min-h-[250px] sm:min-h-[400px] lg:min-h-[600px] bg-gray-300 rounded-b-[40px] sm:rounded-b-[60px] lg:rounded-b-[80px] 2xl:rounded-b-[100px] overflow-hidden">
                <Skeleton variant="rectangular" width="100%" height="100%"/>
                <div
                    className="absolute inset-0 bg-gradient-to-r from-[#011C2A]/20 to-[#000000]/20 rounded-b-[40px] sm:rounded-b-[60px] lg:rounded-b-[80px] 2xl:rounded-b-[100px]"></div>
                <div
                    className="absolute z-10 flex flex-col w-full max-w-screen-2xl mx-auto px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12 xl:px-16 2xl:px-20">
                    <Skeleton variant="rectangular" width={120} height={40}
                              className="rounded-md"/> {/* Nav placeholder */}
                    <div
                        className="mt-8 sm:mt-10 md:mt-12 lg:mt-16 xl:mt-20 2xl:mt-24 py-6 sm:py-8 md:pb-10 md:pt-28 flex flex-col items-start max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
                        <Skeleton variant="text" width="80%" height={50}/> {/* Title */}
                        <Skeleton variant="text" width="60%" height={30} className="mt-3"/> {/* Subtitle */}
                        {/* Countdown/Search Bar area */}
                        <div className="flex justify-start gap-2 mt-10">
                            {[...Array(4)].map((_, i) => ( // 4 boxes for countdown
                                <Skeleton key={i} variant="rectangular" width={60} height={60} className="rounded-lg"/>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area Skeleton */}
            <div className="w-full py-6 sm:py-8 md:py-10 lg:py-12 xl:py-14 2xl:py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Left Column Skeleton (More Information, Gallery) */}
                        <div className="w-full lg:w-2/3">
                            <Skeleton variant="text" width="50%" height={30} className="mb-4"/> {/* More Info Title */}
                            <Skeleton variant="text" width="100%" height={20}/> {/* Description line 1 */}
                            <Skeleton variant="text" width="90%" height={20}/> {/* Description line 2 */}
                            <Skeleton variant="text" width="95%" height={20}/> {/* Description line 3 */}
                            <Skeleton variant="text" width="70%" height={20}/> {/* Description line 4 */}

                            <div className="space-y-4 mt-10">
                                <Skeleton variant="text" width="60%" height={25}/> {/* Date/Time */}
                                <Skeleton variant="text" width="70%" height={25}/> {/* Location */}
                                <Skeleton variant="text" width="80%" height={25}/> {/* Organized by */}
                                <Skeleton variant="text" width="90%" height={25}/> {/* Artists */}
                            </div>

                            <div className="mt-8">
                                <Skeleton variant="rectangular" width="100%" height={300}
                                          className="rounded-lg"/> {/* Media Gallery */}
                                <div className="flex space-x-2 mt-4">
                                    {[...Array(3)].map((_, i) => (
                                        <Skeleton key={i} variant="rectangular" width={80} height={80}
                                                  className="rounded-lg"/>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column Skeleton (Featured Image, Ticket Prices, Policy) */}
                        <div className="w-full lg:w-1/3 p-2">
                            <div className="bg-[#F4FCFF] p-2 rounded-md">
                                <Skeleton variant="rectangular" width="100%" height={400}
                                          className="rounded-lg mb-4"/> {/* Featured Image */}
                                <Skeleton variant="text" width="70%" height={40}
                                          className="px-2 mb-4"/> {/* Ticket Prices Title */}
                                <div className="space-y-2 px-2">
                                    {[...Array(3)].map((_, i) => (
                                        <Skeleton key={i} variant="text" width="100%" height={30}/> // Ticket Price lines
                                    ))}
                                </div>
                                <div className="flex justify-center mt-10 mb-4">
                                    <Skeleton variant="rectangular" width={200} height={50}
                                              className="rounded-lg"/> {/* Buy Tickets Button */}
                                </div>
                            </div>
                            <div className="mt-8">
                                <Skeleton variant="text" width="50%" height={30}
                                          className="mb-4"/> {/* Ticket Policy Title */}
                                <Skeleton variant="text" width="100%" height={20}/> {/* Policy line 1 */}
                                <Skeleton variant="text" width="90%" height={20}/> {/* Policy line 2 */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventPageSkeleton;