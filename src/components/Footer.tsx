import Link from "next/link";
import { HiPhone, HiMail, HiLocationMarker } from "react-icons/hi";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">
              Grand<span className="text-[#f59e0b]">Horizon</span>
            </h3>
            <p className="text-gray-400 leading-relaxed max-w-md">
              Experience luxury and comfort in the heart of the city. Your perfect getaway awaits
              with world-class amenities and exceptional service.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm tracking-widest text-gray-300 uppercase mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: "/rooms", label: "Our Rooms" },
                { href: "/#amenities", label: "Amenities" },
                { href: "/#contact", label: "Contact" },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="text-gray-400 hover:text-[#f59e0b] transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm tracking-widest text-gray-300 uppercase mb-5">Contact</h4>
            <ul className="space-y-4">
              {[
                { icon: HiLocationMarker, text: "123 Luxury Avenue, NY" },
                { icon: HiPhone, text: "+1 (555) 123-4567" },
                { icon: HiMail, text: "info@grandhorizon.com" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-gray-400 text-sm">
                  <Icon className="text-[#f59e0b] flex-shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Grand Horizon Hotel. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
