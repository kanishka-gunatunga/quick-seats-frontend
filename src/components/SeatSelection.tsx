// ---------------------------------- final version -------

// import React, {useEffect, useState, useRef, useCallback} from 'react';
// import {TransformWrapper, TransformComponent, ReactZoomPanPinchRef} from 'react-zoom-pan-pinch';
// import {useSeatSelectApi, useUnseatSelectApi} from '@/hooks/useBooking';
// import {
//     ZoomIn,
//     ZoomOut,
//     Fullscreen,
//     KeyboardArrowUp,
//     KeyboardArrowLeft,
//     KeyboardArrowRight,
//     KeyboardArrowDown
// } from '@mui/icons-material';
// import {Tooltip} from 'react-tooltip';
// // import {useTimer} from "@/context/TimerContext";
//
// interface SeatData {
//     price: number;
//     seatId: string;
//     status: string;
//     type_id: number;
//     ticketTypeName?: string;
//     color?: string;
// }
//
// interface SeatSelectionProps {
//     mapId: string | undefined;
//     eventId: string;
//     initialSeatData: SeatData[];
//     onSeatSelect: (selectedSeats: SeatData[]) => void;
//     selectedSeatsFromParent: SeatData[];
//     // resetTrigger: number;
// }
//
// const SeatSelection: React.FC<SeatSelectionProps> = ({
//                                                          mapId,
//                                                          eventId,
//                                                          initialSeatData,
//                                                          onSeatSelect,
//                                                          selectedSeatsFromParent,
//                                                      }) => {
//     const selectSeatMutation = useSeatSelectApi();
//     const unselectSeatMutation = useUnseatSelectApi();
//     // const resetSeatMutation = useResetSeatApi();
//     const [svgRawContent, setSvgRawContent] = useState<string | null>(null);
//     const [seatsRenderState, setSeatsRenderState] = useState<SeatData[]>([]);
//     const [internalSelectedSeats, setInternalSelectedSeats] = useState<SeatData[]>([]);
//     const transformComponentRef = useRef<ReactZoomPanPinchRef>(null);
//     const [currentScale, setCurrentScale] = useState<number>(1);
//     const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
//     // const {timeLeft, stopTimer} = useTimer();
//
//     useEffect(() => {
//         const fetchSvg = async () => {
//             try {
//                 const response = await fetch(`/${mapId}.svg`);
//                 if (!response.ok) throw new Error(`Failed to fetch SVG: ${response.statusText}`);
//                 const svgText = await response.text();
//                 setSvgRawContent(svgText);
//             } catch (error) {
//                 console.error('Error fetching SVG:', error);
//                 setSvgRawContent(null);
//             }
//         };
//         if (mapId) {
//             fetchSvg();
//         }
//     }, [mapId]);
//
//     // Sync seat states
//     useEffect(() => {
//         const newSeatsRenderState: SeatData[] = initialSeatData.map((seat) => ({...seat}));
//         newSeatsRenderState.forEach((seat) => {
//             if (selectedSeatsFromParent.some((s) => s.seatId === seat.seatId)) {
//                 seat.status = 'selected';
//             } else if (seat.status === 'selected') {
//                 if (initialSeatData.find((s) => s.seatId === seat.seatId)?.status === 'available') {
//                     seat.status = 'available';
//                 }
//             }
//         });
//         setSeatsRenderState(newSeatsRenderState);
//         setInternalSelectedSeats(selectedSeatsFromParent);
//
//         const currentSeatIds = new Set(selectedSeatsFromParent.map((s) => s.seatId));
//         timersRef.current.forEach((timer, seatId) => {
//             if (!currentSeatIds.has(seatId)) {
//                 clearTimeout(timer);
//                 timersRef.current.delete(seatId);
//             }
//         });
//     }, [initialSeatData, selectedSeatsFromParent]);
//
//
//     // useEffect(() => {
//     //     if (timeLeft === 0 && internalSelectedSeats.length > 0) {
//     //         const resetSeats = async () => {
//     //             try {
//     //                 const unselectPromises = internalSelectedSeats.map((seat) =>
//     //                     unselectSeatMutation.mutateAsync({
//     //                         event_id: eventId,
//     //                         seat_id: seat.seatId,
//     //                     })
//     //                 );
//     //                 await Promise.all(unselectPromises);
//     //                 setSeatsRenderState((prev) =>
//     //                     prev.map((seat) =>
//     //                         internalSelectedSeats.some((s) => s.seatId === seat.seatId)
//     //                             ? {...seat, status: "available"}
//     //                             : seat
//     //                     )
//     //                 );
//     //                 setInternalSelectedSeats([]);
//     //                 onSeatSelect([]);
//     //                 stopTimer();
//     //             } catch (error) {
//     //                 console.error("Error resetting seats:", error);
//     //             }
//     //         };
//     //         resetSeats();
//     //     }
//     // }, [timeLeft, internalSelectedSeats, eventId, unselectSeatMutation, onSeatSelect, stopTimer]);
//
//     // useEffect(() => {
//     //     if (resetTrigger > 0) {
//     //         setInternalSelectedSeats([]);
//     //         setSeatsRenderState((prev) =>
//     //             prev.map((seat) => ({
//     //                 ...seat,
//     //                 status: seat.status === 'selected' ? 'available' : seat.status,
//     //             }))
//     //         );
//     //         timersRef.current.forEach((timer) => clearTimeout(timer));
//     //         timersRef.current.clear();
//     //         onSeatSelect([]);
//     //     }
//     // }, [resetTrigger, onSeatSelect]);
//
//     // const startResetTimer = useCallback(
//     //     (seatId: string) => {
//     //         if (timersRef.current.has(seatId)) {
//     //             clearTimeout(timersRef.current.get(seatId));
//     //         }
//     //
//     //         const timer = setTimeout(async () => {
//     //             try {
//     //                 await unselectSeatMutation.mutateAsync({
//     //                     event_id: eventId,
//     //                     seat_id: seatId,
//     //                 });
//     //                 setSeatsRenderState((prev) =>
//     //                     prev.map((seat) => (seat.seatId === seatId ? { ...seat, status: "available" } : seat))
//     //                 );
//     //                 setInternalSelectedSeats((prev) => prev.filter((seat) => seat.seatId !== seatId));
//     //                 onSeatSelect(internalSelectedSeats.filter((seat) => seat.seatId !== seatId));
//     //                 timersRef.current.delete(seatId);
//     //             } catch (error) {
//     //                 console.error(`Error resetting seat ${seatId}:`, error);
//     //             }
//     //         }, 3 * 60 * 1000);
//     //
//     //         timersRef.current.set(seatId, timer);
//     //     },
//     //     [unselectSeatMutation, eventId, onSeatSelect, internalSelectedSeats]
//     // );
//
//     const startResetTimer = useCallback(
//         (seatId: string) => {
//             if (timersRef.current.has(seatId)) {
//                 clearTimeout(timersRef.current.get(seatId));
//             }
//
//             const timer = setTimeout(async () => {
//                 try {
//                     // Use the unselect API instead of reset API for individual seats
//                     await unselectSeatMutation.mutateAsync({
//                         event_id: eventId,
//                         seat_id: seatId,
//                     });
//
//                     console.log(`Seat ${seatId} unselected after timeout`);
//
//                     // Update local state
//                     setSeatsRenderState((prev) =>
//                         prev.map((seat) =>
//                             seat.seatId === seatId ? {...seat, status: 'available'} : seat
//                         )
//                     );
//
//                     const newSelectedSeats = internalSelectedSeats.filter((seat) => seat.seatId !== seatId);
//                     setInternalSelectedSeats(newSelectedSeats);
//                     onSeatSelect(newSelectedSeats);
//
//                     timersRef.current.delete(seatId);
//                     console.log(`Seat ${seatId} reset after 15 minutes.`);
//                 } catch (error) {
//                     console.error(`Error resetting seat ${seatId}:`, error);
//                 }
//             }, 3 * 60 * 1000); // 15 minutes
//
//             timersRef.current.set(seatId, timer);
//         },
//         [eventId, unselectSeatMutation, onSeatSelect, internalSelectedSeats]
//     );
//
//
//     useEffect(() => {
//         const currentSeatIds = new Set(selectedSeatsFromParent.map((s) => s.seatId));
//
//         // Clear timers for seats that are no longer selected
//         timersRef.current.forEach((timer, seatId) => {
//             if (!currentSeatIds.has(seatId)) {
//                 clearTimeout(timer);
//                 timersRef.current.delete(seatId);
//             }
//         });
//
//         // Start timers for newly selected seats
//         selectedSeatsFromParent.forEach((seat) => {
//             if (!timersRef.current.has(seat.seatId)) {
//                 startResetTimer(seat.seatId);
//             }
//         });
//     }, [selectedSeatsFromParent, startResetTimer]);
//
//     // const startResetTimer = useCallback(
//     //     (seatId: string) => {
//     //         if (timersRef.current.has(seatId)) {
//     //             clearTimeout(timersRef.current.get(seatId));
//     //         }
//     //
//     //         const timer = setTimeout(async () => {
//     //             try {
//     //                 await resetSeatMutation.mutateAsync({
//     //                     event_id: eventId,
//     //                     seat_ids: [seatId],
//     //                 });
//     //                 setSeatsRenderState((prev) =>
//     //                     prev.map((seat) => (seat.seatId === seatId ? {...seat, status: "available"} : seat))
//     //                 );
//     //                 setInternalSelectedSeats((prev) => prev.filter((seat) => seat.seatId !== seatId));
//     //                 onSeatSelect(internalSelectedSeats.filter((seat) => seat.seatId !== seatId));
//     //                 timersRef.current.delete(seatId);
//     //             } catch (error) {
//     //                 console.error(`Error resetting seat ${seatId}:`, error);
//     //             }
//     //         }, 2 * 60 * 1000);
//     //
//     //         timersRef.current.set(seatId, timer);
//     //     },
//     //     [eventId, resetSeatMutation, onSeatSelect, internalSelectedSeats]
//     // );
//
//     const panToDirection = useCallback(
//         (direction: 'up' | 'down' | 'left' | 'right') => {
//             if (transformComponentRef.current) {
//                 const {instance} = transformComponentRef.current;
//                 const panStep = 100 / currentScale;
//
//                 switch (direction) {
//                     case 'up':
//                         instance.transformState.positionY += panStep;
//                         break;
//                     case 'down':
//                         instance.transformState.positionY -= panStep;
//                         break;
//                     case 'left':
//                         instance.transformState.positionX += panStep;
//                         break;
//                     case 'right':
//                         instance.transformState.positionX -= panStep;
//                         break;
//                 }
//
//                 instance.applyTransformation();
//             }
//         },
//         [currentScale]
//     );
//
//     const handleSeatClick = useCallback(
//         async (seatId: string) => {
//             const seat = seatsRenderState.find((s) => s.seatId === seatId);
//             if (!seat || seat.status === 'booked' || seat.status === 'unavailable') return;
//
//             const isCurrentlySelected = internalSelectedSeats.some((s) => s.seatId === seatId);
//             let newSelectedSeats: SeatData[];
//
//             if (isCurrentlySelected) {
//                 newSelectedSeats = internalSelectedSeats.filter((s) => s.seatId !== seatId);
//                 if (timersRef.current.has(seatId)) {
//                     clearTimeout(timersRef.current.get(seatId));
//                     timersRef.current.delete(seatId);
//                 }
//
//                 await unselectSeatMutation.mutateAsync(
//                     {event_id: eventId, seat_id: seatId},
//                     {
//                         onSuccess: () => console.log('Seat unselection API success'),
//                         onError: (err) => console.error('Seat unselection error: ', err),
//                     }
//                 );
//             } else {
//                 newSelectedSeats = [...internalSelectedSeats, {...seat, status: 'selected'}];
//                 startResetTimer(seatId);
//
//                 await selectSeatMutation.mutateAsync(
//                     {event_id: eventId, seat_id: seatId},
//                     {
//                         onSuccess: () => console.log('Seat selection API success'),
//                         onError: (err) => console.error('Seat selection error:', err),
//                     }
//                 );
//             }
//             setInternalSelectedSeats(newSelectedSeats);
//
//             const updatedSeatsRenderState = seatsRenderState.map((s) =>
//                 s.seatId === seatId ? {...s, status: isCurrentlySelected ? 'available' : 'selected'} : s
//             );
//             setSeatsRenderState(updatedSeatsRenderState);
//             onSeatSelect(newSelectedSeats);
//         },
//         [seatsRenderState, internalSelectedSeats, onSeatSelect, unselectSeatMutation, eventId, startResetTimer, selectSeatMutation]
//     );
//
//     const handleTransformChange = useCallback((ref: ReactZoomPanPinchRef) => {
//         setCurrentScale(ref.instance.transformState.scale);
//     }, []);
//
//     const getTooltipText = useCallback((seat: SeatData) => {
//         const category = seat.ticketTypeName || `Type ${seat.type_id}`;
//         const statusText = seat.status.charAt(0).toUpperCase() + seat.status.slice(1);
//         const priceText = seat.status === 'available' ? `LKR ${seat.price}` : '';
//         return `
//       <div style="font-size: 14px; padding: 8px; max-width: 200px; background: #fff; color: #000; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
//         <strong>Category:</strong> ${category}<br/>
//         <strong>Seat:</strong> ${seat.seatId}<br/>
//         <strong>Price:</strong> ${priceText}<br/>
//         <strong>Status:</strong> ${statusText}
//       </div>
//     `;
//     }, []);
//
//     const renderSvgContent = useCallback(() => {
//         if (!svgRawContent) return null;
//
//         const parser = new DOMParser();
//         const doc = parser.parseFromString(svgRawContent, 'image/svg+xml');
//         const svgElement = doc.documentElement;
//
//         if (!svgElement) {
//             console.error('SVG element not found in raw content');
//             return null;
//         }
//
//         svgElement.setAttribute('width', '100%');
//         svgElement.setAttribute('height', '100%');
//
//         const seatGroupElements = svgElement.querySelectorAll('g.seat-group');
//         seatGroupElements.forEach((seatGroupElement) => {
//             const seatId = seatGroupElement.id;
//             const seatInfo = seatsRenderState.find((s) => s.seatId === seatId);
//             const pathsInGroup = seatGroupElement.querySelectorAll('path');
//
//             pathsInGroup.forEach((pathElement) => {
//                 pathElement.classList.remove(
//                     'fill-gray-400',
//                     'fill-red-500',
//                     'fill-blue-500',
//                     'cursor-not-allowed',
//                     'cursor-pointer'
//                 );
//             });
//
//             if (seatInfo) {
//                 if (seatInfo.status === 'booked' || seatInfo.status === 'unavailable') {
//                     pathsInGroup.forEach((pathElement) => {
//                         pathElement.classList.add('fill-red-500', 'cursor-not-allowed');
//                     });
//                 } else {
//                     pathsInGroup.forEach((pathElement) => {
//                         pathElement.classList.add(
//                             seatInfo.status === 'selected' ? 'fill-blue-500' : 'fill-gray-400',
//                             'cursor-pointer'
//                         );
//                     });
//                 }
//                 seatGroupElement.setAttribute('id', `seat-${seatId}`);
//                 seatGroupElement.setAttribute('data-tooltip-id', `tooltip-${seatId}`);
//                 seatGroupElement.setAttribute('data-tooltip-html', getTooltipText(seatInfo));
//                 seatGroupElement.setAttribute('data-tooltip-place', 'top');
//             }
//         });
//
//         return (
//             <div
//                 dangerouslySetInnerHTML={{__html: svgElement.outerHTML}}
//                 onClick={(e) => {
//                     const target = e.target as SVGElement;
//                     const seatGroup = target.closest('g.seat-group');
//                     if (seatGroup && seatGroup.id) {
//                         handleSeatClick(seatGroup.id.replace('seat-', ''));
//                     }
//                 }}
//             />
//         );
//     }, [svgRawContent, seatsRenderState, handleSeatClick, getTooltipText]);
//
//     // Clean up timers on component unmount
//     useEffect(() => {
//         return () => {
//             timersRef.current.forEach((timer) => clearTimeout(timer));
//             timersRef.current.clear();
//         };
//     }, []);
//
//     if (!svgRawContent) {
//         return (
//             <div className="flex items-center justify-center h-64 text-gray-600">
//                 Loading seat map...
//             </div>
//         );
//     }
//
//     return (
//         <div
//             className="relative w-full md:w-2/3 flex mx-auto justify-center h-[30vh] lg:h-[70vh] overflow-hidden bg-gray-50 p-1 lg:p-2 border border-gray-200 rounded-lg shadow-inner"
//         >
//             <TransformWrapper
//                 ref={transformComponentRef}
//                 initialScale={1}
//                 minScale={0.5}
//                 maxScale={3}
//                 wheel={{step: 0.1}}
//                 pinch={{step: 0.05}}
//                 doubleClick={{mode: 'reset'}}
//                 onTransformed={handleTransformChange}
//             >
//                 {({zoomIn, zoomOut, resetTransform}) => (
//                     <>
//                         <div
//                             className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white p-2 rounded-lg shadow-md"
//                         >
//                             <button
//                                 onClick={() => zoomIn()}
//                                 className="p-2 bg-gray-100 rounded hover:bg-gray-200"
//                                 aria-label="Zoom In"
//                             >
//                                 <ZoomIn/>
//                             </button>
//                             <button
//                                 onClick={() => zoomOut()}
//                                 className="p-2 bg-gray-100 rounded hover:bg-gray-200"
//                                 aria-label="Zoom Out"
//                             >
//                                 <ZoomOut/>
//                             </button>
//                             <button
//                                 onClick={() => resetTransform()}
//                                 className="p-2 bg-gray-100 rounded hover:bg-gray-200"
//                                 aria-label="Reset Zoom"
//                             >
//                                 <Fullscreen/>
//                             </button>
//                             <button
//                                 onClick={() => panToDirection('up')}
//                                 className="p-2 bg-gray-100 rounded hover:bg-gray-200"
//                                 aria-label="Pan Up"
//                             >
//                                 <KeyboardArrowUp fontSize="small"/>
//                             </button>
//                             <button
//                                 onClick={() => panToDirection('left')}
//                                 className="p-2 bg-gray-100 rounded hover:bg-gray-200"
//                                 aria-label="Pan Left"
//                             >
//                                 <KeyboardArrowLeft fontSize="small"/>
//                             </button>
//                             <button
//                                 onClick={() => panToDirection('right')}
//                                 className="p-2 bg-gray-100 rounded hover:bg-gray-200"
//                                 aria-label="Pan Right"
//                             >
//                                 <KeyboardArrowRight fontSize="small"/>
//                             </button>
//                             <button
//                                 onClick={() => panToDirection('down')}
//                                 className="p-2 bg-gray-100 rounded hover:bg-gray-200"
//                                 aria-label="Pan Down"
//                             >
//                                 <KeyboardArrowDown fontSize="small"/>
//                             </button>
//                         </div>
//                         <TransformComponent
//                             wrapperStyle={{width: '100%', height: '100%'}}
//                             contentStyle={{width: '100%', height: '100%'}}
//                         >
//                             <div id="svg-container" className="w-full h-full relative">
//                                 {renderSvgContent()}
//                             </div>
//                         </TransformComponent>
//                         {seatsRenderState.map((seat) => (
//                             <Tooltip
//                                 key={seat.seatId}
//                                 id={`tooltip-${seat.seatId}`}
//                                 place="top"
//                                 float={true}
//                                 offset={10}
//                                 style={{
//                                     fontSize: '14px',
//                                     padding: '8px',
//                                     maxWidth: '200px',
//                                     backgroundColor: '#fff',
//                                     color: '#000',
//                                     borderRadius: '4px',
//                                     boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
//                                     zIndex: 1000,
//                                 }}
//                             />
//                         ))}
//                     </>
//                 )}
//             </TransformWrapper>
//
//             <div
//                 className="absolute left-1 bottom-1 z-10 bg-white p-3 rounded-xl shadow-lg border border-gray-200 backdrop-blur-sm bg-opacity-95"
//             >
//                 <div className="flex">
//                     <div className="flex gap-4 text-sm">
//                         <div className="flex items-center gap-2">
//                             <div className="w-4 h-4 bg-gray-400 rounded"></div>
//                             <span>Available</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <div className="w-4 h-4 bg-blue-500 rounded"></div>
//                             <span>Selected</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <div className="w-4 h-4 bg-red-500 rounded"></div>
//                             <span>Unavailable</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default SeatSelection;

