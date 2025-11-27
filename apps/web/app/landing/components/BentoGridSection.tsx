"use client";

import { motion } from "framer-motion";
import { Github, Code2, Users, MessageSquare, BarChart3, Globe, Terminal, Calendar, Award, GitBranch } from "lucide-react";

export default function BentoGridSection() {
  return (
    <section id="features" className="py-24 bg-[#000000] relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Everything you need to <span className="text-[#3B82F6]">excel</span>
          </h2>
          <p className="text-[#9A9A9A] max-w-2xl mx-auto">
            A complete ecosystem for developers to build, track, and grow their careers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto auto-rows-[minmax(180px,auto)]">
          {/* 1. Developer Portfolio Integration (Large) */}
          <BentoCard className="md:col-span-2 md:row-span-2">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-[#ffffff0a] border border-[#ffffff0a]">
                  <Github className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-mono text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-1 rounded">Auto-Sync</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Portfolio Integration</h3>
              <p className="text-[#9A9A9A] text-sm mb-6">
                Automatically fetch and display your GitHub stats, LeetCode streaks, and StackOverflow reputation.
              </p>
              <div className="flex-1 bg-[#0A0A0A] rounded-lg border border-[#ffffff0a] p-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#ffffff1f]" />
                    <div className="h-2 w-24 bg-[#ffffff1f] rounded" />
                  </div>
                  <div className="h-20 bg-[#ffffff05] rounded border border-[#ffffff05]" />
                  <div className="flex gap-2">
                    <div className="h-2 w-full bg-[#ffffff0a] rounded" />
                    <div className="h-2 w-2/3 bg-[#ffffff0a] rounded" />
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* 2. Activity Timeline */}
          <BentoCard className="md:col-span-1 md:row-span-2">
            <div className="p-6 h-full flex flex-col">
              <div className="p-2 w-fit rounded-lg bg-[#ffffff0a] border border-[#ffffff0a] mb-4">
                <Terminal className="w-5 h-5 text-[#14B8A6]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Dev Feed</h3>
              <div className="flex-1 space-y-4 mt-4 relative">
                <div className="absolute left-2 top-0 bottom-0 w-px bg-[#ffffff0a]" />
                {[
                  { text: "Pushed to main", time: "2m ago", color: "bg-green-500" },
                  { text: "Solved Hard", time: "1h ago", color: "bg-yellow-500" },
                  { text: "Joined Group", time: "3h ago", color: "bg-blue-500" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 items-center relative z-10">
                    <div className={`w-4 h-4 rounded-full border-2 border-[#000] ${item.color}`} />
                    <div>
                      <div className="text-xs text-white font-medium">{item.text}</div>
                      <div className="text-[10px] text-[#9A9A9A]">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>

          {/* 3. Skill Radar Graph */}
          <BentoCard className="md:col-span-1 md:row-span-1">
            <div className="p-6 h-full flex flex-col items-center justify-center text-center">
              <div className="relative w-24 h-24 mb-3">
                <div className="absolute inset-0 border border-[#ffffff1f] rounded-full opacity-50" />
                <div className="absolute inset-4 border border-[#ffffff1f] rounded-full opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-[#FF007A]" />
                </div>
              </div>
              <h3 className="text-sm font-bold text-white">Skill Radar</h3>
            </div>
          </BentoCard>

          {/* 4. Groups & Collaboration */}
          <BentoCard className="md:col-span-1 md:row-span-1">
            <div className="p-6 h-full">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-5 h-5 text-white" />
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full bg-[#ffffff1f] border border-black" />
                  ))}
                </div>
              </div>
              <h3 className="text-lg font-bold text-white">Groups</h3>
              <p className="text-xs text-[#9A9A9A] mt-1">Real-time chat & collaboration.</p>
            </div>
          </BentoCard>

          {/* 5. Open Source Workspaces */}
          <BentoCard className="md:col-span-2 md:row-span-1">
            <div className="p-6 h-full flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <GitBranch className="w-5 h-5 text-white" />
                  <span className="text-xs text-[#9A9A9A]">Open Source</span>
                </div>
                <h3 className="text-lg font-bold text-white">Project Workspaces</h3>
                <p className="text-sm text-[#9A9A9A]">Manage tasks, PRs, and contributions.</p>
              </div>
              <div className="h-16 w-32 bg-[#ffffff05] rounded border border-[#ffffff0a] relative overflow-hidden">
                 <div className="absolute top-2 left-2 right-2 h-2 bg-[#ffffff0a] rounded-sm" />
                 <div className="absolute top-6 left-2 w-1/2 h-2 bg-[#ffffff0a] rounded-sm" />
              </div>
            </div>
          </BentoCard>

          {/* 6. Coding Events */}
          <BentoCard className="md:col-span-1 md:row-span-1">
            <div className="p-6 h-full flex flex-col justify-between">
              <Calendar className="w-5 h-5 text-white" />
              <div>
                <h3 className="text-lg font-bold text-white">Events</h3>
                <p className="text-xs text-[#9A9A9A]">Weekly hackathons.</p>
              </div>
            </div>
          </BentoCard>

          {/* 7. Professional Profile */}
          <BentoCard className="md:col-span-1 md:row-span-1">
            <div className="p-6 h-full flex flex-col justify-between bg-gradient-to-br from-[#3B82F6]/10 to-transparent">
              <Award className="w-5 h-5 text-[#3B82F6]" />
              <div>
                <h3 className="text-lg font-bold text-white">Pro Profile</h3>
                <p className="text-xs text-[#9A9A9A]">Badges & credibility.</p>
              </div>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}

function BentoCard({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`relative rounded-xl overflow-hidden bg-[#050505] border border-[#ffffff0a] hover:border-[#ffffff1f] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] group ${className}`}
    >
      {children}
      {/* Inner Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
}
