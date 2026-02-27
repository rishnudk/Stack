import React from "react";
import { X, Upload } from "lucide-react";

interface CoverPhotoSectionProps {
    coverPreview: string;
    coverType: "upload" | "gradient";
    setCoverType: (type: "upload" | "gradient") => void;
    selectedGradient: string;
    setSelectedGradient: (gradient: string) => void;
    handleCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeCover: () => void;
}

const GRADIENTS = [
    { name: "Purple Pink", value: "from-blue-600 via-purple-600 to-pink-600" },
    { name: "Ocean", value: "from-cyan-500 via-blue-500 to-purple-600" },
    { name: "Sunset", value: "from-orange-500 via-red-500 to-pink-600" },
    { name: "Forest", value: "from-green-500 via-emerald-500 to-teal-600" },
    { name: "Fire", value: "from-yellow-500 via-orange-500 to-red-600" },
    { name: "Night", value: "from-indigo-600 via-purple-600 to-pink-600" },
];

export function CoverPhotoSection({
    coverPreview,
    coverType,
    setCoverType,
    selectedGradient,
    setSelectedGradient,
    handleCoverChange,
    removeCover,
}: CoverPhotoSectionProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Cover Photo</label>
            <div className="space-y-3">
                <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-neutral-700">
                    {coverType === "upload" && coverPreview ? (
                        <>
                            <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={removeCover}
                                className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                            >
                                <X size={14} className="text-white" />
                            </button>
                        </>
                    ) : (
                        <div className={`w-full h-full bg-gradient-to-r ${selectedGradient}`} />
                    )}
                </div>

                <div className="flex gap-2 border-b border-neutral-700">
                    {["gradient", "upload"].map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setCoverType(type as any)}
                            className={`px-4 py-2 font-medium transition-colors capitalize ${coverType === type ? "text-blue-400 border-b-2 border-blue-400" : "text-neutral-400 hover:text-neutral-300"
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {coverType === "gradient" ? (
                    <div className="grid grid-cols-3 gap-2">
                        {GRADIENTS.map((g) => (
                            <button
                                key={g.value}
                                type="button"
                                onClick={() => setSelectedGradient(g.value)}
                                className={`h-16 rounded-lg bg-gradient-to-r ${g.value} transition-all ${selectedGradient === g.value ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-neutral-900" : "hover:scale-105"
                                    }`}
                                title={g.name}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <label className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-center gap-2 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-colors">
                                <Upload size={18} className="text-neutral-400" />
                                <span className="text-sm font-medium text-neutral-300">Choose Cover Image</span>
                            </div>
                            <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                        </label>
                    </div>
                )}
                <p className="text-xs text-neutral-500">Recommended: 1500x500px or 3:1 aspect ratio</p>
            </div>
        </div>
    );
}
