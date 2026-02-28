import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { portfolioConfig } from '@/portfolio.config';
import { Star, Spiral, Arrow, Underline } from '@/components/Doodles';
import { Award, Trophy, Star as StarIcon, FileText, X } from 'lucide-react';
import PaperCard from '@/components/ui/PaperCard';
import { createPortal } from 'react-dom';

const icons = {
    trophy: Trophy,
    award: Award,
    star: StarIcon,
};

import ScribbleText from '@/components/ScribbleText';

const springConfig = { stiffness: 50, damping: 30, mass: 1 };

export default function Achievements() {
    const { achievements } = portfolioConfig;
    const [isFolioOpen, setIsFolioOpen] = useState(false);

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

    const backX = useTransform(mouseX, [-1, 1], ["5%", "-5%"]);
    const backY = useTransform(mouseY, [-1, 1], ["5%", "-5%"]);

    return (
        <motion.section
            id="achievements"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="py-24 px-4 md:px-8 max-w-6xl mx-auto relative overflow-hidden flex flex-col items-center justify-center min-h-[60vh]"
        >

            {/*parallax*/}
            <motion.div style={{ x: backX, y: backY }} className="absolute inset-0 pointer-events-none opacity-25 z-0">
                <Spiral className="absolute top-[10%] left-[5%] w-48 h-48 text-pencil/30" />
                <Star className="absolute bottom-[10%] right-[10%] w-24 h-24 text-highlighter-yellow/50" />
                <div className="absolute top-[20%] right-[15%] w-6 h-6 rounded-full bg-highlighter-pink/30" />
                <Spiral className="absolute bottom-[20%] left-[20%] w-32 h-32 text-pencil/20 -rotate-90" />
            </motion.div>

            <div className="relative z-10 w-full max-w-2xl mx-auto text-center">
                <div className="flex flex-col items-center mb-8">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-5xl font-marker text-center relative px-8"
                    >
                        <ScribbleText color="text-pencil/40">Extracurriculars</ScribbleText>
                    </motion.h2>
                    <p className="font-hand text-xl text-pencil/60 mt-4 max-w-md mx-auto">
                        Selected activities and achievements outside my core development work.
                    </p>
                </div>

                {/*folder*/}
                <motion.div
                    whileHover={{ scale: 1.05, rotate: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsFolioOpen(true)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setIsFolioOpen(true);
                        }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label="Open personal records folder"
                    className="cursor-pointer relative mt-8 group inline-block focus:outline-none focus:ring-4 focus:ring-highlighter-pink/50 rounded-xl"
                >
                    <div className="absolute -inset-4 bg-highlighter-yellow/10 rounded-xl blur-2xl group-hover:bg-highlighter-yellow/20 transition-all" />
                    <PaperCard
                        rotate={0}
                        showTape={false}
                        className="w-56 h-72 mx-auto flex flex-col items-center justify-center border-t-8 border-t-highlighter-yellow/40 bg-highlighter-yellow/10 shadow-xl overflow-hidden"
                    >

                        <FileText className="w-16 h-16 text-pencil/40 mb-4 group-hover:text-highlighter-pink transition-colors" />
                        <h3 className="font-marker text-2xl text-ink/60 underline decoration-pencil/20 underline-offset-4">My Records</h3>
                        <div className="mt-4 px-3 py-1 bg-highlighter-pink/20">
                            <span className="font-hand text-sm font-bold text-ink/70 tracking-widest uppercase">View Details</span>
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 flex justify-between opacity-30">
                            <Spiral className="w-8 h-8" />
                            <Star className="w-6 h-6" />
                        </div>
                    </PaperCard>

                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-pencil font-hand text-sm uppercase tracking-wider">
                        Open
                    </div>
                </motion.div>
            </div>

            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isFolioOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                            onClick={() => setIsFolioOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 100, rotate: 2 }}
                                animate={{ scale: 1, y: 0, rotate: 0 }}
                                exit={{ scale: 0.9, y: 100, rotate: -2 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-paper w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-sm shadow-2xl relative border-4 border-pencil/20 paper-texture flex flex-col"
                            >
                                {/*header*/}
                                <div className="p-8 pb-4 border-b-2 border-dashed border-pencil/10 relative shrink-0">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 rotate-1 masking-tape z-20" />

                                    <button
                                        onClick={() => setIsFolioOpen(false)}
                                        className="absolute top-4 right-4 z-50 p-2 hover:bg-highlighter-pink/20 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6 text-pencil" />
                                    </button>

                                    <div className="flex flex-col items-center justify-center">
                                        <h2 className="text-4xl font-marker text-ink">Personal Records</h2>
                                        <p className="font-hand text-lg text-pencil/60 italic mt-1 leading-none opacity-80">Everything from Robotics to Debate.</p>
                                    </div>
                                </div>

                                {/*content*/}
                                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                                    <div className="flex flex-col gap-10">
                                        {achievements.map((group, index) => {
                                            const IconComponent = icons[group.icon as keyof typeof icons] || Award;

                                            return (
                                                <div key={index} className="relative">
                                                    <div className="flex items-center gap-4 mb-6">
                                                        <div className="w-12 h-12 rounded-full bg-paper border-2 border-ink flex items-center justify-center shadow-sm">
                                                            <IconComponent className="w-6 h-6 text-ink" />
                                                        </div>
                                                        <h3 className="text-3xl font-amatic font-bold text-ink">{group.category}</h3>
                                                        <div className="h-[2px] flex-1 bg-pencil/10 border-t border-dashed border-pencil/20" />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-2">
                                                        {group.items.map((item, itemIdx) => {
                                                            const itemIcon = 'icon' in item ? item.icon : undefined;
                                                            const ItemIcon = icons[itemIcon as keyof typeof icons] || StarIcon;
                                                            return (
                                                                <div
                                                                    key={itemIdx}
                                                                    className="relative p-5 bg-ink/[0.02] border border-ink/5 rounded-md hover:bg-highlighter-yellow/5 transition-colors group/item"
                                                                >
                                                                    <div className="flex items-start gap-3">
                                                                        <ItemIcon className="w-4 h-4 mt-1 text-pencil group-hover/item:scale-125 transition-transform" />
                                                                        <div>
                                                                            <span className="text-[10px] font-marker text-pencil/40 uppercase tracking-widest">{item.date}</span>
                                                                            <h5 className="text-xl font-amatic font-bold text-ink leading-tight">{item.title}</h5>
                                                                            <p className="font-hand text-xs text-pencil/60 mt-0.5">{item.organization}</p>
                                                                            <p className="font-hand text-sm text-ink/80 mt-2 leading-relaxed italic">
                                                                                {item.description}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-20 flex flex-col items-center opacity-20 pointer-events-none">
                                        <Underline className="w-40 h-4 text-pencil" />
                                        <p className="mt-4 font-hand text-sm">Additional records will be added over time.</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </motion.section>
    );
}
