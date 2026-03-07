"use client";

import { useState } from "react";
import { X, Upload, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddProjectModal({ isOpen, onClose }: AddProjectModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        openToContributions: false,
        liveLink: "",
        githubLink: "",
    });

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="relative w-full max-w-md bg-[#111] border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
                        <h2 className="text-lg font-semibold text-white">Add Project</h2>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="p-4 overflow-y-auto max-h-[70vh] custom-scrollbar">
                        <div className="space-y-4">

                            {/* Image Upload Placeholder */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Project Image</label>
                                <div className="border-2 border-dashed border-neutral-700 hover:border-neutral-500 rounded-lg p-6 flex flex-col items-center justify-center text-neutral-400 cursor-pointer transition-colors bg-neutral-900/50">
                                    <Upload size={20} className="mb-2" />
                                    <span className="text-xs font-medium">Click to upload</span>
                                </div>
                            </div>

                            {/* Project Name */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Project Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Portfolio Website"
                                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Description</label>
                                <textarea
                                    placeholder="Briefly describe your project..."
                                    rows={3}
                                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            {/* Open to Contributions Toggle */}
                            <div className="flex items-center justify-between py-1">
                                <div>
                                    <label className="block text-sm font-medium text-white">Open to Contributions</label>
                                    <span className="text-xs text-neutral-500">Allow others to contribute to this project</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, openToContributions: !formData.openToContributions })}
                                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none transition-colors duration-200 ease-in-out ${formData.openToContributions ? 'bg-green-500' : 'bg-neutral-700'
                                        }`}
                                >
                                    <span className="sr-only">Open to contributions</span>
                                    <span
                                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.openToContributions ? 'translate-x-2' : '-translate-x-2'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Live Link */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Live Link (Optional)</label>
                                <input
                                    type="url"
                                    placeholder="https://..."
                                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600"
                                    value={formData.liveLink}
                                    onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                                />
                            </div>

                            {/* GitHub Link */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">GitHub Repository</label>
                                <input
                                    type="url"
                                    placeholder="https://github.com/..."
                                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600"
                                    value={formData.githubLink}
                                    onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-neutral-800 bg-black/40">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors"
                        >
                            Save Project
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
