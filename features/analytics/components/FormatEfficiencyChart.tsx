import React from "react";
import { DEMO_FORMAT_PERFORMANCE } from "@/lib/seed-data";
import { ProvenanceBadge } from "@/components/shared/ProvenanceBadge";
import { Bookmark, Eye } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export const FormatEfficiencyChart: React.FC = () => {
  return (
    <div className="p-6 rounded-container bg-surface border border-border shadow-subtle flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand">
            Pertanyaan Utama #2
          </span>
          <ProvenanceBadge source="seed_demo" date="2026-09-14" isDemo={true} />
        </div>

        <h3 className="heading-section text-foreground leading-snug">
          &ldquo;Format konten mana yang paling efektif memicu audiens menyimpan referensi (Saves)?&rdquo;
        </h3>
        <p className="text-xs text-foreground-secondary mt-1">
          Rata-rata rasio simpanan frame kacamata dan estimasi jangkauan rata-rata per tipe postingan.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {DEMO_FORMAT_PERFORMANCE.map((item) => {
          const maxRate = 5.0;
          const barWidth = Math.min(100, Math.round((item.avgSaveRate / maxRate) * 100));

          return (
            <div key={item.format} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">{item.format}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-foreground-muted flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Avg {formatNumber(item.avgReach)} reach
                  </span>
                  <span className="font-bold text-brand flex items-center gap-0.5">
                    <Bookmark className="w-3 h-3" />
                    {item.avgSaveRate}% save
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-surface-subtle h-3 rounded-full overflow-hidden">
                <div
                  style={{ width: `${barWidth}%` }}
                  className={`h-full rounded-full transition-all ${
                    item.avgSaveRate >= 4.0
                      ? "bg-brand"
                      : item.avgSaveRate >= 2.0
                      ? "bg-[#84A999]"
                      : "bg-[#D1D5DB]"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-border/70 text-xs text-foreground-secondary">
        <span className="font-semibold text-foreground">Kesimpulan Analis: </span>
        <span>
          Reels POV Try-on menghasilkan konversi simpan 5.7× lebih tinggi dibandingkan foto poster statis.
        </span>
      </div>
    </div>
  );
};
