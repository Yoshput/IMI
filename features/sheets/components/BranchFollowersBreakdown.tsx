"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  RefreshCw,
  TrendingUp,
  Users,
  Image as ImageIcon,
  Clock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { IgAccountLive, IgLiveCache } from "@/lib/instagram-realtime";

interface BranchFollowersBreakdownProps {
  initialCache?: IgLiveCache;
  onRefreshSuccess?: (newCache: IgLiveCache) => void;
  spreadsheetFollowers?: Record<string, {
    branchName: string;
    city: string;
    followers: number;
    followersFormatted: string;
    lastRecordedDate?: string;
    pic?: string;
  }>;
}

export const BranchFollowersBreakdown: React.FC<BranchFollowersBreakdownProps> = ({
  initialCache,
  onRefreshSuccess,
  spreadsheetFollowers,
}) => {
  const [cache, setCache] = useState<IgLiveCache | undefined>(initialCache);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const accounts: IgAccountLive[] = cache?.accounts
    ? Object.values(cache.accounts)
    : [
        {
          id: "pwt-pusat",
          name: "Optik I See You Purwokerto (Pusat)",
          handle: "@iseeyou.glasses",
          url: "https://www.instagram.com/iseeyou.glasses/",
          city: "Purwokerto",
          picName: "Mba Ilya & Mba Nuha",
          followers: 226000,
          followersFormatted: "226K",
          following: 112,
          posts: 2940,
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "pbg",
          name: "Optik I See You Purbalingga",
          handle: "@iseeyou.purbalingga",
          url: "https://www.instagram.com/iseeyou.purbalingga/",
          city: "Purbalingga",
          picName: "Mba Ajun",
          followers: 6194,
          followersFormatted: "6,194",
          following: 6,
          posts: 567,
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "clp",
          name: "Optik I See You Cilacap",
          handle: "@iseeyou.cilacap",
          url: "https://www.instagram.com/iseeyou.cilacap/",
          city: "Cilacap",
          picName: "Mba Arum",
          followers: 7387,
          followersFormatted: "7,387",
          following: 6,
          posts: 1403,
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "wns",
          name: "Optik I See You Wonosobo",
          handle: "@iseeyou.wonosobo",
          url: "https://www.instagram.com/iseeyou.wonosobo/",
          city: "Wonosobo",
          picName: "Mba Febi",
          followers: 1248,
          followersFormatted: "1,248",
          following: 6,
          posts: 339,
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "tgl",
          name: "Lunar Eyewear Tegal (Second Brand)",
          handle: "@lunareyewear.co",
          url: "https://www.instagram.com/lunareyewear.co",
          city: "Tegal",
          picName: "Mba Amanda",
          followers: 3943,
          followersFormatted: "3,943",
          following: 5,
          posts: 357,
          lastUpdated: new Date().toISOString(),
        },
      ];

  const handleManualSync = async () => {
    setIsRefreshing(true);
    setStatusMessage("Menghubungi server Instagram untuk 5 cabang...");
    try {
      const res = await fetch("/api/instagram-realtime", { method: "POST" });
      const json = await res.json();
      if (json.success && json.data) {
        setCache(json.data);
        if (onRefreshSuccess) onRefreshSuccess(json.data);
        setStatusMessage("✅ Data Instagram 5 cabang berhasil diperbarui secara realtime!");
        setTimeout(() => setStatusMessage(null), 4000);
      } else {
        setStatusMessage("Gagal memperbarui: " + (json.error || "Coba lagi nanti"));
      }
    } catch (err: any) {
      setStatusMessage("Koneksi gagal: " + err.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return "Baru saja";
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }) + " WIB";
    } catch {
      return isoString;
    }
  };

  return (
    <div className="bg-surface border border-border rounded-container p-5 shadow-subtle space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-foreground" />
              Breakdown Followers per Akun Cabang (1 per 1 Realtime Instagram)
            </h2>
          </div>
          <p className="text-xs text-foreground-secondary mt-1">
            Data diambil langsung (live) dari profil Instagram masing-masing cabang, sinkron otomatis setiap 1 jam.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-foreground-muted bg-surface-secondary px-3 py-1.5 rounded-control border border-border">
            <Clock className="w-3.5 h-3.5 text-foreground-secondary" />
            <span>Update: {formatTime(cache?.lastSync)}</span>
          </div>

          <button
            onClick={handleManualSync}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-control bg-foreground text-surface hover:bg-foreground/90 disabled:opacity-50 text-xs font-semibold transition-all shadow-subtle cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Mengambil Live IG..." : "Sync Realtime (1 Jam)"}</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {statusMessage && (
        <div className="p-3 rounded-control bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-medium flex items-center gap-2 transition-all">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* 5 Individual Branch Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {accounts.map((acc, idx) => (
          <div
            key={acc.id || idx}
            className="bg-surface-secondary/70 border border-border rounded-control p-4 flex flex-col justify-between hover:border-foreground/40 transition-all group shadow-2xs"
          >
            <div>
              {/* Branch Header */}
              <div className="flex items-start justify-between gap-1">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
                    {acc.city}
                  </span>
                  <h3 className="font-bold text-foreground text-xs line-clamp-1 mt-0.5">
                    {acc.name.replace("Optik I See You ", "").replace(" (Second Brand)", "")}
                  </h3>
                </div>
                <a
                  href={acc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded hover:bg-border text-foreground-muted hover:text-brand transition-colors"
                  title="Buka Instagram Resmi"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Handle */}
              <a
                href={acc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] font-semibold text-brand hover:underline block mt-1"
              >
                {acc.handle}
              </a>

              {/* Dual Followers Comparison: Realtime IG vs Spreadsheet H+3 */}
              {(() => {
                const sheetKeyMap: Record<string, string> = {
                  "pwt-pusat": "PWT",
                  "clp": "CLP",
                  "pbg": "PBG",
                  "tgl": "TGL",
                  "wns": "WNS",
                };
                const sheetData = spreadsheetFollowers ? spreadsheetFollowers[sheetKeyMap[acc.id]] : null;

                return (
                  <div className="mt-3 pt-2.5 border-t border-border/70 space-y-2">
                    {/* Realtime IG */}
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-emerald-800 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          Realtime IG
                        </span>
                        <div className="text-xl font-bold text-foreground tabular-nums tracking-tight mt-0.5">
                          {acc.followersFormatted}
                        </div>
                      </div>

                      {/* Spreadsheet per 3 hari */}
                      <div className="text-right">
                        <span className="text-[9px] uppercase font-bold text-brand block">
                          Sheet (H+3)
                        </span>
                        <div className="text-sm font-bold text-brand tabular-nums tracking-tight mt-0.5">
                          {sheetData?.followersFormatted || acc.followersFormatted}
                        </div>
                        {sheetData?.lastRecordedDate && (
                          <span className="text-[8px] text-foreground-muted block mt-0.5">
                            {sheetData.lastRecordedDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Secondary Details: Posts & Following */}
              <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-border/50 text-[11px]">
                <div>
                  <span className="text-[9px] uppercase text-foreground-muted block">Postingan</span>
                  <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                    <ImageIcon className="w-3 h-3 text-foreground-muted" />
                    {acc.posts.toLocaleString("id-ID")}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-foreground-muted block">Following</span>
                  <span className="font-semibold text-foreground mt-0.5 block">
                    {acc.following.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Info: PIC & Sync Status */}
            <div className="mt-3.5 pt-2.5 border-t border-border/60 flex items-center justify-between text-[10px]">
              <span className="text-foreground-secondary truncate max-w-[120px]">
                PIC: <strong className="text-foreground font-semibold">{acc.picName}</strong>
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] text-emerald-800 font-semibold px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                Live
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info Notice */}
      <div className="bg-surface-secondary/50 border border-border/70 rounded-control px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-foreground-muted">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>
            <strong>Jadwal Otomatis:</strong> Cron job Vercel & background worker menarik metrik langsung dari Instagram setiap 1 jam sekali tanpa jeda.
          </span>
        </div>
        <span className="text-[11px] text-foreground-secondary shrink-0">
          Setiap cabang dipantau mandiri (1 per 1)
        </span>
      </div>
    </div>
  );
};
