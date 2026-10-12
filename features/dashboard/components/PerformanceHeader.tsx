import React from "react";
import { ProvenanceBadge } from "@/components/shared/ProvenanceBadge";
import { Calendar, CheckCircle2, TrendingUp } from "lucide-react";

interface PerformanceHeaderProps {
  periodLabel?: string;
  publishTargetAchieved?: boolean;
  totalPostsPublished?: number;
  wowGrowthText?: string;
  provenanceDate?: string;
  provenanceLabel?: string;
}

export const PerformanceHeader: React.FC<PerformanceHeaderProps> = ({
  periodLabel = "Siklus 8 · 6–12 Oktober 2026 · Rapat 13 Oktober",
  publishTargetAchieved = true,
  totalPostsPublished = 18,
  wowGrowthText = "Target Kuota 128.6% (18/14 Konten)",
  provenanceDate = "12 Oktober 2026",
  provenanceLabel = "Data sinkronisasi Google Sheets 5 Cabang terverifikasi per 12 Oktober 2026",
}) => {
  return (
    <div className="border-b border-border pb-6 mb-8">
      {/* Small Context Line (DESIGN.md §13) */}
      <div className="flex flex-wrap items-center gap-2 text-caption font-medium uppercase tracking-wider mb-2 text-foreground-secondary">
        <span>Optik I See You (PWT · PBG · CLP · WNS)</span>
        <span>·</span>
        <span>Lunar Eyewear Tegal</span>
        <span>·</span>
        <span>Konsolidasi Intelligence Mingguan</span>
      </div>

      {/* Large Title & Period */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="heading-page text-foreground">Marketing Performance</h1>
          <div className="flex items-center gap-2 mt-1 text-sm text-foreground-secondary">
            <Calendar className="w-4 h-4 text-foreground-muted" />
            <span className="font-medium text-foreground">{periodLabel}</span>
          </div>
        </div>

        {/* Operational Status Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-control bg-brand-light text-brand text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand" />
            <span>Target Output: {totalPostsPublished}/14 Post Terpenuhi</span>
          </div>
          {wowGrowthText && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-control bg-status-successBg text-status-success text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{wowGrowthText}</span>
            </div>
          )}
          <ProvenanceBadge
            source="sheets_sync"
            date={provenanceDate}
            sourceLabel={provenanceLabel}
            isDemo={false}
          />
        </div>
      </div>
    </div>
  );
};
