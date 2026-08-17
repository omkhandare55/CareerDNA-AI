import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "@/components/AppLayout";

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
      <body className="bg-[#020617] text-slate-50 min-h-screen font-sans">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
