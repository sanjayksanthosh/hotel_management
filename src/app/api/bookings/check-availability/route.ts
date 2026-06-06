import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomId, checkIn, checkOut } = body;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const conflicting = await prisma.booking.findFirst({
      where: {
        roomId,
        bookingStatus: { notIn: ["Cancelled"] },
        AND: [
          { checkIn: { lt: checkOutDate } },
          { checkOut: { gt: checkInDate } },
        ],
      },
    });

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { images: true },
    });

    return NextResponse.json({
      available: !conflicting && room?.status === "Available",
      room,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to check availability" },
      { status: 500 }
    );
  }
}
