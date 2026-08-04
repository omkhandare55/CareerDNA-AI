import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "CareerDNA AI — Lifelong AI Career Agent",
  description: "Persistent AI Career Agent powered by CockroachDB Vector Memory and AWS Bedrock",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="bg-[#020617] text-slate-50 min-h-screen flex flex-col font-sans">
        <Sidebar />
        <Header />
        <main className="ml-70 pt-4 p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
