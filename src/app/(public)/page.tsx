import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HiWifi, HiLocationMarker, HiStar, HiPhone, HiMail } from "react-icons/hi";
import { TbPool } from "react-icons/tb";
import { MdRestaurant, MdLocalParking, MdFitnessCenter, MdBusinessCenter } from "react-icons/md";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";
import HeroSection from "@/components/HeroSection";

async function getFeaturedRooms() {
  try {
    return await prisma.room.findMany({
      where: { status: "Available" },
      include: { images: true },
      take: 3,
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const rooms = await getFeaturedRooms();

  return (
    <div>
      <HeroSection />

      <FadeIn>
        <section className="py-24 px-4 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-semibold tracking-widest text-[#f59e0b] uppercase">About</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0f172a] mt-3 mb-6 leading-tight">
                Welcome to<br />
                <span className="gradient-text">Grand Horizon</span>
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                Nestled in the heart of the city, Grand Horizon Hotel offers a perfect blend of modern luxury
                and timeless elegance. Our world-class facilities and dedicated staff ensure an unforgettable stay.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {["24/7 Room Service", "Premium Amenities", "Expert Staff", "Prime Location"].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-gray-700 bg-white rounded-xl px-4 py-3 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                    <span className="font-medium text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#f59e0b]/10 rounded-2xl" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#f59e0b]/10 rounded-2xl" />
              <div className="relative h-[500px] bg-gray-200 rounded-3xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80"
                  alt="Hotel Lobby"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-sm font-semibold tracking-widest text-[#f59e0b] uppercase">Rooms</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0f172a] mt-3">Featured Rooms</h2>
              <p className="text-gray-500 mt-4 max-w-xl mx-auto">Handpicked accommodations for the perfect stay</p>
            </div>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <StaggerItem key={room.id}>
                <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                  <div className="h-56 bg-gray-200 overflow-hidden relative">
                    <img
                      src={room.images[0]?.imageUrl || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80"}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-full">
                        {room.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#0f172a] mb-1">{room.name}</h3>
                    <p className="text-gray-500 text-sm mb-4">Up to {room.capacity} guests</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-[#f59e0b]">${room.price}</span>
                        <span className="text-gray-400 text-sm"> / night</span>
                      </div>
                      <Link
                        href={`/rooms/${room.id}`}
                        className="px-5 py-2.5 bg-[#0f172a] text-white rounded-full text-sm font-semibold hover:bg-[#1e293b] transition-all hover:shadow-lg"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <FadeIn delay={0.3}>
            <div className="text-center mt-12">
              <Link
                href="/rooms"
                className="inline-flex items-center gap-2 bg-white text-[#0f172a] px-8 py-3.5 rounded-full font-semibold border-2 border-gray-200 hover:border-[#f59e0b] hover:text-[#f59e0b] transition-all"
              >
                View All Rooms
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="amenities" className="py-24 px-4 max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="text-sm font-semibold tracking-widest text-[#f59e0b] uppercase">Amenities</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0f172a] mt-3">Everything You Need</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">Premium facilities for a memorable stay</p>
          </div>
        </FadeIn>
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { icon: HiWifi, label: "Free WiFi" },
            { icon: TbPool, label: "Swimming Pool" },
            { icon: MdRestaurant, label: "Restaurant" },
            { icon: MdLocalParking, label: "Free Parking" },
            { icon: MdFitnessCenter, label: "Gym" },
            { icon: MdBusinessCenter, label: "Business Center" },
          ].map(({ icon: Icon, label }) => (
            <StaggerItem key={label}>
              <div className="group bg-white rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100">
                <div className="bg-[#f59e0b]/10 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#f59e0b] transition-all duration-300">
                  <Icon className="text-2xl text-[#f59e0b] group-hover:text-white transition-colors" />
                </div>
                <p className="text-gray-700 font-semibold text-sm">{label}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-sm font-semibold tracking-widest text-[#f59e0b] uppercase">Testimonials</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0f172a] mt-3">What Our Guests Say</h2>
            </div>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Johnson", text: "An absolutely wonderful experience! The staff was incredibly attentive and the room was luxurious.", rating: 5 },
              { name: "Michael Chen", text: "Perfect location, amazing views, and exceptional service. Will definitely be coming back.", rating: 5 },
              { name: "Emily Davis", text: "The attention to detail is remarkable. From check-in to check-out, everything was flawless.", rating: 5 },
            ].map((testimonial) => (
              <StaggerItem key={testimonial.name}>
                <div className="bg-gray-50 rounded-3xl p-8 h-full">
                  <div className="flex text-[#f59e0b] mb-4 gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <HiStar key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed italic">&ldquo;{testimonial.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0f172a] flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <p className="font-semibold text-[#0f172a]">- {testimonial.name}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="py-24 px-4 max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="text-sm font-semibold tracking-widest text-[#f59e0b] uppercase">Contact</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0f172a] mt-3">Get In Touch</h2>
          </div>
        </FadeIn>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <StaggerContainer className="space-y-6">
            {[
              { icon: HiLocationMarker, label: "Address", value: "123 Luxury Avenue, City Center, NY 10001" },
              { icon: HiPhone, label: "Phone", value: "+1 (555) 123-4567" },
              { icon: HiMail, label: "Email", value: "info@grandhorizon.com" },
            ].map(({ icon: Icon, label, value }) => (
              <StaggerItem key={label}>
                <div className="flex items-start gap-5 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="bg-[#f59e0b]/10 p-3.5 rounded-xl flex-shrink-0">
                    <Icon className="text-xl text-[#f59e0b]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{label}</h4>
                    <p className="text-gray-500 mt-1">{value}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <div className="h-[400px] bg-gray-200 rounded-3xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.91477242448!2d-74.11976397304662!3d40.69740344229415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew+York!5e0!3m2!1sen!2sus!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Hotel Location"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
