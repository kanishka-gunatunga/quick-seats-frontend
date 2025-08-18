// "use client";
//
// import React, { useState } from 'react';
// import SectionTitle from "@/components/SectionTitle";
//
// const testimonials = [
//   {
//     id: 1,
//     name: 'Nirosh Fernando',
//     role: 'Finance Executive',
//     image: '/testimonials/nirosh.jpg',
//     rating: 5,
//     text: 'Credit where its due having raised the issue with they quickly got back to me and refunded the difference. They also managed to get me the tickets so my daughter got to see Taylor Swift',
//   },
//   {
//     id: 2,
//     name: 'Nirosh Fernando',
//     role: 'Finance Executive',
//     image: '/testimonials/nirosh2.jpg',
//     rating: 5,
//     text: 'Credit where its due having raised the issue with they quickly got back to me and refunded the difference. They also managed to get me the tickets so my daughter got to see Taylor Swift',
//   },
//   {
//     id: 3,
//     name: 'Nirosh Fernando',
//     role: 'Finance Executive',
//     image: '/testimonials/nirosh3.jpg',
//     rating: 5,
//     text: 'Credit where its due having raised the issue with they quickly got back to me and refunded the difference. They also managed to get me the tickets so my daughter got to see Taylor Swift',
//   },
// ];
//
//
// const Testimonials = () => {
//   return (
//     <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
//       <div className="max-w-7xl mx-auto">
//         <SectionTitle title="What People Say"/>
//         <div className="mt-8">
//           {testimonials.map((testimonial) => (
//             <div key={testimonial.id}>
//               <div className="bg-white rounded-[6px] border-2 border-[#E9E8FF] p-6 h-full flex flex-col">
//                 <div className="flex flex-col mb-6">
//                   <div className="flex gap-2 mb-4">
//                     {[...Array(testimonial.rating)].map((_, index) => (
//                       <svg
//                         key={index}
//                         width="24"
//                         height="24"
//                         viewBox="0 0 24 24"
//                         fill="#2D2A70"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
//                       </svg>
//                     ))}
//                   </div>
//                   <p className="text-[#222222] text-base font-clash-grotesk leading-[1.5]">{testimonial.text}</p>
//                 </div>
//                 <div className="flex items-center gap-4 mt-auto">
//                   <img
//                     src={testimonial.image}
//                     alt={testimonial.name}
//                     className="w-12 h-12 rounded-full object-cover"
//                   />
//                   <div>
//                     <h3 className="text-[#151515] text-sm font-inter font-medium">{testimonial.name}</h3>
//                     <p className="text-[#151515] text-xs font-inter">{testimonial.role}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//       </div>
//       </div>
//     </section>
//   );
// };
//
// export default Testimonials;

import TestimonialCard from "@/components/TestimonialCard";
import React from "react";
import SectionTitle from "@/components/SectionTitle";
import TranslateWrapper from "@/components/TranslateWrapper";

type Testimonial = {
    quote: string;
    image: string;
    author: string;
    role: string;
};

const Testimonials: React.FC = () => {
    const testimonials: Testimonial[] = Array(7).fill({
        quote: "          credit where its due having raised the issue with  they quickly got back to me and refunded the difference. They also managed to get me the tickets so my daughter got to see Taylor Swift\n",
        image:"/profile.png",
        author: "Nirosh Fernando",
        role: "Finance Executive",
    });

    const duplicatedTestimonials = [...testimonials, ...testimonials];

    return (
        <section className="py-8 bg-white">
            <div className="max-w-7xl mb-4 px-4 sm:px-6 lg:px-0 lg:mb-8 mx-auto py-6">
                <SectionTitle title="What People Say"/>
            </div>
            {/*<div className="grid grid-cols-1 sm:grid-cols-2 mt-6 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">*/}
            {/*    {testimonials.map((testimonial, index) => (*/}
            {/*        <TestimonialCard key={index} testimonial={testimonial}/>*/}
            {/*    ))}*/}
            {/*</div>*/}
            {/*{[...Array(1)].map((_, index) => (*/}
            {/*    <TranslateWrapper key={index} duration={20}>*/}
            {/*        <TestimonialCard key={index} testimonials={testimonials}/>*/}
            {/*    </TranslateWrapper>*/}
            {/*))}*/}


            <div className="gap-6 overflow-hidden">
                <div className="flex">
                    <TranslateWrapper>
                        <div className="flex gap-10">
                            {duplicatedTestimonials.map((testimonial, index) => (
                                <TestimonialCard key={index} testimonials={[testimonial]}/>
                            ))}
                        </div>
                    </TranslateWrapper>
                </div>
                <div className="hidden lg:block flex mt-8">
                    <TranslateWrapper duration={35}>
                        <div className="flex gap-10">
                            {duplicatedTestimonials.map((testimonial, index) => (
                                <TestimonialCard key={index} testimonials={[testimonial]}/>
                            ))}
                        </div>
                    </TranslateWrapper>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;