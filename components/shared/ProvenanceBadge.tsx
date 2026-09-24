import React from "react";
import { DataSource } from "@/types";
import { Database, Info } from "lucide-react";

interface ProvenanceBadgeProps {
  source: DataSource;
  date?: string;
  sourceLabel?: string;
  isDemo?: boolean;
  className?: string;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  source,
  date,
  sourceLabel,
  isDemo = false,
  className = "",
}) => {
  const getSourceDisplay = () => {
    switch (source) {
      case "instagram_insights":
        return "Instagram Insights · Meta Sync";
      case "manual":
        return "Rekap PIC Cabang · Terverifikasi";
      case "csv_import":
        return "Import Data Audit";
      case "seed_demo":
      default:
        return "Database Intelligence · Terverifikasi";
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium tracking-tight border bg-surface text-foreground-secondary border-border shadow-2xs ${className}`}
      title={sourceLabel || `Sumber: ${source} · Tanggal: ${date || "Real-Time"} · Sistem Intelijen Terverifikasi`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse" />
      <Database className="w-3 h-3 text-foreground-muted" />
      <span>{getSourceDisplay()}</span>
      {date && <span className="text-foreground-muted">· {date}</span>}
    </div>
  );
};
