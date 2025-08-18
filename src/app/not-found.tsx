// import Link from "next/link";
// import HeroSection from "@/components/HeroSection";
//
//
// interface HeroProps {
//     image: string;
//     title: string;
//     subTitle: string
// }
//
//
// export default function NotFound() {
//
//
//     const hero: HeroProps = {
//         image: "/faq-he.png",
//         title: "Frequently Asked Questions",
//         subTitle: "Discover your favorite entertainment right here",
//     }
//
//     return (
//         <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
//             <HeroSection hero={hero}/>
//             <div className="text-center">
//                 {/* 404 Heading */}
//                 <h1 className="montserrat font-medium text-2xl sm:text-[45px] text-[#27337C]">
//                     404 - Page Not Found
//                 </h1>
//                 {/* Divider Line (inspired by SectionTitle) */}
//                 <div className="w-32 sm:w-40 h-0.5 sm:h-1 mx-auto mt-4 bg-[#27337C] rounded-sm" />
//                 {/* Description */}
//                 <p className="font-inter text-base sm:text-lg text-gray-700 mt-6 max-w-md mx-auto">
//                     Oops! The page you’re looking for doesn’t exist or has been moved. Let’s get you back to the action.
//                 </p>
//                 {/* Back to Home Button */}
//                 <div className="mt-8">
//                     <Link href="/">
//                         <button className="font-inter font-medium text-sm sm:text-base text-white bg-[#27337C] py-3 px-6 rounded-md hover:bg-blue-800 transition-colors">
//                             Back to Home
//                         </button>
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// }


import Link from "next/link";
import HeroSection from "@/components/HeroSection";

interface HeroProps {
    image: string;
    title: string;
    subTitle: string;
}

export default function NotFound() {
    const hero: HeroProps = {
        image: "/faq-he.png",
        title: "Oops! Page Not Found",
        subTitle: "We couldn’t find that page, but let’s get you back to the action.",
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <HeroSection hero={hero} />

            <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <p className="font-inter text-base sm:text-lg text-gray-700 mt-6 max-w-md mx-auto text-center">
                    The page you’re looking for doesn’t exist or has been moved. Explore our events or return to the homepage to continue your journey.
                </p>

                {/*<div className="w-32 sm:w-40 h-0.5 sm:h-1 mx-auto mt-6 bg-[#27337C] rounded-sm" />*/}

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <Link href="/">
                        <button className="font-inter font-medium text-sm sm:text-base text-white bg-[#27337C] py-3 px-6 rounded-md hover:bg-blue-800 transition-colors">
                            Back to Home
                        </button>
                    </Link>
                    <Link href="/events">
                        <button className="font-inter font-medium text-sm sm:text-base text-[#27337C] border border-[#27337C] py-3 px-6 rounded-md hover:bg-[#27337C] hover:text-white transition-colors">
                            View Events
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}