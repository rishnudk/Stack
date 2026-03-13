"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import type { Session } from "next-auth";
import { useState } from "react";
import VerifyModal from "./VerifyModal";

interface ProfileCardProps {
  session?: Session | null;
}

export default function ProfileCard({ session: propSession }: ProfileCardProps) {
  const { data: sessionData } = useSession();
  const session = propSession || sessionData;

  const [open, setOpen] = useState(false);

  const { data: userData } = trpc.users.getSidebarInfo.useQuery(
    { userId: session?.user?.id },
    { enabled: !!session?.user?.id }
  );

  const user = userData?.user;

  if (!user) {
    return (
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 h-40 animate-pulse" />
    );
  }

  return (
    <>
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-5 text-center text-white">
        
        {/* Avatar */}
        <div className="flex justify-center mb-3">
          <Image
            src={user.image || "/profile.png"}
            alt="Profile"
            width={60}
            height={60}
            className="rounded-full"
          />
        </div>

        {/* Title */}
        <h3 className="text-xl italic font-serif">
          Verify Identity!
        </h3>

        {/* Description */}
        <p className="text-sm text-neutral-400 mt-2">
          Get verified on Stack to boost your search ranking.
        </p>

        {/* Button */}
        <button
          onClick={() => setOpen(true)}
          className="mt-4 bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-neutral-200 transition"
        >
          Get Verified →
        </button>
      </div>

      <VerifyModal user={user} open={open} setOpen={setOpen} />
    </>
  );
}