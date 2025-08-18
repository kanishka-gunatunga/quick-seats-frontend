import React from "react";
import { Skeleton } from "@mui/material";

const EventCardSkeleton: React.FC = () => {
    return (
        <article className="w-full max-w-[296px] mx-auto">
            <div className="border-2 border-violet-100 rounded-md">
                <div className="p-3">
                    <Skeleton variant="rectangular" width={270} height={238} className="rounded-md aspect-[1.18]" />
                    <div className="px-2 justify-between">
                        <Skeleton variant="text" className="mt-4" width="80%" height={24} /> {/* Title */}
                        <div className="flex gap-4 sm:gap-6 mt-4">
                            <div className="flex gap-3">
                                <Skeleton variant="circular" width={15} height={15} />
                                <Skeleton variant="text" width={80} height={15} /> {/* Date */}
                            </div>
                            <div className="flex gap-3">
                                <Skeleton variant="circular" width={18} height={18} />
                                <Skeleton variant="text" width={80} height={18} /> {/* Time */}
                            </div>
                        </div>
                        <div className="flex justify-start items-center gap-3 mt-3">
                            <Skeleton variant="circular" width={19} height={19} />
                            <Skeleton variant="text" width="90%" height={19} /> {/* Location */}
                        </div>
                        <div className="flex gap-2 mt-4">
                            <Skeleton variant="text" width={100} height={24} /> {/* Price */}
                            <Skeleton variant="text" width={50} height={15} className="self-center" /> {/* Upwards text */}
                        </div>
                    </div>
                </div>
                <Skeleton variant="rectangular" width="100%" height={50} className="mt-6 rounded-b-md" /> {/* Buy Tickets button */}
            </div>
        </article>
    );
};

export default EventCardSkeleton;