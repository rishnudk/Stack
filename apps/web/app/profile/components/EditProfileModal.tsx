"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { X, Plus, Trash2 } from "lucide-react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    name?: string;
    bio?: string;
    location?: string;
    company?: string;
    headline?: string;
    avatarUrl?: string;
    leetcodeUsername?: string;
    githubUsername?: string;
    skills?: string[];
    socialLinks?: Record<string, string>;
  };
}

export function EditProfileModal({ isOpen, onClose, currentUser }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: currentUser.name || "",
    bio: currentUser.bio || "",
    location: currentUser.location || "",
    company: currentUser.company || "",
    headline: currentUser.headline || "",
    avatarUrl: currentUser.avatarUrl || "",
    leetcodeUsername: currentUser.leetcodeUsername || "",
    githubUsername: currentUser.githubUsername || "",
    skills: currentUser.skills || [],
    socialLinks: currentUser.socialLinks || {},
  });

  const [newSkill, setNewSkill] = useState("");
  const [newSocialKey, setNewSocialKey] = useState("");
  const [newSocialValue, setNewSocialValue] = useState("");

  const updateProfileMutation = trpc.users.updateProfile.useMutation({
    onSuccess: () => {
      onClose();
      window.location.reload(); // Refresh to show updated data
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  const addSocialLink = () => {
    if (newSocialKey.trim() && newSocialValue.trim()) {
      setFormData({
        ...formData,
        socialLinks: {
          ...formData.socialLinks,
          [newSocialKey.trim()]: newSocialValue.trim(),
        },
      });
      setNewSocialKey("");
      setNewSocialValue("");
    }
  };

  const removeSocialLink = (key: string) => {
    const { [key]: removed, ...rest } = formData.socialLinks;
    setFormData({
      ...formData,
      socialLinks: rest,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-neutral-900 border-b border-neutral-800 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X size={20} className="text-neutral-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Headline
              </label>
              <input
                type="text"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Full Stack Developer | React Enthusiast"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Bio
              </label>
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
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Company name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Avatar URL
              </label>
              <input
                type="url"
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>

          {/* Developer Profiles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Developer Profiles</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  LeetCode Username
                </label>
                <input
                  type="text"
                  value={formData.leetcodeUsername}
                  onChange={(e) => setFormData({ ...formData, leetcodeUsername: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  GitHub Username
                </label>
                <input
                  type="text"
                  value={formData.githubUsername}
                  onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="username"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
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
                <Plus size={16} />
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill) => (
                <div
                  key={skill}
                  className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm font-medium border border-blue-600/30 flex items-center gap-2"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-blue-300"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Social Links</h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newSocialKey}
                onChange={(e) => setNewSocialKey(e.target.value)}
                className="w-1/3 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Platform (e.g., linkedin)"
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
                <Plus size={16} />
                Add
              </button>
            </div>

            <div className="space-y-2">
              {Object.entries(formData.socialLinks).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white capitalize">{key}</div>
                    <div className="text-xs text-neutral-400 truncate">{value}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSocialLink(key)}
                    className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            >
              {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
