"use client"
import HeroSection from "@/components/HeroSection";
import SectionTitle from "@/components/SectionTitle";
import React, {ChangeEvent, KeyboardEvent, useEffect, useRef, useState} from "react";
import ReactCountryFlag from "react-country-flag";
import {getData} from "country-list";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useCreateUser, useResendOtp, useValidateOtp} from "@/hooks/useUser";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import {AxiosError} from "axios";
import Select, {StylesConfig} from "react-select";

interface HeroProps {
    image: string;
    title: string;
    subTitle: string
}

interface ErrorResponse {
    message?: string;
    errors?: { fieldErrors?: Record<string, string[]> };
}

interface Country {
    code: string;
    name: string;
}

interface OptionType {
    value: string;
    label: string;
    code: string;
}

const registerSchema = z
    .object({
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
            .regex(/^\+?[\d\s-]{10,}$/, "Invalid phone number format"),
        nicPassport: z
            .string()
            .min(5, "NIC/Passport must be at least 5 characters")
            .max(20, "NIC/Passport must be less than 20 characters"),
        email: z.string().email("Invalid email address"),
        country: z.string().min(2, "Please enter a valid country"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                "Password must contain at least one uppercase letter, one lowercase letter, and one number"
            ),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type FormData = z.infer<typeof registerSchema>;

const otpSchema = z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().length(4, "OTP must be exactly 4 digits").regex(/^\d+$/, "OTP must be numeric"),
});

export type OtpFormData = z.infer<typeof otpSchema>;

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


