// // import React from "react";
// //
// // const TestimonialCard = () => {
// //     return (
// //         <div className="bg-white rounded-[6px] border-2 border-[#E9E8FF] p-6 h-full flex flex-col">
// //             <div className="flex flex-col mb-6">
// //                 <div className="flex gap-2 mb-4">
// //                     {[...Array(testimonial.rating)].map((_, index) => (
// //                         <svg
// //                             key={index}
// //                             width="24"
// //                             height="24"
// //                             viewBox="0 0 24 24"
// //                             fill="#2D2A70"
// //                             xmlns="http://www.w3.org/2000/svg"
// //                         >
// //                             <path
// //                                 d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
// //                         </svg>
// //                     ))}
// //                 </div>
// //                 <p className="text-[#222222] text-base font-clash-grotesk leading-[1.5]">{testimonial.text}</p>
// //             </div>
// //             <div className="flex items-center gap-4 mt-auto">
// //                 <img
// //                     src={testimonial.image}
// //                     alt={testimonial.name}
// //                     className="w-12 h-12 rounded-full object-cover"
// //                 />
// //                 <div>
// //                     <h3 className="text-[#151515] text-sm font-inter font-medium">{testimonial.name}</h3>
// //                     <p className="text-[#151515] text-xs font-inter">{testimonial.role}</p>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }
// //
// // export default TestimonialCard;
//
// import React from 'react';
// import Image from "next/image";
//
// // Define the Testimonial type
// type Testimonial = {
//     quote: string;
//     image: string;
//     author: string;
//     role: string;
// };
//
// // TestimonialCard Component
// const TestimonialCard: React.FC<{ testimonials: Testimonial[] }> = ({testimonials}) => {
//     return (
//         <>
//             {testimonials.map((testimonial, index) => (
//                 <div key={index}
//                      className="bg-white px-6 py-10 rounded-lg border border-[#E9E8FF] flex flex-col justify-between h-full">
//                     <div className="items-center">
//                         <p className="text-[#222222] text-base grotesk mb-4"><span
//                             className="text-3xl text-[#27337C] top-1">❝ </span>{testimonial.quote}<span
//                             className="text-3xl text-[#27337C] bottom-1"> ❞</span></p>
//                     </div>
//                     <div className="flex items-center">
//                         <div className="w-10 h-10 bg-gray-300 rounded-full mr-4">
//                             <Image src={testimonial.image} alt="Profile photo" width="100" height="100"
//                                    className="rounded-full object-cover"/>
//                         </div>
//                         <div>
//                             <p className="font-medium font-inter text-xs text-[#151515]">{testimonial.author}</p>
//                             <p className="font-medium font-inter text-xs text-[#151515]">{testimonial.role}</p>
//                         </div>
//                     </div>
//                 </div>
//             ))}
//         </>
//     );
// };
//
// export default TestimonialCard;

import React from 'react';
import Image from "next/image";

// Define the Testimonial type
type Testimonial = {
    quote: string;
    image: string;
    author: string;
    role: string;
};

// TestimonialCard Component
const TestimonialCard: React.FC<{ testimonials: Testimonial[] }> = ({testimonials}) => {
    return (
        <>
            {testimonials.map((testimonial, index) => (
                <div key={index}
                     className="bg-white px-6 py-10 rounded-lg border border-[#E9E8FF] flex flex-col justify-between h-full min-w-[300px]">
                    <div className="items-center max-w-10xl">
                        <p className="text-[#222222] text-base grotesk mb-4"><span
                            className="text-3xl text-[#27337C] top-1">❝ </span>{testimonial.quote}<span
                            className="text-3xl text-[#27337C] bottom-1"> ❞</span></p>
                    </div>
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-full mr-4">
                            <Image src={testimonial.image} alt="Profile photo" width="40" height="40"
                                   className="rounded-full object-cover"/>
                        </div>
                        <div>
                            <p className="font-medium font-inter text-xs text-[#151515]">{testimonial.author}</p>
                            <p className="font-medium font-inter text-xs text-[#151515]">{testimonial.role}</p>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default TestimonialCard;