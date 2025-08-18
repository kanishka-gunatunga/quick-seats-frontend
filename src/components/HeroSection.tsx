// import Image from "next/image";
// import Nav from "@/components/Nav";
// import React from "react";
//
// const HeroSection = () => {
//     return (
//         <div>
//             <div className="relative w-full min-h-[500px] sm:min-h-[600px] font-medium">
//                 {/* Background Image */}
//                 <Image
//                     src="/hero.png"
//                     alt="Background"
//                     fill
//                     className="object-cover rounded-b-[40px] sm:rounded-b-[60px] lg:rounded-b-[80px] 2xl:rounded-b-[100px]"
//                     priority
//                     quality={90}
//                     sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, (max-width: 1536px) 100vw, 1920px"
//                 />
//
//                 {/* Content */}
//                 <div
//                     className="relative z-10 flex flex-col w-full max-w-screen-2xl mx-auto px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12 lg:py-14 xl:px-16 xl:py-16 2xl:px-20 2xl:py-20">
//                     {/* Navigation */}
//                     <Nav/>
//
//                     {/* Hero Content */}
//                     <divm
// //                         className="t-8 sm:mt-10 justify-center text-center justify-self-center md:mt-12 lg:mt-16 xl:mt-20 2xl:mt-24 flex flex-col items-start max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
//                         <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl groteskBold text-white leading-6">
//                             Explore Our Events
//                         </h1>
//                         <p className="mt-3 sm:mt-4 text-center md:mt-5 lg:mt-6 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-inter font-light text-white">
//                             Discover your favorite entertainment right here
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// export default HeroSection;

import Image from "next/image";
import Nav from "@/components/Nav";
import React from "react";

interface HeroProps {
    image: string;
    title: string;
    subTitle: string
}


const HeroSection = ({hero}: { hero: HeroProps }) => {
    return (
        <div>
            {/*<div*/}
            {/*    className="relative w-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] xl:min-h-[800px] 2xl:min-h-[2000px] font-medium">*/}
            <div
                className="relative w-full min-h-[250px] sm:min-h-[400px] lg:min-h-[600px] font-medium"
            >
                {/* Background Image */}
                <Image
                    src={hero.image}
                    alt="Background"
                    fill
                    className="object-cover rounded-b-[20px] sm:rounded-b-[30px] md:rounded-b-[40px] lg:rounded-b-[60px] xl:rounded-b-[80px] 2xl:rounded-b-[100px]"
                    priority
                    quality={90}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, (max-width: 1536px) 100vw, 2560px"
                />
                <div className="absolute inset-0 overflow-hidden bg-gradient-to-r from-[#011C2A]/30 to-[#000000]/30 rounded-b-[20px] sm:rounded-b-[30px] md:rounded-b-[40px] lg:rounded-b-[60px] xl:rounded-b-[80px] 2xl:rounded-b-[100px]"></div>

                {/* Content */}
                <div
                    // className="relative z-10 flex flex-col w-full max-w-screen-2xl mx-auto px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12 lg:py-14 xl:px-16 xl:py-16">
                    className="relative z-10 flex flex-col w-full max-w-screen-2xl mx-auto px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12 xl:px-16 2xl:px-20">
                    {/* Navigation */}
                    <Nav/>

                    {/* Hero Content */}
                    <div className="justify-center">
                    <div
                        className="mt-10 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-[120px] 2xl:mt-32 pt-0.5 lg:pt-8 xl:pt-12 flex flex-col items-center text-center w-full">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl groteskBold text-white leading-6">
                            {hero.title}
                        </h1>
                        <p className="mt-3 sm:mt-4 md:mt-5 lg:mt-6 text-base sm:text-lg md:text-xl lg:text-2xl text-center font-inter font-light text-white">
                            {hero.subTitle}
                        </p>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeroSection;