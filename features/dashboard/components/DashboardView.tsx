"use client";

import React, { useState } from "react";
import { PerformanceHeader } from "./PerformanceHeader";
import { KpiMetricGroup } from "./KpiMetricGroup";
import { PriorityAttention } from "./PriorityAttention";
import { BranchLocationsShowcase } from "./BranchLocationsShowcase";
import { BranchResumeCard } from "./BranchResumeCard";
import { AntrianTrackingCard } from "./AntrianTrackingCard";
import { GscClickReport } from "@/features/analytics/components/GscClickReport";
import { TaskTrackerSection } from "./TaskTrackerSection";
import { DEMO_HEADLINE_METRICS, DEMO_PRIORITY_ISSUES } from "@/lib/seed-data";
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
          periodLabel="Week 37 · 8–14 September 2026"
          publishTargetAchieved={true}
          totalPostsPublished={14}
        />

        {/* Real-time Google Sheets PIC Submission Alert Banner */}
        <PicSubmissionBanner />

        {/* Headline KPIs */}
        <KpiMetricGroup metrics={DEMO_HEADLINE_METRICS} />

        {/* Fitur 2: Resume Report per Cabang (5 Cabang: PWT, CLP, PBG, WNS, TGL) */}
        <BranchResumeCard />

        {/* Fitur 4: Tracking Klik "Antrian Cek Mata" optikiseeyou.com */}
        <AntrianTrackingCard />

        {/* Fitur 1: Google Search Console — Click Report optikiseeyou.com */}
        <GscClickReport />

        {/* Fitur 7: Task Tracker Kreatif — Termasuk task Yanuar "Design Grafis Feed" */}
        <TaskTrackerSection />

        {/* Jaringan Cabang & Foto Lokasi Nyata */}
        <BranchLocationsShowcase />

        {/* Peluang & Perhatian Strategis */}
        <PriorityAttention issues={DEMO_PRIORITY_ISSUES} />
      </StateRenderer>
    </div>
  );
};
