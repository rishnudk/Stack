"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function AnimatedButton({ children, className, onClick }: AnimatedButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all",
        "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900",
        "border border-zinc-800 dark:border-zinc-200",
        "shadow-[0_0_0_1px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]",
        "hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_4px_20px_rgba(255,255,255,0.1)]",
        "px-6 py-3 text-sm",
        className
      )}
    >
      <motion.span
        className="absolute inset-0 rounded-full opacity-0 bg-white/10 dark:bg-black/10"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
      {children}
    </motion.button>
  );
}
