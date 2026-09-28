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
  Send
} from "lucide-react";
import initialKolData from "@/lib/kol-data.json";

export const KolRadarView: React.FC = () => {
  const [kols, setKols] = useState(initialKolData);
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyCanOwnRaw, setOnlyCanOwnRaw] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [copiedPitchId, setCopiedPitchId] = useState<string | null>(null);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);
  const [activePitchModal, setActivePitchModal] = useState<any | null>(null);
  const [senderName, setSenderName] = useState<string>("Yossika");
  const [templateStyle, setTemplateStyle] = useState<"step1_ratecard" | "step2_barter" | "step3_owning">("step1_ratecard");

  // Branch mapping
  const branchOptions = [
    { id: "all", label: "Semua Cabang (15)" },
    { id: "pwt", label: "Purwokerto (3)", brand: "Optik I See You" },
    { id: "pbg", label: "Purbalingga (3)", brand: "Optik I See You" },
    { id: "clp", label: "Cilacap (3)", brand: "Optik I See You" },
    { id: "wsb", label: "Wonosobo (3)", brand: "Optik I See You" },
    { id: "tegal", label: "Lunar Tegal (3)", brand: "Lunar Eyewear" },
  ];

  // Filtering
  const filteredKols = useMemo(() => {
    return kols.filter((item) => {
      const matchBranch = selectedBranch === "all" || item.branchId === selectedBranch;
      const matchOwning = !onlyCanOwnRaw || item.owningRights.canOwnRaw;
      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      const matchSearch =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.branchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.niche.toLowerCase().includes(searchQuery.toLowerCase());

      return matchBranch && matchOwning && matchStatus && matchSearch;
    });
  }, [kols, selectedBranch, onlyCanOwnRaw, statusFilter, searchQuery]);

  // Aggregate stats
  const totalAudience = useMemo(() => {
    return kols.reduce((acc, curr) => acc + curr.followers, 0);
  }, [kols]);

  const avgER = useMemo(() => {
    const sum = kols.reduce((acc, curr) => acc + curr.engagementRate, 0);
    return (sum / kols.length).toFixed(1);
  }, [kols]);

  const owningReadyCount = useMemo(() => {
    return kols.filter((k) => k.owningRights.canOwnRaw).length;
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
    let report = `📋 *REKAP REKOMENDASI 15 KOL SELEBGRAM (5 CABANG)*\n`;
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
            Kurasi 15 Selebgram Lokal Pilihan (3 opsi per cabang) dengan data Social Blade langsung, 
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
            15 <span className="text-xs font-normal text-foreground-muted">KOL (3 per cabang)</span>
          </div>
          <span className="text-[11px] text-emerald-800 font-medium flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" /> 100% Sesuai Kuota
          </span>
        </div>

        <div className="bg-surface p-4 rounded-card border border-border">
          <div className="flex items-center justify-between text-xs text-foreground-muted mb-1">
            <span>Siap Owning Raw Footage</span>
            <Video className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-xl font-bold text-foreground">
            {owningReadyCount}/15 <span className="text-xs font-normal text-foreground-muted">KOL</span>
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
              <option value="Rekomendasi Utama">Rekomendasi Utama</option>
              <option value="Opsi Alternatif">Opsi Alternatif</option>
              <option value="Telah Dihubungi">Telah Dihubungi</option>
              <option value="Deal">Deal</option>
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
                    <option value="Rekomendasi Utama">⭐ Rekomendasi Utama</option>
                    <option value="Opsi Alternatif">Opsi Alternatif</option>
                    <option value="Telah Dihubungi">Telah Dihubungi</option>
                    <option value="Deal">✅ Deal</option>
                  </select>
                </div>

                {/* Profile Info */}
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-brand/10 border-2 border-brand/20 flex items-center justify-center font-bold text-brand text-base overflow-hidden">
                      {kol.name.charAt(0)}
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
                    <a
                      href={kol.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brand hover:underline inline-flex items-center gap-0.5 font-medium"
                    >
                      @{kol.handle}
                      <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                    </a>
                    <p className="text-[11px] text-foreground-muted truncate mt-0.5">
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
      ) : (
        /* Table View */
        <div className="bg-surface rounded-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface-secondary border-b border-border text-foreground-muted font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">KOL / Handle</th>
                  <th className="py-3 px-3">Cabang / Brand</th>
                  <th className="py-3 px-3 text-center">Followers</th>
                  <th className="py-3 px-3 text-center">ER (%)</th>
                  <th className="py-3 px-3 text-center">Social Blade</th>
                  <th className="py-3 px-3">Skema Budget / Fee</th>
                  <th className="py-3 px-3">Owning Raw Video</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredKols.map((kol) => (
                  <tr key={kol.id} className="hover:bg-surface-secondary/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-foreground">{kol.name}</div>
                      <a
                        href={kol.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-brand hover:underline inline-flex items-center gap-0.5"
                      >
                        @{kol.handle}
                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </a>
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
                    <td className="py-3 px-3 font-medium text-emerald-800">
                      Rp 250k / Barter + Voucher
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-violet-100 text-violet-800">
                        <Video className="w-2.5 h-2.5" />
                        Bisa Owning ({kol.owningRights.adsUsageDays}h)
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-surface-secondary text-foreground border border-border">
                        {kol.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setActivePitchModal(kol)}
                        className="px-2.5 py-1 rounded bg-foreground text-surface text-[10px] font-medium hover:opacity-90"
                      >
                        Pilih Kata-Kata
                      </button>
                    </td>
                  </tr>
                ))}
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
    </div>
  );
};
