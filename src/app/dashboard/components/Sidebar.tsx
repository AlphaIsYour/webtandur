// src/app/(dashboard)/components/Sidebar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Leaf,
  Package,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

type UserProps = {
  user: {
    name: string;
    email: string;
    image: string;
  };
};

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Proyek Saya", href: "/dashboard/proyek", icon: Leaf },
  { label: "Produk", href: "/dashboard/produk", icon: Package },
  { label: "Pengaturan", href: "/dashboard/pengaturan", icon: Settings },
];

export default function Sidebar({ user }: UserProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Menu Button - Hanya tampil ketika sidebar tertutup */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="md:hidden fixed top-5 left-4 z-50 p-2 bg-white rounded-md shadow-lg border border-slate-200"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
       fixed md:sticky top-0 left-0 h-screen bg-white border-r mt-4 sm:mt-[-61] border-slate-200 z-40
    transform transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
    overflow-y-auto
    w-80
     `}
      >
        <div className="flex h-full flex-col">
          {/* Header Sidebar: Logo/Nama Aplikasi dengan tombol close */}
          <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
            {/* Tombol Close - Hanya tampil di mobile ketika sidebar terbuka */}
            <button
              onClick={toggleSidebar}
              className="md:hidden p-1 rounded-md hover:bg-slate-100 transition-colors"
            >
              <X className="h-6 w-6 text-slate-600" />
            </button>
          </div>

          {/* Profil Petani */}
          <div className="flex flex-col items-center gap-3 p-4">
            <Image
              src={user.image}
              alt={`Foto profil ${user.name}`}
              width={80}
              height={80}
              className="rounded-full"
            />
            <div className="text-center">
              <h3 className="font-semibold text-lg text-slate-800 truncate">
                {user.name}
              </h3>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>

          {/* Navigasi Utama */}
          <nav className="flex-grow px-4">
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-green-100 text-green-700"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer Sidebar: Logout */}
          <div className="mt-auto p-4 border-t border-slate-200">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
