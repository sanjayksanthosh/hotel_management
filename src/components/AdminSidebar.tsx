"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { HiHome, HiOfficeBuilding, HiCalendar, HiCreditCard, HiLogout } from "react-icons/hi";

interface Props {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const links = [
  { href: "/admin", label: "Dashboard", icon: HiHome },
  { href: "/admin/rooms", label: "Rooms", icon: HiOfficeBuilding },
  { href: "/admin/bookings", label: "Bookings", icon: HiCalendar },
  { href: "/admin/payments", label: "Payments", icon: HiCreditCard },
];

export default function AdminSidebar({ user }: Props) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1a365d] text-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-bold">Grand Horizon</h2>
        <p className="text-sm text-gray-400">Admin Panel</p>
      </div>

      {user && (
        <div className="px-6 py-4 border-b border-gray-700">
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
      )}

      <nav className="flex-1 p-4 space-y-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded transition ${
              pathname === href
                ? "bg-[#c9a84c] text-[#1a365d] font-semibold"
                : "hover:bg-gray-700"
            }`}
          >
            <Icon />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-4 py-3 rounded hover:bg-red-600 transition w-full"
        >
          <HiLogout />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
