"use client";

import React, { useState, useMemo } from "react";
import { DEMO_CONTENT_ITEMS } from "@/lib/seed-data";
import { DominantPerformer } from "./DominantPerformer";
import { ContentFilterToolbar } from "./ContentFilterToolbar";
import { RankedContentTable } from "./RankedContentTable";
import { StateRenderer } from "@/components/shared/StateRenderer";
import { Film, Plus } from "lucide-react";

import { DevStateSwitcher } from "@/components/shared/DevStateSwitcher";

export const ContentView: React.FC = () => {
  const [viewState, setViewState] = useState<"success" | "loading" | "empty" | "error">("success");
  const [activeFormat, setActiveFormat] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"rank" | "reach" | "saves" | "engagement">("rank");

  // Filter & Sort logic
  const filteredItems = useMemo(() => {
    let items = [...DEMO_CONTENT_ITEMS];

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
  }, [activeFormat, sortBy]);

  const topPerformer = DEMO_CONTENT_ITEMS.find((item) => item.rank === 1) || DEMO_CONTENT_ITEMS[0];

  return (
    <div className="space-y-6">
      {/* Dev / State Preview Switcher hidden behind dev-flag / ?dev=true (Audit Item #1) */}
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
            <span>Instagram Feed & Reels</span>
          </div>
          <h1 className="heading-page text-foreground">Evaluasi Konten Mingguan</h1>
          <p className="text-sm text-foreground-secondary mt-1">
            Daftar peringkat postingan berdasarkan respon nyata audiens (Saves, Reach, dan Interaksi).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Form pencatatan konten baru siap diintegrasikan dengan database.")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-brand text-white text-xs font-semibold hover:bg-brand-hover transition-colors shadow-subtle"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Catat Postingan Baru</span>
          </button>
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
        {/* Dominant Performer Showcase (DESIGN.md §15) */}
        <DominantPerformer item={topPerformer} />

        {/* Filter and Table View */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="heading-section text-foreground">
              Daftar Seluruh Konten & Ranking Bukti (Week 37)
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
