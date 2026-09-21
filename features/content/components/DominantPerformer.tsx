import React, { useState } from "react";
import { ContentItem } from "@/types";
import { formatNumber } from "@/lib/utils";
import { Trophy, Bookmark, MessageCircle, Eye, Share2, TrendingUp, Heart, ZoomIn } from "lucide-react";
import { ProvenanceBadge } from "@/components/shared/ProvenanceBadge";
import { AppleMediaSheet } from "@/components/shared/AppleMediaSheet";

interface DominantPerformerProps {
  item: ContentItem;
}

export const DominantPerformer: React.FC<DominantPerformerProps> = ({ item }) => {
  const [isOpenPreview, setIsOpenPreview] = useState(false);

  return (
    <div className="p-6 md:p-8 rounded-container bg-surface border border-brand/20 shadow-elevated mb-8 relative overflow-hidden">
      {/* Top Banner Tag */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-border/80">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-control bg-brand text-white text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            Rank #1 Top Performer Minggu Ini
          </span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-brand-light text-brand">
            {item.category}
          </span>
        </div>
        <ProvenanceBadge source={item.source} date={item.publishDate} isDemo={item.isDemo} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Real Store Footage Preview */}
        <div
          onClick={() => setIsOpenPreview(true)}
          className="lg:col-span-4 aspect-[4/5] rounded-control flex flex-col justify-between p-5 text-white shadow-subtle relative overflow-hidden group cursor-pointer hover:ring-2 hover:ring-brand/50 transition-all"
          title="Klik untuk Preview & Zoom (Apple iOS Sheet)"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.thumbnail || "/covers/trend-dewasa-passwordnya.png"}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />

          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded bg-black/60 backdrop-blur-md uppercase border border-white/10">
              {item.branchName ? `Reels @ ${item.branchName}` : "Reels Instagram"}
            </span>
            <span className="text-xs font-bold text-amber-300 px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm">
              Save Rate {item.saveRate}%
            </span>
          </div>

          <div className="relative z-10 space-y-1.5">
            <div className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>{item.branchName || "Optik I See You"} {item.pic ? `(PIC: ${item.pic})` : ""}</span>
            </div>
            <p className="text-sm font-bold line-clamp-3 leading-snug drop-shadow-sm">
              &ldquo;{item.title}&rdquo;
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[11px] text-white/90 pt-2 border-t border-white/20">
            <span>Terbit: {item.publishDate}</span>
            {item.postUrl && (
              <a
                href={item.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-emerald-300 hover:text-white underline inline-flex items-center gap-1"
              >
                <span>Buka Instagram</span>
                <Eye className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Performer Details & Evidence Metrics */}
        <div className="lg:col-span-8 flex flex-col justify-between h-full space-y-6">
          <div>
            <h2 className="display-large text-foreground leading-tight tracking-tight">
              {item.title}
            </h2>
            <p className="text-sm text-foreground-secondary mt-3 leading-relaxed">
              {item.captionPreview}
            </p>
          </div>

          {/* Metric Breakdown Grid (Dominant Performer has 4 Key Stats) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-border">
            <div className="p-3 rounded-control bg-surface-secondary">
              <div className="flex items-center gap-1.5 text-xs text-foreground-secondary mb-1">
                <Eye className="w-3.5 h-3.5" />
                <span>Total Reach</span>
              </div>
              <span className="text-xl font-bold text-foreground block">
                {formatNumber(item.reach)}
              </span>
              <span className="text-[10px] text-status-success font-semibold">
                78% non-followers
              </span>
            </div>

            <div className="p-3 rounded-control bg-brand-accentLight border border-amber-200">
              <div className="flex items-center gap-1.5 text-xs text-amber-900 font-medium mb-1">
                <Bookmark className="w-3.5 h-3.5 text-amber-800" />
                <span>Saves (Disimpan)</span>
              </div>
              <span className="text-xl font-bold text-amber-950 block">
                {formatNumber(item.saves)}
              </span>
              <span className="text-[10px] text-amber-800 font-semibold">
                2.4× di atas rata-rata
              </span>
            </div>

            <div className="p-3 rounded-control bg-surface-secondary">
              <div className="flex items-center gap-1.5 text-xs text-foreground-secondary mb-1">
                <Heart className="w-3.5 h-3.5" />
                <span>Likes</span>
              </div>
              <span className="text-xl font-bold text-foreground block">
                {formatNumber(item.likes)}
              </span>
              <span className="text-[10px] text-foreground-muted">
                Interaksi organik
              </span>
            </div>

            <div className="p-3 rounded-control bg-surface-secondary">
              <div className="flex items-center gap-1.5 text-xs text-foreground-secondary mb-1">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Komentar & DM</span>
              </div>
              <span className="text-xl font-bold text-foreground block">
                {item.comments}
              </span>
              <span className="text-[10px] text-brand font-semibold">
                Tanya harga & lokasi
              </span>
            </div>
          </div>

          {/* Editorial Observation / Why it won */}
          <div className="p-4 rounded-control bg-surface-secondary border border-border flex items-start gap-3">
            <div className="w-7 h-7 rounded bg-brand-light flex items-center justify-center text-brand shrink-0 mt-0.5">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                Catatan Analisis Tim Konten
              </span>
              <p className="text-xs text-foreground-secondary mt-0.5">
                {item.keyObservation}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Apple iOS Preview Sheet */}
      <AppleMediaSheet
        isOpen={isOpenPreview}
        onClose={() => setIsOpenPreview(false)}
        item={item}
      />
    </div>
  );
};
