"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@repo/ui/button";
import { Image, Smile } from "lucide-react";
import ImageNext from "next/image";
import { trpc } from '@/utils/trpc';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

interface CreatePostBoxProps {
    groupId?: string;
}

export function CreatePostBox({ groupId }: CreatePostBoxProps = {}) {
    const { data: session } = useSession();
    const [content, setContent] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState<Record<string, number>>({});
    const [placeholderIndex, setPlaceholderIndex] = useState(0);

    const placeholders = [
        "What are you building?",
        "What are you working on?",
        "What did you learn today?",
        "Are you hiring?"
    ];

    // Use the actual tRPC mutation
    const utils = trpc.useUtils();
    const createPost = trpc.posts.createPost.useMutation();
    const getPresignedUrl = trpc.upload.getPresignedUrl.useMutation();

    useEffect(() => {
        if (content.length > 0) return;

        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % placeholders.length)
        }, 2000);
        return () => clearInterval(interval);
    }, [content]);

    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }

    async function uploadFileTos3(file: File) {
        console.log('🔵 Starting upload for:', file.name);
        const presignResp = await getPresignedUrl.mutateAsync({
            fileName: file.name,
            fileType: file.type
        });
        console.log('🔵 Uploading to S3...');
        const { uploadUrl, fileUrl } = presignResp;
        console.log('🔵 Upload URL:', uploadUrl);
        console.log('🔵 File URL:', fileUrl);
        await fetch(uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': file.type },
            body: file,
        });
        console.log('🔵 File uploaded successfully!');
        return fileUrl;
    }

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        console.log('🔵 Starting post creation...');
        const trimmedContent = content.trim();

        if (!trimmedContent && files.length === 0) {
            toast.error("Content or image is required");
            return;
        }

        try {
            setUploading(true);
            const imageUrls: string[] = [];

            for (const file of files) {
                const url = await uploadFileTos3(file);
                if (url) imageUrls.push(url);
            }

            await createPost.mutateAsync({
                content: trimmedContent,
                images: imageUrls,
                groupId: groupId,
            });

            // Clear form after successful submission
            setContent("");
            setFiles([]);
            setProgress({});
            toast.success("Post created successfully!");

            // Invalidate queries to refresh the UI
            if (groupId) {
                // Invalidate group posts query
                utils.groups.getGroupPosts.invalidate({ groupId });
            } else {
                // Invalidate general feed posts query
                utils.posts.getPosts.invalidate();
            }

        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Error creating post");
        } finally {
            setUploading(false);
        }
    };

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

                        {/* Animated placeholder */}
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

                        {/* Left icons */}
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

                        {/* Right buttons */}
                        <div className="flex items-center gap-3">

                            {/* Write article */}
                            <button className="flex items-center gap-2 border border-neutral-700 px-4 py-1.5 rounded-full text-sm hover:bg-neutral-900">
                                Write Article
                            </button>

                            {/* Post button */}
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
