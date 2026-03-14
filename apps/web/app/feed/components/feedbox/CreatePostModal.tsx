"use client"

import type React from "react"
import { useState, useRef } from "react"
import { X, Image, Smile, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import NextImage from "next/image"
import { toast } from "sonner"
import type { Session } from "next-auth"
import { trpc } from "@/utils/trpc"
import { DiscardModal } from "./DiscardModal"

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  session?: Session | null
  groupId?: string
  /** Pre-fill from a draft (for "edit draft" flow) */
  prefillContent?: string
  prefillImages?: string[]
  prefillDraftId?: string
}

export function CreatePostModal({
  isOpen,
  onClose,
  session,
  groupId,
  prefillContent = "",
  prefillImages = [],
  prefillDraftId,
}: CreatePostModalProps) {
  const [content, setContent] = useState(prefillContent)
  const [files, setFiles] = useState<File[]>([])
  const [existingImages] = useState<string[]>(prefillImages)
  const [showDiscard, setShowDiscard] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const utils = trpc.useUtils()

  const createPost = trpc.posts.createPost.useMutation({
    onSuccess: () => {
      toast.success("Post created!")
      if (groupId) utils.groups.getGroupPosts.invalidate({ groupId })
      else utils.posts.getPosts.invalidate()
      resetAndClose()
    },
    onError: (err) => toast.error(err.message || "Failed to create post"),
  })

  const saveDraftMut = trpc.posts.saveDraft.useMutation({
    onSuccess: () => {
      toast.success("Draft saved!")
      utils.posts.getDrafts.invalidate()
      setShowDiscard(false)
      resetAndClose()
    },
    onError: (err) => toast.error(err.message || "Failed to save draft"),
  })

  const deleteDraft = trpc.posts.deleteDraft.useMutation()

  const getPresignedUrl = trpc.upload.getPresignedUrl.useMutation()

  const isEmpty = content.trim().length === 0 && files.length === 0 && existingImages.length === 0

  function resetAndClose() {
    setContent("")
    setFiles([])
    setShowDiscard(false)
    onClose()
  }

  function handleClose() {
    if (isEmpty) {
      resetAndClose()
    } else {
      setShowDiscard(true)
    }
  }

  function handleDiscard() {
    // If editing a draft, delete it on discard
    if (prefillDraftId) {
      deleteDraft.mutate({ draftId: prefillDraftId })
    }
    setShowDiscard(false)
    resetAndClose()
  }

  async function uploadFileToS3(file: File): Promise<string> {
    const { uploadUrl, fileUrl } = await getPresignedUrl.mutateAsync({
      fileName: file.name,
      fileType: file.type,
    })
    await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    })
    return fileUrl
  }

  async function handlePost() {
    if (isEmpty) {
      toast.error("Write something or attach an image")
      return
    }
    const uploadedUrls: string[] = [...existingImages]
    for (const file of files) {
      const url = await uploadFileToS3(file)
      uploadedUrls.push(url)
    }
    // If editing a draft, delete the draft first
    if (prefillDraftId) {
      await deleteDraft.mutateAsync({ draftId: prefillDraftId })
    }
    createPost.mutate({
      content: content.trim(),
      images: uploadedUrls,
      groupId,
    })
  }

  async function handleSaveDraft() {
    if (isEmpty) {
      toast.error("Nothing to save")
      return
    }
    const uploadedUrls: string[] = [...existingImages]
    for (const file of files) {
      const url = await uploadFileToS3(file)
      uploadedUrls.push(url)
    }
    saveDraftMut.mutate({
      content: content.trim(),
      images: uploadedUrls,
      groupId,
    })
  }

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const isPosting = createPost.isPending || getPresignedUrl.isPending
  const isSavingDraft = saveDraftMut.isPending

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              className="w-[600px] max-h-[85vh] flex flex-col rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl"
              initial={{ scale: 0.94, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 22, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 shrink-0">
                <div className="flex items-center gap-3">
                  <NextImage
                    src={session?.user?.image || "/profile.png"}
                    alt="avatar"
                    width={36}
                    height={36}
                    className="rounded-full ring-2 ring-zinc-700"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white leading-tight">
                      {session?.user?.name || "You"}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {groupId ? "Posting to group" : "Posting to feed"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Textarea */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <textarea
                  autoFocus
                  placeholder="What are you building?"
                  className="w-full bg-transparent outline-none text-[15px] text-white placeholder:text-zinc-500 resize-none min-h-[160px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />

                {/* Image previews */}
                {files.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {files.map((file, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt=""
                          className="h-20 w-20 object-cover rounded-lg border border-zinc-700"
                        />
                        <button
                          onClick={() => removeFile(i)}
                          className="absolute -top-1.5 -right-1.5 bg-zinc-900 border border-zinc-700 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={10} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Existing images (from draft) */}
                {existingImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {existingImages.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt=""
                        className="h-20 w-20 object-cover rounded-lg border border-zinc-700"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800 shrink-0">
                <div className="flex items-center gap-4 text-zinc-400">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="hover:text-white transition-colors"
                    title="Attach image"
                  >
                    <Image size={18} />
                  </button>
                  <button className="hover:text-white transition-colors" title="Emoji">
                    <Smile size={18} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFiles}
                    className="hidden"
                  />
                </div>

                <div className="flex items-center gap-3">
                  {/* Character count */}
                  <span className={`text-xs tabular-nums ${content.length > 280 ? "text-red-400" : "text-zinc-500"}`}>
                    {content.length}/300
                  </span>

                  <button
                    onClick={handlePost}
                    disabled={isPosting || isEmpty || content.length > 300}
                    className="bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold text-sm px-5 py-2 rounded-full transition-colors flex items-center gap-2"
                  >
                    {isPosting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Posting…
                      </>
                    ) : (
                      "Post"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discard confirmation */}
      <DiscardModal
        open={showDiscard}
        onDiscard={handleDiscard}
        onSaveDraft={handleSaveDraft}
        onClose={() => setShowDiscard(false)}
        isSavingDraft={isSavingDraft}
      />
    </>
  )
}