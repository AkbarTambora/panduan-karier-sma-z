// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Panduan Karier SMA Z",
  description: "Temukan minat, bakat, dan jalur karier impianmu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
