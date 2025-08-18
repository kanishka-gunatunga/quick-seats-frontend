// import Image from "next/image";
// import React from "react";
//
// const Newsletters = () => {
//     return (
//         <div className="w-full py-12 px-4 sm:px-6 md:px-8 lg:px-12">
//             <div
//                 className=""
//             >
//                 <div
//                     className="relative justify-center">
//                     <Image
//                         className="absolute -bottom-20 overflow-hidden object-cover"
//                         width={1400}
//                         height={600}
//                         alt=""
//                         src="/newsletters.png"
//                     />
//                     <div
//                         className="flex relative flex-col items-center text-center py-12 px-6 sm:px-8 md:px-16 lg:px-24 ml-16 md:ml-24">
//                         <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-4">
//                             Subscribe Our Newsletter
//                         </h2>
//
//                         <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8">
//                             Lorem ipsum dolor sit amet consectetur. Ut pulvinar ullamcorper enim vulputate. Facilisi
//                             bibendum
//                             vulputate Lorem ipsum dolor sit amet consectetur. Ut pulvinar ullamcorper enim vulputate.
//                         </p>
//
//                         <div className="w-full max-w-xl relative rounded-md bg-white">
//                             <input
//                                 type="email"
//                                 placeholder="Enter your email ..."
//                                 className="w-full h-12 md:h-14 px-4 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#27337C]"
//                             />
//                             <button
//                                 className="absolute right-1 top-1 bottom-1 bg-[#27337C] hover:bg-[#1c255b] transition-colors px-4 sm:px-6 rounded-md text-white font-medium text-sm sm:text-base"
//                             >
//                                 Subscribe Now
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default Newsletters;

// import Image from "next/image";
// import React from "react";
//
// const Newsletters = () => {
//     return (
//         <div className="w-full py-8 sm:py-10 md:py-12 lg:py-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
//             <div className="relative max-w-7xl container mx-auto overflow-hidden rounded-lg">
//                 {/* Background Image Container with proper sizing */}
//                 <div className="absolute inset-0 w-full h-full">
//                     <Image
//                         src="/newsletters.png"
//                         alt="Newsletter background"
//                         fill
//                         className="object-contain hidden lg:block object-center"
//                         priority
//                     />
//                     <Image
//                         src="/newsletters-mobile.png"
//                         alt="Newsletter background"
//                         fill
//                         className="object-contain block lg:hidden object-center"
//                         priority
//                     />
//                 </div>
//
//                 {/* Decorative stripes on the left side */}
//                 {/*<div className="absolute left-0 top-0 bottom-0 w-6 sm:w-8 md:w-12 lg:w-16 bg-opacity-80 z-10">*/}
//                 {/*    <div className="h-full w-full flex flex-col">*/}
//                 {/*        {[...Array(20)].map((_, i) => (*/}
//                 {/*            <div*/}
//                 {/*                key={i}*/}
//                 {/*                className="h-2 border-t border-white/30"*/}
//                 {/*            />*/}
//                 {/*        ))}*/}
//                 {/*    </div>*/}
//                 {/*</div>*/}
//
//                 {/* Content container with responsive spacing */}
//                 <div className="relative z-10 flex flex-col items-center text-center py-10 sm:py-12 md:py-16 px-4 sm:px-8 md:px-12 lg:px-16 ml-8 sm:ml-12 md:ml-16 lg:ml-24">
//                     <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-3 sm:mb-4 md:mb-6">
//                         Subscribe Our Newsletter
//                     </h2>
//
//                     <p className="text-white/90 text-xs sm:text-sm md:text-base lg:text-lg max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10">
//                         Lorem ipsum dolor sit amet consectetur. Ut pulvinar ullamcorper enim vulputate. Facilisi
//                         bibendum vulputate Lorem ipsum dolor sit amet consectetur. Ut pulvinar ullamcorper enim vulputate.
//                     </p>
//
//                     <div className="w-full max-w-xs rounded-md bg-white sm:max-w-sm md:max-w-md lg:max-w-xl relative">
//                         <input
//                             type="email"
//                             placeholder="Enter your email ..."
//                             className="w-full h-10 sm:h-12 md:h-14 px-3 sm:px-4 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#27337C]"
//                             aria-label="Email address"
//                         />
//                         <button
//                             className="absolute right-1 top-1 bottom-1 bg-[#27337C] hover:bg-[#1c255b] transition-colors px-2 sm:px-3 md:px-4 lg:px-6 rounded-md text-white font-medium text-xs sm:text-sm md:text-base whitespace-nowrap"
//                             aria-label="Subscribe to newsletter"
//                         >
//                             Subscribe Now
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default Newsletters;

