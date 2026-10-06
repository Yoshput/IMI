"use client";

import React, { useState, useEffect } from "react";
import { ACTUAL_HEADLINE_METRICS } from "@/lib/actual-marketing-data";
import { MetricRecord } from "@/types";
import { LiveTrafficRadar } from "./LiveTrafficRadar";
import { SingleQuestionChart } from "./SingleQuestionChart";
import { FormatEfficiencyChart } from "./FormatEfficiencyChart";
import { MetricHistoryTable } from "./MetricHistoryTable";
import { ManualEntryModal } from "./ManualEntryModal";
import { GscClickReport } from "./GscClickReport";
import { TikTokBranchAnalytics } from "./TikTokBranchAnalytics";
import { StateRenderer } from "@/components/shared/StateRenderer";
import { PlusCircle, RefreshCw, Sparkles, Activity, ShieldCheck } from "lucide-react";
import { DevStateSwitcher } from "@/components/shared/DevStateSwitcher";

export const AnalyticsView: React.FC = () => {
  const [viewState, setViewState] = useState<"success" | "loading" | "empty" | "error">("success");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [historyRecords, setHistoryRecords] = useState<MetricRecord[]>(ACTUAL_HEADLINE_METRICS);
  const [activeSection, setActiveSection] = useState<"all" | "traffic" | "gsc" | "tiktok" | "trends">("all");
  const [lastSyncTime, setLastSyncTime] = useState<string>("");
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setLastSyncTime(new Date().toLocaleTimeString("id-ID"));
    // Realtime background tick every 60s
    const timer = setInterval(() => {
      setLastSyncTime(new Date().toLocaleTimeString("id-ID"));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setLastSyncTime(new Date().toLocaleTimeString("id-ID"));
      setIsSyncing(false);
    }, 600);
  };

  const handleAddRecord = (record: MetricRecord) => {
    setHistoryRecords((prev) => [record, ...prev]);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Dev / State Preview Switcher */}
      <DevStateSwitcher
        moduleName="Analytics"
        currentState={viewState}
        onStateChange={setViewState}
      />

      {/* Header Context with Live Status */}
      <div className="border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-caption font-medium uppercase tracking-wider text-foreground-secondary mb-1.5">
            <span>Modul Analisis & Audit Data</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Realtime Analytics (Update 6 Oktober 2026)
            </span>
            {lastSyncTime && (
              <span className="text-[11px] text-foreground-muted">
                ({lastSyncTime} WIB)
              </span>
            )}
          </div>
          <h1 className="heading-page text-foreground flex items-center gap-2">
            <span>Analytics &amp; Multichannel Diagnostic</span>
          </h1>
          <p className="text-sm text-foreground-secondary mt-1 max-w-3xl">
            Pusat analisis terpadu yang memantau arus lalu lintas web optikiseeyou.com, Google Search Console, kinerja konten TikTok jaringan 5 cabang, serta efisiensi format Instagram secara realtime.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-control bg-surface border border-border text-foreground text-xs font-semibold hover:bg-surface-secondary transition-colors shadow-subtle disabled:opacity-50"
            title="Sinkronkan Metrik Realtime"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-brand" : ""}`} />
            <span>{isSyncing ? "Menyinkronkan..." : "Perbarui Live"}</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-control bg-brand text-white text-xs font-semibold hover:bg-brand-hover transition-colors shadow-subtle"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Catat Metrik Baru</span>
          </button>
        </div>
      </div>

      {/* Quick Section Filter Navigation Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-border">
        {[
          { id: "all", label: "Semua Modul Analytics" },
          { id: "traffic", label: "Lalu Lintas Web & Traffic" },
          { id: "gsc", label: "Google Search Console" },
          { id: "tiktok", label: "TikTok Branch Analytics" },
          { id: "trends", label: "Efisiensi Format & Audit Trail" },
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id as any)}
            className={`px-3 py-1.5 rounded-control text-xs font-semibold transition-all ${
              activeSection === sec.id
                ? "bg-foreground text-surface shadow-2xs"
                : "bg-surface-secondary text-foreground-secondary hover:text-foreground border border-border"
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      <StateRenderer
        status={viewState}
        onRetry={() => setViewState("success")}
        emptyTitle="Belum Ada Analisis Tersedia"
        emptyDescription="Catat metrik jangkauan akun pertama untuk melihat grafik tren mingguan."
        emptyActionLabel="Input Metrik Sekarang"
        onEmptyAction={() => setIsModalOpen(true)}
      >
        {/* Modul 1: Live Web & Multichannel Traffic Intelligence Radar */}
        {(activeSection === "all" || activeSection === "traffic") && (
          <section id="sec-traffic">
            <LiveTrafficRadar />
          </section>
        )}

        {/* Modul 2: Google Search Console: Click Report optikiseeyou.com */}
        {(activeSection === "all" || activeSection === "gsc") && (
          <section id="sec-gsc">
            <GscClickReport />
          </section>
        )}

        {/* Modul 3: TikTok Branch Analytics (Trending vs Underperforming) */}
        {(activeSection === "all" || activeSection === "tiktok") && (
          <section id="sec-tiktok">
            <TikTokBranchAnalytics />
          </section>
        )}

        {/* Modul 4: Two Single-Question Charts & Format Efficiency */}
        {(activeSection === "all" || activeSection === "trends") && (
          <section id="sec-trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SingleQuestionChart />
              <FormatEfficiencyChart />
            </div>

            {/* Audit Trail & History Table */}
            <MetricHistoryTable records={historyRecords} />
          </section>
        )}
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

