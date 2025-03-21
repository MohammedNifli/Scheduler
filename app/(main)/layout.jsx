"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { BarLoader } from "react-spinners";
import { BarChart, Calendar, Users, Clock } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/meetings", label: "Meetings", icon: Users },
  { href: "/availability", label: "Availability", icon: Clock },
];

const AppLayout = ({ children }) => {
  const { isLoaded } = useUser();
  const pathname = usePathname();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <BarLoader width="60%" color="#36d7b7" />
      </div>
    );
  }

  const currentPage = navItems.find((item) => item.href === pathname)?.label || "Dashboard";

  return (
    <div className="flex flex-col h-screen bg-blue-50 md:flex-row">
      {/* Desktop Sidebar - hidden on mobile */}
      <aside className="hidden md:block w-64 bg-white shadow-md">
        <div className="p-4">
          <div className="font-bold text-xl text-gray-800 mb-6">MyApp</div>
        </div>
        <nav>
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-lg transition duration-200 ${
                      isActive 
                        ? "bg-blue-600 text-white font-medium" 
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                    aria-label={item.label}
                  >
                    <item.icon
                      className={`w-5 h-5 mr-3 ${
                        isActive ? "text-white" : "text-gray-600"
                      }`}
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20 md:pb-4 overflow-y-auto">
        <header className="flex justify-between items-center mb-4">
          <h2 className="text-3xl md:text-5xl font-bold gradient-title pt-2 md:pt-0 text-center md:text-left w-full">
            {currentPage}
          </h2>
        </header>
        {children}
      </main>

      {/* Mobile Bottom Navigation - shown only on mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-3 flex-1 ${
                  isActive ? "text-blue-600" : "text-gray-600"
                }`}
                aria-label={item.label}
              >
                <item.icon
                  className={`w-6 h-6 mb-1 ${
                    isActive ? "text-blue-600" : "text-gray-600"
                  }`}
                />
                <span className={`text-xs ${isActive ? "font-medium" : ""}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;