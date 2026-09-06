"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import {
  Calendar,
  Clock,
  MapPin,
  X,
  CheckCircle2,
  ShieldCheck,
  Star,
  User,
  Mail,
  Phone,
  Activity,
  CreditCard,
  Smartphone,
  Check,
  Lock,
  ChevronRight,
  Sparkles,
  CalendarDays
} from "lucide-react";
import { toast } from "sonner";
import Script from "next/script";
import Image from "next/image";
import type { Doctor } from "@/types";
import { loadRazorpayScript } from "@/lib/razorpay";

interface BookingModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  initialDate?: string;
}

export function BookingModal({ doctor, onClose, initialDate }: BookingModalProps) {
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientContact, setPatientContact] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [disease, setDisease] = useState("");
  const [showCustomDate, setShowCustomDate] = useState(false);

  // Payment method selection & options (UPI or Card)
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card">("upi");
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>("gpay");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [saveCard, setSaveCard] = useState(true);
  const [confirmedPaymentMethod, setConfirmedPaymentMethod] = useState("");

  const [modalStep, setModalStep] = useState<"details" | "success" | "error">("details");
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedPaymentId, setConfirmedPaymentId] = useState("");
  const [emailPreview, setEmailPreview] = useState("");

  // Quick date options generator (Today, +1 day, +2 days, etc.)
  const quickDates = React.useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split("T")[0];
      const dayName = i === 0 ? "Today" : i === 1 ? "Tmrw" : d.toLocaleDateString("en-US", { weekday: "short" });
      const monthStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      dates.push({ iso, label: dayName, sub: monthStr });
    }
    return dates;
  }, []);

  const timeSlots = {
    morning: ["09:00 AM", "10:30 AM", "11:45 AM"],
    afternoon: ["02:00 PM", "03:30 PM", "05:00 PM", "06:30 PM"],
  };

  // Pre-fill user details from session and set default date
  useEffect(() => {
    if (doctor) {
      setModalStep("details");
      const targetDate = initialDate || quickDates[0]?.iso || "";
      setBookingDate(targetDate);
      setBookingTime("10:30 AM");
      setIsProcessing(false);
      setShowCustomDate(Boolean(initialDate && !quickDates.some((q) => q.iso === initialDate)));

      // Attempt to pre-fill session user
      fetch("/api/auth/session")
        .then((res) => res.json())
        .then((data) => {
          if (data?.user?.name && !patientName) {
            setPatientName(data.user.name);
          }
          if (data?.user?.name && !cardHolder) {
            setCardHolder(data.user.name);
          }
          if (data?.user?.email && !patientEmail) {
            setPatientEmail(data.user.email);
          }
        })
        .catch(() => {});
    }
  }, [doctor, quickDates, initialDate]);

  // Card brand detection helper
  const getCardBrand = (num: string) => {
    const clean = num.replace(/\s+/g, "");
    if (clean.startsWith("4")) return "Visa";
    if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return "Mastercard";
    if (/^(60|65|35)/.test(clean)) return "RuPay";
    if (/^3[47]/.test(clean)) return "Amex";
    return null;
  };

  const handleCardNumberChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  const handleExpiryChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      setCardExpiry(`${digits.slice(0, 2)}/${digits.slice(2, 4)}`);
    } else {
      setCardExpiry(digits);
    }
  };

  const handleCvvChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    setCardCvv(digits);
  };

  const handleSimulatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor) return;

    if (!bookingDate) {
      toast.error("Please select an appointment date");
      return;
    }
    if (!bookingTime) {
      toast.error("Please select a time slot");
      return;
    }

    // Validate based on payment method
    if (paymentMethod === "card") {
      const cleanNum = cardNumber.replace(/\s/g, "");
      if (cleanNum.length < 15) {
        toast.error("Please enter a valid 16-digit card number");
        return;
      }
      if (!cardExpiry || cardExpiry.length < 4) {
        toast.error("Please enter card expiry date (MM/YY)");
        return;
      }
      if (!cardCvv || cardCvv.length < 3) {
        toast.error("Please enter a valid 3-digit CVV");
        return;
      }
    } else if (paymentMethod === "upi") {
      if (selectedUpiApp === "bhim" && upiId && !upiId.includes("@")) {
        toast.error("Please enter a valid UPI ID (e.g. name@bank)");
        return;
      }
    }

    const appName =
      selectedUpiApp === "gpay"
        ? "Google Pay"
        : selectedUpiApp === "phonepe"
        ? "PhonePe"
        : selectedUpiApp === "paytm"
        ? "Paytm"
        : selectedUpiApp === "bhim"
        ? "BHIM UPI"
        : "UPI App";

    const methodSummary =
      paymentMethod === "upi"
        ? `UPI (${appName}${upiId ? ` • ${upiId}` : ""})`
        : `Card (${getCardBrand(cardNumber) || "Credit/Debit"} ending in •••• ${
            cardNumber.replace(/\s/g, "").slice(-4) || "4242"
          })`;

    setConfirmedPaymentMethod(methodSummary);
    setIsProcessing(true);

    try {
      // 1. Create order on server
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId: doctor.id }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.error || "Order creation failed");
      }

      // If simulated order (when user hasn't pasted API keys yet in .env)
      if (orderData.isSimulated) {
        toast.info(`Test Mode: Simulating ${paymentMethod === "upi" ? "UPI" : "Card"} payment...`);
        
        const simPayId = `pay_sim_${Date.now()}`;
        setConfirmedPaymentId(simPayId);

        // Verify simulated payment
        await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: orderData.id,
            razorpay_payment_id: simPayId,
            razorpay_signature: "simulated_signature",
          }),
        });

        // Save appointment
        const res = await fetch("/api/appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            doctorId: doctor.id,
            date: bookingDate,
            startTime: bookingTime,
            disease,
            patientName: patientName || "Verified Patient",
            patientContact: patientContact || "+91 98765 43210",
            email: patientEmail,
            fee: doctor.fee ? `₹${doctor.fee.toLocaleString()}` : "₹1,500",
            paymentId: simPayId,
            paymentMethod: methodSummary,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.emailPreviewUrl) setEmailPreview(data.emailPreviewUrl);
          setModalStep("success");
          toast.success("Appointment successfully booked!");
        } else {
          setModalStep("error");
        }
        setIsProcessing(false);
        return;
      }

      // 2. Real Razorpay checkout flow
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded || typeof (window as any).Razorpay === "undefined") {
        toast.error("Unable to load Razorpay payment SDK. Please check your internet connection.");
        setIsProcessing(false);
        return;
      }

      const keyId = orderData.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "MediBook",
        description: `Consultation with ${doctor.user.name}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            setConfirmedPaymentId(response.razorpay_payment_id);
            // Verify payment signature
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.verified) {
              toast.error("Payment verification failed. Please contact support.");
              setModalStep("error");
              setIsProcessing(false);
              return;
            }

            // Save confirmed appointment
            const res = await fetch("/api/appointments", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                doctorId: doctor.id,
                date: bookingDate,
                startTime: bookingTime,
                disease,
                patientName,
                patientContact,
                email: patientEmail,
                fee: doctor.fee ? `₹${doctor.fee.toLocaleString()}` : "₹1,500",
                paymentId: response.razorpay_payment_id,
                paymentMethod: methodSummary,
              }),
            });

            if (res.ok) {
              const data = await res.json();
              if (data.emailPreviewUrl) setEmailPreview(data.emailPreviewUrl);
              setModalStep("success");
              toast.success("Payment verified and appointment confirmed!");
            } else {
              setModalStep("error");
            }
          } catch (e) {
            console.error("Post-payment error:", e);
            setModalStep("error");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: patientName,
          email: patientEmail,
          contact: patientContact,
          method: paymentMethod === "upi" ? "upi" : "card",
          vpa: paymentMethod === "upi" && upiId ? upiId : undefined,
        },
        theme: { color: "#2563eb" },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast.info("Payment window closed.");
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        toast.error(response?.error?.description || "Payment failed. Please try again.");
        setIsProcessing(false);
      });
      rzp.open();
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error(error?.message || "Booking failed");
      setModalStep("error");
      setIsProcessing(false);
    }
  };

  const doctorFee = doctor?.fee || 2000;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Modal
        isOpen={!!doctor}
        onClose={onClose}
        className="max-w-xl sm:max-w-2xl rounded-[32px] overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900"
        contentClassName="p-0"
      >
        {doctor && modalStep === "details" && (
          <div className="flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-[11px] font-bold text-blue-600 dark:text-blue-400 mb-1">
                  <Sparkles className="size-3" />
                  Instant Booking
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Schedule Consultation
                </h2>
              </div>
              <button
                onClick={onClose}
                className="size-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form
              onSubmit={handleSimulatePayment}
              className="overflow-y-auto px-6 py-5 space-y-6 flex-1 scrollbar-thin"
            >
              {/* Doctor Spotlight Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/70 via-slate-50 to-indigo-50/40 dark:from-slate-800/90 dark:via-slate-800 dark:to-slate-800/60 border border-blue-100/80 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative size-16 rounded-2xl overflow-hidden ring-2 ring-white dark:ring-slate-700 shadow-sm shrink-0">
                    <img
                      src={doctor.user.image}
                      alt={doctor.user.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 size-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-800" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                        {doctor.user.name}
                      </h3>
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded-md">
                        <ShieldCheck className="size-3" />
                        Verified
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {doctor.specialization}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1 font-medium">
                        <Star className="size-3.5 fill-amber-400 text-amber-400" />
                        4.9 (140+ reviews)
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        {doctor.hospitalName || "Central Clinic"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 dark:border-slate-700 text-left sm:text-right shrink-0">
                  <span className="text-[11px] font-medium text-slate-400 block">
                    Consultation Fee
                  </span>
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                    ₹{doctorFee.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* 1. Date Selection (Interactive Chips) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-blue-600" />
                    Select Date
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCustomDate(!showCustomDate)}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <CalendarDays className="size-3.5" />
                    {showCustomDate ? "Quick Dates" : "Choose Custom"}
                  </button>
                </div>

                {showCustomDate ? (
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="grid grid-cols-5 gap-2">
                    {quickDates.map((item) => {
                      const isSelected = bookingDate === item.iso;
                      return (
                        <button
                          key={item.iso}
                          type="button"
                          onClick={() => setBookingDate(item.iso)}
                          className={`py-2.5 px-2 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer border ${
                            isSelected
                              ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 font-bold scale-[1.02]"
                              : "bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:border-blue-300"
                          }`}
                        >
                          <span className="text-[11px] uppercase font-bold opacity-80">
                            {item.label}
                          </span>
                          <span className="text-xs font-extrabold mt-0.5">
                            {item.sub}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 2. Time Slot Selection (Interactive Grid) */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="size-3.5 text-blue-600" />
                  Select Time Slot
                </label>

                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Morning
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.morning.map((slot) => {
                      const isSelected = bookingTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setBookingTime(slot)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                              : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:border-blue-300"
                          }`}
                        >
                          <Clock className="size-3 opacity-60" />
                          <span>{slot}</span>
                        </button>
                      );
                    })}
                  </div>

                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block pt-1">
                    Afternoon & Evening
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.afternoon.map((slot) => {
                      const isSelected = bookingTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setBookingTime(slot)}
                          className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center justify-center gap-1 ${
                            isSelected
                              ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                              : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:border-blue-300"
                          }`}
                        >
                          <span>{slot}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 3. Patient Details (Clean 2-Column Grid) */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <User className="size-3.5 text-blue-600" />
                  Patient Details
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Patient Name */}
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      required
                      placeholder="Patient Full Name"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                    />
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={patientContact}
                      onChange={(e) => setPatientContact(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                    />
                  </div>

                  {/* Reason for Visit */}
                  <div className="relative">
                    <Activity className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      required
                      placeholder="Reason for visit / symptoms"
                      value={disease}
                      onChange={(e) => setDisease(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Payment Method Selection (Pay with Card or UPI) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="size-3.5 text-blue-600 dark:text-blue-400" />
                    Payment Method
                  </label>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="size-3.5" /> 100% Secure & Refundable
                  </span>
                </div>

                {/* 2 Tabs: Pay with UPI | Pay with Card */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      paymentMethod === "upi"
                        ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs ring-1 ring-slate-200/80 dark:ring-slate-600"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Smartphone className="size-3.5" />
                    <span>Pay with UPI</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 font-extrabold">
                      Instant
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      paymentMethod === "card"
                        ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs ring-1 ring-slate-200/80 dark:ring-slate-600"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <CreditCard className="size-3.5" />
                    <span>Pay with Card</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/50 font-extrabold">
                      Visa / MC
                    </span>
                  </button>
                </div>

                {/* --- A. UPI SECTION OPTIONS --- */}
                {paymentMethod === "upi" && (
                  <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-3 animate-in fade-in-50 duration-150">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                      Choose Your UPI App
                    </span>

                    {/* Quick Apps Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: "gpay", name: "Google Pay", color: "from-blue-500 to-emerald-500", badge: "GPay" },
                        { id: "phonepe", name: "PhonePe", color: "from-purple-600 to-indigo-600", badge: "Pe" },
                        { id: "paytm", name: "Paytm UPI", color: "from-sky-500 to-blue-600", badge: "Paytm" },
                        { id: "bhim", name: "BHIM / Other", color: "from-orange-500 to-emerald-600", badge: "BHIM" },
                      ].map((app) => {
                        const isSelected = selectedUpiApp === app.id;
                        return (
                          <button
                            key={app.id}
                            type="button"
                            onClick={() => {
                              setSelectedUpiApp(app.id);
                              const baseHandle = patientContact ? patientContact.replace(/\D/g, "").slice(-10) : "patient";
                              if (app.id === "gpay" && !upiId) setUpiId(`${baseHandle}@okhdfcbank`);
                              if (app.id === "phonepe" && !upiId) setUpiId(`${baseHandle}@ybl`);
                              if (app.id === "paytm" && !upiId) setUpiId(`${baseHandle}@paytm`);
                            }}
                            className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                              isSelected
                                ? "bg-white dark:bg-slate-700 border-blue-500 ring-2 ring-blue-500/20 shadow-xs"
                                : "bg-white/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                            }`}
                          >
                            <span className={`size-6 rounded-lg bg-gradient-to-br ${app.color} text-white font-extrabold text-[10px] flex items-center justify-center shadow-2xs`}>
                              {app.badge}
                            </span>
                            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                              {app.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Enter Custom UPI ID */}
                    <div className="space-y-1.5 pt-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">
                        Or enter UPI ID / VPA
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. 9876543210@upi or rahul@okhdfcbank"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full h-10 px-3.5 pr-20 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {upiId && upiId.includes("@") && (
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                            <Check className="size-2.5" /> Valid
                          </span>
                        )}
                      </div>

                      {/* Quick Suffix Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <span className="text-[10px] text-slate-400 font-medium">Quick handles:</span>
                        {["@okhdfcbank", "@okaxis", "@ybl", "@paytm"].map((handle) => (
                          <button
                            key={handle}
                            type="button"
                            onClick={() => {
                              const base = upiId.includes("@") ? upiId.split("@")[0] : (upiId || (patientContact.replace(/\D/g, "").slice(-10) || "patient"));
                              setUpiId(`${base}${handle}`);
                            }}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 hover:bg-blue-50 hover:text-blue-600 text-slate-600 dark:text-slate-300 font-semibold transition-colors cursor-pointer"
                          >
                            {handle}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* --- B. CARD SECTION OPTIONS --- */}
                {paymentMethod === "card" && (
                  <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-3 animate-in fade-in-50 duration-150">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        Card Details
                      </span>
                      <div className="flex items-center gap-1 text-[10px] font-extrabold text-slate-400">
                        <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">VISA</span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">MC</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">RuPay</span>
                      </div>
                    </div>

                    {/* Card Number */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="4532 •••• •••• 8910"
                          value={cardNumber}
                          onChange={(e) => handleCardNumberChange(e.target.value)}
                          maxLength={19}
                          className="w-full h-10 px-3.5 pr-16 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {getCardBrand(cardNumber) && (
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">
                            {getCardBrand(cardNumber)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Cardholder Name */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        placeholder="Cardholder full name"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Expiry & CVV */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM / YY"
                          value={cardExpiry}
                          onChange={(e) => handleExpiryChange(e.target.value)}
                          maxLength={5}
                          className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          CVV / CVC
                        </label>
                        <input
                          type="password"
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) => handleCvvChange(e.target.value)}
                          maxLength={4}
                          className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                        />
                      </div>
                    </div>

                    {/* Save card checkbox */}
                    <label className="flex items-center gap-2 pt-0.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={saveCard}
                        onChange={(e) => setSaveCard(e.target.checked)}
                        className="rounded size-3.5 accent-blue-600 cursor-pointer"
                      />
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Securely save card for faster future visits (RBI tokenized)
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* 5. Payment Fee Breakdown Box */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>Consultation Fee</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    ₹{doctorFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>Selected Method</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {paymentMethod === "upi" ? `UPI (${selectedUpiApp === "gpay" ? "Google Pay" : selectedUpiApp === "phonepe" ? "PhonePe" : selectedUpiApp === "paytm" ? "Paytm" : "BHIM"})` : `Credit/Debit Card (${getCardBrand(cardNumber) || "Visa/Mastercard"})`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>Platform & Processing Fee</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    FREE (₹0)
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200/70 dark:border-slate-700 flex items-center justify-between text-sm font-extrabold text-slate-900 dark:text-white">
                  <span>Total Payable</span>
                  <span className="text-blue-600 dark:text-blue-400 text-base">
                    ₹{doctorFee.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* 6. Security Trust Badge */}
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <Lock className="size-3.5 text-emerald-500" />
                <span>Secured by 256-bit Razorpay Encryption • Free Cancellation</span>
              </div>

              {/* Submit CTA */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full h-13 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? (
                    <span>Processing Payment...</span>
                  ) : (
                    <>
                      {paymentMethod === "upi" ? (
                        <Smartphone className="size-4" />
                      ) : (
                        <CreditCard className="size-4" />
                      )}
                      <span>
                        Pay ₹{doctorFee.toLocaleString()} via {paymentMethod === "upi" ? "UPI" : "Card"} & Confirm
                      </span>
                      <ChevronRight className="size-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Success Screen */}
        {modalStep === "success" && (
          <div className="p-8 text-center space-y-5">
            <div className="mx-auto size-20 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/10 ring-8 ring-emerald-50/50">
              <CheckCircle2 className="size-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Booking Confirmed
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                Your Appointment is Scheduled!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1.5">
                We've reserved your consultation with {doctor?.user?.name || "your doctor"}. A confirmation receipt has been sent to your email.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 max-w-md mx-auto text-left space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Doctor:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {doctor?.user?.name || "Doctor"} ({doctor?.specialization || "Specialist"})
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Schedule:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {bookingDate} at {bookingTime}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Patient:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {patientName || "Rahul Sharma"}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Amount Paid:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{doctorFee.toLocaleString()} (Paid)
                </span>
              </div>
              {confirmedPaymentMethod && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Payment Mode:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {confirmedPaymentMethod}
                  </span>
                </div>
              )}
              {confirmedPaymentId && (
                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200/60 dark:border-slate-700">
                  <span className="text-slate-400 font-medium">Transaction ID:</span>
                  <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300">
                    {confirmedPaymentId}
                  </span>
                </div>
              )}
            </div>

            {emailPreview && (
              <a
                href={emailPreview}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-block"
              >
                View Ethereal Email Confirmation ↗
              </a>
            )}

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Error Screen */}
        {modalStep === "error" && (
          <div className="p-8 text-center space-y-5">
            <div className="mx-auto size-18 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-3xl flex items-center justify-center shadow-lg shadow-rose-500/10">
              <X className="size-9" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Booking Could Not Be Completed
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                There was an issue processing your payment or scheduling the visit. No charges were made.
              </p>
            </div>
            <div className="flex gap-3 max-w-xs mx-auto pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setModalStep("details")}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
