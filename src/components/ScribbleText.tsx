import { motion } from "framer-motion";
import React from "react";
import { MOTION_EASE } from "@/lib/motion";

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
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true }}
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
                    visible: { pathLength: 1, opacity: 0.6 },
                    hover:   { pathLength: 1, opacity: 0.6 },
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <motion.path
                    d="M5,10 Q50,15 100,5 T195,10"
                    animate={{
                        d: [
                            "M5,10 Q50,15 100,5 T195,10",
                            "M5,11 Q50,13 100,7 T195,9",
                            "M5,10 Q50,15 100,5 T195,10"
                        ]
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: MOTION_EASE.smooth
                    }}
                />
            </motion.svg>
        </motion.div>
    );
}
