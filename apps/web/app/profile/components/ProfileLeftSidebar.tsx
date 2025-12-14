"use client";
import type { Session } from "next-auth";
import SidebarLogo from "../../feed/components/LeftSidebar/SidebarLogo";
import HireMeCard from "../../feed/components/LeftSidebar/HireMeCard";
import AnalyticsCard from "../../feed/components/LeftSidebar/AnalyticsCard";
import SettingsMenu from "../../feed/components/LeftSidebar/SettingsMenu";

interface ProfileLeftSidebarProps {
  session: Session;
}

export function ProfileLeftSidebar({ session }: ProfileLeftSidebarProps) {
  return (
    <aside className="w-72 bg-black rounded-2xl flex flex-col sticky top-4 h-[calc(100vh-2rem)]">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-hide">
        <div className="border-b border-neutral-800 pb-4 -mx-4 px-4">
          <SidebarLogo />
        </div>

        <HireMeCard />
        <AnalyticsCard />

        {/* Settings Menu */}

        <SettingsMenu />

      </div>
    </aside>
  );
}
