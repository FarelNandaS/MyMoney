"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/database/db";

export default function Home() {
  // State untuk filter waktu (Harian, Mingguan, Bulanan)
  const [filterWaktu, setFilterWaktu] = useState("Bulanan");

  const transactions = useLiveQuery(async () => {
    const tanggalSistem = new Date();
    const sekarangStr = tanggalSistem.toISOString().split("T")[0];

    const semuaData = await db
      .table("transactions")
      .orderBy("dateStr")
      .reverse()
      .toArray();

    if (filterWaktu === "Harian") {
      return semuaData.filter((t) => t.dateStr === sekarangStr);
    } else if (filterWaktu === "Mingguan") {
      const tujuhHariLalu = new Date();
      tujuhHariLalu.setDate(tujuhHariLalu.getDate() - 7);
      return semuaData.filter((t) => new Date(t.dateStr) >= tujuhHariLalu);
    } else if (filterWaktu === "Bulanan") {
      const bulanIniStr = sekarangStr.substring(0, 7);
      return semuaData.filter((t) => t.dateStr.startsWith(bulanIniStr));
    }

    return semuaData;
  }, [filterWaktu]);

  const hitungKalkulasi = () => {
    if (!transactions) return { pemasukan: 0, pengeluaran: 0, saldo: 0 };

    let totalPemasukan = 0;
    let totalPengeluaran = 0;

    transactions.forEach((t) => {
      if (t.type === "pemasukan") {
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

  const getBigCategory = () => {
    if (!transactions || pengeluaran === 0)
      return { nama: "Belum ada data", persentase: 0 };

    const petaCategory: Record<string, number> = {};
    transactions.forEach((t) => {
      if (t.type === "pengeluaran") {
        petaCategory[t.category] = (petaCategory[t.category] || 0) + t.amount;
      }
    });

    let kategoriTeratas = "";
    let jumlahTeratas = 0;

    for (const [key, value] of Object.entries(petaCategory)) {
      if (value > jumlahTeratas) {
        jumlahTeratas = value;
        kategoriTeratas = key;
      }
    }

    const persentase = Math.round((jumlahTeratas / pengeluaran) * 100);
    return { nama: kategoriTeratas, persentase };
  };

  const kategoriUtama = getBigCategory();

  const formatUang = (nominal: number) => {
    // Mengubah angka menjadi positif terlebih dahulu
    const angkaSaja = Math.abs(nominal);

    // Memformat angka dengan titik sebagai pemisah ribuan menggunakan regex
    const stringDiformat = angkaSaja
      .toString()
      .replace(/\B(?=(\d3)+(?!\d))/g, ".");

    return `Rp ${stringDiformat}`; // Gunakan spasi biasa atau teks statis yang konsisten
  };

  return (
    <AppShell>
      <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
        {/* FILTER NAVIGASI WAKTU */}
        <div className="flex justify-center">
          <div className="bg-[#1e293b] p-1 rounded-xl border border-slate-800/80 flex gap-1 w-full max-w-md">
            {["Harian", "Mingguan", "Bulanan"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterWaktu(tab)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  filterWaktu === tab
                    ? "bg-[#2d3a4f] text-blue-400 shadow-md border border-slate-700/50"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* NAVIGASI TANGGAL STATUS */}
        <div className="flex items-center justify-center gap-6 my-2">
          <span className="text-sm font-bold tracking-wide text-slate-400">
            Cakupan:{" "}
            <span className="text-slate-200 font-extrabold">
              {filterWaktu} Ini
            </span>
          </span>
        </div>

        {/* GRID RINGKASAN KEUANGAN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card Pemasukan */}
          <div className="bg-[#1e293b] border border-slate-800/80 p-5 rounded-2xl shadow-md">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Pemasukan
            </p>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">
              {formatUang(pemasukan)}
            </h3>
          </div>

          {/* Card Pengeluaran */}
          <div className="bg-[#1e293b] border border-slate-800/80 p-5 rounded-2xl shadow-md">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Pengeluaran
            </p>
            <h3 className="text-2xl font-black text-red-400 mt-1">
              {formatUang(pengeluaran)}
            </h3>
          </div>
        </div>

        {/* CARD SALDO UTAMA */}
        <div className="bg-[#1e293b] border border-slate-800/80 p-5 rounded-2xl shadow-md relative overflow-hidden">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Saldo
          </p>
          <h2
            className={`text-3xl font-black mt-1 tracking-wide ${saldo >= 0 ? "text-emerald-400" : "text-red-400"}`}
          >
            {saldo < 0 ? "-" : ""}
            {formatUang(saldo)}
          </h2>

          <div
            className={`mt-3 inline-flex items-center gap-1.5 border px-3 py-1 rounded-full text-[11px] font-bold ${
              saldo >= 0
                ? "bg-emerald-950/40 border-emerald-900/60 text-emerald-400"
                : "bg-red-950/40 border-red-900/60 text-red-400"
            }`}
          >
            <span>{saldo >= 0 ? "▲" : "▼"}</span>{" "}
            {saldo >= 0 ? "Surplus" : "Defisit"}
          </div>
        </div>

        {/* VISUALISASI KOMPOSISI PENGELUARAN */}
        <div className="bg-[#1e293b] border border-slate-800/80 p-6 rounded-2xl shadow-md flex flex-col items-center justify-center">
          <div className="w-full flex items-center gap-2 mb-6 border-b border-slate-800/60 pb-3">
            <span className="text-lg">📊</span>
            <h4 className="text-sm font-bold text-slate-200 tracking-wide">
              Komposisi Pengeluaran
            </h4>
          </div>

          {/* Busur Chart Dinamis */}
          <div className="relative w-full max-w-70 h-35 overflow-hidden flex items-end justify-center mt-2">
            <div
              className={`absolute top-0 w-65 h-65 rounded-full border-28 border-b-transparent transition-all duration-500 ${
                pengeluaran > 0 ? "border-red-500/90" : "border-slate-800"
              }`}
            ></div>

            <div className="text-center z-10 mb-2">
              <p className="text-xs text-gray-400 font-medium">
                {kategoriUtama.nama}
              </p>
              <p className="text-xl font-black text-slate-100">
                {kategoriUtama.persentase}%
              </p>
            </div>
          </div>
        </div>

        {/* AKTIVITAS TERAKHIR QUICK VIEW (Menampilkan maksimal 3 data terbaru) */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">
            Aktivitas Terakhir
          </h4>
          <div className="space-y-2">
            {transactions &&
              transactions.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="bg-[#1e293b] border border-slate-800/60 p-4 rounded-xl flex justify-between items-center shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl bg-[#0f172a] p-2 rounded-lg">
                      {item.type === "pemasukan" ? "💼" : "☕"}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-200">
                        {item.note}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {item.date} • {item.category}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-extrabold ${item.type === "pemasukan" ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {item.type === "pemasukan" ? "+" : "-"}{" "}
                    {formatUang(item.amount)}
                  </span>
                </div>
              ))}

            {(!transactions || transactions.length === 0) && (
              <p className="text-xs text-gray-500 text-center py-4 italic">
                Belum ada catatan transaksi untuk periode ini.
              </p>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
