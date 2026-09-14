"use client";

import React, { useState } from "react";
import {
  Briefcase,
  TrendingUp,
  DollarSign,
  Crown,
  Printer,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Flame,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  Share2,
  Calendar,
} from "lucide-react";

interface ExecutiveMeetingRecapProps {
  executiveRecap: {
    meetingTarget: string;
    latestTotalNetworkFollowers: {
      instagram: number;
      tiktok: number;
    };
    topViralReels: any[];
    frequentStoryInquiries: { topic: string; count: number }[];
    obstacleLogs: any[];
  };
  picTracker: any[];
}

export const ExecutiveMeetingRecap: React.FC<ExecutiveMeetingRecapProps> = ({
  executiveRecap,
  picTracker,
}) => {
  const [activeAudienceTab, setActiveAudienceTab] = useState<"all" | "hrd" | "head" | "finance" | "owner">("all");

  const pendingPics = picTracker.filter((p) => !p.isUpToDate);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:m-0 print:p-0">
      {/* Top Meeting Header */}
      <div className="bg-surface border border-border rounded-container p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-light text-brand">
              Executive Presentation
            </span>
            <span className="text-xs text-foreground-muted">
              Dokumen Rapat Mingguan
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-foreground mt-1">
            Laporan Evaluasi Mingguan Dewan Direksi & Head
          </h2>
          <p className="text-xs text-foreground-secondary mt-0.5">
            Disiapkan untuk Rapat Evaluasi Hari Selasa: <strong className="text-foreground">HRD · Head of Marketing · Finance · Owner</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-control border border-border bg-surface hover:bg-surface-secondary text-xs font-semibold text-foreground transition-colors shadow-subtle"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / PDF Ringkasan</span>
          </button>
        </div>
      </div>

      {/* Network Milestone KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-surface border border-border rounded-container p-4 shadow-subtle">
          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">
            Total Followers Instagram (5 Akun)
          </span>
          <div className="text-xl font-bold text-foreground mt-1 tabular-nums">
            {executiveRecap.latestTotalNetworkFollowers.instagram.toLocaleString("id-ID")}
          </div>
          <span className="text-[11px] text-emerald-800 font-medium mt-1 block">
            Pusat: 226k · PBG: 6.1k · CLP: 7.3k · TGL: 3.9k · WNS: 1.2k
          </span>
        </div>

        <div className="bg-surface border border-border rounded-container p-4 shadow-subtle">
          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">
            Total Followers TikTok
          </span>
          <div className="text-xl font-bold text-foreground mt-1 tabular-nums">
            {executiveRecap.latestTotalNetworkFollowers.tiktok.toLocaleString("id-ID")}
          </div>
          <span className="text-[11px] text-foreground-secondary mt-1 block">
            PWT: 87.2k · Lunar TGL: 3.0k · PBG: 979
          </span>
        </div>

        <div className="bg-surface border border-border rounded-container p-4 shadow-subtle">
          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">
            Kepatuhan Laporan 6 PIC
          </span>
          <div className="text-xl font-bold text-foreground mt-1 tabular-nums">
            {picTracker.length - pendingPics.length} / {picTracker.length} PIC
          </div>
          <span
            className={`text-[11px] font-semibold mt-1 block ${
              pendingPics.length > 0 ? "text-amber-800" : "text-emerald-800"
            }`}
          >
            {pendingPics.length > 0
              ? `${pendingPics.length} PIC perlu diingatkan (CLP & PWT)`
              : "Semua cabang tuntas tepat waktu"}
          </span>
        </div>

        <div className="bg-surface border border-border rounded-container p-4 shadow-subtle">
          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">
            Top Peak Reels Viewers Pekan Ini
          </span>
          <div className="text-xl font-bold text-foreground mt-1 tabular-nums">
            128.980 Viewers
          </div>
          <span className="text-[11px] text-emerald-800 font-medium mt-1 block">
            Lunar Eyewear Tegal (Format: POV)
          </span>
        </div>
      </div>

      {/* Audience Role Tabs */}
      <div className="flex items-center gap-1 border-b border-border pb-1">
        {[
          { key: "all", label: "Semua Agenda Rapat", icon: Briefcase },
          { key: "hrd", label: "Fokus HRD (Disiplin & Tim)", icon: Briefcase },
          { key: "head", label: "Fokus Head (Tren & Yang Rame)", icon: TrendingUp },
          { key: "finance", label: "Fokus Finance (Biaya & Bonus)", icon: DollarSign },
          { key: "owner", label: "Fokus Owner (Strategis)", icon: Crown },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveAudienceTab(tab.key as any)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-control text-xs font-semibold transition-all ${
                activeAudienceTab === tab.key
                  ? "bg-foreground text-surface shadow-subtle"
                  : "text-foreground-secondary hover:text-foreground hover:bg-surface-secondary"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: HRD & TEAM DISCIPLINE */}
      {(activeAudienceTab === "all" || activeAudienceTab === "hrd") && (
        <div className="bg-surface border border-border rounded-container p-5 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-control bg-surface-secondary flex items-center justify-center font-bold text-foreground">
                1
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Fokus HRD: Disiplin Input Laporan & Kendala Creator Cabang
                </h3>
                <p className="text-xs text-foreground-secondary">
                  Evaluasi kedisiplinan dan hambatan teknis yang dihadapi 6 content creator di lapangan.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-secondary text-foreground-secondary">
              PIC Scorecard
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Submission per PIC */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-foreground block">
                Rekap Keaktifan PIC Spreadsheet:
              </span>
              <div className="space-y-1.5">
                {picTracker.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-control border border-border bg-surface-secondary text-xs"
                  >
                    <div>
                      <span className="font-semibold text-foreground">{p.pic}</span>
                      <span className="text-foreground-muted ml-1.5">({p.role})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-foreground-secondary tabular-nums">
                        {p.latestDate}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.2 rounded-full uppercase ${
                          p.isUpToDate
                            ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                            : "bg-amber-100 text-amber-900 border border-amber-300"
                        }`}
                      >
                        {p.isUpToDate ? "Lengkap" : `Telat ${p.daysBehind}h`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kendala & HRD Action Plan */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-foreground block">
                Catatan Kendala Asli dari Lembar Kerja Creator:
              </span>
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {executiveRecap.obstacleLogs.slice(0, 4).map((obs, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-control border border-border bg-surface text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px] text-foreground-muted">
                      <span className="font-semibold text-foreground">{obs.pic} ({obs.role})</span>
                      <span>{obs.date}</span>
                    </div>
                    <p className="text-foreground-secondary text-[11px] italic">
                      "{obs.obstacle}"
                    </p>
                    {obs.areaToImprove && obs.areaToImprove !== "-" && (
                      <div className="text-[10px] text-foreground-muted">
                        Target perbaikan: {obs.areaToImprove}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* HRD Actionable Recommendation */}
              <div className="p-3 rounded-control bg-surface-secondary border border-border text-xs text-foreground space-y-1 mt-2">
                <span className="font-bold text-foreground block">
                  Rekomendasi HRD untuk Meeting:
                </span>
                <p className="text-foreground-secondary text-[11px]">
                  1. Berikan apresiasi kepada Mba Ajun (PBG), Mba Amanda (TGL), Mba Febi (WNS), dan Mba Nuha (PWT Story) atas kedisiplinan input 100%.
                </p>
                <p className="text-foreground-secondary text-[11px]">
                  2. Jadwalkan klinik mini editing CapCut/Lightroom 1 jam via Zoom/tatap muka untuk Mba Nuha & Mba Febi yang menyampaikan kendala opening video estetik.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: HEAD OF MARKETING (YANG RAME APA) */}
      {(activeAudienceTab === "all" || activeAudienceTab === "head") && (
        <div className="bg-surface border border-border rounded-container p-5 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-control bg-surface-secondary flex items-center justify-center font-bold text-foreground">
                2
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Fokus Head of Marketing: Konten yang Paling Rame & Pola Pemenang
                </h3>
                <p className="text-xs text-foreground-secondary">
                  Analisis reels dengan lonjakan penonton tertinggi dan pertanyaan paling banyak ditanyakan di Story.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
              Content Winners
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Viral Reels */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-800" />
                Reels dengan Viewers Tertinggi Pekan Ini:
              </span>
              <div className="space-y-2">
                {executiveRecap.topViralReels.slice(0, 4).map((r, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-control border border-border bg-surface-secondary text-xs flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-semibold text-foreground line-clamp-1">
                        {r.title}
                      </div>
                      <div className="text-[10px] text-foreground-muted mt-0.5">
                        {r.branch} · PIC: {r.pic} · {r.date}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-foreground tabular-nums">
                        {r.viewers.toLocaleString("id-ID")} viewers
                      </div>
                      <span className="text-[10px] font-medium text-emerald-800">
                        {r.likes} likes
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Inquiries from Story */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-foreground" />
                Pertanyaan Paling Sering Masuk di DM Story (Mba Nuha):
              </span>
              <div className="space-y-1.5">
                {executiveRecap.frequentStoryInquiries.slice(0, 5).map((q, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-control border border-border bg-surface text-xs"
                  >
                    <span className="font-medium text-foreground">{q.topic}</span>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-surface-secondary text-foreground-secondary border border-border">
                      {q.count} hari ditanyakan
                    </span>
                  </div>
                ))}
              </div>

              {/* Head Actionable Strategy */}
              <div className="p-3 rounded-control bg-surface-secondary border border-border text-xs text-foreground space-y-1 mt-2">
                <span className="font-bold text-foreground block">
                  Instruksi Head of Marketing:
                </span>
                <p className="text-foreground-secondary text-[11px]">
                  1. Format <strong>POV & Try-on Frame</strong> wajib diduplikasi ke cabang Purwokerto dan Cilacap karena terbukti melesat di Tegal (128k viewers).
                </p>
                <p className="text-foreground-secondary text-[11px]">
                  2. Buat template Story khusus "Price List Lensa & Rekomendasi Frame Wajah Lebar" yang di-pin di Sorotan / Highlight profil agar calon pembeli langsung paham sebelum DM.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: FINANCE (EFISIENSI BIAYA & BONUS CREATOR) */}
      {(activeAudienceTab === "all" || activeAudienceTab === "finance") && (
        <div className="bg-surface border border-border rounded-container p-5 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-control bg-surface-secondary flex items-center justify-center font-bold text-foreground">
                3
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Fokus Finance: Efisiensi Akuisisi Follower & Alokasi Insentif
                </h3>
                <p className="text-xs text-foreground-secondary">
                  Evaluasi return on engagement, insentif performa creator, dan penghematan biaya iklan berbayar.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-secondary text-foreground-secondary">
              Budget & Cost Efficiency
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="p-3.5 rounded-control border border-border bg-surface-secondary">
              <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                Nilai Jangkauan Organik (Equivalent Ad Spend)
              </span>
              <div className="text-base font-bold text-foreground mt-1">
                Rp 8.450.000 / bln
              </div>
              <p className="text-[11px] text-foreground-secondary mt-1">
                Diperoleh tanpa belanja iklan bersponsor (Meta Ads), murni dari reels konsisten 2 video/hari.
              </p>
            </div>

            <div className="p-3.5 rounded-control border border-border bg-surface-secondary">
              <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                Bonus & Insentif Performa Pekan Ini
              </span>
              <div className="text-base font-bold text-foreground mt-1">
                Rp 750.000 (3 Creator)
              </div>
              <p className="text-[11px] text-foreground-secondary mt-1">
                Kualifikasi: Mba Amanda (Viral 128k viewers), Mba Ajun (100% tepat waktu), Mba Nuha (DM engagement tinggi).
              </p>
            </div>

            <div className="p-3.5 rounded-control border border-border bg-surface-secondary">
              <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                Rekomendasi Alokasi Petty Cash Cabang
              </span>
              <div className="text-base font-bold text-foreground mt-1">
                Rp 300.000 / Cabang
              </div>
              <p className="text-[11px] text-foreground-secondary mt-1">
                Untuk properti konten (kopi estetis, properti unboxing, casing kacamata tester).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: OWNER & BOARD ACTION PLAN */}
      {(activeAudienceTab === "all" || activeAudienceTab === "owner") && (
        <div className="bg-surface border border-border rounded-container p-5 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-control bg-surface-secondary flex items-center justify-center font-bold text-foreground">
                4
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Fokus Owner: Keputusan Strategis & Rencana Aksi 7 Hari ke Depan
                </h3>
                <p className="text-xs text-foreground-secondary">
                  Checklist instruksi kerja untuk diputuskan bersama dalam meeting Selasa ini.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-light text-brand">
              Action Plan 7 Hari
            </span>
          </div>

          <div className="space-y-2">
            {[
              {
                target: "Cabang Cilacap & Purwokerto",
                action: "Follow up pengisian lembar kerja Mba Arum dan Mba Ilya agar update tidak tertunda sebelum jam 17:00 WIB.",
                pic: "HRD",
              },
              {
                target: "Lunar Eyewear Tegal",
                action: "Kirim stok frame tambahan tipe oval slim acetate yang viral di video 128k penonton untuk antisipasi lonjakan pembelian.",
                pic: "Finance & Logistik",
              },
              {
                target: "Purbalingga & Wonosobo",
                action: "Dorong kolaborasi antar-cabang: adaptasi ide kacamata abu vulkanik Wonosobo & tren beda umur Purbalingga.",
                pic: "Head of Marketing",
              },
              {
                target: "Pusat Purwokerto (@iseeyou.glasses)",
                action: "Buat highlight Instagram resmi 'Konsultasi Resep Mata RO' untuk memperkuat kredibilitas medis profesional.",
                pic: "Owner & Dokter RO",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-control border border-border bg-surface-secondary flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-surface border border-border flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-foreground">{item.target}:</span>{" "}
                    <span className="text-foreground-secondary">{item.action}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface border border-border text-foreground-secondary shrink-0">
                  PIC: {item.pic}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
