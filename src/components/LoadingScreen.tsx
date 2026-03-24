import { motion, AnimatePresence } from "framer-motion";
import { Spiral, Star } from "@/components/Doodles";
import { MOTION_EASE, MOTION_TIMING } from "@/lib/motion";
import { Z_INDEX } from "@/lib/z-index";

export default function LoadingScreen({ isLoading }: { isLoading: boolean }) {
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: MOTION_TIMING.loadingExit, ease: MOTION_EASE.smooth }
                    }}
                    className="fixed inset-0 bg-paper flex flex-col items-center justify-center pointer-events-auto"
                    style={{ zIndex: Z_INDEX.loading }}
                >
                    <div className="relative">
                        <Spiral className="w-48 h-48 text-ink" />

                        <motion.div
                            animate={{
                                rotate: 360,
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: MOTION_EASE.linear
                            }}
                            className="absolute -top-4 -right-4"
                        >
                            <Star className="w-12 h-12 text-highlighter-yellow" />
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: MOTION_TIMING.normal }}
                        className="mt-8 text-center"
                    >
                        <h2 className="text-4xl font-marker text-ink mb-2">sketching...</h2>
                        <p className="font-hand text-xl text-pencil">getting things ready.</p>
                    </motion.div>

                    {/*progress*/}
                    <div className="mt-12 w-64 h-2 bg-paper border border-ink/35 relative overflow-hidden">
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "0%" }}
                            transition={{ duration: 1.2, ease: MOTION_EASE.smooth }}
                            className="absolute inset-0 bg-highlighter-pink"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
