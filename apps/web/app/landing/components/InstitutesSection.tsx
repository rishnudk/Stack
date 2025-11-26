"use client";

import { motion } from "framer-motion";
import { GraduationCap, Building2, Users2, ArrowUpRight } from "lucide-react";

export default function InstitutesSection() {
  return (
    <section className="py-24 bg-neutral-950 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold text-white mb-4"
            >
              Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Communities</span>
            </motion.h2>
            <p className="text-neutral-400 max-w-xl">
              Connect with verified institutes, alumni networks, and student developer groups.
            </p>
          </div>
          <button className="text-white border border-neutral-700 px-6 py-3 rounded-full hover:bg-neutral-800 transition-colors flex items-center gap-2">
            View All Institutes <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "MIT", sub: "Computer Science & AI", members: "4.5k", color: "border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.1)]" },
            { name: "Stanford", sub: "Stanford Devs", members: "3.8k", color: "border-red-900/50 shadow-[0_0_30px_rgba(127,29,29,0.1)]" },
            { name: "IIT Bombay", sub: "Coding Club", members: "5.2k", color: "border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.1)]" },
          ].map((institute, index) => (
            <motion.div
              key={institute.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={`relative group p-8 rounded-2xl bg-neutral-900/50 border ${institute.color} backdrop-blur-sm overflow-hidden`}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Building2 className="w-32 h-32" />
              </div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center mb-6 text-2xl font-bold text-white">
                  {institute.name[0]}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-1">{institute.name}</h3>
                <p className="text-neutral-400 mb-6">{institute.sub}</p>
                
                <div className="flex items-center gap-4 text-sm font-medium">
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Users2 className="w-4 h-4" />
                    {institute.members} Members
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Verified
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-800 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0">
                  <span className="text-white text-sm">View Projects</span>
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
