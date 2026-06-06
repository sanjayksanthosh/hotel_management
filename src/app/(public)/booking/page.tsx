"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FadeIn } from "@/components/ui/AnimatedSection";
import { Spinner } from "@/components/ui/Loading";

interface RoomData {
  id: string;
  name: string;
  type: string;
  description: string;
  price: number;
  capacity: number;
  status: string;
  images: { id: string; imageUrl: string }[];
}

function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");
  const checkInParam = searchParams.get("checkIn");
  const checkOutParam = searchParams.get("checkOut");

  const [room, setRoom] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guests, setGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Pay Online");

  useEffect(() => {
    if (!roomId) { router.push("/rooms"); return; }
    fetch(`/api/rooms/${roomId}`)
      .then((r) => r.json())
      .then((data) => { setRoom(data); setLoading(false); })
      .catch(() => { toast.error("Failed to load room"); router.push("/rooms"); });
  }, [roomId, router]);

  const calculateTotal = () => {
    if (!room || !checkInParam || !checkOutParam) return 0;
    const checkIn = new Date(checkInParam);
    const checkOut = new Date(checkOutParam);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return nights * room.price;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestEmail || !guestPhone) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, checkIn: checkInParam, checkOut: checkOutParam, guests, guestName, guestEmail, guestPhone, paymentMethod, specialRequests }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Booking failed"); return; }

      if (paymentMethod === "Pay Online") {
        const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
          method: "POST",
          headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            email: guestEmail,
            amount: Math.round(calculateTotal() * 100),
            reference: data.bookingReference,
            callback_url: `${window.location.origin}/confirmation/${data.bookingReference}`,
            metadata: { booking_id: data.id, booking_reference: data.bookingReference },
          }),
        });
        const paystackData = await paystackRes.json();
        if (paystackData.status) {
          window.location.assign(paystackData.data.authorization_url);
        } else {
          toast.error("Payment initialization failed");
          router.push(`/confirmation/${data.bookingReference}`);
        }
      } else {
        toast.success("Booking reserved successfully!");
        router.push(`/confirmation/${data.bookingReference}`);
      }
    } catch {
      toast.error("Failed to submit booking");
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="pt-32 flex justify-center"><Spinner size="lg" /></div>;

  const total = calculateTotal();
  const nights = checkInParam && checkOutParam
    ? Math.ceil((new Date(checkOutParam).getTime() - new Date(checkInParam).getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="pt-28 pb-20 px-4 max-w-6xl mx-auto">
      <FadeIn>
        <div className="mb-10">
          <span className="text-sm font-semibold tracking-widest text-[#f59e0b] uppercase">Booking</span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a] mt-3">Complete Your Booking</h1>
        </div>
      </FadeIn>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Guest Information</h2>
              <div className="space-y-5">
                {[
                  { id: "name", label: "Full Name", value: guestName, set: setGuestName, type: "text" },
                  { id: "email", label: "Email Address", value: guestEmail, set: setGuestEmail, type: "email" },
                  { id: "phone", label: "Phone Number", value: guestPhone, set: setGuestPhone, type: "tel" },
                ].map(({ id, label, value, set, type }) => (
                  <div key={id}>
                    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">{label} *</label>
                    <input
                      id={id}
                      type={type}
                      value={value}
                      onChange={(e) => set(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Stay Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Check-in</label>
                  <input type="date" value={checkInParam || ""} disabled className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Check-out</label>
                  <input type="date" value={checkOutParam || ""} disabled className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50" />
                </div>
              </div>
              <div className="mt-5">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Number of Guests</label>
                <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent bg-gray-50 hover:bg-white transition-all">
                  {Array.from({ length: room?.capacity || 10 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>
                  ))}
                </select>
              </div>
              <div className="mt-5">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Special Requests</label>
                <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent bg-gray-50 hover:bg-white transition-all resize-none"
                  placeholder="Any special requests? (optional)" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
              <div className="space-y-3">
                {[
                  { value: "Pay Online", desc: "Secure payment via Paystack", icon: "💳" },
                  { value: "Pay At Hotel", desc: "Pay when you arrive", icon: "🏨" },
                ].map(({ value, desc, icon }) => (
                  <label key={value}
                    className={`flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                      paymentMethod === value ? "border-[#f59e0b] bg-amber-50" : "border-gray-100 hover:border-gray-200"
                    }`}>
                    <input type="radio" name="payment" value={value}
                      checked={paymentMethod === value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only" />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === value ? "border-[#f59e0b]" : "border-gray-300"
                    }`}>
                      {paymentMethod === value && <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />}
                    </div>
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{value}</p>
                      <p className="text-sm text-gray-500">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-28"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Summary</h2>
              {room && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                      <img src={room.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=100&q=80"}
                        alt={room.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{room.name}</p>
                      <p className="text-sm text-gray-500">{room.type}</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    {[
                      ["Check-in", checkInParam], ["Check-out", checkOutParam],
                      ["Nights", `${nights}`], ["Guests", `${guests}`],
                      ["Price per night", `$${room.price}`],
                    ].map(([label, value]) => (
                      <div key={label as string} className="flex justify-between">
                        <span className="text-gray-500">{label as string}</span>
                        <span className="font-medium text-gray-900">{value as string}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between pt-5 border-t border-gray-100">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-[#f59e0b]">${total.toFixed(2)}</span>
                  </div>
                </div>
              )}
              <button type="submit" disabled={submitting}
                className="w-full mt-8 bg-[#f59e0b] text-[#0f172a] py-4 rounded-2xl font-bold text-base hover:bg-[#fbbf24] transition-all hover:shadow-lg hover:shadow-amber-200/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner size="sm" /> Processing...
                  </span>
                ) : paymentMethod === "Pay Online" ? "Proceed to Payment" : "Confirm Booking"}
              </button>
            </motion.div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="pt-32 flex justify-center"><Spinner size="lg" /></div>}>
      <BookingForm />
    </Suspense>
  );
}
