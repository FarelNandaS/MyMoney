"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { TriangleAlert, X } from "lucide-react";

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

interface ConfirmContextType {
  askConfirmation: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  // Fungsi utama yang akan dipanggil di page.tsx menggunakan await
  const askConfirmation = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    setIsOpen(true);
    
    // Mengembalikan Promise agar bisa ditunggu (await) oleh fungsi pemanggil
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  }, []);

  const handleConfirm = () => {
    if (resolver) resolver(true);
    setIsOpen(false);
  };

  const handleCancel = () => {
    if (resolver) resolver(false);
    setIsOpen(false);
  };

  // Pengaturan warna tombol & ikon sesuai tipe konfirmasi
  const typeStyles = {
    danger: {
      iconBg: "bg-red-50 dark:bg-red-950/30",
      iconColor: "text-red-500",
      btnConfirm: "bg-red-500 text-white hover:bg-red-600 border-red-500",
    },
    warning: {
      iconBg: "bg-amber-50 dark:bg-amber-950/30",
      iconColor: "text-amber-500",
      btnConfirm: "bg-amber-500 text-white hover:bg-amber-600 border-amber-500",
    },
    info: {
      iconBg: "bg-zinc-100 dark:bg-zinc-900",
      iconColor: "text-zinc-500",
      btnConfirm: "bg-black text-white dark:bg-white dark:text-black hover:opacity-90",
    },
  };

  const currentStyle = typeStyles[options?.type || "info"];

  return (
    <ConfirmContext.Provider value={{ askConfirmation }}>
      {children}

      {/* 💡 UI MODAL CONFIRMATION OVERLAY */}
      {isOpen && options && (
        <div 
          // 💡 1. Tambahkan onClick={handleCancel} pada area background gelap modal
          onClick={handleCancel}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div 
            // 💡 2. Tambahkan e.stopPropagation() agar klik di dalam kotak putih ini tidak dianggap mengklik luar modal
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 w-full max-w-sm rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200"
          >
            
            {/* Header Modal */}
            <div className="p-5 flex items-start gap-3">
              <div className={`p-2 rounded-lg flex-shrink-0 ${currentStyle.iconBg} ${currentStyle.iconColor}`}>
                <TriangleAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-sm font-black text-black dark:text-white tracking-tight">
                  {options.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {options.message}
                </p>
              </div>
            </div>

            {/* Footer / Tombol Aksi */}
            <div className="bg-zinc-50 dark:bg-zinc-950/50 px-5 py-3 border-t border-zinc-100 dark:border-zinc-900 flex justify-end gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                {options.cancelText || "Batal"}
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${currentStyle.btnConfirm}`}
              >
                {options.confirmText || "Ya, Lanjutkan"}
              </button>
            </div>

          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

// Custom Hook untuk memanggil di halaman komponen
export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm harus digunakan di dalam <ConfirmProvider>");
  }
  return context;
}