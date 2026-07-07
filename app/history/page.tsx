'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';

export default function History() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKategori, setFilterKategori] = useState('Semua');

  // Dummy data untuk contoh tampilan visual riwayat transaksi
  const dummyRiwayat = [
    { id: 1, tanggal: '07 Juli 2026', kategori: 'Makanan & Minuman', jumlah: 25000, tipe: 'pengeluaran', keterangan: 'Kopi V60 Flores' },
    { id: 2, tanggal: '06 Juli 2026', kategori: 'Transportasi', jumlah: 15000, tipe: 'pengeluaran', keterangan: 'Bensin Motor' },
    { id: 3, tanggal: '01 Juli 2026', kategori: 'Gaji / Pendapatan', jumlah: 3500000, tipe: 'pemasukan', keterangan: 'Gaji Bulanan' },
  ];

  return (
    <AppShell>
      <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
        
        {/* 1. HEADER HALAMAN & RINGKASAN */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-100 tracking-wide">Riwayat Transaksi</h2>
            <p className="text-xs text-gray-400 mt-0.5">Daftar seluruh catatan pemasukan dan pengeluaran Anda.</p>
          </div>
          
          {/* Batang Pencarian (Search Bar) */}
          <div className="w-full md:w-72 relative">
            <input 
              type="text" 
              placeholder="Cari transaksi atau catatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#1e293b] border border-slate-700/80 rounded-xl focus:outline-none focus:border-blue-500 text-sm text-slate-100 placeholder-gray-500"
            />
            <span className="absolute left-3 top-2.5 text-gray-500 text-sm">🔍</span>
          </div>
        </div>

        {/* 2. FILTER KATEGORI (Horizontal Scrollable Tabs) */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {['Semua', 'Makanan & Minuman', 'Gaji / Pendapatan', 'Transportasi', 'Hiburan'].map((kat) => (
            <button
              key={kat}
              onClick={() => setFilterKategori(kat)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full border whitespace-nowrap transition ${
                filterKategori === kat
                  ? 'bg-blue-600/20 text-blue-400 border-blue-500/50'
                  : 'bg-[#1e293b] text-gray-400 border-slate-800 hover:text-gray-200'
              }`}
            >
              {kat}
            </button>
          ))}
        </div>

        {/* 3. DAFTAR RIWAYAT TRANSAKSI */}
        <div className="space-y-4">
          {dummyRiwayat.map((item) => (
            <div 
              key={item.id} 
              className="bg-[#1e293b] border border-slate-800/80 p-4 rounded-2xl shadow-sm flex justify-between items-center hover:border-slate-700 transition duration-200 group"
            >
              <div className="flex items-center gap-4">
                {/* Ikon Berdasarkan Tipe/Kategori */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                  item.tipe === 'pemasukan' ? 'bg-emerald-950/40 text-emerald-400' : 'bg-red-950/40 text-red-400'
                }`}>
                  {item.kategori === 'Makanan & Minuman' ? '☕' : item.kategori === 'Transportasi' ? '🛵' : '💼'}
                </div>
                
                {/* Informasi Transaksi */}
                <div>
                  <h4 className="font-bold text-sm text-slate-200 group-hover:text-blue-400 transition-colors">
                    {item.keterangan || item.kategori}
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {item.tanggal} • <span className="text-gray-500">{item.kategori}</span>
                  </p>
                </div>
              </div>

              {/* Nominal Angka (Hijau untuk pemasukan, Merah untuk pengeluaran) */}
              <div className="text-right">
                <span className={`font-extrabold text-sm ${
                  item.tipe === 'pemasukan' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {item.tipe === 'pemasukan' ? '+' : '-'} Rp {item.jumlah.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Jika Data Kosong */}
        {dummyRiwayat.length === 0 && (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl">
            <span className="text-3xl">📭</span>
            <p className="text-sm text-gray-500 mt-2">Belum ada transaksi pada kategori ini.</p>
          </div>
        )}

      </div>
    </AppShell>
  );
}