'use client';

import AppShell from "@/components/AppShell";
import { db } from "@/database/db";
import { Download, Moon, Palette, Save, Sun, Trash2, TriangleAlert, Upload } from "lucide-react";
import React, { useState } from "react";
import * as XLSX from 'xlsx';

export default function Settings() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  const exportToExcel = async () => {
    try {
      const allData = await db.table('transactions').toArray();

      if (allData.length === 0) {
        alert('belum ada data');
        return;
      }

      // 1. Buat format data mentah (Array of Objects) seperti semula
      const dataFormat = allData.map((item, index) => ({
        No: index + 1,
        Tanggal: item.date,
        Kategori: item.category,
        Nominal: item.amount,
        Tipe: item.type,
        Keterangan: item.note,
      }));

      // 2. Ubah data menjadi objek worksheet SheetJS
      const worksheet = XLSX.utils.json_to_sheet(dataFormat);

      // 3. ✨ FITUR AUTO-FIT COLUMN (Tanpa Warna / Tanpa Library Tambahan)
      // Mengambil daftar kunci/header dari data (No, Tanggal, Kategori, dll.)
      const headers = Object.keys(dataFormat[0]);

      const colWidths = headers.map((headerText) => {
        // Cari baris dengan teks terpanjang di kolom ini
        const maxLen = dataFormat.reduce((max, row) => {
          const cellValue = row[headerText as keyof typeof row] ? String(row[headerText as keyof typeof row]) : "";
          return cellValue.length > max ? cellValue.length : max;
        }, headerText.length);

        // Berikan padding +3 karakter supaya rapi dan tidak terlalu mepet dengan garis pembatas
        return { wch: maxLen + 3 };
      });

      // Pasang ukuran kolom otomatis ke worksheet
      worksheet['!cols'] = colWidths;

      // 4. Buat file workbook dan download berkasnya
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Keuangan');

      XLSX.writeFile(workbook, `MyMoney_Backup_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error(error);
      alert('Gagal mengekspor data');
    }
  }

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
          alert("File Excel kosong atau format tidak sesuai!");
          return;
        }

        for (const row of importedData) {
          await db.table("transactions").add({
            date: row.Tanggal || new Date().toLocaleDateString('id-ID'),
            category: row.Kategori || "Lain-lain",
            amount: Number(row.Nominal) || 0,
            type: row.Tipe?.toLowerCase() === "pemasukan" ? "Pemasukan" : "Pengeluaran",
            note: row.Keterangan || "-",
            dateStr: row.Tanggal ? new Date(row.Tanggal).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            createdAt: Date.now()
          });
        }

        alert(`Berhasil mengimpor ${importedData.length} data transaksi!`);
        window.location.reload();
      } catch (err) {
        console.error(err);
        alert("Gagal membaca file Excel. Pastikan format kolom sesuai.");
      }
    };

    render.readAsBinaryString(file);
  }

  const resetDatabase = async () => {
    const konfirmasi = confirm(
      "Apakah Anda yakin ingin menghapus SELURUH catatan keuangan? Tindakan ini tidak dapat dibatalkan!"
    );
    
    if (konfirmasi) {
      try {
        await db.table("transactions").clear();
        alert("Semua data transaksi berhasil dibersihkan dari perangkat.");
        window.location.reload();
      } catch (error) {
        alert("Gagal mengosongkan database.");
      }
    }
  };

  return (
    <AppShell>
      <div className="w-full max-w-4xl mx-auto space-y-6 pb-12 text-black dark:text-white">
        
        {/* HEADER */}
        <div className="border-b border-zinc-200 dark:border-zinc-900 pb-4">
          <h2 className="text-xl font-black tracking-tight">Setelan Aplikasi</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Kelola preferensi tema visual dan cadangan data lokal Anda.</p>
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
              className={`py-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                theme === "light"
                  ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                  : "bg-white text-black border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800 hover:text-black dark:hover:text-white"
              }`}
            >
              <Sun /> Terang (Light)
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              className={`py-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                theme === "dark"
                  ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                  : "bg-white text-black border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800 hover:text-black dark:hover:text-white"
              }`}
            >
              <Moon /> Gelap (Dark)
            </button>
          </div>
        </div>

        {/* 💾 OPSI 2: MANAJEMEN BACKUP DATA (EXCEL) */}
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
            {/* Tombol Ekspor */}
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black hover:bg-black dark:hover:bg-white text-xs font-bold rounded-xl border border-zinc-700 dark:border-zinc-300 shadow-sm transition"
            >
              <Upload /> Ekspor ke Excel (.xlsx)
            </button>

            {/* Tombol Impor dengan Indikator Hijau */}
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

        {/* ⚠️ OPSI 3: AREA BAHAYA (RESET DATA) */}
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
              className="flex items-center gap-2 px-5 py-2.5 bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-xs font-bold rounded-xl transition duration-150"
            >
              <Trash2 /> Hapus Semua Data Transaksi
            </button>
          </div>
        </div>

      </div>
    </AppShell>
  );
}