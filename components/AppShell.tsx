'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

type props = {
    children: React.ReactNode;
}

export default function AppShell({ children } : props) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let savedTheme = localStorage.getItem('theme');

    if (!savedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      savedTheme = prefersDark ? 'dark' : 'light';
      localStorage.setItem('theme', savedTheme);
    }

    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const isActive = (path : string) => pathname === path 
    ? 'text-black dark:text-white font-black' 
    : 'text-zinc-400 dark:text-zinc-600 hover:text-black dark:hover:text-white';

  return (
    <div className="w-full min-h-screen bg-white text-black dark:bg-black dark:text-white flex flex-col pb-24 md:pb-6 transition-colors duration-200">
      
      {/* HEADER */}
      <header className="w-full max-w-7xl mx-auto px-4 py-4 md:px-8 flex justify-between items-center border-b border-zinc-200 dark:border-zinc-900 bg-white dark:bg-black">
        <div className="flex items-center gap-3">
          <span className="text-2xl"><Image src={'/icon.png'} alt='icon' width={45} height={45}/></span>
          <h1 className="text-xl font-black tracking-tighter">MyMoney</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-zinc-500">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
          <span className="hidden md:inline-block text-xs bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 px-3 py-1 rounded-full font-bold">
            Database Lokal
          </span>
        </div>
      </header>

      {/* AREA KONTEN UTAMA */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:px-8 overflow-y-auto">
        {children}
      </main>

      {/* 📱 NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-zinc-200 dark:border-zinc-900 bg-white/95 dark:bg-black/95 backdrop-blur-md px-4 z-20 shadow-xl">
        <div className="max-w-4xl mx-auto flex justify-between items-center h-16 relative">
          
          <button onClick={() => router.push('/')} className={`flex flex-col items-center justify-center w-16 h-full transition ${isActive('/')}`}>
            <span className="text-xl">🏠</span>
            <span className="text-[10px] font-bold mt-0.5">Home</span>
          </button>

          <button onClick={() => router.push('/history')} className={`flex flex-col items-center justify-center w-16 h-full transition ${isActive('/history')}`}>
            <span className="text-xl">📋</span>
            <span className="text-[10px] font-bold mt-0.5">History</span>
          </button>

          {/* ➕ Tombol Tambah Tengah dengan aksen warna */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <button 
              onClick={() => router.push('/add')}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 transform hover:-translate-y-0.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black hover:bg-black dark:hover:bg-white border border-zinc-700 dark:border-zinc-300`}
            >
              <span className="text-2xl font-black">+</span>
            </button>
          </div>
          
          <div className="w-14"></div>

          <button onClick={() => router.push('/settings')} className={`flex flex-col items-center justify-center w-16 h-full transition ${isActive('/settings')}`}>
            <span className="text-xl">⚙️</span>
            <span className="text-[10px] font-bold mt-0.5">Settings</span>
          </button>

          <button onClick={() => router.push('/about')} className={`flex flex-col items-center justify-center w-16 h-full transition ${isActive('/about')}`}>
            <span className="text-xl">❓</span>
            <span className="text-[10px] font-bold mt-0.5">About</span>
          </button>

        </div>
      </nav>
    </div>
  );
}