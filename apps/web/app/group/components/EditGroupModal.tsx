import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import { trpc } from "@/utils/trpc";

interface EditGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: {
        name: string;
        description?: string;
        privacy: "PUBLIC" | "PRIVATE";
        image?: string;
    }) => void;
    isLoading?: boolean;
    initialData: {
        name: string;
        description?: string | null;
        privacy: "PUBLIC" | "PRIVATE";
        image?: string | null;
    };
}

export default function EditGroupModal({
    isOpen,
    onClose,
    onSubmit,
    isLoading = false,
    initialData,
}: EditGroupModalProps) {
    const [name, setName] = useState(initialData.name);
    const [description, setDescription] = useState(initialData.description || "");
    const [privacy, setPrivacy] = useState<"PUBLIC" | "PRIVATE">(initialData.privacy);
    const [imagePreview, setImagePreview] = useState<string | null>(initialData.image || null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<{ name?: string; description?: string; image?: string }>({});
    const [mounted, setMounted] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadMutation = trpc.upload.uploadFile.useMutation();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Reset when modal opens with new data
    useEffect(() => {
        if (isOpen) {
            setName(initialData.name);
            setDescription(initialData.description || "");
            setPrivacy(initialData.privacy);
            setImagePreview(initialData.image || null);
            setImageFile(null);
            setErrors({});
        }
    }, [isOpen, initialData]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setErrors({ ...errors, image: "Image size should be less than 5MB" });
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setErrors({ ...errors, image: undefined });
            };
            reader.readAsDataURL(file);
        }
    };

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        let imageUrl: string | undefined = initialData.image || undefined;

        // Only upload if a new image file was selected
        if (imageFile && imagePreview) {
            try {
                const result = await uploadMutation.mutateAsync({
                    fileBase64: imagePreview,
                    fileName: `group-cover-${Date.now()}`,
                    folder: "groups",
                    resize: {
                        width: 800,
                        height: 400,
                        crop: "fill"
                    }
                });
                imageUrl = result.fileUrl;
            } catch (error) {
                console.error("Failed to upload image", error);
                setErrors({ ...errors, image: "Failed to upload image. Please try again." });
                return;
            }
        }

        onSubmit({
            name,
            description: description || undefined,
            privacy,
            image: imageUrl,
        });
    };

    const handleClose = () => {
        onClose();
    };

    if (!isOpen || !mounted) return null;

    const isSubmitting = isLoading || uploadMutation.isPending;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md max-h-[90vh] flex flex-col bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-800 flex-shrink-0">
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Edit Group</h2>
                    <button
                        onClick={handleClose}
                        className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                        disabled={isSubmitting}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form - Scrollable */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                    <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1 scrollbar-hide">
                        {/* Group Cover Image */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                                Group Image <span className="text-neutral-500">(optional)</span>
                            </label>
                            
                            <div 
                                className={`relative w-full h-32 rounded-xl border-2 border-dashed ${errors.image ? 'border-red-500 bg-red-500/5' : 'border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800 hover:border-neutral-600'} transition-all flex items-center justify-center overflow-hidden cursor-pointer group`}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {imagePreview ? (
                                    <>
                                        <img src={imagePreview} alt="Group Cover" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">Change Image</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center text-neutral-400">
                                        <ImageIcon size={24} className="mb-2 text-neutral-500" />
                                        <span className="text-sm font-medium">Upload Image</span>
                                        <span className="text-xs text-neutral-500 mt-1">PNG, JPG up to 5MB</span>
                                    </div>
                                )}
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/png, image/jpeg, image/webp" 
                                onChange={handleImageChange}
                                disabled={isSubmitting}
                            />
                            {errors.image && <p className="text-xs text-red-500 mt-1.5">{errors.image}</p>}
                        </div>

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
                                disabled={isSubmitting}
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
                                disabled={isSubmitting}
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
                                        disabled={isSubmitting}
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
                                        disabled={isSubmitting}
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
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            disabled={isSubmitting || name.length < 3}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    {uploadMutation.isPending ? "Uploading..." : "Saving..."}
                                </>
                            ) : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
