"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { PenBox, Menu } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Header = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleOpenCreateEvent = () => {
    router.push("?create=true");
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

        {/* Mobile menu button */}
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
            onClick={handleOpenCreateEvent}
          >
            <PenBox size={18} />
            Create Event
          </Button>

          {status === "authenticated" ? (
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign Out
              </Button>
              {/* Replace with your UserMenu if needed */}
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
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
      </div>
    </nav>
  );
};

export default Header;