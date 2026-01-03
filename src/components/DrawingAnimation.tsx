import { motion } from "framer-motion";

export default function DrawingAnimation() {
    return (
        <div className="flex justify-center items-center h-24">
            {/* Example: A simple hand-drawn squiggly line loading/drawing effect */}
            <svg width="200" height="100" viewBox="0 0 200 100">
                <motion.path
                    d="M10,50 Q50,10 90,50 T190,50"
                    fill="none"
                    stroke="#2a2a2a"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatType: "reverse" }}
                />
            </svg>
        </div>
    );
}
