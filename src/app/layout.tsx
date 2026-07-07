import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nepali Interest Calculator | नेपाली ब्याज गणना | BS Calendar",
  description:
    "Calculate compound interest using Bikram Sambat (BS) calendar and Nepali banking methods. Free, accurate, professional-grade financial calculator for Nepal.",
  keywords:
    "nepali interest calculator, BS calendar interest, bikram sambat calculator, nepal finance, compound interest nepal, nepali banking, ब्याज गणना",
  authors: [{ name: "Nepali Interest Calculator" }],
  openGraph: {
    title: "Nepali Interest Calculator | नेपाली ब्याज गणना",
    description:
      "Free compound interest calculator using BS calendar and Nepali banking methods.",
    type: "website",
    locale: "ne_NP",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ne">
      <head>
        {/* 
          GOOGLE ADSENSE HEAD SCRIPT
          Uncomment and add your Publisher ID after AdSense approval:
          
          <script 
            async 
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
            crossOrigin="anonymous"
          />
        */}
      </head>
      <body className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
