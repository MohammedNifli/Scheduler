"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { PenBox, Menu, X } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Header = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenCreateEvent = () => {
    router.push("?create=true");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="w-full border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto py-4 px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href={"/"} className="flex items-center relative z-20">
          <Image
            src="/logo.png"
            width="150"
            height="60"
            alt="Schedulrr logo"
            className="h-10 md:h-12 w-auto"
          />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
            Dashboard
          </Link>
          <Link href="/events" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
            My Events
          </Link>
          <Link href="/calendar" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
            Calendar
          </Link>
        </div>

        {/* Auth buttons and Menu button for mobile */}
        <div className="flex items-center gap-2">
          {/* Desktop Create Event button and auth */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-crosshair"
              onClick={handleOpenCreateEvent}
            >
              <PenBox size={18} />
              Create Event
            </Button>

            {status === "authenticated" ? (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign Out
                </Button>
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
                  <span className="text-blue-600 font-medium">
                    {session.user?.name?.charAt(0)}
                  </span>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              >
                Login
              </Button>
            )}
          </div>

          {/* Mobile authentication */}
          <div className="md:hidden flex items-center gap-3">
            {status === "authenticated" ? (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
                <span className="text-blue-600 font-medium">
                  {session.user?.name?.charAt(0)}
                </span>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              >
                Login
              </Button>
            )}
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-gray-100"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile navigation overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-white z-10 md:hidden flex flex-col">
            {/* Header with close button */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <Link href={"/"} className="flex items-center" onClick={closeMobileMenu}>
                <Image
                  src="/logo.png"
                  width="120"
                  height="48"
                  alt="Schedulrr logo"
                  className="h-8 w-auto"
                />
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-gray-100"
                onClick={closeMobileMenu}
                aria-label="Close menu"
              >
                <X size={24} />
              </Button>
            </div>
            
            {/* Menu content */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <div className="flex flex-col space-y-4">
                <Link 
                  href="/dashboard" 
                  className="text-gray-800 hover:text-blue-600 transition-colors font-medium text-lg py-3 border-b border-gray-100"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/events" 
                  className="text-gray-800 hover:text-blue-600 transition-colors font-medium text-lg py-3 border-b border-gray-100"
                  onClick={closeMobileMenu}
                >
                  My Events
                </Link>
                <Link 
                  href="/calendar" 
                  className="text-gray-800 hover:text-blue-600 transition-colors font-medium text-lg py-3 border-b border-gray-100"
                  onClick={closeMobileMenu}
                >
                  Calendar
                </Link>
              </div>
            </div>
            
            {/* Bottom action buttons */}
            <div className="px-4 py-4 border-t border-gray-100">
              <Button
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm w-full mb-3"
                onClick={() => {
                  handleOpenCreateEvent();
                  closeMobileMenu();
                }}
              >
                <PenBox size={18} />
                Create Event
              </Button>
              
              {status === "authenticated" ? (
                <Button
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 w-full"
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                    closeMobileMenu();
                  }}
                >
                  Sign Out
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 w-full"
                  onClick={() => {
                    signIn("google", { callbackUrl: "/dashboard" });
                    closeMobileMenu();
                  }}
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;