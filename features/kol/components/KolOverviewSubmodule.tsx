"use client";

import React from "react";
import {
  Users,
  UserCheck,
  Send,
  Clock,
  CheckCircle2,
  Package,
  Video,
  Award,
  Sparkles,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Instagram,
  Eye,
  Heart,
  Calendar,
  Layers,
} from "lucide-react";
import { Creator, Campaign, PipelineStage } from "../types";
import { PIPELINE_STAGES, CONTENT_CATEGORIES } from "../constants";

interface KolOverviewSubmoduleProps {
  creators: Creator[];
  campaigns: Campaign[];
  onSelectCreator: (creator: Creator) => void;
  onNavigateSubmodule: (tab: any) => void;
}

export const KolOverviewSubmodule: React.FC<KolOverviewSubmoduleProps> = ({
  creators,
  campaigns,
  onSelectCreator,
  onNavigateSubmodule,
}) => {
  // Hitung KPI Metrik Aktual
  const totalRegistered = creators.length;
  const newCandidates = creators.filter((c) => c.collaboration.stage === "candidate_identified").length;
  const readyToContact = creators.filter((c) => c.collaboration.stage === "ready_to_contact").length;
  const messagesSent = creators.filter((c) => c.collaboration.stage === "message_sent").length;
  const waitingResponse = creators.filter((c) => c.collaboration.stage === "waiting_response").length;
  const approvedCollab = creators.filter(
    (c) =>
      c.collaboration.stage === "collab_approved" ||
      c.collaboration.stage === "product_prep" ||
      c.collaboration.stage === "negotiation"
  ).length;
  const productsShipped = creators.filter(
    (c) => c.collaboration.stage === "product_shipped" || c.collaboration.stage === "product_received"
  ).length;
  const publishedContent = creators.filter((c) => c.collaboration.stage === "content_published").length;
  const completedCollab = creators.filter((c) => c.collaboration.stage === "completed").length;

  // Platform Distribution
  const instagramOnly = creators.filter((c) => c.platform === "instagram").length;
  const tiktokOnly = creators.filter((c) => c.platform === "tiktok").length;
  const multiPlatform = creators.filter((c) => c.platform === "multi").length;

  // Visual Priority vs Reach Priority
  const visualPriorityCount = creators.filter((c) => c.evaluation.priorityLevel === "visual").length;
  const reachPriorityCount = creators.filter((c) => c.evaluation.priorityLevel === "reach").length;

  // Kategori Konten
  const categoryStats = CONTENT_CATEGORIES.map((cat) => ({
    ...cat,
    count: creators.filter((c) => c.category === cat.id).length,
  })).filter((c) => c.count > 0);

  // Upcoming follow-ups
  const upcomingFollowups = creators
    .filter(
      (c) =>
        c.collaboration.nextFollowUpDate ||
        c.collaboration.stage === "waiting_response" ||
        c.collaboration.stage === "content_production"
    )
    .slice(0, 5);

  // Latest published content
  const publishedCreators = creators
    .filter((c) => c.collaboration.stage === "content_published" || c.collaboration.stage === "completed")
    .slice(0, 4);

  // Recent activity aggregated from statusHistory
  const recentActivities = creators
    .flatMap((c) =>
      (c.collaboration.statusHistory || []).map((h) => ({
        creatorId: c.id,
        creatorName: c.name,
        handle: c.instagramHandle,
        stage: h.stage,
        timestamp: h.timestamp,
        note: h.note,
        updatedBy: h.updatedBy || "Staff",
      }))
    )
    .sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1))
    .slice(0, 6);

  // Total estimasi jangkauan audiens gabungan
  const totalReachAudience = creators.reduce((acc, c) => acc + (c.instagramFollowers || 0), 0);

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. TOP HERO BANNER & PRIMARY KPI CARDS                                   */}
      {/* ========================================================================= */}
      <div className="rounded-2xl p-6 bg-gradient-to-br from-emerald-950 via-[#124734] to-emerald-900 text-white shadow-warm border border-emerald-500/30 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                KOL CRM · Brand Partnership Engine
              </span>
              <span className="text-xs text-emerald-200/80">
                Sistem Barter Produk Resmi Optik I See You
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-white">
              Ringkasan Operasional Kemitraan Creator &amp; Influencer
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Memantau alur talent scouting kacamata dari pendekatan awal, barter produk kirim ke rumah,
              hingga publikasi konten Reels dan TikTok di seluruh Indonesia.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateSubmodule("messages")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 transition-all shadow-subtle active:scale-95"
            >
              <Send className="w-3.5 h-3.5 text-emerald-700" />
              <span>Generator Pesan WA/DM</span>
            </button>
            <button
              onClick={() => onNavigateSubmodule("pipeline")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-white font-bold text-xs transition-all active:scale-95"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-300" />
              <span>Pipeline Kanban</span>
            </button>
          </div>
        </div>

        {/* 9 Executive Metric Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-5 border-t border-emerald-500/20">
          <div className="p-3 rounded-xl bg-black/25 border border-emerald-400/20">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 block">
              Total Creator
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-white">{totalRegistered}</span>
              <span className="text-[11px] text-emerald-300">kreator</span>
            </div>
            <span className="text-[10px] text-emerald-200/70 block mt-0.5">
              {(totalReachAudience / 1000).toFixed(0)}K Total Jangkauan
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/25 border border-emerald-400/20">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 block">
              Siap Kontak
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-cyan-200">{readyToContact}</span>
              <span className="text-[11px] text-emerald-300">target</span>
            </div>
            <span className="text-[10px] text-emerald-200/70 block mt-0.5">
              {newCandidates} Kandidat baru
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/25 border border-emerald-400/20">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
              Tunggu Respon
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-amber-200">{waitingResponse}</span>
              <span className="text-[11px] text-emerald-300">creator</span>
            </div>
            <span className="text-[10px] text-emerald-200/70 block mt-0.5">
              {messagesSent} Pesan terkirim
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/25 border border-emerald-400/20">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 block">
              Disetujui &amp; Kirim
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-teal-200">{approvedCollab + productsShipped}</span>
              <span className="text-[11px] text-emerald-300">deal barter</span>
            </div>
            <span className="text-[10px] text-emerald-200/70 block mt-0.5">
              {productsShipped} Paket dikirim
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/25 border border-emerald-400/20 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block">
              Konten Tayang &amp; Selesai
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-emerald-300">{publishedContent + completedCollab}</span>
              <span className="text-[11px] text-emerald-300">video</span>
            </div>
            <span className="text-[10px] text-emerald-200/70 block mt-0.5">
              {publishedContent} Live · {completedCollab} Arsip
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PIPELINE FUNNEL VISUALIZATION                                          */}
      {/* ========================================================================= */}
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Distribusi Tahapan Pipeline Kolaborasi (14 Stages)</span>
            </h3>
            <p className="text-xs text-foreground-secondary">
              Pantauan pergerakan setiap creator dari pencarian awal hingga publikasi konten barter.
            </p>
          </div>

          <button
            onClick={() => onNavigateSubmodule("pipeline")}
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Buka Kanban Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 14 Stages Horizontal Mini Tracker */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {PIPELINE_STAGES.map((stage) => {
            const count = creators.filter((c) => c.collaboration.stage === stage.id).length;
            return (
              <div
                key={stage.id}
                onClick={() => onNavigateSubmodule("pipeline")}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer hover:shadow-subtle ${stage.colorBg} ${stage.colorBorder}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted truncate">
                    {stage.shortLabel}
                  </span>
                  <span className={`text-xs font-black ${stage.colorText}`}>
                    {count}
                  </span>
                </div>
                <div className="w-full bg-surface-subtle h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    style={{ width: `${totalRegistered > 0 ? (count / totalRegistered) * 100 : 0}%` }}
                    className="h-full bg-emerald-600 rounded-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. PLATFORM & STRATEGIC CATEGORY BREAKDOWN                                */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Strategi Seleksi (Visual vs Reach) */}
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Prioritas Seleksi Kreator</span>
            </h4>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-surface-secondary text-foreground-secondary">
              Master Plan §4
            </span>
          </div>

          <p className="text-[11px] text-foreground-secondary leading-relaxed">
            Menghindari penolakan otomatis akun mikro. Membagi creator menjadi dua kategori utama yang sama-sama bernilai tinggi.
          </p>

          <div className="space-y-2.5 pt-1">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-purple-900 dark:text-purple-300 block">
                  Kategori A — Visual Priority
                </span>
                <span className="text-[10px] text-foreground-muted">
                  Fotogenik, aesthetic styling, micro-influencer
                </span>
              </div>
              <span className="text-base font-black text-purple-700 dark:text-purple-300">
                {visualPriorityCount}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-900 dark:text-blue-300 block">
                  Kategori B — Reach Priority
                </span>
                <span className="text-[10px] text-foreground-muted">
                  Followers besar, jangkauan views luas
                </span>
              </div>
              <span className="text-base font-black text-blue-700 dark:text-blue-300">
                {reachPriorityCount}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Distribusi Platform */}
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Instagram className="w-4 h-4 text-pink-500" />
              <span>Platform Media Sosial</span>
            </h4>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-surface-secondary text-foreground-secondary">
              Kanal Distribusi
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-foreground-secondary font-medium">Multi-Platform (IG + TikTok)</span>
                <span className="font-bold text-foreground">{multiPlatform} ({totalRegistered > 0 ? Math.round((multiPlatform / totalRegistered) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-surface-secondary h-2 rounded-full overflow-hidden">
                <div style={{ width: `${(multiPlatform / totalRegistered) * 100}%` }} className="bg-emerald-600 h-full rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-foreground-secondary font-medium">Instagram Utama</span>
                <span className="font-bold text-foreground">{instagramOnly} ({totalRegistered > 0 ? Math.round((instagramOnly / totalRegistered) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-surface-secondary h-2 rounded-full overflow-hidden">
                <div style={{ width: `${(instagramOnly / totalRegistered) * 100}%` }} className="bg-pink-600 h-full rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-foreground-secondary font-medium">TikTok Utama</span>
                <span className="font-bold text-foreground">{tiktokOnly} ({totalRegistered > 0 ? Math.round((tiktokOnly / totalRegistered) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-surface-secondary h-2 rounded-full overflow-hidden">
                <div style={{ width: `${(tiktokOnly / totalRegistered) * 100}%` }} className="bg-slate-800 h-full rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Model Kolaborasi Barter Produk */}
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>SOP Barter Produk Resmi</span>
            </h4>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
              100% Free Shipping
            </span>
          </div>

          <div className="space-y-2 text-xs text-foreground-secondary">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Tidak Wajib Visit Store:</strong> Creator bebas dari seluruh Indonesia.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Kirim ke Rumah:</strong> Paket kacamata lengkap dikirim via kurir.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Deliverables:</strong> 1 Reels Try-On / TikTok Review + Tag Akun.</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <button
              onClick={() => onNavigateSubmodule("messages")}
              className="w-full py-1.5 px-3 rounded-xl bg-surface-secondary hover:bg-surface border border-border text-xs font-bold text-foreground transition-all flex items-center justify-center gap-1.5"
            >
              <span>Lihat 9 Template Pesan Barter</span>
              <ArrowRight className="w-3 h-3 text-emerald-600" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. UPCOMING FOLLOW-UPS & RECENT COLLABORATION ACTIVITIES                  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Upcoming Follow-ups & Reminders */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-foreground">Pengingat Follow-up &amp; Deadline</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300">
              {upcomingFollowups.length} Tertunda
            </span>
          </div>

          <div className="space-y-2">
            {upcomingFollowups.map((creator) => (
              <div
                key={creator.id}
                onClick={() => onSelectCreator(creator)}
                className="p-3 rounded-xl bg-surface-secondary/60 hover:bg-surface border border-border/80 transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                    {creator.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-foreground truncate block group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                      {creator.name} (@{creator.instagramHandle})
                    </span>
                    <span className="text-[11px] text-foreground-muted block">
                      {creator.city} · {creator.followersFormatted} followers
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 block">
                    {creator.collaboration.stage === "waiting_response"
                      ? "Tunggu Balas"
                      : creator.collaboration.stage === "content_production"
                      ? "Batas Produksi"
                      : "Jadwal Follow-up"}
                  </span>
                  <span className="text-[10px] text-foreground-muted block mt-0.5 font-mono">
                    {creator.collaboration.nextFollowUpDate || creator.collaboration.contentDeadline || "Hari Ini"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Latest Published Content */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-foreground">Konten Barter yang Sudah Tayang</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
              {publishedCreators.length} Terverifikasi
            </span>
          </div>

          <div className="space-y-2">
            {publishedCreators.length === 0 ? (
              <div className="p-6 text-center text-xs text-foreground-muted bg-surface-secondary/40 rounded-xl">
                Belum ada video yang berstatus tayang di periode berjalan.
              </div>
            ) : (
              publishedCreators.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl bg-surface-secondary/60 border border-border/80 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      <Video className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-foreground truncate block">
                        {c.name} (@{c.instagramHandle})
                      </span>
                      <p className="text-[10px] text-foreground-muted truncate">
                        {c.collaboration.productSent}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {c.collaboration.viewsCount && (
                      <div className="text-right">
                        <span className="text-xs font-black text-foreground block">
                          {c.collaboration.viewsCount.toLocaleString("id-ID")}
                        </span>
                        <span className="text-[9px] text-foreground-muted block">views</span>
                      </div>
                    )}

                    <a
                      href={c.collaboration.publishedUrl || c.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-surface border border-border hover:bg-surface-secondary text-foreground-secondary hover:text-emerald-600 transition-colors"
                      title="Buka Video Live"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
