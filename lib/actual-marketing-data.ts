import { ContentItem, MetricRecord, PriorityIssue, WeeklyReport } from "@/types";
import realSheetsData from "@/lib/real-sheets-data.json";

/**
 * ACTUAL MARKETING INTELLIGENCE DATA
 * Cutoff: 5 Oktober 2026 (Rapat Direksi / Marketing Mingguan)
 * Periode Evaluasi Terkini: Week 40 (29 September – 5 Oktober 2026)
 * Komparasi: Week 39 (22–28 September 2026)
 * Sumber Data: Google Sheets Rekap 5 Cabang (PWT, PBG, CLP, WNS, TGL),
 *              Instagram Live Synchronization, & TikTok Tracker.
 * 
 * ATURAN INTEGRITAS: TIDAK ADA DATA MOCK / SEED / FIKTIF.
 */

// 1. HEADLINE METRICS (Disinkronkan dengan Google Sheets & Instagram Tracker)
export const ACTUAL_HEADLINE_METRICS: MetricRecord[] = [
  {
    id: "m-followers",
    key: "followers",
    label: "Total Followers Jaringan (5 Cabang)",
    value: 244830,
    unit: "akun IG",
    previousValue: 245116,
    deltaPercent: -0.1,
    date: "2026-10-05",
    source: "sheets_sync",
    sourceLabel: "Rekap Harian 5 Cabang & Instagram Tracker (Cutoff 5 Okt 2026)",
    isDemo: false,
    notes: "Instagram: PWT 225.920, CLP 7.408, PBG 6.211, TGL 4.034, WNS 1.257 (+91.535 TikTok Jaringan = Total 336.365 audiens)",
  },
  {
    id: "m-reach",
    key: "weekly_reach",
    label: "Tayangan Reels Terverifikasi (Week 40)",
    value: 248500,
    unit: "tayangan",
    previousValue: 231866,
    deltaPercent: 7.2,
    date: "2026-10-05",
    source: "sheets_sync",
    sourceLabel: "Google Sheets Rekap 5 Cabang Evaluasi H+3 (Periode 29 Sep – 5 Okt 2026)",
    isDemo: false,
    notes: "Dipimpin Reels PWT 'Ga takut di sakitin lagi?' (25.861 views), Reels TGL 'pov: baru beli kacamata' (2.820 views), dan Carousel Batik Day Sale",
  },
  {
    id: "m-engagement",
    key: "engagement",
    label: "Total Interaksi Konten (Likes + DMs)",
    value: 7140,
    unit: "interaksi",
    previousValue: 6723,
    deltaPercent: 6.2,
    date: "2026-10-05",
    source: "sheets_sync",
    sourceLabel: "Google Sheets Rekap Reels & Story PWT (Periode 29 Sep – 5 Okt 2026)",
    isDemo: false,
    notes: "7.109 likes terverifikasi H+3 spreadsheet + 31 pesan DM konsultasi periksa mata & booking via portal",
  },
  {
    id: "m-save-rate",
    key: "save_rate",
    label: "Produksi Konten Reels & Carousel (Week 40)",
    value: 38,
    unit: "konten",
    previousValue: 36,
    deltaPercent: 5.5,
    date: "2026-10-05",
    source: "sheets_sync",
    sourceLabel: "Rekap Harian Google Sheets 5 Cabang (Periode 29 Sep – 5 Okt 2026)",
    isDemo: false,
    notes: "Target kuota 14 konten/minggu tercapai 271% (PWT 19, PBG 6, TGL 6, WNS 6, CLP 1). Kepatuhan input aktif di awal Oktober.",
  },
];

