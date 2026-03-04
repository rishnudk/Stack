"use client";

import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { Bookmark, BookmarkCheck, Trash2, Ellipsis, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner"; // Assuming sonner is used, typical in these setups

interface PostMenuProps {
    postId: string;
    isSaved: boolean;
    isOwner: boolean;
    onDelete?: () => void;
    onSaveToggle?: (saved: boolean) => void;
}

export function PostMenu({ postId, isSaved, isOwner, onDelete, onSaveToggle }: PostMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleSave = trpc.posts.toggleSavePost.useMutation({
        onSuccess: (data) => {
            onSaveToggle?.(data.isSaved);
            toast.success(data.isSaved ? "Post saved" : "Post removed from saves");
        },
        onError: (error) => {
            toast.error("Failed to update save status");
            console.error(error);
        }
    });

    const deletePost = trpc.posts.deletePost.useMutation({
        onSuccess: () => {
            onDelete?.();
            toast.success("Post deleted");
            setIsOpen(false);
        },
        onError: (error) => {
            toast.error("Failed to delete post");
            console.error(error);
        }
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setShowDeleteConfirm(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSaveClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleSave.mutate({ postId });
        setIsOpen(false);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (showDeleteConfirm) {
            deletePost.mutate({ postId });
        } else {
            setShowDeleteConfirm(true);
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="p-1 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400 hover:text-white"
            >
                <Ellipsis size={20} />
            </button>
            <LazyMotion features={domAnimation}>
                <AnimatePresence>
                    {isOpen && (
                        <m.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl z-50 overflow-hidden"
                        >
                            <div className="py-1">
                                {/* Save Action */}
                                <button
                                    onClick={handleSaveClick}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-neutral-800 transition-colors text-left"
                                >
                                    {isSaved ? (
                                        <>
                                            <BookmarkCheck size={18} className="text-blue-500" />
                                            <span>Unsave Post</span>
                                        </>
                                    ) : (
                                        <>
                                            <Bookmark size={18} />
                                            <span>Save Post</span>
                                        </>
                                    )}
                                </button>

                                {isOwner && (
                                    <>
                                        <div className="h-px bg-neutral-800 my-1 mx-2" />

                                        {/* Delete Action */}
                                        <button
                                            onClick={handleDeleteClick}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${showDeleteConfirm ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : "hover:bg-neutral-800 text-red-400"
                                                }`}
                                        >
                                            {showDeleteConfirm ? (
                                                <>
                                                    <AlertCircle size={18} />
                                                    <span className="font-medium">Confirm Delete?</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2 size={18} />
                                                    <span>Delete Post</span>
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>
                        </m.div>
                    )}
                </AnimatePresence>
            </LazyMotion>
        </div>
    );
}
