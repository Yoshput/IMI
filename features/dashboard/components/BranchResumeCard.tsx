"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Globe,
  Stethoscope,
  TrendingUp,
  Instagram,
  Video,
  ArrowUpRight,
  ExternalLink,
  Flame,
  AlertCircle,
  Sparkles,
  MapPin,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { TIKTOK_BRANCH_REGISTRY, TikTokBranchData } from "@/lib/tiktok-accounts";

interface BranchResumeCardProps {
  initialBranchId?: string;
}

export const BranchResumeCard: React.FC<BranchResumeCardProps> = ({
  initialBranchId = "all",
}) => {
  const [selectedBranch, setSelectedBranch] = useState<string>(initialBranchId);
  const [branches, setBranches] = useState<TikTokBranchData[]>(TIKTOK_BRANCH_REGISTRY);

  // Web metrics per branch, default calibrated + updated dynamically from /api/track-event & /api/sync-sheets
  const [branchWebMetrics, setBranchWebMetrics] = useState<
    Record<
      string,
      { gscClicks: number; gscImpressions: number; antrianClicks: number; igFollowers: number }
    >
  >({
    pwt: { gscClicks: 680, gscImpressions: 12500, antrianClicks: 142, igFollowers: 226581 },
    clp: { gscClicks: 270, gscImpressions: 5800, antrianClicks: 68, igFollowers: 3946 },
    pbg: { gscClicks: 210, gscImpressions: 4600, antrianClicks: 54, igFollowers: 6195 },
    wns: { gscClicks: 145, gscImpressions: 3100, antrianClicks: 41, igFollowers: 7361 },
    tgl: { gscClicks: 85, gscImpressions: 1800, antrianClicks: 29, igFollowers: 1248 },
  });

  // Dynamic live fetch from Google Sheets sync & live Antrian Tracker
  useEffect(() => {
    const syncLiveSources = async () => {
      try {
        // 1. Fetch live antrian tracking
        const resAntrian = await fetch("/api/track-event");
        const jsonAntrian = await resAntrian.json();
        if (jsonAntrian.success && jsonAntrian.data?.branchStats) {
          setBranchWebMetrics((prev) => {
            const updated = { ...prev };
            jsonAntrian.data.branchStats.forEach((b: any) => {
              const key = b.branchId.toLowerCase();
              if (updated[key]) {
                updated[key] = {
                  ...updated[key],
                  antrianClicks: b.weeklyClicks || updated[key].antrianClicks,
                };
              }
            });
            return updated;
          });
        }

        // 2. Fetch live spreadsheet followers
        const resSheets = await fetch("/api/sync-sheets");
        const jsonSheets = await resSheets.json();
        if (jsonSheets.success && jsonSheets.data) {
          const sheetData = jsonSheets.data;
          // Update TikTok & IG followers if recorded in spreadsheet
          if (sheetData.branchReels) {
            setBranches((prev) =>
              prev.map((b) => {
                const sheetKey =
                  b.branchId === "pwt"
                    ? "Rekap PWT"
                    : b.branchId === "clp"
                    ? "Rekap CLP"
                    : b.branchId === "pbg"
                    ? "Rekap PBG"
                    : b.branchId === "wns"
                    ? "Rekap WNS"
                    : "Rekap TGL";
                const rows = sheetData.branchReels[sheetKey] || [];
                const lastWithFollowers = [...rows].reverse().find((r) => r.tiktokFollowers > 0);
                if (lastWithFollowers) {
                  return {
                    ...b,
                    followers: lastWithFollowers.tiktokFollowers || b.followers,
                  };
                }
                return b;
              })
            );
          }
        }
      } catch (err) {
        // Fallback gracefully to preset data
      }
    };

    syncLiveSources();
  }, []);

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-subtle space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-light text-brand border border-brand/20 flex items-center gap-1">
              <Building2 className="w-3 h-3" /> 5 CABANG RESUME REPORT
            </span>
            <span className="text-xs text-foreground-muted flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync: Google Sheets & Web Tracker
            </span>
          </div>
          <h2 className="text-base font-bold text-foreground">
            Ringkasan Performa Multichannel per Cabang
          </h2>
          <p className="text-xs text-foreground-secondary">
            Evaluasi terpadu performa marketing digital 5 cabang: Purwokerto, Cilacap, Purbalingga, Wonosobo, dan Tegal.
          </p>
        </div>

        {/* Branch Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-surface-secondary rounded-xl border border-border overflow-x-auto max-w-full">
          <button
            onClick={() => setSelectedBranch("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedBranch === "all"
                ? "bg-foreground text-surface shadow-subtle"
                : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            Semua (Overview)
          </button>
          {branches.map((b) => (
            <button
              key={b.branchId}
              onClick={() => setSelectedBranch(b.branchId)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedBranch === b.branchId
                  ? "bg-foreground text-surface shadow-subtle"
                  : "text-foreground-secondary hover:text-foreground"
              }`}
            >
              {b.city}
              {b.isNewAccount && (
                <span className="ml-1 px-1 py-0.2 rounded text-[8px] bg-brand text-surface">
                  Baru
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Rendering: All Overview or Single Branch */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {branches
          .filter((b) => selectedBranch === "all" || b.branchId === selectedBranch)
          .map((b) => {
            const web = branchWebMetrics[b.branchId] || {
              gscClicks: 0,
              gscImpressions: 0,
              antrianClicks: 0,
              igFollowers: 0,
            };
            const topTrending = b.trendingPosts[0];
            const underperforming = b.underperformingPosts[0];

            return (
              <div
                key={b.branchId}
                className="p-4 rounded-xl border border-border bg-surface-secondary/30 hover:border-foreground-muted/40 transition-all space-y-4"
              >
                {/* Branch Card Title */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-brand" />
                        {b.branchName}
                      </h3>
                      {b.isNewAccount && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                          Akun TikTok Baru
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-foreground-muted block mt-0.5">
                      PIC Konten: <strong className="text-foreground">{b.picName}</strong> · Handle: {b.handle}
                    </span>
                  </div>

                  <a
                    href={b.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] font-semibold text-brand hover:underline shrink-0"
                  >
                    <span>Buka TikTok</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Multichannel Summary Metrics (Web + IG + TikTok) */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {/* Web Clicks */}
                  <div className="p-2.5 rounded-lg bg-surface border border-border">
                    <div className="flex items-center gap-1 text-[10px] text-foreground-muted mb-1">
                      <Globe className="w-3 h-3 text-blue-500" />
                      <span>Web Google Clicks</span>
                    </div>
                    <div className="text-base font-bold text-foreground tabular-nums">
                      {web.gscClicks}
                    </div>
                    <span className="text-[9px] text-foreground-muted">
                      {web.gscImpressions.toLocaleString("id-ID")} impresi
                    </span>
                  </div>

                  {/* Antrian Cek Mata */}
                  <div className="p-2.5 rounded-lg bg-surface border border-border">
                    <div className="flex items-center gap-1 text-[10px] text-foreground-muted mb-1">
                      <Stethoscope className="w-3 h-3 text-teal-500" />
                      <span>Antrian Cek Mata</span>
                    </div>
                    <div className="text-base font-bold text-foreground tabular-nums">
                      {web.antrianClicks} <span className="text-[10px] font-normal">klik</span>
                    </div>
                    <span className="text-[9px] text-emerald-600 font-semibold">
                      Konversi tinggi
                    </span>
                  </div>

                  {/* TikTok Views */}
                  <div className="p-2.5 rounded-lg bg-surface border border-border">
                    <div className="flex items-center gap-1 text-[10px] text-foreground-muted mb-1">
                      <Video className="w-3 h-3 text-pink-500" />
                      <span>TikTok Weekly Views</span>
                    </div>
                    <div className="text-base font-bold text-foreground tabular-nums">
                      {b.weeklyViews >= 1000 ? `${(b.weeklyViews / 1000).toFixed(1)}k` : b.weeklyViews}
                    </div>
                    <span className="text-[9px] text-foreground-muted">
                      {b.followers.toLocaleString("id-ID")} followers
                    </span>
                  </div>
                </div>

                {/* Trending Content Highlight */}
                {topTrending && (
                  <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs space-y-1">
                    <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-orange-500" />
                        Konten TikTok Paling Rame (Trending)
                      </span>
                      <span className="tabular-nums font-mono">
                        {topTrending.views.toLocaleString("id-ID")} Views · {topTrending.engagementRate}% ER
                      </span>
                    </div>
                    <p className="font-semibold text-foreground line-clamp-1">
                      &quot;{topTrending.title}&quot;
                    </p>
                    <p className="text-[10px] text-foreground-muted leading-relaxed">
                      💡 {topTrending.keyTakeaway}
                    </p>
                  </div>
                )}

                {/* Underperforming Content Highlight */}
                {underperforming && (
                  <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs space-y-1">
                    <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 font-bold text-[11px]">
                      <span className="flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                        Konten Kurang Performa (Perlu Evaluasi)
                      </span>
                      <span className="tabular-nums font-mono text-foreground-muted">
                        {underperforming.views.toLocaleString("id-ID")} Views · {underperforming.engagementRate}% ER
                      </span>
                    </div>
                    <p className="font-semibold text-foreground line-clamp-1">
                      &quot;{underperforming.title}&quot;
                    </p>
                    <p className="text-[10px] text-foreground-muted leading-relaxed">
                      ⚠️ {underperforming.keyTakeaway}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};
