"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { db } from "@/database/db";

export default function Add() {
  const router = useRouter();

  // State untuk form manajemen data
  const [tipe, setTipe] = useState("pemasukan"); // default: pengeluaran
  const [nominal, setNominal] = useState("");
  const [kategori, setKategori] = useState("Makanan & Minuman");
  const [keterangan, setKeterangan] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validasi data sederhana
    if (!nominal || Number(nominal) <= 0) {
      alert("Masukkan jumlah nominal yang valid!");
      return;
    }

    setIsLoading(true);

    try {
      const SystemDate = new Date();

      const dataBaru = {
        date: SystemDate.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
        category: kategori,
        amount: Number(nominal),
        type: tipe,
        note: keterangan.trim() || "-",
        dateStr: SystemDate.toISOString().split('T')[0],
      };

      await db.table("transactions").add(dataBaru);

      console.log("Data siap disimpan ke DB lokal:", dataBaru);
      alert("Catatan keuangan berhasil disimpan!");

      setTipe('pemasukan');
      setNominal('');
      setKategori('Makanan & Minuman');
      setKeterangan('');

      // Redirect kembali ke halaman beranda setelah data sukses diproses
      router.push("/");
    } catch (error) {
      console.error("Gagal menyimpan transaksi:", error);
      alert("Terjadi kesalahan saat menyimpan data!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="w-full max-w-4xl mx-auto animate-fade-in pb-12">
        {/* CONTAINER FORM */}
        <div className="max-w-md mx-auto bg-[#1e293b] border border-slate-800/80 rounded-2xl p-6 shadow-xl mt-2">
          {/* Header Form */}
          <div className="flex justify-between items-center mb-6 border-b border-slate-800/60 pb-3">
            <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2 tracking-wide">
              <span>📝</span> Tambah Transaksi
            </h3>
            <button
              onClick={() => router.back()}
              className="text-xs text-gray-400 hover:text-gray-200 bg-[#0f172a] px-3 py-1.5 rounded-lg border border-slate-800 transition"
            >
              Batal
            </button>
          </div>

          {/* Body Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Selector Tipe Transaksi (Pemasukan vs Pengeluaran) */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2 tracking-wider">
                Tipe Transaksi
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTipe("pemasukan")}
                  className={`py-3 rounded-xl border font-bold text-sm tracking-wide shadow-sm transition-all duration-200 ${
                    tipe === "pemasukan"
                      ? "border-emerald-500 bg-emerald-950/40 text-emerald-400"
                      : "border-slate-800 bg-[#0f172a] text-gray-400 hover:text-gray-200"
                  }`}
                >
                  🟢 Pemasukan
                </button>
                <button
                  type="button"
                  onClick={() => setTipe("pengeluaran")}
                  className={`py-3 rounded-xl border font-bold text-sm tracking-wide shadow-sm transition-all duration-200 ${
                    tipe === "pengeluaran"
                      ? "border-red-500 bg-red-950/40 text-red-400"
                      : "border-slate-800 bg-[#0f172a] text-gray-400 hover:text-gray-200"
                  }`}
                >
                  🔴 Pengeluaran
                </button>
              </div>
            </div>

            {/* Input Nominal Angka */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1.5 tracking-wider">
                Nominal (Rp)
              </label>
              <input
                type="number"
                placeholder="0"
                value={nominal}
                onChange={(e) => setNominal(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-100 text-base font-semibold"
                required
              />
            </div>

            {/* Dropdown Kategori */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1.5 tracking-wider">
                Kategori
              </label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-slate-200 text-sm font-medium"
              >
                {tipe === "pemasukan" ? (
                  <>
                    <option>Gaji / Pendapatan</option>
                    <option>Investasi</option>
                    <option>Freelance / Project</option>
                    <option>Lain-lain</option>
                  </>
                ) : (
                  <>
                    <option>Makanan & Minuman</option>
                    <option>Transportasi</option>
                    <option>Belanja Bulanan</option>
                    <option>Hiburan / Hobi</option>
                    <option>Tagihan / Listrik</option>
                  </>
                )}
              </select>
            </div>

            {/* Input Keterangan Opsional */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1.5 tracking-wider">
                Keterangan
              </label>
              <input
                type="text"
                placeholder="Contoh: Beli kopi manual brew"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-slate-200 text-sm"
              />
            </div>

            {/* Tombol Simpan Eksekusi */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-blue-500/10 transition duration-200 active:scale-[0.99]"
              >
                Simpan Transaksi
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