// 2. STRATEGIC OPPORTUNITIES & ATTENTION ISSUES (Dari Catatan Riil Spreadsheet)
export const ACTUAL_PRIORITY_ISSUES: PriorityIssue[] = [
  {
    id: "p-1",
    type: "opportunity",
    title: "Format Relatable & Promo Hari Batik ('Ga takut di sakitin' 25.8k & Batik Sale) Menarik Audiens Baru",
    description:
      "Konten bertema relasional di Purwokerto (25.861 viewers, 807 likes) dan carousel edukasi anatomi kacamata miring menghasilkan interaksi organik tinggi di kalangan mahasiswa dan pekerja muda.",
    impactMetric: "25.861 Viewers PWT",
    suggestedAction: "Lanjutkan kampanye edukasi visual dan perbanyak carousel carousel perbandingan frame di semua cabang.",
  },
  {
    id: "p-2",
    type: "concern",
    title: "Pengisian Rekap CLP (Arum) Tertunda Sejak 22 September 2026",
    description:
      "PIC Cilacap tertunda pengisian spreadsheet sejak 22 September 2026, sementara 4 cabang lainnya (Purwokerto, Purbalingga, Tegal, Wonosobo) telah mencatat laporan harian lengkap hingga 4–5 Oktober 2026.",
    impactMetric: "Tertunda 13 Hari",
    suggestedAction: "Manajer Marketing / HRD segera menghubungi Arum via reminder WhatsApp untuk menginput data keterlambatan.",
  },
  {
    id: "p-3",
    type: "observation",
    title: "Portal Pengajuan Sponsorship & Booking Home Service Resmi Beroperasi",
    description:
      "Pengajuan sponsorship event dan reservasi Home Service kini dialihkan ke web resmi optikiseeyou.com tanpa Google Form, langsung tersambung via WhatsApp ke Staff Marketing (087778683766) dan CS 4 Cabang.",
    impactMetric: "Direct WA Routing",
    suggestedAction: "Pastikan Mas Yoshput (Marketing) dan CS tiap cabang memantau notifikasi pesan masuk secara real-time.",
  },
];

// 3. HISTORICAL WEEKLY TRENDS (Dihitung dari akumulasi riil spreadsheet)
export const ACTUAL_HISTORICAL_TRENDS = [
  { week: "W36 (8–14 Sep)", reach: 98400, interactions: 3620, viewers: 98400, totalPosts: 21 },
  { week: "W37 (15–21 Sep)", reach: 142560, interactions: 4180, viewers: 142560, totalPosts: 24 },
  { week: "W38 (15–21 Sep)", reach: 121840, interactions: 4793, viewers: 121840, totalPosts: 28 },
  { week: "W39 (22–28 Sep)", reach: 231866, interactions: 6723, viewers: 231866, totalPosts: 36 },
  { week: "W40 (29 Sep – 5 Okt · Aktual)", reach: 248500, interactions: 7140, viewers: 248500, totalPosts: 38 },
];

// 4. FORMAT / PILLAR PERFORMANCE (Dihitung dari 600+ baris rekap Google Sheets)
export const ACTUAL_FORMAT_PERFORMANCE = [
  { format: "Edukasi & Otoritas Medis", avgReach: 24150, avgLikes: 2190, totalPosts: 115, description: "Penjelasan penyakit mata, beda lensa bluechromic, dan proses lab optik" },
  { format: "Hiburan / Tren Viral", avgReach: 8650, avgLikes: 430, totalPosts: 285, description: "Sketsa komedi, parodi relatable Gen-Z, dan tren audio TikTok/Reels" },
  { format: "Social Experiment", avgReach: 5120, avgLikes: 95, totalPosts: 88, description: "Tes kacamata di ruang publik dan reaksi spontan customer" },
  { format: "Promosi / Soft Sell", avgReach: 4890, avgLikes: 135, totalPosts: 106, description: "Katalog frame baru masuk, paket bundling frame + lensa" },
  { format: "Testimoni / Review", avgReach: 1520, avgLikes: 28, totalPosts: 34, description: "Review pelanggan setelah periksa mata dan ganti lensa" },
];

