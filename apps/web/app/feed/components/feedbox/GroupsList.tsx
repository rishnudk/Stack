'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@repo/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/avatar'
import { trpc } from '@/utils/trpc'

interface Group {
  id: string;
  name: string;
  description: string | null;
  memberCount: number;
  image: string | null;
}

export function GroupsList() {
  const router = useRouter();
  const { data: groups, isLoading, error } = trpc.groups.getGroups.useQuery();

  const handleGroupClick = (groupId: string) => {
    router.push(`/feed?groupId=${groupId}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-neutral-800 bg-black animate-pulse">
            <div className="h-12 w-12 rounded-full bg-neutral-800" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-neutral-800 rounded w-1/3" />
              <div className="h-3 bg-neutral-800 rounded w-2/3" />
              <div className="h-3 bg-neutral-800 rounded w-1/4" />
            </div>
            <div className="h-9 w-20 bg-neutral-800 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-red-500 font-semibold">Failed to load groups</p>
        <p className="text-neutral-400 text-sm mt-2">{error.message}</p>
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-neutral-400">No groups available</p>
        <p className="text-neutral-500 text-sm mt-2">Be the first to create one!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {groups.map((group) => (
        <div
          key={group.id}
          onClick={() => handleGroupClick(group.id)}
          className="flex items-center gap-4 p-4 border-b border-neutral-800 bg-black hover:bg-neutral-900/50 transition-colors cursor-pointer"
        >
          <Avatar className="h-12 w-12">
            <AvatarImage src={group.image || undefined} alt={group.name} />
            <AvatarFallback>{group.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white hover:underline">{group.name}</h3>
              <span className="text-neutral-500 text-sm">@{group.name.replace(/\s+/g, '').toLowerCase()}</span>
            </div>
            <p className="text-neutral-400 text-sm mt-0.5">{group.description || 'No description'}</p>
            <p className="text-neutral-500 text-xs mt-2">{group.memberCount.toLocaleString()} members</p>
          </div>
          <Button
            variant="secondary"
            className="rounded-full px-6 py-1.5 font-bold bg-white text-black hover:bg-[#e7e7e8] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleGroupClick(group.id);
            }}
          >
            Join
          </Button>
        </div>
      ))}
    </div>
  )
}
