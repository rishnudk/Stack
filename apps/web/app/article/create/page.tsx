"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { ArrowLeft, Image as ImageIcon, Eye, Edit2 } from "lucide-react";
import ImageNext from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

import { MarkdownEditor } from "../../feed/components/article/MarkdownEditor";
import { ArticlePreview } from "../../feed/components/article/ArticlePreview";

export default function ComposeArticlePage() {
    const router = useRouter();
    const utils = trpc.useUtils();
    const { data: session } = useSession();
    
    const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [tagsInput, setTagsInput] = useState("");
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [previewCoverUrl, setPreviewCoverUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const createArticle = trpc.articles.createArticle.useMutation();
    const getPresignedUrl = trpc.upload.getPresignedUrl.useMutation();

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setCoverFile(file);
            setPreviewCoverUrl(URL.createObjectURL(file));
        }
    };

    async function uploadFileTos3(file: File) {
        const presignResp = await getPresignedUrl.mutateAsync({
            fileName: file.name,
            fileType: file.type
        });
        const { uploadUrl, fileUrl } = presignResp;
        await fetch(uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': file.type },
            body: file,
        });
        return fileUrl;
    }

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '') + '-' + Date.now().toString().slice(-4);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !content.trim() || !description.trim()) {
            toast.error("Title, description, and content are required");
            return;
        }

        try {
            setUploading(true);
            let imageUrl = "/articles/blockchain.png";

            if (coverFile) {
                imageUrl = await uploadFileTos3(coverFile);
            }

            const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
            const slug = generateSlug(title);

            await createArticle.mutateAsync({
                title: title.trim(),
                description: description.trim(),
                content: content.trim(),
                slug,
                tags,
                thumbnail: imageUrl,
                image: imageUrl,
                published: true,
            });

            toast.success("Article published successfully!");
            utils.articles.getArticles.invalidate();
            router.push('/feed'); 
            
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to publish article");
        } finally {
            setUploading(false);
        }
    };

    const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    return (
        <div className="text-white pb-20">
            {/* Header / Tabs */}
            <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => router.push('/feed')}
                            className="p-2 hover:bg-neutral-900 rounded-full transition-colors flex items-center justify-center text-neutral-400 hover:text-white"
                            title="Back to Feed"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-xl font-bold hidden sm:block">Compose Article</h1>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-neutral-900 p-1 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setActiveTab("edit")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "edit" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white"}`}
                        >
                            <Edit2 size={16} /> Edit
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("preview")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "preview" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white"}`}
                        >
                            <Eye size={16} /> Preview
                        </button>
                    </div>

                    <div>
                        <Button 
                            onClick={handleSubmit} 
                            disabled={uploading || createArticle.isPending}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 font-medium disabled:opacity-50 h-10"
                        >
                            {uploading ? 'Uploading...' : createArticle.isPending ? 'Publishing...' : 'Publish'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-8 pt-8">
                {activeTab === "preview" ? (
                    <div className="animate-in fade-in zoom-in-95 duration-200">
                        <ArticlePreview 
                            title={title}
                            description={description}
                            content={content}
                            tags={tagsArray}
                            coverImage={previewCoverUrl}
                            authorName={session?.user?.name || "You"}
                        />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-200">
                        {/* Cover Image Upload */}
                        <div className="border border-neutral-800 border-dashed rounded-2xl p-6 bg-neutral-950/30 flex flex-col items-center justify-center text-center">
                            {previewCoverUrl ? (
                                <div className="w-full flex justify-center">
                                    <div className="relative w-full max-w-2xl h-[300px] rounded-xl overflow-hidden shadow-2xl">
                                        <ImageNext 
                                            src={previewCoverUrl} 
                                            alt="Cover preview" 
                                            fill 
                                            className="object-cover"
                                        />
                                        <label className="absolute bottom-4 right-4 cursor-pointer bg-black/70 hover:bg-black text-white px-4 py-2 rounded-lg border border-neutral-600 transition-colors backdrop-blur-md shadow-lg flex items-center gap-2 text-sm z-10">
                                            <ImageIcon size={16} />
                                            Change Cover
                                            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-8">
                                    <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-500">
                                        <ImageIcon size={24} />
                                    </div>
                                    <h3 className="text-lg font-medium mb-2">Add a cover image</h3>
                                    <p className="text-sm text-neutral-500 mb-6 max-w-md mx-auto">Upload a high-quality image to make your article stand out in the feed.</p>
                                    <label className="cursor-pointer inline-flex items-center justify-center gap-2 bg-neutral-100 text-black hover:bg-white px-6 py-2.5 rounded-full font-medium transition-colors">
                                        Select Image
                                        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Title Input */}
                        <div className="space-y-2 group">
                            <input
                                type="text"
                                placeholder="Article Title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-transparent text-4xl lg:text-5xl font-bold outline-none placeholder:text-neutral-700 border-b border-transparent focus:border-neutral-800 py-4 transition-colors"
                            />
                        </div>

                        {/* Description Input */}
                        <div className="space-y-2 group">
                            <input
                                type="text"
                                placeholder="A short description or summary..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-transparent text-xl text-neutral-300 outline-none placeholder:text-neutral-700 border-b border-transparent focus:border-neutral-800 py-2 transition-colors"
                            />
                        </div>

                        {/* Tags Input */}
                        <div className="space-y-2 group">
                            <input
                                type="text"
                                placeholder="Add tags (comma separated, e.g., web3, react, javascript)"
                                value={tagsInput}
                                onChange={(e) => setTagsInput(e.target.value)}
                                className="w-full bg-transparent text-sm text-blue-400 outline-none placeholder:text-neutral-700 border-b border-transparent focus:border-neutral-800 py-2 transition-colors font-mono"
                            />
                        </div>

                        {/* Markdown Editor */}
                        <div className="pt-6">
                            <MarkdownEditor 
                                value={content} 
                                onChange={setContent} 
                            />
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
