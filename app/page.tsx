"use client";

import React, { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/database/db";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  BriefcaseBusiness,
  Calendar,
  ChartColumnBig,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Coffee,
} from "lucide-react";
import DailyLimitWidget from "@/components/DailyLimitWidget";
import LifestyleAnalysisWidget from "@/components/LifestyleAnalysisWidget";
import { DonutChart } from "@/components/DonutChart";
import { LineChartTrack } from "@/components/LineChart";
import { PieIncomeVsExpense } from "@/components/PieChart";

export default function Home() {
  const [filterWaktu, setFilterWaktu] = useState("Bulanan");
  // State untuk melacak pergeseran waktu (0 = periode saat ini, -1 = periode sebelumnya, dst.)
  const [offsetPeriode, setOffsetPeriode] = useState(0);

  // Mengonversi objek Date menjadi string YYYY-MM-DD secara LOKAL murni (mencegah bug geser UTC)
  const formatKeFormatLokalStr = (date: Date): string => {
    const tahun = date.getFullYear();
    const bulan = String(date.getMonth() + 1).padStart(2, "0");
    const hari = String(date.getDate()).padStart(2, "0");
    return `${tahun}-${bulan}-${hari}`;
  };

  // Fungsi pembantu untuk mendapatkan teks deskripsi rentang waktu yang sedang aktif
  const getLabelCakupan = () => {
    const targetDate = new Date();

    if (filterWaktu === "Harian") {
      targetDate.setDate(targetDate.getDate() + offsetPeriode);
      return targetDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    if (filterWaktu === "Mingguan") {
      targetDate.setDate(targetDate.getDate() + offsetPeriode * 7);
      const awalMinggu = new Date(targetDate);
      awalMinggu.setDate(targetDate.getDate() - 6);

      const opsiFormat: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "short",
      };
      return `${awalMinggu.toLocaleDateString("id-ID", opsiFormat)} - ${targetDate.toLocaleDateString("id-ID", { ...opsiFormat, year: "numeric" })}`;
    }

    if (filterWaktu === "Bulanan") {
      targetDate.setMonth(targetDate.getMonth() + offsetPeriode);
      return targetDate.toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      });
    }

    return "Semua Transaksi";
  };

  // Mengubah pilihan kalender langsung menjadi nilai offsetPeriode
  const handleCalendarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;

    const hariIni = new Date();
    const dipilih = new Date(val);

    if (filterWaktu === "Harian") {
      // Set jam ke 0 agar perhitungan selisih hari akurat murni berdasarkan tanggal
      hariIni.setHours(0, 0, 0, 0);
      dipilih.setHours(0, 0, 0, 0);

      const selisihWaktu = dipilih.getTime() - hariIni.getTime();
      const selisihHari = Math.round(selisihWaktu / (1000 * 60 * 60 * 24));
      setOffsetPeriode(selisihHari);
    } else if (filterWaktu === "Bulanan") {
      const selisihBulan =
        (dipilih.getFullYear() - hariIni.getFullYear()) * 12 +
        (dipilih.getMonth() - hariIni.getMonth());
      setOffsetPeriode(selisihBulan);
    }
  };

  // Mendapatkan string format YYYY-MM-DD / YYYY-MM untuk ditaruh sebagai value kalender saat ini
  const getCurrentInputValue = () => {
    const targetDate = new Date();
    if (filterWaktu === "Harian") {
      targetDate.setDate(targetDate.getDate() + offsetPeriode);
      return formatKeFormatLokalStr(targetDate); // 💡 PERBAIKAN: Menggunakan format lokal murni
    }
    if (filterWaktu === "Bulanan") {
      targetDate.setMonth(targetDate.getMonth() + offsetPeriode);
      return formatKeFormatLokalStr(targetDate).substring(0, 7); // 💡 PERBAIKAN: Menggunakan format lokal murni (YYYY-MM)
    }
    return "";
  };

  const transactions = useLiveQuery(async () => {
    if (typeof window === "undefined") return [];

    const semuaData = await db
      .table("transactions")
      .orderBy("dateStr")
      .reverse()
      .toArray();

    const targetDate = new Date();

    if (filterWaktu === "Harian") {
      targetDate.setDate(targetDate.getDate() + offsetPeriode);
      const targetStr = formatKeFormatLokalStr(targetDate); // 💡 PERBAIKAN: Menggunakan format lokal murni
      return semuaData.filter((t) => t.dateStr === targetStr);
    }

    if (filterWaktu === "Mingguan") {
      targetDate.setDate(targetDate.getDate() + offsetPeriode * 7);
      const batasAwal = new Date(targetDate);
      batasAwal.setDate(targetDate.getDate() - 6);

      const targetStrMulai = formatKeFormatLokalStr(batasAwal); // 💡 PERBAIKAN: Menggunakan format lokal murni
      const targetStrSelesai = formatKeFormatLokalStr(targetDate); // 💡 PERBAIKAN: Menggunakan format lokal murni

      return semuaData.filter(
        (t) => t.dateStr >= targetStrMulai && t.dateStr <= targetStrSelesai,
      );
    }

    if (filterWaktu === "Bulanan") {
      targetDate.setMonth(targetDate.getMonth() + offsetPeriode);
      const targetBulanStr = formatKeFormatLokalStr(targetDate).substring(0, 7); // 💡 PERBAIKAN: Menggunakan format lokal murni
      return semuaData.filter((t) => t.dateStr?.startsWith(targetBulanStr));
    }

    return semuaData;
  }, [filterWaktu, offsetPeriode]);

  const hitungKalkulasi = () => {
    if (!transactions) return { pemasukan: 0, pengeluaran: 0, saldo: 0 };

    let totalPemasukan = 0;
    let totalPengeluaran = 0;

    transactions.forEach((t) => {
      if (t.type === "Pemasukan") {
        totalPemasukan += t.amount;
      } else {
        totalPengeluaran += t.amount;
      }
    });

    return {
      pemasukan: totalPemasukan,
      pengeluaran: totalPengeluaran,
      saldo: totalPemasukan - totalPengeluaran,
    };
  };

  const { pemasukan, pengeluaran, saldo } = hitungKalkulasi();

  const formatDataForLineChart = useMemo(() => {
    // 1. Tentukan Tanggal Target berdasarkan filterWaktu & offsetPeriode
    const targetDate = new Date();

    // Helper untuk mengubah Date ke ISO String Lokal "YYYY-MM-DD"
    const toLocalISO = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // ===================================================
    // 1. FILTER HARIAN (1 Hari Target)
    // ===================================================
    if (filterWaktu === "Harian") {
      targetDate.setDate(targetDate.getDate() + offsetPeriode);
      const targetStr = toLocalISO(targetDate);
      const label = targetDate.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      });

      let totalPemasukan = 0;
      let totalPengeluaran = 0;

      if (transactions && transactions.length > 0) {
        transactions.forEach((tx) => {
          if (tx.dateStr === targetStr) {
            const amount = Number(tx.amount) || 0;
            if (tx.type === "Pemasukan") totalPemasukan += amount;
            if (tx.type === "Pengeluaran") totalPengeluaran += amount;
          }
        });
      }

      return [
        { label, pemasukan: totalPemasukan, pengeluaran: totalPengeluaran },
      ];
    }

    // ===================================================
    // 2. FILTER MINGGUAN (Rentang 7 Hari Aktif)
    // ===================================================
    if (filterWaktu === "Mingguan") {
      targetDate.setDate(targetDate.getDate() + offsetPeriode * 7);
      const mapHarian: Record<
        string,
        { label: string; pemasukan: number; pengeluaran: number }
      > = {};

      // Generate template 7 hari (mulai dari 6 hari lalu sampai targetDate)
      for (let i = 6; i >= 0; i--) {
        const d = new Date(targetDate);
        d.setDate(targetDate.getDate() - i);

        const keyStr = toLocalISO(d);
        const label = d.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
        });

        mapHarian[keyStr] = { label, pemasukan: 0, pengeluaran: 0 };
      }

      // Isikan data dari transactions
      if (transactions && transactions.length > 0) {
        transactions.forEach((tx) => {
          if (mapHarian[tx.dateStr]) {
            const amount = Number(tx.amount) || 0;
            if (tx.type === "Pemasukan")
              mapHarian[tx.dateStr].pemasukan += amount;
            if (tx.type === "Pengeluaran")
              mapHarian[tx.dateStr].pengeluaran += amount;
          }
        });
      }

      return Object.values(mapHarian);
    }

    // ===================================================
    // 3. FILTER BULANAN (Semua Hari dalam Bulan Aktif)
    // ===================================================
    if (filterWaktu === "Bulanan") {
      targetDate.setMonth(targetDate.getMonth() + offsetPeriode);
      const year = targetDate.getFullYear();
      const month = targetDate.getMonth();

      // Hitung jumlah hari dalam bulan tersebut (28, 29, 30, atau 31)
      const jumlahHari = new Date(year, month + 1, 0).getDate();
      const mapBulanan: Record<
        string,
        { label: string; pemasukan: number; pengeluaran: number }
      > = {};

      // Generate template tanggal 1 s.d jumlahHari
      for (let day = 1; day <= jumlahHari; day++) {
        const d = new Date(year, month, day);
        const keyStr = toLocalISO(d);
        const label = String(day).padStart(2, "0"); // Sumbu X berupa tanggal "01", "02", dst.

        mapBulanan[keyStr] = { label, pemasukan: 0, pengeluaran: 0 };
      }

      // Isikan data transaksi
      if (transactions && transactions.length > 0) {
        transactions.forEach((tx) => {
          if (mapBulanan[tx.dateStr]) {
            const amount = Number(tx.amount) || 0;
            if (tx.type === "Pemasukan")
              mapBulanan[tx.dateStr].pemasukan += amount;
            if (tx.type === "Pengeluaran")
              mapBulanan[tx.dateStr].pengeluaran += amount;
          }
        });
      }

      return Object.values(mapBulanan);
    }

    return [];
  }, [transactions, filterWaktu, offsetPeriode]);

  const formatDataRasioPie = useMemo(() => {
    if (pemasukan === 0 && pengeluaran === 0) return [];

    const grandTotal = pemasukan + pengeluaran;

    // 2. Hitung persentase (cegah error division by zero jika grandTotal === 0)
    const persenPemasukan =
      grandTotal > 0 ? Number(((pemasukan / grandTotal) * 100).toFixed(1)) : 0;
    const persenPengeluaran =
      grandTotal > 0
        ? Number(((pengeluaran / grandTotal) * 100).toFixed(1))
        : 0;

    return [
      {
        jenis: "Pemasukan",
        persentase: persenPemasukan, // Nilai persentase (contoh: 65.5)
        nominalAsli: pemasukan, // Opsional: tetap simpan jika nanti butuh tooltip nominal
        fill: "#22c55e", // Green
      },
      {
        jenis: "Pengeluaran",
        persentase: persenPengeluaran, // Nilai persentase (contoh: 34.5)
        nominalAsli: pengeluaran,
        fill: "#ef4444", // Red
      },
    ];
  }, [transactions]);

  const CATEGORY_COLORS: Record<string, string> = {
    Makanan: "var(--chart-1)",
    Transportasi: "var(--chart-2)",
    Hiburan: "var(--chart-3)",
    Tagihan: "var(--chart-4)",
    Belanja: "var(--chart-5)",
  };

  const formatDataDonutChart = useMemo(() => {
    if (!transactions) return [];

    // 1. Kelompokkan nominal per kategori
    const categoryTotals: Record<string, number> = {};
    let totalPengeluaran = 0;

    transactions.forEach((item) => {
      if (item.type === "Pengeluaran") {
        categoryTotals[item.category] =
          (categoryTotals[item.category] || 0) + item.amount;
        totalPengeluaran += item.amount;
      }
    });

    // 2. Petakan menjadi array data chart beserta persentase
    return Object.entries(categoryTotals).map(([category, amount]) => {
      const percentage =
        totalPengeluaran > 0
          ? Math.round((amount / totalPengeluaran) * 100)
          : 0;

      return {
        category,
        amount, // tetap disimpankan nominal asli
        percentage, // nilai %
        fill: CATEGORY_COLORS[category] || "var(--chart-1)",
      };
    });
  }, [transactions]);

  const totalAmount = React.useMemo(() => {
    return formatDataDonutChart.reduce((acc, curr) => acc + curr.amount, 0);
  }, [formatDataDonutChart]);

  console.log(formatDataForLineChart);

  return (
    <AppShell>
      <div className="w-full max-w-4xl mx-auto space-y-6 pb-12">
        {/* FILTER NAVIGASI WAKTU */}
        <div className="flex justify-center">
          <div className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 flex gap-1 w-full max-w-md">
            {["Harian", "Mingguan", "Bulanan"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setFilterWaktu(tab);
                  setOffsetPeriode(0); // Reset pergeseran waktu saat berganti jenis filter
                }}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                  filterWaktu === tab
                    ? "bg-white text-black dark:bg-black dark:text-white shadow-sm border border-zinc-300 dark:border-zinc-700"
                    : "text-zinc-400 dark:text-zinc-500 hover:text-black dark:hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* CONTROLLER GESER CAKUPAN TANGGAL + FITUR PICK KALENDER */}
        <div className="flex items-center justify-between bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-xl max-w-md mx-auto">
          <button
            onClick={() => setOffsetPeriode((prev) => prev - 1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-black text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="text-center relative flex flex-col items-center justify-center min-w-[160px]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Periode {filterWaktu}
            </p>

            {filterWaktu !== "Mingguan" ? (
              <label
                onClick={(e) => {
                  e.currentTarget.querySelector("input")?.showPicker();
                }}
                className="relative flex items-center gap-1.5 text-xs font-black text-black dark:text-white mt-0.5 cursor-pointer hover:opacity-80 transition bg-zinc-50 dark:bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-100 dark:border-zinc-900 select-none"
              >
                <span>{getLabelCakupan()}</span>
                <Calendar size={12} className="text-zinc-400" />
                <input
                  type={filterWaktu === "Harian" ? "date" : "month"}
                  value={getCurrentInputValue()}
                  onChange={handleCalendarChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full [color-scheme:light] dark:[color-scheme:dark]"
                />
              </label>
            ) : (
              <p className="text-xs font-black text-black dark:text-white mt-0.5">
                {getLabelCakupan()}
              </p>
            )}
          </div>

          <button
            onClick={() => setOffsetPeriode((prev) => prev + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-black text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* GRID RINGKASAN KEUANGAN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm">
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Pemasukan
            </p>
            <h3 className="text-2xl font-black mt-1 text-emerald-600 dark:text-emerald-400">
              {formatCurrency(pemasukan)}
            </h3>
          </div>

          <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm">
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Pengeluaran
            </p>
            <h3 className="text-2xl font-black mt-1 text-red-600 dark:text-red-400">
              {formatCurrency(pengeluaran)}
            </h3>
          </div>
        </div>

        {/* CARD SALDO UTAMA */}
        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Total Saldo Anda
          </p>
          <h2
            className={`text-4xl font-black mt-1 tracking-tight ${saldo >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
          >
            {saldo < 0 ? "-" : ""}
            {formatCurrency(Math.abs(saldo))}
          </h2>

          <div
            className={`mt-3 inline-flex items-center gap-1.5 border px-3 py-1 rounded-full text-[11px] font-black ${
              saldo >= 0
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400"
                : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400"
            }`}
          >
            <span>
              {saldo >= 0 ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </span>{" "}
            {saldo >= 0 ? "SURPLUS" : "DEFISIT"}
          </div>
        </div>

        {/* Card Batas Harian */}
        {/* {filterWaktu === "Bulanan" && offsetPeriode === 0 && (
          <DailyLimitWidget saldoUtama={saldo} transactions={transactions} />
        )} */}

        {/* WIDGET ANALISIS GAYA HIDUP */}
        {/* {filterWaktu === "Bulanan" && offsetPeriode === 0 && (
          <LifestyleAnalysisWidget transactions={transactions} />
        )} */}

        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center">
          <div className="w-full flex items-center gap-2 mb-6 border-b border-zinc-100 dark:border-zinc-900 pb-3">
            <span className="text-lg">
              <ChartColumnBig />
            </span>
            <h4 className="text-sm font-black text-black dark:text-white uppercase tracking-wider">
              Statistik Keuangan
            </h4>
          </div>

          <LineChartTrack data={formatDataForLineChart} />
        </div>

        {/* VISUALISASI KOMPOSISI PENGELUARAN DAN PEMASUKAN VS PENGELUARAN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center">
            <div className="w-full flex items-center gap-2 mb-6 border-b border-zinc-100 dark:border-zinc-900 pb-3">
              <span className="text-lg">
                <ChartColumnBig />
              </span>
              <h4 className="text-sm font-black text-black dark:text-white uppercase tracking-wider">
                Komposisi Pengeluaran
              </h4>
            </div>

            <DonutChart data={formatDataDonutChart} totalAmount={totalAmount} />
          </div>
          <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center">
            <div className="w-full flex items-center gap-2 mb-6 border-b border-zinc-100 dark:border-zinc-900 pb-3">
              <span className="text-lg">
                <ChartColumnBig />
              </span>
              <h4 className="text-sm font-black text-black dark:text-white uppercase tracking-wider">
                Pemasukan VS Pengeluaran
              </h4>
            </div>

            <PieIncomeVsExpense data={formatDataRasioPie} />
          </div>
        </div>

        {/* AKTIVITAS TERAKHIR */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider pl-1">
            Aktivitas Terakhir
          </h4>
          <div className="space-y-2">
            {transactions &&
              transactions.slice(0, 3).map((item) => {
                const isPemasukan = item.type === "Pemasukan";
                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xl p-2 rounded-lg ${isPemasukan ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500" : "bg-red-50 dark:bg-red-950/40 text-red-500"}`}
                      >
                        {isPemasukan ? <BriefcaseBusiness /> : <Coffee />}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-black dark:text-white">
                          {item.note}
                        </p>
                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                          {item.date} • {item.category}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-black ${isPemasukan ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                    >
                      {isPemasukan ? "+" : "-"} {formatCurrency(item.amount)}
                    </span>
                  </div>
                );
              })}

            {(!transactions || transactions.length === 0) && (
              <p className="text-xs text-zinc-400 dark:text-zinc-500 text-center py-4 italic">
                Belum ada catatan transaksi pada periode ini.
              </p>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
