// -------------------------- work 2025.08.05

// "use client";
//
// import React, {useEffect, useState} from "react";
// import {useForm, SubmitHandler} from "react-hook-form";
// import {zodResolver} from "@hookform/resolvers/zod";
// import {z} from "zod";
// import {useGetUserDetails} from "@/hooks/useUser";
// import {CircularProgress, Alert} from "@mui/material";
// import {useRouter} from "next/navigation";
// import {useCurrentUser} from "@/util/auth";
// import ReactCountryFlag from "react-country-flag";
// import Select, {StylesConfig} from "react-select";
// import {getData} from "country-list";
// import {useCheckoutApi} from "@/hooks/useBooking";
// import {AxiosError} from "axios";
// // import {useTimer} from "@/context/TimerContext";
//
// const billingSchema = z.object({
//     firstName: z
//         .string()
//         .min(2, "First name must be at least 2 characters")
//         .max(50, "First name must be less than 50 characters"),
//     lastName: z
//         .string()
//         .min(2, "Last name must be at least 2 characters")
//         .max(50, "Last name must be less than 50 characters"),
//     contactNumber: z
//         .string()
//         .regex(/^\+?[\d\s-]{10,}$/, "Contact number must be at least 10 digits"),
//     nicPassport: z
//         .string()
//         .min(5, "NIC/Passport must be at least 5 characters")
//         .max(20, "NIC/Passport must be less than 20 characters"),
//     email: z
//         .string()
//         .email("Invalid email address")
//         .regex(
//             /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//             "Email must have a valid domain (e.g., .com, .org)"
//         ),
//     address: z.string().min(2, "Please enter a valid address"),
//     city: z.string().min(2, "Please enter a valid city"),
//     country: z.string().min(2, "Please enter a valid country"),
//     privacyPolicy: z.literal(true, {
//         errorMap: () => ({message: "You must agree to the privacy policy"}),
//     }),
// });
//
// interface Country {
//     code: string;
//     name: string;
// }
//
// interface OptionType {
//     value: string;
//     label: string;
//     code: string;
// }
//
// interface ErrorResponse {
//     message?: string;
//     errors?: { fieldErrors?: Record<string, string[]> };
// }
//
// // interface CheckoutResponse {
// //     message: string;
// //     redirectUrl: string;
// //     params: Record<string, string>;
// //     order_id: number;
// // }
//
// interface CheckoutData {
//     email: string;
//     first_name: string;
//     last_name: string;
//     contact_number: string;
//     nic_passport: string;
//     country: string;
//     address: string;
//     city: string;
//     event_id?: string;
//     seat_ids: string[];
//     tickets_without_seats: { ticket_type_id: number; ticket_count: number }[];
//     user_id: string;
// }
//
//
// export type FormData = z.infer<typeof billingSchema>;
//
// interface BookingSummaryData {
//     rows: {
//         category: string;
//         price: string;
//         tickets: string;
//         amount: string;
//         ticketTypeId: number;
//         isBalcony: boolean;
//         enableManualSelection: boolean;
//     }[];
//     totalTickets: string;
//     totalAmount: string;
//     selectedSeatNumbers: string;
// }
//
// interface BillingDetailsProps {
//     summaryData: BookingSummaryData | null;
//     eventId?: string | null;
// }
//
// const countryOptions = getData()
//     .filter((country: Country) => country.name && typeof country.name === 'string')
//     .map((country: Country) => ({
//         value: country.code,
//         label: country.name,
//         code: country.code,
//     }))
//     .sort((a, b) => {
//         if (!a.label || !b.label) return 0;
//         return a.label.localeCompare(b.label);
//     });
//
// const BillingDetails: React.FC<BillingDetailsProps> = ({summaryData, eventId}) => {
//     const router = useRouter();
//     const user = useCurrentUser();
//     const [error, setError] = useState<string | null>(null);
//     const [isRedirecting, setIsRedirecting] = useState(false);
//     // const {stopTimer} = useTimer();
//
//
//     const checkoutMutation = useCheckoutApi();
//
//     const {
//         data: userData,
//         isPending: isUserDetailsPending,
//         isError: isUserDetailsError,
//         error: userDetailsError,
//     } = useGetUserDetails(user?.id);
//
//     const {
//         register,
//         handleSubmit,
//         watch,
//         setValue,
//         reset,
//         formState: {errors, isSubmitting},
//     } = useForm<FormData>({
//         resolver: zodResolver(billingSchema),
//         defaultValues: {
//             firstName: "",
//             lastName: "",
//             contactNumber: "",
//             nicPassport: "",
//             email: "",
//             address: "",
//             city: "",
//             country: "LK",
//             privacyPolicy: undefined,
//         },
//     });
//
//     const countryValue = watch("country");
//
//     console.log("--------user Data: ", userData);
//
//     useEffect(() => {
//         if (userData) {
//             reset({
//                 firstName: userData?.userDetails.first_name ?? "", // Fallback to empty string
//                 lastName: userData?.userDetails.last_name ?? "",
//                 contactNumber: userData?.userDetails.contact_number ?? "",
//                 nicPassport: userData?.userDetails.nic_passport ?? "",
//                 email: userData.email ?? "",
//                 address: userData?.userDetails.address_line1 ?? "",
//                 city: userData?.userDetails.city ?? "",
//                 country: userData?.userDetails.country ?? "LK",
//                 privacyPolicy: undefined, // Keep unchecked by default
//             });
//         }
//     }, [userData, reset]);
//
//     const onSubmit: SubmitHandler<FormData> = async (data) => {
//         try {
//
//             if (!summaryData) {
//                 setError("Booking summary data is missing. Please go back and select tickets.");
//                 return;
//             }
//
//             // const seatIds = summaryData.selectedSeatNumbers
//             //     ? summaryData.selectedSeatNumbers
//             //         .split(",")
//             //         .map((seat) => seat.trim())
//             //         .filter((seat) => seat.length > 0)
//             //     : [];
//             //
//             // const ticketsWithoutSeats = summaryData.rows
//             //     .filter((row) => parseInt(row.tickets) > 0)
//             //     .map((row) => ({
//             //         ticket_type_id: row.ticketTypeId,
//             //         ticket_count: parseInt(row.tickets),
//             //     }));
//
//             const seatIds = summaryData.selectedSeatNumbers
//                 ? summaryData.selectedSeatNumbers
//                     .split(",")
//                     .map((seat) => seat.trim())
//                     .filter((seat) => seat.length > 0)
//                 : [];
//
//             const ticketsWithoutSeats = summaryData.rows
//                 .filter((row) => {
//                     return parseInt(row.tickets) > 0 && row.enableManualSelection
//                 })
//                 .map((row) => ({
//                     ticket_type_id: row.ticketTypeId,
//                     ticket_count: parseInt(row.tickets),
//                 }));
//
//             if (seatIds.length === 0 && ticketsWithoutSeats.length === 0) {
//                 setError("No seats or tickets selected. Please go back and select tickets.");
//                 return;
//             }
//
//             const submissionData: CheckoutData = {
//                 email: data.email,
//                 first_name: data.firstName,
//                 last_name: data.lastName,
//                 contact_number: data.contactNumber,
//                 nic_passport: data.nicPassport,
//                 country: data.country || "SL",
//                 address: data.address,
//                 city: data.city,
//                 event_id: eventId?.toString(),
//                 // seat_ids: summaryData?.selectedSeatNumbers ? JSON.parse(summaryData.selectedSeatNumbers) : "",
//                 // tickets_without_seats: summaryData?.rows.map(row => ({
//                 //     ticket_type_id: row.ticketTypeId,
//                 //     ticket_count: parseInt(row.tickets),
//                 // })) || "",
//                 seat_ids: seatIds,
//                 tickets_without_seats: ticketsWithoutSeats,
//                 user_id: user?.id ?? "guest",
//             };
//
//             console.log("Billing Details Form Data: ", submissionData);
//
//             setIsRedirecting(true);
//
//             // await checkoutMutation.mutateAsync(submissionData, {
//             //     onSuccess: (response: CheckoutResponse) => {
//             //         const form = document.createElement("form");
//             //         form.method = "POST";
//             //         form.action = response.redirectUrl;
//             //
//             //         Object.entries(response.params).forEach(([key, value]) => {
//             //             const input = document.createElement("input");
//             //             input.type = "hidden";
//             //             input.name = key;
//             //             input.value = value;
//             //             form.appendChild(input);
//             //         });
//             //
//             //         document.body.appendChild(form);
//             //         form.submit();
//             //
//             //         // console.log("Seat checkout data sent successfully.");
//             //     },
//             //     onError: (error: AxiosError<ErrorResponse>) => {
//             //         setIsRedirecting(false);
//             //         const fieldErrors = error.response?.data?.errors?.fieldErrors;
//             //         if (fieldErrors) {
//             //             const errorMessages = Object.entries(fieldErrors)
//             //                 .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
//             //                 .join("; ");
//             //             setError(errorMessages || error.response?.data?.message || "Failed to submit booking");
//             //         } else {
//             //             setError(error.response?.data?.message || "Failed to submit booking");
//             //         }
//             //         console.error("Error creating user:", error);
//             //     },
//             // });
//
//             await checkoutMutation.mutateAsync(submissionData, {
//                 onSuccess: (checkoutResponse) => {
//                     // stopTimer();
//                     console.log("Seat checkout data sent successfully.");
//                     console.log("--------checkout response: ", checkoutResponse);
//
//                     // Handle redirection to payment gateway
//                     if (checkoutResponse.redirectUrl && checkoutResponse.params) {
//                         setIsRedirecting(true); // Set loading state for redirection
//                         const form = document.createElement("form");
//                         form.method = "POST";
//                         form.action = checkoutResponse.redirectUrl;
//                         form.style.display = "none"; // Hide the form
//
//                         for (const key in checkoutResponse.params) {
//                             if (Object.prototype.hasOwnProperty.call(checkoutResponse.params, key)) {
//                                 const input = document.createElement("input");
//                                 input.type = "hidden";
//                                 input.name = key;
//                                 input.value = checkoutResponse.params[key];
//                                 form.appendChild(input);
//                             }
//                         }
//
//                         document.body.appendChild(form);
//                         form.submit(); // Submit the form to redirect
//                     } else {
//                         setError("Payment gateway redirection information is missing.");
//                     }
//                 },
//                 onError: (error: AxiosError<ErrorResponse>) => {
//                     const fieldErrors = error.response?.data?.errors?.fieldErrors;
//                     if (fieldErrors) {
//                         const errorMessages = Object.entries(fieldErrors)
//                             .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
//                             .join("; ");
//                         setError(errorMessages || error.response?.data?.message || "Failed to submit booking");
//                     } else {
//                         setError(error.response?.data?.message || "Failed to submit booking");
//                     }
//                     console.error("Error creating user:", error);
//                 },
//             });
//
//             console.log("Billing Details Form Data: ", submissionData);
//
//         } catch (err) {
//             setIsRedirecting(false);
//             const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
//             setError(errorMessage);
//             console.error("Checkout submission error:", err);
//         }
//     };
//
//     const errorClass = "text-sm text-red-500 mt-1 font-inter";
//
//     if (user && isUserDetailsPending) {
//         return (
//             <div
//                 className="w-full lg:w-1/2 flex items-center justify-center border-4 border-[#EDF1F7] rounded-md px-8 py-12 min-h-[400px]">
//                 <CircularProgress size={40} sx={{color: "#27337C"}}/>
//                 <span className="ml-4 text-gray-600">Loading your details...</span>
//             </div>
//         );
//     }
//
//     if (user && isUserDetailsError) {
//         return (
//             <div
//                 className="w-full lg:w-1/2 flex flex-col justify-center items-center border-4 border-[#EDF1F7] rounded-md px-8 py-12 min-h-[400px]">
//                 <Alert severity="error" sx={{maxWidth: 500, mb: 2}}>
//                     <div className="text-lg font-semibold mb-2">Error Loading User Details</div>
//                     <div>{userDetailsError?.message || "Failed to load your profile. Please fill in the details manually."}</div>
//                 </Alert>
//             </div>
//         );
//     }
//
//     if (isRedirecting) {
//         return (
//             <div
//                 className="w-full lg:w-1/2 flex flex-col items-center justify-center border-4 border-[#EDF1F7] rounded-md px-8 py-12 min-h-[400px]">
//                 <h2 className="text-[26px] font-inter font-semibold text-[#27337C] mb-4">Initiating Payment...</h2>
//                 <p className="text-gray-600 mb-4">Please wait while we redirect you to the secure payment gateway.</p>
//                 <div
//                     style={{
//                         border: "4px solid #f3f3f3",
//                         borderTop: "4px solid #3498db",
//                         borderRadius: "50%",
//                         width: "30px",
//                         height: "30px",
//                         animation: "spin 1s linear infinite",
//                     }}
//                 />
//                 <style>
//                     {`
//                         @keyframes spin {
//                             0% { transform: rotate(0deg); }
//                             100% { transform: rotate(360deg); }
//                         }
//                     `}
//                 </style>
//                 <p className="text-gray-600 mt-4">
//                     If you are not redirected automatically, please check your browser&#39;s security settings.
//                 </p>
//             </div>
//         );
//     }
//
//     if (!eventId) {
//         return (
//             <div
//                 className="w-full lg:w-1/2 flex flex-col justify-center items-center border-4 border-[#EDF1F7] rounded-md px-8 py-12 min-h-[400px]">
//                 <Alert severity="error" sx={{maxWidth: 500, mb: 2}}>
//                     <div className="text-lg font-semibold mb-2">Error</div>
//                     <div>Event ID is missing. Please go back and try again.</div>
//                 </Alert>
//             </div>
//         );
//     }
//
//     const customStyles: StylesConfig<OptionType, false> = {
//         control: (provided) => ({
//             ...provided,
//             border: '3px solid #EDF1F7',
//             borderRadius: '0.375rem',
//             padding: '0.5rem',
//             boxShadow: 'none',
//             '&:hover': {
//                 borderColor: 'rgba(45, 49, 146, 0.5)',
//             },
//             '&:focus': {
//                 borderColor: '#2D3192',
//                 outline: 'none',
//             },
//         }),
//         menu: (provided) => ({
//             ...provided,
//             zIndex: 9999,
//         }),
//         option: (provided, state) => ({
//             ...provided,
//             display: 'flex',
//             alignItems: 'center',
//             padding: '0.5rem 1rem',
//             backgroundColor: state.isSelected ? '#2D3192' : state.isFocused ? '#EDF1F7' : 'white',
//             color: state.isSelected ? 'white' : '#222222',
//         }),
//     };
//
//     const renderBillingForm = () => (
//         <div
//             className="w-full lg:w-1/2 border-4 border-[#EDF1F7] rounded-md px-4 py-8 sm:px-8 sm:py-12"> {/* Adjusted padding for smaller screens */}
//             <h2 className="text-[26px] sm:text-[30px] font-inter font-semibold text-[#27337C] text-center mb-8 sm:mb-12">Billing
//                 Details</h2> {/* Adjusted font size and margin */}
//             <form onSubmit={handleSubmit(onSubmit)} noValidate
//                   className="space-y-4 max-w-[960px] justify-center mx-auto mt-8 sm:mt-12"> {/* Adjusted margin-top */}
//                 <div className="space-y-4">
//                     {error && (
//                         <Alert severity="error" onClose={() => setError(null)}>
//                             {error}
//                         </Alert>
//                     )}
//                     <div className="w-full">
//                         <label htmlFor="firstName" className="block text-base font-inter font-normal text-[#222222]">
//                             First Name
//                         </label>
//                         <div
//                             className="flex flex-row w-full px-2 items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
//                             <input
//                                 type="text"
//                                 id="firstName"
//                                 {...register("firstName")}
//                                 placeholder="Enter your first name"
//                                 className="w-full px-4 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
//                             />
//                         </div>
//                         {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
//                     </div>
//                     <div className="w-full">
//                         <label htmlFor="lastName" className="block text-base font-inter font-normal text-[#222222]">
//                             Last Name
//                         </label>
//                         <div
//                             className="flex flex-row w-full px-2 items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
//                             <input
//                                 type="text"
//                                 id="lastName"
//                                 {...register("lastName")}
//                                 placeholder="Enter your last name"
//                                 className="w-full px-4 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
//                             />
//                         </div>
//                         {errors.lastName && <p className={errorClass}>{errors.lastName.message}</p>}
//                     </div>
//                     <div className="w-full">
//                         <label htmlFor="nicPassport" className="block text-base font-inter font-normal text-[#222222]">
//                             NIC/Passport
//                         </label>
//                         <div
//                             className="flex flex-row w-full px-2 items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
//                             <input
//                                 type="text"
//                                 id="nicPassport"
//                                 {...register("nicPassport")}
//                                 placeholder="Enter your NIC/Passport"
//                                 className="w-full px-4 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
//                             />
//                         </div>
//                         {errors.nicPassport && <p className={errorClass}>{errors.nicPassport.message}</p>}
//                     </div>
//                     <div className="w-full">
//                         <label htmlFor="contactNumber"
//                                className="block text-base font-inter font-normal text-[#222222]">
//                             Contact Number
//                         </label>
//                         <div
//                             className="flex flex-row w-full px-2 items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
//                             <input
//                                 type="text"
//                                 id="contactNumber"
//                                 {...register("contactNumber")}
//                                 placeholder="Enter your contact number"
//                                 className="w-full px-4 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
//                             />
//                         </div>
//                         {errors.contactNumber && <p className={errorClass}>{errors.contactNumber.message}</p>}
//                     </div>
//                     <div className="w-full">
//                         <label htmlFor="email" className="block text-base font-inter font-normal text-[#222222]">
//                             Email
//                         </label>
//                         <div
//                             className="flex flex-row w-full px-2 items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
//                             <input
//                                 type="text"
//                                 id="email"
//                                 {...register("email")}
//                                 placeholder="Enter your email"
//                                 className="w-full px-4 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
//                             />
//                         </div>
//                         {errors.email && <p className={errorClass}>{errors.email.message}</p>}
//                     </div>
//                     <div className="w-full">
//                         <label htmlFor="address" className="block text-base font-inter font-normal text-[#222222]">
//                             Address
//                         </label>
//                         <div
//                             className="flex flex-row w-full px-2 items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
//                             <input
//                                 type="text"
//                                 id="address"
//                                 {...register("address")}
//                                 placeholder="Enter your address"
//                                 className="w-full px-4 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
//                             />
//                         </div>
//                         {errors.address && <p className={errorClass}>{errors.address.message}</p>}
//                     </div>
//                     <div className="w-full">
//                         <label htmlFor="city" className="block text-base font-inter font-normal text-[#222222]">
//                             City
//                         </label>
//                         <div
//                             className="flex flex-row w-full px-2 items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
//                             <input
//                                 type="text"
//                                 id="city"
//                                 {...register("city")}
//                                 placeholder="Enter your city"
//                                 className="w-full px-4 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
//                             />
//                         </div>
//                         {errors.city && <p className={errorClass}>{errors.city.message}</p>}
//                     </div>
//                     <div className="w-full">
//                         <label htmlFor="country" className="block text-base font-inter font-normal text-[#222222]">
//                             Country
//                         </label>
//                         {/*<div*/}
//                         {/*    className="flex flex-row w-full px-2 items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">*/}
//                         {/*    <input*/}
//                         {/*        type="text"*/}
//                         {/*        id="city"*/}
//                         {/*        {...register("city")}*/}
//                         {/*        placeholder="Select your country"*/}
//                         {/*        className="w-full px-4 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"*/}
//                         {/*    />*/}
//                         {/*</div>*/}
//
//                         <div className="mt-2">
//                             <Select
//                                 options={countryOptions}
//                                 value={countryOptions.find(option => option.value === countryValue) || null}
//                                 onChange={(selectedOption) => {
//                                     setValue("country", selectedOption ? selectedOption.value : "", {
//                                         shouldValidate: true,
//                                     });
//                                 }}
//                                 placeholder="Select your country"
//                                 formatOptionLabel={(option) => (
//                                     <div className="flex items-center">
//                                         <ReactCountryFlag
//                                             countryCode={option.code}
//                                             svg
//                                             style={{width: "20px", height: "15px", marginRight: "8px"}}
//                                         />
//                                         <span>{option.label}</span>
//                                     </div>
//                                 )}
//                                 styles={customStyles}
//                                 isClearable
//                                 isSearchable
//                             />
//                         </div>
//                         {errors.country && <p className={errorClass}>{errors.country.message}</p>}
//                     </div>
//
//                     <div className="flex items-center">
//                         <input
//                             type="checkbox"
//                             id="privacyPolicy"
//                             {...register("privacyPolicy")}
//                             className="mr-2"
//                         />
//                         <label htmlFor="privacyPolicy" className="text-base font-inter font-normal text-[#222222]">
//                             I agree to Ticket Privacy Policy
//                         </label>
//                     </div>
//                     {errors.privacyPolicy && <p className={errorClass}>{errors.privacyPolicy.message}</p>}
//
//                     <div
//                         className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0"> {/* Added gap for mobile, changed to column on small screens */}
//                         <button
//                             type="button"
//                             onClick={() => router.back()}
//                             className="w-full sm:w-auto px-10 py-2 sm:py-3 rounded-lg font-inter font-medium text-xs md:text-sm border border-[#2D2A70] bg-white text-[#27337C] hover:bg-gray-50 transition-colors"
//                         >
//                             Back
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={isSubmitting}
//                             className="w-full sm:w-auto px-10 py-2 sm:py-3 rounded-lg font-inter font-medium text-xs md:text-sm bg-[#27337C] text-white hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             {isSubmitting || isRedirecting ? "Confirming..." : "Confirm Booking"}
//                         </button>
//                     </div>
//                 </div>
//             </form>
//         </div>
//     );
//
//     return renderBillingForm();
// };
//
// export default BillingDetails;



