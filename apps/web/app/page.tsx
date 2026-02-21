import Hero from "./landing/Hero";
import Navbar from "./landing/Navbar";
import { BentoSection } from "app/landing/BentoSection";
import { TestimonialsCard } from "@/components/ui/testimonials-card";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const testimonials = [
  {
    id: 1,
    title: "Sarah Wilson",
    description: "Incredible product! It exceeded all my expectations.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "David Chen",
    description: "The best investment I've made this year.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Emily Rodriguez",
    description: "The interface is so intuitive and beautiful. Love it!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
  },
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
        <TestimonialsCard items={testimonials} width={500} autoPlay={true} />
      </div>
    </div>
  );
}
