"use client"

import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CreateEventDrawer from "@/components/create-event";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { usePathname } from "next/navigation";
import { Toaster, toast } from 'sonner' 


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  
  return (
    <SessionProviderWrapper>
      <html lang="en">
        <body className={inter.className}>
          <Header className="sticky" />
          <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {children}
            <Toaster position="top-center" richColors />
          </main>
          <FooterConditional />
          <CreateEventDrawer />
        </body>
      </html>
    </SessionProviderWrapper>
  );
}


function FooterConditional() {
  const pathname = usePathname();
  

  if (pathname === '/') {
    return <Footer />;
  }
  
  return null;
}