"use client";
import type { Session } from "next-auth";
import SidebarLogo from "../../feed/components/LeftSidebar/SidebarLogo";
import HireMeCard from "../../feed/components/LeftSidebar/HireMeCard";
import AnalyticsCard from "../../feed/components/LeftSidebar/AnalyticsCard";
import ActionCard from "../../feed/components/LeftSidebar/ActionCard";
import SettingsMenu from "../../feed/components/LeftSidebar/SettingsMenu";

interface ProfileLeftSidebarProps {
  session: Session;
}

export function ProfileLeftSidebar({ session }: ProfileLeftSidebarProps) {
  return (
    <aside className="w-72 bg-black rounded-2xl flex flex-col gap-4 p-4 h-fit sticky top-4">
      <SidebarLogo />
      <HireMeCard />
      <AnalyticsCard />
      <ActionCard />
      
      {/* Settings Menu - Sticky at bottom */}
      <div className="mt-4 pt-4 border-t border-neutral-800">
        <SettingsMenu />
      </div>
    </aside>
  );
}
