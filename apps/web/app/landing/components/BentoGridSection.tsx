"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Github, Code2, Users, MessageSquare, BarChart3, Globe } from "lucide-react";

export default function BentoGridSection() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Fluid Background Effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-4"
          >
            Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Excel</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Feature 1: Developer Profile (Large Span) */}
          <BentoCard
            className="md:col-span-2 md:row-span-2"
            loading={loading}
            delay={0}
          >
            <div className="h-full flex flex-col justify-between relative overflow-hidden group">
              <div className="p-6 z-10">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4 backdrop-blur-md">
                  <Github className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Professional Profile</h3>
                <p className="text-neutral-400">Showcase your GitHub stats, LeetCode streaks, and tech stack in one unified view.</p>
              </div>
              
              {/* Visual */}
              <div className="relative h-64 mt-4 mx-4 rounded-t-2xl bg-neutral-900/50 border-t border-l border-r border-neutral-800 overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent" />
                <div className="p-4 grid gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-800" />
                    <div className="space-y-2">
                      <div className="w-32 h-2 bg-neutral-800 rounded" />
                      <div className="w-20 h-2 bg-neutral-800 rounded" />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="h-16 flex-1 bg-neutral-800/50 rounded-lg" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Feature 2: Feed */}
          <BentoCard
            className="md:col-span-1 md:row-span-1"
            loading={loading}
            delay={0.1}
          >
            <div className="p-6 h-full flex flex-col relative overflow-hidden group">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-4 backdrop-blur-md">
                <MessageSquare className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Dev Feed</h3>
              <p className="text-neutral-400 text-sm">Connect with developers, share code, and get feedback.</p>
              
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors" />
            </div>
          </BentoCard>

          {/* Feature 3: Groups */}
          <BentoCard
            className="md:col-span-1 md:row-span-1"
            loading={loading}
            delay={0.2}
          >
            <div className="p-6 h-full flex flex-col relative overflow-hidden group">
              <div className="w-10 h-10 rounded-2xl bg-green-500/20 flex items-center justify-center mb-4 backdrop-blur-md">
                <Users className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Communities</h3>
              <p className="text-neutral-400 text-sm">Join topic-based squads and collaborate on projects.</p>
              
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-colors" />
            </div>
          </BentoCard>

          {/* Feature 4: Analytics */}
          <BentoCard
            className="md:col-span-1"
            loading={loading}
            delay={0.3}
          >
             <div className="p-6 h-full flex flex-col relative overflow-hidden group">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-4 backdrop-blur-md">
                <BarChart3 className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Growth Analytics</h3>
              <p className="text-neutral-400 text-sm">Track your coding journey with detailed insights.</p>
            </div>
          </BentoCard>

          {/* Feature 5: Global */}
          <BentoCard
            className="md:col-span-2"
            loading={loading}
            delay={0.4}
          >
             <div className="p-6 h-full flex items-center justify-between relative overflow-hidden group">
              <div className="z-10 max-w-sm">
                <div className="w-10 h-10 rounded-2xl bg-pink-500/20 flex items-center justify-center mb-4 backdrop-blur-md">
                  <Globe className="w-5 h-5 text-pink-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Global Reach</h3>
                <p className="text-neutral-400 text-sm">Connect with developers from top institutes and companies worldwide.</p>
              </div>
              
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-pink-500/10 to-transparent" />
              <div className="hidden md:block relative z-10">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-black bg-neutral-800" />
                  ))}
                </div>
              </div>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}

function BentoCard({ children, className, loading, delay }: { children: React.ReactNode, className?: string, loading: boolean, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className={`relative rounded-3xl overflow-hidden bg-neutral-900/30 border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] ${className}`}
    >
      {loading ? (
        <div className="absolute inset-0 p-6 flex flex-col gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-neutral-800" />
          <div className="h-6 w-2/3 bg-neutral-800 rounded" />
          <div className="h-4 w-full bg-neutral-800 rounded" />
          <div className="h-4 w-5/6 bg-neutral-800 rounded" />
          <div className="flex-1 bg-neutral-800/50 rounded-xl mt-4" />
        </div>
      ) : (
        children
      )}
      
      {/* Glass Reflection Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
    </motion.div>
  );
}
