"use client"

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import React from "react";
import {Provider} from "react-redux";
import {store} from "@/store/store";
import BookingCleanup from "@/components/BookingCleanup";

export default function Providers({children}: { children: React.ReactNode }) {
    const queryClient = new QueryClient();
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <BookingCleanup />
                <ReactQueryDevtools initialIsOpen={false}/>
                {children}
            </QueryClientProvider>
        </Provider>
    )
}