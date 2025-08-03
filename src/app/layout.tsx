import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FooterWrapper from "@/components/FooterWrapper";
import Navbar from "@/components/Navbar";
import Providers from "@/components/providers";
import ChatbotWrapper from "@/components/ChatbotWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tandur - Platform Digital Langsung dari Petani ke Konsumen",
  description:
    "Tandur adalah platform pertanian digital yang mempertemukan petani dengan konsumen tanpa perantara. Jual beli hasil tani langsung dari sumbernya, transparan, adil, dan mudah.",
  keywords: [
    "pertanian digital",
    "petani",
    "jual beli hasil tani",
    "platform pertanian",
    "tanaman",
    "produk pertanian",
  ],
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} scrollbar-none antialiased`}
        suppressHydrationWarning={true}
      >
        <Providers>
          <Navbar />
          {children}
          <ChatbotWrapper />
          <FooterWrapper />
        </Providers>
      </body>
    </html>
  );
}
