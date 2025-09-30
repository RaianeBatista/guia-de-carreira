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
  title: "Guia de Carreira StackSpot - Orientação Profissional IA",
  description:
    "Assistente especializado em orientação de carreira powered by StackSpot AI. Receba conselhos personalizados sobre desenvolvimento profissional, transição de carreira e crescimento na área de tecnologia.",
  keywords:
    "orientação de carreira, desenvolvimento profissional, StackSpot, IA, tecnologia, carreira tech",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
