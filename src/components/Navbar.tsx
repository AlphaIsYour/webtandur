"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  User,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { data: session, status } = useSession();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showDropdown &&
        !(event.target as Element).closest(".dropdown-container")
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  // Handle scroll effect for homepage
  useEffect(() => {
    if (!isHomePage) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const navTextColor =
    pathname === "/" && !isScrolled ? "text-white" : "text-slate-900";

  const AuthButtons = ({ mobile = false }: { mobile?: boolean }) => {
    if (status === "loading") {
      return (
        <div className="h-10 w-24 rounded-md bg-slate-200 animate-pulse"></div>
      );
    }

    if (status === "authenticated") {
      const user = session.user;
      const userInitial = user?.name?.charAt(0).toUpperCase() || "T";
      const isPetani = user?.role === "PETANI";

      // Mobile authenticated view - shows profile links directly
      if (mobile) {
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.image!} alt={user.name!} />
                <AvatarFallback>{userInitial}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>

            {isPetani && (
              <Link
                href="/dashboard"
                className="flex items-center w-full p-3 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LayoutDashboard className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
            )}

            {isPetani && (
              <Link
                href={`/petani/${user.username}`}
                className="flex items-center w-full p-3 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="mr-3 h-5 w-5" />
                Profil Saya
              </Link>
            )}

            <Link
              href="/pengaturan"
              className="flex items-center w-full p-3 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Settings className="mr-3 h-5 w-5" />
              Pengaturan
            </Link>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="flex items-center justify-center w-full p-3 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md mt-2"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Keluar
            </button>
          </div>
        );
      }

      // Desktop authenticated view
      return (
        <div className="relative dropdown-container">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-full"
          >
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.image!} alt={user.name!} />
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-12 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-20 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="pb-3 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.image ?? ""}
                      alt={user.name ?? "User"}
                    />
                    <AvatarFallback>{userInitial}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-800">
                      {user.name}
                    </span>
                    <span className="text-xs text-slate-500">{user.email}</span>
                  </div>
                </div>
              </div>

              {isPetani && (
                <Link
                  href="/dashboard"
                  className="flex items-center text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md px-3 py-2 mt-2"
                  onClick={() => setShowDropdown(false)}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              )}

              {isPetani && (
                <Link
                  href={`/petani/${user.username}`}
                  className="flex items-center text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md px-3 py-2"
                  onClick={() => setShowDropdown(false)}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profil Saya
                </Link>
              )}

              <Link
                href="/pengaturan"
                className="flex items-center text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md px-3 py-2"
                onClick={() => setShowDropdown(false)}
              >
                <Settings className="mr-2 h-4 w-4" />
                Pengaturan
              </Link>

              <div className="border-t my-2" />

              <button
                onClick={() => {
                  setShowDropdown(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="w-full flex items-center justify-center text-white font-semibold bg-red-500 hover:bg-red-600 transition-colors py-2 rounded-md"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Keluar
              </button>
            </div>
          )}
        </div>
      );
    }

    // Unauthenticated views
    if (mobile) {
      return (
        <div className="flex flex-col space-y-3">
          <Button asChild variant="outline" className="w-full">
            <Link
              href="/sign-in"
              className="px-4 py-2 rounded-full font-medium border-black text-black hover:bg-green-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Masuk
            </Link>
          </Button>
          <Button asChild className="w-full">
            <Link
              href="/sign-up"
              className="px-4 py-2 rounded-full font-medium bg-black text-white hover:bg-green-700 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Daftar
            </Link>
          </Button>
        </div>
      );
    }

    return (
      <div className={`flex items-center space-x-3 ${navTextColor}`}>
        <Button
          asChild
          variant={!isHomePage || isScrolled ? "outline" : "ghost"}
        >
          <Link
            href="/sign-in"
            className={`px-4 py-2 rounded-4xl font-medium transition-colors ${
              !isHomePage || isScrolled
                ? "bg-transparent text-black border-2 hover:border-green-600"
                : "bg-transparent bg-opacity-20 text-white hover:bg-opacity-40 border-2 border-green-600 hover:border-green-700"
            }`}
          >
            Masuk
          </Link>
        </Button>
        <Button
          asChild
          variant={!isHomePage || isScrolled ? "default" : "secondary"}
        >
          <Link
            href="/sign-up"
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              !isHomePage || isScrolled
                ? "bg-black text-white hover:bg-green-600"
                : "bg-green-600 bg-opacity-20 hover:bg-opacity-40 hover:bg-green-800 text-white"
            }`}
          >
            Sign Up
          </Link>
        </Button>
      </div>
    );
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHomePage && !isScrolled
          ? "bg-transparent"
          : "bg-white/80 shadow-md backdrop-blur-sm"
      }`}
    >
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div
          className="flex items-center justify-between h-20"
          style={{ fontFamily: "mona-sans" }}
        >
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100">
              <Image
                src="/favicon.png"
                alt="Tandur Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <span className={`text-2xl font-bold ${navTextColor}`}>Tandur</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/jejak"
              className={`hover:text-green-600 transition-colors ${navTextColor}`}
            >
              Jejak Tani
            </Link>
            <Link
              href="/petani"
              className={`hover:text-green-600 transition-colors ${navTextColor}`}
            >
              Petani
            </Link>
            <Link
              href="/produk"
              className={`hover:text-green-600 transition-colors ${navTextColor}`}
            >
              Produk
            </Link>
            <Link
              href="/tentang"
              className={`hover:text-green-600 transition-colors ${navTextColor}`}
            >
              Tentang
            </Link>
          </div>

          <div className="hidden md:block">
            <AuthButtons />
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-full ${navTextColor} hover:bg-black/10 transition-colors`}
            aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu"}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-5 pt-4 pb-6 space-y-6">
            <div className="grid gap-4">
              <Link
                href="/jejak"
                className="block py-2 px-3 text-slate-700 hover:text-green-600 hover:bg-slate-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Jejak Tani
              </Link>
              <Link
                href="/petani"
                className="block py-2 px-3 text-slate-700 hover:text-green-600 hover:bg-slate-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Petani
              </Link>
              <Link
                href="/produk"
                className="block py-2 px-3 text-slate-700 hover:text-green-600 hover:bg-slate-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Produk
              </Link>

              <Link
                href="/tentang"
                className="block py-2 px-3 text-slate-700 hover:text-green-600 hover:bg-slate-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tentang
              </Link>
            </div>

            <div className="pt-4 border-t">
              <AuthButtons mobile={true} />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
