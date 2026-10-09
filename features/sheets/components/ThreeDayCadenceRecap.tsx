"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  Monitor,
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
  ChevronDown,
  X,
  Archive,
  Sparkles,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { AppleMediaSheet, AppleMediaItem } from "@/components/shared/AppleMediaSheet";

import liveCache from "@/lib/instagram-live-cache.json";
import { extractShortcode } from "@/lib/real-content-items";

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
  const [selectedCycle, setSelectedCycle] = useState<string>("cycle-8");
  const [copiedText, setCopiedText] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [selectedMediaItem, setSelectedMediaItem] = useState<AppleMediaItem | null>(null);
  const [isCycleModalOpen, setIsCycleModalOpen] = useState(false);

  // Helper functions for dynamic rolling date calculation
  const toIsoDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const formatShortIndo = (isoStr: string) => {
    if (!isoStr) return "";
    const parts = isoStr.split("-");
    if (parts.length < 3) return isoStr;
    const day = parseInt(parts[2], 10);
    const mIdx = parseInt(parts[1], 10) - 1;
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    return `${day} ${months[mIdx] || ""}`;
  };

  // Anchor to current local system date (capped against future typos)
  const systemToday = toIsoDate(new Date());
  const anchorDate = systemToday;
  const rolling7StartIso = useMemo(() => {
    const anchorObj = new Date(anchorDate);
    const rolling7StartObj = new Date(anchorObj.getTime() - 6 * 24 * 60 * 60 * 1000);
    return toIsoDate(rolling7StartObj);
  }, [anchorDate]);

  // Cycle definitions up to October 2026 with auto-expansion and dynamic rolling 7 days
  const cycles = useMemo(() => {
    const isAfterMeetingCycle7 = anchorDate >= "2026-10-06";

    const map: Record<
      string,
      {
        id: string;
        name: string;
        shortName: string;
        periodLabel: string;
        status: string;
        startDate: string;
        endDate: string;
        isLiveInstagram: boolean;
        description: string;
        badge?: string;
        category?: "active" | "recent" | "realtime" | "archive" | "upcoming";
      }
    > = {
      "cycle-1": {
        id: "cycle-1",
        name: "Siklus 1 (8–10 Sep)",
        shortName: "Siklus 1 (8–10 Sep)",
        periodLabel: "8 s/d 10 September 2026",
        status: "Selesai Evaluasi H+3",
        startDate: "2026-09-08",
        endDate: "2026-09-10",
        isLiveInstagram: false,
        description: "Fokus awal pekan: campaign promo awal bulan & testing pilar konten adaptif/POV.",
        category: "archive",
      },
      "cycle-2": {
        id: "cycle-2",
        name: "Siklus 2 (11–13 Sep)",
        shortName: "Siklus 2 (11–13 Sep)",
        periodLabel: "11 s/d 13 September 2026",
        status: "Selesai Evaluasi H+3",
        startDate: "2026-09-11",
        endDate: "2026-09-13",
        isLiveInstagram: false,
        description: "Fokus akhir pekan: konten edukasi lensa, restock kacamata, dan tren viral akhir pekan.",
        category: "archive",
      },
      "cycle-3": {
        id: "cycle-3",
        name: "Siklus 3 (14–17 Sep)",
        shortName: "Siklus 3 (14–17 Sep)",
        periodLabel: "14 s/d 17 September 2026",
        status: "Selesai Evaluasi H+3",
        startDate: "2026-09-14",
        endDate: "2026-09-17",
        isLiveInstagram: false,
        description: "Siklus evaluasi pertengahan bulan: rilis OTW CEK MATA & video edukasi silinder.",
        category: "archive",
      },
      "cycle-4": {
        id: "cycle-4",
        name: "Siklus 4 (18–20 Sep)",
        shortName: "Siklus 4 (18–20 Sep)",
        periodLabel: "18 s/d 20 September 2026",
        status: "Selesai Evaluasi H+3",
        startDate: "2026-09-18",
        endDate: "2026-09-20",
        isLiveInstagram: false,
        description: "Siklus gathering internal Indah Sinergi Yuwana & dokumentasi POV store crew.",
        category: "archive",
      },
      "cycle-5": {
        id: "cycle-5",
        name: "Siklus 5 (21–24 Sep)",
        shortName: "Siklus 5 (21–24 Sep)",
        periodLabel: "21 s/d 24 September 2026",
        status: "Selesai Evaluasi H+3",
        startDate: "2026-09-21",
        endDate: "2026-09-24",
        isLiveInstagram: false,
        description: "Siklus edukasi astigmatisme, tren cewek naik motor siang hari, dan cek mata bareng orang tua.",
        category: "archive",
      },
      "cycle-6": {
        id: "cycle-6",
        name: "Siklus 6 (25–28 Sep)",
        shortName: "Siklus 6 (25–28 Sep)",
        periodLabel: "25 s/d 28 September 2026",
        status: "Selesai Evaluasi Rapat 29 Sep",
        startDate: "2026-09-25",
        endDate: "2026-09-28",
        isLiveInstagram: false,
        description: "Evaluasi rapat pekan lalu (Selasa 29 Sep): performa video tren, edukasi anatomi, dan minus tinggi.",
        category: "archive",
      },
      "cycle-7": {
        id: "cycle-7",
        name: isAfterMeetingCycle7
          ? "Siklus 7 (29 Sep – 5 Okt) · Selesai Rapat"
          : "Siklus 7 (29 Sep – 5 Okt) — Rapat Besok",
        shortName: "Siklus 7 (29 Sep–5 Okt)",
        periodLabel: isAfterMeetingCycle7
          ? "29 September s/d 5 Oktober 2026 (Rapat 6 Okt)"
          : "29 September s/d 5 Oktober 2026 (Live H-1 Rapat)",
        status: isAfterMeetingCycle7
          ? "Selesai Evaluasi Rapat 6 Okt"
          : "Pemantauan Berjalan (Siap untuk Rapat Besok 6 Okt)",
        startDate: "2026-09-29",
        endDate: "2026-10-05",
        isLiveInstagram: true,
        description: isAfterMeetingCycle7
          ? "Evaluasi 7 hari penuh (29 Sep – 5 Okt 2026) untuk rapat evaluasi mingguan Selasa, 6 Oktober 2026."
          : "Evaluasi berjalan 7 hari penuh (29 Sep – 5 Okt 2026) untuk persiapan rapat evaluasi mingguan besok Selasa, 6 Oktober 2026.",
        badge: isAfterMeetingCycle7 ? "SELESAI RAPAT" : "RAPAT BESOK (6 OKT)",
        category: "recent",
      },
      "full-week": {
        id: "full-week",
        name: `1 Minggu Terakhir (${formatShortIndo(rolling7StartIso)} – ${formatShortIndo(anchorDate)}) · Rolling`,
        shortName: `Rolling 7 Hari (${formatShortIndo(rolling7StartIso)}–${formatShortIndo(anchorDate)})`,
        periodLabel: `${formatShortIndo(rolling7StartIso)} s/d ${formatShortIndo(anchorDate)} (Rolling 7 Hari Realtime)`,
        status: "Rolling 7 Hari Realtime (Auto-Update Harian)",
        startDate: rolling7StartIso,
        endDate: anchorDate,
        isLiveInstagram: true,
        description: `Jendela pemantauan rolling 7 hari terakhir (${rolling7StartIso} s/d ${anchorDate}) yang otomatis bergeser maju setiap hari seiring waktu dan sinkronisasi data spreadsheet tanpa perlu diubah manual.`,
        badge: "AUTO-ROLLING 7 HARI",
        category: "realtime",
      },
      "full-month": {
        id: "full-month",
        name: "1 Bulan Penuh (Sep – Okt 2026) · Live IG",
        shortName: "1 Bulan Penuh (Sep–Okt)",
        periodLabel: `1 September s/d ${formatShortIndo(anchorDate)} 2026 (Bulan Penuh)`,
        status: "Konsolidasi Bulanan Resmi Rapat",
        startDate: "2026-09-01",
        endDate: anchorDate,
        isLiveInstagram: true,
        description: "Rangkuman komprehensif performa 1 bulan penuh lintas 5 cabang (4 ISY + 1 Lunar).",
        badge: "BULAN PENUH",
        category: "realtime",
      },
      "cycle-8": {
        id: "cycle-8",
        name: anchorDate >= "2026-10-13"
          ? "Siklus 8 (6–12 Okt) · Selesai Rapat"
          : "Siklus 8 (6–12 Okt) — Rapat 13 Okt",
        shortName: "Siklus 8 (6–12 Okt)",
        periodLabel: "6 s/d 12 Oktober 2026",
        status: anchorDate >= "2026-10-13"
          ? "Selesai Evaluasi Rapat 13 Okt"
          : "Siklus Berjalan (Rapat Selasa 13 Okt)",
        startDate: "2026-10-06",
        endDate: "2026-10-12",
        isLiveInstagram: true,
        description: "Siklus evaluasi mingguan pekan berjalan (6 s/d 12 Oktober 2026) untuk persiapan rapat evaluasi hari Selasa, 13 Oktober 2026.",
        badge: anchorDate >= "2026-10-06" && anchorDate < "2026-10-13" ? "SIKLUS AKTIF" : undefined,
        category: "active",
      },
      "cycle-9": {
        id: "cycle-9",
        name: "Siklus 9 (13–19 Okt) — Rapat 20 Okt",
        shortName: "Siklus 9 (13–19 Okt)",
        periodLabel: "13 s/d 19 Oktober 2026",
        status: anchorDate >= "2026-10-13" ? "Siklus Berjalan (Rapat Selasa 20 Okt)" : "Siklus Rapat Mendatang (20 Okt)",
        startDate: "2026-10-13",
        endDate: "2026-10-19",
        isLiveInstagram: true,
        description: "Siklus evaluasi mingguan pekan ke-3 Oktober 2026 untuk persiapan rapat evaluasi hari Selasa, 20 Oktober 2026.",
        badge: anchorDate >= "2026-10-13" ? "SIKLUS AKTIF" : "MENDATANG",
        category: "upcoming",
      },
    };

    return map;
  }, [anchorDate, rolling7StartIso]);

  const activeCycle = cycles[selectedCycle] || cycles["cycle-8"] || cycles["cycle-7"] || cycles["cycle-1"];

  // Index live Instagram cache by shortcode
  const liveMap = useMemo(() => {
    const map = new Map<string, any>();
    if (liveCache && (liveCache as any).reels) {
      for (const [url, data] of Object.entries((liveCache as any).reels as Record<string, any>)) {
        const code = extractShortcode(url);
        if (code) map.set(code, data);
      }
    }
    return map;
  }, []);

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

  // Filter and Deduplicate Reels from all branches
  const branchMap: Record<string, Map<string, any>> = {
    PWT: new Map(),
    PBG: new Map(),
    TGL: new Map(),
    CLP: new Map(),
    WNS: new Map(),
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
          const code = extractShortcode(r.reelsLink);
          const normTitle = (r.reelsTitle || "").toLowerCase().trim().replace(/\s+/g, " ");
          const dedupKey = code ? `sc_${code}` : `title_${normTitle}`;

          const viewers = Number(r.viewers || 0);
          const likes = Number(r.likes || 0);

          if (branchMap[key].has(dedupKey)) {
            const existing = branchMap[key].get(dedupKey);
            const existingViewers = Number(existing.viewers || 0);
            const existingLikes = Number(existing.likes || 0);

            // Keep record with higher viewers or latest evaluation date
            const isBetter =
              viewers > existingViewers ||
              (viewers === existingViewers && likes > existingLikes) ||
              (viewers === existingViewers && (r.reportDate || "") >= (existing.reportDate || ""));

            if (isBetter) {
              branchMap[key].set(dedupKey, {
                ...existing,
                ...r,
                viewers: Math.max(existingViewers, viewers),
                likes: Math.max(existingLikes, likes),
                isLiveSync: false,
              });
            }
          } else {
            branchMap[key].set(dedupKey, {
              ...r,
              viewers,
              likes,
              isLiveSync: false,
            });
          }
        }
      });
    }
  });

  const reelsByBranch: Record<string, any[]> = {
    PWT: Array.from(branchMap.PWT.values()),
    PBG: Array.from(branchMap.PBG.values()),
    TGL: Array.from(branchMap.TGL.values()),
    CLP: Array.from(branchMap.CLP.values()),
    WNS: Array.from(branchMap.WNS.values()),
  };

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
    list.map((r, i) => `  ${i + 1}. "${r.reelsTitle}" — ${Number(r.viewers || 0).toLocaleString("id-ID")} viewers | ${Number(r.likes || 0).toLocaleString("id-ID")} likes`).join("\n");
}).join("\n\n")}

