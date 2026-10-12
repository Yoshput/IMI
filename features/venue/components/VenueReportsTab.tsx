"use client";

import React, { useState, useEffect } from "react";
import { cn, formatNumber, formatDateIndo } from "@/lib/utils";
import {
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Clock,
  ShieldCheck,
  Building,
  Calendar,
  Wallet,
  Users,
  Target,
  BarChart3,
  RefreshCw,
} from "lucide-react";

interface ReportData {
  stats: {
    totalVenues: number;
    activeVenues: number;
    verifiedVenues: number;
    needsVerification: number;
    followUpsDue: number;
    surveyScheduledOrDone: number;
    bookedConfirmedVenues: number;
    totalEvents: number;
    planningEvents: number;
    completedEvents: number;
    totalOutreach: number;
    averageScore: number;
    responseRate: number;
    surveyConversion: number;
  };
  events: Array<{
    id: string;
    name: string;
    date: string;
    status: string;
    targetAttendees: number;
    tasksCount: number;
    completedTasksCount: number;
  }>;
}

export const VenueReportsTab: React.FC = () => {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReportType, setSelectedReportType] = useState<"summary" | "readiness" | "funnel">("summary");

  const loadData = async () => {
    setLoading(true);
    try {
      const [dashRes, eventRes] = await Promise.all([
        fetch("/api/venue-dashboard"),
        fetch("/api/venue-events"),
      ]);

      const dashJson = await dashRes.json();
      const eventJson = await eventRes.json();

      const eventsList = (eventJson.data || []).map((e: any) => ({
        id: e.id,
        name: e.name,
        date: e.date,
        status: e.status,
        targetAttendees: e.targetAttendees || 0,
        tasksCount: e.tasks?.length || 0,
        completedTasksCount: e.tasks?.filter((t: any) => t.status === "selesai").length || 0,
      }));

      setData({
        stats: dashJson.data || {
          totalVenues: 0,
          activeVenues: 0,
          verifiedVenues: 0,
          needsVerification: 0,
          followUpsDue: 0,
          surveyScheduledOrDone: 0,
          bookedConfirmedVenues: 0,
          totalEvents: 0,
          planningEvents: 0,
          completedEvents: 0,
          totalOutreach: 0,
          averageScore: 0,
          responseRate: 0,
          surveyConversion: 0,
        },
        events: eventsList,
      });
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExportCSV = () => {
    window.location.href = "/api/venue-export";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const s = data?.stats;

  return (
    <div className="space-y-6">
      {/* Header and Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface rounded-container border border-border p-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            Laporan & Ekspor Data Operasional
          </div>
          <h2 className="text-lg font-bold text-foreground">
            Laporan Intelijen Venue & Kesiapan Acara
          </h2>
          <p className="text-xs text-foreground-secondary mt-0.5">
            Ringkasan eksekutif mingguan, konversi outreach, dan data audit trail untuk Optik I See You.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2 border border-border rounded-control bg-surface hover:bg-surface-secondary text-foreground-secondary transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-foreground text-surface text-xs font-semibold rounded-control hover:opacity-90 transition-opacity"
          >
            <Download className="w-3.5 h-3.5" />
            Ekspor CSV Database
          </button>
        </div>
      </div>

      {/* Sub-nav report types */}
      <div className="flex items-center gap-1 bg-surface rounded-control p-1 border border-border w-fit text-xs font-medium">
        <button
          onClick={() => setSelectedReportType("summary")}
          className={cn(
            "px-3 py-1.5 rounded-lg transition-colors",
            selectedReportType === "summary"
              ? "bg-foreground text-surface font-semibold"
              : "text-foreground-secondary hover:text-foreground"
          )}
        >
          Laporan Eksekutif Mingguan
        </button>
        <button
          onClick={() => setSelectedReportType("funnel")}
          className={cn(
            "px-3 py-1.5 rounded-lg transition-colors",
            selectedReportType === "funnel"
              ? "bg-foreground text-surface font-semibold"
              : "text-foreground-secondary hover:text-foreground"
          )}
        >
          Corong Outreach & Konversi
        </button>
        <button
          onClick={() => setSelectedReportType("readiness")}
          className={cn(
            "px-3 py-1.5 rounded-lg transition-colors",
            selectedReportType === "readiness"
              ? "bg-foreground text-surface font-semibold"
              : "text-foreground-secondary hover:text-foreground"
          )}
        >
          Kesiapan Operasional Event
        </button>
      </div>

      {selectedReportType === "summary" && (
        <div className="space-y-6">
          {/* Executive Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface rounded-container border border-border p-4">
              <span className="text-[11px] font-semibold text-foreground-secondary uppercase tracking-wider block mb-1">
                Total Database Venue
              </span>
              <div className="text-2xl font-bold text-foreground">
                {s?.totalVenues || 0}
              </div>
              <div className="text-[11px] text-foreground-muted mt-1">
                {s?.activeVenues || 0} beroperasi aktif
              </div>
            </div>

            <div className="bg-surface rounded-container border border-border p-4">
              <span className="text-[11px] font-semibold text-foreground-secondary uppercase tracking-wider block mb-1">
                Integritas Bukti
              </span>
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                {s?.totalVenues ? Math.round(((s?.verifiedVenues || 0) / s.totalVenues) * 100) : 0}%
              </div>
              <div className="text-[11px] text-foreground-muted mt-1">
                {s?.verifiedVenues || 0} venue terverifikasi
              </div>
            </div>

            <div className="bg-surface rounded-container border border-border p-4">
              <span className="text-[11px] font-semibold text-foreground-secondary uppercase tracking-wider block mb-1">
                Rata-rata Skor Kelayakan
              </span>
              <div className="text-2xl font-bold text-brand">
                {s?.averageScore || 0} <span className="text-xs text-foreground-muted font-normal">/ 100</span>
              </div>
              <div className="text-[11px] text-foreground-muted mt-1">
                Evaluasi 6 kriteria objektif
              </div>
            </div>

            <div className="bg-surface rounded-container border border-border p-4">
              <span className="text-[11px] font-semibold text-foreground-secondary uppercase tracking-wider block mb-1">
                Pipeline Konversi
              </span>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                {s?.bookedConfirmedVenues || 0}
              </div>
              <div className="text-[11px] text-foreground-muted mt-1">
                Venue booked & terkonfirmasi
              </div>
            </div>
          </div>

          {/* Audit & Data Governance Notice */}
          <div className="bg-status-successBg border border-status-success/30 rounded-container p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-status-success shrink-0 mt-0.5" />
            <div className="text-xs">
              <h4 className="font-bold text-status-success">
                Standar Kepatuhan Integritas Data & Anti-Fabrikasi
              </h4>
              <p className="text-foreground-secondary mt-1 leading-relaxed">
                Seluruh data kandidat venue, kontak nomor telepon, dan estimasi biaya dilarang direkayasa. Kolom yang belum dikonfirmasi resmi oleh pengelola atau survei fisik ditandai secara transparan sebagai <em>&quot;Belum diketahui&quot;</em>.
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedReportType === "funnel" && (
        <div className="bg-surface rounded-container border border-border p-6 space-y-6">
          <h3 className="text-sm font-bold text-foreground">
            Corong Penjangkauan & Rasio Konversi
          </h3>

          <div className="space-y-4 max-w-2xl">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-foreground">1. Total Calon Venue Teridentifikasi</span>
                <span className="font-bold text-foreground">{s?.totalVenues || 0} Venue</span>
              </div>
              <div className="w-full bg-surface-subtle h-3 rounded-full overflow-hidden">
                <div className="bg-brand h-full rounded-full" style={{ width: "100%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-foreground">2. Venue Siap / Sudah Dihubungi</span>
                <span className="font-bold text-foreground">{s?.totalOutreach || 0} Aktivitas</span>
              </div>
              <div className="w-full bg-surface-subtle h-3 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${s?.totalVenues ? Math.min(100, Math.round(((s?.totalOutreach || 0) / s.totalVenues) * 100)) : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-foreground">3. Response Rate (Mendapat Tanggapan)</span>
                <span className="font-bold text-foreground">{s?.responseRate || 0}%</span>
              </div>
              <div className="w-full bg-surface-subtle h-3 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${s?.responseRate || 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-foreground">4. Survei Lapangan Dijadwalkan / Selesai</span>
                <span className="font-bold text-foreground">{s?.surveyScheduledOrDone || 0} Venue ({s?.surveyConversion || 0}%)</span>
              </div>
              <div className="w-full bg-surface-subtle h-3 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${s?.surveyConversion || 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-foreground">5. Persetujuan & Terkonfirmasi Booked</span>
                <span className="font-bold text-foreground">{s?.bookedConfirmedVenues || 0} Venue</span>
              </div>
              <div className="w-full bg-surface-subtle h-3 rounded-full overflow-hidden">
                <div
                  className="bg-green-700 h-full rounded-full"
                  style={{ width: `${s?.totalVenues ? Math.min(100, Math.round(((s?.bookedConfirmedVenues || 0) / s.totalVenues) * 100)) : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedReportType === "readiness" && (
        <div className="bg-surface rounded-container border border-border p-6 space-y-4">
          <h3 className="text-sm font-bold text-foreground">
            Status Kesiapan Operasional Acara Mendatang
          </h3>

          {!data?.events || data.events.length === 0 ? (
            <div className="py-8 text-center text-xs text-foreground-muted">
              Belum ada event terdaftar dalam sistem.
            </div>
          ) : (
            <div className="space-y-3">
              {data.events.map((ev) => {
                const readinessPct = ev.tasksCount > 0 ? Math.round((ev.completedTasksCount / ev.tasksCount) * 100) : 0;
                return (
                  <div
                    key={ev.id}
                    className="p-4 rounded-control border border-border bg-surface-secondary/30 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-foreground text-sm">
                        {ev.name}
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-surface border border-border capitalize">
                        {ev.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-foreground-secondary pt-1">
                      <div>
                        Tanggal: <span className="font-medium text-foreground">{ev.date ? formatDateIndo(ev.date) : "Belum ditentukan"}</span>
                      </div>
                      <div>
                        Target Peserta: <span className="font-medium text-foreground">{formatNumber(ev.targetAttendees)} pax</span>
                      </div>
                      <div>
                        Kesiapan Tugas: <span className="font-bold text-brand">{readinessPct}%</span> ({ev.completedTasksCount}/{ev.tasksCount} selesai)
                      </div>
                    </div>

                    <div className="w-full bg-surface-subtle h-1.5 rounded-full overflow-hidden mt-2">
                      <div
                        className="bg-brand h-full rounded-full transition-all"
                        style={{ width: `${readinessPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
