"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const PUBLIC_ROUTES = ["/", "/login", "/register"];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (isPublicRoute) {
    return (
      <main className="min-h-screen w-full bg-[#020617] text-slate-50 font-sans">
        {children}
      </main>
    );
  }

  return (
    <>
      <Sidebar />
      <Header />
      <main className="ml-70 pt-4 p-8 flex-1 overflow-y-auto min-h-screen bg-[#020617]">
        {children}
      </main>
    </>
  );
}
