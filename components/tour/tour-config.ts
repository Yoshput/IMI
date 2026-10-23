export interface TourSubItem {
  label: string;
  desc: string;
}

export interface TourStep {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  subItems?: TourSubItem[];
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
    tip: "Panduan ini akan mengenalkan seluruh menu di navbar dan bagian utama dashboard secara bertahap.",
    placement: "center",
  },
  {
    id: "branch-filter",
    title: "1. Filter Cabang Strategis",
    subtitle: "Konsolidasi Semua Cabang atau Fokus Spesifik",
    description:
      "Gunakan pemilih cabang ini untuk beralih secara instan antara pandangan konsolidasi 'Semua Cabang' atau membedah analitik gerai spesifik (Purwokerto, Wonosobo, Cilacap, Purbalingga, Lunar Tegal).",
    tip: "Seluruh data KPI, grafik, dan tabel di bawah otomatis tersaring saat cabang diubah.",
    targetSelector: '[data-tour="branch-filter"]',
    mobileTargetSelector: '[data-tour="branch-filter-mobile"]',
    placement: "bottom",
  },
  {
    id: "nav-category-eksekutif",
    title: "2. Menu Eksekutif & Rekap",
    subtitle: "Pusat Kendali Utama & Audit Harian (5 Modul)",
    description:
      "Kumpulan modul utama untuk memantau ritme operasional harian, database sinkronisasi, dan laporan performa direksi:",
    subItems: [
      {
        label: "📊 Dashboard",
        desc: "Rekap performa mingguan, status kepatuhan 6 PIC cabang, dan metrik KPI.",
      },
      {
        label: "📑 Spreadsheet",
        desc: "Akses database mentah Google Sheets dan riwayat input konten harian.",
      },
      {
        label: "📈 Analytics",
        desc: "Trafik Google Search Console, klik website, dan pendaftaran cek mata online.",
      },
      {
        label: "🔒 Finance",
        desc: "Analisis omzet, margin, pos biaya, dan laba-rugi gerai (terproteksi PIN).",
      },
      {
        label: "🔒 Report Eksekutif",
        desc: "Laporan komprehensif bulanan PDF/cetak siap rapat evaluasi direksi.",
      },
    ],
    tip: "Arahkan kursor ke menu ini untuk membuka dropdown dan memilih modul yang diinginkan.",
    targetSelector: '[data-tour="nav-category-eksekutif"]',
    mobileTargetSelector: '[data-tour="nav-mobile-eksekutif"]',
    placement: "bottom",
  },
  {
    id: "nav-category-sosial",
    title: "3. Menu Sosial & Konten",
    subtitle: "Audit Akun Medsos & Bank Ide Konten (2 Modul)",
    description:
      "Modul khusus untuk memantau pertumbuhan sosial media dan aset konten kreatif seluruh cabang:",
    subItems: [
      {
        label: "🚀 Social Blade",
        desc: "Benchmarking followers, view rate, dan engagement rate Instagram & TikTok.",
      },
      {
        label: "🎬 Konten",
        desc: "Bank video Reels terunggah, Story harian PIC, jadwal posting, dan evaluasi audiens.",
      },
    ],
    tip: "Gunakan modul Konten untuk mengecek apakah video reels cabang sudah memenuhi target kuota mingguan.",
    targetSelector: '[data-tour="nav-category-sosial"]',
    mobileTargetSelector: '[data-tour="nav-mobile-sosial"]',
    placement: "bottom",
  },
  {
    id: "nav-category-riset",
    title: "4. Menu Riset & Pertumbuhan",
    subtitle: "Intelijen Pesaing, Influencer, & Event Offline (3 Modul)",
    description:
      "Alat riset pasar untuk memperluas jangkauan dan memenangkan kompetisi di setiap area gerai:",
    subItems: [
      {
        label: "🎯 Kompetitor",
        desc: "Monitoring harga frame/lensa, paket promo, dan aktivitas optik pesaing per kota.",
      },
      {
        label: "📸 KOL",
        desc: "Database influencer Instagram/TikTok, negosiasi fee, jadwal posting, dan bukti tayang.",
      },
      {
        label: "📍 Venue",
        desc: "Riset lokasi aktivasi offline, sponsorship sekolah/kampus/instansi, dan izin event.",
      },
    ],
    tip: "Modul Venue memudahkan tim lapangan mencatat koordinasi izin sponsorship dan event luar gedung.",
    targetSelector: '[data-tour="nav-category-riset"]',
    mobileTargetSelector: '[data-tour="nav-mobile-riset"]',
    placement: "bottom",
  },
  {
    id: "nav-category-kemitraan",
    title: "5. Menu Kemitraan & Pelanggan",
    subtitle: "B2B Merchants, Sponsorship, & Layanan Purna Jual (2 Modul)",
    description:
      "Modul pengelolaan relasi eksternal baik dengan partner bisnis maupun pelanggan loyal optik:",
    subItems: [
      {
        label: "💼 Pengajuan",
        desc: "Alur persetujuan voucher diskon merchant, proposal kerjasama, dan sponsorship event.",
      },
      {
        label: "👓 Aftersales",
        desc: "Klaim garansi frame/lensa, riwayat servis kacamata, dan indeks kepuasan pelanggan.",
      },
    ],
    tip: "Mendukung digitalisasi alur form sponsorship online dan follow-up kepuasan pelanggan.",
    targetSelector: '[data-tour="nav-category-kemitraan"]',
    mobileTargetSelector: '[data-tour="nav-mobile-kemitraan"]',
    placement: "bottom",
  },
  {
    id: "nav-pill-finance",
    title: "6. Tombol Pintas Finance & Report 🔒",
    subtitle: "Akses Cepat Data Keuangan & Laporan Direksi",
    description:
      "Tombol pintas khusus di navbar untuk membuka modul Keuangan & Laporan Eksekutif tanpa perlu membuka dropdown. Memerlukan autentikasi PIN direksi demi keamanan data sensitif perusahaan.",
    tip: "PIN akses default telah disediakan untuk tim manajemen yang berwenang.",
    targetSelector: '[data-tour="nav-pill-finance"]',
    placement: "bottom",
  },
  {
    id: "nav-pill-proposal",
    title: "7. Tombol Proposal B2B Resmi",
    subtitle: "Dokumen Cetak Standar A4 / PDF",
    description:
      "Akses langsung ke generator proposal kemitraan resmi Optik I See You (Proposal Sponsorship & Proposal Merchant). Tata letak dokumen dioptimasi khusus untuk dicetak format A4 atau diekspor ke PDF dengan tata letak bersih dan profesional.",
    tip: "Dapat langsung diprint atau disimpan PDF untuk dikirimkan ke pihak brand/merchant terkait.",
    targetSelector: '[data-tour="nav-pill-proposal"]',
    placement: "bottom",
  },
  {
    id: "nav-button-search",
    title: "8. Pencarian Cepat & Command Palette",
    subtitle: "Navigasi Kilat (Shortcut ⌘K / Ctrl+K)",
    description:
      "Fitur pencarian instan seluruh workspace. Anda dapat mencari nama halaman, modul keuangan, nama cabang, atau aksi cepat hanya dengan mengetikkan kata kunci.",
    tip: "Tekan tombol keyboard 'Ctrl + K' kapan saja untuk memunculkan kotak pencarian ini.",
    targetSelector: '[data-tour="nav-button-search"]',
    placement: "bottom",
  },
  {
    id: "date-range",
    title: "9. Siklus Evaluasi & Rentang Waktu",
    subtitle: "Ritme Rapat Manajemen & Cutoff Terverifikasi",
    description:
      "Menampilkan periode aktif siklus evaluasi mingguan, tanggal rapat evaluasi direksi, target output kumulatif, serta label verifikasi sinkronisasi Google Sheets.",
    tip: "Memastikan seluruh tim eksekutif merujuk pada data cutoff yang sama.",
    targetSelector: '[data-tour="date-range"]',
    placement: "bottom",
  },
  {
    id: "kpi-metrics",
    title: "10. Metrik Inti & Headline KPI",
    subtitle: "Jangkauan, Produksi Konten, dan Interaksi",
    description:
      "Area ini merangkum metrik performa utama: total jangkauan konten mingguan, produksi Reels PIC, volume unggahan Story, dan interaksi konsultasi DM pelanggan.",
    tip: "Kartu hero di sisi kiri menampilkan persentase pencapaian target output pos secara real-time.",
    targetSelector: '[data-tour="kpi-metrics"]',
    placement: "bottom",
  },
  {
    id: "performance-chart",
    title: "11. Tren Trafik Organik & Antrian Online",
    subtitle: "Trafik Google Search Console & Layanan Web",
    description:
      "Pantau tren penelusuran organik Google Search Console (GSC), jumlah klik tombol pendaftaran antrian cek mata online, dan pengunjung photobooth kacamata secara transparan.",
    tip: "Membantu mengukur konversi minat pencarian di Google menjadi kunjungan langsung ke optik.",
    targetSelector: '[data-tour="performance-chart"]',
    placement: "top",
  },
  {
    id: "campaign-table",
    title: "12. Matriks Performa Cabang & Sosial Media",
    subtitle: "Komparasi Lintas Cabang & Audit PIC Harian",
    description:
      "Tabel resume komparatif 5 cabang: lacak followers Instagram & TikTok, trafik klik website, status kepatuhan rekap PIC harian, serta link tautan live akun media sosial.",
    tip: "Klik tombol cabang pada tabel untuk langsung menyorot performa gerai terkait.",
    targetSelector: '[data-tour="campaign-table"]',
    placement: "top",
  },
  {
    id: "tour-help-button",
    title: "13. Bantuan & Pengulangan Panduan",
    subtitle: "Akses Cepat Kapan Saja",
    description:
      "Panduan selesai! Anda dapat menekan tombol '? Panduan' di header ini kapan saja untuk mengulang tur, mendemokan seluruh navbar dan dashboard kepada pimpinan atau tim baru.",
    tip: "Dapat juga diakses dengan menekan tombol 'Panduan Interaktif' di menu mobile.",
    targetSelector: '[data-tour="tour-help-button"]',
    mobileTargetSelector: '[data-tour="tour-help-button-mobile"]',
    placement: "bottom",
  },
];
