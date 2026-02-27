import React from "react";

interface BasicInfoSectionProps {
    formData: {
        name: string;
        headline: string;
        bio: string;
        location: string;
        company: string;
    };
    setFormData: (data: any) => void;
    isOnboarding?: boolean;
}

export function BasicInfoSection({ formData, setFormData, isOnboarding }: BasicInfoSectionProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Basic Information</h3>

            <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Name</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Your name"
                    required={isOnboarding}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Headline</label>
                <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Full Stack Developer | React Enthusiast"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Bio</label>
                <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    placeholder="Tell us about yourself..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Location</label>
                    <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="City, Country"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Company</label>
                    <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Company name"
                    />
                </div>
            </div>
        </div>
    );
}
