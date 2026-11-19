"use client";

import React, { useState } from "react";
import {
  X,
  Instagram,
  Video,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Sparkles,
  Package,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  MessageCircle,
  Send,
  ShieldCheck,
  History,
  Layers,
  Heart,
  TrendingUp,
} from "lucide-react";
import { Creator, PipelineStage } from "../types";
import { PIPELINE_STAGES } from "../constants";

interface CreatorDetailModalProps {
  creator: Creator | null;
  onClose: () => void;
  onEdit: (creator: Creator) => void;
  onDelete: (creator: Creator) => void;
  onOpenMessageGenerator: (creator: Creator) => void;
  onUpdateStage: (creatorId: string, newStage: PipelineStage, note?: string) => void;
}

export const CreatorDetailModal: React.FC<CreatorDetailModalProps> = ({
  creator,
  onClose,
  onEdit,
  onDelete,
  onOpenMessageGenerator,
  onUpdateStage,
}) => {
  const [showAddress, setShowAddress] = useState(false);
  const [activeTab, setActiveTab] = useState<"collaboration" | "evaluation" | "identity" | "history">("collaboration");

  if (!creator) return null;

  const stgMeta = PIPELINE_STAGES.find((s) => s.id === creator.collaboration.stage) || PIPELINE_STAGES[0];
  const isVisual = creator.evaluation.priorityLevel === "visual";
  const isReach = creator.evaluation.priorityLevel === "reach";

  const handleStageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStage = e.target.value as PipelineStage;
    onUpdateStage(creator.id, newStage, `Diubah manual di profil creator ke ${newStage}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-surface border border-border rounded-2xl shadow-elevated overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================================= */}
        {/* MODAL HEADER: CREATOR IDENTITY & ACTIONS                                  */}
        {/* ========================================================================= */}
        <div className="p-5 border-b border-border bg-surface-secondary/40 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-full bg-emerald-600/15 text-emerald-800 dark:text-emerald-300 font-black text-lg flex items-center justify-center shrink-0">
              {creator.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-foreground truncate">
                  {creator.name}
                </h3>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    isVisual
                      ? "bg-purple-50 text-purple-700 border-purple-300"
                      : isReach
                      ? "bg-blue-50 text-blue-700 border-blue-300"
                      : "bg-surface-secondary text-foreground-muted border-border"
                  }`}
                >
                  {isVisual ? "Category A · Visual Priority" : isReach ? "Category B · Reach Priority" : "Standard"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground-muted mt-0.5">
                <span>@{creator.instagramHandle}</span>
                {creator.tiktokHandle && <span>· TT: @{creator.tiktokHandle}</span>}
                <span>·</span>
                <span className="flex items-center gap-1 text-foreground-secondary">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  {creator.city}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onOpenMessageGenerator(creator)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
              title="Kirim Pesan Barter WA"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pesan WA</span>
            </button>
            <button
              type="button"
              onClick={() => onEdit(creator)}
              className="p-2 rounded-xl bg-surface border border-border hover:bg-surface-secondary text-foreground transition-colors"
              title="Edit Creator"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(creator)}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 transition-colors"
              title="Hapus Creator"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-surface border border-border hover:bg-surface-secondary text-foreground-muted hover:text-foreground transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-border bg-surface text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("collaboration")}
            className={`pb-2.5 px-2 border-b-2 font-bold transition-all whitespace-nowrap ${
              activeTab === "collaboration"
                ? "border-emerald-600 text-emerald-800 dark:text-emerald-300"
                : "border-transparent text-foreground-secondary hover:text-foreground"
            }`}
          >
            Kolaborasi &amp; Barter Produk
          </button>
          <button
            onClick={() => setActiveTab("evaluation")}
            className={`pb-2.5 px-2 border-b-2 font-bold transition-all whitespace-nowrap ${
              activeTab === "evaluation"
                ? "border-emerald-600 text-emerald-800 dark:text-emerald-300"
                : "border-transparent text-foreground-secondary hover:text-foreground"
            }`}
          >
            Hasil Evaluasi &amp; Skor ({creator.evaluation.potentialScore}/100)
          </button>
          <button
            onClick={() => setActiveTab("identity")}
            className={`pb-2.5 px-2 border-b-2 font-bold transition-all whitespace-nowrap ${
              activeTab === "identity"
                ? "border-emerald-600 text-emerald-800 dark:text-emerald-300"
                : "border-transparent text-foreground-secondary hover:text-foreground"
            }`}
          >
            Profil &amp; Metrik Audiens
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`pb-2.5 px-2 border-b-2 font-bold transition-all whitespace-nowrap ${
              activeTab === "history"
                ? "border-emerald-600 text-emerald-800 dark:text-emerald-300"
                : "border-transparent text-foreground-secondary hover:text-foreground"
            }`}
          >
            Riwayat Pipeline ({creator.collaboration.statusHistory?.length || 0})
          </button>
        </div>

        {/* ========================================================================= */}
        {/* MODAL BODY (TABS)                                                         */}
        {/* ========================================================================= */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs">
          {/* TAB 1: COLLABORATION & BARTER */}
          {activeTab === "collaboration" && (
            <div className="space-y-4">
              {/* Pipeline Stage Bar */}
              <div className="p-4 rounded-xl bg-surface-secondary/60 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">
                    Tahapan Pipeline Saat Ini
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${stgMeta.badgeClass}`}>
                      {stgMeta.label}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-foreground-muted text-[11px]">Ubah Tahap:</span>
                  <select
                    value={creator.collaboration.stage}
                    onChange={handleStageChange}
                    className="px-2.5 py-1.5 rounded-lg bg-surface border border-border font-bold text-foreground focus:ring-1 focus:ring-emerald-600"
                  >
                    {PIPELINE_STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Barter Product Details */}
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-emerald-600" />
                    <span>Paket Kacamata Barter yang Dikirimkan</span>
                  </h4>
                  <span className="text-[11px] font-black text-emerald-800 dark:text-emerald-300">
                    Nilai: Rp {creator.collaboration.estimatedProductValue.toLocaleString("id-ID")}
                  </span>
                </div>

                <p className="text-foreground text-xs leading-relaxed font-medium">
                  {creator.collaboration.productSent}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-emerald-500/20 text-[11px] text-foreground-secondary">
                  <div>
                    <strong>Deliverables:</strong> {creator.collaboration.deliverables}
                  </div>
                  <div>
                    <strong>Nomor Resi:</strong> {creator.collaboration.courierReceipt || "Belum dikirim"}
                  </div>
                </div>
              </div>

              {/* Sensitive Delivery Address with Privacy Toggle */}
              <div className="p-4 rounded-xl bg-surface-secondary/60 border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Alamat Rumah Pengiriman (Akses Internal Tim)</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => setShowAddress(!showAddress)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    {showAddress ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showAddress ? "Tutup Alamat" : "Buka Alamat Lengkap"}</span>
                  </button>
                </div>

                {showAddress ? (
                  <div className="p-3 rounded-lg bg-surface border border-border text-foreground font-mono text-[11px] leading-relaxed">
                    {creator.collaboration.deliveryAddress || "Alamat rumah belum diinput oleh tim."}
                  </div>
                ) : (
                  <p className="text-[11px] text-foreground-muted italic">
                    Alamat rumah disembunyikan untuk keamanan data pribadi creator. Klik &quot;Buka Alamat Lengkap&quot; untuk melihat rincian pengiriman kurir.
                  </p>
                )}
              </div>

              {/* Key Timeline Dates */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-surface-secondary border border-border">
                  <span className="text-[10px] text-foreground-muted block">Tanggal Kontak</span>
                  <span className="font-bold text-foreground">{creator.collaboration.contactDate || "-"}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-secondary border border-border">
                  <span className="text-[10px] text-foreground-muted block">Follow-up Jadwal</span>
                  <span className="font-bold text-amber-700 dark:text-amber-300">{creator.collaboration.nextFollowUpDate || "-"}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-secondary border border-border">
                  <span className="text-[10px] text-foreground-muted block">Batas Tayang</span>
                  <span className="font-bold text-foreground">{creator.collaboration.contentDeadline || "-"}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-secondary border border-border">
                  <span className="text-[10px] text-foreground-muted block">Tanggal Tayang</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">{creator.collaboration.publicationDate || "-"}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EVALUATION & SCORES */}
          {activeTab === "evaluation" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-surface-secondary/70 border border-border text-center space-y-1">
                <span className="text-3xl font-black text-foreground">{creator.evaluation.potentialScore} / 100</span>
                <span className="text-xs text-foreground-muted block">Skor Potensial Kacamata Keseluruhan</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <span className="text-[10px] font-bold text-purple-800 dark:text-purple-300 uppercase block">Visual Appeal</span>
                  <span className="text-lg font-black text-purple-900 dark:text-purple-200">{creator.evaluation.visualScore}/10</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase block">Branding Fit</span>
                  <span className="text-lg font-black text-emerald-900 dark:text-emerald-200">{creator.evaluation.brandingScore}/10</span>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <span className="text-[10px] font-bold text-blue-800 dark:text-blue-300 uppercase block">Reach Score</span>
                  <span className="text-lg font-black text-blue-900 dark:text-blue-200">{creator.evaluation.reachScore}/10</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase block">Content Quality</span>
                  <span className="text-lg font-black text-amber-900 dark:text-amber-200">{creator.evaluation.contentQualityScore}/10</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-secondary border border-border space-y-1">
                <span className="text-[11px] font-bold text-foreground block">Catatan Evaluasi Internal Marketing:</span>
                <p className="text-foreground-secondary leading-relaxed">
                  {creator.evaluation.internalNotes || "Tidak ada catatan internal khusus."}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: IDENTITY & AUDIENCE */}
          {activeTab === "identity" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-surface-secondary border border-border space-y-1">
                  <span className="text-[10px] text-foreground-muted block uppercase font-bold">Kontak WhatsApp</span>
                  <span className="text-xs font-bold text-foreground block">{creator.contactWa}</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-secondary border border-border space-y-1">
                  <span className="text-[10px] text-foreground-muted block uppercase font-bold">Wilayah / Kota</span>
                  <span className="text-xs font-bold text-foreground block">{creator.city}</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-secondary border border-border space-y-1">
                  <span className="text-[10px] text-foreground-muted block uppercase font-bold">Instagram Handle</span>
                  <a
                    href={creator.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-pink-600 hover:underline inline-flex items-center gap-1"
                  >
                    <span>@{creator.instagramHandle}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="p-3 rounded-xl bg-surface-secondary border border-border space-y-1">
                  <span className="text-[10px] text-foreground-muted block uppercase font-bold">TikTok Handle</span>
                  <span className="text-xs font-bold text-foreground block">
                    {creator.tiktokHandle ? `@${creator.tiktokHandle}` : "-"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center pt-2">
                <div className="p-3 rounded-xl bg-surface-secondary border border-border">
                  <span className="text-[10px] text-foreground-muted block">Followers IG</span>
                  <span className="text-base font-black text-foreground">{creator.followersFormatted}</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-secondary border border-border">
                  <span className="text-[10px] text-foreground-muted block">Engagement Rate</span>
                  <span className="text-base font-black text-emerald-700 dark:text-emerald-400">{creator.engagementRate}%</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-secondary border border-border">
                  <span className="text-[10px] text-foreground-muted block">Grade SocialBlade</span>
                  <span className="text-base font-black text-foreground">{creator.socialBladeGrade || "B+"}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STATUS HISTORY */}
          {activeTab === "history" && (
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-foreground block">Riwayat Perjalanan Pipeline:</span>
              <div className="space-y-2">
                {(creator.collaboration.statusHistory || []).map((h, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-surface-secondary/70 border border-border flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-foreground block">{h.stage}</span>
                      <p className="text-[11px] text-foreground-secondary">{h.note || "-"}</p>
                    </div>
                    <div className="text-right shrink-0 text-[10px] text-foreground-muted">
                      <span className="font-mono block">{h.timestamp}</span>
                      <span className="text-[9px] block">Oleh: {h.updatedBy || "Staff"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
