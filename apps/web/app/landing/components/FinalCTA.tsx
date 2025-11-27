"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Github, Code, Database, Server, Globe, Cpu } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-32 bg-[#000000] relative overflow-hidden flex items-center justify-center">
      {/* Glowing Circular Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#3B82F6] blur-[150px] opacity-20 rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffffff0a] border border-[#ffffff1f] text-[#cccccc] text-xs font-medium backdrop-blur-sm mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
          Own Your Dev Profile
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
        >
          Build. Collaborate. Grow. <br />
          <span className="text-[#9A9A9A]">Your dev journey starts here.</span>
        </motion.h2>

        {/* Tech Icons Circle */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-6 mb-12 text-[#ffffff40]"
        >
          <Code className="w-6 h-6" />
          <Database className="w-6 h-6" />
          <Server className="w-6 h-6" />
          <Globe className="w-6 h-6" />
          <Cpu className="w-6 h-6" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/auth/signin"
            className="px-8 py-4 bg-white text-black rounded-lg font-bold text-lg hover:bg-[#cccccc] transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center gap-2"
          >
            Start Now
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <Link
            href="https://github.com"
            className="px-8 py-4 text-white border border-[#ffffff1f] rounded-lg font-bold text-lg hover:bg-[#ffffff0a] transition-all flex items-center gap-2"
          >
            <Github className="w-5 h-5" />
            Star on GitHub
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
