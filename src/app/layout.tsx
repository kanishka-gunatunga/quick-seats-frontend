import type {Metadata} from "next";
import {Inter, Space_Grotesk} from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Providers from "@/util/providers";
import React from "react";
import SessionAuthProvider from "@/util/SessionAuthProvider";
// import {TimerProvider} from "@/context/TimerContext";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
    title: "Quick Seats.lk - Book Your Tickets",
    description: "Discover and book tickets for your favorite events",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
        <SessionAuthProvider>
            {/*<TimerProvider>*/}
                <Providers>
                    {children}
                    <Footer/>
                </Providers>
            {/*</TimerProvider>*/}
        </SessionAuthProvider>
        </body>
        </html>
    );
}
