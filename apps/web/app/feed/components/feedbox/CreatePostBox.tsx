"use client";
import type React from "react";
import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Image, Smile, Link, Camera } from "lucide-react";
import ImageNext from "next/image";
import { trpc } from '@/utils/trpc';
import { toast } from 'sonner';

export function CreatePostBox() {
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});

  // Use the actual tRPC mutation
  const createPost = trpc.posts.createPost.useMutation();
  const getPresignedUrl = trpc.upload.getPresignedUrl.useMutation();

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
      });

      // Clear form after successful submission
      setContent("");
      setFiles([]);
      setProgress({});
      toast.success("Post created successfully!");
      
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error creating post");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col border-b border-neutral-800 p-4 bg-black text-white">
      <div className="flex items-start gap-3">
        <ImageNext
          src="/profile.png"
          alt="profile"
          width={40}
          height={40}
          className="rounded-full"
        />
        <textarea
          className="flex-1 bg-transparent resize-none outline-none text-lg placeholder-neutral-500"
          placeholder="What's happening?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div style={{ marginTop: 8 }}>
        <input type="file" multiple accept="image/*" onChange={handleFiles} />
      </div>

      <div className="flex justify-between items-center mt-3">
        <div className="flex gap-4 text-neutral-400">
          <Image size={18} />
          <Smile size={18} />
          <Link size={18} />
          <Camera size={18} />
        </div>
        <Button
          onClick={() => handleSubmit()}
          disabled={uploading || createPost.isPending}
          className="rounded-full bg-sky-500 hover:bg-sky-600 px-5"
        >
          {uploading || createPost.isPending ? "Posting..." : "Post"}
        </Button>
      </div>
    </div>
  );
}