import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Schedulrr",
  description: "Meeting Scheduling app",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}> 
          <Header className="sticky" />

          <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {" "}
            {children}
          </main>
          {/* <Footer/> */}
          <Footer/>
        </body>
      </html>
    </ClerkProvider>
  );
}
