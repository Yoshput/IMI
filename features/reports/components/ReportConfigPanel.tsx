"use client";

import React from "react";
import { WeeklyReport } from "@/types";
import { Printer, Copy, Check, SlidersHorizontal, ShieldCheck } from "lucide-react";

interface ReportConfigPanelProps {
  report: WeeklyReport;
  showAiLayer: boolean;
  onToggleAiLayer: (val: boolean) => void;
  selectedStakeholder: string;
  onSelectStakeholder: (val: string) => void;
  reportStatus: "draft" | "reviewed" | "final";
  onChangeStatus: (status: "draft" | "reviewed" | "final") => void;
}

export const ReportConfigPanel: React.FC<ReportConfigPanelProps> = ({
  report,
  showAiLayer,
  onToggleAiLayer,
  selectedStakeholder,
  onSelectStakeholder,
  reportStatus,
  onChangeStatus,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyMemo = () => {
    const textToCopy = `LAPORAN EVALUASI MARKETING OPTIK I SEE YOU PURWOKERTO
Periode: ${report.periodLabel}
Status: ${reportStatus.toUpperCase()}

1. RINGKASAN EKSEKUTIF:
${report.executiveSummary}

2. METRIK DETERMINISTIK:
- Followers: ${report.headlineMetrics.totalFollowers.value} (${report.headlineMetrics.totalFollowers.deltaPercent}%)
- Weekly Reach: ${report.headlineMetrics.weeklyReach.value} (${report.headlineMetrics.weeklyReach.deltaPercent}%)
- Save Rate: ${report.headlineMetrics.saveToReachRatio.value}%

3. PENCAPAIAN:
${report.pencapaian.map((p, i) => `${i + 1}. ${p}`).join("\n")}

4. KENDALA:
${report.kendala.map((k, i) => `${i + 1}. ${k}`).join("\n")}

5. PLAN & STRATEGI:
${report.planStrategi.map((s, i) => `${i + 1}. ${s}`).join("\n")}

6. MASUKAN TIM:
${report.masukanTim.map((m, i) => `- ${m}`).join("\n")}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-5">
      <div className="p-5 rounded-container bg-surface border border-border shadow-subtle space-y-4 text-xs">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <SlidersHorizontal className="w-4 h-4 text-foreground-secondary" />
          <h3 className="font-bold uppercase tracking-wider text-foreground">
            Konfigurasi Dokumen
          </h3>
        </div>

        {/* Status Selector */}
        <div>
          <label className="font-semibold text-foreground block mb-1.5">
            Status Persetujuan
          </label>
          <div className="grid grid-cols-3 gap-1">
            {(["draft", "reviewed", "final"] as const).map((st) => (
              <button
                key={st}
                onClick={() => onChangeStatus(st)}
                className={`py-1.5 px-2 rounded-control text-center font-semibold capitalize transition-colors ${
                  reportStatus === st
                    ? st === "final"
                      ? "bg-status-success text-white"
                      : "bg-foreground text-surface"
                    : "bg-surface-secondary text-foreground-secondary hover:bg-border/50"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Target Stakeholder View */}
        <div>
          <label className="font-semibold text-foreground block mb-1.5">
            Fokus Pembaca (Audience)
          </label>
          <select
            value={selectedStakeholder}
            onChange={(e) => onSelectStakeholder(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-control bg-surface border border-border text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="all">Semua Pemangku Kepentingan</option>
            <option value="owner">Owner & Management</option>
            <option value="hrd">HRD (Jadwal & Tim)</option>
            <option value="finance">Finance (Budget & ROI)</option>
          </select>
        </div>

        {/* AI Layer Toggle */}
        <div className="pt-2 border-t border-border">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showAiLayer}
              onChange={(e) => onToggleAiLayer(e.target.checked)}
              className="mt-0.5 rounded border-border text-brand focus:ring-brand"
            />
            <div>
              <span className="font-semibold text-foreground block">
                Sertakan Analisis AI Terlabel
              </span>
              <span className="text-[11px] text-foreground-secondary block mt-0.5 leading-snug">
                Menampilkan layer FAKTA, INTERPRETASI, dan REKOMENDASI (AGENT §09).
              </span>
            </div>
          </label>
        </div>

        {/* Deterministic Rules Notice */}
        <div className="p-3 rounded-control bg-surface-secondary border border-border flex items-start gap-2 text-[11px] text-foreground-secondary">
          <ShieldCheck className="w-4 h-4 text-brand shrink-0 mt-0.5" />
          <p className="leading-snug">
            Metrik inti bersifat deterministik & reproducible. AI tidak dapat mengubah angka hasil hitung (AGENT §20).
          </p>
        </div>

        {/* Actions: Export / Print & Copy */}
        <div className="pt-3 border-t border-border space-y-2">
          <button
            onClick={handleCopyMemo}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-control bg-surface-secondary border border-border hover:bg-surface-subtle font-semibold text-foreground transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-status-success" />
                <span>Memo Disalin ke Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Teks Memo Laporan</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-control bg-brand text-white hover:bg-brand-hover font-semibold transition-colors shadow-subtle"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / Simpan PDF Dokumen</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
