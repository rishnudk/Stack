import { Star, GitFork, ExternalLink } from "lucide-react";

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
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-all hover:bg-neutral-800/50 group"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors flex items-center gap-2">
          {name}
          <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-500" />
        </h3>
      </div>
      
      <p className="text-sm text-neutral-400 mb-4 line-clamp-2 h-10">
        {description || "No description available"}
      </p>
      
      <div className="flex items-center gap-4 text-xs text-neutral-500">
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
    </a>
  );
}
