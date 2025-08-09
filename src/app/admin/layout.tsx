"use client";

import { ReactNode } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Users,
  Settings,
  BarChart3,
  Menu,
  X,
  BookOpen,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { AdminProtection } from "@/components/AdminProtection";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "next-auth/react";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayoutContent = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const menuItems = [
    { href: "/admin", icon: BarChart3, label: "Dashboard" },
    { href: "/admin/messages", icon: MessageSquare, label: "Messages" },
    {
      href: "/admin/petani-applications",
      icon: BookOpen,
      label: "Petani Applications",
    },
    { href: "/admin/users", icon: Users, label: "Petani" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50 mt-20">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 bg-opacity-50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 flex-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} className="mr-3" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-2 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-gray-600">Welcome, </span>
              <span className="font-medium text-gray-900">
                {user?.name || "Admin"}
              </span>
              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                {user?.role?.toUpperCase()}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <AdminProtection>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminProtection>
  );
};

export default AdminLayout;
