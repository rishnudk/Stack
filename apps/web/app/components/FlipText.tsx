"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FlipTextProps {
    children: string;
    className?: string;
    delay?: number;
    together?: boolean;
}

export const FlipText = ({ children, className, delay = 0, together = false }: FlipTextProps) => {
    const words = children.split(" ");

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: together ? 0 : 0.08,
                delayChildren: delay,
            },
        },
    };

    const child = {
        hidden: { opacity: 0, y: 20, rotateX: -90 },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                duration: 0.6,
                ease: [0.23, 1, 0.32, 1],
            },
        },
    };

    return (
        <motion.span
            variants={container}
            initial="hidden"
            animate="visible"
            className={cn("inline-flex flex-wrap gap-x-[0.3em] perspective-[800px]", className)}
            style={{ perspective: "800px" }}
        >
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    variants={child}
                    className="inline-block origin-top"
                    style={{ transformOrigin: "top center" }}
                >
                    {word}
                </motion.span>
            ))}
        </motion.span>
    );
};
