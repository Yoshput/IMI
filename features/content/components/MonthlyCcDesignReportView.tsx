"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Sparkles,
  Calendar,
  User,
  Download,
  Presentation,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  FileText,
  TrendingUp,
  Share2,
  Heart,
  MessageCircle,
  Bookmark,
  Eye,
  RefreshCw,
  Search,
  Filter,
  Instagram,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  ContentItem,
  DesignDatabaseItem,
  DesignerMonthlySummary,
  DailyIgPostSummary,
  BranchReelsPicSummary,
  WeekFilterKey,
} from "@/types";
import defaultData from "@/lib/real-sheets-data.json";
import { getRealContentItems } from "@/lib/real-content-items";
import {
  getCurrentMonthKey,
  formatMonthLabel,
  getAvailableMonths,
  getWeekOptions,
  formatPeriodHeader,
} from "@/lib/month-utils";
import {
  aggregateDesignerMonthly,
  aggregateBranchReels,
  aggregateDailyPosting,
  filterDesignsByMonth,
  filterPostsByMonth,
} from "@/lib/cc-report-utils";
import {
  exportCcContentDesignToPDF,
  exportCcContentDesignToPPT,
} from "@/lib/export-pdf-ppt";
import { downloadCSV } from "@/lib/export-csv";

interface MonthlyCcDesignReportViewProps {
  initialMonth?: string;
}

