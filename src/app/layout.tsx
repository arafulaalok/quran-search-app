import type { Metadata } from "next";
import { Inter, Noto_Naskh_Arabic } from "next/font/google"; // Keep font loaders
import "./globals.css";
import { AISidebar } from "@/components/AISidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const arabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
});

export const metadata: Metadata = {
  title: "Quran Topics",
  description: "Find guidance from the Quran for every emotion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Using standard style tag or classNames if needed, but globals.css handles body
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${arabic.variable}`}
      >
        {children}
        <AISidebar />
      </body>
    </html>
  );
}
