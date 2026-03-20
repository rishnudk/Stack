"use client";

import Image from "next/image";
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
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";

export default function ProfileMenu() {
    const { data: session } = useSession();
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
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-col w-full pb-6"
        >
            {/* Header Identity */}
            <div className="py-3 flex items-center gap-3 hover:bg-zinc-800/50 transition-colors cursor-pointer rounded-xl px-2">
                <Image
                    src={session?.user?.image || "/avatar.png"}
                    alt="profile"
                    width={48}
                    height={48}
                    className="rounded-full border border-zinc-700 object-cover shrink-0"
                />
                <div className="flex flex-col">
                    <span className="text-zinc-100 font-semibold text-[16px]">{session?.user?.name || "User"}</span>
                    <span className="text-zinc-400 text-[13px] leading-tight mt-0.5">Manage integrations, resume, collections, etc.</span>
                </div>
            </div>

            <div className="h-px bg-zinc-800/60 w-full my-2 shrink-0" />

            {/* Menu Items */}
            <div className="flex flex-col gap-0.5">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        className="w-full flex items-start text-left gap-3 px-2 py-3 rounded-xl hover:bg-zinc-800/50 transition-colors group"
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

            <div className="h-px bg-zinc-800/60 w-full my-2 shrink-0" />

            {/* Logout Footer */}
            <div className="px-2 mt-1">
                <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-red-500/10 text-red-500 hover:text-red-400 transition-colors"
                >
                    <LogOut size={18} className="shrink-0" />
                    <span className="font-medium text-[15px]">Logout</span>
                </button>
            </div>
        </motion.div>
    );
}
