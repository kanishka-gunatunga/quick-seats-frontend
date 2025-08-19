"use client"

import HeroSection from "@/components/HeroSection";
import SectionTitle from "@/components/SectionTitle";
import React, {Suspense, useEffect} from "react";
import BillingDetails from "@/components/BillingDetails";
import BookingSummary from "@/components/BookingSummary";
import {useSearchParams} from "next/navigation";
// import {useTimer} from "@/context/TimerContext";
// import {Alert, Snackbar} from "@mui/material";


interface Hero {
    image: string;
    title: string;
    subTitle: string;
}

interface BookingSummaryData {
    rows: {
        category: string;
        price: string;
        tickets: string;
        amount: string;
        ticketTypeId: number;
        isBalcony: boolean;
        enableManualSelection: boolean;
    }[];
    totalTickets: string;
    totalAmount: string;
    selectedSeatNumbers: string;
}

const BillingDetailsContent: React.FC = () => {
    const searchParams = useSearchParams();
    const summaryParam = searchParams.get("summary");
    const eventId = searchParams.get("eventId");
    const [bookingData, setBookingData] = React.useState<BookingSummaryData | null>(null);
    // const {timeLeft, isWarning} = useTimer();

    useEffect(() => {
        if (summaryParam) {
            try {
                const parsedData: BookingSummaryData = JSON.parse(decodeURIComponent(summaryParam));
                setBookingData(parsedData);
                console.log(parsedData);
            } catch (error) {
                console.error("Failed to parse booking summary data:", error);
                setBookingData(null);
            }
        }
    }, [summaryParam]);

    return (
        <div className="mt-4 sm:mt-6 py-8 sm:py-12">
            <div className="flex flex-col lg:flex-row gap-4 justify-center px-6 md:px-14">
                <BillingDetails summaryData={bookingData} eventId={eventId}/>
                <BookingSummary summaryData={bookingData}/>
            </div>
        </div>
    );
};


const BillingDetailsPage = () => {

    const hero: Hero = {
        image: '/payment-successful-hero.png',
        title: 'Billing Details',
        subTitle: 'Discover your favorite entertainment right here',
    };

    return (
        <div className="min-h-screen bg-white">
            <HeroSection hero={hero}/>
            <div className="py-4 px-2 sm:px-4 lg:px-6">
                <div className="max-w-7xl mx-auto">
                    <SectionTitle title="Billing Details"/>
                    <Suspense
                        fallback={
                            <div className="flex items-center justify-center h-64 text-gray-600">
                                Loading billing details...
                            </div>
                        }
                    >
                        <BillingDetailsContent/>
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

export default BillingDetailsPage;