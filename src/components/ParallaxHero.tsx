import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect } from "react";
import { portfolioConfig } from "@/portfolio.config";
import { Star, Spiral, Arrow } from "@/components/Doodles";
import { Paperclip } from "lucide-react";

const springConfig = { stiffness: 50, damping: 30, mass: 1 };

export default function ParallaxHero() {

    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);

    const mouseX = useSpring(rawX, springConfig);
    const mouseY = useSpring(rawY, springConfig);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            rawX.set((event.clientX / innerWidth) * 2 - 1);
            rawY.set((event.clientY / innerHeight) * 2 - 1);
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);


    const backgroundX = useTransform(mouseX, [-1, 1], ["2%", "-2%"]);
    const backgroundY = useTransform(mouseY, [-1, 1], ["2%", "-2%"]);

    const midX = useTransform(mouseX, [-1, 1], ["-5%", "5%"]);
    const midY = useTransform(mouseY, [-1, 1], ["-5%", "5%"]);

    const foreX = useTransform(mouseX, [-1, 1], ["-10%", "10%"]);
    const foreY = useTransform(mouseY, [-1, 1], ["-10%", "10%"]);

    return (
        <div className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-paper">

            <motion.div style={{ x: backgroundX, y: backgroundY }} className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <div className="absolute top-[10%] left-[10%] w-64 h-64 border-4 border-dashed border-pencil/30 rounded-full animate-wiggle" />
                <div className="absolute bottom-[20%] right-[10%] w-96 h-96 border-2 border-highlight-pink/20 rotate-12" />
                <div className="absolute top-[40%] right-[30%] w-32 h-32 bg-highlighter-yellow/40 rotate-45" />
                <svg className="absolute bottom-[10%] left-[20%] w-24 h-24 text-pencil/40 -rotate-12" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10,50 Q25,25 50,50 T90,50" />
                </svg>
            </motion.div>


            <motion.div
                style={{ x: midX, y: midY }}
                className="relative z-10 flex flex-col items-center justify-center gap-2 pointer-events-none"
            >

                <h2 className="text-4xl md:text-5xl font-hand text-pencil transform -rotate-2 relative z-20">
                    {portfolioConfig.personal.title}
                    <div className="w-full h-3 bg-highlighter-pink/60 absolute -bottom-2 left-0 -rotate-1 rounded-sm -z-10"></div>
                </h2>


                <div className="relative inline-block z-10 py-6">
                    <h1 className="text-7xl md:text-9xl font-marker text-ink drop-shadow-xl rotate-[-3deg] relative whitespace-nowrap">
                        {portfolioConfig.personal.name}
                    </h1>
                    <svg className="absolute -bottom-2 left-0 w-full h-12 pointer-events-none z-0 text-ink" viewBox="0 0 300 30">
                        <motion.path
                            d="M10,15 Q150,30 290,10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="5"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                    </svg>
                </div>


                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-2xl font-hand text-ink max-w-lg mx-auto bg-paper p-6 border-2 border-ink shadow-paper rotate-2 relative mt-4"
                >
                    <Paperclip className="absolute -top-4 -left-4 w-8 h-8 text-pencil/70" />
                    {portfolioConfig.hero.tagline}
                </motion.div>
            </motion.div>


            <motion.div style={{ x: foreX, y: foreY }} className="absolute inset-0 pointer-events-none z-30" />
        </div>
    );
}
