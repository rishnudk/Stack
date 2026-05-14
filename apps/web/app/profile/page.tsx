import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LeftSidebar } from '@/components/layout/left-sidebar/LeftSidebar';
import { ProfileContent } from "./components/ProfileContent";
import { DevStatsSidebar } from "./components/right-tab/DevStatsSidebar";


type Props = {
  searchParams: { userId?: string, edit?: string, tab?: string, projectId?: string }
}

export default async function ProfilePage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  const targetUserId = searchParams.userId || session.user.id;

  const isOwnProfile = targetUserId === session.user.id;

  let initialTab: any = 'posts';
  if (searchParams.edit === 'true') {
    initialTab = 'edit-profile';
  } else if (searchParams.tab) {
    initialTab = searchParams.tab;
  }

  return (
    <div className="flex justify-center min-h-screen bg-black text-white">
      <div className="flex w-full max-w-7xl">
        {/* Left Sidebar */}
        <aside className="hidden lg:block w-[280px] p-4">
          <LeftSidebar session={session} />
        </aside>

        {/* Profile Content */}
        <main className="flex-1 flex justify-center">
          <div className="w-full max-w-[600px] px-4 py-0">
            <ProfileContent
              userId={targetUserId}
              isOwnProfile={isOwnProfile}
              initialTab={initialTab}
              initialProjectId={searchParams.projectId}
            />
          </div>
        </main>

        {/* Developer Stats Sidebar */}
        <aside className="hidden lg:block w-[320px] p-3">
          <DevStatsSidebar userId={targetUserId} />
        </aside>
      </div>
    </div>
  );
}
