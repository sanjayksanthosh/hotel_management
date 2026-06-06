import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmation, sendAdminNotification } from "@/lib/email";
import { formatDate } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, reference } = body;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { room: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.paymentStatus === "Paid") {
      return NextResponse.json({ error: "Booking already paid" }, { status: 400 });
    }

    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const verifyData = await verifyResponse.json();

    if (!verifyData.status || verifyData.data.status !== "success") {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    const paidAmount = verifyData.data.amount / 100;
    if (Math.abs(paidAmount - booking.totalAmount) > 0.01) {
      return NextResponse.json(
        { error: "Payment amount mismatch" },
        { status: 400 }
      );
    }

    if (verifyData.data.metadata?.booking_id !== bookingId) {
      return NextResponse.json(
        { error: "Booking ID mismatch" },
        { status: 400 }
      );
    }

    await prisma.payment.create({
      data: {
        bookingId,
        amount: booking.totalAmount,
        gateway: "Paystack",
        transactionReference: reference,
        status: "Paid",
        paidAt: new Date(),
      },
    });

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        bookingStatus: "Confirmed",
        paymentStatus: "Paid",
      },
      include: { room: true },
    });

    try {
      await sendBookingConfirmation({
        email: booking.guestEmail,
        name: booking.guestName,
        reference: booking.bookingReference,
        roomName: booking.room.name,
        checkIn: formatDate(booking.checkIn),
        checkOut: formatDate(booking.checkOut),
        amount: booking.totalAmount,
        paymentStatus: "Paid",
        paymentMethod: "Pay Online",
      });
      await sendAdminNotification({
        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
        guestPhone: booking.guestPhone,
        roomName: booking.room.name,
        checkIn: formatDate(booking.checkIn),
        checkOut: formatDate(booking.checkOut),
        paymentMethod: "Pay Online",
        reference: booking.bookingReference,
      });
    } catch (error) {
      console.error("Failed to send payment notification emails:", error);
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}
