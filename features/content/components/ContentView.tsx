"use client";

import React, { useState, useMemo, useEffect } from "react";
import { getRealContentItems, ContentPeriod } from "@/lib/real-content-items";
import { DominantPerformer } from "./DominantPerformer";
import { ContentFilterToolbar, FormatCounts } from "./ContentFilterToolbar";
import { RankedContentTable } from "./RankedContentTable";
import { StateRenderer } from "@/components/shared/StateRenderer";
import { RefreshCw, ExternalLink, ShieldCheck, Download, CheckCircle2, AlertCircle } from "lucide-react";
import { DevStateSwitcher } from "@/components/shared/DevStateSwitcher";
import { downloadCSV } from "@/lib/export-csv";
import { useBranch } from "@/context/BranchContext";
import { matchesBranch } from "@/lib/branch-accounts";

export const ContentView: React.FC = () => {
  const { selectedBranchId, setSelectedBranchId } = useBranch();
  const [viewState, setViewState] = useState<"success" | "loading" | "empty" | "error">("success");
  const [period, setPeriod] = useState<ContentPeriod>("weekly");
  const [activeBranch, setActiveBranch] = useState<string>(selectedBranchId);
  const [activeFormat, setActiveFormat] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"reach" | "likes" | "engagement" | "rank">("reach");
  const [contentList, setContentList] = useState(() => getRealContentItems(undefined, "weekly"));
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Synchronize local activeBranch when global selectedBranchId changes
  useEffect(() => {
    setActiveBranch(selectedBranchId);
  }, [selectedBranchId]);

  const handleBranchSelect = (branch: string) => {
    setActiveBranch(branch);
    setSelectedBranchId(branch as any);
  };

  // Fetch live metrics on mount and when period changes
  const loadData = async (targetPeriod: ContentPeriod) => {
    try {
      const res = await fetch(`/api/content-items?period=${targetPeriod}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        setContentList(data.items);
        if (data.lastSync) setLastSyncTime(new Date(data.lastSync).toLocaleTimeString("id-ID"));
      }
    } catch (err) {
      console.error("Error fetching live content items:", err);
    }
  };

  useEffect(() => {
    loadData(period);
    // Background polling every 60s for automatic realtime sync
    const interval = setInterval(() => {
      loadData(period);
    }, 60000);
    return () => clearInterval(interval);
  }, [period]);

  const handlePeriodChange = (newPeriod: ContentPeriod) => {
    setPeriod(newPeriod);
  };

  // Filter & Sort logic
  const filteredItems = useMemo(() => {
    let items = [...contentList];

    // Filter by branch (4 Optik I See You + 1 Lunar Tegal)
    if (activeBranch !== "all") {
      items = items.filter(
        (item) =>
          matchesBranch(item.branchKey || "", activeBranch) ||
          matchesBranch(item.branchName || "", activeBranch)
      );
    }

    // Filter by format (reels | carousel | feed)
    if (activeFormat !== "all") {
      items = items.filter((item) => item.format === activeFormat);
    }

    // Sort logic
    items.sort((a, b) => {
      if (sortBy === "reach") return b.reach - a.reach;
      if (sortBy === "likes") return b.likes - a.likes;
      if (sortBy === "engagement") return b.engagementRate - a.engagementRate;
      return a.rank - b.rank;
    });

    return items.map((it, idx) => ({
      ...it,
      rank: idx + 1,
      isDominantPerformer: idx === 0,
    }));
  }, [contentList, activeBranch, activeFormat, sortBy]);

  // Dynamic format counters relative to branch filter
  const formatCounts: FormatCounts = useMemo(() => {
    const branchFiltered =
      activeBranch === "all"
        ? contentList
        : contentList.filter(
            (it) =>
              matchesBranch(it.branchKey || "", activeBranch) ||
              matchesBranch(it.branchName || "", activeBranch)
          );
    return {
      all: branchFiltered.length,
      reels: branchFiltered.filter((it) => it.format === "reels").length,
      carousel: branchFiltered.filter((it) => it.format === "carousel").length,
      feed: branchFiltered.filter((it) => it.format === "feed").length,
    };
  }, [contentList, activeBranch]);

  const topPerformer = filteredItems[0] || contentList[0];

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    setSyncError(null);
    try {
      const res = await fetch("/api/content-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshLive: true, period }),
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.items)) {
        setContentList(json.items);
        const timeStr = new Date().toLocaleTimeString("id-ID");
        setLastSyncTime(timeStr);
        setSyncStatus(`Sinkronisasi selesai: ${json.branchesSynced || 5} cabang diperbarui (${json.items.length} konten terverifikasi). Update: ${timeStr} WIB`);
        setTimeout(() => setSyncStatus(null), 5000);
      } else {
        throw new Error(json.error || "Gagal sinkronisasi");
      }
    } catch (e: any) {
      setSyncError(`Kendala sync: ${e.message}`);
      setTimeout(() => setSyncError(null), 5000);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Rank",
      "Judul / Caption",
      "Cabang",
      "Format Konten",
      "Total Reach",
      "Likes",
      "Engagement Rate (%)",
      "Tanggal Posting",
      "URL Tautan",
    ];
    const rows = filteredItems.map((it) => [
      it.rank,
      it.title,
      it.branchName || "Optik I See You",
      it.format,
      it.reach,
      it.likes,
      it.engagementRate,
      it.publishDate,
      it.postUrl || "-",
    ]);
    const branchLabel = activeBranch === "all" ? "semua-cabang" : activeBranch;
    downloadCSV(`konten-intelligence-${branchLabel}-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  return (
    <div className="space-y-6">
      <DevStateSwitcher
        moduleName="Content"
        currentState={viewState}
        onStateChange={setViewState}
      />

      {/* Header Context */}
      <div className="border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-caption font-medium uppercase tracking-wider text-foreground-secondary mb-1">
            <span>Log Konten &amp; Analisis Kinerja</span>
            <span>&middot;</span>
            <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-800" />
              Live Instagram Sync Terverifikasi (4 Cabang ISY + 1 Lunar Tegal)
            </span>
            {lastSyncTime && (
              <span className="text-[11px] text-foreground-muted">
                (Update: {lastSyncTime} WIB)
              </span>
            )}
          </div>
          <h1 className="heading-page text-foreground">Evaluasi Kinerja Konten</h1>
          <p className="text-sm text-foreground-secondary mt-1">
            Monitoring performa konten riil dari 4 cabang Optik I See You dan 1 cabang Lunar Eyewear Tegal (Second Brand) dengan data live Instagram.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-brand text-brand-contrast text-xs font-semibold hover:brightness-110 transition-all shadow-subtle disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Menyelaraskan 5 Cabang..." : "Sinkronkan Live Instagram"}</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-surface border border-border text-foreground text-xs font-semibold hover:bg-surface-secondary transition-colors shadow-subtle cursor-pointer"
            title="Unduh Data Konten (.csv)"
          >
            <Download className="w-3.5 h-3.5 text-brand" />
            <span>Export CSV</span>
          </button>
          <a
            href="https://www.instagram.com/iseeyou.glasses/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-control bg-surface border border-border text-foreground text-xs font-medium hover:bg-surface-secondary transition-colors shadow-subtle"
            title="Instagram Pusat @iseeyou.glasses (Purwokerto)"
          >
            <ExternalLink className="w-3 h-3 text-brand" />
            <span>@iseeyou.glasses</span>
          </a>
          <a
            href="https://www.instagram.com/lunareyewear.co"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-control bg-surface border border-border text-foreground text-xs font-medium hover:bg-surface-secondary transition-colors shadow-subtle"
            title="Instagram Lunar Eyewear Tegal (Second Brand)"
          >
            <ExternalLink className="w-3 h-3 text-brand" />
            <span>@lunareyewear.co</span>
          </a>
        </div>
      </div>

      {/* Sync Status Feedback Toast Banner */}
      {syncStatus && (
        <div className="p-3 rounded-control bg-status-successBg border border-status-success/30 text-status-success text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{syncStatus}</span>
        </div>
      )}

      {syncError && (
        <div className="p-3 rounded-control bg-status-errorBg border border-status-error/30 text-status-error text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200 shadow-2xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{syncError}</span>
        </div>
      )}

      <StateRenderer
        status={viewState}
        onRetry={() => setViewState("success")}
        emptyTitle="Belum Ada Log Konten"
        emptyDescription="Tidak ada data konten yang cocok dengan filter cabang atau format yang dipilih."
        emptyActionLabel="Reset Filter"
        onEmptyAction={() => {
          handleBranchSelect("all");
          setActiveFormat("all");
        }}
      >
        {/* Dominant Performer Showcase with authentic IG cover */}
        {topPerformer && <DominantPerformer item={topPerformer} />}

        {/* Filter and Table View */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="heading-section text-foreground flex items-center gap-2">
              <span>
                Daftar Seluruh Konten &amp; Ranking Bukti (
                {period === "weekly"
                  ? "Mingguan · Konten Minggu Ini (6 - 16 Okt 2026)"
                  : period === "monthly"
                  ? "Bulanan · Rekap September - Oktober 2026"
                  : "Semua Waktu · All-Time & Rekor Viral"}
                )
              </span>
              <span className="text-xs font-normal text-foreground-secondary">
                ({filteredItems.length} konten terverifikasi)
              </span>
            </h3>
          </div>

          <ContentFilterToolbar
            period={period}
            onPeriodChange={handlePeriodChange}
            activeBranch={activeBranch}
            onBranchChange={handleBranchSelect}
            activeFormat={activeFormat}
            onFormatChange={setActiveFormat}
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalCount={filteredItems.length}
            formatCounts={formatCounts}
          />

          <RankedContentTable items={filteredItems} />
        </div>
      </StateRenderer>
    </div>
  );
};
