"use client";

import { Info, Ticket, Zap, Lock, Egg, Star, Trophy, Target, Sparkles, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

const MILESTONES = [
  { days: 0, title: "Start your streak", icon: Egg, color: "text-orange-200", locked: false },
  { days: 7, title: "Restore Streak x1", icon: Ticket, color: "text-zinc-400", locked: true, description: "Recover up to 2 inactive days." },
  { days: 14, title: "Super Upvote", icon: Zap, color: "text-zinc-400", locked: true },
  { days: 21, title: "Profile Badge", icon: Star, color: "text-zinc-400", locked: true },
  { days: 30, title: "Restore Streak x2", icon: Ticket, color: "text-zinc-400", locked: true },
  { days: 45, title: "Priority Support", icon: Target, color: "text-zinc-400", locked: true },
  { days: 60, title: "Custom Theme", icon: Sparkles, color: "text-zinc-400", locked: true },
  { days: 75, title: "Beta Invites", icon: Gift, color: "text-zinc-400", locked: true },
  { days: 90, title: "Restore Streak x3", icon: Ticket, color: "text-zinc-400", locked: true },
  { days: 100, title: "Streak Legend", icon: Trophy, color: "text-zinc-400", locked: true },
];

export default function StreakMilestones({ currentStreak }: { currentStreak: number }) {
  return (
    <div className="relative flex flex-col py-6">
      {/* Background Dots */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-size-[16px_16px] opacity-40 pointer-events-none" />

      <div className="relative z-10 flex flex-col">
      {/* Milestones Header */}
      <div className="flex items-center gap-3 mb-6 group cursor-default">
        <Ticket size={16} className="text-zinc-500 rotate-12 group-hover:text-orange-400 transition-colors" />
        <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-zinc-500 flex-1">
          MILESTONES & REWARDS
        </h3>
        <div className="flex-1 h-px bg-zinc-800" />
        <Info size={16} className="text-zinc-600 hover:text-zinc-400 cursor-pointer transition-colors" />
      </div>

      {/* Vertical Timeline */}
      <div className="flex flex-col gap-8 ml-6 relative pb-2">
        <div className="absolute left-[23px] top-6 bottom-12 w-[2px] bg-zinc-800/50" />

        {MILESTONES.map((milestone, idx) => {
          const isReached = currentStreak >= milestone.days;
          const Icon = milestone.icon;

          return (
            <div 
              key={idx} 
              className={cn(
                "flex items-center gap-6 group transition-all duration-300",
                !isReached && "opacity-50 hover:opacity-100"
              )}
            >
              <div className="relative shrink-0">
                <div className={cn(
                  "absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-[4px] text-[10px] font-black border z-20 transition-all duration-500",
                  isReached 
                    ? "bg-orange-500 text-white border-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.4)] scale-110" 
                    : "bg-zinc-900 text-zinc-500 border-zinc-800"
                )}>
                  {milestone.days} d
                </div>
                <div className={cn(
                  "w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-300 shadow-lg",
                  isReached 
                    ? "bg-linear-to-b from-zinc-800 to-zinc-900 border-zinc-600 group-hover:scale-110 group-hover:border-zinc-400" 
                    : "bg-zinc-950 border-zinc-800 group-hover:border-zinc-700"
                )}>
                  {isReached ? (
                    <Icon size={idx === 0 ? 24 : 20} className={cn(milestone.color, idx === 0 && "fill-current")} />
                  ) : (
                    <Lock size={18} className="text-zinc-700" />
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <h4 className={cn(
                  "text-[15px] font-bold transition-colors",
                  isReached ? "text-zinc-100 group-hover:text-orange-400" : "text-zinc-500"
                )}>
                  {milestone.title} {milestone.days === 14 && isReached && <Zap size={14} className="inline fill-orange-500 text-orange-500" />}
                </h4>
                {"description" in milestone && (
                  <p className="text-[12px] text-zinc-600 font-medium">{milestone.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
  );
}
