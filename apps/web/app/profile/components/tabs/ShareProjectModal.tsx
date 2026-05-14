"use client";

import { useState } from "react";
import { X, Send } from "lucide-react";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ShareProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    name: string;
    description: string;
    url: string;
  };
}

export function ShareProjectModal({ isOpen, onClose, project }: ShareProjectModalProps) {
  const [description, setDescription] = useState("");
  const router = useRouter();

  const createPost = trpc.posts.createPost.useMutation({
    onSuccess: () => {
      toast.success("Project shared successfully!");
      onClose();
      setDescription("");
      router.push("/feed");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to share project");
    },
  });

  if (!isOpen) return null;

  const handleShare = () => {
    let postContent = description;
    if (description.trim().length > 0) {
        postContent += "\n\n";
    }
    postContent += `Check out my project: ${project.name}`;
    if (project.description) {
        postContent += `\n${project.description}`;
    }
    if (project.url) {
        postContent += `\n${project.url}`;
    }

    createPost.mutate({
      content: postContent,
      images: [],
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <h3 className="text-lg font-semibold text-white">Share Project</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Add a description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell your network about this project..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 min-h-[100px] resize-none"
            />
          </div>
          
          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3">
            <h4 className="text-white font-medium text-sm mb-1">{project.name}</h4>
            <p className="text-neutral-400 text-xs line-clamp-2">{project.description}</p>
            {project.url && (
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs mt-2 block truncate hover:underline">
                  {project.url}
                </a>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t border-neutral-800 bg-neutral-900/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleShare}
            disabled={createPost.isPending}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createPost.isPending ? (
              "Sharing..."
            ) : (
              <>
                <Send size={16} />
                Share to Feed
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
