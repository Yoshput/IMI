"use client";

import React from "react";
import { Calendar, Clock, Filter, Sparkles, Building2 } from "lucide-react";

interface ContentFilterToolbarProps {
  period: "weekly" | "monthly";
  onPeriodChange: (period: "weekly" | "monthly") => void;
  activeBranch: string;
  onBranchChange: (branch: string) => void;
  activeFormat: string;
  onFormatChange: (format: string) => void;
  sortBy: "reach" | "likes" | "engagement" | "rank";
  onSortChange: (sort: "reach" | "likes" | "engagement" | "rank") => void;
  totalCount: number;
}

export const ContentFilterToolbar: React.FC<ContentFilterToolbarProps> = ({
  period,
  onPeriodChange,
  activeBranch,
  onBranchChange,
  activeFormat,
  onFormatChange,
  sortBy,
  onSortChange,
  totalCount,
}) => {
  const branches = [
    { label: "Semua Cabang (5 Cabang)", value: "all" },
    { label: "Purwokerto (Pusat)", value: "pwt" },
    { label: "Purbalingga", value: "pbg" },
    { label: "Cilacap", value: "clp" },
    { label: "Wonosobo", value: "wns" },
    { label: "Lunar Tegal (Second Brand)", value: "tgl" },
  ];

  const formats = [
    { label: "Semua Format", value: "all" },
    { label: "Reels", value: "reels" },
    { label: "Carousel", value: "carousel" },
    { label: "Feed Single", value: "feed" },
  ];

  return (
    <div className="space-y-3 pb-4 mb-4 border-b border-border text-xs">
      {/* Row 1: Period Toggle (Mingguan vs Bulanan) & Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-secondary/60 p-2.5 rounded-control border border-border">
        {/* Apple Style Segmented Period Control */}
        <div className="flex items-center gap-1 bg-surface p-1 rounded-control border border-border shadow-2xs">
          <button
            onClick={() => onPeriodChange("weekly")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-control font-semibold transition-all ${
              period === "weekly"
                ? "bg-brand text-white shadow-subtle"
                : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Mingguan (7 Hari Terakhir)</span>
          </button>
          <button
            onClick={() => onPeriodChange("monthly")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-control font-semibold transition-all ${
              period === "monthly"
                ? "bg-brand text-white shadow-subtle"
                : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Bulanan (September 2026)</span>
          </button>
        </div>

        {/* Sorting Control */}
        <div className="flex items-center gap-2">
          <span className="text-foreground-muted whitespace-nowrap">Urutkan:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            aria-label="Urutkan Konten Berdasarkan"
            className="px-2.5 py-1.5 rounded-control bg-surface border border-border text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="reach">Jangkauan (Views Terbesar)</option>
            <option value="likes">Likes Terbanyak (Live IG)</option>
            <option value="engagement">Engagement Rate (%)</option>
            <option value="rank">Ranking Performa (#1 - #10)</option>
          </select>
          <span className="text-foreground-muted font-medium ml-1">
            ({totalCount} item)
          </span>
        </div>
      </div>

      {/* Row 2: Cabang Filter (4 Optik I See You + 1 Lunar Tegal) & Format */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Cabang Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
          <span className="text-[11px] font-semibold text-foreground-muted mr-1 flex items-center gap-1 whitespace-nowrap">
            <Building2 className="w-3.5 h-3.5" />
            Cabang:
          </span>
          {branches.map((b) => (
            <button
              key={b.value}
              onClick={() => onBranchChange(b.value)}
              className={`px-2.5 py-1 rounded-control font-medium whitespace-nowrap transition-colors ${
                activeBranch === b.value
                  ? "bg-foreground text-surface font-semibold shadow-2xs"
                  : "bg-surface text-foreground-secondary hover:text-foreground border border-border"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Format Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
          <span className="text-[11px] font-semibold text-foreground-muted mr-1 flex items-center gap-1 whitespace-nowrap">
            <Filter className="w-3 h-3" />
            Format:
          </span>
          {formats.map((f) => (
            <button
              key={f.value}
              onClick={() => onFormatChange(f.value)}
              className={`px-2.5 py-1 rounded-control font-medium whitespace-nowrap transition-colors ${
                activeFormat === f.value
                  ? "bg-brand text-white font-semibold shadow-2xs"
                  : "bg-surface text-foreground-secondary hover:text-foreground border border-border"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
