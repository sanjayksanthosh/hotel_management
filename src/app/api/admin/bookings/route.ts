import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter");

    let whereClause = {};
    const now = new Date();

    switch (filter) {
      case "upcoming":
        whereClause = {
          bookingStatus: { in: ["Confirmed", "Reserved"] },
          checkIn: { gte: now },
        };
        break;
      case "active":
        whereClause = {
          bookingStatus: { in: ["Checked In"] },
        };
        break;
      case "completed":
        whereClause = {
          bookingStatus: "Checked Out",
        };
        break;
      case "cancelled":
        whereClause = {
          bookingStatus: "Cancelled",
        };
        break;
      default:
        break;
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: { room: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, action } = body;

    const statusMap: Record<string, string> = {
      confirm: "Confirmed",
      cancel: "Cancelled",
      "check-in": "Checked In",
      "check-out": "Checked Out",
      "no-show": "No Show",
    };

    const bookingStatus = statusMap[action];
    if (!bookingStatus) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const updateData: Record<string, string> = { bookingStatus };

    if (action === "cancel" || action === "no-show") {
      updateData.paymentStatus = "Refunded";
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: { room: true },
    });

    return NextResponse.json(booking);
  } catch {
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
