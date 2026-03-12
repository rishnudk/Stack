"use client";

import { useState, useRef, useEffect } from "react";
import { X, Upload, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";

interface AddProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    project?: any;
}

export function AddProjectModal({ isOpen, onClose, project }: AddProjectModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        openToContributions: false,
        liveLink: "",
        githubLink: "",
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const utils = trpc.useUtils();
    const getPresignedUrlMutation = trpc.upload.getPresignedUrl.useMutation();
    const createProjectMutation = trpc.projects.createProject.useMutation({
        onSuccess: () => {
            toast.success("Project created successfully!");
            utils.projects.getProjects.invalidate();
            utils.projects.getProjectsByUserId.invalidate();
            onClose();
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create project");
        }
    });
    const editProjectMutation = trpc.projects.editProject.useMutation({
        onSuccess: () => {
            toast.success("Project edited successfully!");
            utils.projects.getProjects.invalidate();
            utils.projects.getProjectsByUserId.invalidate();
            onClose();
        },
        onError: (error) => {
            toast.error(error.message || "Failed to edit project");
        }
    });


    useEffect(() => {
  if (project) {
    setFormData({
      name: project.name || "",
      description: project.description || "",
      openToContributions: project.openToContributions || false,
      liveLink: project.liveLink || "",
      githubLink: project.githubLink || "",
    });

    if (project.imageUrl) {
      setImagePreview(project.imageUrl);
    }
  }
}, [project]);

    const isSubmitting = getPresignedUrlMutation.isPending || createProjectMutation.isPending;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (100KB - 1MB)
        const minSize = 100 * 1024; // 100 KB
        const maxSize = 1 * 1024 * 1024; // 1 MB

        if (file.size < minSize || file.size > maxSize) {
            toast.error("Image size must be between 100KB and 1MB.");
            // Reset input so they can try again with the same file if they resize it
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file.");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async () => {
        if (!formData.name.trim() || !formData.description.trim()) {
            toast.error("Project name and description are required.");
            return;
        }

        try {
            let imageUrl: string | undefined = undefined;

            if (imageFile) {
                const { uploadUrl, fileUrl } = await getPresignedUrlMutation.mutateAsync({
                    fileType: imageFile.type,
                    fileName: imageFile.name,
                });

                const uploadResponse = await fetch(uploadUrl, {
                    method: "PUT",
                    body: imageFile,
                    headers: { "Content-Type": imageFile.type },
                });

                if (!uploadResponse.ok) throw new Error("Failed to upload project image.");
                imageUrl = fileUrl;
            }

            if (project) {
                //edit project
                await editProjectMutation.mutateAsync({
                    ...formData,
                    imageUrl,
                    id: project.id,
                });
            } else {
                //create project
                await createProjectMutation.mutateAsync({
                    ...formData,
                    imageUrl,
                });

            }

            // Clear form
            setFormData({
                name: "",
                description: "",
                openToContributions: false,
                liveLink: "",
                githubLink: "",
            });
            setImageFile(null);
            setImagePreview(null);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to save project");
        }
    };

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
                        <h2 className="text-lg font-semibold text-white">
                            {project ? "Edit Project" : "Add Project"}
                        </h2>
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
                                <div
                                    className="relative border-2 border-dashed border-neutral-700 hover:border-neutral-500 rounded-lg h-32 flex flex-col items-center justify-center text-neutral-400 cursor-pointer transition-colors bg-neutral-900/50 overflow-hidden"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {imagePreview ? (
                                        <>
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={handleRemoveImage}
                                                    type="button"
                                                    className="p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
                                                >
                                                    <X size={20} />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={24} className="mb-2" />
                                            <span className="text-xs font-medium">Click to upload</span>
                                            <span className="text-[10px] text-neutral-500 mt-1">100KB to 1MB limit</span>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
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
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Project"
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