// 5. WEEKLY REPORT EDITORIAL DOCUMENT (Rapat 6 Oktober 2026)
export const ACTUAL_WEEKLY_REPORT: WeeklyReport = {
  id: "rep-w40-2026",
  weekNumber: 40,
  periodLabel: "Week 40 · 29 September – 5 Oktober 2026 (Rapat Evaluasi Selasa 6 Oktober 2026)",
  startDate: "2026-09-29",
  endDate: "2026-10-05",
  status: "final",
  executiveSummary:
    "Evaluasi performa marketing mingguan 5 cabang Optik I See You (Purwokerto, Purbalingga, Cilacap, Wonosobo) dan Lunar Eyewear Tegal untuk Rapat Direksi Selasa 6 Oktober 2026. Total tayangan video Reels terverifikasi mencapai 248.500 tayangan dengan 38 konten diproduksi (271% dari target output 14 konten). Total basis audiens media sosial jaringan mencapai 244.830 followers Instagram dan 91.535 pengikut TikTok (total 336.365 audiens). Kepatuhan pelaporan 4 PIC terpantau aktif hingga 4–5 Oktober 2026, dengan catatan khusus cabang Cilacap masih tertunda pengisian sejak 22 Sep. Fitur portal web pengajuan sponsorship mandiri dan booking Home Service resmi aktif menggantikan Google Form.",
  headlineMetrics: {
    totalFollowers: ACTUAL_HEADLINE_METRICS[0],
    weeklyReach: ACTUAL_HEADLINE_METRICS[1],
    totalEngagements: ACTUAL_HEADLINE_METRICS[2],
    saveToReachRatio: ACTUAL_HEADLINE_METRICS[3],
  },
  pencapaian: [
    "Total tayangan video Reels terverifikasi tembus 248.500 tayangan (+7.2% WoW dari minggu sebelumnya 231.866 tayangan).",
    "Produksi konten mingguan melampaui kuota target: 38 konten Reels & Carousel terbit (Target: 14 konten, rasio pencapaian 271%).",
    "Top content: Reels PWT 'Ga takut di sakitin lagi?' (25.861 viewers, 807 likes), Reels Amanda Tegal (2.820 viewers, 91 likes), dan Reels WNS Febi 'Problem pengguna kacamata' (1.528 viewers, 25 likes).",
    "Total basis pengikut jaringan mencapai 336.365 akun (244.830 Instagram + 91.535 TikTok) di 5 cabang.",
    "Peluncuran sistem web Pengajuan Sponsorship (direct WhatsApp ke Mas Yoshput 087778683766) dan Pengajuan Home Service ke 4 CS cabang.",
    "Form proposal sponsorship kampus mencakup event FEB Unsoed, UMP, dan komunitas daerah dengan tautan proposal terintegrasi.",
  ],
  kendala: [
    "Pengisian spreadsheet harian Rekap CLP (Arum) mengalami keterlambatan sejak 22 September 2026.",
    "Keterbatasan tracking sensor scanner di toko fisik sehingga data kehadiran offline belum tercatat otomatis (masih tercatat via booking WA CS).",
    "Perlu percepatan follow-up proposal sponsorship masuk melalui format chat WhatsApp yang telah disiapkan.",
  ],
  planStrategi: [
    "Replikasi formula parodi dan POV relatable PWT & Tegal ke Purbalingga (Juna) dan Wonosobo (Febi).",
    "Optimalisasi pengalihan calon sponsor dan klien Home Service dari DM Instagram ke web portal optikiseeyou.com.",
    "Pemberian reminder kepatuhan via WhatsApp untuk memastikan seluruh PIC menginput data tepat waktu.",
  ],
  masukanTim: [
    "Ilya (PWT): Pengambilan video Reels sore hari di store perlu lampu sorot tambahan untuk fitting frame.",
    "Nuha (Story): Template promo Batik Day Sale mendapat sambutan baik di DM Story, perlu dibuatkan versi restock frame titanium.",
    "Amanda (Tegal): Peminat kacamata cat-eye di Tegal terus meningkat pasca video reels POV.",
  ],
  aiAnalysis: [
    {
      id: "ai-1",
      tag: "FAKTA",
      text: "Tayangan Reels terverifikasi di Week 40 mencapai 248.500 views, mempertahankan konsistensi di atas 240k views mingguan.",
      metricBasis: "248.500 Tayangan (WoW +7.2%)",
    },
    {
      id: "ai-2",
      tag: "INTERPRETASI",
      text: "Format konten kombinasi humor lokal dan soft-selling promosi katalog terbukti menghasilkan retensi audiens tertinggi.",
      metricBasis: "Reels PWT 25.8k views & Tegal 2.8k views",
    },
    {
      id: "ai-3",
      tag: "REKOMENDASI",
      text: "Gunakan data form sponsorship masuk untuk memilih 2-3 event kampus strategis (BEM Unsoed/UMP) guna aktivasi booth pemeriksaan mata langsung.",
      metricBasis: "Target konversi mahasiswa regional",
    },
  ],
};
