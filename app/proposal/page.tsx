"use client";

import React, { useState } from "react";
import {
  FileText,
  Printer,
  ShieldCheck,
  Building2,
  Calendar,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Layers,
  Database,
  Lock,
  ExternalLink,
  DollarSign,
  Copy,
  Check,
  Award,
  Users,
  Eye,
  BarChart3,
  MessageSquare,
  HelpCircle,
} from "lucide-react";

export default function ProposalPage() {
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [selectedTier, setSelectedTier] = useState<"option1" | "option2" | "option3">("option2");

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleCopySummary = () => {
    const text = `PROPOSAL PENAWARAN: I SEE YOU MARKETING INTELLIGENCE
Internal Marketing Intelligence & Business Monitoring System
Disusun untuk: Manajemen & Direksi Optik I See You (PT Indah Sinergi Yuwana)
Penyusun: Yossika Putra Erlangga (Divisi Marketing)
Status: Draft for Discussion v1.0 (Oktober 2026)

PILIHAN SKEMA PENAWARAN:
1. Opsi 1 (Internal Continuation): Rp10.000.000 - Rp12.000.000
2. Opsi 2 (Full Ownership & Transfer - Rekomendasi): Rp20.000.000
3. Opsi 3 (Full Transfer + 12 Bulan Maintenance): Rp25.000.000

Akses Dokumen Lengkap: /proposal`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="proposal-container space-y-8 max-w-5xl mx-auto pb-16">
      <style jsx global>{`
        @media print {
          nav, footer, .no-print {
            display: none !important;
          }
          main {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          body {
            background: white !important;
            color: black !important;
            font-size: 11pt !important;
          }
          .proposal-container {
            max-width: 100% !important;
            padding: 0 !important;
          }
          .page-break {
            page-break-before: always;
            break-before: page;
          }
          .card-print {
            border: 1px solid #e2e8f0 !important;
            box-shadow: none !important;
            page-break-inside: avoid;
          }
        }
      `}</style>

      {/* Top Action Bar (Hides in Print) */}
      <div className="no-print bg-surface border border-border rounded-container p-4 flex flex-wrap items-center justify-between gap-4 shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-control bg-brand-light flex items-center justify-center text-brand">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand text-white">
                Dokumen Resmi Internal
              </span>
              <span className="text-xs text-foreground-secondary font-medium">
                Draft for Discussion · v1.0
              </span>
            </div>
            <h1 className="text-sm font-bold text-foreground mt-0.5">
              Proposal Penawaran & Keberlanjutan Sistem I See You Marketing Intelligence
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-control text-xs font-semibold border border-border bg-surface hover:bg-surface-secondary text-foreground transition-all shadow-subtle"
          >
            {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSummary ? "Tersalin!" : "Salin Ringkasan"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-control text-xs font-semibold bg-brand text-white hover:bg-brand/90 transition-all shadow-subtle"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Download / Print Proposal (PDF)</span>
          </button>
        </div>
      </div>

      {/* Document Header Card */}
      <div className="bg-surface border border-border rounded-container p-6 sm:p-8 shadow-subtle card-print space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-wider font-bold text-brand">
              PROPOSAL PENAWARAN PENGEMBANGAN & KEBERLANJUTAN
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              I SEE YOU MARKETING INTELLIGENCE
            </h1>
            <p className="text-sm text-foreground-secondary">
              Internal Marketing Intelligence & Business Monitoring System
            </p>
          </div>

          <div className="text-right space-y-1 text-xs shrink-0 bg-surface-secondary p-3 rounded-control border border-border">
            <div className="text-foreground-muted uppercase text-[10px] font-semibold">Tujuan Dokumen</div>
            <div className="font-bold text-foreground">Manajemen & Direksi Optik I See You</div>
            <div className="text-foreground-secondary">PT Indah Sinergi Yuwana</div>
            <div className="pt-1 text-[11px] text-foreground-muted">
              Oktober 2026 · Status: <strong>Draft for Discussion</strong>
            </div>
          </div>
        </div>

        {/* Executive Principles Callout */}
        <div className="bg-surface-secondary/70 border border-border/80 rounded-control p-4 text-xs space-y-2 text-foreground-secondary">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <ShieldCheck className="w-4 h-4 text-brand" />
            <span>Pernyataan Prinsip & Format Dokumen</span>
          </div>
          <p>
            Dokumen ini merupakan proposal penawaran resmi dan bahan diskusi terstruktur mengenai kelanjutan aset digital yang telah dibangun secara mandiri.
            Dokumen ini <strong>bukan merupakan invoice atau surat penagihan</strong>, dan tidak mengandung unsur paksaan dalam bentuk apa pun terhadap manajemen perusahaan.
            Proposal ini disusun dengan tujuan menyajikan ruang lingkup teknis, nilai investasi, dan opsi keberlanjutan sistem secara transparan dan profesional.
          </p>
        </div>

        {/* Author & Scope Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
          <div>
            <span className="text-foreground-muted block text-[10px] uppercase font-medium">Penyusun Sistem</span>
            <span className="font-bold text-foreground">Yossika Putra Erlangga</span>
            <span className="text-foreground-secondary block text-[11px]">Divisi Marketing</span>
          </div>
          <div>
            <span className="text-foreground-muted block text-[10px] uppercase font-medium">Cakupan Jaringan</span>
            <span className="font-bold text-foreground">5 Cabang Aktif</span>
            <span className="text-foreground-secondary block text-[11px]">4 ISY + 1 Lunar Tegal</span>
          </div>
          <div>
            <span className="text-foreground-muted block text-[10px] uppercase font-medium">Status Arsitektur</span>
            <span className="font-bold text-emerald-800">10 Modul Beroperasi</span>
            <span className="text-foreground-secondary block text-[11px]">Next.js 14 + Vercel Edge</span>
          </div>
          <div>
            <span className="text-foreground-muted block text-[10px] uppercase font-medium">Versi Dokumen</span>
            <span className="font-bold text-foreground">v1.0 (Diskusi Terbuka)</span>
            <span className="text-foreground-secondary block text-[11px]">5 Oktober 2026</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: NARASI PEMBUKA & LATAR BELAKANG */}
      <div className="bg-surface border border-border rounded-container p-6 sm:p-8 shadow-subtle card-print space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand block">Bagian 1</span>
          <h2 className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
            Narasi Pembuka & Latar Belakang Pengembangan
          </h2>
        </div>

        <div className="text-xs sm:text-sm text-foreground-secondary leading-relaxed space-y-3">
          <p>
            I See You Marketing Intelligence merupakan sistem internal yang dikembangkan sebagai inisiatif mandiri untuk membantu proses pemasaran Optik I See You menjadi lebih terstruktur, terintegrasi, dan mudah dipantau.
          </p>
          <p>
            Sistem ini pada awalnya dikembangkan untuk membantu kebutuhan operasional pemasaran sehari-hari di lapangan: memudahkan pencatatan, memangkas proses rekap manual yang berulang, dan menyatukan pemantauan performa konten di seluruh cabang. Dalam proses perjalanannya, kebutuhan tersebut berkembang menjadi platform terpadu yang mencakup 10 modul utama: dashboard monitoring, integrasi data Google Sheets, content performance, pengelolaan KOL, competitor intelligence, aftersales CRM kacamata, analitik tren, pelaporan eksekutif, serta pemantauan keuangan pemasaran.
          </p>
          <p>
            Proposal ini disusun untuk memberikan gambaran objektif mengenai ruang lingkup sistem, nilai pengembangan teknis yang telah terealisasi, serta opsi keberlanjutan penggunaan apabila sistem ini akan terus dimanfaatkan oleh Optik I See You dalam jangka panjang sebagai aset digital resmi perusahaan.
          </p>
        </div>

        {/* 6 Core Objectives Cards */}
        <div className="pt-2">
          <h3 className="text-xs font-bold uppercase text-foreground mb-3 tracking-wider">
            6 Pilar Sasaran Pengembangan Sistem
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-control bg-surface-secondary border border-border text-xs space-y-1">
              <span className="font-bold text-foreground block">1. Centralized Data</span>
              <p className="text-foreground-secondary text-[11px]">
                Memusatkan seluruh data pemasaran, metrik media sosial, dan log PIC dalam satu pintu sistem.
              </p>
            </div>
            <div className="p-3.5 rounded-control bg-surface-secondary border border-border text-xs space-y-1">
              <span className="font-bold text-foreground block">2. Operational Efficiency</span>
              <p className="text-foreground-secondary text-[11px]">
                Mengurangi hingga 80% waktu yang sebelumnya dihabiskan untuk rekapitulasi data manual.
              </p>
            </div>
            <div className="p-3.5 rounded-control bg-surface-secondary border border-border text-xs space-y-1">
              <span className="font-bold text-foreground block">3. Performance Visibility</span>
              <p className="text-foreground-secondary text-[11px]">
                Memberikan visibilitas terbuka terhadap performa video harian, respons story, dan kepatuhan staf.
              </p>
            </div>
            <div className="p-3.5 rounded-control bg-surface-secondary border border-border text-xs space-y-1">
              <span className="font-bold text-foreground block">4. Data-Driven Decisions</span>
              <p className="text-foreground-secondary text-[11px]">
                Mendukung pengambilan keputusan berbasis data nyata untuk strategi konten dan alokasi promosi.
              </p>
            </div>
            <div className="p-3.5 rounded-control bg-surface-secondary border border-border text-xs space-y-1">
              <span className="font-bold text-foreground block">5. Standardization</span>
              <p className="text-foreground-secondary text-[11px]">
                Membangun standar kerja digital yang rapi dan konsisten bagi tim marketing di seluruh cabang.
              </p>
            </div>
            <div className="p-3.5 rounded-control bg-surface-secondary border border-border text-xs space-y-1">
              <span className="font-bold text-foreground block">6. Continuity & Asset</span>
              <p className="text-foreground-secondary text-[11px]">
                Menjamin keberlanjutan alur kerja tanpa ketergantungan individu dan menjadi aset digital optik.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: BEFORE VS AFTER WORKFLOW COMPARISON */}
      <div className="bg-surface border border-border rounded-container p-6 sm:p-8 shadow-subtle card-print space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand block">Bagian 2</span>
          <h2 className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
            Perbandingan Alur Kerja: Sebelum vs Sesudah Sistem Diterapkan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-control bg-surface-secondary/70 border border-border space-y-3">
            <span className="text-xs font-bold uppercase text-foreground-muted tracking-wider block">
              Sebelum Sistem Dikembangkan
            </span>
            <ul className="space-y-2 text-xs text-foreground-secondary">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground-muted mt-1.5 shrink-0" />
                <span>Data tersebar di 6 spreadsheet terpisah dan catatan pribadi masing-masing PIC.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground-muted mt-1.5 shrink-0" />
                <span>Persiapan rapat evaluasi hari Selasa membutuhkan waktu 4 hingga 6 jam rekap manual.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground-muted mt-1.5 shrink-0" />
                <span>Sering terjadi entri ganda saat evaluasi H+1 dan H+3 sehingga metrik terdistorsi.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground-muted mt-1.5 shrink-0" />
                <span>Follow-up adaptasi kacamata customer bergantung pada inisiatif pribadi staf toko.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground-muted mt-1.5 shrink-0" />
                <span>Riset harga lensa kompetitor dan kontak rate card KOL tersimpan sporadis di chat.</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-control bg-brand-light/30 border border-brand/20 space-y-3">
            <span className="text-xs font-bold uppercase text-brand tracking-wider block">
              Sesudah Sistem Diterapkan
            </span>
            <ul className="space-y-2 text-xs text-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand mt-0.5 shrink-0" />
                <span>1 pintu dashboard terpusat yang menyinkronkan seluruh data cabang secara otomatis.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand mt-0.5 shrink-0" />
                <span>1 klik untuk membuat ringkasan rapat WhatsApp siap saji dan mode presentasi rapat.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand mt-0.5 shrink-0" />
                <span>Deduplikasi cerdas otomatis menyatukan entri ganda dan mengambil metrik penonton tertinggi.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand mt-0.5 shrink-0" />
                <span>Jadwal follow-up H+3 dan H+7 terdata rapi dengan template pesan WhatsApp siap kirim.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand mt-0.5 shrink-0" />
                <span>Basis data KOL dan radar kompetitor terdokumentasi terpusat sebagai aset perusahaan.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* SECTION 4: 10 MODULES INVENTORY AUDIT */}
      <div className="bg-surface border border-border rounded-container p-6 sm:p-8 shadow-subtle card-print space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand block">Bagian 3</span>
          <h2 className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
            Inventarisasi 10 Modul Fungsional yang Telah Beroperasi
          </h2>
          <p className="text-xs text-foreground-secondary mt-1">
            Seluruh modul di bawah ini telah teruji dalam alur kerja operasional nyata 5 cabang Optik I See You.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* M1 */}
          <div className="p-4 rounded-control bg-surface-secondary border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Modul 1: Dashboard Monitoring (`/`)</span>
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-surface border border-border text-foreground-secondary">
                Executive Overview
              </span>
            </div>
            <p className="text-foreground-secondary text-[11px]">
              Menampilkan total followers jaringan 5 cabang, rangkuman video viral teratas, metrik tayangan harian, dan ringkasan aktivitas marketing.
            </p>
          </div>

          {/* M2 */}
          <div className="p-4 rounded-control bg-surface-secondary border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Modul 2: Spreadsheet Hub & Rapat (`/spreadsheet`)</span>
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-brand-light text-brand">
                Inti Operasional
              </span>
            </div>
            <p className="text-foreground-secondary text-[11px]">
              Sinkronisasi Google Sheets dua arah, pelacak kepatuhan 6 PIC, rekap evaluasi 3 hari & rapat Selasa, deduplikasi video, dan rolling 7 hari realtime.
            </p>
          </div>

          {/* M3 */}
          <div className="p-4 rounded-control bg-surface-secondary border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Modul 3: Content Intelligence (`/content`)</span>
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-surface border border-border text-foreground-secondary">
                Kinerja Konten
              </span>
            </div>
            <p className="text-foreground-secondary text-[11px]">
              Basis data konten Reels, Feeds, dan Stories dengan peringkat reach, likes, komentar, saves, filter pilar konten, serta preview bergaya Apple iOS.
            </p>
          </div>

          {/* M4 */}
          <div className="p-4 rounded-control bg-surface-secondary border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Modul 4: Pengajuan & Partnership (`/pengajuan`)</span>
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-surface border border-border text-foreground-secondary">
                Kemitraan
              </span>
            </div>
            <p className="text-foreground-secondary text-[11px]">
              Formulir pengajuan alat kerja marketing, proposal kemitraan kelas konten optik, tiering sponsorship, dan template pitching WhatsApp resmi.
            </p>
          </div>

          {/* M5 */}
          <div className="p-4 rounded-control bg-surface-secondary border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Modul 5: Aftersales CRM (`/aftersales`)</span>
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-surface border border-border text-foreground-secondary">
                Retensi Pelanggan
              </span>
            </div>
            <p className="text-foreground-secondary text-[11px]">
              Database customer kacamata terintegrasi, rekam resep optik (minus/silinder/frame), jadwal follow-up H+3 dan H+7, serta generator WhatsApp ramah.
            </p>
          </div>

          {/* M6 */}
          <div className="p-4 rounded-control bg-surface-secondary border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Modul 6: Competitor Radar (`/competitor`)</span>
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-surface border border-border text-foreground-secondary">
                Intelijen Pasar
              </span>
            </div>
            <p className="text-foreground-secondary text-[11px]">
              Database kompetitor optik regional, pemantauan taktik harga paket kacamata, analisis materi promosi kompetitor, dan rekomendasi taktis.
            </p>
          </div>

          {/* M7 */}
          <div className="p-4 rounded-control bg-surface-secondary border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Modul 7: KOL & Influencer (`/kol`)</span>
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-surface border border-border text-foreground-secondary">
                Kreator Hub
              </span>
            </div>
            <p className="text-foreground-secondary text-[11px]">
              Manajemen profil KOL, perkiraan engagement rate, histori rate card, pencatatan deliverables (raw footage, ads whitelist), dan kontak langsung.
            </p>
          </div>

          {/* M8 */}
          <div className="p-4 rounded-control bg-surface-secondary border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Modul 8: Analytics & Trends (`/analytics`)</span>
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-surface border border-border text-foreground-secondary">
                Deep Dive Data
              </span>
            </div>
            <p className="text-foreground-secondary text-[11px]">
              Evaluasi konten overperformer vs underperformer, distribusi pilar konten, pemantau kata kunci pencarian periksa mata, dan audit trail data.
            </p>
          </div>

          {/* M9 */}
          <div className="p-4 rounded-control bg-surface-secondary border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Modul 9: Laporan Eksekutif (`/laporan`)</span>
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20">
                Akses Terproteksi
              </span>
            </div>
            <p className="text-foreground-secondary text-[11px]">
              Penyusunan laporan berkala mingguan dan bulanan konsolidasi 5 cabang khusus pimpinan, diamankan dengan proteksi kata sandi.
            </p>
          </div>

          {/* M10 */}
          <div className="p-4 rounded-control bg-surface-secondary border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Modul 10: Finance Marketing (`/keuangan`)</span>
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20">
                Akses Terproteksi
              </span>
            </div>
            <p className="text-foreground-secondary text-[11px]">
              Monitoring kas kecil konten cabang, alokasi promosi KOL, dan pelacakan bonus performa Reels viral H+3 (alat bantu internal, bukan software akuntansi).
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 5: SECURITY, TECH STACK & DEPLOYMENT */}
      <div className="bg-surface border border-border rounded-container p-6 sm:p-8 shadow-subtle card-print space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand block">Bagian 4</span>
          <h2 className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
            Keamanan Akses, Landasan Teknologi & Infrastruktur Cloud
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-control bg-surface-secondary border border-border space-y-2">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <Lock className="w-4 h-4 text-brand" />
              <span>Access Control & Security</span>
            </div>
            <p className="text-foreground-secondary text-[11px]">
              Modul Laporan dan Finansial dilengkapi sistem autentikasi kata sandi. Kredensial API Google Sheets dan konfigurasi sistem diisolasi di level server, tidak tertanam di client code.
            </p>
          </div>

          <div className="p-4 rounded-control bg-surface-secondary border border-border space-y-2">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <Layers className="w-4 h-4 text-brand" />
              <span>Technology Stack</span>
            </div>
            <p className="text-foreground-secondary text-[11px]">
              Dibangun dengan Next.js 14+ (App Router), React 18, TypeScript strict mode, Tailwind CSS dengan light/dark semantic tokens, SheetJS XLSX engine, dan Lucide Icons.
            </p>
          </div>

          <div className="p-4 rounded-control bg-surface-secondary border border-border space-y-2">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <Database className="w-4 h-4 text-brand" />
              <span>Cloud Infrastructure</span>
            </div>
            <p className="text-foreground-secondary text-[11px]">
              Berjalan pada Vercel Global Edge Network dengan Continuous Deployment (CI/CD) terhubung ke Git repository. Uptime tinggi, pemuatan instan tanpa perlu server fisik lokal.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 6: ESTIMATION OF DEVELOPMENT VALUE */}
      <div className="bg-surface border border-border rounded-container p-6 sm:p-8 shadow-subtle card-print space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand block">Bagian 5</span>
          <h2 className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
            Estimasi Nilai Pengembangan Perangkat Lunak (Development Value)
          </h2>
          <p className="text-xs text-foreground-secondary mt-1">
            Dalam rekayasa perangkat lunak, nilai sistem dihitung dari kompleksitas arsitektur, integrasi, dan waktu pengembangan yang telah terealisasi, bukan tarif sewa server.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse border border-border">
            <thead>
              <tr className="bg-surface-secondary text-foreground font-semibold">
                <th className="p-3 border border-border">Komponen Pengembangan Teknis</th>
                <th className="p-3 border border-border">Ruang Lingkup Pekerjaan</th>
                <th className="p-3 border border-border text-right">Estimasi Nilai Wajar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground-secondary">
              <tr>
                <td className="p-3 border border-border font-medium text-foreground">Analisis Kebutuhan & Desain Alur</td>
                <td className="p-3 border border-border">Pemetaan alur kerja 5 cabang, pilar konten optik, cadence rapat 3 hari & rapat Selasa.</td>
                <td className="p-3 border border-border text-right font-semibold text-foreground">Rp3.000.000</td>
              </tr>
              <tr>
                <td className="p-3 border border-border font-medium text-foreground">Frontend UI/UX & Responsive Multi-Device</td>
                <td className="p-3 border border-border">10 modul antarmuka responsif, semantic light/dark theme, Apple iOS preview sheets.</td>
                <td className="p-3 border border-border text-right font-semibold text-foreground">Rp7.000.000</td>
              </tr>
              <tr>
                <td className="p-3 border border-border font-medium text-foreground">Mesin Integrasi Data & Google Sheets API</td>
                <td className="p-3 border border-border">Pipeline sinkronisasi dua arah, parsing metrik, deduplikasi cerdas, kalkulator Social Blade.</td>
                <td className="p-3 border border-border text-right font-semibold text-foreground">Rp5.000.000</td>
              </tr>
              <tr>
                <td className="p-3 border border-border font-medium text-foreground">Aftersales CRM & Follow-up Engine</td>
                <td className="p-3 border border-border">Basis data refraksi kacamata (minus/silinder), jadwal H+3/H+7, template pesan WhatsApp.</td>
                <td className="p-3 border border-border text-right font-semibold text-foreground">Rp3.000.000</td>
              </tr>
              <tr>
                <td className="p-3 border border-border font-medium text-foreground">Intelijen Konten & Radar Pasar</td>
                <td className="p-3 border border-border">Database konten terindeks, kalkulator peringkat, radar kompetitor, database manajemen KOL.</td>
                <td className="p-3 border border-border text-right font-semibold text-foreground">Rp4.000.000</td>
              </tr>
              <tr>
                <td className="p-3 border border-border font-medium text-foreground">Keamanan Akses & Cloud CI/CD Deployment</td>
                <td className="p-3 border border-border">Penerapan gate authentication modul sensitif, setup pipeline Vercel Edge Serverless.</td>
                <td className="p-3 border border-border text-right font-semibold text-foreground">Rp2.000.000</td>
              </tr>
              <tr>
                <td className="p-3 border border-border font-medium text-foreground">Quality Testing, PDF Print Mode & Dokumentasi</td>
                <td className="p-3 border border-border">Audit kode TypeScript, layout print PDF formal, dan dokumentasi operasional sistem.</td>
                <td className="p-3 border border-border text-right font-semibold text-foreground">Rp2.000.000</td>
              </tr>
              <tr className="bg-surface-secondary/80 font-bold text-foreground">
                <td className="p-3 border border-border" colSpan={2}>
                  TOTAL ESTIMASI NILAI PENGEMBANGAN SISTEM (10 MODUL)
                </td>
                <td className="p-3 border border-border text-right text-brand text-sm">
                  Rp26.000.000
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 7: 3 COMMERCIAL PROPOSAL OPTIONS */}
      <div className="bg-surface border border-border rounded-container p-6 sm:p-8 shadow-subtle card-print space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand block">Bagian 6</span>
          <h2 className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
            Opsi Skema Komersial & Penawaran Keberlanjutan
          </h2>
          <p className="text-xs text-foreground-secondary mt-1">
            Tiga pilihan skema penawaran yang terstruktur secara adil, realistis, dan saling menguntungkan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* OPTION 1 */}
          <div
            onClick={() => setSelectedTier("option1")}
            className={`p-5 rounded-control border transition-all cursor-pointer relative space-y-3 ${
              selectedTier === "option1"
                ? "bg-surface border-brand shadow-subtle ring-2 ring-brand/20"
                : "bg-surface-secondary/50 border-border hover:border-brand/40"
            }`}
          >
            <div>
              <span className="text-[10px] uppercase font-bold text-foreground-muted block">OPSI 1</span>
              <h3 className="text-sm font-bold text-foreground mt-0.5">Internal Continuation</h3>
              <p className="text-[11px] text-foreground-secondary">Kelanjutan Penggunaan Internal</p>
            </div>

            <div className="py-2 border-y border-border">
              <span className="text-lg font-extrabold text-foreground block">
                Rp10.000.000 – Rp12.000.000
              </span>
              <span className="text-[10px] text-foreground-muted">Kompensasi inisiatif internal satu kali</span>
            </div>

            <ul className="text-xs space-y-2 text-foreground-secondary">
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-brand mt-0.5 shrink-0" />
                <span>Hak pakai penuh sistem untuk seluruh 5 cabang Optik I See You.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-brand mt-0.5 shrink-0" />
                <span>Sistem tetap beroperasi pada infrastruktur yang dikelola inisiator.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-brand mt-0.5 shrink-0" />
                <span>Penyesuaian operasional dasar selama 3 bulan pertama.</span>
              </li>
            </ul>
          </div>

          {/* OPTION 2 (RECOMMENDED) */}
          <div
            onClick={() => setSelectedTier("option2")}
            className={`p-5 rounded-control border transition-all cursor-pointer relative space-y-3 ${
              selectedTier === "option2"
                ? "bg-surface border-brand shadow-subtle ring-2 ring-brand/20"
                : "bg-surface-secondary/50 border-border hover:border-brand/40"
            }`}
          >
            <div className="absolute -top-2.5 right-4 bg-brand text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
              Rekomendasi Utama
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-brand block">OPSI 2 (DIREKOMENDASIKAN)</span>
              <h3 className="text-sm font-bold text-foreground mt-0.5">Full Development & Transfer</h3>
              <p className="text-[11px] text-foreground-secondary">Pengalihan Kepemilikan Penuh & Source Code</p>
            </div>

            <div className="py-2 border-y border-border">
              <span className="text-lg font-extrabold text-brand block">
                Rp20.000.000
              </span>
              <span className="text-[10px] text-foreground-muted">Kompensasi buyout & transfer kepemilikan</span>
            </div>

            <ul className="text-xs space-y-2 text-foreground">
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-brand mt-0.5 shrink-0" />
                <span><strong>Kepemilikan 100%:</strong> Menjadi aset resmi PT Indah Sinergi Yuwana.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-brand mt-0.5 shrink-0" />
                <span><strong>Source Code Lengkap:</strong> Penyerahan seluruh Git repository tanpa enkripsi.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-brand mt-0.5 shrink-0" />
                <span>Migrasi akun Vercel & GitHub ke akun resmi perusahaan.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-brand mt-0.5 shrink-0" />
                <span>Sesi pelatihan teknis bagi staf internal yang ditunjuk.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-brand mt-0.5 shrink-0" />
                <span>Bebas biaya perbaikan bug dan penyesuaian dasar selama 6 bulan.</span>
              </li>
            </ul>
          </div>

          {/* OPTION 3 */}
          <div
            onClick={() => setSelectedTier("option3")}
            className={`p-5 rounded-control border transition-all cursor-pointer relative space-y-3 ${
              selectedTier === "option3"
                ? "bg-surface border-brand shadow-subtle ring-2 ring-brand/20"
                : "bg-surface-secondary/50 border-border hover:border-brand/40"
            }`}
          >
            <div>
              <span className="text-[10px] uppercase font-bold text-foreground-muted block">OPSI 3</span>
              <h3 className="text-sm font-bold text-foreground mt-0.5">Full Transfer + Maintenance</h3>
              <p className="text-[11px] text-foreground-secondary">Kepemilikan Penuh + 12 Bulan Pemeliharaan</p>
            </div>

            <div className="py-2 border-y border-border">
              <span className="text-lg font-extrabold text-foreground block">
                Rp25.000.000
              </span>
              <span className="text-[10px] text-foreground-muted">Paket transfer aset + maintenance tahunan</span>
            </div>

            <ul className="text-xs space-y-2 text-foreground-secondary">
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-brand mt-0.5 shrink-0" />
                <span>Seluruh manfaat dan penyerahan aset pada Opsi 2.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-brand mt-0.5 shrink-0" />
                <span>Dedicated maintenance & feature update selama 12 bulan penuh.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-brand mt-0.5 shrink-0" />
                <span>Pembaruan dependensi, penyesuaian sheet, dan backup berkala.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-brand mt-0.5 shrink-0" />
                <span>Penanganan prioritas untuk kendala teknis dan penambahan fitur minor.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="p-3.5 rounded-control bg-surface-secondary text-xs text-foreground-secondary border border-border">
          <p className="italic">
            *Catatan: Nilai komersial dan ruang lingkup akhir bersifat fleksibel serta terbuka untuk didiskusikan secara musyawarah mufakat dan dituangkan ke dalam kesepakatan tertulis resmi.
          </p>
        </div>
      </div>

      {/* SECTION 8: MAINTENANCE SCOPE (INCLUDED VS EXCLUDED) */}
      <div className="bg-surface border border-border rounded-container p-6 sm:p-8 shadow-subtle card-print space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand block">Bagian 7</span>
          <h2 className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
            Batasan Ruang Lingkup Pemeliharaan (Maintenance Scope)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-control bg-surface-secondary border border-border space-y-2">
            <span className="font-bold text-foreground block">Layanan Termasuk (INCLUDED):</span>
            <ul className="space-y-1.5 text-foreground-secondary">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand mt-0.5 shrink-0" />
                <span>Perbaikan kesalahan sistem (bug fixing) pada 10 modul existing.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand mt-0.5 shrink-0" />
                <span>Penyesuaian pemetaan Google Sheets jika format kolom diubah PIC.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand mt-0.5 shrink-0" />
                <span>Pembaruan dependensi keamanan kode (security patch & npm updates).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand mt-0.5 shrink-0" />
                <span>Optimasi kecepatan muat dan konsultasi teknis via WhatsApp pada jam kerja.</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-control bg-surface-secondary border border-border space-y-2">
            <span className="font-bold text-foreground-muted block">Layanan di Luar Standar (EXCLUDED):</span>
            <ul className="space-y-1.5 text-foreground-secondary">
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground-muted mt-1.5 shrink-0" />
                <span>Pembuatan sistem besar baru di luar marketing (misal: POS kasir toko atau ERP inventori fisik).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground-muted mt-1.5 shrink-0" />
                <span>Biaya sewa domain berbayar kustom apabila perusahaan memilih domain sendiri.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground-muted mt-1.5 shrink-0" />
                <span>Biaya komersial API berbayar pihak ketiga bila beralih ke penyedia komersial.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground-muted mt-1.5 shrink-0" />
                <span>Pengadaan perangkat keras (laptop, smartphone, monitor) operasional cabang.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* SECTION 9: 8-STEP HANDOVER FLOW & CLOSING */}
      <div className="bg-surface border border-border rounded-container p-6 sm:p-8 shadow-subtle card-print space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand block">Bagian 8</span>
          <h2 className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
            Rencana Implementasi & 8 Langkah Alur Handover
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-control bg-surface-secondary border border-border">
            <span className="text-[10px] font-bold text-brand block">Langkah 1</span>
            <span className="font-semibold text-foreground">Diskusi Awal</span>
            <p className="text-foreground-secondary text-[11px] mt-0.5">Penyelarasan opsi bersama manajemen.</p>
          </div>
          <div className="p-3 rounded-control bg-surface-secondary border border-border">
            <span className="text-[10px] font-bold text-brand block">Langkah 2</span>
            <span className="font-semibold text-foreground">Kesepakatan</span>
            <p className="text-foreground-secondary text-[11px] mt-0.5">Penandatanganan nota kesepakatan.</p>
          </div>
          <div className="p-3 rounded-control bg-surface-secondary border border-border">
            <span className="text-[10px] font-bold text-brand block">Langkah 3</span>
            <span className="font-semibold text-foreground">Setup Akun</span>
            <p className="text-foreground-secondary text-[11px] mt-0.5">Penyiapan akun GitHub & Vercel optik.</p>
          </div>
          <div className="p-3 rounded-control bg-surface-secondary border border-border">
            <span className="text-[10px] font-bold text-brand block">Langkah 4</span>
            <span className="font-semibold text-foreground">Git Transfer</span>
            <p className="text-foreground-secondary text-[11px] mt-0.5">Pemindahan kepemilikan source code.</p>
          </div>
          <div className="p-3 rounded-control bg-surface-secondary border border-border">
            <span className="text-[10px] font-bold text-brand block">Langkah 5</span>
            <span className="font-semibold text-foreground">Konfigurasi</span>
            <p className="text-foreground-secondary text-[11px] mt-0.5">Handover kredensial & environment.</p>
          </div>
          <div className="p-3 rounded-control bg-surface-secondary border border-border">
            <span className="text-[10px] font-bold text-brand block">Langkah 6</span>
            <span className="font-semibold text-foreground">Pelatihan Staf</span>
            <p className="text-foreground-secondary text-[11px] mt-0.5">Sesi edukasi pengoperasian sistem.</p>
          </div>
          <div className="p-3 rounded-control bg-surface-secondary border border-border">
            <span className="text-[10px] font-bold text-brand block">Langkah 7</span>
            <span className="font-semibold text-foreground">UAT Bersama</span>
            <p className="text-foreground-secondary text-[11px] mt-0.5">Uji verifikasi fungsi operasional.</p>
          </div>
          <div className="p-3 rounded-control bg-surface-secondary border border-border">
            <span className="text-[10px] font-bold text-brand block">Langkah 8</span>
            <span className="font-semibold text-foreground">Masa Garansi</span>
            <p className="text-foreground-secondary text-[11px] mt-0.5">Dukungan pemeliharaan aktif.</p>
          </div>
        </div>

        {/* Narrative Closing & Signature Block */}
        <div className="pt-4 border-t border-border space-y-4">
          <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">
            Inisiatif pengembangan sistem I See You Marketing Intelligence lahir dari dedikasi tulus untuk melihat Optik I See You tumbuh menjadi jenama kacamata terdepan yang modern, efisien, dan berbasis data.
            Harapan terbesar inisiator adalah agar sistem ini dapat terus memberikan manfaat nyata, membantu kemajuan tim di setiap cabang, dan menjadi bagian dari fondasi digital kesuksesan Optik I See You di masa depan.
          </p>

          <div className="grid grid-cols-2 gap-8 pt-6 text-xs text-center border-t border-border">
            <div className="space-y-12">
              <span className="text-foreground-muted block">Disusun oleh:</span>
              <div>
                <span className="font-bold text-foreground block">Yossika Putra Erlangga</span>
                <span className="text-foreground-secondary text-[11px] block">Inisiator Pengembang & Divisi Marketing</span>
                <span className="text-foreground-muted text-[10px] block">Tanggal: 5 Oktober 2026</span>
              </div>
            </div>

            <div className="space-y-12">
              <span className="text-foreground-muted block">Mengetahui & Menyetujui Pembahasan:</span>
              <div>
                <span className="font-bold text-foreground block">Direksi / Manajemen Optik I See You</span>
                <span className="text-foreground-secondary text-[11px] block">PT Indah Sinergi Yuwana</span>
                <span className="text-foreground-muted text-[10px] block">Tanggal: _________________ 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA (Hides in Print) */}
      <div className="no-print bg-surface border border-border rounded-container p-6 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">Diskusikan Proposal Ini Bersama Inisiator</h3>
          <p className="text-xs text-foreground-secondary mt-0.5">
            Terbuka untuk diskusi penyesuaian ruang lingkup teknis, skema pembayaran, dan jadwal serah terima.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-control text-xs font-semibold bg-brand text-white hover:bg-brand/90 transition-all shadow-subtle"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
