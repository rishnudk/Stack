"use client";
import HeaderActions from "./HeaderActions";
import { SuggestionsCard } from "./SuggestionsCard";
import { TrendingCard } from "./TrendingCard";
import type { Session } from "next-auth";


interface RightSidebarProps {
  session: Session;
}

export function RightSidebar({session}: RightSidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col gap-4 w-[320px] p-4 bg-black text-white">
      

      <HeaderActions />
      {/* Suggestions section */}
      <SuggestionsCard />

      {/* Trending section */}
      <TrendingCard />
    </aside>
  );
}
