"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ProfileTopBarProps {
    name: string;
    avatar: string;
    followers: number;
    following: number;
    isOwnProfile?: boolean;
    onEditProfile?: () => void;
}

export function ProfileTopBar({
    name,
    avatar,
    followers,
    following,
    isOwnProfile,
    onEditProfile,
}: ProfileTopBarProps) {
    return (
        <div className="flex items-center justify-between border-b border-zinc-800 p-4">
            {/* Left section */}
            <div className="flex items-center gap-4">
                <Image
                    src={avatar}
                    alt={name}
                    width={42}
                    height={42}
                    className="rounded-full"
                />

                <div>
                    <h2 className="text-md font-semibold">{name}</h2>
                    <p className="text-sm text-zinc-400">
                        {followers} follower • {following} following
                    </p>
                </div>
            </div>

            {/* Right section */}
            {isOwnProfile && (
                <Button
                    onClick={onEditProfile}
                    variant="outline"
                    className="border-zinc-700 bg-zinc-900 hover:bg-zinc-800"
                >
                    Edit Profile
                </Button>
            )}
        </div>
    );
}
