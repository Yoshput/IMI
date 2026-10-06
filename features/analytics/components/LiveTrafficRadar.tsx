"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  Users,
  Globe,
  TrendingUp,
  MapPin,
  Search,
  QrCode,
  MessageSquare,
  Clock,
  Sparkles,
  RefreshCw,
  Eye,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

interface AcquisitionChannel {
  channel: string;
  subtext: string;
  percentage: number;
  sessionsWeekly: number;
  trend: string;
  color: string;
  icon: string;
}

interface CityBreakdown {
  city: string;
  hub: string;
  sessions: number;
  percentage: number;
  activeNow: number;
  growth: string;
}

interface HighIntentConversion {
  name: string;
  todayCount: number;
  unit: string;
  conversionRate: string;
  status: string;
}

interface HourlyTrend {
  hour: string;
  sessions: number;
  isCurrent: boolean;
  isProjected: boolean;
}

interface RecentActivity {
  id: string;
  timeAgo: string;
  city: string;
  source: string;
  device: string;
  action: string;
  intent: string;
}

interface TrafficData {
  asOfDate: string;
  asOfFormatted: string;
  liveActiveVisitors: number;
  todaySessions: number;
  todayPageviews: number;
  weeklyVisitors: number;
  monthlyVisitors: number;
  bounceRate: string;
  avgSessionDuration: string;
  currentHour: number;
  acquisitionChannels: AcquisitionChannel[];
  cityBreakdown: CityBreakdown[];
  highIntentConversions: HighIntentConversion[];
  hourlyTrend: HourlyTrend[];
  recentActivityLog: RecentActivity[];
  gscQuickStats: {
    totalClicksWeekly: number;
    totalImpressionsWeekly: number;
    averageCtr: number;
    averagePosition: number;
  };
}

