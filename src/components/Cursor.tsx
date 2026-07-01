import { useEffect } from "react";
import { m, useMotionValue } from "framer-motion";
import { useDrawing } from "@/contexts/DrawingContext";
import { Z_INDEX } from "@/lib/z-index";

export default function Cursor() {
    const { isDrawingMode } = useDrawing();

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 8);
            cursorY.set(e.clientY - 8);
        };

        window.addEventListener("mousemove", moveCursor, { passive: true });
        return () => window.removeEventListener("mousemove", moveCursor);
    }, []);

    if (isDrawingMode) return null;

    return (
        <div className="pointer-events-none fixed inset-0 overflow-hidden mix-blend-difference" style={{ zIndex: Z_INDEX.cursor }}>
            {"ontouchstart" in window ? null : (
                <m.div
                    style={{ x: cursorX, y: cursorY, willChange: "transform" }}
                    className="absolute top-0 left-0 w-4 h-4 bg-white rounded-full"
                />
            )}
        </div>
    );
}
