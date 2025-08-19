// "use client"
// import HeroSection from "@/components/HeroSection";
// import React from "react";
// import {useGetCheckoutStatusApi} from "@/hooks/useBooking";
//
// interface HeroProps {
//     image: string;
//     title: string;
//     subTitle: string
// }
//
//
// const PaymentSuccessful = () => {
//
//     const order_id = "63";
//     const {data: orderData, isLoading, isError} = useGetCheckoutStatusApi(order_id);
//
//     console.log("-----------order data: ", orderData);
//
//     // const itemDetails = [
//     //     {label: "Item :", value: "Camellia Concert"},
//     //     {label: "Quantity:", value: "03 Tickets"},
//     //     {label: "Amount:", value: "4000.00 LKR"}
//     // ];
//     //
//     // const customerDetails = [
//     //     {label: "Name :", value: "Kevin Fernando"},
//     //     {label: "Contact No :", value: "+94 198 628 6589"},
//     //     {label: "Email Address:", value: "elnazbolkhari@gmail"}
//     // ];
//
//     const hero: HeroProps = {
//         image: "/payment-successful-hero.png",
//         title: "Billing Details",
//         subTitle: "Discover your favorite entertainment right here",
//     }
//
//     const handleDownload = (qrCodeUrl: string, index: number) => {
//         const link = document.createElement('a');
//         link.href = qrCodeUrl;
//         link.download = `ticket-qr-code-${index + 1}.png`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };
//
//     if (isLoading) {
//         return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
//     }
//
//     if (isError || !orderData) {
//         return <div className="min-h-screen flex justify-center items-center">Error loading order details</div>;
//     }
//
//     const itemDetails = [
//         {label: "Item:", value: orderData.event.name},
//         {
//             label: "Quantity:",
//             value: `${
//                 (orderData.bookedTickets.seats.reduce((sum, seat) => sum + seat.seatIds.length, 0) +
//                     orderData.bookedTickets.ticketsWithoutSeats.reduce((sum, ticket) => sum + ticket.count, 0))
//             } Tickets`
//         },
//         {label: "Amount:", value: `${orderData.orderTotal}.00 LKR`},
//     ];
//
//     const customerDetails = [
//         {label: "Name:", value: `${orderData.customer.firstName} ${orderData.customer.lastName}`},
//         {label: "Email Address:", value: orderData.customer.email},
//     ];
//
//     // const handleDownload = () => {
//     //     // Functionality to download QR code would be implemented here
//     //     console.log("Downloading QR code...");
//     // };
//
//     return (
//         <div className="min-h-screen">
//             <HeroSection hero={hero}/>
//             <div className="py-8 px-4 sm:px-6 lg:px-8">
//                 <div className="mx-auto">
//                     <div className="flex flex-col gap-8 items-center px-5 py-2 mx-auto max-w-[1200px]">
//                         <h1 className="lg:text-[45px] text-4xl font-semibold text-center text-[#2D9257] montserrat">
//                             Payment Successful!
//                         </h1>
//                         <section className="flex flex-col gap-5 w-full">
//                             <h2 className="text-lg font-inter lg:text-2xl font-bold text-[#27337C]">
//                                 You&#39;ve successfully purchased your ticket!
//                             </h2>
//                             <p className="text-base lg:text-xl leading-snug text-[#505050] font-inter font-medium">
//                                 A confirmation email with your QR code has been sent to your inbox.
//                                 Please check your email and keep the QR code ready for event entry.
//                             </p>
//                             <hr className="mx-0 my-2.5 w-full h-px bg-[#E7E7E7]/50"/>
//                         </section>
//
//                         <div className="flex gap-10 justify-between mt-5 w-full max-md:flex-col max-md:gap-8">
//                             <section>
//                                 <h3 className="mb-5 text-lg lg:text-2xl font-bold text-[#222222]">
//                                     Item Details
//                                 </h3>
//                                 <div className="flex flex-col gap-4">
//                                     {itemDetails.map((detail, index) => (
//                                         <p key={index}
//                                            className="text-base lg:text-xl text-[#1F2173] font-inter font-medium">
//                                             <span className="">{detail.label}</span>
//                                             <span className="ml-2">{detail.value}</span>
//                                         </p>
//                                     ))}
//                                 </div>
//                             </section>
//                             <section>
//                                 <h3 className="mb-5 text-lg lg:text-2xl font-bold text-[#222222]">
//                                     Costumer details
//                                 </h3>
//                                 <div className="flex flex-col gap-4">
//                                     {customerDetails.map((detail, index) => (
//                                         <p key={index}
//                                            className="text-base lg:text-xl text-[#1F2173] font-inter font-medium">
//                                             <span className="">{detail.label}</span>
//                                             <span className="ml-2">{detail.value}</span>
//                                         </p>
//                                     ))}
//                                 </div>
//                             </section>
//                         </div>
//
//                         {/*<div*/}
//                         {/*    className="flex justify-between items-center pt-5 mt-8 w-full border-t border-solid border-t-[#E7E7E7] max-md:flex-col max-md:gap-5 max-md:text-center">*/}
//                         {/*    <p className="text-base lg:text-xl font-bold text-[#27337C]">*/}
//                         {/*        Thank you for choosing to buy from Ticketer!*/}
//                         {/*    </p>*/}
//                         {/*    <button*/}
//                         {/*        onClick={handleDownload}*/}
//                         {/*        className="flex gap-2.5 items-center px-6 py-3 text-sm text-white bg-[#2D2A70] rounded-md border-2 border-[#2D2A70] border-solid cursor-pointer max-md:w-full"*/}
//                         {/*    >*/}
//                         {/*        <div>*/}
//                         {/*            <svg*/}
//                         {/*                width="16"*/}
//                         {/*                height="17"*/}
//                         {/*                viewBox="0 0 16 17"*/}
//                         {/*                fill="none"*/}
//                         {/*                xmlns="http://www.w3.org/2000/svg"*/}
//                         {/*                className="download-icon"*/}
//                         {/*            >*/}
//                         {/*                <path*/}
//                         {/*                    d="M14 8C14.2761 8 14.5 8.22386 14.5 8.5V14.5C14.5 14.7761 14.2761 15 14 15H2C1.72386 15 1.5 14.7761 1.5 14.5V8.50277C1.5 8.22662 1.72386 8.00277 2 8.00277C2.27614 8.00277 2.5 8.22662 2.5 8.50277V14H13.5V8.5C13.5 8.22386 13.7239 8 14 8Z"*/}
//                         {/*                    fill="white"/>*/}
//                         {/*                <path*/}
//                         {/*                    d="M4.64645 7.81311C4.84171 7.61785 5.15829 7.61785 5.35355 7.81311L8 10.4596L10.6464 7.81311C10.8417 7.61785 11.1583 7.61785 11.3536 7.81311C11.5488 8.00838 11.5488 8.32496 11.3536 8.52022L8.35355 11.5202C8.15829 11.7155 7.84171 11.7155 7.64645 11.5202L4.64645 8.52022C4.45118 8.32496 4.45118 8.00838 4.64645 7.81311Z"*/}
//                         {/*                    fill="white"/>*/}
//                         {/*                <path*/}
//                         {/*                    d="M7.99723 2C8.27338 2 8.49723 2.22386 8.49723 2.5V11.1667C8.49723 11.4428 8.27338 11.6667 7.99723 11.6667C7.72109 11.6667 7.49723 11.4428 7.49723 11.1667V2.5C7.49723 2.22386 7.72109 2 7.99723 2Z"*/}
//                         {/*                    fill="white"/>*/}
//                         {/*            </svg>*/}
//                         {/*        </div>*/}
//                         {/*        <span>Download QR Code</span>*/}
//                         {/*    </button>*/}
//                         {/*</div>*/}
//
//                         <section className="mt-8 w-full">
//                             <h3 className="mb-5 text-lg lg:text-2xl font-bold text-[#222222]">
//                                 Your QR Codes
//                             </h3>
//                             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                                 {orderData.qrCodesDataUrls.map((qrCode: string, index: number) => (
//                                     <div key={index} className="flex flex-col items-center gap-2">
//                                         <img src={qrCode} alt={`QR Code ${index + 1}`} className="w-32 h-32"/>
//                                         <button
//                                             onClick={() => handleDownload(qrCode, index)}
//                                             className="flex gap-2.5 items-center px-4 py-2 text-sm text-white bg-[#2D2A70] rounded-md border-2 border-[#2D2A70] border-solid cursor-pointer"
//                                         >
//                                             <svg
//                                                 width="16"
//                                                 height="17"
//                                                 viewBox="0 0 16 17"
//                                                 fill="none"
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 className="download-icon"
//                                             >
//                                                 <path
//                                                     d="M14 8C14.2761 8 14.5 8.22386 14.5 8.5V14.5C14.5 14.7761 14.2761 15 14 15H2C1.72386 15 1.5 14.7761 1.5 14.5V8.50277C1.5 8.22662 1.72386 8.00277 2 8.00277C2.27614 8.00277 2.5 8.22662 2.5 8.50277V14H13.5V8.5C13.5 8.22386 13.7239 8 14 8Z"
//                                                     fill="white"
//                                                 />
//                                                 <path
//                                                     d="M4.64645 7.81311C4.84171 7.61785 5.15829 7.61785 5.35355 7.81311L8 10.4596L10.6464 7.81311C10.8417 7.61785 11.1583 7.61785 11.3536 7.81311C11.5488 8.00838 11.5488 8.32496 11.3536 8.52022L8.35355 11.5202C8.15829 11.7155 7.84171 11.7155 7.64645 11.5202L4.64645 8.52022C4.45118 8.32496 4.45118 8.00838 4.64645 7.81311Z"
//                                                     fill="white"
//                                                 />
//                                                 <path
//                                                     d="M7.99723 2C8.27338 2 8.49723 2.22386 8.49723 2.5V11.1667C8.49723 11.4428 8.27338 11.6667 7.99723 11.6667C7.72109 11.6667 7.49723 11.4428 7.49723 11.1667V2.5C7.49723 2.22386 7.72109 2 7.99723 2Z"
//                                                     fill="white"
//                                                 />
//                                             </svg>
//                                             <span>Download QR {index + 1}</span>
//                                         </button>
//                                     </div>
//                                 ))}
//                             </div>
//                         </section>
//
//                         <div
//                             className="flex justify-between items-center pt-5 mt-8 w-full border-t border-solid border-t-[#E7E7E7] max-md:flex-col max-md:gap-5 max-md:text-center">
//                             <p className="text-base lg:text-xl font-bold text-[#27337C]">
//                                 Thank you for choosing to buy from Ticketer!
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// export default PaymentSuccessful;


