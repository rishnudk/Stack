"use client";
import React, { useState, useEffect } from "react";
import { useEditProfile } from "../hooks/useEditProfile";
import { BasicInfoSection } from "./edit-profile/BasicInfoSection";
import { ImageUploadSection } from "./edit-profile/ImageUploadSection";
import { CoverPhotoSection } from "./edit-profile/CoverPhotoSection";
import { SkillsSection } from "./edit-profile/SkillsSection";
import { SocialLinksSection } from "./edit-profile/SocialLinksSection";

interface EditProfileTabProps {
    currentUser: any;
    onCancel: () => void;
}

export function EditProfileTab({ currentUser, onCancel }: EditProfileTabProps) {
    const {
        formData,
        setFormData,
        imagePreview,
        handleImageChange,
        removeImage,
        coverPreview,
        coverType,
        setCoverType,
        selectedGradient,
        setSelectedGradient,
        handleCoverChange,
        removeCover,
        newSkill,
        setNewSkill,
        addSkill,
        removeSkill,
        newSocialKey,
        setNewSocialKey,
        newSocialValue,
        setNewSocialValue,
        addSocialLink,
        removeSocialLink,
        handleSubmit,
        isSubmitting,
    } = useEditProfile(currentUser, false, onCancel);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="p-6 bg-black text-white rounded-xl border border-neutral-800">
            <div className="mb-6">
                <h2 className="text-xl font-bold">Edit Profile</h2>
                <p className="text-sm text-neutral-400">Update your personal information and links.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <BasicInfoSection formData={formData} setFormData={setFormData} isOnboarding={false} />

                <ImageUploadSection imagePreview={imagePreview} handleImageChange={handleImageChange} removeImage={removeImage} />

                <CoverPhotoSection
                    coverPreview={coverPreview}
                    coverType={coverType}
                    setCoverType={setCoverType}
                    selectedGradient={selectedGradient}
                    setSelectedGradient={setSelectedGradient}
                    handleCoverChange={handleCoverChange}
                    removeCover={removeCover}
                />

                <SkillsSection
                    skills={formData.skills}
                    newSkill={newSkill}
                    setNewSkill={setNewSkill}
                    addSkill={addSkill}
                    removeSkill={removeSkill}
                    leetcodeUsername={formData.leetcodeUsername}
                    setLeetcodeUsername={(val) => setFormData({ ...formData, leetcodeUsername: val })}
                    githubUsername={formData.githubUsername}
                    setGithubUsername={(val) => setFormData({ ...formData, githubUsername: val })}
                />

                <SocialLinksSection
                    socialLinks={formData.socialLinks}
                    newSocialKey={newSocialKey}
                    setNewSocialKey={setNewSocialKey}
                    newSocialValue={newSocialValue}
                    setNewSocialValue={setNewSocialValue}
                    addSocialLink={addSocialLink}
                    removeSocialLink={removeSocialLink}
                />

                <div className="flex gap-3 pt-6 border-t border-neutral-800">
                    <button type="button" onClick={onCancel} className="flex-1 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg font-semibold transition-colors">
                        Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors">
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
