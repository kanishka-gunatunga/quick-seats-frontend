// import React, {forwardRef, useImperativeHandle, useState} from "react";
//
// interface ProfileData {
//     firstName: string;
//     lastName: string;
//     gender: string;
//     nicPassport: string;
//     contactNumber: string;
//     addressLine1: string;
//     addressLine2: string;
//     city: string;
//     dateOfBirth: string;
//     email: string;
//     country: string;
// }
//
// interface ProfileFormRef {
//     submit: () => void;
// }
//
//
// // eslint-disable-next-line react/display-name
// const ProfileForm = forwardRef<ProfileFormRef>((props, ref) => {
//
//     const [profileData, setProfileData] = useState<ProfileData>({
//         firstName: '',
//         lastName: '',
//         gender: '',
//         nicPassport: '',
//         contactNumber: '',
//         addressLine1: '',
//         addressLine2: '',
//         city: '',
//         dateOfBirth: '',
//         email: '',
//         country: '',
//     });
//
//
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const {name, value} = e.target;
//         setProfileData((prevData) => ({
//             ...prevData,
//             [name]: value,
//         }));
//     };
//
//     const handleSubmit = (e?: React.FormEvent) => {
//         if (e) e.preventDefault();
//         console.log("Profile Data Submitted:", profileData);
//     };
//
//     useImperativeHandle(ref, () => ({
//         submit: handleSubmit,
//     }));
//
//     return (
//         <form onSubmit={handleSubmit} className="space-y-4 max-w-5xl">
//             <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-18">
//                 <div className="w-full">
//                     <label htmlFor="firstName"
//                            className="block text-base lg:text-[22px] font-inter font-medium text-[#222222]">
//                         First Name
//                     </label>
//                     <div
//                         className="flex flex-row w-full px-1 items-center py-1 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
//                         <input
//                             type="text"
//                             id="firstName"
//                             value={profileData.firstName}
//                             onChange={handleChange}
//                             placeholder="Enter your first name"
//                             className="w-full px-2 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
//                         />
//                     </div>
//                 </div>
//
//                 {/* Last Name */}
//                 <div className="w-full">
//                     <label htmlFor="lastName"
//                            className="block text-base lg:text-[22px] font-inter font-medium text-[#222222]">
//                         Last Name
//                     </label>
//                     <div
//                         className="flex flex-row w-full px-1 items-center py-1 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
//                         <input
//                             type="text"
//                             id="lastName"
//                             value={profileData.lastName}
//                             onChange={handleChange}
//                             placeholder="Enter your last name"
//                             className="w-full px-2 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
//                         />
//
//                     </div>
//                 </div>
//             </div>
//             <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-18">
//                 <div className="w-full">
//                     <label htmlFor="gender"
//                            className="block text-base lg:text-[22px] font-inter font-medium text-[#222222]">
//                         Gender
//                     </label>
//                     <div
//                         className="flex flex-row w-full px-1 items-center py-1 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
//                         <input
//                             type="text"
//                             id="gender"
//                             value={profileData.gender}
//                             onChange={handleChange}
//                             placeholder="Enter your Gender"
//                             className="w-full px-2 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
//                         />
//                     </div>
//                 </div>
//
//                 {/* Last Name */}
//                 <div className="w-full">
//                     <label htmlFor="dateOfBirth"
//                            className="block text-base lg:text-[22px] font-inter font-medium text-[#222222]">
//                         Date of Birth
//                     </label>
//                     <div
//                         className="flex flex-row w-full px-1 items-center py-1 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
//                         <input
//                             type="text"
//                             id="dateOfBirth"
//                             value={profileData.dateOfBirth}
//                             onChange={handleChange}
//                             placeholder="Date / Month / Year"
//                             className="w-full px-2 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
//                         />
//
//                     </div>
//                 </div>
//             </div>
//             <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-18">
//                 <div className="w-full">
//                     <label htmlFor="nicPassport"
//                            className="block text-base lg:text-[22px] font-inter font-medium text-[#222222]">
//                         NIC / Passport
//                     </label>
//                     <div
//                         className="flex flex-row w-full px-1 items-center py-1 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
//                         <input
//                             type="text"
//                             id="nicPassport"
//                             value={profileData.nicPassport}
//                             onChange={handleChange}
//                             placeholder="Enter your NIC / Passport"
//                             className="w-full px-2 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
//                         />
//                     </div>
//                 </div>
//
//                 {/* Last Name */}
//                 <div className="w-full">
//                     <label htmlFor="email"
//                            className="block text-base lg:text-[22px] font-inter font-medium text-[#222222]">
//                         Email
//                     </label>
//                     <div
//                         className="flex flex-row w-full px-1 items-center py-1 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
//                         <input
//                             type="text"
//                             id="email"
//                             value={profileData.email}
//                             onChange={handleChange}
//                             placeholder="Enter your Email"
//                             className="w-full px-2 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
//                         />
//
//                     </div>
//                 </div>
//             </div>
//             <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-18">
//                 <div className="w-full">
//                     <label htmlFor="contactNumber"
//                            className="block text-base lg:text-[22px] font-inter font-medium text-[#222222]">
//                         Contact Number
//                     </label>
//                     <div
//                         className="flex flex-row w-full px-1 items-center py-1 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
//                         <input
//                             type="text"
//                             id="contactNumber"
//                             value={profileData.contactNumber}
//                             onChange={handleChange}
//                             placeholder="Enter your contact number"
//                             className="w-full px-2 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
//                         />
//                     </div>
//                 </div>
//
//                 {/* Last Name */}
//                 <div className="w-full">
//                     <label htmlFor="country"
//                            className="block text-base lg:text-[22px] font-inter font-medium text-[#222222]">
//                         Country
//                     </label>
//                     <div
//                         className="flex flex-row w-full px-1 items-center py-1 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
//                         <input
//                             type="text"
//                             id="country"
//                             value={profileData.country}
//                             onChange={handleChange}
//                             placeholder="Enter your first name"
//                             className="w-full px-2 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
//                         />
//
//                     </div>
//                 </div>
//             </div>
//             <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-18">
//                 <div className="w-full">
//                     <label htmlFor="addressLine1"
//                            className="block text-base lg:text-[22px] font-inter font-medium text-[#222222]">
//                         Address Line 1
//                     </label>
//                     <div
//                         className="flex flex-row w-full px-1 items-center py-1 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
//                         <input
//                             type="text"
//                             id="addressLine1"
//                             value={profileData.addressLine1}
//                             onChange={handleChange}
//                             placeholder="Enter your Address Line 1"
//                             className="w-full px-2 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
//                         />
//                     </div>
//                 </div>
//
//                 {/* Last Name */}
//                 <div className="w-full">
//                     <label htmlFor="addressLine2"
//                            className="block text-base lg:text-[22px] font-inter font-medium text-[#222222]">
//                         Address Line 2
//                     </label>
//                     <div
//                         className="flex flex-row w-full px-1 items-center py-1 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
//                         <input
//                             type="text"
//                             id="addressLine2"
//                             value={profileData.addressLine2}
//                             onChange={handleChange}
//                             placeholder="Enter your Address Line 2"
//                             className="w-full px-2 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
//                         />
//
//                     </div>
//                 </div>
//             </div>
//             <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-18">
//                 <div className="w-1/2">
//                     <label htmlFor="city"
//                            className="block text-base lg:text-[22px] font-inter font-medium text-[#222222]">
//                         City
//                     </label>
//                     <div
//                         className="flex flex-row w-full px-1 items-center py-1 mt-2 border-3 border-[#EDF1F7] hover:border-[#2D3192]/50 rounded-md focus:outline-[#2D3192] focus:border-blue-500">
//                         <input
//                             type="text"
//                             id="city"
//                             value={profileData.city}
//                             onChange={handleChange}
//                             placeholder="Enter your City"
//                             className="w-full px-2 py-2 rounded-lg font-inter font-normal text-base text-[#505050] focus:outline-none"
//                         />
//                     </div>
//                 </div>
//             </div>
//         </form>
//     );
// })
//
// export default ProfileForm;


