import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Room Booking App",
  description: "A clean and minimal room booking system built with Next.js 15, Prisma, and SQLite.",
  keywords: ["Next.js", "Prisma", "Room Booking", "Tailwind CSS", "TypeScript", "SQLite"],
  authors: [{ name: "Jesper Hagman", url: "https://github.com/JesperHagman" }],
  creator: "Jesper Hagman",
  publisher: "Jesper Hagman",

  openGraph: {
    title: "Room Booking App",
    description: "Book meeting rooms quickly and easily with this minimal full-stack Next.js app.",
    url: "https://room-booking.vercel.app",
    siteName: "Room Booking App",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Room Booking App",
    description: "Book meeting rooms quickly and easily with this minimal full-stack Next.js app.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-white text-black antialiased`}>
        {children}
      </body>
    </html>
  );
}
