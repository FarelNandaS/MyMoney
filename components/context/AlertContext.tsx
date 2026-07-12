"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

type AlertType = "success" | "warning" | "error" | "info";

interface AlertMessage {
  id: string;
  message: string;
  type: AlertType;
}

interface AlertContextType {
  showAlert: (message: string, type?: AlertType, duration?: number) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  // Fungsi untuk memicu munculnya alert
  const showAlert = useCallback((message: string, type: AlertType = "info", duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    // Tambah alert baru ke dalam list
    setAlerts((prev) => [...prev, { id, message, type }]);

    // Otomatis hapus alert setelah durasi habis
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, duration);
  }, []);

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  // Konfigurasi style ikon & warna (Sesuai tema MyMoney)
  const alertStyles = {
    success: "bg-emerald-100 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300",
    warning: "bg-amber-100 dark:bg-amber-950 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300",
    error: "bg-red-100 dark:bg-red-950 border-red-300 dark:border-red-800 text-red-900 dark:text-red-300",
    info: "bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200",
  };

  const alertIcons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
    error: <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />,
    info: <Info className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />,
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      {/* 💡 TEMPAT STRATEGIS TAMPILAN ALERT (Melayang di atas layar) */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 space-y-2 pointer-events-none">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`flex items-start justify-between p-4 rounded-xl border shadow-lg pointer-events-auto transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${alertStyles[alert.type]}`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 mt-0.5">{alertIcons[alert.type]}</div>
              <p className="text-xs font-bold leading-relaxed">{alert.message}</p>
            </div>
            <button
              onClick={() => removeAlert(alert.id)}
              className="ml-4 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-current opacity-60 hover:opacity-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
}

// 💡 Buat custom hook bernama useAlert agar pemanggilannya sangat simpel
export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert harus digunakan di dalam komponen yang dibungkus <AlertProvider>");
  }
  return context;
}