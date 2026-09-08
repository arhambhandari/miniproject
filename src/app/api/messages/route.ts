import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET: Fetch messages between current user and partner
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const partnerId = searchParams.get("partnerId");
    const appointmentId = searchParams.get("appointmentId");
    const currentUserId = session.user.id;

    let whereClause: any;

    if (partnerId) {
      whereClause = {
        OR: [
          { senderId: currentUserId, receiverId: partnerId },
          { senderId: partnerId, receiverId: currentUserId },
        ],
      };
    } else if (appointmentId) {
      whereClause = {
        appointmentId,
        OR: [
          { senderId: currentUserId },
          { receiverId: currentUserId },
        ],
      };
    } else {
      whereClause = {
        OR: [
          { senderId: currentUserId },
          { receiverId: currentUserId },
        ],
      };
    }

    const messages = await prisma.message.findMany({
      where: whereClause,
      orderBy: { createdAt: "asc" },
      take: 100,
    });

    // Mark unread messages received by current user as read
    const unreadIds = messages
      .filter((m) => m.receiverId === currentUserId && !m.read)
      .map((m) => m.id);

    if (unreadIds.length > 0) {
      await prisma.message.updateMany({
        where: { id: { in: unreadIds } },
        data: { read: true },
      });
    }

    const formatted = messages.map((m) => ({
      id: m.id,
      senderId: m.senderId,
      receiverId: m.receiverId,
      senderRole: m.senderRole,
      isMe: m.senderId === currentUserId,
      content: m.content,
      read: m.read,
      time: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      createdAt: m.createdAt,
    }));

    return NextResponse.json(
      { messages: formatted },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (err: any) {
    console.error("GET /api/messages error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch messages" }, { status: 500 });
  }
}

// POST: Send a consultation message
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { receiverId, content, appointmentId } = body;

    if (!receiverId || !content?.trim()) {
      return NextResponse.json({ error: "Receiver ID and message content are required" }, { status: 400 });
    }

    // Verify receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true, name: true, role: true },
    });

    if (!receiver) {
      return NextResponse.json({ error: "Receiver not found" }, { status: 404 });
    }

    const currentUserId = session.user.id;
    const currentRole = session.user.role || "PATIENT";

    const message = await prisma.message.create({
      data: {
        senderId: currentUserId,
        receiverId: receiverId,
        senderRole: currentRole,
        content: content.trim(),
        appointmentId: appointmentId || null,
        read: false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: {
          id: message.id,
          senderId: message.senderId,
          receiverId: message.receiverId,
          senderRole: message.senderRole,
          isMe: true,
          content: message.content,
          read: message.read,
          time: new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          createdAt: message.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("POST /api/messages error:", err);
    return NextResponse.json({ error: err.message || "Failed to send message" }, { status: 500 });
  }
}
