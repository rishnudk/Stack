"use client";

import Image from "next/image";
import { Search, Bell, X, Moon, Flame } from "lucide-react";
import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";

interface HeaderActionsProps {
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  isStreakOpen: boolean;
  setIsStreakOpen: (open: boolean) => void;
}

export default function HeaderActions({ 
  isProfileOpen, 
  setIsProfileOpen,
  isStreakOpen,
  setIsStreakOpen
}: HeaderActionsProps) {
  const { data: session } = useSession();
  const { data: streakData } = trpc.streak.getStreak.useQuery({}, {
    refetchOnWindowFocus: false,
  });

  if (isProfileOpen) {
    return (
      <div className="flex items-center justify-between w-full h-9 shrink-0">
        <button className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors">
          <Moon size={18} className="text-zinc-400" />
        </button>
        <span className="font-semibold text-zinc-100 text-[15px]">Account</span>
        <button
          onClick={() => setIsProfileOpen(false)}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors"
        >
          <X size={18} className="text-zinc-400" />
        </button>
      </div>
    );
  }

  if (isStreakOpen) {
    return (
      <div className="flex items-center justify-between w-full h-9 shrink-0">
        <div className="flex-1" /> {/* Spacer */}
        <button
          onClick={() => setIsStreakOpen(false)}
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition-colors border border-neutral-700 shadow-lg"
        >
          <X size={18} className="text-white" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 w-full shrink-0">
      {/* Search */}
      <div className="flex items-center flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-2 text-sm text-zinc-400">
        <Search size={16} className="mr-2 shrink-0" />
        <input
          type="text"
          placeholder="Search Peerlist"
          className="bg-transparent outline-none w-full placeholder:text-zinc-500"
        />
      </div>

      {/* Streak */}
      <button 
        onClick={() => setIsStreakOpen(true)}
        className="relative flex items-center justify-center w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 shrink-0 hover:border-orange-500/50 transition-colors group"
      >
        <Flame size={18} className={`transition-colors ${streakData?.currentStreak ? 'text-orange-500' : 'text-zinc-500'} group-hover:text-orange-400`} />
        {streakData?.currentStreak !== undefined && (
          <span className="absolute -top-1 -right-1 text-[10px] font-bold bg-linear-to-br from-orange-500 to-rose-500 text-white w-5 h-5 rounded-full flex items-center justify-center border-2 border-black">
            {streakData.currentStreak}
          </span>
        )}
      </button>

      {/* Notifications */}
      <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 shrink-0">
        <Bell size={18} />
        <span className="absolute -top-1 -right-1 text-xs bg-green-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
          2
        </span>
      </div>

      {/* Avatar Trigger */}
      <button
        onClick={() => setIsProfileOpen(true)}
        className="rounded-full border border-zinc-700 shrink-0 hover:border-zinc-500 transition-colors active:scale-95 flex items-center justify-center overflow-hidden w-9 h-9"
      >
        <Image
          src={session?.user?.image || "/avatar.png"}
          alt="profile"
          width={36}
          height={36}
          className="object-cover w-full h-full"
        />
      </button>
    </div>
  );
}
