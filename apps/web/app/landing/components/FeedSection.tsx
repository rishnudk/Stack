"use client";

import { motion } from "framer-motion";
import { Heart, MessageSquare, Share2, MoreHorizontal } from "lucide-react";

export default function FeedSection() {
  const posts = [
    {
      id: 1,
      author: "Sarah Chen",
      handle: "@sarah_dev",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      content: "Just shipped the new API rate limiter! 🚀 Reduced latency by 40%. Here's a snippet of the sliding window implementation:",
      code: `class RateLimiter {
  constructor(windowSize, maxRequests) {
    this.windowSize = windowSize;
    this.maxRequests = maxRequests;
    this.requests = new Map();
  }
}`,
      likes: 124,
      comments: 18,
      tags: ["#SystemDesign", "#Backend", "#Performance"]
    },
    {
      id: 2,
      author: "David Miller",
      handle: "@dmiller",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      content: "Finally wrapped my head around Next.js 14 Server Actions. The DX is incredible compared to traditional API routes. Who else is using it in prod?",
      likes: 89,
      comments: 32,
      tags: ["#NextJS", "#React", "#WebDev"]
    }
  ];

  return (
    <section className="py-24 bg-neutral-950 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              A Feed Built for <br />
              <span className="text-blue-500">Developers</span>
            </h2>
            <p className="text-neutral-400 text-lg mb-8 leading-relaxed">
              Connect with a community that speaks your language. Share code snippets, discuss architecture, and celebrate shipping.
            </p>
            
            <ul className="space-y-4">
              {[
                "Syntax highlighting for code blocks",
                "Markdown support for rich text",
                "GitHub repository previews",
                "Tech-focused trending tags"
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 text-neutral-300"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <div className="space-y-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="bg-black border border-neutral-800 rounded-xl p-6 shadow-xl hover:border-neutral-700 transition-all"
              >
                <div className="flex gap-4">
                  <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-full bg-neutral-800" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-white">{post.author}</h3>
                        <p className="text-neutral-500 text-sm">{post.handle}</p>
                      </div>
                      <MoreHorizontal className="text-neutral-500 w-5 h-5" />
                    </div>
                    
                    <p className="text-neutral-300 mt-2 mb-3">{post.content}</p>
                    
                    {post.code && (
                      <div className="bg-neutral-900 rounded-lg p-4 font-mono text-sm text-blue-300 overflow-x-auto mb-4 border border-neutral-800">
                        <pre>{post.code}</pre>
                      </div>
                    )}

                    <div className="flex gap-2 mb-4">
                      {post.tags.map(tag => (
                        <span key={tag} className="text-blue-500 text-sm hover:underline cursor-pointer">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-neutral-500 pt-4 border-t border-neutral-900">
                      <button className="flex items-center gap-2 hover:text-red-500 transition-colors group">
                        <Heart className="w-5 h-5 group-hover:fill-red-500" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                        <MessageSquare className="w-5 h-5" />
                        <span>{post.comments}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
