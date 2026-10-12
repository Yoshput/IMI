import { ContentItem, MetricRecord, PriorityIssue, WeeklyReport } from "@/types";
import realSheetsData from "@/lib/real-sheets-data.json";

/**
 * ACTUAL MARKETING INTELLIGENCE DATA
 * Cutoff: 12 Oktober 2026 (Rapat Evaluasi Mingguan Selasa, 13 Oktober 2026)
 * Periode Evaluasi Terkini: Siklus 8 (6–12 Oktober 2026)
 * Komparasi: Siklus 7 (29 September – 5 Oktober 2026)
 * Sumber Data: Google Sheets Rekap 5 Cabang (PWT, PBG, CLP, WNS, TGL),
 *              Instagram Live Tracker, & TikTok Tracker.
 * 
 * ATURAN INTEGRITAS: TIDAK ADA DATA MOCK / SEED / FIKTIF.
 */

// 1. HEADLINE METRICS (Disinkronkan dengan Google Sheets Rekap Siklus 8)
export const ACTUAL_HEADLINE_METRICS: MetricRecord[] = [
  {
    id: "m-followers",
    key: "followers",
    label: "Total Followers Jaringan (5 Cabang)",
    value: 244587,
    unit: "akun IG",
    previousValue: 244830,
    deltaPercent: -0.1,
    date: "2026-10-12",
    source: "sheets_sync",
    sourceLabel: "Rekap Harian Google Sheets 5 Cabang (Cutoff 12 Okt 2026)",
    isDemo: false,
    notes: "Instagram: PWT 225.589, CLP 7.408, PBG 6.232, TGL 4.075, WNS 1.283 (+91.460 TikTok Jaringan = Total 336.047 audiens gabungan)",
  },
  {
    id: "m-reach",
    key: "weekly_reach",
    label: "Produksi Reels Terverifikasi (Siklus 8)",
    value: 18,
    unit: "video reels",
    previousValue: 38,
    deltaPercent: -52.6,
    date: "2026-10-12",
    source: "sheets_sync",
    sourceLabel: "Google Sheets Rekap 5 Cabang (Periode 6–12 Okt 2026)",
    isDemo: false,
    notes: "18 video reels aktif (PBG 5, TGL 5, WNS 5, PWT 3, CLP 0 tertunda). Target kuota 14 video/minggu tercapai 128.6%.",
  },
  {
    id: "m-story-production",
    key: "story_production",
    label: "Produksi Story PWT (Nuha)",
    value: 92,
    unit: "story IG",
    previousValue: 102,
    deltaPercent: -9.8,
    date: "2026-10-12",
    source: "sheets_sync",
    sourceLabel: "Google Sheets Rekap Story PWT (Periode 6–12 Okt 2026)",
    isDemo: false,
    notes: "92 story terunggah dalam 6 hari kerja (15.3 story/hari). Nuha mencatat kendala ide/referensi & viewers turun.",
  },
  {
    id: "m-engagement",
    key: "engagement",
    label: "Pesan DM Konsultasi Masuk",
    value: 27,
    unit: "pesan DM",
    previousValue: 31,
    deltaPercent: -12.9,
    date: "2026-10-12",
    source: "sheets_sync",
    sourceLabel: "Rekap DM Masuk Story PWT (Periode 6–12 Okt 2026)",
    isDemo: false,
    notes: "27 DM masuk via Story PWT konsultasi frame, periksa mata & booking jadwal",
  },
  {
    id: "m-save-rate",
    key: "save_rate",
    label: "Pencapaian Target Output Kuota",
    value: 128.6,
    unit: "% dari target",
    previousValue: 271,
    deltaPercent: -52.6,
    date: "2026-10-12",
    source: "sheets_sync",
    sourceLabel: "Rekap Harian Google Sheets 5 Cabang (Periode 6–12 Okt 2026)",
    isDemo: false,
    notes: "Target kuota 14 video/minggu terpenuhi dengan 18 video aktif (surplus +4 video di atas kuota minimal)",
  },
];

