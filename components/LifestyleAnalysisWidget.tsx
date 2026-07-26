"use client";

import React from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import { TrendingUp, TrendingDown, Flame, Scale, Sparkles } from "lucide-react";

interface Transaction {
  type: "Pemasukan" | "Pengeluaran";
  amount: number;
  category: string;
  dateStr: string; // YYYY-MM-DD
}

interface LifestyleAnalysisWidgetProps {
  transactions: Transaction[] | undefined;
}

export default function LifestyleAnalysisWidget({ transactions }: LifestyleAnalysisWidgetProps) {
  if (!transactions || transactions.length === 0) return null;

  // Helper Tanggal Lokal YYYY-MM-DD
  const formatKeFormatLokalStr = (date: Date): string => {
    const tahun = date.getFullYear();
    const bulan = String(date.getMonth() + 1).padStart(2, "0");
    const hari = String(date.getDate()).padStart(2, "0");
    return `${tahun}-${bulan}-${hari}`;
  };

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const todayStr = formatKeFormatLokalStr(today);
  const yesterdayStr = formatKeFormatLokalStr(yesterday);

  // 1. Kalkulasi Pengeluaran Hari Ini vs Kemarin
  const todayExpenses = transactions
    ? transactions
        .filter((t) => t.dateStr === todayStr && t.type === "Pengeluaran")
        .reduce((sum, t) => sum + t.amount, 0)
    : 0;

  const yesterdayExpenses = transactions
    ? transactions
        .filter((t) => t.dateStr === yesterdayStr && t.type === "Pengeluaran")
        .reduce((sum, t) => sum + t.amount, 0)
    : 0;

  // Hitung Selisih & Persentase
  const diffExpense = todayExpenses - yesterdayExpenses;
  let percentChange = 0;
  if (yesterdayExpenses > 0) {
    percentChange = Math.round((Math.abs(diffExpense) / yesterdayExpenses) * 100);
  } else if (todayExpenses > 0) {
    percentChange = 100;
  }

  // 2. Kalkulasi Hari Paling Boros (Peak Day dalam 30 Hari Terakhir)
  const daysOfWeek = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const expenseByDay: Record<string, number> = {
    Senin: 0,
    Selasa: 0,
    Rabu: 0,
    Kamis: 0,
    Jumat: 0,
    Sabtu: 0,
    Minggu: 0,
  };

  transactions.forEach((t) => {
    if (t.type === "Pengeluaran" && t.dateStr) {
      const dateParts = t.dateStr.split("-");
      if (dateParts.length === 3) {
        const d = new Date(
          parseInt(dateParts[0]),
          parseInt(dateParts[1]) - 1,
          parseInt(dateParts[2])
        );
        const dayName = daysOfWeek[d.getDay()];
        expenseByDay[dayName] = (expenseByDay[dayName] || 0) + t.amount;
      }
    }
  });

  let peakDay = "Belum Ada Data";
  let maxAmount = 0;
  for (const [day, amount] of Object.entries(expenseByDay)) {
    if (amount > maxAmount) {
      maxAmount = amount;
      peakDay = day;
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles size={18} className="text-zinc-600 dark:text-zinc-400" />
        <h4 className="text-xs font-black uppercase tracking-wider text-black dark:text-white">
          Analisis Gaya Hidup
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CARD 1: COMPARISON HARI INI VS KEMARIN */}
        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Perbandingan Harian
            </span>
            <div
              className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md ${
                diffExpense > 0
                  ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
                  : diffExpense < 0
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
              }`}
            >
              {diffExpense > 0 ? (
                <>
                  <TrendingUp size={12} /> Lebih Boros {percentChange}%
                </>
              ) : diffExpense < 0 ? (
                <>
                  <TrendingDown size={12} /> Lebih Hemat {percentChange}%
                </>
              ) : (
                "Sama Dengan Kemarin"
              )}
            </div>
          </div>

          <div>
            <p className="text-2xl font-black text-black dark:text-white">
              {formatCurrency(todayExpenses)}
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Kemarin menghabiskan{" "}
              <span className="font-bold text-zinc-600 dark:text-zinc-300">
                {formatCurrency(yesterdayExpenses)}
              </span>
            </p>
          </div>

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-900 text-[11px] text-zinc-500">
            {diffExpense > 0 ? (
              <span>
                Pengeluaranmu hari ini membengkak{" "}
                <strong className="text-rose-500">
                  +{formatCurrency(Math.abs(diffExpense))}
                </strong>{" "}
                dibanding kemarin.
              </span>
            ) : diffExpense < 0 ? (
              <span>
                Bagus! Kamu berhasil hemat{" "}
                <strong className="text-emerald-500">
                  {formatCurrency(Math.abs(diffExpense))}
                </strong>{" "}
                hari ini.
              </span>
            ) : (
              <span>Pengeluaran hari ini sejauh ini identik dengan kemarin.</span>
            )}
          </div>
        </div>

        {/* CARD 2: HARI PALING BOROS */}
        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Pola Kebiasaan
            </span>
            <span className="p-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-500">
              <Flame size={14} />
            </span>
          </div>

          <div>
            <p className="text-[11px] text-zinc-400">Hari Paling Boros</p>
            <h3 className="text-2xl font-black text-black dark:text-white capitalize">
              {peakDay}
            </h3>
          </div>

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-900 text-[11px] text-zinc-500">
            {maxAmount > 0 ? (
              <span>
                Total akumulasi pengeluaran di hari <strong>{peakDay}</strong> mencapai{" "}
                <strong className="text-black dark:text-white">
                  {formatCurrency(maxAmount)}
                </strong>
                .
              </span>
            ) : (
              <span>Belum cukup data transaksi untuk menganalisis pola hari.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}