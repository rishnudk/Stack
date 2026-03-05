"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;

  if (!session)
    return (
      <div className="flex flex-col gap-2">
        <button onClick={() => signIn("github")} className="bg-gray-800 text-white px-4 py-2 rounded">Sign in with GitHub</button>
        <button onClick={() => signIn("google")} className="bg-red-500 text-white px-4 py-2 rounded">Sign in with Google</button>
      </div>
    );

  return (
    <div className="flex items-center gap-3">
      <img src={session.user?.image ?? "/next.svg"} width={32} height={32} className="rounded-full" />
      <span>{session.user?.name ?? session.user?.email}</span>
      <button onClick={() => signOut()} className="bg-gray-700 text-white px-4 py-2 rounded">Sign Out</button>
    </div>
  );
}
