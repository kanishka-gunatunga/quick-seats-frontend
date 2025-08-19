"use client";
import React from "react";
import HeroSection from "@/components/HeroSection";
import SectionTitle from "@/components/SectionTitle";
import Link from "next/link";
import Newsletter from "@/components/NewsLetter";
import {TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio} from "@mui/material";
import {z} from "zod";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useInquiryApi} from "@/hooks/useUser";

interface HeroProps {
    image: string;
    title: string;
    subTitle: string;
}

interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    subject: "General Inquiry" | "Refund Request" | "Technical Issue" | "Event Listing";
    message: string;
}

// Zod schema for form validation
const formSchema = z.object({
    firstName: z.string().min(2, "First Name must be at least 2 characters").nonempty("First Name is required"),
    lastName: z.string().min(2, "Last Name must be at least 2 characters").nonempty("Last Name is required"),
    email: z.string().email("Invalid email address").nonempty("Email is required"),
    phoneNumber: z
        .string()
        .regex(/^\+?\d{10,15}$/, "Phone number must be 10-15 digits")
        .nonempty("Phone Number is required"),
    subject: z.enum(["General Inquiry", "Refund Request", "Technical Issue", "Event Listing"], {
        errorMap: () => ({message: "Subject is required"}),
    }),
    message: z.string().min(10, "Message must be at least 10 characters").nonempty("Message is required"),
});

