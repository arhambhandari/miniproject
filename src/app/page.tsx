"use client";

import Link from "next/link";
import Script from "next/script";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/components/LanguageContext";
import { Calendar, Search, MapPin, Star, Clock, ChevronRight, CheckCircle, Stethoscope, Video, HeartPulse, ChevronDown, ShieldCheck, X, CreditCard, QrCode, CalendarCheck, MessageSquareHeart, Menu } from "lucide-react";
import { toast } from "sonner";

type Doctor = {
  id: string;
  specialization: string;
  experience: number;
  satisfaction: number;
  fee?: number;
  nextAvailable: string;
  user: {
    name: string;
    image: string;
  }
};

export default function Home() {
  const { t } = useLanguage();
  
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [modalStep, setModalStep] = useState<"details" | "payment" | "success" | "error">("details");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card");
  
  // Form State
  const [patientName, setPatientName] = useState("");
  const [patientContact, setPatientContact] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [disease, setDisease] = useState("");
  const [consultationType, setConsultationType] = useState<"video" | "in-person">("video");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [emailPreview, setEmailPreview] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchSpecialty, setSearchSpecialty] = useState("");

  // Fetch doctors for the "Top-rated specialists" section
  const fetchDoctors = async (params = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/doctors?sort=HIGHEST%20RATED${params}`);
      if (res.ok) {
        const data = await res.json();
        setDoctors(data);
      } else {
        console.error("API returned an error:", res.status);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append("q", searchQuery);
    // location is ignored for the mock since we don't have location in mock DB yet, but could be added
    if (searchSpecialty) params.append("specialty", searchSpecialty);
    
    fetchDoctors("&" + params.toString());
    
    // Scroll to doctors section
    const el = document.getElementById("doctors");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate || !bookingTime || !patientName || !patientContact) return;
    setModalStep("payment");
  };

  const handleSimulatePayment = async () => {
    if (!selectedDoctor) return;
    setIsProcessing(true);

    try {
      // 1. Create Order
      const amount = selectedDoctor.fee || 1500;
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) throw new Error(orderData.error || "Order creation failed");

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder", 
        amount: orderData.amount,
        currency: orderData.currency,
        name: "MediBook",
        description: `Consultation with ${selectedDoctor.user.name}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          // 3. Finalize Booking on Success
          try {
            const res = await fetch("/api/appointments", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                doctorId: selectedDoctor.id,
                date: bookingDate,
                startTime: bookingTime,
                disease: disease,
                patientName,
                patientContact,
                email: patientEmail,
                fee: `₹${amount.toLocaleString()}`,
                paymentId: response.razorpay_payment_id
              }),
            });
            
            if (res.ok) {
              const data = await res.json();
              if (data.emailPreviewUrl) setEmailPreview(data.emailPreviewUrl);
              setModalStep("success");
            } else {
              setModalStep("error");
            }
          } catch (e) {
            setModalStep("error");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: patientName,
          email: patientEmail,
          contact: patientContact,
        },
        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        toast.error(`Payment Failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      rzp.open();

    } catch (error) {
      console.error("Booking error:", error);
      setModalStep("error");
      setIsProcessing(false);
    }
  };

  const closeModal = () => {
    setSelectedDoctor(null);
    setModalStep("details");
    setBookingDate("");
    setBookingTime("");
    setPatientName("");
    setPatientContact("");
    setPatientEmail("");
    setDisease("");
    setEmailPreview("");
  };

  const downloadReceipt = async () => {
    if (!selectedDoctor) return;
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      doc.setFont("helvetica");
      doc.setFontSize(22);
      doc.text("MediBook Receipt", 20, 20);
      doc.setFontSize(12);
      doc.text(`Patient: ${patientName}`, 20, 40);
      doc.text(`Doctor: Dr. ${selectedDoctor.user.name}`, 20, 50);
      doc.text(`Specialty: ${selectedDoctor.specialization}`, 20, 60);
      doc.text(`Date: ${bookingDate}`, 20, 70);
      doc.text(`Time: ${bookingTime}`, 20, 80);
      doc.text(`Fee: ${selectedDoctor.fee ? `₹${selectedDoctor.fee.toLocaleString()}` : "₹1,500"} INR`, 20, 90);
      doc.text("Thank you for using MediBook!", 20, 110);
      doc.save(`receipt-${patientName.replace(/\s+/g, '-')}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF", err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4">
          <Link className="flex items-center gap-2" href="/">
            <span className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white">
              <HeartPulse className="size-5" />
            </span>
            <span className="font-bold text-lg tracking-tight text-slate-900">MediBook</span>
          </Link>
          <nav className="ml-4 hidden items-center gap-1 md:flex">
            <Link className="rounded-lg px-3 py-2 text-sm font-medium transition-colors bg-slate-100 text-slate-900" href="/">Home</Link>
            <a href="#doctors" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900">{t("find_doctor")}</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link href="/login" className="hidden sm:inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 hover:bg-slate-100 text-slate-700 transition-colors">
              {t("login")}
            </Link>
            <Link href="/register" className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white shadow hover:bg-blue-700 h-9 px-4 py-2 transition-colors">
              {t("get_started")}
            </Link>
            <button 
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors ml-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
            <Link className="block rounded-lg px-3 py-2 text-sm font-medium bg-slate-50 text-slate-900" href="/">Home</Link>
            <a href="#doctors" onClick={() => setIsMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Find a doctor</a>
            <div className="h-px bg-slate-200 my-2"></div>
            <Link href="/login" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Log in</Link>
            <Link href="/dashboard" className="block rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50">Patient Dashboard</Link>
            <Link href="/doctor/dashboard" className="block rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50">Doctor Dashboard</Link>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-white">
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-24">
            <div>
              <div className="inline-flex items-center border font-semibold border-transparent bg-blue-50 text-blue-700 mb-5 gap-1.5 rounded-full px-3 py-1 text-xs">
                <ShieldCheck className="size-3.5" />
                Verified doctors · Instant confirmation
              </div>
              <h1 className="text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl text-slate-900 tracking-tight">
                {t("hero_title").split(',')[0]}, <span className="text-blue-600">{t("hero_title").split(',')[1]}</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-slate-600">
                {t("hero_subtitle")}
              </p>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="rounded-xl border bg-white shadow-lg shadow-slate-200/50 mt-8 p-4">
                <div className="grid gap-3 sm:grid-cols-[1.2fr_1fr_1fr_auto]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent pl-9 transition-shadow" 
                      placeholder={t("search_placeholder")} 
                    />
                  </div>
                  <div className="relative">
                    <input 
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow" 
                      placeholder="Location (e.g. New York)" 
                    />
                  </div>
                  <div className="relative">
                    <select 
                      value={searchSpecialty}
                      onChange={(e) => setSearchSpecialty(e.target.value)}
                      className="flex h-10 w-full appearance-none items-center justify-between rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-shadow pr-8"
                    >
                      <option value="">Specialty</option>
                      <option value="cardiology">Cardiology</option>
                      <option value="dermatology">Dermatology</option>
                      <option value="pediatrics">Pediatrics</option>
                      <option value="neuro-oncology">Neuro-Oncology</option>
                      <option value="surgical oncology">Surgical Oncology</option>
                      <option value="radiation oncology">Radiation Oncology</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  <button type="submit" className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-6 text-sm font-medium text-white shadow hover:bg-blue-700 transition-colors">
                    {t("search_btn")}
                  </button>
                </div>
              </form>

              {/* Stats */}
              <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-slate-500 font-medium">
                <span className="flex items-center gap-2">
                  <Stethoscope className="size-4 text-emerald-500" /> 6+ specialists
                </span>
                <span className="flex items-center gap-2">
                  <Star className="size-4 text-amber-400 fill-amber-400" /> 4.8 average rating
                </span>
                <span className="flex items-center gap-2">
                  <CalendarCheck className="size-4 text-blue-500" /> Same-week openings
                </span>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200" 
                alt="Doctor consulting" 
                className="aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl shadow-slate-200" 
              />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 lg:py-24">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">How MediBook works</h2>
          <p className="mt-2 max-w-2xl text-slate-500 text-lg">Three steps from symptom to specialist — for patients and practices alike.</p>
          
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow p-6">
              <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Search className="size-6" />
              </span>
              <h3 className="text-xl font-semibold text-slate-900">Find the right doctor</h3>
              <p className="mt-2 text-slate-500 leading-relaxed">
                Filter by specialty, location, fee and rating to shortlist clinicians who fit your needs.
              </p>
            </div>
            
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow p-6">
              <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <CalendarCheck className="size-6" />
              </span>
              <h3 className="text-xl font-semibold text-slate-900">Pick a live slot</h3>
              <p className="mt-2 text-slate-500 leading-relaxed">
                See each doctor's real weekly availability and reserve a slot with a note about your symptoms.
              </p>
            </div>
            
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow p-6">
              <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <MessageSquareHeart className="size-6" />
              </span>
              <h3 className="text-xl font-semibold text-slate-900">Stay connected</h3>
              <p className="mt-2 text-slate-500 leading-relaxed">
                Message your care team before and after the visit, and track every appointment in your dashboard.
              </p>
            </div>
          </div>
        </section>

        {/* Doctors List */}
        <section id="doctors" className="border-y border-slate-200/70 bg-white">
          <div className="mx-auto w-full max-w-6xl px-4 py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Top-rated specialists</h2>
                <p className="mt-2 text-slate-500 text-lg">A snapshot of clinicians accepting new patients this week.</p>
              </div>
              <Link href="/doctors" className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                Browse all doctors
              </Link>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 flex flex-col animate-pulse">
                      <div className="flex gap-4 mb-4">
                        <div className="size-16 rounded-full bg-slate-200 shrink-0"></div>
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-col gap-2">
                        <div className="h-4 bg-slate-200 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                      </div>
                      <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
                        <div className="h-10 bg-slate-200 rounded-md flex-1"></div>
                        <div className="h-10 bg-slate-200 rounded-md flex-1"></div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                doctors.map((doc, i) => {
                  const nameParts = doc.user.name.replace("Dr. ", "").split(" ");
                  const initials = nameParts.length >= 2 ? nameParts[0][0] + nameParts[1][0] : nameParts[0][0];
                  const colors = [
                    { bg: "bg-blue-100", text: "text-blue-700" },
                    { bg: "bg-emerald-100", text: "text-emerald-700" },
                    { bg: "bg-purple-100", text: "text-purple-700" }
                  ];
                  const color = colors[i % colors.length];

                  return (
                    <div key={doc.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col">
                      <div className="flex gap-4 mb-4">
                        {doc.user.image ? (
                          <img src={doc.user.image} alt={doc.user.name} className="size-16 rounded-full object-cover shrink-0 border border-slate-200" />
                        ) : (
                          <div className={`size-16 rounded-full flex items-center justify-center font-bold text-xl shrink-0 ${color.bg} ${color.text}`}>
                            {initials}
                          </div>
                        )}
                        <div className="flex flex-col justify-center">
                          <Link href={`/doctors/${doc.id}`} className="hover:underline flex items-center gap-1.5">
                            <h3 className="font-bold text-lg text-slate-900 leading-tight">
                              {doc.user.name}
                            </h3>
                            <ShieldCheck className="size-4 text-blue-500" />
                          </Link>
                          <p className="text-slate-500 font-medium">{doc.specialization}</p>
                        </div>
                      </div>
                      
                      <p className="mt-4 line-clamp-2 text-sm text-slate-500 flex-grow">
                        Highly rated specialist with {doc.experience} years of experience. Current patient satisfaction rating is {doc.satisfaction}%. Next available appointment on {doc.nextAvailable}.
                      </p>
                      
                      <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
                        <span className="font-bold text-slate-900 text-lg">{doc.fee ? `₹${doc.fee.toLocaleString()}` : '₹1,500'} <span className="text-sm font-normal text-slate-500">/ visit</span></span>
                        <button 
                          onClick={() => setSelectedDoctor(doc)}
                          className="inline-flex h-9 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow hover:bg-blue-700 transition-colors"
                        >
                          Book now
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-white py-16 lg:py-24 border-t border-slate-200">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">What our patients say</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { name: "Sarah Jenkins", role: "Patient", quote: "I was able to find a specialist and book an appointment for the very next day. The process was incredibly smooth." },
                { name: "David Chen", role: "Patient", quote: "No more waiting on hold with receptionists. MediBook lets me manage my health on my own schedule." },
                { name: "Dr. Amanda Torres", role: "Cardiologist", quote: "The doctor dashboard has completely streamlined my practice. I spend less time on admin and more time with patients." }
              ].map((testimonial, i) => (
                <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex text-amber-400 mb-4">
                      <Star className="size-4 fill-current" /><Star className="size-4 fill-current" /><Star className="size-4 fill-current" /><Star className="size-4 fill-current" /><Star className="size-4 fill-current" />
                    </div>
                    <p className="text-slate-700 italic mb-6">"{testimonial.quote}"</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                    <span className="text-sm text-slate-500">{testimonial.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-slate-50 py-16 lg:py-24 border-t border-slate-200">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "How do I book an appointment?", a: "Simply search for a doctor by name or specialty, click 'Book appointment', choose an available time slot, and confirm your details. It takes less than a minute." },
                { q: "Is my medical data safe?", a: "Yes. We use industry-standard encryption to protect your personal and medical information. Your data is never shared with third parties without your explicit consent." },
                { q: "What is the cancellation policy?", a: "You can cancel any appointment up to 24 hours before the scheduled time for a full refund. Cancellations made within 24 hours may be subject to a fee." },
                { q: "Are the doctors verified?", a: "Absolutely. Every doctor on our platform goes through a rigorous vetting process where we verify their medical license, qualifications, and clinical experience." }
              ].map((faq, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{faq.q}</h3>
                  <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-4 py-8 text-sm text-slate-500 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center">
        <span>© 2024 MediBook. For demonstration purposes.</span>
        <div className="flex gap-6 mt-4 sm:mt-0">
          <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
        </div>
      </footer>

      {/* Booking Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-lg">
                {modalStep === "details" && "Patient Details"}
                {modalStep === "payment" && "Secure Payment"}
                {modalStep === "success" && "Confirmed"}
                {modalStep === "error" && "Error"}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X className="size-5" />
              </button>
            </div>
            
            <div className="p-6 border-b border-slate-100 flex items-center gap-4">
              {selectedDoctor.user.image ? (
                <img src={selectedDoctor.user.image} alt="Doctor" className="size-12 rounded-xl object-cover border border-slate-200 shadow-sm" />
              ) : (
                <div className="size-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  {selectedDoctor.user.name[0]}
                </div>
              )}
              <div>
                <div className="font-bold text-slate-900">{selectedDoctor.user.name}</div>
                <div className="text-sm font-medium text-blue-600">{selectedDoctor.specialization}</div>
              </div>
            </div>

            <div className="p-6">
              {/* STEP 1: DETAILS */}
              {modalStep === "details" && (
                <form onSubmit={handleProceedToPayment} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">PATIENT FULL NAME</label>
                      <input 
                        type="text" required value={patientName} onChange={(e) => setPatientName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 text-sm placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">CONTACT NUMBER</label>
                      <input 
                        type="tel" required value={patientContact} onChange={(e) => setPatientContact(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 text-sm placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">EMAIL ADDRESS</label>
                    <input 
                      type="email" required value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)}
                      placeholder="patient@example.com"
                      className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 text-sm placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">CONSULTATION TYPE</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setConsultationType("video")}
                        className={`py-2 px-3 text-xs font-semibold rounded-md border flex items-center justify-center gap-2 transition-colors ${
                          consultationType === "video" 
                            ? "bg-blue-50 text-blue-700 border-blue-600" 
                            : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                        }`}
                      >
                        <Video className="size-4" /> Video Call
                      </button>
                      <button
                        type="button"
                        onClick={() => setConsultationType("in-person")}
                        className={`py-2 px-3 text-xs font-semibold rounded-md border flex items-center justify-center gap-2 transition-colors ${
                          consultationType === "in-person" 
                            ? "bg-blue-50 text-blue-700 border-blue-600" 
                            : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                        }`}
                      >
                        <MapPin className="size-4" /> In-Person
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 mt-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">DATE</label>
                        <input 
                          type="date" 
                          required
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">SELECT TIME</label>
                        <div className="grid grid-cols-2 gap-2">
                          {["09:00 AM", "10:30 AM", "01:00 PM", "03:30 PM"].map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setBookingTime(slot)}
                              className={`py-2 text-xs font-semibold rounded-md border transition-colors ${
                                bookingTime === slot 
                                  ? "bg-blue-600 text-white border-blue-600" 
                                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                        {/* Hidden input to ensure form validation requires a time */}
                        <input type="hidden" required value={bookingTime} />
                      </div>
                    </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">DISEASE / SYMPTOMS</label>
                    <textarea 
                      rows={2} required value={disease} onChange={(e) => setDisease(e.target.value)}
                      placeholder="Briefly describe your condition..."
                      className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 text-sm resize-none placeholder:text-slate-400"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors mt-4 flex justify-center items-center gap-2 shadow-sm"
                  >
                    Proceed to Payment
                  </button>
                </form>
              )}

              {/* STEP 2: PAYMENT */}
              {modalStep === "payment" && (
                <div className="space-y-6">
                  <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center border border-slate-100">
                    <div>
                      <div className="text-xs font-semibold text-slate-500 mb-1">CONSULTATION FEE</div>
                      <div className="font-bold text-2xl text-slate-900">{selectedDoctor?.fee ? `₹${selectedDoctor.fee.toLocaleString()}.00` : '₹1,500.00'}</div>
                    </div>
                    <CreditCard className="size-8 text-blue-600/30" />
                  </div>

                  {/* Payment Method Tabs */}
                  <div className="flex border border-slate-200 rounded-lg p-1 bg-slate-50">
                    <button 
                      onClick={() => setPaymentMethod("card")}
                      className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${paymentMethod === "card" ? "bg-white text-slate-900 shadow-sm border border-slate-200/50" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      Card
                    </button>
                    <button 
                      onClick={() => setPaymentMethod("upi")}
                      className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${paymentMethod === "upi" ? "bg-white text-slate-900 shadow-sm border border-slate-200/50" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      UPI
                    </button>
                  </div>

                  <div className="space-y-4">
                    {paymentMethod === "card" ? (
                      <>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">CARD NUMBER</label>
                          <div className="relative">
                            <input 
                              type="text" placeholder="•••• •••• •••• ••••"
                              className="w-full border border-slate-200 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 text-sm placeholder:text-slate-400"
                            />
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">EXPIRY</label>
                            <input 
                              type="text" placeholder="MM/YY"
                              className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 text-sm placeholder:text-slate-400"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">CVC</label>
                            <input 
                              type="text" placeholder="123"
                              className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 text-sm placeholder:text-slate-400"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">UPI ID (VPA)</label>
                        <div className="relative">
                          <input 
                            type="text" placeholder="username@upi"
                            className="w-full border border-slate-200 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 text-sm placeholder:text-slate-400"
                          />
                          <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        </div>
                        <p className="text-slate-500 mt-2 text-xs text-center font-medium">
                          A payment request will be sent to your UPI app.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => setModalStep("details")}
                      className="w-1/3 border border-slate-300 text-slate-700 font-medium py-3 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handleSimulatePayment}
                      disabled={isProcessing}
                      className="w-2/3 bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                      {isProcessing ? "Processing..." : "Pay & Book"}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: SUCCESS */}
              {modalStep === "success" && (
                <div className="text-center py-8">
                  <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
                    <CalendarCheck className="size-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h4>
                  <p className="text-slate-600 mb-6">
                    {patientName}, your consultation on <span className="font-semibold text-slate-900">{bookingDate}</span> at <span className="font-semibold text-slate-900">{bookingTime}</span> has been securely booked.
                  </p>
                  {emailPreview && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 text-sm">
                      <p className="text-blue-800 font-medium mb-2">A confirmation email was sent!</p>
                      <a href={emailPreview} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-700">
                        View Email Preview (Ethereal)
                      </a>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button onClick={downloadReceipt} className="w-1/2 border border-slate-300 text-slate-700 font-medium py-3 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                      Download Receipt
                    </button>
                    <button onClick={closeModal} className="w-1/2 bg-slate-900 text-white font-medium py-3 rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
                      Done
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: ERROR */}
              {modalStep === "error" && (
                <div className="text-center py-8">
                  <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
                    <X className="size-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-2">Booking Failed</h4>
                  <p className="text-slate-600 mb-8">We could not process your appointment. Please try again.</p>
                  <button onClick={() => setModalStep("payment")} className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