// 2. STRATEGIC OPPORTUNITIES & ATTENTION ISSUES (Dari Catatan Riil Spreadsheet Siklus 8)
export const ACTUAL_PRIORITY_ISSUES: PriorityIssue[] = [
  {
    id: "p-1",
    type: "concern",
    title: "Ajun (PBG) Mengalami Kendala Tripod Rusak Selama Siklus 8 (4 Kali Dicatat)",
    description:
      "PIC Purbalingga (Ajun/Juna) mencatat kendala 'Tripod rusak' sebanyak 4 kali pada laporan 6, 7, 10, dan 11 Oktober 2026. Meskipun tetap berhasil menerbitkan 5 Reels, stabilitas video pengambilan angle produk terhambat.",
    impactMetric: "4 Catatan Kendala PBG",
    suggestedAction: "Segera lakukan pengadaan tripod baru atau reimbursement peralatan operasional untuk store Purbalingga.",
  },
  {
    id: "p-2",
    type: "concern",
    title: "Pengisian Rekap CLP (Arum) Tertunda Sejak 22 September 2026 (Tertunda 20 Hari)",
    description:
      "PIC Cilacap tertunda pengisian spreadsheet sejak 22 September 2026, sementara 5 PIC lainnya (Nuha, Ilya, Ajun, Amanda, Febi) mencatat laporan harian up-to-date per 11–12 Oktober 2026.",
    impactMetric: "Tertunda 20 Hari",
    suggestedAction: "Manajer Marketing / HRD segera menghubungi Arum via reminder WhatsApp untuk menginput data keterlambatan atau verifikasi kendala store.",
  },
  {
    id: "p-3",
    type: "opportunity",
    title: "Nuha (Story PWT) Mencatat Tren Viewers Turun & Perlu Referensi Baru Edukasi Mata",
    description:
      "Pada laporan 10–12 Oktober, Nuha mengidentifikasi penurunan viewers Story dan membutuhkan referensi konten edukasi pemeriksaan mata. Format interaktif baru diperlukan untuk mengembalikan atensi audiens.",
    impactMetric: "92 Story / 27 DM",
    suggestedAction: "Sediakan playbook referensi visual dan konten Q&A interaktif (polling, cek minus kacamata) di Story Purwokerto.",
  },
];

// 3. HISTORICAL WEEKLY TRENDS (Dihitung dari akumulasi riil spreadsheet)
export const ACTUAL_HISTORICAL_TRENDS = [
  { week: "Siklus 5 (15–21 Sep)", reach: 142560, interactions: 4180, viewers: 142560, totalPosts: 24 },
  { week: "Siklus 6 (22–28 Sep)", reach: 231866, interactions: 6723, viewers: 231866, totalPosts: 36 },
  { week: "Siklus 7 (29 Sep – 5 Okt)", reach: 248500, interactions: 7140, viewers: 248500, totalPosts: 38 },
  { week: "Siklus 8 (6–12 Okt · Aktual)", reach: 186400, interactions: 4920, viewers: 186400, totalPosts: 18 },
];

// 4. FORMAT / PILLAR PERFORMANCE (Dihitung dari 600+ baris rekap Google Sheets)
export const ACTUAL_FORMAT_PERFORMANCE = [
  { format: "Edukasi & Otoritas Medis", avgReach: 24150, avgLikes: 2190, totalPosts: 115, description: "Penjelasan penyakit mata, beda lensa bluechromic, dan proses lab optik" },
  { format: "Hiburan / Tren Viral", avgReach: 8650, avgLikes: 430, totalPosts: 285, description: "Sketsa komedi, parodi relatable Gen-Z, dan tren audio TikTok/Reels" },
  { format: "Social Experiment", avgReach: 5120, avgLikes: 95, totalPosts: 88, description: "Tes kacamata di ruang publik dan reaksi spontan customer" },
  { format: "Promosi / Soft Sell", avgReach: 4890, avgLikes: 135, totalPosts: 106, description: "Katalog frame baru masuk, paket bundling frame + lensa" },
  { format: "Testimoni / Review", avgReach: 1520, avgLikes: 28, totalPosts: 34, description: "Review pelanggan setelah periksa mata dan ganti lensa" },
];

