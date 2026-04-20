import { motion } from "framer-motion";
import React, { useRef, useState, useLayoutEffect } from "react";

interface ScribbleTextProps {
    children: React.ReactNode;
    className?: string;
    color?: string;
}

function buildPath(w: number): string {
    const m = w / 2;
    return `M4,10 Q${m * 0.5},16 ${m},5 T${w - 4},10`;
}

export default function ScribbleText({
    children,
    className = "",
    color = "text-highlighter-pink"
}: ScribbleTextProps) {
    const spanRef = useRef<HTMLSpanElement>(null);
    const [width, setWidth] = useState(200);

    useLayoutEffect(() => {
        if (spanRef.current) setWidth(spanRef.current.offsetWidth);
    }, [children]);

    return (
        <motion.span
            className={`relative inline-block cursor-default ${className}`}
            initial="initial"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true }}
        >
            <span ref={spanRef} className="relative z-10">{children}</span>
            <motion.svg
                aria-hidden="true"
                viewBox={`0 0 ${width} 20`}
                preserveAspectRatio="none"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                className={`absolute -bottom-2 left-0 w-full h-4 ${color} pointer-events-none`}
                variants={{
                    initial: { pathLength: 0, opacity: 0 },
                    visible: { pathLength: 1, opacity: 0.6 },
                    hover:   { pathLength: 1, opacity: 0.75 },
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <motion.path
                    d={buildPath(width)}
                    strokeWidth="3"
                    vectorEffect="non-scaling-stroke"
                />
            </motion.svg>
        </motion.span>
    );
}
