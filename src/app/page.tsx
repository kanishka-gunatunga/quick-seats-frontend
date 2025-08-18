"use client";
import EventsSection from "../components/EventSection";
import MainHeader from "../components/MainHeader";
import TrendingEvents from "../components/TrendingEvent";
import Testimonials from "@/components/Testimonials";
import Newsletters from "@/components/NewsLetter";


interface HeroProps {
    image: string;
    title: string;
    subTitle: string;
    type: string;
}

export default function Home() {

    const hero: HeroProps = {
        image: "/home-he.png",
        title: "Let’s Book Your Ticket",
        subTitle: "Discover your favorite entertainment right here",
        type:"form"
    }

    return (

        <div className="min-h-screen">
            <MainHeader hero={hero}/>
            <TrendingEvents/>
            <EventsSection/>
            <Testimonials/>
            <Newsletters/>
        </div>
    );
}
