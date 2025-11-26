"use client";

import { motion } from "framer-motion";
import { Users, MessageCircle, Hash, Calendar } from "lucide-react";

export default function GroupsSection() {
  const groups = [
    {
      name: "Next.js Builders",
      members: "12.5k",
      active: "1.2k",
      color: "from-black to-neutral-900",
      border: "border-neutral-800",
      icon: "▲"
    },
    {
      name: "AI Hackers",
      members: "8.2k",
      active: "900",
      color: "from-blue-900/20 to-black",
      border: "border-blue-500/30",
      icon: "🤖"
    },
    {
      name: "Rustaceans",
      members: "5.4k",
      active: "600",
      color: "from-orange-900/20 to-black",
      border: "border-orange-500/30",
      icon: "🦀"
    }
  ];

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-4"
          >
            Find Your <span className="text-blue-500">Squad</span>
          </motion.h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Join topic-based groups, chat in real-time, and collaborate on shared projects.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Groups List */}
          <div className="space-y-4">
            {groups.map((group, index) => (
              <motion.div
                key={group.name}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 10 }}
                className={`p-6 rounded-2xl bg-gradient-to-r ${group.color} border ${group.border} flex items-center justify-between cursor-pointer group`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center text-2xl shadow-inner">
                    {group.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{group.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" /> {group.members}
                      </span>
                      <span className="flex items-center gap-1 text-green-500">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        {group.active} online
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-2 rounded-full bg-neutral-800/50 text-neutral-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <MessageCircle className="w-5 h-5" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Chat Interface Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
            <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
              {/* Chat Header */}
              <div className="p-4 border-b border-neutral-800 bg-neutral-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold">#</div>
                  <div>
                    <div className="font-bold text-white">general</div>
                    <div className="text-xs text-neutral-500">Next.js Builders</div>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-neutral-700 border-2 border-neutral-900" />
                  ))}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-4 space-y-4 h-[300px] overflow-hidden relative">
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-neutral-900 to-transparent z-10" />
                
                {[
                  { user: "Alex", msg: "Has anyone tried the new App Router?", time: "10:42 AM", color: "text-blue-400" },
                  { user: "Sarah", msg: "Yes! It's a game changer for server components.", time: "10:45 AM", color: "text-purple-400" },
                  { user: "Mike", msg: "I'm struggling with the caching strategy though.", time: "10:48 AM", color: "text-green-400" },
                  { user: "Alex", msg: "Check out the docs on revalidation, it helped me a lot.", time: "10:50 AM", color: "text-blue-400" },
                ].map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="flex gap-3"
                  >
                    <div className={`w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-xs ${msg.color}`}>
                      {msg.user[0]}
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className={`font-bold text-sm ${msg.color}`}>{msg.user}</span>
                        <span className="text-[10px] text-neutral-600">{msg.time}</span>
                      </div>
                      <p className="text-neutral-300 text-sm">{msg.msg}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-neutral-900 border-t border-neutral-800">
                <div className="bg-neutral-800/50 rounded-lg p-3 flex items-center gap-3 text-neutral-500 text-sm">
                  <Hash className="w-4 h-4" />
                  <span>Message #general...</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
