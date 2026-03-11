"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import ImageNext from "next/image";
import { toast } from "sonner";
import { Button } from "@repo/ui/button";

export default function NewArticlePage() {
    const router = useRouter();
    const utils = trpc.useUtils();
    
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [tagsInput, setTagsInput] = useState("");
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const createArticle = trpc.articles.createArticle.useMutation();
    const getPresignedUrl = trpc.upload.getPresignedUrl.useMutation();

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCoverFile(e.target.files[0]);
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
            let imageUrl = "/articles/blockchain.png"; // Fallback placeholder

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
            router.push('/feed'); // Redirect after success
            
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to publish article");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button 
                        onClick={() => router.back()}
                        className="p-2 hover:bg-neutral-900 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold">Write an Article</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Cover Image */}
                    <div className="border border-neutral-800 rounded-2xl p-6 bg-neutral-950/50">
                        <label className="block text-sm font-medium text-neutral-400 mb-2">Cover Image</label>
                        <div className="flex items-center gap-4">
                            {coverFile && (
                                <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-neutral-800">
                                    <ImageNext 
                                        src={URL.createObjectURL(coverFile)} 
                                        alt="Cover preview" 
                                        fill 
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <label className="cursor-pointer flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 px-4 py-2 rounded-lg border border-neutral-800 transition-colors">
                                <ImageIcon size={18} />
                                <span>{coverFile ? 'Change Cover' : 'Upload Cover'}</span>
                                <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                            </label>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Article Title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-transparent text-3xl font-bold outline-none placeholder:text-neutral-600 border-b border-transparent focus:border-neutral-800 pb-2 transition-colors"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="A short description or summary..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-transparent text-lg text-neutral-300 outline-none placeholder:text-neutral-600 border-b border-transparent focus:border-neutral-800 pb-2 transition-colors"
                        />
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Add tags (comma separated, e.g., web3, react, javascript)"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neutral-600 transition-colors"
                        />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <textarea
                            placeholder="Write your article content here... (Markdown supported)"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full h-[400px] bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-neutral-600 transition-colors resize-y leading-relaxed"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4 pt-4 border-t border-neutral-800">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={() => router.back()}
                            className="hover:bg-neutral-900 rounded-full px-6"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={uploading || createArticle.isPending}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 font-medium disabled:opacity-50"
                        >
                            {uploading ? 'Uploading...' : createArticle.isPending ? 'Publishing...' : 'Publish Article'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
