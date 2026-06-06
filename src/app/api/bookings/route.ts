import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateReference, calculateTotal, formatDate } from "@/lib/utils";
import { sendBookingConfirmation, sendAdminNotification } from "@/lib/email";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomId, checkIn, checkOut, guests, guestName, guestEmail, guestPhone, paymentMethod, specialRequests } = body;

    if (!guestEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (!guestName || guestName.length > 100) {
      return NextResponse.json({ error: "Name is required (max 100 characters)" }, { status: 400 });
    }

    if (!guestPhone || guestPhone.length > 20) {
      return NextResponse.json({ error: "Valid phone number is required" }, { status: 400 });
    }

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (room.status !== "Available") {
      return NextResponse.json({ error: "Room is not available" }, { status: 400 });
    }

    const parsedGuests = parseInt(guests);
    if (isNaN(parsedGuests) || parsedGuests < 1 || parsedGuests > room.capacity) {
      return NextResponse.json(
        { error: `Guest count must be between 1 and ${room.capacity}` },
        { status: 400 }
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    if (checkOutDate <= checkInDate) {
      return NextResponse.json({ error: "Check-out must be after check-in" }, { status: 400 });
    }

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
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim().toLowerCase(),
        guestPhone: guestPhone.trim(),
        roomId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: parsedGuests,
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
      } catch (error) {
        console.error("Failed to send booking confirmation emails:", error);
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
    const session = await auth();

    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const bookings = await prisma.booking.findMany({
        include: { room: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(bookings);
    }

    const booking = await prisma.booking.findUnique({
      where: { bookingReference: reference },
      include: { room: { include: { images: true } } },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
