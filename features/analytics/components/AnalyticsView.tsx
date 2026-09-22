"use client";

import React, { useState } from "react";
import { DEMO_HEADLINE_METRICS } from "@/lib/seed-data";
import { MetricRecord } from "@/types";
import { SingleQuestionChart } from "./SingleQuestionChart";
import { FormatEfficiencyChart } from "./FormatEfficiencyChart";
import { MetricHistoryTable } from "./MetricHistoryTable";
import { ManualEntryModal } from "./ManualEntryModal";
import { GscClickReport } from "./GscClickReport";
import { TikTokBranchAnalytics } from "./TikTokBranchAnalytics";
import { StateRenderer } from "@/components/shared/StateRenderer";
import { PlusCircle, FileSpreadsheet } from "lucide-react";
import { DevStateSwitcher } from "@/components/shared/DevStateSwitcher";

export const AnalyticsView: React.FC = () => {
  const [viewState, setViewState] = useState<"success" | "loading" | "empty" | "error">("success");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [historyRecords, setHistoryRecords] = useState<MetricRecord[]>(DEMO_HEADLINE_METRICS);

  const handleAddRecord = (record: MetricRecord) => {
    setHistoryRecords((prev) => [record, ...prev]);
  };

  return (
    <div className="space-y-8">
      {/* Dev / State Preview Switcher hidden behind dev-flag / ?dev=true (Audit Item #1) */}
      <DevStateSwitcher
        moduleName="Analytics"
        currentState={viewState}
        onStateChange={setViewState}
      />

      {/* Header Context */}
      <div className="border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-caption font-medium uppercase tracking-wider text-foreground-secondary mb-1">
            <span>Modul Analisis & Audit Data</span>
            <span>·</span>
            <span>Multichannel Intelligence</span>
          </div>
          <h1 className="heading-page text-foreground">Analytics & Content Diagnostic</h1>
          <p className="text-sm text-foreground-secondary mt-1">
            Visualisasi terfokus untuk Google Search Console optikiseeyou.com, performa video TikTok 5 cabang, dan efisiensi format Instagram.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-control bg-brand text-white text-xs font-semibold hover:bg-brand-hover transition-colors shadow-subtle"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Catat Metrik Baru</span>
          </button>
        </div>
      </div>

      <StateRenderer
        status={viewState}
        onRetry={() => setViewState("success")}
        emptyTitle="Belum Ada Analisis Tersedia"
        emptyDescription="Catat metrik jangkauan akun pertama untuk melihat grafik tren mingguan."
        emptyActionLabel="Input Metrik Sekarang"
        onEmptyAction={() => setIsModalOpen(true)}
      >
        {/* Fitur 3: TikTok Branch Analytics (Trending vs Underperforming) */}
        <TikTokBranchAnalytics />

        {/* Fitur 1: Google Search Console — Click Report optikiseeyou.com */}
        <GscClickReport />

        {/* Two Single-Question Charts (DESIGN.md §17) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SingleQuestionChart />
          <FormatEfficiencyChart />
        </div>

        {/* Audit Trail & History Table (AGENT.md §07) */}
        <MetricHistoryTable records={historyRecords} />
      </StateRenderer>

      {/* Manual Entry Modal Dialog */}
      <ManualEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddRecord={handleAddRecord}
      />
    </div>
  );
};
