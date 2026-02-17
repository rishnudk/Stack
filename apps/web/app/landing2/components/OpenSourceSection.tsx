"use client";

import { motion } from "framer-motion";
import { GitFork, Star, CircleDot, ArrowRight } from "lucide-react";

export default function OpenSourceSection() {
  const projects = [
    {
      name: "stack-ui",
      description: "A modern, accessible component library for React applications.",
      stars: "12.5k",
      forks: "2.1k",
      issues: "45",
      language: "TypeScript",
      color: "bg-blue-500"
    },
    {
      name: "dev-tools-cli",
      description: "Command line interface for developer productivity and workflow automation.",
      stars: "8.9k",
      forks: "1.2k",
      issues: "12",
      language: "Rust",
      color: "bg-orange-500"
    },
    {
      name: "ai-copilot",
      description: "Open source AI coding assistant plugin for VS Code.",
      stars: "15.2k",
      forks: "3.4k",
      issues: "89",
      language: "Python",
      color: "bg-yellow-500"
    }
  ];

  return (
    <section className="py-24 bg-black relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold text-white mb-4"
            >
              Open Source <span className="text-blue-500">Collaboration</span>
            </motion.h2>
            <p className="text-neutral-400 max-w-xl">
              Discover projects, contribute code, and make your mark on the open source community.
            </p>
          </div>
          <button className="px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-neutral-200 transition-colors flex items-center gap-2">
            Explore Projects <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, rotateX: 5, rotateY: 5 }}
              className="group bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-all perspective-1000"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-neutral-800 rounded-lg">
                    <GitFork className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-lg">{project.name}</h3>
                </div>
                <span className="bg-green-500/10 text-green-400 text-xs font-medium px-2 py-1 rounded-full border border-green-500/20">
                  Contributors Needed
                </span>
              </div>

              <p className="text-neutral-400 mb-6 min-h-[3rem]">{project.description}</p>

              <div className="flex items-center gap-6 text-sm text-neutral-500 mb-6">
                <div className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
                  <Star className="w-4 h-4" /> {project.stars}
                </div>
                <div className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                  <GitFork className="w-4 h-4" /> {project.forks}
                </div>
                <div className="flex items-center gap-1 hover:text-red-400 transition-colors">
                  <CircleDot className="w-4 h-4" /> {project.issues} issues
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${project.color}`} />
                  <span className="text-sm text-neutral-400">{project.language}</span>
                </div>
                <button className="text-sm font-medium text-white hover:text-blue-400 transition-colors">
                  View Repo →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
