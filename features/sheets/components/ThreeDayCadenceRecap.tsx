"use client";

import React, { useState } from "react";
import {
  Calendar,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Video,
  Eye,
  Heart,
  Award,
  AlertCircle,
  TrendingUp,
  Share2,
  Printer,
  ChevronRight,
  ShieldCheck,
  Building2,
  Clock,
  Layers,
  ZoomIn,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { AppleMediaSheet, AppleMediaItem } from "@/components/shared/AppleMediaSheet";

interface ThreeDayCadenceRecapProps {
  storyData: any[];
  branchReels: Record<string, any[]>;
  picTracker: any[];
  bonusSummary?: any;
  spreadsheetFollowersByBranch?: Record<string, any>;
}

export const ThreeDayCadenceRecap: React.FC<ThreeDayCadenceRecapProps> = ({
  storyData,
  branchReels,
  picTracker,
  bonusSummary,
  spreadsheetFollowersByBranch,
}) => {
  const [selectedCycle, setSelectedCycle] = useState<"cycle-1" | "cycle-2" | "cycle-current" | "full-week">("cycle-current");
  const [copiedText, setCopiedText] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [selectedMediaItem, setSelectedMediaItem] = useState<AppleMediaItem | null>(null);

  // Cycle definitions
  const cycles = {
    "cycle-1": {
      id: "cycle-1",
      name: "Siklus 1 (8–10 Sep 2026)",
      periodLabel: "8 s/d 10 September 2026",
      status: "Selesai Evaluasi H+3",
      startDate: "2026-09-08",
      endDate: "2026-09-10",
      description: "Fokus awal pekan: campaign promo awal bulan & testing pilar konten adaptif/POV.",
    },
    "cycle-2": {
      id: "cycle-2",
      name: "Siklus 2 (11–13 Sep 2026)",
      periodLabel: "11 s/d 13 September 2026",
      status: "Selesai Evaluasi H+3",
      startDate: "2026-09-11",
      endDate: "2026-09-13",
      description: "Fokus akhir pekan: konten edukasi lensa, restock kacamata, dan tren viral akhir pekan.",
    },
    "cycle-current": {
      id: "cycle-current",
      name: "Siklus 3 (14–17 Sep 2026) — Berjalan Menuju Selasa Depan",
      periodLabel: "14 s/d 17 September 2026 (Live Monitor H-7)",
      status: "Pemantauan Berjalan (Siap untuk Rapat Selasa 22 Sep)",
      startDate: "2026-09-14",
      endDate: "2026-09-17",
      description: "Persiapan rapat mingguan hari Selasa depan: evaluasi video terbaru dan kepatuhan creator.",
    },
    "full-week": {
      id: "full-week",
      name: "Rangkuman 1 Minggu Penuh (Meeting Evaluasi Mingguan)",
      periodLabel: "8 s/d 14 September 2026",
      status: "Laporan Resmi Direksi",
      startDate: "2026-09-08",
      endDate: "2026-09-14",
      description: "Rangkuman komprehensif 7 hari untuk dipresentasikan ke Owner, HRD, Head, dan Finance.",
    },
  };

  const activeCycle = cycles[selectedCycle];

  // Filter Story Data for active cycle
  const filteredStories = storyData.filter((s) => {
    if (!s.reportDate) return false;
    return s.reportDate >= activeCycle.startDate && s.reportDate <= activeCycle.endDate;
  });

  // Calculate Story Stats
  const totalStoriesUploaded = filteredStories.reduce((acc, s) => acc + (s.storiesUploaded || 0), 0);
  const maxStoryViewers = Math.max(...filteredStories.map((s) => s.maxViewers || 0), 0);
  const minStoryViewers = Math.min(...filteredStories.map((s) => s.minViewers || 99999).filter((v) => v > 0), 0);
  const totalDMs = filteredStories.reduce((acc, s) => acc + (s.dmInquiries || 0), 0);

  // Group DM Inquiries
  const dmInquiriesList: { topic: string; count: number }[] = [];
  const inquiryMap: Record<string, number> = {};
  filteredStories.forEach((s) => {
    if (s.frequentQuestions && s.frequentQuestions !== "-") {
      const parts = s.frequentQuestions.split(/[,;\n]/).map((p: string) => p.trim()).filter(Boolean);
      parts.forEach((p: string) => {
        inquiryMap[p] = (inquiryMap[p] || 0) + 1;
      });
    }
  });
  Object.entries(inquiryMap)
    .sort((a, b) => b[1] - a[1])
    .forEach(([topic, count]) => {
      dmInquiriesList.push({ topic, count });
    });

  // Filter Reels from all branches
  const reelsByBranch: Record<string, any[]> = {
    PWT: [],
    PBG: [],
    TGL: [],
    CLP: [],
    WNS: [],
  };

  const branchKeyMap: Record<string, string> = {
    "Rekap PWT": "PWT",
    "Rekap PBG": "PBG",
    "Rekap TGL": "TGL",
    "Rekap CLP": "CLP",
    "Rekap WNS": "WNS",
  };

  const branchNames: Record<string, { name: string; city: string; pic: string }> = {
    PWT: { name: "Purwokerto (Pusat)", city: "Purwokerto", pic: "Ilya" },
    PBG: { name: "Purbalingga", city: "Purbalingga", pic: "Ajun" },
    TGL: { name: "Lunar Eyewear Tegal", city: "Tegal", pic: "Amanda" },
    CLP: { name: "Cilacap", city: "Cilacap", pic: "Arum" },
    WNS: { name: "Wonosobo", city: "Wonosobo", pic: "Febi" },
  };

  Object.entries(branchReels).forEach(([sheetKey, list]) => {
    const key = branchKeyMap[sheetKey];
    if (key && Array.isArray(list)) {
      list.forEach((r) => {
        const d = r.uploadDate || r.reportDate;
        if (!r.isDayOff && r.reelsTitle && d && d >= activeCycle.startDate && d <= activeCycle.endDate) {
          reelsByBranch[key].push(r);
        }
      });
    }
  });

  const totalReelsUploadedInCycle = Object.values(reelsByBranch).reduce((acc, list) => acc + list.length, 0);

  // Top performers in this cycle
  const allReelsInCycle: any[] = [];
  Object.entries(reelsByBranch).forEach(([key, list]) => {
    list.forEach((r) => allReelsInCycle.push({ ...r, branchKey: key }));
  });
  allReelsInCycle.sort((a, b) => (b.viewers || 0) - (a.viewers || 0));

  // Copy WhatsApp summary for boss / management meeting
  const handleCopyWhatsApp = () => {
    const waText = `*LAPORAN REKAP MARKETING INTELLIGENCE — OPTIK I SEE YOU & LUNAR*
Agenda: ${activeCycle.name}
Periode: ${activeCycle.periodLabel}
Status: ${activeCycle.status}

=============================
*1. REKAP KONTEN STORY INSTAGRAM (Nuha - Purwokerto)*
• Total Story Terupload: ${totalStoriesUploaded} story
• Viewers Tertinggi: ${maxStoryViewers.toLocaleString("id-ID")} penonton
• Viewers Terendah: ${minStoryViewers > 0 ? minStoryViewers.toLocaleString("id-ID") : "-"} penonton
• Total DM Masuk: ${totalDMs} DM
• Topik DM Paling Sering Ditanyakan:
${dmInquiriesList.slice(0, 4).map((q) => `  - ${q.topic} (${q.count} hari ditanyakan)`).join("\n") || "  - Tidak ada data DM khusus"}
• Pemantauan CS: Fast respon

=============================
*2. REKAP KONTEN REELS INSTAGRAM 5 CABANG*
• Total Reels Terupload: ${totalReelsUploadedInCycle} video
${Object.entries(reelsByBranch).map(([key, list]) => {
  const b = branchNames[key];
  if (list.length === 0) {
    return `• ${b.name} (PIC: ${b.pic}): Belum ada video baru tercatat`;
  }
  return `• ${b.name} (PIC: ${b.pic}) [${list.length} video]:\n` +
    list.map((r, i) => `  ${i + 1}. "${r.reelsTitle}" — ${Number(r.viewers || 0).toLocaleString("id-ID")} viewers | ${Number(r.likes || 0).toLocaleString("id-ID")} likes ${r.bonus && r.bonus !== '-' ? `(Bonus: ${r.bonus})` : ''}`).join("\n");
}).join("\n\n")}

=============================
*3. TOP REELS TERRAMAI PEKAN INI*
${allReelsInCycle.slice(0, 3).map((r, i) => `${i + 1}. [${r.branch || r.branchKey}] "${r.reelsTitle}" (${Number(r.viewers || 0).toLocaleString("id-ID")} viewers, ${Number(r.likes || 0).toLocaleString("id-ID")} likes)`).join("\n") || "-"}

=============================
*4. STATUS KEPATUHAN PIC SPREADSHEET*
${picTracker.map((p) => `• ${p.pic} (${p.role}): ${p.isUpToDate ? "✅ Up-to-date" : `⚠️ Tertunda (${p.latestDate})`}`).join("\n")}

Akses Dashboard Lengkap: https://iseeyou-intelligence.vercel.app/spreadsheet`;

    navigator.clipboard.writeText(waText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className={`space-y-6 ${isPresentationMode ? "bg-background p-6 rounded-container shadow-elevated border border-border" : ""}`}>
      {/* Top Banner Context */}
      <div className="bg-surface border border-border rounded-container p-5 shadow-subtle flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand text-white">
              Rekap Atasan / 3 Hari & 1 Minggu
            </span>
            <span className="text-xs text-foreground-secondary font-medium">
              Khusus Konten Story (Nuha) & Reels (Ilya, Ajun, Amanda, Arum, Febi)
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground mt-1 tracking-tight">
            Rekap Evaluasi Per 3 Hari & Rapat Mingguan Hari Selasa
          </h2>
          <p className="text-xs text-foreground-secondary mt-0.5 max-w-3xl">
            Sistem auto-sync yang merangkum data spreadsheet setiap 3 hari untuk bahan rapat evaluasi mingguan tiap hari Selasa bersama jajaran direksi & manajemen.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setIsPresentationMode(!isPresentationMode)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-control text-xs font-semibold transition-all border ${
              isPresentationMode
                ? "bg-brand text-white border-brand shadow-subtle"
                : "bg-surface border-border text-foreground hover:bg-surface-secondary shadow-subtle"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isPresentationMode ? "Keluar Mode Layar" : "Mode Presentasi Rapat"}</span>
          </button>

          <button
            onClick={handleCopyWhatsApp}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-control text-xs font-semibold transition-all border ${
              copiedText
                ? "bg-emerald-700 text-white border-emerald-700"
                : "bg-foreground text-surface hover:bg-foreground/90 shadow-subtle"
            }`}
          >
            {copiedText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedText ? "Tersalin Format Rapat!" : "Salin Laporan WA (Siap Saji)"}</span>
          </button>
        </div>
      </div>

      {/* Cycle Selector Tabs */}
      <div className="bg-surface-secondary border border-border rounded-container p-2 flex flex-wrap items-center gap-1.5">
        {(Object.keys(cycles) as Array<keyof typeof cycles>).map((k) => {
          const c = cycles[k];
          const isActive = selectedCycle === k;
          return (
            <button
              key={k}
              onClick={() => setSelectedCycle(k)}
              className={`px-3.5 py-2 rounded-control text-xs font-semibold transition-all flex items-center gap-2 ${
                isActive
                  ? "bg-surface border border-border text-foreground shadow-subtle"
                  : "text-foreground-secondary hover:text-foreground hover:bg-surface/50"
              }`}
            >
              <Calendar className={`w-3.5 h-3.5 ${isActive ? "text-brand" : "text-foreground-muted"}`} />
              <span>{c.name}</span>
              {k === "cycle-current" && (
                <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-brand-light text-brand font-bold">
                  Live H-7
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Cycle Header Summary */}
      <div className="bg-surface border border-border rounded-container p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-subtle">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground">{activeCycle.periodLabel}</span>
            <span className="text-[10px] px-2 py-0.2 rounded-full font-semibold bg-surface-secondary text-foreground-secondary border border-border">
              {activeCycle.status}
            </span>
          </div>
          <p className="text-xs text-foreground-secondary">{activeCycle.description}</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
          <div className="text-right">
            <span className="text-[10px] text-foreground-muted block font-normal uppercase">Story Nuha</span>
            <span className="text-foreground font-bold">{totalStoriesUploaded} Story</span>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="text-right">
            <span className="text-[10px] text-foreground-muted block font-normal uppercase">Reels 5 Cabang</span>
            <span className="text-foreground font-bold">{totalReelsUploadedInCycle} Video</span>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="text-right">
            <span className="text-[10px] text-foreground-muted block font-normal uppercase">Total DM Masuk</span>
            <span className="text-brand font-bold">{totalDMs} DM</span>
          </div>
        </div>
      </div>

      {/* 2-Column Core Layout: Story (Nuha) on Left, Reels Cabang on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: KONTEN STORY INSTAGRAM (NUHA - PURWOKERTO) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-surface border border-border rounded-container p-5 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-control bg-brand-light flex items-center justify-center text-brand font-bold">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Konten Story Instagram (Nuha)
                  </h3>
                  <span className="text-[11px] text-foreground-secondary">
                    Optik I See You Purwokerto (Pusat)
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-secondary text-foreground-secondary border border-border">
                {filteredStories.length} Hari Laporan
              </span>
            </div>

            {/* Story Metrics KPI Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-control bg-surface-secondary border border-border">
                <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                  Total Story Diupload
                </span>
                <div className="text-lg font-bold text-foreground mt-0.5 tabular-nums">
                  {totalStoriesUploaded} <span className="text-xs font-normal text-foreground-secondary">story</span>
                </div>
                <span className="text-[10px] text-emerald-800 font-medium">
                  Rata-rata: {filteredStories.length > 0 ? (totalStoriesUploaded / filteredStories.length).toFixed(1) : 0}/hari
                </span>
              </div>

              <div className="p-3 rounded-control bg-surface-secondary border border-border">
                <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                  Viewers Tertinggi
                </span>
                <div className="text-lg font-bold text-foreground mt-0.5 tabular-nums">
                  {maxStoryViewers.toLocaleString("id-ID")}
                </div>
                <span className="text-[10px] text-foreground-muted">
                  Terendah: {minStoryViewers > 0 ? minStoryViewers.toLocaleString("id-ID") : "-"}
                </span>
              </div>

              <div className="p-3 rounded-control bg-brand-light/40 border border-brand/20">
                <span className="text-[10px] uppercase font-bold text-brand block">
                  Total DM Customer
                </span>
                <div className="text-lg font-bold text-brand mt-0.5 tabular-nums">
                  {totalDMs} <span className="text-xs font-normal text-foreground-secondary">inquiries</span>
                </div>
                <span className="text-[10px] text-brand font-medium">
                  Konversi ke Store
                </span>
              </div>

              <div className="p-3 rounded-control bg-surface-secondary border border-border">
                <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                  Respon CS
                </span>
                <div className="text-sm font-bold text-foreground mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Fast Respon</span>
                </div>
                <span className="text-[10px] text-foreground-muted">
                  Saluran: Aktif (Done)
                </span>
              </div>
            </div>

            {/* Topik DM Paling Sering Ditanyakan */}
            <div className="space-y-2 pt-2 border-t border-border">
              <span className="text-xs font-bold text-foreground block">
                Topik DM Paling Sering Ditanyakan Customer:
              </span>
              <div className="space-y-1.5">
                {dmInquiriesList.length > 0 ? (
                  dmInquiriesList.slice(0, 5).map((q, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-control bg-surface-secondary border border-border text-xs"
                    >
                      <span className="font-medium text-foreground">{q.topic}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-surface border border-border text-foreground-secondary">
                        {q.count} hari ditanyakan
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-control bg-surface-secondary text-xs text-foreground-muted italic">
                    Belum ada topik DM tercatat di siklus ini.
                  </div>
                )}
              </div>
            </div>

            {/* Catatan Evaluasi & Kendala PIC Nuha */}
            <div className="space-y-2 pt-2 border-t border-border">
              <span className="text-xs font-bold text-foreground block">
                Catatan Harian & Hal yang Perlu Diperbaiki (PIC Nuha):
              </span>
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {filteredStories.map((s, idx) => (
                  <div key={idx} className="p-2.5 rounded-control bg-surface-secondary border border-border text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-foreground-muted">
                      <span className="font-semibold text-foreground">{s.reportDate}</span>
                      <span>{s.storiesUploaded} story · {s.dmInquiries} DM</span>
                    </div>
                    {s.achievement && s.achievement !== "-" && (
                      <p className="text-foreground-secondary text-[11px]">
                        <strong className="text-emerald-800 font-semibold">Pencapaian:</strong> {s.achievement}
                      </p>
                    )}
                    {s.areaToImprove && s.areaToImprove !== "-" && (
                      <p className="text-foreground-secondary text-[11px]">
                        <strong className="text-amber-800 font-semibold">Evaluasi:</strong> {s.areaToImprove}
                      </p>
                    )}
                    {s.obstacle && s.obstacle !== "-" && (
                      <p className="text-foreground-secondary text-[11px] italic">
                        <strong className="text-foreground font-semibold not-italic">Kendala:</strong> &quot;{s.obstacle}&quot;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: KONTEN REELS 5 CABANG (ILYA, AJUN, AMANDA, ARUM, FEBI) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-surface border border-border rounded-container p-5 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-control bg-surface-secondary flex items-center justify-center text-foreground font-bold">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Konten Reels Instagram 5 Cabang (Evaluasi H+3)
                  </h3>
                  <span className="text-[11px] text-foreground-secondary">
                    Ilya (PWT) · Ajun (PBG) · Amanda (TGL) · Arum (CLP) · Febi (WNS)
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                {totalReelsUploadedInCycle} Video Terdata
              </span>
            </div>

            {/* Cabang Reels Grid */}
            <div className="space-y-3">
              {Object.entries(reelsByBranch).map(([key, list]) => {
                const b = branchNames[key];
                return (
                  <div
                    key={key}
                    className="p-3.5 rounded-control bg-surface-secondary border border-border space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-foreground">
                          {b.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.2 rounded font-semibold bg-surface text-foreground-secondary border border-border">
                          PIC: {b.pic}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-foreground-muted">
                        {list.length} video
                      </span>
                    </div>

                    {list.length > 0 ? (
                      <div className="space-y-2">
                        {list.map((r, idx) => {
                          const thumbUrl = r.reelsLink
                            ? `/api/ig-thumbnail?url=${encodeURIComponent(r.reelsLink)}&tier=thumb`
                            : key === "TGL"
                            ? "/covers/trend-dewasa-passwordnya.png"
                            : "/covers/edukasi-lupa-kedip.png";

                          const mediaItem: AppleMediaItem = {
                            id: `reels-${key}-${idx}`,
                            title: r.reelsTitle,
                            category: r.contentPillar || "Reels Cabang",
                            publishDate: r.uploadDate || r.evalDate,
                            branchName: b.name,
                            pic: b.pic,
                            reach: Number(r.viewers || 0),
                            likes: Number(r.likes || 0),
                            comments: Number(r.comments || 0),
                            saves: Number(r.saves || 0),
                            postUrl: r.reelsLink,
                            thumbnail: thumbUrl,
                          };

                          return (
                            <div
                              key={idx}
                              className="p-2.5 rounded-control bg-surface border border-border/80 flex items-start gap-3 hover:border-brand/50 transition-colors group/item"
                            >
                              {/* Thumbnail cover from Instagram (Apple iOS 3-tier click) */}
                              <div
                                onClick={() => setSelectedMediaItem(mediaItem)}
                                className="w-12 h-12 rounded-xl overflow-hidden bg-surface-secondary shrink-0 border border-border relative cursor-pointer group/thumb shadow-subtle hover:ring-2 hover:ring-brand/40 transition-all"
                                title="Klik untuk Preview & Zoom (Apple iOS Sheet)"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={thumbUrl}
                                  alt={r.reelsTitle}
                                  className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-white">
                                  <ZoomIn className="w-3.5 h-3.5 text-white drop-shadow" />
                                </div>
                              </div>

                              <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-start justify-between gap-2">
                                  <span
                                    onClick={() => setSelectedMediaItem(mediaItem)}
                                    className="font-semibold text-xs text-foreground line-clamp-1 cursor-pointer hover:text-brand transition-colors"
                                    title="Klik untuk Preview Apple Style"
                                  >
                                    {r.reelsTitle}
                                  </span>
                                  {r.reelsLink && (
                                    <a
                                      href={r.reelsLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-brand hover:underline shrink-0 text-[10px] font-bold inline-flex items-center gap-0.5"
                                    >
                                      <span>Buka IG</span>
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  )}
                                </div>

                                <div className="flex flex-wrap items-center gap-2 text-[11px] text-foreground-muted">
                                  <span className="font-semibold text-foreground tabular-nums">
                                    {Number(r.viewers || 0).toLocaleString("id-ID")} viewers
                                  </span>
                                  <span>·</span>
                                  <span className="tabular-nums">
                                    {Number(r.likes || 0).toLocaleString("id-ID")} likes
                                  </span>
                                  {r.isLiveMetric && (
                                    <span className="px-1.5 py-0.2 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-[9px] border border-rose-500/20 flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                      Live IG
                                    </span>
                                  )}
                                  {r.contentPillar && (
                                    <>
                                      <span>·</span>
                                      <span className="px-1.5 py-0.2 rounded bg-surface-secondary text-foreground-secondary text-[10px]">
                                        {r.contentPillar}
                                      </span>
                                    </>
                                  )}
                                  {r.bonus && r.bonus !== "-" && (
                                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[10px]">
                                      Bonus: {r.bonus}
                                    </span>
                                  )}
                                </div>

                                {r.obstacle && r.obstacle !== "-" && r.obstacle !== "tidak ada" && (
                                  <p className="text-[10px] text-foreground-secondary italic pt-0.5">
                                    Kendala PIC: &quot;{r.obstacle}&quot;
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-control bg-surface border border-border text-[11px] text-foreground-muted italic">
                        Belum ada video baru yang tercatat untuk {b.name} di siklus {activeCycle.name}.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Apple iOS Preview Sheet */}
      <AppleMediaSheet
        isOpen={Boolean(selectedMediaItem)}
        onClose={() => setSelectedMediaItem(null)}
        item={selectedMediaItem}
      />
    </div>
  );
};