"use client"
import {useNewsLetterApi} from "@/hooks/useUser";
import {Alert, Snackbar} from "@mui/material";
import Image from "next/image";
import React, {useState, useCallback} from "react";

const Newsletters = () => {

    const [email, setEmail] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" | null }>({text: "", type: null});
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const {mutateAsync, isPending} = useNewsLetterApi();

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        setIsValidEmail(value.includes("@") && value.includes("."));
    };


    const handleSubscribe = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setMessage({text: "", type: null});
            setOpenSnackbar(false);

            if (!email) {
                setMessage({ text: "Please enter an email address.", type: "error" });
                setOpenSnackbar(true);
                return;
            }

            if (!isValidEmail) {
                setMessage({ text: "Invalid email address.", type: "error" });
                setOpenSnackbar(true);
                return;
            }

            try {
                await mutateAsync({email});
                setMessage({text: "Successfully subscribed!", type: "success"});
                setEmail(""); // Clear input on success
                setOpenSnackbar(true);
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : "An error occurred. Please try again.";
                setMessage({
                    text: errorMessage,
                    type: "error",
                });
                setOpenSnackbar(true);
            }
        },
        [email, isValidEmail, mutateAsync]
    );

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <div className="w-full py-8 sm:py-10 md:py-12 lg:py-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="relative max-w-screen-xl container mx-auto overflow-hidden rounded-lg">
                {/* Background Image Container with responsive height */}
                <div className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[350px]">
                    <Image
                        src="/newsletters.png"
                        alt="Newsletter background"
                        fill
                        className="object-cover hidden lg:block"
                        priority
                    />
                    <Image
                        src="/newsletters-mobile.png"
                        alt="Newsletter background"
                        fill
                        className="object-cover block lg:hidden"
                        priority
                    />
                </div>

                {/* Content container with responsive spacing */}
                <div
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center lg:ml-44 px-4 sm:px-8 md:px-12 lg:px-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-semibold text-white mb-3 sm:mb-4 md:mb-6">
                        Subscribe Our Newsletter
                    </h2>

                    <p className="text-white/90 text-xs sm:text-sm md:text-base lg:text-lg max-w-md sm:max-w-lg md:max-w-xl lg:max-w-4xl mx-auto mb-6 sm:mb-8 md:mb-10">
                        Subscribe to get the latest updates on concerts, events, and early-bird ticket deals — straight
                        to your inbox.
                        Never miss a performance again.
                    </p>

                    {/*<form onSubmit={handleSubscribe} className="w-full max-w-xs sm:max-w-sm bg-white rounded-md md:max-w-md lg:max-w-xl relative">*/}
                    {/*    <input*/}
                    {/*        type="email"*/}
                    {/*        placeholder="Enter your email ..."*/}
                    {/*        className="w-full h-10 sm:h-12 md:h-14 px-3 sm:px-4 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#27337C]"*/}
                    {/*        aria-label="Email address"*/}
                    {/*        value={email}*/}
                    {/*        onChange={(e) => setEmail(e.target.value)}*/}
                    {/*    />*/}
                    {/*    <button*/}
                    {/*        type="submit"*/}
                    {/*        className="absolute right-1 top-1 bottom-1 bg-[#27337C] hover:bg-[#1c255b] transition-colors px-2 sm:px-3 md:px-4 lg:px-6 rounded-md text-white font-medium text-xs sm:text-sm md:text-base whitespace-nowrap"*/}
                    {/*        aria-label="Subscribe to newsletter"*/}
                    {/*    >*/}
                    {/*        Subscribe Now*/}
                    {/*    </button>*/}
                    {/*    {message.text && (*/}
                    {/*        <p*/}
                    {/*            className={`mt-3 text-sm ${*/}
                    {/*                message.type === "success" ? "text-green-500" : "text-red-500"*/}
                    {/*            }`}*/}
                    {/*        >*/}
                    {/*            {message.text}*/}
                    {/*        </p>*/}
                    {/*    )}*/}
                    {/*</form>*/}

                    <form onSubmit={handleSubscribe} className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl">
                        <div className="relative bg-white rounded-md">
                            <input
                                type="email"
                                placeholder="Enter your email ..."
                                className="w-full h-10 sm:h-12 md:h-14 px-3 sm:px-4 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#27337C]"
                                aria-label="Email address"
                                value={email}
                                onChange={handleEmailChange}
                                disabled={isPending}
                            />
                            <button
                                type="submit"
                                className="absolute right-1 top-1 bottom-1 bg-[#27337C] hover:bg-[#1c255b] transition-colors px-2 sm:px-3 md:px-4 lg:px-6 rounded-md text-white font-medium text-xs sm:text-sm md:text-sm whitespace-nowrap disabled:opacity-50"
                                aria-label="Subscribe to newsletter"
                                disabled={isPending}
                            >
                                {isPending ? "Subscribing..." : "Subscribe Now"}
                            </button>
                        </div>
                    </form>

                    <Snackbar
                        open={openSnackbar}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbar}
                        anchorOrigin={{vertical: "top", horizontal: "center"}}
                    >
                        <Alert
                            onClose={handleCloseSnackbar}
                            severity={message.type === "success" ? "success" : "error"}
                            sx={{width: "100%"}}
                            id="newsletter-message"
                        >
                            {message.text}
                        </Alert>
                    </Snackbar>

                </div>
            </div>
        </div>
    );
};

