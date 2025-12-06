"use client";
import { useState } from "react";
import type { Session } from "next-auth";
import AnalyticsCard from "./AnalyticsCard";
import ActionCard from "./ActionCard";
import SidebarLogo from "./SidebarLogo";
import SettingsMenu from "./SettingsMenu";
import ProfileCard from "./ProfileCard";
import GroupsMenu from "./GroupsMenu";

interface LeftSidebarProps {
  session: Session;
}

export function LeftSidebar({ session }: LeftSidebarProps) {
  const [isGroupsOpen, setIsGroupsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Show scrollbar when any dropdown is open
  const showScrollbar = isGroupsOpen || isSettingsOpen;

  return (
    <aside className={`w-72 bg-black rounded-2xl flex flex-col gap-4 p-4 max-h-screen sticky top-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent ${showScrollbar ? 'overflow-y-scroll' : 'overflow-y-hidden'}`}>
      <SidebarLogo />
      <ProfileCard />
      {/* <AnalyticsCard /> */}
      {/* <ActionCard /> */}
      
      {/* Groups Menu */}
      <GroupsMenu onOpenChange={setIsGroupsOpen} />
      
      {/* Settings Menu - Sticky at bottom */}
        <SettingsMenu isGroupsDropdownOpen={isGroupsOpen} onOpenChange={setIsSettingsOpen} />
      
    </aside>
  );
}
