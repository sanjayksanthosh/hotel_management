import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";

async function getRooms() {
  try {
    return await prisma.room.findMany({
      include: { images: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function RoomsPage() {
  const rooms = await getRooms();

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <FadeIn>
        <div className="mb-16">
          <span className="text-sm font-semibold tracking-widest text-[#f59e0b] uppercase">Rooms</span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a] mt-3">Our Rooms</h1>
          <p className="text-gray-500 mt-4 max-w-2xl text-lg">
            Choose from our selection of carefully designed rooms and suites, each offering
            a unique blend of comfort and style.
          </p>
        </div>
      </FadeIn>

      {rooms.length === 0 ? (
        <FadeIn>
          <div className="text-center py-32">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No rooms available at the moment.</p>
          </div>
        </FadeIn>
      ) : (
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <StaggerItem key={room.id}>
              <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                <div className="h-56 bg-gray-200 overflow-hidden relative">
                  <img
                    src={room.images[0]?.imageUrl || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80"}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-full">
                      {room.type}
                    </span>
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm ${
                      room.status === "Available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {room.status}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#0f172a] mb-1">{room.name}</h3>
                  <p className="text-gray-500 text-sm mb-1">Up to {room.capacity} guests</p>
                  <div className="flex items-baseline gap-1 mb-5">
                    <span className="text-2xl font-bold text-[#f59e0b]">${room.price}</span>
                    <span className="text-gray-400 text-sm">/ night</span>
                  </div>
                  <Link
                    href={`/rooms/${room.id}`}
                    className="flex items-center justify-center gap-2 w-full bg-[#0f172a] text-white py-3 rounded-full text-sm font-semibold hover:bg-[#1e293b] transition-all hover:shadow-lg"
                  >
                    View Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}
