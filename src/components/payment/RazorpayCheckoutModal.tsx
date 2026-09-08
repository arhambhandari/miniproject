"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building2,
  QrCode,
  Lock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Copy,
  Check,
  Sparkles,
  ChevronRight,
  Info,
  Volume2
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { playPaymentSuccessSound, playTickSound } from "@/lib/sound";

interface RazorpayCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  amount: number; // in INR
  doctorName: string;
  patientName: string;
  patientEmail?: string;
  patientContact?: string;
  onSuccess: (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    method: string;
  }) => void;
  onFailure?: (errorMessage: string) => void;
}

type PaymentTab = "upi" | "card" | "netbanking";
type CheckoutStage = "select_method" | "bank_otp" | "processing" | "success" | "failure";

export function RazorpayCheckoutModal({
  isOpen,
  onClose,
  orderId,
  amount,
  doctorName,
  patientName,
  patientEmail = "patient@example.com",
  patientContact = "+91 98765 43210",
  onSuccess,
  onFailure,
}: RazorpayCheckoutModalProps) {
  const [activeTab, setActiveTab] = useState<PaymentTab>("upi");
  const [stage, setStage] = useState<CheckoutStage>("select_method");
  const [selectedUpiOption, setSelectedUpiOption] = useState<"qr" | "gpay" | "phonepe" | "paytm" | "id">("qr");
  const [vpaId, setVpaId] = useState("patient@okhdfcbank");
  const [otp, setOtp] = useState("");
  const [cardNumber, setCardNumber] = useState("4111 1111 1111 1111");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("789");
  const [cardHolder, setCardHolder] = useState(patientName || "Arham Bhandari");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [generatedPaymentId, setGeneratedPaymentId] = useState("");
  const [failureReason, setFailureReason] = useState("");
  const [methodSummary, setMethodSummary] = useState("UPI (Google Pay)");

  useEffect(() => {
    if (isOpen) {
      setStage("select_method");
      setOtp("");
      setFailureReason("");
      const randNum = Math.floor(10000000 + Math.random() * 90000000);
      setGeneratedPaymentId(`pay_test_${randNum}`);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText("medibook.pay@razorpay");
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
    toast.success("Merchant UPI VPA copied to clipboard");
  };

  const handleFillTestCard = (brand: "visa" | "mastercard" | "rupay") => {
    playTickSound();
    if (brand === "visa") {
      setCardNumber("4111 1111 1111 1111");
      setCardExpiry("12/28");
      setCardCvv("789");
      toast.info("Filled Test Visa Card (Passes all 3D Secure checks)");
    } else if (brand === "mastercard") {
      setCardNumber("5123 4567 8901 2345");
      setCardExpiry("09/29");
      setCardCvv("321");
      toast.info("Filled Test Mastercard (Passes all 3D Secure checks)");
    } else {
      setCardNumber("6071 2345 6789 0123");
      setCardExpiry("05/30");
      setCardCvv("555");
      toast.info("Filled Test RuPay Card (Passes all 3D Secure checks)");
    }
  };

  const handleProceedToAuth = (methodName: string) => {
    playTickSound();
    setMethodSummary(methodName);
    setStage("bank_otp");
  };

  const handleApprovePayment = () => {
    playTickSound();
    setStage("processing");
    setTimeout(() => {
      setStage("success");
      playPaymentSuccessSound();
      setTimeout(() => {
        const dummySignature = `sim_sig_${Math.random().toString(36).substring(2, 18)}`;
        onSuccess({
          razorpay_order_id: orderId || `order_test_${Date.now()}`,
          razorpay_payment_id: generatedPaymentId,
          razorpay_signature: dummySignature,
          method: methodSummary,
        });
      }, 1800);
    }, 1500);
  };

  const handleDeclinePayment = () => {
    playTickSound();
    setStage("processing");
    setTimeout(() => {
      setFailureReason("Bank 3D Secure Authentication Failed (Simulated Test Decline)");
      setStage("failure");
      if (onFailure) {
        onFailure("Payment was declined by the simulated bank sandbox.");
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6"
      >
        {/* Razorpay Authentic Navy Header */}
        <div className="bg-[#0c2340] text-white p-5 relative">
          {/* Top Row: Merchant Brand & Test Mode Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-base shadow-md shadow-blue-500/20">
                M
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold tracking-tight">MediBook</h3>
                  <span
                    data-testid="rzp-test-mode-badge"
                    className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
                  >
                    TEST MODE
                  </span>
                </div>
                <p className="text-[11px] text-blue-200/80">Dr. {doctorName} • Consultation</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close payment window"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Amount Badge */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-baseline justify-between">
            <span className="text-xs text-blue-200 font-medium">Consultation OPD Fee</span>
            <div className="text-2xl font-black text-white tracking-tight">
              ₹{amount.toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        {/* STAGE 1: METHOD SELECTION */}
        {stage === "select_method" && (
          <div>
            {/* Tabs Header */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <button
                data-testid="rzp-tab-upi"
                onClick={() => setActiveTab("upi")}
                className={`flex-1 py-3 px-2 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === "upi"
                    ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Smartphone className="size-3.5" />
                <span>UPI (Fast)</span>
              </button>
              <button
                data-testid="rzp-tab-card"
                onClick={() => setActiveTab("card")}
                className={`flex-1 py-3 px-2 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === "card"
                    ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <CreditCard className="size-3.5" />
                <span>Cards</span>
              </button>
              <button
                onClick={() => setActiveTab("netbanking")}
                className={`flex-1 py-3 px-2 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === "netbanking"
                    ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Building2 className="size-3.5" />
                <span>Netbanking</span>
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* TAB: UPI */}
              {activeTab === "upi" && (
                <div className="space-y-4">
                  {/* UPI Method Pill Switcher */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl text-xs font-bold">
                    <button
                      onClick={() => setSelectedUpiOption("qr")}
                      className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        selectedUpiOption === "qr"
                          ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                      }`}
                    >
                      <QrCode className="size-3.5" />
                      <span>Scan UPI QR</span>
                    </button>
                    <button
                      onClick={() => setSelectedUpiOption("id")}
                      className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        selectedUpiOption !== "qr"
                          ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                      }`}
                    >
                      <Smartphone className="size-3.5" />
                      <span>UPI Apps / ID</span>
                    </button>
                  </div>

                  {/* SUB-OPTION: QR CODE */}
                  {selectedUpiOption === "qr" ? (
                    <div className="text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="inline-block p-3 rounded-2xl bg-white shadow-md border border-slate-100">
                        {/* Realistic Mock SVG QR Code with Razorpay Logo in Center */}
                        <div className="size-44 bg-white relative flex items-center justify-center">
                          <svg viewBox="0 0 160 160" className="w-full h-full text-slate-900">
                            {/* Corner positioning squares */}
                            <rect x="10" y="10" width="40" height="40" rx="6" fill="currentColor" />
                            <rect x="16" y="16" width="28" height="28" rx="4" fill="white" />
                            <rect x="22" y="22" width="16" height="16" rx="2" fill="currentColor" />

                            <rect x="110" y="10" width="40" height="40" rx="6" fill="currentColor" />
                            <rect x="116" y="16" width="28" height="28" rx="4" fill="white" />
                            <rect x="122" y="22" width="16" height="16" rx="2" fill="currentColor" />

                            <rect x="10" y="110" width="40" height="40" rx="6" fill="currentColor" />
                            <rect x="16" y="116" width="28" height="28" rx="4" fill="white" />
                            <rect x="22" y="122" width="16" height="16" rx="2" fill="currentColor" />

                            {/* Pixel Grid Pattern */}
                            <rect x="60" y="15" width="8" height="8" fill="currentColor" />
                            <rect x="75" y="15" width="8" height="8" fill="currentColor" />
                            <rect x="90" y="25" width="8" height="8" fill="currentColor" />
                            <rect x="60" y="35" width="14" height="8" fill="currentColor" />

                            <rect x="15" y="60" width="8" height="8" fill="currentColor" />
                            <rect x="30" y="70" width="8" height="8" fill="currentColor" />
                            <rect x="40" y="85" width="8" height="8" fill="currentColor" />
                            <rect x="15" y="95" width="12" height="8" fill="currentColor" />

                            <rect x="110" y="60" width="8" height="14" fill="currentColor" />
                            <rect x="135" y="75" width="10" height="8" fill="currentColor" />
                            <rect x="125" y="95" width="8" height="8" fill="currentColor" />

                            <rect x="65" y="110" width="8" height="8" fill="currentColor" />
                            <rect x="80" y="125" width="12" height="8" fill="currentColor" />
                            <rect x="110" y="115" width="14" height="8" fill="currentColor" />
                            <rect x="135" y="130" width="10" height="14" fill="currentColor" />

                            {/* Center Shield Badge */}
                            <circle cx="80" cy="80" r="18" fill="white" stroke="#2563eb" strokeWidth="3" />
                            <text x="80" y="85" textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="bold">₹</text>
                          </svg>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                        <span>Scan with any UPI App: GPay, PhonePe, Paytm</span>
                      </div>

                      <div className="flex items-center justify-center gap-2 pt-1">
                        <code className="text-xs bg-slate-200 dark:bg-slate-700 px-2.5 py-1 rounded-md text-slate-800 dark:text-slate-200 font-mono">
                          medibook.pay@razorpay
                        </code>
                        <button
                          onClick={handleCopyUPI}
                          className="p-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Copy UPI ID"
                        >
                          {copiedVpa ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
                        </button>
                      </div>

                      <button
                        onClick={() => handleProceedToAuth("UPI (QR Code Scan)")}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <Sparkles className="size-4 text-amber-300" />
                        <span>Simulate Phone Scan & Authorize</span>
                      </button>
                    </div>
                  ) : (
                    /* SUB-OPTION: POPULAR UPI APPS & ID */
                    <div className="space-y-3">
                      <div className="grid grid-cols-4 gap-2">
                        <button
                          onClick={() => handleProceedToAuth("Google Pay (UPI)")}
                          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-slate-800 text-center transition-all group cursor-pointer flex flex-col items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs"
                        >
                          <div className="size-9 rounded-lg bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
                            <img src="/images/payments/gpay.svg" alt="Google Pay" className="h-4.5 w-auto object-contain" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate w-full">GPay</span>
                        </button>

                        <button
                          onClick={() => handleProceedToAuth("PhonePe (UPI)")}
                          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-slate-800 text-center transition-all group cursor-pointer flex flex-col items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs"
                        >
                          <div className="size-9 rounded-lg bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
                            <img src="/images/payments/phonepe.svg" alt="PhonePe" className="h-6 w-auto object-contain" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate w-full">PhonePe</span>
                        </button>

                        <button
                          onClick={() => handleProceedToAuth("Paytm (UPI)")}
                          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-slate-800 text-center transition-all group cursor-pointer flex flex-col items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs"
                        >
                          <div className="size-9 rounded-lg bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
                            <img src="/images/payments/paytm.svg" alt="Paytm" className="h-3.5 w-auto object-contain" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate w-full">Paytm</span>
                        </button>

                        <button
                          onClick={() => handleProceedToAuth("BHIM (UPI)")}
                          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-slate-800 text-center transition-all group cursor-pointer flex flex-col items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs"
                        >
                          <div className="size-9 rounded-lg bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
                            <img src="/images/payments/bhim.svg" alt="BHIM" className="h-4.5 w-auto object-contain" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate w-full">BHIM</span>
                        </button>
                      </div>

                      <div className="pt-2">
                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                          Or enter your UPI ID (VPA)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={vpaId}
                            onChange={(e) => setVpaId(e.target.value)}
                            placeholder="e.g. mobile@upi or name@bank"
                            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <button
                            onClick={() => handleProceedToAuth(`UPI (${vpaId})`)}
                            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                          >
                            Pay ₹{amount.toLocaleString("en-IN")}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: CARD */}
              {activeTab === "card" && (
                <div className="space-y-3.5">
                  {/* Quick Fill Test Cards Pills with Real Logos */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Test Cards:</span>
                    <button
                      data-testid="rzp-visa-pill"
                      type="button"
                      onClick={() => handleFillTestCard("visa")}
                      className="px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[10px] font-bold hover:bg-blue-100 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <img src="/images/payments/visa.svg" alt="Visa" className="h-2.5 w-auto object-contain" />
                      <span>Visa Test Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFillTestCard("mastercard")}
                      className="px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-bold hover:bg-amber-100 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <img src="/images/payments/mastercard.svg" alt="Mastercard" className="h-3 w-auto object-contain" />
                      <span>Mastercard Test</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFillTestCard("rupay")}
                      className="px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold hover:bg-emerald-100 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <img src="/images/payments/rupay.svg" alt="RuPay" className="h-2.5 w-auto object-contain" />
                      <span>RuPay Test</span>
                    </button>
                  </div>

                  {/* Card Number with Brand Detection Logo */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        Card Number
                      </label>
                      <div className="flex items-center gap-1.5 opacity-80">
                        <img src="/images/payments/visa.svg" alt="Visa" className="h-2.5 w-auto object-contain" />
                        <img src="/images/payments/mastercard.svg" alt="Mastercard" className="h-3 w-auto object-contain" />
                        <img src="/images/payments/rupay.svg" alt="RuPay" className="h-2.5 w-auto object-contain" />
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4111 1111 1111 1111"
                        maxLength={19}
                        className="w-full pl-10 pr-14 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <CreditCard className="size-4 text-slate-400 absolute left-3 top-3" />
                      {/* Dynamic Card Brand Badge */}
                      <div className="absolute right-3 top-2.5 flex items-center">
                        {cardNumber.startsWith("4") && (
                          <img src="/images/payments/visa.svg" alt="Visa" className="h-3.5 w-auto object-contain" />
                        )}
                        {(cardNumber.startsWith("5") || cardNumber.startsWith("2")) && (
                          <img src="/images/payments/mastercard.svg" alt="Mastercard" className="h-4 w-auto object-contain" />
                        )}
                        {cardNumber.startsWith("6") && (
                          <img src="/images/payments/rupay.svg" alt="RuPay" className="h-3.5 w-auto object-contain" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expiry & CVV */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        maxLength={5}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="789"
                        maxLength={4}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Cardholder Name */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Name on card"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <button
                    data-testid="rzp-card-pay-btn"
                    onClick={() => handleProceedToAuth(`Card (ending in •••• ${cardNumber.slice(-4)})`)}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all mt-2"
                  >
                    <Lock className="size-3.5" />
                    <span>Pay ₹{amount.toLocaleString("en-IN")} via Card</span>
                  </button>
                </div>
              )}

              {/* TAB: NETBANKING */}
              {activeTab === "netbanking" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">Popular Indian Banks</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">Fast Redirect</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: "HDFC Bank", short: "HDFC", logo: "/images/payments/hdfc.svg" },
                      { name: "State Bank of India", short: "SBI", logo: "/images/payments/sbi.svg" },
                      { name: "ICICI Bank", short: "ICICI", logo: "/images/payments/icici.svg" },
                      { name: "Axis Bank", short: "AXIS", logo: "/images/payments/axis.svg" },
                      { name: "Kotak Mahindra", short: "KOTAK", logo: "/images/payments/kotak.svg" },
                      { name: "Punjab National", short: "PNB", logo: "/images/payments/pnb.svg" },
                    ].map((bank) => (
                      <button
                        key={bank.short}
                        onClick={() => {
                          setSelectedBank(bank.name);
                          handleProceedToAuth(`Netbanking (${bank.name})`);
                        }}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/40 text-left transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-lg bg-white dark:bg-slate-700 shadow-2xs border border-slate-100 dark:border-slate-600 flex items-center justify-center p-1 group-hover:scale-105 transition-transform overflow-hidden shrink-0">
                            <img src={bank.logo} alt={bank.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">{bank.short}</span>
                            <span className="text-[10px] text-slate-400 block -mt-0.5 truncate">{bank.name}</span>
                          </div>
                        </div>
                        <ChevronRight className="size-3.5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Assurance */}
            <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-emerald-500" />
                <span>Secured by Razorpay • RBI Mandated 256-bit SSL</span>
              </div>
              <span className="font-mono text-[10px] font-semibold text-slate-400">Sandbox v2.4</span>
            </div>
          </div>
        )}

        {/* STAGE 2: 3D SECURE BANK OTP SANDBOX */}
        {stage === "bank_otp" && (
          <motion.div
            data-testid="rzp-otp-sandbox"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setStage("select_method")}
                className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                <ArrowLeft className="size-3.5" /> Back
              </button>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-full">
                3D-Secure Sandbox
              </span>
            </div>

            {/* Bank Header Preview */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>Merchant:</span>
                <span className="font-bold text-slate-900 dark:text-white">MediBook OPD</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>Paying using:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{methodSummary}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>Amount:</span>
                <span className="font-extrabold text-slate-900 dark:text-white">₹{amount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Simulated SMS OTP Notice */}
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Info className="size-3.5 text-amber-600 shrink-0" />
                <span>Simulated SMS Sent to {patientContact}</span>
              </div>
              <p className="text-[11px] font-mono pl-5">
                "Your MediBook OTP is <strong className="text-blue-600 dark:text-blue-400">123456</strong> for transaction of ₹{amount}. Do not share with anyone."
              </p>
            </div>

            {/* OTP Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Enter 6-Digit Bank OTP
                </label>
                <button
                  data-testid="rzp-autofill-otp"
                  onClick={() => {
                    playTickSound();
                    setOtp("123456");
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                >
                  Auto-fill 123456
                </button>
              </div>

              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="1 2 3 4 5 6"
                maxLength={6}
                className="w-full text-center tracking-[0.6em] text-lg font-mono font-black py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Approval & Decline Options */}
            <div className="space-y-2 pt-2">
              <button
                data-testid="rzp-approve-btn"
                onClick={handleApprovePayment}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <CheckCircle2 className="size-4" />
                <span>Approve Test Payment (Success)</span>
              </button>

              <button
                onClick={handleDeclinePayment}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 hover:text-rose-600 text-xs font-bold transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                Simulate Bank Decline (Test Error Flow)
              </button>
            </div>
          </motion.div>
        )}

        {/* STAGE 3: PROCESSING SPINNER */}
        {stage === "processing" && (
          <div className="p-12 text-center space-y-4">
            <div className="size-14 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto" />
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Contacting Bank Sandbox...
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Authorizing {methodSummary} and computing HMAC cryptographic signature.
              </p>
            </div>
          </div>
        )}

        {/* STAGE 4: SUCCESS CHECKMARK WITH AUDIO RIPPLES */}
        {stage === "success" && (
          <motion.div
            data-testid="rzp-success-screen"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 text-center space-y-4"
          >
            {/* Pulsing Audio Ripple Rings */}
            <div className="relative size-18 mx-auto flex items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
              <span className="absolute -inset-2 rounded-full border border-emerald-500/40 animate-pulse" />
              <div className="size-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 z-10">
                <Check className="size-9 stroke-[3]" />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-1 border border-emerald-200/60 dark:border-emerald-800/60">
                <Volume2 className="size-3.5 text-emerald-600 animate-pulse" />
                <span>Payment Ticking Chime Played</span>
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                Payment Successful!
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Transaction settled via Razorpay Test Gateway.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-600 dark:text-slate-300">
              ID: {generatedPaymentId}
            </div>

            <div>
              <button
                type="button"
                onClick={() => playPaymentSuccessSound()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
              >
                <Volume2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Replay Payment Sound 🔔</span>
              </button>
            </div>

            <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold animate-pulse">
              Confirming appointment and generating OPD E-Pass...
            </p>
          </motion.div>
        )}

        {/* STAGE 5: FAILURE */}
        {stage === "failure" && (
          <div className="p-8 text-center space-y-4">
            <div className="size-16 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center shadow-lg shadow-rose-500/20">
              <AlertCircle className="size-8 stroke-[2.5]" />
            </div>

            <div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                Payment Was Declined
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {failureReason || "Transaction could not be authorized by bank."}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStage("select_method")}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Try Another Method
              </button>
              <button
                onClick={onClose}
                className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
