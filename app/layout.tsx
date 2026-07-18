import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AlertProvider } from "@/components/context/AlertContext";
import { ConfirmProvider } from "@/components/context/ConfirmContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "MyMoney - Aplikasi Pencatat Keuangan Pribadi & Privat",
    template: "%s | MyMoney"
  },
  description:
    "Kelola dan monitor keuangan Anda dengan aman dan privat menggunakan MyMoney. Aplikasi pencatatan keuangan lokal tanpa pelacakan data.",
  authors: [{ name: "Farel Nanda Setiawan" }],
  keywords: [
    "MyMoney",
    "Aplikasi pengelola uang",
    "Catat keuangan harian",
    "Aplikasi keuangan privat",
    "Monitoring pengeluaran gratis",
    "Pencatat keuangan lokal",
    "PWA keuangan offline"
  ],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png", // Dukungan ikon perangkat iOS
  },
  openGraph: {
    siteName: "MyMoney",
    title: "MyMoney | Aplikasi Pencatat Keuangan Pribadi & Privat",
    description:
      "Pantau pengeluaran dan pemasukan dengan aman. 100% data disimpan secara lokal di perangkat Anda tanpa campur tangan pihak luar.",
    type: "website",
    url: "https://mymoney-id.vercel.app",
    images: [
      {
        url: "/og-image.png", // Siapkan gambar ukuran 1200x630 di folder public untuk thumbnail share
        width: 1200,
        height: 630,
        alt: "MyMoney Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MyMoney | Aplikasi Pencatat Keuangan Pribadi",
    description: "Catat dan monitor keuangan harian secara offline dengan aman.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "agROQ63Dl86d7ogJSvW5QOatzS1VTv9cNA0RIvJPuq4",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <AlertProvider>
          <ConfirmProvider>
            {children}
          </ConfirmProvider>
        </AlertProvider>
      </body>
    </html>
  );
}
