"use client";

import { useState } from "react";
import Link from "next/link";
import { HeartPulse } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialty: "",
    hospitalName: "",
    location: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          specialty: formData.specialty,
          hospitalName: formData.hospitalName,
          location: formData.location,
        })
      });
      if (res.ok) {
        router.push("/login?registered=true");
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-8">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <HeartPulse className="size-6" />
            </span>
            <span className="font-bold text-xl text-slate-900 dark:text-white">MediBook</span>
          </Link>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-6">Create an account</h2>

        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl mb-8 border border-slate-200 dark:border-slate-800">
          <button 
            type="button"
            onClick={() => setRole("patient")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${role === "patient" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
          >
            I'm a Patient
          </button>
          <button 
            type="button"
            onClick={() => setRole("doctor")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${role === "doctor" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
          >
            I'm a Doctor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="FULL NAME"
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            placeholder={role === "doctor" ? "Dr. Jane Doe" : "Jane Doe"} 
          />
          <Input 
            label="EMAIL ADDRESS"
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            placeholder="jane@example.com" 
          />
          <Input 
            label="PASSWORD"
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            placeholder="••••••••" 
          />

          {role === "doctor" && (
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-700 mt-4">
              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">WHAT KIND OF DOCTOR ARE YOU? (SPECIALTY)</label>
                <select id="specialty" name="specialty" value={formData.specialty} onChange={handleChange} required className="w-full flex h-11 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                  <option value="">Select specialty...</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="dermatology">Dermatology</option>
                  <option value="pediatrics">Pediatrics</option>
                  <option value="oncology">Oncology</option>
                </select>
              </div>
              <Input 
                label="HOSPITAL OR CLINIC NAME"
                name="hospitalName" 
                value={formData.hospitalName} 
                onChange={handleChange} 
                required 
                placeholder="General Hospital" 
              />
              <Input 
                label="CLINIC LOCATION (CITY/ZIP)"
                name="location" 
                value={formData.location} 
                onChange={handleChange} 
                required 
                placeholder="New York, NY 10001" 
              />
            </div>
          )}

          <div className="pt-4">
            <Button disabled={loading} type="submit" className="w-full" size="lg">
              {loading ? "Creating account..." : "Register"}
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account? <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
