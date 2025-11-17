"use client";
import type React from "react";
import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Image, Smile, Link, Camera } from "lucide-react";
import ImageNext from "next/image";
import { trpc } from '@/utils/trpc';
import { toast } from 'sonner';

export function CreatePostBox() {
 const [content, setContent]  = useState('');
 const [files, setFiles] = useState<File[]>([]);
 const [uploading, setUploading] = useState(false);
 const [progress, setProgress] = useState<Record<string,number>>({});

 //helper to call tRPC route via fetch
 async function TRPCMutation(path: string, input: any) {
  const res = await fetch(`/api/trpc/${path}`, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input }),
    credentials: 'include',
  });
  return res.json();
 }

 const handleFiles = ( e: React.ChangeEvent<HTMLInputElement>  ) => {
  if (!e.target.files)  return;
    setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
  }

  async function uploadFileTos3(file: File)  {
    const presignResp = await TRPCMutation("upload.getPresignedUrl", { fileName: file.name, fileType: file.type });

    if(presignResp.error) {
      toast.error("Error getting presigned URL");
      return;
    }
    const { uploadUrl, fileUrl } = presignResp.result.data;

    await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });
    return fileUrl;
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if(!content && files.length === 0) return ;

    try {
      setUploading(true);
      const imageUrls : string[] = [];

      for(const file of files) {
        const url = await uploadFileTos3(file);
        if(url) imageUrls.push(url);
      }

      const createResp = await TRPCMutation("posts.createPost", { content, images: imageUrls });

      if(createResp.error) {
        toast.error(createResp.error.message || "Error creating post");
                throw new Error(createResp.error.message || "Create post failed");

        return;
      }

      //clear form
      setContent('');
      setFiles([]);
      setProgress({});
      alert("Post created");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Upload error");
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
          placeholder="What’s happening?"
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
          disabled={uploading}
          className="rounded-full bg-sky-500 hover:bg-sky-600 px-5"
        >
          {uploading ? "Posting..." : "Post"}
        </Button>
      </div>
    </div>
  );
}
