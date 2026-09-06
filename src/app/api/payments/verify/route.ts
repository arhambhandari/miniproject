import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json({ error: "Missing payment verification parameters" }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const isPlaceholder =
      !keySecret ||
      keySecret.includes("PASTE_YOUR_KEY") ||
      keySecret.includes("YOUR_KEY_SECRET");

    // Handle mock / simulated orders in development
    if (isPlaceholder || razorpay_order_id.startsWith("mock_order_")) {
      return NextResponse.json({ verified: true, isSimulated: true });
    }

    if (!razorpay_signature) {
      return NextResponse.json({ error: "Missing Razorpay payment signature" }, { status: 400 });
    }

    // Verify signature using HMAC SHA256 as required by Razorpay
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("Razorpay signature mismatch:", { expected: expectedSignature, received: razorpay_signature });
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    return NextResponse.json({ verified: true, isSimulated: false });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: error?.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}
