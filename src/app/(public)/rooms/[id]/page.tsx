import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HiWifi } from "react-icons/hi";
import { TbPool } from "react-icons/tb";
import { MdRestaurant, MdLocalParking, MdFitnessCenter, MdAcUnit, MdTv, MdKitchen } from "react-icons/md";
import { FaSnowflake, FaTshirt, FaGlassCheers } from "react-icons/fa";
import { FadeIn } from "@/components/ui/AnimatedSection";
import AvailabilityChecker from "@/components/AvailabilityChecker";

const amenityIcons: Record<string, React.ReactNode> = {
  "wifi": <HiWifi />, "swimming pool": <TbPool />,
  "restaurant": <MdRestaurant />, "parking": <MdLocalParking />,
  "gym": <MdFitnessCenter />, "ac": <MdAcUnit />,
  "tv": <MdTv />, "kitchen": <MdKitchen />,
  "air conditioning": <FaSnowflake />, "laundry": <FaTshirt />,
  "minibar": <FaGlassCheers />,
};

export default async function RoomDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const room = await prisma.room.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!room) {
    return (
      <div className="pt-32 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Room Not Found</h1>
        <Link href="/rooms" className="text-[#f59e0b] underline">Back to Rooms</Link>
      </div>
    );
  }

  const amenities = room.description
    ?.split(",")
    .map((a) => a.trim())
    .filter(Boolean) || [];

  return (
    <div className="pt-28 pb-20 px-4 max-w-7xl mx-auto">
      <FadeIn>
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {room.images.length > 0 ? (
            room.images.slice(0, 2).map((img, i) => (
              <div key={img.id} className={`${i === 0 ? "md:row-span-2 md:h-full" : ""} h-72 md:h-auto bg-gray-200 rounded-3xl overflow-hidden`}>
                <img src={img.imageUrl} alt={room.name} className="w-full h-full object-cover hover:scale-105 transition duration-700" />
              </div>
            ))
          ) : (
            <div className="h-72 md:h-[500px] bg-gray-200 rounded-3xl overflow-hidden md:col-span-2">
              <img
                src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80"
                alt={room.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </FadeIn>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <FadeIn>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full uppercase tracking-wide font-semibold">
                {room.type}
              </span>
              <span className={`text-xs px-3 py-1.5 rounded-full uppercase tracking-wide font-semibold ${
                room.status === "Available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {room.status}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-[#0f172a] mb-4">{room.name}</h1>
            <p className="text-gray-600 mb-6 leading-relaxed text-lg">{room.description}</p>

            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium">Up to {room.capacity} guests</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Check-in 2PM</span>
              </div>
            </div>
          </FadeIn>

          {amenities.length > 0 && (
            <FadeIn delay={0.1}>
              <div className="mb-8">
                <h3 className="text-lg font-bold text-[#0f172a] mb-4">Amenities</h3>
                <div className="flex flex-wrap gap-3">
                  {amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-full text-gray-700 text-sm font-medium hover:border-[#f59e0b] hover:text-[#f59e0b] transition-colors"
                    >
                      {amenityIcons[amenity.toLowerCase()] || <HiWifi />}
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          )}

          {room.images.length > 2 && (
            <FadeIn delay={0.2}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                {room.images.slice(2).map((img) => (
                  <div key={img.id} className="h-48 bg-gray-200 rounded-2xl overflow-hidden">
                    <img src={img.imageUrl} alt={room.name} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                  </div>
                ))}
              </div>
            </FadeIn>
          )}
        </div>

        <div className="lg:col-span-1">
          <FadeIn delay={0.2}>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-28">
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#f59e0b]">${room.price}</span>
                <span className="text-gray-400"> / night</span>
              </div>
              <AvailabilityChecker roomId={room.id} />
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
