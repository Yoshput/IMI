import React from "react";
import { ProvenanceBadge } from "@/components/shared/ProvenanceBadge";
import { Calendar, CheckCircle2, TrendingUp } from "lucide-react";

interface PerformanceHeaderProps {
  periodLabel: string;
  publishTargetAchieved: boolean;
  totalPostsPublished: number;
}

export const PerformanceHeader: React.FC<PerformanceHeaderProps> = ({
  periodLabel,
  publishTargetAchieved,
  totalPostsPublished,
}) => {
  return (
    <div className="border-b border-border pb-6 mb-8">
      {/* Small Context Line (DESIGN.md §13) */}
      <div className="flex flex-wrap items-center gap-2 text-caption font-medium uppercase tracking-wider mb-2 text-foreground-secondary">
        <span>Optik I See You</span>
        <span>·</span>
        <span>Purwokerto (@iseeyou.glasses)</span>
        <span>·</span>
        <span>Laporan Mingguan Internal</span>
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-control bg-status-successBg text-status-success text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Reach Mingguan +23.8%</span>
          </div>
          <ProvenanceBadge
            source="seed_demo"
            date="2026-09-14"
            sourceLabel="Simulasi data seed performa akun internal — Disusun manual tanpa live scraping (AGENT §08)"
            isDemo={true}
          />
        </div>
      </div>
    </div>
  );
};
