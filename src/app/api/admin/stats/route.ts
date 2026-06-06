import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const [totalRooms, availableRooms, activeBookings, pendingPayments, upcomingCheckIns] =
      await Promise.all([
        prisma.room.count(),
        prisma.room.count({ where: { status: "Available" } }),
        prisma.booking.count({
          where: { bookingStatus: { in: ["Confirmed", "Reserved", "Checked In"] } },
        }),
        prisma.booking.count({
          where: { paymentStatus: "Unpaid", paymentMethod: "Pay Online" },
        }),
        prisma.booking.count({
          where: {
            bookingStatus: { in: ["Confirmed", "Reserved"] },
            checkIn: { gte: new Date() },
          },
        }),
      ]);

    return NextResponse.json({
      totalRooms,
      availableRooms,
      activeBookings,
      pendingPayments,
      upcomingCheckIns,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
