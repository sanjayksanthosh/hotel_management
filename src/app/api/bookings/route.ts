import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateReference, calculateTotal } from "@/lib/utils";
import { sendBookingConfirmation, sendAdminNotification } from "@/lib/email";
import { formatDate } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomId, checkIn, checkOut, guests, guestName, guestEmail, guestPhone, paymentMethod, specialRequests } = body;

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (room.status !== "Available") {
      return NextResponse.json({ error: "Room is not available" }, { status: 400 });
    }

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

    if (conflicting) {
      return NextResponse.json(
        { error: "Room is not available for the selected dates" },
        { status: 409 }
      );
    }

    const totalAmount = calculateTotal(room.price, checkInDate, checkOutDate);
    const reference = generateReference();

    const booking = await prisma.booking.create({
      data: {
        bookingReference: reference,
        guestName,
        guestEmail,
        guestPhone,
        roomId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        totalAmount,
        paymentMethod,
        bookingStatus: paymentMethod === "Pay Online" ? "Pending" : "Reserved",
        paymentStatus: paymentMethod === "Pay Online" ? "Unpaid" : "Unpaid",
        specialRequests,
      },
      include: { room: true },
    });

    if (paymentMethod === "Pay At Hotel") {
      try {
        await sendBookingConfirmation({
          email: guestEmail,
          name: guestName,
          reference,
          roomName: room.name,
          checkIn: formatDate(checkInDate),
          checkOut: formatDate(checkOutDate),
          amount: totalAmount,
          paymentStatus: "Unpaid",
          paymentMethod: "Pay At Hotel",
        });
        await sendAdminNotification({
          guestName,
          guestEmail,
          guestPhone,
          roomName: room.name,
          checkIn: formatDate(checkInDate),
          checkOut: formatDate(checkOutDate),
          paymentMethod: "Pay At Hotel",
          reference,
        });
      } catch {
        // Email failure should not block booking
      }
    }

    return NextResponse.json(booking, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (reference) {
      const booking = await prisma.booking.findUnique({
        where: { bookingReference: reference },
        include: { room: { include: { images: true } } },
      });
      if (!booking) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
      }
      return NextResponse.json(booking);
    }

    const bookings = await prisma.booking.findMany({
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
