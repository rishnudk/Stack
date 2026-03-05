"use client";
import { useState } from "react";
import {
  Home,
  Rocket,
  FileText,
  Briefcase,
  MessageCircle,
  Search,
  Megaphone,
  Pencil
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";
import SidebarLogo from "./SidebarLogo";
import ProfileCard from "./ProfileCard";
import { cn } from "@/lib/utils";
import SettingsMenu from "./SettingsMenu";

interface LeftSidebarProps {
  session: Session;
}

const navItems = [
  { icon: Home, label: "Scroll", href: "/feed" },
  { icon: Rocket, label: "Launchpad", href: "/launchpad" },
  { icon: Pencil, label: "Articles", href: "/articles" },
  { icon: Briefcase, label: "Jobs", href: "/jobs" },
  { icon: MessageCircle, label: "Inbox", href: "/messages" },
  { icon: Search, label: "Search", href: "/search" },
  { icon: Megaphone, label: "Advertise", href: "/advertise" },
];

export function LeftSidebar({ session }: LeftSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="
      w-72 bg-black/50 backdrop-blur-xl border-r border-neutral-800/50
      sticky top-0
      h-screen
      flex flex-col
      p-4
    "
    >
      <div className="mb-8 px-2">
        <SidebarLogo />
      </div>
      <div className="mb-4">
        {/* <ProfileCard session={session} /> */}
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon
                size={22}
                className={cn(
                  "transition-colors duration-200",
                  isActive ? "text-white" : "group-hover:text-white"
                )}
              />
              <span className={cn(
                "text-[15px] font-medium transition-colors duration-200",
                isActive ? "text-white" : "group-hover:text-white"
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-neutral-800/50">
        {/* <SettingsMenu /> */}
      </div>
    </aside>
  );
}
