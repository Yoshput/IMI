"use client";

import React from "react";
import { ContentFormat } from "@/types";

interface ContentFilterToolbarProps {
  activeFormat: string;
  onFormatChange: (format: string) => void;
  sortBy: "rank" | "reach" | "saves" | "engagement";
  onSortChange: (sort: "rank" | "reach" | "saves" | "engagement") => void;
  totalCount: number;
}

export const ContentFilterToolbar: React.FC<ContentFilterToolbarProps> = ({
  activeFormat,
  onFormatChange,
  sortBy,
  onSortChange,
  totalCount,
}) => {
  const formats: { label: string; value: string }[] = [
    { label: "Semua Format", value: "all" },
    { label: "Reels", value: "reels" },
    { label: "Carousel", value: "carousel" },
    { label: "Feed Single", value: "feed" },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-border text-xs">
      {/* Format Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
        {formats.map((f) => (
          <button
            key={f.value}
            onClick={() => onFormatChange(f.value)}
            className={`px-3 py-1.5 rounded-control font-medium whitespace-nowrap transition-colors ${
              activeFormat === f.value
                ? "bg-foreground text-surface font-semibold"
                : "bg-surface text-foreground-secondary hover:text-foreground border border-border"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Sorting Control */}
      <div className="flex items-center gap-2">
        <span className="text-foreground-muted whitespace-nowrap">Urutkan Berdasarkan:</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as any)}
          aria-label="Urutkan Konten Berdasarkan"
          className="px-2.5 py-1.5 rounded-control bg-surface border border-border text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-brand"
        >
          <option value="rank">Ranking Performa (#1 - #5)</option>
          <option value="reach">Jangkauan (Reach Terbesar)</option>
          <option value="saves">Jumlah Saves Terbanyak</option>
          <option value="engagement">Engagement Rate (%)</option>
        </select>
        <span className="text-foreground-muted font-medium ml-1">
          ({totalCount} item)
        </span>
      </div>
    </div>
  );
};
