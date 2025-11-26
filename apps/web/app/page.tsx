import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Github } from "lucide-react";
import HeroSection from "./landing/components/HeroSection";
import BentoGridSection from "./landing/components/BentoGridSection";
import DeveloperProfileSection from "./landing/components/DeveloperProfileSection";
import FeedSection from "./landing/components/FeedSection";
import GroupsSection from "./landing/components/GroupsSection";
import InstitutesSection from "./landing/components/InstitutesSection";
import OpenSourceSection from "./landing/components/OpenSourceSection";
import JobBoardSection from "./landing/components/JobBoardSection";
import FinalCTA from "./landing/components/FinalCTA";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  // Redirect authenticated users to feed
  if (session) {
    redirect("/feed");
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <HeroSection />
      <BentoGridSection />
      <DeveloperProfileSection />
      <FeedSection />
      <GroupsSection />
      <InstitutesSection />
      <OpenSourceSection />
      <JobBoardSection />
      <FinalCTA />
    </div>
  );
}
