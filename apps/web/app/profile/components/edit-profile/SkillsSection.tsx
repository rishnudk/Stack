import React from "react";
import { Plus, X } from "lucide-react";

interface SkillsSectionProps {
    skills: string[];
    newSkill: string;
    setNewSkill: (skill: string) => void;
    addSkill: () => void;
    removeSkill: (skill: string) => void;
    leetcodeUsername: string;
    setLeetcodeUsername: (username: string) => void;
    githubUsername: string;
    setGithubUsername: (username: string) => void;
}

export function SkillsSection({
    skills,
    newSkill,
    setNewSkill,
    addSkill,
    removeSkill,
    leetcodeUsername,
    setLeetcodeUsername,
    githubUsername,
    setGithubUsername,
}: SkillsSectionProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Developer Profiles</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">LeetCode Username</label>
                        <input
                            type="text"
                            value={leetcodeUsername}
                            onChange={(e) => setLeetcodeUsername(e.target.value)}
                            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
                            placeholder="username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">GitHub Username</label>
                        <input
                            type="text"
                            value={githubUsername}
                            onChange={(e) => setGithubUsername(e.target.value)}
                            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="username"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Skills</h3>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                        className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Add a skill (e.g., React, Node.js)"
                    />
                    <button
                        type="button"
                        onClick={addSkill}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} /> Add
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                        <div key={skill} className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm font-medium border border-blue-600/30 flex items-center gap-2">
                            {skill}
                            <button type="button" onClick={() => removeSkill(skill)} className="hover:text-blue-300">
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
