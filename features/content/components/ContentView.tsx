"use client";

import React, { useState, useMemo } from "react";
import { getRealContentItems } from "@/lib/real-content-items";
import { DominantPerformer } from "./DominantPerformer";
import { ContentFilterToolbar } from "./ContentFilterToolbar";
import { RankedContentTable } from "./RankedContentTable";
import { StateRenderer } from "@/components/shared/StateRenderer";
import { Film, Plus, RefreshCw, Sparkles, ExternalLink } from "lucide-react";
import { DevStateSwitcher } from "@/components/shared/DevStateSwitcher";

export const ContentView: React.FC = () => {
  const [viewState, setViewState] = useState<"success" | "loading" | "empty" | "error">("success");
  const [activeFormat, setActiveFormat] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"rank" | "reach" | "saves" | "engagement">("reach");
  const [contentList, setContentList] = useState(() => getRealContentItems());
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Filter & Sort logic
  const filteredItems = useMemo(() => {
    let items = [...contentList];

    if (activeFormat !== "all") {
      items = items.filter((item) => item.format === activeFormat);
    }

    items.sort((a, b) => {
      if (sortBy === "reach") return b.reach - a.reach;
      if (sortBy === "saves") return b.saves - a.saves;
      if (sortBy === "engagement") return b.engagementRate - a.engagementRate;
      return a.rank - b.rank;
    });

    return items;
  }, [contentList, activeFormat, sortBy]);

  const topPerformer = filteredItems[0] || contentList[0];

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const res = await fetch("/api/sync-sheets", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setContentList(getRealContentItems());
        setSyncStatus("Data konten & cover Instagram berhasil disinkronkan!");
        setTimeout(() => setSyncStatus(null), 3000);
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
          <div className="flex items-center gap-2 text-caption font-medium uppercase tracking-wider text-foreground-secondary mb-1">
            <span>Log Konten & Analisis Kinerja</span>
            <span>·</span>
            <span>Cover Asli Instagram & Spreadsheet Riil</span>
          </div>
          <h1 className="heading-page text-foreground">Evaluasi Konten Mingguan</h1>
          <p className="text-sm text-foreground-secondary mt-1">
            Daftar peringkat postingan Instagram nyata dengan cover asli dari @iseeyou.glasses dan cabang lainnya.
          </p>
        </div>

        <div className="flex items-center gap-2">
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
            <span>{isSyncing ? "Sinkronisasi..." : "Sinkronkan Konten"}</span>
          </button>
          <a
            href="https://www.instagram.com/iseeyou.glasses/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-brand text-white text-xs font-semibold hover:bg-brand-hover transition-colors shadow-subtle"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Buka @iseeyou.glasses</span>
          </a>
        </div>
      </div>

      <StateRenderer
        status={viewState}
        onRetry={() => setViewState("success")}
        emptyTitle="Belum Ada Log Konten"
        emptyDescription="Catat postingan Reels atau Carousel pertama minggu ini untuk melihat analisis ranking performa."
        emptyActionLabel="Tambah Konten Baru"
        onEmptyAction={() => alert("Membuka form penambahan konten...")}
      >
        {/* Dominant Performer Showcase with authentic IG cover */}
        {topPerformer && <DominantPerformer item={topPerformer} />}

        {/* Filter and Table View */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="heading-section text-foreground flex items-center gap-2">
              <span>Daftar Seluruh Konten & Ranking Bukti (September 2026)</span>
              <span className="text-xs font-normal text-foreground-secondary">
                ({filteredItems.length} konten terverifikasi)
              </span>
            </h3>
          </div>

          <ContentFilterToolbar
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
