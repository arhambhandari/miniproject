import { queueManager } from "@/lib/queueManager";
import type { QueueState } from "@/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  let unsubscribe: (() => void) | null = null;
  let heartbeatInterval: NodeJS.Timeout | null = null;

  const stream = new ReadableStream({
    start(controller) {
      // 1. Send initial state immediately upon connection
      const initialState = queueManager.getQueueState();
      controller.enqueue(
        encoder.encode(`event: queue_state\ndata: ${JSON.stringify(initialState)}\n\n`)
      );

      // 2. Subscribe to real-time events published by the doctor/staff
      const onQueueUpdate = (updatedState: QueueState) => {
        try {
          controller.enqueue(
            encoder.encode(
              `event: queue_update\ndata: ${JSON.stringify(updatedState)}\n\n`
            )
          );
        } catch (err) {
          console.warn("Error sending queue update down SSE stream:", err);
        }
      };

      unsubscribe = queueManager.subscribe(onQueueUpdate);

      // 3. Heartbeat ping every 15 seconds to prevent browser or proxy timeout
      heartbeatInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch {
          if (heartbeatInterval) clearInterval(heartbeatInterval);
        }
      }, 15000);
    },
    cancel() {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
