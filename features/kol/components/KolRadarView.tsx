"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Video,
  Eye,
  TrendingUp,
  Building2,
  SlidersHorizontal,
  MessageSquare,
  Sparkles,
  FileSpreadsheet,
  Layers,
  ChevronRight,
  Info,
  DollarSign,
  Gift,
  Heart,
  Tag,
  Send,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2
} from "lucide-react";
import initialKolData from "@/lib/kol-data.json";

export interface KolItem {
  id: string;
  branchId: string;
  branchName: string;
  brand: string;
  name: string;
  handle: string;
  platform: string;
  profileImg?: string;
  instagramUrl: string;
  tiktokUrl?: string;
  videoUrl?: string;
  socialBladeUrl: string;
  socialBladeGrade?: string;
  followers: number;
  followersFormatted: string;
  engagementRate: number;
  niche: string;
  audienceFit?: string;
  contentFocus?: string;
  rateCardNote?: string;
  rateCardImage?: string;
  rateCardPdf?: string;
  rateCard: {
    story: string;
    reels: string;
    feeds: string;
    visitStore: string;
    bundled: string;
  };
  benefits: string[];
  owningRights: {
    canOwnRaw: boolean;
    terms: string;
    extraFeeEstimate: string;
    adsUsageDays: number;
    statusNote: string;
  };
  status: string;
  notes: string;
  contactWa: string;
  pitchTemplate: string;
  barterStrategy?: {
    standardFee: string;
    barterOption: string;
    followerVoucher: string;
    recommendedApproach: string;
  };
}

