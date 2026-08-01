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
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://mymoney-id.vercel.app"),

  // Judul Utama (Branded + Keyword)
  title: {
    default: "MyMoney by Farel – Pencatat Keuangan Harian",
    template: "%s | MyMoney by Farel",
  },

  // Deskripsi Detail & Panjang (Teroptimasi untuk SEO Google Snippet)
  description:
    "MyMoney by Farel adalah aplikasi web pencatatan keuangan harian pribadi yang dikembangkan oleh Farel Nanda Setiawan. Dirancang khusus untuk membantu Anda melacak arus kas (pemasukan & pengeluaran), memantau komposisi belanja, dan menghitung kuota Batas Aman Belanja Harian secara otomatis. 100% gratis, tanpa perlu register/login, tanpa iklan, dan seluruh data tersimpan dengan sangat privat di database lokal browser (IndexedDB) Anda.",

  keywords: [
    "MyMoney by Farel",
    "MyMoney Farel",
    "MyMoney",
    "Farel Nanda Setiawan",
    "Catat Keuangan Harian",
    "Pencatat Pengeluaran Privat",
    "Batas Aman Belanja Harian",
    "Aplikasi Keuangan Tanpa Login",
    "Indie Personal Finance App",
    "Buku Kas Browser Lokal",
    "Money Tracker Indonesia",
  ],

  authors: [{ name: "Farel Nanda Setiawan", url: "https://github.com/FarelNandaS" }],
  creator: "Farel Nanda Setiawan",
  publisher: "Farel Nanda Setiawan",

  alternates: {
    canonical: "/",
  },

  // OpenGraph untuk Tampilan Preview di WhatsApp / Telegram / Facebook
  openGraph: {
    title: "MyMoney by Farel – Pencatat Keuangan Harian & Limit Belanja Privat",
    description:
      "Kelola keuangan harian dan pantau batas aman belanjamu dengan mudah. Aplikasi pencatat pengeluaran indie karya Farel Nanda Setiawan yang 100% privat, tanpa login, dan tanpa iklan.",
    url: "https://mymoney-id.vercel.app",
    siteName: "MyMoney by Farel",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Preview Aplikasi MyMoney by Farel",
      },
    ],
  },

  // Twitter / X Preview Card
  twitter: {
    card: "summary_large_image",
    title: "MyMoney by Farel – Pencatat Keuangan Harian & Limit Belanja",
    description:
      "Aplikasi web pencatatan keuangan harian privat karya Farel Nanda Setiawan. Lacak transaksi dan kuota belanja harian tanpa perlu login.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/manifest.webmanifest",
  
  verification: {
    google: "agROQ63Dl86d7ogJSvW5QOatzS1VTv9cNA0RIvJPuq4",
  },
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
