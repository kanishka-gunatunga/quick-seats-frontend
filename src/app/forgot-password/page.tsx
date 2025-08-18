// "use client";
//
// import HeroSection from "@/components/HeroSection";
// import SectionTitle from "@/components/SectionTitle";
// import React, {useState} from "react";
// import {useForm} from "react-hook-form";
// import {z} from "zod";
// import {zodResolver} from "@hookform/resolvers/zod";
// import {useForgotPassword, useValidateOtp, useResetPassword} from "@/hooks/useUser";
// import {useRouter} from 'next/navigation';
// import Link from "next/link"; // For the back to login link
//
// interface HeroProps {
//     image: string;
//     title: string;
//     subTitle: string;
// }
//
// // Zod schemas for each step of the form
// const emailSchema = z.object({
//     email: z.string().email("Invalid email address"),
// });
//
// const otpSchema = z.object({
//     email: z.string().email("Invalid email address"),
//     otp: z.string().length(4, "OTP must be 4 digits").regex(/^\d+$/, "OTP must be numbers only"),
// });
//
// const resetPasswordSchema = z
//     .object({
//         email: z.string().email("Invalid email address"), // Email needed for Reset Password API
//         otp: z.string().length(4, "OTP must be 4 digits").regex(/^\d+$/, "OTP must be numbers only"),
//         password: z
//             .string()
//             .min(8, "Password must be at least 8 characters")
//             .regex(/[a-z]/, "Password must contain at least one lowercase letter")
//             .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
//             .regex(/[0-9]/, "Password must contain at least one number")
//             .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
//         confirm_password: z.string(),
//     })
//     .refine((data) => data.password === data.confirm_password, {
//         message: "Passwords don't match",
//         path: ["confirm_password"], // Path of error
//     });
//
// // Types inferred from Zod schemas
// type EmailFormData = z.infer<typeof emailSchema>;
// type OtpFormData = z.infer<typeof otpSchema>;
// type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
//
// const ForgotPasswordPage = () => {
//     const router = useRouter();
//     const [currentStep, setCurrentStep] = useState(2);
//     const [emailForReset, setEmailForReset] = useState('');
//     const [otpForReset, setOtpForReset] = useState('');
//     const [serverError, setServerError] = useState<string | null>(null);
//     const [showPassword, setShowPassword] = useState<boolean>(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
//
//
//     const hero: HeroProps = {
//         image: "/register-hero.png",
//         title: "Forgot Password",
//         subTitle: "Reset your password in a few simple steps",
//     };
//
//     const {
//         register: registerEmail,
//         handleSubmit: handleSubmitEmail,
//         reset: resetEmailForm,
//         formState: {errors: emailErrors, isSubmitting: isEmailSubmitting},
//     } = useForm<EmailFormData>({
//         resolver: zodResolver(emailSchema),
//         defaultValues: {email: ''},
//     });
//
//     const {mutate: sendForgotPasswordEmail, isPending: isSendingEmail} = useForgotPassword();
//
//     const onSubmitEmail = async (data: EmailFormData) => {
//         setServerError(null);
//         try {
//             await sendForgotPasswordEmail(
//                 {email: data.email},
//                 {
//                     onSuccess: () => {
//                         setEmailForReset(data.email);
//                         setCurrentStep(2);
//                         resetEmailForm();
//                     },
//                     onError: (error) => {
//                         setServerError(error.message);
//                     },
//                 }
//             );
//         } catch (error) {
//             console.error('Email submission error:', error);
//             setServerError('An unexpected error occurred.');
//         }
//     };
//
//     const {
//         register: registerOtp,
//         handleSubmit: handleSubmitOtp,
//         reset: resetOtpForm,
//         formState: {errors: otpErrors, isSubmitting: isOtpSubmitting},
//     } = useForm<OtpFormData>({
//         resolver: zodResolver(otpSchema),
//         defaultValues: {email: emailForReset, otp: ''},
//     });
//
//     const {mutate: validateOtpCode, isPending: isValidatingOtp} = useValidateOtp();
//
//     const onSubmitOtp = async (data: OtpFormData) => {
//         setServerError(null);
//         try {
//             await validateOtpCode(
//                 {email: data.email, otp: data.otp},
//                 {
//                     onSuccess: () => {
//                         setOtpForReset(data.otp);
//                         setCurrentStep(3);
//                         resetOtpForm();
//                     },
//                     onError: (error) => {
//                         setServerError(error.message);
//                     },
//                 }
//             );
//         } catch (error) {
//             console.error('OTP validation error:', error);
//             setServerError('An unexpected error occurred.');
//         }
//     };
//
//     const {
//         register: registerResetPassword,
//         handleSubmit: handleSubmitResetPassword,
//         reset: resetPasswordForm,
//         formState: {errors: resetPasswordErrors, isSubmitting: isResettingPassword},
//     } = useForm<ResetPasswordFormData>({
//         resolver: zodResolver(resetPasswordSchema),
//         defaultValues: {
//             email: emailForReset,
//             otp: otpForReset,
//             password: '',
//             confirm_password: '',
//         },
//     });
//
//     const {mutate: performPasswordReset, isPending: isPerformingReset} = useResetPassword();
//
//     const onSubmitResetPassword = async (data: ResetPasswordFormData) => {
//         setServerError(null);
//         try {
//             await performPasswordReset(
//                 {
//                     email: data.email,
//                     otp: data.otp,
//                     password: data.password,
//                     confirm_password: data.confirm_password,
//                 },
//                 {
//                     onSuccess: () => {
//                         alert('Password reset successfully! You can now log in with your new password.');
//                         router.push('/login');
//                         resetPasswordForm();
//                     },
//                     onError: (error) => {
//                         setServerError(error.message);
//                     },
//                 }
//             );
//         } catch (error) {
//             console.error('Password reset error:', error);
//             setServerError('An unexpected error occurred.');
//         }
//     };
//
//     const errorClass = "text-sm text-red-500 mt-1 font-inter";
//
//     const renderFormByStep = () => {
//         switch (currentStep) {
//             case 1:
//                 return (
//                     <div>
//                         <SectionTitle title="Enter Your Email"/>
//                         <form onSubmit={handleSubmitEmail(onSubmitEmail)} noValidate
//                               className="space-y-4 max-w-[406px] justify-center mx-auto mt-12">
//                             {serverError && <p className={errorClass}>{serverError}</p>}
//                             {/* Email Input */}
//                             <p className="text-center text-sm text-gray-600">
//                                 Enter your email and we&#39;ll send you a otp to reset your password.
//                             </p>
//                             <div className="w-full">
//                                 <label htmlFor="email"
//                                        className="block text-base font-inter font-normal text-[#222222]">
//                                     Email
//                                 </label>
//                                 <div
//                                     className="flex flex-row w-full px-2 items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
//                                 <span className="left-0 flex items-center pl-3 text-gray-500">
//                                     <svg width="18" height="14" viewBox="0 0 18 14" fill="none"
//                                          xmlns="http://www.w3.org/2000/svg">
//                                         <path fillRule="evenodd" clipRule="evenodd"
//                                               d="M0.041687 0.75C0.041687 0.404822 0.321509 0.125 0.666687 0.125H17.3334C17.6785 0.125 17.9584 0.404822 17.9584 0.75V13.25C17.9584 13.5952 17.6785 13.875 17.3334 13.875H0.666687C0.321509 13.875 0.041687 13.5952 0.041687 13.25V0.75ZM1.29169 1.375V12.625H16.7084V1.375H1.29169Z"
//                                               fill="#242B35"/>
//                                         <path fillRule="evenodd" clipRule="evenodd"
//                                               d="M0.166724 0.375037C0.373831 0.0988944 0.765581 0.04293 1.04172 0.250037L9.00006 6.21879L16.9584 0.250037C17.2345 0.04293 17.6263 0.0988944 17.8334 0.375037C18.0405 0.651179 17.9845 1.04293 17.7084 1.25004L9.37506 7.50004C9.15283 7.6667 8.84728 7.6667 8.62506 7.50004L0.291724 1.25004C0.0155814 1.04293 -0.040383 0.651179 0.166724 0.375037Z"
//                                               fill="#242B35"/>
//                                         <path fillRule="evenodd" clipRule="evenodd"
//                                               d="M0.041687 0.75C0.041687 0.404822 0.321509 0.125 0.666687 0.125H9.00002C9.3452 0.125 9.62502 0.404822 9.62502 0.75C9.62502 1.09518 9.3452 1.375 9.00002 1.375H1.29169V7C1.29169 7.34518 1.01187 7.625 0.666687 7.625C0.321509 7.625 0.041687 7.34518 0.041687 7V0.75Z"
//                                               fill="#242B35"/>
//                                         <path fillRule="evenodd" clipRule="evenodd"
//                                               d="M8.37502 0.75C8.37502 0.404822 8.65484 0.125 9.00002 0.125H17.3334C17.6785 0.125 17.9584 0.404822 17.9584 0.75V7C17.9584 7.34518 17.6785 7.625 17.3334 7.625C16.9882 7.625 16.7084 7.34518 16.7084 7V1.375H9.00002C8.65484 1.375 8.37502 1.09518 8.37502 0.75Z"
//                                               fill="#242B35"/>
//                                     </svg>
//                                 </span>
//                                     <input
//                                         type="email"
//                                         id="email"
//                                         {...registerEmail("email")}
//                                         placeholder="Enter your email address"
//                                         className="w-full px-4 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
//                                     />
//                                 </div>
//                                 {emailErrors.email && (
//                                     <p className={errorClass}>{emailErrors.email.message}</p>
//                                 )}
//                             </div>
//                             <button
//                                 type="submit"
//                                 disabled={isSendingEmail || isEmailSubmitting}
//                                 className="w-full cursor-pointer px-4 py-5 mt-4 text-white font-inter text-sm font-normal bg-[#2D3192] rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
//                             >
//                                 {isSendingEmail ? 'Sending...' : 'Send OTP'}
//                             </button>
//                             <p className="mt-3 text-center text-base text-[#6A6A6A] font-inter">
//                                 Remember your password?{' '}
//                                 <Link href="/login" className="text-[#222222] font-medium hover:text-indigo-500">
//                                     Sign In
//                                 </Link>
//                             </p>
//                         </form>
//                     </div>
//                 );
//
//             case 2:
//                 return (
//                     <div>
//                         <SectionTitle title="Enter OTP"/>
//                         <form onSubmit={handleSubmitOtp(onSubmitOtp)} noValidate
//                               className="space-y-4 max-w-[406px] justify-center mx-auto mt-12">
//
//                             {serverError && <p className={errorClass}>{serverError}</p>}
//                             <p className="text-center text-sm text-gray-600">
//                                 An OTP has been sent to **{emailForReset}**.
//                             </p>
//                             {/* Email (hidden but included for API payload) */}
//                             <input type="hidden" {...registerOtp("email")} value={emailForReset}/>
//
//                             {/* OTP Input */}
//                             <div className="w-full">
//                                 <label htmlFor="otp"
//                                        className="block text-base font-inter font-normal text-[#222222]">
//                                     OTP Code
//                                 </label>
//                                 <div
//                                     className="flex flex-row w-full px-2 items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
//                                 <span className="left-0 flex items-center pl-3 text-gray-500">
//                                     {/* OTP Icon - you can use a lock or key icon */}
//                                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path
//                                         fill="currentColor"
//                                         d="M12 17a2 2 0 0 0 2-2a2 2 0 0 0-2-2a2 2 0 0 0-2 2a2 2 0 0 0 2 2m6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2m-6-5c1.66 0 3 1.34 3 3v2H9V6c0-1.66 1.34-3 3-3m7 15H5V10h14Z"/></svg>
//                                 </span>
//                                     <input
//                                         type="text"
//                                         id="otp"
//                                         {...registerOtp("otp")}
//                                         placeholder="Enter 4-digit OTP"
//                                         className="w-full px-4 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
//                                     />
//                                 </div>
//                                 {otpErrors.otp && (
//                                     <p className={errorClass}>{otpErrors.otp.message}</p>
//                                 )}
//                             </div>
//                             <button
//                                 type="submit"
//                                 disabled={isValidatingOtp || isOtpSubmitting}
//                                 className="w-full cursor-pointer px-4 py-5 mt-4 text-white font-inter text-sm font-normal bg-[#2D3192] rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
//                             >
//                                 {isValidatingOtp ? 'Verifying...' : 'Verify OTP'}
//                             </button>
//                             <p className="mt-3 text-center text-base text-[#6A6A6A] font-inter">
//                                 Wrong email?{' '}
//                                 <button
//                                     type="button"
//                                     onClick={() => {
//                                         setCurrentStep(1);
//                                         setServerError(null);
//                                         resetOtpForm();
//                                     }}
//                                     className="text-[#222222] font-medium hover:text-indigo-500"
//                                 >
//                                     Go back
//                                 </button>
//                             </p>
//                         </form>
//                     </div>
//                 );
//
//             case 3:
//                 return (
//                     <div>
//                         <SectionTitle title="Set New Password"/>
//                         <form onSubmit={handleSubmitResetPassword(onSubmitResetPassword)} noValidate
//                               className="space-y-4 max-w-[406px] justify-center mx-auto mt-12">
//
//                             {serverError && <p className={errorClass}>{serverError}</p>}
//
//                             {/* Hidden fields for email and OTP */}
//                             <input type="hidden" {...registerResetPassword("email")} value={emailForReset}/>
//                             <input type="hidden" {...registerResetPassword("otp")} value={otpForReset}/>
//
//                             {/* New Password Input */}
//                             <div className="w-full">
//                                 <label htmlFor="newPassword"
//                                        className="block text-base font-inter font-normal text-[#222222]">
//                                     New Password
//                                 </label>
//                                 <div
//                                     className="flex flex-row w-full px-2 justify-between items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
//                                     <div className="flex flex-row">
//                                     <span className="left-0 flex items-center pl-3 text-gray-500">
//                                         <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
//                                              xmlns="http://www.w3.org/2000/svg">
//                                             <path
//                                                 d="M2.33333 8.79163C2.21827 8.79163 2.125 8.8849 2.125 8.99996V16.5C2.125 16.615 2.21827 16.7083 2.33333 16.7083H15.6667C15.7817 16.7083 15.875 16.615 15.875 16.5V8.99996C15.875 8.8849 15.7817 8.79163 15.6667 8.79163H2.33333ZM0.875 8.99996C0.875 8.19454 1.52792 7.54163 2.33333 7.54163H15.6667C16.4721 7.54163 17.125 8.19454 17.125 8.99996V16.5C17.125 17.3054 16.4721 17.9583 15.6667 17.9583H2.33333C1.52792 17.9583 0.875 17.3054 0.875 16.5V8.99996Z"
//                                                 fill="#242B35"/>
//                                             <path
//                                                 d="M9 1.29163C7.04401 1.29163 5.45833 2.87729 5.45833 4.83329V8.16663C5.45833 8.5118 5.17851 8.79163 4.83333 8.79163C4.48816 8.79163 4.20833 8.5118 4.20833 8.16663V4.83329C4.20833 2.18693 6.35366 0.041626 9 0.041626C11.6463 0.041626 13.7917 2.18693 13.7917 4.83329V8.16663C13.7917 8.5118 13.5118 8.79163 13.1667 8.79163C12.8215 8.79163 12.5417 8.5118 12.5417 8.16663V4.83329C12.5417 2.87729 10.956 1.29163 9 1.29163Z"
//                                                 fill="#242B35"/>
//                                             <path
//                                                 d="M9 10.875C9.34518 10.875 9.625 11.1548 9.625 11.5V14C9.625 14.3451 9.34518 14.625 9 14.625C8.65482 14.625 8.375 14.3451 8.375 14V11.5C8.375 11.1548 8.65482 10.875 9 10.875Z"
//                                                 fill="#242B35"/>
//                                         </svg>
//                                     </span>
//                                         <input
//                                             type={showPassword ? 'text' : 'password'}
//                                             id="newPassword"
//                                             {...registerResetPassword("password")}
//                                             placeholder="Enter new password"
//                                             className="w-full px-4 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
//                                         />
//                                     </div>
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowPassword(!showPassword)}
//                                         className="mr-3 flex items-center text-gray-500 hover:text-gray-700"
//                                     >
//                                         {
//                                             showPassword ?
//                                                 <svg width="22" height="20" viewBox="0 0 22 20" fill="none"
//                                                      xmlns="http://www.w3.org/2000/svg">
//                                                     <path
//                                                         d="M11 4.75C10.3878 4.75 9.78515 4.8318 9.19659 4.97791C8.79458 5.0777 8.38778 4.83271 8.28798 4.4307C8.18819 4.02869 8.43318 3.62189 8.83519 3.52209C9.52923 3.3498 10.2535 3.25 11 3.25C14.0225 3.25 16.6917 4.88254 18.5497 6.42257C19.4893 7.20141 20.2478 7.97852 20.7717 8.5609C21.0341 8.85257 21.2388 9.09667 21.3791 9.26944C21.4492 9.35586 21.5034 9.42453 21.5406 9.4725C21.5593 9.49648 21.5737 9.5153 21.5838 9.52858L21.5957 9.54431L21.5992 9.54898L21.6004 9.5505C21.6004 9.5505 21.6011 9.55147 21 10C21.6011 10.4485 21.6009 10.4487 21.6009 10.4487L21.5992 10.451L21.5957 10.4557L21.5838 10.4714C21.5737 10.4847 21.5593 10.5035 21.5406 10.5275C21.5034 10.5755 21.4492 10.6441 21.3791 10.7306C21.2388 10.9033 21.0341 11.1474 20.7717 11.4391C20.2478 12.0215 19.4893 12.7986 18.5497 13.5774C18.2308 13.8418 17.758 13.7975 17.4936 13.4786C17.2293 13.1597 17.2735 12.6869 17.5924 12.4226C18.4625 11.7014 19.1684 10.9785 19.6566 10.4359C19.804 10.272 19.9312 10.125 20.0366 10C19.9312 9.87503 19.804 9.72803 19.6566 9.5641C19.1684 9.02148 18.4625 8.29859 17.5924 7.57743C15.8311 6.11746 13.5003 4.75 11 4.75ZM21 10L21.6009 10.4487C21.7995 10.1827 21.7996 9.81753 21.6011 9.55147L21 10ZM3.4503 6.42258C3.74433 6.17885 4.17455 6.195 4.44949 6.46009L13.5206 15.2061C13.7168 15.3954 13.7949 15.6762 13.7246 15.9396C13.6542 16.203 13.4465 16.4075 13.182 16.4736C12.4827 16.6486 11.7526 16.75 11 16.75C7.97746 16.75 5.30824 15.1175 3.4503 13.5774C2.51069 12.7986 1.75217 12.0215 1.22826 11.4391C0.96587 11.1474 0.761186 10.9033 0.620909 10.7306C0.550743 10.6441 0.496609 10.5755 0.459345 10.5275C0.440711 10.5035 0.426287 10.4847 0.416179 10.4714L0.404263 10.4557L0.400755 10.451L0.399618 10.4495C0.399618 10.4495 0.398893 10.4485 0.99999 10C0.398893 9.55147 0.399036 9.55128 0.399036 9.55128L0.400755 9.54898L0.404263 9.54431L0.416179 9.52858C0.426287 9.5153 0.440711 9.49648 0.459346 9.47249C0.49661 9.42453 0.550744 9.35586 0.62091 9.26944C0.761187 9.09667 0.96587 8.85257 1.22826 8.5609C1.75217 7.97852 2.51069 7.20141 3.4503 6.42258ZM0.99999 10L0.399036 9.55128C0.200498 9.81734 0.200355 10.1825 0.398893 10.4485L0.99999 10ZM1.96339 10C2.06878 10.125 2.19595 10.272 2.34342 10.4359C2.83157 10.9785 3.53751 11.7014 4.40754 12.4226C6.16889 13.8825 8.49966 15.25 11 15.25C11.1316 15.25 11.2627 15.2462 11.3934 15.2388L3.89998 8.01393C3.26072 8.58377 2.73279 9.13128 2.34342 9.5641C2.19595 9.72803 2.06878 9.87504 1.96339 10Z"
//                                                         fill="#242B35"/>
//                                                     <path
//                                                         d="M9.664 7.75789C9.96928 8.03786 9.98981 8.51229 9.70984 8.81756C9.42365 9.12963 9.24999 9.54368 9.24999 10C9.24999 10.9665 10.0335 11.75 11 11.75C11.4772 11.75 11.9085 11.56 12.225 11.2498C12.5208 10.9598 12.9956 10.9645 13.2856 11.2603C13.5755 11.5561 13.5708 12.031 13.275 12.3209C12.6896 12.8948 11.8855 13.25 11 13.25C9.20508 13.25 7.74999 11.7949 7.74999 10C7.74999 9.15372 8.07443 8.38156 8.60433 7.80374C8.8843 7.49846 9.35873 7.47793 9.664 7.75789Z"
//                                                         fill="#242B35"/>
//                                                     <path
//                                                         d="M1.46966 0.46967C1.76255 0.176777 2.23743 0.176777 2.53032 0.46967L20.5303 18.4697C20.8232 18.7626 20.8232 19.2374 20.5303 19.5303C20.2374 19.8232 19.7626 19.8232 19.4697 19.5303L1.46966 1.53033C1.17677 1.23744 1.17677 0.762563 1.46966 0.46967Z"
//                                                         fill="#242B35"/>
//                                                 </svg>
//                                                 : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
//                                                        viewBox="0 0 24 24">
//                                                     <path fill="currentColor"
//                                                           d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0"/>
//                                                 </svg>
//                                         }
//                                     </button>
//                                 </div>
//                                 {resetPasswordErrors.password && (
//                                     <p className={errorClass}>{resetPasswordErrors.password.message}</p>
//                                 )}
//                             </div>
//
//                             {/* Confirm New Password Input */}
//                             <div className="w-full">
//                                 <label htmlFor="confirmPassword"
//                                        className="block text-base font-inter font-normal text-[#222222]">
//                                     Confirm New Password
//                                 </label>
//                                 <div
//                                     className="flex flex-row w-full px-2 justify-between items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
//                                     <div className="flex flex-row">
//                                     <span className="left-0 flex items-center pl-3 text-gray-500">
//                                         <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
//                                              xmlns="http://www.w3.org/2000/svg">
//                                             <path
//                                                 d="M2.33333 8.79163C2.21827 8.79163 2.125 8.8849 2.125 8.99996V16.5C2.125 16.615 2.21827 16.7083 2.33333 16.7083H15.6667C15.7817 16.7083 15.875 16.615 15.875 16.5V8.99996C15.875 8.8849 15.7817 8.79163 15.6667 8.79163H2.33333ZM0.875 8.99996C0.875 8.19454 1.52792 7.54163 2.33333 7.54163H15.6667C16.4721 7.54163 17.125 8.19454 17.125 8.99996V16.5C17.125 17.3054 16.4721 17.9583 15.6667 17.9583H2.33333C1.52792 17.9583 0.875 17.3054 0.875 16.5V8.99996Z"
//                                                 fill="#242B35"/>
//                                             <path
//                                                 d="M9 1.29163C7.04401 1.29163 5.45833 2.87729 5.45833 4.83329V8.16663C5.45833 8.5118 5.17851 8.79163 4.83333 8.79163C4.48816 8.79163 4.20833 8.5118 4.20833 8.16663V4.83329C4.20833 2.18693 6.35366 0.041626 9 0.041626C11.6463 0.041626 13.7917 2.18693 13.7917 4.83329V8.16663C13.7917 8.5118 13.5118 8.79163 13.1667 8.79163C12.8215 8.79163 12.5417 8.5118 12.5417 8.16663V4.83329C12.5417 2.87729 10.956 1.29163 9 1.29163Z"
//                                                 fill="#242B35"/>
//                                             <path
//                                                 d="M9 10.875C9.34518 10.875 9.625 11.1548 9.625 11.5V14C9.625 14.3451 9.34518 14.625 9 14.625C8.65482 14.625 8.375 14.3451 8.375 14V11.5C8.375 11.1548 8.65482 10.875 9 10.875Z"
//                                                 fill="#242B35"/>
//                                         </svg>
//                                     </span>
//                                         <input
//                                             type={showConfirmPassword ? 'text' : 'password'}
//                                             id="confirmPassword"
//                                             {...registerResetPassword("confirm_password")}
//                                             placeholder="Confirm new password"
//                                             className="w-full px-4 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
//                                         />
//                                     </div>
//
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                         className="mr-3 flex items-center text-gray-500 hover:text-gray-700"
//                                     >
//                                         {
//                                             showConfirmPassword ?
//                                                 <svg width="22" height="20" viewBox="0 0 22 20" fill="none"
//                                                      xmlns="http://www.w3.org/2000/svg">
//                                                     <path
//                                                         d="M11 4.75C10.3878 4.75 9.78515 4.8318 9.19659 4.97791C8.79458 5.0777 8.38778 4.83271 8.28798 4.4307C8.18819 4.02869 8.43318 3.62189 8.83519 3.52209C9.52923 3.3498 10.2535 3.25 11 3.25C14.0225 3.25 16.6917 4.88254 18.5497 6.42257C19.4893 7.20141 20.2478 7.97852 20.7717 8.5609C21.0341 8.85257 21.2388 9.09667 21.3791 9.26944C21.4492 9.35586 21.5034 9.42453 21.5406 9.4725C21.5593 9.49648 21.5737 9.5153 21.5838 9.52858L21.5957 9.54431L21.5992 9.54898L21.6004 9.5505C21.6004 9.5505 21.6011 9.55147 21 10C21.6011 10.4485 21.6009 10.4487 21.6009 10.4487L21.5992 10.451L21.5957 10.4557L21.5838 10.4714C21.5737 10.4847 21.5593 10.5035 21.5406 10.5275C21.5034 10.5755 21.4492 10.6441 21.3791 10.7306C21.2388 10.9033 21.0341 11.1474 20.7717 11.4391C20.2478 12.0215 19.4893 12.7986 18.5497 13.5774C18.2308 13.8418 17.758 13.7975 17.4936 13.4786C17.2293 13.1597 17.2735 12.6869 17.5924 12.4226C18.4625 11.7014 19.1684 10.9785 19.6566 10.4359C19.804 10.272 19.9312 10.125 20.0366 10C19.9312 9.87503 19.804 9.72803 19.6566 9.5641C19.1684 9.02148 18.4625 8.29859 17.5924 7.57743C15.8311 6.11746 13.5003 4.75 11 4.75ZM21 10L21.6009 10.4487C21.7995 10.1827 21.7996 9.81753 21.6011 9.55147L21 10ZM3.4503 6.42258C3.74433 6.17885 4.17455 6.195 4.44949 6.46009L13.5206 15.2061C13.7168 15.3954 13.7949 15.6762 13.7246 15.9396C13.6542 16.203 13.4465 16.4075 13.182 16.4736C12.4827 16.6486 11.7526 16.75 11 16.75C7.97746 16.75 5.30824 15.1175 3.4503 13.5774C2.51069 12.7986 1.75217 12.0215 1.22826 11.4391C0.96587 11.1474 0.761186 10.9033 0.620909 10.7306C0.550743 10.6441 0.496609 10.5755 0.459345 10.5275C0.440711 10.5035 0.426287 10.4847 0.416179 10.4714L0.404263 10.4557L0.400755 10.451L0.399618 10.4495C0.399618 10.4495 0.398893 10.4485 0.99999 10C0.398893 9.55147 0.399036 9.55128 0.399036 9.55128L0.400755 9.54898L0.404263 9.54431L0.416179 9.52858C0.426287 9.5153 0.440711 9.49648 0.459346 9.47249C0.49661 9.42453 0.550744 9.35586 0.62091 9.26944C0.761187 9.09667 0.96587 8.85257 1.22826 8.5609C1.75217 7.97852 2.51069 7.20141 3.4503 6.42258ZM0.99999 10L0.399036 9.55128C0.200498 9.81734 0.200355 10.1825 0.398893 10.4485L0.99999 10ZM1.96339 10C2.06878 10.125 2.19595 10.272 2.34342 10.4359C2.83157 10.9785 3.53751 11.7014 4.40754 12.4226C6.16889 13.8825 8.49966 15.25 11 15.25C11.1316 15.25 11.2627 15.2462 11.3934 15.2388L3.89998 8.01393C3.26072 8.58377 2.73279 9.13128 2.34342 9.5641C2.19595 9.72803 2.06878 9.87504 1.96339 10Z"
//                                                         fill="#242B35"/>
//                                                     <path
//                                                         d="M9.664 7.75789C9.96928 8.03786 9.98981 8.51229 9.70984 8.81756C9.42365 9.12963 9.24999 9.54368 9.24999 10C9.24999 10.9665 10.0335 11.75 11 11.75C11.4772 11.75 11.9085 11.56 12.225 11.2498C12.5208 10.9598 12.9956 10.9645 13.2856 11.2603C13.5755 11.5561 13.5708 12.031 13.275 12.3209C12.6896 12.8948 11.8855 13.25 11 13.25C9.20508 13.25 7.74999 11.7949 7.74999 10C7.74999 9.15372 8.07443 8.38156 8.60433 7.80374C8.8843 7.49846 9.35873 7.47793 9.664 7.75789Z"
//                                                         fill="#242B35"/>
//                                                     <path
//                                                         d="M1.46966 0.46967C1.76255 0.176777 2.23743 0.176777 2.53032 0.46967L20.5303 18.4697C20.8232 18.7626 20.8232 19.2374 20.5303 19.5303C20.2374 19.8232 19.7626 19.8232 19.4697 19.5303L1.46966 1.53033C1.17677 1.23744 1.17677 0.762563 1.46966 0.46967Z"
//                                                         fill="#242B35"/>
//                                                 </svg>
//                                                 : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
//                                                        viewBox="0 0 24 24">
//                                                     <path fill="currentColor"
//                                                           d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0"/>
//                                                 </svg>
//                                         }
//                                     </button>
//                                 </div>
//                                 {resetPasswordErrors.confirm_password && (
//                                     <p className={errorClass}>{resetPasswordErrors.confirm_password.message}</p>
//                                 )}
//                             </div>
//
//                             <button
//                                 type="submit"
//                                 disabled={isPerformingReset || isResettingPassword}
//                                 className="w-full cursor-pointer px-4 py-5 mt-4 text-white font-inter text-sm font-normal bg-[#2D3192] rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
//                             >
//                                 {isPerformingReset ? 'Resetting...' : 'Reset Password'}
//                             </button>
//                         </form>
//                     </div>
//                 );
//
//             default:
//                 return null;
//         }
//     };
//
//     return (
//         <div className="min-h-screen">
//             <HeroSection hero={hero}/>
//             <div className="py-8 px-4 sm:px-6 lg:px-8">
//                 <div className="max-w-7xl mx-auto">
//                     {renderFormByStep()}
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default ForgotPasswordPage;

