import axios from 'axios';
import {getSession} from "next-auth/react";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// console.log("API:", process.env.NEXT_PUBLIC_API_URL);

axiosInstance.interceptors.request.use(
    async (config) => {
        const session = await getSession();
        const token = session?.accessToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;