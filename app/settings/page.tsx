'use client';

import AppShell from "@/components/AppShell";

export default function Settings() {
  
  const handleTriggerImpor = () => {
    // Fungsi pemicu klik input file tersembunyi
    const el = document.getElementById('excel-file-input') as HTMLInputElement | null;
    if (el) el.click();
  };

  return (
    <AppShell>
      <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
        
        {/* 1. HEADER SETELAN */}
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-xl font-extrabold text-slate-100 tracking-wide">Setelan Aplikasi</h2>
          <p className="text-xs text-gray-400 mt-0.5">Kelola database lokal, keamanan privat, dan data ekspor/impor Anda.</p>
        </div>

        {/* 2. CARD UTAMA: BACKUP & SINKRONISASI DATA */}
        <div className="bg-[#1e293b] border border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-md">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <span className="text-lg">📦</span>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Backup & Ekspor Data</h3>
          </div>
          
          <p className="text-xs text-gray-400 leading-relaxed">
            Semua data keuangan <span className="text-blue-400 font-semibold">MyMoney</span> disimpan secara lokal di dalam browser Anda menggunakan <span className="text-blue-400 font-semibold">IndexedDB</span>. Demi menjaga keamanan data dari pembersihan history browser, lakukan ekspor berkala ke dalam file Excel (.xlsx).
          </p>
          
          {/* Aksi Data */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            {/* Tombol Ekspor */}
            <button 
              onClick={() => alert('Fungsi ekspor SheetJS dipicu')}
              className="flex-1 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md transition text-center flex items-center justify-center gap-2"
            >
              <span>🟢</span> Ekspor ke Excel (.xlsx)
            </button>

            {/* Tombol Impor Terintegrasi Sekaligus Input File Tersembunyi */}
            <div className="flex-1">
              <input 
                id="excel-file-input"
                type="file" 
                accept=".xlsx, .xls" 
                className="hidden" 
                onChange={(e) => {
                  const file = e.currentTarget.files?.[0];
                  if (file) alert(`File ${file.name} siap di-parsing!`);
                }}
              />
              <button 
                onClick={handleTriggerImpor}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold py-3 px-4 rounded-xl shadow-sm transition text-center flex items-center justify-center gap-2"
              >
                <span>📥</span> Impor dari Excel
              </button>
            </div>
          </div>
        </div>

        {/* 3. CARD TAMBAHAN: INFORMASI PRIVASI & SISTEM */}
        <div className="bg-[#1e293b] border border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-md">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <span className="text-lg">🛡️</span>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Privasi & Sistem</h3>
          </div>
          
          {/* Baris Informasi */}
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/40">
              <span className="text-gray-400">Lokasi Penyimpanan</span>
              <span className="font-semibold text-blue-400">Browser Lokal (IndexedDB)</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/40">
              <span className="text-gray-400">Enkripsi Server</span>
              <span className="font-semibold text-emerald-400">Tidak Ada (100% Offline Tanpa Awan)</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-gray-400">Versi Aplikasi</span>
              <span className="font-semibold text-slate-400">v1.0.0 (Production-Ready)</span>
            </div>
          </div>
        </div>

        {/* FOOTER KECIL */}
        <div className="text-center text-[10px] text-gray-500 pt-4">
          <p>Didesain untuk kebebasan dan keamanan privasi finansial Anda.</p>
        </div>

      </div>
    </AppShell>
  );
}