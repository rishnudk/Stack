"use client";

import { motion } from "framer-motion";
import { Code2, Users, GitBranch, Briefcase, BookOpen, Star } from "lucide-react";

const features = [
    {
        icon: Code2,
        title: "Portfolio Showcase",
        description: "Display your projects, contributions, and skills in a beautiful developer profile.",
        span: "col-span-1 row-span-1",
        gradient: "from-blue-500/10 to-transparent",
    },
    {
        icon: Users,
        title: "Developer Groups",
        description: "Join communities of like-minded developers. Collaborate, share, and grow together.",
        span: "col-span-1 row-span-1",
        gradient: "from-purple-500/10 to-transparent",
    },
    {
        icon: GitBranch,
        title: "Open Source",
        description: "Discover and contribute to open-source projects. Track your impact across the ecosystem.",
        span: "col-span-2 row-span-1",
        gradient: "from-green-500/10 to-transparent",
    },
    {
        icon: Briefcase,
        title: "Job Board",
        description: "Find your next role or hire top developer talent — all within the Stack ecosystem.",
        span: "col-span-1 row-span-1",
        gradient: "from-orange-500/10 to-transparent",
    },
    {
        icon: BookOpen,
        title: "Learning Paths",
        description: "Structured roadmaps and resources to level up your skills at your own pace.",
        span: "col-span-1 row-span-1",
        gradient: "from-pink-500/10 to-transparent",
    },
];

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
    }),
};

export const LandingPageGrid = () => {
    return (
        <section id="features" className="relative py-24 bg-black">
            {/* Section header */}
            <div className="container mx-auto px-4 mb-16 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-400 mb-4">
                        <Star className="w-3 h-3" />
                        Everything you need
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                        Built for developers,{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-600">
                            by developers
                        </span>
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-xl mx-auto">
                        Every feature designed to help you grow your career and build meaningful connections.
                    </p>
                </motion.div>
            </div>

            {/* Bento grid */}
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[180px]">
                    {features.map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={feature.title}
                                custom={i}
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className={`relative group rounded-2xl border border-white/10 bg-white/[0.02] p-6 overflow-hidden hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300 ${feature.span}`}
                            >
                                {/* Gradient bg */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:bg-white/15 transition-colors">
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                                    <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};