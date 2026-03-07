"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
    Settings,
    Bookmark,
    BriefcaseBusiness,
    BadgeCheck,
    Globe,
    Gift,
    BarChart2,
    Wrench,
    LogOut
} from "lucide-react";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const menuItems = [
        {
            icon: <Settings size={18} className="text-zinc-400" />,
            title: "Settings",
            description: "Edit profile, account, notifications, +2 more.",
        },
        {
            icon: <Bookmark size={18} className="text-zinc-400" />,
            title: "Bookmarks",
            description: "Saved projects and posts to visit later.",
        },
        {
            icon: <BriefcaseBusiness size={18} className="text-zinc-400" />,
            title: "Job Preferences",
            description: "Your availability and role preferences.",
            badge: { text: "Open", color: "bg-green-900/40 text-green-400 border-green-800/50" }
        },
        {
            icon: <BadgeCheck size={18} className="text-zinc-400" />,
            title: "Verification",
            description: "Manage identity and other verifications.",
        },
        {
            icon: <Globe size={18} className="text-zinc-400" />,
            title: "Custom Domain",
            description: "Use your profile as portfolio on your domain.",
            badge: { text: "Not Connected", color: "bg-red-900/40 text-red-400 border-red-800/50" }
        },
        {
            icon: <Gift size={18} className="text-zinc-400" />,
            title: "Invite and Earn",
            description: "See who joined using your invite link.",
            badge: { text: "New", color: "bg-green-900/40 text-green-400 border-green-800/50" }
        },
        {
            icon: <BarChart2 size={18} className="text-zinc-400" />,
            title: "Analytics",
            description: "Views, clicks, and who viewed your profile.",
        },
        {
            icon: <Wrench size={18} className="text-zinc-400" />,
            title: "Tools",
            description: "JobHunt AI, GitHub Recap, and 2 more.",
        },
    ];

    return (
        <div className="relative" ref={menuRef}>
            {/* Avatar Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center rounded-full border border-zinc-700 shrink-0 transition-transform active:scale-95 hover:border-zinc-500 overflow-hidden"
            >
                <Image
                    src="/avatar.png" // Fallback or dynamic based on session later
                    alt="profile"
                    width={36}
                    height={36}
                    className="object-cover"
                />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 top-12 w-[340px] bg-[#1a1a1a] border border-zinc-800 rounded-2xl shadow-xl overflow-hidden z-50 flex flex-col pt-2"
                    >
                        {/* Header Identity */}
                        <div className="px-4 py-3 flex items-center gap-3 hover:bg-zinc-800/50 transition-colors cursor-pointer mx-2 rounded-xl">
                            <Image
                                src="/avatar.png"
                                alt="profile"
                                width={40}
                                height={40}
                                className="rounded-full border border-zinc-700 object-cover"
                            />
                            <div className="flex flex-col">
                                <span className="text-zinc-100 font-semibold text-[15px]">Rishnu Dk</span>
                                <span className="text-zinc-400 text-[13px]">Manage integrations, resume, collections, etc.</span>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="flex flex-col px-2 py-2 gap-0.5 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {menuItems.map((item, index) => (
                                <button
                                    key={index}
                                    className="w-full flex items-start text-left gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-800/50 transition-colors group"
                                >
                                    <div className="mt-0.5 shrink-0 group-hover:text-zinc-200 transition-colors">
                                        {item.icon}
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-zinc-200 font-medium text-[15px]">{item.title}</span>
                                            {item.badge && (
                                                <span className={`text-[11px] px-1.5 py-0.5 rounded border ${item.badge.color} font-medium`}>
                                                    {item.badge.text}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-zinc-400 text-[13px] leading-tight mt-0.5">{item.description}</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="h-px bg-zinc-800/60 w-full mt-1" />

                        {/* Logout Footer */}
                        <div className="p-2">
                            <button
                                onClick={() => signOut()}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-red-500 hover:text-red-400 transition-colors"
                            >
                                <LogOut size={18} className="shrink-0" />
                                <span className="font-medium text-[15px]">Logout</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
