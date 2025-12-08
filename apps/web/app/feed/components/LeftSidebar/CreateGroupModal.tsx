"use client";
import { useState } from "react";
import { X } from "lucide-react";

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: {
        name: string;
        description?: string;
        privacy: "PUBLIC" | "PRIVATE";
    }) => void;
    isLoading?: boolean;
}

export default function CreateGroupModal({
    isOpen,
    onClose,
    onSubmit,
    isLoading = false,
}: CreateGroupModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [privacy, setPrivacy] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
    const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

    const validateForm = () => {
        const newErrors: { name?: string; description?: string } = {};

        if (name.length < 3) {
            newErrors.name = "Group name must be at least 3 characters";
        } else if (name.length > 50) {
            newErrors.name = "Group name must be less than 50 characters";
        }

        if (description.length > 200) {
            newErrors.description = "Description must be less than 200 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        onSubmit({
            name,
            description: description || undefined,
            privacy,
        });

        // Reset form
        setName("");
        setDescription("");
        setPrivacy("PUBLIC");
        setErrors({});
    };

    const handleClose = () => {
        setName("");
        setDescription("");
        setPrivacy("PUBLIC");
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md max-h-[90vh] flex flex-col bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-800 flex-shrink-0">
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Create a Group</h2>
                    <button
                        onClick={handleClose}
                        className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                        disabled={isLoading}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form - Scrollable */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                    <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
                        {/* Group Name */}
                        <div>
                            <label htmlFor="groupName" className="block text-sm font-medium text-neutral-300 mb-2">
                                Group Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="groupName"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Web Developers"
                                className={`w-full px-4 py-2.5 bg-neutral-800 border ${errors.name ? "border-red-500" : "border-neutral-700"
                                    } rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                disabled={isLoading}
                                maxLength={50}
                            />
                            <div className="flex items-center justify-between mt-1.5">
                                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                <p className="text-xs text-neutral-500 ml-auto">{name.length}/50</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-neutral-300 mb-2">
                                Description <span className="text-neutral-500">(optional)</span>
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What's your group about?"
                                rows={3}
                                className={`w-full px-4 py-2.5 bg-neutral-800 border ${errors.description ? "border-red-500" : "border-neutral-700"
                                    } rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none`}
                                disabled={isLoading}
                                maxLength={200}
                            />
                            <div className="flex items-center justify-between mt-1.5">
                                {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                                <p className="text-xs text-neutral-500 ml-auto">{description.length}/200</p>
                            </div>
                        </div>

                        {/* Privacy */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-3">
                                Privacy <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-2">
                                {/* Public Option */}
                                <label
                                    className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${privacy === "PUBLIC"
                                        ? "bg-blue-500/10 border-blue-500"
                                        : "bg-neutral-800 border-neutral-700 hover:border-neutral-600"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="privacy"
                                        value="PUBLIC"
                                        checked={privacy === "PUBLIC"}
                                        onChange={(e) => setPrivacy(e.target.value as "PUBLIC" | "PRIVATE")}
                                        className="mt-0.5 w-4 h-4 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 bg-neutral-700 border-neutral-600"
                                        disabled={isLoading}
                                    />
                                    <div className="flex-1">
                                        <div className="font-medium text-white">Public</div>
                                        <div className="text-sm text-neutral-400">
                                            Anyone can see and join this group
                                        </div>
                                    </div>
                                </label>

                                {/* Private Option */}
                                <label
                                    className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${privacy === "PRIVATE"
                                        ? "bg-blue-500/10 border-blue-500"
                                        : "bg-neutral-800 border-neutral-700 hover:border-neutral-600"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="privacy"
                                        value="PRIVATE"
                                        checked={privacy === "PRIVATE"}
                                        onChange={(e) => setPrivacy(e.target.value as "PUBLIC" | "PRIVATE")}
                                        className="mt-0.5 w-4 h-4 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 bg-neutral-700 border-neutral-600"
                                        disabled={isLoading}
                                    />
                                    <div className="flex-1">
                                        <div className="font-medium text-white">Private</div>
                                        <div className="text-sm text-neutral-400">
                                            Only members can see posts, join requests need approval
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Actions - Fixed at bottom */}
                    <div className="flex gap-3 p-4 sm:p-6 border-t border-neutral-800 flex-shrink-0">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition-colors"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading || name.length < 3}
                        >
                            {isLoading ? "Creating..." : "Create Group"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
