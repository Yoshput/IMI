"use client";

import React, { useEffect } from "react";
import {
  X,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Instagram,
  Phone,
  Building2,
  Calendar,
  Star,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
} from "lucide-react";
import { SponsorLead } from "@/lib/sponsor-leads-data";

interface Props {
  lead: SponsorLead | null;
  onClose: () => void;
}

export const B2BEvidenceModal: React.FC<Props> = ({ lead, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!lead) return null;

  const getVerificationBadge = (status: SponsorLead["verificationStatus"]) => {
    switch (status) {
      case "verified":
        return {
          label: "Terverifikasi Penuh",
          cls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
          icon: CheckCircle2,
        };
      case "partially_verified":
        return {
          label: "Terverifikasi Sebagian",
          cls: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
          icon: Info,
        };
      case "needs_review":
        return {
          label: "Perlu Review Lapangan",
          cls: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
          icon: AlertTriangle,
        };
      default:
        return {
          label: "Ditolak / Tutup",
          cls: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
          icon: X,
        };
    }
  };

  const vBadge = getVerificationBadge(lead.verificationStatus);
  const VIcon = vBadge.icon;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="evidence-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-border flex items-start justify-between gap-3 bg-surface-secondary/40">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand/10 text-brand border border-brand/20">
                {lead.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface-secondary text-foreground-secondary border border-border">
                {lead.region}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${vBadge.cls}`}
              >
                <VIcon className="w-3 h-3" />
                <span>{vBadge.label}</span>
              </span>
            </div>
            <h3 id="evidence-modal-title" className="text-lg font-black text-foreground">
              {lead.brandName}
            </h3>
            <p className="text-xs text-foreground-muted mt-0.5">
              ID Prospek: <code className="font-mono text-foreground font-semibold">{lead.id}</code> ·
              Status Kemitraan: <span className="font-semibold text-foreground uppercase">{lead.partnershipStatus}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border text-foreground-muted hover:text-foreground hover:bg-surface-secondary transition-colors"
            title="Tutup dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Audit Conflict Alert Banner if any */}
          {lead.auditConflicts && lead.auditConflicts.length > 0 && (
            <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-950 dark:text-amber-100 text-[11px] uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Catatan Konflik / Audit Lapangan:</span>
              </div>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                {lead.auditConflicts.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick Metrics Bar (Rating, Review, Operational) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-2.5 rounded-xl bg-surface-secondary border border-border">
              <span className="text-[10px] text-foreground-muted block font-medium">Status Operasional</span>
              <span className="font-bold text-foreground mt-0.5 block">
                {lead.operationalStatus === "OPERATIONAL" ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Beroperasi Aktif
                  </span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Perlu Konfirmasi
                  </span>
                )}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-surface-secondary border border-border">
              <span className="text-[10px] text-foreground-muted block font-medium">Rating Google Maps</span>
              <div className="flex items-center gap-1 font-bold text-foreground mt-0.5">
                {lead.rating ? (
                  <>
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{lead.rating.toFixed(1)}</span>
                    <span className="text-[10px] text-foreground-muted font-normal">
                      ({lead.reviewCount ? lead.reviewCount.toLocaleString() : 0} ulasan)
                    </span>
                  </>
                ) : (
                  <span className="text-foreground-muted italic">Belum terindeks</span>
                )}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-surface-secondary border border-border col-span-2 sm:col-span-1">
              <span className="text-[10px] text-foreground-muted block font-medium">PIC / Narahubung</span>
              <span className="font-bold text-foreground mt-0.5 block truncate">
                {lead.contactPerson || "Tim Manajemen"}
              </span>
            </div>
          </div>

          {/* Verified Address & Links */}
          <div className="p-3.5 rounded-xl bg-surface border border-border space-y-2.5">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brand shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="text-[10px] font-bold text-foreground-muted uppercase block">Alamat Outlet Fisik:</span>
                <p className="text-foreground text-xs leading-relaxed mt-0.5">
                  {lead.address || "Belum ada alamat fisik yang terverifikasi."}
                </p>
                {lead.mapsUrl && (
                  <a
                    href={lead.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-brand hover:underline mt-1"
                  >
                    <span>Buka Titik di Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-foreground-muted font-medium block">Akun Instagram Resmi:</span>
                {lead.instagramUrl ? (
                  <a
                    href={lead.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-pink-600 dark:text-pink-400 hover:underline mt-0.5"
                  >
                    <Instagram className="w-3 h-3" />
                    <span>{lead.instagramHandle || "Lihat Profil"}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ) : (
                  <span className="text-foreground-muted italic">Tidak dipublikasikan / null</span>
                )}
              </div>

              <div>
                <span className="text-foreground-muted font-medium block">Nomor Telepon / WhatsApp:</span>
                {lead.phone ? (
                  <span className="font-mono font-bold text-foreground flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    <span>{lead.phone}</span>
                  </span>
                ) : (
                  <span className="text-foreground-muted italic">Tidak tersedia kontak publik (null)</span>
                )}
              </div>
            </div>
          </div>

          {/* Sinergi & Usulan Kemitraan */}
          <div className="p-3.5 rounded-xl bg-brand/5 border border-brand/20 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand block flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Usulan Sinergi B2B (AI Proposal — Belum Ada Kesepakatan)
            </span>
            <p className="text-foreground leading-relaxed text-xs">
              {lead.collaborationAngle}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1.5 text-[11px]">
              <div className="p-2 rounded-lg bg-surface border border-border/80">
                <span className="font-bold text-foreground block">Opsi Barter Voucher:</span>
                <span className="text-foreground-secondary">{lead.voucherOption}</span>
              </div>
              <div className="p-2 rounded-lg bg-surface border border-border/80">
                <span className="font-bold text-foreground block">Opsi Brosur Meja Kasir:</span>
                <span className="text-foreground-secondary">{lead.brochureOption}</span>
              </div>
            </div>
          </div>

          {/* Verification Evidence Checklist Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Bukti Verifikasi Faktual ({lead.evidence.length} Sumber)
              </span>
              <span className="text-[10px] text-foreground-muted">Dicek: 26 Oktober 2026</span>
            </div>

            <div className="space-y-1.5">
              {lead.evidence.map((ev, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl border border-border bg-surface-secondary/50 text-[11px] space-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground capitalize">
                      Bidang: {ev.field.replace("_", " ")}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-surface border border-border text-foreground-muted uppercase">
                      {ev.sourceType.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-foreground-secondary">{ev.note}</p>
                  <div className="flex items-center justify-between text-[10px] text-foreground-muted pt-0.5">
                    <span>Sumber: {ev.sourceLabel}</span>
                    {ev.sourceUrl && (
                      <a
                        href={ev.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-brand hover:underline"
                      >
                        <span>Lihat Sumber</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary/40 flex items-center justify-between">
          <span className="text-[10px] text-foreground-muted">
            Data diverifikasi secara ketat melalui audit web dan Google Maps.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-foreground text-surface text-xs font-bold hover:opacity-90 transition-opacity"
          >
            Tutup Rincian
          </button>
        </div>
      </div>
    </div>
  );
};
