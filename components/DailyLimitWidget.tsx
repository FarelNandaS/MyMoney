"use client";

import React from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import { ShieldCheck, AlertTriangle, AlertCircle, TrendingDown } from "lucide-react";

interface Transaction {
  type: "Pemasukan" | "Pengeluaran";
  amount: number;
  dateStr: string;
}

interface DailyLimitWidgetProps {
  saldoUtama: number;
  transactions: Transaction[] | undefined;
}

export default function DailyLimitWidget({ saldoUtama, transactions }: DailyLimitWidgetProps) {
  const today = new Date();
  const currentDay = today.getDate();
  const totalDaysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  const remainingDays = Math.max(1, totalDaysInMonth - currentDay + 1);

  const formatKeFormatLokalStr = (date: Date): string => {
    const tahun = date.getFullYear();
    const bulan = String(date.getMonth() + 1).padStart(2, "0");
    const hari = String(date.getDate()).padStart(2, "0");
    return `${tahun}-${bulan}-${hari}`;
  };

  const todayStr = formatKeFormatLokalStr(today);

  const todayExpense = transactions
    ? transactions
        .filter((t) => t.dateStr === todayStr && t.type === "Pengeluaran")
        .reduce((sum, t) => sum + t.amount, 0)
    : 0;

  // 💡 JIKA DEFISIT / SALDO <= 0
  const isDeficit = saldoUtama < 0;
  const isZero = saldoUtama === 0;

  // Jika saldo positif, hitung batas harian normal. Jika defisit/0, batas = 0.
  const dailyLimit = saldoUtama > 0 ? Math.floor(saldoUtama / remainingDays) : 0;
  const remainingToday = dailyLimit - todayExpense;
  const percentageUsed = dailyLimit > 0 ? Math.round((todayExpense / dailyLimit) * 100) : 100;

  // Penentuan Status UI
  let statusColor = "border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20";
  let badgeColor = "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300";
  let progressBarColor = "bg-emerald-500";
  let statusText = "Aman";
  let icon = <ShieldCheck className="text-emerald-500" size={18} />;

  if (isDeficit) {
    statusColor = "border-rose-300 dark:border-rose-900 bg-rose-50/80 dark:bg-rose-950/40";
    badgeColor = "bg-rose-200 text-rose-800 dark:bg-rose-900 dark:text-rose-200";
    progressBarColor = "bg-rose-600";
    statusText = "Defisit Saldo";
    icon = <TrendingDown className="text-rose-600 dark:text-rose-400" size={18} />;
  } else if (isZero) {
    statusColor = "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50";
    badgeColor = "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
    progressBarColor = "bg-zinc-400";
    statusText = "Saldo Rp0";
    icon = <AlertCircle className="text-zinc-400" size={18} />;
  } else if (percentageUsed >= 100) {
    statusColor = "border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20";
    badgeColor = "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300";
    progressBarColor = "bg-rose-500";
    statusText = "Over Limit";
    icon = <AlertCircle className="text-rose-500" size={18} />;
  } else if (percentageUsed >= 80) {
    statusColor = "border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20";
    badgeColor = "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300";
    progressBarColor = "bg-amber-500";
    statusText = "Waspada";
    icon = <AlertTriangle className="text-amber-500" size={18} />;
  }

  return (
    <div className={`border rounded-2xl p-5 shadow-sm space-y-4 transition-all duration-300 ${statusColor}`}>
      {/* Header Widget */}
      <div className="flex justify-between items-center border-b border-zinc-200/60 dark:border-zinc-800/60 pb-3">
        <div className="flex items-center gap-2">
          {icon}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-black dark:text-white">
              Batas Aman Belanja Hari Ini
            </h4>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
              {isDeficit 
                ? "Keuangan dalam kondisi minus" 
                : `Sisa ${remainingDays} hari dalam bulan ini`}
            </p>
          </div>
        </div>

        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${badgeColor}`}>
          {statusText}
        </span>
      </div>

      {/* Rincian Angka Utama */}
      <div className="grid grid-cols-2 gap-2 items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {isDeficit ? "Total Defisit" : "Sisa Kuota Hari Ini"}
          </p>
          <h3 className={`text-xl font-black mt-0.5 tracking-tight ${isDeficit || remainingToday < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-black dark:text-white'}`}>
            {isDeficit ? formatCurrency(Math.abs(saldoUtama)) : formatCurrency(remainingToday)}
          </h3>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Target Maksimal
          </p>
          <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 mt-0.5">
            {formatCurrency(dailyLimit)} / hari
          </p>
        </div>
      </div>

      {/* Visual Bar / Pesan Khusus Jika Defisit */}
      {isDeficit ? (
        <div className="bg-rose-100/70 dark:bg-rose-900/30 p-2.5 rounded-xl border border-rose-200/60 dark:border-rose-800/50">
          <p className="text-[11px] font-bold text-rose-700 dark:text-rose-300">
            ⚠️ Pengeluaran melebihi pemasukan.
          </p>
          <p className="text-[10px] text-rose-600/90 dark:text-rose-400 mt-0.5">
            Sebaiknya tunda belanja non-esensial atau tambahkan catatan pemasukan baru.
          </p>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="w-full h-2 bg-zinc-200/80 dark:bg-zinc-800/80 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${progressBarColor}`}
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center text-[10px] text-zinc-500 font-medium">
            <span>Terpakai: {formatCurrency(todayExpense)}</span>
            {remainingToday < 0 && (
              <span className="text-rose-500 font-bold">
                Melebihi limit {formatCurrency(Math.abs(remainingToday))}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}