"use client";

import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  Calendar,
  Building2,
  Film,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";

interface SocialBladeTrackerProps {
  dailyFollowersTracker: Record<string, any[]>;
}

export const SocialBladeTracker: React.FC<SocialBladeTrackerProps> = ({
  dailyFollowersTracker,
}) => {
  const branchOptions = [
    { key: "PWT", label: "Purwokerto Pusat (@iseeyou.glasses)", city: "Purwokerto" },
    { key: "PBG", label: "Purbalingga (@iseeyou.purbalingga)", city: "Purbalingga" },
    { key: "TGL", label: "Lunar Eyewear Tegal (@lunar.eyewear)", city: "Tegal" },
    { key: "CLP", label: "Cilacap (@iseeyou.cilacap)", city: "Cilacap" },
    { key: "WNS", label: "Wonosobo (@iseeyou.wonosobo)", city: "Wonosobo" },
  ];

  const [selectedBranch, setSelectedBranch] = useState<string>("PWT");

  const branchData = useMemo(() => {
    return dailyFollowersTracker[selectedBranch] || [];
  }, [dailyFollowersTracker, selectedBranch]);

  // Latest stats for this branch
  const latestEntry = branchData.length > 0 ? branchData[branchData.length - 1] : null;
  const initialEntry = branchData.length > 0 ? branchData[0] : null;

  const totalIgGain =
    latestEntry && initialEntry ? latestEntry.igFollowers - initialEntry.igFollowers : 0;
  const totalTtGain =
    latestEntry && initialEntry ? latestEntry.tiktokFollowers - initialEntry.tiktokFollowers : 0;

  // Average daily change
  const avgIgDelta =
    branchData.length > 1
      ? Math.round(
          branchData.slice(1).reduce((acc, curr) => acc + curr.igDelta, 0) /
            (branchData.length - 1)
        )
      : 0;

  // Day of week formatter
  const getDayOfWeek = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat("id-ID", { weekday: "short" }).format(d);
    } catch {
      return "-";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Branch Switcher */}
      <div className="bg-surface border border-border rounded-container p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">
              Social Blade Tracker: Pertumbuhan Harian Follower Real-Time
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-secondary text-foreground-secondary border border-border">
              Instagram & TikTok
            </span>
          </div>
          <p className="text-xs text-foreground-secondary mt-1">
            Pantauan naik-turun follower per hari yang dicatat langsung oleh PIC tiap cabang, lengkap dengan korelasi judul reels yang tayang.
          </p>
        </div>

        {/* Branch selector buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {branchOptions.map((b) => (
            <button
              key={b.key}
              onClick={() => setSelectedBranch(b.key)}
              className={`px-3 py-1.5 rounded-control text-xs font-medium whitespace-nowrap transition-all ${
                selectedBranch === b.key
                  ? "bg-foreground text-surface font-semibold shadow-subtle"
                  : "bg-surface-secondary text-foreground-secondary hover:text-foreground border border-border"
              }`}
            >
              {b.city}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards for Selected Branch */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-surface border border-border rounded-container p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-bold tracking-wider text-foreground-muted block">
            Followers Instagram Terkini
          </span>
          <div className="text-2xl font-bold text-foreground mt-1 tabular-nums">
            {latestEntry ? latestEntry.igFollowers.toLocaleString("id-ID") : "-"}
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold mt-1">
            {totalIgGain >= 0 ? (
              <span className="text-emerald-800 flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{totalIgGain.toLocaleString("id-ID")} sejak awal periode
              </span>
            ) : (
              <span className="text-amber-800 flex items-center gap-0.5">
                <ArrowDownRight className="w-3.5 h-3.5" />
                {totalIgGain.toLocaleString("id-ID")}
              </span>
            )}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-container p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-bold tracking-wider text-foreground-muted block">
            Followers TikTok Terkini
          </span>
          <div className="text-2xl font-bold text-foreground mt-1 tabular-nums">
            {latestEntry ? latestEntry.tiktokFollowers.toLocaleString("id-ID") : "-"}
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold mt-1">
            {totalTtGain >= 0 ? (
              <span className="text-emerald-800 flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{totalTtGain.toLocaleString("id-ID")} akumulatif
              </span>
            ) : (
              <span className="text-amber-800 flex items-center gap-0.5">
                <ArrowDownRight className="w-3.5 h-3.5" />
                {totalTtGain.toLocaleString("id-ID")}
              </span>
            )}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-container p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-bold tracking-wider text-foreground-muted block">
            Rata-rata Perubahan / Hari (IG)
          </span>
          <div className="text-2xl font-bold text-foreground mt-1 tabular-nums">
            {avgIgDelta >= 0 ? `+${avgIgDelta}` : avgIgDelta}
          </div>
          <span className="text-xs text-foreground-muted mt-1 block">
            Followers baru rata-rata per hari
          </span>
        </div>

        <div className="bg-surface border border-border rounded-container p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-bold tracking-wider text-foreground-muted block">
            Total Hari Terdata
          </span>
          <div className="text-2xl font-bold text-foreground mt-1 tabular-nums">
            {branchData.length} Hari
          </div>
          <span className="text-xs text-foreground-muted mt-1 block">
            Rentang data terekam di sheet
          </span>
        </div>
      </div>

      {/* Social Blade Ledger Table */}
      <div className="bg-surface border border-border rounded-container shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-border bg-surface-secondary flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-foreground" />
            <span className="text-xs font-bold text-foreground">
              Buku Harian Pertumbuhan Follower (Social Blade Mode)
            </span>
          </div>
          <span className="text-[11px] text-foreground-muted font-mono">
            {branchOptions.find((b) => b.key === selectedBranch)?.label}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-surface text-foreground-muted font-semibold">
                <th className="py-2.5 px-3 whitespace-nowrap">Tanggal</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Hari</th>
                <th className="py-2.5 px-4 text-right whitespace-nowrap">Followers IG</th>
                <th className="py-2.5 px-4 text-right whitespace-nowrap">Perubahan IG</th>
                <th className="py-2.5 px-4 text-right whitespace-nowrap">Followers TikTok</th>
                <th className="py-2.5 px-4 text-right whitespace-nowrap">Perubahan TT</th>
                <th className="py-2.5 px-4">Konten yang Tayang Hari Tersebut</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">Viewers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {branchData
                .slice(-30)
                .reverse()
                .map((row, idx) => {
                  const hasIgGain = row.igDelta > 0;
                  const hasIgLoss = row.igDelta < 0;
                  const hasTtGain = row.ttDelta > 0;
                  const hasTtLoss = row.ttDelta < 0;

                  return (
                    <tr
                      key={idx}
                      className="hover:bg-surface-secondary/60 transition-colors"
                    >
                      {/* Tanggal */}
                      <td className="py-2.5 px-3 font-mono text-[11px] text-foreground font-semibold whitespace-nowrap">
                        {row.date}
                      </td>

                      {/* Hari */}
                      <td className="py-2.5 px-3 text-foreground-muted text-[11px] whitespace-nowrap">
                        {getDayOfWeek(row.date)}
                      </td>

                      {/* Followers IG */}
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-foreground tabular-nums whitespace-nowrap">
                        {row.igFollowers.toLocaleString("id-ID")}
                      </td>

                      {/* Perubahan IG */}
                      <td className="py-2.5 px-4 text-right tabular-nums whitespace-nowrap">
                        {hasIgGain ? (
                          <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-800 px-1.5 py-0.2 rounded bg-emerald-50">
                            +{row.igDelta}
                          </span>
                        ) : hasIgLoss ? (
                          <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-amber-800 px-1.5 py-0.2 rounded bg-amber-50">
                            {row.igDelta}
                          </span>
                        ) : (
                          <span className="text-[11px] text-foreground-muted">-</span>
                        )}
                      </td>

                      {/* Followers TikTok */}
                      <td className="py-2.5 px-4 text-right font-mono font-semibold text-foreground-secondary tabular-nums whitespace-nowrap">
                        {row.tiktokFollowers ? row.tiktokFollowers.toLocaleString("id-ID") : "-"}
                      </td>

                      {/* Perubahan TikTok */}
                      <td className="py-2.5 px-4 text-right tabular-nums whitespace-nowrap">
                        {hasTtGain ? (
                          <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-800 px-1.5 py-0.2 rounded bg-emerald-50">
                            +{row.ttDelta}
                          </span>
                        ) : hasTtLoss ? (
                          <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-amber-800 px-1.5 py-0.2 rounded bg-amber-50">
                            {row.ttDelta}
                          </span>
                        ) : (
                          <span className="text-[11px] text-foreground-muted">-</span>
                        )}
                      </td>

                      {/* Konten yang Tayang */}
                      <td className="py-2.5 px-4 max-w-[260px]">
                        <div className="font-medium text-foreground line-clamp-1">
                          {row.reelsTitle && row.reelsTitle !== "-" ? (
                            row.reelsTitle
                          ) : (
                            <span className="text-foreground-muted italic">Tidak ada reels / rekap harian</span>
                          )}
                        </div>
                      </td>

                      {/* Viewers */}
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-foreground tabular-nums whitespace-nowrap">
                        {row.viewers > 0 ? row.viewers.toLocaleString("id-ID") : "-"}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