//---------------- 2025.08.13 float timer countdown

"use client";

import React, {useEffect, useState, useCallback} from "react";
import {useForm, SubmitHandler} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useGetUserDetails} from "@/hooks/useUser";
import {CircularProgress, Alert, Typography, Box, Tooltip, Fab} from "@mui/material";
import {useRouter} from "next/navigation";
import {useCurrentUser} from "@/util/auth";
import ReactCountryFlag from "react-country-flag";
import Select, {StylesConfig} from "react-select";
import {getData} from "country-list";
import {useCheckoutApi, useUnseatSelectApi} from "@/hooks/useBooking";
import {AxiosError} from "axios";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import { resetBooking, selectSelectedSeats } from "@/store/bookingSlice";
import TimerModal from "@/components/TimerModal";

const billingSchema = z.object({
    firstName: z
        .string()
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name must be less than 50 characters"),
    lastName: z
        .string()
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name must be less than 50 characters"),
    contactNumber: z
        .string()
        .regex(/^\+?[\d\s-]{10,}$/, "Contact number must be at least 10 digits"),
    nicPassport: z
        .string()
        .min(5, "NIC/Passport must be at least 5 characters")
        .max(20, "NIC/Passport must be less than 20 characters"),
    email: z
        .string()
        .email("Invalid email address")
        .regex(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Email must have a valid domain (e.g., .com, .org)"
        ),
    address: z.string().min(2, "Please enter a valid address"),
    city: z.string().min(2, "Please enter a valid city"),
    country: z.string().min(2, "Please enter a valid country"),
    privacyPolicy: z.literal(true, {
        errorMap: () => ({message: "You must agree to the privacy policy"}),
    }),
});

