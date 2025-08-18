"use client";
import React, {useState} from "react";
import {signOut, useSession} from "next-auth/react";
import Image from "next/image";
import {motion, AnimatePresence} from "framer-motion";
import Link from "next/link";
import {useGetUserDetails} from "@/hooks/useUser";

const NavigationBar: React.FC = () => {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const {data: session} = useSession();

    const userId = session?.user?.id;
    const {data: userData} = useGetUserDetails(userId || "");

    const firstName = userData?.userDetails?.first_name || session?.user?.name || "";

    const menuItems = [
        {title: "Home", link: "/"},
        {title: "Events", link: "/events"},
        {title: "About Us", link: "/about-us"},
        {title: "Contact Us", link: "/contact-us"},
        {title: "FAQ", link: "/faq"},
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
        setIsProfileMenuOpen(false);
    };

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen((prev) => !prev);
        setIsMobileMenuOpen(false);
    };

    const handleLogout = () => {
        setIsMobileMenuOpen(false);
        setIsProfileMenuOpen(false);
        signOut({callbackUrl: "/"});
    };

    // Framer Motion variants for mobile menu (dropdown effect)
    const menuVariants = {
        closed: {opacity: 0, y: -20, transition: {duration: 0.3, ease: "easeInOut"}},
        open: {opacity: 1, y: 0, transition: {duration: 0.3, ease: "easeInOut"}},
    };

    // Staggered animation for menu items
    const itemVariants = {
        closed: {opacity: 0, y: -10},
        open: {opacity: 1, y: 0, transition: {duration: 0.2}},
    };

    return (
        <header className="w-full bg-indigo-900 px-4 py-0.5 lg:py-1 sm:px-6 lg:px-20 rounded-md shadow-md">
            <div className="mx-auto flex max-w-screen-2xl items-center justify-between">
                {/* Logo - Responsive sizing */}
                <div className="flex items-center">
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={120}
                            height={60}
                            className="object-contain h-auto sm:w-[130px] lg:w-[150px]"
                            priority
                        />
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden text-white focus:outline-none focus:ring-2 focus:ring-white rounded-md p-3"
                    onClick={toggleMobileMenu}
                    aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isMobileMenuOpen}
                >
                    <svg className="w-5 h-5 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                        />
                    </svg>
                </button>

                {/* Navigation Menu and Auth Buttons - Desktop/Tablet */}
                <div className="hidden lg:flex lg:items-center lg:gap-4 xl:gap-6">
                    <nav
                        className="flex flex-row gap-2 xl:gap-4 items-center text-white font-inter text-base xl:text-xl font-medium"
                    >
                        {menuItems.map((item) => (
                            <Link href={item.link} key={item.link}>
                                <motion.button
                                    className="px-4 py-2 rounded-full hover:bg-indigo-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.95}}
                                >
                                    {item.title}
                                </motion.button>
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="hidden lg:flex lg:items-center lg:gap-4 xl:gap-6">
                    {!session?.user ? (
                        <div className="flex flex-row gap-2 xl:gap-4">
                            <Link href="/register">
                                <motion.button
                                    className="px-4 py-2 xl:px-6 xl:py-2.5 text-white font-inter text-sm xl:text-base font-medium border-2 border-white rounded-md hover:bg-indigo-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.95}}
                                >
                                    Sign Up
                                </motion.button>
                            </Link>
                            <Link href="/login">
                                <motion.button
                                    className="px-4 py-2 xl:px-6 xl:py-2.5 text-indigo-900 font-inter text-sm xl:text-base font-medium bg-white border-2 border-white rounded-md hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.95}}
                                >
                                    Sign In
                                </motion.button>
                            </Link>
                        </div>
                    ) : (
                        <div className="relative flex items-center">
                            <button
                                onClick={toggleProfileMenu}
                                className="px-4 py-2 xl:px-6 xl:py-2.5 text-indigo-900 font-inter text-sm xl:text-base font-medium bg-white border-2 border-white rounded-md hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
                                aria-label="Open user menu"
                                aria-expanded={isProfileMenuOpen}
                            >
                                <span className="sr-only">Open user menu</span>
                                <div className="flex items-center space-x-2">
                                  <span className="">
                                    {firstName}
                                  </span>
                                </div>
                            </button>
                            {isProfileMenuOpen && (
                                <motion.div
                                    className="origin-top-right absolute right-0 top-12 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-40"
                                    initial={{opacity: 0, y: -10}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: -10}}
                                    transition={{duration: 0.2}}
                                >
                                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                        <p className="font-medium">{firstName || "User"}</p>
                                        <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                                    </div>
                                    <Link
                                        href="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setIsProfileMenuOpen(false)}
                                    >
                                        View Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Sign out
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu - Animated Dropdown */}
            <AnimatePresence>
                {/*{isMobileMenuOpen && (*/}
                {/*    <motion.nav*/}
                {/*        className="lg:hidden mt-4 rounded-md px-4 py-4 z-50"*/}
                {/*        initial="closed"*/}
                {/*        animate="open"*/}
                {/*        exit="closed"*/}
                {/*        variants={menuVariants}*/}
                {/*    >*/}
                {/*        <div className="flex flex-col gap-3">*/}
                {/*            {menuItems.map((item, index) => (*/}
                {/*                <Link href={item.link} key={item.link}>*/}
                {/*                    <motion.button*/}
                {/*                        className="text-white text-left font-inter text-base font-medium py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"*/}
                {/*                        variants={itemVariants}*/}
                {/*                        initial="closed"*/}
                {/*                        animate="open"*/}
                {/*                        transition={{delay: index * 0.1}}*/}
                {/*                        onClick={toggleMobileMenu}*/}
                {/*                    >*/}
                {/*                        {item.title}*/}
                {/*                    </motion.button>*/}
                {/*                </Link>*/}
                {/*            ))}*/}
                {/*            {status === "loading" ? (*/}
                {/*                <div className="text-white">Loading...</div>*/}
                {/*            ) : !session?.user ? (*/}
                {/*                <div className="flex flex-col gap-3 pt-2">*/}
                {/*                    <Link href="/register">*/}
                {/*                        <motion.button*/}
                {/*                            className="px-4 py-2 text-white font-inter text-base font-medium border-2 border-white rounded-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"*/}
                {/*                            variants={itemVariants}*/}
                {/*                            initial="closed"*/}
                {/*                            animate="open"*/}
                {/*                            transition={{delay: menuItems.length * 0.1}}*/}
                {/*                            onClick={toggleMobileMenu}*/}
                {/*                        >*/}
                {/*                            Register*/}
                {/*                        </motion.button>*/}
                {/*                    </Link>*/}
                {/*                    <Link href="/login">*/}
                {/*                        <motion.button*/}
                {/*                            className="px-4 py-2 text-indigo-900 font-inter text-base font-medium bg-white border-2 border-white rounded-md hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"*/}
                {/*                            variants={itemVariants}*/}
                {/*                            initial="closed"*/}
                {/*                            animate="open"*/}
                {/*                            transition={{delay: (menuItems.length + 1) * 0.1}}*/}
                {/*                            onClick={toggleMobileMenu}*/}
                {/*                        >*/}
                {/*                            Sign In*/}
                {/*                        </motion.button>*/}
                {/*                    </Link>*/}
                {/*                </div>*/}
                {/*            ) : (*/}
                {/*                <div className="flex flex-col gap-3 pt-2">*/}
                {/*                    <div className="px-4 py-2 text-sm text-white border-b border-white/20">*/}
                {/*                        <p className="font-medium">{session.user.name || "User"}</p>*/}
                {/*                        <p className="text-xs text-white/70 truncate">{session.user.email}</p>*/}
                {/*                    </div>*/}
                {/*                    <Link href="/profile">*/}
                {/*                        <motion.button*/}
                {/*                            className="text-white text-left font-inter text-base font-medium py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"*/}
                {/*                            variants={itemVariants}*/}
                {/*                            initial="closed"*/}
                {/*                            animate="open"*/}
                {/*                            transition={{delay: menuItems.length * 0.1}}*/}
                {/*                            onClick={toggleMobileMenu}*/}
                {/*                        >*/}
                {/*                            View Profile*/}
                {/*                        </motion.button>*/}
                {/*                    </Link>*/}
                {/*                    <motion.button*/}
                {/*                        className="text-white text-left font-inter text-base font-medium py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"*/}
                {/*                        variants={itemVariants}*/}
                {/*                        initial="closed"*/}
                {/*                        animate="open"*/}
                {/*                        transition={{delay: (menuItems.length + 2) * 0.1}}*/}
                {/*                        onClick={handleLogout}*/}
                {/*                    >*/}
                {/*                        Log out*/}
                {/*                    </motion.button>*/}
                {/*                </div>*/}
                {/*            )}*/}
                {/*        </div>*/}
                {/*    </motion.nav>*/}
                {/*)}*/}

                {isMobileMenuOpen && (
                    <motion.nav
                        className="lg:hidden mt-4 rounded-md px-4 py-4 z-50"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                    >
                        <div className="flex flex-col gap-3">
                            {menuItems.map((item, index) => (
                                <Link href={item.link} key={item.link}>
                                    <motion.button
                                        className="text-white text-left font-inter text-base font-medium py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
                                        variants={itemVariants}
                                        initial="closed"
                                        animate="open"
                                        transition={{delay: index * 0.1}}
                                        onClick={toggleMobileMenu}
                                    >
                                        {item.title}
                                    </motion.button>
                                </Link>
                            ))}
                            {/*<div className="flex flex-col gap-3 pt-2">*/}
                            {/*    <Link href="/register">*/}
                            {/*        <motion.button*/}
                            {/*            className="px-4 py-2 text-white font-inter text-base font-medium border-2 border-white rounded-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"*/}
                            {/*            variants={itemVariants}*/}
                            {/*            initial="closed"*/}
                            {/*            animate="open"*/}
                            {/*            transition={{delay: menuItems.length * 0.1}}*/}
                            {/*            onClick={toggleMobileMenu}*/}
                            {/*        >*/}
                            {/*            Register*/}
                            {/*        </motion.button>*/}
                            {/*    </Link>*/}
                            {/*    <Link href="/login">*/}
                            {/*        <motion.button*/}
                            {/*            className="px-4 py-2 text-indigo-900 font-inter text-base font-medium bg-white border-2 border-white rounded-md hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"*/}
                            {/*            variants={itemVariants}*/}
                            {/*            initial="closed"*/}
                            {/*            animate="open"*/}
                            {/*            transition={{delay: (menuItems.length + 1) * 0.1}}*/}
                            {/*            onClick={toggleMobileMenu}*/}
                            {/*        >*/}
                            {/*            Sign In*/}
                            {/*        </motion.button>*/}
                            {/*    </Link>*/}
                            {/*</div>*/}
                            {!session?.user ? (
                                <div className="flex flex-col gap-3 pt-2">
                                    <Link href="/register">
                                        <motion.button
                                            className="px-4 py-2 text-white font-inter text-base font-medium border-2 border-white rounded-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
                                            variants={itemVariants}
                                            initial="closed"
                                            animate="open"
                                            transition={{delay: menuItems.length * 0.1}}
                                            onClick={toggleMobileMenu}
                                        >
                                            Sign Up
                                        </motion.button>
                                    </Link>
                                    <Link href="/login">
                                        <motion.button
                                            className="px-4 py-2 text-indigo-900 font-inter text-base font-medium bg-white border-2 border-white rounded-md hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
                                            variants={itemVariants}
                                            initial="closed"
                                            animate="open"
                                            transition={{delay: (menuItems.length + 1) * 0.1}}
                                            onClick={toggleMobileMenu}
                                        >
                                            Sign In
                                        </motion.button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3 pt-2">
                                    <div className="px-4 py-2 text-sm text-white border-b border-white/20">
                                        <p className="font-medium">{session.user.name || "User"}</p>
                                        <p className="text-xs text-white/70 truncate">{session.user.email}</p>
                                    </div>
                                    <Link href="/profile">
                                        <motion.button
                                            className="text-white text-left font-inter text-base font-medium py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
                                            variants={itemVariants}
                                            initial="closed"
                                            animate="open"
                                            transition={{delay: menuItems.length * 0.1}}
                                            onClick={toggleMobileMenu}
                                        >
                                            View Profile
                                        </motion.button>
                                    </Link>
                                    <motion.button
                                        className="text-white text-left font-inter text-base font-medium py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
                                        variants={itemVariants}
                                        initial="closed"
                                        animate="open"
                                        transition={{delay: (menuItems.length + 2) * 0.1}}
                                        onClick={handleLogout}
                                    >
                                        Sign out
                                    </motion.button>
                                </div>
                            )}
                        </div>
                    </motion.nav>
                )}

            </AnimatePresence>
        </header>
    );
};

export default NavigationBar;