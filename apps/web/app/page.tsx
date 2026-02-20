import Hero from "./landing/Hero";
import Navbar from "./landing/Navbar";
import { BentoSection } from "@/components/landing/BentoSection";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  // Redirect authenticated users to feed
  if (session) {
    redirect("/feed");
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#3B82F6]/30 dark">
      <Navbar />
      <Hero />
      <BentoSection />
    </div>
  );
}
