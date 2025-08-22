"use client";

import React, {useEffect, useState} from "react";
import Image from "next/image";
import Nav from "@/components/Nav";
import {useRouter} from "next/navigation";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface HeroProps {
    image: string;
    title: string;
    time?: string;
    subTitle: string;
    type: string;
}

const Hero = ({hero}: { hero: HeroProps }) => {

    const [countdown, setCountdown] = useState({
        days: 36,
        hours: 3,
        minutes: 54,
        seconds: 54,
    });

    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    console.log("time :", hero.time);

    useEffect(() => {
        if (hero.type === "countdown" && hero.time) {

            const targetDate = dayjs.utc(hero.time).tz("Asia/Colombo").subtract(5, "hour").subtract(30, "minute");

            const interval = setInterval(() => {
                const now = dayjs.utc();
                const diff = targetDate.diff(now);

                if (diff <= 0) {
                    clearInterval(interval);
                    setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                } else {
                    const days = targetDate.diff(now, "day");
                    const hours = targetDate.diff(now.add(days, "day"), "hour");
                    const minutes = targetDate.diff(
                        now.add(days, "day").add(hours, "hour"),
                        "minute"
                    );
                    const seconds = targetDate.diff(
                        now.add(days, "day").add(hours, "hour").add(minutes, "minute"),
                        "second"
                    );

                    setCountdown({ days, hours, minutes, seconds });
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [hero.type, hero.time]);


    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };


    return (
        <main className="relative w-full min-h-[250px] sm:min-h-[400px] lg:min-h-[600px] font-medium">
            {/* Background Image */}
            <Image
                src={hero.image}
                alt="Background"
                fill
                className="object-cover rounded-b-[40px] sm:rounded-b-[60px] lg:rounded-b-[80px] 2xl:rounded-b-[100px]"
                priority
                quality={90}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, (max-width: 1536px) 100vw, 1920px"
            />
            <div
                className="absolute inset-0 bg-gradient-to-r from-[#011C2A]/20 to-[#000000]/20 rounded-b-[40px] sm:rounded-b-[60px] lg:rounded-b-[80px] 2xl:rounded-b-[100px]"></div>

            {/* Content */}
            <div
                className="relative z-10 flex flex-col w-full max-w-screen-2xl mx-auto px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12 xl:px-16 2xl:px-20">
                {/* Navigation */}
                <div className="z-30">
                    <Nav/>
                </div>

                {/* Hero Content */}
                <section
                    className="mt-8 sm:mt-10 md:mt-12 lg:mt-16 xl:mt-20 2xl:mt-24 py-6 sm:py-8 md:pb-10 md:pt-28 flex flex-col items-start max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl groteskBold text-white leading-6">
                        {hero.title}
                    </h1>
                    <p className="mt-3 sm:mt-4 md:mt-5 lg:mt-6 text-base sm:text-lg md:text-xl lg:text-2xl font-inter font-light text-white">
                        {hero.subTitle}
                    </p>

                    {/* Search Bar */}
                    {hero.type === "form" ? (
                        <form
                            onSubmit={handleSearchSubmit}
                            className="mt-6 sm:mt-8 md:mt-10 p-0.5 w-full max-w-sm sm:max-w-md lg:max-w-[476px] bg-white rounded-lg flex flex-row items-stretch text-base sm:text-lg">
                            <input
                                type="text"
                                placeholder="Search for events, Artists"
                                className="grow px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4 sm:rounded-l-lg rounded-t-lg sm:rounded-tr-none font-inter font-medium text-[#27337C] outline-none sm:border-r-0 border-b sm:border-b-0 border-gray-300 text-sm sm:text-base md:text-lg"
                                aria-label="Search for events or artists"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="flex cursor-pointer items-center font-inter font-medium text-sm sm:text-base md:text-lg gap-1.5 sm:gap-2 px-4 py-2 sm:px-5 sm:py-3 md:px-10 md:py-4 bg-[#27337C] text-white rounded-r-lg hover:bg-indigo-800 transition-colors duration-200"
                                aria-label="Search"
                            >
                                <Image
                                    src="/search.png"
                                    alt=""
                                    width={20}
                                    height={20}
                                    className="object-contain sm:w-6 sm:h-6 md:w-7 md:h-7"
                                />
                                <span>Search</span>
                            </button>
                        </form>
                    ) : hero.type === "countdown" ? (
                        <div className="flex justify-start gap-2 mt-10">
                            <div className="bg-white text-blue-900 p-2 sm:p-4 rounded-lg text-center w-15 sm:w-20">
                                <div
                                    className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-inter text-[#2D3192] font-bold">{countdown.days}</div>
                                <div
                                    className="text-xs sm:text-sm md:text-base font-inter font-medium text-[#9C9C9C]">DAYS
                                </div>
                            </div>
                            <div
                                className="flex-col space-y-4 hidden md:flex md:block justify-center items-center px-1">
                                <div className="w-4 h-4 rounded-md bg-white/50"/>
                                <div className="w-4 h-4 rounded-md bg-white/50"/>
                            </div>
                            <div className="bg-white text-blue-900 p-2 sm:p-3 rounded-lg text-center w-15 sm:w-20">
                                <div
                                    className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-inter text-[#2D3192] font-bold">{countdown.hours}</div>
                                <div
                                    className="text-xs sm:text-sm md:text-base font-inter font-medium text-[#9C9C9C]">HOURS
                                </div>
                            </div>
                            <div
                                className="hidden md:block md:flex flex-col space-y-4 justify-center items-center px-1">
                                <div className="w-4 h-4 rounded-md bg-white/50"/>
                                <div className="w-4 h-4 rounded-md bg-white/50"/>
                            </div>
                            <div className="bg-white text-blue-900 p-2 sm:p-3 rounded-lg text-center w-15 sm:w-20">
                                <div
                                    className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-inter text-[#2D3192] font-bold">{countdown.minutes}</div>
                                <div
                                    className="text-xs sm:text-sm md:text-base font-inter font-medium text-[#9C9C9C]">MINS
                                </div>
                            </div>
                            <div
                                className="hidden md:block md:flex flex-col space-y-4 justify-center items-center px-1">
                                <div className="w-4 h-4 rounded-md bg-white/50"/>
                                <div className="w-4 h-4 rounded-md bg-white/50"/>
                            </div>
                            <div className="bg-white text-blue-900 p-2 sm:p-3 rounded-lg text-center w-15 sm:w-20">
                                <div
                                    className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-inter text-[#2D3192] font-bold">{countdown.seconds}</div>
                                <div
                                    className="text-xs sm:text-sm md:text-base font-inter font-medium text-[#9C9C9C]">SECS
                                </div>
                            </div>
                        </div>
                    ) : null}
                </section>
            </div>
        </main>
    );
};

export default Hero;