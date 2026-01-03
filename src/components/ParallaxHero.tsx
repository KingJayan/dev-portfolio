import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { portfolioConfig } from "@/portfolio.config";
import { Star, Spiral, Arrow } from "@/components/Doodles";

export default function ParallaxHero() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Mouse position values
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring physics for organic feel
    const mouseX = useSpring(x, { stiffness: 100, damping: 30 });
    const mouseY = useSpring(y, { stiffness: 100, damping: 30 });

    useEffect(() => {
        // Use window listener for better parallax coverage
        const handleMouseMove = (event: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            const clientX = event.clientX;
            const clientY = event.clientY;

            const normalizedX = (clientX / innerWidth) * 2 - 1;
            const normalizedY = (clientY / innerHeight) * 2 - 1;

            x.set(normalizedX);
            y.set(normalizedY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [x, y]);

    // Enhanced Parallax Depth
    const backgroundX = useTransform(mouseX, [-1, 1], ["2%", "-2%"]);
    const backgroundY = useTransform(mouseY, [-1, 1], ["2%", "-2%"]);

    const midX = useTransform(mouseX, [-1, 1], ["-5%", "5%"]);
    const midY = useTransform(mouseY, [-1, 1], ["-5%", "5%"]);

    const foreX = useTransform(mouseX, [-1, 1], ["-10%", "10%"]);
    const foreY = useTransform(mouseY, [-1, 1], ["-10%", "10%"]);

    return (
        <div
            ref={containerRef}
            className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-paper"
        // Removed cursor-none to fix disappearance issue, or we can use custom cursor with pointer-events-none
        >
            {/* Abstract Background Elements */}
            <motion.div style={{ x: backgroundX, y: backgroundY }} className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <div className="absolute top-[10%] left-[10%] w-64 h-64 border-4 border-dashed border-pencil/30 rounded-full animate-wiggle" />
                <div className="absolute bottom-[20%] right-[10%] w-96 h-96 border-2 border-highlight-pink/20 rotate-12" />
                <div className="absolute top-[40%] right-[30%] w-32 h-32 bg-highlighter-yellow/40 rotate-45" />
                {/* Doodles */}
                <svg className="absolute bottom-[10%] left-[20%] w-24 h-24 text-pencil/40 -rotate-12" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10,50 Q25,25 50,50 T90,50" />
                </svg>
            </motion.div>

            {/* Middle Layer */}
            <motion.div style={{ x: midX, y: midY }} className="absolute z-10 text-center pointer-events-none">
                <h2 className="text-4xl md:text-5xl font-hand text-pencil mb-6 transform -rotate-2">
                    {portfolioConfig.personal.title}
                </h2>
                <div className="w-48 h-3 bg-highlighter-pink/60 mx-auto -rotate-1 rounded-sm"></div>
            </motion.div>

            {/* Foreground Layer - Drawing Animation Title */}
            <motion.div style={{ x: foreX, y: foreY }} className="relative z-20 text-center select-none pointer-events-none">
                <div className="relative inline-block">
                    <h1 className="text-8xl md:text-9xl font-marker text-ink drop-shadow-xl rotate-[-3deg] z-10 relative">
                        {portfolioConfig.personal.name}
                    </h1>
                    {/* Underline svg sketch */}
                    <svg className="absolute -bottom-4 left-0 w-full h-12 pointer-events-none" viewBox="0 0 300 30">
                        <motion.path
                            d="M10,15 Q150,30 290,10"
                            fill="none"
                            stroke="#2a2a2a" // Ink color
                            strokeWidth="5"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                    </svg>
                </div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="mt-12 text-2xl font-hand text-ink max-w-lg mx-auto bg-paper p-6 border-2 border-ink shadow-paper rotate-2 relative"
                >
                    <span className="absolute -top-3 -left-3 text-4xl text-highlighter-yellow">📌</span>
                    Shaping the web, one component at a time.
                </motion.p>
            </motion.div>
        </div>
    );
}
