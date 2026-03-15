"use client";
import { useState } from "react";
import HeaderActions from "./HeaderActions";
import ProfileMenu from "./ProfileMenu";
import { SuggestionsCard } from "./SuggestionsCard";
import { TrendingCard } from "./TrendingCard";
import type { Session } from "next-auth";
import { TopWriters } from "./TopWriters";
import { TopArticlesCard } from "./TopArticlesCard";
import { usePathname } from "next/navigation";

interface RightSidebarProps {
  session: Session | null;
}

export function RightSidebar({ session }: RightSidebarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  const isArticlePage = pathname.startsWith("/article");

  return (
    <aside className="hidden lg:flex flex-col w-[320px] box-border bg-black text-white relative h-screen overflow-hidden border-l border-neutral-800">
      {/* Container matches Navigation spacing: py-3 with border-b */}
      <div className={`px-4 py-3 ${isProfileOpen ? "border-b border-neutral-800" : ""}`}>
        <HeaderActions isProfileOpen={isProfileOpen} setIsProfileOpen={setIsProfileOpen} />
      </div>

      {isProfileOpen ? (
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col px-4 pt-2">
          <ProfileMenu />
        </div>
      ) : (
        <div className="flex flex-col gap-4 flex-1 px-4 pt-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {!isArticlePage && (
            <>
              {/* Suggestions section */}
              <SuggestionsCard />

              {/* Trending section */}
              <TrendingCard />
            </>
          )}

          {/* Top Articles section */}
          <TopArticlesCard />

          {/* Top Writers section */}
          <TopWriters />
        </div>
      )}
    </aside>
  );
}