'use client';

import AppShell from "@/components/AppShell";
import { useAlert } from "@/components/context/AlertContext";
import { useConfirm } from "@/components/context/ConfirmContext";
import { db } from "@/database/db";
import { 
  Download, 
  Moon, 
  Palette, 
  Save, 
  Sun, 
  Trash2, 
  TriangleAlert, 
  Upload,  
  CircleDollarSign
} from "lucide-react";
import React, { useState } from "react";
import * as XLSX from 'xlsx';
import { 
  getSelectedCurrency, 
  setSelectedCurrency, 
  formatCurrency, 
  POPULAR_CURRENCIES 
} from "@/utils/formatCurrency";

export default function Settings() {
  const {showAlert} = useAlert();
  const {askConfirmation} = useConfirm();

  // State Tema
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  // State Mata Uang Global
  const [currency, setCurrencyState] = useState(() => getSelectedCurrency());

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleCurrencyChange = (newCode: string) => {
    setSelectedCurrency(newCode);
    setCurrencyState(newCode);
    showAlert(`Format mata uang diubah ke ${newCode}`, 'success');
  };

  const exportToExcel = async () => {
    try {
      const allData = await db.table('transactions').orderBy('dateStr').toArray();

      if (allData.length === 0) {
        showAlert('belum ada data', "error");
        return;
      }

      const dataFormat = allData.map((item, index) => ({
        No: index + 1,
        Tanggal: item.date,
        Kategori: item.category,
        Nominal: item.amount,
        Tipe: item.type,
        Keterangan: item.note,
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataFormat);
      const headers = Object.keys(dataFormat[0]);

      const colWidths = headers.map((headerText) => {
        const maxLen = dataFormat.reduce((max, row) => {
          const cellValue = row[headerText as keyof typeof row] ? String(row[headerText as keyof typeof row]) : "";
          return cellValue.length > max ? cellValue.length : max;
        }, headerText.length);

        return { wch: maxLen + 3 };
      });

      worksheet['!cols'] = colWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Keuangan');

      XLSX.writeFile(workbook, `MyMoney_Backup_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error(error);
      showAlert('Gagal mengekspor data', 'error');
    }
  };

  const importFromExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const render = new FileReader();
    render.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: "binary" });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        type ImportedRow = {
          Tanggal?: string;
          Kategori?: string;
          Nominal?: number | string;
          Tipe?: string;
          Keterangan?: string;
        };

        const importedData: ImportedRow[] = XLSX.utils.sheet_to_json<ImportedRow>(worksheet, { raw: false });

        if (importedData.length === 0) {
          showAlert("File Excel kosong atau format tidak sesuai!", 'error');
          return;
        }

        const konversiKeDateStr = (dateInput: string | undefined): string => {
          if (!dateInput) return new Date().toLocaleDateString('en-CA');
          const d = new Date(dateInput);
          if (isNaN(d.getTime())) return new Date().toLocaleDateString('en-CA');

          const tahun = d.getFullYear();
          const bulan = String(d.getMonth() + 1).padStart(2, '0');
          const hari = String(d.getDate()).padStart(2, '0');
          return `${tahun}-${bulan}-${hari}`;
        };

        for (const row of importedData) {
          const finalDateStr = konversiKeDateStr(row.Tanggal);

          await db.table("transactions").add({
            date: row.Tanggal || new Date().toLocaleDateString('id-ID'),
            category: row.Kategori || "Lain-lain",
            amount: Number(row.Nominal) || 0,
            type: row.Tipe?.toLowerCase() === "pemasukan" ? "Pemasukan" : "Pengeluaran",
            note: row.Keterangan || "-",
            dateStr: finalDateStr,
            createdAt: Date.now()
          });
        }

        showAlert(`Berhasil mengimpor ${importedData.length} data transaksi!`, 'success');
        e.target.value = "";
      } catch (err) {
        console.error(err);
        showAlert("Gagal membaca file Excel. Pastikan format kolom sesuai.", 'error');
      }
    };

    render.readAsBinaryString(file);
  };

  const resetDatabase = async () => {
    const konfirmasi = await askConfirmation({
      title: "Hapus Semua Data?",
      message: "Apakah Anda yakin ingin menghapus SELURUH catatan keuangan? Tindakan ini tidak dapat dibatalkan!",
      confirmText: "Hapus Permanen",
      cancelText: "Batal",
      type: "danger"
    });
    
    if (konfirmasi) {
      try {
        await db.table("transactions").clear();
        showAlert("Semua data transaksi berhasil dibersihkan dari perangkat.", 'success');
      } catch (error) {
        showAlert("Gagal mengosongkan database.", 'error');
      }
    }
  };

  return (
    <AppShell>
      <div className="w-full max-w-4xl mx-auto space-y-6 pb-12 text-black dark:text-white">
        
        {/* HEADER */}
        <div className="border-b border-zinc-200 dark:border-zinc-900 pb-4">
          <h2 className="text-xl font-black tracking-tight">Setelan Aplikasi</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Kelola preferensi tema visual, format mata uang, dan cadangan data lokal Anda.</p>
        </div>

        {/* 🎨 OPSI 1: KUSTOMISASI TEMA */}
        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-3">
            <span className="text-base"><Palette /></span>
            <h3 className="text-xs font-black uppercase tracking-wider">Tema Tampilan</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <button
              onClick={() => handleThemeChange("light")}
              className={`py-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                theme === "light"
                  ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                  : "bg-white text-black border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800 hover:text-black dark:hover:text-white"
              }`}
            >
              <Sun /> Terang (Light)
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              className={`py-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                theme === "dark"
                  ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                  : "bg-white text-black border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800 hover:text-black dark:hover:text-white"
              }`}
            >
              <Moon /> Gelap (Dark)
            </button>
          </div>
        </div>

        {/* 💵 OPSI 2: FORMAT MATA UANG GLOBAL */}
        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-3">
            <span className="text-base"><CircleDollarSign /></span>
            <h3 className="text-xs font-black uppercase tracking-wider">Mata Uang Global</h3>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Pilih mata uang utama yang akan diterapkan pada seluruh tampilan nominal dan laporan transaksi.
          </p>

          <div className="space-y-3 max-w-md">
            <select
              value={currency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-bold text-black dark:text-white focus:outline-none cursor-pointer"
            >
              {POPULAR_CURRENCIES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.code} - {item.name}
                </option>
              ))}
            </select>

            {/* Live Preview Contoh Tampilan */}
            <div className="p-3 bg-zinc-100 dark:bg-zinc-900/50 rounded-xl flex justify-between items-center text-xs border border-zinc-200/50 dark:border-zinc-800/50">
              <span className="text-zinc-500 font-medium">Contoh Tampilan Nominal:</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400">
                {formatCurrency(1500000)}
              </span>
            </div>
          </div>
        </div>

        {/* 💾 OPSI 3: MANAJEMEN BACKUP DATA (EXCEL) */}
        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-3">
            <span className="text-base"><Save /></span>
            <h3 className="text-xs font-black uppercase tracking-wider">Cadangkan & Pemulihan</h3>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
            Karena MyMoney berjalan 100% lokal, data Anda hanya tersimpan di browser perangkat ini. 
            Disarankan untuk mengekspor data secara berkala ke berkas Excel sebagai salinan cadangan (*backup*).
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black hover:bg-black dark:hover:bg-white text-xs font-bold rounded-xl border border-zinc-700 dark:border-zinc-300 shadow-sm transition cursor-pointer"
            >
              <Upload /> Ekspor ke Excel (.xlsx)
            </button>

            <label className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl shadow-sm hover:bg-emerald-100 dark:hover:bg-emerald-950/70 transition cursor-pointer">
              <Download /> Impor dari Excel
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={importFromExcel}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* ⚠️ OPSI 4: AREA BAHAYA (RESET DATA) */}
        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-3">
            <span className="text-red-500"><TriangleAlert /></span>
            <h3 className="text-xs font-black text-red-500 uppercase tracking-wider">Zona Bahaya</h3>
          </div>
          
          <p className="text-xs text-zinc-400 leading-relaxed">
            Menghapus database lokal akan melenyapkan seluruh riwayat transaksi keuangan Anda secara permanen dari browser ini. Pastikan Anda sudah mengekspor data penting sebelum menekan tombol di bawah.
          </p>

          <div className="pt-1">
            <button
              onClick={resetDatabase}
              className="flex items-center gap-2 px-5 py-2.5 bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-xs font-bold rounded-xl transition duration-150 cursor-pointer"
            >
              <Trash2 /> Hapus Semua Data Transaksi
            </button>
          </div>
        </div>

      </div>
    </AppShell>
  );
}