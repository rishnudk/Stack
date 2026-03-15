import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LeftSidebar } from '@/components/layout/left-sidebar/LeftSidebar';
import { RightSidebar } from '@/components/layout/right-sidebar/RightSidebar';
import { ArticleActions } from "../feed/components/article/ArticleActions";

export default async function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="flex justify-center min-h-screen bg-black text-white">
      <div className="flex w-full max-w-7xl">
        {/* Left Sidebar */}
        <aside className="hidden lg:block w-[320px] p-4">
          <LeftSidebar session={session} />
        </aside>

        {/* Main Content Section */}
        <main className="flex-1 flex flex-col items-center border-x border-neutral-800">
           <div className="w-full max-w-[700px] min-h-screen">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
