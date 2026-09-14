"use client";

import React, { useState } from "react";
import { DEMO_WEEKLY_REPORT } from "@/lib/seed-data";
import { ReportSectionNav } from "./ReportSectionNav";
import { ReportEditorialDocument } from "./ReportEditorialDocument";
import { ReportConfigPanel } from "./ReportConfigPanel";
import { StateRenderer } from "@/components/shared/StateRenderer";

import { DevStateSwitcher } from "@/components/shared/DevStateSwitcher";

export const ReportBuilderView: React.FC = () => {
  const [viewState, setViewState] = useState<"success" | "loading" | "empty" | "error">("success");
  const [activeSection, setActiveSection] = useState("sec-summary");
  const [showAiLayer, setShowAiLayer] = useState(true);
  const [selectedStakeholder, setSelectedStakeholder] = useState("all");
  const [reportStatus, setReportStatus] = useState<"draft" | "reviewed" | "final">("reviewed");

  const handleSelectSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Dev / State Preview Switcher hidden behind dev-flag / ?dev=true (Audit Item #1) */}
      <DevStateSwitcher
        moduleName="Reports"
        currentState={viewState}
        onStateChange={setViewState}
      />

      {/* Page Header */}
      <div className="border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-caption font-medium uppercase tracking-wider text-foreground-secondary mb-1">
            <span>Report Builder Workspace (DESIGN.md §23)</span>
            <span>·</span>
            <span>Editorial Document</span>
          </div>
          <h1 className="heading-page text-foreground">Laporan Mingguan Manajemen</h1>
          <p className="text-sm text-foreground-secondary mt-1">
            Penyusunan dokumen evaluasi siap saji untuk Owner, Management, HRD, dan Finance tanpa rakit slide manual.
          </p>
        </div>
      </div>

      <StateRenderer
        status={viewState}
        onRetry={() => setViewState("success")}
        emptyTitle="Belum Ada Laporan Dibuat"
        emptyDescription="Kumpulkan data minggu ini untuk menghasilkan draft evaluasi mingguan secara otomatis."
        emptyActionLabel="Generate Laporan Baru"
        onEmptyAction={() => setViewState("success")}
      >
        {/* 3-Column Editorial Layout (DESIGN.md §23) */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Left: Section Navigation */}
          <ReportSectionNav
            activeSection={activeSection}
            onSelectSection={handleSelectSection}
          />

          {/* Center: Editorial Document */}
          <ReportEditorialDocument
            report={DEMO_WEEKLY_REPORT}
            showAiLayer={showAiLayer}
            selectedStakeholder={selectedStakeholder}
            reportStatus={reportStatus}
          />

          {/* Right: Configuration Panel */}
          <ReportConfigPanel
            report={DEMO_WEEKLY_REPORT}
            showAiLayer={showAiLayer}
            onToggleAiLayer={setShowAiLayer}
            selectedStakeholder={selectedStakeholder}
            onSelectStakeholder={setSelectedStakeholder}
            reportStatus={reportStatus}
            onChangeStatus={setReportStatus}
          />
        </div>
      </StateRenderer>
    </div>
  );
};
