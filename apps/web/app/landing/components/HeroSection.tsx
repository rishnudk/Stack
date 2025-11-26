"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Code2, Github, Terminal } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-10">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
      </div>

      <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            The Developer Social Network
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
            Where Developers <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">
              Build & Collaborate
            </span>
          </h1>

          <p className="text-xl text-neutral-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Showcase your work, track your growth, join dev communities, and collaborate on open-source projects.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              href="/auth/signin"
              className="group px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 bg-neutral-900/50 hover:bg-neutral-800 text-white border border-neutral-800 rounded-full font-semibold transition-all duration-300 backdrop-blur-sm"
            >
              Explore Features
            </Link>
          </div>

          <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-neutral-500">
            <div className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              <span>Open Source</span>
            </div>
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5" />
              <span>Collaboration</span>
            </div>
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              <span>Growth</span>
            </div>
          </div>
        </motion.div>

        {/* Right Visuals */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2, type: "spring" }}
          className="relative hidden lg:block"
        >
          <div className="relative w-full aspect-square max-w-[600px] mx-auto">
            {/* Abstract Background Blob */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />

            {/* Floating Cards */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 left-10 z-20 bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 p-4 rounded-2xl shadow-2xl w-64"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                <div>
                  <div className="h-2 w-24 bg-neutral-700 rounded mb-1" />
                  <div className="h-2 w-16 bg-neutral-800 rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-neutral-800 rounded" />
                <div className="h-2 w-3/4 bg-neutral-800 rounded" />
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-20 right-10 z-10 bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 p-4 rounded-2xl shadow-2xl w-72"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-mono text-blue-400">git commit -m "feat: init"</span>
              </div>
              <div className="space-y-2 font-mono text-xs text-neutral-400">
                <div className="flex gap-2">
                  <span className="text-green-400">+</span>
                  <span>import &#123; motion &#125; from "framer-motion";</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-400">+</span>
                  <span>export default function Hero() &#123;</span>
                </div>
                <div className="flex gap-2 pl-4">
                  <span className="text-green-400">+</span>
                  <span>return &lt;motion.div&gt;Hello&lt;/motion.div&gt;</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-400">+</span>
                  <span>&#125;</span>
                </div>
              </div>
            </motion.div>

            {/* Central Card */}
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-black border border-neutral-800 rounded-3xl p-6 shadow-2xl z-30"
            >
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 p-1 mb-4">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <Code2 className="w-10 h-10 text-blue-400" />
                  </div>
                </div>
                <h3 className="text-white font-bold text-xl mb-1">Alex Developer</h3>
                <p className="text-neutral-500 text-sm mb-4">Full Stack Engineer</p>
                <div className="flex justify-center gap-4 text-sm font-mono">
                  <div className="text-center">
                    <div className="text-white font-bold">1.2k</div>
                    <div className="text-neutral-600">Commits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-bold">450</div>
                    <div className="text-neutral-600">PRs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-bold">Top 1%</div>
                    <div className="text-neutral-600">LeetCode</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
