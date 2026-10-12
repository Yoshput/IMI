"use client";

import React, { useState } from "react";
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

export const DashboardView: React.FC = () => {
  const [viewState, setViewState] = useState<"success" | "loading" | "empty" | "error">("success");

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
          publishTargetAchieved={true}
          totalPostsPublished={18}
          wowGrowthText="Target Kuota 128.6% Terpenuhi (18/14 Konten)"
          provenanceDate="12 Oktober 2026"
          provenanceLabel="Data sinkronisasi Google Sheets 5 Cabang terverifikasi per 12 Oktober 2026"
        />

        {/* Real-time Google Sheets PIC Submission Alert Banner */}
        <PicSubmissionBanner />

        {/* Headline KPIs */}
        <KpiMetricGroup metrics={ACTUAL_HEADLINE_METRICS} />

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
