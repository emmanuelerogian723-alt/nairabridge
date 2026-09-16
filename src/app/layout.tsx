import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@pollar/react/styles.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NairaBridge — Naira in. Bolivianos out.",
  description:
    "The Africa ↔ Latin America remittance corridor on Stellar. Fund from Nigeria, cash out in Bolivia — no seed phrases, no crypto knowledge. Powered by Pollar.",
};

export const viewport: Viewport = {
  themeColor: "#060a13",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
