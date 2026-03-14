"use client"

import { Trash2, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const drafts = [
  { id: 1, text: "ada" },
  { id: 2, text: "asdfasd" },
  { id: 3, text: "asdfadf" },
  { id: 4, text: "asdfasdf" }
]

export function DraftModal({ open, onClose }: any) {

  return (
    <AnimatePresence>

      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >

          <motion.div
            className="w-[900px] h-[500px] rounded-2xl bg-zinc-900 p-6"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
          >

            {/* Header */}

            <div className="flex items-center justify-between mb-6">

              <div className="flex gap-3">

                <button className="border border-white px-4 py-1 rounded-full text-sm">
                  DRAFTS • 4
                </button>

                <button className="border border-zinc-700 px-4 py-1 rounded-full text-sm text-zinc-400">
                  SCHEDULED • 0
                </button>

              </div>

              <button onClick={onClose}>
                <X />
              </button>

            </div>

            {/* Draft List */}

            <div className="space-y-6">

              {drafts.map((draft) => (

                <div
                  key={draft.id}
                  className="flex items-center justify-between"
                >

                  <p className="text-lg">{draft.text}</p>

                  <div className="flex items-center gap-4">

                    <img
                      src="/preview.png"
                      className="w-14 h-14 rounded"
                    />

                    <button className="text-red-500">
                      <Trash2 size={18} />
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </motion.div>

        </motion.div>
      )}

    </AnimatePresence>
  )
}