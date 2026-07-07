'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type props = {
    children: React.ReactNode;
}

export default function AppShell({ children } : props) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const isActive = (path : string) => pathname === path 
    ? 'text-blue-400 font-bold' 
    : 'text-gray-400 hover:text-gray-200';

  return (
    <div className="w-full min-h-screen bg-[#0f172a] text-slate-100 flex flex-col pb-24 md:pb-6 transition-colors duration-200">
      
      {/* HEADER */}
      <header className="w-full max-w-7xl mx-auto px-4 py-4 md:px-8 flex justify-between items-center border-b border-slate-800 bg-[#0f172a]">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔮</span>
          <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400 tracking-wide">
            MyMoney
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-gray-400">Selasa, 7 Juli</span>
          <span className="hidden md:inline-block text-xs bg-indigo-950 text-indigo-400 border border-indigo-800 px-3 py-1 rounded-full font-medium">
            Database Lokal
          </span>
        </div>
      </header>

      {/* AREA KONTEN UTAMA */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:px-8 overflow-y-auto">
        {children}
      </main>

      {/* 📱 NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-[#1e293b]/90 backdrop-blur-md px-4 py-2 z-20 shadow-xl">
        <div className="max-w-4xl mx-auto flex justify-between items-center h-14 relative">
          
          {/* Menu Beranda */}
          <button onClick={() => router.push('/')} className={`flex flex-col items-center justify-center w-16 h-full ${isActive('/')}`}>
            <span className="text-xl">🏠</span>
            <span className="text-[10px] md:text-xs mt-0.5">Home</span>
          </button>

          {/* Menu Riwayat */}
          <button onClick={() => router.push('/history')} className={`flex flex-col items-center justify-center w-16 h-full ${isActive('/history')}`}>
            <span className="text-xl">📋</span>
            <span className="text-[10px] md:text-xs mt-0.5">History</span>
          </button>

          {/* ➕ Tombol Tambah Tengah -> Navigasi Ke Page Baru */}
          <div className="absolute -top-7 left-1/2 -translate-x-1/2">
            <button 
              onClick={() => router.push('/add')}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 transform hover:-translate-y-0.5 ${
                pathname === '/add' 
                  ? 'bg-linear-to-tr from-blue-500 to-teal-400 ring-4 ring-blue-500/30' 
                  : 'bg-linear-to-tr from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400'
              }`}
            >
              <span className="text-2xl font-bold text-white">+</span>
            </button>
          </div>
          
          <div className="w-14"></div>

          {/* Menu Setelan */}
          <button onClick={() => router.push('/settings')} className={`flex flex-col items-center justify-center w-16 h-full ${isActive('/settings')}`}>
            <span className="text-xl">⚙️</span>
            <span className="text-[10px] md:text-xs mt-0.5">Settings</span>
          </button>

          {/* Menu About */}
          <button onClick={() => router.push('/about')} className={`flex flex-col items-center justify-center w-16 h-full ${isActive('/about')}`}>
            <span className="text-xl">❓</span>
            <span className="text-[10px] md:text-xs mt-0.5">About</span>
          </button>

        </div>
      </nav>
    </div>
  );
}