"use client"
import HeroSection from "@/components/HeroSection";
import React, {Suspense} from "react";
import {useGetCheckoutStatusApi} from "@/hooks/useBooking";
import JSZip from "jszip";
import {saveAs} from "file-saver";
import Image from "next/image";
import {useSearchParams} from "next/navigation";

interface HeroProps {
    image: string;
    title: string;
    subTitle: string
}

interface SeatDetails {
    seatId: string;
    price: number;
    type_id: number;
}

interface Seat {
    ticketTypeName: string;
    seatIds: string[];
    seatDetails: SeatDetails[];
}

interface TicketWithoutSeat {
    ticketTypeName: string;
    count: number;
    type_id: number;
    price: number;
}

// CODE BEFORE ORDER CANCEL UPDATE

// const PaymentSuccessful = () => {

//     const searchParams = useSearchParams();
//     const order_id = searchParams.get("orderId") || "63";
//     const status = searchParams.get("status");

//     // const order_id = "63";
//     const {data: orderData, isLoading, isError} = useGetCheckoutStatusApi(order_id);

//     console.log("-----------order data: ", orderData);

//     const hero: HeroProps = {
//         image: "/payment-successful-hero.png",
//         title: "Billing Details",
//         subTitle: "Discover your favorite entertainment right here",
//     }