"use client";
import React, {forwardRef, useImperativeHandle, useCallback, memo, useState, useEffect} from "react";
import {useForm, Controller, Control} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useGetUserDetails, useUpdateUserDetails} from "@/hooks/useUser";
import {AxiosError} from "axios";
import {Alert, CircularProgress, Snackbar, Typography} from "@mui/material";

const profileSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(50, "First name must be 50 characters or less"),
    lastName: z.string().min(1, "Last name is required").max(50, "Last name must be 50 characters or less"),
    gender: z.enum(["Male", "Female", "Other"], {message: "Please select a valid gender"}).optional(),
    nicPassport: z.string().min(1, "NIC or Passport is required").max(20, "NIC/Passport must be 20 characters or less"),
    contactNumber: z
        .string()
        .min(1, "Contact number is required")
        .regex(/^\+?\d{9,15}$/, "Enter a valid phone number (9-15 digits, optional +)"),
    addressLine1: z.string().min(1, "Address Line 1 is required").max(100, "Address Line 1 must be 100 characters or less"),
    addressLine2: z.string().max(100, "Address Line 2 must be 100 characters or less").optional(),
    city: z.string().min(1, "City is required").max(50, "City must be 50 characters or less"),
    dateOfBirth: z
        .string()
        .min(1, "Date of birth is required")
        .refine(
            (val) => {
                const date = new Date(val);
                return date < new Date() && !isNaN(date.getTime());
            },
            {message: "Enter a valid date of birth in the past"}
        ),
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    country: z.string().min(1, "Country is required").max(50, "Country must be 50 characters or less"),
});

