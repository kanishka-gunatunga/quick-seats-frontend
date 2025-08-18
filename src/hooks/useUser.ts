import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    createUser, forgotPasswordApi,
    getBookingHistory,
    getPaymentHistory,
    getUserDetails, inquiryApi, newsLetterApi, resendOtpApi, resetPasswordApi,
    updatePassword,
    updateProfileDetails, validateOtpApi
} from "@/services/userService";
import {AxiosError} from "axios";


interface ErrorResponse {
    message?: string;
    errors?: { fieldErrors?: Record<string, string[]> };
}

interface SubmissionData {
    email: string;
    password: string;
    confirm_password: string;
    first_name: string;
    last_name: string;
    contact_number: string;
    nic_passport: string;
    country: string;
}

interface FormData {
    email: string,
    first_name: string,
    last_name: string,
    contact_number: string,
    nic_passport: string,
    country: string,
    gender: "Male" | "Female" | "Other" | undefined,
    dob: string,
    address_line1: string,
    address_line2: string | undefined,
    city: string
}

interface PasswordData {
    old_password: string,
    password: string,
    confirm_password: string
}


// const defaultQueryOptions = {
//     staleTime: 5 * 60 * 1000,
//     gcTime: 10 * 60 * 1000,
//     retry: 3,
//     refetchOnWindowFocus: false,
// };

// const toSnakeCase = (str: string) =>
//     str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

// const transformKeysToSnakeCase = (obj: any): any => {
//     if (typeof obj !== "object" || obj === null) return obj;
//     return Object.keys(obj).reduce((acc, key) => {
//         const snakeKey = toSnakeCase(key);
//         acc[snakeKey] = obj[key];
//         return acc;
//     }, {} as any);
// };

// export const useCreateUser = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: createUser,
//         onSuccess: () => {
//             queryClient.invalidateQueries({queryKey: ["users"]});
//         },
//         onError: (error) => {
//             console.error('Error creating user:', error);
//         }
//     });
// };


export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation<
        unknown,
        AxiosError<ErrorResponse>,
        SubmissionData,
        unknown
    >({
        mutationFn: async (userData: SubmissionData) => {
            console.log("Mutation variables:", userData);
            return await createUser(userData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["users"]});
        },
        onError: (error: AxiosError<ErrorResponse>) => {
            console.error("Error creating user:", error);
        },
    });
};


// export const useUpdateUser = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: updatePassword,
//         onSuccess: () => {
//             queryClient.invalidateQueries({queryKey: ["users"]});
//         },
//         onError: (error) => {
//             console.error('Error update password:', error);
//         }
//     })
// }


export const useUpdateUserPassword = () => {
    const queryClient = useQueryClient();
    return useMutation<
        void,
        AxiosError<ErrorResponse>,
        { userId: string; passwordData: PasswordData },
        unknown>({
        mutationFn: async ({userId, passwordData}) => {
            console.log("Mutation variables:", {userId, passwordData});
            await updatePassword({userId, passwordData})
        },
        onSuccess: () => {
            console.log("Password updated successfully!");
            queryClient.invalidateQueries({queryKey: ["users"]});
        },
        onError: (error) => {
            console.log("--------------------error updating user password: ", error);

        }
    });
};


export const useUpdateUserDetails = () => {
    const queryClient = useQueryClient();
    return useMutation<
        unknown,
        AxiosError<ErrorResponse>,
        { userId: string; data: FormData },
        unknown
    >({
        mutationFn: async ({userId, data}) => {
            console.log("Mutation variables:", {userId, data});
            await updateProfileDetails({userId, data})
        },
        onSuccess: () => {
            console.log("Profile details updated successfully!");
            queryClient.invalidateQueries({queryKey: ["users"]});
        },
        onError: (error) => {
            console.log("--------------------error updating user details: ", error);
        }
    });
};


export const useGetUserDetails = (id: string | undefined) => {
    return useQuery({
        queryKey: ["users", id],
        queryFn: () => getUserDetails(id),
        // ...defaultQueryOptions,
        // refetchInterval: 10000,
        retry: 3
    })
}

export const useBookingHistory = (id: string) => {
    return useQuery({
        queryKey: ["users", id],
        queryFn: () => getBookingHistory(id),
        // ...defaultQueryOptions,
        // refetchInterval: 10000,
        retry: 3,
    })
}

export const usePaymentHistory = (id: string) => {
    return useQuery({
        queryKey: ["users", id],
        queryFn: () => getPaymentHistory(id),
        // ...defaultQueryOptions,
        // refetchInterval: 10000,
        retry: 3,
    })
}


interface ForgotPasswordPayload {
    email: string;
}

export const useForgotPassword = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: ForgotPasswordPayload) => {
            console.log("Mutation variables:", data.email);
            await forgotPasswordApi(data.email)
        },
        onSuccess: () => {
            console.log("Email sent successfully!");
            queryClient.invalidateQueries({queryKey: ["users"]});
        },
        onError: (error) => {
            console.log("--------------------error sending email: ", error);

        }
    });
};


interface OtpValidationPayload {
    email: string;
    otp: string;
    otp_type: string;
}


export const useValidateOtp = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, AxiosError<ErrorResponse>, OtpValidationPayload>({
        mutationFn: async (variables: OtpValidationPayload) => {
            console.log("Mutation variables:", variables);
            return validateOtpApi(variables);
        },
        onSuccess: () => {
            console.log("Otp validated successfully!");
            queryClient.invalidateQueries({queryKey: ["users"]});
        },
        onError: (error) => {
            console.log("--------------------error validating otp: ", error);

        }
    });
};


interface OtpResendPayload {
    email: string;
}

export const useResendOtp = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, AxiosError<ErrorResponse>, OtpResendPayload>({
        mutationFn: async (variables: OtpResendPayload) => {
            console.log("Mutation variables:", variables);
            return resendOtpApi(variables);
        },
        onSuccess: () => {
            console.log("Otp resent successfully!");
            queryClient.invalidateQueries({queryKey: ["users"]});
        },
        onError: (error) => {
            console.log("--------------------error resent otp: ", error);

        }
    });
};


interface PasswordResetPayload {
    email: string;
    password: string;
    confirm_password: string;
}


export const useResetPassword = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, Error, PasswordResetPayload>({
        mutationFn: async (variables: PasswordResetPayload) => {
            console.log("Mutation variables:", variables);
            return resetPasswordApi(variables);
        },
        onSuccess: () => {
            console.log("Password reset successfully!");
            queryClient.invalidateQueries({queryKey: ["users"]});
        },
        onError: (error) => {
            console.log("--------------------error resetting password: ", error);
        }
    });
};


interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    subject: "General Inquiry" | "Refund Request" | "Technical Issue" | "Event Listing";
    message: string;
}


export const useInquiryApi = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (variables: FormValues) => {
            return inquiryApi(variables);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["users"]});
        },
        onError: (error: Error) => {
            console.error("Error submitting inquiry:", error);
        },
    });
};


interface NewsValues {
    email: string;
}

export const useNewsLetterApi = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (variables: NewsValues) => {
            return newsLetterApi(variables);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["users"]});
        },
        onError: (error: Error) => {
            console.error("Error submitting newsletter:", error);
        }
    })
}