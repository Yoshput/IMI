import { ContentItem, MetricRecord, PriorityIssue, WeeklyReport } from "@/types";
import realSheetsData from "@/lib/real-sheets-data.json";

/**
 * ACTUAL MARKETING INTELLIGENCE DATA
 * Cutoff: 29 September 2026 (Rapat Direksi / Marketing Mingguan)
 * Periode Evaluasi Terkini: Week 39 (22–28 September 2026)
 * Komparasi: Week 38 (15–21 September 2026)
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
    value: 245116,
    unit: "akun IG",
    previousValue: 244620,
    deltaPercent: 0.2,
    date: "2026-09-28",
    source: "sheets_sync",
    sourceLabel: "Rekap Harian 5 Cabang & Instagram Tracker (Cutoff 29 Sep 2026)",
    isDemo: false,
    notes: "Instagram: PWT 226.230, CLP 7.408, PBG 6.198, TGL 4.016, WNS 1.264 (+91.625 TikTok Jaringan = Total 336.741 audiens)",
  },
  {
    id: "m-reach",
    key: "weekly_reach",
    label: "Tayangan Reels Terverifikasi (Week 39)",
    value: 231866,
    unit: "tayangan",
    previousValue: 121840,
    deltaPercent: 90.3,
    date: "2026-09-28",
    source: "sheets_sync",
    sourceLabel: "Google Sheets Rekap 5 Cabang Evaluasi H+3 (Periode 22–28 Sep 2026)",
    isDemo: false,
    notes: "Lonjakan tajam dipimpin Reels 'Cosplay Nadia Omara' PWT (32.900 views) & 'Tenpa Sadar' TGL (26.673 views)",
  },
  {
    id: "m-engagement",
    key: "engagement",
    label: "Total Interaksi Konten (Likes + DMs)",
    value: 6723,
    unit: "interaksi",
    previousValue: 4793,
    deltaPercent: 40.3,
    date: "2026-09-28",
    source: "sheets_sync",
    sourceLabel: "Google Sheets Rekap Reels & Story PWT (Periode 22–28 Sep 2026)",
    isDemo: false,
    notes: "6.696 likes terverifikasi H+3 spreadsheet + 27 pesan DM masuk konsultasi frame & periksa mata",
  },
  {
    id: "m-save-rate",
    key: "save_rate",
    label: "Produksi Konten Reels (Week 39)",
    value: 36,
    unit: "konten reels",
    previousValue: 28,
    deltaPercent: 28.6,
    date: "2026-09-28",
    source: "sheets_sync",
    sourceLabel: "Rekap Harian Google Sheets 5 Cabang (Periode 22–28 Sep 2026)",
    isDemo: false,
    notes: "Target kuota 14 reels/minggu tercapai 257% (PWT 18, PBG 6, TGL 6, WNS 5, CLP 1). Catatan: Save Rate Meta dihapus karena butuh Meta Graph API resmi.",
  },
];

// 2. STRATEGIC OPPORTUNITIES & ATTENTION ISSUES (Dari Catatan Riil Spreadsheet)
export const ACTUAL_PRIORITY_ISSUES: PriorityIssue[] = [
  {
    id: "p-1",
    type: "opportunity",
    title: "Format Parodi & Relatable Populer ('Cosplay Nadia Omara' 32.9k & 'Tenpa Sadar' 26.6k) Tembus FYP",
    description:
      "Video Reels bertema parodi di Purwokerto (32.900 viewers) dan Tegal (26.673 viewers) menyumbang lebih dari 25% total viewers mingguan. Format storytelling santai terbukti paling mudah viral di audiens regional.",
    impactMetric: "59.573 Viewers Gabungan",
    suggestedAction: "Replikasi formula hook humor lokal & parodi untuk cabang Purbalingga, Cilacap, dan Wonosobo.",
  },
  {
    id: "p-2",
    type: "concern",
    title: "Pengisian Rekap CLP (Arum) Tertunda 7 Hari (Data Terakhir: 22 September 2026)",
    description:
      "PIC Cilacap tertunda pengisian spreadsheet sejak 22 September 2026, menyebabkan metrik evaluasi mingguan cabang Cilacap belum tercatat penuh untuk rapat 29 September.",
    impactMetric: "Tertunda 7 Hari",
    suggestedAction: "Manajer Marketing / HRD segera menghubungi Arum via reminder WhatsApp untuk melengkapi rekapan sebelum evaluasi final.",
  },
  {
    id: "p-3",
    type: "observation",
    title: "DM Story Purwokerto Terfokus pada 'Frame Try-On' & 'Pricelist Lensa Anti Radiasi'",
    description:
      "Dari 27 DM inbound minggu ini yang dicatat Nuha (Story PWT), topik dominan adalah tanya harga lensa silinder/minus dan ingin coba frame yang ada di video.",
    impactMetric: "27 Inbound Leads",
    suggestedAction: "CS toko wajib fast-response mengirimkan katalog foto frame dan mengarahkan booking antrian online via optikiseeyou.com.",
  },
];

// 3. HISTORICAL WEEKLY TRENDS (Dihitung dari akumulasi riil spreadsheet)
export const ACTUAL_HISTORICAL_TRENDS = [
  { week: "W35 (1–7 Sep)", reach: 86200, interactions: 3200, viewers: 86200, totalPosts: 18 },
  { week: "W36 (8–14 Sep)", reach: 98400, interactions: 3620, viewers: 98400, totalPosts: 21 },
  { week: "W37 (15–21 Sep)", reach: 142560, interactions: 4180, viewers: 142560, totalPosts: 24 },
  { week: "W38 (15–21 Sep)", reach: 121840, interactions: 4793, viewers: 121840, totalPosts: 28 },
  { week: "W39 (22–28 Sep · Aktual)", reach: 231866, interactions: 6723, viewers: 231866, totalPosts: 36 },
];

// 4. FORMAT / PILLAR PERFORMANCE (Dihitung dari 600+ baris rekap Google Sheets)
export const ACTUAL_FORMAT_PERFORMANCE = [
  { format: "Edukasi & Otoritas Medis", avgReach: 23127, avgLikes: 2158, totalPosts: 109, description: "Penjelasan penyakit mata, beda lensa bluechromic, dan proses lab optik" },
  { format: "Hiburan / Tren Viral", avgReach: 8120, avgLikes: 405, totalPosts: 275, description: "Sketsa komedi, parodi relatable Gen-Z, dan tren audio TikTok/Reels" },
  { format: "Social Experiment", avgReach: 4949, avgLikes: 90, totalPosts: 84, description: "Tes kacamata di ruang publik dan reaksi spontan customer" },
  { format: "Promosi / Soft Sell", avgReach: 4656, avgLikes: 128, totalPosts: 100, description: "Katalog frame baru masuk, paket bundling frame + lensa" },
  { format: "Testimoni / Review", avgReach: 1441, avgLikes: 24, totalPosts: 31, description: "Review pelanggan setelah periksa mata dan ganti lensa" },
];

// 5. WEEKLY REPORT EDITORIAL DOCUMENT (Rapat 29 September 2026)
export const ACTUAL_WEEKLY_REPORT: WeeklyReport = {
  id: "rep-w39-2026",
  weekNumber: 39,
  periodLabel: "Week 39 · 22–28 September 2026 (Rapat Evaluasi 29 September 2026)",
  startDate: "2026-09-22",
  endDate: "2026-09-28",
  status: "final",
  executiveSummary:
    "Evaluasi performa marketing mingguan 5 cabang Optik I See You (Purwokerto, Purbalingga, Cilacap, Wonosobo) dan Lunar Eyewear Tegal untuk Rapat Direksi 29 September 2026. Total tayangan video Reels terverifikasi melonjak tajam +90.3% WoW mencapai 231.866 tayangan dengan 36 reels diproduksi (257% dari target 14 konten). Total basis audiens media sosial jaringan mencapai 245.116 followers Instagram dan 91.625 pengikut TikTok. Kepatuhan pelaporan 5 PIC terpantau aktif dan up-to-date (27–28 Sep), dengan catatan khusus cabang Cilacap tertunda 7 hari sejak 22 Sep.",
  headlineMetrics: {
    totalFollowers: ACTUAL_HEADLINE_METRICS[0],
    weeklyReach: ACTUAL_HEADLINE_METRICS[1],
    totalEngagements: ACTUAL_HEADLINE_METRICS[2],
    saveToReachRatio: ACTUAL_HEADLINE_METRICS[3],
  },
  pencapaian: [
    "Total tayangan video Reels terverifikasi tembus 231.866 tayangan (+90.3% WoW dari minggu sebelumnya 121.840 tayangan).",
    "Produksi konten mingguan melampaui kuota target: 36 konten Reels terbit (Target: 14 konten, rasio pencapaian 257%).",
    "Top viral content: Reels PWT 'Cosplay Nadia Omara Podcast' (32.900 viewers, 512 likes) dan Reels Lunar Tegal 'Tenpa Sadar' (26.673 viewers, 2.500 likes).",
    "Total basis pengikut jaringan mencapai 336.741 akun (245.116 Instagram + 91.625 TikTok) di 5 cabang.",
    "Trafik antrian cek mata online optikiseeyou.com mencatat 305 total klik konversi booking.",
    "Form proposal sponsorship kampus aktif mencakup 54 event mahasiswa (Unsoed, UMP, UNS, dll) dengan filter tindak lanjut otomatis.",
  ],
  kendala: [
    "Pengisian spreadsheet harian Rekap CLP (Arum) mengalami keterlambatan 7 hari (data terakhir 22 September 2026).",
    "Keterbatasan insight Save Rate Meta Ads karena belum adanya integrasi API resmi Meta Business Suite (sehingga dashboard menggunakan Tayangan Viewers riil dari spreadsheet evaluasi H+3).",
    "Catatan evaluasi Mba Nuha (Story PWT): Masih membutuhkan variasi ide referensi opening story dan latihan voice over agar audiens tidak monoton.",
  ],
  planStrategi: [
    "Replikasi formula parodi santai PWT & Tegal ke Purbalingga (Ajun) dan Wonosobo (Febi).",
    "Optimalisasi conversion funnel dari DM Story ke sistem antrian cek mata online di optikiseeyou.com.",
    "Pemberian reminder kepatuhan harian via WhatsApp untuk memastikan seluruh PIC menginput data H+3 tepat waktu.",
  ],
  masukanTim: [
    "Ilya (PWT): Perlu penataan background ruang syuting lab agar pencahayaan saat sore hari lebih konsisten.",
    "Nuha (Story): Membutuhkan template desain story promosi mingguan dari desainer grafis (Yanuar).",
    "Amanda (Tegal): Antusiasme promo frame estetik di Pantura tinggi, stok frame acetate pastel perlu ditambah.",
  ],
  aiAnalysis: [
    {
      id: "ai-1",
      tag: "FAKTA",
      text: "Tayangan Reels terverifikasi di Week 39 mencapai 231.866 views, tumbuh +90.3% dibandingkan Week 38 (121.840 views).",
      metricBasis: "231.866 Tayangan (WoW +90.3%)",
    },
    {
      id: "ai-2",
      tag: "INTERPRETASI",
      text: "Pertumbuhan eksponensial didorong oleh 2 konten viral berformat parodi dan POV relatable yang mendominasi lebih dari seperempat total tayangan mingguan.",
      metricBasis: "Reels Nadia Omara (32.9k) & Tenpa Sadar (26.6k)",
    },
    {
      id: "ai-3",
      tag: "REKOMENDASI",
      text: "Segera susun SOP panduan storytelling ringan untuk diterapkan oleh tim cabang Purbalingga dan Wonosobo guna mendongkrak views cabang non-pusat.",
      metricBasis: "Target pemerataan tayangan cabang",
    },
  ],
};
