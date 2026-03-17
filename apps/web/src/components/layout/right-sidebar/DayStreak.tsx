"use client"

import { useEffect, useState } from "react"
import { trpc } from "@/utils/trpc"

type DayData = {
  date: string
  completed: boolean
}

export default function DayStreak() {
  const { data, isLoading, refetch } = trpc.streak.getStreak.useQuery({})
  const updateStreak = trpc.streak.updateStreak.useMutation({
    onSuccess: () => {
      refetch()
    }
  })

  useEffect(() => {
    updateStreak.mutate({})
  }, [])

  if (isLoading || !data) return (
    <div className="bg-zinc-900 p-6 rounded-xl w-full max-w-2xl animate-pulse">
      <div className="h-8 bg-zinc-800 w-1/4 mb-4 rounded" />
      <div className="h-4 bg-zinc-800 w-1/2 mb-4 rounded" />
      <div className="grid grid-cols-10 gap-2">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="w-6 h-6 bg-zinc-800 rounded-md" />
        ))}
      </div>
    </div>
  )

  const {
    currentStreak,
    longestStreak,
    days,
    isExpired,
  } = data

  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-6 rounded-2xl w-full max-w-2xl shadow-xl transition-all hover:shadow-orange-500/10 hover:border-zinc-700/50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-5xl font-black bg-linear-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">
            {currentStreak}
          </h1>
          <p className="text-xs font-bold tracking-widest text-zinc-500 mt-1 uppercase">DAY STREAK</p>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-orange-500/20 to-rose-500/20 border border-orange-500/30 flex items-center justify-center text-2xl shadow-inner shadow-orange-500/10">
          🔥
        </div>
      </div>

      {/* Message */}
      <div className="mb-6">
        {isExpired ? (
          <p className="text-rose-400 font-semibold mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            Your {currentStreak}-day streak has ended
          </p>
        ) : (
          <p className="text-emerald-400 font-semibold mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active {currentStreak}-day streak
          </p>
        )}

        <p className="text-sm text-zinc-400 leading-relaxed">
          Stay consistent to climb the developer leaderboard. You add value, you get value.
        </p>
      </div>

      {/* Grid */}
      <div className="mb-6">
        <div className="flex justify-between text-[10px] text-zinc-500 mb-2 font-medium uppercase tracking-wider">
          <span>Active Grid (Last 30 Days)</span>
          <span>Today</span>
        </div>
        <div className="grid grid-cols-10 gap-2">
          {days.map((day: DayData, index: number) => (
            <div
              key={index}
              title={new Date(day.date).toLocaleDateString()}
              className={`aspect-square rounded-md border transition-all duration-300 ${
                day.completed
                  ? "bg-linear-to-br from-orange-500 to-rose-500 border-none shadow-[0_0_12px_rgba(244,114,182,0.3)]"
                  : "bg-zinc-800/50 border-zinc-700/50 hover:border-zinc-600"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs font-medium pt-6 border-t border-zinc-800/50">
        <div className="flex items-center gap-2 text-zinc-400">
          <span className="text-zinc-500 italic">Longest:</span>
          <span className="text-zinc-200">{longestStreak} days</span>
        </div>
        <div className="px-3 py-1 rounded-full bg-zinc-800/50 text-zinc-400 border border-zinc-700/50">
          Restores: <span className="text-zinc-200">0</span>
        </div>
      </div>
    </div>
  )
}