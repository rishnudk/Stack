import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import SignInClient from "./SignInClient";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  // Redirect authenticated users to feed
  if (session) {
    redirect("/feed");
  }

  return <SignInClient />;
}
