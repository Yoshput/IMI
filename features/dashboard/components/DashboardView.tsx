"use client";

import React, { useState } from "react";
import { PerformanceHeader } from "./PerformanceHeader";
import { KpiMetricGroup } from "./KpiMetricGroup";
import { PriorityAttention } from "./PriorityAttention";
import { BranchLocationsShowcase } from "./BranchLocationsShowcase";
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

        <KpiMetricGroup metrics={DEMO_HEADLINE_METRICS} />

        {/* Jaringan Cabang & Foto Lokasi Nyata */}
        <BranchLocationsShowcase />

        <PriorityAttention issues={DEMO_PRIORITY_ISSUES} />
      </StateRenderer>
    </div>
  );
};
