"use client"
import HeroSection from "@/components/HeroSection";
import SectionTitle from "@/components/SectionTitle";
import React, {useRef, useState} from "react";
import ProfileNavigation, {NavigationTab} from "@/components/ProfileNavigation";
import ProfileForm from "@/components/ProfileForm";
import ChangePassword from "@/components/ChangePassword";
import BookingHistory from "@/components/BookingHistory";
import PaymentHistory from "@/components/PaymentHistory";
import {useCurrentUser} from "@/util/auth";

interface HeroProps {
    image: string;
    title: string;
    subTitle: string
}

const ProfilePage = () => {

    const [activeTab, setActiveTab] = useState<NavigationTab>("details");

    const user = useCurrentUser();
    const userId = user?.id;
    console.log("userId: ", userId);

    const profileFormRef = useRef<{ submit: () => void }>(null);
    const changePasswordRef = useRef<{ submit: () => void }>(null);

    const hero: HeroProps = {
        image: "/profile-hero.png",
        title: "Profile",
        subTitle: "Discover your favorite entertainment right here",
    }

    const sectionTitles: Record<NavigationTab, string> = {
        details: "Profile Setting",
        security: "Security Setting",
        bookingHistory: "Booking History",
        paymentHistory: "Payment History",
    };

    const handleTabChange = (tab: NavigationTab) => {
        setActiveTab(tab);
    };

    const handleUpdate = () => {
        if (activeTab === "details" && profileFormRef.current) {
            profileFormRef.current.submit();
        } else if (activeTab === "security" && changePasswordRef.current) {
            changePasswordRef.current.submit();
        }
    };

    const renderActiveComponent = () => {

        if (!userId) {
            return <p>Loading user data or user not authenticated...</p>;
        }

        switch (activeTab) {
            case "details":
                return <ProfileForm ref={profileFormRef} userId={userId}/>;
            case "security":
                return <ChangePassword ref={changePasswordRef} userId={userId}/>;
            case "bookingHistory":
                return <BookingHistory userId={userId}/>;
            case "paymentHistory":
                return <PaymentHistory userId={userId}/>;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen">
            <HeroSection hero={hero}/>
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <SectionTitle title={sectionTitles[activeTab]}/>
                    <div className="mt-12 w-full">
                        <ProfileNavigation
                            initialTab="details"
                            onTabChange={handleTabChange}
                            onUpdate={handleUpdate}
                        />
                        <div className="mt-12">{renderActiveComponent()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;