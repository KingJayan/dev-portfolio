import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Z_INDEX } from "@/lib/z-index";

const SECTIONS = ['home', 'projects', 'github', 'about', 'achievements', 'outside', 'contact'];

export default function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

    const markerY = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

    return (
        <div
            className="fixed left-5 top-1/2 -translate-y-1/2 h-56 pointer-events-none hidden md:flex flex-col items-center"
            style={{ zIndex: Z_INDEX.floating }}
        >
            {/* track */}
            <div className="relative w-[2px] h-full bg-pencil/10 rounded-full">
                {/* filled portion */}
                <motion.div
                    className="absolute top-0 left-0 w-full origin-top rounded-full bg-pencil/30"
                    style={{ scaleY: smoothProgress }}
                />

                {/* section tick marks */}
                {SECTIONS.map((_, i) => {
                    const pct = (i / (SECTIONS.length - 1)) * 100;
                    return (
                        <div
                            key={i}
                            className="absolute -left-[3px] w-2 h-[1px] bg-pencil/20"
                            style={{ top: `${pct}%` }}
                        />
                    );
                })}

                {/* travelling marker — small circle that rides the track */}
                <motion.div
                    className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-highlighter-yellow border border-pencil/30 shadow-sm"
                    style={{ top: markerY }}
                />
            </div>
        </div>
    );
}
