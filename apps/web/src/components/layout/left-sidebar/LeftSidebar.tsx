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
  Users,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import type { Session } from "next-auth";
import SidebarLogo from "./SidebarLogo";
import ProfileCard from "./ProfileCard";
import { cn } from "@/lib/utils";
import SettingsMenu from "./SettingsMenu";
import SidebarProfile from "./SidebarProfile";

interface LeftSidebarProps {
  session: Session | null;
}

const navItems = [
  { icon: Home, label: "Scroll", href: "/feed" },
  { icon: FileText, label: "Articles", href: "/article" },
  { icon: Briefcase, label: "Jobs", href: "/jobs" },
  { icon: MessageCircle, label: "Inbox", href: "/messages" },
  { icon: Search, label: "Search", href: "/search" },
  { icon: Users, label: "Profile", href: "/profile" },
];

export function LeftSidebar({ session: propSession }: LeftSidebarProps) {
  const pathname = usePathname();
  const { data: sessionData } = useSession();
  const session = propSession || sessionData;

  const { data: userData } = trpc.users.getSidebarInfo.useQuery(
    { userId: session?.user?.id },
    { enabled: !!session?.user?.id }
  );

  const user = userData?.user;

  return (
    <aside className="w-72 bg-black/50 backdrop-blur-xl border-neutral-800/50 sticky top-0 h-screen flex flex-col">

      <div className="mb-8 px-2">
        <SidebarLogo />
      </div>
        <div className="flex-1 overflow-y-auto px-4 space-y-4 sidebar-scroll">


      <nav className=" space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden",
                isActive
                  ? "text-neutral-400 hover:text-white hover:bg-white/5"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              )}
            >
              {/* Noise Background Effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-[0.30] transition-opacity duration-300 pointer-events-none mix-blend-overlay"
                style={{ 
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
                }}
              />

              <item.icon
                size={22}
                className={cn(
                  "transition-all duration-200 z-10",
                  isActive ? "text-white" : "group-hover:text-white"
                )}
              />
              <span className={cn(
                "text-[15px] font-medium transition-all duration-200 z-10",
                isActive ? "text-white" : "group-hover:text-white group-hover:translate-x-1"
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.5)] z-10" />
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto space-y-4">
        {user && <SidebarProfile user={user} />}
        <ProfileCard session={session} />
      </div>
      </div>

      
    </aside>
  );
}