export const MonthlyCcDesignReportView: React.FC<MonthlyCcDesignReportViewProps> = ({
  initialMonth,
}) => {
  // 1. Raw Data State
  const [contentList, setContentList] = useState<ContentItem[]>(() =>
    getRealContentItems(undefined, "all_time")
  );
  const [designList, setDesignList] = useState<DesignDatabaseItem[]>(() => {
    if (defaultData && Array.isArray((defaultData as any).databaseDesain)) {
      return (defaultData as any).databaseDesain;
    }
    return [];
  });

  // 2. Filter Controls
  const [selectedMonth, setSelectedMonth] = useState<string>(
    () => initialMonth || "2026-10" // Default to October 2026 where rich data exists, or current
  );
  const [selectedWeek, setSelectedWeek] = useState<WeekFilterKey>("w4_monthly");
  const [selectedAccount, setSelectedAccount] = useState<string>("@iseeyou.glasses");
  const [selectedPic, setSelectedPic] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedDesigner, setExpandedDesigner] = useState<string | null>(null);

  // Export & Feedback States
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingPpt, setIsExportingPpt] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Dynamic Available Months & Weeks
  const monthOptions = useMemo(() => {
    return getAvailableMonths(contentList, designList);
  }, [contentList, designList]);

  const weekOptions = useMemo(() => {
    return getWeekOptions(selectedMonth);
  }, [selectedMonth]);

  // Sync Live Data from APIs
  const handleSyncData = async () => {
    setIsSyncing(true);
    setFeedback(null);
    try {
      const [resContent, resSheets] = await Promise.all([
        fetch("/api/content-items?period=all_time"),
        fetch("/api/sync-sheets?fresh=true"),
      ]);
      const jsonContent = await resContent.json();
      const jsonSheets = await resSheets.json();

      let contentCount = contentList.length;
      let designCount = designList.length;

      if (jsonContent.success && Array.isArray(jsonContent.items)) {
        setContentList(jsonContent.items);
        contentCount = jsonContent.items.length;
      }
      if (jsonSheets.success && jsonSheets.data && Array.isArray(jsonSheets.data.databaseDesain)) {
        setDesignList(jsonSheets.data.databaseDesain);
        designCount = jsonSheets.data.databaseDesain.length;
      }

      setFeedback(`Data berhasil disinkronkan (${contentCount} konten IG, ${designCount} desain).`);
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback(`Kendala sinkronisasi: ${err.message}`);
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setIsSyncing(false);
    }
  };

  // Filter items by Month & Week & Account & PIC
  const monthFilteredDesigns = useMemo(() => {
    let items = filterDesignsByMonth(designList, selectedMonth, selectedWeek);
    if (selectedPic !== "all") {
      items = items.filter(
        (it) => (it.pic || it.creator || "").toLowerCase() === selectedPic.toLowerCase()
      );
    }
    return items;
  }, [designList, selectedMonth, selectedWeek, selectedPic]);

  const monthFilteredPosts = useMemo(() => {
    let items = filterPostsByMonth(contentList, selectedMonth, selectedWeek);

    // Account Filter
    if (selectedAccount === "@iseeyou.glasses") {
      items = items.filter(
        (it) => !it.branchKey || it.branchKey === "pwt" || it.branchName?.includes("Purwokerto")
      );
    } else if (selectedAccount === "@lunareyewear.co") {
      items = items.filter(
        (it) => it.branchKey === "tgl" || it.branchName?.includes("Lunar")
      );
    }

    // PIC Filter
    if (selectedPic !== "all") {
      items = items.filter(
        (it) => (it.pic || "").toLowerCase() === selectedPic.toLowerCase()
      );
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(
        (it) =>
          it.title.toLowerCase().includes(q) ||
          it.captionPreview.toLowerCase().includes(q) ||
          (it.pic || "").toLowerCase().includes(q)
      );
    }

    return items;
  }, [contentList, selectedMonth, selectedWeek, selectedAccount, selectedPic, searchQuery]);

  // Aggregated Summaries
  const designerSummaries: DesignerMonthlySummary[] = useMemo(() => {
    return aggregateDesignerMonthly(designList, contentList, selectedMonth, selectedWeek);
  }, [designList, contentList, selectedMonth, selectedWeek]);

  const branchReelsSummaries: BranchReelsPicSummary[] = useMemo(() => {
    return aggregateBranchReels(contentList, selectedMonth, selectedWeek);
  }, [contentList, selectedMonth, selectedWeek]);

  const dailySummaries: DailyIgPostSummary[] = useMemo(() => {
    return aggregateDailyPosting(monthFilteredDesigns, monthFilteredPosts, selectedMonth, selectedWeek);
  }, [monthFilteredDesigns, monthFilteredPosts, selectedMonth, selectedWeek]);

  // Top KPIs
  const totalDesigns = monthFilteredDesigns.length;
  const totalPosts = monthFilteredPosts.length;
  const totalReach = monthFilteredPosts.reduce((acc, p) => acc + (p.reach || 0), 0);
  const avgEr =
    monthFilteredPosts.length > 0
      ? (
          monthFilteredPosts.reduce((acc, p) => acc + (p.engagementRate || 0), 0) /
          monthFilteredPosts.length
        ).toFixed(1)
      : "0.0";
  const activePostingDays = dailySummaries.filter((d) => d.postCount > 0).length;

  const currentMonthLabel = formatMonthLabel(selectedMonth);
  const activePeriodLabel = formatPeriodHeader(selectedMonth, selectedWeek);

  // Export PDF Handler
  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    setFeedback(null);
    try {
      await exportCcContentDesignToPDF({
        monthKey: selectedMonth,
        monthLabel: currentMonthLabel,
        weekKey: selectedWeek,
        periodLabel: activePeriodLabel,
        accountHandle: selectedAccount,
        designerSummaries,
        branchReelsSummaries,
        dailySummaries,
        filteredPosts: monthFilteredPosts,
        filteredDesigns: monthFilteredDesigns,
      });
      setFeedback(`PDF Laporan CC & Konten Design (${activePeriodLabel}) berhasil diunduh!`);
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback(`Gagal ekspor PDF: ${err.message}`);
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Export PPT Handler
  const handleExportPpt = async () => {
    setIsExportingPpt(true);
    setFeedback(null);
    try {
      await exportCcContentDesignToPPT({
        monthKey: selectedMonth,
        monthLabel: currentMonthLabel,
        weekKey: selectedWeek,
        periodLabel: activePeriodLabel,
        accountHandle: selectedAccount,
        designerSummaries,
        branchReelsSummaries,
        dailySummaries,
        filteredPosts: monthFilteredPosts,
        filteredDesigns: monthFilteredDesigns,
      });
      setFeedback(`PPT Laporan CC & Konten Design (${activePeriodLabel}) berhasil diunduh!`);
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback(`Gagal ekspor PPT: ${err.message}`);
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setIsExportingPpt(false);
    }
  };

  // Export CSV Handler
  const handleExportCsv = () => {
    const headers = [
      "No",
      "Tanggal Rilis / Input",
      "Tipe Data",
      "PIC Desainer / Creator",
      "Judul Konten / Nama Desain",
      "Format",
      "Reach",
      "Likes",
      "Engagement Rate (%)",
      "Link File / URL Post",
    ];

    const rows: (string | number)[][] = [];
    let counter = 1;

    // Tambahkan post IG
    monthFilteredPosts.forEach((p) => {
      rows.push([
        counter++,
        p.publishDate,
        "Postingan Instagram",
        p.pic || "Ilya / Tim",
        p.title,
        p.format.toUpperCase(),
        p.reach,
        p.likes,
        `${p.engagementRate}%`,
        p.postUrl || "-",
      ]);
    });

    // Tambahkan karya desain
    monthFilteredDesigns.forEach((d) => {
      rows.push([
        counter++,
        d.date || "-",
        "Berkas Desain Cetak / Promo",
        d.pic || d.creator || "Yanuar",
        d.designName,
        "DESAIN",
        "-",
        "-",
        "-",
        d.fileUrl || "-",
      ]);
    });

    downloadCSV(
      `laporan-cc-konten-design-${selectedMonth}-${selectedAccount.replace("@", "")}.csv`,
      headers,
      rows
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls Toolbar */}
      <div className="p-4 rounded-xl border border-border bg-surface shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-brand/10 text-brand border border-brand/20">
                <Instagram className="w-3.5 h-3.5 text-brand" />
                Laporan CC &amp; Performa Konten Design Bulanan
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                {selectedAccount}
              </span>
            </div>
            <p className="text-xs text-foreground-secondary mt-1">
              Evaluasi komprehensif produktivitas desainer grafis (Mas Yanuar, Dimas, Yasin, Anam) dan deteksi tanggal posting Instagram akun resmi {selectedAccount} periode {currentMonthLabel}.
            </p>
          </div>

          {/* Export Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleSyncData}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface border border-border text-foreground font-semibold text-xs hover:bg-surface-secondary hover:text-brand hover:border-brand/40 transition-all shadow-2xs disabled:opacity-60 cursor-pointer"
              title="Sinkronkan data live terbaru dari Google Sheets & Instagram"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-brand ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Menyelaraskan..." : "Sinkronkan"}</span>
            </button>

            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#124734] hover:bg-[#0E3829] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs active:scale-95 disabled:opacity-60 cursor-pointer"
              title="Download Laporan Resmi Siap Kirim (PDF)"
            >
              <Download className={`w-3.5 h-3.5 text-white ${isExportingPdf ? "animate-bounce" : ""}`} />
              <span>{isExportingPdf ? "Menyiapkan PDF..." : "Export PDF"}</span>
            </button>

            <button
              type="button"
              onClick={handleExportPpt}
              disabled={isExportingPpt}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface border border-border text-foreground font-semibold text-xs hover:bg-surface-secondary hover:text-brand hover:border-brand/40 transition-all shadow-2xs active:scale-95 disabled:opacity-60 cursor-pointer"
              title="Download Slide Presentasi PowerPoint (.pptx)"
            >
              <Presentation className={`w-3.5 h-3.5 text-brand ${isExportingPpt ? "animate-pulse" : ""}`} />
              <span>{isExportingPpt ? "Menyiapkan PPT..." : "Export PPT"}</span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface border border-border text-foreground font-semibold text-xs hover:bg-surface-secondary hover:text-brand hover:border-brand/40 transition-all shadow-2xs active:scale-95 cursor-pointer"
              title="Unduh Data Mentah CSV"
            >
              <Download className="w-3.5 h-3.5 text-foreground-muted" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border">
          {/* Month Selector */}
          <div className="flex items-center gap-1.5 text-xs text-foreground-secondary">
            <Calendar className="w-3.5 h-3.5 text-foreground-muted" />
            <span className="font-semibold text-foreground">Bulan:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs font-bold focus:outline-none focus:ring-1 focus:ring-brand cursor-pointer"
            >
              {monthOptions.map((opt) => (
                <option key={opt.monthKey} value={opt.monthKey}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Week Selector */}
          <div className="flex items-center gap-1.5 text-xs text-foreground-secondary">
            <Calendar className="w-3.5 h-3.5 text-brand" />
            <span className="font-semibold text-foreground">Minggu / Siklus:</span>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value as WeekFilterKey)}
              className="px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs font-bold focus:outline-none focus:ring-1 focus:ring-brand cursor-pointer"
            >
              {weekOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Account Filter */}
          <div className="flex items-center gap-1.5 text-xs text-foreground-secondary">
            <Instagram className="w-3.5 h-3.5 text-foreground-muted" />
            <span className="font-semibold text-foreground">Akun:</span>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs font-bold focus:outline-none focus:ring-1 focus:ring-brand cursor-pointer"
            >
              <option value="@iseeyou.glasses">@iseeyou.glasses (Purwokerto / Pusat)</option>
              <option value="all">Semua Akun &amp; Cabang Jaringan</option>
              <option value="@lunareyewear.co">@lunareyewear.co (Lunar Tegal)</option>
            </select>
          </div>

          {/* PIC Desainer Filter */}
          <div className="flex items-center gap-1.5 text-xs text-foreground-secondary">
            <User className="w-3.5 h-3.5 text-foreground-muted" />
            <span className="font-semibold text-foreground">Desainer / PIC:</span>
            <select
              value={selectedPic}
              onChange={(e) => setSelectedPic(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs font-bold focus:outline-none focus:ring-1 focus:ring-brand cursor-pointer"
            >
              <option value="all">Semua Desainer &amp; PIC</option>
              <option value="Yanuar">Yanuar (Lead)</option>
              <option value="Dimas">Dimas</option>
              <option value="Yasin">Yasin</option>
              <option value="anam">Anam</option>
              <option value="Ilya">Ilya (Reels PWT)</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px] max-w-xs ml-auto">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul konten, caption..."
              className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div className="p-3 rounded-lg bg-status-successBg border border-status-success/30 text-status-success text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 4 Kartu KPI Utama Bulanan */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* KPI 1: Desain Selesai */}
        <div className="p-3.5 rounded-xl border border-border bg-surface shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted">
              Total Desain Selesai
            </span>
            <FileText className="w-4 h-4 text-brand" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-foreground tabular-nums">
              {totalDesigns}
            </span>
            <span className="text-xs text-foreground-secondary font-medium">berkas</span>
          </div>
          <p className="text-[11px] text-foreground-muted mt-1">
            Materi promosi &amp; cetak bulan {currentMonthLabel}
          </p>
        </div>

        {/* KPI 2: Postingan IG Tayang */}
        <div className="p-3.5 rounded-xl border border-border bg-surface shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted">
              Postingan Instagram
            </span>
            <Instagram className="w-4 h-4 text-pink-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-foreground tabular-nums">
              {totalPosts}
            </span>
            <span className="text-xs text-foreground-secondary font-medium">konten</span>
          </div>
          <p className="text-[11px] text-foreground-muted mt-1">
            Tayang di {selectedAccount} ({activePostingDays} hari aktif)
          </p>
        </div>

        {/* KPI 3: Total Reach */}
        <div className="p-3.5 rounded-xl border border-border bg-surface shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted">
              Total Reach Bulanan
            </span>
            <Eye className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-foreground tabular-nums">
              {totalReach.toLocaleString("id-ID")}
            </span>
            <span className="text-xs text-foreground-secondary font-medium">audiens</span>
          </div>
          <p className="text-[11px] text-foreground-muted mt-1">
            Total jangkauan akun unik periode {currentMonthLabel}
          </p>
        </div>

        {/* KPI 4: Rata-rata ER */}
        <div className="p-3.5 rounded-xl border border-border bg-surface shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted">
              Rata-rata Engagement
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-foreground tabular-nums">
              {avgEr}%
            </span>
            <span className="text-xs text-emerald-600 font-bold">Interaksi</span>
          </div>
          <p className="text-[11px] text-foreground-muted mt-1">
            Interaksi per jangkauan (Likes, Saves, Shares)
          </p>
        </div>
      </div>

      {/* SECTION 2A: Rekap Output Desain Grafis Instagram @iseeyou.glasses (Mas Yanuar) */}
      <div className="p-4 rounded-xl border border-border bg-surface shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand" />
              <span>Section 2A — Desain Grafis Instagram @iseeyou.glasses (Mas Yanuar &amp; Tim)</span>
            </h3>
            <p className="text-xs text-foreground-secondary mt-0.5">
              Khusus rekapitulasi output desain materi promosi, cetak, feed &amp; carousel Instagram @iseeyou.glasses oleh Mas Yanuar (Sumber: Tab Rekap Desain &amp; Database Desain) ({activePeriodLabel}).
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-200">
            {totalDesigns} Desain Selesai
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-secondary/50 text-foreground-muted font-bold">
                <th className="py-2.5 px-3 text-left">Nama Desainer / Lead</th>
                <th className="py-2.5 px-3 text-center">Desain Selesai</th>
                <th className="py-2.5 px-3 text-center">Post Feed/Carousel</th>
                <th className="py-2.5 px-3 text-right">Pangsa Kontribusi</th>
                <th className="py-2.5 px-3 text-right">Total Reach</th>
                <th className="py-2.5 px-3 text-right">Rata-rata ER</th>
                <th className="py-2.5 px-3 text-center">Rincian Karya</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {designerSummaries.map((ds) => {
                const isExpanded = expandedDesigner === ds.pic;
                return (
                  <React.Fragment key={ds.pic}>
                    <tr className="hover:bg-surface-secondary/30 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-foreground flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-brand/10 text-brand flex items-center justify-center text-[10px] font-extrabold shrink-0">
                          {ds.pic.slice(0, 1)}
                        </div>
                        <div>
                          <span>{ds.pic}</span>
                          <span className="block text-[10px] text-foreground-muted font-normal">Fokus Desain &amp; Postingan @iseeyou.glasses</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-extrabold text-foreground tabular-nums">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold border border-emerald-200">
                          {ds.totalDesigns} desain
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-semibold text-foreground tabular-nums">
                        {ds.totalIgPosts} post
                      </td>
                      <td className="py-2.5 px-3 text-right text-foreground-secondary tabular-nums">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 bg-surface-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-brand rounded-full"
                              style={{ width: `${Math.min(100, ds.percentageShare)}%` }}
                            />
                          </div>
                          <span>{ds.percentageShare}%</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium text-foreground tabular-nums">
                        {ds.totalReach > 0 ? ds.totalReach.toLocaleString("id-ID") : "-"}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                        {ds.avgEngagementRate > 0 ? `${ds.avgEngagementRate}%` : "-"}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {ds.designs.length > 0 ? (
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedDesigner(isExpanded ? null : ds.pic)
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-surface border border-brand/30 hover:bg-surface-secondary text-brand transition-colors cursor-pointer shadow-2xs"
                          >
                            <span>{ds.designs.length} Berkas Desain</span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        ) : (
                          <span className="text-foreground-muted text-[11px] italic">-</span>
                        )}
                      </td>
                    </tr>

                    {/* Expandable Designer Work Detail */}
                    {isExpanded && ds.designs.length > 0 && (
                      <tr className="bg-surface-secondary/20">
                        <td colSpan={7} className="p-3">
                          <div className="p-3 rounded-lg border border-border bg-surface space-y-2">
                            <span className="text-[11px] font-bold text-foreground block">
                              Daftar Karya Desain yang Dikerjakan oleh {ds.pic} ({activePeriodLabel}):
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                              {ds.designs.map((des, idx) => (
                                <div
                                  key={des.id || idx}
                                  className="p-2.5 rounded-lg border border-border/80 bg-surface-secondary/40 flex flex-col justify-between gap-2 shadow-2xs"
                                >
                                  <div className="space-y-1">
                                    <div className="flex items-start justify-between gap-1.5">
                                      <p className="font-semibold text-foreground line-clamp-2 leading-snug" title={des.designName}>
                                        {idx + 1}. {des.designName}
                                      </p>
                                      {des.sourceSheet === "Rekap Desain" ? (
                                        <span className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                          Rekap Desain
                                        </span>
                                      ) : (
                                        <span className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-medium bg-surface-secondary text-foreground-muted border border-border">
                                          Database Desain
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-foreground-muted">
                                      <span>Tgl: {des.date || "-"}</span>
                                      {des.tasks && (
                                        <span className="truncate max-w-[180px]" title={`Pekerjaan: ${des.tasks}`}>
                                          • {des.tasks}
                                        </span>
                                      )}
                                    </div>
                                    {des.obstacle && (
                                      <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800 line-clamp-1" title={`Kendala: ${des.obstacle}`}>
                                        Kendala: {des.obstacle}
                                      </p>
                                    )}
                                  </div>

                                  <div className="flex items-center justify-between pt-1 border-t border-border/40">
                                    <span className="text-[10px] text-foreground-secondary font-medium">
                                      PIC: {des.pic || des.creator || "Yanuar"}
                                    </span>
                                    {des.fileUrl && des.fileUrl !== "-" && (
                                      <a
                                        href={des.fileUrl.split(",")[0].trim()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 hover:underline shrink-0 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800"
                                      >
                                        <ExternalLink className="w-2.5 h-2.5" />
                                        <span>Drive</span>
                                      </a>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2B: Rekap Performa Video Reels Cabang (Amanda, Ilya, Febi, Ajun, Intan) */}
      <div className="p-4 rounded-xl border border-border bg-surface shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Instagram className="w-4 h-4 text-pink-600" />
              <span>Section 2B — Rekap Performa Video Reels Cabang (Amanda, Ilya, Febi, Ajun)</span>
            </h3>
            <p className="text-xs text-foreground-secondary mt-0.5">
              Evaluasi kuota dan capaian engagement PIC Video Reels di tiap cabang jaringan Optik I See You &amp; Lunar Eyewear ({activePeriodLabel}).
            </p>
          </div>
          <span className="text-xs font-semibold text-foreground-muted">
            Target Standar: {selectedWeek !== "w4_monthly" ? "3-4 Video / Minggu" : "14 Video / Bulan"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-secondary/50 text-foreground-muted font-bold">
                <th className="py-2.5 px-3 text-left">PIC &amp; Cabang</th>
                <th className="py-2.5 px-3 text-left">Akun Instagram</th>
                <th className="py-2.5 px-3 text-center">Reels Tayang</th>
                <th className="py-2.5 px-3 text-center">Target Kuota</th>
                <th className="py-2.5 px-3 text-center">Capaian Kuota</th>
                <th className="py-2.5 px-3 text-right">Total Views</th>
                <th className="py-2.5 px-3 text-right">Total Likes</th>
                <th className="py-2.5 px-3 text-right">Rata2 ER</th>
                <th className="py-2.5 px-3 text-left">Top Konten Reels</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {branchReelsSummaries.map((br) => {
                const isAboveTarget = br.quotaPercentage >= 100;
                return (
                  <tr key={br.branchName} className="hover:bg-surface-secondary/30 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-foreground whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-pink-500/10 text-pink-700 dark:text-pink-300 flex items-center justify-center text-[10px] font-extrabold shrink-0">
                          {br.pic.slice(0, 1)}
                        </div>
                        <div>
                          <span>{br.pic}</span>
                          <span className="block text-[10px] text-foreground-muted font-normal">
                            {br.branchName}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-brand whitespace-nowrap">
                      {br.accountHandle}
                    </td>
                    <td className="py-2.5 px-3 text-center font-extrabold text-foreground tabular-nums">
                      <span className="inline-block px-2.5 py-0.5 rounded bg-surface-secondary text-foreground font-bold border border-border">
                        {br.totalReels} video
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-semibold text-foreground-muted tabular-nums">
                      {br.targetQuota} video
                    </td>
                    <td className="py-2.5 px-3 text-center tabular-nums">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-14 h-1.5 bg-surface-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isAboveTarget ? "bg-emerald-600" : "bg-amber-500"}`}
                            style={{ width: `${Math.min(100, br.quotaPercentage)}%` }}
                          />
                        </div>
                        <span className={`font-bold text-[11px] ${isAboveTarget ? "text-emerald-700" : "text-amber-700"}`}>
                          {br.quotaPercentage}%
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-medium text-foreground tabular-nums whitespace-nowrap">
                      {br.totalViews > 0 ? br.totalViews.toLocaleString("id-ID") : "-"}
                    </td>
                    <td className="py-2.5 px-3 text-right font-medium text-foreground tabular-nums whitespace-nowrap">
                      {br.totalLikes > 0 ? br.totalLikes.toLocaleString("id-ID") : "-"}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                      {br.avgEngagementRate}%
                    </td>
                    <td className="py-2.5 px-3 max-w-xs text-foreground truncate" title={br.topReelsTitle}>
                      {br.topReelsTitle}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: Date-by-Date Posting & Design Tracker */}
      <div className="p-4 rounded-xl border border-border bg-surface shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Section 3 — Date-by-Date Tracker: Deteksi Tanggal Posting IG &amp; Desain</span>
            </h3>
            <p className="text-xs text-foreground-secondary mt-0.5">
              Pelacakan harian tanggal berapa saja ada konten rilis di Instagram {selectedAccount} dan berapa desain baru yang dibuat ({activePeriodLabel}).
            </p>
          </div>
          <span className="text-xs text-foreground-muted font-medium">
            Periode: {activePeriodLabel}
          </span>
        </div>

        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-surface z-10">
              <tr className="border-b border-border bg-surface-secondary/70 text-foreground-muted font-bold">
                <th className="py-2.5 px-3 text-left">Tanggal</th>
                <th className="py-2.5 px-3 text-center">Postingan IG</th>
                <th className="py-2.5 px-3 text-center">Desain Baru</th>
                <th className="py-2.5 px-3 text-left">Judul Konten / Desain Terdeteksi</th>
                <th className="py-2.5 px-3 text-right">Reach</th>
                <th className="py-2.5 px-3 text-right">Likes</th>
                <th className="py-2.5 px-3 text-right">ER (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {dailySummaries
                .filter((d) => d.postCount > 0 || d.designCount > 0)
                .map((row) => (
                  <tr key={row.date} className="hover:bg-surface-secondary/30 transition-colors">
                    <td className="py-2 px-3 font-bold text-foreground whitespace-nowrap">
                      {row.formattedDate}
                    </td>
                    <td className="py-2 px-3 text-center whitespace-nowrap">
                      {row.postCount > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300 border border-pink-200">
                          <Instagram className="w-2.5 h-2.5" />
                          <span>{row.postCount} post</span>
                        </span>
                      ) : (
                        <span className="text-foreground-muted">-</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center whitespace-nowrap">
                      {row.designCount > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200">
                          <FileText className="w-2.5 h-2.5" />
                          <span>{row.designCount} desain</span>
                        </span>
                      ) : (
                        <span className="text-foreground-muted">-</span>
                      )}
                    </td>
                    <td className="py-2 px-3 max-w-md">
                      <div className="space-y-1">
                        {row.posts.map((p) => (
                          <div key={p.id} className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-brand/10 text-brand">
                              {p.format}
                            </span>
                            <span className="font-semibold text-foreground truncate" title={p.title}>
                              {p.title}
                            </span>
                            {p.postUrl && (
                              <a
                                href={p.postUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand hover:underline shrink-0"
                                title="Buka postingan di Instagram"
                              >
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        ))}
                        {row.designs.map((des) => (
                          <div key={des.id} className="flex items-center gap-1.5 text-foreground-secondary text-[11px]">
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-emerald-100 text-emerald-800">
                              Desain
                            </span>
                            <span className="truncate" title={des.designName}>
                              {des.designName} ({des.pic || des.creator || "Yanuar"})
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-right font-medium text-foreground tabular-nums whitespace-nowrap">
                      {row.totalReach > 0 ? row.totalReach.toLocaleString("id-ID") : "-"}
                    </td>
                    <td className="py-2 px-3 text-right font-medium text-foreground tabular-nums whitespace-nowrap">
                      {row.totalLikes > 0 ? row.totalLikes.toLocaleString("id-ID") : "-"}
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-emerald-700 dark:text-emerald-400 tabular-nums whitespace-nowrap">
                      {row.avgEngagementRate > 0 ? `${row.avgEngagementRate}%` : "-"}
                    </td>
                  </tr>
                ))}
              {dailySummaries.filter((d) => d.postCount > 0 || d.designCount > 0).length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-foreground-muted italic">
                    Belum ada postingan atau desain yang terdata pada tanggal-tanggal di bulan {currentMonthLabel}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4: Tabel Performa Konten Postingan IG */}
      <div className="p-4 rounded-xl border border-border bg-surface shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand" />
              <span>Section 4 — Tabel Performa Postingan Instagram {selectedAccount} ({activePeriodLabel})</span>
            </h3>
            <p className="text-xs text-foreground-secondary mt-0.5">
              Seluruh postingan Instagram yang rilis pada periode {activePeriodLabel} diurutkan berdasarkan performa jangkauan.
            </p>
          </div>
          <span className="text-xs font-semibold text-foreground-muted">
            {monthFilteredPosts.length} Postingan Ditemukan
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-secondary/50 text-foreground-muted font-bold">
                <th className="py-2.5 px-3 text-left">No</th>
                <th className="py-2.5 px-3 text-left">Tanggal</th>
                <th className="py-2.5 px-3 text-center">Format</th>
                <th className="py-2.5 px-3 text-left">Judul / Hook Konten</th>
                <th className="py-2.5 px-3 text-right">Reach</th>
                <th className="py-2.5 px-3 text-right">Likes</th>
                <th className="py-2.5 px-3 text-right">Comments</th>
                <th className="py-2.5 px-3 text-right">Saves</th>
                <th className="py-2.5 px-3 text-right">Shares</th>
                <th className="py-2.5 px-3 text-right">ER (%)</th>
                <th className="py-2.5 px-3 text-center">Tautan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {monthFilteredPosts.map((post, idx) => (
                <tr key={post.id || idx} className="hover:bg-surface-secondary/30 transition-colors">
                  <td className="py-2.5 px-3 text-foreground-muted">{idx + 1}</td>
                  <td className="py-2.5 px-3 font-semibold text-foreground whitespace-nowrap">
                    {post.publishDate}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        post.format === "reels"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                          : post.format === "carousel"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      }`}
                    >
                      {post.format}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-foreground max-w-sm truncate" title={post.title}>
                    {post.title}
                  </td>
                  <td className="py-2.5 px-3 text-right font-extrabold text-foreground tabular-nums">
                    {(post.reach || 0).toLocaleString("id-ID")}
                  </td>
                  <td className="py-2.5 px-3 text-right text-foreground-secondary tabular-nums">
                    {(post.likes || 0).toLocaleString("id-ID")}
                  </td>
                  <td className="py-2.5 px-3 text-right text-foreground-secondary tabular-nums">
                    {(post.comments || 0).toLocaleString("id-ID")}
                  </td>
                  <td className="py-2.5 px-3 text-right text-foreground-secondary tabular-nums">
                    {(post.saves || 0).toLocaleString("id-ID")}
                  </td>
                  <td className="py-2.5 px-3 text-right text-foreground-secondary tabular-nums">
                    {(post.shares || 0).toLocaleString("id-ID")}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                    {post.engagementRate}%
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {post.postUrl ? (
                      <a
                        href={post.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand hover:underline"
                        title="Buka postingan langsung di Instagram"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Buka</span>
                      </a>
                    ) : (
                      <span className="text-foreground-muted">-</span>
                    )}
                  </td>
                </tr>
              ))}
              {monthFilteredPosts.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-foreground-muted italic">
                    Tidak ada postingan Instagram {selectedAccount} pada bulan {currentMonthLabel}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
