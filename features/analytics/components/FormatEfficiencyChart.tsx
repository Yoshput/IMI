import React from "react";
import { ACTUAL_FORMAT_PERFORMANCE } from "@/lib/actual-marketing-data";
import { ProvenanceBadge } from "@/components/shared/ProvenanceBadge";
import { ThumbsUp, Eye } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export const FormatEfficiencyChart: React.FC = () => {
  const maxReach = 25000;

  return (
    <div className="p-6 rounded-container bg-surface border border-border shadow-subtle flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand">
            Pertanyaan Utama #2
          </span>
          <ProvenanceBadge
            source="sheets_sync"
            date="6 Oktober 2026"
            isDemo={false}
            sourceLabel="Rata-rata 600+ Postingan Rekap Evaluasi Google Sheets 5 Cabang & Live Meta"
          />
        </div>

        <h3 className="heading-section text-foreground leading-snug">
          &ldquo;Pilar konten mana yang paling efektif mendongkrak rata-rata tayangan (Viewers) &amp; interaksi?&rdquo;
        </h3>
        <p className="text-xs text-foreground-secondary mt-1">
          Dihitung dari akumulasi performa 600+ baris data riil di Google Sheets 5 cabang Optik I See You &amp; Lunar Eyewear.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {ACTUAL_FORMAT_PERFORMANCE.map((item) => {
          const barWidth = Math.min(100, Math.round((item.avgReach / maxReach) * 100));

          return (
            <div key={item.format} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-foreground">{item.format}</span>
                  <span className="text-[10px] text-foreground-muted ml-1.5">({item.totalPosts} video)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-foreground font-medium flex items-center gap-1">
                    <Eye className="w-3 h-3 text-foreground-muted" />
                    Avg {formatNumber(item.avgReach)} views
                  </span>
                  <span className="font-bold text-emerald-700 flex items-center gap-0.5">
                    <ThumbsUp className="w-3 h-3" />
                    {item.avgLikes} likes
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-surface-subtle h-3 rounded-full overflow-hidden">
                <div
                  style={{ width: `${barWidth}%` }}
                  className={`h-full rounded-full transition-all ${
                    item.avgReach >= 10000
                      ? "bg-brand"
                      : item.avgReach >= 5000
                      ? "bg-emerald-600"
                      : "bg-[#9FB2A9]"
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
          Pilar Edukasi &amp; Otoritas Medis menghasilkan tayangan tertinggi (rata-rata 23.127 viewers) didorong problem solving masalah mata audiens. Metrik Save Rate ditiadakan dari tabel karena tidak dicatat di spreadsheet &amp; menunggu integrasi Meta Graph API resmi.
        </span>
      </div>
    </div>
  );
};
