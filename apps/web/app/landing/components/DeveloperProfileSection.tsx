"use client";

import { motion } from "framer-motion";
import { Github, Trophy, Flame, GitCommit, Star, Code } from "lucide-react";

export default function DeveloperProfileSection() {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-4"
          >
            Your Developer Identity, <span className="text-blue-500">Supercharged</span>
          </motion.h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Showcase your GitHub contributions, LeetCode streaks, and tech stack in one professional profile.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* GitHub Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-colors group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-800 rounded-lg group-hover:bg-neutral-700 transition-colors">
                  <Github className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white">GitHub Activity</h3>
              </div>
              <span className="text-xs font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded">Top 5%</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Contributions</span>
                <span className="text-white font-mono">1,248</span>
              </div>
              <div className="h-24 flex items-end gap-1">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: Math.random() * 100 + "%" }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex-1 bg-green-500/50 rounded-sm hover:bg-green-400 transition-colors"
                  />
                ))}
              </div>
              <div className="flex gap-4 text-sm text-neutral-500">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" /> 128 Stars
                </div>
                <div className="flex items-center gap-1">
                  <GitCommit className="w-4 h-4" /> 450 Commits
                </div>
              </div>
            </div>
          </motion.div>

          {/* LeetCode Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-colors group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-800 rounded-lg group-hover:bg-neutral-700 transition-colors">
                  <Code className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="font-semibold text-white">LeetCode</h3>
              </div>
              <div className="flex items-center gap-1 text-orange-500">
                <Flame className="w-4 h-4 fill-orange-500" />
                <span className="font-mono font-bold">45 Day Streak</span>
              </div>
            </div>

            <div className="relative h-32 flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-neutral-800" />
                <motion.circle
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 0.75 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  cx="64" cy="64" r="56"
                  stroke="currentColor" strokeWidth="12" fill="transparent"
                  className="text-yellow-500"
                  strokeDasharray="351.86"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <div className="text-2xl font-bold text-white">342</div>
                <div className="text-xs text-neutral-500">Solved</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs">
              <div className="p-2 bg-neutral-800/50 rounded">
                <div className="text-cyan-400 font-bold">Easy</div>
                <div className="text-neutral-400">120</div>
              </div>
              <div className="p-2 bg-neutral-800/50 rounded">
                <div className="text-yellow-400 font-bold">Med</div>
                <div className="text-neutral-400">180</div>
              </div>
              <div className="p-2 bg-neutral-800/50 rounded">
                <div className="text-red-400 font-bold">Hard</div>
                <div className="text-neutral-400">42</div>
              </div>
            </div>
          </motion.div>

          {/* Skills Radar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-colors group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-800 rounded-lg group-hover:bg-neutral-700 transition-colors">
                  <Trophy className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="font-semibold text-white">Skill Radar</h3>
              </div>
              <span className="text-xs font-mono text-purple-400 bg-purple-400/10 px-2 py-1 rounded">Full Stack</span>
            </div>

            <div className="relative h-48 flex items-center justify-center">
              {/* Simplified Radar Visual using CSS/SVG */}
              <div className="relative w-40 h-40">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="absolute inset-0 border border-neutral-800 rounded-full"
                    style={{ transform: `scale(${1 - i * 0.25})` }}
                  />
                ))}
                {/* Skill Points */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  className="absolute inset-0 bg-purple-500/20 border border-purple-500/50 rounded-full"
                  style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                />
                
                {/* Labels */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-neutral-400">React</div>
                <div className="absolute top-1/4 -right-8 text-xs text-neutral-400">Node</div>
                <div className="absolute bottom-1/4 -right-8 text-xs text-neutral-400">SQL</div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-neutral-400">System Design</div>
                <div className="absolute bottom-1/4 -left-8 text-xs text-neutral-400">DSA</div>
                <div className="absolute top-1/4 -left-8 text-xs text-neutral-400">DevOps</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