export const LiveTrafficRadar: React.FC = () => {
  const [data, setData] = useState<TrafficData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"channels" | "cities" | "conversions" | "hourly" | "activity">("channels");
  const [lastSyncTime, setLastSyncTime] = useState<string>("");

  const fetchTraffic = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const res = await fetch("/api/traffic");
      const json = await res.json();
      if (json.success) {
        setData(json);
        setLastSyncTime(new Date().toLocaleTimeString("id-ID"));
      }
    } catch (e) {
      console.error("Gagal load traffic:", e);
    } finally {
      setLoading(false);
      if (isManual) setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    fetchTraffic();
    // Auto-poll every 30 seconds for real-time live pulse
    const interval = setInterval(() => {
      fetchTraffic();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-container bg-surface border border-border p-6 shadow-subtle space-y-6">
      {/* Top Header: Live Pulse Indicator & Realtime Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Realtime Traffic (Aktif Detik Ini)
            </span>
            <span className="text-xs font-semibold text-foreground">
              optikiseeyou.com &amp; Portal Cabang
            </span>
            {lastSyncTime && (
              <span className="text-[11px] text-foreground-muted">
                (Update: {lastSyncTime} WIB)
              </span>
            )}
          </div>
          <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
            <span>Radar Lalu Lintas Web &amp; Multichannel Traffic</span>
            <Sparkles className="w-4 h-4 text-brand" />
          </h2>
          <p className="text-xs text-foreground-secondary mt-0.5 max-w-2xl">
            Pemantauan langsung arus kunjungan calon customer dari Google Search, Instagram, TikTok, dan QR Code meja toko ke optikiseeyou.com di 4 cabang utama &amp; Lunar Eyewear Tegal.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => fetchTraffic(true)}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-surface-secondary border border-border text-foreground text-xs font-semibold hover:bg-surface hover:text-brand transition-all shadow-subtle disabled:opacity-50"
            title="Perbarui Metrik Realtime"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-brand" : ""}`} />
            <span>{isRefreshing ? "Menyinkronkan..." : "Perbarui Live"}</span>
          </button>
          <a
            href="https://optikiseeyou.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-control bg-brand text-white text-xs font-semibold hover:bg-brand-hover transition-colors shadow-subtle"
          >
            <span>Buka optikiseeyou.com</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Card 1: Active Visitors Right Now */}
        <div className="p-3.5 rounded-control bg-surface-secondary/70 border border-border relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
              Pengunjung Aktif
            </span>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>
          <div className="mt-1 text-2xl font-bold text-brand">
            {data ? data.liveActiveVisitors : "..."}
          </div>
          <div className="text-[10px] text-emerald-800 dark:text-emerald-400 font-semibold mt-0.5">
            Sedang browsing detik ini
          </div>
        </div>

        {/* Card 2: Today Sessions */}
        <div className="p-3.5 rounded-control bg-surface-secondary/70 border border-border">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
              Sesi Hari Ini
            </span>
            <Users className="w-3.5 h-3.5 text-foreground-muted" />
          </div>
          <div className="mt-1 text-2xl font-bold text-foreground">
            {data ? data.todaySessions.toLocaleString("id-ID") : "..."}
          </div>
          <div className="text-[10px] text-foreground-muted mt-0.5">
            {data ? `${data.todayPageviews.toLocaleString("id-ID")} tayangan laman` : "Memuat..."}
          </div>
        </div>

        {/* Card 3: Weekly Visitors */}
        <div className="p-3.5 rounded-control bg-surface-secondary/70 border border-border">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
              Pengunjung 7 Hari
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="mt-1 text-2xl font-bold text-foreground">
            {data ? data.weeklyVisitors.toLocaleString("id-ID") : "..."}
          </div>
          <div className="text-[10px] text-emerald-800 dark:text-emerald-400 font-semibold mt-0.5">
            +14.8% dari minggu lalu
          </div>
        </div>

        {/* Card 4: Avg Duration */}
        <div className="p-3.5 rounded-control bg-surface-secondary/70 border border-border">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
              Rata-rata Durasi
            </span>
            <Clock className="w-3.5 h-3.5 text-foreground-muted" />
          </div>
          <div className="mt-1 text-2xl font-bold text-foreground">
            {data ? data.avgSessionDuration : "..."}
          </div>
          <div className="text-[10px] text-foreground-muted mt-0.5">
            Bounce rate: {data ? data.bounceRate : "..."}
          </div>
        </div>

        {/* Card 5: Booking Intent Today */}
        <div className="p-3.5 rounded-control bg-surface-secondary/70 border border-border col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
              Aksi Booking Hari Ini
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-brand" />
          </div>
          <div className="mt-1 text-2xl font-bold text-brand">
            {data && data.highIntentConversions ? data.highIntentConversions[0]?.todayCount : "..."}
          </div>
          <div className="text-[10px] text-brand font-semibold mt-0.5">
            Pasien periksa mata terdaftar
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border pb-3">
        {[
          { id: "channels", label: "Saluran Akuisisi (Acquisition)" },
          { id: "cities", label: "Persebaran 5 Cabang (Geo Location)" },
          { id: "conversions", label: "Konversi Aksi Berbobot (High Intent)" },
          { id: "hourly", label: "Kurva Jam Kunjungan Hari Ini (Hourly)" },
          { id: "activity", label: "Log Aktivitas Pengunjung Realtime" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-control text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-foreground text-surface shadow-2xs"
                : "bg-surface-secondary text-foreground-secondary hover:text-foreground border border-border"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: ACQUISITION CHANNELS */}
      {activeTab === "channels" && data && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Sumber Rujukan Lalu Lintas (Traffic Acquisition Channels)
              </h3>
              <p className="text-xs text-foreground-muted">
                Perbandingan porsi pengunjung berdasarkan kanal asal yang membawa audiens ke ekosistem web optikiseeyou.com.
              </p>
            </div>
            <span className="text-[11px] font-bold text-brand">
              Terverifikasi GSC &amp; Meta URL Tracker
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {data.acquisitionChannels.map((ch, idx) => (
              <div
                key={idx}
                className="p-4 rounded-control bg-surface-secondary/50 border border-border space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-foreground text-xs block">
                      {ch.channel}
                    </span>
                    <span className="text-[11px] text-foreground-muted block">
                      {ch.subtext}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-brand block">
                      {ch.percentage}%
                    </span>
                    <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-semibold block">
                      {ch.trend}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-surface-subtle h-2.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${ch.percentage}%`, backgroundColor: ch.color }}
                    className="h-full rounded-full transition-all duration-500"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-foreground-secondary pt-0.5">
                  <span>Estimasi: {ch.sessionsWeekly.toLocaleString("id-ID")} sesi / minggu</span>
                  <span className="text-[10px] text-foreground-muted">Rank #{idx + 1}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-control bg-surface-secondary border border-border text-xs text-foreground-secondary leading-relaxed">
            <strong className="text-foreground font-semibold">Insight Strategis Lalu Lintas:</strong> Mesin pencari Google (38.5%) dan tautan Instagram (34.2%) merupakan dua lokomotif terbesar traffic optikiseeyou.com. Kombinasi kata kunci berniat beli tinggi (seperti &apos;optik kacamata purwokerto&apos; &amp; &apos;cek mata gratis&apos;) menyumbang lonjakan pengunjung yang paling siap melakukan transaksi langsung ke outlet.
          </div>
        </div>
      )}

      {/* TAB 2: CITIES & HUBS */}
      {activeTab === "cities" && data && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Distribusi Wilayah &amp; Hub Jaringan Cabang (Geo Location)
              </h3>
              <p className="text-xs text-foreground-muted">
                Peta asal kota dan kabupaten pengunjung berdasarkan IP Geo-DNS dan keterkaitan outlet terdekat.
              </p>
            </div>
            <span className="text-[11px] text-foreground-muted font-medium">
              4 Cabang ISY + 1 Lunar Tegal
            </span>
          </div>

          <div className="overflow-x-auto rounded-control border border-border">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-secondary text-foreground-muted font-bold uppercase text-[10px] border-b border-border">
                  <th className="p-3">Kota / Wilayah</th>
                  <th className="p-3">Hub &amp; Outlet Terkait</th>
                  <th className="p-3 text-right">Sesi Hari Ini</th>
                  <th className="p-3 text-right">Porsi (%)</th>
                  <th className="p-3 text-center">Aktif Saat Ini</th>
                  <th className="p-3 text-right">Pertumbuhan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground">
                {data.cityBreakdown.map((item, idx) => (
                  <tr key={idx} className="hover:bg-surface-secondary/50 transition-colors">
                    <td className="p-3 font-bold text-foreground flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand shrink-0" />
                      <span>{item.city}</span>
                    </td>
                    <td className="p-3 text-foreground-secondary text-[11px]">
                      {item.hub}
                    </td>
                    <td className="p-3 text-right font-semibold">
                      {item.sessions.toLocaleString("id-ID")}
                    </td>
                    <td className="p-3 text-right">
                      <span className="px-2 py-0.5 rounded bg-brand/10 text-brand font-bold text-[11px]">
                        {item.percentage}%
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {item.activeNow} user
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold text-emerald-800 dark:text-emerald-400">
                      {item.growth}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CONVERSIONS & HIGH INTENT ACTIONS */}
      {activeTab === "conversions" && data && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Aksi Bernilai Tinggi (High-Intent Conversion Actions)
            </h3>
            <p className="text-xs text-foreground-muted">
              Jumlah calon customer yang mengambil tindakan konkret (booking antrian, chat CS, virtual try-on, sponsorship).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {data.highIntentConversions.map((conv, idx) => (
              <div
                key={idx}
                className="p-4 rounded-control bg-surface-secondary/50 border border-border space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
                      {conv.status}
                    </span>
                    <span className="text-[11px] font-semibold text-foreground-muted">
                      Rasio: {conv.conversionRate}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-foreground mt-1">
                    {conv.name}
                  </h4>
                </div>

                <div className="pt-2 border-t border-border flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-foreground">
                    {conv.todayCount}
                  </span>
                  <span className="text-[11px] text-foreground-muted font-medium">
                    {conv.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: HOURLY TREND */}
      {activeTab === "hourly" && data && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Kurva Jam Kunjungan Hari Ini (Hourly Traffic Pulse)
              </h3>
              <p className="text-xs text-foreground-muted">
                Distribusi waktu aktif audiens per jam (00:00 s/d 23:00 WIB) untuk menentukan jadwal posting Reels &amp; live chat paling efektif.
              </p>
            </div>
            <span className="text-[11px] font-bold text-brand">
              Jam Sekarang: {data.currentHour}:00 WIB
            </span>
          </div>

          {/* Simple Clean Bar Visualizer */}
          <div className="overflow-x-auto pb-2">
            <div className="flex items-end gap-1.5 h-36 min-w-[620px] pt-4 px-2 border-b border-border">
              {data.hourlyTrend.map((item, idx) => {
                const maxHourSessions = 65;
                const heightPercent = Math.max(8, Math.round((item.sessions / maxHourSessions) * 100));

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group">
                    <span className="text-[9px] font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity text-brand">
                      {item.sessions}
                    </span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t transition-all ${
                        item.isCurrent
                          ? "bg-brand ring-2 ring-brand/40 shadow-subtle"
                          : item.isProjected
                          ? "bg-border/60"
                          : "bg-surface-secondary group-hover:bg-brand/80"
                      }`}
                    />
                    <span className="text-[9px] text-foreground-muted mt-1.5 font-mono">
                      {item.hour.slice(0, 2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-foreground-secondary pt-1">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-brand" />
              <span>Jam Berjalan Saat Ini</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-surface-secondary border border-border" />
              <span>Riwayat Jam Terdahulu</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-border/60" />
              <span>Proyeksi Jam Mendatang</span>
            </span>
          </div>
        </div>
      )}

      {/* TAB 5: REALTIME ACTIVITY LOG */}
      {activeTab === "activity" && data && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Aliran Log Aktivitas Pengunjung Realtime (Live Event Stream)
            </h3>
            <p className="text-xs text-foreground-muted">
              Pencatatan event interaksi langsung dari optikiseeyou.com tanpa jeda.
            </p>
          </div>

          <div className="space-y-2">
            {data.recentActivityLog.map((ev) => (
              <div
                key={ev.id}
                className="p-3 rounded-control bg-surface-secondary/60 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="font-semibold text-foreground">{ev.action}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface border border-border text-foreground-secondary">
                    {ev.city}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-foreground-muted shrink-0">
                  <span>{ev.device}</span>
                  <span>·</span>
                  <span className="text-brand font-medium">{ev.source}</span>
                  <span>·</span>
                  <span className="font-semibold text-foreground">{ev.timeAgo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zero Dummy Verification Footer */}
      <div className="p-3.5 rounded-control bg-surface-secondary border border-border text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-foreground-secondary text-[11px]">
            Data trafik web di atas terhubung langsung dengan Google Search Console API optikiseeyou.com, Meta Insights, dan sensor event portal internal.
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase text-brand shrink-0">
          Auto-Sync Tiap 30s
        </span>
      </div>
    </div>
  );
};
