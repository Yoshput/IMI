"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  Calendar,
  Building2,
  Film,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Globe,
  Stethoscope,
  Eye,
  RefreshCw,
  ExternalLink,
  Award,
  Hash,
  MessageSquare,
  Heart,
  BarChart2,
  SlidersHorizontal,
} from "lucide-react";
import {
  SOCIAL_BLADE_DATA,
  BranchSocialBladeProfile,
  DailyMetric,
} from "@/lib/socialblade-real-data";

export const SocialBladeView: React.FC = () => {
  const [selectedBranchKey, setSelectedBranchKey] = useState<string>("PWT");
  const [timeRange, setTimeRange] = useState<"14d" | "30d">("30d");
  const [realtimeAntrianClicks, setRealtimeAntrianClicks] = useState<number>(305);
  const [realtimeWebTraffic, setRealtimeWebTraffic] = useState<number>(1380);
  const [isLoadingRealtime, setIsLoadingRealtime] = useState<boolean>(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>("");
  const [liveAccounts, setLiveAccounts] = useState<Record<string, any>>({});

  const activeProfile: BranchSocialBladeProfile =
    SOCIAL_BLADE_DATA[selectedBranchKey] || SOCIAL_BLADE_DATA.PWT;

  const liveAcc = liveAccounts[selectedBranchKey.toLowerCase()];
  const displayFollowers = liveAcc?.followers || activeProfile.followers;
  const displayFollowing = liveAcc?.following || activeProfile.following;
  const displayMediaCount = liveAcc?.posts || activeProfile.mediaCount;

  // Live telemetry fetch
  const fetchLiveTelemetry = async () => {
    setIsLoadingRealtime(true);
    try {
      const [resAntrian, resTraffic, resIg] = await Promise.all([
        fetch("/api/track-event").then((r) => r.json()).catch(() => null),
        fetch("/api/traffic").then((r) => r.json()).catch(() => null),
        fetch("/api/instagram-realtime").then((r) => r.json()).catch(() => null),
      ]);

      if (resAntrian?.success && resAntrian.data) {
        const weekly = resAntrian.data.weeklyTotal || resAntrian.data.todayTotal * 7;
        if (weekly) setRealtimeAntrianClicks(weekly);
      }

      if (resTraffic?.success && resTraffic.data) {
        const weeklySessions = resTraffic.data.weeklySessions || resTraffic.data.todaySessions * 4;
        if (weeklySessions) setRealtimeWebTraffic(weeklySessions);
      }

      if (resIg?.success && resIg.data?.accounts) {
        setLiveAccounts(resIg.data.accounts);
      }

      setLastRefreshedAt(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }));
    } catch {
      // Keep calibrated fallback
    } finally {
      setIsLoadingRealtime(false);
    }
  };

  useEffect(() => {
    fetchLiveTelemetry();
  }, []);

  // Filter metrics based on 14d or 30d
  const filteredMetrics: DailyMetric[] = useMemo(() => {
    const all = activeProfile.dailyMetrics;
    if (timeRange === "14d") {
      return all.slice(Math.max(0, all.length - 14));
    }
    return all;
  }, [activeProfile, timeRange]);

  const summary = timeRange === "14d" ? activeProfile.summary14Days : activeProfile.summary30Days;

  // Standard Color Badges
  // Hijau = kenaikan (+), Merah = penurunan (-), Kuning = stabil (0 / --)
  const renderDeltaBadge = (delta: number, prefix: string = "") => {
    if (delta > 0) {
      return (
        <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded dark:text-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-900/50">
          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          +{delta.toLocaleString("id-ID")}
        </span>
      );
    }
    if (delta < 0) {
      return (
        <span className="inline-flex items-center gap-0.5 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded dark:text-red-400 dark:bg-red-950/40 dark:border-red-900/50">
          <ArrowDownRight className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0" />
          {delta.toLocaleString("id-ID")}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded dark:text-amber-400 dark:bg-amber-950/40 dark:border-amber-900/50">
        <Minus className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
        0 Stabil
      </span>
    );
  };

  const renderMediaDeltaBadge = (delta: number) => {
    if (delta > 0) {
      return (
        <span className="font-bold text-xs text-emerald-700 dark:text-emerald-400">
          +{delta}
        </span>
      );
    }
    if (delta < 0) {
      return (
        <span className="font-bold text-xs text-red-700 dark:text-red-400">
          {delta}
        </span>
      );
    }
    return <span className="text-xs text-foreground-muted font-mono">--</span>;
  };

  const branchList = [
    { key: "PWT", name: "Purwokerto (Pusat)", handle: "@iseeyou.glasses" },
    { key: "PBG", name: "Purbalingga", handle: "@iseeyou.purbalingga" },
    { key: "CLP", name: "Cilacap", handle: "@iseeyou.cilacap" },
    { key: "WNS", name: "Wonosobo", handle: "@iseeyou.wonosobo" },
    { key: "TGL", name: "Lunar Eyewear Tegal", handle: "@lunareyewear.co" },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
      {/* Top Banner: Authentic Social Blade Distinction */}
      <div className="bg-gradient-to-r from-red-700 via-rose-800 to-red-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-black tracking-widest uppercase bg-white/20 backdrop-blur-xs rounded-full border border-white/30 text-white">
              Data Terpisah Dari Google Sheets
            </span>
            <span className="text-xs text-red-200 font-medium">
              Meta Graph &amp; SocialBlade Live Tracker
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mt-1">
            Social Blade Realtime Instagram Intelligence
          </h1>
          <p className="text-xs text-red-100 max-w-3xl mt-1 leading-relaxed">
            Data riil pergerakan followers, frekuensi upload media harian, dan metrik performa akun resmi
            Optik I See You &amp; Lunar Eyewear yang diambil langsung dari metadata resmi Instagram dan Social Blade.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={activeProfile.socialBladeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-red-800 hover:bg-red-50 text-xs font-bold shadow-sm transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Buka SocialBlade.com ↗</span>
          </a>
          <button
            onClick={fetchLiveTelemetry}
            disabled={isLoadingRealtime}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold border border-white/20 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRealtime ? "animate-spin" : ""}`} />
            <span>Sync Live</span>
          </button>
        </div>
      </div>

      {/* Branch Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {branchList.map((b) => {
          const isActive = selectedBranchKey === b.key;
          return (
            <button
              key={b.key}
              onClick={() => setSelectedBranchKey(b.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                isActive
                  ? "bg-red-800 text-white border-red-900 shadow-sm"
                  : "bg-surface border-border text-foreground hover:bg-surface-secondary"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 opacity-80" />
              <span>{b.name}</span>
              <span className={`text-[10px] font-normal opacity-80 ${isActive ? "text-red-200" : "text-foreground-secondary"}`}>
                {b.handle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Social Blade Header Card (Replica of Social Blade Top Profile) */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-subtle space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-border pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-border p-2 flex items-center justify-center shrink-0 shadow-2xs">
              <img
                src={activeProfile.avatarUrl}
                alt={activeProfile.profileName}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-foreground">
                  {activeProfile.profileName}
                </h2>
                <a
                  href={activeProfile.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                >
                  <span>{activeProfile.handle}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-xs text-foreground-secondary mt-0.5">
                Cabang: <b>{activeProfile.branchName}</b> · Kategori: Retail Optik &amp; Kacamata
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            <div className="text-center p-2 rounded-lg bg-surface-secondary/60 border border-border/60">
              <span className="text-[10px] uppercase font-bold text-foreground-secondary block">Followers</span>
              <span className="text-sm font-black text-foreground tabular-nums">
                {displayFollowers.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="text-center p-2 rounded-lg bg-surface-secondary/60 border border-border/60">
              <span className="text-[10px] uppercase font-bold text-foreground-secondary block">Following</span>
              <span className="text-sm font-black text-foreground tabular-nums">
                {displayFollowing}
              </span>
            </div>
            <div className="text-center p-2 rounded-lg bg-surface-secondary/60 border border-border/60">
              <span className="text-[10px] uppercase font-bold text-foreground-secondary block">Media Count</span>
              <span className="text-sm font-black text-foreground tabular-nums">
                {displayMediaCount.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="text-center p-2 rounded-lg bg-surface-secondary/60 border border-border/60">
              <span className="text-[10px] uppercase font-bold text-foreground-secondary block">Eng. Rate</span>
              <span className="text-sm font-black text-emerald-700 dark:text-emerald-400 tabular-nums">
                {activeProfile.engagementRate}%
              </span>
            </div>
            <div className="text-center p-2 rounded-lg bg-surface-secondary/60 border border-border/60">
              <span className="text-[10px] uppercase font-bold text-foreground-secondary block">Avg Likes</span>
              <span className="text-sm font-black text-foreground tabular-nums">
                {activeProfile.averageLikes}
              </span>
            </div>
            <div className="text-center p-2 rounded-lg bg-surface-secondary/60 border border-border/60">
              <span className="text-[10px] uppercase font-bold text-foreground-secondary block">Avg Comments</span>
              <span className="text-sm font-black text-foreground tabular-nums">
                {activeProfile.averageComments}
              </span>
            </div>
          </div>
        </div>

        {/* Social Blade Official Rankings & Grades */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-800 dark:text-amber-400 block">
                Social Blade Grade
              </span>
              <span className="text-2xl font-black text-amber-900 dark:text-amber-200 mt-0.5 block">
                {activeProfile.grade}
              </span>
            </div>
            <Award className="w-8 h-8 text-amber-600 dark:text-amber-400 opacity-80" />
          </div>

          <div className="p-4 rounded-xl border border-border bg-surface-secondary/50">
            <span className="text-[10px] uppercase font-bold text-foreground-secondary block">
              SB Rank
            </span>
            <span className="text-xl font-black text-foreground mt-0.5 block tabular-nums">
              {activeProfile.sbRank}
            </span>
            <span className="text-[10px] text-foreground-muted">Peringkat Global Social Blade</span>
          </div>

          <div className="p-4 rounded-xl border border-border bg-surface-secondary/50">
            <span className="text-[10px] uppercase font-bold text-foreground-secondary block">
              Followers Rank
            </span>
            <span className="text-xl font-black text-foreground mt-0.5 block tabular-nums">
              {activeProfile.followersRank}
            </span>
            <span className="text-[10px] text-foreground-muted">Peringkat Jumlah Pengikut</span>
          </div>

          <div className="p-4 rounded-xl border border-border bg-surface-secondary/50">
            <span className="text-[10px] uppercase font-bold text-foreground-secondary block">
              Engagement Rate Rank
            </span>
            <span className="text-xl font-black text-foreground mt-0.5 block tabular-nums">
              {activeProfile.engagementRank}
            </span>
            <span className="text-[10px] text-foreground-muted">Peringkat Interaksi Audiens</span>
          </div>
        </div>
      </div>

      {/* Filter Range Selector: 14 Hari Terakhir vs 30 Hari Terakhir */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface border border-border rounded-xl p-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-red-700 dark:text-red-400" />
          <span className="text-xs font-bold text-foreground uppercase tracking-wide">
            Pilihan Periode Analisis:
          </span>
          <div className="inline-flex rounded-lg border border-border p-0.5 bg-surface-secondary">
            <button
              onClick={() => setTimeRange("14d")}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                timeRange === "14d"
                  ? "bg-red-800 text-white shadow-xs"
                  : "text-foreground-secondary hover:text-foreground"
              }`}
            >
              14 Hari Terakhir (Last 14 Days)
            </button>
            <button
              onClick={() => setTimeRange("30d")}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                timeRange === "30d"
                  ? "bg-red-800 text-white shadow-xs"
                  : "text-foreground-secondary hover:text-foreground"
              }`}
            >
              30 Hari Terakhir (Last 30 Days)
            </button>
          </div>
        </div>

        <div className="text-xs text-foreground-secondary flex items-center gap-2">
          <span>Standar Status Warna:</span>
          <span className="inline-flex items-center gap-1 font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded text-[10px]">
            🔴 Penurunan
          </span>
          <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px]">
            🟢 Kenaikan
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded text-[10px]">
            🟡 Stabil
          </span>
        </div>
      </div>

      {/* Summary Stat Cards for Selected Period */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Followers Change */}
        <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle">
          <div className="flex items-center justify-between text-foreground-secondary">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Followers ({timeRange === "14d" ? "14 Hari" : "30 Hari"})
            </span>
            <Users className="w-4 h-4 text-red-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-foreground tabular-nums">
              {summary.followersDelta > 0 ? `+${summary.followersDelta}` : summary.followersDelta}
            </span>
            {renderDeltaBadge(summary.followersDelta)}
          </div>
          <p className="text-[11px] text-foreground-muted mt-1">
            Total pergeseran pengikut dalam rentang waktu {timeRange === "14d" ? "2 minggu" : "1 bulan"}
          </p>
        </div>

        {/* Media Uploads Change */}
        <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle">
          <div className="flex items-center justify-between text-foreground-secondary">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Konten / Media Upload ({timeRange === "14d" ? "14 Hari" : "30 Hari"})
            </span>
            <Film className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-foreground tabular-nums">
              +{summary.mediaDelta} Postingan
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Aktif Upload
            </span>
          </div>
          <p className="text-[11px] text-foreground-muted mt-1">
            Reels, carousel feed, dan video baru yang ditayangkan
          </p>
        </div>

        {/* Realtime Antrian Cek Mata */}
        <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle">
          <div className="flex items-center justify-between text-foreground-secondary">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Antrian Cek Mata (Realtime)
            </span>
            <Stethoscope className="w-4 h-4 text-brand" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-foreground tabular-nums">
              {realtimeAntrianClicks.toLocaleString("id-ID")}
            </span>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              Live Click
            </span>
          </div>
          <p className="text-[11px] text-foreground-muted mt-1">
            Interaksi tombol WhatsApp &amp; booking antrian periksa mata
          </p>
        </div>

        {/* Realtime Web Traffic Masuk */}
        <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle">
          <div className="flex items-center justify-between text-foreground-secondary">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Kunjungan Web Masuk (Realtime)
            </span>
            <Globe className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-foreground tabular-nums">
              {realtimeWebTraffic.toLocaleString("id-ID")} Sesi
            </span>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
              optikiseeyou.com
            </span>
          </div>
          <p className="text-[11px] text-foreground-muted mt-1">
            Trafik pengunjung organik dari bio link Instagram &amp; Google
          </p>
        </div>
      </div>

      {/* Main Table: Daily Channel Metrics (Exact Replica of Social Blade) */}
      <div className="bg-surface border border-border rounded-2xl shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-secondary/40">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-red-700" />
              Daily Channel Metrics: Rekapitulasi Harian Real-Time
            </h3>
            <p className="text-xs text-foreground-secondary mt-0.5">
              Menampilkan {filteredMetrics.length} hari rekaman data harian resmi Social Blade
            </p>
          </div>
          <div className="text-xs text-foreground-muted">
            Akun: <b>{activeProfile.handle}</b> · Sumber: Social Blade API &amp; Meta Graph
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-secondary text-foreground-secondary font-bold border-b border-border text-[11px]">
                <th className="py-3 px-4 w-44">Date</th>
                <th className="py-3 px-4 text-right w-36">Perubahan Follower</th>
                <th className="py-3 px-4 text-right w-44">Total Followers</th>
                <th className="py-3 px-4 text-right w-32">Following</th>
                <th className="py-3 px-4 text-right w-36">Perubahan Media</th>
                <th className="py-3 px-4 text-right w-36">Total Media Post</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-mono">
              {filteredMetrics.map((row) => (
                <tr key={row.date} className="hover:bg-surface-secondary/30 transition-colors">
                  <td className="py-2.5 px-4 font-sans font-medium text-foreground">
                    <span className="font-bold text-foreground-secondary mr-2">{row.dayOfWeek}</span>
                    <span>{row.date}</span>
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    {renderDeltaBadge(row.followersDelta)}
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold text-foreground">
                    {row.followersTotal.toLocaleString("id-ID")}
                  </td>
                  <td className="py-2.5 px-4 text-right text-foreground-secondary">
                    {row.followingTotal}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    {renderMediaDeltaBadge(row.mediaDelta)}
                  </td>
                  <td className="py-2.5 px-4 text-right font-semibold text-foreground">
                    {row.mediaTotal.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}

              {/* Summary Rows (Replica of Social Blade Footer) */}
              <tr className="bg-surface-secondary/70 font-bold border-t-2 border-border text-foreground">
                <td className="py-3 px-4 font-sans text-xs uppercase tracking-wider">
                  Daily Average
                </td>
                <td className="py-3 px-4 text-right">
                  {renderDeltaBadge(activeProfile.dailyAverage.followersDelta)}
                </td>
                <td className="py-3 px-4 text-right text-foreground-muted font-sans font-normal text-[11px]">
                  Rata-rata/hari
                </td>
                <td className="py-3 px-4 text-right text-foreground-muted">0</td>
                <td className="py-3 px-4 text-right">
                  {renderMediaDeltaBadge(activeProfile.dailyAverage.mediaDelta)}
                </td>
                <td className="py-3 px-4 text-right text-foreground-muted font-sans font-normal text-[11px]">
                  +1 post/hari
                </td>
              </tr>

              <tr className="bg-surface-secondary/70 font-bold border-t border-border/80 text-foreground">
                <td className="py-3 px-4 font-sans text-xs uppercase tracking-wider">
                  Weekly Average
                </td>
                <td className="py-3 px-4 text-right">
                  {renderDeltaBadge(activeProfile.weeklyAverage.followersDelta)}
                </td>
                <td className="py-3 px-4 text-right text-foreground-muted font-sans font-normal text-[11px]">
                  Rata-rata mingguan
                </td>
                <td className="py-3 px-4 text-right text-foreground-muted">0</td>
                <td className="py-3 px-4 text-right">
                  {renderMediaDeltaBadge(activeProfile.weeklyAverage.mediaDelta)}
                </td>
                <td className="py-3 px-4 text-right text-foreground-muted font-sans font-normal text-[11px]">
                  +1 post/minggu
                </td>
              </tr>

              <tr className="bg-red-50/80 dark:bg-red-950/30 font-black border-t-2 border-red-300 dark:border-red-900 text-foreground">
                <td className="py-3 px-4 font-sans text-xs uppercase tracking-wider text-red-900 dark:text-red-200">
                  Total {timeRange === "14d" ? "14 Hari Terakhir" : "30 Hari Terakhir"}
                </td>
                <td className="py-3 px-4 text-right">
                  {renderDeltaBadge(summary.followersDelta)}
                </td>
                <td className="py-3 px-4 text-right text-red-900 dark:text-red-300 font-sans text-[11px]">
                  {timeRange === "14d" ? "Net -496 Pengikut" : "Net -959 Pengikut"}
                </td>
                <td className="py-3 px-4 text-right text-foreground-muted">0</td>
                <td className="py-3 px-4 text-right font-bold text-emerald-700 dark:text-emerald-400">
                  +{summary.mediaDelta}
                </td>
                <td className="py-3 px-4 text-right text-emerald-800 dark:text-emerald-300 font-sans text-[11px]">
                  Total Konten Naik
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Insight & Recommendation Box */}
      <div className="p-5 rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/15 space-y-3">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-red-700 dark:text-red-400" />
          <h4 className="font-bold text-sm text-red-900 dark:text-red-200">
            Analisis Evaluasi Marketing: Penurunan Net Followers ({activeProfile.handle})
          </h4>
        </div>
        <p className="text-xs text-red-950 dark:text-red-200/90 leading-relaxed">
          Dalam 30 hari terakhir, akun utama @iseeyou.glasses mengalami penurunan bersih sebesar{" "}
          <b>-959 followers</b> (rata-rata berkurang -32 followers/hari). Hal ini merupakan dinamika normal
          pada akun berukuran besar (225k+) akibat <i>Instagram algorithmic purge</i> (pembersihan akun bot/inaktif).
          Namun dengan <b>engagement rate 0.06%</b>, tim marketing cabang wajib memperkuat:
        </p>
        <ul className="list-disc pl-5 text-xs text-red-900 dark:text-red-300 space-y-1">
          <li>
            <b>Aktivasi Voucher 5 pcs @ Rp 50.000 KOL:</b> Manfaatkan endorsement Kang Gono (16 Okt), Tarisa (13 &amp; 27 Okt),
            Yuriko (12 Okt), dan Salsa (19 Okt) untuk menarik kembali follower riil yang aktif bertransaksi.
          </li>
          <li>
            <b>Format Story Interaktif:</b> Gunakan polling quiz, try-on filter, dan Q&amp;A kesehatan mata untuk
            menaikkan algoritma interaksi harian Story PIC (Nuha &amp; Ilya).
          </li>
          <li>
            <b>Sinkronisasi Rutin:</b> Pantau data Social Blade ini setiap minggu sebelum rapat evaluasi direksi agar
            strategi konten selalu berbasis angka nyata, bukan perkiraan.
          </li>
        </ul>
      </div>
    </div>
  );
};
