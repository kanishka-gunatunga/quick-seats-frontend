"use client";
import React, {useState, useCallback, memo, useMemo} from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Box,
    Typography,
    Alert,
} from "@mui/material";
import Pagination from "@/components/Pagination";
import {usePaymentHistory} from "@/hooks/useUser";
import dayjs from "dayjs";

interface PaymentData {
    name: string;
    amount: string;
    date: string;
    status: "Completed" | "Failed" | "Pending";
}

interface Order {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    contact_number: string;
    nic_passport: string;
    country: string;
    address: string | null;
    city: string | null;
    event_id: string;
    event_name: string;
    user_id: string;
    seat_ids: string;
    tickets_without_seats: string;
    sub_total: number;
    discount: number;
    total: number;
    status: "pending" | "failed";
    cybersource_transaction_uuid: string | null;
    createdAt: string;
}

interface PaymentHistoryResponse {
    orders: Order[];
}

const PaymentHistory = ({userId}: { userId: string }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const {
        data: paymentResponse,
        isLoading,
        isError,
        error,
    } = usePaymentHistory(userId) as {
        data: PaymentHistoryResponse | undefined;
        isLoading: boolean;
        isError: boolean;
        error: Error | null;
    };


    const processedPaymentHistory = useMemo(() => {
        if (!paymentResponse?.orders) return [];

        return paymentResponse.orders.map((order) => {
            const createdAtDate = dayjs(order.createdAt);
            const formattedDate = createdAtDate.format("YYYY/MM/DD");

            let displayStatus: PaymentData["status"] = "Pending";
            if (order.status === "failed") {
                displayStatus = "Failed";
            } else if (order.status === "pending") {
                displayStatus = "Pending";
            } else if (order.status === "completed") {
                displayStatus = "Completed";
            }

            return {
                name: `${order.event_name}`,
                amount: `LKR. ${order.total.toFixed(2)}`,
                date: formattedDate,
                status: displayStatus,
            };
        });
    }, [paymentResponse]);

    const totalItems = processedPaymentHistory.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = processedPaymentHistory.slice(startIndex, endIndex);


    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress sx={{color: "#2D3192"}}/>
                <Typography variant="body1" sx={{ml: 2, color: "#2D3192"}}>
                    Loading payment history...
                </Typography>
            </Box>
        );
    }

    if (isError) {
        const errorMessage = error instanceof Error ? error.message : "Failed to load payment history.";
        return (
            <Box maxWidth="4xl" mx="auto" p={4}>
                <Alert severity="error" sx={{borderRadius: "8px"}}>
                    {errorMessage}
                </Alert>
            </Box>
        );
    }

    if (!processedPaymentHistory.length) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                {/*<CircularProgress sx={{color: "#2D3192"}}/>*/}
                <Typography variant="body1" sx={{ml: 2, color: "#2D3192"}}>
                    Loading payment history...
                </Typography>
            </Box>
        );
    }

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <TableContainer
                    component={Paper}
                    sx={{
                        border: "1px solid #E7EAE9",
                        boxShadow: "none",
                        borderRadius: "8px",
                    }}
                >
                    <Table
                        sx={{
                            minWidth: {xs: 300, sm: 650},
                            "& .MuiTableCell-root": {
                                borderColor: "#E7EAE9",
                            },
                        }}
                        aria-label="Payment history table"
                    >
                        <TableHead>
                            <TableRow
                                sx={{
                                    // backgroundColor: "#F9FAFB",
                                    "&:hover": {backgroundColor: "#F9FAFB"},
                                }}
                            >
                                <TableCell align="center" sx={{py: 2, px: {xs: 1, sm: 2}}}>
                                    <div className="font-inter text-sm sm:text-lg font-semibold text-[#2D2A70]">
                                        Event Details
                                    </div>
                                </TableCell>
                                <TableCell align="center" sx={{py: 2, px: {xs: 1, sm: 2}}}>
                                    <div className="font-inter text-sm sm:text-lg font-semibold text-[#2D2A70]">
                                        Amount
                                    </div>
                                </TableCell>
                                <TableCell align="center" sx={{py: 2, px: {xs: 1, sm: 2}}}>
                                    <div className="font-inter text-sm sm:text-lg font-semibold text-[#2D2A70]">
                                        Date
                                    </div>
                                </TableCell>
                                <TableCell align="center" sx={{py: 2, px: {xs: 1, sm: 2}}}>
                                    <div className="font-inter text-sm sm:text-lg font-semibold text-[#2D2A70]">
                                        Status
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentItems.map((row, index) => (
                                <TableRow
                                    key={`${row.name}-${index}`}
                                    sx={{
                                        "&:hover": {backgroundColor: "#F1F5F9"},
                                        "&:last-child td, &:last-child th": {border: 0},
                                    }}
                                >
                                    <TableCell
                                        align="center"
                                        sx={{py: 2, px: {xs: 1, sm: 2}, fontSize: {xs: "0.75rem", sm: "0.875rem"}}}
                                    >
                                        <div className="font-inter text-sm lg:text-base text-[#000000]">{row.name}</div>
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{py: 2, px: {xs: 1, sm: 2}, fontSize: {xs: "0.75rem", sm: "0.875rem"}}}
                                    >
                                        <div
                                            className="font-inter text-sm lg:text-base text-[#000000]">{row.amount}</div>
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{py: 2, px: {xs: 1, sm: 2}, fontSize: {xs: "0.75rem", sm: "0.875rem"}}}
                                    >
                                        <div className="font-inter text-sm lg:text-base text-[#000000]">{row.date}</div>
                                    </TableCell>
                                    <TableCell align="center" sx={{py: 2, px: {xs: 1, sm: 2}}}>
                                        <div
                                            className={`
                        inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-md
                        ${row.status === "Completed" ? "bg-[#E8F2ED] text-[#117F45]" :
                                                row.status === "Failed" ? "bg-[#FFEDEA] text-[#FF4934]" :
                                                    "bg-yellow-100 text-yellow-700"
                                            }
                      `}
                                            aria-label={`Status: ${row.status}`}
                                        >
                      <span className="mr-1">
                        <div
                            className={`h-1.5 w-1.5 rounded-full ${
                                row.status === "Completed" ? "bg-[#117F45]" :
                                    row.status === "Failed" ? "bg-[#FF4934]" :
                                        "bg-yellow-500"
                            }`}
                        />
                      </span>
                                            {row.status}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className="mt-10 flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default memo(PaymentHistory);
