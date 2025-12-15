'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@repo/ui/card';
import { Avatar, AvatarFallback } from '@repo/ui/avatar';
import { Badge } from '@repo/ui/badge';
import { Separator } from '@repo/ui/separator';
import type { Session } from 'next-auth';

import { LeftSidebar } from './components/LeftSidebar/LeftSidebar';
import { RightSidebar } from './components/RightSidebar/RightSidebar';
import { FeedBox } from './components/feedbox/FeedBox';

interface FeedClientProps {
  session: Session;
}

export default function FeedClient({ session }: FeedClientProps) {
  return (
    <div className="flex justify-center min-h-screen bg-black">
      <div className="flex w-full max-w-7xl">
        {/* Left Sidebar */}
        <aside className="hidden lg:block w-[320px] p-4">
          <LeftSidebar session={session} />
        </aside>

        {/* Feed Section */}
        <main className="flex-1 flex justify-center">
          <div className="w-full max-w-[600px] px-4 py-0">
            <FeedBox />
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:block w-[320px] p-3">
          <RightSidebar session={session} />
        </aside>
      </div>
    </div>

  );
}
