"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  TrendingUp,
  MousePointerClick,
  Eye,
  Percent,
  Compass,
  Smartphone,
  Laptop,
  Tablet,
  Globe,
  Loader2,
  Calendar,
} from "lucide-react";
import { GscReportData } from "@/lib/gsc";

export const GscClickReport: React.FC = () => {
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly">("weekly");
  const [report, setReport] = useState<GscReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGsc = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/gsc?timeframe=${timeframe}`);
        const json = await res.json();
        if (json.success && json.data) {
          setReport(json.data);
        }
      } catch (e) {
        console.error("Gagal load data GSC:", e);
      } finally {
        setLoading(false);
      }
    };
    loadGsc();
  }, [timeframe]);

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-subtle space-y-5">
      {/* Header with Title & Timeframe Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1">
              <Globe className="w-3 h-3" /> GOOGLE SEARCH CONSOLE
            </span>
            <span className="text-xs font-semibold text-foreground">
              optikiseeyou.com
            </span>
          </div>
          <h2 className="text-base font-bold text-foreground">
            Laporan Kunjungan & Klik Mesin Pencari Google
          </h2>
          <p className="text-xs text-foreground-muted">
            Analisis klik organik dari calon customer yang mencari kacamata & cek mata di Google Search.
          </p>
        </div>

        {/* Toggle Mingguan / Bulanan */}
        <div className="flex items-center p-1 bg-surface-secondary rounded-xl border border-border shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setTimeframe("weekly")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              timeframe === "weekly"
                ? "bg-foreground text-surface shadow-subtle"
                : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Mingguan (7 Hari)</span>
          </button>
          <button
            onClick={() => setTimeframe("monthly")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              timeframe === "monthly"
                ? "bg-foreground text-surface shadow-subtle"
                : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Bulanan (30 Hari)</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-foreground-muted text-xs gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-brand" />
          <span>Memuat data Search Console optikiseeyou.com...</span>
        </div>
      ) : report ? (
        <div className="space-y-5">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-border bg-surface-secondary/40">
              <div className="flex items-center justify-between text-foreground-muted mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Total Klik Google</span>
                <MousePointerClick className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <div className="text-xl font-bold text-foreground tabular-nums">
                {report.totalClicks.toLocaleString("id-ID")}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                +{report.deltaClicksPercent}% dibanding periode lalu
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-surface-secondary/40">
              <div className="flex items-center justify-between text-foreground-muted mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Total Tayangan (Impressions)</span>
                <Eye className="w-3.5 h-3.5 text-purple-500" />
              </div>
              <div className="text-xl font-bold text-foreground tabular-nums">
                {report.totalImpressions.toLocaleString("id-ID")}
              </div>
              <span className="text-[10px] text-foreground-muted mt-0.5 block">
                Tampil di hasil pencarian
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-surface-secondary/40">
              <div className="flex items-center justify-between text-foreground-muted mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Rata-rata CTR</span>
                <Percent className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="text-xl font-bold text-foreground tabular-nums">
                {report.averageCtr}%
              </div>
              <span className="text-[10px] text-foreground-muted mt-0.5 block">
                Rasio klik per tayangan
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-surface-secondary/40">
              <div className="flex items-center justify-between text-foreground-muted mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Posisi Rata-rata</span>
                <Compass className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="text-xl font-bold text-foreground tabular-nums">
                #{report.averagePosition}
              </div>
              <span className="text-[10px] text-foreground-muted mt-0.5 block">
                Halaman 1 Google Search
              </span>
            </div>
          </div>

          {/* Breakdown Section: Asal Wilayah / Lokasi Klik & Device */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Lokasi Asal Klik (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand" />
                  Asal Wilayah / Lokasi Pencari Kacamata
                </h3>
                <span className="text-[10px] text-foreground-muted">Berdasarkan data ISP / Region</span>
              </div>

              <div className="space-y-2">
                {report.locations.map((loc, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border border-border bg-surface-secondary/30 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-foreground font-semibold">{loc.location}</span>
                      <div className="flex items-center gap-2 text-[11px] tabular-nums">
                        <span className="font-bold text-foreground">
                          {loc.clicks.toLocaleString("id-ID")} klik
                        </span>
                        <span className="text-foreground-muted">({loc.percentage}%)</span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                      <div
                        className="h-full bg-brand rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, loc.percentage * 1.8)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-foreground-muted pt-0.5">
                      <span>{loc.impressions.toLocaleString("id-ID")} impresi</span>
                      <span>CTR: {loc.ctr}% · Posisi: #{loc.position}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-foreground-muted italic pt-1">
                * Wilayah pencarian mencakup 4 cabang utama Optik I See You (Purwokerto, Cilacap, Purbalingga, Wonosobo) &amp; daerah penyangga sekitar. Cabang Tegal beroperasi di bawah brand <strong>Lunar Eyewear</strong> dan tidak diarahkan ke domain <code>optikiseeyou.com</code>.
              </p>
            </div>

            {/* Device Breakdown & Top Keyword Highlights (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-3.5 rounded-xl border border-border bg-surface-secondary/30 space-y-2.5">
                <h3 className="text-xs font-bold text-foreground">Distribusi Perangkat Pengguna</h3>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-surface border border-border">
                    <Smartphone className="w-4 h-4 mx-auto text-foreground-muted mb-1" />
                    <span className="text-[10px] text-foreground-muted block">Mobile HP</span>
                    <span className="font-bold text-foreground">{report.deviceBreakdown.mobile}%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-surface border border-border">
                    <Laptop className="w-4 h-4 mx-auto text-foreground-muted mb-1" />
                    <span className="text-[10px] text-foreground-muted block">Desktop</span>
                    <span className="font-bold text-foreground">{report.deviceBreakdown.desktop}%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-surface border border-border">
                    <Tablet className="w-4 h-4 mx-auto text-foreground-muted mb-1" />
                    <span className="text-[10px] text-foreground-muted block">Tablet</span>
                    <span className="font-bold text-foreground">{report.deviceBreakdown.tablet}%</span>
                  </div>
                </div>
                <p className="text-[10px] text-foreground-muted leading-relaxed">
                  *Mayoritas ({report.deviceBreakdown.mobile}%) pencarian dilakukan via smartphone, menunjukkan pentingnya kecepatan mobile web optikiseeyou.com.
                </p>
              </div>

              {/* Provenance Footer */}
              <div className="p-3 rounded-lg border border-border/80 bg-surface text-[11px] space-y-1 text-foreground-muted">
                <div className="flex items-center justify-between font-semibold text-foreground">
                  <span>Sumber Data:</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-secondary border border-border">
                    {report.domain}
                  </span>
                </div>
                <p className="text-[10px] leading-relaxed">
                  {report.sourceLabel}
                </p>
              </div>
            </div>
          </div>

          {/* Top Keyword Queries Table */}
          <div className="space-y-2 pt-2 border-t border-border">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-blue-500" />
              Kata Kunci Paling Banyak Mendatangkan Klik (Top Queries)
            </h3>
            <div className="overflow-x-auto border border-border rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-secondary text-foreground-secondary border-b border-border text-[10px] uppercase font-semibold">
                  <tr>
                    <th className="py-2 px-3">Kata Kunci Google</th>
                    <th className="py-2 px-3 text-right">Jumlah Klik</th>
                    <th className="py-2 px-3 text-right">Tayangan</th>
                    <th className="py-2 px-3 text-right">CTR</th>
                    <th className="py-2 px-3 text-right">Ranking Google</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {report.topQueries.map((q, idx) => (
                    <tr key={idx} className="hover:bg-surface-secondary/40 transition-colors">
                      <td className="py-2 px-3 font-medium text-foreground">
                        &quot;{q.query}&quot;
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-foreground tabular-nums">
                        {q.clicks}
                      </td>
                      <td className="py-2 px-3 text-right text-foreground-muted tabular-nums">
                        {q.impressions.toLocaleString("id-ID")}
                      </td>
                      <td className="py-2 px-3 text-right text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">
                        {q.ctr}%
                      </td>
                      <td className="py-2 px-3 text-right font-semibold text-foreground tabular-nums">
                        #{q.position}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
