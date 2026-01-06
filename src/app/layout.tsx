import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";

const clashDisplay = localFont({
  variable: "--font-clash-display",
  src: "../../public/fonts/ClashDisplay-Variable.woff2",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ClipABit",
  description: "ClipABit — Search by ideas, not timestamps",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
      </head>
      <body
        className={`${clashDisplay.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
