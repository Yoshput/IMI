import React from "react";
import { MetricRecord } from "@/types";
import { formatNumber } from "@/lib/utils";
import { ProvenanceBadge } from "@/components/shared/ProvenanceBadge";
import { History } from "lucide-react";

interface MetricHistoryTableProps {
  records: MetricRecord[];
}

export const MetricHistoryTable: React.FC<MetricHistoryTableProps> = ({ records }) => {
  return (
    <div className="rounded-container bg-surface border border-border shadow-subtle overflow-hidden">
      <div className="p-4 border-b border-border bg-surface-secondary flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-foreground-secondary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
            Audit Trail & Riwayat Metrik Tersimpan
          </h3>
        </div>
        <span className="text-[11px] text-foreground-muted">
          Total {records.length} rekaman data
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-subtle text-[11px] font-semibold text-foreground-secondary uppercase tracking-wider">
              <th className="py-3 px-4">Tanggal</th>
              <th className="py-3 px-4">Metrik</th>
              <th className="py-3 px-4 text-right">Nilai Tercatat</th>
              <th className="py-3 px-4">Sumber (Provenance)</th>
              <th className="py-3 px-4">Catatan Operasional</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {records.map((r) => (
              <tr key={r.id} className="hover:bg-surface-secondary/60 transition-colors">
                <td className="py-3.5 px-4 font-medium text-foreground whitespace-nowrap">
                  {r.date}
                </td>
                <td className="py-3.5 px-4 font-semibold text-foreground">
                  {r.label}
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-brand whitespace-nowrap">
                  {formatNumber(r.value)} {r.unit || ""}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <ProvenanceBadge
                    source={r.source}
                    date={r.date}
                    sourceLabel={r.sourceLabel}
                    isDemo={r.isDemo}
                  />
                </td>
                <td className="py-3.5 px-4 text-foreground-secondary text-[11px] max-w-sm leading-relaxed">
                  {r.notes || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
