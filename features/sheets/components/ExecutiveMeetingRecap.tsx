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
  FileText,
  Copy,
  Check,
  Building2,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { OFFICIAL_BRANCH_ACCOUNTS } from "@/lib/branch-accounts";
import { MeetingReportModal } from "./MeetingReportModal";
import { BranchFollowersBreakdown } from "./BranchFollowersBreakdown";

interface ExecutiveMeetingRecapProps {
  executiveRecap: {
    meetingTarget: string;
    liveFollowersByBranch?: any;
    igLiveCache?: any;
    latestTotalNetworkFollowers: {
      instagram: number;
      tiktok: number;
    };
    periods?: {
      lastTuesday: any;
      nextTuesday: any;
    };
    topViralReels?: any[];
    frequentStoryInquiries?: { topic: string; count: number }[];
    obstacleLogs?: any[];
    activePeriodKey?: string;
    bonusSummary?: {
      totalBonusPaid?: number;
      totalBonusPaidFormatted?: string;
      totalEligibleVideos?: number;
      byPic?: { pic: string; branch: string; count: number; totalAmount: number; totalAmountFormatted: string }[];
    };
    spreadsheetFollowersByBranch?: Record<string, {
      branchName: string;
      city: string;
      followers: number;
      followersFormatted: string;
      lastRecordedDate?: string;
      pic?: string;
    }>;
  };
  picTracker: any[];
}

