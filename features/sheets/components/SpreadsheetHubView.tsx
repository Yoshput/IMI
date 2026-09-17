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
  CheckCircle2,
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
  const [isAutoSyncEnabled, setIsAutoSyncEnabled] = useState(true);
  const [showWebhookGuide, setShowWebhookGuide] = useState(false);

  // Automated background sync on mount & periodic polling (every 5 minutes)
  React.useEffect(() => {
    let isMounted = true;

    const performAutoSync = async (silent = true) => {
      if (!silent) setIsSyncing(true);
      try {
        const res = await fetch("/api/sync-sheets");
        const result = await res.json();
        if (isMounted && result.success && result.data) {
          setData(result.data);
          if (result.source === "live_sync" && !silent) {
            setSyncStatus("Data diperbarui otomatis dari Google Sheets!");
            setTimeout(() => setSyncStatus(null), 3500);
          }
        }
      } catch (err) {
        // silent fallback
      } finally {
        if (!silent) setIsSyncing(false);
      }
    };

    // Auto-check on mount
    performAutoSync(true);

    // Interval every 5 minutes (300,000 ms)
    const interval = setInterval(() => {
      if (isAutoSyncEnabled) {
        performAutoSync(true);
      }
    }, 5 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isAutoSyncEnabled]);

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
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-surface-secondary text-foreground-secondary border border-border">
              Integrasi Google Sheets Terverifikasi
            </span>
            
            {/* Auto-Sync Status Badge */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Auto-Sync Aktif (Tiap 5 Menit)</span>
            </div>

            <span className="text-xs text-foreground-muted">
              Terakhir update: {new Date(data.syncTimestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-foreground mt-2 tracking-tight">
            Hub Spreadsheet Rekap & Evaluasi 6 PIC Cabang
          </h1>
          <p className="text-xs text-foreground-secondary mt-1 max-w-2xl">
            Sistem pengolahan data harian otomatis dari Google Sheets Optik I See You (Purwokerto, Purbalingga, Cilacap, Wonosobo) dan Lunar Eyewear Tegal. Data diperbarui otomatis secara real-time saat Anda membuka halaman ini.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShowWebhookGuide(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-control border border-border bg-surface hover:bg-surface-secondary text-xs font-semibold text-foreground transition-all shadow-subtle"
            title="Cara membuat Google Sheets push data otomatis seketika saat ada ketikan baru"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Setup Push Webhook</span>
          </button>

          <button
            onClick={handleLiveSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-control bg-foreground text-surface text-xs font-semibold hover:bg-foreground/90 transition-all shadow-subtle disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Menyinkronkan..." : "Sinkronkan Sekarang"}</span>
          </button>

          <a
            href={data.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-control border border-border bg-surface hover:bg-surface-secondary text-xs font-semibold text-foreground transition-all shadow-subtle"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Buka Dokumen Asli</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>
      </div>

      {/* Webhook / Automated Guide Modal */}
      {showWebhookGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-surface border border-border rounded-container max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-foreground">
                  Cara Kerja Pembaruan Otomatis & Trigger Google Sheets
                </h3>
              </div>
              <button
                onClick={() => setShowWebhookGuide(false)}
                className="text-foreground-muted hover:text-foreground text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-foreground-secondary leading-relaxed">
              <div className="p-3.5 rounded-control bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
                <p className="font-bold text-sm mb-1">🟢 Otomatisasi Bawaan Aplikasi Sudah Aktif!</p>
                <p>
                  Setiap kali Anda atau direksi membuka aplikasi dashboard ini, sistem <strong>otomatis mengecek dan mendownload perubahan terbaru dari Google Sheets</strong> di latar belakang (background sync). Data di aplikasi juga di-refresh otomatis setiap 5 menit tanpa perlu menekan tombol apapun.
                </p>
              </div>

              <div className="p-3.5 rounded-control bg-surface-secondary border border-border space-y-2">
                <p className="font-bold text-foreground">
                  ⚡ Opsi Lanjutan: Push Instan dari Google Sheets (Opsional)
                </p>
                <p>
                  Jika Anda ingin setiap kali PIC (Mba Ilya, Mba Ajun, dsb) mengisi baris baru di spreadsheet langsung detik itu juga terkirim ke dashboard, Anda cukup menambahkan skrip berikut ke Google Spreadsheet:
                </p>
                <ol className="list-decimal list-inside space-y-1 pl-1">
                  <li>Buka spreadsheet Google Sheets Anda.</li>
                  <li>Klik menu <strong>Extensions (Ekstensi) &gt; Apps Script</strong>.</li>
                  <li>Paste kode berikut dan simpan:</li>
                </ol>
                <pre className="p-3 rounded bg-zinc-900 text-zinc-100 font-mono text-[11px] overflow-x-auto select-all">
{`function onEdit(e) {
  // Pemicu otomatis saat ada perubahan di Google Sheets
  var url = "https://domain-website-anda.com/api/sync-sheets";
  try {
    UrlFetchApp.fetch(url, {
      method: "post",
      muteHttpExceptions: true
    });
  } catch (err) {
    Logger.log(err);
  }
}`}
                </pre>
                <p className="text-[11px] text-foreground-muted">
                  *Ganti URL dengan alamat domain website Anda jika sudah online di hosting/Vercel.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowWebhookGuide(false)}
                className="px-4 py-2 rounded-control bg-foreground text-surface text-xs font-semibold hover:bg-foreground/90 transition-all"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sync Status Banner if updated */}
      {syncStatus && (
        <div className="p-3 rounded-control bg-surface-secondary border border-border text-xs font-medium text-foreground flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{syncStatus}</span>
          </div>
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
