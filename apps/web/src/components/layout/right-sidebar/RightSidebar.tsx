"use client";
import { useState } from "react";
import HeaderActions from "./HeaderActions";
import ProfileMenu from "./ProfileMenu";
import { SuggestionsCard } from "./SuggestionsCard";
import { TrendingCard } from "./TrendingCard";
import type { Session } from "next-auth";
import { TopWriters } from "./TopWriters";
import { usePathname } from "next/navigation";

interface RightSidebarProps {
  session: Session | null;
}

const MOCK_WRITERS = [
  {
    id: "1",
    name: "Alex Dev",
    avatar: "https://avatar.iran.liara.run/public/1",
    bio: "Fullstack Engineer & Technical Writer. I love React and Node.js.",
    topArticles: 12
  },
  {
    id: "2",
    name: "Sarah Code",
    avatar: "https://avatar.iran.liara.run/public/2",
    bio: "Crypto enthusiast and web3 developer. Building the future.",
    topArticles: 8
  },
  {
    id: "3",
    name: "James Smith",
    avatar: "https://avatar.iran.liara.run/public/3",
    bio: "Senior Dev @ TechCorp. Sharing my experience in system design.",
    topArticles: 15
  }
];

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

          {/* Top Writers section */}
          <TopWriters writers={MOCK_WRITERS} />
        </div>
      )}
    </aside>
  );
}