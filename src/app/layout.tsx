import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import Script from "next/script";

import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import { ThemeProvider } from "../lib/theme";
import { LoadingProvider } from "../lib/loading-context";
import LoadingScreen from "../components/ui/LoadingScreen";

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
    <html lang="en" className="scroll-smooth light" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Prevent flash - ensure light mode is default before script runs */
            html { color-scheme: light !important; }
            html:not(.dark) { 
              --background: #ffffff !important;
              --foreground: #171717 !important;
            }
          `
        }} />
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){
  try{
    var stored = localStorage.getItem('theme');
    // Default to light mode to match SSR (prevents flash)
    var isDark = stored === 'dark';
    var root = document.documentElement;
    // Remove any existing theme classes
    root.classList.remove('light','dark');
    // Apply theme immediately
    root.classList.add(isDark ? 'dark' : 'light');
    root.style.colorScheme = isDark ? 'dark' : 'light';
  }catch(_e){
    // Fallback: ensure light mode on error
    document.documentElement.classList.add('light');
    document.documentElement.style.colorScheme = 'light';
  }
})();`}
        </Script>
      </head>
      <body
        className={`${clashDisplay.variable} antialiased`}
      >
        <ThemeProvider>
          <LoadingProvider>
            <LoadingScreen />
          <Header />
          {children}
          <Footer />
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
