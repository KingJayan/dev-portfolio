import { motion, AnimatePresence } from "framer-motion";
import { Z_INDEX } from "@/lib/z-index";
import { portfolioConfig } from "@/portfolio.config";

const ORBS = [
    { size: 320, x: "8%",  y: "12%", color: "hsla(230,55%,76%,0.28)", blur: 64, delay: 0    },
    { size: 260, x: "78%", y: "6%",  color: "hsla(340,50%,72%,0.24)", blur: 56, delay: 1.4  },
    { size: 200, x: "68%", y: "72%", color: "hsla(175,45%,68%,0.22)", blur: 48, delay: 0.7  },
    { size: 180, x: "18%", y: "68%", color: "hsla(38, 80%,60%,0.26)", blur: 40, delay: 2.1  },
    { size: 140, x: "50%", y: "50%", color: "hsla(207,40%,65%,0.18)", blur: 36, delay: 1.0  },
] as const;

const PHRASES = ["sketching…", "brewing…", "crafting…"] as const;

export default function LoadingScreen({ isLoading }: { isLoading: boolean }) {
    const [firstName, ...rest] = portfolioConfig.personal.name.split(" ");
    const lastName = rest.join(" ");

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        scale: 1.04,
                        filter: "blur(6px)",
                        transition: { duration: 0.55, ease: "easeInOut" },
                    }}
                    className="fixed inset-0 flex items-center justify-center overflow-hidden"
                    style={{
                        zIndex: Z_INDEX.loading,
                        background: "var(--color-paper)",
                        backgroundImage: `
                            radial-gradient(ellipse 65% 50% at 10% 18%, hsla(230,55%,76%,0.42) 0%, transparent 65%),
                            radial-gradient(ellipse 55% 40% at 90% 10%, hsla(340,50%,72%,0.38) 0%, transparent 60%),
                            radial-gradient(ellipse 50% 45% at 75% 88%, hsla(175,45%,68%,0.34) 0%, transparent 62%),
                            radial-gradient(ellipse 45% 38% at 30% 78%, hsla(38,80%,60%,0.32)  0%, transparent 58%)
                        `,
                    }}
                >
                    {/* floating glass orbs */}
                    {ORBS.map((orb, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full pointer-events-none"
                            style={{
                                width:  orb.size,
                                height: orb.size,
                                left:   orb.x,
                                top:    orb.y,
                                transform: "translate(-50%,-50%)",
                                background: orb.color,
                                filter: `blur(${orb.blur}px)`,
                            }}
                            animate={{
                                y: [0, -18, 8, -12, 0],
                                x: [0, 10, -6, 8, 0],
                                scale: [1, 1.06, 0.97, 1.03, 1],
                            }}
                            transition={{
                                duration: 9 + i * 1.3,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: orb.delay,
                            }}
                        />
                    ))}

                    {/* central glass card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.91, y: 16 }}
                        animate={{ opacity: 1, scale: 1,    y: 0  }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                        className="relative flex flex-col items-center px-14 py-12 rounded-3xl"
                        style={{
                            backdropFilter: "blur(28px) saturate(1.4)",
                            WebkitBackdropFilter: "blur(28px) saturate(1.4)",
                            background:
                                "linear-gradient(135deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.18) 100%)",
                            border: "1px solid rgba(255,255,255,0.55)",
                            boxShadow: `
                                0 8px 48px rgba(0,0,0,0.08),
                                0 2px 12px rgba(0,0,0,0.06),
                                inset 0 1px 0 rgba(255,255,255,0.7)
                            `,
                            minWidth: 320,
                        }}
                    >
                        {/* top shimmer line */}
                        <motion.div
                            className="absolute top-0 left-8 right-8 h-px"
                            style={{
                                background:
                                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
                            }}
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                        />

                        {/* monogram badge */}
                        <motion.div
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1,   opacity: 1 }}
                            transition={{ delay: 0.25, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                            className="mb-6 w-16 h-16 rounded-2xl flex items-center justify-center"
                            style={{
                                background:
                                    "linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.25) 100%)",
                                border: "1px solid rgba(255,255,255,0.6)",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.8)",
                            }}
                        >
                            <span
                                className="text-2xl leading-none select-none"
                                style={{
                                    fontFamily: portfolioConfig.fonts.marker,
                                    color: "var(--color-ink)",
                                    opacity: 0.82,
                                }}
                            >
                                {firstName[0]}{lastName[0]}
                            </span>
                        </motion.div>

                        {/* name */}
                        <div className="mb-1 overflow-hidden">
                            <motion.h1
                                initial={{ y: "100%", opacity: 0 }}
                                animate={{ y: "0%",   opacity: 1 }}
                                transition={{ delay: 0.38, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                                className="text-3xl tracking-tight text-center select-none"
                                style={{
                                    fontFamily: portfolioConfig.fonts.marker,
                                    color: "var(--color-ink)",
                                }}
                            >
                                {firstName}{" "}
                                <span style={{ opacity: 0.7 }}>{lastName}</span>
                            </motion.h1>
                        </div>

                        {/* subtitle */}
                        <div className="overflow-hidden mb-10">
                            <motion.p
                                initial={{ y: "100%", opacity: 0 }}
                                animate={{ y: "0%",   opacity: 1 }}
                                transition={{ delay: 0.52, duration: 0.5, ease: "easeOut" }}
                                className="text-sm text-center select-none"
                                style={{
                                    fontFamily: portfolioConfig.fonts.hand,
                                    color: "var(--color-pencil-light)",
                                    letterSpacing: "0.05em",
                                }}
                            >
                                {portfolioConfig.personal.title}
                            </motion.p>
                        </div>

                        {/* progress track */}
                        <motion.div
                            initial={{ opacity: 0, scaleX: 0.6 }}
                            animate={{ opacity: 1, scaleX: 1   }}
                            transition={{ delay: 0.6, duration: 0.4 }}
                            className="w-full relative"
                        >
                            {/* track */}
                            <div
                                className="h-1 w-full rounded-full overflow-hidden"
                                style={{
                                    background: "rgba(0,0,0,0.08)",
                                    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.06)",
                                }}
                            >
                                {/* fill */}
                                <motion.div
                                    className="h-full rounded-full"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ delay: 0.65, duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
                                    style={{
                                        background:
                                            "linear-gradient(90deg, hsla(38,80%,60%,0.7), hsla(340,50%,72%,0.8), hsla(175,45%,68%,0.7))",
                                        boxShadow: "0 0 8px rgba(185,108,120,0.35)",
                                    }}
                                />
                            </div>

                            {/* cycling label */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 1, 0] }}
                                transition={{
                                    delay: 0.7,
                                    duration: 1.1,
                                    times: [0, 0.15, 0.75, 1],
                                    ease: "easeInOut",
                                }}
                                className="mt-3 text-center text-xs select-none"
                                style={{
                                    fontFamily: portfolioConfig.fonts.amatic,
                                    color: "var(--color-pencil-light)",
                                    fontSize: "0.78rem",
                                    letterSpacing: "0.04em",
                                }}
                            >
                                {PHRASES[0]}
                            </motion.p>
                        </motion.div>

                        {/* bottom shimmer line */}
                        <motion.div
                            className="absolute bottom-0 left-8 right-8 h-px"
                            style={{
                                background:
                                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                            }}
                        />
                    </motion.div>

                    {/* subtle corner deco dots */}
                    {[
                        { top: "15%", left: "12%" },
                        { top: "80%", left: "85%" },
                        { top: "25%", right: "10%" },
                        { bottom: "18%", left: "8%" },
                    ].map((pos, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full pointer-events-none"
                            style={{
                                ...pos,
                                width:  6 + i * 2,
                                height: 6 + i * 2,
                                background: "rgba(255,255,255,0.45)",
                                border: "1px solid rgba(255,255,255,0.6)",
                                backdropFilter: "blur(4px)",
                            }}
                            animate={{
                                opacity: [0.4, 0.9, 0.4],
                                scale:   [1,   1.3,  1  ],
                            }}
                            transition={{
                                duration: 3 + i * 0.7,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.5,
                            }}
                        />
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
