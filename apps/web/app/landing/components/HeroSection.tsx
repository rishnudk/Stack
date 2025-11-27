"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Github, ChevronRight } from "lucide-react";
import { useRef } from "react";

export default function HeroSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-[120vh] flex flex-col items-center pt-32 overflow-hidden bg-[#000000]">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      {/* Floating Plus Symbols */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: [0, 0.5, 0], y: -100 }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
            className="absolute text-[#ffffff1f] text-2xl font-light"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            +
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8 text-center lg:text-left"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffffff0a] border border-[#ffffff1f] text-[#cccccc] text-xs font-medium backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
            Own Your Dev Journey
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            The platform where developers <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#cccccc] to-[#9A9A9A]">
              build, collaborate, & grow.
            </span>
          </h1>

          <p className="text-lg text-[#9A9A9A] max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Showcase your work, track your progress, join groups, and collaborate on open-source projects. All in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              href="/auth/signin"
              className="px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-[#cccccc] transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#features"
              className="px-8 py-3 bg-transparent text-white border border-[#ffffff1f] rounded-lg font-semibold hover:bg-[#ffffff0a] transition-colors flex items-center justify-center gap-2"
            >
              <Github className="w-4 h-4" />
              Star on GitHub
            </Link>
          </div>
        </motion.div>

        {/* Right Visual - Tilted Screenshot */}
        <motion.div
          style={{ y, opacity }}
          initial={{ opacity: 0, rotateX: 20, rotateY: -20, scale: 0.9 }}
          animate={{ opacity: 1, rotateX: 10, rotateY: -15, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
          className="relative hidden lg:block perspective-1000"
        >
          <div className="relative transform-style-3d rotate-y-[-15deg] rotate-x-[10deg] hover:rotate-y-[-10deg] hover:rotate-x-[5deg] transition-transform duration-700 ease-out">
            {/* Glow Behind */}
            <div className="absolute inset-0 bg-[#3B82F6] blur-[100px] opacity-20" />
            
            {/* Main Screenshot Card */}
            <div className="relative bg-[#0A0A0A] border border-[#ffffff1f] rounded-xl overflow-hidden shadow-2xl">
              {/* Window Controls */}
              <div className="h-8 bg-[#050505] border-b border-[#ffffff0a] flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>
              
              {/* Mock Content */}
              <div className="p-6 space-y-6 bg-[#000000]/80 backdrop-blur-sm">
                <div className="flex gap-6">
                  {/* Sidebar */}
                  <div className="w-16 space-y-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-lg bg-[#ffffff0a] border border-[#ffffff0a]" />
                    ))}
                  </div>
                  
                  {/* Main Area */}
                  <div className="flex-1 space-y-4">
                    <div className="h-32 rounded-lg bg-gradient-to-br from-[#ffffff0a] to-transparent border border-[#ffffff0a] p-4">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-[#3B82F6]/20" />
                        <div className="space-y-2">
                          <div className="w-32 h-2 bg-[#ffffff1f] rounded" />
                          <div className="w-20 h-2 bg-[#ffffff1f] rounded" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-full h-2 bg-[#ffffff0a] rounded" />
                        <div className="w-2/3 h-2 bg-[#ffffff0a] rounded" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-24 rounded-lg bg-[#ffffff05] border border-[#ffffff0a]" />
                      <div className="h-24 rounded-lg bg-[#ffffff05] border border-[#ffffff0a]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Glossy Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
