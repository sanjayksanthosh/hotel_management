"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface Props {
  roomId: string;
}

export default function AvailabilityChecker({ roomId }: Props) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [checking, setChecking] = useState(false);

  const handleCheck = async () => {
    if (!checkIn || !checkOut) { toast.error("Select check-in and check-out dates"); return; }
    if (new Date(checkOut) <= new Date(checkIn)) { toast.error("Check-out must be after check-in"); return; }
    setChecking(true);
    try {
      const res = await fetch("/api/bookings/check-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, checkIn, checkOut }),
      });
      const data = await res.json();
      if (data.available) {
        router.push(`/booking?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}`);
      } else {
        toast.error("Room is not available for the selected dates");
      }
    } catch {
      toast.error("Failed to check availability");
    } finally { setChecking(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h3 className="font-bold text-gray-900">Check Availability</h3>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1.5">Check-in</label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent bg-gray-50 hover:bg-white transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1.5">Check-out</label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          min={checkIn || new Date().toISOString().split("T")[0]}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent bg-gray-50 hover:bg-white transition-all"
        />
      </div>
      <button
        onClick={handleCheck}
        disabled={checking}
        className="w-full bg-[#f59e0b] text-[#0f172a] py-3.5 rounded-xl font-bold hover:bg-[#fbbf24] transition-all hover:shadow-lg hover:shadow-amber-200/50 disabled:opacity-50"
      >
        {checking ? "Checking..." : "Check Availability"}
      </button>
      <button
        onClick={() => {
          if (!checkIn || !checkOut) { toast.error("Please select dates first"); return; }
          if (new Date(checkOut) <= new Date(checkIn)) { toast.error("Check-out must be after check-in"); return; }
          router.push(`/booking?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}`);
        }}
        className="w-full bg-[#0f172a] text-white py-3.5 rounded-xl font-bold hover:bg-[#1e293b] transition-all hover:shadow-lg"
      >
        Book Now
      </button>
    </motion.div>
  );
}
