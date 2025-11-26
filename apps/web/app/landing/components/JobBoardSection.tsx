"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";

export default function JobBoardSection() {
  const jobs = [
    {
      role: "Senior Frontend Engineer",
      company: "Vercel",
      location: "Remote",
      type: "Full-time",
      stack: ["React", "Next.js", "TypeScript"],
      logo: "▲"
    },
    {
      role: "Backend Developer",
      company: "Stripe",
      location: "San Francisco, CA",
      type: "Hybrid",
      stack: ["Go", "PostgreSQL", "Redis"],
      logo: "S"
    },
    {
      role: "DevOps Engineer",
      company: "Netflix",
      location: "Los Gatos, CA",
      type: "On-site",
      stack: ["AWS", "Kubernetes", "Python"],
      logo: "N"
    }
  ];

  return (
    <section className="py-24 bg-neutral-950 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-4"
          >
            Find Your Next <span className="text-blue-500">Challenge</span>
          </motion.h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Discover opportunities at top tech companies that match your skills and interests.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {jobs.map((job, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group bg-neutral-900/30 border border-neutral-800 rounded-xl p-6 hover:bg-neutral-900 hover:border-neutral-700 transition-all cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white text-black flex items-center justify-center text-xl font-bold">
                    {job.logo}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{job.role}</h3>
                    <div className="text-neutral-400 font-medium mb-2">{job.company}</div>
                    <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {job.type}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4">
                  <div className="flex gap-2">
                    {job.stack.map(tech => (
                      <span key={tech} className="px-3 py-1 rounded-full bg-neutral-800 text-neutral-300 text-xs font-medium border border-neutral-700">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <button className="text-blue-500 font-medium text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Apply Now <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-neutral-900 text-white rounded-full font-semibold border border-neutral-800 hover:bg-neutral-800 transition-all">
            View All Jobs
          </button>
        </div>
      </div>
    </section>
  );
}
