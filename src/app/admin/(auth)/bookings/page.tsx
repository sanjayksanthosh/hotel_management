"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

interface Booking {
  id: string;
  bookingReference: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  bookingStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  room: { name: string; type: string };
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchBookings = useCallback(async (f: string) => {
    const url = f === "all" ? "/api/admin/bookings" : `/api/admin/bookings?filter=${f}`;
    const res = await fetch(url);
    const data = await res.json();
    setBookings(data);
    setLoading(false);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchBookings(filter); }, [filter, fetchBookings]);

  const handleAction = async (id: string, action: string) => {
    const actionLabels: Record<string, string> = {
      confirm: "Confirmed", cancel: "Cancelled",
      "check-in": "Checked In", "check-out": "Checked Out",
      "no-show": "Marked No Show",
    };
    if (!confirm(`Are you sure you want to mark as ${actionLabels[action]}?`)) return;

    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) {
        toast.success(`Booking ${actionLabels[action]}`);
        fetchBookings(filter);
      } else {
        toast.error("Failed to update booking");
      }
    } catch {
      toast.error("Failed to update booking");
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "Pending": "bg-gray-100 text-gray-700",
      "Reserved": "bg-yellow-100 text-yellow-700",
      "Confirmed": "bg-green-100 text-green-700",
      "Checked In": "bg-blue-100 text-blue-700",
      "Checked Out": "bg-purple-100 text-purple-700",
      "Cancelled": "bg-red-100 text-red-700",
      "No Show": "bg-gray-100 text-gray-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getPaymentColor = (status: string) => {
    return status === "Paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
  };

  const filters = ["all", "upcoming", "active", "completed", "cancelled"];

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a365d]" /></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Booking Management</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded font-medium transition ${
              filter === f ? "bg-[#1a365d] text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-medium text-gray-500">Reference</th>
              <th className="text-left p-4 font-medium text-gray-500">Guest</th>
              <th className="text-left p-4 font-medium text-gray-500">Room</th>
              <th className="text-left p-4 font-medium text-gray-500">Check-in</th>
              <th className="text-left p-4 font-medium text-gray-500">Check-out</th>
              <th className="text-left p-4 font-medium text-gray-500">Amount</th>
              <th className="text-left p-4 font-medium text-gray-500">Status</th>
              <th className="text-left p-4 font-medium text-gray-500">Payment</th>
              <th className="text-left p-4 font-medium text-gray-500">Actions</th>
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
                <td className="p-4">{new Date(b.checkIn).toLocaleDateString()}</td>
                <td className="p-4">{new Date(b.checkOut).toLocaleDateString()}</td>
                <td className="p-4 font-medium">${b.totalAmount.toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(b.bookingStatus)}`}>
                    {b.bookingStatus}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPaymentColor(b.paymentStatus)}`}>
                    {b.paymentStatus}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {b.bookingStatus === "Pending" && (
                      <button onClick={() => handleAction(b.id, "confirm")} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200">Confirm</button>
                    )}
                    {b.bookingStatus === "Reserved" && (
                      <button onClick={() => handleAction(b.id, "confirm")} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200">Confirm</button>
                    )}
                    {b.bookingStatus === "Confirmed" && (
                      <button onClick={() => handleAction(b.id, "check-in")} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Check In</button>
                    )}
                    {b.bookingStatus === "Checked In" && (
                      <button onClick={() => handleAction(b.id, "check-out")} className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200">Check Out</button>
                    )}
                    {!["Cancelled", "Checked Out", "No Show"].includes(b.bookingStatus) && (
                      <button onClick={() => handleAction(b.id, "cancel")} className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">Cancel</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr><td colSpan={9} className="p-8 text-center text-gray-400">No bookings found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
