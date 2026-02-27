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
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
        <SidebarLogo />
        <ProfileCard />

        <div className="flex flex-col mt-4 bg-neutral-900 border border-neutral-800 rounded-xl">
          <GroupsMenu
            variant="top"
            onOpenChange={(open) =>
              setActiveMenu(open ? "groups" : null)
            }
          />

          <div className="h-px bg-neutral-800 mx-4" />

          <Link href="/messages" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group">
            <MessageCircle size={20} className="text-neutral-400 group-hover:text-white transition-colors" />
            <span className="text-sm text-neutral-200 group-hover:text-white transition-colors">
              Messages
            </span>
          </Link>

          <div className="h-px bg-neutral-800 mx-4" />

          <SettingsMenu
            variant="bottom"
            onOpenChange={(open) =>
              setActiveMenu(open ? "settings" : null)
            }
          />
        </div>
      </div>
    </aside>

  );
}