//     const handleDownloadAll = async () => {
//         if (!orderData?.qrCodesDataUrls) return;

//         const zip = new JSZip();

//         for (let i = 0; i < orderData.qrCodesDataUrls.length; i++) {
//             const qrCodeUrl = orderData.qrCodesDataUrls[i];
//             const response = await fetch(qrCodeUrl);
//             const blob = await response.blob();
//             zip.file(`ticket-qr-code-${i + 1}.png`, blob);
//         }

//         const content = await zip.generateAsync({type: "blob"});
//         saveAs(content, `event-tickets-${orderData.orderId}.zip`);
//     };

//     if (isLoading) {
//         return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
//     }

//     if (isError || !orderData) {
//         return <div className="min-h-screen flex justify-center items-center">Error loading order details</div>;
//     }

//     const itemDetails = [
//         {label: "Item:", value: orderData.event.name},
//         {
//             label: "Quantity:",
//             value: `${
//                 (orderData.bookedTickets.seats.reduce((sum: number, seat: Seat) => sum + seat.seatIds.length, 0) +
//                     orderData.bookedTickets.ticketsWithoutSeats.reduce((sum: number, ticket: TicketWithoutSeat) => sum + ticket.count, 0))
//             } Tickets`
//         },
//         {label: "Amount:", value: `${orderData.orderTotal}.00 LKR`},
//     ];

