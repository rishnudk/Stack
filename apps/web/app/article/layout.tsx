import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LeftSidebar } from '@/components/layout/left-sidebar/LeftSidebar';

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

        {/* Content Section (No Right Sidebar) */}
        <main className="flex-1 flex justify-center w-full min-w-0 border-x border-neutral-800">
          <div className="w-full max-w-3xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
