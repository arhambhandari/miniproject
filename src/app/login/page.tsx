"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HeartPulse } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("registered=true")) {
      setIsRegistered(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        toast.error("Invalid credentials");
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <HeartPulse className="size-6" />
            </span>
            <span className="text-xl font-bold tracking-tight text-slate-900">MediBook</span>
          </Link>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-slate-900 mb-8">Welcome back</h2>

        {isRegistered && (
          <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg text-sm font-medium mb-6 border border-emerald-100 text-center">
            Registration successful! Please log in.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">EMAIL ADDRESS</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com" 
              className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" 
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">PASSWORD</label>
              <a href="#" className="text-xs font-medium text-blue-600 hover:underline">Forgot password?</a>
            </div>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" 
            />
          </div>

          <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors mt-6 disabled:opacity-50">
            {loading ? "Signing in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
