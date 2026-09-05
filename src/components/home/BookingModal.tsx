"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Calendar, Clock, MapPin, X, CheckCircle, CreditCard, QrCode } from "lucide-react";
import { toast } from "sonner";
import Script from "next/script";
import Image from "next/image";
import type { Doctor } from "@/types";

interface BookingModalProps {
  doctor: Doctor | null;
  onClose: () => void;
}

export function BookingModal({ doctor, onClose }: BookingModalProps) {
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientContact, setPatientContact] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [disease, setDisease] = useState("");
  
  const [modalStep, setModalStep] = useState<"details" | "success" | "error">("details");
  const [isProcessing, setIsProcessing] = useState(false);
  const [emailPreview, setEmailPreview] = useState("");

  // Reset state when doctor changes
  useEffect(() => {
    if (doctor) {
      setModalStep("details");
      setBookingDate("");
      setBookingTime("");
      setIsProcessing(false);
    }
  }, [doctor]);

  const handleSimulatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor) return;
    setIsProcessing(true);

    try {
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId: doctor.id }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) throw new Error(orderData.error || "Order creation failed");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder", 
        amount: orderData.amount,
        currency: orderData.currency,
        name: "MediBook",
        description: `Consultation with ${doctor.user.name}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
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
              toast.error("Payment verification failed. Contact support.");
              setModalStep("error");
              setIsProcessing(false);
              return;
            }

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
        theme: { color: "#2563eb" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        toast.error("Payment failed. Please try again.");
        setIsProcessing(false);
      });
      rzp.open();

    } catch (error) {
      console.error("Booking error:", error);
      setModalStep("error");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Modal isOpen={!!doctor} onClose={onClose} title={modalStep === "details" ? "Book Appointment" : undefined}>
        {doctor && modalStep === "details" && (
          <form onSubmit={handleSimulatePayment} className="space-y-6">
            <div className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <Image src={doctor.user.image} alt={doctor.user.name} width={64} height={64} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{doctor.user.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{doctor.specialization}</p>
                <div className="flex items-center gap-4 mt-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1"><MapPin className="size-3" /> Clinic Visit</span>
                  <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                    Fee: ₹{doctor.fee ? doctor.fee.toLocaleString() : "1,500"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input type="date" label="Date" required min={new Date().toISOString().split("T")[0]} value={bookingDate} onChange={e => setBookingDate(e.target.value)} />
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Time</label>
                <select 
                  required
                  value={bookingTime}
                  onChange={e => setBookingTime(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="" disabled>Select time</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <Input label="Patient Name" required placeholder="John Doe" value={patientName} onChange={e => setPatientName(e.target.value)} />
              <Input label="Email Address" type="email" required placeholder="john@example.com" value={patientEmail} onChange={e => setPatientEmail(e.target.value)} />
              <Input label="Phone Number" type="tel" required placeholder="+91 98765 43210" value={patientContact} onChange={e => setPatientContact(e.target.value)} />
              <Input label="Reason for Visit" required placeholder="Briefly describe your symptoms" value={disease} onChange={e => setDisease(e.target.value)} />
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                {isProcessing ? "Processing..." : `Pay ₹${doctor.fee ? doctor.fee.toLocaleString() : "1,500"} & Book`}
              </Button>
            </div>
          </form>
        )}

        {modalStep === "success" && (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="size-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Booking Confirmed!</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Your appointment has been successfully scheduled.</p>
            {emailPreview && (
              <a href={emailPreview} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline mb-6 block font-medium">
                Preview Confirmation Email ↗
              </a>
            )}
            <Button onClick={onClose} className="w-full">Done</Button>
          </div>
        )}

        {modalStep === "error" && (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-4">
              <X className="size-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Booking Failed</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">There was a problem processing your request. Please try again.</p>
            <Button onClick={() => setModalStep("details")} className="w-full">Try Again</Button>
          </div>
        )}
      </Modal>
    </>
  );
}
