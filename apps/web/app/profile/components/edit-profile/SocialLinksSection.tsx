import React from "react";
import { Plus, Trash2 } from "lucide-react";

interface SocialLinksSectionProps {
    socialLinks: Record<string, string>;
    newSocialKey: string;
    setNewSocialKey: (key: string) => void;
    newSocialValue: string;
    setNewSocialValue: (value: string) => void;
    addSocialLink: () => void;
    removeSocialLink: (key: string) => void;
}

export function SocialLinksSection({
    socialLinks,
    newSocialKey,
    setNewSocialKey,
    newSocialValue,
    setNewSocialValue,
    addSocialLink,
    removeSocialLink,
}: SocialLinksSectionProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Social Links</h3>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newSocialKey}
                    onChange={(e) => setNewSocialKey(e.target.value)}
                    className="w-1/3 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Platform"
                />
                <input
                    type="url"
                    value={newSocialValue}
                    onChange={(e) => setNewSocialValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSocialLink())}
                    className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="URL"
                />
                <button
                    type="button"
                    onClick={addSocialLink}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    <Plus size={16} /> Add
                </button>
            </div>
            <div className="space-y-2">
                {Object.entries(socialLinks).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
                        <div className="flex-1">
                            <div className="text-sm font-medium text-white capitalize">{key}</div>
                            <div className="text-xs text-neutral-400 truncate">{value}</div>
                        </div>
                        <button type="button" onClick={() => removeSocialLink(key)} className="p-2 hover:bg-neutral-700 rounded-lg transition-colors">
                            <Trash2 size={16} className="text-red-400" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
