"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ProfileTopBarProps {
  name: string;
  avatar: string;
  followers: number;
  following: number;
}

export function ProfileTopBar({
  name,
  avatar,
  followers,
  following,
}: ProfileTopBarProps) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-800 p-4">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <Image
          src={avatar}
          alt={name}
          width={48}
          height={48}
          className="rounded-full"
        />

        <div>
          <h2 className="text-lg font-semibold">{name}</h2>
          <p className="text-sm text-zinc-400">
            {followers} follower • {following} following
          </p>
        </div>
      </div>

      {/* Right section */}
      <Button
        variant="outline"
        className="border-zinc-700 bg-zinc-900 hover:bg-zinc-800"
      >
        Edit Profile
      </Button>
    </div>
  );
}