"use client";

import { Star, ExternalLink, Share2 } from "lucide-react";
import { useState } from "react";
import { ShareProjectModal } from "./ShareProjectModal";

interface ProjectCardProps {
  name: string;
  description: string;
  url: string;
  stargazerCount: number;
  language?: {
    name: string;
    color: string;
  } | null;
}

export function ProjectCard({ name, description, url, stargazerCount, language }: ProjectCardProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  return (
    <>
      <div className="block p-4 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-all hover:bg-neutral-800/50 group flex flex-col h-full relative overflow-hidden">
        
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsShareModalOpen(true);
          }}
          className="absolute top-3 right-3 p-2 bg-neutral-900/80 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors z-10 backdrop-blur-sm opacity-0 group-hover:opacity-100 border border-neutral-800"
          title="Share Project"
        >
          <Share2 size={16} />
        </button>

        <div className="flex items-start justify-between mb-2 pr-8">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors flex items-center gap-2"
          >
            {name}
            <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-500" />
          </a>
        </div>
        
        <p className="text-sm text-neutral-400 mb-4 line-clamp-2 flex-grow">
          {description || "No description available"}
        </p>
        
        <div className="flex items-center gap-4 text-xs text-neutral-500 mt-auto">
          {language && (
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: language.color }}
              />
              <span>{language.name}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <Star size={14} />
            <span>{stargazerCount}</span>
          </div>
        </div>
      </div>

      <ShareProjectModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        project={{ name, description, url }} 
      />
    </>
  );
}
