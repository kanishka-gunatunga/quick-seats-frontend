import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer: React.FC = () => {

    const pages = [
        {title: "Events", link: "/events"},
        {title: "About Us", link: "/about-us"},
        {title: "Contact Us", link: "/contact-us"},
        {title: "Sign In", link: "/login"},
        {title: "Register", link: "/register"}
    ];

    const usefulLinks = [
        {title: "Terms and Conditions", link: "#"},
        {title: "Privacy Policy", link: "#"},
        {title: "Refund Policy", link: "#"},
        {title: "FAQ", link: "/faq"},
    ]

    const socialLinks = [
        {image: "/facebook.png", link: "https://www.facebook.com/share/1CKXG1pyuc/"},
        {image: "/instagram.png", link: "https://www.instagram.com/quick_seats?igsh=ZGkyaXE1ZmZscWJp"},
        {image: "/tiktok.png", link: "https://www.tiktok.com/@quick.seats?_t=ZS-8xWVHI1TyZ0&_r=1"},
        {image: "/youtube.png", link: "https://youtube.com/@quickseats-e2e?si=0UK-FfyMW0ps5MKj"},
    ]

    return (
        <footer className="w-full relative bg-[#F4FCFF]">
            {/* Footer Top */}
            <div className="w-full py-12">
                {/*<div*/}
                {/*    className="absolute bg-repeat-round w-full inset-0">*/}
                {/*    <Image src="/movie-ticket.png" alt="" width={100} height={200} className="bg-repeat-round inset-0 absolute"/>*/}
                {/*</div>*/}
                {/*<div*/}
                {/*    className="absolute bg-[url('/movie-ticket.png')] bg-repeat-round inset-0 w-full h-full bg-[length:100px_auto]"*/}
                {/*></div>*/}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Logo and Description */}
                        <div className="w-full md:w-1/3">
                            <div className="flex items-center gap-4">
                                <div className="w-32 sm:w-40 md:w-48">
                                    <Image
                                        src="/logo.png"
                                        alt="Quick Seats logo"
                                        width={150}
                                        height={80}
                                        className="w-full h-auto"
                                    />
                                </div>
                            </div>
                            <p className="mt-4 font-inter font-normal text-sm text-[#2D2A70] min-w-8 leading-6">
                                At QuickSeats.lk, we make booking live events fast, easy, and exciting. From concerts to stage shows, your next seat is just a few clicks away.
                                <br/>
                                Built in Sri Lanka for everyone, we blend smart technology with local expertise to deliver a seamless, no-hassle ticketing experience. We&#39;re not just selling tickets — we&#39;re helping you create unforgettable memories.
                            </p>
                            {/* Social Icons */}
                            <div className="flex gap-4 mt-6">
                                {socialLinks.map((social, index) => (
                                    <Link
                                        key={index}
                                        href={social.link}
                                        className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-indigo-900/20 hover:bg-indigo-100 transition-colors"
                                    >
                                        <Image
                                            src={social.image}
                                            alt={`${social.image} logo`}
                                            fill
                                            style={{objectFit: "contain"}}
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Site Map */}
                        <div className="w-full md:w-1/5">
                            <div className="flex justify-between items-center">
                                <h2 className="text-base font-inter font-semibold uppercase text-[#27337C]">
                                    SITE MAP
                                </h2>
                            </div>
                            <div className="mt-4 text-base font-inter font-medium text-[#27337C]">
                                <ul className="space-y-4">
                                    {pages.map(
                                        (item) => (
                                            <li key={item.title}>
                                                <Link
                                                    href={item.link}
                                                    className="hover:text-indigo-700"
                                                >
                                                    {item.title}
                                                </Link>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Useful Links */}
                        <div className="w-full md:w-1/5">
                            <div className="flex justify-between items-center">
                                <h2 className="text-base font-inter font-semibold uppercase text-[#27337C]">
                                    USEFUL LINKS
                                </h2>
                            </div>
                            <nav className="mt-4 text-base font-inter font-medium text-[#27337C]">
                                <ul className="space-y-4">
                                    {usefulLinks.map(
                                        (item) => (
                                            <li key={item.title}>
                                                <Link
                                                    href={item.link}
                                                    className="hover:text-indigo-700"
                                                >
                                                    {item.title}
                                                </Link>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </nav>
                        </div>

                        {/* Contact Us */}
                        {/*<div className="w-full md:w-1/4">*/}
                        {/*    <h2 className="text-base font-semibold uppercase text-indigo-900">*/}
                        {/*        CONTACT US*/}
                        {/*    </h2>*/}
                        {/*    <div className="mt-4 text-base font-inter font-medium text-[#27337C] space-y-4">*/}
                        {/*        <div className="flex items-center gap-3">*/}
                        {/*            <div className="relative w-6 h-6 sm:w-8 sm:h-8">*/}
                        {/*                /!*<Image*!/*/}
                        {/*                /!*    src="/location1.png"*!/*/}
                        {/*                /!*    alt="location icon"*!/*/}
                        {/*                /!*    fill*!/*/}
                        {/*                /!*    style={{objectFit: "contain"}}*!/*/}
                        {/*                /!*//*/}
                        {/*                <Image src="/location1.png" alt="telephone" width={35} height={35}/>*/}
                        {/*            </div>*/}
                        {/*            <p className="">*/}
                        {/*                487/4K, Old Kottawa Road,Udahamulla,Nugegoda*/}
                        {/*            </p>*/}
                        {/*        </div>*/}
                        {/*        <div className="flex items-center gap-3">*/}
                        {/*            <div className="relative w-6 h-6 sm:w-8 sm:h-8">*/}
                        {/*                /!*<Image*!/*/}
                        {/*                /!*    src="/email.png"*!/*/}
                        {/*                /!*    alt="email icon"*!/*/}
                        {/*                /!*    fill*!/*/}
                        {/*                /!*    style={{objectFit: "contain"}}*!/*/}
                        {/*                /!*//*/}
                        {/*                <Image src="/email.png" alt="telephone" width={35} height={35}/>*/}
                        {/*            </div>*/}
                        {/*            <a*/}
                        {/*                href="mailto:quickseats.lk@gmail.com"*/}
                        {/*                className="hover:text-indigo-700"*/}
                        {/*            >*/}
                        {/*                quickseats.lk@gmail.com*/}
                        {/*            </a>*/}
                        {/*        </div>*/}
                        {/*        <div className="flex items-center gap-3">*/}
                        {/*            <div className="relative w-6 h-6 sm:w-8 sm:h-8">*/}
                        {/*                /!*<Image*!/*/}
                        {/*                /!*    src="/tel.png"*!/*/}
                        {/*                /!*    alt="telephone icon"*!/*/}
                        {/*                /!*    fill*!/*/}
                        {/*                /!*    style={{objectFit: "contain"}}*!/*/}
                        {/*                /!*//*/}
                        {/*                <Image src="/tel.png" alt="telephone" width={35} height={35}/>*/}
                        {/*            </div>*/}
                        {/*            <a href="tel:+94 78 9124 124" className="hover:text-indigo-700">*/}
                        {/*                +94 78 9124 124*/}
                        {/*            </a>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        <div className="">
                            <h3 className="text-[15px] sm:text-[16px] font-bold mb-3 md:mb-4 text-base font-semibold uppercase text-indigo-900">CONTACT
                                US</h3>
                            <ul className="space-y-3 md:space-y-4 text-[13px] sm:text-[14px] md:text-base font-inter font-medium text-[#27337C]">
                                <li className="flex items-start gap-2 sm:gap-3 md:gap-4">
                                    <Image
                                        src="/location1.png"
                                        alt="Location"
                                        width={24}
                                        height={24}
                                        className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex-shrink-0"
                                    />
                                    <span className="leading-tight">
                                        487/4K, Old Kottawa Road,Udahamulla,Nugegoda
                                    </span>
                                </li>
                                <li className="flex items-center gap-2 sm:gap-3 md:gap-4">
                                    <Image
                                        src="/email.png"
                                        alt="Email"
                                        width={24}
                                        height={24}
                                        className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex-shrink-0"
                                    />
                                    <a
                                        href="mailto:quickseats.lk@gmail.com"
                                        className="hover:text-indigo-700"
                                    >
                                        quickseats.lk@gmail.com
                                    </a>
                                </li>
                                <li className="flex items-start gap-2 sm:gap-3 md:gap-4">
                                    <Image
                                        src="/tel.png"
                                        alt="Phone"
                                        width={24}
                                        height={24}
                                        className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex-shrink-0"
                                    />
                                    <a href="tel:+94 78 9124 124" className="hover:text-indigo-700">
                                        +94 78 9124 124
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="relative w-full py-6 bg-[#27337C]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                        className="flex flex-col md:flex-row gap-5 grotesk justify-between text-base leading-none text-white">
                        <p>Copyright © 2025 Quick Seats.LK Designed</p>
                        <nav className="flex gap-5">
                            <Link href="#" className="hover:text-gray-200">
                                Privacy Policy
                            </Link>
                            <Link href="#" className="hover:text-gray-200">
                                Terms and Conditions
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;