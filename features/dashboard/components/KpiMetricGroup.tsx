import React from "react";
import { MetricRecord } from "@/types";
import { formatNumber, formatPercent } from "@/lib/utils";
import { TrendingUp, ArrowUpRight } from "lucide-react";
import { ProvenanceBadge } from "@/components/shared/ProvenanceBadge";

interface KpiMetricGroupProps {
  metrics: MetricRecord[];
  cycleTitle?: string;
  comparisonTitle?: string;
}

export const KpiMetricGroup: React.FC<KpiMetricGroupProps> = ({
  metrics,
  cycleTitle = "Metrik Kunci & Provenance (Siklus 8 · 6–12 Oktober 2026)",
  comparisonTitle = "Komparasi terhadap Siklus 7 (29 Sep – 5 Okt 2026) · Cutoff 12 Okt 2026",
}) => {
  // Find key metrics
  const reachMetric = metrics.find((m) => m.key === "weekly_reach") || metrics[1];
  const saveRateMetric = metrics.find((m) => m.key === "save_rate" || m.key === "story_production") || metrics[4] || metrics[2];
  const followersMetric = metrics.find((m) => m.key === "followers") || metrics[0];
  const engagementMetric = metrics.find((m) => m.key === "engagement" || m.key === "dm_inquiries") || metrics[3] || metrics[2];

  return (
    <div className="space-y-4 mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-foreground-secondary">
          {cycleTitle}
        </h2>
        <span className="text-[11px] text-foreground-muted">
          {comparisonTitle}
        </span>
      </div>

      {/* Asymmetrical Grid: Prime Metrics Dominate (ANTISLOP §09, DESIGN §14) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Primary Hero Metric: Weekly Output / Reach (Spans 7 cols on desktop) */}
        <div className="lg:col-span-7 p-6 rounded-container bg-surface border border-border shadow-subtle flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider block">
                {reachMetric.label}
              </span>
              <div className="flex items-baseline gap-3 mt-2">
                <span className="display-hero text-foreground tracking-tight">
                  {formatNumber(reachMetric.value)}
                </span>
                <span className="text-sm text-foreground-muted font-medium">
                  {reachMetric.unit}
                </span>
              </div>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-control bg-status-successBg text-status-success text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Target 14 Terpenuhi</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <p className="text-foreground-secondary italic">
              &ldquo;{reachMetric.notes}&rdquo;
            </p>
            <ProvenanceBadge
              source={reachMetric.source}
              date={reachMetric.date}
              isDemo={reachMetric.isDemo}
            />
          </div>
        </div>

        {/* Secondary Focus Metric: Output / Save-to-Reach Ratio (Spans 5 cols on desktop) */}
        <div className="lg:col-span-5 p-6 rounded-container bg-surface border border-border shadow-subtle flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider block">
                {saveRateMetric.label}
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="display-hero text-foreground tracking-tight text-brand">
                  {saveRateMetric.value}
                </span>
                <span className="text-xs text-foreground-muted">
                  {saveRateMetric.unit || "konten terverifikasi"}
                </span>
              </div>
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-control bg-status-successBg text-status-success text-xs font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{formatPercent(saveRateMetric.deltaPercent ?? 0)}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <p className="text-foreground-secondary italic">
              &ldquo;{saveRateMetric.notes}&rdquo;
            </p>
            <ProvenanceBadge
              source={saveRateMetric.source}
              date={saveRateMetric.date}
              isDemo={saveRateMetric.isDemo}
            />
          </div>
        </div>

        {/* Supplementary Row: Followers & Engagements */}
        <div className="lg:col-span-6 p-5 rounded-container bg-surface-secondary border border-border flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
              {followersMetric.label}
            </span>
            <div className="text-xs font-semibold text-status-success flex items-center gap-0.5">
              <span>{formatPercent(followersMetric.deltaPercent ?? 0)}</span>
              <span className="text-foreground-muted font-normal">(vs Siklus 7)</span>
            </div>
          </div>
          <div className="my-3">
            <span className="display-large text-foreground">
              {formatNumber(followersMetric.value)}
            </span>
            <span className="text-xs text-foreground-muted ml-2">akun pengikut</span>
          </div>
          <div className="pt-2 flex items-center justify-between text-xs text-foreground-muted">
            <span className="truncate max-w-[280px]">{followersMetric.notes}</span>
            <ProvenanceBadge
              source={followersMetric.source}
              date={followersMetric.date}
              isDemo={followersMetric.isDemo}
            />
          </div>
        </div>

        <div className="lg:col-span-6 p-5 rounded-container bg-surface-secondary border border-border flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
              {engagementMetric.label}
            </span>
            <div className="text-xs font-semibold text-status-success flex items-center gap-0.5">
              <span>{formatPercent(engagementMetric.deltaPercent ?? 0)}</span>
              <span className="text-foreground-muted font-normal">(vs Siklus 7)</span>
            </div>
          </div>
          <div className="my-3">
            <span className="display-large text-foreground">
              {formatNumber(engagementMetric.value)}
            </span>
            <span className="text-xs text-foreground-muted ml-2">{engagementMetric.unit}</span>
          </div>
          <div className="pt-2 flex items-center justify-between text-xs text-foreground-muted">
            <span className="truncate max-w-[280px]">{engagementMetric.notes}</span>
            <ProvenanceBadge
              source={engagementMetric.source}
              date={engagementMetric.date}
              isDemo={engagementMetric.isDemo}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
