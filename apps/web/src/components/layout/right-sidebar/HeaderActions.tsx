"use client";

import Image from "next/image";
import { Search, Bell, Coins, X, Moon } from "lucide-react";

interface HeaderActionsProps {
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
}

export default function HeaderActions({ isProfileOpen, setIsProfileOpen }: HeaderActionsProps) {
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

      {/* Coins */}
      <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 shrink-0">
        <Coins size={18} className="text-orange-400" />
        <span className="absolute -top-1 -right-1 text-xs bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
          1
        </span>
      </div>

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
          src="/avatar.png"
          alt="profile"
          width={36}
          height={36}
          className="object-cover w-full h-full"
        />
      </button>
    </div>
  );
}