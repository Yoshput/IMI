"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  MessageCircle,
  Calendar,
  FileSpreadsheet,
  Check,
  Building2,
  ArrowUpRight,
} from "lucide-react";

export interface PicStatus {
  pic: string;
  role: string;
  branch: string;
  sheetKey: string;
  latestDate: string;
  totalEntries: number;
  isUpToDate: boolean;
  daysBehind: number;
  statusText: string;
  whatsappReminder: string;
}

interface PicComplianceTrackerProps {
  picTracker: PicStatus[];
  sourceUrl: string;
}

export const PicComplianceTracker: React.FC<PicComplianceTrackerProps> = ({
  picTracker,
  sourceUrl,
}) => {
  const [copiedPic, setCopiedPic] = useState<string | null>(null);

  const handleCopyReminder = (pic: PicStatus) => {
    navigator.clipboard.writeText(pic.whatsappReminder);
    setCopiedPic(pic.pic);
    setTimeout(() => setCopiedPic(null), 2500);
  };

  const pendingCount = picTracker.filter((p) => !p.isUpToDate).length;
  const completedCount = picTracker.length - pendingCount;

  return (
    <div className="space-y-6">
      {/* Top Header & Summary Pill */}
      <div className="bg-surface border border-border rounded-container p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">
              Status Pengisian Laporan 6 PIC Cabang
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-secondary text-foreground-secondary border border-border">
              Per 14 September 2026
            </span>
          </div>
          <p className="text-xs text-foreground-secondary mt-1">
            Pantauan kepatuhan pengisian harian spreadsheet oleh PIC Instagram Reels & Story di seluruh cabang Optik I See You & Lunar Eyewear.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-surface-secondary border border-border text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-700"></span>
            <span className="text-foreground">{completedCount} Lengkap</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-surface-secondary border border-border text-xs font-semibold">
            <span className={`w-2 h-2 rounded-full ${pendingCount > 0 ? "bg-amber-700" : "bg-emerald-700"}`}></span>
            <span className={pendingCount > 0 ? "text-amber-800" : "text-foreground"}>
              {pendingCount} Tertunda
            </span>
          </div>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-foreground text-surface text-xs font-semibold hover:bg-foreground/90 transition-colors shadow-subtle shrink-0"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Buka Google Sheets</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>
      </div>

      {/* Grid of 6 PIC Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {picTracker.map((picItem, idx) => {
          const isPending = !picItem.isUpToDate;
          return (
            <div
              key={idx}
              className={`relative rounded-container border transition-all p-5 flex flex-col justify-between ${
                isPending
                  ? "bg-surface border-amber-300/80 shadow-subtle hover:border-amber-400"
                  : "bg-surface border-border hover:border-foreground/30 shadow-subtle"
              }`}
            >
              <div>
                {/* Header: PIC name & badge */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">
                        {picItem.pic}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 font-semibold rounded bg-surface-secondary text-foreground-secondary border border-border">
                        {picItem.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-foreground-muted mt-0.5">
                      <Building2 className="w-3 h-3" />
                      <span>{picItem.branch}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider shrink-0 ${
                      isPending
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                    }`}
                  >
                    {isPending ? (
                      <AlertTriangle className="w-3 h-3 text-amber-700" />
                    ) : (
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                    )}
                    {isPending ? "Tertunda" : "Up-to-Date"}
                  </span>
                </div>

                {/* Status description */}
                <div className="mt-4 pt-3 border-t border-border/70 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground-secondary flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-foreground-muted" />
                      Laporan Terakhir
                    </span>
                    <span
                      className={`font-semibold tabular-nums ${
                        isPending ? "text-amber-800" : "text-foreground"
                      }`}
                    >
                      {picItem.latestDate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground-secondary flex items-center gap-1.5">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-foreground-muted" />
                      Total Baris Rekap
                    </span>
                    <span className="font-semibold text-foreground tabular-nums">
                      {picItem.totalEntries} entri
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground-secondary">Lembar Sheet</span>
                    <span className="font-mono text-[11px] text-foreground-secondary px-1.5 py-0.5 rounded bg-surface-secondary">
                      {picItem.sheetKey}
                    </span>
                  </div>
                </div>

                {/* Notice text if pending */}
                {isPending && (
                  <div className="mt-3 p-2.5 rounded-control bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900">
                    Belum input {picItem.daysBehind} hari sejak {picItem.latestDate}. Perlu diingatkan sebelum meeting evaluasi.
                  </div>
                )}
              </div>

              {/* Action Button: WhatsApp Reminder */}
              <div className="mt-4 pt-3 border-t border-border/70">
                <button
                  onClick={() => handleCopyReminder(picItem)}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-control text-xs font-semibold transition-all ${
                    copiedPic === picItem.pic
                      ? "bg-emerald-700 text-white"
                      : isPending
                      ? "bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300"
                      : "bg-surface-secondary hover:bg-border text-foreground border border-border"
                  }`}
                  title="Salin template chat WhatsApp untuk mengingatkan PIC"
                >
                  {copiedPic === picItem.pic ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Teks WA Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-800" />
                      <span>{isPending ? "Salin Pengingat WA PIC" : "Salin Format Chat PIC"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
