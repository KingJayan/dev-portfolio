import { useEffect, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";
import { useDrawing } from "@/contexts/DrawingContext";

export default function Cursor() {
    const { theme } = useTheme();
    const { isDrawingMode } = useDrawing();

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        window.addEventListener("mousemove", moveCursor, { passive: true });
        return () => window.removeEventListener("mousemove", moveCursor);
    }, []);

    if (isDrawingMode) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden">
            {"ontouchstart" in window ? null : (
                <motion.div
                    style={{ x: cursorX, y: cursorY, willChange: "transform" }}
                    className="absolute top-0 left-0"
                >
                    {theme === 'dark' ? (

                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="drop-shadow-lg -translate-x-[2px] -translate-y-[22px] rotate-[-15deg]">
                            <path d="M7 2 L19 2 L17 20 L5 20 Z" fill="#f0f0f0" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
                            <path d="M6 18 L18 18" stroke="#ccc" strokeWidth="1" strokeDasharray="2 2" />
                        </svg>
                    ) : (

                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="drop-shadow-lg -translate-x-[0px] -translate-y-[22px] rotate-[-15deg]">
                            <path d="M16.5 3.5L20.5 7.5L9.5 18.5H5.5V14.5L16.5 3.5Z" fill="#FBBF24" stroke="#4B5563" strokeWidth="1.5" strokeLinejoin="round" />
                            <path d="M19 5.5L20.5 4L18.5 2L17 3.5" fill="#F87171" stroke="#4B5563" strokeWidth="1.5" strokeLinejoin="round" />
                            <path d="M5.5 14.5L9.5 18.5L2 22L5.5 14.5Z" fill="#FDE68A" stroke="#4B5563" strokeWidth="1.5" strokeLinejoin="round" />
                            <path d="M4.5 19L2 22L5 19.5" fill="#2a2a2a" />
                        </svg>
                    )}
                </motion.div>
            )}
        </div>
    );
}
