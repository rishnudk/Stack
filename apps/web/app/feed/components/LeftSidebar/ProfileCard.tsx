"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";

export default function ProfileCard() {
  const { data: session } = useSession();
  const { data: userData } = trpc.users.getSidebarInfo.useQuery(
    { userId: session?.user?.id },
    { enabled: !!session?.user?.id }
  );

  const user = userData?.user;

  if (!user) {
    return (
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden text-white h-48 animate-pulse" />
    );
  }

  return (
    <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden text-white">
      {/* Cover Image */}
      <div className="h-16 bg-gradient-to-r from-sky-600/90 to-indigo-600/90" />

      {/* Profile Section */}
      <div className="flex flex-col items-center p-4 -mt-8">
        <Image
          src={user.image || "/profile.png"}
          alt="Profile photo" 
          width={64}
          height={64}
          className="rounded-full border-4 border-neutral-900 shadow-sm"
        />
        <h2 className="mt-2 text-lg font-semibold text-white">{user.name || "User"}</h2>
        <p className="text-sm text-neutral-400 text-center">
          {user.email}
        </p>
      </div>
    </div>
  );
}
