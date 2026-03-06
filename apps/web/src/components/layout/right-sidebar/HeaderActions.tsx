"use client";

import Image from "next/image";
import { Search, Bell, Coins } from "lucide-react";

export default function HeaderActions() {
  return (
    <div className="flex items-center gap-4 bg-black px-4 py-2 rounded-xl">

      {/* Search */}
      <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1.5 text-sm text-zinc-400">
        <Search size={16} className="mr-2" />
        <input
          type="text"
          placeholder="Search Peerlist"
          className="bg-transparent outline-none text-sm placeholder:text-zinc-500"
        />
      </div>

      {/* Coins */}
      <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800">
        <Coins size={18} className="text-orange-400" />

        <span className="absolute -top-1 -right-1 text-xs bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
          1
        </span>
      </div>

      {/* Notifications */}
      <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800">
        <Bell size={18} className="text-zinc-200" />

        <span className="absolute -top-1 -right-1 text-xs bg-green-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
          2
        </span>
      </div>

      {/* Avatar */}
      <Image
        src="/avatar.png"
        alt="profile"
        width={36}
        height={36}
        className="rounded-full border border-zinc-700"
      />
    </div>
  );
}