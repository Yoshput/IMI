"use client";

import React, { useState, useMemo, useEffect } from "react";
import { getRealContentItems } from "@/lib/real-content-items";
import { DominantPerformer } from "./DominantPerformer";
import { ContentFilterToolbar } from "./ContentFilterToolbar";
import { RankedContentTable } from "./RankedContentTable";
import { StateRenderer } from "@/components/shared/StateRenderer";
import { Film, Plus, RefreshCw, ExternalLink, ShieldCheck } from "lucide-react";
import { DevStateSwitcher } from "@/components/shared/DevStateSwitcher";

export const ContentView: React.FC = () => {
  const [viewState, setViewState] = useState<"success" | "loading" | "empty" | "error">("success");
  const [period, setPeriod] = useState<"weekly" | "monthly">("monthly");
  const [activeBranch, setActiveBranch] = useState<string>("all");
  const [activeFormat, setActiveFormat] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"reach" | "likes" | "engagement" | "rank">("reach");
  const [contentList, setContentList] = useState(() => getRealContentItems(undefined, "monthly"));
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Fetch live metrics on mount and when period changes
  const loadData = async (targetPeriod: "weekly" | "monthly") => {
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
  }, [period]);

  const handlePeriodChange = (newPeriod: "weekly" | "monthly") => {
    setPeriod(newPeriod);
  };

  // Filter & Sort logic
  const filteredItems = useMemo(() => {
    let items = [...contentList];

    // Filter by branch (4 Optik I See You + 1 Lunar Tegal)
    if (activeBranch !== "all") {
      items = items.filter((item) => item.branchKey === activeBranch);
    }

    // Filter by format
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

    return items;
  }, [contentList, activeBranch, activeFormat, sortBy]);

  const topPerformer = filteredItems[0] || contentList[0];

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const res = await fetch("/api/content-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshLive: true, period }),
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.items)) {
        setContentList(json.items);
        setLastSyncTime(new Date().toLocaleTimeString("id-ID"));
        setSyncStatus("Data live Instagram 5 cabang berhasil disinkronkan!");
        setTimeout(() => setSyncStatus(null), 3500);
      } else {
        throw new Error(json.error || "Gagal sinkronisasi");
      }
    } catch (e: any) {
      setSyncStatus(`Gagal sync: ${e.message}`);
    } finally {
      setIsSyncing(false);
    }
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
            <span>Log Konten & Analisis Kinerja</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-800" />
              Live Instagram Sync Terverifikasi (4 Cabang ISY + 1 Lunar Tegal)
            </span>
            {lastSyncTime && (
              <span className="text-[11px] text-foreground-muted">
                (Update: {lastSyncTime})
              </span>
            )}
          </div>
          <h1 className="heading-page text-foreground">Evaluasi Kinerja Konten</h1>
          <p className="text-sm text-foreground-secondary mt-1">
            Monitoring performa konten riil dari 4 cabang Optik I See You dan 1 cabang Lunar Eyewear Tegal (Second Brand) dengan data live Instagram.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {syncStatus && (
            <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              {syncStatus}
            </span>
          )}
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-surface border border-border text-foreground text-xs font-semibold hover:bg-surface-secondary transition-colors shadow-subtle disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-brand" : ""}`} />
            <span>{isSyncing ? "Sinkronisasi Live..." : "Sinkronkan Live Instagram"}</span>
          </button>
          <a
            href="https://www.instagram.com/iseeyou.glasses/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-brand text-white text-xs font-semibold hover:bg-brand-hover transition-colors shadow-subtle"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>@iseeyou.glasses</span>
          </a>
          <a
            href="https://www.instagram.com/lunareyewear.co"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-surface border border-border text-foreground text-xs font-semibold hover:bg-surface-secondary transition-colors shadow-subtle"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>@lunareyewear.co</span>
          </a>
        </div>
      </div>

      <StateRenderer
        status={viewState}
        onRetry={() => setViewState("success")}
        emptyTitle="Belum Ada Log Konten"
        emptyDescription="Tidak ada data konten yang cocok dengan filter cabang atau format yang dipilih."
        emptyActionLabel="Reset Filter"
        onEmptyAction={() => {
          setActiveBranch("all");
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
                Daftar Seluruh Konten & Ranking Bukti (
                {period === "weekly" ? "Mingguan · 7 Hari Terakhir" : "Bulanan · September 2026"}
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
            onBranchChange={setActiveBranch}
            activeFormat={activeFormat}
            onFormatChange={setActiveFormat}
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalCount={filteredItems.length}
          />

          <RankedContentTable items={filteredItems} />
        </div>
      </StateRenderer>
    </div>
  );
};
