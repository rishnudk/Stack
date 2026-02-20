<<<<<<< Updated upstream
import Hero from "./landing/Hero";
import Navbar from "./landing/Navbar";
// import LandingPagegrid from "./landing/LandingPageGrid";
// import {TestimonialSection} from "./landing/TestimonialSection";
=======
<<<<<<< Updated upstream
=======
import Navbar from "./landing/Navbar";
import Hero from "./landing/Hero";
// import LandingPagegrid from "./landing/LandingPageGrid";
// import {TestimonialSection} from "./landing/TestimonialSection";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
>>>>>>> Stashed changes
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
>>>>>>> Stashed changes
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
      {/* <LandingPagegrid /> */}
      {/* <TestimonialSection /> */}

    </div>
  );
}
