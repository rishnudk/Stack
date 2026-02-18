import { HeroSection } from "./landing/HeroSection";
// import LandingPagegrid from "./landing/LandingPageGrid";
// import {TestimonialSection} from "./landing/TestimonialSection";
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
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#3B82F6]/30">
      {/* <Navbar /> */}
      <HeroSection />
      {/* <LandingPagegrid /> */}
      {/* <TestimonialSection /> */}

    </div>
  );
}
