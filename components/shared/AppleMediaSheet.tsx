"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ExternalLink,
  Copy,
  Check,
  Eye,
  Bookmark,
  Heart,
  MessageCircle,
  Share2,
  Award,
  Sparkles,
  Info,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

export interface AppleMediaItem {
  id: string;
  title: string;
  captionPreview?: string;
  category?: string;
  publishDate?: string;
  branchName?: string;
  pic?: string;
  reach?: number;
  likes?: number;
  comments?: number;
  saves?: number;
  saveRate?: number;
  engagementRate?: number;
  postUrl?: string;
  thumbnail?: string;
  bonus?: string;
  keyObservation?: string;
}

interface AppleMediaSheetProps {
  isOpen: boolean;
  onClose: () => void;
  item: AppleMediaItem | null;
}

export const AppleMediaSheet: React.FC<AppleMediaSheetProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  const [mode, setMode] = useState<"preview" | "zoom">("preview");
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setMode("preview");
      setZoomLevel(1);
      setPanPosition({ x: 0, y: 0 });
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        if (mode === "zoom") {
          setMode("preview");
          setZoomLevel(1);
          setPanPosition({ x: 0, y: 0 });
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, mode, onClose]);

  if (!isOpen || !item) return null;

  // Extract base URL or code for 3-tier endpoints
  const postUrl = item.postUrl || "";
  const thumbUrl = postUrl
    ? `/api/ig-thumbnail?url=${encodeURIComponent(postUrl)}&tier=preview`
    : item.thumbnail || "/covers/edukasi-lupa-kedip.png";

  const zoomUrl = postUrl
    ? `/api/ig-thumbnail?url=${encodeURIComponent(postUrl)}&tier=zoom`
    : item.thumbnail || "/covers/edukasi-lupa-kedip.png";

  const handleCopyLink = () => {
    if (postUrl) {
      navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToggleZoom = () => {
    if (mode === "preview") {
      setMode("zoom");
      setZoomLevel(1.8);
    } else {
      if (zoomLevel >= 2.5) {
        setZoomLevel(1);
        setMode("preview");
        setPanPosition({ x: 0, y: 0 });
      } else {
        setZoomLevel(zoomLevel + 0.8);
      }
    }
  };

  // Drag pan handlers for zoom
  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode === "zoom" && zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 transition-all duration-300">
      {/* iOS Frosted Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xl transition-opacity duration-300"
      />

      {/* TIER 3: FULL SCREEN DEEP ZOOM LIGHTBOX */}
      {mode === "zoom" ? (
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="relative z-10 w-full h-full max-w-6xl max-h-[92vh] rounded-[32px] bg-black/90 border border-white/15 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden select-none animate-in fade-in zoom-in-95 duration-200"
        >
          {/* iOS Floating Header Bar */}
          <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
              <span>Metode 3: Deep Zoom WebP ({Math.round(zoomLevel * 100)}%)</span>
            </div>

            <div className="pointer-events-auto flex items-center gap-2">
              <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full border border-white/15 p-1 text-white text-xs">
                <button
                  onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.5))}
                  className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2 font-mono font-semibold text-[11px]">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel(Math.min(3.5, zoomLevel + 0.5))}
                  className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => {
                  setMode("preview");
                  setZoomLevel(1);
                  setPanPosition({ x: 0, y: 0 });
                }}
                className="px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white text-xs font-semibold transition-all"
              >
                Kembali ke Preview
              </button>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Zoomable Image Viewport */}
          <div className="flex-1 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={zoomUrl}
              alt={item.title}
              style={{
                transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel})`,
                transition: isDragging ? "none" : "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              className="max-h-[82vh] max-w-[85vw] object-contain rounded-2xl shadow-2xl pointer-events-none"
              draggable={false}
            />
          </div>

          {/* Bottom Hint Pill */}
          <div className="absolute bottom-4 inset-x-0 z-20 flex justify-center pointer-events-none">
            <span className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/80 border border-white/10 text-[11px]">
              Klik & geser untuk panning · Double click atau gunakan tombol untuk zoom
            </span>
          </div>
        </div>
      ) : (
        /* TIER 2: PAS DI KLIK (APPLE IOS INTERACTIVE CARD SHEET) */
        <div className="relative z-10 w-full sm:max-w-xl md:max-w-2xl bg-surface/95 dark:bg-zinc-900/95 border border-white/20 dark:border-white/10 rounded-t-[32px] sm:rounded-[32px] shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-300">
          {/* iOS Handle Bar on Mobile */}
          <div className="sm:hidden pt-3 pb-1 flex justify-center">
            <div className="w-10 h-1 rounded-full bg-foreground/20" />
          </div>

          {/* Top Bar with iOS Close Button */}
          <div className="p-4 pb-2 flex items-center justify-between border-b border-border/60">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-light text-brand border border-brand/20">
                Metode 2: Preview WebP Crisp
              </span>
              {item.branchName && (
                <span className="text-[11px] font-semibold text-foreground-secondary">
                  {item.branchName}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleToggleZoom}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-secondary hover:bg-surface-subtle text-foreground text-xs font-semibold border border-border transition-colors"
                title="Zoom Mode (Metode 3)"
              >
                <Maximize2 className="w-3 h-3 text-brand" />
                <span>Zoom</span>
              </button>

              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-surface-secondary hover:bg-surface-subtle flex items-center justify-center text-foreground-secondary hover:text-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="overflow-y-auto p-5 space-y-4 no-scrollbar">
            {/* Visual Cover Stage */}
            <div className="relative aspect-square sm:aspect-[4/3] rounded-[24px] overflow-hidden bg-black/5 dark:bg-black/30 border border-border/70 shadow-subtle group cursor-pointer" onClick={handleToggleZoom}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Top Corner Pill */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-semibold text-[10px] border border-white/15">
                  WebP Kompresi Ringan
                </span>
                {item.bonus && item.bonus !== "-" && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 text-white font-bold text-[10px] border border-white/20">
                    Bonus: {item.bonus}
                  </span>
                )}
              </div>

              {/* Floating Zoom Tap Indicator */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-semibold border border-white/20 flex items-center gap-1">
                  <ZoomIn className="w-3 h-3 text-brand" />
                  <span>Ketuk untuk Zoom Detail</span>
                </div>
              </div>

              {/* Title & Date on Image Footer */}
              <div className="absolute bottom-3 inset-x-3 text-white space-y-1">
                <p className="text-sm sm:text-base font-bold line-clamp-2 drop-shadow-md">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-white/80">
                  {item.pic && <span>PIC: {item.pic}</span>}
                  <span>·</span>
                  <span>{item.publishDate}</span>
                </div>
              </div>
            </div>

            {/* iOS Action Buttons Capsule */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {postUrl && (
                <a
                  href={postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-brand text-white text-xs font-semibold hover:bg-brand-hover transition-all shadow-subtle"
                >
                  <span>Buka di Instagram Asli</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <button
                onClick={handleToggleZoom}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-surface-secondary border border-border text-foreground text-xs font-semibold hover:bg-surface-subtle transition-all"
              >
                <ZoomIn className="w-3.5 h-3.5 text-brand" />
                <span>Zoom Gambar (Tier 3)</span>
              </button>

              {postUrl && (
                <button
                  onClick={handleCopyLink}
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full border text-xs font-semibold transition-all ${
                    copied
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-surface-secondary border-border text-foreground hover:bg-surface-subtle"
                  }`}
                  title="Salin Tautan Postingan"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Tersalin!" : "Salin Link"}</span>
                </button>
              )}
            </div>

            {/* Metrics Breakdown Apple Style Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="p-3 rounded-[20px] bg-surface-secondary border border-border/80 text-center">
                <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                  Reach / Viewers
                </span>
                <span className="text-base font-bold text-foreground mt-0.5 block tabular-nums">
                  {formatNumber(item.reach || 0)}
                </span>
              </div>

              <div className="p-3 rounded-[20px] bg-surface-secondary border border-border/80 text-center">
                <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                  Likes Instagram
                </span>
                <span className="text-base font-bold text-foreground mt-0.5 block tabular-nums">
                  {formatNumber(item.likes || 0)}
                </span>
              </div>

              <div className="p-3 rounded-[20px] bg-surface-secondary border border-border/80 text-center">
                <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                  Saves
                </span>
                <span className="text-base font-bold text-brand mt-0.5 block tabular-nums">
                  {formatNumber(item.saves || 0)}
                </span>
              </div>

              <div className="p-3 rounded-[20px] bg-surface-secondary border border-border/80 text-center">
                <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                  Save Rate
                </span>
                <span className="text-base font-bold text-emerald-700 dark:text-emerald-400 mt-0.5 block tabular-nums">
                  {item.saveRate || 3.2}%
                </span>
              </div>
            </div>

            {/* Caption & Observation */}
            {item.captionPreview && (
              <div className="p-3.5 rounded-[20px] bg-surface-secondary border border-border text-xs space-y-1">
                <span className="font-bold text-foreground block text-[11px] uppercase tracking-wider">
                  Keterangan / Laporan PIC:
                </span>
                <p className="text-foreground-secondary leading-relaxed">
                  {item.captionPreview}
                </p>
              </div>
            )}

            {item.keyObservation && (
              <div className="p-3.5 rounded-[20px] bg-brand-light/30 border border-brand/20 text-xs flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                <p className="text-foreground text-[11px] leading-relaxed">
                  <strong className="text-brand font-semibold">Observasi Analis:</strong>{" "}
                  {item.keyObservation}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
