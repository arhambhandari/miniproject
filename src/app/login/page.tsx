"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HeartPulse } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

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
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-8">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <HeartPulse className="size-6" />
            </span>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">MediBook</span>
          </Link>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-8">Welcome back</h2>

        {isRegistered && (
          <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 p-3 rounded-xl text-sm font-medium mb-6 border border-emerald-100 dark:border-emerald-800 text-center">
            Registration successful! Please log in.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            id="email"
            label="EMAIL ADDRESS"
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com" 
          />
          
          <div className="space-y-1">
            <div className="flex items-center justify-end">
              <Link href="/forgot-password" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">Forgot password?</Link>
            </div>
            <Input 
              id="password"
              label="PASSWORD"
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
            />
          </div>

          <div className="pt-2">
            <Button disabled={loading} type="submit" className="w-full" size="lg">
              {loading ? "Signing in..." : "Log in"}
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Don't have an account? <Link href="/register" className="text-blue-600 dark:text-blue-400 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
