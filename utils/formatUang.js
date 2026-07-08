export const formatUangRupiah = (nominal) => {
  // Mengubah angka menjadi positif terlebih dahulu
  const angkaSaja = Math.abs(nominal);

  // Memformat angka dengan titik sebagai pemisah ribuan menggunakan regex
  const stringDiformat = angkaSaja
    .toString()
    .replace(/\B(?=(\d3)+(?!\d))/g, ".");

  return `Rp ${stringDiformat}`; // Gunakan spasi biasa atau teks statis yang konsisten
};
