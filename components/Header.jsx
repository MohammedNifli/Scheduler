"use client"; // ✅ Mark it as a client component

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { PenBox, Menu } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import UserMenu from "./user-menu";
import { useRouter } from "next/navigation";

const Header = () => { // ✅ Remove "async"
  const router = useRouter(); 

  const handleOpenCreateEvent = () => {
    router.push("?create=true"); // ✅ Updates URL
  };

  return (
    <nav className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto py-3 px-4 md:px-6 flex items-center justify-between">
        <Link href={"/"} className="flex items-center">
          <Image
            src="/logo.png"
            width="150"
            height="60"
            alt="Schedulrr logo"
            className="h-12 w-auto"
          />
        </Link>

        {/* Mobile menu button - shown on small screens */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu size={24} />
          </Button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
            Dashboard
          </Link>
          <Link href="/events" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
            My Events
          </Link>
          <Link href="/calendar" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
            Calendar
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hidden md:flex cursor-crosshair"
            onClick={handleOpenCreateEvent} // ✅ No Link, we use router.push()
          >
            <PenBox size={18} />
            Create Event
          </Button>
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Login
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserMenu />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Header;
