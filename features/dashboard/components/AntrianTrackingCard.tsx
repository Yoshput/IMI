"use client";

import React, { useState, useEffect } from "react";
import {
  Stethoscope,
  TrendingUp,
  MapPin,
  Clock,
  Copy,
  CheckCircle2,
  Code2,
  ChevronDown,
  ChevronUp,
  Smartphone,
  ExternalLink,
  RefreshCw,
  Activity,
  Sparkles,
  Laptop,
  Tablet,
} from "lucide-react";
import { AntrianSummary, AntrianEvent } from "@/lib/antrian-tracking";

export const AntrianTrackingCard: React.FC = () => {
  const [stats, setStats] = useState<AntrianSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedToast, setSimulatedToast] = useState<string | null>(null);
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [showRecentClicks, setShowRecentClicks] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchStats = async (isBackground = false) => {
    if (!isBackground) setIsRefreshing(true);
    try {
      const res = await fetch("/api/track-event", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      const json = await res.json();
      if (json.success && json.data) {
        setStats(json.data);
      }
    } catch (e) {
      console.error("Gagal load tracking antrian:", e);
    } finally {
      setLoading(false);
      if (!isBackground) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Auto-polling interval: sinkron otomatis setiap 15 detik
    const timer = setInterval(() => {
      fetchStats(true);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const handleManualSync = async () => {
    setIsRefreshing(true);
    await fetchStats();
  };

  const handleSimulateClick = async (branchId: string = "pwt") => {
    setIsSimulating(true);
    try {
      const res = await fetch(`/api/track-event?action=simulate&branch=${branchId}`, {
        cache: "no-store",
      });
      const json = await res.json();
      if (json.success && json.data) {
        setStats(json.data);
        const branchNames: Record<string, string> = {
          pwt: "Purwokerto",
          clp: "Cilacap",
          pbg: "Purbalingga",
          wns: "Wonosobo",
        };
        setSimulatedToast(`+1 Klik Antrian Cek Mata tercatat untuk cabang ${branchNames[branchId] || branchId.toUpperCase()}!`);
        setTimeout(() => setSimulatedToast(null), 3500);
      }
    } catch (e) {
      console.error("Gagal simulasi:", e);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleCopy = () => {
    if (!stats?.embedSnippet) return;
    navigator.clipboard.writeText(stats.embedSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatEventTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin < 1) return "Baru saja";
      if (diffMin < 60) return `${diffMin} mnt lalu`;
      const diffHour = Math.floor(diffMin / 60);
      if (diffHour < 24) return `${diffHour} jam lalu`;
      return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    } catch {
      return "-";
    }
  };

  if (loading) {
    return (
      <div className="p-5 rounded-xl border border-border bg-surface shadow-subtle animate-pulse">
        <div className="h-4 w-40 bg-surface-secondary rounded mb-2" />
        <div className="h-8 w-24 bg-surface-secondary rounded" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-subtle space-y-4">
      {/* Toast Notifikasi Simulasi Real-Time */}
      {simulatedToast && (
        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500 animate-spin" />
            <span>{simulatedToast}</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-normal">Sinkron realtime</span>
        </div>
      )}

      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-bold text-foreground">
                Tracking Klik &quot;Antrian Cek Mata&quot;
              </h2>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                optikiseeyou.com
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE AUTO-SYNC
              </span>
            </div>
            <p className="text-[11px] text-foreground-muted flex items-center gap-1.5 mt-0.5">
              <span>Calon customer booking janji temu periksa mata 4 cabang.</span>
              {stats.lastSyncTimestamp && (
                <span className="text-[10px] text-foreground-secondary font-mono">
                  · Update: {stats.lastSyncTimestamp}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {/* Test Simulasi Klik (+1) Button */}
          <button
            onClick={() => handleSimulateClick("pwt")}
            disabled={isSimulating}
            title="Klik untuk mensimulasikan kunjungan/klik antrian dari optikiseeyou.com secara realtime"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-teal-500/30 bg-teal-500/10 text-xs font-semibold text-teal-700 dark:text-teal-300 hover:bg-teal-500/20 transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin" : ""}`} />
            <span>Test Klik (+1)</span>
          </button>

          {/* Manual Refresh Button */}
          <button
            onClick={handleManualSync}
            disabled={isRefreshing}
            title="Sinkronkan data live sekarang"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-surface-secondary text-xs font-semibold text-foreground-secondary hover:text-foreground transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-brand" : ""}`} />
            <span>{isRefreshing ? "Menyinkronkan..." : "Sinkronkan"}</span>
          </button>

          {/* Embed Script Toggle */}
          <button
            onClick={() => setShowEmbedCode(!showEmbedCode)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-surface-secondary text-xs font-semibold text-foreground-secondary hover:text-foreground transition-all"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Script</span>
            {showEmbedCode ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Embed Code Snippet Drawer */}
      {showEmbedCode && (
        <div className="p-3.5 rounded-lg bg-surface-secondary border border-border text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground text-[11px]">
              Snippet Javascript untuk optikiseeyou.com:
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] font-bold text-brand hover:underline"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Tersalin!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Salin Kode
                </>
              )}
            </button>
          </div>
          <pre className="p-2.5 rounded bg-foreground/5 dark:bg-black/40 overflow-x-auto text-[10px] font-mono text-foreground leading-relaxed">
            {stats.embedSnippet}
          </pre>
          <p className="text-[10px] text-foreground-muted">
            Pasang script ini di header atau footer landing page optikiseeyou.com agar setiap klik tombol &quot;Antrian Cek Mata&quot; otomatis tercatat di dashboard ini.
          </p>
        </div>
      )}

      {/* Headline Numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg border border-border bg-surface-secondary/40 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-foreground-muted block">Hari Ini</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-xl font-bold text-foreground tabular-nums mt-0.5">
            {stats.todayTotal} <span className="text-xs font-normal text-foreground-muted">klik</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
            +{stats.growthPercent}% vs rata-rata
          </span>
        </div>

        <div className="p-3 rounded-lg border border-border bg-surface-secondary/40">
          <span className="text-[10px] uppercase font-bold text-foreground-muted block">Minggu Ini</span>
          <div className="text-xl font-bold text-foreground tabular-nums mt-0.5">
            {stats.weeklyTotal} <span className="text-xs font-normal text-foreground-muted">klik</span>
          </div>
          <span className="text-[10px] text-foreground-muted block mt-0.5">
            ~{stats.averageDaily} klik/hari
          </span>
        </div>

        <div className="p-3 rounded-lg border border-border bg-surface-secondary/40">
          <span className="text-[10px] uppercase font-bold text-foreground-muted block">Bulan Ini (30 Hari)</span>
          <div className="text-xl font-bold text-foreground tabular-nums mt-0.5">
            {stats.monthlyTotal} <span className="text-xs font-normal text-foreground-muted">klik</span>
          </div>
          <span className="text-[10px] text-foreground-muted block mt-0.5">
            4 Cabang Terintegrasi
          </span>
        </div>

        <div className="p-3 rounded-lg border border-border bg-surface-secondary/40">
          <span className="text-[10px] uppercase font-bold text-foreground-muted block">Top Cabang</span>
          <div className="text-base font-bold text-foreground truncate mt-0.5">
            Purwokerto
          </div>
          <span className="text-[10px] text-teal-600 font-semibold block mt-0.5">
            42% total booking
          </span>
        </div>
      </div>

      {/* Breakdown per Cabang */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs font-bold text-foreground">
          <span>Breakdown Klik Antrian Per Cabang (Mingguan) - 4 Cabang Optik I See You:</span>
          <span className="text-[10px] font-normal text-foreground-muted">Total: {stats.weeklyTotal} klik</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {stats.branchStats.map((b) => (
            <div
              key={b.branchId}
              className="p-3 rounded-lg border border-border bg-surface-secondary/30 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">{b.city}</span>
                <span className="text-[10px] font-semibold text-emerald-600 tabular-nums">
                  {b.conversionRate}% Book
                </span>
              </div>
              <div className="text-lg font-bold text-foreground tabular-nums">
                {b.weeklyClicks} <span className="text-[10px] font-normal text-foreground-muted">klik</span>
              </div>
              <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full transition-all duration-300"
                  style={{ width: `${(b.weeklyClicks / (stats.weeklyTotal || 1)) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-foreground-muted pt-0.5">
                <span>Hari ini: <strong className="text-foreground">{b.todayClicks}</strong></span>
                <span>Bulan: <strong className="text-foreground">{b.monthlyClicks}</strong></span>
              </div>
            </div>
          ))}
        </div>

        {/* Live Event Stream / Recent Clicks Toggle */}
        <div className="pt-2 border-t border-border/60">
          <button
            onClick={() => setShowRecentClicks(!showRecentClicks)}
            className="flex items-center justify-between w-full text-xs font-semibold text-foreground-secondary hover:text-foreground transition-all py-1"
          >
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              <span>Log Live Klik Masuk ({stats.recentClicks.length} aktivitas terbaru)</span>
            </div>
            {showRecentClicks ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showRecentClicks && (
            <div className="mt-2 space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {stats.recentClicks.map((evt) => (
                <div
                  key={evt.id}
                  className="p-2 rounded-lg bg-surface-secondary/50 border border-border/70 flex items-center justify-between text-[11px] gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="font-semibold text-foreground truncate">
                      {evt.branchName}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface border border-border text-foreground-muted shrink-0">
                      {evt.type === "antrian_booking" ? "Booking Cek Mata" : evt.type?.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-foreground-muted shrink-0">
                    {evt.device === "desktop" ? (
                      <Laptop className="w-3 h-3" />
                    ) : (
                      <Smartphone className="w-3 h-3" />
                    )}
                    <span>{formatEventTime(evt.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-[10px] text-foreground-muted italic pt-1">
          * Catatan: Cabang Tegal beroperasi mandiri di bawah brand <strong>Lunar Eyewear</strong>, sehingga data web &amp; booking <code>optikiseeyou.com</code> hanya mencakup 4 cabang utama Optik I See You (Purwokerto, Cilacap, Purbalingga, Wonosobo).
        </p>
      </div>
    </div>
  );
};

