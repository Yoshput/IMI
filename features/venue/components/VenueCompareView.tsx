"use client";

import React, { useState, useEffect } from "react";
import { cn, formatNumber } from "@/lib/utils";
import type { Venue } from "@/lib/venue-types";
import { getCategoryLabel, getOutreachStatusLabel } from "@/lib/venue-types";
import {
  Scale,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Users,
  Award,
  AlertTriangle,
  Building2,
  Download,
  Printer,
  Sparkles,
} from "lucide-react";

interface VenueCompareViewProps {
  initialVenues?: Venue[];
}

export const VenueCompareView: React.FC<VenueCompareViewProps> = ({ initialVenues }) => {
  const [venues, setVenues] = useState<Venue[]>(initialVenues || []);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(!initialVenues);

  useEffect(() => {
    if (!initialVenues) {
      const load = async () => {
        setLoading(true);
        try {
          const res = await fetch("/api/venues");
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setVenues(json.data);
            // Default select top 3 venues
            if (json.data.length >= 2) {
              setSelectedIds(json.data.slice(0, 3).map((v: Venue) => v.id));
            }
          }
        } catch {
          // ignore
        } finally {
          setLoading(false);
        }
      };
      load();
    } else if (initialVenues.length >= 2 && selectedIds.length === 0) {
      setSelectedIds(initialVenues.slice(0, 3).map((v) => v.id));
    }
  }, [initialVenues]);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length <= 2) return; // Keep at least 2 for comparison
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      if (selectedIds.length >= 5) return; // Max 5 venues
      setSelectedIds([...selectedIds, id]);
    }
  };

  const comparedVenues = venues.filter((v) => selectedIds.includes(v.id));

  const bestScore = Math.max(...comparedVenues.map((v) => v.score?.normalizedScore ?? 0));

  const renderBoolean = (val: boolean | null | undefined) => {
    if (val === true) return <CheckCircle2 className="w-4 h-4 text-status-success mx-auto" />;
    if (val === false) return <XCircle className="w-4 h-4 text-status-error mx-auto" />;
    return <HelpCircle className="w-4 h-4 text-foreground-muted mx-auto" />;
  };

  const criteriaList = [
    { key: "costFit", label: "Kesesuaian Biaya (25%)" },
    { key: "capacityFit", label: "Kesesuaian Kapasitas (20%)" },
    { key: "audienceRelevance", label: "Relevansi Audiens (20%)" },
    { key: "facilityQuality", label: "Kualitas Fasilitas (15%)" },
    { key: "accessibilityLocation", label: "Aksesibilitas & Lokasi (10%)" },
    { key: "collaborationPotential", label: "Potensi Kolaborasi & Branding (10%)" },
  ] as const;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface rounded-container border border-border p-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4" />
            Perbandingan Multi-Venue
          </div>
          <h2 className="text-lg font-bold text-foreground">
            Komparasi 2–5 Venue Pilihan
          </h2>
          <p className="text-xs text-foreground-secondary mt-0.5">
            Bandingkan kapasitas, skor kecocokan, fasilitas, dan izin branding secara transparan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-border rounded-control bg-surface hover:bg-surface-secondary text-foreground transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak Perbandingan
          </button>
        </div>
      </div>

      {/* Venue Selector Badges */}
      <div className="bg-surface rounded-container border border-border p-4 space-y-2">
        <label className="text-[11px] font-semibold text-foreground-secondary block">
          Pilih 2–5 Venue untuk Dikomparasikan ({selectedIds.length} terpilih):
        </label>
        <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
          {venues.map((v) => {
            const isSelected = selectedIds.includes(v.id);
            return (
              <button
                key={v.id}
                onClick={() => toggleSelect(v.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all text-left flex items-center gap-2",
                  isSelected
                    ? "bg-foreground text-surface border-foreground font-semibold shadow-xs"
                    : "bg-surface-secondary text-foreground-secondary border-border hover:border-foreground/30"
                )}
              >
                <span>{v.name}</span>
                {v.score && (
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.2 rounded font-bold",
                      isSelected ? "bg-white/20 text-white" : "bg-surface text-brand"
                    )}
                  >
                    {v.score.normalizedScore}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {comparedVenues.length < 2 ? (
        <div className="bg-surface rounded-container border border-border p-12 text-center space-y-2">
          <Scale className="w-10 h-10 text-foreground-muted mx-auto" />
          <h3 className="text-sm font-semibold text-foreground">
            Pilih Minimal 2 Venue
          </h3>
          <p className="text-xs text-foreground-muted max-w-sm mx-auto">
            Silakan pilih minimal 2 venue di atas untuk mengaktifkan tabel komparasi detail.
          </p>
        </div>
      ) : (
        <div className="bg-surface rounded-container border border-border overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-secondary/60">
                  <th className="p-4 text-left font-bold text-foreground-secondary w-48 min-w-[190px]">
                    Kriteria Evaluasi
                  </th>
                  {comparedVenues.map((v) => {
                    const isWinner = (v.score?.normalizedScore ?? 0) === bestScore && bestScore > 0;
                    return (
                      <th
                        key={v.id}
                        className={cn(
                          "p-4 text-left font-bold border-l border-border min-w-[220px] max-w-[280px]",
                          isWinner && "bg-brand/5 dark:bg-brand/10"
                        )}
                      >
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <span className="text-sm font-bold text-foreground line-clamp-2">
                            {v.name}
                          </span>
                          {isWinner && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand bg-brand-light dark:bg-brand/30 px-2 py-0.5 rounded-full shrink-0">
                              <Sparkles className="w-3 h-3" /> Rekomendasi
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full bg-surface-subtle text-[10px] font-medium text-foreground-secondary">
                            {getCategoryLabel(v.category)}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-surface-subtle text-[10px] font-medium text-foreground-secondary">
                            {getOutreachStatusLabel(v.outreachStatus)}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60">
                {/* 1. Skor Kelayakan Normal */}
                <tr className="bg-surface-secondary/20 font-semibold">
                  <td className="p-4 text-foreground font-bold">
                    Skor Kelayakan (0–100)
                  </td>
                  {comparedVenues.map((v) => {
                    const score = v.score?.normalizedScore ?? 0;
                    const isWinner = score === bestScore && bestScore > 0;
                    return (
                      <td
                        key={v.id}
                        className={cn(
                          "p-4 border-l border-border",
                          isWinner && "bg-brand/5 dark:bg-brand/10"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-xl font-bold",
                              score >= 75
                                ? "text-emerald-700 dark:text-emerald-400"
                                : score >= 50
                                ? "text-amber-700 dark:text-amber-400"
                                : "text-red-700 dark:text-red-400"
                            )}
                          >
                            {score}
                          </span>
                          <span className="text-[10px] text-foreground-muted">
                            / 100
                          </span>
                        </div>
                        <div className="w-full bg-surface-subtle h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              score >= 75 ? "bg-emerald-600" : score >= 50 ? "bg-amber-500" : "bg-red-500"
                            )}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-foreground-muted mt-1 leading-snug">
                          {v.score?.scoreExplanation || "Belum ada catatan skor"}
                        </p>
                      </td>
                    );
                  })}
                </tr>

                {/* 2. Rincian Skor per Kriteria */}
                {criteriaList.map((crit) => (
                  <tr key={crit.key} className="hover:bg-surface-secondary/20">
                    <td className="p-4 text-foreground-secondary font-medium">
                      {crit.label}
                    </td>
                    {comparedVenues.map((v) => {
                      const val = v.score ? (v.score as unknown as Record<string, number>)[crit.key] ?? 3 : 3;
                      return (
                        <td key={v.id} className="p-4 border-l border-border">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">
                              {Number(val).toFixed(1)}
                            </span>
                            <span className="text-[10px] text-foreground-muted">/ 5.0</span>
                            <div className="w-16 bg-surface-subtle h-1 rounded-full overflow-hidden ml-auto">
                              <div
                                className="h-full bg-brand rounded-full"
                                style={{ width: `${(val / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* 3. Kapasitas & Dimensi */}
                <tr className="bg-surface-secondary/40 font-semibold">
                  <td colSpan={comparedVenues.length + 1} className="px-4 py-2 text-[11px] uppercase tracking-wider text-foreground-secondary">
                    Kapasitas & Layout Ruangan
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-foreground-secondary font-medium">Kapasitas Total</td>
                  {comparedVenues.map((v) => (
                    <td key={v.id} className="p-4 border-l border-border font-semibold text-foreground">
                      {v.capacityTotal !== null ? `${formatNumber(v.capacityTotal)} pax` : "Belum diketahui"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-foreground-secondary font-medium">Layout Classroom</td>
                  {comparedVenues.map((v) => (
                    <td key={v.id} className="p-4 border-l border-border text-foreground">
                      {v.capacityByLayout.classroom !== null ? `${v.capacityByLayout.classroom} pax` : "Belum dicatat"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-foreground-secondary font-medium">Layout Theater</td>
                  {comparedVenues.map((v) => (
                    <td key={v.id} className="p-4 border-l border-border text-foreground">
                      {v.capacityByLayout.theater !== null ? `${v.capacityByLayout.theater} pax` : "Belum dicatat"}
                    </td>
                  ))}
                </tr>

                {/* 4. Lokasi & Alamat */}
                <tr className="bg-surface-secondary/40 font-semibold">
                  <td colSpan={comparedVenues.length + 1} className="px-4 py-2 text-[11px] uppercase tracking-wider text-foreground-secondary">
                    Lokasi & Verifikasi Alamat
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-foreground-secondary font-medium">Kota / Wilayah</td>
                  {comparedVenues.map((v) => (
                    <td key={v.id} className="p-4 border-l border-border text-foreground">
                      {v.city || "Banyumas"} {v.district ? `(${v.district})` : ""}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-foreground-secondary font-medium">Alamat Lengkap</td>
                  {comparedVenues.map((v) => (
                    <td key={v.id} className="p-4 border-l border-border text-foreground text-[11px] leading-relaxed">
                      {v.address || "Belum tercatat"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-foreground-secondary font-medium">Status Ambiguitas</td>
                  {comparedVenues.map((v) => (
                    <td key={v.id} className="p-4 border-l border-border">
                      {v.isAmbiguous ? (
                        <div className="flex items-start gap-1 text-amber-700 dark:text-amber-400">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span className="text-[11px]">{v.ambiguityNotes || "Nama ambigu"}</span>
                        </div>
                      ) : (
                        <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                          Identitas Jelas & Pasti
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 5. Izin Aktivasi Brand & Display */}
                <tr className="bg-surface-secondary/40 font-semibold">
                  <td colSpan={comparedVenues.length + 1} className="px-4 py-2 text-[11px] uppercase tracking-wider text-foreground-secondary">
                    Izin Branding & Display Optik I See You
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-foreground-secondary font-medium">Izin Booth Kacamata</td>
                  {comparedVenues.map((v) => (
                    <td key={v.id} className="p-4 border-l border-border text-center">
                      {renderBoolean(v.brandingPermissions.booth)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-foreground-secondary font-medium">Izin Banner / Roll Up</td>
                  {comparedVenues.map((v) => (
                    <td key={v.id} className="p-4 border-l border-border text-center">
                      {renderBoolean(v.brandingPermissions.banner)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-foreground-secondary font-medium">Izin Backdrop Panggung</td>
                  {comparedVenues.map((v) => (
                    <td key={v.id} className="p-4 border-l border-border text-center">
                      {renderBoolean(v.brandingPermissions.backdrop)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-foreground-secondary font-medium">Display Produk & Brosur</td>
                  {comparedVenues.map((v) => (
                    <td key={v.id} className="p-4 border-l border-border text-center">
                      {renderBoolean(v.brandingPermissions.productDisplay)}
                    </td>
                  ))}
                </tr>

                {/* 6. Analisis Keunggulan & Keterbatasan */}
                <tr className="bg-surface-secondary/40 font-semibold">
                  <td colSpan={comparedVenues.length + 1} className="px-4 py-2 text-[11px] uppercase tracking-wider text-foreground-secondary">
                    Analisis Keunggulan & Keterbatasan
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-foreground-secondary font-medium">Keunggulan Utama</td>
                  {comparedVenues.map((v) => (
                    <td key={v.id} className="p-4 border-l border-border text-foreground">
                      {v.strengths.length > 0 ? (
                        <ul className="list-disc pl-4 space-y-1 text-[11px]">
                          {v.strengths.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-foreground-muted italic">Belum dicatat</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-foreground-secondary font-medium">Keterbatasan & Risiko</td>
                  {comparedVenues.map((v) => (
                    <td key={v.id} className="p-4 border-l border-border text-foreground">
                      {v.limitations.length > 0 ? (
                        <ul className="list-disc pl-4 space-y-1 text-[11px] text-amber-800 dark:text-amber-300">
                          {v.limitations.map((l, idx) => (
                            <li key={idx}>{l}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-foreground-muted italic">Tidak ada catatan risiko kritis</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 7. Catatan Intelijen Internal */}
                <tr>
                  <td className="p-4 text-foreground-secondary font-medium">Catatan Riset Lapangan</td>
                  {comparedVenues.map((v) => (
                    <td key={v.id} className="p-4 border-l border-border text-[11px] text-foreground-secondary leading-relaxed">
                      {v.internalNotes || "Belum ada catatan internal"}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
