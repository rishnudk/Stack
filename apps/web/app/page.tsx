import Hero from "./landing/components/Hero";
import Navbar from "./landing/components/Navbar";
import { BentoSection } from "./landing/components/BentoSection";
import { TestimonialMarquee } from "./landing/components/Marquee";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import FlowingMenu from "@/components/ui/FlowingMenu";

const testimonials = [
  {
    name: "Sarah Wilson",
    username: "@sarah_wilson",
    content: "Incredible product! It exceeded all my expectations.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "David Chen",
    username: "@david_chen",
    content: "The best investment I've made this year. High quality and works perfectly.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Emily Rodriguez",
    username: "@emily_r",
    content: "The interface is so intuitive and beautiful. Love it!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "James Smith",
    username: "@jsmith",
    content: "Finally a tool that understands what I need. Highly recommend!",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Lisa Wong",
    username: "@lisawong",
    content: "A game changer for my daily workflow. Extremely happy with the results.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Michael Brown",
    username: "@mbrown",
    content: "Exceptional service and user experience. Truly impressive work.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
  },
];

const demoItems = [
  { link: '#', text: 'Mojave', image: 'https://picsum.photos/600/400?random=1' },
  { link: '#', text: 'Sonoma', image: 'https://picsum.photos/600/400?random=2' },
  { link: '#', text: 'Monterey', image: 'https://picsum.photos/600/400?random=3' },
  { link: '#', text: 'Sequoia', image: 'https://picsum.photos/600/400?random=4' }
];

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
      <div className="container mx-auto pb-24">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
          What our users say
        </h2>
        <TestimonialMarquee testimonials={testimonials} />
      </div>
      <div style={{ height: '600px', position: 'relative' }}>
        <FlowingMenu items={demoItems}
          speed={15}
          textColor="#ffffff"
          bgColor="#060010"
          marqueeBgColor="#ffffff"
          marqueeTextColor="#060010"
          borderColor="#ffffff"
        />
      </div>
    </div>
  );
}