//-----------------------------new latest 2025.08.05

// import React, {useEffect, useState, useRef, useCallback, useMemo} from "react";
// import {TransformWrapper, TransformComponent, ReactZoomPanPinchRef} from "react-zoom-pan-pinch";
// import {useSelector, useDispatch} from "react-redux";
// import {
//     ZoomIn,
//     ZoomOut,
//     Fullscreen,
//     KeyboardArrowUp,
//     KeyboardArrowLeft,
//     KeyboardArrowRight,
//     KeyboardArrowDown,
// } from "@mui/icons-material";
// import {Alert} from "@mui/material";
// import {useSeatSelectApi, useUnseatSelectApi} from "@/hooks/useBooking";
// import {selectSeats, unselectSeats} from "@/store/bookingSlice";
// import {RootState} from "@/store/store";
// import {useQueryClient} from "@tanstack/react-query";
// import {Tooltip} from "react-tooltip";
//
// interface SeatData {
//     price: number;
//     seatId: string;
//     status: string;
//     type_id: number;
//     ticketTypeName?: string;
//     color?: string;
// }
//
// interface SeatSelectionProps {
//     mapId: string | undefined;
//     eventId: string;
// }
//
// const SeatSelection: React.FC<SeatSelectionProps> = ({mapId, eventId}) => {
//     const dispatch = useDispatch();
//     const selectedSeats = useSelector((state: RootState) => state.booking.selectedSeats);
//     const currentSeatData = useSelector((state: RootState) => state.booking.currentSeatData);
//     const [svgRawContent, setSvgRawContent] = useState<string | null>(null);
//     const transformComponentRef = useRef<ReactZoomPanPinchRef>(null);
//     const [currentScale, setCurrentScale] = useState<number>(1);
//     const queryClient = useQueryClient();
//     const [seatError, setSeatError] = useState<string | null>(null);
//
//     const selectSeatMutation = useSeatSelectApi();
//     const unselectSeatMutation = useUnseatSelectApi();
//
//     useEffect(() => {
//         const fetchSvg = async () => {
//             try {
//                 const response = await fetch(`/${mapId}.svg`);
//                 if (!response.ok) throw new Error(`Failed to fetch SVG: ${response.statusText}`);
//                 const svgText = await response.text();
//                 setSvgRawContent(svgText);
//             } catch (error) {
//                 console.error("Error fetching SVG:", error);
//                 setSvgRawContent(null);
//             }
//         };
//         if (mapId) {
//             fetchSvg();
//         }
//     }, [mapId]);
//
//     useEffect(() => {
//         console.log("Current Seat Data:", currentSeatData);
//     }, [currentSeatData]);
//
//     const handleSeatClick = useCallback(
//         async (seatId: string) => {
//             console.log(`Seat clicked: ${seatId}`);
//             const seat = currentSeatData.find((s) => s.seatId === seatId);
//             if (!seat || seat.status === "booked" || seat.status === "unavailable") {
//                 setSeatError(`Seat ${seatId} is not available for selection.`);
//                 setTimeout(() => setSeatError(null), 5000);
//                 return;
//             }
//
//             const isCurrentlySelected = selectedSeats.some((s) => s.seatId === seatId);
//
//             if (isCurrentlySelected) {
//                 dispatch(unselectSeats({seatIds: [seatId], eventId}));
//                 try {
//                     await unselectSeatMutation.mutateAsync(
//                         {event_id: eventId, seat_id: seatId},
//                         {
//                             onSuccess: () => {
//                                 console.log(`Seat ${seatId} unselected`);
//                                 queryClient.invalidateQueries({queryKey: ["seatData", eventId]});
//                             },
//                             onError: (error: Error) => {
//                                 console.error(`Seat unselection error for ${seatId}:`, error);
//                                 setSeatError(`Failed to unselect seat ${seatId}: ${error.message || "Unknown error"}`);
//                                 setTimeout(() => setSeatError(null), 5000);
//                             },
//                         }
//                     );
//                 } catch (error) {
//                     console.error(`Failed to unselect seat ${seatId}:`, error);
//                     setSeatError(`Failed to unselect seat ${seatId}. Please try again.`);
//                     setTimeout(() => setSeatError(null), 5000);
//                 }
//             } else {
//                 if (seat.status !== "available") {
//                     setSeatError(`Seat ${seatId} is not available for selection.`);
//                     setTimeout(() => setSeatError(null), 5000);
//                     return;
//                 }
//                 dispatch(selectSeats({seats: [{...seat, status: "selected"}], eventId}));
//                 try {
//                     await selectSeatMutation.mutateAsync(
//                         {event_id: eventId, seat_id: seatId},
//                         {
//                             onSuccess: () => {
//                                 console.log(`Seat ${seatId} selected`);
//                                 queryClient.invalidateQueries({queryKey: ["seatData", eventId]});
//                             },
//                             onError: (error: Error) => {
//                                 console.error(`Seat selection error for ${seatId}:`, error);
//                                 dispatch(unselectSeats({seatIds: [seatId], eventId}));
//                                 setSeatError(`Failed to select seat ${seatId}: ${error.message || "Unknown error"}`);
//                                 setTimeout(() => setSeatError(null), 5000);
//                             },
//                         }
//                     );
//                 } catch (error) {
//                     console.error(`Failed to select seat ${seatId}:`, error);
//                     dispatch(unselectSeats({seatIds: [seatId], eventId}));
//                     setSeatError(`Failed to select seat ${seatId}. Please try again.`);
//                     setTimeout(() => setSeatError(null), 5000);
//                 }
//             }
//         },
//         [currentSeatData, selectedSeats, dispatch, selectSeatMutation, unselectSeatMutation, eventId, queryClient]
//     );
//
//     const handleTransformChange = useCallback((ref: ReactZoomPanPinchRef) => {
//         setCurrentScale(ref.instance.transformState.scale);
//         console.log(`Current scale: ${ref.instance.transformState.scale}`);
//     }, []);
//
//     const panToDirection = useCallback(
//         (direction: "up" | "down" | "left" | "right") => {
//             if (transformComponentRef.current) {
//                 const {instance} = transformComponentRef.current;
//                 const panStep = 100 / currentScale;
//                 switch (direction) {
//                     case "up":
//                         instance.transformState.positionY += panStep;
//                         break;
//                     case "down":
//                         instance.transformState.positionY -= panStep;
//                         break;
//                     case "left":
//                         instance.transformState.positionX += panStep;
//                         break;
//                     case "right":
//                         instance.transformState.positionX -= panStep;
//                         break;
//                 }
//                 instance.applyTransformation();
//             }
//         },
//         [currentScale]
//     );
//
//     const getTooltipText = useCallback((seat: SeatData) => {
//         const category = seat.ticketTypeName || `Type ${seat.type_id}`;
//         const statusText = seat.status.charAt(0).toUpperCase() + seat.status.slice(1);
//         const priceText = seat.status === "available" ? `LKR ${seat.price}` : "";
//         return `
//             <div style="font-size: 14px; padding: 8px; max-width: 200px; background: #fff; color: #000; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
//                 <strong>Category:</strong> ${category}<br/>
//                 <strong>Seat:</strong> ${seat.seatId}<br/>
//                 <strong>Price:</strong> ${priceText}<br/>
//                 <strong>Status:</strong> ${statusText}
//             </div>
//         `;
//     }, []);
//
//     const renderSvgContent = useMemo(() => {
//         if (!svgRawContent || !currentSeatData.length) {
//             console.log("No SVG content or seat data available");
//             return null;
//         }
//
//         console.log("Rendering SVG with seat data:", currentSeatData);
//
//         const parser = new DOMParser();
//         const doc = parser.parseFromString(svgRawContent, "image/svg+xml");
//         const svgElement = doc.documentElement;
//
//         if (!svgElement) {
//             console.error("SVG element not found in raw content");
//             return null;
//         }
//
//         svgElement.setAttribute("width", "100%");
//         svgElement.setAttribute("height", "100%");
//
//         const seatGroupElements = svgElement.querySelectorAll("g.seat-group");
//         seatGroupElements.forEach((seatGroupElement) => {
//             const seatId = seatGroupElement.id;
//             const seatInfo = currentSeatData.find((s) => s.seatId === seatId);
//             const pathsInGroup = seatGroupElement.querySelectorAll("path");
//
//             pathsInGroup.forEach((pathElement) => {
//                 pathElement.classList.remove("fill-gray-400", "fill-red-500", "fill-blue-500", "cursor-not-allowed", "cursor-pointer");
//             });
//
//             if (seatInfo) {
//                 const isSelected = selectedSeats.some((s) => s.seatId === seatId);
//                 if (seatInfo.status === "booked" || seatInfo.status === "unavailable") {
//                     pathsInGroup.forEach((pathElement) => {
//                         pathElement.classList.add("fill-red-500", "cursor-not-allowed");
//                     });
//                 } else if (isSelected) {
//                     pathsInGroup.forEach((pathElement) => {
//                         pathElement.classList.add("fill-blue-500", "cursor-pointer");
//                     });
//                 } else {
//                     pathsInGroup.forEach((pathElement) => {
//                         pathElement.classList.add("fill-gray-400", "cursor-pointer");
//                     });
//                 }
//                 seatGroupElement.setAttribute("id", `seat-${seatId}`);
//                 seatGroupElement.setAttribute("data-seat-id", seatId);
//                 seatGroupElement.setAttribute("data-tooltip-id", `tooltip-${seatId}`);
//                 seatGroupElement.setAttribute("data-tooltip-html", getTooltipText(seatInfo));
//                 seatGroupElement.setAttribute("data-tooltip-place", "top");
//             }
//         });
//
//         return (
//             <div
//                 className="relative w-full h-full"
//                 dangerouslySetInnerHTML={{__html: svgElement.outerHTML}}
//                 onClick={(e) => {
//                     const target = e.target as SVGElement;
//                     const seatGroup = target.closest("g.seat-group");
//                     if (seatGroup && seatGroup.id) {
//                         handleSeatClick(seatGroup.id.replace("seat-", ""));
//                     }
//                 }}
//                 onMouseMove={(e) => {
//                     const target = e.target as SVGElement;
//                     const seatGroup = target.closest("g.seat-group");
//                     if (seatGroup && seatGroup.getAttribute("data-seat-id")) {
//                         console.log(`Hovering seat: ${seatGroup.getAttribute("data-seat-id")}`);
//                     } else {
//                         console.log("Mouse not over a seat");
//                     }
//                 }}
//                 onMouseLeave={() => {
//                     console.log("Mouse left SVG");
//                 }}
//             />
//         );
//     }, [svgRawContent, currentSeatData, selectedSeats, handleSeatClick, getTooltipText]);
//
//     if (!svgRawContent) {
//         return (
//             <div className="flex items-center justify-center h-64 text-gray-600">
//                 Loading seat map...
//             </div>
//         );
//     }
//
//     return (
//         <div
//             className="relative w-full md:w-2/3 flex mx-auto justify-center h-[30vh] lg:h-[70vh] overflow-hidden bg-gray-50 p-1 lg:p-2 border border-gray-200 rounded-lg shadow-inner"
//         >
//             {seatError && (
//                 <Alert
//                     severity="error"
//                     sx={{position: "absolute", top: 10, zIndex: 1000, width: "90%", maxWidth: 500}}
//                     onClose={() => setSeatError(null)}
//                 >
//                     {seatError}
//                 </Alert>
//             )}
//             <TransformWrapper
//                 ref={transformComponentRef}
//                 initialScale={1}
//                 minScale={0.5}
//                 maxScale={3}
//                 wheel={{step: 0.1}}
//                 pinch={{step: 0.05}}
//                 doubleClick={{mode: "reset"}}
//                 onTransformed={handleTransformChange}
//             >
//                 {({zoomIn, zoomOut, resetTransform}) => (
//                     <>
//                         <div
//                             className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white p-2 rounded-lg shadow-md">
//                             <button
//                                 onClick={() => zoomIn()}
//                                 className="p-2 bg-gray-100 rounded hover:bg-gray-200"
//                                 aria-label="Zoom In"
//                             >
//                                 <ZoomIn/>
//                             </button>
//                             <button
//                                 onClick={() => zoomOut()}
//                                 className="p-2 bg-gray-100 rounded hover:bg-gray-200"
//                                 aria-label="Zoom Out"
//                             >
//                                 <ZoomOut/>
//                             </button>
//                             <button
//                                 onClick={() => resetTransform()}
//                                 className="p-2 bg-gray-100 rounded hover:bg-gray-200"
//                                 aria-label="Reset Zoom"
//                             >
//                                 <Fullscreen/>
//                             </button>
//                             <button
//                                 onClick={() => panToDirection("up")}
//                                 className="p-2 bg-gray-100 rounded hover:bg-gray-200"
//                                 aria-label="Pan Up"
//                             >
//                                 <KeyboardArrowUp fontSize="small"/>
//                             </button>
//                             <button
//                                 onClick={() => panToDirection("left")}
//                                 className="p-2 bg-gray-100 rounded hover:bg-gray-200"
//                                 aria-label="Pan Left"
//                             >
//                                 <KeyboardArrowLeft fontSize="small"/>
//                             </button>
//                             <button
//                                 onClick={() => panToDirection("right")}
//                                 className="p-2 bg-gray-100 rounded hover:bg-gray-200"
//                                 aria-label="Pan Right"
//                             >
//                                 <KeyboardArrowRight fontSize="small"/>
//                             </button>
//                             <button
//                                 onClick={() => panToDirection("down")}
//                                 className="p-2 bg-gray-100 rounded hover:bg-gray-200"
//                                 aria-label="Pan Down"
//                             >
//                                 <KeyboardArrowDown fontSize="small"/>
//                             </button>
//                         </div>
//                         <TransformComponent wrapperStyle={{width: "100%", height: "100%"}}
//                                             contentStyle={{width: "100%", height: "100%"}}>
//                             <div id="svg-container" className="w-full h-full relative">
//                                 {renderSvgContent}
//                             </div>
//                         </TransformComponent>
//                         {currentSeatData.map((seat) => (
//                             <Tooltip
//                                 key={seat.seatId}
//                                 id={`tooltip-${seat.seatId}`}
//                                 place="top"
//                                 float={true}
//                                 offset={10}
//                                 style={{
//                                     fontSize: '14px',
//                                     padding: '8px',
//                                     maxWidth: '200px',
//                                     backgroundColor: '#fff',
//                                     color: '#000',
//                                     borderRadius: '4px',
//                                     boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
//                                     zIndex: 1000,
//                                 }}
//                             />
//                         ))}
//                     </>
//                 )}
//             </TransformWrapper>
//             <div
//                 className="absolute left-1 bottom-1 z-10 bg-white p-3 rounded-xl shadow-lg border border-gray-200 backdrop-blur-sm bg-opacity-95">
//                 <div className="flex gap-4 text-sm">
//                     <div className="flex items-center gap-2">
//                         <div className="w-4 h-4 bg-gray-400 rounded"></div>
//                         <span>Available</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                         <div className="w-4 h-4 bg-blue-500 rounded"></div>
//                         <span>Selected</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                         <div className="w-4 h-4 bg-red-500 rounded"></div>
//                         <span>Unavailable</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default SeatSelection;

