import { AuthProvider } from "@/context/auth-context";
import type { Metadata } from "next";
import { Outfit, Vazirmatn } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
});

const vazir = Vazirmatn({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-vazir",
});

export const metadata: Metadata = {
  title: "Quiz App",
  description: "Next.js + Outfit font",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${vazir.variable} antialiased`}>
        <Providers> {children} </Providers>
      </body>
    </html>
  );
}
