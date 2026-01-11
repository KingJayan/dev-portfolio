import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="fixed left-4 top-1/2 -translate-y-1/2 h-64 w-4 z-[9999] pointer-events-none hidden md:block">
            {/* Scroll track with sketchy look */}
            <div className="absolute inset-0 border-2 border-pencil/20 rounded-full bg-paper/30 backdrop-blur-[2px]" />

            {/* Hand-drawn vertical dashed line bg */}
            <div className="absolute inset-x-0 top-2 bottom-2 flex justify-center opacity-10">
                <div className="w-[2px] h-full border-l-2 border-dashed border-ink" />
            </div>

            {/* The progress bar himself */}
            <motion.div
                className="absolute top-0 left-0 right-0 h-full origin-top rounded-full bg-ink"
                style={{ scaleY }}
            >
                {/* Subtle highlight glare on the 'ink' */}
                <div className="absolute top-1/4 right-0.5 w-0.5 h-1/2 bg-white/20 rounded-full" />
            </motion.div>

            {/* A small "cap" doodle at the bottom of the progress */}
            <motion.div
                style={{
                    top: "100%",
                    y: "-50%",
                    scale: scrollYProgress
                }}
                className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-highlighter-pink shadow-sm border border-ink/20"
            />
        </div>
    );
}
