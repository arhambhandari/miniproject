import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { queueManager } from "@/lib/queueManager";
import type { QueueActionPayload, QueueState } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const isDoctor = session?.user?.role === "DOCTOR" || session?.user?.role === "ADMIN";

    const body: QueueActionPayload & { demo?: boolean } = await req.json();
    const { action, tokenNumber, delayMinutes, delayReason } = body;

    // Allow doctors, admins, or local demo action requests
    if (!isDoctor && !body.demo) {
      // In development or demo mode we can allow, but check for safety
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { error: "Forbidden: Only authorized doctors can control the OPD chamber queue" },
          { status: 403 }
        );
      }
    }

    let updatedState: QueueState;

    switch (action) {
      case "CALL_NEXT":
        updatedState = queueManager.advanceQueue();
        break;

      case "CALL_DIRECT":
        if (!tokenNumber) {
          return NextResponse.json({ error: "Missing tokenNumber for direct call" }, { status: 400 });
        }
        updatedState = queueManager.callDirectToken(tokenNumber);
        break;

      case "EMERGENCY_DELAY":
        updatedState = queueManager.setEmergencyDelay(
          delayMinutes || 15,
          delayReason || "Doctor attending to an urgent trauma case in ICU."
        );
        break;

      case "RESOLVE_DELAY":
        updatedState = queueManager.resolveEmergencyDelay();
        break;

      case "RESET":
        updatedState = queueManager.resetQueue();
        break;

      default:
        return NextResponse.json({ error: "Invalid queue action" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Queue action ${action} executed successfully`,
      state: updatedState,
    });
  } catch (error) {
    console.error("Error executing queue action:", error);
    return NextResponse.json(
      { error: "Failed to execute queue action" },
      { status: 500 }
    );
  }
}
