import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { LeftSidebar } from "../feed/components/LeftSidebar/LeftSidebar";
import { ProfileContent } from "./components/ProfileContent";
import { DevStatsSidebar } from "./components/DevStatsSidebar";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
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
            <ProfileContent userId={session.user.id} isOwnProfile={true} />
          </div>
        </main>

        {/* Developer Stats Sidebar */}
        <aside className="hidden lg:block w-[320px] p-3">
          <DevStatsSidebar userId={session.user.id} />
        </aside>
      </div>
    </div>
  );
}
