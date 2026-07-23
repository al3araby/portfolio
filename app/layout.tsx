import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Mohamed Elaraby — AI & Full-Stack & CS Engineer",
  description:
    "Mohamed Ebrahim Elaraby — AI & LLM engineering, full-stack development, cybersecurity and backend engineering.",
  keywords: [
    "AI Engineer",
    "Full-Stack Developer",
    "LLM",
    "Multi-Agent Systems",
    "Next.js",
    "Three.js",
  ],
  icons: {
    icon: "/p.ico",
  },
  openGraph: {
    images: "/og-image.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="film-grain min-h-full">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
