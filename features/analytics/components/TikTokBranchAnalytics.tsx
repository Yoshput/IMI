"use client";

import React, { useState } from "react";
import {
  Video,
  AlertCircle,
  Plus,
  ArrowUpRight,
  TrendingUp,
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { TIKTOK_BRANCH_REGISTRY, TikTokBranchData, TikTokPostItem } from "@/lib/tiktok-accounts";

export const TikTokBranchAnalytics: React.FC = () => {
  const [branches, setBranches] = useState<TikTokBranchData[]>(TIKTOK_BRANCH_REGISTRY);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("pwt");
  const [showEntryModal, setShowEntryModal] = useState(false);

  // Form state for adding manual/semi-auto entry
  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<any>("frame_tryon");
  const [newViews, setNewViews] = useState("");
  const [newLikes, setNewLikes] = useState("");
  const [newComments, setNewComments] = useState("");
  const [newShares, setNewShares] = useState("");
  const [newStatus, setNewStatus] = useState<"trending" | "underperforming">("trending");
  const [newTakeaway, setNewTakeaway] = useState("");

  const activeBranch = branches.find((b) => b.branchId === selectedBranchId) || branches[0];

  // Auto-sync follower counts from live Google Sheets API
  React.useEffect(() => {
    const syncSheetsTikTok = async () => {
      try {
        const res = await fetch("/api/sync-sheets");
        const json = await res.json();
        if (json.success && json.data?.branchReels) {
          const sheetData = json.data;
          setBranches((prev) =>
            prev.map((b) => {
              const sheetKey =
                b.branchId === "pwt"
                  ? "Rekap PWT"
                  : b.branchId === "clp"
                  ? "Rekap CLP"
                  : b.branchId === "pbg"
                  ? "Rekap PBG"
                  : b.branchId === "wns"
                  ? "Rekap WNS"
                  : "Rekap TGL";
              const rows = sheetData.branchReels[sheetKey] || [];
              const lastWithFollowers = [...rows].reverse().find((r) => r.tiktokFollowers > 0);
              if (lastWithFollowers) {
                return {
                  ...b,
                  followers: lastWithFollowers.tiktokFollowers || b.followers,
                };
              }
              return b;
            })
          );
        }
      } catch (err) {
        // Fallback gracefully
      }
    };
    syncSheetsTikTok();
  }, []);

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const views = parseInt(newViews) || 0;
    const likes = parseInt(newLikes) || 0;
    const comments = parseInt(newComments) || 0;
    const shares = parseInt(newShares) || 0;
    const er = views > 0 ? Number((((likes + comments + shares) / views) * 100).toFixed(1)) : 0;

    const newItem: TikTokPostItem = {
      id: `tt-custom-${Date.now()}`,
      postUrl: newUrl.trim() || activeBranch.profileUrl,
      title: newTitle.trim(),
      category: newCategory,
      status: newStatus,
      uploadDate: new Date().toISOString().slice(0, 10),
      views,
      likes,
      comments,
      shares,
      engagementRate: er,
      keyTakeaway: newTakeaway.trim() || "Update performa mingguan yang dicatat PIC cabang.",
    };

    setBranches((prev) =>
      prev.map((b) => {
        if (b.branchId !== selectedBranchId) return b;
        return {
          ...b,
          trendingPosts: newStatus === "trending" ? [newItem, ...b.trendingPosts] : b.trendingPosts,
          underperformingPosts:
            newStatus === "underperforming" ? [newItem, ...b.underperformingPosts] : b.underperformingPosts,
        };
      })
    );

    // reset form
    setNewUrl("");
    setNewTitle("");
    setNewViews("");
    setNewLikes("");
    setNewComments("");
    setNewShares("");
    setNewTakeaway("");
    setShowEntryModal(false);
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-subtle space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20 flex items-center gap-1">
              <Video className="w-3 h-3" /> TIKTOK INTELLIGENCE
            </span>
            <span className="text-xs text-foreground-muted">
              Analisis Konten Rame vs Kurang Performa
            </span>
          </div>
          <h2 className="text-base font-bold text-foreground">
            TikTok Performance & Content Diagnostic per Cabang
          </h2>
          <p className="text-xs text-foreground-secondary">
            Perbandingan video trending dengan retention tinggi versus konten yang ditekan algoritma TikTok.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowEntryModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground text-surface text-xs font-semibold hover:opacity-90 transition-all shadow-subtle"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Input Post Mingguan</span>
          </button>
        </div>
      </div>

      {/* Branch Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {branches.map((b) => (
          <button
            key={b.branchId}
            onClick={() => setSelectedBranchId(b.branchId)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedBranchId === b.branchId
                ? "bg-foreground text-surface border-foreground shadow-subtle"
                : "bg-surface-secondary text-foreground-secondary border-border hover:text-foreground"
            }`}
          >
            <span>{b.branchName}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                selectedBranchId === b.branchId
                  ? "bg-surface/20 text-surface"
                  : "bg-border text-foreground-muted"
              }`}
            >
              {b.followers >= 1000 ? `${(b.followers / 1000).toFixed(1)}k` : b.followers}
            </span>
          </button>
        ))}
      </div>

      {/* Active Branch Stats Bar */}
      <div className="p-4 rounded-xl bg-surface-secondary/40 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground">{activeBranch.branchName}</span>
            <span className="text-xs font-mono text-brand font-semibold">{activeBranch.handle}</span>
            {activeBranch.isNewAccount && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                Akun Baru
              </span>
            )}
          </div>
          <p className="text-xs text-foreground-muted">
            PIC Reels & TikTok: <strong className="text-foreground">{activeBranch.picName}</strong> · Terakhir dievaluasi per cadence mingguan
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="text-right">
            <span className="text-[10px] text-foreground-muted block">Weekly Views</span>
            <span className="text-base font-bold text-foreground tabular-nums">
              {activeBranch.weeklyViews.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="h-7 w-px bg-border" />
          <div className="text-right">
            <span className="text-[10px] text-foreground-muted block">Avg ER</span>
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {activeBranch.avgEngagementRate}%
            </span>
          </div>
          <a
            href={activeBranch.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-surface border border-border text-foreground hover:text-brand hover:border-brand transition-all"
            title="Buka Profil TikTok"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* 2 Columns: Trending vs Underperforming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Kolom 1: Konten Lagi Rame (Trending) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span>Konten Performa Tinggi (High Performer)</span>
          </div>

          <div className="space-y-2.5">
            {activeBranch.trendingPosts.map((post) => (
              <div
                key={post.id}
                className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                    {post.category.replace(/_/g, " ")}
                  </span>
                  <a
                    href={post.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 hover:underline"
                  >
                    <span>Tonton Video</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>

                <h4 className="text-xs font-bold text-foreground leading-snug">
                  &quot;{post.title}&quot;
                </h4>

                <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] py-1 bg-surface rounded-lg border border-border">
                  <div>
                    <span className="text-foreground-muted block">Views</span>
                    <span className="font-bold text-foreground tabular-nums">
                      {post.views.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div>
                    <span className="text-foreground-muted block">Likes</span>
                    <span className="font-bold text-foreground tabular-nums">
                      {post.likes.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div>
                    <span className="text-foreground-muted block">Comments</span>
                    <span className="font-bold text-foreground tabular-nums">
                      {post.comments}
                    </span>
                  </div>
                  <div>
                    <span className="text-foreground-muted block">ER</span>
                    <span className="font-bold text-emerald-600 tabular-nums">
                      {post.engagementRate}%
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-foreground-secondary leading-relaxed bg-surface/60 p-2 rounded border border-border/50">
                  <strong className="text-foreground">Faktor Keberhasilan:</strong> {post.keyTakeaway}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom 2: Konten Kurang Performa */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
            <div className="p-1 rounded-md bg-amber-500/10 text-amber-600">
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <span>Konten yang Kurang Performa (Underperforming)</span>
          </div>

          <div className="space-y-2.5">
            {activeBranch.underperformingPosts.map((post) => (
              <div
                key={post.id}
                className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300">
                    {post.category.replace(/_/g, " ")}
                  </span>
                  <a
                    href={post.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300 hover:underline"
                  >
                    <span>Tonton Video</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>

                <h4 className="text-xs font-bold text-foreground leading-snug">
                  &quot;{post.title}&quot;
                </h4>

                <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] py-1 bg-surface rounded-lg border border-border">
                  <div>
                    <span className="text-foreground-muted block">Views</span>
                    <span className="font-bold text-foreground tabular-nums">
                      {post.views.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div>
                    <span className="text-foreground-muted block">Likes</span>
                    <span className="font-bold text-foreground tabular-nums">
                      {post.likes}
                    </span>
                  </div>
                  <div>
                    <span className="text-foreground-muted block">Comments</span>
                    <span className="font-bold text-foreground tabular-nums">
                      {post.comments}
                    </span>
                  </div>
                  <div>
                    <span className="text-foreground-muted block">ER</span>
                    <span className="font-bold text-amber-600 tabular-nums">
                      {post.engagementRate}%
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-foreground-secondary leading-relaxed bg-surface/60 p-2 rounded border border-border/50">
                  <strong className="text-foreground">Evaluasi & Saran:</strong> {post.keyTakeaway}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Manual Input Entry Modal */}
      {showEntryModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl max-w-lg w-full p-5 shadow-elevated space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Catat Konten TikTok Baru ({activeBranch.city})
                </h3>
                <p className="text-xs text-foreground-muted">
                  Formulir terstruktur kompatibel dengan TikTok Business API schema.
                </p>
              </div>
              <button
                onClick={() => setShowEntryModal(false)}
                className="text-foreground-muted hover:text-foreground text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPost} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">Judul / Hook Video</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: POV kacamata frame titanium anti patah"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Link Video TikTok (URL)</label>
                <input
                  type="url"
                  placeholder="https://www.tiktok.com/@.../video/..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Kategori Konten</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
                  >
                    <option value="frame_tryon">Frame Try-on</option>
                    <option value="edukasi_lensa">Edukasi Lensa</option>
                    <option value="behind_the_scenes">Behind The Scenes</option>
                    <option value="promo_diskon">Promo & Diskon</option>
                    <option value="humor_trend">Humor & Trend</option>
                    <option value="review_customer">Review Customer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">Status Performa</label>
                  <select
                    value={newStatus}
                    onChange={(e: any) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
                  >
                    <option value="trending">Performa Tinggi (High Performer)</option>
                    <option value="underperforming">Perlu Evaluasi Format</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-[10px] text-foreground-muted mb-1">Views</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newViews}
                    onChange={(e) => setNewViews(e.target.value)}
                    className="w-full px-2 py-1.5 bg-surface-secondary border border-border rounded text-center text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-foreground-muted mb-1">Likes</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newLikes}
                    onChange={(e) => setNewLikes(e.target.value)}
                    className="w-full px-2 py-1.5 bg-surface-secondary border border-border rounded text-center text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-foreground-muted mb-1">Comments</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newComments}
                    onChange={(e) => setNewComments(e.target.value)}
                    className="w-full px-2 py-1.5 bg-surface-secondary border border-border rounded text-center text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-foreground-muted mb-1">Shares</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newShares}
                    onChange={(e) => setNewShares(e.target.value)}
                    className="w-full px-2 py-1.5 bg-surface-secondary border border-border rounded text-center text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Catatan / Analisis Faktor Hasil</label>
                <textarea
                  rows={2}
                  placeholder="Apa yang membuat video ini ramai atau apa yang perlu diperbaiki?"
                  value={newTakeaway}
                  onChange={(e) => setNewTakeaway(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowEntryModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-foreground-secondary hover:text-foreground"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-foreground text-surface font-semibold hover:opacity-90"
                >
                  Simpan Konten
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
