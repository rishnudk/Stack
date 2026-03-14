"use client"

import { motion, AnimatePresence } from "framer-motion"

export function DiscardModal({
  open,
  onDiscard,
  onSaveDraft,
  onClose
}: any) {

  return (
    <AnimatePresence>

      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >

          <motion.div
            className="w-[420px] rounded-xl bg-zinc-900 p-6 text-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >

            <h3 className="text-lg font-semibold mb-2">
              Discard this post?
            </h3>

            <p className="text-sm text-zinc-400 mb-6">
              You can also save this as a draft and come back later.
            </p>

            <div className="flex justify-between">

              <button
                onClick={onDiscard}
                className="border border-red-500 text-red-500 px-4 py-2 rounded-md"
              >
                Discard
              </button>

              <button
                onClick={onSaveDraft}
                className="bg-zinc-200 text-black px-4 py-2 rounded-md"
              >
                Save Draft
              </button>

            </div>

          </motion.div>

        </motion.div>
      )}

    </AnimatePresence>
  )
}