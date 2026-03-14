"use client"

import { Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface DiscardModalProps {
  open: boolean
  onDiscard: () => void
  onSaveDraft: () => void
  onClose: () => void
  isSavingDraft?: boolean
}

export function DiscardModal({
  open,
  onDiscard,
  onSaveDraft,
  onClose,
  isSavingDraft = false,
}: DiscardModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-[420px] rounded-2xl bg-zinc-900 border border-zinc-800 p-6 text-center shadow-2xl"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              Discard this post?
            </h3>

            <p className="text-sm text-zinc-400 mb-7">
              You can save this as a draft and finish it later.
            </p>

            <div className="flex gap-3">
              <button
                onClick={onDiscard}
                className="flex-1 border border-red-500/60 text-red-400 hover:bg-red-500/10 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                Discard
              </button>

              <button
                onClick={onSaveDraft}
                disabled={isSavingDraft}
                className="flex-1 bg-zinc-100 hover:bg-white text-black px-4 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSavingDraft ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save Draft"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}