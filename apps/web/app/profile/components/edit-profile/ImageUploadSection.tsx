import React from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";

interface ImageUploadSectionProps {
    imagePreview: string;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeImage: () => void;
}

export function ImageUploadSection({ imagePreview, handleImageChange, removeImage }: ImageUploadSectionProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Profile Image</label>
            <div className="space-y-3">
                {imagePreview ? (
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-neutral-700">
                        <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-1 right-1 p-1.5 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                        >
                            <X size={14} className="text-white" />
                        </button>
                    </div>
                ) : (
                    <div className="w-32 h-32 rounded-full bg-neutral-800 flex items-center justify-center border-2 border-dashed border-neutral-700">
                        <ImageIcon size={32} className="text-neutral-500" />
                    </div>
                )}
                <div className="flex gap-2">
                    <label className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-center gap-2 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-colors">
                            <Upload size={18} className="text-neutral-400" />
                            <span className="text-sm font-medium text-neutral-300">Choose Image</span>
                        </div>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                </div>
                <p className="text-xs text-neutral-500">Recommended: Square image, at least 400x400px</p>
            </div>
        </div>
    );
}