//     const customerDetails = [
//         {label: "Name:", value: `${orderData.customer.firstName} ${orderData.customer.lastName}`},
//         {label: "Email Address:", value: orderData.customer.email},
//         {label: "Contact Number:", value: orderData.customer.contact_number},
//     ];

//     return (
//         <div className="min-h-screen">
//             <HeroSection hero={hero}/>
//             <div className="py-8 px-4 sm:px-6 lg:px-8">
//                 <div className="mx-auto">
//                     <div className="flex flex-col gap-8 items-center px-5 py-2 mx-auto max-w-[1200px]">
//                         <h1 className="lg:text-[45px] text-4xl font-semibold text-center text-[#2D9257] montserrat">
//                             {status === "200" ? "Payment Successful!" : "Payment Status"}
//                         </h1>
//                         <section className="flex flex-col gap-5 w-full">
//                             <h2 className="text-lg font-inter lg:text-2xl font-bold text-[#27337C]">
//                                 {status === "200"
//                                     ? "You've successfully purchased your ticket!"
//                                     : "Checking your payment status..."}
//                             </h2>
//                             <p className="text-base lg:text-xl leading-snug text-[#505050] font-inter font-medium">
//                                 {status === "200"
//                                     ? "A confirmation email with your QR code has been sent to your inbox. Please check your email and keep the QR code ready for event entry."
//                                     : "Please verify your payment status."}
//                             </p>
//                             <hr className="mx-0 my-2.5 w-full h-px bg-[#E7E7E7]/50"/>
//                         </section>
//                         {/*<h1 className="lg:text-[45px] text-4xl font-semibold text-center text-[#2D9257] montserrat">*/}
//                         {/*    Payment Successful!*/}
//                         {/*</h1>*/}
//                         {/*<section className="flex flex-col gap-5 w-full">*/}
//                         {/*    <h2 className="text-lg font-inter lg:text-2xl font-bold text-[#27337C]">*/}
//                         {/*        You&#39;ve successfully purchased your ticket!*/}
//                         {/*    </h2>*/}
//                         {/*    <p className="text-base lg:text-xl leading-snug text-[#505050] font-inter font-medium">*/}
//                         {/*        A confirmation email with your QR code has been sent to your inbox.*/}
//                         {/*        Please check your email and keep the QR code ready for event entry.*/}
//                         {/*    </p>*/}
//                         {/*    <hr className="mx-0 my-2.5 w-full h-px bg-[#E7E7E7]/50"/>*/}
//                         {/*</section>*/}

//                         {
//                             status === "200" && (
//                                 <>
//                                     <div className="flex gap-10 justify-between mt-5 w-full max-md:flex-col max-md:gap-8">
//                                         <section>
//                                             <h3 className="mb-5 text-lg lg:text-2xl font-bold text-[#222222]">
//                                                 Item Details
//                                             </h3>
//                                             <div className="flex flex-col gap-4">
//                                                 {itemDetails.map((detail, index) => (
//                                                     <p key={index}
//                                                        className="text-base lg:text-xl text-[#1F2173] font-inter font-medium">
//                                                         <span className="">{detail.label}</span>
//                                                         <span className="ml-2">{detail.value}</span>
//                                                     </p>
//                                                 ))}
//                                             </div>
//                                         </section>
//                                         <section>
//                                             <h3 className="mb-5 text-lg lg:text-2xl font-bold text-[#222222]">
//                                                 Costumer details
//                                             </h3>
//                                             <div className="flex flex-col gap-4">
//                                                 {customerDetails.map((detail, index) => (
//                                                     <p key={index}
//                                                        className="text-base lg:text-xl text-[#1F2173] font-inter font-medium">
//                                                         <span className="">{detail.label}</span>
//                                                         <span className="ml-2">{detail.value}</span>
//                                                     </p>
//                                                 ))}
//                                             </div>
//                                         </section>
//                                     </div>


