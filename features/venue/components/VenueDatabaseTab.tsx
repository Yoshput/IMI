"use client";

import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";
import type { Venue, VenueCategory, OutreachStatus } from "@/lib/venue-types";
import {
  getCategoryLabel,
  getOutreachStatusLabel,
} from "@/lib/venue-types";
import {
  Search,
  Plus,
  Grid2X2,
  List,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  AlertTriangle,
  Download,
  Camera,
} from "lucide-react";
import { VenueFormModal } from "./VenueFormModal";
import { VenueDetailModal } from "./VenueDetailModal";

const OUTREACH_BADGE: Record<string, string> = {
  new_lead: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  researching: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  ready_to_contact: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  contacted: "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  awaiting_response: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  follow_up_due: "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  replied: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  approved: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  booked_confirmed: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
  rejected: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  lost: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
  on_hold: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
};

const PER_PAGE = 10;

interface Props {
  onStatsChange?: () => void;
}

export const VenueDatabaseTab: React.FC<Props> = ({ onStatsChange }) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editVenue, setEditVenue] = useState<Venue | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);

  const fetchVenues = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (catFilter !== "all") params.set("category", catFilter);
      if (statusFilter !== "all") params.set("outreachStatus", statusFilter);
      const res = await fetch(`/api/venues?${params}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        let merged = json.data;
        if (typeof window !== "undefined") {
          try {
            const cacheStr = localStorage.getItem("local_venue_cache");
            if (cacheStr) {
              const localVenues: Venue[] = JSON.parse(cacheStr);
              const serverIds = new Set(json.data.map((v: Venue) => v.id));
              const missingOnServer = localVenues.filter((v: Venue) => !serverIds.has(v.id));
              if (missingOnServer.length > 0) {
                merged = [...missingOnServer, ...json.data];
              }
            }
          } catch {
            // ignore
          }
        }
        setVenues(merged);
      }
    } catch { /* empty */ }
    setLoading(false);
  }, [query, catFilter, statusFilter]);

  useEffect(() => { fetchVenues(); }, [fetchVenues]);

  const totalPages = Math.ceil(venues.length / PER_PAGE);
  const pagedVenues = venues.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSaved = () => {
    setShowForm(false);
    setEditVenue(null);
    fetchVenues();
    onStatsChange?.();
  };

  const scoreColor = (s: number) => s >= 70 ? "bg-emerald-500" : s >= 50 ? "bg-yellow-500" : "bg-red-400";

  const categories: VenueCategory[] = ["kampus", "gedung_pertemuan", "hotel", "coworking", "creative_space", "kafe_restoran", "komunitas", "lainnya"];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Cari venue..."
            className="w-full pl-9 pr-3 py-2 bg-surface border border-border rounded-control text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
          />
        </div>

        {/* Filters */}
        <select
          value={catFilter}
          onChange={(e) => { setCatFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 bg-surface border border-border rounded-control text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
        >
          <option value="all">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c} value={c}>{getCategoryLabel(c)}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 bg-surface border border-border rounded-control text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
        >
          <option value="all">Semua Status</option>
          <option value="new_lead">Lead Baru</option>
          <option value="researching">Riset</option>
          <option value="contacted">Dihubungi</option>
          <option value="awaiting_response">Menunggu Balasan</option>
          <option value="replied">Sudah Membalas</option>
          <option value="approved">Disetujui</option>
          <option value="booked_confirmed">Terkonfirmasi</option>
        </select>

        {/* View toggle */}
        <div className="flex items-center border border-border rounded-control overflow-hidden">
          <button onClick={() => setViewMode("table")} className={cn("p-2 transition-colors", viewMode === "table" ? "bg-foreground text-surface" : "bg-surface text-foreground-secondary hover:bg-surface-secondary")}>
            <List className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode("card")} className={cn("p-2 transition-colors", viewMode === "card" ? "bg-foreground text-surface" : "bg-surface text-foreground-secondary hover:bg-surface-secondary")}>
            <Grid2X2 className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/api/venue-export"
            download
            className="flex items-center gap-1.5 px-3 py-2 border border-border bg-surface text-foreground-secondary hover:text-foreground hover:bg-surface-secondary text-xs font-semibold rounded-control transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Ekspor CSV
          </a>
          <button
            onClick={() => { setEditVenue(null); setShowForm(true); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-foreground text-surface text-xs font-semibold rounded-control hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Venue
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty */}
      {!loading && venues.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <MapPin className="w-10 h-10 text-foreground-muted mb-3" />
          <h3 className="text-sm font-semibold text-foreground">Belum Ada Venue</h3>
          <p className="text-xs text-foreground-muted mt-1">Klik &quot;Tambah Venue&quot; untuk memulai riset venue.</p>
        </div>
      )}

      {/* Table View */}
      {!loading && venues.length > 0 && viewMode === "table" && (
        <div className="bg-surface rounded-container border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-secondary/50">
                  <th className="text-left px-4 py-3 font-semibold text-foreground-secondary">#</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground-secondary">Nama Venue</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground-secondary hidden md:table-cell">Kategori</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground-secondary hidden lg:table-cell">Kota</th>
                  <th className="text-right px-4 py-3 font-semibold text-foreground-secondary hidden sm:table-cell">Kapasitas</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground-secondary">Status</th>
                  <th className="text-center px-4 py-3 font-semibold text-foreground-secondary hidden md:table-cell">Skor</th>
                  <th className="text-right px-4 py-3 font-semibold text-foreground-secondary">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pagedVenues.map((v, i) => {
                  const score = v.score?.normalizedScore ?? 0;
                  return (
                    <tr key={v.id} className="border-b border-border/50 hover:bg-surface-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-foreground-muted">{(page - 1) * PER_PAGE + i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-semibold text-foreground flex items-center gap-1">
                              {v.name}
                              {v.isAmbiguous && (
                                <span title="Nama ambigu">
                                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-foreground-muted truncate max-w-[200px]">
                              {v.address || "Alamat belum diketahui"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-surface-subtle text-[10px] font-medium text-foreground-secondary">
                          {getCategoryLabel(v.category)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-foreground-secondary hidden lg:table-cell">{v.city || "-"}</td>
                      <td className="px-4 py-3 text-right hidden sm:table-cell">
                        {v.capacityTotal !== null ? (
                          <span className="flex items-center justify-end gap-1 text-foreground-secondary">
                            <Users className="w-3 h-3" />
                            {formatNumber(v.capacityTotal)}
                          </span>
                        ) : (
                          <span className="text-foreground-muted italic">?</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold",
                          OUTREACH_BADGE[v.outreachStatus] || OUTREACH_BADGE.new_lead
                        )}>
                          {getOutreachStatusLabel(v.outreachStatus)}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="w-12 h-1.5 rounded-full bg-surface-subtle overflow-hidden">
                            <div className={cn("h-full rounded-full", scoreColor(score))} style={{ width: `${score}%` }} />
                          </div>
                          <span className="text-[10px] font-medium text-foreground-secondary w-6 text-right">{score}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setDetailId(v.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-brand hover:underline"
                        >
                          Detail <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <span className="text-[10px] text-foreground-muted">
                Menampilkan {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, venues.length)} dari {venues.length} venue
              </span>
              <div className="flex items-center gap-1">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="p-1 rounded hover:bg-surface-secondary disabled:opacity-30">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-medium px-2">{page}/{totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="p-1 rounded hover:bg-surface-secondary disabled:opacity-30">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Card View */}
      {!loading && venues.length > 0 && viewMode === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pagedVenues.map((v) => {
            const score = v.score?.normalizedScore ?? 0;
            const coverAsset = v.assets && v.assets.length > 0 ? v.assets[0] : null;
            return (
              <button
                key={v.id}
                onClick={() => setDetailId(v.id)}
                className="group bg-surface rounded-container border border-border overflow-hidden text-left hover:shadow-elevated transition-shadow flex flex-col justify-between"
              >
                {coverAsset && (
                  <div className="relative w-full h-36 bg-surface-secondary overflow-hidden border-b border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={coverAsset.filePath || coverAsset.sourceUrl}
                      alt={coverAsset.altText || v.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/65 backdrop-blur-xs text-[10px] text-white font-medium flex items-center gap-1 shadow-xs">
                      <Camera className="w-3 h-3" /> {v.assets.length} Foto
                    </div>
                  </div>
                )}

                <div className="p-4 space-y-3 w-full">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-brand transition-colors">
                        {v.name}
                      </h3>
                      {v.isAmbiguous && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />}
                    </div>
                    <p className="text-[10px] text-foreground-muted mt-0.5 line-clamp-1">
                      {v.address || "Alamat belum diketahui"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-surface-subtle text-[10px] font-medium text-foreground-secondary">
                      {getCategoryLabel(v.category)}
                    </span>
                    <span
                      className={cn(
                        "inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold",
                        OUTREACH_BADGE[v.outreachStatus] || OUTREACH_BADGE.new_lead
                      )}
                    >
                      {getOutreachStatusLabel(v.outreachStatus)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    {v.capacityTotal !== null ? (
                      <span className="flex items-center gap-1 text-[10px] text-foreground-secondary font-medium">
                        <Users className="w-3 h-3 text-brand" /> {formatNumber(v.capacityTotal)} pax
                      </span>
                    ) : (
                      <span className="text-[10px] text-foreground-muted italic">Kapasitas belum diketahui</span>
                    )}
                    <div className="flex items-center gap-1.5">
                      <div className="w-10 h-1.5 rounded-full bg-surface-subtle overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", scoreColor(score))}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-foreground-secondary">{score}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <VenueFormModal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditVenue(null); }}
        onSaved={handleSaved}
        venue={editVenue}
      />
      <VenueDetailModal
        isOpen={!!detailId}
        onClose={() => setDetailId(null)}
        venueId={detailId}
        onEdit={(v) => { setDetailId(null); setEditVenue(v); setShowForm(true); }}
      />
    </div>
  );
};
