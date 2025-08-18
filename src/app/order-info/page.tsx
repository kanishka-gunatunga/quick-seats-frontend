"use client"
import HeroSection from "@/components/HeroSection";
import React, {Suspense} from "react";
import {useGetOrderInfoApi} from "@/hooks/useBooking";
import JSZip from "jszip";
import {saveAs} from "file-saver";
import Image from "next/image";
import {useSearchParams} from "next/navigation";

interface HeroProps {
    image: string;
    title: string;
    subTitle: string
}

const OrderInfo = () => {

    const searchParams = useSearchParams();
    const order_id = searchParams.get("identifier") || "68885ee4532000";

    const {data: orderData, isLoading, isError} = useGetOrderInfoApi(order_id);

    console.log("-----------order data: ", orderData);

    const hero: HeroProps = {
        image: "/payment-successful-hero.png",
        title: "Billing Details",
        subTitle: "Discover your favorite entertainment right here",
    }

    const handleDownloadAll = async () => {
        if (!orderData || !orderData.responseDetails?.order?.qr_code_urls) return;

        const qrCodeUrls = JSON.parse(orderData.responseDetails.order.qr_code_urls);

        if (!Array.isArray(qrCodeUrls)) return;

        const zip = new JSZip();

        for (let i = 0; i < qrCodeUrls.length; i++) {
            const qrCode = qrCodeUrls[i];
            const response = await fetch(qrCode.url);
            const blob = await response.blob();
            zip.file(qrCode.filename, blob);
        }

        const content = await zip.generateAsync({type: "blob"});
        saveAs(content, `event-tickets-${orderData.responseDetails.order.id}.zip`);
    };

    if (isLoading) {
        return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
    }

    if (isError || !orderData) {
        return <div className="min-h-screen flex justify-center items-center">Error loading order details</div>;
    }

    const qrCodeUrls = orderData.responseDetails?.order?.qr_code_urls ?
        JSON.parse(orderData.responseDetails.order.qr_code_urls) : [];

    const totalTickets =
        orderData.responseDetails.bookedTickets?.seats.reduce((sum: number, seat: {
            seatIds: string
        }) => sum + seat.seatIds.length, 0) +
        orderData.responseDetails.bookedTickets?.ticketsWithoutSeats.reduce((sum: number, ticket: {
            count: number;
        }) => sum + ticket.count, 0);

    const itemDetails = [
        {label: "Item:", value: orderData.responseDetails.event.name},
        {label: "Quantity:", value: `${totalTickets} Tickets`},
        {label: "Amount:", value: `${orderData?.responseDetails.order.sub_total}.00 LKR`},
    ];

    const customerDetails = [
        {
            label: "Name:",
            value: `${orderData?.responseDetails.order.first_name} ${orderData?.responseDetails.order.last_name}`
        },
        {label: "Email Address:", value: orderData?.responseDetails.order.email},
        {label: "Contact Number:", value: orderData?.responseDetails.order.contact_number},
    ];

    return (
        <div className="min-h-screen">
            <HeroSection hero={hero}/>
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto">
                    <div className="flex flex-col gap-8 items-center px-5 py-2 mx-auto max-w-[1200px]">
                        <h1 className="lg:text-[45px] text-4xl font-semibold text-center text-[#2D9257] montserrat">
                            Payment Successful!
                        </h1>
                        <section className="flex flex-col gap-5 w-full">
                            <h2 className="text-lg font-inter lg:text-2xl font-bold text-[#27337C]">
                                You&#39;ve successfully purchased your ticket!
                            </h2>
                            <p className="text-base lg:text-xl leading-snug text-[#505050] font-inter font-medium">
                                Thank you for your purchase. A confirmation email with your QR codes has been sent to
                                your inbox.
                            </p>
                            <hr className="mx-0 my-2.5 w-full h-px bg-[#E7E7E7]/50"/>
                        </section>

                        <div className="flex gap-10 justify-between mt-5 w-full max-md:flex-col max-md:gap-8">
                            <section>
                                <h3 className="mb-5 text-lg lg:text-2xl font-bold text-[#222222]">
                                    Item Details
                                </h3>
                                <div className="flex flex-col gap-4">
                                    {itemDetails.map((detail, index) => (
                                        <p key={index}
                                           className="text-base lg:text-xl text-[#1F2173] font-inter font-medium">
                                            <span className="">{detail.label}</span>
                                            <span className="ml-2">{detail.value}</span>
                                        </p>
                                    ))}
                                </div>
                            </section>
                            <section>
                                <h3 className="mb-5 text-lg lg:text-2xl font-bold text-[#222222]">
                                    Costumer details
                                </h3>
                                <div className="flex flex-col gap-4">
                                    {customerDetails.map((detail, index) => (
                                        <p key={index}
                                           className="text-base lg:text-xl text-[#1F2173] font-inter font-medium">
                                            <span className="">{detail.label}</span>
                                            <span className="ml-2">{detail.value}</span>
                                        </p>
                                    ))}
                                </div>
                            </section>
                        </div>


                        <section className="mt-8 w-full">
                            <h3 className="mb-4 text-xl lg:text-2xl font-bold text-gray-800">
                                Your QR Codes
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {qrCodeUrls.map((qrCode: { url: string; filename: string; }, index: number) => (
                                    <div key={index} className="flex flex-col items-center gap-2">
                                        <Image
                                            src={qrCode.url}
                                            alt={`QR Code ${index + 1}`}
                                            width={256}
                                            height={256}
                                            className="w-28 h-28 rounded-lg shadow-sm"
                                        />
                                        <p className="text-sm text-gray-600 font-inter">Ticket {index + 1}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div
                            className="flex justify-between items-center pt-6 mt-8 w-full border-t border-gray-200 max-md:flex-col max-md:gap-5 max-md:text-center">
                            <p className="text-base lg:text-lg font-bold text-indigo-900">
                                Thank you for choosing Ticketer!
                            </p>
                            <button
                                onClick={handleDownloadAll}
                                className="flex gap-2.5 items-center px-6 py-3 text-sm font-medium cursor-pointer text-white bg-indigo-800 rounded-lg hover:bg-indigo-900 transition-colors duration-200 border-2 border-indigo-800 max-md:w-full"
                            >
                                <svg
                                    width="16"
                                    height="17"
                                    viewBox="0 0 16 17"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="download-icon"
                                >
                                    <path
                                        d="M14 8C14.2761 8 14.5 8.22386 14.5 8.5V14.5C14.5 14.7761 14.2761 15 14 15H2C1.72386 15 1.5 14.7761 1.5 14.5V8.50277C1.5 8.22662 1.72386 8.00277 2 8.00277C2.27614 8.00277 2.5 8.22662 2.5 8.50277V14H13.5V8.5C13.5 8.22386 13.7239 8 14 8Z"
                                        fill="white"
                                    />
                                    <path
                                        d="M4.64645 7.81311C4.84171 7.61785 5.15829 7.61785 5.35355 7.81311L8 10.4596L10.6464 7.81311C10.8417 7.61785 11.1583 7.61785 11.3536 7.81311C11.5488 8.00838 11.5488 8.32496 11.3536 8.52022L8.35355 11.5202C8.15829 11.7155 7.84171 11.7155 7.64645 11.5202L4.64645 8.52022C4.45118 8.32496 4.45118 8.00838 4.64645 7.81311Z"
                                        fill="white"
                                    />
                                    <path
                                        d="M7.99723 2C8.27338 2 8.49723 2.22386 8.49723 2.5V11.1667C8.49723 11.4428 8.27338 11.6667 7.99723 11.6667C7.72109 11.6667 7.49723 11.4428 7.49723 11.1667V2.5C7.49723 2.22386 7.72109 2 7.99723 2Z"
                                        fill="white"
                                    />
                                </svg>
                                <span>Download All QR Codes</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


const OrderInfoPage = () => {
    return (
        <Suspense fallback={<div className="min-h-screen flex justify-center items-center">Loading...</div>}>
            <OrderInfo/>
        </Suspense>
    );
}

export default OrderInfoPage;