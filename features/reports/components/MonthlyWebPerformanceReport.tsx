"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Globe,
  Camera,
  Stethoscope,
  TrendingUp,
  Download,
  Calendar,
  Sparkles,
  FileText,
  Presentation,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
  Layers,
  Users,
  Share2,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { MonthlyWebPerformanceData, MonthlyPeriod, WeekFilterKey } from "@/types";
import { getCurrentMonthKey, getAvailableMonths, formatMonthLabel, getWeekOptions } from "@/lib/month-utils";
import { getMonthlyWebPerformanceData } from "@/lib/monthly-web-performance";
import { exportWebPerformanceToPDF, exportWebPerformanceToPPT } from "@/lib/export-pdf-ppt";

interface MonthlyWebPerformanceReportProps {
  initialMonth?: string;
  onNavigateToTab?: (tab: string) => void;
}

export const MonthlyWebPerformanceReport: React.FC<MonthlyWebPerformanceReportProps> = ({
  initialMonth,
}) => {
  // Dynamic current month default
  const [selectedMonth, setSelectedMonth] = useState<string>(
    () => initialMonth || getCurrentMonthKey()
  );
  const [selectedWeek, setSelectedWeek] = useState<WeekFilterKey>("w4_monthly");

  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingPpt, setIsExportingPpt] = useState(false);
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  // Available month periods & week options
  const monthOptions: MonthlyPeriod[] = useMemo(() => {
    return getAvailableMonths();
  }, []);

  const weekOptions = useMemo(() => {
    return getWeekOptions(selectedMonth);
  }, [selectedMonth]);

  // Compute or fetch monthly/weekly data
  const data: MonthlyWebPerformanceData = useMemo(() => {
    return getMonthlyWebPerformanceData(selectedMonth, selectedWeek);
  }, [selectedMonth, selectedWeek]);

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    setExportFeedback(null);
    try {
      await exportWebPerformanceToPDF(data);
      setExportFeedback(`PDF Laporan Web ${data.periodLabel || data.monthLabel} berhasil diunduh!`);
      setTimeout(() => setExportFeedback(null), 4000);
    } catch (err: any) {
      console.error("Gagal ekspor PDF:", err);
      setExportFeedback(`Gagal ekspor PDF: ${err.message}`);
      setTimeout(() => setExportFeedback(null), 5000);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportPpt = async () => {
    setIsExportingPpt(true);
    setExportFeedback(null);
    try {
      await exportWebPerformanceToPPT(data);
      setExportFeedback(`PPT Laporan Web ${data.periodLabel || data.monthLabel} berhasil diunduh!`);
      setTimeout(() => setExportFeedback(null), 4000);
    } catch (err: any) {
      console.error("Gagal ekspor PPT:", err);
      setExportFeedback(`Gagal ekspor PPT: ${err.message}`);
      setTimeout(() => setExportFeedback(null), 5000);
    } finally {
      setIsExportingPpt(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Header & Action Bar */}
      <div className="p-4 rounded-xl border border-border bg-surface shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-brand/10 text-brand border border-brand/20">
              <Globe className="w-3 h-3 text-brand" />
              Laporan Web &amp; Performa
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              {data.periodLabel || data.monthLabel}
            </span>
          </div>
          <p className="text-xs text-foreground-secondary mt-1">
            Rekap lengkap performa aset digital: Web Photobooth Virtual Try-On, Pendaftaran Nomor Antrian Online Cek Mata, dan SEO Organik Google Search Console ({data.periodLabel || data.monthLabel}).
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Month Selector */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-background">
            <Calendar className="w-3.5 h-3.5 text-foreground-muted" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-foreground text-xs font-bold focus:outline-none cursor-pointer"
            >
              {monthOptions.map((opt) => (
                <option key={opt.monthKey} value={opt.monthKey} className="bg-surface text-foreground">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Week Selector */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-background">
            <Calendar className="w-3.5 h-3.5 text-brand" />
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value as WeekFilterKey)}
              className="bg-transparent text-foreground text-xs font-bold focus:outline-none cursor-pointer"
            >
              {weekOptions.map((w) => (
                <option key={w.key} value={w.key} className="bg-surface text-foreground">
                  {w.shortLabel}
                </option>
              ))}
            </select>
          </div>

          {/* Export PDF Button */}
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#124734] hover:bg-[#0E3829] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs active:scale-95 disabled:opacity-60 cursor-pointer"
            title="Download Laporan Format PDF Resmi Siap Kirim"
          >
            <Download className={`w-3.5 h-3.5 text-white ${isExportingPdf ? "animate-bounce" : ""}`} />
            <span>{isExportingPdf ? "Menyiapkan PDF..." : "Export PDF"}</span>
          </button>

          {/* Export PPT Button */}
          <button
            type="button"
            onClick={handleExportPpt}
            disabled={isExportingPpt}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface border border-border text-foreground font-semibold text-xs hover:bg-surface-secondary hover:text-brand hover:border-brand/40 transition-all shadow-2xs active:scale-95 disabled:opacity-60 cursor-pointer"
            title="Download Slide Presentasi PowerPoint (.pptx)"
          >
            <Presentation className={`w-3.5 h-3.5 text-brand ${isExportingPpt ? "animate-pulse" : ""}`} />
            <span>{isExportingPpt ? "Menyiapkan PPT..." : "Export PPT"}</span>
          </button>
        </div>
      </div>

      {/* Export Feedback Toast */}
      {exportFeedback && (
        <div className="p-3 rounded-lg bg-status-successBg border border-status-success/30 text-status-success text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{exportFeedback}</span>
        </div>
      )}

      {/* 4 Kartu KPI Utama Bulanan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* KPI 1: Photobooth Sessions */}
        <div className="p-3.5 rounded-xl border border-border bg-surface shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted">
              Web Photobooth
            </span>
            <Camera className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-foreground tabular-nums">
              {data.photobooth.totalSessions.toLocaleString("id-ID")}
            </span>
            <span className="text-xs text-foreground-secondary font-medium">sesi</span>
          </div>
          <div className="mt-2 text-[11px] text-foreground-secondary flex items-center justify-between border-t border-border/50 pt-2">
            <span>Users Unik:</span>
            <span className="font-bold text-foreground">{data.photobooth.uniqueUsers.toLocaleString("id-ID")}</span>
          </div>
          <div className="mt-0.5 text-[11px] text-foreground-secondary flex items-center justify-between">
            <span>Foto Di-share:</span>
            <span className="font-bold text-emerald-600">{data.photobooth.sharedPhotos.toLocaleString("id-ID")} foto</span>
          </div>
        </div>

        {/* KPI 2: Conversion to Queue */}
        <div className="p-3.5 rounded-xl border border-border bg-surface shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted">
              Konversi ke Antrian
            </span>
            <TrendingUp className="w-4 h-4 text-brand" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-foreground tabular-nums">
              {data.photobooth.conversionRate}%
            </span>
            <span className="text-xs text-emerald-600 font-bold">Tinggi</span>
          </div>
          <p className="text-[11px] text-foreground-secondary mt-1">
            Pengguna virtual try-on yang lanjut booking antrian cek mata.
          </p>
          <div className="mt-2 text-[11px] text-foreground-secondary flex items-center justify-between border-t border-border/50 pt-2">
            <span>Status Corong (Funnel):</span>
            <span className="font-bold text-emerald-600">Sangat Efektif</span>
          </div>
        </div>

        {/* KPI 3: Total Antrian Online */}
        <div className="p-3.5 rounded-xl border border-border bg-surface shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted">
              Nomor Antrian Online
            </span>
            <Stethoscope className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-foreground tabular-nums">
              {data.queue.totalRegistered.toLocaleString("id-ID")}
            </span>
            <span className="text-xs text-foreground-secondary font-medium">pasien</span>
          </div>
          <div className="mt-2 text-[11px] text-foreground-secondary flex items-center justify-between border-t border-border/50 pt-2">
            <span>Rata-rata Harian:</span>
            <span className="font-bold text-foreground">{data.queue.dailyAverage} pasien/hari</span>
          </div>
          <div className="mt-0.5 text-[11px] text-foreground-secondary flex items-center justify-between">
            <span>Jaringan:</span>
            <span className="font-bold text-foreground">4 Cabang Resmi</span>
          </div>
        </div>

        {/* KPI 4: Google Search Console */}
        <div className="p-3.5 rounded-xl border border-border bg-surface shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted">
              Google Search Console
            </span>
            <Search className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-foreground tabular-nums">
              {data.gsc.totalClicks.toLocaleString("id-ID")}
            </span>
            <span className="text-xs text-foreground-secondary font-medium">klik organik</span>
          </div>
          <div className="mt-2 text-[11px] text-foreground-secondary flex items-center justify-between border-t border-border/50 pt-2">
            <span>Total Impresi:</span>
            <span className="font-bold text-foreground">{data.gsc.totalImpressions.toLocaleString("id-ID")}</span>
          </div>
          <div className="mt-0.5 text-[11px] text-foreground-secondary flex items-center justify-between">
            <span>CTR &amp; Posisi:</span>
            <span className="font-bold text-blue-600">{data.gsc.avgCtr}% · Pos {data.gsc.avgPosition.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Grid: 2 Kolom untuk Breakdown Antrian Cabang & Top Frame Photobooth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Card A: Breakdown Antrian per Cabang */}
        <div className="p-4 rounded-xl border border-border bg-surface shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-brand" />
              <span>Distribusi Antrian Cek Mata per Cabang</span>
            </h3>
            <span className="text-xs text-foreground-muted">
              Periode: {data.monthLabel}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-secondary/40 text-foreground-muted font-bold">
                  <th className="py-2 px-2.5 text-left">No</th>
                  <th className="py-2 px-2.5 text-left">Cabang Optik</th>
                  <th className="py-2 px-2.5 text-right">Pendaftar</th>
                  <th className="py-2 px-2.5 text-right">Kontribusi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {data.queue.byBranch.map((b, idx) => {
                  const percent = data.queue.totalRegistered > 0
                    ? ((b.count / data.queue.totalRegistered) * 100).toFixed(1)
                    : "0";
                  return (
                    <tr key={b.branchName} className="hover:bg-surface-secondary/30 transition-colors">
                      <td className="py-2 px-2.5 text-foreground-muted">{idx + 1}</td>
                      <td className="py-2 px-2.5 font-bold text-foreground">{b.branchName}</td>
                      <td className="py-2 px-2.5 text-right font-extrabold text-foreground tabular-nums">
                        {b.count.toLocaleString("id-ID")}
                      </td>
                      <td className="py-2 px-2.5 text-right text-foreground-secondary tabular-nums">
                        <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                          {percent}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card B: Top Frame Virtual Try-On Photobooth */}
        <div className="p-4 rounded-xl border border-border bg-surface shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>Top Frame Virtual Try-On Terpopuler</span>
            </h3>
            <span className="text-xs text-foreground-muted">
              Source: optikiseeyou.com/photobooth
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-secondary/40 text-foreground-muted font-bold">
                  <th className="py-2 px-2.5 text-left">No</th>
                  <th className="py-2 px-2.5 text-left">Model Frame Kacamata</th>
                  <th className="py-2 px-2.5 text-right">Dicoba</th>
                  <th className="py-2 px-2.5 text-right">Di-share</th>
                  <th className="py-2 px-2.5 text-right">Share Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {data.photobooth.topFrames.map((f, idx) => {
                  const shareRate = f.tries > 0 ? ((f.shares / f.tries) * 100).toFixed(1) : "0";
                  return (
                    <tr key={f.model} className="hover:bg-surface-secondary/30 transition-colors">
                      <td className="py-2 px-2.5 text-foreground-muted">{idx + 1}</td>
                      <td className="py-2 px-2.5 font-bold text-foreground">{f.model}</td>
                      <td className="py-2 px-2.5 text-right text-foreground tabular-nums">
                        {f.tries.toLocaleString("id-ID")}
                      </td>
                      <td className="py-2 px-2.5 text-right text-emerald-700 font-bold tabular-nums">
                        {f.shares.toLocaleString("id-ID")}
                      </td>
                      <td className="py-2 px-2.5 text-right text-foreground-secondary tabular-nums">
                        <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-semibold bg-brand/10 text-brand">
                          {shareRate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Grid: 2 Kolom untuk Google Search Console (Top Queries & Top Pages) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Card C: Top Search Queries GSC */}
        <div className="p-4 rounded-xl border border-border bg-surface shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-600" />
              <span>Top 8 Kata Kunci Google Search (SEO)</span>
            </h3>
            <span className="text-xs text-foreground-muted">
              Rata-rata Posisi: {data.gsc.avgPosition.toFixed(1)}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-secondary/40 text-foreground-muted font-bold">
                  <th className="py-2 px-2 text-left">Query</th>
                  <th className="py-2 px-2 text-right">Klik</th>
                  <th className="py-2 px-2 text-right">Impresi</th>
                  <th className="py-2 px-2 text-right">CTR</th>
                  <th className="py-2 px-2 text-right">Posisi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {data.gsc.topQueries.slice(0, 8).map((q) => (
                  <tr key={q.query} className="hover:bg-surface-secondary/30 transition-colors">
                    <td className="py-2 px-2 font-medium text-foreground truncate max-w-[180px]" title={q.query}>
                      {q.query}
                    </td>
                    <td className="py-2 px-2 text-right font-bold text-foreground tabular-nums">
                      {q.clicks.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2 px-2 text-right text-foreground-secondary tabular-nums">
                      {q.impressions.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2 px-2 text-right text-emerald-700 font-bold tabular-nums">
                      {q.ctr}%
                    </td>
                    <td className="py-2 px-2 text-right font-medium text-blue-600 tabular-nums">
                      {q.position.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card D: Top Landing Pages GSC */}
        <div className="p-4 rounded-xl border border-border bg-surface shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand" />
              <span>Halaman Landing Paling Banyak Diakses</span>
            </h3>
            <span className="text-xs text-foreground-muted">
              optikiseeyou.com
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-secondary/40 text-foreground-muted font-bold">
                  <th className="py-2 px-2 text-left">Halaman Web</th>
                  <th className="py-2 px-2 text-right">Total Klik</th>
                  <th className="py-2 px-2 text-right">Impresi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {data.gsc.topPages.map((p) => (
                  <tr key={p.page} className="hover:bg-surface-secondary/30 transition-colors">
                    <td className="py-2 px-2 font-medium text-foreground truncate max-w-[240px]" title={p.page}>
                      {p.page}
                    </td>
                    <td className="py-2 px-2 text-right font-bold text-foreground tabular-nums">
                      {p.clicks.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2 px-2 text-right text-foreground-secondary tabular-nums">
                      {p.impressions.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tabel Log / Tren Harian Trafik Web & Antrian Sepanjang Bulan Terpilih */}
      <div className="p-4 rounded-xl border border-border bg-surface shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Log Tren Harian Trafik Web, Photobooth &amp; Antrian ({data.monthLabel})</span>
            </h3>
            <p className="text-[11px] text-foreground-secondary mt-0.5">
              Rincian perkembangan harian dari tanggal 1 hingga akhir bulan {data.monthLabel}.
            </p>
          </div>
          <span className="text-xs text-foreground-muted font-medium">
            {data.gsc.dailyTrend.length} Hari Tercatat
          </span>
        </div>

        <div className="overflow-x-auto max-h-72">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-surface z-10">
              <tr className="border-b border-border bg-surface-secondary/60 text-foreground-muted font-bold">
                <th className="py-2 px-3 text-left">No</th>
                <th className="py-2 px-3 text-left">Tanggal</th>
                <th className="py-2 px-3 text-right">Klik GSC</th>
                <th className="py-2 px-3 text-right">Impresi GSC</th>
                <th className="py-2 px-3 text-right">Sesi Photobooth</th>
                <th className="py-2 px-3 text-right">Booking Antrian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {data.gsc.dailyTrend.map((row, idx) => (
                <tr key={row.date} className="hover:bg-surface-secondary/30 transition-colors">
                  <td className="py-1.5 px-3 text-foreground-muted">{idx + 1}</td>
                  <td className="py-1.5 px-3 font-semibold text-foreground">{row.date}</td>
                  <td className="py-1.5 px-3 text-right font-medium text-foreground tabular-nums">
                    {row.clicks.toLocaleString("id-ID")}
                  </td>
                  <td className="py-1.5 px-3 text-right text-foreground-secondary tabular-nums">
                    {row.impressions.toLocaleString("id-ID")}
                  </td>
                  <td className="py-1.5 px-3 text-right font-bold text-emerald-700 tabular-nums">
                    {row.sessions?.toLocaleString("id-ID")}
                  </td>
                  <td className="py-1.5 px-3 text-right font-bold text-brand tabular-nums">
                    {row.queueBookings}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
