"use client";

import React from "react";
import { X } from "lucide-react";
import { useEditProfile } from "../hooks/useEditProfile";
import { BasicInfoSection } from "./edit-profile/BasicInfoSection";
import { ImageUploadSection } from "./edit-profile/ImageUploadSection";
import { CoverPhotoSection } from "./edit-profile/CoverPhotoSection";
import { SkillsSection } from "./edit-profile/SkillsSection";
import { SocialLinksSection } from "./edit-profile/SocialLinksSection";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  isOnboarding?: boolean;
}

export function EditProfileModal({ isOpen, onClose, currentUser, isOnboarding }: EditProfileModalProps) {
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
    handleSkip,
    isSubmitting,
  } = useEditProfile(currentUser, isOnboarding, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-neutral-900 border-b border-neutral-800 p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-white">
            {isOnboarding ? "Complete Your Profile" : "Edit Profile"}
          </h2>
          {!isOnboarding && (
            <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
              <X size={20} className="text-neutral-400" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <BasicInfoSection formData={formData} setFormData={setFormData} isOnboarding={isOnboarding} />

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

          <div className="flex gap-3 pt-4 border-t border-neutral-800">
            {isOnboarding ? (
              <button type="button" onClick={handleSkip} disabled={isSubmitting} className="flex-1 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg font-semibold transition-colors disabled:opacity-50">
                Maybe Later
              </button>
            ) : (
              <button type="button" onClick={onClose} className="flex-1 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg font-semibold transition-colors">
                Cancel
              </button>
            )}
            <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors">
              {isSubmitting ? "Processing..." : isOnboarding ? "Complete Profile" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
