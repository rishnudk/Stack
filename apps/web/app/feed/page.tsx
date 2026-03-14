import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import FeedClient from "./FeedClient";

export default async function FeedPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gray-50">
      <FeedClient session={session} />
    </div>
  );
}
