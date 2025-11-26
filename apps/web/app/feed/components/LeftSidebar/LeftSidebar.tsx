"use client";
import type { Session } from "next-auth";
import AnalyticsCard from "./AnalyticsCard";
import ActionCard from "./ActionCard";
import SidebarLogo from "./SidebarLogo";
import SettingsMenu from "./SettingsMenu";
import ProfileCard from "./ProfileCard";

interface LeftSidebarProps {
  session: Session;
}

export function LeftSidebar({ session }: LeftSidebarProps) {
  return (
    <aside className="w-72 bg-black rounded-2xl flex flex-col gap-4 p-4 h-fit sticky top-4">
      <SidebarLogo />
      <ProfileCard />
      <AnalyticsCard />
      <ActionCard />
      
      {/* Settings Menu - Sticky at bottom */}
      <div className="mt-4 pt-4 border-t border-neutral-800">
        <SettingsMenu />
      </div>
    </aside>
  );
}
