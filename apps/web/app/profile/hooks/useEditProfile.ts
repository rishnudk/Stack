import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface UserData {
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
    coverUrl?: string;
    coverGradient?: string;
}

export function useEditProfile(currentUser: UserData, isOnboarding: boolean | undefined, onClose: () => void) {
    const { update: updateSession } = useSession();

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

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>(currentUser.avatarUrl || "");

    // Cover photo state
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string>(currentUser.coverUrl || "");
    const [coverType, setCoverType] = useState<"upload" | "gradient">(currentUser.coverUrl ? "upload" : "gradient");
    const [selectedGradient, setSelectedGradient] = useState(currentUser.coverGradient || "from-blue-600 via-purple-600 to-pink-600");

    const [newSkill, setNewSkill] = useState("");
    const [newSocialKey, setNewSocialKey] = useState("");
    const [newSocialValue, setNewSocialValue] = useState("");

    const getPresignedUrlMutation = trpc.upload.getPresignedUrl.useMutation();
    const completeOnboardingMutation = trpc.users.completeOnboarding.useMutation();

    const updateProfileMutation = trpc.users.updateProfile.useMutation({
        onSuccess: async () => {
            if (isOnboarding) {
                await completeOnboardingMutation.mutateAsync();
                await updateSession({ onboardingCompleted: true });
                toast.success("Profile completed!");
            } else {
                toast.success("Profile updated successfully!");
            }
            onClose();
            window.location.reload();
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update profile");
        },
    } as any);

    const handleSkip = async () => {
        try {
            await completeOnboardingMutation.mutateAsync();
            await updateSession({ onboardingCompleted: true });
            toast.info("You can complete your profile later");
            onClose();
            window.location.reload();
        } catch (error) {
            toast.error("Failed to skip onboarding");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview("");
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setCoverType("upload");
        }
    };

    const removeCover = () => {
        setCoverFile(null);
        setCoverPreview("");
        setCoverType("gradient");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let avatarUrl = formData.avatarUrl;
            let coverUrl = coverType === "upload" ? currentUser.coverUrl || "" : "";
            let coverGradient = coverType === "gradient" ? selectedGradient : "";

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

                if (!uploadResponse.ok) throw new Error("Failed to upload profile image to S3");
                avatarUrl = fileUrl;
            }

            if (coverType === "upload" && coverFile) {
                const { uploadUrl, fileUrl } = await getPresignedUrlMutation.mutateAsync({
                    fileType: coverFile.type,
                    fileName: coverFile.name,
                });

                const uploadResponse = await fetch(uploadUrl, {
                    method: "PUT",
                    body: coverFile,
                    headers: { "Content-Type": coverFile.type },
                });

                if (!uploadResponse.ok) throw new Error("Failed to upload cover image to S3");
                coverUrl = fileUrl;
            }

            await updateProfileMutation.mutateAsync({
                ...formData,
                avatarUrl,
                coverUrl,
                coverGradient,
            });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update profile");
        }
    };

    const addSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
            setNewSkill("");
        }
    };

    const removeSkill = (skill: string) => {
        setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) });
    };

    const addSocialLink = () => {
        if (newSocialKey.trim() && newSocialValue.trim()) {
            setFormData({
                ...formData,
                socialLinks: { ...formData.socialLinks, [newSocialKey.trim()]: newSocialValue.trim() },
            });
            setNewSocialKey("");
            setNewSocialValue("");
        }
    };

    const removeSocialLink = (key: string) => {
        const { [key]: _, ...rest } = formData.socialLinks;
        setFormData({ ...formData, socialLinks: rest });
    };

    return {
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
        isSubmitting: updateProfileMutation.isPending ||
            getPresignedUrlMutation.isPending ||
            completeOnboardingMutation.isPending,
        isUploading: getPresignedUrlMutation.isPending,
    };
}
