"use client";

import Image from "next/image";
import { Search, Bell, Coins } from "lucide-react";
import ProfileMenu from "./ProfileMenu";

export default function HeaderActions() {
  return (
    <div className="flex items-center gap-3 w-full">

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

      {/* Profile Menu */}
      <ProfileMenu />
    </div>
  );
}