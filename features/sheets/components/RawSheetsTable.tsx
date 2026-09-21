"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  ExternalLink,
  Filter,
  Eye,
  Heart,
  Users,
  MessageSquare,
  Link2,
} from "lucide-react";

interface RawSheetsTableProps {
  storyData: any[];
  branchReels: Record<string, any[]>;
}

export const RawSheetsTable: React.FC<RawSheetsTableProps> = ({
  storyData,
  branchReels,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Combine story and branch rows into a unified list
  const combinedRows = useMemo(() => {
    const list: any[] = [];

    // Add stories
    storyData.forEach((s) => {
      list.push({
        id: s.id,
        type: "Story",
        date: s.reportDate || s.timestamp,
        branch: s.branch,
        pic: s.pic,
        sheetKey: "Rekap Story PWT",
        title: s.frequentQuestions ? `Q&A: ${s.frequentQuestions}` : `Story Update (${s.storiesUploaded} slide)`,
        pillar: "Story Q&A / Customer Care",
        viewers: s.maxViewers || 0,
        secondaryMetric: `${s.dmInquiries || 0} DM masuk`,
        linkReels: "",
        linkThreads: "",
        linkTiktok: "",
        linkFeed: "",
        igFollowers: null,
        tiktokFollowers: null,
        obstacle: s.obstacle !== "-" ? s.obstacle : s.areaToImprove !== "-" ? s.areaToImprove : "-",
        achievement: s.achievement !== "-" ? s.achievement : "-",
        rawObj: s,
      });
    });

    // Add reels from all branches
    Object.entries(branchReels).forEach(([sheetKey, rows]) => {
      rows.forEach((r) => {
        list.push({
          id: r.id,
          type: "Reels",
          date: r.reportDate || r.timestamp,
          branch: r.branch,
          pic: r.pic,
          sheetKey: sheetKey,
          title: r.reelsTitle || "-",
          secondTitle: r.secondReelsTitle,
          pillar: r.contentPillar || "Umum",
          viewers: r.viewers || 0,
          secondaryMetric: `${r.likes || 0} suka`,
          linkReels: r.reelsLink,
          linkThreads: r.threadsLink,
          linkTiktok: r.tiktokLink,
          linkFeed: r.feedLink,
          igFollowers: r.igFollowers,
          tiktokFollowers: r.tiktokFollowers,
          obstacle: r.obstacle !== "-" ? r.obstacle : "-",
          achievement: "-",
          rawObj: r,
        });
      });
    });

    // Sort by date descending
    return list.sort((a, b) => (b.date > a.date ? 1 : -1));
  }, [storyData, branchReels]);

  // Filtered rows
  const filteredRows = useMemo(() => {
    return combinedRows.filter((item) => {
      // Filter by PIC / Branch
      if (activeFilter === "story" && item.sheetKey !== "Rekap Story PWT") return false;
      if (activeFilter === "pwt" && item.sheetKey !== "Rekap PWT") return false;
      if (activeFilter === "pbg" && item.sheetKey !== "Rekap PBG") return false;
      if (activeFilter === "tgl" && item.sheetKey !== "Rekap TGL") return false;
      if (activeFilter === "clp" && item.sheetKey !== "Rekap CLP") return false;
      if (activeFilter === "wns" && item.sheetKey !== "Rekap WNS") return false;

      // Filter by format
      if (categoryFilter === "reels" && item.type !== "Reels") return false;
      if (categoryFilter === "story" && item.type !== "Story") return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchBranch = item.branch.toLowerCase().includes(q);
        const matchPic = item.pic.toLowerCase().includes(q);
        const matchObstacle = item.obstacle.toLowerCase().includes(q);
        const matchPillar = item.pillar.toLowerCase().includes(q);
        return matchTitle || matchBranch || matchPic || matchObstacle || matchPillar;
      }

      return true;
    });
  }, [combinedRows, activeFilter, categoryFilter, searchQuery]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Tipe",
      "Tanggal Laporan",
      "Cabang",
      "PIC",
      "Judul Konten / Topik",
      "Pilar Konten",
      "Viewers",
      "Likes/DM",
      "Followers IG",
      "Followers TikTok",
      "Link Reels",
      "Link TikTok",
      "Kendala",
    ];

    const rows = filteredRows.map((r) => [
      `"${r.id}"`,
      `"${r.type}"`,
      `"${r.date}"`,
      `"${r.branch}"`,
      `"${r.pic}"`,
      `"${(r.title || "").replace(/"/g, '""')}"`,
      `"${(r.pillar || "").replace(/"/g, '""')}"`,
      r.viewers,
      `"${r.secondaryMetric}"`,
      r.igFollowers || "-",
      r.tiktokFollowers || "-",
      `"${r.linkReels || ""}"`,
      `"${r.linkTiktok || ""}"`,
      `"${(r.obstacle || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rekap-spreadsheet-iseeyou-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filterButtons = [
    { key: "all", label: "Semua Cabang & PIC", count: combinedRows.length },
    { key: "story", label: "Nuha (Story PWT)", count: storyData.length },
    { key: "pwt", label: "Ilya (Reels PWT)", count: (branchReels["Rekap PWT"] || []).length },
    { key: "pbg", label: "Ajun (Reels PBG)", count: (branchReels["Rekap PBG"] || []).length },
    { key: "tgl", label: "Amanda (Lunar TGL)", count: (branchReels["Rekap TGL"] || []).length },
    { key: "clp", label: "Arum (Reels CLP)", count: (branchReels["Rekap CLP"] || []).length },
    { key: "wns", label: "Febi (Reels WNS)", count: (branchReels["Rekap WNS"] || []).length },
  ];

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="bg-surface border border-border rounded-container p-4 shadow-subtle flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Cari judul reels, topik DM story, kendala, atau pilar konten..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-control border border-border bg-surface-secondary text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-foreground"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Format dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-control border border-border bg-surface-secondary text-xs text-foreground font-medium focus:outline-none"
          >
            <option value="all">Semua Format (Reels & Story)</option>
            <option value="reels">Hanya Reels</option>
            <option value="story">Hanya Story</option>
          </select>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-control border border-border bg-surface hover:bg-surface-secondary text-xs font-semibold text-foreground transition-colors shadow-subtle shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV ({filteredRows.length})</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs by PIC / Sheet */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {filterButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setActiveFilter(btn.key)}
            className={`px-3 py-1.5 rounded-control text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === btn.key
                ? "bg-foreground text-surface font-semibold shadow-subtle"
                : "bg-surface border border-border text-foreground-secondary hover:text-foreground hover:bg-surface-secondary"
            }`}
          >
            <span>{btn.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeFilter === btn.key
                  ? "bg-surface/20 text-surface"
                  : "bg-surface-secondary text-foreground-muted"
              }`}
            >
              {btn.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-surface border border-border rounded-container shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-secondary text-foreground-muted font-semibold">
                <th className="py-2.5 px-3 whitespace-nowrap">Tanggal</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Cabang & PIC</th>
                <th className="py-2.5 px-4">Judul Konten / Topik Story</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Pilar Konten</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">Viewers / DM</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">Followers IG</th>
                <th className="py-2.5 px-3 text-center whitespace-nowrap">Tautan Publikasi</th>
                <th className="py-2.5 px-4 min-w-[180px]">Catatan / Kendala</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredRows.slice(0, 50).map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-surface-secondary/60 transition-colors group"
                >
                  {/* Tanggal */}
                  <td className="py-2.5 px-3 font-mono text-[11px] text-foreground-secondary whitespace-nowrap">
                    {row.date}
                  </td>

                  {/* Cabang & PIC */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="font-semibold text-foreground text-xs">{row.pic}</div>
                    <div className="text-[10px] text-foreground-muted">{row.branch}</div>
                  </td>

                  {/* Judul Konten */}
                  <td className="py-2.5 px-4 max-w-[280px]">
                    <div className="font-medium text-foreground line-clamp-2">
                      {row.title}
                    </div>
                    {row.secondTitle && (
                      <div className="text-[10px] text-foreground-muted line-clamp-1 italic mt-0.5">
                        Alt: {row.secondTitle}
                      </div>
                    )}
                  </td>

                  {/* Pilar */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-surface-secondary text-foreground-secondary border border-border">
                      {row.pillar}
                    </span>
                  </td>

                  {/* Viewers & Likes/DM */}
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <div className="font-bold text-foreground tabular-nums">
                      {row.viewers ? row.viewers.toLocaleString("id-ID") : "-"}
                    </div>
                    <div className="text-[10px] text-foreground-muted">
                      {row.secondaryMetric}
                    </div>
                  </td>

                  {/* Followers IG */}
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    {row.igFollowers ? (
                      <div>
                        <span className="font-mono text-foreground font-semibold">
                          {row.igFollowers.toLocaleString("id-ID")}
                        </span>
                        {row.tiktokFollowers ? (
                          <div className="text-[10px] text-foreground-muted font-mono">
                            TT: {row.tiktokFollowers.toLocaleString("id-ID")}
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <span className="text-foreground-muted">-</span>
                    )}
                  </td>

                  {/* Social Links */}
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      {row.linkReels && row.linkReels.startsWith("http") ? (
                        <a
                          href={row.linkReels}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded hover:bg-surface-secondary text-foreground-secondary hover:text-foreground"
                          title="Lihat Reels Instagram"
                        >
                          <span className="text-[10px] font-bold px-1 py-0.2 rounded bg-pink-100 text-pink-900 border border-pink-200">
                            IG
                          </span>
                        </a>
                      ) : null}

                      {row.linkTiktok && row.linkTiktok.startsWith("http") ? (
                        <a
                          href={row.linkTiktok}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded hover:bg-surface-secondary text-foreground-secondary hover:text-foreground"
                          title="Lihat TikTok"
                        >
                          <span className="text-[10px] font-bold px-1 py-0.2 rounded bg-neutral-100 text-neutral-900 border border-neutral-300">
                            TT
                          </span>
                        </a>
                      ) : null}

                      {row.linkThreads && row.linkThreads.startsWith("http") ? (
                        <a
                          href={row.linkThreads}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded hover:bg-surface-secondary text-foreground-secondary hover:text-foreground"
                          title="Lihat Threads"
                        >
                          <span className="text-[10px] font-bold px-1 py-0.2 rounded bg-sky-100 text-sky-900 border border-sky-200">
                            TH
                          </span>
                        </a>
                      ) : null}

                      {!row.linkReels && !row.linkTiktok && !row.linkThreads && (
                        <span className="text-[10px] text-foreground-muted">-</span>
                      )}
                    </div>
                  </td>

                  {/* Kendala & Catatan */}
                  <td className="py-2.5 px-4 text-foreground-secondary text-[11px]">
                    <div className="line-clamp-2" title={row.obstacle}>
                      {row.obstacle !== "-" ? row.obstacle : (
                        <span className="text-foreground-muted italic">Lancar tanpa kendala</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-border bg-surface-secondary text-xs text-foreground-muted flex items-center justify-between">
          <span>Menampilkan 50 entri terbaru dari total {filteredRows.length} baris spreadsheet.</span>
          <span className="font-mono text-[11px]">Data terhubung langsung dengan Google Sheets</span>
        </div>
      </div>
    </div>
  );
};
