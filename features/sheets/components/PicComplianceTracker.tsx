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
  Clock,
  BellRing,
  Send,
  Sparkles,
} from "lucide-react";
import { ACTIVE_MEETING_CYCLE, formatShortIndo } from "@/lib/cadence-config";

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
  const [copiedState, setCopiedState] = useState<{ pic: string; type: "laporan" | "upload" | "cadence" } | null>(null);

  const handleCopyLaporan = (pic: PicStatus) => {
    navigator.clipboard.writeText(pic.whatsappReminder);
    setCopiedState({ pic: pic.pic, type: "laporan" });
    setTimeout(() => setCopiedState(null), 2500);
  };

  const handleCopyUploadReminder = (pic: PicStatus) => {
    const text = `Halo Kak ${pic.pic}, selamat sore! 😊

Mengingatkan kembali ya, jadwal upload konten Reels untuk ${pic.branch} malam ini adalah pukul 19.00 WIB (prime time).

Sebelum tayang pukul 19.00 nanti, mohon dibantu pastikan:
1. Video sudah di-draft dan siap tayang
2. Cover kacamata/talent terlihat jelas & estetik di grid feed
3. Caption, hashtag resmi, dan tagging akun @iseeyou.glasses sudah terpasang
4. Lokasi store ${pic.branch} sudah ditandai

Jika ada kendala teknis atau materi yang perlu dicek terlebih dahulu, kabari ya, Kak.

Semangat untuk upload malam ini! 🚀👓`;
    navigator.clipboard.writeText(text);
    setCopiedState({ pic: pic.pic, type: "upload" });
    setTimeout(() => setCopiedState(null), 2500);
  };

  const handleCopyCadenceCheck = (pic: PicStatus) => {
    const days = pic.daysBehind > 0 ? pic.daysBehind : 3;
    const text = `Halo Kak ${pic.pic}, selamat sore. 😊

Izin mengingatkan terkait ritme upload konten Reels di ${pic.branch}. Berdasarkan catatan evaluasi ritme 3 hari, akun cabang saat ini sudah ${days} hari belum ada postingan Reels baru nih, Kak.

Standar operasional ritme konten kita adalah minimal 1 Reels setiap 3 hari agar reach dan engagement akun tetap optimal.

Kira-kira apakah ada kendala pada proses take video atau editingnya, Kak? Apakah materinya bisa dijadwalkan untuk upload hari ini pada prime time pukul 19.00 WIB?

Jika butuh bantuan ide konsep atau review materi, silakan kabari ya, Kak. Terima kasih banyak! 🙏✨`;
    navigator.clipboard.writeText(text);
    setCopiedState({ pic: pic.pic, type: "cadence" });
    setTimeout(() => setCopiedState(null), 2500);
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
              Status Pengisian Laporan &amp; Cadence 6 PIC Cabang
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-secondary text-foreground-secondary border border-border">
              Cutoff: {formatShortIndo(ACTIVE_MEETING_CYCLE.endDate)} 2026 ({ACTIVE_MEETING_CYCLE.shortLabel})
            </span>
          </div>
          <p className="text-xs text-foreground-secondary mt-1">
            Pantauan kepatuhan pengisian harian spreadsheet dan ritme upload konten Reels (Target 19.00 WIB · Reminder 18.30 WIB) di seluruh cabang Optik I See You &amp; Lunar Eyewear.
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

      {/* Directive Box: Standar Arahan Jam Upload & Cadence 3 Hari */}
      <div className="rounded-2xl p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-surface border border-amber-500/30 shadow-subtle space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-foreground">
                Arahan Operasional Jam Upload &amp; Pengecekan Ritme Reels
              </h4>
              <p className="text-xs text-foreground-secondary">
                Aturan reminder dan batas waktu konten harian cabang Optik I See You.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-1.5 border border-amber-500/30">
              <BellRing className="w-3.5 h-3.5 text-amber-600" />
              <span>Reminder: 18.30 WIB</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-1.5 border border-emerald-500/30">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Upload: 19.00 WIB</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-900 dark:text-purple-200 text-xs font-bold flex items-center gap-1.5 border border-purple-500/30">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Cadence: Maks 3 Hari</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-amber-500/20 text-xs">
          <div className="p-3 rounded-xl bg-surface/80 border border-amber-500/20 space-y-1">
            <div className="font-bold text-foreground flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>1. Reminder 18.30 WIB (Pra-Upload)</span>
            </div>
            <p className="text-[11px] text-foreground-secondary">
              Kirim chat pengingat 30 menit sebelum slot upload malam ke PIC cabang untuk konfirmasi materi Reels sudah ready di-draft.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface/80 border border-amber-500/20 space-y-1">
            <div className="font-bold text-foreground flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>2. Jam Upload 19.00 WIB (Prime Time)</span>
            </div>
            <p className="text-[11px] text-foreground-secondary">
              Slot tayang optimal engagement audiens lokal Jawa Tengah. Audio trending, cover 1:1, dan tagging lokasi store wajib dicek.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface/80 border border-amber-500/20 space-y-1">
            <div className="font-bold text-foreground flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>3. Cek Ritme Maksimal 3 Hari</span>
            </div>
            <p className="text-[11px] text-foreground-secondary">
              Setiap cabang wajib ada Reels baru minimal setiap 3 hari. Jika jeda mencapai 3 hari, segera kirim pengingat kendala produksi.
            </p>
          </div>
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

              {/* Action Buttons: WhatsApp Reminders (Laporan, Upload 18.30, Cadence 3 Hari) */}
              <div className="mt-4 pt-3 border-t border-border/70 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-foreground-muted mb-1">
                  <span>Chat Up PIC ({picItem.pic}):</span>
                  {copiedState?.pic === picItem.pic && (
                    <span className="text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1 animate-in fade-in">
                      <Check className="w-3 h-3" />
                      <span>
                        {copiedState.type === "upload"
                          ? "Reminder 18.30 Disalin!"
                          : copiedState.type === "cadence"
                          ? "Pesan Ritme 3 Hari Disalin!"
                          : "Tagihan Laporan Disalin!"}
                      </span>
                    </span>
                  )}
                </div>

                {/* Primary Button: Reminder 18.30 WIB (Upload 19.00 Prime Time) */}
                <button
                  type="button"
                  onClick={() => handleCopyUploadReminder(picItem)}
                  className={`w-full flex items-center justify-between py-2 px-3 rounded-control text-xs font-bold transition-all shadow-subtle ${
                    copiedState?.pic === picItem.pic && copiedState?.type === "upload"
                      ? "bg-emerald-700 text-white"
                      : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-500/30"
                  }`}
                  title="Salin pesan WA pengingat 30 menit sebelum slot upload jam 19.00 WIB"
                >
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Reminder Upload 18.30 (Jam 19.00)</span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-500/20">
                    Prime
                  </span>
                </button>

                {/* Secondary Row: Cek Ritme 3 Hari & Tagihan Laporan */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyCadenceCheck(picItem)}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-control text-[11px] font-semibold transition-all border ${
                      copiedState?.pic === picItem.pic && copiedState?.type === "cadence"
                        ? "bg-purple-700 text-white border-purple-800"
                        : "bg-surface-secondary hover:bg-surface text-foreground border-border"
                    }`}
                    title="Salin template cek ritme apakah sudah 3 hari belum upload Reels"
                  >
                    <Sparkles className="w-3 h-3 text-purple-600" />
                    <span>Cek Ritme 3 Hari</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyLaporan(picItem)}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-control text-[11px] font-semibold transition-all border ${
                      copiedState?.pic === picItem.pic && copiedState?.type === "laporan"
                        ? "bg-emerald-700 text-white border-emerald-800"
                        : isPending
                        ? "bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300"
                        : "bg-surface-secondary hover:bg-surface text-foreground border-border"
                    }`}
                    title="Salin pesan pengingat update spreadsheet laporan harian"
                  >
                    <MessageCircle className="w-3 h-3 text-emerald-800" />
                    <span>{isPending ? "Tagih Laporan" : "Format Laporan"}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
