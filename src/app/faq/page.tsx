import HeroSection from "@/components/HeroSection";
import NewsLetter from "@/components/NewsLetter";

interface HeroProps {
    image: string;
    title: string;
    subTitle: string
}

const FAQ = () => {

    const hero: HeroProps = {
        image: "/faq-he.png",
        title: "Frequently Asked Questions",
        subTitle: "Discover your favorite entertainment right here",
    }

    const faqs = [
        {
            question: "What is QuickSeats.lk?",
            answer: "QuickSeats.lk is a smart, hassle-free ticketing platform designed to help you find and book tickets for events, concerts, and shows happening across Sri Lanka — quickly and securely."
        },
        {
            question: "How is QuickSeats.lk different from other ticketing sites?",
            answer: "We focus on speed, simplicity, and personalization. Our platform is built to save you time, reduce steps, and give you exactly what you need — without the clutter or confusion."
        },
        {
            question: "How do I book a ticket?",
            answer: "Simple! Browse events, select your showtime and seats, and complete your booking in just a few clicks. You’ll receive a digital ticket via email and SMS instantly."
        },
        {
            question: "Is it safe to make payments on your site?",
            answer: "Absolutely. We use secure, encrypted payment gateways to ensure your information is always protected. You can pay using credit/debit cards."
        },
        {
            question: "Can I cancel or refund my ticket?",
            answer: "Ticket cancellations and refunds depend on the event organizer’s policy. For further help, our support team is always ready to assist."
        },
        {
            question: "Can I partner with QuickSeats.lk to sell tickets for my event?",
            answer: "Yes! We love working with event organizers. Reach out via our contact information, and we’ll help you get set up in no time."
        },
        {
            question: " Are there any hidden fees?",
            answer: "No hidden charges. Any applicable service or platform fees are displayed during checkout — so what you see is what you pay."
        }
    ];

    const customStyles = `
        .faq-details {
            border: 2px solid transparent;
        }
        .faq-details:open {
            border: 2px solid #27337C;
        }
    `;

    return (
        <div className="min-h-screen">
            <style>{customStyles}</style>
            <HeroSection hero={hero}/>

            <div className="py-8 px-4 sm:px-6 lg:px-20 rounded-b-[50px] lg:rounded-b-[100px] -mt-20 bg-[#F4FCFF]">
                <div className="space-y-4 mt-20 mb-10 lg:mb-0">
                    {faqs.map((faq, index) => (
                        <details key={index}
                                 className="group rounded-md drop-shadow-md bg-white py-4 px-4 md:py-8 md:px-6 faq-details"
                        >
                            <summary className="flex items-center justify-between gap-1.5">
                                <h2 className="font-medium font-inter text-[10px] md:text-lg lg:text-2xl text-[#170F49]">{faq.question}</h2>
                                <svg width="83" height="83" viewBox="0 0 83 83" fill="none"
                                     className="w-6 h-6 md:w-12 md:h-12 transition-transform group-open:hidden"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <g filter="url(#filter0_d_81_1816)">
                                        <circle cx="41.3309" cy="36.3309" r="25.3309" fill="white"/>
                                    </g>
                                    <path d="M38.2207 44.5874L46.44 36.3308L38.2207 28.0742" stroke="#27337C"
                                          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <defs>
                                        <filter id="filter0_d_81_1816" x="0" y="0" width="82.6621" height="82.6617"
                                                filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                            <feColorMatrix in="SourceAlpha" type="matrix"
                                                           values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                                           result="hardAlpha"/>
                                            <feOffset dy="5"/>
                                            <feGaussianBlur stdDeviation="8"/>
                                            <feColorMatrix type="matrix"
                                                           values="0 0 0 0 0.0323264 0 0 0 0 0.0598209 0 0 0 0 0.204167 0 0 0 0.06 0"/>
                                            <feBlend mode="normal" in2="BackgroundImageFix"
                                                     result="effect1_dropShadow_81_1816"/>
                                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_81_1816"
                                                     result="shape"/>
                                        </filter>
                                    </defs>
                                </svg>
                                <svg width="51" height="51" viewBox="0 0 51 51" fill="none"
                                     className="w-6 h-6 md:w-12 md:h-12 transition-transform hidden group-open:block"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="25.3309" cy="25.3309" r="25.3309" fill="#27337C"/>
                                    <path d="M17.0742 22.2212L25.3308 30.4405L33.5874 22.2212" stroke="white"
                                          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>


                            </summary>

                            <p className="pt-4 text-[8px] md:text-sm lg:text-lg font-inter font-normal text-[#6F6C90]">
                                {faq.answer}
                            </p>
                        </details>
                    ))}
                </div>
            </div>
            <NewsLetter/>
        </div>
    );
}

export default FAQ;