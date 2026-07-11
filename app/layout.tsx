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
  title: "MyMoney",
  description: "Website ini adalah web untuk mencatat keuangan anda agar anda dapat memonitor keuangan anda",
  openGraph: {
    siteName: 'MyMoney',
    title: "MyMoney | Website pencatatan uang",
    description: "Website pencatatan uang privat mengunakan database local tanpa campur tangan dari pihak manapun.",
    type: 'website',
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: "/icon.png",
  },
  authors: [{name: "Farel Nanda Setiawan"}],
  keywords: ['My Money', 'My money id', 'Pengelola uang', 'Pengelola uang indonesia', 'Monitoring uang'],
  verification: {
    google: "agROQ63Dl86d7ogJSvW5QOatzS1VTv9cNA0RIvJPuq4"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
