"use client";

import { Info, Ticket, Zap, Lock, Egg } from "lucide-react";
import { trpc } from "@/utils/trpc";
import { cn } from "@/lib/utils";
import StreakMilestones from "./StreakMilestones";

export default function DayStreak() {
  const { data: streakData, isLoading } = trpc.streak.getStreak.useQuery({});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500"></div>
      </div>
    );
  }

  const days = streakData?.days || [];
  const currentStreak = streakData?.currentStreak || 0;
  const longestStreak = streakData?.longestStreak || 0;
  const isExpired = streakData?.isExpired ?? true;

  return (
    <div className="relative flex flex-col w-full h-full text-zinc-400 font-sans selection:bg-orange-500/30 min-h-screen">
      {/* Background Dots - Only for this component content */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-size-[16px_16px] opacity-40 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col">
        {/* Streak Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-zinc-100 leading-none tracking-tighter">
                {currentStreak}
              </span>
              <div className="flex flex-col -translate-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">DAY</span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">STREAK</span>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-2 bg-orange-500/10 rounded-2xl blur-lg group-hover:bg-orange-500/20 transition-all" />
            <div className="relative w-14 h-14 rounded-2xl border border-orange-500/30 bg-zinc-900/50 flex items-center justify-center text-2xl shadow-inner group-hover:border-orange-500/50 cursor-help transition-colors translate-x-2">
              {isExpired ? "😐" : "🔥"}
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className="mb-6">
          <p className={cn(
            "text-[15px] font-semibold mb-1",
            isExpired ? "text-orange-400" : "text-green-400"
          )}>
            {isExpired ? `Your ${currentStreak}-day streak is over!` : "Your streak is active!"}
          </p>
          <p className="text-[13px] text-zinc-500 leading-relaxed font-medium">
            The goal with streaks is to encourage meaningful collaboration and contribution. You add value, you get value!
          </p>
        </div>

        {/* Activity Grid - Moved below text */}
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-4 mb-8 backdrop-blur-sm self-center w-full max-w-[280px]">
          <div className="grid grid-cols-10 gap-2 mb-4">
            {days.map((day, idx) => (
              <div
                key={idx}
                className={cn(
                  "w-5 h-5 rounded-[5px] transition-all duration-300 relative group",
                  day.completed 
                    ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)] border border-green-400/50" 
                    : "bg-zinc-800/80 border border-zinc-700/50 hover:bg-zinc-700"
                )}
              >
                 {day.completed && (
                    <div className="absolute inset-x-0.5 inset-y-0.5 rounded-[4px] bg-linear-to-br from-white/10 to-transparent" />
                 )}
                 {idx === days.length - 1 && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-white shadow-sm" />
                 )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-600">
            <span>Longest: {longestStreak}d</span>
            <span className="flex items-center gap-1.5">
               RESTORES: <span className="text-zinc-100">0</span>
            </span>
          </div>
        </div>

        {/* Milestones Component */}
        <StreakMilestones currentStreak={currentStreak} />
      </div>
    </div>
  );
}
