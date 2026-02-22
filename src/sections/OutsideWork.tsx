import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useEffect } from 'react';
import { portfolioConfig } from '@/portfolio.config';
import { Underline, Arrow, Spiral, Star } from '@/components/Doodles';
import PaperCard from '@/components/ui/PaperCard';

import ScribbleText from '@/components/ScribbleText';

const springConfig = { stiffness: 50, damping: 30, mass: 1 };

export default function OutsideWork() {
    const { outsideProgramming } = portfolioConfig;

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

    const backX = useTransform(mouseX, [-1, 1], ["3%", "-3%"]);
    const backY = useTransform(mouseY, [-1, 1], ["3%", "-3%"]);

    return (
        <motion.section
            id="outside"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="py-24 px-4 md:px-8 max-w-6xl mx-auto relative overflow-hidden"
        >
            {/*doodles*/}
            <motion.div style={{ x: backX, y: backY }} className="absolute inset-0 pointer-events-none opacity-20 z-0">
                <Spiral className="absolute top-10 right-20 w-48 h-48 text-pencil/30" />
                <Star className="absolute bottom-20 left-10 w-24 h-24 text-highlighter-pink" />
                <Arrow className="absolute top-1/2 left-1/4 w-32 h-16 text-ink/10 -rotate-12" />
            </motion.div>

            <div className="relative z-10 w-full">
                <div className="flex flex-col items-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-5xl font-marker text-center relative z-10"
                    >
                        <ScribbleText color="text-highlighter-pink">{outsideProgramming.title}</ScribbleText>
                    </motion.h2>
                </div>

                <div className="flex flex-wrap justify-center gap-8">
                    {outsideProgramming.hobbies.map((hobby: any, index: number) => (
                        <div key={index} className="w-full sm:w-[calc(50%-16px)] lg:w-[calc(25%-24px)] max-w-sm">
                            <PaperCard
                                rotate={index % 2 === 0 ? -2 : 2}
                                delay={index * 0.15}
                                tapeColor="bg-highlighter-yellow"
                                hoverScale={1.05}
                                className="bg-paper p-4 h-full"
                            >
                                {/*img*/}
                                <div className="aspect-[4/3] bg-paper overflow-hidden mb-4 border-2 border-ink relative">
                                    <img
                                        src={hobby.image}
                                        alt={hobby.name}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out"
                                    />
                                    <div className="absolute inset-0 bg-ink/5 pointer-events-none" />
                                </div>

                                <h3 className="text-3xl font-hand font-bold text-ink">{hobby.name}</h3>
                                <p className="font-hand text-lg text-ink/70 mt-1 leading-tight">
                                    {hobby.description}
                                </p>

                                {/*doodle*/}
                                {index === 2 && <Arrow className="absolute -bottom-10 -right-6 w-16 h-16 text-highlighter-pink -rotate-45" />}
                            </PaperCard>
                        </div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}
