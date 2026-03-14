"use client"

import { useState } from "react"
import { Loader, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { DiscardModal } from "./DiscardModal"
import { DraftModal } from "./DraftModal"

export function CreatePostModal({ isOpen, onClose }: any) {

  const [showDiscard, setShowDiscard] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showDraftModal, setShowDraftModal] = useState(false)

  const saveDraft = async () => {

    setLoading(true)

    // simulate API
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setLoading(false)

    onClose()

    setShowDraftModal(true)
  }


  const handleClose = () => {
    setShowDiscard(true)
  }

  const discardPost = () => {
    setShowDiscard(false)
    onClose()
  }

return (
  <>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-[650px] rounded-xl bg-zinc-900 p-6 shadow-xl"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Create Post</h2>

              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-zinc-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Input */}
            <textarea
              placeholder="What do you want to talk about?"
              className="w-full bg-transparent outline-none text-sm resize-none h-[200px]"
            />

            {/* Footer */}
            <div className="flex justify-end mt-4">
              <button
                className="bg-green-500 px-4 py-2 rounded text-white flex items-center justify-center w-[100px]"
                disabled={loading}
              >
                {loading ? <Loader /> : "Post"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Discard Confirmation Modal */}
    <DiscardModal
      open={showDiscard}
      onDiscard={discardPost}
      onSaveDraft={saveDraft}
      onClose={() => setShowDiscard(false)}
    />

    {/* Drafts Modal */}
    <DraftModal
      open={showDraftModal}
      onClose={() => setShowDraftModal(false)}
    />
  </>
)
  
}