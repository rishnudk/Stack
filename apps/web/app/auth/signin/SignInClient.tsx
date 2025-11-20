"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Github } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function SignInClient() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleSignIn = async (provider: string) => {
    setIsLoading(provider);
    await signIn(provider, { callbackUrl: "/feed" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Sign In Card */}
        <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
              Stack
            </h1>
            <p className="text-neutral-400 text-lg">Sign in to continue</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl">
              <p className="text-red-400 text-sm text-center">
                {error === "OAuthSignin" && "Error occurred during sign in"}
                {error === "OAuthCallback" && "Error occurred during callback"}
                {error === "OAuthCreateAccount" && "Could not create account"}
                {error === "EmailCreateAccount" && "Could not create account"}
                {error === "Callback" && "Error occurred during callback"}
                {error === "Default" && "An error occurred. Please try again."}
              </p>
            </div>
          )}

          {/* Sign In Buttons */}
          <div className="space-y-4">
            {/* GitHub Button */}
            <button
              onClick={() => handleSignIn("github")}
              disabled={isLoading !== null}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-neutral-600 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading === "github" ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Github size={20} />
              )}
              <span>Continue with GitHub</span>
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-neutral-900/50 text-neutral-500">or</span>
              </div>
            </div>

            {/* Google Button */}
            <button
              onClick={() => handleSignIn("google")}
              disabled={isLoading !== null}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-gray-100 text-black rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading === "google" ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-neutral-500 text-sm mt-8">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-neutral-400 hover:text-white transition-colors text-sm"
          >
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
