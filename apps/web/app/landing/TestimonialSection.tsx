"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        name: "Alex Chen",
        role: "Senior Frontend Engineer",
        company: "Vercel",
        avatar: "AC",
        content:
            "Stack completely changed how I showcase my work. My profile has gotten me two job offers in the past month alone.",
        stars: 5,
    },
    {
        name: "Priya Sharma",
        role: "Full Stack Developer",
        company: "Stripe",
        avatar: "PS",
        content:
            "The open-source discovery feature is incredible. I've found so many projects to contribute to and grown my network massively.",
        stars: 5,
    },
    {
        name: "Marcus Johnson",
        role: "DevOps Engineer",
        company: "GitHub",
        avatar: "MJ",
        content:
            "Finally a platform that understands developers. The groups feature helped me find collaborators for my side project.",
        stars: 5,
    },
    {
        name: "Sarah Kim",
        role: "React Developer",
        company: "Shopify",
        avatar: "SK",
        content:
            "I landed my dream job through Stack's job board. The quality of opportunities here is unmatched.",
        stars: 5,
    },
    {
        name: "David Park",
        role: "Backend Engineer",
        company: "Notion",
        avatar: "DP",
        content:
            "The learning paths are structured perfectly. I went from junior to senior in 18 months following Stack's roadmaps.",
        stars: 5,
    },
    {
        name: "Emma Wilson",
        role: "Mobile Developer",
        company: "Linear",
        avatar: "EW",
        content:
            "Stack is the LinkedIn for developers, but actually good. The community here is supportive and genuinely helpful.",
        stars: 5,
    },
];

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
    }),
};

export const TestimonialSection = () => {
    return (
        <section id="testimonials" className="relative py-24 bg-black overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(255,255,255,0.03),transparent)]" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-400 mb-4">
                        <Quote className="w-3 h-3" />
                        What developers say
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                        Loved by developers{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-600">
                            worldwide
                        </span>
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-xl mx-auto">
                        Join thousands of developers who&apos;ve already leveled up their careers with Stack.
                    </p>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={t.name}
                            custom={i}
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300"
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {Array.from({ length: t.stars }).map((_, j) => (
                                    <Star key={j} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-zinc-300 text-sm leading-relaxed mb-6">&ldquo;{t.content}&rdquo;</p>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 flex items-center justify-center text-xs font-bold text-white border border-white/10">
                                    {t.avatar}
                                </div>
                                <div>
                                    <div className="text-white text-sm font-medium">{t.name}</div>
                                    <div className="text-zinc-500 text-xs">
                                        {t.role} · {t.company}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};