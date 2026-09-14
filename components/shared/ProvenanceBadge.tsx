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
  isDemo = true,
  className = "",
}) => {
  const getSourceDisplay = () => {
    switch (source) {
      case "instagram_insights":
        return isDemo ? "Simulasi IG Insights" : "Salinan Manual IG Insights";
      case "manual":
        return isDemo ? "Simulasi Input Manual" : "Input Manual Tim";
      case "csv_import":
        return isDemo ? "Simulasi CSV" : "Import File CSV";
      case "seed_demo":
      default:
        return "Simulasi Data Seed";
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium tracking-tight border ${
        isDemo
          ? "bg-[#F4F4F6] text-[#4B5563] border-[#E5E7EB]"
          : "bg-[#EAEFEA] text-[#1E3A34] border-[#D1E0D3]"
      } ${className}`}
      title={sourceLabel || `Sumber: ${source} · Tanggal: ${date || "N/A"} · Tidak ada scraping otomatis`}
    >
      <Database className="w-3 h-3 text-current opacity-70" />
      <span>{getSourceDisplay()}</span>
      {date && <span className="opacity-60">· {date}</span>}
      {isDemo && (
        <span className="font-bold text-[9px] uppercase tracking-wider px-1 py-0.2 bg-white rounded border border-[#E5E7EB] text-amber-800">
          SEED
        </span>
      )}
    </div>
  );
};
