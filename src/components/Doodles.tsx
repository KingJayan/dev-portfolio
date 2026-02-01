import { motion } from "framer-motion";

export const Star = ({ className }: { className?: string }) => (
    <motion.svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ type: "spring", stiffness: 200, damping: 10, duration: 0.8 }}
    >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </motion.svg>
);

export const Arrow = ({ className }: { className?: string }) => (
    <motion.svg
        aria-hidden="true"
        viewBox="0 0 100 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
    >
        <path d="M10,25 Q50,5 90,25" />
        <path d="M70,15 L90,25 L80,35" />
    </motion.svg>
);

export const Spiral = ({ className }: { className?: string }) => (
    <motion.svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className={className}
        initial={{ pathLength: 0, rotate: -90, opacity: 0 }}
        whileInView={{ pathLength: 1, rotate: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.5, ease: "easeOut" }}
    >
        <path d="M50,50 m0,-40 a40,40 0 1,1 0,80 a40,40 0 1,1 0,-80 a30,30 0 1,0 0,60 a30,30 0 1,0 0,-60" />
    </motion.svg>
);

export const Underline = ({ className }: { className?: string }) => (
    <motion.svg
        aria-hidden="true"
        viewBox="0 0 200 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className={className}
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
    >
        <path d="M5,10 Q50,15 100,5 T195,10" />
    </motion.svg>
);
