"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior Engineer",
    company: "Vercel",
    text: "The best platform for tracking my open source contributions.",
    avatar: "S"
  },
  {
    name: "Alex Rivera",
    role: "Frontend Lead",
    company: "Stripe",
    text: "Finally, a place where I can showcase my real dev impact.",
    avatar: "A"
  },
  {
    name: "Mike Johnson",
    role: "Full Stack",
    company: "Netflix",
    text: "The collaboration features are unmatched. Love the groups.",
    avatar: "M"
  },
  {
    name: "Emily Zhang",
    role: "DevRel",
    company: "Supabase",
    text: "A game changer for building your developer identity.",
    avatar: "E"
  },
  {
    name: "David Kim",
    role: "Founder",
    company: "StartUp",
    text: "Found my co-founder here. The community is amazing.",
    avatar: "D"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-[#000000] border-t border-[#ffffff0a] overflow-hidden">
      <div className="mb-12 text-center">
        <h2 className="text-2xl font-bold text-white">Trusted by builders</h2>
      </div>
      
      <div className="relative flex overflow-x-hidden group">
        <div className="flex animate-scroll hover:pause gap-6 px-6">
          {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[300px] p-6 rounded-xl bg-[#050505] border border-[#ffffff0a] hover:border-[#ffffff1f] transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#ffffff0a] flex items-center justify-center text-white font-bold border border-[#ffffff0a]">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white font-medium text-sm">{t.name}</div>
                  <div className="text-[#9A9A9A] text-xs">{t.role} @ {t.company}</div>
                </div>
              </div>
              <p className="text-[#CCCCCC] text-sm leading-relaxed">"{t.text}"</p>
            </div>
          ))}
        </div>
        
        {/* Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#000000] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#000000] to-transparent z-10" />
      </div>
    </section>
  );
}
