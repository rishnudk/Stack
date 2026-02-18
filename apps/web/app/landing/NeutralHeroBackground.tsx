"use client";

import { motion } from "framer-motion";

interface NeutralHeroBackgroundProps {
    className?: string;
}

export const NeutralHeroBackground = ({ className = "" }: NeutralHeroBackgroundProps) => {
    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_60%,transparent_100%)]" />

            {/* Radial glow center */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-radial from-zinc-200/60 via-zinc-100/20 to-transparent dark:from-zinc-800/40 dark:via-zinc-900/20 dark:to-transparent blur-3xl" />

            {/* Floating orbs */}
            {[
                { x: "20%", y: "30%", size: 300, delay: 0 },
                { x: "75%", y: "20%", size: 200, delay: 1.5 },
                { x: "50%", y: "60%", size: 250, delay: 0.8 },
            ].map((orb, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-zinc-200/30 dark:bg-zinc-800/20 blur-3xl"
                    style={{
                        left: orb.x,
                        top: orb.y,
                        width: orb.size,
                        height: orb.size,
                        translateX: "-50%",
                        translateY: "-50%",
                    }}
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 6 + i * 2,
                        repeat: Infinity,
                        delay: orb.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Subtle noise texture overlay */}
            <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />
        </div>
    );
};