"use client"

import { useEffect } from "react"
import { trpc } from "@/utils/trpc"

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
    <div className="flex flex-col h-full animate-pulse">
      <div className="h-40 bg-zinc-900/50 rounded-2xl mb-4" />
      <div className="h-64 bg-zinc-900/50 rounded-2xl" />
    </div>
  )

  const {
    currentStreak,
    longestStreak,
    days,
    isExpired,
  } = data

  const getDayColor = (completed: boolean, isToday: boolean) => {
    if (completed) return "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
    if (isToday) return "bg-zinc-800 border-dashed border-zinc-600 after:content-[''] after:w-1 after:h-1 after:bg-white after:rounded-full after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2"
    return "bg-zinc-800/40 border border-zinc-700/50"
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-[320px] mx-auto select-none">
      {/* Top Card Section */}
      <div className="relative overflow-hidden rounded-3xl bg-neutral-900/40 border border-neutral-800/50 p-6 min-h-[180px]">
        {/* Dotted Background */}
        <div 
          className="absolute inset-0 opacity-[0.15] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
            backgroundSize: '12px 12px'
          }}
        />

        <div className="relative flex justify-between items-start">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-bold text-zinc-400 leading-none">
                {currentStreak}
              </span>
              <div className="flex flex-col uppercase tracking-tighter leading-none">
                <span className="text-xs font-bold text-zinc-500">Day</span>
                <span className="text-xs font-bold text-zinc-500">Streak</span>
              </div>
            </div>
          </div>

          <div className="w-20 h-20 rounded-3xl border-2 border-orange-500/40 bg-orange-500/5 flex items-center justify-center text-3xl shadow-lg">
            {currentStreak > 0 ? "🔥" : "😐"}
          </div>
        </div>

        <div className="relative mt-6">
          <p className={`text-sm font-bold ${isExpired ? 'text-rose-500' : 'text-emerald-400'}`}>
            {isExpired ? `Your ${currentStreak}-day streak is over!` : `On a ${currentStreak}-day streak!`}
          </p>
          <p className="text-[13px] text-zinc-500 leading-snug mt-1 font-medium italic">
            "The goal with streaks is to encourage meaningful collaboration and contribution. You add value, you get value!"
          </p>
        </div>
      </div>

      {/* Grid Section */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-8 gap-3">
          {days.slice(-24).map((day: any, index: number) => {
            const isToday = index === 23;
            return (
              <div
                key={index}
                className={`relative w-full aspect-square rounded-xl transition-all duration-300 ${getDayColor(day.completed, isToday)}`}
              />
            );
          })}
        </div>
      </div>

      {/* Stats Footer */}
      <div className="flex justify-between items-center text-[13px] font-bold text-zinc-500 mt-2 px-1">
        <p>Your longest streak: <span className="text-zinc-300">{longestStreak} days</span></p>
        <p>Restores left: <span className="text-zinc-300">0</span></p>
      </div>
    </div>
  )
}

