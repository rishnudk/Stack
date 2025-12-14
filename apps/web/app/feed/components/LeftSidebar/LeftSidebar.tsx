"use client";
import { useState } from "react";
import { MessageCircle } from "lucide-react"; 
import Link from "next/link"; 
import type { Session } from "next-auth";
import SidebarLogo from "./SidebarLogo";
import SettingsMenu from "./SettingsMenu";
import ProfileCard from "./ProfileCard";
import GroupsMenu from "./GroupsMenu";

interface LeftSidebarProps {
  session: Session;
}

type ActiveMenu = "groups" | "settings" | null;

export function LeftSidebar({ session }: LeftSidebarProps) {
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>(null);

  const isGroupsOpen = activeMenu === "groups";
  const isSettingsOpen = activeMenu === "settings";

  return (
    <aside
  className="
    w-72 bg-black rounded-2xl
    sticky top-4
    h-[calc(100vh-1rem)]
    flex flex-col
  "
>
  {/* Scroll container */}
  <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
    <SidebarLogo />
    <ProfileCard />

    <div className="flex flex-col gap-6 mt-4">
      <GroupsMenu
        onOpenChange={(open) =>
          setActiveMenu(open ? "groups" : null)
        }
      />
      <Link href="/messages" className="w-full flex items-center gap-3 px-4 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl transition-colors group">
      <MessageCircle  size= {20} className="text-neutral-400 group-hover:text-white transition-colors" />
      <span className="text-sm text-neutral-200 group-hover:text-white transition-colors">
        Messages
      </span>
      </Link>

      <SettingsMenu
        isGroupsDropdownOpen={activeMenu === "groups"}
        onOpenChange={(open) =>
          setActiveMenu(open ? "settings" : null)
        }
      />
    </div>
  </div>
</aside>

  );
}
