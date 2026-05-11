import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LeftSidebar } from '@/components/layout/left-sidebar/LeftSidebar';
import { RightSidebar } from '@/components/layout/right-sidebar/RightSidebar';

export default async function GroupLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex justify-center min-h-screen bg-black">
      <div className="flex w-full max-w-7xl">
        {/* Left Sidebar */}
        <aside className="hidden lg:block w-[320px] p-4">
          <LeftSidebar session={session} />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex justify-center">
          <div className="w-full max-w-[700px] px-4 py-0">
            {children}
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
