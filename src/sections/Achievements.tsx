import { motion, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { portfolioConfig } from '@/portfolio.config';
import { Star, Spiral, Arrow, Underline } from '@/components/Doodles';
import { Award, Trophy, Star as StarIcon } from 'lucide-react';
import PaperCard from '@/components/ui/PaperCard';
import { useSmoothDamp2D } from '@/hooks/use-smooth-damp';

const icons = {
    trophy: Trophy,
    award: Award,
    star: StarIcon,
};

import ScribbleText from '@/components/ScribbleText';

export default function Achievements() {
    const { achievements } = portfolioConfig;

    // mouse parallax target
    const [target, setTarget] = useState({ x: 0, y: 0 });

    // Smooth-damp motion
    const { x: mouseX, y: mouseY } = useSmoothDamp2D(target, 0.2);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            const nx = (event.clientX / innerWidth) * 2 - 1;
            const ny = (event.clientY / innerHeight) * 2 - 1;
            setTarget({ x: nx, y: ny });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    //consistent parallax layer
    const backX = useTransform(mouseX, [-1, 1], ["5%", "-5%"]);
    const backY = useTransform(mouseY, [-1, 1], ["5%", "-5%"]);

    return (
        <motion.section
            id="achievements"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="py-24 px-4 md:px-8 max-w-6xl mx-auto relative overflow-hidden min-h-screen flex flex-col justify-center"
        >

            {/* single parallax layer */}
            <motion.div style={{ x: backX, y: backY }} className="absolute inset-0 pointer-events-none opacity-25 z-0">
                <Spiral className="absolute top-[10%] left-[5%] w-48 h-48 text-pencil/30" />
                <Star className="absolute bottom-[10%] right-[10%] w-24 h-24 text-highlighter-yellow/50" />
                <Arrow className="absolute top-1/2 left-[5%] w-48 h-24 text-ink/10 rotate-12" />
                <div className="absolute top-[20%] right-[15%] w-6 h-6 rounded-full bg-highlighter-pink/30" />

                <Spiral className="absolute bottom-[20%] left-[20%] w-32 h-32 text-pencil/20 -rotate-90" />
                <Star className="absolute top-[40%] right-[25%] w-16 h-16 text-highlighter-blue/30" />
                <div className="absolute top-[60%] left-[15%] w-4 h-4 rounded-full bg-highlighter-yellow/40" />
                <Arrow className="absolute bottom-[40%] right-[30%] w-32 h-16 text-pencil/10 -rotate-12" />
                <div className="absolute top-[15%] left-[40%] w-8 h-8 rounded-full bg-highlighter-pink/20" />
                <Spiral className="absolute top-[70%] right-[5%] w-40 h-40 text-pencil/10 rotate-45" />
            </motion.div>

            <div className="relative z-10 w-full max-w-5xl mx-auto">
                <div className="flex flex-col items-center mb-16 relative">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-6xl font-marker text-center relative px-8"
                    >
                        <ScribbleText color="text-highlighter-blue">Achievements</ScribbleText>
                        <Star className="absolute -top-6 -right-4 w-12 h-12 text-highlighter-yellow" />
                    </motion.h2>

                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/40 rotate-1 backdrop-blur-sm border-l border-r border-white/20 shadow-sm opacity-60" />
                </div>

                <div className="flex flex-wrap justify-center gap-12">
                    {achievements.map((achievement, index) => {
                        const IconComponent = icons[achievement.icon as keyof typeof icons] || Award;

                        return (
                            <div key={index} className="w-full md:w-[calc(50%-24px)] max-w-lg">
                                <PaperCard
                                    rotate={index % 2 === 0 ? -2 : 2}
                                    delay={index * 0.1}
                                    className="overflow-visible h-full"
                                    tapeColor={index % 2 === 0 ? "bg-highlighter-yellow/30" : "bg-highlighter-pink/20"}
                                >
                                    <Spiral className="absolute -bottom-4 -right-4 w-16 h-16 text-pencil/5 rotate-12" />

                                    <div className={`absolute -top-4 -left-4 w-12 h-12 rounded-full bg-paper border-2 border-ink flex items-center justify-center shadow-sm group-hover:bg-highlighter-yellow transition-colors relative z-20`}>
                                        <IconComponent className="w-6 h-6 text-ink" />
                                    </div>

                                    <div className="ml-8 relative z-10">
                                        <span className="text-sm font-marker text-pencil/60 uppercase tracking-widest">{achievement.date}</span>
                                        <h3 className="text-3xl font-amatic font-bold mt-1 text-ink">{achievement.title}</h3>
                                        <p className="font-hand text-lg text-ink/80 mt-2 italic">{achievement.organization}</p>
                                        <p className="font-hand text-base text-ink/60 mt-3 leading-relaxed">
                                            {achievement.description}
                                        </p>
                                    </div>

                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-highlighter-yellow/20 -rotate-1 mix-blend-multiply group-hover:bg-highlighter-yellow/40 transition-colors" />
                                </PaperCard>
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.section>
    );
}
