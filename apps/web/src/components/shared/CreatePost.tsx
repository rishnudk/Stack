'use client';

import { useState } from 'react';
import { trpc } from '@/utils/trpc';
import { Button } from '@repo/ui/button';
import { toast } from 'sonner';

export function CreatePost() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <form onSubmit={handleSubmit} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        style={{ width: "100%", padding: 8, resize: "vertical" }}
      />
      <div style={{ marginTop: 8 }}>
        <input type="file" multiple accept="image/*,application/pdf" onChange={handleFiles} />
      </div>

      {files.length > 0 && (
        <div style={{ marginTop: 8 }}>
          {files.map((f) => (
            <div key={f.name} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ width: 48, height: 48, overflow: "hidden" }}>
                {f.type.startsWith("image/") ? (
                  <img src={URL.createObjectURL(f)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ fontSize: 12 }}>{f.name}</div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div>{f.name}</div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  {progress[f.name] ? `Uploading: ${progress[f.name]}%` : "Ready"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button type="submit" disabled={uploading} style={{ marginTop: 12 }}>
        {uploading ? "Uploading..." : "Post"}
      </button>
    </form>
  );
}