export const KolRadarView: React.FC = () => {
  const [kols, setKols] = useState<KolItem[]>((initialKolData as unknown as KolItem[]) || []);
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyCanOwnRaw, setOnlyCanOwnRaw] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [focusFilter, setFocusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [copiedPitchId, setCopiedPitchId] = useState<string | null>(null);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);
  const [activePitchModal, setActivePitchModal] = useState<KolItem | null>(null);
  const [previewRateCard, setPreviewRateCard] = useState<KolItem | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [senderName, setSenderName] = useState<string>("Yossika");
  const [templateStyle, setTemplateStyle] = useState<"step1_ratecard" | "step2_barter" | "step3_owning">("step1_ratecard");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [newKolForm, setNewKolForm] = useState({
    name: "",
    handle: "",
    branchId: "pwt",
    branchName: "Purwokerto",
    followers: "55000",
    engagementRate: "5.5",
    niche: "Fashion, Hijab & Lifestyle",
    notes: "KOL Terverifikasi >50K Followers, Reels aktif & views ramai."
  });

  // Branch mapping
  const branchOptions = [
    { id: "all", label: "Semua Cabang" },
    { id: "pwt", label: "Purwokerto", brand: "Optik I See You" },
    { id: "pbg", label: "Purbalingga", brand: "Optik I See You" },
    { id: "clp", label: "Cilacap", brand: "Optik I See You" },
    { id: "wsb", label: "Wonosobo", brand: "Optik I See You" },
    { id: "tegal", label: "Lunar Tegal", brand: "Lunar Eyewear" },
  ];

  // Filtering
  const filteredKols = useMemo(() => {
    return kols.filter((item: KolItem) => {
      const matchBranch = selectedBranch === "all" || item.branchId === selectedBranch;
      const matchOwning = !onlyCanOwnRaw || item.owningRights?.canOwnRaw;
      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      const matchFocus =
        focusFilter === "all" ||
        (item.contentFocus && item.contentFocus.toLowerCase().includes(focusFilter.toLowerCase()));
      const matchSearch =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.branchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.niche.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.contentFocus && item.contentFocus.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchBranch && matchOwning && matchStatus && matchFocus && matchSearch;
    });
  }, [kols, selectedBranch, onlyCanOwnRaw, statusFilter, focusFilter, searchQuery]);

  // Aggregate stats
  const totalAudience = useMemo(() => {
    return kols.reduce((acc, curr) => acc + (curr.followers || 0), 0);
  }, [kols]);

  const avgER = useMemo(() => {
    if (kols.length === 0) return "0.0";
    const sum = kols.reduce((acc, curr) => acc + (curr.engagementRate || 0), 0);
    return (sum / kols.length).toFixed(1);
  }, [kols]);

  const owningReadyCount = useMemo(() => {
    return kols.filter((k) => k.owningRights?.canOwnRaw).length;
  }, [kols]);

  // Handle status change
  const handleStatusChange = async (id: string, newStatus: string) => {
    setKols((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: newStatus as any } : k))
    );

    try {
      await fetch("/api/kol", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (e) {
      console.error("Failed to persist status change:", e);
    }
  };

  // Helper for generating custom chat text based on style & sender
  const getRenderedChat = (kol: any, style: "step1_ratecard" | "step2_barter" | "step3_owning") => {
    const firstName = kol.name.split(" ")[0];
    const isLunar = kol.brand === "Lunar Eyewear";
    const brandName = isLunar ? "Lunar Eyewear Tegal" : "Optik I See You Glasses";
    const brandMention = isLunar ? "lunar eyewear" : "optik i see youu";
    const branchLabel = kol.branchName;

    // TAHAP 1: Fokus murni tanya rate card dulu (tanpa sebut barter produk kacamata di awal)
    if (style === "step1_ratecard") {
      return `Hai kak ${firstName}.. ✨👋

Perkenalkan saya ${senderName} dari tim Marketing ${brandName} 👓
Setelah melihat Social Media kaka yang seru dan kece banget, kami tertarik banget untuk mengajak kerja sama atau berkolaborasi dengan kita ${brandMention} 🥰

Kalo boleh tau, boleh di infokan untuk ratecardnyaa, sebagai bahan pertimbangan kami?

Terimakasih ditunggu kabar baiknya ya ka 🙏
Have a nicee dayy ya kaa! 🌸✨`;
    }

    // TAHAP 2: Follow-up setelah rate card dikirim -> Masuk ke penawaran Barter Produk + Voucher Kuis Followers / Fee 250k
    if (style === "step2_barter") {
      return `Hai kak ${firstName}.. makasih banyak yaa atas info rate card-nya! 🥰✨

Setelah tim kami diskusikan, kami tertarik banget nih kak untuk lanjut berkolaborasi. Kebetulan dari kami ada opsi skema kolaborasi yang seru dan saling menguntungkan:

1. Skema Barter Produk Kacamata Premium bebas pilih (Full set frame estetik + lensa kustom antiradiasi / photochromic pilihan Kakak) 👓
2. Plus tambahan Voucher Diskon Belanja spesial untuk followers Kak ${firstName} yang bisa dibagikan buat kuis / giveaway di kolom komentar biar postingannya makin rame dan banjir interaksi! 🎁✨
3. (Atau opsi acuan fee standar kami di kisaran Rp 250.000 + barter produk kacamata)

Kira-kira dari Kak ${firstName} apakah open dan berkenan dengan skema kolaborasi seru ini kak? 

Terimakasih banyak ditunggu kabar baiknya yaa kak, have a wonderful and lovely day! 🌸💖`;
    }

    // TAHAP 3: Kunci hak Owning Video Mentahan (Raw Footage) untuk Iklan Ads
    return `Halo kak ${firstName}.. ✨👋

Menyambung rencana kolaborasi kita untuk visit store di Cabang ${branchLabel} 👓
Untuk paket kontennya (1 Reels + Stories), kami ingin memastikan terkait hak owning materi video mentahan (raw footage) tanpa watermark ya kak, karena akan kami gunakan untuk bahan konten iklan berbayar (Meta Ads) dengan hak tayang 60 hari.

Kira-kira apakah file video mentahannya bisa diserahkan via Google Drive setelah proses take video di toko kak? 

Terimakasih banyak ya kak, ditunggu konfirmasinya!
Have a nicee dayy ya kaa! 🌸✨`;
  };

  // Copy WhatsApp Pitch
  const handleCopyPitch = (item: any) => {
    const text = getRenderedChat(item, templateStyle);
    navigator.clipboard.writeText(text);
    setCopiedPitchId(item.id);
    setTimeout(() => setCopiedPitchId(null), 2500);
  };

  // Copy Comprehensive Report for Mas Raja
  const handleCopyFullReport = () => {
    let report = `📋 *REKAP REKOMENDASI ${kols.length} KOL CREATOR (5 CABANG)*\n`;
    report += `Optik I See You (PWT, PBG, CLP, WSB) & Lunar Eyewear Tegal\n`;
    report += `Tanggal: ${new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}\n\n`;
    report += `📌 *STANDAR STRATEGI NEGOSIASI:* Acuan fee Rp 250.000 / Barter Produk Kacamata + Voucher Followers Kuis Komentar + Hak Owning Video Mentahan Iklan\n\n`;

    const branches = ["Purwokerto", "Purbalingga", "Cilacap", "Wonosobo", "Lunar Eyewear Tegal"];
    
    branches.forEach((bName) => {
      const items = kols.filter((k) => k.branchName.toLowerCase().includes(bName.toLowerCase().split(" ")[0]));
      report += `====================================\n`;
      report += `📍 *CABANG: ${bName.toUpperCase()}*\n`;
      report += `====================================\n`;

      items.forEach((kol, idx) => {
        report += `\n*Opsi ${idx + 1}: ${kol.name} (@${kol.handle})*\n`;
        report += `• Brand: ${kol.brand}\n`;
        report += `• Followers: ${kol.followersFormatted} | Engagement Rate: ${kol.engagementRate}%\n`;
        report += `• Social Blade: ${kol.socialBladeUrl} (Grade: ${kol.socialBladeGrade})\n`;
        report += `• Niche: ${kol.niche}\n`;
        report += `• Skema Budget: Acuan Fee Rp 250.000 / Barter Produk Kacamata Full + Voucher Followers\n`;
        report += `• Hak Owning (Video Mentahan Iklan Ads): ${kol.owningRights.canOwnRaw ? "BISA OWNING RAW" : "TIDAK BISA"} (${kol.owningRights.adsUsageDays} Hari)\n`;
        report += `• Status Pengajuan: [${kol.status}]\n`;
        report += `• Draft Chat WA (Tahap 1): "${getRenderedChat(kol, "step1_ratecard").replace(/\n/g, " ")}"\n`;
      });
      report += `\n`;
    });

    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 3000);
  };

  const handleAddKol = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKolForm.name || !newKolForm.handle) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/kol", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newKolForm),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setKols((prev: any) => [data.data, ...prev]);
        setIsAddModalOpen(false);
        setNewKolForm({
          name: "",
          handle: "",
          branchId: "pwt",
          branchName: "Purwokerto",
          followers: "55000",
          engagementRate: "5.5",
          niche: "Fashion, Hijab & Lifestyle",
          notes: "KOL Terverifikasi >50K Followers, Reels aktif & views ramai."
        });
      } else {
        alert(data.error || "Gagal menambahkan KOL");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menambahkan KOL");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteKol = async (id: string, name: string) => {
    if (!confirm(`Hapus KOL ${name} dari daftar radar?`)) return;
    setKols((prev: any) => prev.filter((k: any) => k.id !== id));
    try {
      await fetch(`/api/kol?id=${id}`, { method: "DELETE" });
    } catch (e) {
      console.error("Gagal menghapus KOL:", e);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface p-6 rounded-card border border-border shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-light text-brand flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Strategic Talent Acquisition
            </span>
            <span className="text-xs text-foreground-muted">·</span>
            <span className="text-xs font-medium text-foreground-secondary">
              5 Wilayah Cabang (4 ISY + 1 Lunar)
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-brand" />
            KOL & Influencer Radar
          </h1>
          <p className="text-sm text-foreground-muted mt-1 max-w-2xl">
            Kurasi {kols.length} Selebgram &amp; TikTok Creator Lokal Pilihan (5 cabang) dengan data Social Blade langsung, 
            skema Fee Rp 250rb / Barter Produk + Voucher Giveaway Komen, dan Hak Owning Video Mentahan Iklan.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCopyFullReport}
            className="flex items-center gap-2 px-3.5 py-2 rounded-control bg-foreground text-surface text-xs font-semibold hover:opacity-90 transition-all shadow-subtle active:scale-95"
          >
            {copiedReport ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tersalin ke Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Format Laporan Mas Raja</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-control bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-subtle active:scale-95"
          >
            <span>+ Input KOL Terverifikasi (&gt;50K)</span>
          </button>

          <a
            href="https://socialblade.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-control bg-surface-secondary text-foreground text-xs font-medium border border-border hover:bg-surface-tertiary transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-foreground-muted" />
            <span>SocialBlade.com</span>
          </a>
        </div>
      </div>

      {/* STRATEGIC NEGOTIATION POLICY BANNER (2-Step Funnel) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-amber-500/10 border border-amber-500/25 rounded-card p-4 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-800 shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-950 uppercase tracking-wide block">
              1. Chat Pertama: Tanya Rate Card Dulu
            </span>
            <p className="text-xs text-amber-900 mt-1 leading-relaxed">
              Fokus <strong>murni menanyakan rate card resmi</strong> talent dulu secara santai & ramah. <em>Jangan langsung sebut barter produk kacamata di chat awal</em> agar talent nyaman & kita tahu patokan harga aslinya.
            </p>
          </div>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-card p-4 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-800 shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide block">
              2. Follow-Up: Tawar Barter + Voucher Komen
            </span>
            <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
              Setelah rate card masuk, baru ajukan <strong>Barter Produk Kacamata Pilihan Talent + Voucher Kuis Komen Followers</strong> (atau acuan fee Rp 250.000). Skema giveaway kuis ini disukai karena meledakkan komentar talent.
            </p>
          </div>
        </div>

        <div className="bg-violet-500/10 border border-violet-500/25 rounded-card p-4 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-violet-500/20 text-violet-800 shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-violet-950 uppercase tracking-wide block">
              3. Closing: Kunci Owning Raw Video Ads
            </span>
            <p className="text-xs text-violet-900 mt-1 leading-relaxed">
              Pastikan dalam kesepakatan tertulis: <strong>Wajib menyerahkan video mentahan (raw footage 4K/60fps)</strong> tanpa watermark/teks untuk bahan iklan berbayar Meta Ads durasi 60–90 hari.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-surface p-4 rounded-card border border-border">
          <div className="flex items-center justify-between text-xs text-foreground-muted mb-1">
            <span>Total KOL Terdata</span>
            <Users className="w-4 h-4 text-brand" />
          </div>
          <div className="text-xl font-bold text-foreground">
            {kols.length} <span className="text-xs font-normal text-foreground-muted">KOL (5 Cabang Aktif)</span>
          </div>
          <span className="text-[11px] text-emerald-800 font-medium flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Terverifikasi per Cabang
          </span>
        </div>

        <div className="bg-surface p-4 rounded-card border border-border">
          <div className="flex items-center justify-between text-xs text-foreground-muted mb-1">
            <span>Siap Owning Raw Footage</span>
            <Video className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-xl font-bold text-foreground">
            {owningReadyCount}/{kols.length} <span className="text-xs font-normal text-foreground-muted">KOL</span>
          </div>
          <span className="text-[11px] text-violet-700 font-medium flex items-center gap-1 mt-1">
            <ShieldCheck className="w-3 h-3 text-violet-600" /> Siap Jadi Bahan Iklan Ads
          </span>
        </div>

        <div className="bg-surface p-4 rounded-card border border-border">
          <div className="flex items-center justify-between text-xs text-foreground-muted mb-1">
            <span>Estimasi Jangkauan (Reach)</span>
            <Eye className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold text-foreground">
            {(totalAudience / 1000).toFixed(1)}K+ <span className="text-xs font-normal text-foreground-muted">Followers</span>
          </div>
          <span className="text-[11px] text-blue-700 font-medium flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-blue-600" /> Segmentasi Lokal Jateng
          </span>
        </div>

        <div className="bg-surface p-4 rounded-card border border-border">
          <div className="flex items-center justify-between text-xs text-foreground-muted mb-1">
            <span>Rata-Rata Engagement</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-foreground">
            {avgER}% <span className="text-xs font-normal text-foreground-muted">Rata-rata ER</span>
          </div>
          <span className="text-[11px] text-amber-700 font-medium flex items-center gap-1 mt-1">
            Di atas standar industri lokal (3%)
          </span>
        </div>
      </div>

      {/* Exclusion & Blacklist Reminder (Purwokerto & General Rules) */}
      <div className="bg-red-500/10 border border-red-500/25 rounded-card p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-red-900">
        <div className="flex items-start gap-2.5">
          <span className="p-1 rounded bg-red-500/20 text-red-700 font-bold shrink-0 mt-0.5">
            ⛔
          </span>
          <div>
            <span className="font-bold text-red-950 block">
              Daftar Eksklusi Influencer Purwokerto (JANGAN DIHUBUNGI / TIDAK COCOK):
            </span>
            <p className="mt-0.5 text-red-800 leading-relaxed">
              <strong>1. Vyna Monica</strong> (Followers terlalu besar & ratecard mahal) · <strong>2. Rafli Chaniago</strong> (Tidak cocok / pernah kolab) · <strong>3. Rakhmi Agustina</strong> (Pernah kolab) · <strong>4. Mas Faqih</strong> (Tidak cocok) · <strong>5. Semua influencer yang pernah kolab dengan Optik I See You</strong>.
              <br />
              <span className="text-emerald-900 font-semibold">
                ✅ 3 Opsi Baru Terpasang: <strong>Risma Anjani</strong> (Viral Menara Teratai), <strong>Maria Reres</strong> (Hijab/Fashion OOTD), dan <strong>Alfinda Putri</strong> (Campus Unsoed) — engagement & view sedang naik pesat dengan ratecard bersahabat.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-surface p-4 rounded-card border border-border space-y-3">
        {/* Branch Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {branchOptions.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBranch(b.id)}
              className={`px-3 py-1.5 rounded-control text-xs font-medium whitespace-nowrap transition-all ${
                selectedBranch === b.id
                  ? "bg-foreground text-surface font-semibold shadow-2xs"
                  : "bg-surface-secondary text-foreground-secondary hover:text-foreground hover:bg-surface-tertiary"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Search, Owning Filter, and View Mode */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-border/60">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[220px] flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, handle, atau niche..."
                className="w-full pl-8 pr-3 py-1.5 rounded-control bg-surface-secondary border border-border text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <label className="flex items-center gap-1.5 text-xs text-foreground-secondary cursor-pointer select-none bg-surface-secondary px-2.5 py-1.5 rounded-control border border-border hover:bg-surface-tertiary">
              <input
                type="checkbox"
                checked={onlyCanOwnRaw}
                onChange={(e) => setOnlyCanOwnRaw(e.target.checked)}
                className="rounded border-border text-brand focus:ring-brand"
              />
              <Video className="w-3 h-3 text-violet-500" />
              <span>Hanya yang Siap Owning Raw Ads</span>
            </label>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-control bg-surface-secondary border border-border text-xs text-foreground-secondary focus:outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="Rate Card Diterima">📋 Rate Card Diterima</option>
              <option value="Rekomendasi Utama">⭐ Rekomendasi Utama</option>
              <option value="Opsi Alternatif">Opsi Alternatif</option>
              <option value="Telah Dihubungi">Telah Dihubungi</option>
              <option value="Deal">Deal</option>
            </select>

            <select
              value={focusFilter}
              onChange={(e) => setFocusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-control bg-surface-secondary border border-border text-xs text-foreground-secondary focus:outline-none font-medium"
            >
              <option value="all">🎯 Semua Fokus Konten</option>
              <option value="aesthetic">🎨 Video Aesthetic & Lookbook</option>
              <option value="simple">⚡ Video Simple & Direct / Spill</option>
              <option value="relatable">🎬 Video Relatable / Ngapak / Daily</option>
              <option value="duo">👥 Creative Duo / Couple Lookbook</option>
              <option value="food">🍔 Food & Lifestyle Mix</option>
            </select>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 self-end sm:self-auto">
            <button
              onClick={() => setViewMode("card")}
              className={`p-1.5 rounded-control text-xs border ${
                viewMode === "card"
                  ? "bg-foreground text-surface border-foreground"
                  : "bg-surface-secondary text-foreground-muted border-border hover:text-foreground"
              }`}
              title="Card View"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-control text-xs border ${
                viewMode === "table"
                  ? "bg-foreground text-surface border-foreground"
                  : "bg-surface-secondary text-foreground-muted border-border hover:text-foreground"
              }`}
              title="Table View"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === "card" ? (
        filteredKols.length === 0 ? (
          <div className="bg-surface rounded-card border border-border p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-foreground">Belum Ada Data KOL yang Ditampilkan</h3>
            <p className="text-xs text-foreground-muted max-w-md mx-auto">
              Data KOL sedang kosong atau sesuai filter. Silakan klik tombol &quot;+ Input KOL Terverifikasi (&gt;50K)&quot; di atas untuk menambahkan profil influencer yang valid dan reels aktif.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-control bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-subtle active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Input KOL Baru Sekarang</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredKols.map((kol) => (
            <div
              key={kol.id}
              className="bg-surface rounded-card border border-border shadow-2xs hover:shadow-subtle transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Top */}
              <div className="p-5 space-y-4">
                {/* Branch & Brand Tag */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        kol.brand === "Lunar Eyewear"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {kol.brand}
                    </span>
                    <span className="text-[10px] font-semibold text-foreground-secondary bg-surface-secondary px-2 py-0.5 rounded-full border border-border">
                      {kol.branchName}
                    </span>
                  </div>

                  <select
                    value={kol.status}
                    onChange={(e) => handleStatusChange(kol.id, e.target.value)}
                    className="text-[10px] font-medium px-2 py-0.5 rounded bg-surface-secondary border border-border text-foreground cursor-pointer focus:outline-none"
                  >
                    <option value="Rate Card Diterima">📋 Rate Card Diterima</option>
                    <option value="Rekomendasi Utama">⭐ Rekomendasi Utama</option>
                    <option value="Opsi Alternatif">Opsi Alternatif</option>
                    <option value="Telah Dihubungi">Telah Dihubungi</option>
                    <option value="Deal">✅ Deal</option>
                  </select>
                </div>

                {/* Profile Info */}
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-full bg-brand/10 border-2 border-brand/20 flex items-center justify-center font-bold text-brand text-base overflow-hidden">
                      {kol.profileImg ? (
                        <img
                          src={kol.profileImg}
                          alt={kol.name}
                          className="w-full h-full object-cover object-top"
                          loading="lazy"
                        />
                      ) : (
                        kol.name.charAt(0)
                      )}
                    </div>
                    <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded text-[8px] font-bold bg-foreground text-surface">
                      {kol.socialBladeGrade}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm text-foreground truncate">
                        {kol.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <a
                        href={kol.tiktokUrl || kol.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-brand hover:underline inline-flex items-center gap-0.5 font-medium"
                      >
                        @{kol.handle}
                        <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                      </a>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-surface-secondary text-foreground-muted border border-border">
                        {kol.platform}
                      </span>
                      {kol.videoUrl && (
                        <a
                          href={kol.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-pink-600 hover:text-pink-700 font-semibold inline-flex items-center gap-0.5 bg-pink-500/10 px-1.5 py-0.2 rounded border border-pink-500/20"
                        >
                          <Video className="w-2.5 h-2.5" />
                          Sampel Video
                        </a>
                      )}
                    </div>
                    {kol.contentFocus && (
                      <div className="mt-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200">
                          <Sparkles className="w-2.5 h-2.5 text-violet-600" />
                          <span>Fokus: {kol.contentFocus}</span>
                        </span>
                      </div>
                    )}
                    <p className="text-[11px] text-foreground-muted truncate mt-1">
                      {kol.niche}
                    </p>
                  </div>
                </div>

                {/* Metrics Pill Grid */}
                <div className="grid grid-cols-2 gap-2 bg-surface-secondary/70 p-2.5 rounded-control text-xs">
                  <div>
                    <span className="text-[10px] text-foreground-muted block">Followers</span>
                    <span className="font-bold text-foreground">{kol.followersFormatted}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-foreground-muted block">Engagement Rate</span>
                    <span className="font-bold text-emerald-700">{kol.engagementRate}%</span>
                  </div>
                </div>

                {/* Real Rate Card Breakdown Box (Bahan Diskusi Rapat Selasa) */}
                <div className="p-3 rounded-control bg-surface-secondary border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      Rate Card & Deliverables
                    </span>
                    {kol.rateCard?.bundled && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {kol.rateCard.bundled.includes("Rp") ? kol.rateCard.bundled.split("(")[0].trim() : "Paket Khusus"}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <div className="bg-surface p-1.5 rounded border border-border/60">
                      <span className="text-[9px] text-foreground-muted block">Video Reels / TikTok</span>
                      <span className="font-semibold text-foreground truncate block">{kol.rateCard?.reels || "-"}</span>
                    </div>
                    <div className="bg-surface p-1.5 rounded border border-border/60">
                      <span className="text-[9px] text-foreground-muted block">Story (IG/TikTok)</span>
                      <span className="font-semibold text-foreground truncate block">{kol.rateCard?.story || "-"}</span>
                    </div>
                  </div>

                  {kol.rateCardNote && (
                    <p className="text-[10px] text-foreground-secondary leading-snug bg-amber-500/10 p-1.5 rounded border border-amber-500/20">
                      <strong className="text-amber-950">Detail Paket:</strong> {kol.rateCardNote}
                    </p>
                  )}

                  {/* Tombol Lihat Dokumen/Foto Asli Rate Card */}
                  {(kol.rateCardImage || kol.rateCardPdf || kol.rateCardNote) && (
                    <button
                      onClick={() => setPreviewRateCard(kol)}
                      className="w-full mt-1 py-1.5 px-2.5 rounded-control bg-brand/10 hover:bg-brand/20 text-brand text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors border border-brand/25 active:scale-98"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat Bukti Foto / Dokumen Rate Card Asli</span>
                    </button>
                  )}
                </div>

                {/* Notes from Tim / User Evaluation */}
                {kol.notes && (
                  <div className="p-2.5 rounded-control bg-amber-500/10 border border-amber-500/20 text-xs">
                    <span className="text-[10px] font-bold text-amber-900 block mb-0.5">
                      Catatan Evaluasi & Observasi Tim:
                    </span>
                    <p className="text-[11px] text-amber-950 leading-relaxed font-medium">
                      {kol.notes}
                    </p>
                  </div>
                )}

                {/* Budget & Barter Strategy Tag */}
                <div className="p-2.5 rounded-control bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                  <div className="flex items-center justify-between text-emerald-900 font-bold text-[11px]">
                    <span className="flex items-center gap-1">
                      <Gift className="w-3 h-3 text-emerald-700" />
                      Strategi Penawaran Favorit:
                    </span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                      Acuan Rp 250k
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-snug">
                    Tawarkan <strong>Barter Kacamata Bebas Pilih + Voucher Giveaway Komen</strong>. Bila berbayar, gunakan acuan fee <strong>Rp 250.000</strong>.
                  </p>
                </div>

                {/* Owning Raw Rights (Critical requirement) */}
                <div className="p-2.5 rounded-control border border-violet-200 bg-violet-50/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-violet-900 flex items-center gap-1">
                      <Video className="w-3.5 h-3.5 text-violet-700" />
                      Hak Owning Video Mentahan (Ads)
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-violet-200 text-violet-800">
                      {kol.owningRights.adsUsageDays} Hari Ads
                    </span>
                  </div>
                  <p className="text-[11px] text-violet-800 leading-tight">
                    {kol.owningRights.statusNote}
                  </p>
                  <div className="text-[10px] text-violet-700 pt-0.5 flex justify-between">
                    <span>Biaya Ekstra Owning:</span>
                    <span className="font-semibold">{kol.owningRights.extraFeeEstimate}</span>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-foreground-muted block">
                    Benefit yang Didapat:
                  </span>
                  <ul className="space-y-1 text-[11px] text-foreground-secondary">
                    {kol.benefits.slice(0, 3).map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-snug">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-surface-secondary/80 border-t border-border flex items-center justify-between gap-2">
                <a
                  href={kol.socialBladeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-control bg-surface border border-border text-[11px] font-medium text-foreground hover:bg-surface-tertiary transition-colors"
                >
                  <ExternalLink className="w-3 h-3 text-foreground-muted" />
                  <span>Cek Social Blade</span>
                </a>

                <div className="flex items-center gap-1.5">
                  {kol.contactWa && kol.contactWa !== "-" && (
                    <a
                      href={kol.contactWa.startsWith("08") ? `https://wa.me/62${kol.contactWa.slice(1)}` : kol.contactWa.startsWith("+") ? `https://wa.me/${kol.contactWa.replace(/\+/g, "")}` : `https://wa.me/${kol.contactWa}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1.5 rounded-control bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      title={`Hubungi via WA: ${kol.contactWa}`}
                    >
                      <MessageSquare className="w-3 h-3 text-emerald-700" />
                      <span>WA</span>
                    </a>
                  )}

                  <button
                    onClick={() => setActivePitchModal(kol)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-control bg-brand-light text-brand text-[11px] font-semibold hover:bg-brand/20 transition-colors"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Pilih Kata-Kata WA</span>
                  </button>

                  <button
                    onClick={() => handleCopyPitch(kol)}
                    className="p-1.5 rounded-control bg-foreground text-surface hover:opacity-90 transition-opacity"
                    title="Salin Template Friendly Langsung"
                  >
                    {copiedPitchId === kol.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )
      ) : (
        /* Table View */
        <div className="bg-surface rounded-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface-secondary border-b border-border text-foreground-muted font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">KOL & Gaya Konten</th>
                  <th className="py-3 px-3">Cabang / Brand</th>
                  <th className="py-3 px-3 text-center">Followers</th>
                  <th className="py-3 px-3 text-center">ER (%)</th>
                  <th className="py-3 px-3 text-center">Social Blade</th>
                  <th className="py-3 px-3">Rate Card Resmi</th>
                  <th className="py-3 px-3">Dokumen Bukti</th>
                  <th className="py-3 px-3">Owning Ads</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredKols.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-xs text-foreground-muted">
                      Belum ada data KOL. Silakan sesuaikan filter atau tambahkan data baru.
                    </td>
                  </tr>
                ) : (
                  filteredKols.map((kol) => (
                  <tr key={kol.id} className="hover:bg-surface-secondary/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-brand/10 border border-border flex items-center justify-center font-bold text-brand text-xs">
                          {kol.profileImg ? (
                            <img
                              src={kol.profileImg}
                              alt={kol.name}
                              className="w-full h-full object-cover object-top"
                              loading="lazy"
                            />
                          ) : (
                            kol.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-foreground">{kol.name}</div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <a
                              href={kol.tiktokUrl || kol.instagramUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-brand hover:underline inline-flex items-center gap-0.5"
                            >
                              @{kol.handle}
                              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </a>
                            {kol.contentFocus && (
                              <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-violet-100 text-violet-800">
                                {kol.contentFocus}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-foreground block">{kol.branchName}</span>
                      <span className="text-[10px] text-foreground-muted">{kol.brand}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-foreground">
                      {kol.followersFormatted}
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-emerald-700">
                      {kol.engagementRate}%
                    </td>
                    <td className="py-3 px-3 text-center">
                      <a
                        href={kol.socialBladeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-secondary border border-border text-[10px] font-semibold text-foreground hover:bg-surface-tertiary"
                      >
                        Grade {kol.socialBladeGrade}
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-foreground text-[11px]">
                        {kol.rateCard?.bundled ? kol.rateCard.bundled.split("(")[0].trim() : (kol.rateCard?.reels || "-")}
                      </div>
                      <div className="text-[10px] text-foreground-muted">
                        Reels: {kol.rateCard?.reels?.split("(")[0].trim() || "-"}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {(kol.rateCardImage || kol.rateCardPdf || kol.rateCardNote) ? (
                        <button
                          onClick={() => setPreviewRateCard(kol)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-brand/10 text-brand text-[10px] font-semibold hover:bg-brand/20 transition-colors border border-brand/25"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Lihat Bukti</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-foreground-muted">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-violet-100 text-violet-800">
                        <Video className="w-2.5 h-2.5" />
                        Bisa ({kol.owningRights.adsUsageDays}h)
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-surface-secondary text-foreground border border-border">
                        {kol.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {kol.contactWa && kol.contactWa !== "-" && (
                          <a
                            href={kol.contactWa.startsWith("08") ? `https://wa.me/62${kol.contactWa.slice(1)}` : kol.contactWa.startsWith("+") ? `https://wa.me/${kol.contactWa.replace(/\+/g, "")}` : `https://wa.me/${kol.contactWa}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 px-2 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 text-[10px] font-semibold inline-flex items-center gap-0.5"
                            title={`WA: ${kol.contactWa}`}
                          >
                            <MessageSquare className="w-2.5 h-2.5 text-emerald-700" />
                            <span>WA</span>
                          </a>
                        )}
                        <button
                          onClick={() => setActivePitchModal(kol)}
                          className="px-2.5 py-1 rounded bg-foreground text-surface text-[10px] font-medium hover:opacity-90"
                        >
                          Chat
                        </button>
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PITCH & COPYWRITING MODAL */}
      {activePitchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-card border border-border shadow-elevated max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-brand" />
                  Pilihan Kata-Kata Chat ke {activePitchModal.name}
                </h3>
                <span className="text-xs text-foreground-muted">
                  @{activePitchModal.handle} · {activePitchModal.branchName} ({activePitchModal.brand})
                </span>
              </div>
              <button
                onClick={() => setActivePitchModal(null)}
                className="text-foreground-muted hover:text-foreground p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Pengaturan Pengirim */}
            <div className="flex items-center justify-between bg-surface-secondary p-3 rounded-control text-xs">
              <span className="text-foreground-secondary font-medium">Nama Pengirim Chat:</span>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Contoh: Yossika / Tim Marketing"
                className="px-2.5 py-1 rounded bg-surface border border-border text-foreground font-semibold text-xs focus:outline-none focus:ring-1 focus:ring-brand w-48 text-right"
              />
            </div>

            {/* Template Style Selector Tabs (2-Step Funnel) */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-surface-secondary rounded-control">
              <button
                onClick={() => setTemplateStyle("step1_ratecard")}
                className={`py-2 px-2 text-xs font-semibold rounded text-center transition-all ${
                  templateStyle === "step1_ratecard"
                    ? "bg-foreground text-surface shadow-2xs"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
              >
                💬 1. Tanya Rate Card Dulu
              </button>
              <button
                onClick={() => setTemplateStyle("step2_barter")}
                className={`py-2 px-2 text-xs font-semibold rounded text-center transition-all ${
                  templateStyle === "step2_barter"
                    ? "bg-foreground text-surface shadow-2xs"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
              >
                🎁 2. Tawar Barter + Voucher
              </button>
              <button
                onClick={() => setTemplateStyle("step3_owning")}
                className={`py-2 px-2 text-xs font-semibold rounded text-center transition-all ${
                  templateStyle === "step3_owning"
                    ? "bg-foreground text-surface shadow-2xs"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
              >
                📹 3. Kunci Owning Raw Ads
              </button>
            </div>

            {/* Generated Chat Preview */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-foreground-muted">
                <span className="font-semibold text-foreground">
                  {templateStyle === "step1_ratecard" && "Langkah 1: First Touch (Murni Tanya Rate Card - Tanpa Sebut Barter)"}
                  {templateStyle === "step2_barter" && "Langkah 2: Follow-up (Tawarkan Barter Produk + Voucher Giveaway Komen)"}
                  {templateStyle === "step3_owning" && "Langkah 3: Konfirmasi Final (Hak Owning Video Mentahan Tanpa Watermark)"}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Siap Kirim WA/DM
                </span>
              </div>
              <div className="p-3.5 bg-surface-secondary/70 rounded-control border border-border text-xs text-foreground leading-relaxed whitespace-pre-wrap select-all font-sans">
                {getRenderedChat(activePitchModal, templateStyle)}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <a
                href={activePitchModal.socialBladeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-brand hover:underline inline-flex items-center gap-1 font-medium"
              >
                Buka Social Blade
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePitchModal(null)}
                  className="px-3 py-1.5 rounded-control bg-surface-secondary border border-border text-xs font-medium text-foreground hover:bg-surface-tertiary"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    const text = getRenderedChat(activePitchModal, templateStyle);
                    navigator.clipboard.writeText(text);
                    setCopiedPitchId(activePitchModal.id);
                    setTimeout(() => setCopiedPitchId(null), 2000);
                  }}
                  className="px-4 py-1.5 rounded-control bg-foreground text-surface text-xs font-semibold hover:opacity-90 flex items-center gap-1.5 shadow-subtle active:scale-95"
                >
                  {copiedPitchId === activePitchModal.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Tersalin ke Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Pesan Chat</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ADD VERIFIED KOL MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-card border border-border shadow-elevated max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Input & Verifikasi KOL Baru (&gt;50K Followers)
                </h3>
                <span className="text-xs text-foreground-muted">
                  Pastikan akun Instagram asli, reels ramai, dan bukan akun bodong.
                </span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-foreground-muted hover:text-foreground p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddKol} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground-secondary block">
                    Username / Handle Instagram:
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground-muted">@</span>
                    <input
                      type="text"
                      required
                      value={newKolForm.handle}
                      onChange={(e) => setNewKolForm({ ...newKolForm, handle: e.target.value.replace(/[@]/g, "").trim() })}
                      placeholder="misal: steffievangelis"
                      className="w-full pl-6 pr-3 py-1.5 rounded-control bg-surface-secondary border border-border text-foreground font-semibold text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground-secondary block">
                    Nama Lengkap / Panggilan:
                  </label>
                  <input
                    type="text"
                    required
                    value={newKolForm.name}
                    onChange={(e) => setNewKolForm({ ...newKolForm, name: e.target.value })}
                    placeholder="misal: Steffi Evangelista"
                    className="w-full px-3 py-1.5 rounded-control bg-surface-secondary border border-border text-foreground font-semibold text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                  />
                </div>
              </div>

              {/* Direct Instagram Profile Check Link */}
              {newKolForm.handle && (
                <div className="bg-surface-secondary p-2.5 rounded-control flex items-center justify-between text-[11px]">
                  <span className="text-foreground-secondary">
                    Cek langsung di Instagram untuk verifikasi keaslian:
                  </span>
                  <a
                    href={`https://www.instagram.com/${newKolForm.handle}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    Buka @{newKolForm.handle}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground-secondary block">
                    Cabang Alokasi:
                  </label>
                  <select
                    value={newKolForm.branchId}
                    onChange={(e) => {
                      const bId = e.target.value;
                      const bName = bId === "tegal" ? "Lunar Eyewear Tegal" : bId === "pwt" ? "Purwokerto" : bId === "pbg" ? "Purbalingga" : bId === "clp" ? "Cilacap" : "Wonosobo";
                      setNewKolForm({ ...newKolForm, branchId: bId, branchName: bName });
                    }}
                    className="w-full px-3 py-1.5 rounded-control bg-surface-secondary border border-border text-foreground text-xs focus:outline-none"
                  >
                    <option value="pwt">Purwokerto (Optik I See You)</option>
                    <option value="pbg">Purbalingga (Optik I See You)</option>
                    <option value="clp">Cilacap (Optik I See You)</option>
                    <option value="wsb">Wonosobo (Optik I See You)</option>
                    <option value="tegal">Lunar Eyewear Tegal</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground-secondary block">
                    Estimasi Followers (Min. &gt;50K):
                  </label>
                  <input
                    type="number"
                    value={newKolForm.followers}
                    onChange={(e) => setNewKolForm({ ...newKolForm, followers: e.target.value })}
                    placeholder="Contoh: 75000"
                    className="w-full px-3 py-1.5 rounded-control bg-surface-secondary border border-border text-foreground font-semibold text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground-secondary block">
                  Niche / Kategori Konten:
                </label>
                <input
                  type="text"
                  value={newKolForm.niche}
                  onChange={(e) => setNewKolForm({ ...newKolForm, niche: e.target.value })}
                  placeholder="Contoh: Fashion Hijab, Food & Lifestyle Vlogger"
                  className="w-full px-3 py-1.5 rounded-control bg-surface-secondary border border-border text-foreground text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground-secondary block">
                  Catatan / Bukti Reels Ramai:
                </label>
                <textarea
                  rows={2}
                  value={newKolForm.notes}
                  onChange={(e) => setNewKolForm({ ...newKolForm, notes: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-control bg-surface-secondary border border-border text-foreground text-xs focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-control bg-surface-secondary border border-border text-xs font-medium text-foreground hover:bg-surface-tertiary"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-control bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-subtle flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan & Verifikasi KOL"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RATE CARD DOCUMENT & FLYER PREVIEW MODAL (BAHAN DISKUSI RAPAT SELASA) */}
      {previewRateCard && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface rounded-dialog border border-border shadow-elevated max-w-2xl w-full p-6 space-y-4 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 bg-brand/10 border border-border flex items-center justify-center font-bold text-brand text-sm">
                  {previewRateCard.profileImg ? (
                    <img
                      src={previewRateCard.profileImg}
                      alt={previewRateCard.name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    previewRateCard.name.charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground flex items-center gap-1.5">
                    <span>Dokumen Rate Card: {previewRateCard.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">
                      Terverifikasi Asli
                    </span>
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-foreground-muted">
                    <span>@{previewRateCard.handle}</span>
                    <span>·</span>
                    <span>Cabang {previewRateCard.branchName}</span>
                    <span>·</span>
                    <span className="text-violet-700 font-semibold">{previewRateCard.contentFocus || previewRateCard.niche}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setPreviewRateCard(null)}
                className="text-foreground-muted hover:text-foreground p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-4 pr-1">
              {/* Highlight Ringkasan Paket */}
              <div className="bg-emerald-500/10 border border-emerald-500/25 p-3.5 rounded-control text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-emerald-700" />
                    Penawaran & Deliverables Resmi:
                  </span>
                  {previewRateCard.rateCard?.bundled && (
                    <span className="font-bold text-xs bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                      {previewRateCard.rateCard.bundled.split("(")[0].trim()}
                    </span>
                  )}
                </div>
                <p className="text-emerald-900 font-medium leading-relaxed">
                  {previewRateCard.rateCardNote || previewRateCard.notes}
                </p>
              </div>

              {/* Rincian Paket */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-surface-secondary p-2.5 rounded-control border border-border">
                  <span className="text-[10px] text-foreground-muted block">1x Reels / Video</span>
                  <span className="font-bold text-foreground">{previewRateCard.rateCard?.reels || "-"}</span>
                </div>
                <div className="bg-surface-secondary p-2.5 rounded-control border border-border">
                  <span className="text-[10px] text-foreground-muted block">Story (IG/TikTok)</span>
                  <span className="font-bold text-foreground">{previewRateCard.rateCard?.story || "-"}</span>
                </div>
                <div className="bg-surface-secondary p-2.5 rounded-control border border-border">
                  <span className="text-[10px] text-foreground-muted block">Foto Feeds</span>
                  <span className="font-bold text-foreground">{previewRateCard.rateCard?.feeds || "-"}</span>
                </div>
                <div className="bg-surface-secondary p-2.5 rounded-control border border-border">
                  <span className="text-[10px] text-foreground-muted block">Visit Store</span>
                  <span className="font-bold text-foreground">{previewRateCard.rateCard?.visitStore || "-"}</span>
                </div>
              </div>

              {/* Rate Card Image Preview with Interactive Zoom Toolbar */}
              {previewRateCard.rateCardImage && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground-secondary flex items-center gap-1.5">
                      <span>Foto / Flyer Rate Card Resmi:</span>
                      <span className="text-[10px] text-foreground-muted font-normal">
                        (Klik foto atau tombol zoom untuk perbesar)
                      </span>
                    </span>
                    <div className="flex items-center gap-1 bg-surface-secondary border border-border p-1 rounded-control shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setZoomScale((prev) => Math.max(0.7, Number((prev - 0.25).toFixed(2))))}
                        disabled={zoomScale <= 0.75}
                        className="p-1 rounded text-foreground-muted hover:text-foreground hover:bg-surface disabled:opacity-30 transition-colors"
                        title="Zoom Out (-)"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setZoomScale(1)}
                        className="px-2 py-0.5 text-[10px] font-bold text-foreground hover:bg-surface rounded transition-colors flex items-center gap-1"
                        title="Reset Zoom ke 100%"
                      >
                        <RotateCcw className="w-2.5 h-2.5 opacity-60" />
                        <span>{Math.round(zoomScale * 100)}%</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setZoomScale((prev) => Math.min(3, Number((prev + 0.25).toFixed(2))))}
                        disabled={zoomScale >= 3}
                        className="p-1 rounded text-foreground-muted hover:text-foreground hover:bg-surface disabled:opacity-30 transition-colors"
                        title="Zoom In (+)"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={previewRateCard.rateCardImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded text-foreground-muted hover:text-foreground hover:bg-surface transition-colors ml-1 border-l border-border pl-1.5"
                        title="Buka Foto Asli Resolusi Penuh di Tab Baru"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <div className="rounded-control overflow-auto border border-border bg-slate-950 flex items-center justify-center p-3 min-h-[320px] max-h-[62vh] relative select-none">
                    <div
                      className="transition-transform duration-200 ease-out origin-center inline-block cursor-pointer"
                      style={{
                        transform: `scale(${zoomScale})`,
                      }}
                      onClick={() => setZoomScale((prev) => (prev > 1.2 ? 1 : 2))}
                      title={zoomScale > 1.2 ? "Klik untuk kembalikan ukuran (1x)" : "Klik untuk zoom 2x"}
                    >
                      <img
                        src={previewRateCard.rateCardImage}
                        alt={`Flyer Rate Card ${previewRateCard.name}`}
                        className="max-h-[56vh] object-contain rounded shadow-elevated"
                        draggable={false}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PDF Document Button */}
              {previewRateCard.rateCardPdf && (
                <div className="p-3 bg-surface-secondary rounded-control border border-border flex items-center justify-between">
                  <div className="text-xs">
                    <span className="font-bold text-foreground block">Dokumen Asli (Format PDF)</span>
                    <span className="text-foreground-muted">Tersedia dokumen PDF lengkap dari manajemen talent.</span>
                  </div>
                  <a
                    href={previewRateCard.rateCardPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-control bg-brand text-white text-xs font-semibold hover:bg-brand-hover transition-colors shadow-subtle"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buka PDF di Tab Baru</span>
                  </a>
                </div>
              )}

              {/* Rekomendasi Tim untuk Rapat Selasa */}
              <div className="p-3 bg-violet-50/70 border border-violet-200 rounded-control text-xs space-y-1">
                <span className="font-bold text-violet-950 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-violet-700" />
                  Poin Analisis untuk Rapat Selasa:
                </span>
                <p className="text-violet-900 leading-relaxed">
                  Fokus gaya konten: <strong>{previewRateCard.contentFocus || previewRateCard.niche}</strong>.
                  Hak owning video mentahan iklan: <strong>{previewRateCard.owningRights?.canOwnRaw ? `Bisa Owning (${previewRateCard.owningRights.adsUsageDays} hari Meta Ads)` : "Tidak bisa"}</strong>.
                  {previewRateCard.notes}
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-3 flex items-center justify-between shrink-0">
              {previewRateCard.contactWa && previewRateCard.contactWa !== "-" ? (
                <a
                  href={previewRateCard.contactWa.startsWith("08") ? `https://wa.me/62${previewRateCard.contactWa.slice(1)}` : previewRateCard.contactWa.startsWith("+") ? `https://wa.me/${previewRateCard.contactWa.replace(/\+/g, "")}` : `https://wa.me/${previewRateCard.contactWa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-subtle"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Hubungi Langsung WA ({previewRateCard.contactWa})</span>
                </a>
              ) : (
                <div />
              )}
              <button
                onClick={() => setPreviewRateCard(null)}
                className="px-4 py-1.5 rounded-control bg-foreground text-surface text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