export default Newsletters;

// import Image from "next/image";
// import React from "react";
//
// const Newsletters = () => {
//     return (
//         <div className="w-full py-8 sm:py-10 md:py-12 lg:py-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
//             <div className="relative max-w-7xl container mx-auto overflow-hidden rounded-lg">
//                 {/* Background Image Container with responsive height */}
//                 <div className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[450px]">
//                     <Image
//                         src="/newsletters.png"
//                         alt="Newsletter background"
//                         fill
//                         className="object-contain hidden lg:block"
//                         priority
//                     />
//                     <Image
//                         src="/newsletters-mobile.png"
//                         alt="Newsletter background"
//                         fill
//                         className="object-contain block lg:hidden"
//                         priority
//                     />
//                 </div>
//
//                 {/* Content container with responsive spacing */}
//                 <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 sm:px-8 md:px-12 lg:px-16">
//                     <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-3 sm:mb-4 md:mb-6">
//                         Subscribe Our Newsletter
//                     </h2>
//
//                     <p className="text-white/90 text-xs sm:text-sm md:text-base lg:text-lg max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10">
//                         Lorem ipsum dolor sit amet consectetur. Ut pulvinar ullamcorper enim vulputate. Facilisi
//                         bibendum vulputate Lorem ipsum dolor sit amet consectetur. Ut pulvinar ullamcorper enim vulputate.
//                     </p>
//
//                     <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl relative">
//                         <input
//                             type="email"
//                             placeholder="Enter your email ..."
//                             className="w-full h-10 sm:h-12 md:h-14 px-3 sm:px-4 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#27337C]"
//                             aria-label="Email address"
//                         />
//                         <button
//                             className="absolute right-1 top-1 bottom-1 bg-[#27337C] hover:bg-[#1c255b] transition-colors px-2 sm:px-3 md:px-4 lg:px-6 rounded-md text-white font-medium text-xs sm:text-sm md:text-base whitespace-nowrap"
//                             aria-label="Subscribe to newsletter"
//                         >
//                             Subscribe Now
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default Newsletters;