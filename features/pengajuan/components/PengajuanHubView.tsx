"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Handshake,
  MessageSquare,
  FileText,
  Calendar,
  Users,
  ExternalLink,
  Copy,
  Check,
  Search,
  Stethoscope,
  ChevronRight,
  ShieldCheck,
  Tv,
  Camera,
  Gift,
  PhoneCall,
  CheckCircle2,
  Building2,
} from "lucide-react";
import {
  MARKETING_STAFF_PHONE,
  BRANCH_CS_CONFIG,
  buildBrandPitchWhatsAppMessage,
} from "@/lib/pengajuan-service";
import sheetsData from "@/lib/real-sheets-data.json";

interface RawProposalItem {
  id: string;
  stableId: string;
  timestamp: string;
  institution: string;
  targetBranch: string;
  eventName: string;
  eventDate: string;
  description: string;
  benefit: string;
  applicantName: string;
  applicantPhone: string;
  fileUrl: string;
  sheetNote?: string;
}

export const PengajuanHubView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"proposal" | "homeservice" | "database">("proposal");

  // Pitching Generator State (For Yoshput reaching out to external brands)
  const [pitchBrandName, setPitchBrandName] = useState("Somethinc");
  const [pitchPicName, setPitchPicName] = useState("Brand Manager");
  const [pitchCategory, setPitchCategory] = useState("Skincare & Beauty");
  const [pitchPackage, setPitchPackage] = useState("Diamond (Tier Utama / Rp 5.000.000)");
  const [copiedPitch, setCopiedPitch] = useState(false);

  // Proposal database filter from Google Sheets
  const rawProposals: RawProposalItem[] = ((sheetsData as any).formProposal || []) as RawProposalItem[];
  const [dbSearch, setDbSearch] = useState("");
  const [dbBranchFilter, setDbBranchFilter] = useState("all");

  const filteredProposals = rawProposals.filter((item) => {
    const matchesBranch =
      dbBranchFilter === "all" ||
      item.targetBranch.toLowerCase().includes(dbBranchFilter.toLowerCase());

    const matchesSearch =
      !dbSearch ||
      item.eventName.toLowerCase().includes(dbSearch.toLowerCase()) ||
      item.institution.toLowerCase().includes(dbSearch.toLowerCase()) ||
      item.applicantName.toLowerCase().includes(dbSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(dbSearch.toLowerCase());

    return matchesBranch && matchesSearch;
  });

  const generatedPitchMessage = buildBrandPitchWhatsAppMessage({
    brandName: pitchBrandName,
    picName: pitchPicName,
    category: pitchCategory,
    recommendedPackage: pitchPackage.split(" ")[0],
  });

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(generatedPitchMessage);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* PAGE HEADER: Internal Marketing Hub Context                              */}
      {/* ========================================================================= */}
      <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-subtle">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800">
                Marketing Intelligence · Kemitraan &amp; Layanan
              </span>
              <span className="text-[11px] font-medium text-foreground-muted">
                PIC Staff Marketing: <strong>Yoshput ({MARKETING_STAFF_PHONE})</strong>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground mt-1.5 tracking-tight">
              Pusat Kemitraan Sponsor &amp; Manajemen Layanan Cabang
            </h1>
            <p className="text-xs sm:text-sm text-foreground-secondary mt-1 max-w-3xl leading-relaxed">
              Platform internal tim marketing untuk mengelola proposal pitching <b>&quot;Buka Class Konten&quot;</b> ke brand luar,
              menghubungkan calon mitra ke form resmi di <code>optikiseeyou.com</code>, serta memantau routing layanan Home Service 4 cabang ritel.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/proposal-sponsor"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
            >
              <FileText className="w-4 h-4 text-emerald-200" />
              <span>Buka Proposal Sponsor (A4)</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-border overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("proposal")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "proposal"
                ? "bg-foreground text-surface shadow-subtle"
                : "text-foreground-secondary hover:text-foreground hover:bg-surface-secondary"
            }`}
          >
            <Handshake className="w-3.5 h-3.5" />
            <span>Proposal &amp; Template Pitching Brand</span>
          </button>

          <button
            onClick={() => setActiveTab("homeservice")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "homeservice"
                ? "bg-foreground text-surface shadow-subtle"
                : "text-foreground-secondary hover:text-foreground hover:bg-surface-secondary"
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Layanan Home Service (4 Cabang)</span>
          </button>

          <button
            onClick={() => setActiveTab("database")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "database"
                ? "bg-foreground text-surface shadow-subtle"
                : "text-foreground-secondary hover:text-foreground hover:bg-surface-secondary"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Database Proposal Masuk (Sheets)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-black">
              {rawProposals.length}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PROPOSAL SPONSORSHIP & BRAND OUTREACH PITCHING TOOL                */}
      {/* ========================================================================= */}
      {activeTab === "proposal" && (
        <div className="space-y-6">
          {/* Public Integration Notice Banner */}
          <div className="p-4 rounded-xl border border-amber-300/80 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sm block text-amber-950 dark:text-amber-100">
                  Formulir Pengajuan Publik Resmi Aktif di Website Utama
                </span>
                <p className="text-[12px] font-medium text-amber-900 dark:text-amber-200 mt-0.5 leading-relaxed">
                  Pihak luar, kampus, sekolah, atau panitia event mengajukan proposal sponsorship secara mandiri melalui form publik resmi di{" "}
                  <strong>https://optikiseeyou.com/sponsor</strong>. Halaman di sistem ini digunakan internal tim marketing untuk pitching &amp; komunikasi partner.
                </p>
              </div>
            </div>
            <a
              href="https://optikiseeyou.com/sponsor"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs whitespace-nowrap shadow-xs transition-colors shrink-0"
            >
              <span>Buka Form Publik (optikiseeyou.com)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Proposal Document Overview Card */}
          <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-subtle space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                  Dokumen Penawaran Kerjasama Resmi
                </span>
                <h2 className="text-lg font-black text-foreground mt-0.5">
                  Proposal &quot;Buka Class Konten&quot; — Digital Creator Masterclass
                </h2>
                <p className="text-xs text-foreground-secondary mt-0.5">
                  Standar presentasi formal 7 halaman (Ukuran A4) dengan tema eksklusif <b>Hijau Emerald &amp; Putih Ivory</b>.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/proposal-sponsor"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs transition-all"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Lihat Dokumen Lengkap</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 4 Packages Grid Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-xl border border-emerald-800/40 bg-emerald-50/50 dark:bg-emerald-950/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-200">DIAMOND</span>
                  <span className="text-xs font-black text-emerald-800 dark:text-emerald-300">Rp 5.000.000</span>
                </div>
                <div className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">Tier Utama / Eksklusif</div>
                <ul className="text-[11px] text-foreground-secondary space-y-1 list-disc pl-4 leading-relaxed">
                  <li>Open Booth / Space di lokasi event</li>
                  <li>Tayang TV Showroom 4 Cabang (1 Bulan)</li>
                  <li>Presentasi / Demo Produk (15 Menit)</li>
                  <li>Sampling langsung ke semua peserta</li>
                  <li>Ad-Lips MC 10x + Dedicated Feed/Reels</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-emerald-700/30 bg-surface-secondary/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-200">PLATINUM</span>
                  <span className="text-xs font-black text-emerald-800 dark:text-emerald-300">Rp 3.000.000</span>
                </div>
                <div className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">Eksposur Ritel &amp; Digital</div>
                <ul className="text-[11px] text-foreground-secondary space-y-1 list-disc pl-4 leading-relaxed">
                  <li>Tayang TV Showroom 4 Cabang (2 Minggu)</li>
                  <li>Logo Medium Backdrop &amp; Photobooth</li>
                  <li>Display flyer/voucher di kasir 4 cabang</li>
                  <li>Voucher dalam Goodie Bag peserta</li>
                  <li>Ad-Lips MC 5x + Joint Feed IG Post</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-emerald-600/30 bg-surface-secondary/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-200">GOLD</span>
                  <span className="text-xs font-black text-emerald-800 dark:text-emerald-300">Rp 1.500.000</span>
                </div>
                <div className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">Visibilitas Event &amp; Digital</div>
                <ul className="text-[11px] text-foreground-secondary space-y-1 list-disc pl-4 leading-relaxed">
                  <li>Tayang Poster TV 4 Cabang (1 Minggu)</li>
                  <li>Logo Standard Banner Event &amp; Flyer</li>
                  <li>Voucher Promo dalam Goodie Bag</li>
                  <li>Mention &amp; Tag di Instagram Story</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-teal-600/30 bg-surface-secondary/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-teal-900 dark:text-teal-200">SILVER</span>
                  <span className="text-xs font-black text-teal-800 dark:text-teal-300">In-Kind</span>
                </div>
                <div className="text-[10px] font-semibold text-teal-700 dark:text-teal-400">Produk &amp; Voucher Sponsor</div>
                <ul className="text-[11px] text-foreground-secondary space-y-1 list-disc pl-4 leading-relaxed">
                  <li>Goodie Bag / Product Sampling / Gift Set</li>
                  <li>Logo Small pada Banner Kolektif</li>
                  <li>Digital Story Sponsor Appreciation</li>
                  <li>Penyebaran flyer di area registrasi</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* INTERACTIVE OUTBOUND PITCHING GENERATOR (TOOL MARKETING STAFF)        */}
          {/* ===================================================================== */}
          <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-subtle space-y-5">
            <div className="border-b border-border pb-3">
              <span className="text-[10px] uppercase font-black text-emerald-700 dark:text-emerald-400 tracking-wider block">
                Alat Kerja Staff Marketing (Mas Yoshput)
              </span>
              <h3 className="text-base font-black text-foreground mt-0.5 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                Generator Pesan WhatsApp Pitching ke Brand &amp; Calon Sponsor
              </h3>
              <p className="text-xs text-foreground-secondary mt-0.5">
                Ketik nama brand dan target penawaran di bawah, format chat resmi langsung dibuat secara instan dan siap dikirim via WhatsApp.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 5 Cols: Config Parameters */}
              <div className="lg:col-span-5 space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Nama Brand / Calon Mitra:
                  </label>
                  <input
                    type="text"
                    value={pitchBrandName}
                    onChange={(e) => setPitchBrandName(e.target.value)}
                    placeholder="Contoh: Somethinc, Wardah, Kopi Kenangan"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface-secondary text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-600/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Nama / Jabatan PIC Tujuan:
                  </label>
                  <input
                    type="text"
                    value={pitchPicName}
                    onChange={(e) => setPitchPicName(e.target.value)}
                    placeholder="Contoh: Kak Sarah / Brand Manager"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface-secondary text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-600/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Kategori Bisnis Brand:
                  </label>
                  <select
                    value={pitchCategory}
                    onChange={(e) => setPitchCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface-secondary text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-600/40"
                  >
                    <option value="Skincare, Beauty & Personal Care">Skincare, Beauty &amp; Personal Care</option>
                    <option value="Food & Beverage / Coffee Shop">Food &amp; Beverage / Coffee Shop</option>
                    <option value="Retail Fashion & Lifestyle">Retail Fashion &amp; Lifestyle</option>
                    <option value="Perbankan & Financial Technology">Perbankan &amp; Financial Technology</option>
                    <option value="Hospitality & Pariwisata">Hospitality &amp; Pariwisata</option>
                    <option value="General Consumer Goods">General Consumer Goods</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Rekomendasi Paket Ditawarkan:
                  </label>
                  <select
                    value={pitchPackage}
                    onChange={(e) => setPitchPackage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface-secondary text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-600/40"
                  >
                    <option value="Diamond (Tier Utama / Rp 5.000.000)">Diamond (Tier Utama / Rp 5.000.000)</option>
                    <option value="Platinum (Eksposur Ritel / Rp 3.000.000)">Platinum (Eksposur Ritel / Rp 3.000.000)</option>
                    <option value="Gold (Visibilitas Digital / Rp 1.500.000)">Gold (Visibilitas Digital / Rp 1.500.000)</option>
                    <option value="Silver (In-Kind / Produk & Voucher)">Silver (In-Kind / Produk &amp; Voucher)</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-surface-secondary border border-border/80 text-[11px] text-foreground-secondary space-y-1">
                  <span className="font-bold text-foreground block">Pesan dikirim dari:</span>
                  <p>Yoshput · Staff Marketing &amp; Kemitraan Optik I See You</p>
                  <p className="font-semibold text-emerald-700 dark:text-emerald-400">Nomor WhatsApp Resmi: {MARKETING_STAFF_PHONE}</p>
                </div>
              </div>

              {/* Right 7 Cols: Formatted WhatsApp Live Preview */}
              <div className="lg:col-span-7 flex flex-col justify-between bg-surface-secondary/40 rounded-xl border border-border p-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
                    <span className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      Preview Teks WhatsApp Siap Kirim
                    </span>
                    <span className="text-[10px] text-foreground-muted">
                      Formal &amp; Persuasif
                    </span>
                  </div>

                  <pre className="text-xs font-sans text-foreground whitespace-pre-wrap leading-relaxed bg-surface p-4 rounded-xl border border-border/80 max-h-[340px] overflow-y-auto">
                    {generatedPitchMessage}
                  </pre>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-border">
                  <button
                    onClick={handleCopyPitch}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      copiedPitch
                        ? "bg-emerald-700 text-white"
                        : "bg-surface border border-border hover:bg-surface-secondary text-foreground"
                    }`}
                  >
                    {copiedPitch ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPitch ? "Tersalin ke Clipboard!" : "Salin Pesan WA"}</span>
                  </button>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(generatedPitchMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Buka WhatsApp Web / App</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: LAYANAN HOME SERVICE 4 CABANG                                      */}
      {/* ========================================================================= */}
      {activeTab === "homeservice" && (
        <div className="space-y-6">
          {/* Public Integration Notice Banner */}
          <div className="p-4 rounded-xl border border-teal-300/80 dark:border-teal-700/60 bg-teal-50 dark:bg-teal-950/40 text-teal-950 dark:text-teal-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-start gap-2.5">
              <Stethoscope className="w-5 h-5 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sm block text-teal-950 dark:text-teal-100">
                  Layanan Booking Home Service Terintegrasi di optikiseeyou.com
                </span>
                <p className="text-[12px] font-medium text-teal-900 dark:text-teal-200 mt-0.5 leading-relaxed">
                  Pemeriksaan refraksi mata profesional dan fitting koleksi frame langsung ke rumah atau kantor. Pasien umum memesan jadwal melalui{" "}
                  <strong>https://optikiseeyou.com/home-service</strong> yang langsung terhubung ke CS cabang terkait.
                </p>
              </div>
            </div>
            <a
              href="https://optikiseeyou.com/home-service"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs whitespace-nowrap shadow-xs transition-colors shrink-0"
            >
              <span>Buka Web Layanan (optikiseeyou.com)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* 4 Official Retail Branches Routing Directory */}
          <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-subtle space-y-4">
            <div className="border-b border-border pb-3">
              <h3 className="text-base font-black text-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand" />
                Direktori Customer Service Home Service 4 Cabang Ritel
              </h3>
              <p className="text-xs text-foreground-secondary mt-0.5">
                Setiap permintaan yang masuk melalui web publik otomatis diarahkan ke tim refraksionis &amp; customer service cabang terdekat.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(BRANCH_CS_CONFIG).map(([key, cfg]) => {
                const cleanPhone = "62" + cfg.csPhone.replace(/^0/, "");
                return (
                  <div
                    key={key}
                    className="p-4 rounded-xl border border-border bg-surface-secondary/40 hover:border-brand/40 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-brand-light text-brand">
                          Cabang {cfg.city}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Siaga Pelayanan
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-foreground mt-2">
                        {cfg.name}
                      </h4>
                      <p className="text-xs text-foreground-secondary mt-1">
                        Pemeriksaan refraksi mata akurat dengan alat mobile refraktometer profesional &amp; koper display frame lengkap.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-foreground-muted block font-semibold">Nomor WhatsApp CS:</span>
                        <span className="text-xs font-black text-foreground">{cfg.csPhone}</span>
                      </div>
                      <a
                        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Halo CS ${cfg.name}, saya ingin konsultasi jadwal layanan Home Service pemeriksaan mata.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>Hubungi CS</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DATABASE PROPOSAL ASLI DARI GOOGLE SHEETS (54 PROPOSAL)            */}
      {/* ========================================================================= */}
      {activeTab === "database" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-subtle space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <h3 className="text-base font-black text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand" />
                  Rekap Database Proposal Sponsorship Masuk
                </h3>
                <p className="text-xs text-foreground-secondary mt-0.5">
                  Total <b>{rawProposals.length} proposal</b> terdata otomatis dari Google Sheets <code>Form Proposal</code>.
                </p>
              </div>

              {/* Search & Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
                  <input
                    type="text"
                    value={dbSearch}
                    onChange={(e) => setDbSearch(e.target.value)}
                    placeholder="Cari event, kampus, pengaju..."
                    className="pl-8 pr-3 py-1.5 rounded-lg border border-border bg-surface-secondary text-xs text-foreground w-48 sm:w-60 focus:outline-none focus:ring-2 focus:ring-brand/40"
                  />
                </div>

                <select
                  value={dbBranchFilter}
                  onChange={(e) => setDbBranchFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-border bg-surface-secondary text-xs font-semibold text-foreground focus:outline-none"
                >
                  <option value="all">Semua Cabang</option>
                  <option value="purwokerto">Purwokerto</option>
                  <option value="purbalingga">Purbalingga</option>
                  <option value="cilacap">Cilacap</option>
                  <option value="wonosobo">Wonosobo</option>
                </select>
              </div>
            </div>

            {/* Proposal Cards List */}
            <div className="space-y-3">
              {filteredProposals.length === 0 ? (
                <div className="p-8 text-center text-xs text-foreground-muted italic bg-surface-secondary/40 rounded-xl">
                  Tidak ditemukan proposal yang sesuai dengan filter pencarian.
                </div>
              ) : (
                filteredProposals.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-border bg-surface hover:border-foreground-muted/40 transition-all space-y-3 shadow-2xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-border pb-2.5">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
                            Cabang {item.targetBranch || "Purwokerto"}
                          </span>
                          <span className="text-[10px] text-foreground-muted flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-brand" />
                            <span>Pelaksanaan: {item.eventDate || "Belum ditentukan"}</span>
                          </span>
                          <span className="text-[10px] text-foreground-muted">
                            Masuk: {item.timestamp}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-foreground mt-1">
                          {item.eventName}
                        </h4>
                        <span className="text-xs text-foreground-secondary">
                          <strong>{item.applicantName}</strong> · {item.institution} {item.applicantPhone && `(${item.applicantPhone})`}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs space-y-1">
                      <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                        Deskripsi Kegiatan:
                      </span>
                      <p className="text-foreground-secondary leading-relaxed bg-surface-secondary/40 p-2.5 rounded-lg border border-border/60">
                        {item.description}
                      </p>
                    </div>

                    {item.benefit && (
                      <div className="text-xs space-y-0.5">
                        <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                          Benefit untuk Optik I See You:
                        </span>
                        <p className="text-foreground-secondary text-[11px] leading-relaxed">
                          {item.benefit}
                        </p>
                      </div>
                    )}

                    <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                      <div>
                        {item.fileUrl && item.fileUrl.startsWith("http") ? (
                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:underline"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Buka Dokumen Proposal (Google Drive)</span>
                            <ExternalLink className="w-3 h-3 text-brand" />
                          </a>
                        ) : (
                          <span className="text-[11px] text-foreground-muted italic">
                            Tidak ada tautan file terlampir
                          </span>
                        )}
                      </div>

                      {item.applicantPhone && (
                        <a
                          href={`https://wa.me/62${item.applicantPhone.replace(/^0/, "").replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Hubungi Pengaju</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
