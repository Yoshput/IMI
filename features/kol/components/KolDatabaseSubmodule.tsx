"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  Filter,
  SlidersHorizontal,
  Plus,
  Download,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  ExternalLink,
  MessageCircle,
  Sparkles,
  MapPin,
  Instagram,
  Video,
  CheckCircle2,
  AlertCircle,
  Tag,
  TrendingUp,
  LayoutGrid,
  Table as TableIcon,
  ShieldCheck,
  Package,
} from "lucide-react";
import { Creator, PipelineStage, PriorityLevelType, PlatformType, ContentCategoryType } from "../types";
import { PIPELINE_STAGES, CONTENT_CATEGORIES, LOCATIONS_LIST } from "../constants";
import { exportCreatorsCSV } from "../services/kol-storage";

interface KolDatabaseSubmoduleProps {
  creators: Creator[];
  onSelectCreator: (creator: Creator) => void;
  onEditCreator: (creator: Creator) => void;
  onDeleteCreator: (creator: Creator) => void;
  onAddNewCreator: () => void;
  onOpenMessageGenerator: (creator: Creator) => void;
}

export const KolDatabaseSubmodule: React.FC<KolDatabaseSubmoduleProps> = ({
  creators,
  onSelectCreator,
  onEditCreator,
  onDeleteCreator,
  onAddNewCreator,
  onOpenMessageGenerator,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all"); // micro, mid, macro
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"potential" | "followers" | "engagement" | "name">("potential");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [showAddresses, setShowAddresses] = useState(false);

  // Filter & Search Logic
  const filteredCreators = useMemo(() => {
    return creators
      .filter((c) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = c.name.toLowerCase().includes(q);
          const matchHandle = c.instagramHandle.toLowerCase().includes(q);
          const matchTiktok = (c.tiktokHandle || "").toLowerCase().includes(q);
          const matchCity = c.city.toLowerCase().includes(q);
          const matchNotes = (c.evaluation.internalNotes || "").toLowerCase().includes(q);
          if (!matchName && !matchHandle && !matchTiktok && !matchCity && !matchNotes) {
            return false;
          }
        }

        // Platform Filter
        if (platformFilter !== "all" && c.platform !== platformFilter) {
          return false;
        }

        // Location Filter
        if (locationFilter !== "all" && !c.city.toLowerCase().includes(locationFilter.toLowerCase())) {
          return false;
        }

        // Category Filter
        if (categoryFilter !== "all" && c.category !== categoryFilter) {
          return false;
        }

        // Follower Tier Filter
        if (tierFilter === "micro" && c.instagramFollowers >= 20000) return false;
        if (tierFilter === "mid" && (c.instagramFollowers < 20000 || c.instagramFollowers > 100000)) return false;
        if (tierFilter === "macro" && c.instagramFollowers <= 100000) return false;

        // Stage Filter
        if (stageFilter !== "all" && c.collaboration.stage !== stageFilter) {
          return false;
        }

        // Priority Filter
        if (priorityFilter !== "all" && c.evaluation.priorityLevel !== priorityFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "potential") {
          return (b.evaluation.potentialScore || 0) - (a.evaluation.potentialScore || 0);
        }
        if (sortBy === "followers") {
          return (b.instagramFollowers || 0) - (a.instagramFollowers || 0);
        }
        if (sortBy === "engagement") {
          return (b.engagementRate || 0) - (a.engagementRate || 0);
        }
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [
    creators,
    searchQuery,
    platformFilter,
    locationFilter,
    categoryFilter,
    tierFilter,
    stageFilter,
    priorityFilter,
    sortBy,
  ]);

  const handleExport = () => {
    exportCreatorsCSV(filteredCreators, `kol-creators-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const getStageMeta = (stageId: PipelineStage) => {
    return PIPELINE_STAGES.find((s) => s.id === stageId) || PIPELINE_STAGES[0];
  };

  return (
    <div className="space-y-4">
      {/* ========================================================================= */}
      {/* 1. TOP TOOLBAR: SEARCH, FILTERS & ACTION BUTTONS                          */}
      {/* ========================================================================= */}
      <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 shadow-subtle space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-foreground-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama creator, username IG/TikTok, kota, atau kata kunci..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-surface-secondary/70 border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all shadow-2xs"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-surface-secondary border border-border">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "table"
                    ? "bg-surface text-foreground shadow-2xs"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
                title="Tampilan Tabel"
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("card")}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "card"
                    ? "bg-surface text-foreground shadow-2xs"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
                title="Tampilan Kartu"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Address Privacy Toggle */}
            <button
              type="button"
              onClick={() => setShowAddresses(!showAddresses)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                showAddresses
                  ? "bg-amber-500/10 text-amber-900 dark:text-amber-200 border-amber-500/30"
                  : "bg-surface border-border text-foreground-secondary hover:text-foreground"
              }`}
              title="Akses Internal Terbatas: Alamat Rumah Pengiriman Produk Barter"
            >
              {showAddresses ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showAddresses ? "Sembunyikan Alamat" : "Tampilkan Alamat"}</span>
            </button>

            {/* Export CSV */}
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface border border-border hover:bg-surface-secondary text-foreground text-xs font-bold transition-all shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ekspor CSV</span>
            </button>

            {/* Add Creator Button */}
            <button
              type="button"
              onClick={onAddNewCreator}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Creator</span>
            </button>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-border text-xs">
          {/* 1. Platform */}
          <div>
            <label className="text-[10px] font-bold text-foreground-muted block mb-1">Platform</label>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-foreground text-xs focus:ring-1 focus:ring-emerald-600"
            >
              <option value="all">Semua Platform</option>
              <option value="instagram">Instagram Only</option>
              <option value="tiktok">TikTok Only</option>
              <option value="multi">Multi (IG + TikTok)</option>
            </select>
          </div>

          {/* 2. Lokasi */}
          <div>
            <label className="text-[10px] font-bold text-foreground-muted block mb-1">Lokasi / Kota</label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-foreground text-xs focus:ring-1 focus:ring-emerald-600"
            >
              <option value="all">Semua Wilayah</option>
              {LOCATIONS_LIST.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Kategori */}
          <div>
            <label className="text-[10px] font-bold text-foreground-muted block mb-1">Kategori Konten</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-foreground text-xs focus:ring-1 focus:ring-emerald-600"
            >
              <option value="all">Semua Kategori</option>
              {CONTENT_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Follower Tier */}
          <div>
            <label className="text-[10px] font-bold text-foreground-muted block mb-1">Rentang Follower</label>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-foreground text-xs focus:ring-1 focus:ring-emerald-600"
            >
              <option value="all">Semua Ukuran</option>
              <option value="micro">Micro (&lt;20K)</option>
              <option value="mid">Mid Tier (20K–100K)</option>
              <option value="macro">Macro (&gt;100K)</option>
            </select>
          </div>

          {/* 5. Tahapan Pipeline */}
          <div>
            <label className="text-[10px] font-bold text-foreground-muted block mb-1">Tahap Kolaborasi</label>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-foreground text-xs focus:ring-1 focus:ring-emerald-600"
            >
              <option value="all">Semua Tahap (14 Stages)</option>
              {PIPELINE_STAGES.map((stg) => (
                <option key={stg.id} value={stg.id}>
                  {stg.label}
                </option>
              ))}
            </select>
          </div>

          {/* 6. Prioritas / Sort */}
          <div>
            <label className="text-[10px] font-bold text-foreground-muted block mb-1">Urutan Data</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-foreground text-xs focus:ring-1 focus:ring-emerald-600 font-semibold"
            >
              <option value="potential">Skor Potensial (Tertinggi)</option>
              <option value="followers">Followers (Terbanyak)</option>
              <option value="engagement">Engagement Rate (%)</option>
              <option value="name">Nama Creator (A–Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. RESULT COUNT & SELECTION STATUS STRIP                                  */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between text-xs text-foreground-secondary px-1">
        <div>
          Menampilkan <strong>{filteredCreators.length}</strong> dari {creators.length} creator terdaftar
          {searchQuery && <span> untuk kata kunci &quot;{searchQuery}&quot;</span>}
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-purple-700 dark:text-purple-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            Category A: Visual Priority
          </span>
          <span>·</span>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-blue-700 dark:text-blue-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Category B: Reach Priority
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. TABLE VIEW (DEFAULT)                                                   */}
      {/* ========================================================================= */}
      {viewMode === "table" ? (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-surface-secondary/70 border-b border-border text-[11px] font-bold uppercase tracking-wider text-foreground-muted">
                  <th className="py-3 px-4">Creator / Akun</th>
                  <th className="py-3 px-3">Kota</th>
                  <th className="py-3 px-3 text-right">Followers</th>
                  <th className="py-3 px-3 text-right">ER (%)</th>
                  <th className="py-3 px-3 text-center">Strategi</th>
                  <th className="py-3 px-3 text-center">Skor</th>
                  <th className="py-3 px-4">Status Pipeline</th>
                  {showAddresses && <th className="py-3 px-3 text-amber-700">Alamat Rumah (Barter)</th>}
                  <th className="py-3 px-4 text-center">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCreators.length === 0 ? (
                  <tr>
                    <td colSpan={showAddresses ? 9 : 8} className="py-12 text-center text-foreground-muted">
                      Tidak ada creator yang sesuai dengan filter pencarian saat ini.
                    </td>
                  </tr>
                ) : (
                  filteredCreators.map((creator) => {
                    const stgMeta = getStageMeta(creator.collaboration.stage);
                    const isVisual = creator.evaluation.priorityLevel === "visual";
                    const isReach = creator.evaluation.priorityLevel === "reach";

                    return (
                      <tr
                        key={creator.id}
                        className="hover:bg-surface-secondary/40 transition-colors group cursor-pointer"
                        onClick={() => onSelectCreator(creator)}
                      >
                        {/* Name & Handle */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-emerald-700/10 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0">
                              {creator.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-foreground block truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                                {creator.name}
                              </span>
                              <div className="flex items-center gap-1 text-[11px] text-foreground-muted">
                                <span>@{creator.instagramHandle}</span>
                                {creator.tiktokHandle && (
                                  <>
                                    <span>·</span>
                                    <span>TT: @{creator.tiktokHandle}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* City */}
                        <td className="py-3 px-3 text-foreground-secondary whitespace-nowrap">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                            {creator.city}
                          </span>
                        </td>

                        {/* Followers */}
                        <td className="py-3 px-3 text-right font-black text-foreground tabular-nums whitespace-nowrap">
                          {creator.followersFormatted}
                        </td>

                        {/* Engagement Rate */}
                        <td className="py-3 px-3 text-right font-semibold text-emerald-800 dark:text-emerald-300 tabular-nums whitespace-nowrap">
                          {creator.engagementRate}%
                        </td>

                        {/* Priority Category */}
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                              isVisual
                                ? "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300"
                                : isReach
                                ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300"
                                : "bg-surface-secondary text-foreground-muted border-border"
                            }`}
                          >
                            {isVisual ? "Visual Priority" : isReach ? "Reach Priority" : "Standard"}
                          </span>
                        </td>

                        {/* Potential Score */}
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-black text-xs border border-emerald-500/20">
                            {creator.evaluation.potentialScore}/100
                          </span>
                        </td>

                        {/* Pipeline Stage */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${stgMeta.badgeClass}`}
                          >
                            {stgMeta.shortLabel}
                          </span>
                        </td>

                        {/* Delivery Address (Restricted Access) */}
                        {showAddresses && (
                          <td className="py-3 px-3 text-xs text-foreground-secondary max-w-[220px] truncate" title={creator.collaboration.deliveryAddress}>
                            {creator.collaboration.deliveryAddress || "-"}
                          </td>
                        )}

                        {/* Actions */}
                        <td className="py-3 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => onOpenMessageGenerator(creator)}
                              className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 transition-colors"
                              title="Buka Generator Pesan Barter WA"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onEditCreator(creator)}
                              className="p-1.5 rounded-lg bg-surface-secondary hover:bg-border text-foreground transition-colors"
                              title="Edit Data Creator"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteCreator(creator)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 transition-colors"
                              title="Hapus Creator"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 4. CARD GRID VIEW                                                         */
        /* ========================================================================= */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCreators.map((creator) => {
            const stgMeta = getStageMeta(creator.collaboration.stage);
            const isVisual = creator.evaluation.priorityLevel === "visual";
            const isReach = creator.evaluation.priorityLevel === "reach";

            return (
              <div
                key={creator.id}
                onClick={() => onSelectCreator(creator)}
                className="bg-surface border border-border hover:border-emerald-500/40 rounded-2xl p-5 shadow-subtle hover:shadow-warm transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
              >
                <div>
                  {/* Card Header: Photo/Avatar, Name, Handle, Stage Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-emerald-600/15 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-sm shrink-0">
                        {creator.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-foreground truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                          {creator.name}
                        </h4>
                        <span className="text-xs text-foreground-muted block truncate">
                          @{creator.instagramHandle}
                        </span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${stgMeta.badgeClass}`}>
                      {stgMeta.shortLabel}
                    </span>
                  </div>

                  {/* Priority Tag & Location */}
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        isVisual
                          ? "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300"
                          : isReach
                          ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300"
                          : "bg-surface-secondary text-foreground-muted border-border"
                      }`}
                    >
                      {isVisual ? "Visual Priority" : isReach ? "Reach Priority" : "Standard"}
                    </span>
                    <span className="text-[11px] text-foreground-secondary flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      {creator.city}
                    </span>
                  </div>

                  {/* Audience Stats Row */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-surface-secondary/70 border border-border/80 mt-3 text-center">
                    <div>
                      <span className="text-[10px] text-foreground-muted block">Followers</span>
                      <span className="text-xs font-black text-foreground">{creator.followersFormatted}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-foreground-muted block">ER</span>
                      <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">{creator.engagementRate}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-foreground-muted block">Skor</span>
                      <span className="text-xs font-black text-foreground">{creator.evaluation.potentialScore}</span>
                    </div>
                  </div>

                  {/* Product Sent Preview */}
                  <div className="mt-3 text-xs text-foreground-secondary flex items-start gap-1.5">
                    <Package className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{creator.collaboration.productSent}</span>
                  </div>

                  {/* Restricted Address if active */}
                  {showAddresses && (
                    <div className="mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-900 dark:text-amber-200">
                      <strong>Alamat:</strong> {creator.collaboration.deliveryAddress || "Belum diinput"}
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-border flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => onOpenMessageGenerator(creator)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Kirim Pesan WA</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEditCreator(creator)}
                      className="p-1.5 rounded-lg hover:bg-surface-secondary text-foreground-muted hover:text-foreground"
                      title="Edit Creator"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCreator(creator)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-foreground-muted hover:text-rose-600"
                      title="Hapus Creator"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
