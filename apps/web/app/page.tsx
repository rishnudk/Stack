import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Github } from "lucide-react";
import HeroSection from "./landing/components/HeroSection";
import BentoGridSection from "./landing/components/BentoGridSection";
import TestimonialsSection from "./landing/components/TestimonialsSection";
import FinalCTA from "./landing/components/FinalCTA";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  // Redirect authenticated users to feed
  if (session) {
    redirect("/feed");
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#3B82F6]/30">
      <HeroSection />
      <BentoGridSection />
      <TestimonialsSection />
      <FinalCTA />
    </div>
  );
}
