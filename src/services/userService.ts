import axiosInstance from "@/util/axiosinstance";
import {AxiosError} from "axios";

interface ErrorResponse {
    message?: string;
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


export const createUser = (userData: SubmissionData) => axiosInstance.post(`/register`, userData);

// export const updatePassword = ({userId, passwordData}) => {
//     try {
//         axiosInstance.post(`/update-security-settings/${userId}`, passwordData);
//     } catch (error) {
//         throw error;
//     }
// }

export const updatePassword = async ({userId, passwordData}: { userId: string; passwordData: PasswordData }) => {
    try {
        const response = await axiosInstance.post(`/update-security-settings/${userId}`, passwordData);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.data) {
            throw new Error(
                (error.response.data as ErrorResponse).message || "Failed to update password"
            );
        }
        throw new Error("Failed to update password");
    }
};

export const updateProfileDetails = async ({userId, data}: { userId: string; data: FormData }) => {
    try {
        const response = await axiosInstance.post(`/update-profile-settings/${userId}`, data);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.data) {
            throw new Error(
                (error.response.data as ErrorResponse).message || "Failed to update profile details"
            );
        }
        throw new Error("Failed to update profile details");
    }
}

export const getUserDetails = async (userId: string | undefined) => {
    try {
        const response = await axiosInstance.get(`/get-user-details/${userId}`);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.data) {
            throw new Error(
                (error.response.data as ErrorResponse).message || "Failed to get user details"
            );
        }
        throw new Error("Failed to get user details");
    }
}

export const getBookingHistory = async (userId: string) => {
    try {
        const response = await axiosInstance.get(`/booking-history/${userId}`);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.data) {
            throw new Error(
                (error.response.data as ErrorResponse).message || "Failed to get booking history"
            );
        }
        throw new Error("Failed to get booking history");
    }
}

export const getPaymentHistory = async (userId: string) => {
    try {
        const response = await axiosInstance.get(`/payment-history/${userId}`);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.data) {
            throw new Error(
                (error.response.data as ErrorResponse).message || "Failed to get payment history"
            );
        }
        throw new Error("Failed to get payment history");
    }
}

export const forgotPasswordApi = (email: string) => axiosInstance.post(`/forgot-password`, {email: email});


interface OtpValidationPayload {
    email: string;
    otp: string;
    otp_type: string;
}

export const validateOtpApi = async (data: OtpValidationPayload) => {
    try {
        const response = await axiosInstance.post('/validate-otp', data);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.data) {
            throw new Error(
                (error.response.data as ErrorResponse).message || "Failed to validate otp"
            );
        }
        throw new Error("Failed to validate otp");
    }
};

interface OtpResendPayload {
    email: string;
}

export const resendOtpApi = async (data: OtpResendPayload) => {
    try {
        const response = await axiosInstance.post('/resend-otp', data);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.data) {
            throw new Error(
                (error.response.data as ErrorResponse).message || "Failed to send otp"
            );
        }
        throw new Error("Failed to send otp");
    }
};


interface PasswordResetPayload {
    email: string;
    password: string;
    confirm_password: string;
}

export const resetPasswordApi = async (data: PasswordResetPayload) => {
    try {
        const response = await axiosInstance.post('/reset-password', data);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.data) {
            throw new Error(
                (error.response.data as ErrorResponse).message || "Failed to reset password"
            );
        }
        throw new Error("Failed to reset password");
    }
};


interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    subject: "General Inquiry" | "Refund Request" | "Technical Issue" | "Event Listing";
    message: string;
}

export const inquiryApi = async (data: FormValues) => {
    try {
        const response = await axiosInstance.post(`/inquiry`, {
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            phone_number: data.phoneNumber,
            subject: data.subject,
            message: data.message,
        });
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.data) {
            throw new Error(
                (error.response.data as ErrorResponse).message || "Failed to submit inquiry"
            );
        }
        throw new Error("Failed to submit inquiry");
    }
};


interface NewsValues {
    email: string;
}

export const newsLetterApi = async (data: NewsValues) => {
    try {
        const response = await axiosInstance.post(`/newsletter`, {
            email: data.email,
        });
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.data) {
            throw new Error(
                (error.response.data as ErrorResponse).message || "Failed to send newsletter"
            );
        }
        throw new Error("Failed to send newsletter");
    }
};