"use client";

import React, { useState } from "react";
import { AlertTriangle, CheckCircle2, RefreshCw, Clock, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import realSheetsData from "@/lib/real-sheets-data.json";

interface PicStatus {
  pic: string;
  branch: string;
  sheetKey: string;
  latestDate: string;
  totalEntries: number;
  isUpToDate: boolean;
  statusText: string;
}

interface PicSubmissionBannerProps {
  picTracker?: PicStatus[];
  lastSync?: string;
  onRefresh?: () => void;
}

export const PicSubmissionBanner: React.FC<PicSubmissionBannerProps> = ({
  picTracker = realSheetsData.picTracker as PicStatus[],
  lastSync = realSheetsData.syncTimestamp,
  onRefresh,
}) => {
  const [currentTracker, setCurrentTracker] = useState<PicStatus[]>(picTracker);
  const [currentSyncTime, setCurrentSyncTime] = useState<string>(lastSync);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    fetch("/api/sync-sheets")
      .then((res) => res.json())
      .then((res) => {
        if (isMounted && res.success && res.data) {
          if (res.data.picTracker) setCurrentTracker(res.data.picTracker);
          if (res.data.syncTimestamp) setCurrentSyncTime(res.data.syncTimestamp);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const pendingPics = currentTracker.filter((p) => !p.isUpToDate);
  const completedCount = currentTracker.length - pendingPics.length;

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch("/api/sync-sheets", { method: "POST" });
      const data = await res.json();
      if (data.success && data.data) {
        setSyncMessage("Spreadsheet berhasil disinkronkan langsung dari Google Sheets!");
        if (data.data.picTracker) setCurrentTracker(data.data.picTracker);
        if (data.data.syncTimestamp) setCurrentSyncTime(data.data.syncTimestamp);
        if (onRefresh) onRefresh();
        setTimeout(() => setSyncMessage(null), 3000);
      } else {
        setSyncMessage(`Gagal sinkron: ${data.error}`);
      }
    } catch (err: any) {
      setSyncMessage(`Error: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="rounded-container border border-border bg-surface p-4 sm:p-5 shadow-subtle mb-8 space-y-3.5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-border/80">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-control flex items-center justify-center font-bold shrink-0 ${
              pendingPics.length > 0
                ? "bg-amber-100 text-amber-900 border border-amber-300"
                : "bg-emerald-100 text-emerald-900 border border-emerald-300"
            }`}
          >
            {pendingPics.length > 0 ? (
              <AlertTriangle className="w-4 h-4 text-amber-700" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Pengingat Status Laporan 6 PIC Cabang
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.2 rounded-full uppercase tracking-wider ${
                  pendingPics.length > 0
                    ? "bg-amber-100 text-amber-900"
                    : "bg-emerald-100 text-emerald-900"
                }`}
              >
                {completedCount}/{currentTracker.length} PIC Up-to-date
              </span>
            </div>
            <p className="text-xs text-foreground-secondary mt-0.5">
              {pendingPics.length > 0 ? (
                <span>
                  Perhatian: Ada <strong className="text-amber-800">{pendingPics.length} PIC</strong> yang belum
                  memperbarui laporan Google Sheet sampai tanggal terbaru.
                </span>
              ) : (
                <span className="text-emerald-800">
                  Seluruh 6 PIC cabang telah tuntas mengisi laporan konten & story terbaru!
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Sync Button & Link */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-surface-secondary border border-border hover:bg-surface-subtle text-xs font-semibold text-foreground transition-colors shadow-2xs disabled:opacity-50"
            title="Tarik data live terbaru dari Google Sheets"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-brand" : "text-foreground-muted"}`} />
            <span>{isSyncing ? "Menyinkronkan..." : "Sinkronkan Spreadsheet"}</span>
          </button>

          <Link
            href="/spreadsheet"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-control bg-brand text-white text-xs font-semibold hover:bg-brand-hover transition-colors shadow-subtle"
          >
            <span>Buka Rekap Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {syncMessage && (
        <div className="p-2.5 rounded-control bg-brand-light text-brand text-xs font-medium border border-brand/20">
          {syncMessage}
        </div>
      )}

      {/* PIC Status Pills Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
        {currentTracker.map((p) => (
          <div
            key={p.sheetKey}
            className={`p-2.5 rounded-control border text-xs flex flex-col justify-between transition-all ${
              p.isUpToDate
                ? "bg-surface-secondary border-border/80 text-foreground"
                : "bg-amber-50/70 border-amber-300 text-amber-950"
            }`}
          >
            <div className="flex items-start justify-between gap-1">
              <span className="font-bold text-[11px] truncate">{p.pic}</span>
              <span
                className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                  p.isUpToDate ? "bg-emerald-500" : "bg-amber-500 animate-ping"
                }`}
              />
            </div>
            <span className="text-[10px] text-foreground-muted block mt-0.5 truncate">
              {p.branch.replace(" (Second Brand)", "")}
            </span>
            <div className="pt-2 mt-1 border-t border-border/50 flex items-center justify-between text-[10px]">
              <span className="opacity-70 font-medium">Tgl: {p.latestDate.slice(5)}</span>
              <span className={`font-bold ${p.isUpToDate ? "text-emerald-700" : "text-amber-800"}`}>
                {p.isUpToDate ? "Lengkap" : "Pending"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
