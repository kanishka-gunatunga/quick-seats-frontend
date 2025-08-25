import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {ReactZoomPanPinchRef, TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import {useDispatch, useSelector} from "react-redux";
import {
    Fullscreen,
    KeyboardArrowDown,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    KeyboardArrowUp,
    ZoomIn,
    ZoomOut,
} from "@mui/icons-material";
import {Alert} from "@mui/material";
import {useSeatSelectApi, useUnseatSelectApi} from "@/hooks/useBooking";
import {selectEventTicketDetails, selectSeats, unselectSeats} from "@/store/bookingSlice";
import {RootState} from "@/store/store";
import {useQueryClient} from "@tanstack/react-query";
import {Tooltip} from "react-tooltip";

interface SeatData {
    price: number;
    seatId: string;
    status: string;
    type_id: number;
    ticketTypeName?: string;
    color: string;
}

interface SeatSelectionProps {
    mapId: string | undefined;
    eventId: string;
}

const SeatSelection: React.FC<SeatSelectionProps> = ({mapId, eventId}) => {
    const dispatch = useDispatch();
    const selectedSeats = useSelector((state: RootState) => state.booking.selectedSeats);
    const currentSeatData = useSelector((state: RootState) => state.booking.currentSeatData);
    const eventTicketDetails = useSelector((state: RootState) => selectEventTicketDetails(state));
    const [svgRawContent, setSvgRawContent] = useState<string | null>(null);
    const transformComponentRef = useRef<ReactZoomPanPinchRef>(null);
    const [currentScale, setCurrentScale] = useState<number>(1);
    const queryClient = useQueryClient();
    const [seatError, setSeatError] = useState<string | null>(null);

    const selectSeatMutation = useSeatSelectApi();
    const unselectSeatMutation = useUnseatSelectApi();

    const seatMap = useMemo(() => {
        return currentSeatData.reduce((map, seat) => {
            map[seat.seatId] = seat;
            return map;
        }, {} as Record<string, SeatData>);
    }, [currentSeatData]);

    useEffect(() => {
        const fetchSvg = async () => {
            try {
                const response = await fetch(`/${mapId}.svg`);
                if (!response.ok) throw new Error(`Failed to fetch SVG: ${response.statusText}`);
                const svgText = await response.text();
                setSvgRawContent(svgText);
            } catch (error) {
                console.error("Error fetching SVG:", error);
                setSvgRawContent(null);
            }
        };
        if (mapId) {
            fetchSvg();
        }
    }, [mapId]);

    const handleSeatClick = useCallback(
        async (seatId: string) => {
            console.log(`Seat clicked: ${seatId}`);
            const seat = seatMap[seatId];
            if (!seat || seat.status === "booked" || seat.status === "unavailable") {
                setSeatError(`Seat ${seatId} is not available for selection.`);
                setTimeout(() => setSeatError(null), 5000);
                return;
            }

            const isCurrentlySelected = selectedSeats.some((s) => s.seatId === seatId);

            if (isCurrentlySelected) {
                dispatch(unselectSeats({seatIds: [seatId], eventId}));
                try {
                    await unselectSeatMutation.mutateAsync(
                        {event_id: eventId, seat_id: seatId},
                        {
                            onSuccess: () => {
                                console.log(`Seat ${seatId} unselected`);
                                queryClient.invalidateQueries({queryKey: ["seatData", eventId]});
                            },
                            onError: (error) => {
                                console.error(`Seat unselection error for ${seatId}:`, error);
                                setSeatError(`Failed to unselect seat ${seatId}: ${error.message || "Unknown error"}`);
                                setTimeout(() => setSeatError(null), 5000);
                            },
                        }
                    );
                } catch (error) {
                    console.error(`Failed to unselect seat ${seatId}:`, error);
                    setSeatError(`Failed to unselect seat ${seatId}. Please try again.`);
                    setTimeout(() => setSeatError(null), 5000);
                }
            } else {
                if (seat.status !== "available") {
                    setSeatError(`Seat ${seatId} is not available for selection.`);
                    setTimeout(() => setSeatError(null), 5000);
                    return;
                }
                dispatch(selectSeats({seats: [{...seat, status: "selected"}], eventId}));
                try {
                    await selectSeatMutation.mutateAsync(
                        {event_id: eventId, seat_id: seatId},
                        {
                            onSuccess: () => {
                                console.log(`Seat ${seatId} selected`);
                                queryClient.invalidateQueries({queryKey: ["seatData", eventId]});
                            },
                            onError: (error) => {
                                console.error(`Seat selection error for ${seatId}:`, error);
                                dispatch(unselectSeats({seatIds: [seatId], eventId}));
                                setSeatError(`Failed to select seat ${seatId}: ${error.message || "Unknown error"}`);
                                setTimeout(() => setSeatError(null), 5000);
                            },
                        }
                    );
                } catch (error) {
                    console.error(`Failed to select seat ${seatId}:`, error);
                    dispatch(unselectSeats({seatIds: [seatId], eventId}));
                    setSeatError(`Failed to select seat ${seatId}. Please try again.`);
                    setTimeout(() => setSeatError(null), 5000);
                }
            }
        },
        [seatMap, selectedSeats, dispatch, selectSeatMutation, unselectSeatMutation, eventId, queryClient]
    );

    const handleTransformChange = useCallback((ref: ReactZoomPanPinchRef) => {
        setCurrentScale(ref.instance.transformState.scale);
    }, []);

    const panToDirection = useCallback(
        (direction: "up" | "down" | "left" | "right") => {
            if (transformComponentRef.current) {
                const {instance} = transformComponentRef.current;
                const panStep = 100 / currentScale;
                switch (direction) {
                    case "up":
                        instance.transformState.positionY += panStep;
                        break;
                    case "down":
                        instance.transformState.positionY -= panStep;
                        break;
                    case "left":
                        instance.transformState.positionX += panStep;
                        break;
                    case "right":
                        instance.transformState.positionX -= panStep;
                        break;
                }
                instance.applyTransformation();
            }
        },
        [currentScale]
    );

    const getTooltipText = useCallback((seat: SeatData): string => {
        const category = seat.ticketTypeName || `Type ${seat.type_id}`;
        const statusText = seat.status.charAt(0).toUpperCase() + seat.status.slice(1);
        const priceText = seat.status === "available" ? `LKR ${seat.price}` : "N/A";
        return `
            <div class="seat-tooltip">
                <strong>Category:</strong> ${category}<br/>
                <strong>Seat:</strong> ${seat.seatId}<br/>
                <strong>Price:</strong> ${priceText}<br/>
                <strong>Status:</strong> ${statusText}
            </div>
        `;
    }, []);

    const renderSvgContent = useMemo(() => {
        if (!svgRawContent || !currentSeatData.length) {
            return null;
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(svgRawContent, "image/svg+xml");
        const svgElement = doc.documentElement;

        if (!svgElement) {
            return null;
        }

        svgElement.setAttribute("width", "100%");
        svgElement.setAttribute("height", "100%");

        // Use the optimized seatMap here
        const seatMapForRender = currentSeatData.reduce((map, seat) => {
            map[seat.seatId] = seat;
            return map;
        }, {} as Record<string, SeatData>);

        const seatGroupElements = svgElement.querySelectorAll("g.seat-group");
        seatGroupElements.forEach((seatGroupElement) => {
            const seatId = seatGroupElement.id;
            const seatInfo = seatMapForRender[seatId];
            const pathsInGroup = seatGroupElement.querySelectorAll("path");

            pathsInGroup.forEach((pathElement) => {
                pathElement.classList.remove("fill-gray-400", "fill-red-500", "fill-blue-500", "cursor-not-allowed", "cursor-pointer");
                pathElement.style.removeProperty("fill");
            });

            if (seatInfo) {
                const isSelected = selectedSeats.some((s) => s.seatId === seatId);
                if (seatInfo.status === "booked") {
                    pathsInGroup.forEach((pathElement) => {
                        pathElement.classList.add("fill-red-500", "cursor-not-allowed");
                    });

                } else if (seatInfo.status === "unavailable" && seatInfo.color) {
                    pathsInGroup.forEach((pathElement) => {
                        pathElement.classList.add("fill-[#660033]","cursor-not-allowed");
                    });
                } else if (isSelected) {
                    pathsInGroup.forEach((pathElement) => {
                        pathElement.classList.add("fill-[#ff6600]", "cursor-pointer");
                    });
                } else if (seatInfo.status === "available" && seatInfo.color) {
                    pathsInGroup.forEach((pathElement) => {
                        pathElement.style.fill = seatInfo.color; // Apply API-provided color
                        pathElement.classList.add("cursor-pointer");
                    });
                } else {
                    pathsInGroup.forEach((pathElement) => {
                        pathElement.classList.add("fill-gray-400", "cursor-pointer");
                    });
                }

                // Add attributes for the tooltip to work
                seatGroupElement.setAttribute("data-tooltip-id", "tooltip-global");
                seatGroupElement.setAttribute("data-tooltip-html", getTooltipText(seatInfo));
                seatGroupElement.setAttribute("data-tooltip-place", "top");
            }
        });

        return (
            <div
                className="relative w-full h-full"
                dangerouslySetInnerHTML={{__html: svgElement.outerHTML}}
                onClick={(e) => {
                    const target = e.target as SVGElement;
                    const seatGroup = target.closest("g.seat-group");
                    if (seatGroup && seatGroup.id) {
                        handleSeatClick(seatGroup.id);
                    }
                }}
            />
        );
    }, [svgRawContent, currentSeatData, selectedSeats, handleSeatClick, getTooltipText]);

    if (!svgRawContent) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-600">
                Loading seat map...
            </div>
        );
    }

    return (
        <div
            className="relative w-full md:w-2/3 mx-auto flex justify-center h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden bg-gray-50 p-1 sm:p-2 border border-gray-200 rounded-lg shadow-inner"
        >
            {seatError && (
                <Alert
                    severity="error"
                    sx={{position: "absolute", top: 10, zIndex: 1000, width: "90%", maxWidth: 500}}
                    onClose={() => setSeatError(null)}
                >
                    {seatError}
                </Alert>
            )}
            <TransformWrapper
                ref={transformComponentRef}
                initialScale={1}
                minScale={0.5}
                maxScale={3}
                wheel={{step: 0.1}}
                pinch={{step: 0.05}}
                doubleClick={{mode: "reset"}}
                onTransformed={handleTransformChange}
            >
                {({zoomIn, zoomOut, resetTransform}) => (
                    <>
                        <div
                            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 flex flex-col gap-1 sm:gap-2 bg-white p-1 sm:p-2 rounded-lg shadow-md"
                        >
                            <button
                                onClick={() => zoomIn()}
                                className="p-1 sm:p-2 bg-gray-100 rounded hover:bg-gray-200"
                                aria-label="Zoom In"
                            >
                                <ZoomIn fontSize="small"/>
                            </button>
                            <button
                                onClick={() => zoomOut()}
                                className="p-1 sm:p-2 bg-gray-100 rounded hover:bg-gray-200"
                                aria-label="Zoom Out"
                            >
                                <ZoomOut fontSize="small"/>
                            </button>
                            <button
                                onClick={() => resetTransform()}
                                className="p-1 sm:p-2 bg-gray-100 rounded hover:bg-gray-200"
                                aria-label="Reset Zoom"
                            >
                                <Fullscreen fontSize="small"/>
                            </button>
                            <button
                                onClick={() => panToDirection("up")}
                                className="p-1 sm:p-2 bg-gray-100 rounded hover:bg-gray-200"
                                aria-label="Pan Up"
                            >
                                <KeyboardArrowUp fontSize="small"/>
                            </button>
                            <button
                                onClick={() => panToDirection("left")}
                                className="p-1 sm:p-2 bg-gray-100 rounded hover:bg-gray-200"
                                aria-label="Pan Left"
                            >
                                <KeyboardArrowLeft fontSize="small"/>
                            </button>
                            <button
                                onClick={() => panToDirection("right")}
                                className="p-1 sm:p-2 bg-gray-100 rounded hover:bg-gray-200"
                                aria-label="Pan Right"
                            >
                                <KeyboardArrowRight fontSize="small"/>
                            </button>
                            <button
                                onClick={() => panToDirection("down")}
                                className="p-1 sm:p-2 bg-gray-100 rounded hover:bg-gray-200"
                                aria-label="Pan Down"
                            >
                                <KeyboardArrowDown fontSize="small"/>
                            </button>
                        </div>
                        <TransformComponent wrapperStyle={{width: "100%", height: "100%"}}
                                            contentStyle={{width: "100%", height: "100%"}}>
                            <div id="svg-container" className="w-full h-full relative">
                                {renderSvgContent}
                            </div>
                        </TransformComponent>
                        <Tooltip
                            id="tooltip-global"
                            place="top"
                            float={true}
                            offset={10}
                            style={{
                                fontSize: "14px",
                                padding: "8px",
                                maxWidth: "200px",
                                backgroundColor: "#fff",
                                color: "#000",
                                borderRadius: "4px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                zIndex: 1000,
                            }}
                        />
                    </>
                )}
            </TransformWrapper>
            <div
                className="absolute left-1 bottom-1 z-10 bg-white/10 p-2 sm:p-3 md:p-4 rounded-xl shadow-lg backdrop-blur-sm max-w-full overflow-x-auto scrollbar-hidden scroll-smooth"
            >
                <div className="flex flex-nowrap overflow-x-auto min-h-[1.625rem] sm:min-h-[1.875rem] gap-2 sm:gap-3 items-center">
                    {eventTicketDetails.map((ticket) => (
                        <div key={ticket.ticketTypeId} className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: ticket.ticketColor }}
                            ></div>
                            <span>{ticket.ticketTypeName}</span>
                        </div>
                    ))}
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#ff6600] rounded"></div>
                        <span>Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span>Booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#660033] rounded"></div>
                        <span>Unavailable</span>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .seat-tooltip {
                    font-size: 12px;
                    padding: 6px;
                    max-width: 180px;
                    background: #fff;
                    color: #000;
                    border-radius: 4px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                }

                @media (min-width: 640px) {
                    .seat-tooltip {
                        font-size: 14px;
                        padding: 8px;
                        max-width: 200px;
                    }
                }
            `}</style>
        </div>
    );
};

export default SeatSelection;