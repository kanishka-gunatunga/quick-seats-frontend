// "use client"
// import React, {useState} from "react";
//
// export type NavigationTab = "details" | "security" | "bookingHistory" | "paymentHistory";
//
// interface ProfileNavigationProps {
//     initialTab?: NavigationTab;
//     onTabChange?: (tab: NavigationTab) => void;
//     onUpdate?: () => void;
// }
//
//
// interface UpdateButtonProps {
//     onClick?: () => void;
// }
//
// const UpdateButton: React.FC<UpdateButtonProps> = ({ onClick }) => {
//     return (
//         <button
//             onClick={onClick}
//             className="px-3 py-4 text-base leading-6 text-white bg-indigo-900 rounded-md border-2 border-indigo-900 border-solid cursor-pointer w-[172px] max-md:w-full max-sm:px-2 max-sm:py-3 max-sm:text-sm"
//         >
//             Update
//         </button>
//     );
// };
//
// function InputDesign() {
//     const handleTabChange = (tab: string) => {
//         console.log(`Tab changed to: ${tab}`);
//     };
//
//     const handleUpdate = () => {
//         console.log("Update button clicked");
//     };
//
//     return (
//         <ProfileNavigation
//             initialTab="details"
//             onTabChange={(tab) => handleTabChange(tab)}
//             onUpdate={handleUpdate}
//         />
//     );
// }
//
//
// interface ProfileNavigationTabProps {
//     label: string;
//     isActive?: boolean;
//     onClick?: () => void;
// }
//
// const ProfileNavigationTab: React.FC<ProfileNavigationTabProps> = ({
//                                                                        label,
//                                                                        isActive = false,
//                                                                        onClick,
//                                                                    }) => {
//     return (
//         <button
//             onClick={onClick}
//             className={`
//         px-3 py-4 text-base leading-6 text-indigo-900 rounded-md cursor-pointer
//         h-[42px] w-[172px] max-md:w-full max-sm:px-2 max-sm:py-3 max-sm:h-9 max-sm:text-sm
//         ${isActive ? "bg-white" : "bg-[#F1F5F9]"}
//       `}
//             aria-selected={isActive}
//             role="tab"
//         >
//             {label}
//         </button>
//     );
// };
//
// const ProfileNavigation: React.FC<ProfileNavigationProps> = ({
//                                                                  initialTab = "details",
//                                                                  onTabChange,
//                                                                  onUpdate,
//                                                              }) => {
//     const [activeTab, setActiveTab] = useState<NavigationTab>(initialTab);
//
//     const handleTabChange = (tab: NavigationTab) => {
//         setActiveTab(tab);
//         if (onTabChange) {
//             onTabChange(tab);
//         }
//     };
//
//     const handleUpdate = () => {
//         if (onUpdate) {
//             onUpdate();
//         }
//     };
//
//     return (
//         <nav className="flex gap-72 justify-between items-center px-5 py-0 mx-auto my-0 h-14 max-md:flex-col max-md:gap-5 p-2.5 sm:p-5">
//             <div className="flex flex-1 gap-2.5 items-start max-md:w-full">
//                 <div
//                     className="flex flex-1 gap-2.5 items-center px-1.5 py-1 rounded-md border-[#27337C] border-solid bg-[#F1F5F9] border-[0.25px] max-md:flex-col max-md:gap-2.5"
//                     role="tablist"
//                     aria-label="Profile navigation"
//                 >
//                     <ProfileNavigationTab
//                         label="My Details"
//                         isActive={activeTab === "details"}
//                         onClick={() => handleTabChange("details")}
//                     />
//                     <ProfileNavigationTab
//                         label="Security"
//                         isActive={activeTab === "security"}
//                         onClick={() => handleTabChange("security")}
//                     />
//                     <ProfileNavigationTab
//                         label="Booking History"
//                         isActive={activeTab === "bookingHistory"}
//                         onClick={() => handleTabChange("bookingHistory")}
//                     />
//                     <ProfileNavigationTab
//                         label="Payment History"
//                         isActive={activeTab === "paymentHistory"}
//                         onClick={() => handleTabChange("paymentHistory")}
//                     />
//                 </div>
//             </div>
//             {
//                 activeTab === "details" || activeTab === "security" ? (<UpdateButton onClick={handleUpdate} />) : ""
//             }
//
//         </nav>
//     );
// };
//
// export default ProfileNavigation;

