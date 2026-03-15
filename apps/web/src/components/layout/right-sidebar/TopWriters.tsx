"use client"
import { WriterCard } from "./WriterCard"
import { trpc } from "@/utils/trpc"


export function TopWriters() {
  const { data: writers = [], isLoading } = trpc.users.getTopWriters.useQuery()

  if (isLoading) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 animate-pulse">
        <div className="h-4 w-32 bg-zinc-800 rounded mb-4" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-800" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-20 bg-zinc-800 rounded" />
                <div className="h-2 w-full bg-zinc-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (writers.length === 0) return null

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">

      {/* Title */}
      <h2 className="text-sm font-semibold text-white mb-3">
        Top Writers of the Week
      </h2>

      {/* Writers */}
      <div className="flex flex-col">
        {writers.map((writer) => (
          <WriterCard key={writer.id} writer={writer} />
        ))}
      </div>

    </div>
  )
}