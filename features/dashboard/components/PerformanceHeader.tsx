import React from "react";
import { ProvenanceBadge } from "@/components/shared/ProvenanceBadge";
import { Calendar, CheckCircle2, TrendingUp } from "lucide-react";

interface PerformanceHeaderProps {
  periodLabel?: string;
  publishTargetAchieved?: boolean;
  totalPostsPublished?: number;
  targetQuotaTotal?: number;
  wowGrowthText?: string;
  provenanceDate?: string;
  provenanceLabel?: string;
  contextSubtitle?: string;
  branchTitle?: string;
}

export const PerformanceHeader: React.FC<PerformanceHeaderProps> = ({
  periodLabel = "Siklus 8 · 6–12 Oktober 2026 · Rapat 13 Oktober",
  publishTargetAchieved = true,
  totalPostsPublished = 18,
  targetQuotaTotal = 14,
  wowGrowthText = "Target Kuota 128.6% (18/14 Konten)",
  provenanceDate = "12 Oktober 2026",
  provenanceLabel = "Data sinkronisasi Google Sheets 5 Cabang terverifikasi per 12 Oktober 2026",
  contextSubtitle = "Optik I See You (PWT · PBG · CLP · WNS) · Lunar Eyewear Tegal · Konsolidasi Intelligence Mingguan",
  branchTitle,
}) => {
  return (
    <div data-tour="date-range" className="border-b border-border pb-6 mb-8">
      {/* Small Context Line (DESIGN.md §13) */}
      <div className="flex flex-wrap items-center gap-2 text-caption font-medium uppercase tracking-wider mb-2 text-foreground-secondary">
        <span>{contextSubtitle}</span>
      </div>

      {/* Large Title & Period */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="heading-page text-foreground">
            {branchTitle ? `Marketing Performance — ${branchTitle}` : "Marketing Performance"}
          </h1>
          <div className="flex items-center gap-2 mt-1 text-sm text-foreground-secondary">
            <Calendar className="w-4 h-4 text-foreground-muted" />
            <span className="font-medium text-foreground">{periodLabel}</span>
          </div>
        </div>

        {/* Operational Status Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-control text-xs font-semibold ${
              publishTargetAchieved
                ? "bg-brand-light text-brand"
                : "bg-amber-500/10 text-amber-800 border border-amber-300"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              Target Output: {totalPostsPublished}/{targetQuotaTotal} Post{" "}
              {publishTargetAchieved ? "Terpenuhi" : "Berjalan"}
            </span>
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
