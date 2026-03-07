"use client";
import { useState } from "react";
import HeaderActions from "./HeaderActions";
import ProfileMenu from "./ProfileMenu";
import { SuggestionsCard } from "./SuggestionsCard";
import { TrendingCard } from "./TrendingCard";
import type { Session } from "next-auth";

interface RightSidebarProps {
  session: Session;
}

export function RightSidebar({ session }: RightSidebarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <aside className="hidden lg:flex flex-col gap-4 w-[320px] p-4 box-border bg-black text-white relative h-screen overflow-hidden">
      <HeaderActions isProfileOpen={isProfileOpen} setIsProfileOpen={setIsProfileOpen} />

      {isProfileOpen && (
        <div className="h-px bg-zinc-800 w-full shrink-0" />
      )}

      {isProfileOpen ? (
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col -mx-2 px-2">
          <ProfileMenu />
        </div>
      ) : (
        <div className="flex flex-col gap-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Suggestions section */}
          <SuggestionsCard />

          {/* Trending section */}
          <TrendingCard />
        </div>
      )}
    </aside>
  );
}