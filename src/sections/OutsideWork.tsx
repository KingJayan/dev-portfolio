import { motion } from 'framer-motion';
import { portfolioConfig } from '@/portfolio.config';
import { Arrow, Spiral, Star } from '@/components/Doodles';
import PaperCard from '@/components/ui/PaperCard';
import { Surface } from '@/components/ui/surface';

import ScribbleText from '@/components/ScribbleText';
import DrawText from '@/components/DrawText';

type Hobby = typeof portfolioConfig.outsideProgramming.hobbies[number];

export default function OutsideWork() {
    const { outsideProgramming } = portfolioConfig;

    return (
        <motion.section
            id="outside"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="py-24 px-4 md:px-8 max-w-6xl mx-auto relative overflow-hidden"
        >
            {/*doodle accent*/}
            <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
                <Spiral className="absolute top-10 right-20 w-48 h-48 text-pencil/30" />
                <Star className="absolute bottom-20 left-10 w-24 h-24 text-highlighter-pink/70" />
            </div>

            <div className="relative z-10 w-full">
                <div className="flex flex-col items-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-5xl font-marker text-center relative z-10"
                    >
                        <ScribbleText color="text-highlighter-pink">
                          <DrawText text={outsideProgramming.title} fontUrl="/fonts/PermanentMarker.woff" />
                        </ScribbleText>
                    </motion.h2>
                </div>

                <div className="flex flex-wrap justify-center gap-8">
                    {outsideProgramming.hobbies.map((hobby: Hobby, index: number) => (
                        <div key={index} className="w-full sm:w-[calc(50%-16px)] lg:w-[calc(25%-24px)] max-w-sm">
                            <PaperCard
                                rotate={0}
                                delay={index * 0.15}
                                tapeColor="bg-highlighter-yellow"
                                hoverScale={1.05}
                                className="bg-paper p-4 h-full"
                            >
                                {/*img*/}
                                <Surface variant="default" className="aspect-[4/3] bg-paper overflow-hidden mb-4 border-ink/30 relative">
                                    <img
                                        src={hobby.image}
                                        alt={hobby.name}
                                        loading="lazy"
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out"
                                    />
                                    <div className="absolute inset-0 bg-ink/5 pointer-events-none" />
                                </Surface>

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
