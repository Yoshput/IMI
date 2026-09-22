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
} from "lucide-react";
import { AntrianSummary } from "@/lib/antrian-tracking";

export const AntrianTrackingCard: React.FC = () => {
  const [stats, setStats] = useState<AntrianSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/track-event");
        const json = await res.json();
        if (json.success && json.data) {
          setStats(json.data);
        }
      } catch (e) {
        console.error("Gagal load tracking antrian:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleCopy = () => {
    if (!stats?.embedSnippet) return;
    navigator.clipboard.writeText(stats.embedSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-foreground">
                Tracking Klik &quot;Antrian Cek Mata&quot;
              </h2>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                optikiseeyou.com
              </span>
            </div>
            <p className="text-[11px] text-foreground-muted">
              Monitoring calon customer yang menekan tombol janji temu periksa mata & booking kacamata.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowEmbedCode(!showEmbedCode)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface-secondary text-xs font-semibold text-foreground-secondary hover:text-foreground transition-all self-start sm:self-auto"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Script Tracking Web</span>
          {showEmbedCode ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
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
        <div className="p-3 rounded-lg border border-border bg-surface-secondary/40">
          <span className="text-[10px] uppercase font-bold text-foreground-muted block">Hari Ini</span>
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
            Estimasi 62% reservasi
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
          <span>Breakdown Klik Antrian Per Cabang (Mingguan):</span>
          <span className="text-[10px] font-normal text-foreground-muted">Total: {stats.weeklyTotal} klik</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
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
                  className="h-full bg-teal-500 rounded-full"
                  style={{ width: `${(b.weeklyClicks / stats.weeklyTotal) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-foreground-muted pt-0.5">
                <span>Hari ini: {b.todayClicks}</span>
                <span>Bulan: {b.monthlyClicks}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
