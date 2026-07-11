"use client";

import AppShell from "@/components/AppShell";
import {
  Bot,
  ChartColumnBig,
  Contact,
  Lightbulb,
  Save,
  Shield,
} from "lucide-react";
import Image from "next/image";

export default function About() {
  return (
    <AppShell>
      <div className="w-full max-w-4xl mx-auto space-y-6 pb-12 text-black dark:text-white">
        {/* 1. HEADER ABOUT */}
        <div className="border-b border-zinc-200 dark:border-zinc-900 pb-4">
          <h2 className="text-xl font-black tracking-tight">Tentang MyMoney</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Mengenal lebih dekat sistem pencatatan keuangan yang aman dan
            privat.
          </p>
        </div>

        {/* 2. KARTU MANIFESTO PRIVASI & EFFICIENCY */}
        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-3">
            <span className="text-lg">
              <Shield />
            </span>
            <h3 className="text-xs font-black uppercase tracking-wider">
              Filosofi Keamanan Data
            </h3>
          </div>
          <p className="text-sm text-zinc-800 dark:text-zinc-300 leading-relaxed">
            Banyak aplikasi keuangan di luar sana yang menyimpan data sensitif
            Anda di server awan (*cloud*).{" "}
            <span className="text-black dark:text-white font-black">
              MyMoney
            </span>{" "}
            lahir dengan pendekatan yang berbeda. Kami percaya bahwa data
            keuangan Anda adalah hak privasi mutlak milik Anda sendiri.
          </p>
          <p className="text-sm text-zinc-800 dark:text-zinc-300 leading-relaxed">
            Aplikasi ini dirancang untuk beroperasi sepenuhnya di sisi klien
            (*client-side*). Tidak ada API backend tersembunyi, tidak ada
            pelacakan data personal, dan tidak ada risiko kebocoran data dari
            sisi server pihak ketiga.
          </p>
        </div>

        {/* 3. PROSES DEVELOPMENT & PERAN AI */}
        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-3">
            <span className="text-lg">
              <Bot />
            </span>
            <h3 className="text-xs font-black uppercase tracking-wider">
              Efisiensi Pengembangan
            </h3>
          </div>
          <p className="text-sm text-zinc-800 dark:text-zinc-300 leading-relaxed">
            Dalam proses pembuatannya, sebagian besar kode dan arsitektur
            aplikasi ini dibangun dengan bantuan teknologi{" "}
            <span className="font-bold text-black dark:text-white">
              Kecerdasan Buatan (AI)
            </span>
            . Langkah ini diambil secara sengaja untuk memangkas waktu
            pengerjaan (*development time*) agar tidak lambat, sekaligus
            membantu merancang tata letak antarmuka (UI) yang bersih, ergonomis,
            dan nyaman dipandang oleh pengguna.
          </p>
        </div>

        {/* 4. GRID CARA KERJA TEKNOLOGI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card Cara Kerja IndexedDB & Serwist PWA */}
          <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">
                <Save />
              </span>
              {/* 💡 DIUPDATE: Menambahkan konteks PWA Offline terintegrasi */}
              <h4 className="text-sm font-black">PWA Offline & Dexie.js</h4>
            </div>
            {/* 💡 DIUPDATE: Menambahkan kejelasan fitur fallback offline Serwist */}
            <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
              Data Anda disimpan langsung di penyimpanan internal browser
              melalui Dexie.js. Didukung oleh integrasi PWA modern dari Serwist,
              aplikasi ini tidak hanya menyimpan data, tetapi seluruh sistem web
              dapat dibuka, dijalankan, serta menyediakan halaman khusus saat
              perangkat Anda sepenuhnya offline.
            </p>
          </div>

          {/* Card Cara Kerja Ekspor Excel */}
          <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">
                <ChartColumnBig />
              </span>
              <h4 className="text-sm font-black">Portabilitas Excel</h4>
            </div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
              Karena data berada di tangan Anda, fitur ekspor dan impor melalui
              SheetJS bertindak sebagai jembatan *backup*. Anda memegang kendali
              penuh untuk memindahkan data Anda ke perangkat lain, menyimpannya
              di harddisk, atau membukanya langsung di Microsoft Excel/Google
              Sheets kapan saja.
            </p>
          </div>
        </div>

        {/* 5. SPECIAL THANKS / APRESIASI */}
        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-3">
            <span className="text-lg">
              <Lightbulb />
            </span>
            <h3 className="text-xs font-black uppercase tracking-wider">
              Apresiasi Khusus
            </h3>
          </div>
          <p className="text-sm text-zinc-800 dark:text-zinc-300 leading-relaxed">
            Aplikasi ini tidak akan pernah ada tanpa ide awal dari teman saya,{" "}
            <span className="font-black text-black dark:text-white underline decoration-zinc-400">
              Galvin
            </span>
            . Ide dasar proyek ini sepenuhnya berasal darinya, yang kemudian
            saya ambil dan kembangkan lebih jauh dengan menambahkan berbagai
            fitur pendukung serta optimalisasi sistem agar menjadi lebih lengkap
            dan interaktif. Terima kasih, Vin!
          </p>
        </div>

        {/* 6. SATU SECTION: PEMBUAT, KONTAK & LAPORAN BUG */}
        <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-900 pb-3">
            <span className="text-lg">
              <Contact />
            </span>
            <h3 className="text-xs font-black uppercase tracking-wider">
              Pembuat & Laporan Masalah
            </h3>
          </div>

          {/* Info Pembuat */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Aplikasi Dikembangkan Oleh:
            </p>
            <p className="text-sm font-black text-black dark:text-white">
              Farel Nanda Setiawan
            </p>
          </div>

          {/* Deskripsi Hubungi */}
          <div className="space-y-3 pt-1 border-t border-zinc-200 dark:border-zinc-900">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Menemukan masalah, celah eror pelacakan, atau punya saran fitur
              menarik lainnya? Silakan hubungi saya secara langsung melalui
              salah satu platform di bawah ini untuk memberikan masukan Anda.
            </p>

            {/* Tombol Pilihan Kontak (Gmail & Instagram) */}
            <div className="flex flex-wrap gap-3 pt-1">
              {/* Pilihan 1: Gmail */}
              <a
                href="mailto:farelnandasetiawan@gmail.com?subject=Feedback%20MyMoney%20App"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white dark:bg-white dark:text-black hover:bg-zinc-900 dark:hover:bg-zinc-100 text-xs font-black rounded-xl border border-transparent dark:border-zinc-200 shadow-sm transition duration-150 tracking-wide"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <span>Gmail</span>
              </a>

              {/* Pilihan 2: Instagram */}
              <a
                href="https://instagram.com/farelnandas"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-transparent text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs font-black rounded-xl border border-zinc-300 dark:border-zinc-700 shadow-sm transition duration-150 tracking-wide"
              >
                <svg
                  className="w-4 h-4 stroke-current fill-none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* 7. KARTU TEKNOLOGI */}
        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm text-center">
          <p className="text-xs text-zinc-400 font-bold">
            Aplikasi ini dikembangkan menggunakan teknologi modern:
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-3 text-[11px] font-mono text-zinc-800 dark:text-zinc-300 font-bold">
            <span className="bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-md border border-zinc-200 dark:border-zinc-800">
              Next.js 16
            </span>
            <span className="bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-md border border-zinc-200 dark:border-zinc-800">
              Tailwind CSS
            </span>
            <span className="bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-md border border-zinc-200 dark:border-zinc-800">
              Dexie.js
            </span>
            <span className="bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-md border border-zinc-200 dark:border-zinc-800">
              SheetJS
            </span>
            {/* 💡 DIUPDATE: Menampilkan label Serwist secara konsisten di dalam badge teknologi */}
            <span className="bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 text-black dark:text-white border-zinc-400 dark:border-zinc-600">
              Serwist PWA
            </span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
