"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { db } from "@/database/db";
import { FileText } from "lucide-react";
import { useAlert } from "@/components/context/AlertContext";

export default function Add() {
  const router = useRouter();
  const { showAlert } = useAlert();

  // Fungsi pembantu untuk mendapatkan string tanggal hari ini (format: YYYY-MM-DD)
  const getHariIniStr = () => {
    return new Date().toISOString().split("T")[0];
  };

  // State untuk form manajemen data
  const [tipe, setTipe] = useState("Pemasukan");
  const [nominal, setNominal] = useState("");
  const [tanggalPilihan, setTanggalPilihan] = useState(getHariIniStr()); // 💡 State baru untuk input tanggal
  const [kategori, setKategori] = useState("Makanan & Minuman");
  const [keterangan, setKeterangan] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi memformat angka mentah menjadi string ber-titik ribuan Indonesia
  const formatRibuan = (value: string) => {
    const angkaMurni = value.replace(/\D/g, "");
    if (!angkaMurni) return "";
    return new Intl.NumberFormat("id-ID").format(Number(angkaMurni));
  };

  // Fungsi mengambil angka murninya saja untuk disimpan sebagai number
  const dapatkanAngkaMurni = (value: string) => {
    return Number(value.replace(/\./g, ""));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const angkaNumeric = dapatkanAngkaMurni(nominal);

    if (!nominal || angkaNumeric <= 0) {
      showAlert("Masukkan jumlah nominal yang valid!", "error");
      return;
    }

    if (!tanggalPilihan) {
      showAlert("Silakan pilih tanggal transaksi terlebih dahulu!", "error");
      return;
    }

    setIsLoading(true);

    try {
      // 💡 Membuat objek Date berdasarkan tanggal yang dipilih oleh user
      const objekTanggal = new Date(tanggalPilihan);

      const dataBaru = {
        // Format tampilan lokal Indonesia (Contoh: "08 Juli 2026")
        date: objekTanggal.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
        category: kategori,
        amount: angkaNumeric,
        type: tipe,
        note: keterangan.trim() || "-",
        dateStr: tanggalPilihan, // 💡 Disimpan dalam format YYYY-MM-DD untuk keperluan filter data
      };

      await db.table("transactions").add(dataBaru);

      showAlert("Catatan keuangan berhasil disimpan!", "success");

      setTipe('pemasukan');
      setNominal('');
      setTanggalPilihan(getHariIniStr());
      setKategori('Makanan & Minuman');
      setKeterangan('');

      router.push("/");
    } catch (error) {
      console.error("Gagal menyimpan transaksi:", error);
      showAlert("Terjadi kesalahan saat menyimpan data!", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="w-full max-w-4xl mx-auto pb-12">
        <div className="max-w-md mx-auto bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm mt-2 text-black dark:text-white">
          
          <div className="flex justify-between items-center mb-6 border-b border-zinc-200 dark:border-zinc-900 pb-3">
            <h3 className="text-base font-black flex items-center gap-2 tracking-tight">
              <span><FileText /></span> Tambah Transaksi
            </h3>
            <button
              type="button"
              onClick={() => router.back()}
              className="text-xs text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 transition font-bold"
            >
              Batal
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Tipe Transaksi */}
            <div>
              <label className="block text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 mb-2 tracking-wider">
                Tipe Transaksi
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setTipe("Pemasukan");
                    setKategori("Gaji / Pendapatan");
                  }}
                  className={`py-3 rounded-xl border font-bold text-sm tracking-wide transition duration-150 cursor-pointer ${
                    tipe === "Pemasukan"
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                      : "border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 hover:text-black dark:hover:text-white"
                  }`}
                >
                  🟢 Pemasukan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTipe("Pengeluaran");
                    setKategori("Makanan & Minuman");
                  }}
                  className={`py-3 rounded-xl border font-bold text-sm tracking-wide transition duration-150 cursor-pointer ${
                    tipe === "Pengeluaran"
                      ? "border-red-500 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400"
                      : "border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 hover:text-black dark:hover:text-white"
                  }`}
                >
                  🔴 Pengeluaran
                </button>
              </div>
            </div>

            {/* 💡 INPUT TANGGAL TRANSAKSI */}
            <div>
              <label className="block text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 mb-1.5 tracking-wider">
                Tanggal Transaksi
              </label>
              <input
                type="date"
                value={tanggalPilihan}
                onChange={(e) => setTanggalPilihan(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white text-sm font-bold [color-scheme:light] dark:[color-scheme:dark]"
                required
              />
            </div>

            {/* Input Nominal Angka */}
            <div>
              <label className="block text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 mb-1.5 tracking-wider">
                Nominal (Rp)
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={nominal}
                onChange={(e) => setNominal(formatRibuan(e.target.value))}
                className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white text-base font-bold"
                required
              />
            </div>

            {/* Dropdown Kategori */}
            <div>
              <label className="block text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 mb-1.5 tracking-wider">
                Kategori
              </label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white text-sm font-bold"
              >
                {tipe === "Pemasukan" ? (
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

            {/* Input Keterangan */}
            <div>
              <label className="block text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 mb-1.5 tracking-wider">
                Keterangan
              </label>
              <input
                type="text"
                placeholder="Contoh: Beli kopi manual brew"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white text-sm font-bold"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white dark:bg-white dark:text-black hover:bg-zinc-900 dark:hover:bg-zinc-100 py-3.5 rounded-xl font-black text-sm tracking-wide transition duration-150 disabled:opacity-50"
              >
                {isLoading ? "Menyimpan..." : "Simpan Transaksi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}