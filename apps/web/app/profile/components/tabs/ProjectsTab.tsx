"use client";

import { useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { AddProjectModal } from "./AddProjectModal";
import { ListProject } from "../ListProject";
import { Plus, Github } from "lucide-react";
import ContributionGraph from "./ContributionGraph";

type ContributionDay = {
    date: string;
    count: number;
};

interface ProjectsTabProps {
    repos: any[];
    loading: boolean;
    contributions: ContributionDay[];
    contributionsLoading: boolean;
    isOwnProfile?: boolean;
    userId: string;
}

export function ProjectsTab({
    repos,
    loading,
    contributions,
    contributionsLoading,
    isOwnProfile,
    userId,
}: ProjectsTabProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-8">
            {/* Portfolio Projects Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">Portfolio Projects</h3>
                    {isOwnProfile && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg transition-colors text-sm font-medium border border-neutral-800"
                        >
                            <Plus size={16} />
                            Add Project
                        </button>
                    )}
                </div>
                <ListProject userId={userId} />
            </div>

            {/* GitHub Pinned Repositories Section */}
            <div className="space-y-4 pt-4 border-t border-neutral-800/50">
                <div className="flex items-center gap-2 mb-4">
                    <Github className="text-neutral-400" size={24} />
                    <h3 className="text-xl font-bold text-white">Pinned Repositories</h3>
                </div>

                {loading ? (
                    <div className="p-8 text-neutral-500">Loading GitHub repos...</div>
                ) : !repos?.length ? (
                    <div className="p-8 text-center text-neutral-500 bg-neutral-900/50 rounded-xl border border-neutral-800/50">
                        No pinned repositories found.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {repos.map((repo) => (
                            <ProjectCard
                                key={repo.name}
                                name={repo.name}
                                description={repo.description}
                                url={repo.url}
                                stargazerCount={repo.stargazerCount}
                                language={repo.primaryLanguage}
                            />
                        ))}
                    </div>
                )}
            </div>

            <AddProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            {/* Contribution Graph */}
            <div className="space-y-4 pt-4 border-t border-neutral-800/50">
                <div className="flex items-center gap-2 mb-4">
                    <Github className="text-neutral-400" size={24} />
                    <h3 className="text-xl font-bold text-white">Contribution Graph</h3>
                </div>

                {contributionsLoading ? (
                    <div className="p-8 text-neutral-500">Loading contribution graph...</div>
                ) : !contributions?.length ? (
                    <div className="p-8 text-center text-neutral-500 bg-neutral-900/50 rounded-xl border border-neutral-800/50">
                        No contribution graph found.
                    </div>
                ) : (
                    <div className="rounded-xl border border-neutral-800/50 bg-neutral-900/50 p-4 overflow-x-auto">
                        <ContributionGraph contributions={contributions} />
                    </div>
                )}
            </div>
        </div>
    );
}
