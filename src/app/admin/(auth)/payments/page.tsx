import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminPaymentsPage() {
  const bookings = await prisma.booking.findMany({
    where: { paymentMethod: "Pay Online" },
    include: { room: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Payment Management</h1>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-medium text-gray-500">Reference</th>
              <th className="text-left p-4 font-medium text-gray-500">Guest</th>
              <th className="text-left p-4 font-medium text-gray-500">Room</th>
              <th className="text-left p-4 font-medium text-gray-500">Amount</th>
              <th className="text-left p-4 font-medium text-gray-500">Method</th>
              <th className="text-left p-4 font-medium text-gray-500">Status</th>
              <th className="text-left p-4 font-medium text-gray-500">Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="p-4 font-mono text-xs">{b.bookingReference}</td>
                <td className="p-4">
                  <p className="font-medium">{b.guestName}</p>
                  <p className="text-xs text-gray-500">{b.guestEmail}</p>
                </td>
                <td className="p-4">{b.room?.name}</td>
                <td className="p-4 font-medium">${b.totalAmount.toFixed(2)}</td>
                <td className="p-4">{b.paymentMethod}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    b.paymentStatus === "Paid" ? "bg-green-100 text-green-700" :
                    b.paymentStatus === "Refunded" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {b.paymentStatus}
                  </span>
                </td>
                <td className="p-4 text-gray-500">{formatDate(b.createdAt)}</td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-gray-400">No payments found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
