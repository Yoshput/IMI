import React from "react";
import { DEMO_HISTORICAL_TRENDS } from "@/lib/seed-data";
import { formatNumber } from "@/lib/utils";
import { ProvenanceBadge } from "@/components/shared/ProvenanceBadge";

export const SingleQuestionChart: React.FC = () => {
  const maxReach = Math.max(...DEMO_HISTORICAL_TRENDS.map((t) => t.reach));

  return (
    <div className="p-6 rounded-container bg-surface border border-border shadow-subtle flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 pb-2">
          {/* Question-oriented Title (DESIGN.md §17, ANTISLOP.md §19) */}
          <span className="text-xs font-bold uppercase tracking-wider text-brand">
            Pertanyaan Utama #1
          </span>
          <ProvenanceBadge source="instagram_insights" date="2026-09-14" isDemo={true} />
        </div>

        <h3 className="heading-section text-foreground leading-snug">
          &ldquo;Bagaimana tren jangkauan akun (Reach) dan interaksi selama 5 minggu terakhir?&rdquo;
        </h3>
        <p className="text-xs text-foreground-secondary mt-1">
          Menampilkan pertumbuhan akun dari Week 33 hingga Week 37. Perhatikan lonjakan pada W37 setelah tim beralih ke video Reels POV Try-on.
        </p>
      </div>

      {/* Clean Bar Visualization with Clear Values */}
      <div className="mt-8 space-y-4">
        <div className="grid grid-cols-5 gap-3 items-end h-44 pt-6 pb-2 border-b border-border/80">
          {DEMO_HISTORICAL_TRENDS.map((t, idx) => {
            const heightPercent = Math.round((t.reach / maxReach) * 100);
            const isLatest = idx === DEMO_HISTORICAL_TRENDS.length - 1;

            return (
              <div key={t.week} className="flex flex-col items-center h-full justify-end group">
                <span
                  className={`text-[11px] font-bold mb-1.5 transition-colors ${
                    isLatest ? "text-brand" : "text-foreground-secondary"
                  }`}
                >
                  {formatNumber(t.reach)}
                </span>
                <div className="w-full bg-surface-subtle rounded-t flex items-end h-full p-0.5">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t transition-all ${
                      isLatest
                        ? "bg-brand hover:bg-brand-hover"
                        : "bg-[#9FB2A9] hover:bg-brand/80"
                    }`}
                  />
                </div>
                <span
                  className={`text-[11px] font-semibold mt-2 ${
                    isLatest ? "text-foreground font-bold" : "text-foreground-muted"
                  }`}
                >
                  {t.week}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend & Context Note */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-foreground-secondary pt-1">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-brand" />
              <span>Minggu Berjalan (W37)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#9FB2A9]" />
              <span>Minggu Sebelumnya</span>
            </div>
          </div>
          <span className="text-[11px] text-foreground-muted">
            +52.9% kenaikan total reach sejak Week 33
          </span>
        </div>
      </div>
    </div>
  );
};
