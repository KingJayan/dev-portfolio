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
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, rotate }}
            whileInView={{ opacity: 1, y: 0, rotate }}
            whileHover={{
                scale: hoverScale,
                rotate: rotate > 0 ? rotate - 1 : rotate + 1,
                y: -5,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                delay,
                type: "spring",
                stiffness: 260,
                damping: 20
            }}
            className={`paper-card p-6 bg-white relative group border-2 border-ink/5 overflow-hidden transition-shadow shadow-paper ${className}`}
        >
            {showTape && (
                <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-7 ${tapeColor} backdrop-blur-[1px] border-l border-r border-white/20 shadow-sm z-20 transition-transform group-hover:scale-110`}
                />
            )}

            <div className="relative z-10 h-full">
                {children}
            </div>
        </motion.div>
    );
}
