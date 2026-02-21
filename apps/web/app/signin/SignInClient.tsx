"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Github, Linkedin } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaLinkedin } from "react-icons/fa";


export default function SignInClient() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleSignIn = async (provider: string) => {
    setIsLoading(provider);
    await signIn(provider, { callbackUrl: "/feed" });
  };

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading("credentials");

    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/feed",
    });

    if (result?.error) setIsLoading(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 shadow-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Stack
          </h1>
          <p className="text-neutral-400 text-lg">Sign in to continue</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-center text-red-400 text-sm">
            Authentication error. Please try again.
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleCredentialsSignIn} className="space-y-4 mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />

          <button
            type="submit"
            disabled={isLoading !== null}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl px-4 py-3 transition-all disabled:opacity-50"
          >
            {isLoading === "credentials" ? "Signing in..." : "Sign In"}
          </button>
        </form>


        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-neutral-900/50 text-neutral-500">Or continue with</span>
          </div>
        </div>

        {/* SOCIAL ICON BUTTONS (HORIZONTAL) */}
        <div className="flex flex-wrap items-center justify-center gap-4">

          <button
            onClick={() => handleSignIn("google")}
            disabled={isLoading !== null}
            className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-all shadow-sm disabled:opacity-50"
          >
            <FcGoogle size={28} />
          </button>

          <button
            onClick={() => handleSignIn("github")}
            disabled={isLoading !== null}
            className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-all shadow-sm disabled:opacity-50"
          >
            <FaGithub size={28} className="text-white" />
          </button>

          <button
            onClick={() => handleSignIn("linkedin")}
            disabled={isLoading !== null}
            className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-all shadow-sm disabled:opacity-50"
          >
            <FaLinkedin size={28} className="text-blue-500" />
          </button>



        </div>

        {/* SIGN UP LINK — MUST BE OUTSIDE BUTTON ROW */}
        <p className="text-center text-neutral-500 text-sm mt-6">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-400 hover:underline">
            Sign up
          </a>
        </p>



        {/* Footer */}
        <p className="text-center text-neutral-500 text-sm mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>

        <div className="text-center mt-6">
          <a href="/" className="text-neutral-400 hover:text-white text-sm">
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