//                                     <section className="mt-8 w-full">
//                                         <h3 className="mb-4 text-xl lg:text-2xl font-bold text-gray-800">
//                                             Your QR Codes
//                                         </h3>
//                                         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                                             {orderData.qrCodesDataUrls.map((qrCode: string, index: number) => (
//                                                 <div key={index} className="flex flex-col items-center gap-2">
//                                                     <Image
//                                                         src={qrCode}
//                                                         alt={`QR Code ${index + 1}`}
//                                                         width={256}
//                                                         height={256}
//                                                         className="w-28 h-28 rounded-lg shadow-sm"
//                                                     />
//                                                     <p className="text-sm text-gray-600 font-inter">Ticket {index + 1}</p>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </section>

//                                     <div
//                                         className="flex justify-between items-center pt-6 mt-8 w-full border-t border-gray-200 max-md:flex-col max-md:gap-5 max-md:text-center">
//                                         <p className="text-base lg:text-lg font-bold text-indigo-900">
//                                             Thank you for choosing Ticketer!
//                                         </p>
//                                         <button
//                                             onClick={handleDownloadAll}
//                                             className="flex gap-2.5 items-center px-6 py-3 text-sm font-medium text-white bg-indigo-800 rounded-lg hover:bg-indigo-900 transition-colors duration-200 border-2 border-indigo-800 max-md:w-full"
//                                         >
//                                             <svg
//                                                 width="16"
//                                                 height="17"
//                                                 viewBox="0 0 16 17"
//                                                 fill="none"
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 className="download-icon"
//                                             >
//                                                 <path
//                                                     d="M14 8C14.2761 8 14.5 8.22386 14.5 8.5V14.5C14.5 14.7761 14.2761 15 14 15H2C1.72386 15 1.5 14.7761 1.5 14.5V8.50277C1.5 8.22662 1.72386 8.00277 2 8.00277C2.27614 8.00277 2.5 8.22662 2.5 8.50277V14H13.5V8.5C13.5 8.22386 13.7239 8 14 8Z"
//                                                     fill="white"
//                                                 />
//                                                 <path
//                                                     d="M4.64645 7.81311C4.84171 7.61785 5.15829 7.61785 5.35355 7.81311L8 10.4596L10.6464 7.81311C10.8417 7.61785 11.1583 7.61785 11.3536 7.81311C11.5488 8.00838 11.5488 8.32496 11.3536 8.52022L8.35355 11.5202C8.15829 11.7155 7.84171 11.7155 7.64645 11.5202L4.64645 8.52022C4.45118 8.32496 4.45118 8.00838 4.64645 7.81311Z"
//                                                     fill="white"
//                                                 />
//                                                 <path
//                                                     d="M7.99723 2C8.27338 2 8.49723 2.22386 8.49723 2.5V11.1667C8.49723 11.4428 8.27338 11.6667 7.99723 11.6667C7.72109 11.6667 7.49723 11.4428 7.49723 11.1667V2.5C7.49723 2.22386 7.72109 2 7.99723 2Z"
//                                                     fill="white"
//                                                 />
//                                             </svg>
//                                             <span>Download All QR Codes</span>
//                                         </button>
//                                     </div>
//                                 </>
//                             )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


// const OrderStatusPage = () => {
//     return (
//         <Suspense fallback={<div className="min-h-screen flex justify-center items-center">Loading...</div>}>
//             <PaymentSuccessful/>
//         </Suspense>
//     );
// }

// export default OrderStatusPage;


