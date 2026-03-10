'use client';
import type { Session } from 'next-auth';
import { LeftSidebar } from '@/components/layout/left-sidebar/LeftSidebar';
import { RightSidebar } from '@/components/layout/right-sidebar/RightSidebar';
import { FeedBox } from './components/feedbox/FeedBox';
import { trpc } from '@/utils/trpc';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface FeedClientProps {
  session: Session;
}

export default function FeedClient({ session }: FeedClientProps) {
  const { data: updateSession } = useSession();
  const { data: userInfo, isLoading } = trpc.users.getSidebarInfo.useQuery({});
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!isLoading && userInfo?.user && !userInfo.user.onboardingCompleted) {
      setShowOnboarding(true);
    }
  }, [isLoading, userInfo]);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
  };

  return (
    <div className="flex justify-center min-h-screen bg-black">
      <div className="flex w-full max-w-7xl">
        {/* Left Sidebar */}
        <aside className="hidden lg:block w-[320px] p-4">
          <LeftSidebar session={session} />
        </aside>

        {/* Feed Section */}
        <main className="flex-1 flex justify-center">
          <div className="w-full max-w-[700px] px-4 py-0">
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
