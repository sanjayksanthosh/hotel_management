import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { HiCheckCircle, HiClock } from "react-icons/hi";
import ConfirmationAnimation from "@/components/ConfirmationAnimation";

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;

  const booking = await prisma.booking.findUnique({
    where: { bookingReference: reference },
    include: { room: { include: { images: true } } },
  });

  if (!booking) {
    return (
      <div className="pt-32 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Booking Not Found</h1>
        <p className="text-gray-500 mb-6">No booking found with reference {reference}</p>
        <Link href="/rooms" className="text-[#f59e0b] underline">Browse Rooms</Link>
      </div>
    );
  }

  const isPaid = booking.paymentStatus === "Paid" || booking.bookingStatus === "Confirmed";

  return (
    <div className="pt-28 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <ConfirmationAnimation isPaid={isPaid} />

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-5">
          <div className="flex justify-between items-center pb-5 border-b border-gray-100">
            <span className="text-gray-500">Booking Reference</span>
            <span className="font-bold text-[#0f172a] text-xl font-mono">{booking.bookingReference}</span>
          </div>

          {booking.room && (
            <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                <img
                  src={booking.room.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=100&q=80"}
                  alt={booking.room.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-gray-900">{booking.room.name}</p>
                <p className="text-sm text-gray-500">{booking.room.type}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-5">
            {[
              ["Guest Name", booking.guestName],
              ["Email", booking.guestEmail],
              ["Check-in", formatDate(booking.checkIn)],
              ["Check-out", formatDate(booking.checkOut)],
              ["Guests", `${booking.guests}`],
              ["Total Amount", `$${booking.totalAmount.toFixed(2)}`],
            ].map(([label, value]) => (
              <div key={label as string}>
                <p className="text-sm text-gray-500 mb-1">{label as string}</p>
                <p className="font-semibold text-gray-900">{value as string}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-5 border-t border-gray-100">
            <div>
              <p className="text-sm text-gray-500 mb-1">Payment Method</p>
              <p className="font-semibold text-gray-900">{booking.paymentMethod}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold ${
                booking.bookingStatus === "Confirmed" ? "bg-green-100 text-green-800" :
                booking.bookingStatus === "Reserved" ? "bg-yellow-100 text-yellow-800" :
                "bg-gray-100 text-gray-800"
              }`}>
                {booking.bookingStatus === "Confirmed" && <HiCheckCircle className="w-4 h-4" />}
                {booking.bookingStatus === "Reserved" && <HiClock className="w-4 h-4" />}
                {booking.bookingStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2 bg-[#0f172a] text-white px-8 py-3.5 rounded-full font-semibold hover:bg-[#1e293b] transition-all hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Browse More Rooms
          </Link>
        </div>
      </div>
    </div>
  );
}
