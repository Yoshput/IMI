"use client";

import React, { useState, useMemo } from "react";
import {
  X,
  User,
  Calendar,
  Instagram,
  FileSpreadsheet,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  HelpCircle,
  Send,
  Eye,
  Heart,
  Share2,
  Copy,
  ChevronRight,
  Radio,
  BarChart3,
  ThumbsUp,
  MessageCircle,
} from "lucide-react";

export interface PicTrackerItem {
  pic: string;
  role: string;
  branch: string;
  sheetKey: string;
  latestDate: string;
  totalEntries: number;
  isUpToDate: boolean;
  daysBehind?: number;
  statusText: string;
  whatsappReminder?: string;
}

interface PicDetailModalProps {
  pic: PicTrackerItem;
  nuhaStory?: any[];
  branchReels?: any[];
  onClose: () => void;
}

export const PicDetailModal: React.FC<PicDetailModalProps> = ({
  pic,
  nuhaStory = [],
  branchReels = [],
  onClose,
}) => {
  const isNuha = pic.pic.toLowerCase() === "nuha";
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "issues">("overview");
  const [copiedWa, setCopiedWa] = useState(false);

  // Determine Instagram Profile & Brand Info
  const branchMeta = useMemo(() => {
    const key = pic.sheetKey.toLowerCase();
    if (key.includes("tgl")) {
      return {
        brandName: "Lunar Eyewear Tegal",
        brandType: "Second Brand Mandiri",
        igHandle: "@lunareyewear.co",
        igUrl: "https://www.instagram.com/lunareyewear.co",
        sheetGid: "0",
        colorTheme: "amber",
      };
    }
    if (key.includes("pbg")) {
      return {
        brandName: "Optik I See You Purbalingga",
        brandType: "Cabang Optik I See You",
        igHandle: "@iseeyou.purbalingga",
        igUrl: "https://www.instagram.com/iseeyou.purbalingga/",
        sheetGid: "1",
        colorTheme: "emerald",
      };
    }
    if (key.includes("clp")) {
      return {
        brandName: "Optik I See You Cilacap",
        brandType: "Cabang Optik I See You",
        igHandle: "@iseeyou.cilacap",
        igUrl: "https://www.instagram.com/iseeyou.cilacap/",
        sheetGid: "2",
        colorTheme: "blue",
      };
    }
    if (key.includes("wns")) {
      return {
        brandName: "Optik I See You Wonosobo",
        brandType: "Cabang Optik I See You",
        igHandle: "@iseeyou.wonosobo",
        igUrl: "https://www.instagram.com/iseeyou.wonosobo/",
        sheetGid: "3",
        colorTheme: "teal",
      };
    }
    // PWT (Nuha or Ilya)
    return {
      brandName: "Optik I See You Purwokerto (Pusat)",
      brandType: "Pusat Optik I See You",
      igHandle: "@iseeyou.glasses",
      igUrl: "https://www.instagram.com/iseeyou.glasses/",
      sheetGid: "4",
      colorTheme: "brand",
    };
  }, [pic]);

  // Google Sheets master URL
  const masterSheetUrl =
    "https://docs.google.com/spreadsheets/d/1BU0fIDP656Y-eue55bWVSxeaixSeFJwR3GP1n8kwBYc/edit?usp=sharing";

  // Data processing for Nuha (Story & DM)
  const nuhaAnalytics = useMemo(() => {
    if (!isNuha || !nuhaStory.length) return null;

    const validRows = nuhaStory.filter((r) => r.reportDate);
    const totalStories = validRows.reduce((sum, r) => sum + (Number(r.storiesUploaded) || 0), 0);
    const totalDms = validRows.reduce((sum, r) => sum + (Number(r.dmInquiries) || 0), 0);
    const avgViewers =
      validRows.length > 0
        ? Math.round(
            validRows.reduce((sum, r) => sum + (Number(r.maxViewers) || 0), 0) / validRows.length
          )
        : 0;

    // Topics frequency
    const topicCount: Record<string, number> = {};
    validRows.forEach((r) => {
      const q = (r.frequentQuestions || "").trim();
      if (q && q !== "-") {
        topicCount[q] = (topicCount[q] || 0) + 1;
      }
    });
    const topTopics = Object.entries(topicCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Filter obstacles / issues recorded
    const rawObstacles = validRows
      .filter((r) => r.obstacle && r.obstacle !== "-" && r.obstacle.trim() !== "")
      .map((r) => ({
        date: r.reportDate,
        obstacle: r.obstacle,
        areaToImprove: r.areaToImprove,
        achievement: r.achievement,
      }));

    return {
      totalEntries: validRows.length,
      totalStories,
      totalDms,
      avgViewers,
      topTopics,
      obstacles: rawObstacles,
      recentLogs: validRows.slice(-15).reverse(),
    };
  }, [isNuha, nuhaStory]);

  // Data processing for Reels Creators (Ilya, Ajun, Amanda, Arum, Febi)
  const creatorAnalytics = useMemo(() => {
    if (isNuha || !branchReels.length) return null;

    const validReels = branchReels.filter(
      (r) => !r.isDayOff && r.reelsTitle && r.reelsTitle !== "-" && r.reelsTitle.length > 1
    );

    const totalViewers = validReels.reduce((sum, r) => sum + (Number(r.viewers) || 0), 0);
    const totalLikes = validReels.reduce(
      (sum, r) => sum + (Number(r.sheetLikes || r.likes) || 0),
      0
    );
    const avgViewers = validReels.length > 0 ? Math.round(totalViewers / validReels.length) : 0;

    // Find top trending and lowest evaluated
    const sortedByViewers = [...validReels].sort((a, b) => (b.viewers || 0) - (a.viewers || 0));
    const topReel = sortedByViewers[0] || null;
    const evaluatedReels = validReels.filter((r) => r.isEvaluated && r.viewers > 0);
    const lowestReel =
      evaluatedReels.length > 1 ? evaluatedReels[evaluatedReels.length - 1] : null;

    // Content pillars breakdown
    const pillarCount: Record<string, { count: number; viewers: number }> = {};
    validReels.forEach((r) => {
      const p = r.contentPillar || "Umum";
      if (!pillarCount[p]) pillarCount[p] = { count: 0, viewers: 0 };
      pillarCount[p].count += 1;
      pillarCount[p].viewers += Number(r.viewers) || 0;
    });

    const pillarsList = Object.entries(pillarCount).map(([name, stat]) => ({
      name,
      count: stat.count,
      avgViewers: Math.round(stat.viewers / stat.count),
    }));

    // Obstacles / notes
    const rawObstacles = validReels
      .filter((r) => r.obstacle && r.obstacle !== "-" && r.obstacle.trim() !== "")
      .map((r) => ({
        date: r.uploadDate || r.reportDate,
        title: r.reelsTitle,
        obstacle: r.obstacle,
      }));

    return {
      totalReels: validReels.length,
      totalViewers,
      totalLikes,
      avgViewers,
      topReel,
      lowestReel,
      pillarsList,
      obstacles: rawObstacles,
      recentReels: validReels.slice(-15).reverse(),
    };
  }, [isNuha, branchReels]);

  // WhatsApp Message Generator
  const waMessage = useMemo(() => {
    if (pic.isUpToDate) {
      return `Halo Kak ${pic.pic} (${pic.role}), terima kasih atas dedikasinya. Laporan spreadsheet ${pic.sheetKey} sudah tercatat lengkap dan up-to-date per tanggal ${pic.latestDate}. Pertahankan konsistensi performanya.`;
    }
    return `Halo Kak ${pic.pic} (${pic.role}), mengingatkan untuk pengisian laporan harian di Spreadsheet "${pic.sheetKey}". Data terakhir tercatat per tanggal ${pic.latestDate} (tertunda ${pic.daysBehind || 1} hari). Mohon bantuannya untuk diupdate sebelum evaluasi berikutnya. Terima kasih.`;
  }, [pic]);

  const handleCopyWa = () => {
    navigator.clipboard.writeText(waMessage);
    setCopiedWa(true);
    setTimeout(() => setCopiedWa(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-surface border border-border rounded-container shadow-2xl w-full max-w-4xl max-h-[90dvh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-border bg-surface-secondary/70 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-foreground text-surface flex items-center justify-center font-bold text-sm shadow-subtle shrink-0">
              {pic.pic.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground flex items-center gap-1.5">
                  Profil &amp; Audit Data: {pic.pic}
                </h2>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    pic.isUpToDate
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                  }`}
                >
                  {pic.isUpToDate ? "Lengkap" : `Tertunda (${pic.daysBehind || 1} hari)`}
                </span>
              </div>
              <p className="text-xs text-foreground-secondary mt-0.5">
                {pic.role} · <strong className="text-foreground">{branchMeta.brandName}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-border/60 flex items-center justify-center text-foreground-muted hover:text-foreground transition-all shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Header Ribbon */}
        <div className="px-5 py-3 bg-surface border-b border-border flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-foreground-muted">
            <Clock className="w-3.5 h-3.5" />
            <span>
              Update Spreadsheet Terakhir:{" "}
              <strong className="text-foreground font-mono">{pic.latestDate}</strong>
            </span>
            <span>·</span>
            <span>{pic.totalEntries} entri tercatat</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyWa}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface-secondary text-foreground hover:border-foreground-muted font-semibold transition-all shadow-2xs text-[11px]"
            >
              {copiedWa ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pesan Tersalin!</span>
                </>
              ) : (
                <>
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Salin Chat WA PIC</span>
                </>
              )}
            </button>

            <a
              href={masterSheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface-secondary text-foreground hover:border-foreground-muted font-semibold transition-all shadow-2xs text-[11px]"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-green-600" />
              <span>Buka Google Sheets</span>
              <ExternalLink className="w-3 h-3 text-foreground-muted" />
            </a>

            <a
              href={branchMeta.igUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground text-surface font-semibold hover:opacity-90 transition-all shadow-subtle text-[11px]"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
              <span>{branchMeta.igHandle}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-4 px-5 border-b border-border bg-surface-secondary/40 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 border-b-2 transition-all ${
              activeTab === "overview"
                ? "border-foreground text-foreground"
                : "border-transparent text-foreground-muted hover:text-foreground"
            }`}
          >
            Ikhtisar &amp; KPI Jobdesk
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`py-3 border-b-2 transition-all ${
              activeTab === "history"
                ? "border-foreground text-foreground"
                : "border-transparent text-foreground-muted hover:text-foreground"
            }`}
          >
            {isNuha ? "Riwayat Story & DM Harian" : "Katalog Riwayat Seluruh Reels"}
          </button>
          <button
            onClick={() => setActiveTab("issues")}
            className={`py-3 border-b-2 transition-all ${
              activeTab === "issues"
                ? "border-foreground text-foreground"
                : "border-transparent text-foreground-muted hover:text-foreground"
            }`}
          >
            Keluhan &amp; Catatan Lapangan
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* ======================= TAB 1: OVERVIEW ======================= */}
          {activeTab === "overview" && (
            <div className="space-y-5">
              {/* Jobdesk Definition Card */}
              <div className="p-4 rounded-xl border border-border bg-surface-secondary/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-foreground-muted">
                    Spesifikasi Jobdesk &amp; Peran Resmi
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-light text-brand">
                    {branchMeta.brandType}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-foreground">
                  {isNuha
                    ? "Manajemen Story Instagram, DM Masuk, & Pemantauan Kecepatan Respon CS"
                    : `Produksi Konten Reels, Visual Try-On Kacamata, & Pertumbuhan Audiens ${pic.branch}`}
                </h3>
                <p className="text-xs text-foreground-secondary leading-relaxed">
                  {isNuha
                    ? "Nuha bertanggung jawab mengelola engagement harian melalui Instagram Story (minimal 10–14 story/hari), merekap keluhan serta pertanyaan frame/lensa yang masuk lewat DM, memposting ke Saluran Siaran (Broadcast Channel), dan mengevaluasi kecepatan tim CS dalam membalas chat pelanggan."
                    : `${pic.pic} bertugas merancang ide konten, take video try-on frame, editing, serta upload Reels berkala di akun Instagram ${branchMeta.igHandle}. Memantau performa H+3 (viewers & likes) untuk memastikan pertumbuhan audiens di wilayah ${pic.branch}.`}
                </p>
              </div>

              {/* KPI Metrics Cards */}
              {isNuha && nuhaAnalytics && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl border border-border bg-surface">
                    <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                      Total Story Terdata
                    </span>
                    <div className="text-xl font-bold text-foreground tabular-nums mt-0.5">
                      {nuhaAnalytics.totalStories.toLocaleString("id-ID")}{" "}
                      <span className="text-xs font-normal text-foreground-muted">story</span>
                    </div>
                    <span className="text-[10px] text-foreground-muted block mt-0.5">
                      Dari {nuhaAnalytics.totalEntries} hari laporan
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border bg-surface">
                    <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                      Total DM Pelanggan
                    </span>
                    <div className="text-xl font-bold text-foreground tabular-nums mt-0.5">
                      {nuhaAnalytics.totalDms.toLocaleString("id-ID")}{" "}
                      <span className="text-xs font-normal text-foreground-muted">DM</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                      Tanya frame, minus, lensa
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border bg-surface">
                    <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                      Rata-rata Viewers Max
                    </span>
                    <div className="text-xl font-bold text-foreground tabular-nums mt-0.5">
                      {nuhaAnalytics.avgViewers.toLocaleString("id-ID")}
                    </div>
                    <span className="text-[10px] text-foreground-muted block mt-0.5">
                      Per hari posting story
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border bg-surface">
                    <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                      Status CS Respon
                    </span>
                    <div className="text-base font-bold text-emerald-600 truncate mt-1">
                      Fast Respon
                    </div>
                    <span className="text-[10px] text-foreground-muted block mt-0.5">
                      Monitoring harian Nuha
                    </span>
                  </div>
                </div>
              )}

              {!isNuha && creatorAnalytics && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl border border-border bg-surface">
                    <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                      Total Reels Dibuat
                    </span>
                    <div className="text-xl font-bold text-foreground tabular-nums mt-0.5">
                      {creatorAnalytics.totalReels}{" "}
                      <span className="text-xs font-normal text-foreground-muted">video</span>
                    </div>
                    <span className="text-[10px] text-foreground-muted block mt-0.5">
                      Tercatat di Google Sheets
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border bg-surface">
                    <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                      Total Viewers H+3
                    </span>
                    <div className="text-xl font-bold text-foreground tabular-nums mt-0.5">
                      {creatorAnalytics.totalViewers.toLocaleString("id-ID")}
                    </div>
                    <span className="text-[10px] text-foreground-muted block mt-0.5">
                      Jangkauan video terakumulasi
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border bg-surface">
                    <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                      Rata-rata Viewers
                    </span>
                    <div className="text-xl font-bold text-foreground tabular-nums mt-0.5">
                      {creatorAnalytics.avgViewers.toLocaleString("id-ID")}
                    </div>
                    <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                      Per reels diupload
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border bg-surface">
                    <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                      Total Likes Sheet
                    </span>
                    <div className="text-xl font-bold text-foreground tabular-nums mt-0.5">
                      {creatorAnalytics.totalLikes.toLocaleString("id-ID")}
                    </div>
                    <span className="text-[10px] text-foreground-muted block mt-0.5">
                      Respons audiens H+3
                    </span>
                  </div>
                </div>
              )}

              {/* Spotlight Content */}
              {isNuha && nuhaAnalytics && (
                <div className="p-4 rounded-xl border border-border bg-surface space-y-3">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-brand" />
                    Topik Pertanyaan / DM Paling Sering Diajukan Customer
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {nuhaAnalytics.topTopics.map(([topic, count], idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg border border-border bg-surface-secondary/40 flex items-center justify-between"
                      >
                        <span className="text-foreground font-semibold truncate">
                          {idx + 1}. {topic}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-foreground/10 text-foreground font-mono font-bold shrink-0">
                          {count} hari
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!isNuha && creatorAnalytics && creatorAnalytics.topReel && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Top Reel */}
                  <div className="p-4 rounded-xl border border-border bg-surface-secondary/40 space-y-2">
                    <div className="flex items-center justify-between text-foreground font-bold text-[11px]">
                      <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px] text-foreground-muted">
                        <TrendingUp className="w-3.5 h-3.5 text-foreground" />
                        Reels Terbaik {pic.pic}
                      </span>
                      <span className="font-mono text-emerald-600">{creatorAnalytics.topReel.viewers?.toLocaleString("id-ID")} Viewers</span>
                    </div>
                    <h5 className="text-xs font-bold text-foreground line-clamp-2">
                      &quot;{creatorAnalytics.topReel.reelsTitle}&quot;
                    </h5>
                    <div className="flex items-center gap-2 text-[10px] text-foreground-muted">
                      <span>Pilar: {creatorAnalytics.topReel.contentPillar}</span>
                      <span>·</span>
                      <span>Upload: {creatorAnalytics.topReel.uploadDate}</span>
                    </div>
                    {creatorAnalytics.topReel.reelsLink && (
                      <a
                        href={creatorAnalytics.topReel.reelsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-brand hover:underline pt-1"
                      >
                        <span>Tonton di Instagram</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Pilar Breakdown */}
                  <div className="p-4 rounded-xl border border-border bg-surface space-y-2">
                    <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                      Distribusi Pilar Konten
                    </span>
                    <div className="space-y-1.5">
                      {creatorAnalytics.pillarsList.map((p, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[11px]">
                          <span className="text-foreground font-medium truncate">{p.name}</span>
                          <span className="text-foreground-muted font-mono">
                            {p.count} reels (~{p.avgViewers.toLocaleString("id-ID")} v)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================= TAB 2: HISTORY ======================= */}
          {activeTab === "history" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-foreground">
                  {isNuha
                    ? "Log Aktivitas Story & DM 15 Hari Terakhir (Google Sheets)"
                    : `Daftar 15 Reels Terakhir Dibuat oleh ${pic.pic}`}
                </h4>
                <span className="text-[10px] text-foreground-muted">Live Sync Data</span>
              </div>

              {isNuha && nuhaAnalytics && (
                <div className="overflow-x-auto border border-border rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface-secondary text-foreground-secondary border-b border-border text-[10px] uppercase font-semibold">
                      <tr>
                        <th className="py-2 px-3">Tanggal</th>
                        <th className="py-2 px-3 text-center">Story</th>
                        <th className="py-2 px-3 text-right">Viewers Max</th>
                        <th className="py-2 px-3 text-right">DM Masuk</th>
                        <th className="py-2 px-3">Topik Utama</th>
                        <th className="py-2 px-3">Saluran Broadcast</th>
                        <th className="py-2 px-3">CS Respon</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {nuhaAnalytics.recentLogs.map((row: any, idx: number) => (
                        <tr key={idx} className="hover:bg-surface-secondary/40">
                          <td className="py-2 px-3 font-mono font-medium text-foreground">
                            {row.reportDate}
                          </td>
                          <td className="py-2 px-3 text-center font-bold text-brand">
                            {row.storiesUploaded}
                          </td>
                          <td className="py-2 px-3 text-right tabular-nums font-semibold">
                            {row.maxViewers?.toLocaleString("id-ID")}
                          </td>
                          <td className="py-2 px-3 text-right tabular-nums text-emerald-600 font-bold">
                            {row.dmInquiries}
                          </td>
                          <td className="py-2 px-3 text-foreground-secondary max-w-[180px] truncate">
                            {row.frequentQuestions || "-"}
                          </td>
                          <td className="py-2 px-3 text-[11px] text-foreground-muted max-w-[140px] truncate">
                            {row.channelBroadcast || "-"}
                          </td>
                          <td className="py-2 px-3 text-[11px] text-foreground-secondary">
                            {row.csResponseSpeed || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {!isNuha && creatorAnalytics && (
                <div className="overflow-x-auto border border-border rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface-secondary text-foreground-secondary border-b border-border text-[10px] uppercase font-semibold">
                      <tr>
                        <th className="py-2 px-3">Tanggal Upload</th>
                        <th className="py-2 px-3">Judul Konten Reels</th>
                        <th className="py-2 px-3">Pilar</th>
                        <th className="py-2 px-3 text-right">Viewers H+3</th>
                        <th className="py-2 px-3 text-right">Likes IG Realtime</th>
                        <th className="py-2 px-3 text-center">Tautan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {creatorAnalytics.recentReels.map((reel: any, idx: number) => (
                        <tr key={idx} className="hover:bg-surface-secondary/40">
                          <td className="py-2.5 px-3 font-mono text-foreground-muted whitespace-nowrap">
                            {reel.uploadDate || reel.reportDate}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-foreground max-w-[220px]">
                            <div className="font-semibold line-clamp-1">{reel.reelsTitle}</div>
                            {reel.igCaption && (
                              <span className="text-[10px] text-foreground-muted line-clamp-1 block">
                                Caption: {reel.igCaption.slice(0, 70)}...
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap text-foreground-secondary">
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-foreground/5 border border-border">
                              {reel.contentPillar || "Umum"}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold tabular-nums text-foreground whitespace-nowrap">
                            {reel.viewers ? reel.viewers.toLocaleString("id-ID") : "-"}
                          </td>
                          <td className="py-2.5 px-3 text-right tabular-nums text-emerald-600 font-semibold whitespace-nowrap">
                            {reel.igLikesFormatted ||
                              (reel.sheetLikes ? `${reel.sheetLikes} (H+3)` : "-")}
                          </td>
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            {reel.reelsLink ? (
                              <a
                                href={reel.reelsLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-brand hover:underline"
                              >
                                <span>Buka IG</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-foreground-muted">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ======================= TAB 3: ISSUES & KELUHAN LAPANGAN ======================= */}
          {activeTab === "issues" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-900 dark:text-amber-200">
                <h4 className="text-xs font-bold flex items-center gap-1.5 mb-1">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  Catatan Kendala &amp; Evaluasi Lapangan Asli dari Google Sheets
                </h4>
                <p className="text-[11px] leading-relaxed opacity-90">
                  Data berikut merupakan keluhan atau kendala nyata yang ditulis langsung oleh{" "}
                  <strong>{pic.pic}</strong> saat mengisi formulir rekap harian, untuk menjadi bahan
                  evaluasi manajemen.
                </p>
              </div>

              {isNuha && nuhaAnalytics && (
                <div className="space-y-3">
                  {nuhaAnalytics.obstacles.length > 0 ? (
                    nuhaAnalytics.obstacles.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border border-border bg-surface-secondary/40 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-foreground font-mono">
                            Tanggal: {item.date}
                          </span>
                          <span className="text-foreground-muted">PIC: Nuha</span>
                        </div>
                        <div className="text-xs text-foreground">
                          <strong className="text-amber-700 dark:text-amber-400">Kendala:</strong>{" "}
                          {item.obstacle}
                        </div>
                        {item.areaToImprove && item.areaToImprove !== "-" && (
                          <div className="text-[11px] text-foreground-secondary">
                            <strong>Rencana Perbaikan:</strong> {item.areaToImprove}
                          </div>
                        )}
                        {item.achievement && item.achievement !== "-" && (
                          <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                            <strong>Pencapaian:</strong> {item.achievement}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-foreground-muted text-xs border border-dashed border-border rounded-xl">
                      Tidak ada kendala kritis yang dicatat Nuha pada periode ini. Operasional Story
                      &amp; DM berjalan lancar.
                    </div>
                  )}
                </div>
              )}

              {!isNuha && creatorAnalytics && (
                <div className="space-y-3">
                  {creatorAnalytics.obstacles.length > 0 ? (
                    creatorAnalytics.obstacles.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border border-border bg-surface-secondary/40 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-foreground font-mono">
                            Tanggal: {item.date}
                          </span>
                          <span className="text-foreground-muted">PIC: {pic.pic}</span>
                        </div>
                        <div className="text-xs font-semibold text-foreground">
                          Konten: &quot;{item.title}&quot;
                        </div>
                        <div className="text-xs text-amber-700 dark:text-amber-400">
                          <strong>Kendala:</strong> {item.obstacle}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-foreground-muted text-xs border border-dashed border-border rounded-xl">
                      Belum ada keluhan atau kendala teknis yang dilaporkan oleh {pic.pic} pada
                      rekap reels terbaru.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-border bg-surface-secondary/50 flex items-center justify-between gap-3 text-xs shrink-0">
          <span className="text-[11px] text-foreground-muted">
            Data live disinkronkan otomatis dari Google Sheets master I See You.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-control bg-foreground text-surface font-semibold hover:opacity-90 transition-all shadow-subtle"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
