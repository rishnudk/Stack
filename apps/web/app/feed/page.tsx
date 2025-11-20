import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import  FeedClient  from "./FeedClient";

export default async function FeedPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }
 
  return (
    <div className="min-h-screen bg-gray-50">
      <FeedClient session={session} />
    </div>
  );
}