//--------------

//-----------------------  2025.08.07

// import React, {useEffect, useState, useRef, useCallback, useMemo} from "react";
// import {TransformWrapper, TransformComponent, ReactZoomPanPinchRef} from "react-zoom-pan-pinch";
// import {useSelector, useDispatch} from "react-redux";
// import {
//     ZoomIn,
//     ZoomOut,
//     Fullscreen,
//     KeyboardArrowUp,
//     KeyboardArrowLeft,
//     KeyboardArrowRight,
//     KeyboardArrowDown,
// } from "@mui/icons-material";
// import {Alert} from "@mui/material";
// import {useSeatSelectApi, useUnseatSelectApi} from "@/hooks/useBooking";
// import {selectSeats, unselectSeats} from "@/store/bookingSlice";
// import {RootState} from "@/store/store";
// import {useQueryClient} from "@tanstack/react-query";
// import {Tooltip} from "react-tooltip";
// import {debounce} from "lodash";
//
// interface SeatData {
//     price: number;
//     seatId: string;
//     status: string;
//     type_id: number;
//     ticketTypeName?: string;
//     color?: string;
// }
//
// interface SeatSelectionProps {
//     mapId: string | undefined;
//     eventId: string;
// }
//
// const SeatSelection: React.FC<SeatSelectionProps> = ({mapId, eventId}) => {
//     const dispatch = useDispatch();
//     const selectedSeats = useSelector((state: RootState) => state.booking.selectedSeats);
//     const currentSeatData = useSelector((state: RootState) => state.booking.currentSeatData);
//     const [svgRawContent, setSvgRawContent] = useState<string | null>(null);
//     const transformComponentRef = useRef<ReactZoomPanPinchRef>(null);
//     const [currentScale, setCurrentScale] = useState<number>(1);
//     const queryClient = useQueryClient();
//     const [seatError, setSeatError] = useState<string | null>(null);
//     const [tooltipContent, setTooltipContent] = useState<string | undefined>(undefined);
//
//     const selectSeatMutation = useSeatSelectApi();
//     const unselectSeatMutation = useUnseatSelectApi();
//
//     useEffect(() => {
//         const fetchSvg = async () => {
//             try {
//                 const response = await fetch(`/${mapId}.svg`);
//                 if (!response.ok) throw new Error(`Failed to fetch SVG: ${response.statusText}`);
//                 const svgText = await response.text();
//                 setSvgRawContent(svgText);
//             } catch (error) {
//                 console.error("Error fetching SVG:", error);
//                 setSvgRawContent(null);
//             }
//         };
//         if (mapId) {
//             fetchSvg();
//         }
//     }, [mapId]);
//
//     useEffect(() => {
//         console.log("Current Seat Data:", currentSeatData);
//     }, [currentSeatData]);
//
//     const handleSeatClick = useCallback(
//         async (seatId: string) => {
//             console.log(`Seat clicked: ${seatId}`);
//             const seat = currentSeatData.find((s) => s.seatId === seatId);
//             if (!seat || seat.status === "booked" || seat.status === "unavailable") {
//                 setSeatError(`Seat ${seatId} is not available for selection.`);
//                 setTimeout(() => setSeatError(null), 5000);
//                 return;
//             }
//
//             const isCurrentlySelected = selectedSeats.some((s) => s.seatId === seatId);
//
//             if (isCurrentlySelected) {
//                 dispatch(unselectSeats({seatIds: [seatId], eventId}));
//                 try {
//                     await unselectSeatMutation.mutateAsync(
//                         {event_id: eventId, seat_id: seatId},
//                         {
//                             onSuccess: () => {
//                                 console.log(`Seat ${seatId} unselected`);
//                                 queryClient.invalidateQueries({queryKey: ["seatData", eventId]});
//                             },
//                             onError: (error: Error) => {
//                                 console.error(`Seat unselection error for ${seatId}:`, error);
//                                 setSeatError(`Failed to unselect seat ${seatId}: ${error.message || "Unknown error"}`);
//                                 setTimeout(() => setSeatError(null), 5000);
//                             },
//                         }
//                     );
//                 } catch (error) {
//                     console.error(`Failed to unselect seat ${seatId}:`, error);
//                     setSeatError(`Failed to unselect seat ${seatId}. Please try again.`);
//                     setTimeout(() => setSeatError(null), 5000);
//                 }
//             } else {
//                 if (seat.status !== "available") {
//                     setSeatError(`Seat ${seatId} is not available for selection.`);
//                     setTimeout(() => setSeatError(null), 5000);
//                     return;
//                 }
//                 dispatch(selectSeats({seats: [{...seat, status: "selected"}], eventId}));
//                 try {
//                     await selectSeatMutation.mutateAsync(
//                         {event_id: eventId, seat_id: seatId},
//                         {
//                             onSuccess: () => {
//                                 console.log(`Seat ${seatId} selected`);
//                                 queryClient.invalidateQueries({queryKey: ["seatData", eventId]});
//                             },
//                             onError: (error: Error) => {
//                                 console.error(`Seat selection error for ${seatId}:`, error);
//                                 dispatch(unselectSeats({seatIds: [seatId], eventId}));
//                                 setSeatError(`Failed to select seat ${seatId}: ${error.message || "Unknown error"}`);
//                                 setTimeout(() => setSeatError(null), 5000);
//                             },
//                         }
//                     );
//                 } catch (error) {
//                     console.error(`Failed to select seat ${seatId}:`, error);
//                     dispatch(unselectSeats({seatIds: [seatId], eventId}));
//                     setSeatError(`Failed to select seat ${seatId}. Please try again.`);
//                     setTimeout(() => setSeatError(null), 5000);
//                 }
//             }
//         },
//         [currentSeatData, selectedSeats, dispatch, selectSeatMutation, unselectSeatMutation, eventId, queryClient]
//     );
//
//     const handleTransformChange = useCallback((ref: ReactZoomPanPinchRef) => {
//         setCurrentScale(ref.instance.transformState.scale);
//         console.log(`Current scale: ${ref.instance.transformState.scale}`);
//     }, []);
//
//     const panToDirection = useCallback(
//         (direction: "up" | "down" | "left" | "right") => {
//             if (transformComponentRef.current) {
//                 const {instance} = transformComponentRef.current;
//                 const panStep = 100 / currentScale;
//                 switch (direction) {
//                     case "up":
//                         instance.transformState.positionY += panStep;
//                         break;
//                     case "down":
//                         instance.transformState.positionY -= panStep;
//                         break;
//                     case "left":
//                         instance.transformState.positionX += panStep;
//                         break;
//                     case "right":
//                         instance.transformState.positionX -= panStep;
//                         break;
//                 }
//                 instance.applyTransformation();
//             }
//         },
//         [currentScale]
//     );
//
//     const getTooltipText = useCallback((seat: SeatData) => {
//         const category = seat.ticketTypeName || `Type ${seat.type_id}`;
//         const statusText = seat.status.charAt(0).toUpperCase() + seat.status.slice(1);
//         const priceText = seat.status === "available" ? `LKR ${seat.price}` : "";
//         return `
//             <div class="seat-tooltip">
//                 <strong>Category:</strong> ${category}<br/>
//                 <strong>Seat:</strong> ${seat.seatId}<br/>
//                 <strong>Price:</strong> ${priceText}<br/>
//                 <strong>Status:</strong> ${statusText}
//             </div>
//         `;
//     }, []);
//
//     // Debounced handler for hover events
//     const handleSeatHover = useMemo(
//         () =>
//             debounce((seatId: string | null) => {
//                 if (seatId) {
//                     const seat = currentSeatData.find((s) => s.seatId === seatId);
//                     setTooltipContent(seat ? getTooltipText(seat) : undefined);
//                 } else {
//                     setTooltipContent(undefined);
//                 }
//             }, 500),
//         [currentSeatData, getTooltipText]
//     );
//
//     // Cleanup debounce on unmount
//     useEffect(() => {
//         return () => {
//             handleSeatHover.cancel();
//         };
//     }, [handleSeatHover]);
//
//     const renderSvgContent = useMemo(() => {
//         if (!svgRawContent || !currentSeatData.length) {
//             console.log("No SVG content or seat data available");
//             return null;
//         }
//
//         console.log("Rendering SVG with seat data:", currentSeatData);
//
//         const parser = new DOMParser();
//         const doc = parser.parseFromString(svgRawContent, "image/svg+xml");
//         const svgElement = doc.documentElement;
//
//         if (!svgElement) {
//             console.error("SVG element not found in raw content");
//             return null;
//         }
//
//         svgElement.setAttribute("width", "100%");
//         svgElement.setAttribute("height", "100%");
//
//         const seatGroupElements = svgElement.querySelectorAll("g.seat-group");
//         seatGroupElements.forEach((seatGroupElement) => {
//             const seatId = seatGroupElement.id;
//             const seatInfo = currentSeatData.find((s) => s.seatId === seatId);
//             const pathsInGroup = seatGroupElement.querySelectorAll("path");
//
//             pathsInGroup.forEach((pathElement) => {
//                 pathElement.classList.remove("fill-gray-400", "fill-red-500", "fill-blue-500", "cursor-not-allowed", "cursor-pointer");
//             });
//
//             if (seatInfo) {
//                 const isSelected = selectedSeats.some((s) => s.seatId === seatId);
//                 if (seatInfo.status === "booked" || seatInfo.status === "unavailable") {
//                     pathsInGroup.forEach((pathElement) => {
//                         pathElement.classList.add("fill-red-500", "cursor-not-allowed");
//                     });
//                 } else if (isSelected) {
//                     pathsInGroup.forEach((pathElement) => {
//                         pathElement.classList.add("fill-blue-500", "cursor-pointer");
//                     });
//                 } else {
//                     pathsInGroup.forEach((pathElement) => {
//                         pathElement.classList.add("fill-gray-400", "cursor-pointer");
//                     });
//                 }
//                 seatGroupElement.setAttribute("id", `seat-${seatId}`);
//                 seatGroupElement.setAttribute("data-seat-id", seatId);
//                 seatGroupElement.setAttribute("data-tooltip-id", "tooltip-global");
//                 seatGroupElement.setAttribute("data-tooltip-html", getTooltipText(seatInfo));
//                 seatGroupElement.setAttribute("data-tooltip-place", "top");
//             }
//         });
//
//         return (
//             <div
//                 className="relative w-full h-full"
//                 dangerouslySetInnerHTML={{__html: svgElement.outerHTML}}
//                 onClick={(e) => {
//                     const target = e.target as SVGElement;
//                     const seatGroup = target.closest("g.seat-group");
//                     if (seatGroup && seatGroup.id) {
//                         handleSeatClick(seatGroup.id.replace("seat-", ""));
//                     }
//                 }}
//                 onMouseMove={(e) => {
//                     const target = e.target as SVGElement;
//                     const seatGroup = target.closest("g.seat-group");
//                     const seatId = seatGroup?.getAttribute("data-seat-id") || null;
//                     handleSeatHover(seatId);
//                 }}
//                 onMouseLeave={() => {
//                     handleSeatHover(null);
//                     console.log("Mouse left SVG");
//                 }}
//             />
//         );
//     }, [svgRawContent, currentSeatData, selectedSeats, handleSeatClick, getTooltipText, handleSeatHover]);
//
//     if (!svgRawContent) {
//         return (
//             <div className="flex items-center justify-center h-64 text-gray-600">
//                 Loading seat map...
//             </div>
//         );
//     }
//
//     return (
//         <div
//             className="relative w-full md:w-2/3 flex mx-auto justify-center h-[30vh] lg:h-[70vh] overflow-hidden bg-gray-50 p-1 lg:p-2 border border-gray-200 rounded-lg shadow-inner">
//             {seatError && (
//                 <Alert
//                     severity="error"
//                     sx={{position: "absolute", top: 10, zIndex: 1000, width: "90%", maxWidth: 500}}
//                     onClose={() => setSeatError(null)}
//                 >
//                     {seatError}
//                 </Alert>
//             )}
//             <TransformWrapper
//                 ref={transformComponentRef}
//                 initialScale={1}
//                 minScale={0.5}
//                 maxScale={3}
//                 wheel={{step: 0.1}}
//                 pinch={{step: 0.05}}
//                 doubleClick={{mode: "reset"}}
//                 onTransformed={handleTransformChange}
//             >
//                 {({zoomIn, zoomOut, resetTransform}) => (
//                     <>
//                         <div
//                             className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white p-2 rounded-lg shadow-md">
//                             <button
//                                 onClick={() => zoomIn()}
//                                 className="p-2 bg-gray-100 rounded hover:bg-gray-200"
//                                 aria-label="Zoom In"
//                             >
//                                 <ZoomIn/>
//                             </button>
//                             <button
//                                 onClick={() => zoomOut()}
//                                 className="p-2 bg-gray-100 rounded hover:bg-gray-200"
//                                 aria-label="Zoom Out"
//                             >
//                                 <ZoomOut/>
//                             </button>
//                             <button
//                                 onClick={() => resetTransform()}
//                                 className="p-2 bg-gray-100 rounded hover:bg-gray-200"
//                                 aria-label="Reset Zoom"
//                             >
//                                 <Fullscreen/>
//                             </button>
//                             <button
//                                 onClick={() => panToDirection("up")}
//                                 className="p-2 bg-gray-100 rounded hover:bg-gray-200"
//                                 aria-label="Pan Up"
//                             >
//                                 <KeyboardArrowUp fontSize="small"/>
//                             </button>
//                             <button
//                                 onClick={() => panToDirection("left")}
//                                 className="p-2 bg-gray-100 rounded hover:bg-gray-200"
//                                 aria-label="Pan Left"
//                             >
//                                 <KeyboardArrowLeft fontSize="small"/>
//                             </button>
//                             <button
//                                 onClick={() => panToDirection("right")}
//                                 className="p-2 bg-gray-100 rounded hover:bg-gray-200"
//                                 aria-label="Pan Right"
//                             >
//                                 <KeyboardArrowRight fontSize="small"/>
//                             </button>
//                             <button
//                                 onClick={() => panToDirection("down")}
//                                 className="p-2 bg-gray-100 rounded hover:bg-gray-200"
//                                 aria-label="Pan Down"
//                             >
//                                 <KeyboardArrowDown fontSize="small"/>
//                             </button>
//                         </div>
//                         <TransformComponent wrapperStyle={{width: "100%", height: "100%"}}
//                                             contentStyle={{width: "100%", height: "100%"}}>
//                             <div id="svg-container" className="w-full h-full relative">
//                                 {renderSvgContent}
//                             </div>
//                         </TransformComponent>
//                         <Tooltip
//                             id="tooltip-global"
//                             place="top"
//                             float={true}
//                             offset={10}
//                             content={tooltipContent}
//                             style={{
//                                 fontSize: "14px",
//                                 padding: "8px",
//                                 maxWidth: "200px",
//                                 backgroundColor: "#fff",
//                                 color: "#000",
//                                 borderRadius: "4px",
//                                 boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//                                 zIndex: 1000,
//                             }}
//                         />
//                     </>
//                 )}
//             </TransformWrapper>
//             <div
//                 className="absolute left-1 bottom-1 z-10 bg-white p-3 rounded-xl shadow-lg border border-gray-200 backdrop-blur-sm bg-opacity-95">
//                 <div className="flex gap-4 text-sm">
//                     <div className="flex items-center gap-2">
//                         <div className="w-4 h-4 bg-gray-400 rounded"></div>
//                         <span>Available</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                         <div className="w-4 h-4 bg-blue-500 rounded"></div>
//                         <span>Selected</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                         <div className="w-4 h-4 bg-red-500 rounded"></div>
//                         <span>Unavailable</span>
//                     </div>
//                 </div>
//             </div>
//             <style jsx>{`
//                 .seat-tooltip {
//                     font-size: 14px;
//                     padding: 8px;
//                     max-width: 200px;
//                     background: #fff;
//                     color: #000;
//                     border-radius: 4px;
//                     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
//                 }
//             `}</style>
//         </div>
//     );
// };
//
// export default SeatSelection;


