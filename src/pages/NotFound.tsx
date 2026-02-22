import { motion } from "framer-motion";
import { Star, Spiral, Arrow } from "@/components/Doodles";
import { Link } from "wouter";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-paper flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <Star className="absolute top-20 left-10 w-32 h-32 text-highlighter-pink" />
                <Spiral className="absolute bottom-40 right-20 w-48 h-48 text-pencil" />
                <Arrow className="absolute top-1/2 left-20 w-24 h-24 text-ink rotate-45" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                className="paper-card max-w-lg w-full p-12 text-center relative z-10"
            >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-8 py-2 masking-tape">
                    <span className="font-hand text-pencil">404</span>
                </div>

                <h1 className="text-8xl font-marker mb-4 text-ink">404</h1>
                <h2 className="text-4xl font-amatic font-bold mb-6">Page Not Found</h2>

                <p className="font-hand text-xl text-pencil mb-8 leading-relaxed">
                    The page you requested could not be found.
                    Please return to the homepage and continue browsing.
                </p>

                <Link href="/">
                    <button className="bg-ink text-paper px-8 py-4 font-marker text-xl hover:bg-pencil hover:scale-105 transition-all shadow-paper">
                        Return Home
                    </button>
                </Link>
            </motion.div>
        </div>
    );
}
