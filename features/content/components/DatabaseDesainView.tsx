"use client";

import React, { useState, useMemo, useEffect } from "react";
import defaultData from "@/lib/real-sheets-data.json";
import { DesignDatabaseItem } from "@/types";
import { downloadCSV } from "@/lib/export-csv";
import {
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  Download,
  Calendar,
  User,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Layers,
  Sparkles,
} from "lucide-react";

interface DatabaseDesainViewProps {
  initialItems?: DesignDatabaseItem[];
}

export const DatabaseDesainView: React.FC<DatabaseDesainViewProps> = ({ initialItems }) => {
  // Use initialItems or fall back to defaultData.databaseDesain
  const [items, setItems] = useState<DesignDatabaseItem[]>(() => {
    if (initialItems && initialItems.length > 0) return initialItems;
    if (defaultData && Array.isArray((defaultData as any).databaseDesain)) {
      return (defaultData as any).databaseDesain;
    }
    return [];
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPic, setSelectedPic] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Fetch live sheets data on mount
  const fetchLiveDesigns = async (forceFresh = false) => {
    try {
      const url = forceFresh ? "/api/sync-sheets?fresh=true" : "/api/sync-sheets";
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && json.data && Array.isArray(json.data.databaseDesain)) {
        setItems(json.data.databaseDesain);
        const timeStr = new Date().toLocaleTimeString("id-ID");
        setLastSyncTime(timeStr);
        return json.data.databaseDesain.length;
      }
    } catch (err: any) {
      console.warn("Could not fetch live designs:", err);
    }
    return 0;
  };

  useEffect(() => {
    fetchLiveDesigns();
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    setSyncError(null);
    try {
      const count = await fetchLiveDesigns(true);
      const timeStr = new Date().toLocaleTimeString("id-ID");
      setSyncStatus(`Database Desain berhasil disinkronkan (${count} entri dari Google Sheets). Update: ${timeStr} WIB`);
      setTimeout(() => setSyncStatus(null), 5000);
    } catch (err: any) {
      setSyncError(`Gagal sinkronisasi: ${err.message}`);
      setTimeout(() => setSyncError(null), 5000);
    } finally {
      setIsSyncing(false);
    }
  };

  // Distinct PICs for filter
  const picList = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((it) => {
      const p = it.pic || it.creator || "Lainnya";
      counts[p] = (counts[p] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [items]);

  // Distinct Months for filter
  const monthList = useMemo(() => {
    const setM = new Set<string>();
    items.forEach((it) => {
      if (it.date) {
        const parts = it.date.split("/");
        if (parts.length >= 3) {
          const m = parts[0];
          const y = parts[2];
          setM.add(`${m}/${y}`);
        }
      }
    });
    return Array.from(setM).sort((a, b) => b.localeCompare(a));
  }, [items]);

  // Format month label
  const formatMonthLabel = (my: string) => {
    const [m, y] = my.split("/");
    const monthNames = [
      "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const idx = parseInt(m, 10);
    return `${monthNames[idx] || m} ${y}`;
  };

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (it) =>
          (it.designName || it.designTitle || "").toLowerCase().includes(q) ||
          (it.pic || it.creator || "").toLowerCase().includes(q) ||
          (it.date || "").toLowerCase().includes(q)
      );
    }

    // PIC filter
    if (selectedPic !== "all") {
      result = result.filter(
        (it) => (it.pic || it.creator || "").toLowerCase() === selectedPic.toLowerCase()
      );
    }

    // Month filter
    if (selectedMonth !== "all") {
      result = result.filter((it) => {
        if (!it.date) return false;
        const parts = it.date.split("/");
        if (parts.length >= 3) {
          return `${parts[0]}/${parts[2]}` === selectedMonth;
        }
        return false;
      });
    }

    // Sort order (by index or date)
    result.sort((a, b) => {
      const timeA = new Date(a.timestamp || a.date).getTime() || 0;
      const timeB = new Date(b.timestamp || b.date).getTime() || 0;
      return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [items, searchQuery, selectedPic, selectedMonth, sortOrder]);

  // Summary Metrics
  const summary = useMemo(() => {
    const total = items.length;
    const yanuarCount = items.filter(
      (it) => (it.pic || it.creator || "").toLowerCase().includes("yanuar")
    ).length;
    const octoberCount = items.filter((it) => {
      const d = it.date || it.timestamp || "";
      return d.startsWith("10/") || d.includes("/10/") || d.includes("2026-10");
    }).length;

    // latest design entry
    const latestItem = items.length > 0 ? items[items.length - 1] : null;

    return {
      total,
      yanuarCount,
      octoberCount,
      latestItem,
    };
  }, [items]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["No", "Cap Waktu (Timestamp)", "Tanggal", "Penginput (PIC)", "Nama Desain", "URL File Google Drive"];
    const rows = filteredItems.map((it, idx) => [
      idx + 1,
      it.timestamp || "-",
      it.date || "-",
      it.pic || it.creator || "-",
      it.designName || it.designTitle || "-",
      it.fileUrl || "-",
    ]);
    downloadCSV(`database-desain-yanuar-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  // Helper to parse fileUrl which may be multiple comma-separated URLs
  const renderFileLinks = (rawUrl: string) => {
    if (!rawUrl || rawUrl === "-") {
      return <span className="text-foreground-muted text-xs italic">Tidak ada file</span>;
    }
    const urls = rawUrl
      .split(",")
      .map((u) => u.trim())
      .filter((u) => u.startsWith("http"));

    if (urls.length === 0) {
      return <span className="text-foreground-muted text-xs italic">Format URL tidak valid</span>;
    }

    return (
      <div className="flex flex-wrap items-center gap-1.5">
        {urls.map((u, i) => (
          <a
            key={i}
            href={u}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 transition-colors"
            title={`Buka file ${i + 1} di Google Drive: ${u}`}
          >
            <ExternalLink className="w-2.5 h-2.5" />
            <span>{urls.length > 1 ? `File ${i + 1}` : "Buka File"}</span>
          </a>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-surface shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-brand/10 text-brand border border-brand/20">
              <Layers className="w-3 h-3 text-brand" />
              Database Desain Grafis &amp; Materi Cetak
            </span>
            <span className="text-xs text-foreground-muted">
              Source: Sheet &quot;Database Desain&quot; (Form_Responses6)
            </span>
          </div>
          <p className="text-xs text-foreground-secondary mt-1">
            Log berkas desain promosi, pricelist lensa, voucher, kartu garansi, lanyard, dan materi cetak resmi Optik I See You &amp; Lunar Eyewear yang diinput oleh Mas Yanuar dan tim desainer.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleManualSync}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#124734] hover:bg-[#0E3829] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs active:scale-95 disabled:opacity-60 cursor-pointer"
            title="Sinkronkan data desain langsung dari Google Sheets"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-white ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Menyinkronkan..." : "Sinkronkan Spreadsheet"}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface border border-border text-foreground font-semibold text-xs hover:bg-surface-secondary hover:text-brand hover:border-brand/40 transition-all shadow-2xs active:scale-95 cursor-pointer"
            title="Unduh data tabel desain dalam format .csv"
          >
            <Download className="w-3.5 h-3.5 text-brand" />
            <span>Export CSV</span>
          </button>

          <a
            href="https://docs.google.com/spreadsheets/d/1BU0fIDP656Y-eue55bWVSxeaixSeFJwR3GP1n8kwBYc/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface border border-border text-foreground font-semibold text-xs hover:bg-surface-secondary hover:text-brand hover:border-brand/40 transition-all shadow-2xs"
            title="Buka spreadsheet asli di Google Sheets"
          >
            <ExternalLink className="w-3.5 h-3.5 text-brand" />
            <span className="hidden sm:inline">Google Sheets</span>
          </a>
        </div>
      </div>

      {/* Sync Status Notifications */}
      {syncStatus && (
        <div className="p-3 rounded-lg bg-status-successBg border border-status-success/30 text-status-success text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{syncStatus}</span>
        </div>
      )}
      {syncError && (
        <div className="p-3 rounded-lg bg-status-errorBg border border-status-error/30 text-status-error text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{syncError}</span>
        </div>
      )}

      {/* KPI Metric Strip (High Density & Anti-Slop) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-border bg-surface">
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted block mb-0.5">
            Total Desain Terdata
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-foreground tabular-nums">
              {summary.total}
            </span>
            <span className="text-xs font-medium text-foreground-secondary">berkas</span>
          </div>
          <p className="text-[11px] text-foreground-muted mt-1">
            Terarsip sejak Juni s.d. Oktober 2026
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-border bg-surface">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block mb-0.5">
            Desain Mas Yanuar (Lead)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-300 tabular-nums">
              {summary.yanuarCount}
            </span>
            <span className="text-xs font-medium text-foreground-secondary">
              ({Math.round((summary.yanuarCount / (summary.total || 1)) * 100)}% total)
            </span>
          </div>
          <p className="text-[11px] text-foreground-muted mt-1">
            Pricelist, packaging, voucher &amp; cetak
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-border bg-surface">
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted block mb-0.5">
            Produksi Bulan Ini (Okt 2026)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-foreground tabular-nums">
              {summary.octoberCount}
            </span>
            <span className="text-xs font-medium text-foreground-secondary">desain</span>
          </div>
          <p className="text-[11px] text-foreground-muted mt-1">
            Aset materi promosi &amp; operasional gerai
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-border bg-surface">
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted block mb-0.5">
            Pembaruan Terakhir
          </span>
          <p className="text-xs font-bold text-foreground truncate" title={summary.latestItem?.designName || "-"}>
            {summary.latestItem?.designName || "-"}
          </p>
          <p className="text-[11px] text-foreground-secondary mt-0.5">
            {summary.latestItem?.date ? `Tgl: ${summary.latestItem.date}` : ""} · Oleh: {summary.latestItem?.pic || "-"}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-xl border border-border bg-surface space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama desain, penginput (Yanuar, Dimas), atau tanggal..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-foreground-muted hover:text-foreground"
              >
                &times;
              </button>
            )}
          </div>

          {/* Secondary Select Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Bulan */}
            <div className="flex items-center gap-1.5 text-xs text-foreground-secondary">
              <Calendar className="w-3.5 h-3.5 text-foreground-muted" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-brand font-medium"
              >
                <option value="all">Semua Bulan</option>
                {monthList.map((m) => (
                  <option key={m} value={m}>
                    {formatMonthLabel(m)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div className="flex items-center gap-1.5 text-xs text-foreground-secondary">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "desc" | "asc")}
                className="px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-brand font-medium"
              >
                <option value="desc">Urutkan: Terbaru ke Terlama</option>
                <option value="asc">Urutkan: Terlama ke Terbaru</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Filter PIC Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-border/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted mr-1">
            Filter Penginput:
          </span>
          <button
            type="button"
            onClick={() => setSelectedPic("all")}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              selectedPic === "all"
                ? "bg-foreground text-background"
                : "bg-surface-secondary text-foreground hover:bg-surface-tertiary"
            }`}
          >
            Semua PIC ({items.length})
          </button>
          {picList.map(([picName, count]) => (
            <button
              key={picName}
              type="button"
              onClick={() => setSelectedPic(picName)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                selectedPic.toLowerCase() === picName.toLowerCase()
                  ? "bg-brand text-white"
                  : "bg-surface-secondary text-foreground hover:bg-surface-tertiary"
              }`}
            >
              {picName} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Main Table View */}
      <div className="border border-border rounded-xl bg-surface overflow-hidden shadow-2xs">
        <div className="p-3 border-b border-border bg-surface-secondary flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand" />
            <span className="text-xs font-bold text-foreground uppercase tracking-wider">
              Tabel Berkas &amp; Tautan Desain
            </span>
            <span className="text-xs font-normal text-foreground-muted">
              ({filteredItems.length} dari {items.length} arsip)
            </span>
          </div>
          {lastSyncTime && (
            <span className="text-[11px] text-foreground-muted">
              Terakhir diperbarui: {lastSyncTime} WIB
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-tertiary/40 text-[11px] font-bold text-foreground-secondary uppercase tracking-wider">
                <th className="py-2.5 px-3 w-12 text-center">No</th>
                <th className="py-2.5 px-3 w-40">Tanggal &amp; Waktu</th>
                <th className="py-2.5 px-3 w-32">Penginput (PIC)</th>
                <th className="py-2.5 px-4">Nama Desain &amp; Keterangan Revisi</th>
                <th className="py-2.5 px-4 w-44">Tautan Google Drive</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-foreground-muted">
                    <p className="font-semibold text-sm">Tidak Ada Desain yang Cocok</p>
                    <p className="text-xs mt-1">
                      Coba ubah kata kunci pencarian atau reset filter PIC dan bulan.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedPic("all");
                        setSelectedMonth("all");
                      }}
                      className="mt-3 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold text-brand hover:bg-surface-secondary"
                    >
                      Reset Filter
                    </button>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  const picStr = item.pic || item.creator || "-";
                  const isYanuar = picStr.toLowerCase().includes("yanuar");
                  const designTitle = item.designName || item.designTitle || "-";
                  const isRevision =
                    designTitle.toLowerCase().includes("revisi") ||
                    designTitle.toLowerCase().includes("new") ||
                    designTitle.toLowerCase().includes("print ready");

                  return (
                    <tr
                      key={item.id || idx}
                      className="hover:bg-surface-secondary/60 transition-colors"
                    >
                      <td className="py-2.5 px-3 text-center text-foreground-muted font-mono text-[11px]">
                        {idx + 1}
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-foreground text-xs">
                          {item.date || "-"}
                        </div>
                        <div className="text-[10px] text-foreground-muted font-mono">
                          {item.timestamp || "-"}
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                            isYanuar
                              ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800"
                              : "bg-surface-secondary text-foreground-secondary border border-border"
                          }`}
                        >
                          <User className="w-2.5 h-2.5" />
                          <span>{picStr}</span>
                        </span>
                      </td>

                      <td className="py-2.5 px-4">
                        <div className="flex items-start gap-1.5">
                          <span className="font-semibold text-foreground text-xs leading-snug">
                            {designTitle}
                          </span>
                          {isRevision && (
                            <span className="inline-flex shrink-0 items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                              Revisi / Ready
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-2.5 px-4">
                        {renderFileLinks(item.fileUrl)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
