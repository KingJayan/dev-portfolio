import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { portfolioConfig } from '@/portfolio.config';
import { Underline, Circle } from '@/components/Doodles';
import { Award, Trophy, Star as StarIcon, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PaperCard from '@/components/ui/PaperCard';
import { Surface } from '@/components/ui/surface';
import { createPortal } from 'react-dom';
import { Z_INDEX } from '@/lib/z-index';
import ScribbleText from '@/components/ScribbleText';
import DrawText from '@/components/DrawText';

const ICONS = { trophy: Trophy, award: Award, star: StarIcon };

type AchievementItem = typeof portfolioConfig.achievements[number]['items'][number];

function AchievementCard({ item }: { item: AchievementItem }) {
    const itemIcon = 'icon' in item ? item.icon : undefined;
    const Icon = ICONS[itemIcon as keyof typeof ICONS] || StarIcon;
    return (
        <motion.div
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="relative p-5 bg-paper/50 backdrop-blur-sm border border-pencil/15 rounded-xl shadow-paper hover:shadow-paper-hover hover:bg-paper/75 hover:border-pencil/30 transition-[background-color,border-color,box-shadow] group/item"
        >
            <div className="flex items-start gap-3">
                <Icon className="w-4 h-4 mt-1 text-pencil group-hover/item:scale-125 transition-transform shrink-0" />
                <div>
                    <h5 className="font-marker text-lg text-ink leading-tight">{item.title}</h5>
                    <p className="font-hand text-sm text-pencil/60 mt-0.5">
                        {item.organization}{item.organization && item.date ? ' · ' : ''}{item.date}
                    </p>
                    {item.description && (
                        <p className="font-hand text-sm text-ink/70 mt-1.5 leading-relaxed">{item.description}</p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

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
            <div className="relative z-10 w-full max-w-2xl mx-auto text-center">
                <div className="flex flex-col items-center mb-8">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-5xl font-marker text-center relative inline-block px-8"
                    >
                        <ScribbleText color="text-pencil/40">
                          <DrawText text="extras" fontUrl="/fonts/PermanentMarker.woff" />
                        </ScribbleText>
                        <Circle className="absolute -inset-y-2 -inset-x-1 w-[calc(100%+8px)] h-[calc(100%+16px)] text-pencil/25 pointer-events-none" />
                    </motion.h2>
                    <p className="font-hand text-xl text-pencil/60 mt-4 max-w-md mx-auto">stuff i do outside code.</p>
                </div>

                <motion.div
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setIsFolioOpen(true)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsFolioOpen(true); } }}
                    tabIndex={0} role="button" aria-label="open extras"
                    className="cursor-pointer relative mt-8 group inline-block focus:outline-none focus:ring-4 focus:ring-highlighter-yellow/50 rounded-xl"
                >
                    <PaperCard rotate={0} showTape={false}
                        className="w-56 h-72 mx-auto flex flex-col items-center justify-center border-t-2 border-t-highlighter-yellow/50 bg-paper/70 backdrop-blur-sm shadow-paper overflow-hidden group-hover:shadow-paper-hover transition-shadow"
                    >
                        <FileText className="w-16 h-16 text-pencil/40 mb-4 group-hover:text-highlighter-yellow transition-colors duration-300" />
                        <h3 className="font-marker text-2xl text-ink/60">extracurriculars</h3>
                        <p className="font-hand text-sm text-pencil/40 mt-1">click to browse</p>
                        <div className="mt-4 px-3 py-1 border border-pencil/20 rounded bg-paper/50 backdrop-blur-sm group-hover:bg-highlighter-yellow/30 group-hover:border-highlighter-yellow/50 transition-all duration-300">
                            <span className="font-hand text-sm text-ink/60">open →</span>
                        </div>
                    </PaperCard>
                </motion.div>
            </div>

            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isFolioOpen && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                            style={{ zIndex: Z_INDEX.modal }}
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
                                    <div className="p-8 pb-4 border-b border-dashed border-pencil/10 relative shrink-0">
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 rotate-1 masking-tape z-20" />
                                        <Button variant="iconSoft" size="icon" onClick={() => setIsFolioOpen(false)}
                                            className="absolute top-4 right-4 z-50 h-10 w-10 hover:bg-highlighter-yellow/20">
                                            <X className="w-6 h-6 text-pencil" />
                                        </Button>
                                        <div className="flex flex-col items-center justify-center">
                                            <h2 className="text-4xl font-marker text-ink">extras</h2>
                                            <p className="font-hand text-lg text-pencil/60 italic mt-1 leading-none opacity-80">from robotics to debate.</p>
                                        </div>
                                    </div>

                                    <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y p-6 md:p-10 custom-scrollbar">
                                        <div className="flex flex-col gap-10">
                                            {achievements.map((group, index) => {
                                                const Icon = ICONS[group.icon as keyof typeof ICONS] || Award;
                                                return (
                                                    <div key={index} className="relative">
                                                        <div className="flex items-center gap-4 mb-6">
                                                            <Surface variant="default" className="w-12 h-12 rounded-full bg-paper border-ink/35 flex items-center justify-center shadow-sm">
                                                                <Icon className="w-6 h-6 text-ink" />
                                                            </Surface>
                                                            <h3 className="text-3xl font-amatic font-bold text-ink">{group.category}</h3>
                                                            <div className="h-[2px] flex-1 bg-pencil/10 border-t border-dashed border-pencil/20" />
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-2">
                                                            {group.items.map((item, itemIdx) => (
                                                                <AchievementCard key={itemIdx} item={item} />
                                                            ))}
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