const RegisterPage = () => {

    const createUserMutation = useCreateUser();

    const validateOtpCode = useValidateOtp(); // Use the hook directly
    const sendOtpCode = useResendOtp();

    const router = useRouter();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(1);

    const [emailForOtpVerification, setEmailForOtpVerification] = useState<string>('');
    const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '']);
    const otpInputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];
    const [otpServerError, setOtpServerError] = useState<string | null>(null); // For OTP specific server errors
    const [resendOtpCountdown, setResendOtpCountdown] = useState<number>(0); // 0 means not counting down
    const [isResendingOtp, setIsResendingOtp] = useState<boolean>(false);


    const hero: HeroProps = {
        image: "/register-hero.png",
        title: "Register Now",
        subTitle: "Discover your favorite entertainment right here",
    }

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: {errors},
    } = useForm<FormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            contactNumber: "",
            nicPassport: "",
            email: "",
            country: "",
            password: "",
            confirmPassword: "",
        },
    });

    const {
        register: registerOtp,
        handleSubmit: handleSubmitOtp,
        reset: resetOtpForm, // To reset OTP form
        setValue: setOtpValue,
        formState: {errors: otpErrors, isSubmitting: isOtpSubmitting},
    } = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema),
        defaultValues: {email: emailForOtpVerification, otp: ''},
    });


    const countryValue = watch("country");

    const onSubmitRegister = async (data: FormData) => {
        setError(null);
        try {
            console.log("Form Data:", data);

            const submissionData = {
                email: data.email,
                password: data.password,
                confirm_password: data.confirmPassword,
                first_name: data.firstName,
                last_name: data.lastName,
                contact_number: data.contactNumber,
                nic_passport: data.nicPassport,
                country: data.country
            };

            await createUserMutation.mutateAsync(submissionData, {
                onSuccess: async () => {
                    // console.log("User successfully created");
                    // const signInResult = await signIn('credentials', {
                    //     email: data.email,
                    //     password: data.password,
                    //     redirect: false,
                    // });
                    //
                    // if (signInResult?.error) {
                    //     setError(signInResult.error);
                    // } else {
                    //     reset();
                    //     router.push('/');
                    // }

                    console.log("User successfully created. Proceeding to OTP verification.");
                    setEmailForOtpVerification(data.email);
                    setOtpValue('email', data.email);
                    setCurrentStep(2);
                    setOtpServerError(null);

                    await handleSendOtp(false);
                },
                onError: (error: AxiosError<ErrorResponse>) => {
                    console.error("Error creating user:", error);
                    setError(error.response?.data?.message || "Registration failed");
                },
            })
        } catch (error: unknown) {
            console.error("Submission error:", error);
            setError("An unexpected error occurred");
        }
    };


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


    const handleOtpKeyDown = (e: KeyboardEvent, index: number) => {
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
        setOtpServerError(null);
        try {
            const validationPayload = {
                email: emailForOtpVerification,
                otp: data.otp,
                otp_type: "register",
            };

            await validateOtpCode.mutateAsync(validationPayload, {
                onSuccess: async () => {
                    console.log("OTP successfully validated. Attempting to sign in.");
                    setOtpDigits(['', '', '', '']);
                    resetOtpForm();

                    const signInResult = await signIn('credentials', {
                        email: emailForOtpVerification,
                        password: watch('password'),
                        redirect: false,
                    });

                    if (signInResult?.error) {
                        console.error("Sign-in failed after OTP verification:", signInResult.error);
                        setError(signInResult.error || "Authentication failed after verification. Please try logging in.");
                        setCurrentStep(1);
                    } else {
                        console.log("User successfully signed in.");
                        reset();
                        router.push('/');
                    }
                },
                onError: (error: AxiosError<ErrorResponse>) => {
                    console.error("Error validating OTP:", error);
                    setOtpServerError(error.response?.data?.message || "OTP verification failed. Please try again.");
                },
            });
        } catch (error: unknown) {
            console.error('OTP validation submission error:', error);
            setOtpServerError('An unexpected error occurred during OTP validation.');
        }
    };

    const handleSendOtp = async (isResend = false) => {
        if (!emailForOtpVerification) {
            setOtpServerError("");
            return;
        }

        setOtpServerError(null);
        setIsResendingOtp(true);
        setResendOtpCountdown(60);

        try {
            await sendOtpCode.mutateAsync({
                email: emailForOtpVerification,
            }, {
                onSuccess: () => {
                    console.log(isResend ? "OTP re-sent successfully." : "OTP sent successfully.");
                },
                onError: (error: AxiosError<ErrorResponse>) => {
                    console.error(isResend ? "Error re-sending OTP:" : "Error sending OTP:", error);
                    setOtpServerError(error.response?.data?.message || (isResend ? "Failed to re-send OTP." : "Failed to send OTP."));
                    setResendOtpCountdown(0);
                    setIsResendingOtp(false);
                },
            });
        } catch (error) {
            console.error(isResend ? "Resend OTP request failed:" : "Initial OTP request failed:", error);
            setOtpServerError(
                isResend
                    ? "An unexpected error occurred while re-sending OTP."
                    : "An unexpected error occurred while sending OTP."
            );
            setResendOtpCountdown(0);
            setIsResendingOtp(false);
        }
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (currentStep === 2 && resendOtpCountdown > 0) {
            timer = setInterval(() => {
                setResendOtpCountdown((prev) => prev - 1);
            }, 1000);
        } else if (resendOtpCountdown === 0 && isResendingOtp) {
            setIsResendingOtp(false);
        }
        return () => clearInterval(timer);
    }, [resendOtpCountdown, isResendingOtp, currentStep]);

    // const getCountryCode = (countryName: string): string | undefined => {
    //     return getCode(countryName);
    // };

    const errorClass = "text-sm text-red-500 mt-1 font-inter";

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

    return (
        <div className="min-h-screen">
            <HeroSection hero={hero}/>
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <SectionTitle title="Register"/>
                    {currentStep === 1 && (
                        <form onSubmit={handleSubmit(onSubmitRegister)} noValidate
                              className="space-y-4 max-w-[960px] justify-center mx-auto mt-12">
                            {error && <p className={errorClass}>{error}</p>}
                            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-18">
                                <div className="w-full">
                                    <label htmlFor="firstName"
                                           className="block text-base font-inter font-normal text-[#222222]">
                                        First Name
                                    </label>
                                    <div
                                        className="flex flex-row w-full px-2 items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
                                    <span className="left-0 mr-2 flex items-center pl-3 text-gray-500">
                                      <svg width="17" height="18" viewBox="0 0 17 18" fill="none"
                                           xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M9.00002 1.29175C7.73437 1.29175 6.70835 2.31776 6.70835 3.58341C6.70835 4.84907 7.73437 5.87508 9.00002 5.87508C10.2657 5.87508 11.2917 4.84907 11.2917 3.58341C11.2917 2.31776 10.2657 1.29175 9.00002 1.29175ZM5.45835 3.58341C5.45835 1.62741 7.04401 0.041748 9.00002 0.041748C10.956 0.041748 12.5417 1.62741 12.5417 3.58341C12.5417 5.53942 10.956 7.12508 9.00002 7.12508C7.04401 7.12508 5.45835 5.53942 5.45835 3.58341Z"
                                            fill="#242B35"/>
                                        <path
                                            d="M8.16669 10.0417C4.2985 10.0417 1.29169 12.8138 1.29169 16.0834C1.29169 16.4286 1.01187 16.7084 0.666687 16.7084C0.321509 16.7084 0.041687 16.4286 0.041687 16.0834C0.041687 11.9891 3.75062 8.79175 8.16669 8.79175C8.51186 8.79175 8.79169 9.07157 8.79169 9.41675C8.79169 9.76193 8.51186 10.0417 8.16669 10.0417Z"
                                            fill="#242B35"/>
                                        <path
                                            d="M13.9747 10.2248L9.80808 14.3915C9.69087 14.5087 9.62502 14.6677 9.62502 14.8334V16.5001C9.62502 16.8453 9.90484 17.1251 10.25 17.1251H11.9167C12.0824 17.1251 12.2414 17.0592 12.3586 16.942L16.5253 12.7754C16.7694 12.5313 16.7694 12.1356 16.5253 11.8915L14.8586 10.2248C14.6146 9.98073 14.2188 9.98073 13.9747 10.2248ZM10.875 15.0923L14.4167 11.5506L15.1995 12.3334L11.6578 15.8751H10.875V15.0923Z"
                                            fill="#242B35"/>
                                        </svg>

                                    </span>
                                        <input
                                            type="text"
                                            id="firstName"
                                            {...register("firstName")}
                                            placeholder="Enter your first name"
                                            className="w-full px-4 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
                                        />
                                    </div>
                                    {errors.firstName && (
                                        <p className={errorClass}>{errors.firstName.message}</p>
                                    )}
                                </div>

                                <div className="w-full">
                                    <label htmlFor="lastName"
                                           className="block text-base font-inter font-normal text-[#222222]">
                                        Last Name
                                    </label>
                                    <div
                                        className="flex flex-row w-full px-2 items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
                                    <span className="left-0 mr-2 flex items-center pl-3 text-gray-500">
                                      <svg width="17" height="18" viewBox="0 0 17 18" fill="none"
                                           xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M9.00002 1.29175C7.73437 1.29175 6.70835 2.31776 6.70835 3.58341C6.70835 4.84907 7.73437 5.87508 9.00002 5.87508C10.2657 5.87508 11.2917 4.84907 11.2917 3.58341C11.2917 2.31776 10.2657 1.29175 9.00002 1.29175ZM5.45835 3.58341C5.45835 1.62741 7.04401 0.041748 9.00002 0.041748C10.956 0.041748 12.5417 1.62741 12.5417 3.58341C12.5417 5.53942 10.956 7.12508 9.00002 7.12508C7.04401 7.12508 5.45835 5.53942 5.45835 3.58341Z"
                                            fill="#242B35"/>
                                        <path
                                            d="M8.16669 10.0417C4.2985 10.0417 1.29169 12.8138 1.29169 16.0834C1.29169 16.4286 1.01187 16.7084 0.666687 16.7084C0.321509 16.7084 0.041687 16.4286 0.041687 16.0834C0.041687 11.9891 3.75062 8.79175 8.16669 8.79175C8.51186 8.79175 8.79169 9.07157 8.79169 9.41675C8.79169 9.76193 8.51186 10.0417 8.16669 10.0417Z"
                                            fill="#242B35"/>
                                        <path
                                            d="M13.9747 10.2248L9.80808 14.3915C9.69087 14.5087 9.62502 14.6677 9.62502 14.8334V16.5001C9.62502 16.8453 9.90484 17.1251 10.25 17.1251H11.9167C12.0824 17.1251 12.2414 17.0592 12.3586 16.942L16.5253 12.7754C16.7694 12.5313 16.7694 12.1356 16.5253 11.8915L14.8586 10.2248C14.6146 9.98073 14.2188 9.98073 13.9747 10.2248ZM10.875 15.0923L14.4167 11.5506L15.1995 12.3334L11.6578 15.8751H10.875V15.0923Z"
                                            fill="#242B35"/>
                                        </svg>

                                    </span>
                                        <input
                                            type="text"
                                            id="lastName"
                                            {...register("lastName")}
                                            placeholder="Enter your last name"
                                            className="w-full px-4 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
                                        />

                                    </div>
                                    {errors.lastName && (
                                        <p className={errorClass}>{errors.lastName.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-18">
                                <div className="w-full">
                                    <label htmlFor="contactNumber"
                                           className="block text-base font-inter font-normal text-[#222222]">
                                        Contact Number
                                    </label>
                                    <div
                                        className="flex flex-row w-full px-2 items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
                                    <span className="left-0 mr-2 flex items-center pl-3 text-gray-500">
                                      <svg width="14" height="18" viewBox="0 0 14 18" fill="none"
                                           xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M2.65716 0.889191L3.84287 0.532049C4.38263 0.369209 4.96319 0.408357 5.4762 0.642187C5.9892 0.876016 6.39958 1.28854 6.63073 1.80276L7.36859 3.44419C7.56741 3.88638 7.6228 4.37972 7.52697 4.85499C7.43115 5.33025 7.18893 5.76359 6.8343 6.09419L5.54502 7.29633C5.52959 7.31166 5.51658 7.32924 5.50644 7.34848C5.37145 7.62419 5.57645 8.36062 6.21859 9.47348C6.94287 10.7278 7.50216 11.2235 7.76145 11.147L9.45359 10.6292C9.917 10.4877 10.4131 10.4947 10.8723 10.6493C11.3315 10.8039 11.7308 11.0984 12.0143 11.4913L13.0629 12.9435C13.3921 13.3994 13.5446 13.9594 13.492 14.5193C13.4395 15.0792 13.1855 15.601 12.7772 15.9878L11.875 16.8413C11.5613 17.1385 11.1804 17.3553 10.7647 17.4734C10.349 17.5914 9.91094 17.6071 9.48787 17.5192C6.97573 16.9963 4.72502 14.9735 2.71644 11.4949C0.707158 8.01419 0.0807293 5.04991 0.887872 2.61205C1.02298 2.20391 1.25435 1.83429 1.56243 1.53442C1.8705 1.23455 2.24552 1.01324 2.65716 0.889191ZM2.96787 1.91491C2.72088 1.9893 2.49542 2.12205 2.31055 2.30195C2.12568 2.48185 1.98683 2.7036 1.90573 2.94848C1.21002 5.04919 1.77359 7.71776 3.64502 10.9592C5.51502 14.1985 7.54216 16.0199 9.70716 16.4699C9.96101 16.5226 10.2238 16.5131 10.4732 16.4422C10.7226 16.3713 10.9511 16.2411 11.1393 16.0628L12.0407 15.2099C12.2607 15.0017 12.3975 14.7208 12.4259 14.4193C12.4543 14.1177 12.3722 13.8162 12.195 13.5706L11.1464 12.1178C10.9938 11.9062 10.7789 11.7477 10.5317 11.6644C10.2844 11.5812 10.0174 11.5773 9.76787 11.6535L8.07145 12.1728C7.13287 12.452 6.25002 11.6699 5.29144 10.0085C4.4793 8.60276 4.19787 7.58705 4.54502 6.87776C4.61263 6.73967 4.70263 6.618 4.81502 6.51276L6.1043 5.31062C6.29533 5.13261 6.42582 4.89924 6.47745 4.64328C6.52907 4.38732 6.49925 4.12162 6.39216 3.88348L5.65359 2.24276C5.52913 1.96581 5.30811 1.74362 5.03182 1.6177C4.75552 1.49177 4.44284 1.47072 4.15216 1.55848L2.96787 1.91491Z"
                                            fill="black"/>
                                      </svg>
                                    </span>
                                        <input
                                            type="tel"
                                            id="contactNumber"
                                            {...register("contactNumber")}
                                            placeholder="Enter your contact number"
                                            className="w-full px-4 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
                                        />
                                    </div>
                                    {errors.contactNumber && (
                                        <p className={errorClass}>{errors.contactNumber.message}</p>
                                    )}
                                </div>

                                <div className="w-full">
                                    <label htmlFor="nicPassport"
                                           className="block text-base font-inter font-normal text-[#222222]">
                                        NIC/Passport
                                    </label>
                                    <div
                                        className="flex flex-row w-full px-2 items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
                                    <span className="left-0 mr-2 flex items-center pl-3 text-gray-500">
                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                           xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M10 13.5H10.001C10.5712 13.4994 11.0752 13.5504 11.5156 13.6494C11.9487 13.7468 12.3171 13.8975 12.6279 14.0947C12.9371 14.3016 13.1506 14.5081 13.2881 14.708C13.4225 14.9036 13.4746 15.0817 13.4746 15.25C13.4746 15.3357 13.4515 15.381 13.4062 15.4238C13.354 15.4732 13.2958 15.5 13.2002 15.5H6.7998C6.69524 15.5 6.63284 15.4719 6.58203 15.4268C6.53835 15.3879 6.52539 15.3564 6.52539 15.2998C6.52543 15.0874 6.58466 14.8875 6.71582 14.6904C6.81714 14.5383 6.96027 14.388 7.15332 14.2432L7.36328 14.1006L7.36816 14.0977C7.6799 13.8998 8.04945 13.7482 8.48438 13.6504C8.9251 13.5513 9.42945 13.5 10 13.5ZM16 11.5H19C19.1569 11.5 19.2646 11.5477 19.3574 11.6406C19.4278 11.7112 19.4732 11.7904 19.4912 11.8916L19.5 12.001C19.5004 12.1567 19.4531 12.2647 19.3594 12.3584C19.2656 12.4522 19.1571 12.5 19 12.5H15.998C15.8443 12.5007 15.7363 12.4541 15.6416 12.3594C15.5706 12.2883 15.5264 12.2097 15.5088 12.1094L15.5 12.001C15.5004 11.844 15.5487 11.7348 15.6426 11.6406C15.7354 11.5477 15.8431 11.5 16 11.5ZM9.99902 8.5C10.416 8.50106 10.7604 8.64431 11.0596 8.94238C11.3577 9.23953 11.5004 9.58239 11.5 9.99902C11.4995 10.4165 11.3568 10.7613 11.0586 11.0596C10.7604 11.3578 10.4165 11.5 10 11.5H9.99805C9.58519 11.502 9.24211 11.3603 8.94238 11.0596C8.64186 10.758 8.49958 10.414 8.5 10.001C8.5005 9.58677 8.64281 9.24153 8.94238 8.94043C9.2405 8.64083 9.58385 8.49899 9.99902 8.5ZM16 8.5H19C19.1569 8.5 19.2646 8.54766 19.3574 8.64062C19.4513 8.73479 19.4996 8.84402 19.5 9.00098C19.5004 9.15671 19.4531 9.26467 19.3594 9.3584C19.2656 9.45217 19.1571 9.5 19 9.5H15.998C15.8443 9.50073 15.7363 9.45406 15.6416 9.35938C15.5469 9.26463 15.4996 9.15618 15.5 9.00098C15.5004 8.84403 15.5487 8.73479 15.6426 8.64062C15.7354 8.54766 15.8431 8.5 16 8.5Z"
                                            stroke="#242B35"/>
                                      </svg>
                                    </span>
                                        <input
                                            type="text"
                                            id="nicPassport"
                                            {...register("nicPassport")}
                                            placeholder="Enter your NIC/Passport number"
                                            className="w-full px-4 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
                                        />
                                    </div>
                                    {errors.nicPassport && (
                                        <p className={errorClass}>{errors.nicPassport.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-18">
                                <div className="w-full">
                                    <label htmlFor="email"
                                           className="block text-base font-inter font-normal text-[#222222]">
                                        Email
                                    </label>
                                    <div
                                        className="flex flex-row w-full px-2 items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
                                    <span className="left-0 mr-2 flex items-center pl-3 text-gray-500">
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
                                            {...register("email")}
                                            placeholder="Enter your email address"
                                            className="w-full px-4 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className={errorClass}>{errors.email.message}</p>
                                    )}
                                </div>

                                <div className="w-full">
                                    <label htmlFor="country"
                                           className="block text-base font-inter font-normal text-[#222222]">
                                        Country
                                    </label>
                                    {/*<div*/}
                                    {/*    className="flex flex-row w-full px-2 items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">*/}
                                    {/*<span className="left-0 mr-2 flex items-center pl-3 text-gray-500">*/}
                                    {/*    {countryValue && getCountryCode(countryValue) ? (*/}
                                    {/*        <ReactCountryFlag*/}
                                    {/*            countryCode={getCountryCode(countryValue)!}*/}
                                    {/*            svg*/}
                                    {/*            style={{width: "20px", height: "15px"}}*/}
                                    {/*        />*/}
                                    {/*    ) : (*/}
                                    {/*        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"*/}
                                    {/*             xmlns="http://www.w3.org/2000/svg">*/}
                                    {/*            <path*/}
                                    {/*                d="M20 15.0001C20 15.5894 19.7659 16.1547 19.3491 16.5714C18.9324 16.9882 18.3671 17.2223 17.7778 17.2223H2.22222C1.63285 17.2223 1.06762 16.9882 0.650874 16.5714C0.234126 16.1547 0 15.5894 0 15.0001V5.00005C0 4.41068 0.234126 3.84545 0.650874 3.42871C1.06762 3.01196 1.63285 2.77783 2.22222 2.77783H17.7778C18.3671 2.77783 18.9324 3.01196 19.3491 3.42871C19.7659 3.84545 20 4.41068 20 5.00005V15.0001Z"*/}
                                    {/*                fill="#FFB700"/>*/}
                                    {/*            <path*/}
                                    {/*                d="M17.7778 3.33325H5.55554V16.6666H17.7778C18.6967 16.6666 19.4444 15.9188 19.4444 14.9999V4.99992C19.4444 4.08103 18.6967 3.33325 17.7778 3.33325Z"*/}
                                    {/*                fill="#8D2129"/>*/}
                                    {/*            <path*/}
                                    {/*                d="M2.22221 3.33325C1.30332 3.33325 0.555542 4.08103 0.555542 4.99992V14.9999C0.555542 15.9188 1.30332 16.6666 2.22221 16.6666H2.77776V3.33325H2.22221Z"*/}
                                    {/*                fill="#005641"/>*/}
                                    {/*            <path d="M2.77777 3.33325H4.99999V16.6666H2.77777V3.33325Z"*/}
                                    {/*                  fill="#FF5B00"/>*/}
                                    {/*            <path*/}
                                    {/*                d="M7.33279 5.58996C7.33279 5.58996 7.29557 5.05718 7.31334 4.61107C7.32501 4.31551 7.15945 3.95829 6.84668 4.00996C6.5339 4.06162 6.18668 3.99829 6.18668 3.99829C6.18668 3.99829 6.25612 4.20051 6.18668 4.39162C6.11723 4.58274 6.11723 4.98162 6.58612 5.03385C7.05501 5.08662 7.24612 5.3294 7.33279 5.58996ZM17.7128 5.58996C17.7128 5.58996 17.75 5.05718 17.7322 4.61107C17.7206 4.31551 17.8861 3.95829 18.1989 4.00996C18.5117 4.06162 18.8589 3.99829 18.8589 3.99829C18.8589 3.99829 18.7895 4.20051 18.8589 4.39162C18.9283 4.58274 18.9283 4.98162 18.4595 5.03385C17.9906 5.08662 17.7995 5.3294 17.7128 5.58996ZM7.33279 14.41C7.33279 14.41 7.29557 14.9433 7.31334 15.3894C7.32501 15.685 7.15945 16.0422 6.84668 15.99C6.5339 15.9377 6.18668 16.0016 6.18668 16.0016C6.18668 16.0016 6.25612 15.7988 6.18668 15.6077C6.11723 15.4166 6.11723 15.0177 6.58612 14.9655C7.05501 14.9133 7.24612 14.67 7.33279 14.41ZM17.7128 14.41C17.7128 14.41 17.75 14.9433 17.7322 15.3894C17.7206 15.685 17.8861 16.0422 18.1989 15.99C18.5117 15.9377 18.8589 16.0016 18.8589 16.0016C18.8589 16.0016 18.7895 15.7988 18.8589 15.6077C18.9283 15.4166 18.9283 15.0177 18.4595 14.9655C17.9906 14.9133 17.7995 14.67 17.7128 14.41ZM10.2256 7.43051C10.2256 7.43051 10.5556 7.41329 10.8856 7.32607C11.2156 7.2394 11.1111 6.92718 11.1111 6.92718C11.1111 6.92718 11.4061 6.77107 11.58 6.92718C11.7539 7.08329 11.9622 7.06607 11.8578 6.85774C12.17 6.70162 12.3089 7.04885 12.3089 7.04885C12.3089 7.04885 12.465 6.95051 12.5 6.81718C12.7778 6.78829 12.83 7.06607 13.0033 7.03107C13.1767 6.99607 13.2983 6.81496 13.2983 6.81496C13.2983 6.81496 13.3328 7.30885 13.0378 7.43051C13.2811 7.74274 13.2111 8.35051 13.2111 8.50718L13.0378 8.40274C13.0378 8.40274 13.1422 8.88885 13.1939 8.95829C13.2456 9.02773 13.0206 8.95829 13.0206 8.95829C13.0206 8.95829 13.1422 9.28829 13.2289 9.34051C13.3156 9.39273 14.9478 9.23607 15.4167 9.23607C15.8856 9.23607 16.5278 9.16662 16.5278 8.74996C16.5278 8.33329 15.9895 8.36773 15.3822 8.45496C14.7745 8.54162 14.3756 8.5244 14.1322 8.36829C13.8889 8.21218 13.6117 8.17162 13.6345 8.56496C13.2639 8.39162 13.53 8.02107 13.53 8.02107C13.53 8.02107 13.1072 7.55829 13.3767 7.09496C13.6456 6.63218 14.6872 6.49274 15.4167 6.89829C16.1461 7.30385 16.435 7.63885 16.7361 7.69718C16.7245 7.47718 17.095 7.31551 17.1411 7.72051C17.1872 8.12551 16.6778 8.0444 16.4583 7.91718C16.2389 7.78996 15.845 7.40774 15.845 7.40774C15.845 7.40774 15.8333 7.6394 15.9839 7.78996C15.5672 7.74385 15.475 7.43107 15.475 7.43107C15.475 7.43107 15.4511 7.76607 15.0695 7.77774C15.3472 7.45385 15.2545 7.18774 14.8728 7.04885C15.0928 7.3844 14.8845 7.67385 14.5606 7.71996C14.7806 7.40774 14.5956 7.04885 14.1906 6.9794C14.2483 7.23385 14.0517 7.30329 14.0517 7.30329C14.0517 7.30329 13.9595 7.07162 13.7739 7.19885C13.5883 7.32607 13.5417 7.6044 13.7845 7.77774C13.935 7.47662 14.2356 7.49996 14.34 7.62718C14.0278 7.66162 14.0395 7.95162 14.155 8.10162C14.2706 7.90496 14.3867 7.84718 14.5022 8.05551C14.6178 8.26385 14.965 8.25218 15.59 8.15996C16.215 8.06774 16.7906 8.13551 16.8861 8.69218C16.9672 9.16662 16.4928 9.39829 16.4928 9.39829C16.4928 9.39829 17.1061 9.86107 16.7128 10.8683C16.3195 11.8755 16.4817 12.2916 16.6317 12.3961C16.7817 12.5005 17.0139 12.5116 16.7011 12.7894C16.3883 13.0672 16.4695 13.2644 16.5967 13.4261C16.7239 13.5877 16.6895 13.75 16.3189 13.5416C16.1567 13.7038 15.995 13.6572 15.9022 13.5183C15.8095 13.6455 15.6361 13.6805 15.52 13.5416C15.4045 13.6344 15.2539 13.6344 15.335 13.4372C15.4161 13.24 15.8095 13.1594 15.925 13.125C16.0406 13.0905 16.0295 12.8816 15.9945 12.6505C15.9595 12.4194 15.7628 12.1761 15.3461 11.9561C15.1611 12.095 15.1839 12.2566 15.2533 12.3383C15.3228 12.42 15.5428 12.4427 15.5545 12.5116C15.5661 12.5805 15.4389 12.7316 15.3 12.8361C15.1611 12.9405 15.1845 13.1255 15.2306 13.2183C15.2767 13.3111 15.3345 13.5388 15.1839 13.645C15.0333 13.7505 14.8833 13.5077 14.8833 13.5077C14.8833 13.5077 14.79 13.7972 14.5245 13.5194C14.3739 13.705 14.2239 13.6355 14.1545 13.5311C14.0039 13.6816 13.7722 13.67 13.8883 13.4616C14.0045 13.2533 14.1428 13.2527 14.305 13.2416C14.4672 13.2305 14.6867 13.1961 14.6639 12.8716C14.6411 12.5472 14.5772 12.2177 14.3517 12.015C14.0045 11.7027 14.0622 11.3322 14.0622 11.3322C14.0622 11.3322 13.4833 11.2744 13.0322 11.5872C12.5811 11.9 12.2333 11.8994 12.2333 11.8994C12.2333 11.8994 11.9783 12.1772 11.9556 12.3505C11.9328 12.5238 12.0367 12.5822 12.1756 12.6283C12.3145 12.6744 12.4189 12.6627 12.21 12.8483C12.0011 13.0338 11.8278 13.0216 11.8278 13.0216C11.8278 13.0216 11.8172 13.2177 11.84 13.3333C11.8628 13.4488 11.7933 13.6494 11.6778 13.6705C11.5622 13.6916 11.3883 13.5416 11.3883 13.5416C11.3883 13.5416 11.1683 13.7733 10.995 13.53C10.7983 13.715 10.6245 13.6461 10.555 13.53C10.4395 13.715 10.2539 13.6344 10.37 13.4255C10.4861 13.2166 10.6478 13.1933 10.9256 13.2055C11.2033 13.2177 11.4345 12.9972 11.3306 12.7077C11.2267 12.4183 11.1339 12.025 11.1339 12.025C11.1339 12.025 10.9139 12.0016 10.59 11.8166C10.185 12.3027 10.0461 12.1294 9.93001 12.0366C9.8139 11.9438 9.53668 11.6894 9.53668 11.6894C9.53668 11.6894 9.38612 11.6777 9.40945 11.8166C9.24723 11.805 9.30501 11.5505 9.30501 11.4233C9.30501 11.2961 9.2589 11.1455 9.16612 11.1455C9.07334 11.1455 8.93445 11.1688 8.93445 11.1688C8.93445 11.1688 8.93445 11.2144 9.07334 11.2611C9.21223 11.3077 9.20057 11.4005 9.06168 11.4116C8.92279 11.4227 8.83001 11.4572 8.93445 11.5388C9.0389 11.6205 9.05001 11.6661 8.9689 11.7472C8.88779 11.8283 8.89945 12.0477 9.03834 12.1294C9.13112 11.9094 9.30445 12.0372 9.27001 12.1872C9.23557 12.3372 8.98057 12.3144 8.98057 12.3144L9.1539 12.5111L8.88945 12.5688C8.88945 12.5688 8.87612 12.7311 8.77223 12.7655C8.66834 12.8 8.64501 12.5222 8.64501 12.5222L8.40168 12.5105L8.5639 12.3138C8.5639 12.3138 8.33223 12.2327 8.32057 12.0938C8.3089 11.955 8.4939 12.0244 8.5289 12.0938C8.7139 12.0127 8.65612 11.8277 8.58668 11.7583C8.51723 11.6888 8.56334 11.6311 8.63279 11.55C8.70223 11.4688 8.69057 11.4227 8.58668 11.4455C8.48279 11.4683 8.3089 11.26 8.48223 11.26C8.65556 11.26 8.69056 11.2483 8.66723 11.1211C8.4589 11.0983 8.58612 10.9361 8.58612 10.9361C8.58612 10.9361 8.4239 10.82 8.54001 10.7394C8.43556 10.6472 8.41279 10.4961 8.52834 10.4733C8.4589 10.4155 8.55168 10.3111 8.55168 10.3111C8.55168 10.3111 8.21779 10.2544 8.21779 9.99996C8.21779 9.74551 8.50723 9.79162 8.50723 9.79162C8.50723 9.79162 8.47279 8.98162 8.55334 7.84718C8.6339 6.71274 9.1089 6.3194 9.39834 6.20385C9.09723 6.84051 9.13223 7.91662 9.13223 8.57662C9.13223 9.23662 9.12056 9.75718 9.12056 9.75718C9.12056 9.75718 9.44445 9.77996 9.42112 9.99996C9.39779 10.22 9.24779 10.2661 9.24779 10.2661L10 11.0183C10 11.0183 9.96556 10.2466 10.22 9.93829C10.4745 9.62996 10.8678 9.34051 10.9839 9.24774C11.1 9.15496 10.9122 8.9094 10.8222 9.17829C10.6911 9.16218 10.5789 8.94662 10.5789 8.94662C10.5789 8.94662 10.5906 9.02773 10.5095 9.08551C10.4283 9.14329 10.4517 8.88885 10.405 8.91218C10.3583 8.93551 10.2317 9.00496 10.0695 9.05107C10.0811 8.95829 10.1506 8.84273 10.1506 8.84273C10.1506 8.84273 9.94223 8.86551 9.75668 8.88885C9.75668 8.72662 9.86057 8.46051 9.95334 8.43774C9.72168 8.32218 9.78001 8.10218 9.8839 8.13662C9.98779 8.17107 10.4739 8.46051 11.0183 8.49551C10.845 8.29885 10.7061 8.0444 10.7061 8.0444L10.6483 8.24107L10.44 8.0444L10.4167 8.24107C10.4167 8.24107 9.90723 7.87051 9.81501 7.56996C9.72279 7.2694 9.82668 7.04829 10 7.07218C10.3356 7.11773 10.2256 7.43051 10.2256 7.43051Z"*/}
                                    {/*                fill="#FFB700"/>*/}
                                    {/*        </svg>*/}

                                    {/*    )}*/}
                                    {/*</span>*/}
                                    {/*    <input*/}
                                    {/*        type="text"*/}
                                    {/*        id="country"*/}
                                    {/*        {...register("country")}*/}
                                    {/*        placeholder="Enter your country"*/}
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

                                    {errors.country && (
                                        <p className={errorClass}>{errors.country.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-18">
                                <div className="w-full">
                                    <label htmlFor="password"
                                           className="block text-base font-inter font-normal text-[#222222]">
                                        Password
                                    </label>
                                    <div
                                        className="flex flex-row w-full px-2 justify-between items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
                                        <div className="flex flex-row">
                                        <span
                                            className="left-0 mr-2 flex items-center pl-3 text-gray-500">
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
                                                id="password"
                                                {...register("password")}
                                                placeholder="Create a password"
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
                                    {errors.password && (
                                        <p className={errorClass}>{errors.password.message}</p>
                                    )}
                                </div>

                                <div className="w-full">
                                    <label htmlFor="confirmPassword"
                                           className="block text-base font-inter font-normal text-[#222222]">
                                        Confirm Password
                                    </label>
                                    <div
                                        className="flex flex-row w-full px-2 items-center py-2 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
                                    <span
                                        className="left-0 mr-2 flex items-center pl-3 text-gray-500">
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
                                            {...register("confirmPassword")}
                                            placeholder="Confirm your password"
                                            className="w-full px-4 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="right-0 mr-3 flex items-center text-gray-500 hover:text-gray-700"
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
                                    {errors.confirmPassword && (
                                        <p className={errorClass}>{errors.confirmPassword.message}</p>
                                    )}
                                </div>
                            </div>

                            <p className="text-sm text-[#505050] font-inter">
                                Must be at least 8 characters.
                            </p>

                            {/* Submit Button */}
                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    className="md:w-110 w-60 px-4 py-3 mt-4 cursor-pointer text-white  bg-[#27337C] font-inter font-medium text-sm border-2 border-[#27337C] hover:bg-indigo-800 transition-colors duration-200 rounded-md focus:outline-none focus:bg-indigo-800"
                                >
                                    {createUserMutation.isPending ? 'Creating Account...' : 'Create an account'}
                                </button>
                            </div>

                            {/* Login Link */}
                            <p className="mt-3 mb-10 text-center text-base text-[#6A6A6A] font-inter">
                                Already have an account?{' '}
                                <a href="/login" className="text-[#222222] font-medium hover:text-indigo-500">
                                    Log In
                                </a>
                            </p>
                        </form>
                    )}

                    {currentStep === 2 && (
                        <div>
                            {/*<SectionTitle title="OTP Verification"/>*/}
                            <form onSubmit={handleSubmitOtp(onSubmitOtp)} noValidate
                                  className="space-y-4 max-w-[406px] justify-center mx-auto mt-12">

                                {otpServerError && <p className={errorClass}>{otpServerError}</p>}
                                <p className="text-center text-sm text-gray-600">
                                    Thank you for registering with us. Please type the OTP os shared on your email{" "}
                                    <span className="font-semibold">{emailForOtpVerification}</span>.
                                </p>


                                <input type="hidden" {...registerOtp("email")} />

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
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                autoComplete="one-time-code"
                                            />
                                        ))}
                                    </div>
                                    {otpErrors.otp && (
                                        <p className={errorClass}>{otpErrors.otp.message}</p>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    disabled={validateOtpCode.isPending || isOtpSubmitting}
                                    className="w-full cursor-pointer px-4 py-5 mt-4  bg-[#27337C] text-white font-inter font-medium text-sm border-2 border-[#27337C] hover:bg-indigo-800 transition-colors duration-200 rounded-md focus:outline-none focus:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {validateOtpCode.isPending ? 'Verifying...' : 'Verify OTP'}
                                </button>

                                {/* Resend OTP Section */}
                                <div className="text-center text-base text-[#6A6A6A] font-inter mt-4">
                                    {resendOtpCountdown > 0 ? (
                                        <p>Resend OTP in {resendOtpCountdown} seconds</p>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleSendOtp(true)} // Call the shared send OTP function
                                            disabled={isResendingOtp || sendOtpCode.isPending}
                                            className="text-[#222222] font-medium hover:text-indigo-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isResendingOtp || sendOtpCode.isPending ? 'Sending...' : 'Resend OTP'}
                                        </button>
                                    )}
                                </div>

                                <p className="mt-3 text-center text-base text-[#6A6A6A] font-inter">
                                    Wrong email?{' '}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCurrentStep(1);
                                            setOtpServerError(null);
                                            setOtpDigits(['', '', '', '']);
                                            resetOtpForm();
                                            setEmailForOtpVerification('');
                                            setResendOtpCountdown(0);
                                            setIsResendingOtp(false);
                                            reset();
                                        }}
                                        className="text-[#222222] font-medium hover:text-indigo-500"
                                    >
                                        Go back
                                    </button>
                                </p>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default RegisterPage;