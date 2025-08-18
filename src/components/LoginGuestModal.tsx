// import React from 'react';
// import { Dialog, DialogContent, IconButton, Box } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
//
// interface LoginGuestModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onSignIn: () => void;
//     onContinueAsGuest: () => void;
// }
//
// const LoginGuestModal: React.FC<LoginGuestModalProps> = ({
//                                                              isOpen,
//                                                              onClose,
//                                                              onSignIn,
//                                                              onContinueAsGuest,
//                                                          }) => {
//     return (
//         <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
//             <DialogContent sx={{ position: 'relative', padding: '24px' }}>
//                 <IconButton
//                     aria-label="close"
//                     onClick={onClose}
//                     sx={{
//                         position: 'absolute',
//                         right: 8,
//                         top: 8,
//                         color: (theme) => theme.palette.grey[500],
//                     }}
//                 >
//                     <CloseIcon />
//                 </IconButton>
//                 <Box sx={{ textAlign: 'center', mb: 4 }}>
//                     {/*<Image src="/mytickets-logo.svg" alt="MyTickets Logo" width={120} height={40} />*/}
//                     <h2 className="text-xl sm:text-2xl font-bold text-[#2D2A70] mt-4">
//                         Let&#39;s Book Your Ticket
//                     </h2>
//                     <p className="text-sm text-gray-600 mt-2">
//                         E-Ticket(s) transfer, exclusive deals, and other features are
//                         available exclusively for registered users.
//                     </p>
//                 </Box>
//
//                 <div className="flex flex-col gap-4">
//                     {/* Email Input */}
//                     <div>
//                         <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                             Email
//                         </label>
//                         <input
//                             type="email"
//                             id="email"
//                             placeholder="Enter your email"
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                             // Add state management for email if you want to capture it here
//                         />
//                     </div>
//
//                     {/* Password Input */}
//                     <div>
//                         <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                             Password
//                         </label>
//                         <input
//                             type="password"
//                             id="password"
//                             placeholder="••••••••"
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                             // Add state management for password if you want to capture it here
//                         />
//                     </div>
//
//                     {/* Sign In Button */}
//                     <button
//                         onClick={onSignIn}
//                         className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6366F1] hover:bg-[#4F52C2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6366F1]"
//                     >
//                         Sign in
//                     </button>
//
//                     {/* Continue as guest Button */}
//                     <button
//                         onClick={onContinueAsGuest}
//                         className="w-full py-2 px-4 rounded-md shadow-sm font-inter font-medium text-sm cursor-pointer rounded-b-md border-2 border-[#27337C] hover:bg-indigo-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     >
//                         Continue as guest
//                     </button>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     );
// };
//
// export default LoginGuestModal;


"use client";
import React, {useState} from "react";
import {Dialog, DialogContent, IconButton, Box} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {useForm, SubmitHandler} from "react-hook-form";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";

interface LoginGuestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSignIn: () => void;
    onContinueAsGuest: () => void;
}

interface FormData {
    email: string;
    password: string;
}

const LoginGuestModal: React.FC<LoginGuestModalProps> = ({
                                                             isOpen,
                                                             onClose,
                                                             onSignIn,
                                                             onContinueAsGuest,
                                                         }) => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<FormData>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            console.log("login data: ", data);
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error);
            } else {
                reset();
                // Retrieve booking summary from localStorage
                const bookingSummary = localStorage.getItem("bookingSummaryToBill") || "{}";
                // Trigger onSignIn callback (optional, for consistency)
                onSignIn();
                // Navigate to billing-details page
                router.push(
                    `/billing-details?summary=${encodeURIComponent(bookingSummary)}`
                );
            }
        } catch (error) {
            console.error("Submission error:", error);
            setError("An unexpected error occurred");
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogContent sx={{position: "relative", padding: "24px"}}>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon/>
                </IconButton>
                <Box sx={{textAlign: "center", mb: 4}}>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#2D2A70] mt-4">
                        Let&#39;s Book Your Ticket
                    </h2>
                    <p className="text-sm text-gray-600 mt-2">
                        E-Ticket(s) transfer, exclusive deals, and other features are available
                        exclusively for registered users.
                    </p>
                </Box>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {/* Email Input */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                errors.email ? "border-red-500" : "border-gray-300"
                            }`}
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid email address",
                                },
                            })}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                errors.password ? "border-red-500" : "border-gray-300"
                            }`}
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters",
                                },
                            })}
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <p className="text-sm text-red-600 text-center">{error}</p>
                    )}

                    {/* Sign In Button */}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 border border-transparent cursor-pointer rounded-md shadow-sm text-sm duration-300 font-medium text-white bg-[#6366F1] hover:bg-[#4F52C2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6366F1]"
                    >
                        Sign in
                    </button>

                    {/* Continue as Guest Button */}
                    <button
                        onClick={onContinueAsGuest}
                        className="w-full py-2 px-4 rounded-md shadow-sm font-inter  rounded-b-md duration-300 focus:outline-none focus:ring-2 bg-white cursor-pointer font-inter font-medium text-xs sm:text-sm md:text-base text-[#27337C] border-2 border-[#27337C] sm:px-8 md:px-10 hover:bg-blue-50 transition-colors"
                    >
                        Continue as guest
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default LoginGuestModal;