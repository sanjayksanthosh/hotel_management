import { prisma } from "@/lib/prisma";
import { HiHome, HiOfficeBuilding, HiCalendar, HiCreditCard, HiUserGroup } from "react-icons/hi";

async function getStats() {
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

  return { totalRooms, availableRooms, activeBookings, pendingPayments, upcomingCheckIns };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: "Total Rooms", value: stats.totalRooms, icon: HiOfficeBuilding, color: "bg-blue-500" },
    { label: "Available Rooms", value: stats.availableRooms, icon: HiHome, color: "bg-green-500" },
    { label: "Active Bookings", value: stats.activeBookings, icon: HiCalendar, color: "bg-purple-500" },
    { label: "Pending Payments", value: stats.pendingPayments, icon: HiCreditCard, color: "bg-yellow-500" },
    { label: "Upcoming Check-ins", value: stats.upcomingCheckIns, icon: HiUserGroup, color: "bg-pink-500" },
  ];

  const recentBookings = await prisma.booking.findMany({
    take: 5,
    include: { room: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg shadow-md p-6">
            <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
              <card.icon className="text-white text-xl" />
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-1">{card.value}</p>
            <p className="text-gray-500 text-sm">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium text-gray-500">Reference</th>
                <th className="pb-3 font-medium text-gray-500">Guest</th>
                <th className="pb-3 font-medium text-gray-500">Room</th>
                <th className="pb-3 font-medium text-gray-500">Amount</th>
                <th className="pb-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.id} className="border-b last:border-0">
                  <td className="py-3 font-mono text-xs">{b.bookingReference}</td>
                  <td className="py-3">{b.guestName}</td>
                  <td className="py-3">{b.room?.name}</td>
                  <td className="py-3">${b.totalAmount.toFixed(2)}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      b.bookingStatus === "Confirmed" ? "bg-green-100 text-green-700" :
                      b.bookingStatus === "Reserved" ? "bg-yellow-100 text-yellow-700" :
                      b.bookingStatus === "Checked In" ? "bg-blue-100 text-blue-700" :
                      b.bookingStatus === "Checked Out" ? "bg-gray-100 text-gray-700" :
                      b.bookingStatus === "Cancelled" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {b.bookingStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {recentBookings.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-gray-400">No bookings yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
