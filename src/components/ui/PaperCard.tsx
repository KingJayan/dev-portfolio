import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PaperCardProps {
    children: ReactNode;
    className?: string;
    rotate?: number;
    delay?: number;
    showTape?: boolean;
    tapeColor?: string;
    hoverScale?: number;
}

export default function PaperCard({
    children,
    className = "",
    rotate = 0,
    delay = 0,
    showTape = true,
    tapeColor = "bg-highlighter-yellow/30",
    hoverScale = 1.02,
}: PaperCardProps) {
    const variants = {
        hidden: {
            opacity: 0,
            y: 30,
            rotate
        },
        visible: {
            opacity: 1,
            y: 0,
            rotate,
            transition: {
                delay,
                type: "spring",
                stiffness: 260,
                damping: 25
            }
        },
        hover: {
            scale: hoverScale,
            rotate: rotate > 0 ? rotate - 1 : rotate + 1,
            y: -8,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 25,
                delay: 0
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            variants={variants}
            viewport={{ once: true, margin: "-100px" }}
            className={`paper-card p-6 relative group border-2 border-ink/5 overflow-hidden shadow-paper ${className}`}
        >
            {showTape && (
                <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-7 ${tapeColor} masking-tape z-20 transition-transform group-hover:scale-110`}
                />
            )}

            <div className="relative z-10 h-full">
                {children}
            </div>
        </motion.div>
    );
}