"use client";
import React, {useState, useCallback, memo} from "react";

// Define navigation tab type
export type NavigationTab = "details" | "security" | "bookingHistory" | "paymentHistory";

// Props for ProfileNavigation
interface ProfileNavigationProps {
    initialTab?: NavigationTab;
    onTabChange?: (tab: NavigationTab) => void;
    onUpdate?: () => void;
}

// Props for individual navigation tab
interface ProfileNavigationTabProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

// Props for UpdateButton
interface UpdateButtonProps {
    onClick: () => void;
}

// UpdateButton component
const UpdateButton: React.FC<UpdateButtonProps> = memo(({onClick}) => {
    return (
        <button
            onClick={onClick}
            className="px-4 py-3 text-sm font-medium text-white bg-[#27337C] rounded-md border-2 border-indigo-900 hover:bg-indigo-800 transition-colors w-40 md:w-44 max-sm:w-full"
            aria-label="Update profile or security settings"
        >
            Update
        </button>
    );
});
UpdateButton.displayName = "UpdateButton";

// ProfileNavigationTab component
const ProfileNavigationTab: React.FC<ProfileNavigationTabProps> = memo(({label, isActive, onClick}) => {
    return (
        <button
            onClick={onClick}
            className={`
        flex-1 px-4 min-w-40 items-center py-3 text-base font-inter font-medium text-[#2D2A70] rounded-md transition-colors
        h-12 max-sm:h-9 max-sm:text-sm
        ${isActive ? "bg-white shadow-sm" : "bg-[#F1F5F9] hover:bg-gray-200"}
      `}
            aria-selected={isActive}
            role="tab"
            aria-label={`Navigate to ${label} section`}
        >
            {label}
        </button>
    );
});
ProfileNavigationTab.displayName = "ProfileNavigationTab";

// ProfileNavigation component
const ProfileNavigation: React.FC<ProfileNavigationProps> = ({
                                                                 initialTab = "details",
                                                                 onTabChange,
                                                                 onUpdate,
                                                             }) => {
    const [activeTab, setActiveTab] = useState<NavigationTab>(initialTab);

    const handleTabChange = useCallback(
        (tab: NavigationTab) => {
            setActiveTab(tab);
            onTabChange?.(tab);
        },
        [onTabChange]
    );

    const handleUpdate = useCallback(() => {
        onUpdate?.();
    }, [onUpdate]);

    // Define tab configuration
    const tabs: { id: NavigationTab; label: string }[] = [
        {id: "details", label: "My Details"},
        {id: "security", label: "Security"},
        {id: "bookingHistory", label: "Booking History"},
        {id: "paymentHistory", label: "Payment History"},
    ];

    const showUpdateButton = activeTab === "details" || activeTab === "security";

    return (
        <nav
            className="flex flex-col md:flex-row gap-4 items-center justify-between px-4 py-3 mx-auto w-full"
            aria-label="Profile navigation"
        >
            <div
                className="flex w-full md:w-auto gap-2 p-1 rounded-md border border-[#27337C]/20 bg-[#F1F5F9] max-sm:flex-col"
                role="tablist"
            >
                {tabs.map((tab) => (
                    <ProfileNavigationTab
                        key={tab.id}
                        label={tab.label}
                        isActive={activeTab === tab.id}
                        onClick={() => handleTabChange(tab.id)}
                    />
                ))}
            </div>
            {showUpdateButton && <UpdateButton onClick={handleUpdate}/>}
        </nav>
    );
};

export default memo(ProfileNavigation);