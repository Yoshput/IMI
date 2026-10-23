export interface TourStep {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  tip?: string;
  targetSelector?: string;
  mobileTargetSelector?: string;
  placement?: "bottom" | "top" | "left" | "right" | "center";
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    title: "Selamat Datang di I See You Marketing Intelligence",
    subtitle: "Executive Command Center & Multi-Branch Intelligence",
    description:
      "Platform terpadu untuk memantau performa pemasaran digital, kepatuhan konten harian cabang, analitik trafik web, dan kesiapan kemitraan B2B lintas 5 outlet (Purwokerto, Purbalingga, Cilacap, Wonosobo, dan Lunar Tegal).",
    tip: "Panduan ini membutuhkan waktu sekitar 1 menit. Anda dapat melewatinya atau mengulanginya kapan saja.",
    placement: "center",
  },
  {
    id: "branch-filter",
    title: "1. Filter Cabang Strategis",
    subtitle: "Konsolidasi Semua Cabang atau Fokus Spesifik",
    description:
      "Gunakan pemilih cabang ini untuk beralih secara instan antara pandangan konsolidasi 'Semua Cabang' atau membedah analitik gerai spesifik (Purwokerto, Wonosobo, Cilacap, Purbalingga, Lunar Tegal).",
    tip: "URL dan data KPI otomatis tersaring saat cabang diubah.",
    targetSelector: '[data-tour="branch-filter"]',
    mobileTargetSelector: '[data-tour="branch-filter-mobile"]',
    placement: "bottom",
  },
  {
    id: "date-range",
    title: "2. Siklus Evaluasi & Rentang Waktu",
    subtitle: "Ritme Rapat Manajemen & Cutoff Terverifikasi",
    description:
      "Menampilkan periode aktif siklus evaluasi mingguan, tanggal rapat evaluasi direksi, target output kumulatif, serta label verifikasi sinkronisasi Google Sheets.",
    tip: "Memastikan seluruh tim eksekutif merujuk pada data cutoff yang sama.",
    targetSelector: '[data-tour="date-range"]',
    placement: "bottom",
  },
  {
    id: "kpi-metrics",
    title: "3. Metrik Inti & Headline KPI",
    subtitle: "Jangkauan, Produksi Konten, dan Interaksi",
    description:
      "Area ini merangkum metrik performa utama: total jangkauan konten mingguan, produksi Reels PIC, volume unggahan Story, dan interaksi konsultasi DM pelanggan.",
    tip: "Kartu hero di sisi kiri menampilkan persentase pencapaian target output pos secara real-time.",
    targetSelector: '[data-tour="kpi-metrics"]',
    placement: "bottom",
  },
  {
    id: "performance-chart",
    title: "4. Tren Trafik Organik & Antrian Online",
    subtitle: "Trafik Google Search Console & Layanan Web",
    description:
      "Pantau tren penelusuran organik Google Search Console (GSC), jumlah klik tombol pendaftaran antrian cek mata online, dan pengunjung photobooth kacamata secara transparan.",
    tip: "Membantu mengukur konversi minat pencarian di Google menjadi kunjungan langsung ke optik.",
    targetSelector: '[data-tour="performance-chart"]',
    placement: "top",
  },
  {
    id: "campaign-table",
    title: "5. Matriks Performa Cabang & Sosial Media",
    subtitle: "Komparasi Lintas Cabang & Audit PIC Harian",
    description:
      "Tabel resume komparatif 5 cabang: lacak followers Instagram & TikTok, trafik klik website, status kepatuhan rekap PIC harian, serta link tautan live akun media sosial.",
    tip: "Klik tombol cabang pada tabel untuk langsung menyorot performa gerai terkait.",
    targetSelector: '[data-tour="campaign-table"]',
    placement: "top",
  },
  {
    id: "tour-help-button",
    title: "6. Bantuan & Pengulangan Panduan",
    subtitle: "Akses Cepat Kapan Saja",
    description:
      "Panduan selesai! Anda dapat menekan tombol '? Panduan Dashboard' ini kapan saja untuk mengulang tur, mendemokan sistem kepada pimpinan, atau mengenalkan dashboard ke anggota tim baru.",
    tip: "Dapat juga diakses dengan menekan tombol 'Buka Panduan' di menu mobile.",
    targetSelector: '[data-tour="tour-help-button"]',
    mobileTargetSelector: '[data-tour="tour-help-button-mobile"]',
    placement: "bottom",
  },
];
