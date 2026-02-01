import { motion } from "framer-motion";
import React from "react";

interface ScribbleTextProps {
    children: React.ReactNode;
    className?: string;
    color?: string;
}

export default function ScribbleText({
    children,
    className = "",
    color = "text-highlighter-pink"
}: ScribbleTextProps) {
    return (
        <motion.div
            className={`relative inline-block cursor-default ${className}`}
            initial="initial"
            whileHover="hover"
            animate="initial"
        >
            <span className="relative z-10">{children}</span>
            <motion.svg
                aria-hidden="true"
                viewBox="0 0 200 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                className={`absolute -bottom-2 left-0 w-full h-4 ${color} pointer-events-none opacity-60`}
                variants={{
                    initial: { pathLength: 0, opacity: 0 },
                    hover: { pathLength: 1, opacity: 0.6 }
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <path d="M5,10 Q50,15 100,5 T195,10" />
            </motion.svg>
        </motion.div>
    );
}
