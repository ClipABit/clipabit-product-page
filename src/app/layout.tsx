import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

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
        <script src="https://waitlister.me/js/embed.js" defer></script>
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
