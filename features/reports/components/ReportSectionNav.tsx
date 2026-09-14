import React from "react";
import { Bookmark, CheckCircle, AlertTriangle, Lightbulb, Users, Bot, FileText, Building2 } from "lucide-react";

interface ReportSectionNavProps {
  activeSection: string;
  onSelectSection: (id: string) => void;
}

export const ReportSectionNav: React.FC<ReportSectionNavProps> = ({
  activeSection,
  onSelectSection,
}) => {
  const sections = [
    { id: "sec-summary", label: "Ringkasan Eksekutif", icon: FileText },
    { id: "sec-metrics", label: "Metrik Deterministik", icon: Bookmark },
    { id: "sec-achievements", label: "Pencapaian Mingguan", icon: CheckCircle },
    { id: "sec-obstacles", label: "Kendala Lapangan", icon: AlertTriangle },
    { id: "sec-strategy", label: "Plan & Strategi", icon: Lightbulb },
    { id: "sec-team-input", label: "Masukan Tim & Divisi", icon: Users },
    { id: "sec-branch-evidence", label: "Kehadiran Fisik Cabang", icon: Building2 },
    { id: "sec-ai-layer", label: "Analisis & Rekomendasi", icon: Bot },
  ];

  return (
    <aside className="w-full lg:w-56 shrink-0 space-y-2">
      <div className="text-[11px] font-bold uppercase tracking-wider text-foreground-secondary px-3 mb-2">
        Daftar Bagian Laporan
      </div>
      <nav className="space-y-1">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => onSelectSection(sec.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-control text-xs font-medium text-left transition-all ${
                isActive
                  ? "bg-brand text-white font-semibold shadow-subtle"
                  : "text-foreground-secondary hover:text-foreground hover:bg-surface-secondary"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0 opacity-80" />
              <span className="truncate">{sec.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="pt-4 px-3 border-t border-border mt-4 text-[11px] text-foreground-muted">
        <p className="leading-snug">
          Laporan ini dirancang sesuai format baku mingguan ke manajemen & owner.
        </p>
      </div>
    </aside>
  );
};
