"use client";

import React, { useState } from "react";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/common/AdminSidebar";
import AdminHeader from "@/components/common/AdminHeader";
import "@/app/globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isAuthPage = pathname === "/login";

  return (
    <html lang="en">
      <head>
        <title>Empire Plaza Admin Portal</title>
      </head>
      <body className={`${inter.className} min-h-screen w-full m-0 p-0`}>
        {isAuthPage ? (
          <div className="min-h-screen w-full bg-brand-green-dark text-brand-cream flex items-center justify-center">
            {children}
          </div>
        ) : (
          <div className="min-h-screen bg-gray-50 flex selection:bg-brand-gold/30 text-gray-900">
            <AdminSidebar 
              isExpanded={isExpanded} 
              setIsExpanded={setIsExpanded}
              isMobileOpen={isMobileOpen}
              setIsMobileOpen={setIsMobileOpen}
            />
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
              <AdminHeader onMenuToggle={() => setIsMobileOpen(!isMobileOpen)} />
              <main className="flex-1 overflow-y-auto w-full bg-gray-100 ">
                {children}
              </main>
            </div>
          </div>
        )}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}