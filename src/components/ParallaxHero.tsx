import { motion, useTransform } from "framer-motion";
import { portfolioConfig } from "@/portfolio.config";
import { Paperclip } from "lucide-react";
import { useParallaxMouse } from "@/hooks/use-parallax-mouse";

export default function ParallaxHero() {
    const { mouseX, mouseY } = useParallaxMouse();


    const backgroundX = useTransform(mouseX, [-1, 1], ["2%", "-2%"]);
    const backgroundY = useTransform(mouseY, [-1, 1], ["2%", "-2%"]);

    const midX = useTransform(mouseX, [-1, 1], ["-5%", "5%"]);
    const midY = useTransform(mouseY, [-1, 1], ["-5%", "5%"]);

    const foreX = useTransform(mouseX, [-1, 1], ["-10%", "10%"]);
    const foreY = useTransform(mouseY, [-1, 1], ["-10%", "10%"]);

    return (
        <div className="relative h-screen w-full overflow-hidden flex items-center justify-center">

            <motion.div style={{ x: backgroundX, y: backgroundY }} className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <div className="absolute top-[40%] right-[30%] w-40 h-40 bg-amber/20 backdrop-blur-sm rotate-45 rounded-sm" />
                <div className="absolute top-[20%] left-[15%] w-24 h-24 bg-rose/15 backdrop-blur-sm -rotate-12 rounded-full" />
                <div className="absolute bottom-[25%] right-[15%] w-20 h-20 bg-sage/15 backdrop-blur-sm rotate-6 rounded-full" />
                <svg className="absolute bottom-[10%] left-[20%] w-24 h-24 text-pencil/40 -rotate-12" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10,50 Q25,25 50,50 T90,50" />
                </svg>
            </motion.div>


            <motion.div
                style={{ x: midX, y: midY }}
                className="relative z-10 flex flex-col items-center justify-center gap-2 pointer-events-none"
            >

                <h2 className="text-2xl md:text-3xl font-hand text-pencil transform -rotate-1 relative z-20">
                    {portfolioConfig.personal.title}
                    <div className="w-full h-3 bg-highlighter-pink/40 absolute -bottom-2 left-0 -rotate-1 rounded-sm -z-10"></div>
                </h2>


                <div className="relative inline-block z-10 py-6">
                    <h1 className="text-7xl md:text-9xl font-marker text-ink -rotate-1 relative whitespace-nowrap">
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
                    whileHover={{ rotate: 1, scale: 1.01, y: -3 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 22 }}
                    className="text-2xl font-hand text-ink max-w-lg mx-auto bg-paper/75 backdrop-blur-md p-6 border border-amber/30 shadow-paper hover:shadow-paper-hover rotate-2 relative mt-4 transition-shadow"
                >
                    <Paperclip className="absolute -top-4 -left-4 w-8 h-8 text-pencil/70" />
                    {portfolioConfig.hero.tagline}
                </motion.div>
            </motion.div>


            <motion.div style={{ x: foreX, y: foreY }} className="absolute inset-0 pointer-events-none z-30" />
        </div>
    );
}
