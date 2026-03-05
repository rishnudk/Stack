"use client";
import { SuggestionsCard } from "./SuggestionsCard";
import { TrendingCard } from "./TrendingCard";
import type { Session } from "next-auth";


interface RightSidebarProps {
  session: Session;
}

export function RightSidebar({session}: RightSidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col gap-4 w-[320px] p-4 bg-black text-white">
      {/* Search bar */}
      <div className="bg-neutral-900 rounded-full px-4 py-2 border border-neutral-800">
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent outline-none w-full text-sm text-neutral-300"
        />
      </div>

      {/* Suggestions section */}
      <SuggestionsCard />

      {/* Trending section */}
      <TrendingCard />
    </aside>
  );
}
