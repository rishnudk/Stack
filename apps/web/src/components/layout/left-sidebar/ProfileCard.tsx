"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import type { Session } from "next-auth";

interface ProfileCardProps {
  session?: Session | null;
}

export default function ProfileCard({ session: propSession }: ProfileCardProps) {
  const { data: sessionData } = useSession();
  const session = propSession || sessionData;

  const { data: userData } = trpc.users.getSidebarInfo.useQuery(
    { userId: session?.user?.id },
    { enabled: !!session?.user?.id }
  );

  const user = userData?.user;

  if (!user) {
    return (
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 h-48 animate-pulse" />
    );
  }

  return (
    <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden text-white">
      {/* Cover */}
      <div className="h-16 bg-gradient-to-r from-sky-600/90 to-indigo-600/90" />
      <div className="flex flex-col items-center p-4 -mt-8 text-center">
        <Image
          src={user.image || "/profile.png"}
          alt="Profile photo"
          width={64}
          height={64}
          className="rounded-full border-4 border-neutral-900 shadow-sm"
        />

        {/* Name */}
        <h2 className="mt-2 text-lg font-semibold">
          {user.name || "Unnamed User"}
        </h2>

        {/* Headline / Title */}
        <p className="text-sm text-neutral-400">
          {user.headline ?? (
            <span className="italic text-neutral-500">
              Add your role or tech stack
            </span>
          )}
        </p>

        {/* Location */}
        <p className="text-xs text-neutral-500 mt-1">
          {user.location ?? (
            <span className="italic">
              Add your location
            </span>
          )}
        </p>

        {/* Stats */}
        <div className="flex gap-4 mt-4 py-1">
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-white">0</span>
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">Followers</span>
          </div>
          <div className="w-px h-8 bg-neutral-800 self-center" />
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-white">0</span>
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">Following</span>
          </div>
        </div>
      </div>


    </div>
  );
}
