"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/database/db";
import { formatCurrency } from "@/utils/formatCurrency";
import { BriefcaseBusiness, Coffee, Mailbox, PenSquare, Search, X } from "lucide-react";
import { useAlert } from "@/components/context/AlertContext";
import { useConfirm } from "@/components/context/ConfirmContext";

// Interface data transaksi untuk Modal Edit
interface TransactionData {
  id: number;
  type: string;
  amount: number;
  category: string;
  note: string;
  date: string;
  dateStr: string;
}

export default function History() {
  const { showAlert } = useAlert();
  const { askConfirmation } = useConfirm();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("Semua");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 💡 State untuk Modal Edit Transaksi
  const [editingTransaction, setEditingTransaction] = useState<TransactionData | null>(null);
  const [editType, setEditType] = useState<string>("Pengeluaran");
  const [editAmount, setEditAmount] = useState<string>("");
  const [editCategory, setEditCategory] = useState<string>("");
  const [editNote, setEditNote] = useState<string>("");
  const [editDateStr, setEditDateStr] = useState<string>("");

  const allTransactions = useLiveQuery(async () => {
    if (typeof window === "undefined") return [];

    return await db
      .table("transactions")
      .orderBy("dateStr")
      .reverse()
      .toArray();
  });

  // 💡 Buka Modal dan isi Form dengan data transaksi yang dipilih
  const handleOpenEdit = (item: TransactionData) => {
    setEditingTransaction(item);
    setEditType(item.type);
    setEditAmount(item.amount.toString());
    setEditCategory(item.category);
    setEditNote(item.note || "");
    setEditDateStr(item.dateStr || new Date().toISOString().split("T")[0]);
  };

  // 💡 Tutup Modal & Reset State Edit
  const handleCloseEdit = () => {
    setEditingTransaction(null);
  };

  // 💡 Simpan Perubahan Transaksi ke Dexie.js
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTransaction) return;

    const amountNum = parseFloat(editAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showAlert("Nominal transaksi harus berupa angka valid!", "error");
      return;
    }

    // Format tanggal tampilan sederhana (misal "02 Okt 2026")
    const dateObj = new Date(editDateStr);
    const dateFormatted = dateObj.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    try {
      await db.table("transactions").update(editingTransaction.id, {
        type: editType,
        amount: amountNum,
        category: editCategory,
        note: editNote,
        date: dateFormatted,
        dateStr: editDateStr,
      });

      showAlert("Transaksi berhasil diperbarui!", "success");
      handleCloseEdit();
    } catch (error) {
      console.error("Gagal mengupdate transaksi:", error);
      showAlert("Terjadi kesalahan saat menyimpan perubahan!", "error");
    }
  };

  // 💡 Fungsi untuk menghapus satu baris transaksi berdasarkan ID
  const handleHapusTransaksi = async (
    id?: number,
    note?: string,
  ) => {
    if (!id) return;

    const konfirmasi = await askConfirmation({
      title: "Hapus riwayat?",
      message: `Apakah anda yakin menghapus riwayat dengan keterangan "${note || "tanpa catatan"}" ini? Tindakan ini tidak dapat dibatalkan!`,
      confirmText: "Hapus Permanen",
      cancelText: "Batal",
      type: "danger",
    });

    if (konfirmasi) {
      try {
        await db.table("transactions").delete(id);
        showAlert("Transaksi berhasil dihapus!", "success");

        const sisaItemHalamanIni = currentTransactions.length;
        if (sisaItemHalamanIni === 1 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        }
      } catch (error) {
        console.error("Gagal menghapus transaksi:", error);
        showAlert("Terjadi kesalahan saat menghapus data!", "error");
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
            <span className="absolute left-2.5 top-2.5 text-zinc-400 text-sm">
              <Search size={18} />
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
                    {isPemasukan ? <BriefcaseBusiness size={20} /> : <Coffee size={20} />}
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
                    {isPemasukan ? "+" : "-"}{formatCurrency(item.amount)}
                  </span>

                  {/* 📝 TOMBOL EDIT DATA */}
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 text-zinc-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition active:scale-95 cursor-pointer"
                    title="Edit Transaksi"
                  >
                    <PenSquare size={18} />
                  </button>
                  
                  {/* 💡 TOMBOL HAPUS DATA */}
                  <button
                    onClick={() => handleHapusTransaksi(item.id, item.note)}
                    className="p-2 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition active:scale-95 cursor-pointer"
                    title="Hapus Transaksi"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* JIKA DATA KOSONG */}
        {totalItems === 0 && (
          <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
            <span className="text-zinc-400 flex items-center justify-center">
              <Mailbox size={50} />
            </span>
            <p className="text-sm text-zinc-400 mt-2">
              Belum ada catatan transaksi yang sesuai.
            </p>
          </div>
        )}

        {/* CONTROLLER PAGINASI */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-900">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
            >
              ‹ Sebelumnya
            </button>

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

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
            >
              Berikutnya ›
            </button>
          </div>
        )}

        {/* ========================================== */}
        {/* 🪟 MODAL EDIT TRANSAKSI                   */}
        {/* ========================================== */}
        {editingTransaction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
                <h3 className="text-base font-black text-black dark:text-white">
                  Edit Transaksi
                </h3>
                <button
                  onClick={handleCloseEdit}
                  className="p-1.5 text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveEdit} className="space-y-4">
                {/* Tipe Transaksi (Pemasukan / Pengeluaran) */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setEditType("Pengeluaran")}
                    className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                      editType === "Pengeluaran"
                        ? "bg-red-500 text-white shadow"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    Pengeluaran
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditType("Pemasukan")}
                    className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                      editType === "Pemasukan"
                        ? "bg-emerald-500 text-white shadow"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    Pemasukan
                  </button>
                </div>

                {/* Input Nominal */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                    Nominal (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-black dark:focus:border-white text-sm text-black dark:text-white font-bold"
                  />
                </div>

                {/* Input Kategori */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                    Kategori
                  </label>
                  <input
                    type="text"
                    required
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-black dark:focus:border-white text-sm text-black dark:text-white font-bold"
                  />
                </div>

                {/* Input Catatan / Note */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                    Catatan
                  </label>
                  <input
                    type="text"
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    placeholder="Contoh: Beli Kopi"
                    className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-black dark:focus:border-white text-sm text-black dark:text-white font-bold"
                  />
                </div>

                {/* Input Tanggal */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    required
                    value={editDateStr}
                    onChange={(e) => setEditDateStr(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-black dark:focus:border-white text-sm text-black dark:text-white font-bold [color-scheme:light] dark:[color-scheme:dark]"
                  />
                </div>

                {/* Modal Footer / Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseEdit}
                    className="w-1/2 py-2.5 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 text-xs font-bold rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition cursor-pointer"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}