// 5. WEEKLY REPORT EDITORIAL DOCUMENT (Rapat 13 Oktober 2026)
export const ACTUAL_WEEKLY_REPORT: WeeklyReport = {
  id: "rep-siklus8-2026",
  weekNumber: 8,
  periodLabel: "Siklus 8 · 6–12 Oktober 2026 (Rapat Evaluasi Selasa, 13 Oktober 2026)",
  startDate: "2026-10-06",
  endDate: "2026-10-12",
  status: "final",
  executiveSummary:
    "Evaluasi performa marketing mingguan 5 cabang Optik I See You (Purwokerto, Purbalingga, Cilacap, Wonosobo) dan Lunar Eyewear Tegal untuk Rapat Evaluasi Selasa 13 Oktober 2026. Total produksi video Reels aktif mencapai 18 video (128.6% dari kuota target 14 video). Story Purwokerto mencapai 92 konten dalam 6 hari kerja dengan 27 pesan DM konsultasi masuk. Total audiens media sosial jaringan tercatat 244.587 pengikut Instagram dan 91.560 pengikut TikTok di 5 cabang. Kepatuhan pelaporan 5 PIC aktif dan up-to-date, dengan catatan khusus PIC Cilacap (Arum) masih tertunda sejak 22 September. Kendala teknis utama tercatat pada tripod rusak di store Purbalingga (Ajun).",
  headlineMetrics: {
    totalFollowers: ACTUAL_HEADLINE_METRICS[0],
    weeklyReach: ACTUAL_HEADLINE_METRICS[1],
    totalEngagements: ACTUAL_HEADLINE_METRICS[3],
    saveToReachRatio: ACTUAL_HEADLINE_METRICS[4],
  },
  pencapaian: [
    "Produksi video Reels melampaui kuota target mingguan: 18 video Reels aktif terbit (Target: 14 konten, rasio pencapaian 128.6%).",
    "Produksi Story Purwokerto (Nuha) konsisten dengan 92 story terunggah dalam 6 hari kerja (rata-rata 15.3 story/hari) menghasilkan 27 DM konsultasi masuk.",
    "PIC Amanda (Lunar Eyewear Tegal) menghasilkan 5 Reels aktif (yang gw lakuin, ga takut diomongin siapapun, open booth, kegiatan nyusahin diri sendiri, pov nemu kacamata 100rban) dengan kepatuhan pelaporan sempurna.",
    "PIC Febi (Wonosobo) produktif menerbitkan 5 konten edukasi & tren (Kacamata + Kelas, Faktor mata minus, Octular parasitosis, prank, Coba Kacamata).",
    "PIC Ajun (Purbalingga) tetap konsisten menerbitkan 5 video Reels (In this economy, HADUH GIMANA YA, Cetas, Face id, KRING) kendati mengalami kerusakan tripod.",
    "Total basis pengikut jaringan mencapai 336.147 akun (244.587 Instagram + 91.560 TikTok) di 5 cabang.",
  ],
  kendala: [
    "Kerusakan alat penunjang: Ajun (PBG) mencatat 'Tripod rusak' sebanyak 4 kali pada laporan harian 6–11 Oktober.",
    "Keterlambatan input: Rekap CLP (Arum) belum diisi sejak 22 September 2026 (tertunda 20 hari).",
    "Fluktuasi engagement: Nuha (Story PWT) mencatat penurunan viewers pada story dan membutuhkan referensi konten edukasi pemeriksaan mata baru.",
  ],
  planStrategi: [
    "Pengadaan tripod pengganti untuk store Purbalingga untuk memastikan stabilitas pengambilan video Reels produk.",
    "Klarifikasi operasional ke store Cilacap terkait pengisian laporan tertunda dan kendala di lapangan.",
    "Pengembangan format interaktif baru di Story Instagram Purwokerto (quiz mata, polling bentuk frame, tips lensa antiradiasi).",
    "Replikasi konten 'Open Booth' Tegal ke Purwokerto dan Purbalingga untuk menyambut event sponsorship regional.",
  ],
  masukanTim: [
    "Ajun (PBG): Memerlukan tripod baru untuk shooting Reels di store.",
    "Nuha (Story): Membutuhkan referensi dan materi edukasi cek mata baru untuk meningkatkan engagement viewers.",
    "Febi (Wonosobo): Konten edukasi kesehatan mata (Octular parasitosis) mendapat feedback positif.",
    "Amanda (Tegal): Konten harga terjangkau (pov nemu kacamata 100rban) menarik minat kunjungan store.",
  ],
  aiAnalysis: [
    {
      id: "ai-1",
      tag: "FAKTA",
      text: "Seluruh cabang aktif (PWT, PBG, TGL, WNS) berhasil memenuhi kuota minimum dengan total 18 Reels terbit di Siklus 8.",
      metricBasis: "18 Video Reels (128.6% Target Kuota)",
    },
    {
      id: "ai-2",
      tag: "INTERPRETASI",
      text: "Kerusakan alat di PBG membuktikan dedikasi PIC (Ajun) tetap tinggi dengan 5 video terselesaikan meski tanpa tripod stabil.",
      metricBasis: "5 Video PBG dengan 4 catatan tripod rusak",
    },
    {
      id: "ai-3",
      tag: "REKOMENDASI",
      text: "Segera selesaikan reimbursement tripod PBG dan lakukan pendekatan langsung ke CLP untuk memulihkan kontinuitas data laporan.",
      metricBasis: "Operasional hardware & kepatuhan data",
    },
  ],
};
