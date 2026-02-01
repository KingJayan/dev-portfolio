import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useState } from "react";

interface HandmadeTooltipProps {
    children: ReactNode;
    content: string;
}

export default function HandmadeTooltip({ children, content }: HandmadeTooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className="relative flex items-center justify-center"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 10, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, y: -45, rotate: 2 }}
                        exit={{ opacity: 0, scale: 0.5, y: 10, rotate: -5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="absolute z-[100] pointer-events-none"
                    >
                        <div className="bg-highlighter-yellow/90 px-3 py-1 border-2 border-ink shadow-sm relative preserve-3d">
                            {/*tape*/}
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-white/40 border-l border-r border-white/20 -rotate-2" />

                            <span className="font-hand text-ink text-sm font-bold whitespace-nowrap">
                                {content}
                            </span>

                            {/*folded corner effect */}
                            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-ink/10 border-t border-l border-ink/20" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
