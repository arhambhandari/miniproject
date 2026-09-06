import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { auth } from "@/auth";
import { MOCK_DOCTORS } from "@/lib/data";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const { doctorId } = await req.json();

    if (!doctorId || typeof doctorId !== "string") {
      return NextResponse.json({ error: "Doctor ID is required" }, { status: 400 });
    }

    // Look up fee server-side to prevent tampering
    const doctor = MOCK_DOCTORS.find((d) => d.id === doctorId);
    const amount = doctor?.fee || 1500;

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Check if keys are placeholders or missing
    const isPlaceholder =
      !keyId ||
      !keySecret ||
      keyId.includes("PASTE_YOUR_KEY") ||
      keyId.includes("YOUR_KEY_ID") ||
      keySecret.includes("PASTE_YOUR_KEY") ||
      keySecret.includes("YOUR_KEY_SECRET");

    if (isPlaceholder) {
      console.warn("Razorpay keys not configured — simulating order in test mode");
      return NextResponse.json({
        id: `mock_order_${Date.now()}`,
        currency: "INR",
        amount: amount * 100, // paise
        key_id: "rzp_test_placeholder",
        isSimulated: true,
      });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in paise (1 INR = 100 paise)
      currency: "INR",
      receipt: `rcpt_${session?.user?.id || "guest"}_${Date.now()}`,
      notes: {
        doctorId: doctor?.id || doctorId,
        doctorName: doctor?.user?.name || "Doctor",
        userId: session?.user?.id || "guest",
      },
    });

    return NextResponse.json({
      ...order,
      key_id: keyId, // Public key ID provided to client checkout
      isSimulated: false,
    });
  } catch (error: any) {
    console.error("Payment order error:", error);
    return NextResponse.json(
      { error: error?.message || "Could not create payment order" },
      { status: 500 }
    );
  }
}