// ---------------------- 2025.08.16

import React, {useEffect, useState, useRef, useCallback, useMemo} from "react";
import {TransformWrapper, TransformComponent, ReactZoomPanPinchRef} from "react-zoom-pan-pinch";
import {useSelector, useDispatch} from "react-redux";
import {
    ZoomIn,
    ZoomOut,
    Fullscreen,
    KeyboardArrowUp,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    KeyboardArrowDown,
} from "@mui/icons-material";
import {Alert} from "@mui/material";
import {useSeatSelectApi, useUnseatSelectApi} from "@/hooks/useBooking";
import {selectSeats, unselectSeats} from "@/store/bookingSlice";
import {RootState} from "@/store/store";
import {useQueryClient} from "@tanstack/react-query";
import {Tooltip} from "react-tooltip";

interface SeatData {
    price: number;
    seatId: string;
    status: string;
    type_id: number;
    ticketTypeName?: string;
    color?: string;
}

interface SeatSelectionProps {
    mapId: string | undefined;
    eventId: string;
}

const SeatSelection: React.FC<SeatSelectionProps> = ({mapId, eventId}) => {
    const dispatch = useDispatch();
    const selectedSeats = useSelector((state: RootState) => state.booking.selectedSeats);
    const currentSeatData = useSelector((state: RootState) => state.booking.currentSeatData);
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
            });

            if (seatInfo) {
                const isSelected = selectedSeats.some((s) => s.seatId === seatId);
                if (seatInfo.status === "booked" || seatInfo.status === "unavailable") {
                    pathsInGroup.forEach((pathElement) => {
                        pathElement.classList.add("fill-red-500", "cursor-not-allowed");
                    });
                } else if (isSelected) {
                    pathsInGroup.forEach((pathElement) => {
                        pathElement.classList.add("fill-blue-500", "cursor-pointer");
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
            className="relative w-full md:w-2/3 flex mx-auto justify-center h-[30vh] lg:h-[70vh] overflow-hidden bg-gray-50 p-1 lg:p-2 border border-gray-200 rounded-lg shadow-inner">
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
                            className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white p-2 rounded-lg shadow-md">
                            <button
                                onClick={() => zoomIn()}
                                className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                                aria-label="Zoom In"
                            >
                                <ZoomIn/>
                            </button>
                            <button
                                onClick={() => zoomOut()}
                                className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                                aria-label="Zoom Out"
                            >
                                <ZoomOut/>
                            </button>
                            <button
                                onClick={() => resetTransform()}
                                className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                                aria-label="Reset Zoom"
                            >
                                <Fullscreen/>
                            </button>
                            <button
                                onClick={() => panToDirection("up")}
                                className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                                aria-label="Pan Up"
                            >
                                <KeyboardArrowUp fontSize="small"/>
                            </button>
                            <button
                                onClick={() => panToDirection("left")}
                                className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                                aria-label="Pan Left"
                            >
                                <KeyboardArrowLeft fontSize="small"/>
                            </button>
                            <button
                                onClick={() => panToDirection("right")}
                                className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                                aria-label="Pan Right"
                            >
                                <KeyboardArrowRight fontSize="small"/>
                            </button>
                            <button
                                onClick={() => panToDirection("down")}
                                className="p-2 bg-gray-100 rounded hover:bg-gray-200"
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
                className="absolute left-1 bottom-1 z-10 bg-white p-3 rounded-xl shadow-lg border border-gray-200 backdrop-blur-sm bg-opacity-95">
                <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-400 rounded"></div>
                        <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span>Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span>Unavailable</span>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .seat-tooltip {
                    font-size: 14px;
                    padding: 8px;
                    max-width: 200px;
                    background: #fff;
                    color: #000;
                    border-radius: 4px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                }
            `}</style>
        </div>
    );
};

export default SeatSelection;
