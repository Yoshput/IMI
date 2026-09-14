import React from "react";
import { PriorityIssue } from "@/types";
import { AlertCircle, Lightbulb, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PriorityAttentionProps {
  issues: PriorityIssue[];
}

export const PriorityAttention: React.FC<PriorityAttentionProps> = ({ issues }) => {
  const getIssueBadge = (type: PriorityIssue["type"]) => {
    switch (type) {
      case "opportunity":
        return {
          icon: Lightbulb,
          label: "Peluang Konten",
          bg: "bg-brand-accentLight text-amber-900 border-amber-300",
        };
      case "concern":
        return {
          icon: AlertCircle,
          label: "Perlu Evaluasi",
          bg: "bg-status-errorBg text-status-error border-status-error/30",
        };
      case "observation":
      default:
        return {
          icon: MessageSquare,
          label: "Inbound Customer",
          bg: "bg-brand-light text-brand border-brand/20",
        };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-foreground-secondary">
            Area Fokus & Evaluasi Mingguan
          </h2>
          <p className="text-sm text-foreground mt-0.5">
            Poin kritis yang memerlukan tindakan tim konten sebelum rapat mingguan
          </p>
        </div>
        <Link
          href="/reports"
          className="text-xs font-medium text-brand hover:underline inline-flex items-center gap-1"
        >
          Lihat di Draft Laporan
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-3">
        {issues.map((issue) => {
          const badge = getIssueBadge(issue.type);
          const Icon = badge.icon;
          return (
            <div
              key={issue.id}
              className="p-5 rounded-container bg-surface border border-border hover:border-foreground-secondary/40 transition-colors shadow-subtle flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${badge.bg}`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{badge.label}</span>
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    {issue.title}
                  </span>
                </div>
                <p className="text-xs text-foreground-secondary leading-relaxed">
                  {issue.description}
                </p>
                <div className="pt-1 flex items-center gap-2 text-xs">
                  <span className="font-semibold text-brand">Rekomendasi Tindakan:</span>
                  <span className="text-foreground">{issue.suggestedAction}</span>
                </div>
              </div>

              <div className="md:text-right shrink-0">
                <span className="text-[11px] text-foreground-muted uppercase tracking-wider block">
                  Dampak Metrik
                </span>
                <span className="text-sm font-bold text-foreground block mt-0.5">
                  {issue.impactMetric}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
