import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { auth } from "@/auth";

// Server-side fee lookup — NEVER trust the client amount
const DOCTOR_FEES: Record<string, number> = {
  doc_1: 2000,
  doc_2: 3500,
  doc_3: 1500,
  doc_4: 2500,
  doc_5: 1200,
  doc_6: 1800,
};

export async function POST(req: Request) {
  // Auth check — only logged-in users can create orders
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { doctorId } = await req.json();

    if (!doctorId || typeof doctorId !== "string") {
      return NextResponse.json({ error: "Doctor ID is required" }, { status: 400 });
    }

    // Look up fee SERVER-SIDE — prevents price tampering
    const amount = DOCTOR_FEES[doctorId];
    if (!amount) {
      return NextResponse.json({ error: "Invalid doctor" }, { status: 400 });
    }

    // If Razorpay keys are missing, simulate for development
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.warn("Razorpay keys missing — simulating order");
      return NextResponse.json({
        id: `mock_order_${Date.now()}`,
        currency: "INR",
        amount: amount * 100,
      });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `rcpt_${session.user.id}_${Date.now()}`,
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Payment order error:", error);
    return NextResponse.json({ error: "Could not create payment order" }, { status: 500 });
  }
}