export type ProfileData = z.infer<typeof profileSchema>;

interface ProfileFormRef {
    submit: () => void;
}

interface ChangeProfileProps {
    userId: string;
}

interface ErrorResponse {
    message?: string;
    errors?: { fieldErrors?: Record<string, string[]> };
}

const InputField: React.FC<{
    label: string;
    id: keyof ProfileData;
    type?: string;
    placeholder: string;
    control: Control<ProfileData>;
    error?: string;
    options?: string[];
}> = memo(({label, id, type = "text", placeholder, control, error, options}) => {
    return (
        <div className="flex flex-col w-full max-w-md">
            <label htmlFor={id} className="block text-base lg:text-[22px] font-inter font-medium text-[#222222]">
                {label}
            </label>
            <div className="mt-2 relative">
                {type === "select" ? (
                    <Controller
                        name={id}
                        control={control}
                        render={({field}) => (
                            <select
                                {...field}
                                id={id}
                                className={`
                  w-full px-3 py-2.5 rounded-md border-2 border-[#EDF1F7] hover:border-[#2D3192]/50
                  focus:outline-none focus:border-blue-500 font-inter text-base text-[#505050]
                  ${error ? "border-red-500" : ""}
                `}
                                aria-invalid={error ? "true" : "false"}
                            >
                                <option value="" disabled>
                                    {placeholder}
                                </option>
                                {options?.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        )}
                    />
                ) : (
                    <Controller
                        name={id}
                        control={control}
                        render={({field}) => (
                            <input
                                {...field}
                                type={type}
                                id={id}
                                placeholder={placeholder}
                                className={`
                  w-full px-3 py-2.5 rounded-md border-2 border-[#EDF1F7] hover:border-[#2D3192]/50
                  focus:outline-none focus:border-blue-500 font-inter text-base text-[#505050]
                  ${error ? "border-red-500" : ""}
                `}
                                aria-invalid={error ? "true" : "false"}
                                aria-describedby={error ? `${id}-error` : undefined}
                            />
                        )}
                    />
                )}
                {error && (
                    <p id={`${id}-error`} className="mt-1 text-sm text-red-500" role="alert">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
});
InputField.displayName = "InputField";


const ProfileForm = forwardRef<ProfileFormRef, ChangeProfileProps>(({userId}, ref) => {
    // const {
    //     control,
    //     handleSubmit,
    //     formState: {errors},
    //     reset,
    // } = useForm<ProfileData>({
    //     resolver: zodResolver(profileSchema),
    //     defaultValues: {
    //         firstName: "",
    //         lastName: "",
    //         gender: undefined,
    //         nicPassport: "",
    //         contactNumber: "",
    //         addressLine1: "",
    //         addressLine2: "",
    //         city: "",
    //         dateOfBirth: "",
    //         email: "",
    //         country: "",
    //     },
    // });

    // const [apiError, setApiError] = useState<string | null>(null);
    const [message, setMessage] = useState<{
        text: string;
        type: "success" | "error" | null;
    }>({text: "", type: null});
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const {data: userData, isPending: isUserDetailsPending, isError} = useGetUserDetails(userId);
    console.log("user details: ", userData);
    console.log("user error :", isError);

    const {mutate, isPending} = useUpdateUserDetails();


    const defaultValues = React.useMemo(
        () => ({
            firstName: userData?.userDetails?.first_name || "",
            lastName: userData?.userDetails?.last_name || "",
            gender: userData?.userDetails?.gender || undefined,
            nicPassport: userData?.userDetails?.nic_passport || "",
            contactNumber: userData?.userDetails?.contact_number || "",
            addressLine1: userData?.userDetails?.address_line1 || "",
            addressLine2: userData?.userDetails?.address_line2 || "",
            city: userData?.userDetails?.city || "",
            dateOfBirth: userData?.userDetails?.dob ? new Date(userData.userDetails.dob).toISOString().split("T")[0] : "",
            email: userData?.email || "",
            country: userData?.userDetails?.country || "",
        }),
        [userData]
    );

    const {
        control,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm<ProfileData>({
        resolver: zodResolver(profileSchema),
        defaultValues,
    });

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);


    // const onSubmit = useCallback(
    //     (data: ProfileData) => {
    //         console.log('Profile Data Submitted:', data);
    //         setApiError(null);
    //         setSuccessMessage(null);
    //
    //         mutate(
    //             {userId, data},
    //             {
    //                 onSuccess: () => {
    //                     setSuccessMessage('Profile updated successfully!');
    //                     reset();
    //                 },
    //                 onError: (error: any) => {
    //                     setApiError(error.message || 'Failed to update profile. Please try again.');
    //                 },
    //             }
    //         );
    //     },
    //     [mutate, reset, userId]
    // );


    const onSubmit = useCallback(
        (profileData: ProfileData) => {
            console.log("Profile Data Submitted:", profileData);
            // setApiError(null);
            setMessage({text: "", type: null});
            setOpenSnackbar(false);

            const data = {
                email: profileData.email,
                first_name: profileData.firstName,
                last_name: profileData.lastName,
                contact_number: profileData.contactNumber,
                nic_passport: profileData.nicPassport,
                country: profileData.country,
                gender: profileData.gender,
                dob: profileData.dateOfBirth,
                address_line1: profileData.addressLine1,
                address_line2: profileData.addressLine2,
                city: profileData.city
            };

            mutate(
                {userId, data},
                {
                    onSuccess: () => {
                        setMessage({text: "Profile updated successfully!", type: "success"});
                        setOpenSnackbar(true);
                        reset(profileData);
                    },
                    onError: (error: AxiosError<ErrorResponse>) => {
                        // setApiError(error.message || "Failed to update profile. Please try again.");
                        const errorMessage =
                            error.response?.data?.message
                                ? error.response.data.message
                                : "Failed to update profile. Please try again.";
                        setMessage({text: errorMessage, type: "error"});
                        setOpenSnackbar(true);
                    },
                }
            );
        },
        [mutate, reset, userId]
    );

    useImperativeHandle(ref, () => ({
        submit: () => handleSubmit(onSubmit)(),
    }));


    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    if (isUserDetailsPending) {
        return (
            <Typography variant="body1" sx={{color: "#3B82F6", textAlign: "center"}}>
                Loading user details...
            </Typography>
        );
    }
    if (isError) {
        return (
            <Typography variant="body1" sx={{color: "#EF4444", textAlign: "center"}}>
                Failed to load user details. Please try again.
            </Typography>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 justify-start max-w-5xl px-4 sm:px-6 lg:px-0">
            {/*{successMessage && (*/}
            {/*    <p className="text-green-500 text-sm" role="alert">*/}
            {/*        {successMessage}*/}
            {/*    </p>*/}
            {/*)}*/}
            {/*{apiError && (*/}
            {/*    <p className="text-red-500 text-sm" role="alert">*/}
            {/*        {apiError}*/}
            {/*    </p>*/}
            {/*)}*/}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                    label="First Name"
                    id="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    control={control}
                    error={errors.firstName?.message}
                />
                <InputField
                    label="Last Name"
                    id="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    control={control}
                    error={errors.lastName?.message}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                    label="Gender"
                    id="gender"
                    type="select"
                    placeholder="Select your gender"
                    control={control}
                    error={errors.gender?.message}
                    options={["Male", "Female", "Other"]}
                />
                <InputField
                    label="Date of Birth"
                    id="dateOfBirth"
                    type="date"
                    placeholder="YYYY-MM-DD"
                    control={control}
                    error={errors.dateOfBirth?.message}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                    label="NIC / Passport"
                    id="nicPassport"
                    type="text"
                    placeholder="Enter your NIC or Passport"
                    control={control}
                    error={errors.nicPassport?.message}
                />
                <InputField
                    label="Email"
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    control={control}
                    error={errors.email?.message}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                    label="Contact Number"
                    id="contactNumber"
                    type="tel"
                    placeholder="Enter your contact number"
                    control={control}
                    error={errors.contactNumber?.message}
                />
                <InputField
                    label="Country"
                    id="country"
                    type="text"
                    placeholder="Enter your country"
                    control={control}
                    error={errors.country?.message}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                    label="Address Line 1"
                    id="addressLine1"
                    type="text"
                    placeholder="Enter your address line 1"
                    control={control}
                    error={errors.addressLine1?.message}
                />
                <InputField
                    label="Address Line 2"
                    id="addressLine2"
                    type="text"
                    placeholder="Enter your address line 2 (optional)"
                    control={control}
                    error={errors.addressLine2?.message}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                    label="City"
                    id="city"
                    type="text"
                    placeholder="Enter your city"
                    control={control}
                    error={errors.city?.message}
                />
            </div>
            {/*{isPending && <p className="text-blue-500 text-sm">Updating profile...</p>}*/}

            {isPending && (
                <>
                    <CircularProgress size={20} sx={{color: "blue", mr: 1}}/>
                    Updating...
                </>
            )}

            <Snackbar
                open={openSnackbar}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{vertical: "top", horizontal: "center"}}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={message.type === "success" ? "success" : "error"}
                    sx={{width: "100%"}}
                    id="profile-message"
                >
                    {message.text}
                </Alert>
            </Snackbar>
        </form>
    );
});

ProfileForm.displayName = "ProfileForm";

export default memo(ProfileForm);