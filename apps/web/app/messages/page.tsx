import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LeftSidebar } from "../feed/components/LeftSidebar/LeftSidebar";
// We will create this component in the next step!
import MessagesInterface from "././MessagesInterface";

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="flex justify-center min-h-screen bg-black text-white">
      <div className="flex w-full max-w-7xl">
        {/* Reuse the Left Sidebar from Feed */}
        <aside className="hidden lg:block w-[320px] p-4">
          <LeftSidebar session={session} />
        </aside>

        {/* Messaging Area */}
        <main className="flex-1 flex flex-col h-screen border-l border-neutral-800">
          <MessagesInterface session={session} />
        </main>
      </div>
    </div>
  );
}