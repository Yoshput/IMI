"use client";

import React, { useState, useMemo } from "react";
import {
  Package,
  Calendar,
  MapPin,
  User,
  Search,
  RefreshCw,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Clock,
  Filter,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Layers,
  LayoutGrid,
  Table as TableIcon,
  HelpCircle,
  Lightbulb,
} from "lucide-react";

export interface FormPengajuanItem {
  id: string;
  timestamp: string;
  branch: string;
  applicantName: string;
  requestedItems: string;
  purpose: string;
}

interface FormPengajuanTableProps {
  items: FormPengajuanItem[];
  onSync?: () => Promise<void> | void;
  isSyncing?: boolean;
}

export const FormPengajuanTable: React.FC<FormPengajuanTableProps> = ({
  items = [],
  onSync,
  isSyncing = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sheetUrl =
    "https://docs.google.com/spreadsheets/d/1BU0fIDP656Y-eue55bWVSxeaixSeFJwR3GP1n8kwBYc/edit?gid=2110946595#gid=2110946595";

  // Clean applicant names to remove prefixes
  const cleanName = (name: string) => {
    return (name || "").replace(/^(Mba|Mas|Pak|Bu|Kak)\s+/i, "").trim();
  };

  // Branch badge styling
  const getBranchBadge = (branch: string) => {
    const b = (branch || "").toLowerCase();
    if (b.includes("wonosobo") || b.includes("wns")) {
      return {
        bg: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
        dot: "bg-purple-500",
        label: "Wonosobo",
      };
    }
    if (b.includes("purbalingga") || b.includes("pbg")) {
      return {
        bg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
        dot: "bg-emerald-500",
        label: "Purbalingga",
      };
    }
    if (b.includes("cilacap") || b.includes("clp")) {
      return {
        bg: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20",
        dot: "bg-cyan-500",
        label: "Cilacap",
      };
    }
    if (b.includes("tegal") || b.includes("lunar") || b.includes("tgl")) {
      return {
        bg: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
        dot: "bg-amber-500",
        label: "Lunar Tegal",
      };
    }
    return {
      bg: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
      dot: "bg-blue-500",
      label: "Purwokerto",
    };
  };

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        item.requestedItems.toLowerCase().includes(q) ||
        item.purpose.toLowerCase().includes(q) ||
        item.applicantName.toLowerCase().includes(q) ||
        item.branch.toLowerCase().includes(q);

      const matchBranch =
        selectedBranch === "all" ||
        item.branch.toLowerCase().includes(selectedBranch.toLowerCase());

      return matchSearch && matchBranch;
    });
  }, [items, searchQuery, selectedBranch]);

  const branches = useMemo(() => {
    const list = Array.from(new Set(items.map((i) => i.branch).filter(Boolean)));
    return list;
  }, [items]);

  const handleCopy = (item: FormPengajuanItem) => {
    const text = `[Pengajuan Alat Cabang ${item.branch}]\nPengaju: ${cleanName(item.applicantName)}\nBarang: ${item.requestedItems}\nAlasan: ${item.purpose}\nTanggal: ${item.timestamp}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card with Apple iOS Aesthetics */}
      <div className="relative overflow-hidden rounded-3xl bg-surface border border-border/80 p-6 md:p-8 shadow-subtle backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 text-brand border border-brand/20 text-xs font-bold tracking-tight">
                <Package className="w-3.5 h-3.5" />
                Form Pengajuan Alat & Logistik
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Auto-Sync Aktif
              </span>
              <span className="text-xs text-foreground-muted">
                Tab ID: <code className="font-mono text-foreground font-semibold">gid=2110946595</code>
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                Daftar Pengajuan Kebutuhan Alat & Konten Cabang
              </h2>
              <p className="text-xs sm:text-sm text-foreground-secondary mt-1 max-w-2xl leading-relaxed">
                Terkoneksi langsung secara otomatis dengan lembar Google Sheets <strong>Form Pengajuan</strong>. Setiap input baru dari tim konten (Lighting, mic, tripod, dsb) akan otomatis tersinkronisasi dan siap dipresentasikan pada meeting mingguan.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {onSync && (
              <button
                onClick={onSync}
                disabled={isSyncing}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-foreground text-surface text-xs font-bold hover:bg-foreground/90 transition-all shadow-subtle disabled:opacity-50 active:scale-95"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                <span>{isSyncing ? "Menyinkronkan..." : "Cek Input Baru"}</span>
              </button>
            )}

            <a
              href={sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border/80 bg-surface-secondary/70 hover:bg-surface-secondary text-xs font-semibold text-foreground transition-all shadow-subtle hover:border-brand/40 active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
              <span>Input / Buka di Google Sheets</span>
            </a>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-border/60">
          <div className="p-3.5 rounded-2xl bg-surface-secondary/50 border border-border/50">
            <span className="text-[11px] font-medium text-foreground-muted block">Total Pengajuan</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-foreground">{items.length}</span>
              <span className="text-xs text-foreground-secondary">Permintaan</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-secondary/50 border border-border/50">
            <span className="text-[11px] font-medium text-foreground-muted block">Cabang Mengajukan</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-foreground">{branches.length || 1}</span>
              <span className="text-xs text-foreground-secondary">Cabang Aktif</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-secondary/50 border border-border/50">
            <span className="text-[11px] font-medium text-foreground-muted block">Prioritas Utama</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-base font-bold text-amber-600 dark:text-amber-400 truncate">Lighting Konten</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-secondary/50 border border-border/50">
            <span className="text-[11px] font-medium text-foreground-muted block">Status Review</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                Agenda Meeting Selasa
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-foreground-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari barang, pengaju, atau cabang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-surface border border-border text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand/40 transition-all"
            />
          </div>

          {branches.length > 1 && (
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-3.5 py-2 rounded-full bg-surface border border-border text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
            >
              <option value="all">Semua Cabang</option>
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* View Switcher (Cards / Table) */}
        <div className="flex items-center gap-1 bg-surface border border-border rounded-full p-1 self-end sm:self-auto shrink-0">
          <button
            onClick={() => setViewMode("cards")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              viewMode === "cards"
                ? "bg-foreground text-surface shadow-subtle"
                : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Kartu</span>
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              viewMode === "table"
                ? "bg-foreground text-surface shadow-subtle"
                : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Tabel</span>
          </button>
        </div>
      </div>

      {/* Items Rendering */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 rounded-3xl bg-surface border border-dashed border-border p-8">
          <Package className="w-12 h-12 text-foreground-muted mx-auto mb-3 opacity-50" />
          <h3 className="text-sm font-bold text-foreground">Belum ada pengajuan alat yang cocok</h3>
          <p className="text-xs text-foreground-secondary mt-1 max-w-sm mx-auto">
            Gunakan Google Sheets untuk menginput pengajuan alat baru, atau ubah kata kunci pencarian Anda.
          </p>
          <a
            href={sheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-brand text-white text-xs font-bold hover:bg-brand/90 transition-all shadow-subtle"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Input Pengajuan di Google Sheets</span>
          </a>
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const badge = getBranchBadge(item.branch);
            const isExpanded = expandedId === item.id;
            const applicant = cleanName(item.applicantName);

            return (
              <div
                key={item.id}
                className="rounded-3xl bg-surface border border-border/80 p-5 shadow-subtle hover:shadow-elevated hover:border-brand/30 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        {item.branch}
                      </span>
                      <span className="text-[11px] font-semibold text-foreground-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.timestamp || "Baru saja"}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(item)}
                      className="p-1.5 rounded-full hover:bg-surface-secondary text-foreground-muted hover:text-foreground transition-colors"
                      title="Salin rincian pengajuan"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Requested Item Banner */}
                  <div className="mt-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-brand/10 text-brand flex items-center justify-center shrink-0 border border-brand/20 shadow-subtle">
                      <Lightbulb className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] uppercase font-extrabold tracking-wider text-brand block">
                        Alat / Barang yang Diajukan
                      </span>
                      <h4 className="text-base font-bold text-foreground tracking-tight leading-snug mt-0.5">
                        {item.requestedItems}
                      </h4>
                    </div>
                  </div>

                  {/* Applicant Info Pill */}
                  <div className="mt-3 flex items-center gap-2 text-xs text-foreground-secondary">
                    <div className="w-5 h-5 rounded-full bg-surface-secondary border border-border flex items-center justify-center font-bold text-[10px] text-foreground">
                      {applicant.slice(0, 1).toUpperCase()}
                    </div>
                    <span className="font-semibold text-foreground">Pengaju: {applicant}</span>
                    <span className="text-foreground-muted">· Tim Konten Cabang</span>
                  </div>

                  {/* Purpose / Rationale Box */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-surface-secondary/70 border border-border/60 text-xs text-foreground-secondary leading-relaxed relative">
                    <div className="text-[10px] font-bold text-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                      <span>Tujuan & Urgensi Kebutuhan:</span>
                    </div>
                    <p className={`italic ${!isExpanded && item.purpose.length > 140 ? "line-clamp-3" : ""}`}>
                      &ldquo;{item.purpose}&rdquo;
                    </p>
                    {item.purpose.length > 140 && (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="text-[11px] font-bold text-brand hover:underline mt-1.5 flex items-center gap-0.5"
                      >
                        <span>{isExpanded ? "Tutup rincian" : "Baca selengkapnya"}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Card Footer Status */}
                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Terdaftar di Spreadsheet</span>
                  </div>

                  <a
                    href={sheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-foreground hover:text-brand inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Cek di Sheet</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-3xl bg-surface border border-border overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-secondary/60 border-b border-border text-foreground-muted font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Cabang</th>
                  <th className="py-3 px-4">Pengaju</th>
                  <th className="py-3 px-4">Barang / Jumlah</th>
                  <th className="py-3 px-4 min-w-[320px]">Tujuan & Urgensi</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredItems.map((item) => {
                  const badge = getBranchBadge(item.branch);
                  const applicant = cleanName(item.applicantName);

                  return (
                    <tr key={item.id} className="hover:bg-surface-secondary/30 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap text-foreground-muted font-medium">
                        {item.timestamp || "-"}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {item.branch}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-bold text-foreground">
                        {applicant}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-brand">
                        {item.requestedItems}
                      </td>
                      <td className="py-3.5 px-4 text-foreground-secondary leading-relaxed">
                        {item.purpose}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleCopy(item)}
                          className="p-1.5 rounded-full hover:bg-surface-secondary text-foreground-muted hover:text-foreground transition-colors mr-1"
                          title="Salin Rincian"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <a
                          href={sheetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-full hover:bg-surface-secondary text-foreground-muted hover:text-foreground inline-flex items-center transition-colors"
                          title="Buka Google Sheet"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
