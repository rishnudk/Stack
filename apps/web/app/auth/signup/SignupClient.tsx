"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Github, Linkedin } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function SignupClient() {
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validationError, setValidationError] = useState("");
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    const register = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError("");

        // Validate passwords match
        if (password !== confirmPassword) {
            setValidationError("Passwords do not match");
            return;
        }

        // Validate password length
        if (password.length < 6) {
            setValidationError("Password must be at least 6 characters");
            return;
        }

        setIsLoading("credentials");

        const res = await fetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({ name, email, password }),
            headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
            await signIn("credentials", { email, password, callbackUrl: "/feed" });
        } else {
            setIsLoading(null);
            setValidationError("Registration failed. Please try again.");
        }
    };

    const handleSignIn = async (provider: string) => {
        setIsLoading(provider);
        await signIn(provider, { callbackUrl: "/feed" });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Stack
                    </h1>
                    <p className="text-neutral-400 text-lg">Create your account</p>
                </div>

                {/* Error */}
                {(error || validationError) && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-center text-red-400 text-sm">
                        {validationError || "Something went wrong. Try again."}
                    </div>
                )}

                {/* Signup Form */}
                <form onSubmit={register} className="space-y-4">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                        required
                        className="w-full bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        className="w-full bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        minLength={6}
                        className="w-full bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />

                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        required
                        minLength={6}
                        className="w-full bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />

                    <button
                        type="submit"
                        disabled={isLoading !== null}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl px-4 py-3 transition-all disabled:opacity-50"
                    >
                        {isLoading === "credentials" ? "Creating account..." : "Sign Up"}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-800"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-neutral-900/50 text-neutral-500">
                            Or sign up with
                        </span>
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
               

                {/* Sign In Link */}
                <p className="text-center text-neutral-500 text-sm mt-6">
                    Already have an account?{" "}
                    <a href="/auth/signin" className="text-blue-400 hover:underline">
                        Sign in
                    </a>
                </p>

                {/* Footer */}
                <p className="text-center text-neutral-500 text-xs mt-6">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </p>

            </div>
        </div>
    );
}
