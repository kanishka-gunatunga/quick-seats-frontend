import HeroSection from "@/components/HeroSection";
import Image from "next/image";
import SectionTitle from "@/components/SectionTitle";
import NewsLetter from "@/components/NewsLetter";

interface HeroProps {
    image: string;
    title: string;
    subTitle: string
}

const AboutUsPage = () => {

    const hero: HeroProps = {
        image: "/about-he.png",
        title: "Who We Are",
        subTitle: "Discover your favorite entertainment right here",
    }

    return (
        <div className="min-h-screen">
            <HeroSection hero={hero}/>
            {/*<div className="w-full py-6 sm:py-8 md:py-10 lg:py-12 xl:py-14 2xl:py-16 px-4 sm:px-6 lg:px-8 bg-white">*/}
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                {/*<div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">*/}
                <div className="max-w-7xl mx-auto">
                    <SectionTitle title="About Us"/>
                    <div
                        className="relative mt-12 w-full h-64 sm:h-80 md:h-96 lg:h-[400px] xl:h-[600px] mb-6 sm:mb-8 md:mb-10 lg:mb-12">
                        <Image
                            src="/about-bg.png"
                            alt="About Us"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                            priority
                            quality={90}
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, (max-width: 1536px) 100vw, 2560px"
                        />
                    </div>
                    <p className="text-sm sm:text-base md:text-lg lg:text-[22px] whitespace-pre-line text-[#222222] grotesk leading-relaxed">
                        At QuickSeats.lk, booking your next big experience should be just as exciting as the event itself. Whether it&#39;s a sold-out concert, a thrilling live show, or an unforgettable stage performance, we’re here to make sure your seat is always just a few clicks away.
                        <br/><br/>
                        Born in Sri Lanka, built for everyone, QuickSeats.lk is more than just a ticketing platform — it&#39;s a gateway to entertainment, culture, and connection. We combine cutting-edge tech with local know-how to bring you a smoother, faster, and more personal booking experience. No long queues, no unnecessary steps — just fast access to the best seats in the house.
                        <br/><br/>
                        We’re not here to be another option — we’re here to be your go-to. Because we’re not just selling tickets — we’re unlocking memories.
                    </p>
                </div>
            </div>
            <NewsLetter/>
        </div>
    );
}

export default AboutUsPage;