import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import Script from "next/script";

import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import { ThemeProvider } from "../lib/theme";

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
    <html lang="en" className="scroll-smooth dark">
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){
  try{
    var stored = localStorage.getItem('theme');
    // Default to dark when no stored preference
    var isDark = stored ? stored === 'dark' : true;
    var root = document.documentElement;
    root.classList.toggle('dark', isDark);
    root.classList.toggle('light', !isDark);
  }catch(_e){}
})();`}
        </Script>
      </head>
      <body
        className={`${clashDisplay.variable} antialiased`}
      >
        <ThemeProvider>
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