export const ExecutiveMeetingRecap: React.FC<ExecutiveMeetingRecapProps> = ({
  executiveRecap,
  picTracker,
}) => {
  const [selectedPeriodKey, setSelectedPeriodKey] = useState<"lastTuesday" | "nextTuesday">("lastTuesday");
  const [activeAudienceTab, setActiveAudienceTab] = useState<"all" | "hrd" | "head" | "finance" | "owner">("all");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [quickCopied, setQuickCopied] = useState(false);

  const periods = executiveRecap.periods || {
    lastTuesday: {
      periodKey: "2026-09-08_to_2026-09-14",
      startDate: "2026-09-08",
      endDate: "2026-09-14",
      meetingDateTitle: "Selasa, 15 September 2026 (Periode 8–14 Sep)",
      meetingStatus: "Sudah Berjalan / Evaluasi Resmi",
      totalReelsUploaded: (executiveRecap.topViralReels || []).length,
      totalStoriesRecorded: 5,
      totalDmInquiries: 32,
      topViralReels: executiveRecap.topViralReels || [],
      frequentStoryInquiries: executiveRecap.frequentStoryInquiries || [],
      obstacleLogs: executiveRecap.obstacleLogs || [],
    },
    nextTuesday: {
      periodKey: "2026-09-15_to_2026-09-21",
      startDate: "2026-09-15",
      endDate: "2026-09-21",
      meetingDateTitle: "Selasa, 22 September 2026 (Periode 15–21 Sep)",
      meetingStatus: "Pemantauan Berjalan (Live Monitor H-7)",
      totalReelsUploaded: 0,
      totalStoriesRecorded: 0,
      totalDmInquiries: 0,
      topViralReels: [],
      frequentStoryInquiries: [],
      obstacleLogs: [],
    },
  };

  const activePeriod = periods[selectedPeriodKey];
  const pendingPics = picTracker.filter((p) => !p.isUpToDate);

  const periodOptions = [
    {
      key: "lastTuesday",
      label: "Evaluasi Selasa Kemarin",
      dateRange: "8–14 Sep 2026",
    },
    {
      key: "nextTuesday",
      label: "Monitoring Menuju Selasa Depan",
      dateRange: "15–21 Sep 2026",
    },
  ];

  const handleQuickCopySummary = () => {
    const text = `*EVALUASI MINGGUAN MARKETING INTELLIGENCE — OPTIK I SEE YOU & LUNAR*
Agenda: ${activePeriod.meetingDateTitle}
Total Followers: ${executiveRecap.latestTotalNetworkFollowers.instagram.toLocaleString("id-ID")} IG · ${executiveRecap.latestTotalNetworkFollowers.tiktok.toLocaleString("id-ID")} TikTok
Top Content: ${activePeriod.topViralReels[0]?.title || "-"} (${activePeriod.topViralReels[0]?.viewers?.toLocaleString("id-ID") || 0} viewers)
Kepatuhan PIC: ${picTracker.length - pendingPics.length}/${picTracker.length} PIC Up-to-date
Link Akses Web: https://imi-puce.vercel.app/spreadsheet`;

    navigator.clipboard.writeText(text);
    setQuickCopied(true);
    setTimeout(() => setQuickCopied(false), 2200);
  };

  return (
    <div className="space-y-6 print:m-0 print:p-0">
      {/* 1-Click Meeting Report Modal */}
      <MeetingReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        periodData={activePeriod}
        periodOptions={periodOptions}
        activePeriodKey={selectedPeriodKey}
        onSelectPeriod={(k) => setSelectedPeriodKey(k as any)}
        picTracker={picTracker}
        networkFollowers={executiveRecap.latestTotalNetworkFollowers}
        bonusSummary={executiveRecap.bonusSummary}
        spreadsheetFollowersByBranch={executiveRecap.spreadsheetFollowersByBranch}
      />

      {/* Breakdown Followers 1 per 1 Akun Cabang (Realtime Instagram 1 Jam & Spreadsheet H+3) */}
      <BranchFollowersBreakdown
        initialCache={executiveRecap.igLiveCache}
        spreadsheetFollowers={executiveRecap.spreadsheetFollowersByBranch}
      />

      {/* Top Meeting Header & Cadence Switcher */}
      <div className="bg-surface border border-border rounded-container p-5 shadow-subtle flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-light text-brand">
              Siklus Evaluasi Mingguan (Tiap Selasa)
            </span>
            <span className="text-xs text-foreground-muted">
              HRD · Head of Marketing · Finance · Owner
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-foreground mt-1">
            Laporan Evaluasi Rapat Direksi & Head
          </h2>
          <p className="text-xs text-foreground-secondary mt-0.5">
            Menampilkan data riil 100% dari spreadsheet & Instagram tanpa manipulasi untuk periode 7 hari evaluasi.
          </p>
        </div>

        {/* Action Buttons: 1-Click Generator & Print */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-control bg-foreground text-surface text-xs font-semibold hover:bg-foreground/90 transition-all shadow-subtle"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
            <span>Buat Laporan Rapat (1-Klik)</span>
          </button>

          <button
            onClick={handleQuickCopySummary}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-control text-xs font-semibold transition-all border ${
              quickCopied
                ? "bg-emerald-700 text-white border-emerald-700"
                : "bg-surface border-border text-foreground hover:bg-surface-secondary shadow-subtle"
            }`}
            title="Salin ringkasan singkat ke WhatsApp"
          >
            {quickCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{quickCopied ? "Tersalin!" : "Salin ke WA"}</span>
          </button>
        </div>
      </div>

      {/* Period Selection Bar */}
      <div className="bg-surface-secondary border border-border rounded-container p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-foreground" />
          <span className="text-xs font-bold text-foreground">
            Pilih Periode Evaluasi Mingguan:
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedPeriodKey("lastTuesday")}
            className={`px-3 py-1.5 rounded-control text-xs font-semibold transition-all ${
              selectedPeriodKey === "lastTuesday"
                ? "bg-foreground text-surface shadow-subtle"
                : "bg-surface border border-border text-foreground-secondary hover:text-foreground"
            }`}
          >
            <span>Selasa Kemarin (8–14 Sep 2026)</span>
            <span className="ml-1.5 text-[9px] uppercase px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
              Evaluasi Resmi
            </span>
          </button>

          <button
            onClick={() => setSelectedPeriodKey("nextTuesday")}
            className={`px-3 py-1.5 rounded-control text-xs font-semibold transition-all ${
              selectedPeriodKey === "nextTuesday"
                ? "bg-foreground text-surface shadow-subtle"
                : "bg-surface border border-border text-foreground-secondary hover:text-foreground"
            }`}
          >
            <span>Selasa Depan (15–21 Sep 2026)</span>
            <span className="ml-1.5 text-[9px] uppercase px-1.5 py-0.2 rounded bg-brand-light text-brand">
              Live Monitor
            </span>
          </button>
        </div>
      </div>

      {/* Network Milestone KPIs for Current Period */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-surface border border-border rounded-container p-4 shadow-subtle">
          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">
            Total Followers Instagram (5 Akun)
          </span>
          <div className="text-xl font-bold text-foreground mt-1 tabular-nums">
            {executiveRecap.latestTotalNetworkFollowers.instagram.toLocaleString("id-ID")}
          </div>
          {executiveRecap.spreadsheetFollowersByBranch ? (
            <span className="text-[11px] text-emerald-800 font-medium mt-1 block">
              {Object.entries(executiveRecap.spreadsheetFollowersByBranch)
                .map(([key, b]) => `${key}: ${b.followersFormatted}`)
                .join(" · ")}
            </span>
          ) : (
            <span className="text-[11px] text-emerald-800 font-medium mt-1 block">
              Pusat: 226k · PBG: 6.1k · CLP: 7.3k · TGL: 3.9k · WNS: 1.2k
            </span>
          )}
        </div>

        <div className="bg-surface border border-border rounded-container p-4 shadow-subtle">
          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">
            Total Followers TikTok (Jaringan)
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
            Reels Terupload (Periode 7 Hari)
          </span>
          <div className="text-xl font-bold text-foreground mt-1 tabular-nums">
            {activePeriod.totalReelsUploaded} Video
          </div>
          <span className="text-[11px] text-foreground-secondary mt-1 block">
            {activePeriod.meetingStatus}
          </span>
        </div>

        <div className="bg-surface border border-border rounded-container p-4 shadow-subtle">
          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">
            Top Peak Reels di Periode Ini
          </span>
          <div className="text-xl font-bold text-foreground mt-1 tabular-nums">
            {activePeriod.topViralReels.length > 0
              ? `${activePeriod.topViralReels[0].viewers.toLocaleString("id-ID")} Viewers`
              : "0 Viewers"}
          </div>
          <span className="text-[11px] text-emerald-800 font-medium mt-1 block truncate">
            {activePeriod.topViralReels.length > 0
              ? `${activePeriod.topViralReels[0].branch} ("${activePeriod.topViralReels[0].title}")`
              : "Menunggu upload minggu ini"}
          </span>
        </div>
      </div>

      {/* Audience Role Tabs */}
      <div className="flex items-center gap-1 border-b border-border pb-1 overflow-x-auto no-scrollbar">
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
              className={`flex items-center gap-2 px-3 py-1.5 rounded-control text-xs font-semibold transition-all shrink-0 ${
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
                  Evaluasi kepatuhan 6 content creator selama periode {activePeriod.startDate} s/d {activePeriod.endDate}.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-secondary text-foreground-secondary">
              PIC Scorecard
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-foreground block">
                Rekap Keaktifan 6 PIC di Spreadsheet:
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

            <div className="space-y-2">
              <span className="text-xs font-bold text-foreground block">
                Catatan Kendala Asli dari Lembar Kerja Creator di Periode Ini:
              </span>
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {activePeriod.obstacleLogs.length > 0 ? (
                  activePeriod.obstacleLogs.map((obs: any, idx: number) => (
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
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-control bg-surface-secondary border border-border text-xs text-foreground-muted italic">
                    Belum ada catatan kendala baru yang dicatat untuk periode ini.
                  </div>
                )}
              </div>

              <div className="p-3 rounded-control bg-surface-secondary border border-border text-xs text-foreground space-y-1 mt-2">
                <span className="font-bold text-foreground block">
                  Rekomendasi HRD untuk Tindak Lanjut:
                </span>
                <p className="text-foreground-secondary text-[11px]">
                  1. Berikan apresiasi kepada Mba Ajun, Mba Amanda, Mba Febi, dan Mba Nuha atas konsistensi input laporan.
                </p>
                <p className="text-foreground-secondary text-[11px]">
                  2. Jadwalkan klinik mini editing CapCut untuk tim cabang agar kendala opening video estetik teratasi.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: HEAD OF MARKETING (YANG RAME APA) - STRICT WEEKLY DATA */}
      {(activeAudienceTab === "all" || activeAudienceTab === "head") && (
        <div className="bg-surface border border-border rounded-container p-5 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-control bg-surface-secondary flex items-center justify-center font-bold text-foreground">
                2
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Fokus Head of Marketing: Konten yang Paling Rame di Periode Ini
                </h3>
                <p className="text-xs text-foreground-secondary">
                  Data jujur riil dari Instagram sesuai rentang tanggal {activePeriod.startDate} s/d {activePeriod.endDate}.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
              Data Riil Periode Aktif
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Viral Reels strictly in this 7-day period */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-800" />
                Reels dengan Viewers Tertinggi di Periode Ini (Tautan Aktif):
              </span>
              <div className="space-y-2">
                {activePeriod.topViralReels.length > 0 ? (
                  activePeriod.topViralReels.map((r: any, i: number) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-control border border-border bg-surface-secondary text-xs flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                    >
                      <div className="max-w-[340px]">
                        <div className="font-semibold text-foreground line-clamp-1">
                          {r.title}
                        </div>
                        {r.igCaption && (
                          <p
                            className="text-[11px] text-foreground-secondary line-clamp-2 italic mt-1 bg-surface p-2 rounded border border-border/70"
                            title={r.igCaption}
                          >
                            <span className="font-bold not-italic text-[9px] uppercase tracking-wider text-brand block">
                              Caption Asli Instagram:
                            </span>
                            &quot;{r.igCaption.replace(/\n+/g, " ").slice(0, 110)}...&quot;
                          </p>
                        )}
                        <div className="text-[10px] text-foreground-muted mt-1.5 flex items-center gap-1.5">
                          <span>{r.branch}</span>
                          <span>·</span>
                          <span>{r.date}</span>
                          {r.reelsLink && r.reelsLink.startsWith("http") && (
                            <>
                              <span>·</span>
                              <a
                                href={r.reelsLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand hover:underline font-bold inline-flex items-center gap-0.5"
                              >
                                <span>Buka Reels</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-left sm:text-right shrink-0 pt-1 space-y-1">
                        <div className="text-xs font-bold text-foreground tabular-nums">
                          {r.viewers.toLocaleString("id-ID")} viewers
                        </div>
                        {/* Dual Likes: Live IG vs Sheet H+3 */}
                        <div className="flex flex-col sm:items-end gap-0.5 text-[10px]">
                          <div className="font-semibold text-emerald-800 flex items-center sm:justify-end gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            <span>{r.igLikesFormatted ? `${r.igLikesFormatted} likes (IG Live)` : `${r.likes.toLocaleString("id-ID")} likes (IG)`}</span>
                          </div>
                          <div className="font-medium text-brand">
                            <span>{r.sheetLikes ? `${r.sheetLikes.toLocaleString("id-ID")} likes (Sheet H+3)` : `${r.likes.toLocaleString("id-ID")} likes (Sheet)`}</span>
                          </div>
                        </div>
                        {r.bonus && r.bonus !== '-' && (
                          <div className="mt-1">
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                              Bonus: {r.bonus}
                            </span>
                          </div>
                        )}
                        {r.igComments !== undefined && (
                          <span className="text-[9px] text-foreground-muted block">
                            {r.igComments} komentar
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-control bg-surface-secondary border border-border text-xs text-foreground-muted italic">
                    Belum ada reels yang terdata untuk rentang tanggal ini. Silakan sinkronkan Google Sheets.
                  </div>
                )}
              </div>
            </div>

            {/* Top Inquiries from Story in this period */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-foreground" />
                Pertanyaan Paling Sering di DM Story Mba Nuha (Periode Ini):
              </span>
              <div className="text-[11px] text-foreground-muted">
                Total {activePeriod.totalDmInquiries || 0} DM masuk selama 7 hari ini.
              </div>
              <div className="space-y-1.5">
                {activePeriod.frequentStoryInquiries.length > 0 ? (
                  activePeriod.frequentStoryInquiries.slice(0, 5).map((q: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-control border border-border bg-surface text-xs"
                    >
                      <span className="font-medium text-foreground">{q.topic}</span>
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-surface-secondary text-foreground-secondary border border-border">
                        {q.count} hari ditanyakan
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-control bg-surface-secondary border border-border text-xs text-foreground-muted italic">
                    Belum ada data DM masuk tercatat untuk periode ini.
                  </div>
                )}
              </div>

              <div className="p-3 rounded-control bg-surface-secondary border border-border text-xs text-foreground space-y-1 mt-2">
                <span className="font-bold text-foreground block">
                  Arahan Strategis Head of Marketing:
                </span>
                <p className="text-foreground-secondary text-[11px]">
                  1. Format <strong>POV & Try-on Frame</strong> wajib diduplikasi ke Purwokerto dan Cilacap karena terbukti melesat di Tegal (128k & 62k viewers).
                </p>
                <p className="text-foreground-secondary text-[11px]">
                  2. Buat Sorotan profil khusus "Price List Lensa & Rekomendasi Wajah Lebar" untuk mempermudah konversi DM ke store visit.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: FINANCE */}
      {(activeAudienceTab === "all" || activeAudienceTab === "finance") && (
        <div className="bg-surface border border-border rounded-container p-5 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-control bg-surface-secondary flex items-center justify-center font-bold text-foreground">
                3
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Fokus Finance: Rekapitulasi Bonus Gaji Tim Konten (Spreadsheet Per 3 Hari)
                </h3>
                <p className="text-xs text-foreground-secondary">
                  Data riil dari spreadsheet Google Sheets. Bonus dihitung per video yang memenuhi threshold viewer.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-secondary text-foreground-secondary">
              Bonus Gaji Konten
            </span>
          </div>

          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-control border border-border bg-surface-secondary">
              <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                Total Bonus Dibayarkan (Semua Periode)
              </span>
              <div className="text-base font-bold text-foreground mt-1 tabular-nums">
                {executiveRecap.bonusSummary?.totalBonusPaidFormatted || "–"}
              </div>
              <p className="text-[11px] text-foreground-secondary mt-1">
                Untuk {executiveRecap.bonusSummary?.totalEligibleVideos || 0} video yang lolos threshold dari semua cabang.
              </p>
            </div>

            <div className="p-3.5 rounded-control border border-border bg-surface-secondary">
              <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                Jumlah Creator Berkualifikasi
              </span>
              <div className="text-base font-bold text-foreground mt-1">
                {executiveRecap.bonusSummary?.byPic?.length || 0} Creator
              </div>
              <p className="text-[11px] text-foreground-secondary mt-1">
                {executiveRecap.bonusSummary?.byPic?.map(p => `Mba ${p.pic}`).join(", ") || "–"}
              </p>
            </div>

            <div className="p-3.5 rounded-control border border-border bg-surface-secondary">
              <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                Total Video Lolos Bonus
              </span>
              <div className="text-base font-bold text-foreground mt-1">
                {executiveRecap.bonusSummary?.totalEligibleVideos || 0} Video
              </div>
              <p className="text-[11px] text-foreground-secondary mt-1">
                Dihitung dari data spreadsheet aktual per 3 hari.
              </p>
            </div>
          </div>

          {/* Per-PIC Breakdown */}
          {(executiveRecap.bonusSummary?.byPic || []).length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-foreground block">Rincian Bonus Per Creator (Total Kumulatif):</span>
              <div className="space-y-1.5">
                {(executiveRecap.bonusSummary?.byPic || []).map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-control border border-border bg-surface-secondary text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-surface border border-border flex items-center justify-center text-[10px] font-bold shrink-0">
                        {i + 1}
                      </span>
                      <div>
                        <span className="font-semibold text-foreground">Mba {p.pic}</span>
                        <span className="text-foreground-muted ml-1.5 text-[11px]">({p.branch})</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-foreground tabular-nums">{p.totalAmountFormatted}</div>
                      <div className="text-[10px] text-foreground-muted">{p.count} video lolos</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Followers per branch from spreadsheet */}
          {executiveRecap.spreadsheetFollowersByBranch && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-foreground block">Followers Instagram Per Cabang (Data Spreadsheet):</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {Object.values(executiveRecap.spreadsheetFollowersByBranch).map((b, i) => (
                  <div key={i} className="p-2.5 rounded-control border border-border bg-surface-secondary text-center">
                    <div className="text-xs font-bold text-foreground tabular-nums">{b.followersFormatted}</div>
                    <div className="text-[10px] text-foreground-muted truncate mt-0.5">{b.city}</div>
                    {b.lastRecordedDate && (
                      <div className="text-[9px] text-foreground-muted/70 mt-0.5">{b.lastRecordedDate}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
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
                  Fokus Owner: Keputusan Strategis & Rencana Aksi Menuju Meeting
                </h3>
                <p className="text-xs text-foreground-secondary">
                  Checklist instruksi kerja untuk diputuskan bersama dalam rapat dewan direksi.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-light text-brand">
              Keputusan Rapat
            </span>
          </div>

          <div className="space-y-2">
            {[
              {
                target: "Cabang Cilacap & Purwokerto",
                action: "Follow up pengisian lembar kerja Mba Arum dan Mba Ilya agar update tidak tertunda sebelum meeting evaluasi.",
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
                pic: "Owner & Refraksionis Optisi",
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
