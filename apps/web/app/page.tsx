import Hero from "./landing/components/Hero";
import Navbar from "./landing/components/Navbar";
import { BentoGridDemo } from "./landing/components/BentoGrid";
import { GlowingGrid } from "./landing/components/GlowingGrid";
import { MinimalFooter } from "./landing/components/MinimalFooter";
import { SmoothScroll } from "./landing/components/SmoothScroll";
import { BentoSection } from "./landing/components/BentoSection";
import { TestimonialMarquee } from "./landing/components/Marquee";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import FlowingMenu from "@/components/ui/FlowingMenu";
import { testimonials, demoItems } from "./landing/components/Testimonials";


export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  // Redirect authenticated users to feed
  if (session) {
    redirect("/feed");
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#3B82F6]/30 dark">
      <SmoothScroll />
      <Navbar />
      <Hero />
      {/* <BentoGridDemo /> */}
      <GlowingGrid />
      <div className="container mx-auto pb-24">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
          What our users say
        </h2>
        <TestimonialMarquee testimonials={testimonials} />
      </div>
      <MinimalFooter />
    </div>
  );
}

