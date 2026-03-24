import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { portfolioConfig } from '@/portfolio.config';
import { Spiral, Underline } from '@/components/Doodles';
import { Award, Trophy, Star as StarIcon, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PaperCard from '@/components/ui/PaperCard';
import { Surface } from '@/components/ui/surface';
import { createPortal } from 'react-dom';

const icons = {
    trophy: Trophy,
    award: Award,
    star: StarIcon,
};

import ScribbleText from '@/components/ScribbleText';

export default function Achievements() {
    const { achievements } = portfolioConfig;
    const [isFolioOpen, setIsFolioOpen] = useState(false);

    return (
        <motion.section
            id="achievements"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="py-24 px-4 md:px-8 max-w-6xl mx-auto relative overflow-hidden flex flex-col items-center justify-center min-h-[60vh]"
        >

            {/*subtle doodle accent*/}
            <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
                <Spiral className="absolute top-[10%] left-[5%] w-48 h-48 text-pencil/30" />
            </div>

            <div className="relative z-10 w-full max-w-2xl mx-auto text-center">
                <div className="flex flex-col items-center mb-8">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-5xl font-marker text-center relative px-8"
                    >
                        <ScribbleText color="text-pencil/40">extras</ScribbleText>
                    </motion.h2>
                    <p className="font-hand text-xl text-pencil/60 mt-4 max-w-md mx-auto">
                        stuff i do outside code.
                    </p>
                </div>

                {/*folder*/}
                <motion.div
                    whileHover={{ scale: 1.03 }}
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
                    aria-label="open records"
                    className="cursor-pointer relative mt-8 group inline-block focus:outline-none focus:ring-4 focus:ring-highlighter-yellow/50 rounded-xl"
                >
                    <PaperCard
                        rotate={0}
                        showTape={false}
                        className="w-56 h-72 mx-auto flex flex-col items-center justify-center border-t-2 border-t-highlighter-yellow/40 bg-highlighter-yellow/10 shadow-xl overflow-hidden"
                    >

                        <FileText className="w-16 h-16 text-pencil/40 mb-4 group-hover:text-highlighter-yellow transition-colors" />
                        <h3 className="font-marker text-2xl text-ink/60 underline decoration-pencil/20 underline-offset-4">records</h3>
                        <div className="mt-4 px-3 py-1 bg-highlighter-yellow/20">
                            <span className="font-hand text-sm font-bold text-ink/70 tracking-widest uppercase">open</span>
                        </div>
                    </PaperCard>
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
                                className="w-full max-w-4xl max-h-[90vh] overflow-hidden relative flex flex-col min-h-0"
                            >
                                <Surface variant="modal" className="h-full flex flex-col border-pencil/20 min-h-0">
                                    {/*header*/}
                                    <div className="p-8 pb-4 border-b border-dashed border-pencil/10 relative shrink-0">
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 rotate-1 masking-tape z-20" />

                                        <Button
                                            variant="iconSoft"
                                            size="icon"
                                            onClick={() => setIsFolioOpen(false)}
                                            className="absolute top-4 right-4 z-50 h-10 w-10 hover:bg-highlighter-yellow/20"
                                        >
                                            <X className="w-6 h-6 text-pencil" />
                                        </Button>

                                        <div className="flex flex-col items-center justify-center">
                                            <h2 className="text-4xl font-marker text-ink">records</h2>
                                            <p className="font-hand text-lg text-pencil/60 italic mt-1 leading-none opacity-80">from robotics to debate.</p>
                                        </div>
                                    </div>

                                    {/*content*/}
                                    <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y p-6 md:p-10 custom-scrollbar">
                                        <div className="flex flex-col gap-10">
                                            {achievements.map((group, index) => {
                                                const IconComponent = icons[group.icon as keyof typeof icons] || Award;

                                                return (
                                                    <div key={index} className="relative">
                                                        <div className="flex items-center gap-4 mb-6">
                                                            <Surface variant="default" className="w-12 h-12 rounded-full bg-paper border-ink/35 flex items-center justify-center shadow-sm">
                                                                <IconComponent className="w-6 h-6 text-ink" />
                                                            </Surface>
                                                            <h3 className="text-3xl font-amatic font-bold text-ink">{group.category}</h3>
                                                            <div className="h-[2px] flex-1 bg-pencil/10 border-t border-dashed border-pencil/20" />
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-2">
                                                            {group.items.map((item, itemIdx) => {
                                                                const itemIcon = 'icon' in item ? item.icon : undefined;
                                                                const ItemIcon = icons[itemIcon as keyof typeof icons] || StarIcon;
                                                                return (
                                                                    <Surface
                                                                        variant="default"
                                                                        key={itemIdx}
                                                                        className="relative p-5 bg-ink/[0.02] border-ink/10 rounded-md hover:bg-highlighter-yellow/5 transition-colors group/item"
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
                                                                    </Surface>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="mt-20 flex flex-col items-center opacity-20 pointer-events-none">
                                            <Underline className="w-40 h-4 text-pencil" />
                                            <p className="mt-4 font-hand text-sm">more soon.</p>
                                        </div>
                                    </div>
                                </Surface>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </motion.section>
    );
}
