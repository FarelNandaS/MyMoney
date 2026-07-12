"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/database/db";
import { formatUangRupiah } from "@/utils/formatUang";
import { BriefcaseBusiness, Coffee, Mailbox, Search, X } from "lucide-react";
import { useAlert } from "@/components/context/AlertContext";
import { useConfirm } from "@/components/context/ConfirmContext";

export default function History() {
  const {showAlert} = useAlert();
  const {askConfirmation} = useConfirm();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("Semua");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const allTransactions = useLiveQuery(async () => {
    if (typeof window === "undefined") return [];

    return await db
      .table("transactions")
      .orderBy("dateStr")
      .reverse()
      .toArray();
  });

  // 💡 Fungsi untuk menghapus satu baris transaksi berdasarkan ID
  const handleHapusTransaksi = async (
    id?: number,
    note?: string,
    kategori?: string,
  ) => {
    if (!id) return;

    const konfirmasi = await askConfirmation({
      title: "Hapus riwayat?",
      message: `Apakah anda yakin menghapus riwayat dengan keterangan "${note}" ini? Tindakan ini tidak dapat di batalkan!`,
      confirmText: "Hapus Permanen",
      cancelText: "Batal",
      type: "danger"
    });

    if (konfirmasi) {
      try {
        await db.table("transactions").delete(id);
        showAlert("Transaksi berhasil dihapus!", 'success');

        // Atur ulang halaman jika item di halaman saat ini habis setelah dihapus
        const sisaItemHalamanIni = currentTransactions.length;
        if (sisaItemHalamanIni === 1 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        }
      } catch (error) {
        console.error("Gagal menghapus transaksi:", error);
        showAlert("Terjadi kesalahan saat menghapus data!", 'error');
      }
    }
  };

  const filteredTransactions = (allTransactions || []).filter((t) => {
    const metchesSearch =
      t.note?.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      t.category?.toLowerCase().includes(searchTerm.toLocaleLowerCase());

    const metchesType = filterType === "Semua" || t.type === filterType;

    return metchesSearch && metchesType;
  });

  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentTransactions = filteredTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  return (
    <AppShell>
      <div className="w-full max-w-4xl mx-auto space-y-6 pb-12">
        {/* HEADER HALAMAN & RINGKASAN */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-900 pb-4">
          <div>
            <h2 className="text-xl font-black text-black dark:text-white tracking-tight">
              Riwayat Transaksi
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Daftar seluruh catatan pemasukan dan pengeluaran Anda.
            </p>
          </div>

          {/* Batang Pencarian (Search Bar) */}
          <div className="w-full md:w-72 relative">
            <input
              type="text"
              placeholder="Cari nota atau kategori..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-black dark:focus:border-white text-sm text-black dark:text-white placeholder-zinc-400 font-bold"
            />
            <span className="absolute left-2.5 top-2 text-zinc-400 text-sm">
              <Search />
            </span>
          </div>
        </div>

        {/* FILTER KATEGORI */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {["Semua", "Pemasukan", "Pengeluaran"].map((kat) => (
            <button
              key={kat}
              onClick={() => {
                setFilterType(kat);
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 text-xs font-bold rounded-full border whitespace-nowrap transition cursor-pointer ${
                filterType === kat
                  ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                  : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800 hover:text-black dark:hover:text-white"
              }`}
            >
              {kat}
            </button>
          ))}
        </div>

        {/* DAFTAR RIWAYAT TRANSAKSI */}
        <div className="space-y-3">
          {currentTransactions.map((item) => {
            const isPemasukan = item.type === "Pemasukan";
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl flex justify-between items-center transition duration-150"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                      isPemasukan
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500"
                        : "bg-red-50 dark:bg-red-950/40 text-red-500"
                    }`}
                  >
                    {isPemasukan ? (<BriefcaseBusiness />) : (<Coffee />)}
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-black dark:text-white">
                      {item.note || item.category}
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {item.date} •{" "}
                      <span className="text-zinc-500">{item.category}</span>
                    </p>
                  </div>
                </div>

                {/* Bagian Kanan: Nominal & Tombol Aksi */}
                <div className="flex items-center gap-4">
                  <span
                    className={`font-black text-sm ${
                      isPemasukan
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {isPemasukan ? "+" : "-"} {formatUangRupiah(item.amount)}
                  </span>

                  {/* 💡 TOMBOL HAPUS DATA */}
                  <button
                    onClick={() =>
                      handleHapusTransaksi(item.id, item.note, item.category)
                    }
                    className="p-2 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500 dark:hover:bg-zinc-900 rounded-lg transition active:scale-95"
                    title="Hapus Transaksi"
                  >
                    <X />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* JIKA DATA KOSONG */}
        {totalItems === 0 && (
          <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
            <span className="text-zinc-400 flex items-center justify-center"><Mailbox size={50}/></span>
            <p className="text-sm text-zinc-400 mt-2">
              Belum ada catatan transaksi yang sesuai.
            </p>
          </div>
        )}

        {/* CONTROLLER PAGINASI */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-900">
            {/* Tombol Previous */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
            >
              ‹ Sebelumnya
            </button>

            {/* Keterangan Halaman */}
            <span className="text-xs text-zinc-400">
              Halaman{" "}
              <span className="text-black dark:text-white font-black">
                {currentPage}
              </span>{" "}
              dari{" "}
              <span className="text-black dark:text-white font-black">
                {totalPages}
              </span>
            </span>

            {/* Tombol Next */}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
            >
              Berikutnya ›
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
