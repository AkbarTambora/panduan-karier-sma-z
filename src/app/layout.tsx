// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SessionProvider } from "@/components/SessionProvider";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Panduan Karier SMA Z",
  description: "Temukan minat, bakat, dan jalur karier impianmu dengan tes kepribadian RIASEC.",
  openGraph: {
    title: "Panduan Karier SMA Z",
    description: "Temukan minat, bakat, dan jalur karier impianmu.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <SessionProvider>
          <Navbar />
          {children}
        </SessionProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
