import { Orbitron, Share_Tech_Mono } from "next/font/google";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const shareTech = Share_Tech_Mono({
  variable: "--font-share-tech",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "DevPrep AI — Interview Prep Tracker",
  description:
    "Track coding questions, topics, revision plans, and daily streaks for developer interviews.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${shareTech.variable} h-full`}>
      <body className="min-h-full antialiased">
        <div className="relative min-h-full hud-grid-bg">
          <Navbar />
          <main className="relative mx-auto w-full max-w-6xl px-5 py-8 sm:px-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
