"use client";

import { useSession } from "next-auth/react";
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
  const { status } = useSession();
  const pathname = usePathname();

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <BarLoader color="#3b82f6" height={4} width={100} />
      </div>
    );
  }

  const currentPage = navItems.find((item) => item.href === pathname)?.label || "Dashboard";

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar - hidden on mobile */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-white md:flex md:flex-col">
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">MyApp</h1>
        </div>
        <nav className="flex flex-1 flex-col p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const ItemIcon = item.icon;
              return (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className={`flex items-center rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                      isActive 
                        ? "bg-blue-50 text-blue-600" 
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <ItemIcon className={`mr-3 h-5 w-5 ${isActive ? "text-blue-600" : "text-gray-500"}`} />
                    <span>{item.label}</span>
                    {isActive && <div className="ml-auto h-2 w-2 rounded-full bg-blue-600"></div>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
          <h2 className="text-lg font-semibold text-gray-800">{currentPage}</h2>
          <div className="flex items-center space-x-4">
            <button className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </button>
            <div className="h-8 w-8 rounded-full bg-blue-500 text-center text-white flex items-center justify-center">
              <span className="text-sm font-medium">JD</span>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation - shown only on mobile */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white md:hidden">
        <nav className="flex justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const ItemIcon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center justify-center py-3 ${
                  isActive ? "text-blue-600" : "text-gray-600"
                }`}
              >
                <ItemIcon className={`h-6 w-6 ${isActive ? "text-blue-600" : "text-gray-500"}`} />
                <span className="mt-1 text-xs">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default AppLayout;