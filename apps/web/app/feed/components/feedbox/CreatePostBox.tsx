"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@repo/ui/button";
import { Image, Smile, FileText, Sparkles, Code2, Users } from "lucide-react";
import ImageNext from "next/image";
import { useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import type { Session } from "next-auth";
import Link from "next/link";

interface CreatePostBoxProps {
    groupId?: string;
    session?: Session | null;
}

export function CreatePostBox({ groupId, session }: CreatePostBoxProps = {}) {
    const router = useRouter();
    const [content, setContent] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);

    const placeholders = [
        "What are you building?",
        "What are you working on?",
        "What did you learn today?",
        "Are you hiring?",
    ];

    const utils = trpc.useUtils();
    const createPost = trpc.posts.createPost.useMutation();
    const getPresignedUrl = trpc.upload.getPresignedUrl.useMutation();

    useEffect(() => {
        if (content.length > 0) return;
        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [content]);

    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    };

    async function uploadFileToS3(file: File) {
        const presignResp = await getPresignedUrl.mutateAsync({
            fileName: file.name,
            fileType: file.type,
        });
        const { uploadUrl, fileUrl } = presignResp;
        await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
        });
        return fileUrl;
    }

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmedContent = content.trim();
        if (!trimmedContent && files.length === 0) {
            toast.error("Content or image is required");
            return;
        }
        try {
            setUploading(true);
            const imageUrls: string[] = [];
            for (const file of files) {
                const url = await uploadFileToS3(file);
                if (url) imageUrls.push(url);
            }
            await createPost.mutateAsync({
                content: trimmedContent,
                images: imageUrls,
                groupId,
            });
            setContent("");
            setFiles([]);
            toast.success("Post created successfully!");
            if (groupId) {
                utils.groups.getGroupPosts.invalidate({ groupId });
            } else {
                utils.posts.getPosts.invalidate();
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Error creating post");
        } finally {
            setUploading(false);
        }
    };

    // ── Guest CTA Banner ──────────────────────────────────────────────────────
    if (!session) {
        return (
            <div className="border-b border-neutral-800 bg-linear-to-br from-neutral-950 to-black px-5 py-5 text-white">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-neutral-400 text-xs font-medium uppercase tracking-widest">
                        <Sparkles size={12} className="text-green-400" />
                        <span>The dev social network</span>
                    </div>
                    <h3 className="text-[15px] font-semibold text-white leading-snug">
                        Share your work, connect with devs,<br />
                        <span className="text-green-400">and build your engineering brand.</span>
                    </h3>
                    <div className="flex items-center gap-4 text-neutral-500 text-xs mt-1">
                        <span className="flex items-center gap-1.5">
                            <Code2 size={12} className="text-neutral-400" />
                            Share code &amp; projects
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Users size={12} className="text-neutral-400" />
                            Follow top engineers
                        </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                        <Link href="/signup">
                            <button className="bg-green-500 hover:bg-green-400 text-black font-semibold text-sm px-5 py-2 rounded-full transition-all duration-200 active:scale-95">
                                Join Stack
                            </button>
                        </Link>
                        <Link href="/signin">
                            <button className="text-neutral-300 hover:text-white text-sm border border-neutral-700 hover:border-neutral-500 px-4 py-2 rounded-full transition-all duration-200">
                                Sign in
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ── Authenticated Create Post Box ─────────────────────────────────────────
    return (
        <div className="border-b border-neutral-800 bg-black px-4 py-3 text-white">
            <div className="flex items-start gap-3">
                {/* Avatar */}
                <ImageNext
                    src={session?.user?.image || "/profile.png"}
                    alt="profile"
                    width={40}
                    height={40}
                    className="rounded-full"
                />

                <div className="flex-1">
                    <div className="relative flex-1">
                        {content.length === 0 && (
                            <span
                                key={placeholderIndex}
                                className="absolute left-0 top-0 text-neutral-500 text-[15px] pointer-events-none animate-placeholder"
                            >
                                {placeholders[placeholderIndex]}
                            </span>
                        )}
                        <textarea
                            className="w-full bg-transparent resize-none outline-none text-[15px]"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>

                    {/* Hidden file input */}
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFiles}
                        className="hidden"
                        id="fileUpload"
                    />

                    {/* Bottom actions */}
                    <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-5 text-neutral-400">
                            <label htmlFor="fileUpload" className="cursor-pointer hover:text-white">
                                <Image size={18} />
                            </label>
                            <Smile size={18} className="cursor-pointer hover:text-white" />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="cursor-pointer hover:text-white"
                            >
                                <circle cx="9" cy="9" r="7" />
                                <line x1="9" y1="5" x2="9" y2="9" />
                                <line x1="9" y1="13" x2="9.01" y2="13" />
                            </svg>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="cursor-pointer hover:text-white"
                            >
                                <path d="M4 19.5V4.5A2.5 2.5 0 0 1 6.5 2h11" />
                                <path d="M18 6v13.5" />
                                <path d="M6.5 2v15.5A2 2 0 0 0 8.5 19H18" />
                            </svg>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.push("/article")}
                                className="flex items-center gap-2 border border-neutral-700 px-4 py-1.5 rounded-full text-sm hover:bg-neutral-900 transition-colors"
                            >
                                <FileText size={16} />
                                Write Article
                            </button>
                            <Button
                                onClick={() => handleSubmit()}
                                disabled={uploading || createPost.isPending}
                                className="rounded-full bg-green-500 hover:bg-green-600 px-5 text-black font-semibold"
                            >
                                {uploading || createPost.isPending ? "Posting..." : "Post"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
