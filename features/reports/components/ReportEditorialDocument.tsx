import React from "react";
import { WeeklyReport } from "@/types";
import { formatNumber, formatPercent } from "@/lib/utils";
import { ProvenanceBadge } from "@/components/shared/ProvenanceBadge";
import { CheckCircle2, AlertTriangle, Lightbulb, Users, Bot, FileText, Glasses } from "lucide-react";

interface ReportEditorialDocumentProps {
  report: WeeklyReport;
  showAiLayer: boolean;
  selectedStakeholder: string;
  reportStatus: "draft" | "reviewed" | "final";
}

export const ReportEditorialDocument: React.FC<ReportEditorialDocumentProps> = ({
  report,
  showAiLayer,
  selectedStakeholder,
  reportStatus,
}) => {
  return (
    <article className="flex-1 bg-surface rounded-container border border-border p-8 sm:p-12 shadow-subtle max-w-4xl space-y-10 print:p-0 print:border-none print:shadow-none">
      {/* Official Memo Header */}
      <header className="border-b-2 border-brand/20 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-isy-dark.png"
              alt="Optik I See You"
              className="h-10 w-auto object-contain"
            />
            <div className="border-l border-border pl-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand block">
                Internal Management Memo
              </span>
              <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                Laporan Evaluasi Mingguan Marketing
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-for-every-you.png"
              alt="For Every You"
              className="h-6 w-auto object-contain opacity-80"
            />
            <span
              className={`text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-control ${
                reportStatus === "final"
                  ? "bg-status-successBg text-status-success border border-status-success/30"
                  : reportStatus === "reviewed"
                  ? "bg-brand-light text-brand border border-brand/20"
                  : "bg-surface-secondary text-foreground-secondary border border-border"
              }`}
            >
              Status: {reportStatus}
            </span>
          </div>
        </div>

        {/* Metadata Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-border/80 text-xs">
          <div>
            <span className="text-[11px] text-foreground-muted block uppercase tracking-wider">
              Unit Usaha
            </span>
            <span className="font-semibold text-foreground mt-0.5 block">
              Optik I See You (Purwokerto)
            </span>
          </div>
          <div>
            <span className="text-[11px] text-foreground-muted block uppercase tracking-wider">
              Periode Laporan
            </span>
            <span className="font-semibold text-foreground mt-0.5 block">
              {report.periodLabel}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-foreground-muted block uppercase tracking-wider">
              Penyusun
            </span>
            <span className="font-semibold text-foreground mt-0.5 block">
              Tim Konten & Kreatif
            </span>
          </div>
          <div>
            <span className="text-[11px] text-foreground-muted block uppercase tracking-wider">
              Ditujukan Kepada
            </span>
            <span className="font-semibold text-foreground mt-0.5 block">
              Owner, Mgmt, HRD, Finance
            </span>
          </div>
        </div>
      </header>

      {/* 1. Ringkasan Eksekutif */}
      <section id="sec-summary" className="space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-brand" />
          <h2 className="heading-section text-foreground">1. Ringkasan Eksekutif</h2>
        </div>
        <div className="p-5 rounded-control bg-surface-secondary border-l-4 border-brand text-sm leading-relaxed text-foreground">
          {report.executiveSummary}
        </div>
      </section>

      {/* 2. Metrik Kunci & Deterministik (AGENT.md §20) */}
      <section id="sec-metrics" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="heading-section text-foreground">2. Metrik Kunci Deterministik</h2>
          </div>
          <ProvenanceBadge
            source="instagram_insights"
            date={report.endDate}
            sourceLabel="Perhitungan Deterministik dari Database Log"
            isDemo={true}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-control bg-surface-secondary border border-border">
            <span className="text-[11px] font-semibold text-foreground-muted uppercase tracking-wider block">
              Followers Total
            </span>
            <span className="text-2xl font-bold text-foreground block mt-1">
              {formatNumber(report.headlineMetrics.totalFollowers.value)}
            </span>
            <span className="text-xs text-status-success font-semibold block mt-0.5">
              {formatPercent(report.headlineMetrics.totalFollowers.deltaPercent ?? 0)} WoW
            </span>
          </div>

          <div className="p-4 rounded-control bg-surface-secondary border border-border">
            <span className="text-[11px] font-semibold text-foreground-muted uppercase tracking-wider block">
              Weekly Reach
            </span>
            <span className="text-2xl font-bold text-foreground block mt-1">
              {formatNumber(report.headlineMetrics.weeklyReach.value)}
            </span>
            <span className="text-xs text-status-success font-semibold block mt-0.5">
              {formatPercent(report.headlineMetrics.weeklyReach.deltaPercent ?? 0)} WoW
            </span>
          </div>

          <div className="p-4 rounded-control bg-surface-secondary border border-border">
            <span className="text-[11px] font-semibold text-foreground-muted uppercase tracking-wider block">
              Interaksi Konten
            </span>
            <span className="text-2xl font-bold text-foreground block mt-1">
              {formatNumber(report.headlineMetrics.totalEngagements.value)}
            </span>
            <span className="text-xs text-status-success font-semibold block mt-0.5">
              {formatPercent(report.headlineMetrics.totalEngagements.deltaPercent ?? 0)} WoW
            </span>
          </div>

          <div className="p-4 rounded-control bg-brand-light border border-brand/20">
            <span className="text-[11px] font-semibold text-brand uppercase tracking-wider block">
              Save-to-Reach Ratio
            </span>
            <span className="text-2xl font-bold text-brand block mt-1">
              {report.headlineMetrics.saveToReachRatio.value}%
            </span>
            <span className="text-xs text-brand font-semibold block mt-0.5">
              {formatPercent(report.headlineMetrics.saveToReachRatio.deltaPercent ?? 0)} WoW
            </span>
          </div>
        </div>
      </section>

      {/* 3. Pencapaian Mingguan */}
      <section id="sec-achievements" className="space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-status-success" />
          <h2 className="heading-section text-foreground">3. Pencapaian Utama (Week 37)</h2>
        </div>
        <ul className="space-y-2.5">
          {report.pencapaian.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 p-3.5 rounded-control bg-surface-secondary border border-border/70 text-xs leading-relaxed text-foreground"
            >
              <span className="w-5 h-5 rounded-full bg-status-successBg text-status-success flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 4. Kendala Lapangan */}
      <section id="sec-obstacles" className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-status-warning" />
          <h2 className="heading-section text-foreground">4. Kendala & Hambatan Lapangan</h2>
        </div>
        <ul className="space-y-2.5">
          {report.kendala.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 p-3.5 rounded-control bg-status-warningBg/60 border border-amber-200 text-xs leading-relaxed text-amber-950"
            >
              <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                !
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 5. Plan & Strategi Minggu Depan */}
      <section id="sec-strategy" className="space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-brand-accent" />
          <h2 className="heading-section text-foreground">
            5. Plan & Strategi Tindakan (Week 38)
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {report.planStrategi.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-control bg-surface border border-border shadow-subtle flex items-start gap-3 text-xs leading-relaxed text-foreground"
            >
              <span className="w-5 h-5 rounded bg-brand-light text-brand flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                #{idx + 1}
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Masukan Tim untuk Divisi (Owner, HRD, Finance) */}
      <section id="sec-team-input" className="space-y-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-brand" />
          <h2 className="heading-section text-foreground">
            6. Masukan Tim Konten untuk Manajemen & Divisi Terkait
          </h2>
        </div>
        <div className="space-y-2">
          {report.masukanTim.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-control bg-surface-secondary border border-border text-xs leading-relaxed text-foreground flex items-start gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-brand mt-1.5 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 6b. Verifikasi Aktivitas & Kehadiran Fisik di Cabang */}
      <section id="sec-branch-evidence" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-brand flex items-center justify-center text-[10px] text-white font-bold">
              ✓
            </span>
            <h2 className="heading-section text-foreground">
              6b. Verifikasi Kehadiran Fisik di 4 Cabang Outlet
            </h2>
          </div>
          <span className="text-[11px] text-foreground-muted">
            Bukti Dokumentasi Outlet Aktual
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              name: "Purwokerto (Pusat)",
              img: "/lokasi/purwokerto/IMG_1544.webp",
              status: "Pusat & Lab Faset",
            },
            {
              name: "Purbalingga",
              img: "/lokasi/purbalingga/IMG_8526.webp",
              status: "Display Curve Modern",
            },
            {
              name: "Cilacap",
              img: "/lokasi/cilacap/IMG_6716.webp",
              status: "Fasade Hijau Signature",
            },
            {
              name: "Wonosobo",
              img: "/lokasi/wonosobo/IMG_4474.webp",
              status: "Outlet Dataran Tinggi",
            },
          ].map((br, idx) => (
            <div
              key={idx}
              className="rounded-control border border-border overflow-hidden bg-surface-secondary shadow-subtle flex flex-col"
            >
              <div className="aspect-[4/3] w-full relative overflow-hidden bg-black/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={br.img}
                  alt={br.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2.5 space-y-0.5 text-xs">
                <span className="font-bold text-foreground block text-[11px] truncate">
                  {br.name}
                </span>
                <span className="text-[10px] text-brand font-medium block">
                  {br.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Layer Analisis AI Terlabel (AGENT.md §09, DESIGN.md §21-22) */}
      {showAiLayer && (
        <section id="sec-ai-layer" className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-brand" />
              <h2 className="heading-section text-foreground">
                7. Catatan Interpretasi & Rekomendasi
              </h2>
            </div>
            <span className="text-[11px] text-foreground-muted">
              Aturan Label: FAKTA · INTERPRETASI · REKOMENDASI
            </span>
          </div>

          <div className="space-y-3">
            {report.aiAnalysis.map((ai) => {
              const tagColor =
                ai.tag === "FAKTA"
                  ? "bg-slate-100 text-slate-800 border-slate-300"
                  : ai.tag === "INTERPRETASI"
                  ? "bg-blue-50 text-blue-900 border-blue-200"
                  : "bg-emerald-50 text-emerald-900 border-emerald-200";

              return (
                <div
                  key={ai.id}
                  className="p-4 rounded-control bg-surface border border-border shadow-subtle space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${tagColor}`}
                    >
                      [{ai.tag}]
                    </span>
                    {ai.metricBasis && (
                      <span className="text-[11px] text-foreground-muted">
                        Basis: {ai.metricBasis}
                      </span>
                    )}
                  </div>
                  <p className="text-foreground leading-relaxed">{ai.text}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Document Sign-off Footer */}
      <footer className="pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-foreground-muted">
        <div>
          <span>Disusun oleh Tim Konten Optik I See You Purwokerto</span>
          <span className="block text-[11px]">Sistem Pelaporan Internal · Bebas Rekayasa Data</span>
        </div>
        <div className="text-right">
          <span className="block font-medium text-foreground">Mengetahui:</span>
          <span className="text-[11px]">Head of Marketing & Operational Lead</span>
        </div>
      </footer>
    </article>
  );
};
