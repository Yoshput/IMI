"use client";

import React, { useState, useMemo } from "react";
import { PerformanceHeader } from "./PerformanceHeader";
import { KpiMetricGroup } from "./KpiMetricGroup";
import { PriorityAttention } from "./PriorityAttention";
import { BranchLocationsShowcase } from "./BranchLocationsShowcase";
import { BranchResumeCard } from "./BranchResumeCard";
import { AntrianTrackingCard } from "./AntrianTrackingCard";
import { WebPhotoboothAndQueueResume } from "./WebPhotoboothAndQueueResume";
import { GscClickReport } from "@/features/analytics/components/GscClickReport";
import { ACTUAL_HEADLINE_METRICS, ACTUAL_PRIORITY_ISSUES } from "@/lib/actual-marketing-data";
import { StateRenderer } from "@/components/shared/StateRenderer";
import { PicSubmissionBanner } from "@/features/sheets/components/PicSubmissionBanner";
import { DevStateSwitcher } from "@/components/shared/DevStateSwitcher";
import { useBranch } from "@/context/BranchContext";

export const DashboardView: React.FC = () => {
  const [viewState, setViewState] = useState<"success" | "loading" | "empty" | "error">("success");
  const { selectedBranchId, selectedBranchMeta } = useBranch();

  const branchDashboardData = useMemo(() => {
    switch (selectedBranchId) {
      case "purwokerto":
        return {
          branchTitle: "Optik I See You Purwokerto (Pusat & Lab)",
          contextSubtitle: "Optik I See You Purwokerto (Pusat & Lab) · PIC: Ilya (Reels) & Nuha (Story)",
          totalPublished: 3,
          targetQuota: 4,
          achieved: false,
          growthText: "Target Kuota 75.0% (3/4 Konten Reels)",
          metrics: [
            {
              id: "m-followers-pwt",
              key: "followers",
              label: "Followers IG Purwokerto Pusat",
              value: 225589,
              unit: "akun IG",
              previousValue: 225800,
              deltaPercent: -0.1,
              date: "2026-10-12",
              source: "sheets_sync" as const,
              sourceLabel: "Rekap Harian Google Sheets PWT",
              isDemo: false,
              notes: "Akun pusat @iseeyou.glasses (225.589 IG + 78.200 TikTok = 303.789 audiens)",
            },
            {
              id: "m-reach-pwt",
              key: "weekly_reach",
              label: "Produksi Reels PWT (Ilya)",
              value: 3,
              unit: "video reels",
              previousValue: 8,
              deltaPercent: -62.5,
              date: "2026-10-12",
              source: "sheets_sync" as const,
              sourceLabel: "Rekap Harian Sheets PWT (6–12 Okt 2026)",
              isDemo: false,
              notes: "3 video Reels terbit (Bantuan Air Bersih, Nobar FIFA, Hancurin barang mantan). Target 4 video/minggu.",
            },
            {
              id: "m-story-production-pwt",
              key: "story_production",
              label: "Produksi Story PWT (Nuha)",
              value: 92,
              unit: "story IG",
              previousValue: 102,
              deltaPercent: -9.8,
              date: "2026-10-12",
              source: "sheets_sync" as const,
              sourceLabel: "Rekap Story PWT (6–12 Okt 2026)",
              isDemo: false,
              notes: "92 story terunggah dalam 6 hari kerja (rata-rata 15.3 story/hari).",
            },
            {
              id: "m-engagement-pwt",
              key: "engagement",
              label: "Pesan DM Konsultasi PWT",
              value: 27,
              unit: "pesan DM",
              previousValue: 31,
              deltaPercent: -12.9,
              date: "2026-10-12",
              source: "sheets_sync" as const,
              sourceLabel: "Rekap DM Masuk Story PWT",
              isDemo: false,
              notes: "27 DM masuk via Story PWT konsultasi frame, cek mata & booking.",
            },
            {
              id: "m-save-rate-pwt",
              key: "save_rate",
              label: "Pencapaian Kuota Purwokerto",
              value: 75.0,
              unit: "% target reels",
              previousValue: 100,
              deltaPercent: -25.0,
              date: "2026-10-12",
              source: "sheets_sync" as const,
              sourceLabel: "Evaluasi Siklus 8 PWT",
              isDemo: false,
              notes: "3 dari target 4 video Reels mingguan terpenuhi.",
            },
          ],
        };

      case "purbalingga":
        return {
          branchTitle: "Optik I See You Purbalingga",
          contextSubtitle: "Optik I See You Purbalingga · PIC: Ajun (Reels & TikTok)",
          totalPublished: 5,
          targetQuota: 3,
          achieved: true,
          growthText: "Target Kuota 166.7% Terpenuhi (Surplus +2 Konten)",
          metrics: [
            {
              id: "m-followers-pbg",
              key: "followers",
              label: "Followers IG Purbalingga",
              value: 6232,
              unit: "akun IG",
              previousValue: 6198,
              deltaPercent: 0.5,
              date: "2026-10-12",
              source: "sheets_sync" as const,
              sourceLabel: "Rekap Harian Google Sheets PBG",
              isDemo: false,
              notes: "Akun @iseeyou.purbalingga (6.232 IG + 4.120 TikTok = 10.352 audiens)",
            },
            {
              id: "m-reach-pbg",
              key: "weekly_reach",
              label: "Produksi Reels PBG (Ajun)",
              value: 5,
              unit: "video reels",
              previousValue: 6,
              deltaPercent: -16.7,
              date: "2026-10-12",
              source: "sheets_sync" as const,
              sourceLabel: "Rekap Harian Sheets PBG (6–12 Okt 2026)",
              isDemo: false,
              notes: "5 video Reels terbit (In this economy, HADUH GIMANA YA, Cetas, Face id, KRING). Surplus +2 di atas target 3.",
            },
            {
              id: "m-story-production-pbg",
              key: "story_production",
              label: "Kepatuhan Laporan PIC",
              value: 100,
              unit: "% rekap harian",
              previousValue: 100,
              deltaPercent: 0,
              date: "2026-10-12",
              source: "sheets_sync" as const,
              sourceLabel: "Audit Kepatuhan Sheets PBG",
              isDemo: false,
              notes: "Ajun mencatat rekap harian tertib setiap hari dengan catatan kendala tripod rusak 4 kali.",
            },
            {
              id: "m-engagement-pbg",
              key: "engagement",
              label: "Interaksi Audiens Purbalingga",
              value: 840,
              unit: "likes & komen",
              previousValue: 790,
              deltaPercent: 6.3,
              date: "2026-10-12",
              source: "sheets_sync" as const,
              sourceLabel: "Interaksi Konten PBG Siklus 8",
              isDemo: false,
              notes: "Konten 'tinggalkan satu pesan' dan Karnaval meraih respons emosional tinggi.",
            },
            {
              id: "m-save-rate-pbg",
              key: "save_rate",
              label: "Pencapaian Kuota Purbalingga",
              value: 166.7,
              unit: "% target reels",
              previousValue: 200,
              deltaPercent: -33.3,
              date: "2026-10-12",
              source: "sheets_sync" as const,
              sourceLabel: "Evaluasi Siklus 8 PBG",
              isDemo: false,
              notes: "5 dari target 3 video Reels tercapai sempurna.",
            },
          ],
        };

      case "cilacap":
        return {
          branchTitle: "Optik I See You Cilacap",
          contextSubtitle: "Optik I See You Cilacap · PIC: Arum (Reels & TikTok)",
          totalPublished: 0,
          targetQuota: 2,
          achieved: false,
          growthText: "Rekap Tertunda Sejak 22 September (0/2 Konten)",
          metrics: [
            {
              id: "m-followers-clp",
              key: "followers",
              label: "Followers IG Cilacap",
              value: 7408,
              unit: "akun IG",
              previousValue: 7408,
              deltaPercent: 0,
              date: "2026-10-12",
              source: "sheets_sync" as const,
              sourceLabel: "Rekap Harian Google Sheets CLP",
              isDemo: false,
              notes: "Akun @iseeyou.cilacap (7.408 IG + 3.850 TikTok = 11.258 audiens)",
            },
            {
              id: "m-reach-clp",
              key: "weekly_reach",
              label: "Produksi Reels CLP (Arum)",
              value: 0,
              unit: "video tercatat",
              previousValue: 4,
              deltaPercent: -100,
              date: "2026-10-12",
              source: "sheets_sync" as const,
              sourceLabel: "Rekap CLP (Pending 20 Hari)",
              isDemo: false,
              notes: "Pengisian spreadsheet tertunda sejak 22 September. Video Instagram live tetap tayang tapi belum direkap PIC.",
            },
            {
              id: "m-story-production-clp",
              key: "story_production",
              label: "Hari Keterlambatan Rekap",
              value: 20,
              unit: "hari tertunda",
              previousValue: 13,
              deltaPercent: 53.8,
              date: "2026-10-12",
              source: "sheets_sync" as const,
              sourceLabel: "Audit Google Sheets Rekap CLP",
              isDemo: false,
              notes: "Perlu follow up HRD/Marketing untuk validasi data store Cilacap.",
            },
            {
              id: "m-engagement-clp",
              key: "engagement",
              label: "Estimasi Jangkauan Live",
              value: 5983,
              unit: "viewers IG",
              previousValue: 52100,
              deltaPercent: -88.5,
              date: "2026-10-12",
              source: "instagram_insights" as const,
              sourceLabel: "Instagram Live Reels Cilacap",
              isDemo: false,
              notes: "Reels terbaru 'minus silinder siang vs malem' tetap tayang live di Instagram.",
            },
            {
              id: "m-save-rate-clp",
              key: "save_rate",
              label: "Pencapaian Kuota Cilacap",
              value: 0,
              unit: "% target terdata",
              previousValue: 100,
              deltaPercent: -100,
              date: "2026-10-12",
              source: "sheets_sync" as const,
              sourceLabel: "Evaluasi Siklus 8 CLP",
              isDemo: false,
              notes: "Target 2 video/minggu belum tercatat di spreadsheet.",
            },
          ],
        };

      case "wonosobo":
        return {
          branchTitle: "Optik I See You Wonosobo",
          contextSubtitle: "Optik I See You Wonosobo · PIC: Febi (Reels & TikTok)",
          totalPublished: 5,
          targetQuota: 2,
          achieved: true,
          growthText: "Target Kuota 250.0% Terpenuhi (Surplus +3 Konten)",
          metrics: [
            {
              id: "m-followers-wns",
              key: "followers",
              label: "Followers IG Wonosobo",
              value: 1283,
              unit: "akun IG",
              previousValue: 1264,
              deltaPercent: 1.5,
              date: "2026-10-12",
              source: "sheets_sync" as const,
              sourceLabel: "Rekap Harian Google Sheets WNS",
              isDemo: false,
              notes: "Akun @iseeyou.wonosobo (1.283 IG + 1.940 TikTok = 3.223 audiens)",
            },
            {
              id: "m-reach-wns",
              key: "weekly_reach",
              label: "Produksi Reels WNS (Febi)",
              value: 5,
              unit: "video reels",
              previousValue: 7,
              deltaPercent: -28.6,
              date: "2026-10-12",
              source: "sheets_sync" as const,
              sourceLabel: "Rekap Harian Sheets WNS (6–12 Okt 2026)",
              isDemo: false,
              notes: "5 video Reels terbit (Kacamata+Kelas, Faktor minus, Octular parasitosis, prank, Coba kacamata). Target 2 terpenuhi 250%.",
            },
            {
              id: "m-story-production-wns",
              key: "story_production",
              label: "Kepatuhan Laporan PIC",
              value: 100,
              unit: "% rekap harian",
              previousValue: 100,
              deltaPercent: 0,
              date: "2026-10-12",
              source: "sheets_sync" as const,
              sourceLabel: "Audit Kepatuhan Sheets WNS",
              isDemo: false,
              notes: "Febi mencatat rekap harian tertib dan tepat waktu setiap hari.",
            },
            {
              id: "m-engagement-wns",
              key: "engagement",
              label: "Interaksi Audiens Wonosobo",
              value: 222,
              unit: "likes & komen",
              previousValue: 210,
              deltaPercent: 5.7,
              date: "2026-10-12",
              source: "sheets_sync" as const,
              sourceLabel: "Interaksi Konten WNS Siklus 8",
              isDemo: false,
              notes: "Edukasi Ocular Parasitosis dan Parodi Kacamata Kelas direspon positif.",
            },
            {
              id: "m-save-rate-wns",
              key: "save_rate",
              label: "Pencapaian Kuota Wonosobo",
              value: 250.0,
              unit: "% target reels",
              previousValue: 350,
              deltaPercent: -28.6,
              date: "2026-10-12",
              source: "sheets_sync" as const,
              sourceLabel: "Evaluasi Siklus 8 WNS",
              isDemo: false,
              notes: "5 dari target 2 video Reels tercapai (Surplus +3 konten).",
            },
          ],
        };

      case "lunar_tegal":
        return {
          branchTitle: "Lunar Eyewear Tegal (Second Brand)",
          contextSubtitle: "Lunar Eyewear Tegal (Second Brand) · PIC: Amanda (Reels & TikTok)",
          totalPublished: 5,
          targetQuota: 3,
          achieved: true,
          growthText: "Target Kuota 166.7% Terpenuhi (Surplus +2 Konten)",
          metrics: [
            {
              id: "m-followers-tgl",
              key: "followers",
              label: "Followers IG Lunar Tegal",
              value: 4075,
              unit: "akun IG",
              previousValue: 4016,
              deltaPercent: 1.5,
              date: "2026-10-12",
              source: "sheets_sync" as const,
              sourceLabel: "Rekap Harian Google Sheets TGL",
              isDemo: false,
              notes: "Akun @lunareyewear.co (4.075 IG + 3.350 TikTok = 7.425 audiens)",
            },
            {
              id: "m-reach-tgl",
              key: "weekly_reach",
              label: "Produksi Reels TGL (Amanda)",
              value: 5,
              unit: "video reels",
              previousValue: 6,
              deltaPercent: -16.7,
              date: "2026-10-12",
              source: "sheets_sync" as const,
              sourceLabel: "Rekap Harian Sheets TGL (6–12 Okt 2026)",
              isDemo: false,
              notes: "5 video Reels terbit (knp pelan nyetir, open booth, nemu kacamata 100rban, seporsi kekalahan, potongan jutaan).",
            },
            {
              id: "m-story-production-tgl",
              key: "story_production",
              label: "Produksi Story Lunar TGL",
              value: 14,
              unit: "story IG",
              previousValue: 12,
              deltaPercent: 16.7,
              date: "2026-10-12",
              source: "sheets_sync" as const,
              sourceLabel: "Rekap Story Lunar Eyewear",
              isDemo: false,
              notes: "14 story promosi open booth Rita Supermall Tegal.",
            },
            {
              id: "m-engagement-tgl",
              key: "engagement",
              label: "Likes & Interaksi Reels TGL",
              value: 8555,
              unit: "interaksi live",
              previousValue: 2400,
              deltaPercent: 256.5,
              date: "2026-10-12",
              source: "instagram_insights" as const,
              sourceLabel: "Interaksi Konten Lunar Tegal Siklus 8",
              isDemo: false,
              notes: "Reels 'knp lu kalo malem pelan bgt' viral dengan 194K views & 8.4K likes!",
            },
            {
              id: "m-save-rate-tgl",
              key: "save_rate",
              label: "Pencapaian Kuota Lunar Tegal",
              value: 166.7,
              unit: "% target reels",
              previousValue: 200,
              deltaPercent: -16.7,
              date: "2026-10-12",
              source: "sheets_sync" as const,
              sourceLabel: "Evaluasi Siklus 8 TGL",
              isDemo: false,
              notes: "5 dari target 3 video Reels tercapai sempurna.",
            },
          ],
        };

      case "all":
      default:
        return {
          branchTitle: undefined,
          contextSubtitle: "Optik I See You (PWT · PBG · CLP · WNS) · Lunar Eyewear Tegal · Konsolidasi Intelligence Mingguan",
          totalPublished: 18,
          targetQuota: 14,
          achieved: true,
          growthText: "Target Kuota 128.6% Terpenuhi (18/14 Konten)",
          metrics: ACTUAL_HEADLINE_METRICS,
        };
    }
  }, [selectedBranchId]);

  return (
    <div className="space-y-6">
      {/* Dev / State Preview Switcher hidden behind dev-flag / ?dev=true (Audit Item #1) */}
      <DevStateSwitcher
        moduleName="Dashboard"
        currentState={viewState}
        onStateChange={setViewState}
      />

      <StateRenderer
        status={viewState}
        onRetry={() => setViewState("success")}
        emptyTitle="Tidak Ada Data Evaluasi Mingguan"
        emptyDescription="Silakan catat metrik postingan atau impor laporan mingguan melalui modul Analytics."
        emptyActionLabel="Buka Modul Analytics"
        onEmptyAction={() => (window.location.href = "/analytics")}
      >
        <PerformanceHeader
          periodLabel="Siklus 8 · 6–12 Oktober 2026 (Rapat Evaluasi Selasa, 13 Oktober 2026)"
          publishTargetAchieved={branchDashboardData.achieved}
          totalPostsPublished={branchDashboardData.totalPublished}
          targetQuotaTotal={branchDashboardData.targetQuota}
          wowGrowthText={branchDashboardData.growthText}
          branchTitle={branchDashboardData.branchTitle}
          contextSubtitle={branchDashboardData.contextSubtitle}
          provenanceDate="12 Oktober 2026"
          provenanceLabel="Data sinkronisasi Google Sheets 5 Cabang terverifikasi per 12 Oktober 2026"
        />

        {/* Real-time Google Sheets PIC Submission Alert Banner */}
        <PicSubmissionBanner />

        {/* Headline KPIs */}
        <KpiMetricGroup metrics={branchDashboardData.metrics} />

        {/* Resume Kunjungan Web Photobooth & Nomor Antrian Online (Permintaan Rapat Besok) */}
        <WebPhotoboothAndQueueResume />

        {/* Fitur 2: Resume Report per Cabang (5 Cabang: PWT, CLP, PBG, WNS, TGL) */}
        <BranchResumeCard />

        {/* Fitur 4: Tracking Klik "Antrian Cek Mata" optikiseeyou.com */}
        <AntrianTrackingCard />

        {/* Fitur 1: Google Search Console — Click Report optikiseeyou.com */}
        <GscClickReport />

        {/* Jaringan Cabang & Foto Lokasi Nyata */}
        <BranchLocationsShowcase />

        {/* Peluang & Perhatian Strategis */}
        <PriorityAttention issues={ACTUAL_PRIORITY_ISSUES} />
      </StateRenderer>
    </div>
  );
};
