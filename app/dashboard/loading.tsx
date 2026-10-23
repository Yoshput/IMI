import React from "react";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Memuat data dashboard...">
      {/* Header Skeleton */}
      <div className="border-b border-border pb-6 mb-8">
        <div className="h-3 w-48 bg-muted rounded-full mb-3" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-72 bg-muted rounded-lg" />
            <div className="h-4 w-56 bg-muted/60 rounded-full" />
          </div>
          <div className="h-7 w-44 bg-muted/80 rounded-full" />
        </div>
      </div>

      {/* KPI Headline Skeleton Grid */}
      <div className="space-y-4 mb-10">
        <div className="h-4 w-60 bg-muted/60 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Hero Metric Skeleton */}
          <div className="lg:col-span-7 p-6 rounded-container bg-surface border border-border shadow-subtle min-h-[180px] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-3.5 w-36 bg-muted rounded" />
              <div className="h-10 w-48 bg-muted rounded-lg" />
            </div>
            <div className="h-4 w-full bg-muted/40 rounded mt-4" />
          </div>

          {/* Secondary Metric Skeletons */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="p-5 rounded-container bg-surface border border-border shadow-subtle min-h-[140px] space-y-3">
              <div className="h-3 w-28 bg-muted rounded" />
              <div className="h-7 w-20 bg-muted rounded" />
              <div className="h-3 w-24 bg-muted/50 rounded" />
            </div>
            <div className="p-5 rounded-container bg-surface border border-border shadow-subtle min-h-[140px] space-y-3">
              <div className="h-3 w-28 bg-muted rounded" />
              <div className="h-7 w-20 bg-muted rounded" />
              <div className="h-3 w-24 bg-muted/50 rounded" />
            </div>
            <div className="col-span-2 p-5 rounded-container bg-surface border border-border shadow-subtle min-h-[120px] space-y-3">
              <div className="h-3 w-36 bg-muted rounded" />
              <div className="h-7 w-24 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts & Resume Card Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-container bg-surface border border-border shadow-subtle min-h-[280px] space-y-4">
          <div className="h-5 w-48 bg-muted rounded" />
          <div className="h-48 w-full bg-muted/30 rounded-lg" />
        </div>
        <div className="p-6 rounded-container bg-surface border border-border shadow-subtle min-h-[280px] space-y-4">
          <div className="h-5 w-48 bg-muted rounded" />
          <div className="h-48 w-full bg-muted/30 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
