import React, { useState } from "react";
import { ContentItem } from "@/types";
import { formatNumber } from "@/lib/utils";
import { Eye, Bookmark, MessageSquare, ThumbsUp, Layers, Video, Image as ImageIcon, ExternalLink, ZoomIn } from "lucide-react";
import { ProvenanceBadge } from "@/components/shared/ProvenanceBadge";
import { AppleMediaSheet } from "@/components/shared/AppleMediaSheet";

interface RankedContentTableProps {
  items: ContentItem[];
}

export const RankedContentTable: React.FC<RankedContentTableProps> = ({ items }) => {
  const [selectedMediaItem, setSelectedMediaItem] = useState<ContentItem | null>(null);

  const getFormatIcon = (format: ContentItem["format"]) => {
    switch (format) {
      case "reels":
        return <Video className="w-3 h-3 text-emerald-700" />;
      case "carousel":
        return <Layers className="w-3 h-3 text-blue-700" />;
      case "feed":
      default:
        return <ImageIcon className="w-3 h-3 text-amber-700" />;
    }
  };

  return (
    <div className="rounded-container bg-surface border border-border overflow-hidden shadow-subtle">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-surface-secondary text-[11px] font-bold uppercase tracking-wider text-foreground-secondary">
              <th className="py-3.5 px-4 w-12 text-center">Rank</th>
              <th className="py-3.5 px-4">Konten & Cover Instagram</th>
              <th className="py-3.5 px-3">Format</th>
              <th className="py-3.5 px-3 text-right">Reach</th>
              <th className="py-3.5 px-3 text-right">Saves</th>
              <th className="py-3.5 px-3 text-right">Save %</th>
              <th className="py-3.5 px-3 text-right">Interaksi</th>
              <th className="py-3.5 px-4">Observasi Analis</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-surface-secondary/70 transition-colors group"
              >
                {/* Rank number badge */}
                <td className="py-4 px-4 text-center font-bold">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs ${
                      item.rank === 1
                        ? "bg-brand text-white font-bold"
                        : item.rank === 2
                        ? "bg-foreground text-white font-semibold"
                        : "bg-surface-subtle text-foreground-secondary"
                    }`}
                  >
                    #{item.rank}
                  </span>
                </td>

                {/* Title, Photo Thumbnail & Branch */}
                <td className="py-4 px-4 max-w-sm">
                  <div className="flex items-start gap-3">
                    {item.thumbnail && (
                      <div
                        onClick={() => setSelectedMediaItem(item)}
                        className="w-14 h-14 rounded-2xl overflow-hidden bg-surface-subtle shrink-0 border border-border/80 relative shadow-subtle group/thumb cursor-pointer hover:ring-2 hover:ring-brand/40 transition-all"
                        title="Klik untuk Preview & Zoom (Apple iOS Sheet)"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            item.thumbnail.includes("/api/ig-thumbnail") && !item.thumbnail.includes("tier=")
                              ? `${item.thumbnail}&tier=thumb`
                              : item.thumbnail
                          }
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <ZoomIn className="w-4 h-4 text-white drop-shadow" />
                        </div>
                      </div>
                    )}
                    <div className="space-y-1 min-w-0">
                      <div
                        onClick={() => setSelectedMediaItem(item)}
                        className="font-semibold text-foreground group-hover:text-brand transition-colors block text-xs leading-snug line-clamp-2 cursor-pointer hover:underline"
                        title="Buka Preview Apple Style"
                      >
                        {item.title}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-foreground-muted">
                        {item.branchName && (
                          <span className="px-1.5 py-0.2 rounded bg-brand-light text-brand font-semibold text-[10px]">
                            {item.branchName}
                          </span>
                        )}
                        {item.pic && (
                          <span className="px-1.5 py-0.2 rounded bg-surface-subtle text-foreground font-semibold text-[10px] border border-border">
                            PIC: {item.pic}
                          </span>
                        )}
                        <span className="px-1.5 py-0.2 rounded bg-surface-subtle text-foreground-secondary font-medium">
                          {item.category}
                        </span>
                        <span>·</span>
                        <span>{item.publishDate}</span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Format Tag */}
                <td className="py-4 px-3 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-surface-secondary border border-border">
                    {getFormatIcon(item.format)}
                    <span className="capitalize">{item.format}</span>
                  </span>
                </td>

                {/* Reach */}
                <td className="py-4 px-3 text-right font-medium text-foreground whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <Eye className="w-3 h-3 text-foreground-muted" />
                    <span>{formatNumber(item.reach)}</span>
                  </div>
                </td>

                {/* Saves */}
                <td className="py-4 px-3 text-right font-bold text-brand whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <Bookmark className="w-3 h-3" />
                    <span>{formatNumber(item.saves)}</span>
                  </div>
                </td>

                {/* Save Rate */}
                <td className="py-4 px-3 text-right whitespace-nowrap">
                  <span
                    className={`font-semibold px-1.5 py-0.5 rounded text-[11px] ${
                      item.saveRate >= 4.0
                        ? "bg-status-successBg text-status-success"
                        : "bg-surface-secondary text-foreground-muted"
                    }`}
                  >
                    {item.saveRate}%
                  </span>
                </td>

                {/* Interactions breakdown */}
                <td className="py-4 px-3 text-right text-foreground-secondary whitespace-nowrap">
                  <span title={`Likes: ${item.likes}, Comments: ${item.comments}, Shares: ${item.shares}`}>
                    {formatNumber(item.likes + item.comments + item.shares)}
                  </span>
                </td>

                {/* Key observation / notes */}
                <td className="py-4 px-4 max-w-xs text-foreground-secondary leading-relaxed">
                  <div className="text-[11px]">
                    <p className="line-clamp-2">{item.keyObservation}</p>
                    <div className="mt-1">
                      <ProvenanceBadge
                        source={item.source}
                        date={item.publishDate}
                        isDemo={item.isDemo}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Apple iOS Style Interactive Media Sheet (Tier 2 & Tier 3 Zoom) */}
      <AppleMediaSheet
        isOpen={!!selectedMediaItem}
        onClose={() => setSelectedMediaItem(null)}
        item={selectedMediaItem}
      />
    </div>
  );
};
