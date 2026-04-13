import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { MOTION_EASE, MOTION_SPRING } from '@/lib/motion';

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
                ...MOTION_SPRING.subtle
            }
        },
        hover: {
            scale: hoverScale,
            rotate: rotate > 0 ? rotate - 0.5 : rotate + 0.5,
            y: -5,
            transition: {
                type: "spring",
                ...MOTION_SPRING.snappy,
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
            animate={{ rotate: [rotate, rotate + 0.2, rotate] }}
            transition={{
                rotate: {
                    duration: 7,
                    repeat: Infinity,
                    ease: MOTION_EASE.smooth
                }
            }}
            viewport={{ once: true, margin: "-100px" }}
            className={`bg-paper/48 backdrop-blur-xl p-6 relative group border border-pencil/20 rounded-xl overflow-hidden shadow-paper hover:shadow-paper-hover transition-shadow [box-shadow:inset_0_1px_0_hsla(0,0%,100%,0.55),0_2px_20px_-4px_rgba(36,30,25,0.10)] ${className}`}
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
