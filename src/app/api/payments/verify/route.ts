import { NextResponse } from "next/server";
import { auth } from "@/auth";
import crypto from "crypto";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment verification data" }, { status: 400 });
    }

    // In test/mock mode, accept mock payments
    if (!process.env.RAZORPAY_KEY_SECRET) {
      if (razorpay_order_id.startsWith("mock_order_")) {
        return NextResponse.json({ verified: true });
      }
      return NextResponse.json({ error: "Payment verification unavailable" }, { status: 500 });
    }

    // Verify signature using HMAC SHA256
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    return NextResponse.json({ verified: true });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
