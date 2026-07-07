'use client';

import AppShell from "@/components/AppShell";

export default function About() {
  return (
    <AppShell>
      <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
        
        {/* 1. HEADER ABOUT */}
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-xl font-extrabold text-slate-100 tracking-wide">Tentang MyMoney</h2>
          <p className="text-xs text-gray-400 mt-0.5">Mengenal lebih dekat sistem pencatatan keuangan yang aman dan privat.</p>
        </div>

        {/* 2. KARTU MANIFESTO PRIVASI */}
        <div className="bg-[#1e293b] border border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-md">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <span className="text-lg">🛡️</span>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Filosofi Keamanan Data</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Banyak aplikasi keuangan di luar sana yang menyimpan data sensitif Anda di server awan (*cloud*). <span className="text-blue-400 font-semibold">MyMoney</span> lahir dengan pendekatan yang berbeda. Kami percaya bahwa data keuangan Anda adalah hak privasi mutlak milik Anda sendiri.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            Aplikasi ini dirancang untuk beroperasi sepenuhnya di sisi klien (*client-side*). Tidak ada API backend tersembunyi, tidak ada pelacakan data personal, dan tidak ada risiko kebocoran data dari sisi server pihak ketiga.
          </p>
        </div>

        {/* 3. GRID CARA KERJA TEKNOLOGI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card Cara Kerja IndexedDB */}
          <div className="bg-[#1e293b] border border-slate-800/80 p-5 rounded-2xl shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">💾</span>
              <h4 className="text-sm font-bold text-slate-200">IndexedDB & Dexie.js</h4>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Data Anda disimpan langsung di dalam ruang penyimpanan internal browser perangkat Anda sendiri. Teknologi IndexedDB bertindak seperti database mini kokoh yang memastikan catatan keuangan Anda tetap aman tersimpan bahkan saat aplikasi ditutup atau perangkat Anda sedang offline.
            </p>
          </div>

          {/* Card Cara Kerja Ekspor Excel */}
          <div className="bg-[#1e293b] border border-slate-800/80 p-5 rounded-2xl shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">📊</span>
              <h4 className="text-sm font-bold text-slate-200">Portabilitas Excel</h4>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Karena data berada di tangan Anda, fitur ekspor dan impor melalui SheetJS bertindak sebagai jembatan *backup*. Anda memegang kendali penuh untuk memindahkan data Anda ke perangkat lain, menyimpannya di harddisk, atau membukanya langsung di Microsoft Excel/Google Sheets kapan saja.
            </p>
          </div>

        </div>

        {/* 4. KARTU PROFIL PENGEMBANG (OPSIONAL/MINIMALIS) */}
        <div className="bg-[#1e293b] border border-slate-800/80 rounded-2xl p-6 shadow-md text-center">
          <p className="text-xs text-gray-400">Aplikasi ini dikembangkan menggunakan teknologi modern:</p>
          <div className="flex flex-wrap justify-center gap-3 mt-3 text-[11px] font-mono text-blue-400">
            <span className="bg-[#0f172a] px-3 py-1 rounded-md border border-slate-800">Next.js 16</span>
            <span className="bg-[#0f172a] px-3 py-1 rounded-md border border-slate-800">Tailwind CSS</span>
            <span className="bg-[#0f172a] px-3 py-1 rounded-md border border-slate-800">Dexie.js</span>
            <span className="bg-[#0f172a] px-3 py-1 rounded-md border border-slate-800">SheetJS</span>
          </div>
        </div>

      </div>
    </AppShell>
  );
}