"use client";

import HeroSection from "@/components/HeroSection";
import SectionTitle from "@/components/SectionTitle";
import React, {useState, useRef, ChangeEvent, KeyboardEvent, useEffect} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForgotPassword, useValidateOtp, useResetPassword} from "@/hooks/useUser";
import {useRouter} from 'next/navigation';
import Link from "next/link";

interface HeroProps {
    image: string;
    title: string;
    subTitle: string;
}

const emailSchema = z.object({
    email: z.string().email("Invalid email address"),
});

const otpSchema = z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().length(4, "OTP must be 4 digits").regex(/^\d+$/, "OTP must be numbers only"),
});

const resetPasswordSchema = z
    .object({
        email: z.string().email("Invalid email address"),
        // otp: z.string().length(4, "OTP must be 4 digits").regex(/^\d+$/, "OTP must be numbers only"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
        confirm_password: z.string(),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords don't match",
        path: ["confirm_password"],
    });

type EmailFormData = z.infer<typeof emailSchema>;
type OtpFormData = z.infer<typeof otpSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ForgotPasswordPage = () => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [emailForReset, setEmailForReset] = useState('');
    // const [otpForReset, setOtpForReset] = useState('');
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '']);
    const otpInputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    useEffect(() => {
        if (currentStep === 2 && emailForReset) {
            resetOtpForm({email: emailForReset, otp: ''});
            otpInputRefs[0].current?.focus();
        }
    }, [currentStep, emailForReset]);


    const hero: HeroProps = {
        image: "/register-hero.png",
        title: "Forgot Password",
        subTitle: "Reset your password in a few simple steps",
    };

    const {
        register: registerEmail,
        handleSubmit: handleSubmitEmail,
        reset: resetEmailForm,
        formState: {errors: emailErrors, isSubmitting: isEmailSubmitting},
    } = useForm<EmailFormData>({
        resolver: zodResolver(emailSchema),
        defaultValues: {email: ''},
    });

    const {mutateAsync: sendForgotPasswordEmail, isPending: isSendingEmail} = useForgotPassword();

    const onSubmitEmail = async (data: EmailFormData) => {
        setServerError(null);
        try {
            await sendForgotPasswordEmail(
                {email: data.email},
                {
                    onSuccess: () => {
                        setEmailForReset(data.email);
                        setCurrentStep(2);
                        resetEmailForm();
                    },
                    onError: (error) => {
                        setServerError(error.message);
                    },
                }
            );
        } catch (error) {
            console.error('Email submission error:', error);
            setServerError('An unexpected error occurred.');
        }
    };

    const {
        register: registerOtp,
        handleSubmit: handleSubmitOtp,
        reset: resetOtpForm,
        setValue: setOtpValue,
        formState: {errors: otpErrors, isSubmitting: isOtpSubmitting},
    } = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema),
        defaultValues: {email: emailForReset, otp: ''},
    });

    const {mutateAsync: validateOtpCode, isPending: isValidatingOtp} = useValidateOtp();

    const handleOtpInputChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const {value} = e.target;
        if (value.length > 1) {
            e.target.value = value.charAt(0);
        }

        const newOtpDigits = [...otpDigits];
        newOtpDigits[index] = e.target.value;
        setOtpDigits(newOtpDigits);

        const fullOtp = newOtpDigits.join('');
        setOtpValue('otp', fullOtp, {shouldValidate: true});

        if (e.target.value && index < otpInputRefs.length - 1) {
            otpInputRefs[index + 1].current?.focus();
        } else if (!e.target.value && index > 0) {
            otpInputRefs[index - 1].current?.focus();
        }
    };

    const handleOtpKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            e.preventDefault();
            otpInputRefs[index - 1].current?.focus();
            const newOtpDigits = [...otpDigits];
            newOtpDigits[index - 1] = '';
            setOtpDigits(newOtpDigits);
            setOtpValue('otp', newOtpDigits.join(''), {shouldValidate: true});
        } else if (e.key === 'ArrowLeft' && index > 0) {
            otpInputRefs[index - 1].current?.focus();
        } else if (e.key === 'ArrowRight' && index < otpInputRefs.length - 1) {
            otpInputRefs[index + 1].current?.focus();
        }
    };

    const onSubmitOtp = async (data: OtpFormData) => {
        setServerError(null);
        try {
            const validateOtpData = {
                email: data.email,
                otp: data.otp,
                otp_type: ""
            }
            await validateOtpCode(
                validateOtpData,
                {
                    onSuccess: () => {
                        // setOtpForReset(data.otp);
                        setCurrentStep(3);
                        setOtpDigits(['', '', '', '']);
                        resetOtpForm();
                    },
                    onError: (error) => {
                        setServerError(error.message);
                    },
                }
            );
        } catch (error) {
            console.error('OTP validation error:', error);
            setServerError('An unexpected error occurred.');
        }
    };

    const {
        register: registerResetPassword,
        handleSubmit: handleSubmitResetPassword,
        reset: resetPasswordForm,
        formState: {errors: resetPasswordErrors, isSubmitting: isResettingPassword},
        getValues,
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: emailForReset,
            // otp: otpForReset,
            password: '',
            confirm_password: '',
        },
    });

    useEffect(() => {
        if (currentStep === 3 && emailForReset) {
            resetPasswordForm({ email: emailForReset, password: "", confirm_password: "" });
            console.log("Reset password form updated with email:", emailForReset);
        }
    }, [emailForReset, currentStep, resetPasswordForm]);

    const {mutateAsync: performPasswordReset, isPending: isPerformingReset} = useResetPassword();

    const onSubmitResetPassword = async (data: ResetPasswordFormData) => {
        setServerError(null);
        console.log("Reset password form submitted with data:", data);
        try {
            const passwordResetData = {
                email: data.email,
                password: data.password,
                confirm_password: data.confirm_password,
            }

            console.log("Sending password reset payload:", passwordResetData);

            await performPasswordReset(
                passwordResetData
                ,
                {
                    onSuccess: () => {
                        console.log("Password reset successful for:", data.email);
                        alert('Password reset successfully! You can now log in with your new password.');
                        router.push('/login');
                        resetPasswordForm();
                        setEmailForReset(""); // Clear emailForReset after success
                        setCurrentStep(1); // Reset to step 1
                    },
                    onError: (error) => {
                        setServerError(error.message || "Failed to reset password");
                    },
                }
            );
        } catch (error) {
            console.error('Password reset error:', error);
            setServerError('An unexpected error occurred.');
        }
    };

    const errorClass = "text-sm text-red-500 mt-1 font-inter";

    const renderFormByStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div>
                        <SectionTitle title="Enter Your Email"/>
                        <form onSubmit={handleSubmitEmail(onSubmitEmail)} noValidate
                              className="space-y-4 max-w-[406px] justify-center mx-auto mt-12">
                            {serverError && <p className={errorClass}>{serverError}</p>}

                            <div className="w-full">
                                <label htmlFor="email"
                                       className="block text-base font-inter font-normal text-[#222222]">
                                    Email
                                </label>
                                <div
                                    className="flex flex-row w-full px-2 items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
                                <span className="left-0 flex items-center pl-3 text-gray-500">
                                    <svg width="18" height="14" viewBox="0 0 18 14" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd"
                                              d="M0.041687 0.75C0.041687 0.404822 0.321509 0.125 0.666687 0.125H17.3334C17.6785 0.125 17.9584 0.404822 17.9584 0.75V13.25C17.9584 13.5952 17.6785 13.875 17.3334 13.875H0.666687C0.321509 13.875 0.041687 13.5952 0.041687 13.25V0.75ZM1.29169 1.375V12.625H16.7084V1.375H1.29169Z"
                                              fill="#242B35"/>
                                        <path fillRule="evenodd" clipRule="evenodd"
                                              d="M0.166724 0.375037C0.373831 0.0988944 0.765581 0.04293 1.04172 0.250037L9.00006 6.21879L16.9584 0.250037C17.2345 0.04293 17.6263 0.0988944 17.8334 0.375037C18.0405 0.651179 17.9845 1.04293 17.7084 1.25004L9.37506 7.50004C9.15283 7.6667 8.84728 7.6667 8.62506 7.50004L0.291724 1.25004C0.0155814 1.04293 -0.040383 0.651179 0.166724 0.375037Z"
                                              fill="#242B35"/>
                                        <path fillRule="evenodd" clipRule="evenodd"
                                              d="M0.041687 0.75C0.041687 0.404822 0.321509 0.125 0.666687 0.125H9.00002C9.3452 0.125 9.62502 0.404822 9.62502 0.75C9.62502 1.09518 9.3452 1.375 9.00002 1.375H1.29169V7C1.29169 7.34518 1.01187 7.625 0.666687 7.625C0.321509 7.625 0.041687 7.34518 0.041687 7V0.75Z"
                                              fill="#242B35"/>
                                        <path fillRule="evenodd" clipRule="evenodd"
                                              d="M8.37502 0.75C8.37502 0.404822 8.65484 0.125 9.00002 0.125H17.3334C17.6785 0.125 17.9584 0.404822 17.9584 0.75V7C17.9584 7.34518 17.6785 7.625 17.3334 7.625C16.9882 7.625 16.7084 7.34518 16.7084 7V1.375H9.00002C8.65484 1.375 8.37502 1.09518 8.37502 0.75Z"
                                              fill="#242B35"/>
                                    </svg>
                                </span>
                                    <input
                                        type="email"
                                        id="email"
                                        {...registerEmail("email")}
                                        placeholder="Enter your email address"
                                        className="w-full px-4 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
                                    />
                                </div>
                                {emailErrors.email && (
                                    <p className={errorClass}>{emailErrors.email.message}</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={isSendingEmail || isEmailSubmitting}
                                className="w-full cursor-pointer px-4 py-5 mt-4 bg-[#27337C] text-white font-inter font-medium text-sm border-2 border-[#27337C] hover:bg-indigo-800 transition-colors duration-200 rounded-md focus:outline-none focus:bg-indigo-800"
                            >
                                {isSendingEmail ? 'Sending...' : 'Send OTP'}
                            </button>
                            <p className="mt-3 text-center text-base text-[#6A6A6A] font-inter">
                                Remember your password?{' '}
                                <Link href="/login" className="text-[#222222] font-medium hover:text-indigo-500">
                                    Sign In
                                </Link>
                            </p>
                        </form>
                    </div>
                );

            case 2:
                return (
                    <div>
                        <SectionTitle title="OTP Verification"/>
                        <form onSubmit={handleSubmitOtp(onSubmitOtp)} noValidate
                              className="space-y-4 max-w-[406px] justify-center mx-auto mt-12">

                            {serverError && <p className={errorClass}>{serverError}</p>}
                            <p className="text-center text-sm text-gray-600">
                                An OTP has been sent to <span className="font-semibold">{emailForReset}</span>.
                            </p>

                            <input type="hidden" {...registerOtp("email")} value={emailForReset}/>

                            <div className="w-full">
                                <label htmlFor="otp"
                                       className="block text-base font-inter font-normal text-[#222222] mb-2">
                                    OTP Code
                                </label>
                                <div className="flex justify-between space-x-2"> {/* Use flexbox for spacing */}
                                    {otpDigits.map((digit, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            id={`otp-input-${index}`}
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpInputChange(e, index)}
                                            onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                            ref={otpInputRefs[index]}
                                            className="w-1/4 text-center px-3 py-3 rounded-md font-bold text-xl
                                                   border-3 border-[#EDF1F7] hover:border-[#2D3192]/50
                                                   focus:outline-[#2D3192] focus:border-blue-500"
                                            inputMode="numeric" // Optimizes for mobile numeric keyboard
                                            pattern="[0-9]" // Helps browser validation (though Zod is primary)
                                        />
                                    ))}
                                </div>
                                {otpErrors.otp && (
                                    <p className={errorClass}>{otpErrors.otp.message}</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={isValidatingOtp || isOtpSubmitting}
                                className="w-full cursor-pointer px-4 py-5 mt-4 bg-[#27337C] text-white font-inter font-medium text-sm border-2 border-[#27337C] hover:bg-indigo-800 transition-colors duration-200 rounded-md focus:outline-none focus:bg-indigo-800"
                            >
                                {isValidatingOtp ? 'Verifying...' : 'Verify OTP'}
                            </button>
                            <p className="mt-3 text-center text-base text-[#6A6A6A] font-inter">
                                Wrong email?{' '}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCurrentStep(1);
                                        setServerError(null);
                                        setOtpDigits(['', '', '', '']);
                                        resetOtpForm();
                                    }}
                                    className="text-[#222222] font-medium hover:text-indigo-500"
                                >
                                    Go back
                                </button>
                            </p>
                        </form>
                    </div>
                );

            case 3:
                return (
                    <div>
                        <SectionTitle title="Set New Password"/>
                        <form onSubmit={handleSubmitResetPassword(onSubmitResetPassword)} noValidate
                              className="space-y-4 max-w-[406px] justify-center mx-auto mt-12">

                            {serverError && <p className={errorClass}>{serverError}</p>}
                            <input type="hidden" {...registerResetPassword("email")} value={emailForReset}/>
                            {/*<input type="hidden" {...registerResetPassword("otp")} value={otpForReset}/>*/}

                            <div className="w-full">
                                <label htmlFor="newPassword"
                                       className="block text-base font-inter font-normal text-[#222222]">
                                    New Password
                                </label>
                                <div
                                    className="flex flex-row w-full px-2 justify-between items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
                                    <div className="flex flex-row">
                                    <span className="left-0 flex items-center pl-3 text-gray-500">
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M2.33333 8.79163C2.21827 8.79163 2.125 8.8849 2.125 8.99996V16.5C2.125 16.615 2.21827 16.7083 2.33333 16.7083H15.6667C15.7817 16.7083 15.875 16.615 15.875 16.5V8.99996C15.875 8.8849 15.7817 8.79163 15.6667 8.79163H2.33333ZM0.875 8.99996C0.875 8.19454 1.52792 7.54163 2.33333 7.54163H15.6667C16.4721 7.54163 17.125 8.19454 17.125 8.99996V16.5C17.125 17.3054 16.4721 17.9583 15.6667 17.9583H2.33333C1.52792 17.9583 0.875 17.3054 0.875 16.5V8.99996Z"
                                                fill="#242B35"/>
                                            <path
                                                d="M9 1.29163C7.04401 1.29163 5.45833 2.87729 5.45833 4.83329V8.16663C5.45833 8.5118 5.17851 8.79163 4.83333 8.79163C4.48816 8.79163 4.20833 8.5118 4.20833 8.16663V4.83329C4.20833 2.18693 6.35366 0.041626 9 0.041626C11.6463 0.041626 13.7917 2.18693 13.7917 4.83329V8.16663C13.7917 8.5118 13.5118 8.79163 13.1667 8.79163C12.8215 8.79163 12.5417 8.5118 12.5417 8.16663V4.83329C12.5417 2.87729 10.956 1.29163 9 1.29163Z"
                                                fill="#242B35"/>
                                            <path
                                                d="M9 10.875C9.34518 10.875 9.625 11.1548 9.625 11.5V14C9.625 14.3451 9.34518 14.625 9 14.625C8.65482 14.625 8.375 14.3451 8.375 14V11.5C8.375 11.1548 8.65482 10.875 9 10.875Z"
                                                fill="#242B35"/>
                                        </svg>
                                    </span>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="newPassword"
                                            {...registerResetPassword("password")}
                                            placeholder="Enter new password"
                                            className="w-full px-4 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="mr-3 flex items-center text-gray-500 hover:text-gray-700"
                                    >
                                        {
                                            showPassword ?
                                                <svg width="22" height="20" viewBox="0 0 22 20" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M11 4.75C10.3878 4.75 9.78515 4.8318 9.19659 4.97791C8.79458 5.0777 8.38778 4.83271 8.28798 4.4307C8.18819 4.02869 8.43318 3.62189 8.83519 3.52209C9.52923 3.3498 10.2535 3.25 11 3.25C14.0225 3.25 16.6917 4.88254 18.5497 6.42257C19.4893 7.20141 20.2478 7.97852 20.7717 8.5609C21.0341 8.85257 21.2388 9.09667 21.3791 9.26944C21.4492 9.35586 21.5034 9.42453 21.5406 9.4725C21.5593 9.49648 21.5737 9.5153 21.5838 9.52858L21.5957 9.54431L21.5992 9.54898L21.6004 9.5505C21.6004 9.5505 21.6011 9.55147 21 10C21.6011 10.4485 21.6009 10.4487 21.6009 10.4487L21.5992 10.451L21.5957 10.4557L21.5838 10.4714C21.5737 10.4847 21.5593 10.5035 21.5406 10.5275C21.5034 10.5755 21.4492 10.6441 21.3791 10.7306C21.2388 10.9033 21.0341 11.1474 20.7717 11.4391C20.2478 12.0215 19.4893 12.7986 18.5497 13.5774C18.2308 13.8418 17.758 13.7975 17.4936 13.4786C17.2293 13.1597 17.2735 12.6869 17.5924 12.4226C18.4625 11.7014 19.1684 10.9785 19.6566 10.4359C19.804 10.272 19.9312 10.125 20.0366 10C19.9312 9.87503 19.804 9.72803 19.6566 9.5641C19.1684 9.02148 18.4625 8.29859 17.5924 7.57743C15.8311 6.11746 13.5003 4.75 11 4.75ZM21 10L21.6009 10.4487C21.7995 10.1827 21.7996 9.81753 21.6011 9.55147L21 10ZM3.4503 6.42258C3.74433 6.17885 4.17455 6.195 4.44949 6.46009L13.5206 15.2061C13.7168 15.3954 13.7949 15.6762 13.7246 15.9396C13.6542 16.203 13.4465 16.4075 13.182 16.4736C12.4827 16.6486 11.7526 16.75 11 16.75C7.97746 16.75 5.30824 15.1175 3.4503 13.5774C2.51069 12.7986 1.75217 12.0215 1.22826 11.4391C0.96587 11.1474 0.761186 10.9033 0.620909 10.7306C0.550743 10.6441 0.496609 10.5755 0.459345 10.5275C0.440711 10.5035 0.426287 10.4847 0.416179 10.4714L0.404263 10.4557L0.400755 10.451L0.399618 10.4495C0.399618 10.4495 0.398893 10.4485 0.99999 10C0.398893 9.55147 0.399036 9.55128 0.399036 9.55128L0.400755 9.54898L0.404263 9.54431L0.416179 9.52858C0.426287 9.5153 0.440711 9.49648 0.459346 9.47249C0.49661 9.42453 0.550744 9.35586 0.62091 9.26944C0.761187 9.09667 0.96587 8.85257 1.22826 8.5609C1.75217 7.97852 2.51069 7.20141 3.4503 6.42258ZM0.99999 10L0.399036 9.55128C0.200498 9.81734 0.200355 10.1825 0.398893 10.4485L0.99999 10ZM1.96339 10C2.06878 10.125 2.19595 10.272 2.34342 10.4359C2.83157 10.9785 3.53751 11.7014 4.40754 12.4226C6.16889 13.8825 8.49966 15.25 11 15.25C11.1316 15.25 11.2627 15.2462 11.3934 15.2388L3.89998 8.01393C3.26072 8.58377 2.73279 9.13128 2.34342 9.5641C2.19595 9.72803 2.06878 9.87504 1.96339 10Z"
                                                        fill="#242B35"/>
                                                    <path
                                                        d="M9.664 7.75789C9.96928 8.03786 9.98981 8.51229 9.70984 8.81756C9.42365 9.12963 9.24999 9.54368 9.24999 10C9.24999 10.9665 10.0335 11.75 11 11.75C11.4772 11.75 11.9085 11.56 12.225 11.2498C12.5208 10.9598 12.9956 10.9645 13.2856 11.2603C13.5755 11.5561 13.5708 12.031 13.275 12.3209C12.6896 12.8948 11.8855 13.25 11 13.25C9.20508 13.25 7.74999 11.7949 7.74999 10C7.74999 9.15372 8.07443 8.38156 8.60433 7.80374C8.8843 7.49846 9.35873 7.47793 9.664 7.75789Z"
                                                        fill="#242B35"/>
                                                    <path
                                                        d="M1.46966 0.46967C1.76255 0.176777 2.23743 0.176777 2.53032 0.46967L20.5303 18.4697C20.8232 18.7626 20.8232 19.2374 20.5303 19.5303C20.2374 19.8232 19.7626 19.8232 19.4697 19.5303L1.46966 1.53033C1.17677 1.23744 1.17677 0.762563 1.46966 0.46967Z"
                                                        fill="#242B35"/>
                                                </svg>
                                                : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                       viewBox="0 0 24 24">
                                                    <path fill="currentColor"
                                                          d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0"/>
                                                </svg>
                                        }
                                    </button>
                                </div>
                                {resetPasswordErrors.password && (
                                    <p className={errorClass}>{resetPasswordErrors.password.message}</p>
                                )}
                            </div>

                            <div className="w-full">
                                <label htmlFor="confirmPassword"
                                       className="block text-base font-inter font-normal text-[#222222]">
                                    Confirm New Password
                                </label>
                                <div
                                    className="flex flex-row w-full px-2 justify-between items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
                                    <div className="flex flex-row">
                                    <span className="left-0 flex items-center pl-3 text-gray-500">
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M2.33333 8.79163C2.21827 8.79163 2.125 8.8849 2.125 8.99996V16.5C2.125 16.615 2.21827 16.7083 2.33333 16.7083H15.6667C15.7817 16.7083 15.875 16.615 15.875 16.5V8.99996C15.875 8.8849 15.7817 8.79163 15.6667 8.79163H2.33333ZM0.875 8.99996C0.875 8.19454 1.52792 7.54163 2.33333 7.54163H15.6667C16.4721 7.54163 17.125 8.19454 17.125 8.99996V16.5C17.125 17.3054 16.4721 17.9583 15.6667 17.9583H2.33333C1.52792 17.9583 0.875 17.3054 0.875 16.5V8.99996Z"
                                                fill="#242B35"/>
                                            <path
                                                d="M9 1.29163C7.04401 1.29163 5.45833 2.87729 5.45833 4.83329V8.16663C5.45833 8.5118 5.17851 8.79163 4.83333 8.79163C4.48816 8.79163 4.20833 8.5118 4.20833 8.16663V4.83329C4.20833 2.18693 6.35366 0.041626 9 0.041626C11.6463 0.041626 13.7917 2.18693 13.7917 4.83329V8.16663C13.7917 8.5118 13.5118 8.79163 13.1667 8.79163C12.8215 8.79163 12.5417 8.5118 12.5417 8.16663V4.83329C12.5417 2.87729 10.956 1.29163 9 1.29163Z"
                                                fill="#242B35"/>
                                            <path
                                                d="M9 10.875C9.34518 10.875 9.625 11.1548 9.625 11.5V14C9.625 14.3451 9.34518 14.625 9 14.625C8.65482 14.625 8.375 14.3451 8.375 14V11.5C8.375 11.1548 8.65482 10.875 9 10.875Z"
                                                fill="#242B35"/>
                                        </svg>
                                    </span>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            id="confirmPassword"
                                            {...registerResetPassword("confirm_password")}
                                            placeholder="Confirm new password"
                                            className="w-full px-4 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="mr-3 flex items-center text-gray-500 hover:text-gray-700"
                                    >
                                        {
                                            showConfirmPassword ?
                                                <svg width="22" height="20" viewBox="0 0 22 20" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M11 4.75C10.3878 4.75 9.78515 4.8318 9.19659 4.97791C8.79458 5.0777 8.38778 4.83271 8.28798 4.4307C8.18819 4.02869 8.43318 3.62189 8.83519 3.52209C9.52923 3.3498 10.2535 3.25 11 3.25C14.0225 3.25 16.6917 4.88254 18.5497 6.42257C19.4893 7.20141 20.2478 7.97852 20.7717 8.5609C21.0341 8.85257 21.2388 9.09667 21.3791 9.26944C21.4492 9.35586 21.5034 9.42453 21.5406 9.4725C21.5593 9.49648 21.5737 9.5153 21.5838 9.52858L21.5957 9.54431L21.5992 9.54898L21.6004 9.5505C21.6004 9.5505 21.6011 9.55147 21 10C21.6011 10.4485 21.6009 10.4487 21.6009 10.4487L21.5992 10.451L21.5957 10.4557L21.5838 10.4714C21.5737 10.4847 21.5593 10.5035 21.5406 10.5275C21.5034 10.5755 21.4492 10.6441 21.3791 10.7306C21.2388 10.9033 21.0341 11.1474 20.7717 11.4391C20.2478 12.0215 19.4893 12.7986 18.5497 13.5774C18.2308 13.8418 17.758 13.7975 17.4936 13.4786C17.2293 13.1597 17.2735 12.6869 17.5924 12.4226C18.4625 11.7014 19.1684 10.9785 19.6566 10.4359C19.804 10.272 19.9312 10.125 20.0366 10C19.9312 9.87503 19.804 9.72803 19.6566 9.5641C19.1684 9.02148 18.4625 8.29859 17.5924 7.57743C15.8311 6.11746 13.5003 4.75 11 4.75ZM21 10L21.6009 10.4487C21.7995 10.1827 21.7996 9.81753 21.6011 9.55147L21 10ZM3.4503 6.42258C3.74433 6.17885 4.17455 6.195 4.44949 6.46009L13.5206 15.2061C13.7168 15.3954 13.7949 15.6762 13.7246 15.9396C13.6542 16.203 13.4465 16.4075 13.182 16.4736C12.4827 16.6486 11.7526 16.75 11 16.75C7.97746 16.75 5.30824 15.1175 3.4503 13.5774C2.51069 12.7986 1.75217 12.0215 1.22826 11.4391C0.96587 11.1474 0.761186 10.9033 0.620909 10.7306C0.550743 10.6441 0.496609 10.5755 0.459345 10.5275C0.440711 10.5035 0.426287 10.4847 0.416179 10.4714L0.404263 10.4557L0.400755 10.451L0.399618 10.4495C0.399618 10.4495 0.398893 10.4485 0.99999 10C0.398893 9.55147 0.399036 9.55128 0.399036 9.55128L0.400755 9.54898L0.404263 9.54431L0.416179 9.52858C0.426287 9.5153 0.440711 9.49648 0.459346 9.47249C0.49661 9.42453 0.550744 9.35586 0.62091 9.26944C0.761187 9.09667 0.96587 8.85257 1.22826 8.5609C1.75217 7.97852 2.51069 7.20141 3.4503 6.42258ZM0.99999 10L0.399036 9.55128C0.200498 9.81734 0.200355 10.1825 0.398893 10.4485L0.99999 10ZM1.96339 10C2.06878 10.125 2.19595 10.272 2.34342 10.4359C2.83157 10.9785 3.53751 11.7014 4.40754 12.4226C6.16889 13.8825 8.49966 15.25 11 15.25C11.1316 15.25 11.2627 15.2462 11.3934 15.2388L3.89998 8.01393C3.26072 8.58377 2.73279 9.13128 2.34342 9.5641C2.19595 9.72803 2.06878 9.87504 1.96339 10Z"
                                                        fill="#242B35"/>
                                                    <path
                                                        d="M9.664 7.75789C9.96928 8.03786 9.98981 8.51229 9.70984 8.81756C9.42365 9.12963 9.24999 9.54368 9.24999 10C9.24999 10.9665 10.0335 11.75 11 11.75C11.4772 11.75 11.9085 11.56 12.225 11.2498C12.5208 10.9598 12.9956 10.9645 13.2856 11.2603C13.5755 11.5561 13.5708 12.031 13.275 12.3209C12.6896 12.8948 11.8855 13.25 11 13.25C9.20508 13.25 7.74999 11.7949 7.74999 10C7.74999 9.15372 8.07443 8.38156 8.60433 7.80374C8.8843 7.49846 9.35873 7.47793 9.664 7.75789Z"
                                                        fill="#242B35"/>
                                                </svg>
                                                : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                       viewBox="0 0 24 24">
                                                    <path fill="currentColor"
                                                          d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0"/>
                                                </svg>
                                        }
                                    </button>
                                </div>
                                {resetPasswordErrors.confirm_password && (
                                    <p className={errorClass}>{resetPasswordErrors.confirm_password.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isPerformingReset || isResettingPassword}
                                onClick={() => console.log("Reset Password button clicked", getValues())}
                                className="w-full cursor-pointer px-4 py-5 mt-4 bg-[#27337C] text-white font-inter font-medium text-sm border-2 border-[#27337C] hover:bg-indigo-800 transition-colors duration-200 rounded-md focus:outline-none focus:bg-indigo-800"
                            >
                                {isPerformingReset ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen">
            <HeroSection hero={hero}/>
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {renderFormByStep()}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;