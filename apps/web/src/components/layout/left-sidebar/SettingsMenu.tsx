"use client";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Settings, User, Briefcase, Shield, LogOut, ChevronUp } from "lucide-react";
import Image from "next/image";
import HireMeSettingsModal from "../../../../app/profile/components/HireMeSettingsModal";
import { EditProfileModal } from "../../../../app/profile/components/EditProfileModal";
import { trpc } from "@/utils/trpc";

type MenuVariant = "standalone" | "top" | "middle" | "bottom";

interface SettingsMenuProps {
  onOpenChange?: (isOpen: boolean) => void;
  variant?: MenuVariant;
}

export default function SettingsMenu({ onOpenChange, variant = "standalone" }: SettingsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHireMeModalOpen, setIsHireMeModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const { data: session } = useSession();
  const menuRef = useRef<HTMLDivElement>(null);

  const variantStyles = {
    standalone: "bg-neutral-900 border border-neutral-800 rounded-xl hover:bg-neutral-800",
    top: "rounded-t-xl hover:bg-white/5",
    middle: "rounded-none hover:bg-white/5",
    bottom: "rounded-b-xl hover:bg-white/5",
  };

  // Fetch user data for edit profile modal
  const { data: userData } = trpc.users.getUserById.useQuery(
    { userId: session?.user?.id || "" },
    { enabled: !!session?.user?.id }
  );

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onOpenChange?.(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onOpenChange]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/signin" });
  };

  const menuItems = [
    {
      icon: User,
      label: "Edit Profile",
      onClick: () => {
        setIsEditProfileModalOpen(true);
        setIsOpen(false);
        onOpenChange?.(false);
      },
    },
    {
      icon: Briefcase,
      label: "Hire Me Settings",
      onClick: () => {
        setIsHireMeModalOpen(true);
        setIsOpen(false);
        onOpenChange?.(false);
      },
    },
    {
      icon: Shield,
      label: "Privacy Settings",
      onClick: () => {
        console.log("Privacy Settings clicked");
        setIsOpen(false);
        onOpenChange?.(false);
      },
    },
    {
      icon: Settings,
      label: "Account Settings",
      onClick: () => {
        console.log("Account Settings clicked");
        setIsOpen(false);
        onOpenChange?.(false);
      },
    },
  ];

  return (
    <div
      className="relative transition-all duration-200"
      ref={menuRef}
    >
      {/* Trigger Button */}
      <button
        onClick={() => {
          const newState = !isOpen;
          setIsOpen(newState);
          onOpenChange?.(newState);
        }}
        className={`w-full flex items-center justify-between px-4 py-3 transition-colors group ${variantStyles[variant]}`}
      >
        <div className="flex items-center gap-3">
          <Settings size={20} className="text-neutral-400 group-hover:text-white transition-colors" />
          <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">
            Settings
          </span>
        </div>
        <ChevronUp
          size={16}
          className={`text-neutral-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="bg-black/20 border-t border-neutral-800/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* User Info Header */}
          <div className="p-3 border-b border-neutral-800/50 bg-neutral-800/30">
            <div className="flex items-center gap-3">
              <Image
                src={session?.user?.image || "/profile.png"}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {session?.user?.name || "User"}
                </p>
                <p className="text-xs text-neutral-400 truncate">
                  {session?.user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Logout */}
            <div className="border-t border-neutral-800/50 mt-1 pt-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400/90 hover:bg-white/5 hover:text-red-400 transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hire Me Settings Modal */}
      <HireMeSettingsModal
        isOpen={isHireMeModalOpen}
        onClose={() => setIsHireMeModalOpen(false)}
      />

      {userData && (
        <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
          currentUser={{
            name: userData.name || "",
            bio: userData.bio || "",
            location: userData.location || "",
            company: userData.company || "",
            headline: userData.headline || "",
            avatarUrl: userData.avatarUrl || userData.image || "",
            leetcodeUsername: userData.leetcodeUsername || "",
            githubUsername: userData.githubUsername || "",
            skills: userData.skills || [],
            socialLinks: (userData.socialLinks as any) || {},
          } as any}
        />
      )
      }
    </div >
  );
}
