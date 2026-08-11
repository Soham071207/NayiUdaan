"use client";

import { useState } from "react";
import Link from "next/link";
import { Bird, ArrowRight, Loader2, Mail, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { loginWithGoogle, loginWithEmail, isAuthenticated, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      await loginWithGoogle();
      // Only set to false if we successfully navigated or logged in (if not redirecting)
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log in with Google");
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await loginWithEmail(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log in");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 font-jakarta">
      {/* Left panel - Image/Branding */}
      <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-violet-600 to-purple-800 p-12 relative overflow-hidden">
        {/* Texture overlay */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] bg-[size:24px_24px] mix-blend-overlay" />
        
        {/* Decorative background shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] rounded-full bg-violet-400 blur-3xl translate-x-1/3 translate-y-1/3"></div>
        </div>

        <Link href="/" className="relative z-10 w-full max-w-md flex flex-col items-center justify-center group bg-white rounded-[2rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)]">
          <img src="/logo.png" alt="NayiUdaan Logo" className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
      </div>

      {/* Right panel - Form */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-[#F5FAF4]">
        {/* Mobile Logo */}
        <Link href="/" className="md:hidden flex items-center gap-2.5 mb-12">
          <img src="/logo.png" alt="NayiUdaan" className="h-10 object-contain" />
        </Link>

        <div className="w-full max-w-sm mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Log In</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="text-[var(--primary)] font-semibold hover:underline">
                Sign up for free
              </Link>
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              type="button"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-200 bg-[var(--bg-light)] text-gray-700 font-semibold transition-all hover:bg-gray-50 hover:-translate-y-0.5 shadow-sm disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Continue with Google
            </button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or continue with email</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 bg-[var(--bg-light)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-violet-600 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <Link href="#" className="text-sm font-medium text-[var(--primary)] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 bg-[var(--bg-light)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-violet-600 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl btn-primary text-white font-semibold transition-all hover:-translate-y-0.5 shadow-purple-md disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
