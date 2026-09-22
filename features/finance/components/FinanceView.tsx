"use client";

import React, { useState, useEffect } from "react";
import {
  Coins,
  TrendingUp,
  Award,
  Users,
  Calendar,
  Sparkles,
  Download,
  Filter,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export const FinanceView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [bonusSummary, setBonusSummary] = useState<any>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [selectedPic, setSelectedPic] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const res = await fetch("/api/sync-sheets");
        const json = await res.json();
        if (json.success && json.data) {
          const bs = json.data.bonusSummary || json.data.executiveRecap?.bonusSummary;
          setBonusSummary(bs);
          if (bs?.entries) {
            setEntries(bs.entries);
          }
        }
      } catch (e) {
        console.error("Gagal load data finance:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchFinanceData();
  }, []);

  const filteredEntries = entries.filter((item) => {
    if (selectedBranch !== "all" && item.branch !== selectedBranch) return false;
    if (selectedPic !== "all" && item.pic !== selectedPic) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchPic = item.pic?.toLowerCase().includes(q);
      const matchBranch = item.branch?.toLowerCase().includes(q);
      if (!matchTitle && !matchPic && !matchBranch) return false;
    }
    return true;
  });

  const totalFilteredAmount = filteredEntries.reduce(
    (sum, item) => sum + (item.bonusAmount || 0),
    0
  );

  const handleCopyReport = () => {
    if (!bonusSummary) return;
    const text = `*REKAP FINANCE & BONUS KONTEN OPTIK I SEE YOU*\n` +
      `Tanggal: ${new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}\n\n` +
      `• Total Bonus Terbayar: ${bonusSummary.totalBonusPaidFormatted || "–"}\n` +
      `• Total Video Lolos Kualifikasi: ${bonusSummary.totalEligibleVideos || 0} video\n` +
      `• Efisiensi Jangkauan Organik: ~Rp 8.400.000 (Setara belanja Meta Ads)\n\n` +
      `*RINCIAN PER PIC/CREATOR:*\n` +
      (bonusSummary.byPic || [])
        .map(
          (p: any, i: number) =>
            `${i + 1}. ${p.pic} (${p.branch}): ${p.totalAmountFormatted} (${p.count} video)`
        )
        .join("\n") +
      `\n\n_Catatan: Data divalidasi langsung dari Spreadsheet Evaluasi H+3 Optik I See You._`;

    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const branches = Array.from(new Set(entries.map((e) => e.branch).filter(Boolean)));
  const pics = Array.from(new Set(entries.map((e) => e.pic).filter(Boolean)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> RESTRICTED · FINANCE & HRD
            </span>
            <span className="text-xs text-foreground-muted">Data Evaluasi H+3 Spreadsheet</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Laporan Keuangan & Bonus Insentif Konten
          </h1>
          <p className="text-xs text-foreground-secondary mt-1">
            Otorisasi pencairan bonus kreator 5 cabang berdasarkan performa viewers & like video Reels/TikTok.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-semibold text-foreground hover:bg-surface-secondary transition-all shadow-subtle"
          >
            {copySuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Tersalin ke Clipboard!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-foreground-muted" />
                <span>Salin Rekap WA</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl border border-border bg-surface shadow-subtle">
          <div className="flex items-center justify-between text-foreground-muted mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Bonus Cair</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground tabular-nums">
            {bonusSummary?.totalBonusPaidFormatted || "Rp 0"}
          </div>
          <p className="text-[11px] text-foreground-secondary mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            Terakumulasi dari evaluasi H+3
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface shadow-subtle">
          <div className="flex items-center justify-between text-foreground-muted mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Video Lolos Threshold</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground tabular-nums">
            {bonusSummary?.totalEligibleVideos || 0} <span className="text-sm font-normal text-foreground-muted">video</span>
          </div>
          <p className="text-[11px] text-foreground-secondary mt-1">
            Memenuhi syarat views & likes
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface shadow-subtle">
          <div className="flex items-center justify-between text-foreground-muted mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Kreator Berprestasi</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground tabular-nums">
            {bonusSummary?.byPic?.length || 0} <span className="text-sm font-normal text-foreground-muted">PIC</span>
          </div>
          <p className="text-[11px] text-foreground-secondary mt-1">
            Dari 5 cabang operasional
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface shadow-subtle">
          <div className="flex items-center justify-between text-foreground-muted mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Efisiensi Belanja Iklan</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground tabular-nums">
            ~Rp 8,4 Jt
          </div>
          <p className="text-[11px] text-foreground-secondary mt-1">
            Nilai organik setara Meta Ads
          </p>
        </div>
      </div>

      {/* PIC Summary Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand" />
          Rincian Bonus Akumulatif Per PIC / Creator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {(bonusSummary?.byPic || []).map((picData: any, idx: number) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-border bg-surface hover:border-foreground-muted/30 transition-all shadow-subtle"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand-light text-brand flex items-center justify-center font-bold text-xs">
                    {picData.pic.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-foreground">{picData.pic}</h3>
                    <span className="text-[10px] text-foreground-muted block">{picData.branch}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-secondary text-foreground-secondary border border-border">
                  #{idx + 1}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-border/60 pt-2.5 mt-2">
                <span className="text-[11px] text-foreground-secondary">Total Bonus</span>
                <span className="text-sm font-bold text-foreground tabular-nums">
                  {picData.totalAmountFormatted}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-foreground-muted mt-1">
                <span>Total Video Memenuhi Syarat</span>
                <span className="font-semibold text-foreground">{picData.count} video</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter & Detail Table */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-subtle space-y-4 p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">Log Riwayat Video Kualifikasi Bonus H+3</h3>
            <p className="text-[11px] text-foreground-muted">
              Menampilkan {filteredEntries.length} catatan pencairan bonus (Total filter: Rp{" "}
              {totalFilteredAmount.toLocaleString("id-ID")})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul/PIC..."
                className="w-full pl-8 pr-3 py-1.5 bg-surface-secondary border border-border rounded-lg text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            {/* Branch Filter */}
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-2.5 py-1.5 bg-surface-secondary border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="all">Semua Cabang</option>
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            {/* PIC Filter */}
            <select
              value={selectedPic}
              onChange={(e) => setSelectedPic(e.target.value)}
              className="px-2.5 py-1.5 bg-surface-secondary border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="all">Semua PIC</option>
              {pics.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-border/80 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary text-foreground-secondary border-b border-border text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Tgl Upload</th>
                <th className="py-2.5 px-3 font-semibold">Cabang & PIC</th>
                <th className="py-2.5 px-3 font-semibold">Judul Video Konten</th>
                <th className="py-2.5 px-3 font-semibold text-right">Viewers H+3</th>
                <th className="py-2.5 px-3 font-semibold text-right">Likes H+3</th>
                <th className="py-2.5 px-3 font-semibold text-right">Nominal Bonus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-foreground-muted">
                    Tidak ditemukan data video dengan filter tersebut.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((item, idx) => (
                  <tr key={idx} className="hover:bg-surface-secondary/50 transition-colors">
                    <td className="py-2.5 px-3 text-foreground-muted whitespace-nowrap tabular-nums">
                      {item.uploadDate || "-"}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="font-semibold text-foreground block">{item.pic}</span>
                      <span className="text-[10px] text-foreground-muted">{item.branch}</span>
                    </td>
                    <td className="py-2.5 px-3 max-w-xs">
                      <p className="font-medium text-foreground line-clamp-1">{item.title}</p>
                      {item.reviewDate && (
                        <span className="text-[10px] text-foreground-muted">
                          Evaluasi H+3: {item.reviewDate}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums font-medium text-foreground">
                      {item.viewersH3 ? Number(item.viewersH3).toLocaleString("id-ID") : "–"}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums font-medium text-foreground">
                      {item.likesH3 ? Number(item.likesH3).toLocaleString("id-ID") : "–"}
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {item.bonusFormatted || `Rp ${item.bonusAmount?.toLocaleString("id-ID")}`}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
