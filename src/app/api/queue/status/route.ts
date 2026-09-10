import { NextResponse } from "next/server";
import { queueManager } from "@/lib/queueManager";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const state = queueManager.getQueueState();
    return NextResponse.json({
      success: true,
      state,
    });
  } catch (error) {
    console.error("Error fetching queue status:", error);
    return NextResponse.json(
      { error: "Failed to fetch queue status" },
      { status: 500 }
    );
  }
}
