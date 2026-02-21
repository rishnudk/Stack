import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignupClient from "./SignupClient";

export default async function SignupPage() {
    const session = await getServerSession(authOptions);

    // Redirect authenticated users to feed
    if (session) {
        redirect("/feed");
    }

    return <SignupClient />;
}
