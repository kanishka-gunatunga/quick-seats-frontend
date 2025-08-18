"use client"
import {motion} from "framer-motion";
import {PropsWithChildren} from "react";

interface Props extends PropsWithChildren {
    reverse?: boolean;
    duration?: number;
}

const TranslateWrapper = ({children, reverse, duration}: Props) => {
    return (
        <motion.div
            initial={{translateX: reverse ? "-100%" : "0%"}}
            animate={{translateX: reverse ? "0%" : "-100%"}}
            transition={{
                duration: duration ?? 40,
                repeat: Infinity,
                ease: "linear",
            }}
            className="flex gap-8 w-full"
            style={{minWidth: "100%"}}
        >
            {children}
        </motion.div>
    );
};

export default TranslateWrapper;