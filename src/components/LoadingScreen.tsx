import { motion, AnimatePresence } from "framer-motion";
import { Spiral, Star } from "@/components/Doodles";

export default function LoadingScreen({ isLoading }: { isLoading: boolean }) {
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 0.8, ease: "easeInOut" }
                    }}
                    className="fixed inset-0 z-[100000] bg-paper flex flex-col items-center justify-center pointer-events-auto"
                >
                    <div className="relative">
                        <Spiral className="w-48 h-48 text-ink" />

                        <motion.div
                            animate={{
                                rotate: 360,
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute -top-4 -right-4"
                        >
                            <Star className="w-12 h-12 text-highlighter-yellow" />
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 text-center"
                    >
                        <h2 className="text-4xl font-marker text-ink mb-2">Sketching...</h2>
                        <p className="font-hand text-xl text-pencil">Sharpening the pencils and prepping the paper.</p>
                    </motion.div>

                    {/*progress*/}
                    <div className="mt-12 w-64 h-2 bg-paper border-2 border-ink relative overflow-hidden">
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "0%" }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            className="absolute inset-0 bg-highlighter-pink"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
