'use client'

import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-full text-zinc-500 mb-4 animate-pulse">
        <WifiOff size={40} />
      </div>
      <h1 className="text-xl font-black tracking-tighter mb-2">
        Halaman Belum Tersedia Offline
      </h1>
      <p className="text-sm text-zinc-500 max-w-sm">
        Kamu sedang offline, dan halaman ini belum pernah kamu buka sebelumnya sehingga belum tersimpan di memori lokal perangkatmu.
      </p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-6 px-4 py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black rounded-xl font-bold text-xs active:scale-95 transition"
      >
        Coba Muat Ulang
      </button>
    </div>
  );
}