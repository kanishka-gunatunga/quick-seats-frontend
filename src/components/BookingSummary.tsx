// "use client"
//
// import React from "react";
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
// interface BookingSummaryProps {
//     summaryData: BookingSummaryData | null;
// }
//
// const BookingSummary: React.FC<BookingSummaryProps> = ({summaryData}) => {
//
//     if (!summaryData) {
//         return (
//             <div className="w-full lg:w-1/2 bg-[#F1F5F9] rounded-md px-8 py-12 flex justify-center items-center">
//                 <p className="text-lg text-gray-600">No booking summary data available.</p>
//             </div>
//         );
//     }
//
//     const subTotal = summaryData.rows.reduce((sum, row) => sum + parseFloat(row.amount.replace(' LKR', '')), 0);
//
//     return (
//         <div className="w-full lg:w-1/2 bg-[#F1F5F9] rounded-md px-8 py-12">
//             <h2 className="text-[30px] font-inter font-semibold text-[#27337C] text-center">Booking summary</h2>
//             <div className="mt-8">
//                 <div className="space-y-4">
//                     <div className="flex justify-between">
//                         <span className="text-xl grotesk font-medium text-[#6B7280]">Tickets</span>
//                         <span className="text-xl grotesk font-medium text-[#6B7280]">Amount</span>
//                     </div>
//                     {summaryData.rows.map((row, index) => (
//                         <div key={index} className="flex justify-between">
//                             <span className="text-xl font-inter font-medium text-black">{row.category}</span>
//                             <span
//                                 className="text-xl font-inter font-medium text-black">{row.price} X {row.tickets}</span>
//                         </div>
//                     ))}
//                 </div>
//
//                 <div className="mt-8 space-y-4">
//                     <div className="space-y-8">
//                         <div className="flex justify-between mt-8">
//                             <span className="text-xl font-inter font-medium text-black">SUB TOTAL</span>
//                             <span className="text-xl font-inter font-medium text-black">{subTotal.toFixed(2)} LKR</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span className="text-xl font-inter font-medium text-[#27337C]">Discounts</span>
//                             <span className="text-xl font-inter font-medium text-[#27337C]">0.00 LKR</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span className="text-xl font-inter font-bold text-[#27337C]">TOTAL</span>
//                             <span
//                                 className="text-xl font-inter font-bold text-[#27337C]">{parseFloat(summaryData.totalAmount).toFixed(2)} LKR</span>
//                         </div>
//                     </div>
//                     {/*{summaryData.selectedSeatNumbers && (*/}
//                     {/*    <div className="mt-4 p-4 bg-gray-100 rounded-md">*/}
//                     {/*        <p className="text-md font-medium text-[#27337C]">Selected*/}
//                     {/*            Seats: {summaryData.selectedSeatNumbers}</p>*/}
//                     {/*    </div>*/}
//                     {/*)}*/}
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default BookingSummary;


"use client"

import React from "react";

interface BookingSummaryData {
    rows: {
        category: string;
        price: string;
        tickets: string;
        amount: string;
        ticketTypeId: number;
        isBalcony: boolean;
    }[];
    totalTickets: string;
    totalAmount: string;
    selectedSeatNumbers: string;
}

interface BookingSummaryProps {
    summaryData: BookingSummaryData | null;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({summaryData}) => {

    if (!summaryData) {
        return (
            <div
                className="w-full lg:w-1/2 bg-[#F1F5F9] rounded-md px-4 py-8 sm:px-8 sm:py-12 flex justify-center items-center min-h-[200px]"> {/* Adjusted padding, added min-height */}
                <p className="text-base sm:text-lg text-gray-600">No booking summary data
                    available.</p> {/* Adjusted text size */}
            </div>
        );
    }

    // Ensure parsing handles " LKR" suffix gracefully and provides a default if conversion fails
    const subTotal = summaryData.rows.reduce((sum, row) => {
        const amountValue = parseFloat(row.amount.replace(' LKR', '').trim());
        return sum + (isNaN(amountValue) ? 0 : amountValue);
    }, 0);

    // Ensure totalAmount is parsed safely
    const totalAmountValue = parseFloat(summaryData.totalAmount.replace(' LKR', '').trim());

    return (
        <div
            className="w-full lg:w-1/2 bg-[#F1F5F9] rounded-md px-4 py-8 sm:px-8 sm:py-12"> {/* Adjusted padding for smaller screens */}
            <h2 className="text-[26px] sm:text-[30px] font-inter font-semibold text-[#27337C] text-center mb-6 sm:mb-8">Booking
                Summary</h2> {/* Adjusted font size and margin */}
            <div className="mt-6 sm:mt-8"> {/* Adjusted margin-top */}
                <div className="space-y-3 sm:space-y-4"> {/* Slightly reduced space for mobile */}
                    <div className="flex justify-between pb-2"> {/* Added bottom border */}
                        <span
                            className="text-lg grotesk font-medium text-[#6B7280] sm:text-xl">Tickets</span> {/* Adjusted text size */}
                        <span
                            className="text-lg grotesk font-medium text-[#6B7280] sm:text-xl">Amount</span> {/* Adjusted text size */}
                    </div>
                    {summaryData.rows.map((row, index) => (
                        <div key={index}
                             className="flex justify-between items-center py-1"> {/* Added align-items and vertical padding */}
                            <span
                                className="text-base font-inter font-medium text-black sm:text-lg">{row.category}</span> {/* Adjusted text size */}
                            <span
                                className="text-base font-inter font-medium text-black sm:text-lg">{row.price} X {row.tickets}</span> {/* Adjusted text size */}
                        </div>
                    ))}
                </div>

                <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4"> {/* Adjusted margin-top and space-y */}
                    <div className="space-y-3 sm:space-y-4"> {/* Adjusted space-y */}
                        <div className="flex justify-between pt-4"> {/* Added top border */}
                            <span
                                className="text-lg font-inter font-medium text-black sm:text-xl">SUB TOTAL</span> {/* Adjusted text size */}
                            <span
                                className="text-lg font-inter font-medium text-black sm:text-xl">{subTotal.toFixed(2)} LKR</span> {/* Adjusted text size */}
                        </div>
                        <div className="flex justify-between">
                            <span
                                className="text-lg font-inter font-medium text-[#27337C] sm:text-xl">Discounts</span> {/* Adjusted text size */}
                            <span
                                className="text-lg font-inter font-medium text-[#27337C] sm:text-xl">0.00 LKR</span> {/* Adjusted text size */}
                        </div>
                        <div
                            className="flex justify-between pt-2"> {/* Added stronger top border */}
                            <span
                                className="text-xl font-inter font-bold text-[#27337C] sm:text-2xl">TOTAL</span> {/* Adjusted text size for emphasis */}
                            <span
                                className="text-xl font-inter font-bold text-[#27337C] sm:text-2xl">{isNaN(totalAmountValue) ? '0.00' : totalAmountValue.toFixed(2)} LKR</span> {/* Adjusted text size and added safety check */}
                        </div>
                    </div>
                    {/*{summaryData.selectedSeatNumbers && (*/}
                    {/*    <div className="mt-4 p-3 sm:p-4 bg-gray-100 rounded-md"> /!* Adjusted padding *!/*/}
                    {/*        <p className="text-sm sm:text-md font-medium text-[#27337C]">Selected*/}
                    {/*            Seats: {summaryData.selectedSeatNumbers}</p> /!* Adjusted text size *!/*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </div>
            </div>
        </div>
    );
};

export default BookingSummary;