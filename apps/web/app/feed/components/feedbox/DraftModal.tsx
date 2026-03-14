"use client"

import { useState } from "react"
import { Trash2, X, FileText, Loader2, PenLine } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import type { Session } from "next-auth"
import { trpc } from "@/utils/trpc"
import { CreatePostModal } from "./CreatePostModal"

interface DraftModalProps {
  open: boolean
  onClose: () => void
  session?: Session | null
  groupId?: string
}

export function DraftModal({ open, onClose, session, groupId }: DraftModalProps) {
  const [editingDraft, setEditingDraft] = useState<{
    id: string
    content: string
    images: string[]
  } | null>(null)

  const { data, isLoading, refetch } = trpc.posts.getDrafts.useQuery(
    { limit: 20 },
    { enabled: open }
  )

  const deleteDraft = trpc.posts.deleteDraft.useMutation({
    onSuccess: () => {
      toast.success("Draft deleted")
      refetch()
    },
    onError: (err) => toast.error(err.message || "Failed to delete draft"),
  })

  const drafts = data?.drafts ?? []
  const draftCount = drafts.length

  function handleEdit(draft: { id: string; content: string; images: string[] }) {
    setEditingDraft(draft)
    onClose()
  }

  function handleEditClose() {
    setEditingDraft(null)
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="w-[640px] max-h-[82vh] flex flex-col rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 22, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 shrink-0">
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 border border-white/80 px-4 py-1.5 rounded-full text-sm font-semibold text-white">
                    <FileText size={13} />
                    DRAFTS
                    <span className="bg-white text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {draftCount}
                    </span>
                  </button>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-16 text-zinc-500">
                    <Loader2 size={22} className="animate-spin" />
                  </div>
                ) : drafts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-500">
                    <FileText size={36} strokeWidth={1.2} />
                    <p className="text-sm">No drafts yet</p>
                    <p className="text-xs text-zinc-600">
                      Start writing a post and save it as a draft
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-zinc-800">
                    {drafts.map((draft) => (
                      <li
                        key={draft.id}
                        className="flex items-start gap-4 px-6 py-4 hover:bg-zinc-800/40 transition-colors group"
                      >
                        {/* Draft content preview */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white leading-relaxed line-clamp-3 whitespace-pre-wrap">
                            {draft.content || (
                              <span className="text-zinc-500 italic">No text</span>
                            )}
                          </p>
                          {draft.images && draft.images.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              {draft.images.slice(0, 3).map((url, i) => (
                                <img
                                  key={i}
                                  src={url}
                                  alt=""
                                  className="h-12 w-12 object-cover rounded-lg border border-zinc-700"
                                />
                              ))}
                              {draft.images.length > 3 && (
                                <div className="h-12 w-12 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs text-zinc-400">
                                  +{draft.images.length - 3}
                                </div>
                              )}
                            </div>
                          )}
                          <p className="text-xs text-zinc-600 mt-2">
                            {new Date(draft.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() =>
                              handleEdit({
                                id: draft.id,
                                content: draft.content,
                                images: draft.images ?? [],
                              })
                            }
                            className="p-2 rounded-lg hover:bg-zinc-700 text-zinc-400 hover:text-green-400 transition-colors"
                            title="Edit draft"
                          >
                            <PenLine size={16} />
                          </button>

                          <button
                            onClick={() => deleteDraft.mutate({ draftId: draft.id })}
                            disabled={deleteDraft.isPending}
                            className="p-2 rounded-lg hover:bg-zinc-700 text-zinc-400 hover:text-red-400 transition-colors disabled:opacity-40"
                            title="Delete draft"
                          >
                            {deleteDraft.isPending ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit draft → opens CreatePostModal pre-filled */}
      {editingDraft && (
        <CreatePostModal
          isOpen={true}
          onClose={handleEditClose}
          session={session}
          groupId={groupId}
          prefillContent={editingDraft.content}
          prefillImages={editingDraft.images}
          prefillDraftId={editingDraft.id}
        />
      )}
    </>
  )
}