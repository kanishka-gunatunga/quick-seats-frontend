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

    // const formatTimeLeft = (seconds: number | null): { minutes: string; seconds: string } => {
    //     if (seconds === null) return {minutes: "", seconds: ""};
    //     const minutes = Math.floor(seconds / 60);
    //     const secs = seconds % 60;
    //     return {
    //         minutes: minutes.toString().padStart(2, "0"),
    //         seconds: secs.toString().padStart(2, "0"),
    //     };
    // };

    return (
        <div className="mt-4 sm:mt-6 py-8 sm:py-12">
            {/*{timeLeft !== null && (*/}
            {/*    <div*/}
            {/*        className={`flex justify-center items-center p-4 mb-4 transition-all duration-300*/}
            {/*         ${*/}
            {/*            isWarning ? "bg-yellow-100 rounded-lg" : ""*/}
            {/*        }`}*/}
            {/*    >*/}
            {/*        <h3 className="text-[#27337C] font-semibold text-sm md:text-base lg:text-lg">*/}
            {/*            Time remaining for booking:*/}
            {/*        </h3>*/}
            {/*        <div className="flex items-center gap-2 ml-4">*/}
            {/*            <div*/}
            {/*                className={`bg-white rounded-sm text-center justify-center w-8 h-8 md:w-10 md:h-10 border-2 border-[#27337C] ${*/}
            {/*                    isWarning ? "animate-pulse" : ""*/}
            {/*                }`}*/}
            {/*            >*/}
            {/*                <div*/}
            {/*                    className="text-sm justify-center md:text-lg lg:text-xl font-inter text-[#27337C] font-semibold">*/}
            {/*                    {formatTimeLeft(timeLeft).minutes}*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*            <div className="flex flex-col space-y-2 justify-center items-center px-1">*/}
            {/*                <div className="w-1.5 h-1.5 rounded-md bg-[#27337C]"/>*/}
            {/*                <div className="w-1.5 h-1.5 rounded-md bg-[#27337C]"/>*/}
            {/*            </div>*/}
            {/*            <div*/}
            {/*                className={`bg-white text-blue-900 rounded-sm justify-center text-center w-8 h-8 md:w-10 md:h-10 border-2 border-[#27337C] ${*/}
            {/*                    isWarning ? "animate-pulse" : ""*/}
            {/*                }`}*/}
            {/*            >*/}
            {/*                <div className="text-sm md:text-lg lg:text-xl font-inter text-[#27337C] font-semibold">*/}
            {/*                    {formatTimeLeft(timeLeft).seconds}*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}
            {/*<Snackbar open={isWarning} anchorOrigin={{vertical: "top", horizontal: "center"}}>*/}
            {/*    <Alert severity="warning">*/}
            {/*        Your booking time is almost up! Only {timeLeft} seconds remain.*/}
            {/*    </Alert>*/}
            {/*</Snackbar>*/}
            <div className="flex flex-col lg:flex-row gap-4 justify-center px-14">
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


// -------------- wada karpu timer eka add karanna kalin eka

// "use client"
//
// import HeroSection from "@/components/HeroSection";
// import SectionTitle from "@/components/SectionTitle";
// import React, {Suspense, useEffect} from "react";
// import BillingDetails from "@/components/BillingDetails";
// import BookingSummary from "@/components/BookingSummary";
// import {useSearchParams} from "next/navigation";
//
//
// interface Hero {
//     image: string;
//     title: string;
//     subTitle: string;
// }
//
// interface BookingSummaryData {
//     rows: {
//         category: string;
//         price: string;
//         tickets: string;
//         amount: string;
//         ticketTypeId: number;
//         isBalcony: boolean;
//     }[];
//     totalTickets: string;
//     totalAmount: string;
//     selectedSeatNumbers: string;
// }
//
// const BillingDetailsContent: React.FC = () => {
//     const searchParams = useSearchParams();
//     const summaryParam = searchParams.get("summary");
//     const eventId = searchParams.get("eventId");
//     const [bookingData, setBookingData] = React.useState<BookingSummaryData | null>(null);
//
//     useEffect(() => {
//         if (summaryParam) {
//             try {
//                 const parsedData: BookingSummaryData = JSON.parse(decodeURIComponent(summaryParam));
//                 setBookingData(parsedData);
//                 console.log(parsedData);
//             } catch (error) {
//                 console.error("Failed to parse booking summary data:", error);
//                 setBookingData(null);
//             }
//         }
//     }, [summaryParam]);
//
//     return (
//         <div className="mt-4 sm:mt-6 py-8 sm:py-12">
//             <div className="flex flex-col lg:flex-row gap-4 justify-center px-14">
//                 <BillingDetails summaryData={bookingData} eventId={eventId} />
//                 <BookingSummary summaryData={bookingData} />
//             </div>
//         </div>
//     );
// };
//
//
// const BillingDetailsPage = () => {
//
//     const hero: Hero = {
//         image: '/payment-successful-hero.png',
//         title: 'Billing Details',
//         subTitle: 'Discover your favorite entertainment right here',
//     };
//
//     return (
//         <div className="min-h-screen bg-white">
//             <HeroSection hero={hero}/>
//             <div className="py-4 px-2 sm:px-4 lg:px-6">
//                 <div className="max-w-7xl mx-auto">
//                     <SectionTitle title="Billing Details"/>
//                     <Suspense
//                         fallback={
//                             <div className="flex items-center justify-center h-64 text-gray-600">
//                                 Loading billing details...
//                             </div>
//                         }
//                     >
//                         <BillingDetailsContent />
//                     </Suspense>
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// export default BillingDetailsPage;

// -------------------------------

