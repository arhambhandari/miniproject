"use client";

import { useState } from "react";
import Link from "next/link";
import { HeartPulse, ArrowLeft, Mail } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call for now (no transactional email set up yet)
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-8">
        <Link href="/login" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-6">
          <ArrowLeft className="size-4 mr-1" /> Back to login
        </Link>
        
        <div className="flex justify-center mb-6">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-500">
            <HeartPulse className="size-6" />
          </span>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">Forgot password?</h2>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-8 text-sm">
          No worries, we'll send you reset instructions.
        </p>

        {submitted ? (
          <div className="text-center space-y-6">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl flex flex-col items-center border border-emerald-100 dark:border-emerald-800">
              <Mail className="size-8 text-emerald-600 dark:text-emerald-400 mb-3" />
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                Reset instructions sent to {email}
              </p>
            </div>
            <Link href="/login" className="block w-full">
              <Button className="w-full">Return to log in</Button>
            </Link>
          </div>
        ) : (
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
            
            <div className="pt-2">
              <Button disabled={loading} type="submit" className="w-full" size="lg">
                {loading ? "Sending..." : "Reset password"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
