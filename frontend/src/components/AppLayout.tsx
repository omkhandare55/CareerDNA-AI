"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const PUBLIC_ROUTES = ["/", "/login", "/register"];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (isPublicRoute) {
    return (
      <main className="min-h-screen w-full bg-[#020617] text-slate-50 font-sans">
        {children}
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
      <main className="lg:ml-70 p-4 sm:p-6 lg:p-8 flex-1 overflow-x-hidden overflow-y-auto bg-[#020617]">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
