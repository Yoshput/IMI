"use client";

import React, { useState } from "react";
import {
  FileSpreadsheet,
  Users,
  Presentation,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  TableProperties,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { PicComplianceTracker, PicStatus } from "./PicComplianceTracker";
import { RawSheetsTable } from "./RawSheetsTable";
import { ExecutiveMeetingRecap } from "./ExecutiveMeetingRecap";
import { SocialBladeTracker } from "./SocialBladeTracker";

interface SpreadsheetHubViewProps {
  initialData: {
    syncTimestamp: string;
    sourceUrl: string;
    picTracker: PicStatus[];
    storyData: any[];
    branchReels: Record<string, any[]>;
    dailyFollowersTracker: Record<string, any[]>;
    executiveRecap: any;
  };
}

export const SpreadsheetHubView: React.FC<SpreadsheetHubViewProps> = ({
  initialData,
}) => {
  const [activeTab, setActiveTab] = useState<"compliance" | "raw" | "executive" | "socialblade">("executive");
  const [data, setData] = useState(initialData);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleLiveSync = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const res = await fetch("/api/sync-sheets", { method: "POST" });
      const result = await res.json();
      if (result.success && result.data) {
        setData(result.data);
        setSyncStatus("Sinkronisasi langsung dari Google Sheets sukses!");
        setTimeout(() => setSyncStatus(null), 3000);
      } else {
        setSyncStatus(`Gagal: ${result.error}`);
      }
    } catch (err: any) {
      setSyncStatus(`Error: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const tabs = [
    {
      key: "executive",
      label: "Versi Siap Saji (Meeting Direksi)",
      icon: Presentation,
      badge: "Meeting Selasa",
    },
    {
      key: "compliance",
      label: "Status Kepatuhan 6 PIC",
      icon: Users,
      badge: `${data.picTracker.filter((p) => !p.isUpToDate).length} Tertunda`,
    },
    {
      key: "socialblade",
      label: "Social Blade (Followers)",
      icon: TrendingUp,
      badge: "IG + TikTok",
    },
    {
      key: "raw",
      label: "Versi Mentah (Log Lengkap)",
      icon: TableProperties,
      badge: "600+ Baris",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-surface border border-border rounded-container p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-surface-secondary text-foreground-secondary border border-border">
              Integrasi Google Sheets Terverifikasi
            </span>
            <span className="text-xs text-foreground-muted">
              Terakhir update: {new Date(data.syncTimestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mt-1 tracking-tight">
            Hub Spreadsheet Rekap & Evaluasi 6 PIC Cabang
          </h1>
          <p className="text-xs text-foreground-secondary mt-1 max-w-2xl">
            Sistem pengolahan data harian dari Google Sheets Optik I See You (Purwokerto, Purbalingga, Cilacap, Wonosobo) dan Lunar Eyewear Tegal. Menyediakan rekap siap saji untuk meeting mingguan dan log mentah transparan.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleLiveSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-control bg-foreground text-surface text-xs font-semibold hover:bg-foreground/90 transition-all shadow-subtle disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Menyinkronkan..." : "Sinkronkan Google Sheets"}</span>
          </button>

          <a
            href={data.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-control border border-border bg-surface hover:bg-surface-secondary text-xs font-semibold text-foreground transition-all shadow-subtle"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Buka Dokumen Asli</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>
      </div>

      {/* Sync Status Banner if updated */}
      {syncStatus && (
        <div className="p-3 rounded-control bg-surface-secondary border border-border text-xs font-medium text-foreground flex items-center justify-between animate-fadeIn">
          <span>{syncStatus}</span>
          <span className="text-[11px] text-foreground-muted">Sinkronisasi otomatis</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-control text-xs font-semibold transition-all shrink-0 ${
                isActive
                  ? "bg-foreground text-surface shadow-subtle"
                  : "bg-surface border border-border text-foreground-secondary hover:text-foreground hover:bg-surface-secondary"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                  isActive
                    ? "bg-surface/20 text-surface"
                    : "bg-surface-secondary text-foreground-muted"
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === "executive" && (
        <ExecutiveMeetingRecap
          executiveRecap={data.executiveRecap}
          picTracker={data.picTracker}
        />
      )}

      {activeTab === "compliance" && (
        <PicComplianceTracker
          picTracker={data.picTracker}
          sourceUrl={data.sourceUrl}
        />
      )}

      {activeTab === "socialblade" && (
        <SocialBladeTracker dailyFollowersTracker={data.dailyFollowersTracker} />
      )}

      {activeTab === "raw" && (
        <RawSheetsTable
          storyData={data.storyData}
          branchReels={data.branchReels}
        />
      )}
    </div>
  );
};