=============================
*3. TOP REELS TERRAMAI PEKAN INI*
${allReelsInCycle.slice(0, 3).map((r, i) => `${i + 1}. [${r.branch || r.branchKey}] "${r.reelsTitle}" (${Number(r.viewers || 0).toLocaleString("id-ID")} viewers, ${Number(r.likes || 0).toLocaleString("id-ID")} likes)`).join("\n") || "-"}

=============================
*4. STATUS KEPATUHAN PIC SPREADSHEET*
${picTracker.map((p) => `• ${p.pic} (${p.role}): ${p.isUpToDate ? "[Lengkap]" : `[Tertunda - ${p.latestDate}]`}`).join("\n")}

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
            <Monitor className="w-3.5 h-3.5" />
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

      {/* Cycle Selector Bar - Clean, Streamlined & Modern for Web and Mobile */}
      <div className="bg-surface border border-border rounded-container p-3 sm:p-4 shadow-subtle space-y-3">
        {/* Top Header: Active Period Indicator + Modal Trigger Button */}
        <div className="flex items-center justify-between gap-2.5 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-control bg-surface-secondary border border-border text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-foreground-secondary text-[11px] hidden sm:inline">Periode Aktif:</span>
              <span className="font-bold text-foreground truncate max-w-[170px] sm:max-w-none">
                {activeCycle.shortName || activeCycle.name}
              </span>
            </div>

            {activeCycle.badge && (
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-brand/10 text-brand border border-brand/20 shrink-0">
                {activeCycle.badge}
              </span>
            )}

            {activeCycle.isLiveInstagram && (
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shrink-0 hidden sm:inline-flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                Live IG
              </span>
            )}
          </div>

          {/* Quick Action: Open Modal Dialog for All Cycles & Archive */}
          <button
            type="button"
            onClick={() => setIsCycleModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-control text-xs font-semibold bg-surface-secondary hover:bg-surface border border-border text-foreground hover:border-brand/40 shadow-2xs transition-all shrink-0 ml-auto"
          >
            <Layers className="w-3.5 h-3.5 text-brand" />
            <span>Pilih Siklus ({Object.keys(cycles).length})</span>
            <ChevronDown className="w-3 h-3 text-foreground-muted" />
          </button>
        </div>

        {/* Horizontal Scrollable Quick Pill Bar (Single Clean Line, Zero Wrapping on Mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 -mx-1 px-1 flex-nowrap whitespace-nowrap text-xs">
          {/* 1. Siklus 8 (Aktif Pekan Ini) */}
          <button
            type="button"
            onClick={() => setSelectedCycle("cycle-8")}
            className={`px-3 py-1.5 rounded-control text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 border ${
              selectedCycle === "cycle-8"
                ? "bg-brand text-white border-brand shadow-subtle ring-1 ring-brand"
                : "bg-surface-secondary/70 hover:bg-surface border-border text-foreground hover:border-brand/30"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${selectedCycle === "cycle-8" ? "bg-white" : "bg-emerald-500"}`} />
            <span>Siklus 8 (6–12 Okt)</span>
            <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-bold ${
              selectedCycle === "cycle-8" ? "bg-white/20 text-white" : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
            }`}>
              Aktif
            </span>
          </button>

          {/* 2. Siklus 7 (Rapat 6 Okt Selesai) */}
          <button
            type="button"
            onClick={() => setSelectedCycle("cycle-7")}
            className={`px-3 py-1.5 rounded-control text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 border ${
              selectedCycle === "cycle-7"
                ? "bg-brand text-white border-brand shadow-subtle ring-1 ring-brand"
                : "bg-surface-secondary/70 hover:bg-surface border-border text-foreground hover:border-brand/30"
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>Siklus 7 (29 Sep–5 Okt)</span>
            <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-bold ${
              selectedCycle === "cycle-7" ? "bg-white/20 text-white" : "bg-surface text-foreground-secondary border border-border/80"
            }`}>
              Rapat Lalu
            </span>
          </button>

          {/* 3. Rolling 7 Hari Realtime */}
          <button
            type="button"
            onClick={() => setSelectedCycle("full-week")}
            className={`px-3 py-1.5 rounded-control text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 border ${
              selectedCycle === "full-week"
                ? "bg-brand text-white border-brand shadow-subtle ring-1 ring-brand"
                : "bg-surface-secondary/70 hover:bg-surface border-border text-foreground hover:border-brand/30"
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Rolling 7 Hari ({formatShortIndo(rolling7StartIso)}–{formatShortIndo(anchorDate)})</span>
            <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-bold ${
              selectedCycle === "full-week" ? "bg-white/20 text-white" : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
            }`}>
              Live
            </span>
          </button>

          {/* 4. 1 Bulan Penuh (Sep - Okt) */}
          <button
            type="button"
            onClick={() => setSelectedCycle("full-month")}
            className={`px-3 py-1.5 rounded-control text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 border ${
              selectedCycle === "full-month"
                ? "bg-brand text-white border-brand shadow-subtle ring-1 ring-brand"
                : "bg-surface-secondary/70 hover:bg-surface border-border text-foreground hover:border-brand/30"
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>1 Bulan Penuh</span>
          </button>

          {/* 5. Siklus 9 (Mendatang) */}
          <button
            type="button"
            onClick={() => setSelectedCycle("cycle-9")}
            className={`px-3 py-1.5 rounded-control text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 border ${
              selectedCycle === "cycle-9"
                ? "bg-brand text-white border-brand shadow-subtle ring-1 ring-brand"
                : "bg-surface-secondary/70 hover:bg-surface border-border text-foreground hover:border-brand/30"
            }`}
          >
            <Calendar className="w-3 h-3 text-foreground-muted" />
            <span>Siklus 9 (13–19 Okt)</span>
            <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-bold ${
              selectedCycle === "cycle-9" ? "bg-white/20 text-white" : "bg-surface text-foreground-muted border border-border/80"
            }`}>
              Mendatang
            </span>
          </button>

          {/* Dynamic Pill: If selectedCycle is from archive (cycles 1-6) */}
          {["cycle-1", "cycle-2", "cycle-3", "cycle-4", "cycle-5", "cycle-6"].includes(selectedCycle) && (
            <button
              type="button"
              onClick={() => setSelectedCycle(selectedCycle)}
              className="px-3 py-1.5 rounded-control text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 border bg-brand text-white border-brand shadow-subtle ring-1 ring-brand"
            >
              <Archive className="w-3 h-3 text-white" />
              <span>{activeCycle.shortName || activeCycle.name}</span>
              <span className="text-[9px] uppercase px-1.5 py-0.2 rounded font-bold bg-white/20 text-white">
                Arsip Terpilih
              </span>
            </button>
          )}

          {/* 6. Quick Trigger: Arsip Siklus Lalu (Siklus 1-6) */}
          <button
            type="button"
            onClick={() => setIsCycleModalOpen(true)}
            className="px-3 py-1.5 rounded-control text-xs font-medium text-foreground-secondary hover:text-foreground hover:bg-surface border border-dashed border-border hover:border-brand/40 transition-all shrink-0 flex items-center gap-1.5"
          >
            <Archive className="w-3 h-3 text-foreground-muted" />
            <span>Arsip Siklus 1–6...</span>
            <ChevronDown className="w-3 h-3 text-foreground-muted" />
          </button>
        </div>
      </div>

      {/* Cycle Header Summary */}
      <div className="bg-surface border border-border rounded-container p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-subtle">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-foreground tracking-tight">{activeCycle.periodLabel}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-surface-secondary text-foreground-secondary border border-border">
              {activeCycle.status}
            </span>
            {activeCycle.isLiveInstagram && (
              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/20">
                Live Instagram
              </span>
            )}
          </div>
          <p className="text-xs text-foreground-secondary leading-relaxed max-w-2xl">{activeCycle.description}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-border/60 shrink-0">
          <div className="text-center md:text-right bg-surface-secondary/40 md:bg-transparent p-2 md:p-0 rounded-control border md:border-none border-border/40">
            <span className="text-[10px] text-foreground-muted block font-medium uppercase">Story Nuha</span>
            <span className="text-xs sm:text-sm font-bold text-foreground">{totalStoriesUploaded} Story</span>
          </div>
          <div className="text-center md:text-right bg-surface-secondary/40 md:bg-transparent p-2 md:p-0 rounded-control border md:border-none border-border/40 md:border-l md:border-border md:pl-4">
            <span className="text-[10px] text-foreground-muted block font-medium uppercase">Reels 5 Cabang</span>
            <span className="text-xs sm:text-sm font-bold text-foreground">{totalReelsUploadedInCycle} Video</span>
          </div>
          <div className="text-center md:text-right bg-surface-secondary/40 md:bg-transparent p-2 md:p-0 rounded-control border md:border-none border-border/40 md:border-l md:border-border md:pl-4">
            <span className="text-[10px] text-foreground-muted block font-medium uppercase">Total DM</span>
            <span className="text-xs sm:text-sm font-bold text-brand">{totalDMs} DM</span>
          </div>
        </div>
      </div>

      {/* Modal Dialog: Semua Siklus & Arsip Rekap */}
      {isCycleModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsCycleModalOpen(false)}
        >
          <div
            className="bg-surface border border-border rounded-container shadow-elevated w-full max-w-lg max-h-[88vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-surface-secondary/40 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-control bg-brand-light flex items-center justify-center text-brand">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Pilih Periode Evaluasi</h3>
                  <p className="text-[11px] text-foreground-secondary">
                    Pilih siklus rapat mingguan 6 PIC atau pemantauan realtime
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCycleModalOpen(false)}
                className="p-1.5 rounded-control text-foreground-muted hover:text-foreground hover:bg-surface border border-transparent hover:border-border transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Grouped List */}
            <div className="p-4 overflow-y-auto space-y-4">
              {/* Group 1: Siklus Aktif Pekan Ini */}
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400 mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Siklus Berjalan (Aktif Pekan Ini)
                </span>
                {["cycle-8"].map((k) => {
                  const c = cycles[k];
                  if (!c) return null;
                  const isSel = selectedCycle === k;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => {
                        setSelectedCycle(k);
                        setIsCycleModalOpen(false);
                      }}
                      className={`w-full text-left p-3 rounded-control border transition-all flex items-start justify-between gap-3 ${
                        isSel
                          ? "bg-brand/5 border-brand ring-1 ring-brand text-foreground"
                          : "bg-surface hover:bg-surface-secondary border-border text-foreground hover:border-brand/40"
                      }`}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-foreground">{c.name}</span>
                          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/25">
                            Aktif
                          </span>
                          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-brand/10 text-brand font-bold border border-brand/20">
                            Live IG
                          </span>
                        </div>
                        <p className="text-[11px] text-foreground-secondary">{c.periodLabel}</p>
                        <p className="text-[11px] text-foreground-muted line-clamp-1">{c.description}</p>
                      </div>
                      {isSel && <Check className="w-4 h-4 text-brand shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>

              {/* Group 2: Tinjauan Realtime & Konsolidasi */}
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-foreground-muted mb-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-brand" />
                  Tinjauan Realtime & Konsolidasi
                </span>
                <div className="space-y-1.5">
                  {["full-week", "full-month"].map((k) => {
                    const c = cycles[k];
                    if (!c) return null;
                    const isSel = selectedCycle === k;
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => {
                          setSelectedCycle(k);
                          setIsCycleModalOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-control border transition-all flex items-start justify-between gap-3 ${
                          isSel
                            ? "bg-brand/5 border-brand ring-1 ring-brand text-foreground"
                            : "bg-surface hover:bg-surface-secondary border-border text-foreground hover:border-brand/40"
                        }`}
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-foreground">{c.name}</span>
                            {c.badge && (
                              <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-surface-secondary text-foreground-secondary font-bold border border-border">
                                {c.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-foreground-secondary">{c.periodLabel}</p>
                        </div>
                        {isSel && <Check className="w-4 h-4 text-brand shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Group 3: Siklus Rapat Baru Selesai */}
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-foreground-muted mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-foreground-muted" />
                  Siklus Rapat Baru Selesai
                </span>
                {["cycle-7"].map((k) => {
                  const c = cycles[k];
                  if (!c) return null;
                  const isSel = selectedCycle === k;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => {
                        setSelectedCycle(k);
                        setIsCycleModalOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-control border transition-all flex items-start justify-between gap-3 ${
                        isSel
                          ? "bg-brand/5 border-brand ring-1 ring-brand text-foreground"
                          : "bg-surface hover:bg-surface-secondary border-border text-foreground hover:border-brand/40"
                      }`}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-foreground">{c.name}</span>
                          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-surface-secondary text-foreground-secondary font-bold border border-border">
                            Selesai Rapat 6 Okt
                          </span>
                        </div>
                        <p className="text-[11px] text-foreground-secondary">{c.periodLabel}</p>
                      </div>
                      {isSel && <Check className="w-4 h-4 text-brand shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>

              {/* Group 4: Arsip Siklus Rapat Lalu (September 2026) */}
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-foreground-muted mb-1.5 flex items-center gap-1">
                  <Archive className="w-3 h-3 text-foreground-muted" />
                  Arsip Siklus Rapat Lalu (September 2026)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {["cycle-6", "cycle-5", "cycle-4", "cycle-3", "cycle-2", "cycle-1"].map((k) => {
                    const c = cycles[k];
                    if (!c) return null;
                    const isSel = selectedCycle === k;
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => {
                          setSelectedCycle(k);
                          setIsCycleModalOpen(false);
                        }}
                        className={`text-left p-2 rounded-control border transition-all flex items-center justify-between gap-2 ${
                          isSel
                            ? "bg-brand/5 border-brand ring-1 ring-brand text-foreground"
                            : "bg-surface hover:bg-surface-secondary border-border text-foreground hover:border-brand/30"
                        }`}
                      >
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-foreground block truncate">{c.shortName || c.name}</span>
                          <span className="text-[10px] text-foreground-muted block">{c.periodLabel}</span>
                        </div>
                        {isSel && <Check className="w-3.5 h-3.5 text-brand shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Group 5: Siklus Mendatang */}
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-foreground-muted mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-foreground-muted" />
                  Siklus Rapat Mendatang
                </span>
                {["cycle-9"].map((k) => {
                  const c = cycles[k];
                  if (!c) return null;
                  const isSel = selectedCycle === k;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => {
                        setSelectedCycle(k);
                        setIsCycleModalOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-control border transition-all flex items-start justify-between gap-3 ${
                        isSel
                          ? "bg-brand/5 border-brand ring-1 ring-brand text-foreground"
                          : "bg-surface hover:bg-surface-secondary border-border text-foreground hover:border-brand/40"
                      }`}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-foreground">{c.name}</span>
                          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-surface-secondary text-foreground-muted font-bold border border-border">
                            Mendatang (20 Okt)
                          </span>
                        </div>
                        <p className="text-[11px] text-foreground-secondary">{c.periodLabel}</p>
                      </div>
                      {isSel && <Check className="w-4 h-4 text-brand shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-border bg-surface-secondary/30 flex items-center justify-between text-xs text-foreground-secondary shrink-0">
              <span>Total 11 siklus evaluasi</span>
              <button
                type="button"
                onClick={() => setIsCycleModalOpen(false)}
                className="px-3 py-1 rounded-control bg-surface border border-border text-foreground font-semibold hover:bg-surface-secondary transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

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
                                  {Number(r.viewers || 0) > 0 || Number(r.likes || 0) > 0 ? (
                                    <>
                                      <span className="font-semibold text-foreground tabular-nums">
                                        {Number(r.viewers || 0).toLocaleString("id-ID")} viewers
                                      </span>
                                      <span>·</span>
                                      <span className="tabular-nums">
                                        {Number(r.likes || 0).toLocaleString("id-ID")} likes
                                      </span>
                                    </>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold text-[10px] border border-amber-500/20">
                                      Menunggu H+3 (Belum Waktunya Evaluasi)
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
