// Mengambil kode mata uang dari localStorage (Default: "IDR")
export const getSelectedCurrency = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("currency") || "IDR";
  }
  return "IDR";
};

// Menyimpan mata uang pilihan pengguna
export const setSelectedCurrency = (code: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("currency", code.toUpperCase());
  }
};

// 💡 FUNGSI UTAMA DISPLAY: Memformat angka ke mata uang pilihan pengguna secara global
export const formatCurrency = (amount: number, overrideCurrency?: string): string => {
  const currency = (overrideCurrency || getSelectedCurrency()).toUpperCase();

  // Peta lokal spesifik agar simbol seperti Rp, $, €, ¥ tampil dengan benar
  const localeMap: Record<string, string> = {
    IDR: "id-ID", // Menjamin IDR dirender sebagai "Rp"
    USD: "en-US",
    EUR: "de-DE",
    JPY: "ja-JP",
    GBP: "en-GB",
    SGD: "en-SG",
    MYR: "ms-MY",
    KRW: "ko-KR",
    THB: "th-TH",
    PHP: "fil-PH",
  };

  // Gunakan locale yang sesuai, atau fallback ke 'id-ID' / undefined jika tidak terdaftar
  const targetLocale = localeMap[currency] || "id-ID";

  try {
    return new Intl.NumberFormat(targetLocale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: ["IDR", "JPY", "KRW", "VND"].includes(currency) ? 0 : 2,
    }).format(amount);
  } catch {
    // Fallback jika kode mata uang tidak valid
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  }
};

// 💡 DAFTAR LENGKAP MATA UANG UNTUK DROPDOWN SETTINGS
export const POPULAR_CURRENCIES = [
  { code: "IDR", name: "Rupiah Indonesia (Rp)" },
  { code: "USD", name: "Dolar Amerika ($)" },
  { code: "EUR", name: "Euro (€)" },
  { code: "SGD", name: "Dolar Singapura (S$)" },
  { code: "MYR", name: "Ringgit Malaysia (RM)" },
  { code: "JPY", name: "Yen Jepang (¥)" },
  { code: "GBP", name: "Pound Inggris (£)" },
  { code: "AUD", name: "Dolar Australia (A$)" },
  { code: "CAD", name: "Dolar Kanada (C$)" },
  { code: "CHF", name: "Franc Swiss (CHF)" },
  { code: "CNY", name: "Yuan Tiongkok (¥)" },
  { code: "HKD", name: "Dolar Hong Kong (HK$)" },
  { code: "KRW", name: "Won Korea Selatan (₩)" },
  { code: "SAR", name: "Riyal Arab Saudi (SR)" },
  { code: "THB", name: "Baht Thailand (฿)" },
  { code: "VND", name: "Dong Vietnam (₫)" },
  { code: "INR", name: "Rupee India (₹)" },
  { code: "PHP", name: "Peso Filipina (₱)" },
];