const ContactUsPage = () => {
    const hero: HeroProps = {
        image: "/contact-us-hero.png",
        title: "Contact Us",
        subTitle: "Discover your favorite entertainment right here",
    };

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: {errors, isSubmitting},
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            subject: "General Inquiry",
            message: "",
        },
    });

    // const onSubmit = async (data: FormValues) => {
    //     try {
    //         // Simulate form submission (replace with actual API call)
    //         console.log("Form submitted:", data);
    //         reset();
    //         alert("Message sent successfully!");
    //     } catch (err) {
    //         console.error("Submission error:", err);
    //     }
    // };

    const mutation = useInquiryApi();

    const onSubmit = async (data: FormValues) => {
        try {
            await mutation.mutateAsync(data);
            reset();
            alert("Message sent successfully!");
        } catch (err) {
            alert("Failed to send message. Please try again.");
            console.log(err);
        }
    };

    return (
        <div className="min-h-screen">
            <HeroSection hero={hero}/>
            <div className="py-8 px-4 sm:px-6 lg:px-8 rounded-b-[50px] lg:rounded-b-[100px] -mt-20 bg-[#F4FCFF]">
                <div className="max-w-7xl mt-20 mx-auto">
                    <div>
                        <SectionTitle title="Contact Us"/>
                    </div>
                    <div className="py-6 sm:py-8 lg:py-10">
                        <div
                            className="p-2 sm:p-4 flex flex-col lg:flex-row gap-4 sm:gap-6 bg-white rounded-md shadow-md">
                            {/* Contact Information */}
                            <div
                                className="w-full 2xl:w-1/3 lg:2/5 bg-[#27337C] text-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-lg">
                                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[28px] font-inter font-semibold mb-3 sm:mb-4">
                                    Contact Information
                                </h3>
                                <p className="text-xs sm:text-sm md:text-base lg:text-lg font-normal text-[#C9C9C9] font-inter mb-3 sm:mb-4">
                                    Say something to start a live chat!
                                </p>
                                <div className="space-y-4 sm:space-y-6 mt-6 sm:mt-10 lg:mt-20">
                                    <div
                                        className="text-xs sm:text-sm lg:text-base font-inter gap-4 flex justify-start items-start">
                                        <svg width="35" height="36" viewBox="0 0 35 36" fill="none"
                                             className="w-8 h-8 sm:w-10 sm:h-10" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="17.5" cy="18.3949" r="17.5" fill="#F6F5FF"/>
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M17.0003 10.5616C20.2253 10.5616 22.8337 13.1699 22.8337 16.3949C22.8337 20.7699 17.0003 27.2283 17.0003 27.2283C17.0003 27.2283 11.167 20.7699 11.167 16.3949C11.167 13.1699 13.7753 10.5616 17.0003 10.5616ZM12.8337 16.3949C12.8337 18.7699 15.267 22.4033 17.0003 24.6283C18.767 22.3866 21.167 18.7949 21.167 16.3949C21.167 14.0949 19.3003 12.2283 17.0003 12.2283C14.7003 12.2283 12.8337 14.0949 12.8337 16.3949ZM17.0003 18.4783C15.8497 18.4783 14.917 17.5455 14.917 16.3949C14.917 15.2443 15.8497 14.3116 17.0003 14.3116C18.1509 14.3116 19.0837 15.2443 19.0837 16.3949C19.0837 17.5455 18.1509 18.4783 17.0003 18.4783Z"
                                                fill="#27337C"
                                            />
                                        </svg>
                                        <span className="max-w-40 sm:max-w-56 2xl:max-w-64">
                      487/4K, <br/>Old Kottawa Road,<br/>Udahamulla,Nugegoda
                    </span>
                                    </div>
                                    <div
                                        className="text-xs sm:text-sm lg:text-base font-inter gap-4 flex justify-start items-center">
                                        <svg width="35" height="36" viewBox="0 0 35 36" fill="none"
                                             className="w-8 h-8 sm:w-10 sm:h-10" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="17.5" cy="18.3949" r="17.5" fill="#F6F5FF"/>
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M25.3337 13.8949C25.3337 12.9783 24.5837 12.2283 23.667 12.2283H10.3337C9.41699 12.2283 8.66699 12.9783 8.66699 13.8949V23.8949C8.66699 24.8116 9.41699 25.5616 10.3337 25.5616H23.667C24.5837 25.5616 25.3337 24.8116 25.3337 23.8949V13.8949ZM23.667 13.8949L17.0003 18.0616L10.3337 13.8949H23.667ZM23.667 23.8949H10.3337V15.5616L17.0003 19.7283L23.667 15.5616V23.8949Z"
                                                fill="#27337C"
                                            />
                                        </svg>
                                        <span className="max-w-64">quickseats.lk@gmail.com</span>
                                    </div>
                                    <div
                                        className="text-xs sm:text-sm lg:text-base font-inter gap-4 flex justify-start items-center">
                                        <svg width="35" height="36" viewBox="0 0 35 36" fill="none"
                                             className="w-8 h-8 sm:w-10 sm:h-10" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="17.5" cy="18.3949" r="17.5" fill="#F6F5FF"/>
                                            <rect width="24" height="24" transform="translate(5 6.8949)"
                                                  fill="#F6F5FF"/>
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M12.4498 13.0616C12.4998 13.8032 12.6248 14.5282 12.8248 15.2199L11.8248 16.2199C11.4832 15.2199 11.2665 14.1616 11.1915 13.0616H12.4498ZM20.6668 23.0782C21.3752 23.2782 22.1002 23.4032 22.8335 23.4532V24.6949C21.7335 24.6199 20.6752 24.4032 19.6668 24.0699L20.6668 23.0782ZM13.25 11.3949H10.3333C9.875 11.3949 9.5 11.7699 9.5 12.2282C9.5 20.0532 15.8417 26.3949 23.6667 26.3949C24.125 26.3949 24.5 26.0199 24.5 25.5616V22.6532C24.5 22.1949 24.125 21.8199 23.6667 21.8199C22.6333 21.8199 21.625 21.6532 20.6917 21.3449C20.6083 21.3116 20.5167 21.3032 20.4333 21.3032C20.2167 21.3032 20.0083 21.3866 19.8417 21.5449L18.0083 23.3782C15.65 22.1699 13.7167 20.2449 12.5167 17.8866L14.35 16.0532C14.5833 15.8199 14.65 15.4949 14.5583 15.2032C14.25 14.2699 14.0833 13.2699 14.0833 12.2282C14.0833 11.7699 13.7083 11.3949 13.25 11.3949Z"
                                                fill="#27337C"
                                            />
                                        </svg>
                                        <span className="max-w-64">
                      +94 78 9124 124
                    </span>
                                    </div>
                                </div>
                                <div className="flex space-x-3 sm:space-x-4 relative mt-5 sm:mt-16">
                                    <Link href="https://www.facebook.com/share/1CKXG1pyuc/" className="text-white">
                                        <svg width="40" height="40" viewBox="0 0 45 46" fill="none"
                                             className="w-8 h-8 sm:w-10 sm:h-10" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="22.5" cy="23.3662" r="21.5" fill="white" stroke="#2D2A70"
                                                    strokeWidth="2"/>
                                            <path
                                                d="M22 13.8662C16.477 13.8662 12 18.3432 12 23.8662C12 28.8572 15.657 32.9942 20.438 33.7452V26.7562H17.898V23.8662H20.438V21.6632C20.438 19.1572 21.93 17.7732 24.215 17.7732C25.309 17.7732 26.453 17.9682 26.453 17.9682V20.4282H25.193C23.95 20.4282 23.563 21.1992 23.563 21.9902V23.8662H26.336L25.893 26.7562H23.563V33.7452C28.343 32.9952 32 28.8562 32 23.8662C32 18.3432 27.523 13.8662 22 13.8662Z"
                                                fill="#27337C"
                                            />
                                        </svg>
                                    </Link>
                                    <Link href="https://www.instagram.com/quick_seats?igsh=ZGkyaXE1ZmZscWJp"
                                          className="text-white">
                                        <svg width="40" height="40" viewBox="0 0 45 46" fill="none"
                                             className="w-8 h-8 sm:w-10 sm:h-10" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="22.5" cy="23.3662" r="21.5" fill="white" stroke="#2D2A70"
                                                    strokeWidth="2"/>
                                            <path
                                                d="M23 13.8662C25.717 13.8662 26.056 13.8762 27.122 13.9262C28.187 13.9762 28.912 14.1432 29.55 14.3912C30.21 14.6452 30.766 14.9892 31.322 15.5442C31.8305 16.0441 32.224 16.6488 32.475 17.3162C32.722 17.9532 32.89 18.6792 32.94 19.7442C32.987 20.8102 33 21.1492 33 23.8662C33 26.5832 32.99 26.9222 32.94 27.9882C32.89 29.0532 32.722 29.7782 32.475 30.4162C32.2247 31.084 31.8311 31.6888 31.322 32.1882C30.822 32.6965 30.2173 33.09 29.55 33.3412C28.913 33.5882 28.187 33.7562 27.122 33.8062C26.056 33.8532 25.717 33.8662 23 33.8662C20.283 33.8662 19.944 33.8562 18.878 33.8062C17.813 33.7562 17.088 33.5882 16.45 33.3412C15.7823 33.0907 15.1775 32.6972 14.678 32.1882C14.1694 31.6884 13.7759 31.0837 13.525 30.4162C13.277 29.7792 13.11 29.0532 13.06 27.9882C13.013 26.9222 13 26.5832 13 23.8662C13 21.1492 13.01 20.8102 13.06 19.7442C13.11 18.6782 13.277 17.9542 13.525 17.3162C13.7752 16.6484 14.1688 16.0435 14.678 15.5442C15.1777 15.0354 15.7824 14.6419 16.45 14.3912C17.088 14.1432 17.812 13.9762 18.878 13.9262C19.944 13.8792 20.283 13.8662 23 13.8662ZM23 18.8662C21.6739 18.8662 20.4021 19.393 19.4645 20.3307C18.5268 21.2684 18 22.5401 18 23.8662C18 25.1923 18.5268 26.4641 19.4645 27.4017C20.4021 28.3394 21.6739 28.8662 23 28.8662C24.3261 28.8662 25.5979 28.3394 26.5355 27.4017C27.4732 26.4641 28 25.1923 28 23.8662C28 22.5401 27.4732 21.2684 26.5355 20.3307C25.5979 19.393 24.3261 18.8662 23 18.8662ZM29.5 18.6162C29.5 18.2847 29.3683 17.9667 29.1339 17.7323C28.8995 17.4979 28.5815 17.3662 28.25 17.3662C27.9185 17.3662 27.6005 17.4979 27.3661 17.7323C27.1317 17.9667 27 18.2847 27 18.6162C27 18.9477 27.1317 19.2657 27.3661 19.5001C27.6005 19.7345 27.9185 19.8662 28.25 19.8662C28.5815 19.8662 28.8995 19.7345 29.1339 19.5001C29.3683 19.2657 29.5 18.9477 29.5 18.6162ZM23 20.8662C23.7956 20.8662 24.5587 21.1823 25.1213 21.7449C25.6839 22.3075 26 23.0706 26 23.8662C26 24.6619 25.6839 25.4249 25.1213 25.9875C24.5587 26.5501 23.7956 26.8662 23 26.8662C22.2044 26.8662 21.4413 26.5501 20.8787 25.9875C20.3161 25.4249 20 24.6619 20 23.8662C20 23.0706 20.3161 22.3075 20.8787 21.7449C21.4413 21.1823 22.2044 20.8662 23 20.8662Z"
                                                fill="#27337C"
                                            />
                                        </svg>
                                    </Link>
                                    <Link href="https://www.tiktok.com/@quick.seats?_t=ZS-8xWVHI1TyZ0&_r=1" className="text-white">
                                        <svg width="40" height="40" viewBox="0 0 45 46" fill="none"
                                             className="w-8 h-8 sm:w-10 sm:h-10" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="22.5" cy="23.3662" r="21.5" fill="white" stroke="#2D2A70"
                                                    strokeWidth="2"/>
                                            <path
                                                d="M16 18.8662C17.1046 18.8662 18 17.9708 18 16.8662C18 15.7616 17.1046 14.8662 16 14.8662C14.8954 14.8662 14 15.7616 14 16.8662C14 17.9708 14.8954 18.8662 16 18.8662Z"
                                                fill="#27337C"
                                            />
                                            <path
                                                d="M17.6667 20.1993H14.3333C14.1493 20.1993 14 20.3487 14 20.5327V30.5327C14 30.7167 14.1493 30.866 14.3333 30.866H17.6667C17.8507 30.866 18 30.7167 18 30.5327V20.5327C18 20.3487 17.8507 20.1993 17.6667 20.1993Z"
                                                fill="#27337C"
                                            />
                                            <path
                                                d="M27.5977 19.7405C26.173 19.2525 24.391 19.6811 23.3223 20.4498C23.2857 20.3065 23.155 20.1998 22.9997 20.1998H19.6663C19.4823 20.1998 19.333 20.3491 19.333 20.5331V30.5331C19.333 30.7171 19.4823 30.8665 19.6663 30.8665H22.9997C23.1837 30.8665 23.333 30.7171 23.333 30.5331V23.3465C23.8717 22.8825 24.5657 22.7345 25.1337 22.9758C25.6843 23.2085 25.9997 23.7765 25.9997 24.5331V30.5331C25.9997 30.7171 26.149 30.8665 26.333 30.8665H29.6663C29.8503 30.8665 29.9997 30.7171 29.9997 30.5331V23.8618C29.9617 21.1225 28.673 20.1085 27.5977 19.7405Z"
                                                fill="#27337C"
                                            />
                                        </svg>
                                    </Link>
                                    <Link href="https://youtube.com/@quickseats-e2e?si=0UK-FfyMW0ps5MKj"
                                          className="text-white">
                                        <svg width="40" height="40" viewBox="0 0 45 46" fill="none"
                                             className="w-8 h-8 sm:w-10 sm:h-10" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="22.5" cy="23.3662" r="21.5" fill="white" stroke="#2D2A70"
                                                    strokeWidth="2"/>
                                            <path
                                                d="M21 26.8662L26.19 23.8662L21 20.8662V26.8662ZM32.56 19.0362C32.69 19.5062 32.78 20.1362 32.84 20.9362C32.91 21.7362 32.94 22.4262 32.94 23.0262L33 23.8662C33 26.0562 32.84 27.6662 32.56 28.6962C32.31 29.5962 31.73 30.1762 30.83 30.4262C30.36 30.5562 29.5 30.6462 28.18 30.7062C26.88 30.7762 25.69 30.8062 24.59 30.8062L23 30.8662C18.81 30.8662 16.2 30.7062 15.17 30.4262C14.27 30.1762 13.69 29.5962 13.44 28.6962C13.31 28.2262 13.22 27.5962 13.16 26.7962C13.09 25.9962 13.06 25.3062 13.06 24.7062L13 23.8662C13 21.6762 13.16 20.0662 13.44 19.0362C13.69 18.1362 14.27 17.5562 15.17 17.3062C15.64 17.1762 16.5 17.0862 17.82 17.0262C19.12 16.9562 20.31 16.9262 21.41 16.9262L23 16.8662C27.19 16.8662 29.8 17.0262 30.83 17.3062C31.73 17.5562 32.31 18.1362 32.56 19.0362Z"
                                                fill="#27337C"
                                            />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                            {/* Contact Form */}
                            <div className="w-full 2xl:w-2/3 lg:3/5 p-4 sm:p-6 md:p-8 lg:p-10">
                                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-[28px] font-medium text-[#2D3192] mb-3 sm:mb-4">
                                    Reach out to us for any inquiries
                                </h3>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                                    <div
                                        className="flex flex-col sm:flex-row justify-between mt-8 sm:mt-12 lg:mt-16 gap-4 sm:gap-6 lg:gap-10">
                                        <div
                                            className="w-full flex flex-col gap-2 font-inter font-medium text-[#8D8D8D] text-xs sm:text-sm">
                                            <p>First Name</p>
                                            <TextField
                                                id="firstName"
                                                {...register("firstName")}
                                                variant="standard"
                                                error={!!errors.firstName}
                                                helperText={errors.firstName?.message}
                                            />
                                        </div>
                                        <div
                                            className="w-full flex flex-col gap-2 font-inter font-medium text-[#8D8D8D] text-xs sm:text-sm">
                                            <p>Last Name</p>
                                            <TextField
                                                id="lastName"
                                                {...register("lastName")}
                                                variant="standard"
                                                error={!!errors.lastName}
                                                helperText={errors.lastName?.message}
                                            />
                                        </div>
                                    </div>
                                    <div
                                        className="flex flex-col sm:flex-row justify-between mt-8 sm:mt-12 lg:mt-16 gap-4 sm:gap-6 lg:gap-10">
                                        <div
                                            className="w-full flex flex-col gap-2 font-inter font-medium text-[#8D8D8D] text-xs sm:text-sm">
                                            <p>Email</p>
                                            <TextField
                                                id="email"
                                                {...register("email")}
                                                variant="standard"
                                                error={!!errors.email}
                                                helperText={errors.email?.message}
                                            />
                                        </div>
                                        <div
                                            className="w-full flex flex-col gap-2 font-inter font-medium text-[#8D8D8D] text-xs sm:text-sm">
                                            <p>Phone Number</p>
                                            <TextField
                                                id="phoneNumber"
                                                {...register("phoneNumber")}
                                                variant="standard"
                                                error={!!errors.phoneNumber}
                                                helperText={errors.phoneNumber?.message}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-8 sm:mt-12 lg:mt-16">
                                        <FormControl error={!!errors.subject}>
                                            <FormLabel
                                                id="demo-row-radio-buttons-group-label"
                                                style={{
                                                    fontWeight: 600,
                                                    color: "#8D8D8D",
                                                    fontSize: "12px",
                                                }}
                                            >
                                                Select Subject?
                                            </FormLabel>
                                            {/*<RadioGroup*/}
                                            {/*    row*/}
                                            {/*    aria-labelledby="demo-row-radio-buttons-group-label"*/}
                                            {/*    {...register("subject")}*/}
                                            {/*    defaultValue="General Inquiry"*/}
                                            {/*    style={{ fontSize: "12px", color: "#011C2A" }}*/}
                                            {/*>*/}
                                            <Controller
                                                name="subject"
                                                control={control}
                                                render={({field}) => (
                                                    <RadioGroup
                                                        row
                                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.value)} // Update form state on change
                                                        value={field.value || "General Inquiry"} // Ensure controlled value
                                                    >
                                                        <FormControlLabel
                                                            value="General Inquiry"
                                                            control={<Radio/>}
                                                            label="General Inquiry"
                                                            style={{fontSize: "12px", color: "#011C2A"}}
                                                        />
                                                        <FormControlLabel
                                                            value="Refund Request"
                                                            control={<Radio/>}
                                                            label="Refund Request"
                                                            style={{fontSize: "12px", color: "#011C2A"}}
                                                        />
                                                        <FormControlLabel
                                                            value="Technical Issue"
                                                            control={<Radio/>}
                                                            label="Technical Issue"
                                                            style={{fontSize: "12px", color: "#011C2A"}}
                                                        />
                                                        <FormControlLabel
                                                            value="Event Listing"
                                                            control={<Radio/>}
                                                            label="Event Listing"
                                                            style={{fontSize: "12px", color: "#011C2A"}}
                                                        />
                                                    </RadioGroup>
                                                )}
                                            />
                                            {errors.subject &&
                                                <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                                        </FormControl>
                                    </div>
                                    <div
                                        className="w-full flex flex-col gap-2 mt-8 sm:mt-12 lg:mt-16 font-inter font-medium text-[#8D8D8D] text-xs sm:text-sm">
                                        <p>Message</p>
                                        <TextField
                                            id="message"
                                            {...register("message")}
                                            placeholder="Write your message.."
                                            multiline
                                            maxRows={4}
                                            variant="standard"
                                            error={!!errors.message}
                                            helperText={errors.message?.message}
                                        />
                                    </div>
                                    <div className="flex justify-end mt-4 sm:mt-6">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`w-max bg-[#27337C] font-inter font-medium text-xs sm:text-sm text-white py-2 sm:py-3 px-4 sm:px-6 rounded-md hover:bg-blue-800 transition-colors ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                                        >
                                            {isSubmitting ? "Sending..." : "Send Message"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Newsletter/>
        </div>
    );
};

export default ContactUsPage;