//CODE AFTER ORDER CANCEL UPDATE
const PaymentSuccessful = () => {
 
    const searchParams = useSearchParams();
    const order_id = searchParams.get("orderId");
    const status = searchParams.get("status");

    const {data: orderData, isLoading, isError} = useGetCheckoutStatusApi(order_id || "");

    const hero: HeroProps = {
        image: "/payment-successful-hero.png",
        title: "Billing Details",
        subTitle: "Discover your favorite entertainment right here",
    }

    const handleDownloadAll = async () => {
        if (!orderData?.qrCodesDataUrls) return;

        const zip = new JSZip();

        for (let i = 0; i < orderData.qrCodesDataUrls.length; i++) {
            const qrCodeUrl = orderData.qrCodesDataUrls[i];
            const response = await fetch(qrCodeUrl);
            const blob = await response.blob();
            zip.file(`ticket-qr-code-${i + 1}.png`, blob);
        }

        const content = await zip.generateAsync({type: "blob"});
        saveAs(content, `event-tickets-${orderData.orderId}.zip`);
    };

    if (isLoading) {
        return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
    }

    // Handle initial error or missing data for all cases
    if (isError || !orderData) {
        // You might want a more specific error message here based on the status,
        // but this covers general API failures.
        return (
            <div className="min-h-screen flex flex-col justify-center items-center gap-4">
                <HeroSection hero={{...hero, title: "Payment Status"}}/>
                <h1 className="lg:text-[45px] text-4xl font-semibold text-center text-red-500 montserrat">
                    Payment Failed
                </h1>
                <p className="text-base lg:text-xl leading-snug text-gray-600 font-inter font-medium">
                    Could not retrieve order details. Please check your email or contact support.
                </p>
                <p className="text-base lg:text-xl leading-snug text-gray-600 font-inter font-medium">
                    Order ID: {order_id || "N/A"}
                </p>
            </div>
        );
    }
    
    // Determine the content based on the status code
    let title, subtitle, mainTitle, message;
    let showQrCodes = false;

    if (status === "200") {
        title = "Payment Successful!";
        subtitle = "You've successfully purchased your ticket!";
        message = "A confirmation email with your QR code has been sent to your inbox. Please check your email and keep the QR code ready for event entry.";
        mainTitle = "Payment Successful";
        showQrCodes = true;
    } else if (status === "403") {
        title = "Payment Failed!";
        subtitle = "Unfortunately, your payment could not be processed.";
        message = "There was an issue processing your payment. Please try again with a different payment method or contact your bank for more information.";
        mainTitle = "Payment Failed";
    } else if (status === "409") {
        title = "Payment Cancelled!";
        subtitle = "You have cancelled the transaction.";
        message = "Your payment was cancelled. No charges have been made to your account. You can return to the event page to try again.";
        mainTitle = "Payment Cancelled";
    } else {
        // Fallback for any other status codes
        title = "Payment Status Unknown";
        subtitle = "Checking your payment status...";
        message = "We are unable to determine the status of your payment. Please verify your payment status or contact support.";
        mainTitle = "Payment Status";
    }


    const itemDetails = [
        {label: "Item:", value: orderData.event.name},
        {
            label: "Quantity:",
            value: `${
                (orderData.bookedTickets.seats.reduce((sum: number, seat: Seat) => sum + seat.seatIds.length, 0) +
                    orderData.bookedTickets.ticketsWithoutSeats.reduce((sum: number, ticket: TicketWithoutSeat) => sum + ticket.count, 0))
            } Tickets`
        },
        {label: "Amount:", value: `${orderData.orderTotal}.00 LKR`},
    ];

    const customerDetails = [
        {label: "Name:", value: `${orderData.customer.firstName} ${orderData.customer.lastName}`},
        {label: "Email Address:", value: orderData.customer.email},
        {label: "Contact Number:", value: orderData.customer.contact_number},
    ];

    return (
        <div className="min-h-screen">
            <HeroSection hero={{...hero, title: mainTitle}}/>
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto">
                    <div className="flex flex-col gap-8 items-center px-5 py-2 mx-auto max-w-[1200px]">
                        <h1 className={`lg:text-[45px] text-4xl font-semibold text-center montserrat 
                            ${status === "200" ? "text-[#2D9257]" : "text-red-500"}`}>
                            {title}
                        </h1>
                        <section className="flex flex-col gap-5 w-full">
                            <h2 className="text-lg font-inter lg:text-2xl font-bold text-[#27337C]">
                                {subtitle}
                            </h2>
                            <p className="text-base lg:text-xl leading-snug text-[#505050] font-inter font-medium">
                                {message}
                            </p>
                            <hr className="mx-0 my-2.5 w-full h-px bg-[#E7E7E7]/50"/>
                        </section>

                        {/* This section only renders for a successful payment (status 200) */}
                        {
                            showQrCodes && (
                                <>
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
                                                Customer details
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
                                            {orderData.qrCodesDataUrls.map((qrCode: string, index: number) => (
                                                <div key={index} className="flex flex-col items-center gap-2">
                                                    <Image
                                                        src={qrCode}
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
                                            className="flex gap-2.5 items-center px-6 py-3 text-sm font-medium text-white bg-indigo-800 rounded-lg hover:bg-indigo-900 transition-colors duration-200 border-2 border-indigo-800 max-md:w-full"
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
                                </>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const OrderStatusPage = () => {
    return (
        <Suspense fallback={<div className="min-h-screen flex justify-center items-center">Loading...</div>}>
            <PaymentSuccessful/>
        </Suspense>
    );
}

export default OrderStatusPage;