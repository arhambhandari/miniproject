"use client";

import { useState } from "react";
import Link from "next/link";
import { HeartPulse, User, Stethoscope } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [loading, setLoading] = useState(false);
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
        window.location.href = "/login?registered=true";
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <HeartPulse className="size-6" />
            </span>
            <span className="font-bold text-xl text-slate-900">MediBook</span>
          </Link>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-6">Create an account</h2>

        {/* Role Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-lg mb-8">
          <button 
            type="button"
            onClick={() => setRole("patient")}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${role === "patient" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            I'm a Patient
          </button>
          <button 
            type="button"
            onClick={() => setRole("doctor")}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${role === "doctor" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            I'm a Doctor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">FULL NAME</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder={role === "doctor" ? "Dr. Jane Doe" : "Jane Doe"} className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">EMAIL ADDRESS</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="jane@example.com" className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">PASSWORD</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" />
          </div>

          {role === "doctor" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">WHAT KIND OF DOCTOR ARE YOU? (SPECIALTY)</label>
                <select name="specialty" value={formData.specialty} onChange={handleChange} required className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm">
                  <option value="">Select specialty...</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="dermatology">Dermatology</option>
                  <option value="pediatrics">Pediatrics</option>
                  <option value="oncology">Oncology</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">HOSPITAL OR CLINIC NAME</label>
                <input type="text" name="hospitalName" value={formData.hospitalName} onChange={handleChange} required placeholder="General Hospital" className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">CLINIC LOCATION (CITY/ZIP)</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} required placeholder="New York, NY 10001" className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" />
              </div>
            </>
          )}

          <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors mt-6 disabled:opacity-50">
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
