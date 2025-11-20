import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Github } from "lucide-react";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  // Redirect authenticated users to feed
  if (session) {
    redirect("/feed");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center space-y-8">
          {/* Logo/Brand */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
              Stack
            </h1>
            <p className="text-xl md:text-2xl text-neutral-400 font-light">
              Connect, Share, and Build Together
            </p>
          </div>

          {/* Description */}
          <p className="text-neutral-500 max-w-2xl mx-auto text-lg">
            Join our community of developers, creators, and innovators. Share your thoughts, 
            connect with like-minded people, and stay updated with the latest trends.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link
              href="/auth/signin"
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl w-full sm:w-auto"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
            </Link>

            <Link
              href="/auth/signin"
              className="px-8 py-4 border-2 border-neutral-700 rounded-full font-semibold text-lg hover:border-neutral-500 hover:bg-neutral-900 transition-all duration-300 w-full sm:w-auto"
            >
              Sign In
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
            <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Share Ideas</h3>
              <p className="text-neutral-500">Post updates, share thoughts, and engage with the community</p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-neutral-500">Build meaningful connections with developers worldwide</p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Grow Together</h3>
              <p className="text-neutral-500">Learn, collaborate, and grow your network</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
