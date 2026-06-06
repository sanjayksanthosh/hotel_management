"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-xl shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="relative group">
            <span className={`text-xl font-bold tracking-tight transition-colors ${
              scrolled ? "text-[#0f172a]" : "text-white"
            }`}>
              Grand<span className="text-[#f59e0b]">Horizon</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              { href: "/", label: "Home" },
              { href: "/rooms", label: "Rooms" },
              { href: "/#amenities", label: "Amenities" },
              { href: "/#contact", label: "Contact" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium tracking-wide transition-colors hover:text-[#f59e0b] ${
                  scrolled ? "text-gray-700" : "text-white/80"
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/rooms"
              className="bg-[#f59e0b] text-[#0f172a] px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#fbbf24] hover:shadow-lg hover:shadow-amber-200/50 transition-all"
            >
              Book Now
            </Link>
          </div>

          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
            }`}
            onClick={() => setOpen(!open)}
          >
            {open ? <HiX size={22} /> : <HiMenu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {[
                { href: "/", label: "Home" },
                { href: "/rooms", label: "Rooms" },
                { href: "/#amenities", label: "Amenities" },
                { href: "/#contact", label: "Contact" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-[#f59e0b] font-medium transition-colors"
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/rooms"
                onClick={() => setOpen(false)}
                className="block text-center bg-[#f59e0b] text-[#0f172a] px-4 py-3 rounded-xl font-semibold mt-2"
              >
                Book Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
