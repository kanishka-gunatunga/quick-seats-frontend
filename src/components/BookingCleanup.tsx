"use client";

import { useBookingCleanup } from "@/hooks/useBookingCleanup";
import React from "react";

const BookingCleanup: React.FC = () => {
    useBookingCleanup();
    return null;
};

export default BookingCleanup;