interface Country {
    code: string;
    name: string;
}

interface OptionType {
    value: string;
    label: string;
    code: string;
}

interface ErrorResponse {
    message?: string;
    errors?: { fieldErrors?: Record<string, string[]> };
}

interface CheckoutData {
    email: string;
    first_name: string;
    last_name: string;
    contact_number: string;
    nic_passport: string;
    country: string;
    address: string;
    city: string;
    event_id?: string;
    seat_ids: string[];
    tickets_without_seats: { ticket_type_id: number; ticket_count: number }[];
    user_id: string;
}


export type FormData = z.infer<typeof billingSchema>;

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

interface BillingDetailsProps {
    summaryData: BookingSummaryData | null;
    eventId?: string | null;
}

const countryOptions = getData()
    .filter((country: Country) => country.name && typeof country.name === 'string')
    .map((country: Country) => ({
        value: country.code,
        label: country.name,
        code: country.code,
    }))
    .sort((a, b) => {
        if (!a.label || !b.label) return 0;
        return a.label.localeCompare(b.label);
    });

const BillingDetails: React.FC<BillingDetailsProps> = ({summaryData, eventId}) => {
    const router = useRouter();
    const user = useCurrentUser();
    const [error, setError] = useState<string | null>(null);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const dispatch = useDispatch();
    const selectedSeats = useSelector((state: RootState) => selectSelectedSeats(state));
    const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
    const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
    const [hasExtended, setHasExtended] = useState(false);
    const [isExpired, setIsExpired] = useState(false);
    const unselectSeatMutation = useUnseatSelectApi();


    const checkoutMutation = useCheckoutApi();

    const {
        data: userData,
        isPending: isUserDetailsPending,
        isError: isUserDetailsError,
        error: userDetailsError,
    } = useGetUserDetails(user?.id);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<FormData>({
        resolver: zodResolver(billingSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            contactNumber: "",
            nicPassport: "",
            email: "",
            address: "",
            city: "",
            country: "LK",
            privacyPolicy: undefined,
        },
    });

    const countryValue = watch("country");

    console.log("--------user Data: ", userData);

    // Initialize timer when summaryData is available
    useEffect(() => {
        if (summaryData && timerSeconds === null && !isExpired) {
            setTimerSeconds(60);
            setHasExtended(false);
            // setTimerSeconds(false);
        }
    }, [summaryData, timerSeconds, isExpired]);

    useEffect(() => {
        if (timerSeconds === null || isExpired) return;

        if (timerSeconds <= 0) {
            setIsExpired(true);

            const unselectPromises = selectedSeats.map((seat) =>
                unselectSeatMutation.mutateAsync({event_id: eventId || "", seat_id: seat.seatId}).catch((error) => {
                    console.error(`Failed to unselect seat ${seat.seatId} on expiration:`, error);
                    return Promise.resolve();
                })
            );

            Promise.all(unselectPromises)
                .then(() => {
                    dispatch(resetBooking());
                    localStorage.removeItem("tempBookingData");
                    localStorage.removeItem("bookingSummaryToBill");
                    setError("Your booking time has expired. Redirecting to home page...");
                    setTimeout(() => {
                        router.push("/");
                    }, 3000);
                })
                .catch((error) => {
                    console.error("Failed to unselect all seats on expiration:", error);
                    setError("Failed to reset booking. Redirecting to home page...");
                    setTimeout(() => {
                        router.push("/");
                    }, 3000);
                });
            return;
        }

        if (timerSeconds === 30 && !hasExtended) {
            setIsTimerModalOpen(true); // Show modal at 2 minutes
        }

        const interval = setInterval(() => {
            setTimerSeconds((prev) => (prev !== null ? prev - 1 : null));
        }, 1000);

        return () => clearInterval(interval);
    }, [timerSeconds, isExpired, hasExtended, selectedSeats, eventId, dispatch, router, unselectSeatMutation]);

    const handleExtendTimer = useCallback(() => {
        setTimerSeconds((prev) => (prev !== null ? prev + 300 : 300)); // Add 5 minutes
        setIsTimerModalOpen(false);
        setHasExtended(true);
    }, []);

    const handleContinueTimer = useCallback(() => {
        setIsTimerModalOpen(false);
    }, []);

    useEffect(() => {
        if (userData) {
            reset({
                firstName: userData?.userDetails.first_name ?? "", // Fallback to empty string
                lastName: userData?.userDetails.last_name ?? "",
                contactNumber: userData?.userDetails.contact_number ?? "",
                nicPassport: userData?.userDetails.nic_passport ?? "",
                email: userData.email ?? "",
                address: userData?.userDetails.address_line1 ?? "",
                city: userData?.userDetails.city ?? "",
                country: userData?.userDetails.country ?? "LK",
                privacyPolicy: undefined, // Keep unchecked by default
            });
        }
    }, [userData, reset]);

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {

            if (!summaryData) {
                setError("Booking summary data is missing. Please go back and select tickets.");
                return;
            }

            // const seatIds = summaryData.selectedSeatNumbers
            //     ? summaryData.selectedSeatNumbers
            //         .split(",")
            //         .map((seat) => seat.trim())
            //         .filter((seat) => seat.length > 0)
            //     : [];
            //
            // const ticketsWithoutSeats = summaryData.rows
            //     .filter((row) => parseInt(row.tickets) > 0)
            //     .map((row) => ({
            //         ticket_type_id: row.ticketTypeId,
            //         ticket_count: parseInt(row.tickets),
            //     }));

            const seatIds = summaryData.selectedSeatNumbers
                ? summaryData.selectedSeatNumbers
                    .split(",")
                    .map((seat) => seat.trim())
                    .filter((seat) => seat.length > 0)
                : [];

            const ticketsWithoutSeats = summaryData.rows
                .filter((row) => {
                    return parseInt(row.tickets) > 0 && row.enableManualSelection
                })
                .map((row) => ({
                    ticket_type_id: row.ticketTypeId,
                    ticket_count: parseInt(row.tickets),
                }));

            if (seatIds.length === 0 && ticketsWithoutSeats.length === 0) {
                setError("No seats or tickets selected. Please go back and select tickets.");
                return;
            }

            const submissionData: CheckoutData = {
                email: data.email,
                first_name: data.firstName,
                last_name: data.lastName,
                contact_number: data.contactNumber,
                nic_passport: data.nicPassport,
                country: data.country || "SL",
                address: data.address,
                city: data.city,
                event_id: eventId?.toString(),
                seat_ids: seatIds,
                tickets_without_seats: ticketsWithoutSeats,
                user_id: user?.id ?? "guest",
            };

            console.log("Billing Details Form Data: ", submissionData);

            setIsRedirecting(true);

            await checkoutMutation.mutateAsync(submissionData, {
                onSuccess: (checkoutResponse) => {
                    // stopTimer();
                    console.log("Seat checkout data sent successfully.");
                    console.log("--------checkout response: ", checkoutResponse);

                    // Handle redirection to payment gateway
                    if (checkoutResponse.redirectUrl && checkoutResponse.params) {
                        setIsRedirecting(true); // Set loading state for redirection
                        const form = document.createElement("form");
                        form.method = "POST";
                        form.action = checkoutResponse.redirectUrl;
                        form.style.display = "none"; // Hide the form

                        for (const key in checkoutResponse.params) {
                            if (Object.prototype.hasOwnProperty.call(checkoutResponse.params, key)) {
                                const input = document.createElement("input");
                                input.type = "hidden";
                                input.name = key;
                                input.value = checkoutResponse.params[key];
                                form.appendChild(input);
                            }
                        }

                        document.body.appendChild(form);
                        form.submit(); // Submit the form to redirect
                    } else {
                        setError("Payment gateway redirection information is missing.");
                    }
                },
                onError: (error: AxiosError<ErrorResponse>) => {
                    const fieldErrors = error.response?.data?.errors?.fieldErrors;
                    if (fieldErrors) {
                        const errorMessages = Object.entries(fieldErrors)
                            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
                            .join("; ");
                        setError(errorMessages || error.response?.data?.message || "Failed to submit booking");
                    } else {
                        setError(error.response?.data?.message || "Failed to submit booking");
                    }
                    console.error("Error creating user:", error);
                },
            });

            console.log("Billing Details Form Data: ", submissionData);

        } catch (err) {
            setIsRedirecting(false);
            const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
            setError(errorMessage);
            console.error("Checkout submission error:", err);
        }
    };

    const errorClass = "text-sm text-red-500 mt-1 font-inter";

    const formatTimerDisplay = (seconds: number | null) => {
        if (seconds === null) return "--:--";
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    if (user && isUserDetailsPending) {
        return (
            <div
                className="w-full lg:w-1/2 flex items-center justify-center border-4 border-[#EDF1F7] rounded-md px-8 py-12 min-h-[400px]">
                <CircularProgress size={40} sx={{color: "#27337C"}}/>
                <span className="ml-4 text-gray-600">Loading your details...</span>
            </div>
        );
    }

    if (user && isUserDetailsError) {
        return (
            <div
                className="w-full lg:w-1/2 flex flex-col justify-center items-center border-4 border-[#EDF1F7] rounded-md px-8 py-12 min-h-[400px]">
                <Alert severity="error" sx={{maxWidth: 500, mb: 2}}>
                    <div className="text-lg font-semibold mb-2">Error Loading User Details</div>
                    <div>{userDetailsError?.message || "Failed to load your profile. Please fill in the details manually."}</div>
                </Alert>
            </div>
        );
    }

    if (isRedirecting) {
        return (
            <div
                className="w-full lg:w-1/2 flex flex-col items-center justify-center border-4 border-[#EDF1F7] rounded-md px-8 py-12 min-h-[400px]">
                <h2 className="text-[26px] font-inter font-semibold text-[#27337C] mb-4">Initiating Payment...</h2>
                <p className="text-gray-600 mb-4">Please wait while we redirect you to the secure payment gateway.</p>
                <div
                    style={{
                        border: "4px solid #f3f3f3",
                        borderTop: "4px solid #3498db",
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        animation: "spin 1s linear infinite",
                    }}
                />
                <style>
                    {`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}
                </style>
                <p className="text-gray-600 mt-4">
                    If you are not redirected automatically, please check your browser&#39;s security settings.
                </p>
            </div>
        );
    }

    if (!eventId) {
        return (
            <div
                className="w-full lg:w-1/2 flex flex-col justify-center items-center border-4 border-[#EDF1F7] rounded-md px-8 py-12 min-h-[400px]">
                <Alert severity="error" sx={{maxWidth: 500, mb: 2}}>
                    <div className="text-lg font-semibold mb-2">Error</div>
                    <div>Event ID is missing. Please go back and try again.</div>
                </Alert>
            </div>
        );
    }

    const customStyles: StylesConfig<OptionType, false> = {
        control: (provided) => ({
            ...provided,
            border: '3px solid #EDF1F7',
            borderRadius: '0.375rem',
            padding: '0.5rem',
            boxShadow: 'none',
            '&:hover': {
                borderColor: 'rgba(45, 49, 146, 0.5)',
            },
            '&:focus': {
                borderColor: '#2D3192',
                outline: 'none',
            },
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 9999,
        }),
        option: (provided, state) => ({
            ...provided,
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem 1rem',
            backgroundColor: state.isSelected ? '#2D3192' : state.isFocused ? '#EDF1F7' : 'white',
            color: state.isSelected ? 'white' : '#222222',
        }),
    };

    const renderBillingForm = () => (
        <div
            className="w-full lg:w-1/2 border-4 border-[#EDF1F7] rounded-md px-4 py-8 sm:px-8 sm:py-12"> {/* Adjusted padding for smaller screens */}
            <h2 className="text-[26px] sm:text-[30px] font-inter font-semibold text-[#27337C] text-center mb-8 sm:mb-12">Billing
                Details</h2> {/* Adjusted font size and margin */}

            {/*<Box sx={{display: "flex", justifyContent: "center", mb: 4}}>*/}
            {/*    {timerSeconds !== null && (*/}
            {/*        <Tooltip*/}
            {/*            title="Time remaining to complete your booking"*/}
            {/*            placement="top"*/}
            {/*        >*/}
            {/*            <Box*/}
            {/*                sx={{*/}
            {/*                    position: "relative",*/}
            {/*                    width: {xs: 60, sm: 80},*/}
            {/*                    height: {xs: 60, sm: 80},*/}
            {/*                    display: "flex",*/}
            {/*                    alignItems: "center",*/}
            {/*                    justifyContent: "center",*/}
            {/*                    animation:*/}
            {/*                        timerSeconds <= 120*/}
            {/*                            ? "pulse 1.5s infinite"*/}
            {/*                            : "none",*/}
            {/*                    "@keyframes pulse": {*/}
            {/*                        "0%": {transform: "scale(1)"},*/}
            {/*                        "50%": {transform: "scale(1.1)"},*/}
            {/*                        "100%": {transform: "scale(1)"},*/}
            {/*                    },*/}
            {/*                }}*/}
            {/*            >*/}
            {/*                <CircularProgress*/}
            {/*                    variant="determinate"*/}
            {/*                    value={(timerSeconds / 60) * 100}*/}
            {/*                    size={80}*/}
            {/*                    thickness={4}*/}
            {/*                    sx={{*/}
            {/*                        color: timerSeconds <= 120 ? "#d32f2f" : "#27337C",*/}
            {/*                        position: "absolute",*/}
            {/*                        top: 0,*/}
            {/*                        left: 0,*/}
            {/*                    }}*/}
            {/*                />*/}
            {/*                <Typography*/}
            {/*                    sx={{*/}
            {/*                        color: timerSeconds <= 120 ? "#d32f2f" : "#27337C",*/}
            {/*                        fontWeight: "bold",*/}
            {/*                        fontSize: {xs: "0.9rem", sm: "1.1rem"},*/}
            {/*                    }}*/}
            {/*                >*/}
            {/*                    {formatTimerDisplay(timerSeconds)}*/}
            {/*                </Typography>*/}
            {/*            </Box>*/}
            {/*        </Tooltip>*/}
            {/*    )}*/}
            {/*</Box>*/}

            {timerSeconds !== null && (
                <Tooltip title="Time remaining to complete your booking" placement="top">
                    <Fab
                        sx={{
                            position: "fixed",
                            bottom: { xs: 16, sm: 24 },
                            right: { xs: 16, sm: 24 },
                            width: { xs: 60, sm: 80 },
                            height: { xs: 60, sm: 80 },
                        }}
                    >
                        <Box
                            sx={{
                                position: "relative",
                                width: {xs: 60, sm: 80},
                                height: {xs: 60, sm: 80},
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                animation:
                                    timerSeconds <= 120
                                        ? "pulse 1.5s infinite"
                                        : "none",
                                "@keyframes pulse": {
                                    "0%": {transform: "scale(1)"},
                                    "50%": {transform: "scale(1.1)"},
                                    "100%": {transform: "scale(1)"},
                                },
                            }}
                        >
                            <CircularProgress
                                variant="determinate"
                                value={(timerSeconds / 60) * 100}
                                size={80}
                                thickness={4}
                                sx={{
                                    color: timerSeconds <= 120 ? "#d32f2f" : "#27337C",
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                }}
                            />
                            <Typography
                                sx={{
                                    color: timerSeconds <= 120 ? "#d32f2f" : "#27337C",
                                    fontWeight: "bold",
                                    fontSize: {xs: "0.9rem", sm: "1.1rem"},
                                }}
                            >
                                {formatTimerDisplay(timerSeconds)}
                            </Typography>
                        </Box>
                    </Fab>
                </Tooltip>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate
                  className="space-y-4 max-w-[960px] justify-center mx-auto mt-8 sm:mt-12"> {/* Adjusted margin-top */}
                <div className="space-y-4">
                    {error && (
                        <Alert severity="error" onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}
                    <div className="w-full">
                        <label htmlFor="firstName" className="block text-base font-inter font-normal text-[#222222]">
                            First Name
                        </label>
                        <div
                            className="flex flex-row w-full px-2 items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
                            <input
                                type="text"
                                id="firstName"
                                {...register("firstName")}
                                placeholder="Enter your first name"
                                className="w-full px-4 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
                            />
                        </div>
                        {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
                    </div>
                    <div className="w-full">
                        <label htmlFor="lastName" className="block text-base font-inter font-normal text-[#222222]">
                            Last Name
                        </label>
                        <div
                            className="flex flex-row w-full px-2 items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
                            <input
                                type="text"
                                id="lastName"
                                {...register("lastName")}
                                placeholder="Enter your last name"
                                className="w-full px-4 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
                            />
                        </div>
                        {errors.lastName && <p className={errorClass}>{errors.lastName.message}</p>}
                    </div>
                    <div className="w-full">
                        <label htmlFor="nicPassport" className="block text-base font-inter font-normal text-[#222222]">
                            NIC/Passport
                        </label>
                        <div
                            className="flex flex-row w-full px-2 items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
                            <input
                                type="text"
                                id="nicPassport"
                                {...register("nicPassport")}
                                placeholder="Enter your NIC/Passport"
                                className="w-full px-4 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
                            />
                        </div>
                        {errors.nicPassport && <p className={errorClass}>{errors.nicPassport.message}</p>}
                    </div>
                    <div className="w-full">
                        <label htmlFor="contactNumber"
                               className="block text-base font-inter font-normal text-[#222222]">
                            Contact Number
                        </label>
                        <div
                            className="flex flex-row w-full px-2 items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
                            <input
                                type="text"
                                id="contactNumber"
                                {...register("contactNumber")}
                                placeholder="Enter your contact number"
                                className="w-full px-4 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
                            />
                        </div>
                        {errors.contactNumber && <p className={errorClass}>{errors.contactNumber.message}</p>}
                    </div>
                    <div className="w-full">
                        <label htmlFor="email" className="block text-base font-inter font-normal text-[#222222]">
                            Email
                        </label>
                        <div
                            className="flex flex-row w-full px-2 items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
                            <input
                                type="text"
                                id="email"
                                {...register("email")}
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
                            />
                        </div>
                        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                    </div>
                    <div className="w-full">
                        <label htmlFor="address" className="block text-base font-inter font-normal text-[#222222]">
                            Address
                        </label>
                        <div
                            className="flex flex-row w-full px-2 items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
                            <input
                                type="text"
                                id="address"
                                {...register("address")}
                                placeholder="Enter your address"
                                className="w-full px-4 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
                            />
                        </div>
                        {errors.address && <p className={errorClass}>{errors.address.message}</p>}
                    </div>
                    <div className="w-full">
                        <label htmlFor="city" className="block text-base font-inter font-normal text-[#222222]">
                            City
                        </label>
                        <div
                            className="flex flex-row w-full px-2 items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
                            <input
                                type="text"
                                id="city"
                                {...register("city")}
                                placeholder="Enter your city"
                                className="w-full px-4 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
                            />
                        </div>
                        {errors.city && <p className={errorClass}>{errors.city.message}</p>}
                    </div>
                    <div className="w-full">
                        <label htmlFor="country" className="block text-base font-inter font-normal text-[#222222]">
                            Country
                        </label>
                        {/*<div*/}
                        {/*    className="flex flex-row w-full px-2 items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">*/}
                        {/*    <input*/}
                        {/*        type="text"*/}
                        {/*        id="city"*/}
                        {/*        {...register("city")}*/}
                        {/*        placeholder="Select your country"*/}
                        {/*        className="w-full px-4 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"*/}
                        {/*    />*/}
                        {/*</div>*/}

                        <div className="mt-2">
                            <Select
                                options={countryOptions}
                                value={countryOptions.find(option => option.value === countryValue) || null}
                                onChange={(selectedOption) => {
                                    setValue("country", selectedOption ? selectedOption.value : "", {
                                        shouldValidate: true,
                                    });
                                }}
                                placeholder="Select your country"
                                formatOptionLabel={(option) => (
                                    <div className="flex items-center">
                                        <ReactCountryFlag
                                            countryCode={option.code}
                                            svg
                                            style={{width: "20px", height: "15px", marginRight: "8px"}}
                                        />
                                        <span>{option.label}</span>
                                    </div>
                                )}
                                styles={customStyles}
                                isClearable
                                isSearchable
                            />
                        </div>
                        {errors.country && <p className={errorClass}>{errors.country.message}</p>}
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="privacyPolicy"
                            {...register("privacyPolicy")}
                            className="mr-2"
                        />
                        <label htmlFor="privacyPolicy" className="text-base font-inter font-normal text-[#222222]">
                            I agree to Ticket Privacy Policy
                        </label>
                    </div>
                    {errors.privacyPolicy && <p className={errorClass}>{errors.privacyPolicy.message}</p>}

                    <div
                        className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0"> {/* Added gap for mobile, changed to column on small screens */}
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="w-full sm:w-auto px-10 py-2 sm:py-3 rounded-lg font-inter font-medium text-xs md:text-sm border border-[#2D2A70] bg-white text-[#27337C] hover:bg-gray-50 transition-colors"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-auto px-10 py-2 sm:py-3 rounded-lg font-inter font-medium text-xs md:text-sm bg-[#27337C] text-white hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting || isRedirecting ? "Confirming..." : "Confirm Booking"}
                        </button>
                    </div>
                </div>
            </form>
            <TimerModal
                open={isTimerModalOpen}
                onExtend={handleExtendTimer}
                onContinue={handleContinueTimer}
            />
        </div>
    );

    return renderBillingForm();
};

export default BillingDetails;