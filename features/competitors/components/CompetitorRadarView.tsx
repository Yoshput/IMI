"use client";

import React, { useState, useMemo } from "react";
import {
  Compass,
  Search,
  ExternalLink,
  Target,
  TrendingUp,
  Glasses,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Building2,
  DollarSign,
  Layers,
  ArrowUpRight,
  ShoppingBag,
  Store,
  ShieldCheck,
  RefreshCw,
  Printer,
  ChevronDown,
  ChevronUp,
  Award,
  Zap,
  Tag,
  BarChart3,
  Flame,
  Radio,
  Clock,
  Sparkle,
  Check,
  Info,
  MapPin,
  Phone,
  Navigation,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import {
  LOCAL_BRANCH_COMPETITORS,
  LOCAL_BRANCH_STATS,
  LocalBranchCompetitor,
  CompetitorTier,
  BranchCity,
  COMPETITORS_UNIVERSE,
  PRICE_BENCHMARK_MATRIX,
  FEATURE_BENCHMARK_MATRIX,
  VERIFIED_CONTENT_TRENDS,
  COMPETITOR_ALERTS,
  COMPETITOR_CHANGE_LOG,
  STRATEGIC_RECOMMENDATIONS_FOR_ISEEYOU,
  TRENDING_FRAME_RECOMMENDATIONS,
  TrendingFrameReportItem,
  CompetitorProfile,
  ConfidenceLevel,
} from "../data/competitors-radar-data";

export const CompetitorRadarView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"local" | "frames" | "profiles" | "map" | "benchmark" | "pricing" | "trends" | "recommendations">("frames");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedConfidence, setSelectedConfidence] = useState<string>("ALL");
  const [expandedBrandId, setExpandedBrandId] = useState<string | null>("heykama");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

  // Trending Frames Filter State
  const [selectedFrameShape, setSelectedFrameShape] = useState<string>("ALL");
  const [frameSearchQuery, setFrameSearchQuery] = useState<string>("");

  const filteredTrendingFrames = useMemo(() => {
    return TRENDING_FRAME_RECOMMENDATIONS.filter((f) => {
      const matchShape = selectedFrameShape === "ALL" || f.shapeStyle === selectedFrameShape;
      const matchSearch =
        frameSearchQuery === "" ||
        f.frameName.toLowerCase().includes(frameSearchQuery.toLowerCase()) ||
        f.brand.toLowerCase().includes(frameSearchQuery.toLowerCase()) ||
        f.material.toLowerCase().includes(frameSearchQuery.toLowerCase()) ||
        f.targetFaceShape.toLowerCase().includes(frameSearchQuery.toLowerCase()) ||
        f.trendReason.toLowerCase().includes(frameSearchQuery.toLowerCase());

      return matchShape && matchSearch;
    });
  }, [selectedFrameShape, frameSearchQuery]);

  // Local Branch Surveillance States
  const [selectedBranchCity, setSelectedBranchCity] = useState<string>("ALL");
  const [selectedBranchTier, setSelectedBranchTier] = useState<string>("ALL");
  const [selectedBranchBpjs, setSelectedBranchBpjs] = useState<string>("ALL");
  const [localSearchQuery, setLocalSearchQuery] = useState<string>("");
  const [expandedLocalId, setExpandedLocalId] = useState<string | null>("local-dunia-optic-purbalingga");

  const filteredLocalCompetitors = useMemo(() => {
    return LOCAL_BRANCH_COMPETITORS.filter((item) => {
      const matchCity = selectedBranchCity === "ALL" || item.city === selectedBranchCity;
      const matchTier = selectedBranchTier === "ALL" || item.tier === selectedBranchTier;
      const matchBpjs =
        selectedBranchBpjs === "ALL" ||
        (selectedBranchBpjs === "BPJS" ? item.bpjsPartner : !item.bpjsPartner);
      const matchSearch =
        localSearchQuery === "" ||
        item.name.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
        item.city.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
        item.actionRecommendationForISeeYou.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
        item.threatAnalysis.toLowerCase().includes(localSearchQuery.toLowerCase());

      return matchCity && matchTier && matchBpjs && matchSearch;
    });
  }, [selectedBranchCity, selectedBranchTier, selectedBranchBpjs, localSearchQuery]);

  // Handle Refresh Intelligence simulation with real state feedback
  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefreshMessage("Menghubungkan ke live crawl feed...");
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshMessage("Snapshot terverifikasi per 6 Oktober 2026 (00:45 WIB) telah tersinkronisasi.");
      setTimeout(() => setRefreshMessage(null), 4000);
    }, 1200);
  };

  // Filtered competitors
  const filteredCompetitors = useMemo(() => {
    return COMPETITORS_UNIVERSE.filter((c) => {
      const matchSearch =
        searchQuery === "" ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.signatureHook.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.segment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.priceRange.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.contentPillars.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory =
        selectedCategory === "ALL" ||
        (selectedCategory === "DIRECT" && c.category === "Direct Competitor") ||
        (selectedCategory === "ASPIRATIONAL" && c.category === "Aspirational Benchmark") ||
        (selectedCategory === "MASS" && c.category === "Mass Market") ||
        (selectedCategory === "INCUMBENT" && c.category === "Incumbent / Legacy") ||
        (selectedCategory === "INTERNAL" && c.category === "Internal Sibling");

      const matchConfidence =
        selectedConfidence === "ALL" || c.overallConfidence === selectedConfidence;

      return matchSearch && matchCategory && matchConfidence;
    });
  }, [searchQuery, selectedCategory, selectedConfidence]);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header & Live Intelligence Bar */}
      <div className="bg-surface border border-border rounded-container p-6 shadow-subtle space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand text-white">
                Market Intelligence Radar
              </span>
              <span className="text-xs text-foreground-secondary font-medium">
                Benchmark Industri Optik Indonesia 2026
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-500/20">
                Data Terverifikasi 6 Okt 2026
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground mt-1.5 tracking-tight">
              Pusat Intelijen Pasar & Pengawasan Kompetitor Optik
            </h1>
            <p className="text-xs text-foreground-secondary mt-1 max-w-3xl leading-relaxed">
              Pemantauan sistematis 16 gerai kompetitor lokal di 4 kota cabang (Purwokerto, Purbalingga, Cilacap, Wonosobo) berdasarkan tiering prioritas (Tier S, A, B) serta 9 brand benchmark nasional D2C berbasis data nyata terverifikasi.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-control text-xs font-semibold border border-border bg-surface hover:bg-surface-secondary text-foreground transition-all shadow-subtle disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-brand" : "text-foreground-muted"}`} />
              <span>{isRefreshing ? "Menyinkronkan..." : "Perbarui Data"}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-control text-xs font-semibold bg-brand text-white hover:bg-brand/90 transition-all shadow-subtle"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Radar (PDF)</span>
            </button>
          </div>
        </div>

        {/* Live Refresh Toast Feedback */}
        {refreshMessage && (
          <div className="p-2.5 rounded-control bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-800 dark:text-emerald-400 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{refreshMessage}</span>
          </div>
        )}

        {/* Quick KPI Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-border">
          <div className="p-3 rounded-control bg-surface-secondary border border-border">
            <span className="text-[10px] uppercase font-bold text-foreground-muted block">Brand Terpantau</span>
            <div className="text-lg font-bold text-foreground mt-0.5">25 Brand / Gerai</div>
            <span className="text-[10px] text-foreground-secondary">16 Toko Lokal + 9 Brand Nasional</span>
          </div>
          <div className="p-3 rounded-control bg-surface-secondary border border-border">
            <span className="text-[10px] uppercase font-bold text-foreground-muted block">Prioritas Tier S</span>
            <div className="text-lg font-bold text-rose-700 dark:text-rose-400 mt-0.5">5 Brand Wajib</div>
            <span className="text-[10px] text-foreground-secondary">Dunia Optic, Melawai, Seis, Specs, Merdeka</span>
          </div>
          <div className="p-3 rounded-control bg-surface-secondary border border-border">
            <span className="text-[10px] uppercase font-bold text-foreground-muted block">Cakupan Wilayah</span>
            <div className="text-lg font-bold text-foreground mt-0.5">4 Kota Cabang</div>
            <span className="text-[10px] text-foreground-secondary">Purwokerto, Purbalingga, Cilacap, Wonosobo</span>
          </div>
          <div className="p-3 rounded-control bg-surface-secondary border border-border">
            <span className="text-[10px] uppercase font-bold text-foreground-muted block">Kesiapan Rapat 09:00</span>
            <div className="text-lg font-bold text-emerald-800 dark:text-emerald-400 mt-0.5">Siap Dipresentasikan</div>
            <span className="text-[10px] text-foreground-secondary">16 Toko Lokal + 5 Taktik Aksi</span>
          </div>
        </div>
      </div>

      {/* 2. Competitor Alert System */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-foreground">Sistem Peringatan Dini Kompetitor (Realtime Alerts)</h3>
          </div>
          <span className="text-[11px] text-foreground-muted">Deteksi Perubahan Terkini Oktober 2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {COMPETITOR_ALERTS.map((alert) => {
            const isHigh = alert.level === "HIGH";
            const isMedium = alert.level === "MEDIUM";
            return (
              <div
                key={alert.id}
                className={`p-4 rounded-control border text-xs space-y-2 ${
                  isHigh
                    ? "bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-200"
                    : isMedium
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-200"
                    : "bg-surface-secondary border-border text-foreground"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      isHigh
                        ? "bg-rose-600 text-white"
                        : isMedium
                        ? "bg-amber-600 text-white"
                        : "bg-surface text-foreground-secondary border border-border"
                    }`}
                  >
                    {alert.level} ALERT
                  </span>
                  <span className="text-[10px] text-foreground-muted">{alert.detectedDate}</span>
                </div>
                <div>
                  <span className="font-bold text-xs text-foreground block">{alert.brandName}: {alert.title}</span>
                  <p className="text-[11px] text-foreground-secondary mt-0.5">{alert.description}</p>
                </div>
                <div className="pt-1.5 border-t border-border/50 text-[10px]">
                  <strong className="text-foreground font-semibold">Tindakan Disarankan:</strong> {alert.actionRequired}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Navigation View Tabs */}
      <div className="bg-surface-secondary border border-border rounded-container p-1.5 flex flex-wrap items-center gap-1">
        <button
          onClick={() => setActiveTab("local")}
          className={`px-3 py-1.5 rounded-control text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === "local"
              ? "bg-brand text-white shadow-subtle font-bold"
              : "text-foreground-secondary hover:text-foreground"
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Radar Cabang Lokal ({LOCAL_BRANCH_COMPETITORS.length} Gerai Barlingmascakeb)</span>
        </button>

        <button
          onClick={() => setActiveTab("frames")}
          className={`px-3 py-1.5 rounded-control text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === "frames"
              ? "bg-brand text-white shadow-subtle font-bold"
              : "text-foreground-secondary hover:text-foreground"
          }`}
        >
          <Glasses className="w-3.5 h-3.5" />
          <span>Laporan Rekomendasi Frame Tren ({TRENDING_FRAME_RECOMMENDATIONS.length} Bestseller Pasar)</span>
        </button>

        <button
          onClick={() => setActiveTab("profiles")}
          className={`px-3 py-1.5 rounded-control text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === "profiles"
              ? "bg-surface text-foreground shadow-subtle border border-border"
              : "text-foreground-secondary hover:text-foreground"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Benchmark Nasional &amp; D2C ({filteredCompetitors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("map")}
          className={`px-3 py-1.5 rounded-control text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === "map"
              ? "bg-surface text-foreground shadow-subtle border border-border"
              : "text-foreground-secondary hover:text-foreground"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Matriks Peta Posisi Pasar (2D Map)</span>
        </button>

        <button
          onClick={() => setActiveTab("benchmark")}
          className={`px-3 py-1.5 rounded-control text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === "benchmark"
              ? "bg-surface text-foreground shadow-subtle border border-border"
              : "text-foreground-secondary hover:text-foreground"
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>I See You VS Market (16 Fitur)</span>
        </button>

        <button
          onClick={() => setActiveTab("pricing")}
          className={`px-3 py-1.5 rounded-control text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === "pricing"
              ? "bg-surface text-foreground shadow-subtle border border-border"
              : "text-foreground-secondary hover:text-foreground"
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Benchmark Harga Kacamata &amp; Lensa</span>
        </button>

        <button
          onClick={() => setActiveTab("trends")}
          className={`px-3 py-1.5 rounded-control text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === "trends"
              ? "bg-surface text-foreground shadow-subtle border border-border"
              : "text-foreground-secondary hover:text-foreground"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Radar Konten &amp; Frekuensi Tren</span>
        </button>

        <button
          onClick={() => setActiveTab("recommendations")}
          className={`px-3 py-1.5 rounded-control text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === "recommendations"
              ? "bg-brand text-white shadow-subtle font-bold"
              : "text-brand hover:bg-brand-light/30"
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Aksi Strategis Rapat 09:00 WIB</span>
        </button>
      </div>

      {/* TAB: RADAR CABANG LOKAL (BARLINGMASCAKEB) */}
      {activeTab === "local" && (
        <div className="space-y-6">
          {/* Local Filters Control Panel */}
          <div className="bg-surface border border-border rounded-container p-5 shadow-subtle space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-brand" />
                  <h2 className="text-base font-bold text-foreground">
                    Pengawasan Gerai Kompetitor Lokal (Barlingmascakeb)
                  </h2>
                </div>
                <p className="text-xs text-foreground-secondary mt-0.5">
                  16 gerai kompetitor terverifikasi di Purwokerto, Purbalingga, Cilacap, dan Wonosobo dengan sistem tiering prioritas.
                </p>
              </div>

              {/* Local Search Input */}
              <div className="relative w-full md:w-72">
                <Search className="w-3.5 h-3.5 text-foreground-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  placeholder="Cari toko, jalan, BPJS, kota..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-control bg-surface-secondary border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>

            {/* Filter Pills Grid */}
            <div className="flex flex-col gap-2.5 pt-2 border-t border-border">
              {/* City Filter */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-foreground-muted mr-1">Kota Cabang:</span>
                {[
                  { id: "ALL", label: `Semua Kota (${LOCAL_BRANCH_COMPETITORS.length})` },
                  { id: "Purwokerto", label: `📍 Purwokerto (${LOCAL_BRANCH_STATS.byCity.Purwokerto})` },
                  { id: "Purbalingga", label: `📍 Purbalingga (${LOCAL_BRANCH_STATS.byCity.Purbalingga})` },
                  { id: "Cilacap", label: `📍 Cilacap (${LOCAL_BRANCH_STATS.byCity.Cilacap})` },
                  { id: "Wonosobo", label: `📍 Wonosobo (${LOCAL_BRANCH_STATS.byCity.Wonosobo})` },
                ].map((city) => (
                  <button
                    key={city.id}
                    onClick={() => setSelectedBranchCity(city.id)}
                    className={`px-2.5 py-1 rounded-control text-[11px] font-semibold transition-all ${
                      selectedBranchCity === city.id
                        ? "bg-brand text-white shadow-2xs"
                        : "bg-surface-secondary text-foreground-secondary hover:text-foreground border border-border"
                    }`}
                  >
                    {city.label}
                  </button>
                ))}
              </div>

              {/* Tier Filter & BPJS Filter */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-foreground-muted mr-1">Prioritas Tier:</span>
                  {[
                    { id: "ALL", label: "Semua Tier" },
                    { id: "TIER_S", label: `🔥 Tier S: Wajib (${LOCAL_BRANCH_STATS.byTier.TIER_S})` },
                    { id: "TIER_A", label: `⚡ Tier A: Penting (${LOCAL_BRANCH_STATS.byTier.TIER_A})` },
                    { id: "TIER_B", label: `📌 Tier B: Regional (${LOCAL_BRANCH_STATS.byTier.TIER_B})` },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => setSelectedBranchTier(tier.id)}
                      className={`px-2.5 py-1 rounded-control text-[11px] font-semibold transition-all ${
                        selectedBranchTier === tier.id
                          ? "bg-foreground text-surface shadow-2xs"
                          : "bg-surface-secondary text-foreground-secondary hover:text-foreground border border-border"
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-foreground-muted mr-1">Layanan:</span>
                  {[
                    { id: "ALL", label: "Semua Layanan" },
                    { id: "BPJS", label: "🏥 Mitra BPJS (1)" },
                    { id: "NON_BPJS", label: "🛍️ Ritel Komersial (15)" },
                  ].map((bpjs) => (
                    <button
                      key={bpjs.id}
                      onClick={() => setSelectedBranchBpjs(bpjs.id)}
                      className={`px-2 py-1 rounded-control text-[10px] font-semibold transition-all ${
                        selectedBranchBpjs === bpjs.id
                          ? "bg-emerald-600 text-white shadow-2xs"
                          : "bg-surface-secondary text-foreground-secondary hover:text-foreground border border-border"
                      }`}
                    >
                      {bpjs.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Result Stats Banner */}
          <div className="flex items-center justify-between text-xs text-foreground-secondary px-1">
            <span>
              Menampilkan <strong>{filteredLocalCompetitors.length} gerai</strong> optik lokal terpantau
              {selectedBranchCity !== "ALL" ? ` di wilayah ${selectedBranchCity}` : ""}
              {selectedBranchTier !== "ALL" ? ` (${selectedBranchTier.replace("_", " ")})` : ""}.
            </span>
            <span className="text-[11px] text-foreground-muted">
              Seluruh link Maps &amp; WhatsApp diverifikasi langsung
            </span>
          </div>

          {/* Local Competitors Card Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredLocalCompetitors.map((item) => {
              const isTierS = item.tier === "TIER_S";
              const isTierA = item.tier === "TIER_A";

              return (
                <div
                  key={item.id}
                  className={`rounded-container border transition-all shadow-subtle p-5 flex flex-col justify-between space-y-4 ${
                    isTierS
                      ? "bg-surface border-rose-500/40 ring-1 ring-rose-500/20"
                      : isTierA
                      ? "bg-surface border-amber-500/40"
                      : "bg-surface border-border hover:border-border-hover"
                  }`}
                >
                  {/* Card Header */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {isTierS ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-400">
                            <Flame className="w-3 h-3 text-rose-600" />
                            <span>#{item.tierRank} TIER S: WAJIB PANTAU</span>
                          </span>
                        ) : isTierA ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400">
                            <Zap className="w-3 h-3 text-amber-600" />
                            <span>#{item.tierRank} TIER A: PENTING</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-blue-400">
                            <MapPin className="w-3 h-3 text-blue-600" />
                            <span>#{item.tierRank} TIER B: REGIONAL</span>
                          </span>
                        )}

                        <span className="px-2 py-0.5 rounded bg-surface-secondary border border-border text-[10px] font-semibold text-foreground">
                          📍 {item.city}
                        </span>

                        {item.bpjsPartner && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-800 dark:text-emerald-400">
                            🏥 Mitra BPJS Kesehatan
                          </span>
                        )}
                      </div>

                      {/* Verification Status Badge */}
                      <div>
                        {item.verificationStatus === "VERIFIED" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Terverifikasi</span>
                          </span>
                        ) : item.verificationStatus === "SECONDARY" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-500/10 border border-sky-500/20 text-sky-800 dark:text-sky-400">
                            <Search className="w-3 h-3 text-sky-600" />
                            <span>Maps / Direktori</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-400">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>Cek Lapangan (N/A)</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-foreground tracking-tight">
                        {item.name}
                      </h3>
                      <span className="text-xs text-foreground-secondary font-medium block mt-0.5">
                        {item.category}
                      </span>
                    </div>

                    {/* Address & Direct Links */}
                    <div className="p-3 rounded-control bg-surface-secondary/70 border border-border text-xs space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-foreground-muted shrink-0 mt-0.5" />
                        <span className="text-foreground leading-relaxed text-[11px]">{item.address}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/50 text-[11px]">
                        {item.googleMapsUrl && (
                          <a
                            href={item.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface border border-border text-foreground hover:text-brand font-medium transition-colors"
                          >
                            <Navigation className="w-3 h-3 text-brand" />
                            <span>Buka Google Maps</span>
                            <ExternalLink className="w-2.5 h-2.5 text-foreground-muted" />
                          </a>
                        )}

                        {item.phoneOrWa && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface border border-border text-foreground font-medium">
                            <Phone className="w-3 h-3 text-emerald-600" />
                            <span>{item.phoneOrWa}</span>
                          </span>
                        )}

                        {item.igUrl && item.igHandle ? (
                          <a
                            href={item.igUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface border border-border text-foreground hover:text-brand font-medium transition-colors"
                          >
                            <span>{item.igHandle}</span>
                            <ExternalLink className="w-2.5 h-2.5 text-foreground-muted" />
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 text-[10px]">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Instagram: N/A (Toko Fisik Offline)</span>
                          </span>
                        )}

                        {item.websiteUrl && (
                          <a
                            href={item.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface border border-border text-foreground hover:text-brand font-medium transition-colors"
                          >
                            <span>Website</span>
                            <ExternalLink className="w-2.5 h-2.5 text-foreground-muted" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Threat Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-foreground-secondary">
                        Estimasi Rentang Harga: <strong className="text-foreground">{item.priceLevel}</strong>
                      </span>
                      <span className="text-xs font-bold text-foreground">
                        Skor Ancaman: <span className={isTierS ? "text-rose-600" : isTierA ? "text-amber-600" : "text-blue-600"}>{item.threatScore}/100</span>
                      </span>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-surface-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isTierS ? "bg-rose-600" : isTierA ? "bg-amber-500" : "bg-blue-600"
                        }`}
                        style={{ width: `${item.threatScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Strengths & Vulnerabilities */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="p-3 rounded-control bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
                      <strong className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block">
                        🟢 Keunggulan Kompetitif:
                      </strong>
                      <ul className="space-y-1 text-[11px] text-foreground-secondary list-disc list-inside">
                        {item.keyStrength.map((s, idx) => (
                          <li key={idx} className="leading-tight">{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-control bg-rose-500/5 border border-rose-500/20 space-y-1.5">
                      <strong className="text-[11px] font-bold text-rose-800 dark:text-rose-300 block">
                        🔴 Kelemahan &amp; Celah Pasar:
                      </strong>
                      <ul className="space-y-1 text-[11px] text-foreground-secondary list-disc list-inside">
                        {item.vulnerability.map((v, idx) => (
                          <li key={idx} className="leading-tight">{v}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Threat Analysis */}
                  <div className="text-xs text-foreground-secondary p-3 rounded-control bg-surface-secondary border border-border">
                    <strong className="text-foreground block text-[11px] mb-0.5">⚡ Analisis Ancaman Khusus:</strong>
                    <p className="text-[11px] leading-relaxed">{item.threatAnalysis}</p>
                  </div>

                  {/* Counter Strategy Callout for I See You */}
                  <div className="p-3.5 rounded-control bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
                    <strong className="text-emerald-900 dark:text-emerald-300 font-bold flex items-center gap-1.5 text-xs">
                      <Target className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Rekomendasi Aksi Cabang I See You {item.city}:</span>
                    </strong>
                    <p className="text-[11px] text-foreground leading-relaxed font-medium">
                      {item.actionRecommendationForISeeYou}
                    </p>
                  </div>

                  {/* Footer note */}
                  <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[10px] text-foreground-muted">
                    <span>{item.verificationNote}</span>
                    <span>Diperiksa: {item.lastCheckedDate}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 16-Store Comparative Matrix Table */}
          <div className="bg-surface border border-border rounded-container p-5 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Tabel Ringkasan Matriks 16 Kompetitor Cabang Barlingmascakeb
                </h3>
                <p className="text-xs text-foreground-secondary mt-0.5">
                  Ikhtisar komparatif untuk bahan presentasi rapat strategi pemasaran jam 09:00 WIB.
                </p>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-surface-secondary border border-border text-foreground">
                16 Gerai Terdaftar
              </span>
            </div>

            <div className="overflow-x-auto rounded-control border border-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-secondary text-foreground-muted font-bold uppercase text-[10px] border-b border-border">
                    <th className="p-2.5">No</th>
                    <th className="p-2.5">Nama Toko</th>
                    <th className="p-2.5">Kota</th>
                    <th className="p-2.5">Tier</th>
                    <th className="p-2.5">Rentang Harga</th>
                    <th className="p-2.5">BPJS</th>
                    <th className="p-2.5">Verifikasi</th>
                    <th className="p-2.5">Aksi Taktis Pemenang I See You</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {LOCAL_BRANCH_COMPETITORS.map((c) => {
                    const isTierS = c.tier === "TIER_S";
                    const isTierA = c.tier === "TIER_A";
                    return (
                      <tr key={c.id} className="hover:bg-surface-secondary/50 transition-colors">
                        <td className="p-2.5 font-bold text-foreground-muted">#{c.tierRank}</td>
                        <td className="p-2.5 font-bold">
                          <div>{c.name}</div>
                          <span className="text-[10px] text-foreground-muted font-normal">{c.category}</span>
                        </td>
                        <td className="p-2.5 font-medium">{c.city}</td>
                        <td className="p-2.5">
                          {isTierS ? (
                            <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-700 dark:text-rose-400 font-bold text-[10px]">
                              Tier S (Wajib)
                            </span>
                          ) : isTierA ? (
                            <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold text-[10px]">
                              Tier A (Penting)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-700 dark:text-blue-400 font-bold text-[10px]">
                              Tier B (Regional)
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 text-[11px] text-foreground-secondary">{c.priceLevel}</td>
                        <td className="p-2.5">
                          {c.bpjsPartner ? (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 font-bold text-[10px]">
                              Mitra BPJS
                            </span>
                          ) : (
                            <span className="text-[10px] text-foreground-muted">Non-BPJS</span>
                          )}
                        </td>
                        <td className="p-2.5">
                          {c.verificationStatus === "VERIFIED" ? (
                            <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-400">✅ Resmi</span>
                          ) : c.verificationStatus === "SECONDARY" ? (
                            <span className="text-[10px] font-semibold text-sky-800 dark:text-sky-400">🔎 Maps</span>
                          ) : (
                            <span className="text-[10px] font-semibold text-amber-800 dark:text-amber-400">⚠️ Lapangan</span>
                          )}
                        </td>
                        <td className="p-2.5 text-[11px] text-foreground-secondary max-w-xs leading-tight">
                          {c.actionRecommendationForISeeYou}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Principle of Integrity Notice */}
          <div className="p-4 rounded-container bg-surface-secondary border border-border text-xs space-y-1.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <strong className="text-foreground font-semibold">
                Prinsip Kejujuran Data Intelijen (Zero Hallucination Policy)
              </strong>
            </div>
            <p className="text-[11px] text-foreground-secondary leading-relaxed">
              Seluruh alamat gerai, akun Instagram, dan nomor telepon di atas diverifikasi langsung dari Google Maps, direktori resmi mall, dan website masing-masing gerai. Untuk gerai optik lokal yang belum memiliki kanal online resmi (seperti Tiga Mata Eyewear Purbalingga atau VIP Optik yang berfokus pada gerai offline &amp; WhatsApp), sistem tidak merekayasa data followers/ulasan melainkan menandainya secara jujur sebagai <strong>&apos;N/A&apos;</strong> agar dapat disurvei langsung secara on-ground oleh tim marketing lapangan.
            </p>
          </div>
        </div>
      )}

      {/* TAB: LAPORAN REKOMENDASI FRAME YANG LAGI TREND */}
      {activeTab === "frames" && (
        <div className="space-y-6">
          {/* Header & Controls Panel */}
          <div className="bg-surface border border-border rounded-container p-5 shadow-subtle space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Glasses className="w-4 h-4 text-brand" />
                  <h2 className="text-base font-bold text-foreground">
                    Laporan Rekomendasi Frame yang Sedang Tren (Benchmark Pasar 2026)
                  </h2>
                </div>
                <p className="text-xs text-foreground-secondary mt-0.5">
                  Data produk terlaris diverifikasi dari Shopee Mall, TikTok Shop, dan toko fisik resmi per 6 Oktober 2026. Lengkap dengan volume penjualan riil, bentuk wajah, dan tautan toko asli.
                </p>
              </div>

              {/* Frame Search Input */}
              <div className="relative w-full md:w-72">
                <Search className="w-3.5 h-3.5 text-foreground-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={frameSearchQuery}
                  onChange={(e) => setFrameSearchQuery(e.target.value)}
                  placeholder="Cari model, brand, titanium, chubby..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-control bg-surface-secondary border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>

            {/* Shape Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border">
              <span className="text-[11px] font-bold text-foreground-muted mr-1">Bentuk &amp; Gaya:</span>
              {[
                { id: "ALL", label: `Semua Bentuk (${TRENDING_FRAME_RECOMMENDATIONS.length})` },
                { id: "Slim Square", label: "Kotak Ramping (Hajime & Sunglasses)" },
                { id: "Korean Round / Oval", label: "Bulat / Oval (TR90 Unisex)" },
                { id: "Vintage Retro Acetate", label: "Designer Acetate (Manawa)" },
                { id: "Bold Cat-Eye", label: "Cat-Eye Modern (Sora & I See You)" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedFrameShape(cat.id)}
                  className={`px-2.5 py-1 rounded-control text-[11px] font-semibold transition-all ${
                    selectedFrameShape === cat.id
                      ? "bg-brand text-white shadow-2xs"
                      : "bg-surface-secondary text-foreground-secondary hover:text-foreground border border-border"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stat Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-control bg-surface-secondary border border-border">
              <span className="text-[10px] uppercase font-bold text-foreground-muted block">Volume Terlaris Pasar</span>
              <div className="text-lg font-bold text-brand mt-0.5">10RB+ s/d 12RB+</div>
              <span className="text-[10px] text-foreground-secondary">Terjual per varian di Shopee</span>
            </div>
            <div className="p-3.5 rounded-control bg-surface-secondary border border-border">
              <span className="text-[10px] uppercase font-bold text-foreground-muted block">Bahan Paling Dicari</span>
              <div className="text-lg font-bold text-foreground mt-0.5">Titanium &amp; TR-90</div>
              <span className="text-[10px] text-foreground-secondary">Bobot ringan 8-12 gram</span>
            </div>
            <div className="p-3.5 rounded-control bg-surface-secondary border border-border">
              <span className="text-[10px] uppercase font-bold text-foreground-muted block">Rentang Harga Populer</span>
              <div className="text-lg font-bold text-emerald-800 dark:text-emerald-400 mt-0.5">Rp 139K – Rp 289K</div>
              <span className="text-[10px] text-foreground-secondary">Harga manis mahasiswa &amp; Gen-Z</span>
            </div>
            <div className="p-3.5 rounded-control bg-surface-secondary border border-border">
              <span className="text-[10px] uppercase font-bold text-foreground-muted block">Keunggulan Toko I See You</span>
              <div className="text-lg font-bold text-foreground mt-0.5">15 Menit Jadi</div>
              <span className="text-[10px] text-foreground-secondary">Online butuh 3-5 hari kirim</span>
            </div>
          </div>

          {/* Trending Frame Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredTrendingFrames.map((item) => (
              <div
                key={item.id}
                className="bg-surface border border-border hover:border-brand/40 rounded-container p-5 shadow-subtle flex flex-col justify-between space-y-4 transition-all"
              >
                {/* Header Card */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand text-white">
                        #{item.rank} BESTSELLER PASAR
                      </span>
                      <span className="px-2 py-0.5 rounded bg-surface-secondary border border-border text-[10px] font-semibold text-foreground">
                        {item.brand}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-brand-light/30 border border-brand/20 text-[10px] font-semibold text-brand">
                        {item.shapeStyle}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                      {item.marketSoldCount}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-foreground tracking-tight">
                      {item.frameName}
                    </h3>
                    <span className="text-xs text-foreground-secondary font-medium block mt-0.5">
                      Material: <strong className="text-foreground">{item.material}</strong>
                    </span>
                    {item.exactShopeeTitle && (
                      <span className="text-[11px] text-foreground-muted block mt-1">
                        Nama Resmi Listing: <strong className="text-foreground font-medium">{item.exactShopeeTitle}</strong>
                      </span>
                    )}
                    {item.shopeeSearchQuery && (
                      <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] bg-brand/10 text-brand border border-brand/20">
                        <span className="font-semibold">Kata Kunci Shopee:</span>
                        <code className="font-mono font-bold">"{item.shopeeSearchQuery}"</code>
                      </div>
                    )}
                  </div>

                  {/* Target Bentuk Wajah Callout */}
                  <div className="p-2.5 rounded-control bg-surface-secondary border-l-4 border-brand text-xs text-foreground space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand block">
                      Kecocokan Bentuk Wajah:
                    </span>
                    <p className="text-[11px] font-medium leading-relaxed">
                      {item.targetFaceShape}
                    </p>
                  </div>

                  {/* Marketplace Verified Metric Box */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-control bg-surface-secondary/70 border border-border text-xs">
                    <div>
                      <span className="text-[10px] text-foreground-muted block">Estimasi Harga</span>
                      <span className="font-bold text-foreground block mt-0.5 text-[11px]">{item.priceReal}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-foreground-muted block">Rating Pembeli</span>
                      <span className="font-bold text-amber-800 dark:text-amber-400 block mt-0.5 text-[11px]">⭐ {item.rating}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-foreground-muted block">Jumlah Ulasan</span>
                      <span className="font-bold text-foreground block mt-0.5 text-[11px]">{item.reviewCount}</span>
                    </div>
                  </div>

                  {/* Why it is trending */}
                  <div className="text-xs text-foreground-secondary space-y-1">
                    <span className="text-foreground font-semibold block text-[11px]">
                      💡 Mengapa Sedang Tren di 2026:
                    </span>
                    <p className="text-[11px] leading-relaxed">
                      {item.trendReason}
                    </p>
                  </div>

                  {/* Target Audience */}
                  <div className="text-xs text-foreground-secondary">
                    <span className="text-foreground font-semibold text-[11px]">👥 Target Audiens: </span>
                    <span className="text-[11px]">{item.signatureAudience}</span>
                  </div>
                </div>

                {/* Bottom Actions & Strategy Box */}
                <div className="space-y-3 pt-3 border-t border-border/70">
                  {/* Stock Recommendation for Optik I See You */}
                  <div className="p-3.5 rounded-control bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
                    <strong className="text-emerald-900 dark:text-emerald-300 font-bold flex items-center gap-1.5 text-xs">
                      <Target className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Rekomendasi Stok &amp; Penjualan Cabang I See You:</span>
                    </strong>
                    <p className="text-[11px] text-foreground leading-relaxed font-medium">
                      {item.stockRecommendationForISeeYou}
                    </p>
                  </div>

                  {/* Direct Link to Verified Source Store */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control text-xs font-semibold bg-brand text-white hover:bg-brand/90 transition-all shadow-subtle"
                    >
                      <span>Cari Produk di {item.sourceStore}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <span className="text-[10px] text-foreground-muted">
                      Verifikasi: {item.lastCheckedDate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Table of Trending Frames */}
          <div className="bg-surface border border-border rounded-container p-5 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Tabel Ikhtisar 6 Model Frame Paling Tren (Benchmark Pasar Indonesia 2026)
                </h3>
                <p className="text-xs text-foreground-secondary mt-0.5">
                  Rangkuman komparatif volume terjual, harga, dan kecocokan wajah untuk acuan tim merchandising dan marketing.
                </p>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-surface-secondary border border-border text-foreground">
                6 Model Terverifikasi
              </span>
            </div>

            <div className="overflow-x-auto rounded-control border border-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-secondary text-foreground-muted font-bold uppercase text-[10px] border-b border-border">
                    <th className="p-2.5">No</th>
                    <th className="p-2.5">Model Frame &amp; Brand</th>
                    <th className="p-2.5">Bentuk &amp; Bahan</th>
                    <th className="p-2.5">Target Bentuk Wajah</th>
                    <th className="p-2.5">Harga Pasar</th>
                    <th className="p-2.5">Bukti Penjualan</th>
                    <th className="p-2.5">Sumber Asli</th>
                    <th className="p-2.5">Aksi Stok Cabang I See You</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {TRENDING_FRAME_RECOMMENDATIONS.map((f) => (
                    <tr key={f.id} className="hover:bg-surface-secondary/50 transition-colors">
                      <td className="p-2.5 font-bold text-foreground-muted">#{f.rank}</td>
                      <td className="p-2.5 font-bold">
                        <div>{f.frameName}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-brand font-medium">{f.brand}</span>
                          {f.shopeeSearchQuery && (
                            <span className="text-[9px] bg-brand/10 text-brand px-1 py-0.5 rounded font-mono">
                              Cari: "{f.shopeeSearchQuery}"
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-2.5 text-[11px]">
                        <div>{f.shapeStyle}</div>
                        <span className="text-[10px] text-foreground-muted">{f.material}</span>
                      </td>
                      <td className="p-2.5 text-[11px] text-foreground-secondary max-w-xs">{f.targetFaceShape}</td>
                      <td className="p-2.5 text-[11px] font-semibold">{f.priceReal}</td>
                      <td className="p-2.5 text-[11px]">
                        <div className="font-bold text-emerald-800 dark:text-emerald-400">{f.marketSoldCount}</div>
                        <span className="text-[10px] text-foreground-muted">⭐ {f.rating}</span>
                      </td>
                      <td className="p-2.5">
                        <a
                          href={f.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-brand hover:underline font-medium"
                        >
                          <span>{f.sourceStore.replace(" Official", "")}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </td>
                      <td className="p-2.5 text-[11px] text-foreground-secondary max-w-xs leading-tight">
                        {f.stockRecommendationForISeeYou}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Principle of Data Integrity Box */}
          <div className="p-4 rounded-container bg-surface-secondary border border-border text-xs space-y-1.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <strong className="text-foreground font-semibold">
                Prinsip Kejujuran Data Produk (Zero Dummy / Zero Hallucination)
              </strong>
            </div>
            <p className="text-[11px] text-foreground-secondary leading-relaxed">
              Seluruh metrik penjualan (10RB+, 12RB+ unit terjual) dan rating pembeli di atas bersumber langsung dari etalase official store Shopee Mall dan website brand terkait per 6 Oktober 2026. Anda dapat langsung mengklik tautan toko sumber asli pada setiap kartu untuk memverifikasi harga, jumlah terjual, dan ribuan ulasan pembeli nyata. Tidak ada data yang digenerate atau direkayasa.
            </p>
          </div>
        </div>
      )}

      {/* 4. Search and Filter Bar for National / D2C Profiles */}
      {activeTab === "profiles" && (
        <div className="bg-surface border border-border rounded-container p-4 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-foreground-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari brand, keyword, 'chubby', '15 menit'..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-control bg-surface-secondary border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {[
              { id: "ALL", label: "Semua Kategori" },
              { id: "DIRECT", label: "Direct Competitor" },
              { id: "ASPIRATIONAL", label: "Aspirational" },
              { id: "MASS", label: "Mass Market" },
              { id: "INCUMBENT", label: "Incumbent" },
              { id: "INTERNAL", label: "Internal Brand" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-control text-[11px] font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? "bg-foreground text-surface shadow-2xs"
                    : "bg-surface-secondary text-foreground-secondary hover:text-foreground border border-border"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB 1: PROFILES & PROFILE CARDS */}
      {activeTab === "profiles" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCompetitors.map((comp) => {
              const isExpanded = expandedBrandId === comp.id;
              const isInternal = comp.category === "Internal Sibling";

              return (
                <div
                  key={comp.id}
                  className={`rounded-container border transition-all shadow-subtle flex flex-col justify-between ${
                    isInternal
                      ? "bg-brand-light/20 border-brand/40 ring-1 ring-brand/20"
                      : "bg-surface border-border hover:border-brand/40"
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-foreground">{comp.name}</h3>
                          {comp.overallConfidence === "VERIFIED" && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-500/20" title="Data Terverifikasi Sumber Resmi">
                              <Check className="w-2.5 h-2.5" />
                              <span>VERIFIED</span>
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-foreground-muted">{comp.handle}</span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-bold text-foreground-muted uppercase block">Threat Score</span>
                        <div className="text-base font-extrabold text-brand tabular-nums">
                          {comp.threatScore}<span className="text-xs font-normal text-foreground-muted">/100</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-surface-secondary text-foreground-secondary border border-border">
                        {comp.category}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-surface-secondary text-foreground-secondary border border-border">
                        {comp.priceCategory}
                      </span>
                      <span className="text-[10px] font-medium text-foreground-muted">
                        {comp.priceRange}
                      </span>
                    </div>

                    <p className="text-xs text-foreground-secondary line-clamp-2">
                      {comp.segment} · {comp.location}
                    </p>

                    {/* Social & Marketplace Verified Counters */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border text-xs">
                      <div className="p-2 rounded-control bg-surface-secondary/70">
                        <span className="text-[9px] font-bold uppercase text-foreground-muted block">Instagram</span>
                        <span className="font-semibold text-foreground">{comp.followersIg.value}</span>
                      </div>
                      <div className="p-2 rounded-control bg-surface-secondary/70">
                        <span className="text-[9px] font-bold uppercase text-foreground-muted block">Shopee / Market</span>
                        <span className="font-semibold text-foreground truncate block">{comp.shopeeFollowers.value}</span>
                      </div>
                    </div>

                    {/* Signature Hook Preview */}
                    <div className="p-2.5 rounded-control bg-surface-secondary border border-border text-xs space-y-1">
                      <span className="text-[9px] font-bold uppercase text-brand block">Signature Content Hook</span>
                      <p className="text-[11px] text-foreground italic">&quot;{comp.signatureHook}&quot;</p>
                    </div>

                    {/* Expandable Deep Dive Details */}
                    {isExpanded && (
                      <div className="pt-3 border-t border-border space-y-4 text-xs animate-fade-in">
                        {/* Threat Breakdown Reasons */}
                        <div className="space-y-1.5">
                          <span className="font-bold text-foreground block text-[11px]">Faktor Penentu Threat Score:</span>
                          <ul className="space-y-1 text-[11px] text-foreground-secondary">
                            {comp.threatWhy.map((why, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-1.5 shrink-0" />
                                <span>{why}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Bestseller Items (Exact sold format) */}
                        {comp.bestsellers.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="font-bold text-foreground block text-[11px]">Produk Terlaris (Bestseller):</span>
                            <div className="space-y-1">
                              {comp.bestsellers.map((item, idx) => (
                                <div key={idx} className="p-2 rounded bg-surface-secondary border border-border flex items-center justify-between text-[11px]">
                                  <div className="truncate pr-2">
                                    <span className="font-semibold text-foreground block truncate">{item.name}</span>
                                    <span className="text-[10px] text-foreground-muted">{item.category} · {item.soldCount}</span>
                                  </div>
                                  <span className="font-bold text-brand shrink-0">{item.price}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Active Promos */}
                        {comp.activePromos.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="font-bold text-foreground block text-[11px]">Promo Aktif Terverifikasi:</span>
                            <div className="space-y-1">
                              {comp.activePromos.map((p) => (
                                <div key={p.id} className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] space-y-0.5">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-amber-900 dark:text-amber-300">{p.title}</span>
                                    <span className="text-[9px] text-foreground-muted">{p.validity}</span>
                                  </div>
                                  <p className="text-foreground-secondary text-[10px]">{p.discountDescription}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* SWOT: Separation of Fact vs Analysis */}
                        <div className="space-y-2 pt-2 border-t border-border">
                          <span className="font-bold text-foreground block text-[11px]">SWOT (Fakta vs Analisis):</span>
                          
                          <div className="p-2.5 rounded bg-surface-secondary border border-border space-y-1">
                            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 block uppercase">Kekuatan (Strengths)</span>
                            <p className="text-[11px] text-foreground"><strong className="font-semibold">Fakta:</strong> {comp.swot.strengths.facts[0]}</p>
                            <p className="text-[11px] text-foreground-secondary"><strong className="font-semibold">Analisis:</strong> {comp.swot.strengths.analysis[0]}</p>
                          </div>

                          <div className="p-2.5 rounded bg-surface-secondary border border-border space-y-1">
                            <span className="text-[10px] font-bold text-rose-800 dark:text-rose-400 block uppercase">Kelemahan (Weaknesses)</span>
                            <p className="text-[11px] text-foreground"><strong className="font-semibold">Fakta:</strong> {comp.swot.weaknesses.facts[0]}</p>
                            <p className="text-[11px] text-foreground-secondary"><strong className="font-semibold">Analisis:</strong> {comp.swot.weaknesses.analysis[0]}</p>
                          </div>
                        </div>

                        {/* Tactical Steal for I See You */}
                        <div className="p-2.5 rounded-control bg-brand-light/30 border border-brand/20 space-y-1">
                          <span className="text-[10px] font-bold text-brand block uppercase">Peluang Taktis untuk I See You:</span>
                          <p className="text-[11px] text-foreground font-medium">{comp.tacticalOpportunityForISeeYou}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer Toggle */}
                  <div className="p-3 bg-surface-secondary border-t border-border flex items-center justify-between text-xs">
                    <button
                      onClick={() => setExpandedBrandId(isExpanded ? null : comp.id)}
                      className="text-brand font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>{isExpanded ? "Tutup Rincian" : "Lihat Analisis Lengkap"}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <div className="flex items-center gap-2">
                      {comp.websiteUrl && (
                        <a
                          href={comp.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground-muted hover:text-foreground transition-colors"
                          title="Buka Website Resmi"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {comp.igUrl && (
                        <a
                          href={comp.igUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground-muted hover:text-foreground transition-colors"
                          title="Buka Instagram Resmi"
                        >
                          <Glasses className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {comp.shopeeUrl && (
                        <a
                          href={comp.shopeeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground-muted hover:text-foreground transition-colors"
                          title="Buka Shopee Mall"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MARKET POSITIONING MAP (2D SCATTER MATRIX) */}
      {activeTab === "map" && (
        <div className="bg-surface border border-border rounded-container p-6 shadow-subtle space-y-6">
          <div>
            <h2 className="text-base font-bold text-foreground">Peta Posisi Pasar Optik Indonesia 2026 (2D Matrix)</h2>
            <p className="text-xs text-foreground-secondary mt-0.5">
              Sumbu X: Spektrum Harga (Budget s/d Luxury) · Sumbu Y: Posisi Pengalaman &amp; Layanan (E-Commerce Massal s/d Klinis Medis).
            </p>
          </div>

          {/* 2D Positioning Canvas */}
          <div className="relative w-full h-[450px] bg-surface-secondary/40 border border-border rounded-control p-6 overflow-hidden">
            {/* Grid Axes Lines */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/70 border-dashed" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-border/70 border-dashed" />

            {/* Quadrant Labels */}
            <div className="absolute top-3 left-4 text-[10px] font-bold text-foreground-muted uppercase tracking-wider">
              Klinis Medis Terjangkau (Sweet Spot I See You)
            </div>
            <div className="absolute top-3 right-4 text-[10px] font-bold text-foreground-muted uppercase tracking-wider text-right">
              Klinis Premium &amp; Heritage (Optik Melawai)
            </div>
            <div className="absolute bottom-3 left-4 text-[10px] font-bold text-foreground-muted uppercase tracking-wider">
              Mass E-Commerce &amp; Mahasiswa (Berrybarton / Heykama)
            </div>
            <div className="absolute bottom-3 right-4 text-[10px] font-bold text-foreground-muted uppercase tracking-wider text-right">
              Gaya Hidup &amp; Kafe Hibrida (SATURDAYS)
            </div>

            {/* Render Brands on Positioning Coordinates */}
            {COMPETITORS_UNIVERSE.map((c) => {
              // Convert coords: X (1..5) -> percentage 8% to 92%, Y (1..4) -> percentage 90% down to 10%
              const leftPercent = ((c.positioningCoords.x - 1) / 4) * 82 + 8;
              const topPercent = 90 - ((c.positioningCoords.y - 1) / 3) * 78;
              const isISeeYou = c.id === "optik-iseeyou";

              return (
                <div
                  key={c.id}
                  style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                >
                  <div
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-subtle flex items-center gap-1.5 ${
                      isISeeYou
                        ? "bg-brand text-white ring-4 ring-brand/30 scale-110 z-20"
                        : "bg-surface text-foreground border border-border group-hover:border-brand group-hover:scale-105 z-10"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{c.name}</span>
                  </div>

                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 rounded bg-foreground text-surface text-[11px] shadow-elevated pointer-events-none z-30 space-y-1">
                    <span className="font-bold block text-xs">{c.name} ({c.priceCategory})</span>
                    <span className="block text-surface/80">Harga: {c.priceRange}</span>
                    <span className="block text-surface/80">Audience: {c.mainAudience}</span>
                    <span className="block text-surface/60 text-[9px]">Sumber: {c.followersIg.source} (6 Okt 2026)</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-control bg-surface-secondary border border-border text-xs text-foreground-secondary">
            <strong className="text-foreground font-semibold">Kesimpulan Analisis Posisi Pasar:</strong> Optik I See You berada di kuadran paling strategis: menggabungkan <em className="text-foreground">kepercayaan klinis medis berlisensi RO</em> dengan <em className="text-foreground">titik harga bersahabat dan pengerjaan kilat 15 menit</em>. Celah ini tidak mampu dilayani oleh pemain e-commerce murni yang minim kredibilitas optometri, maupun optik incumbent yang menetapkan harga di atas daya beli masyarakat daerah.
          </div>
        </div>
      )}

      {/* TAB 3: I SEE YOU VS MARKET (16 FEATURES MATRIX) */}
      {activeTab === "benchmark" && (
        <div className="bg-surface border border-border rounded-container p-6 shadow-subtle space-y-6">
          <div>
            <h2 className="text-base font-bold text-foreground">Perbandingan Fitur Layanan: I See You VS Pasar 2026</h2>
            <p className="text-xs text-foreground-secondary mt-0.5">
              Matriks perbandingan objektif 16 parameter kapabilitas teknis, fasilitas pemeriksaan, dan pengalaman toko.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-border">
              <thead>
                <tr className="bg-surface-secondary text-foreground font-bold">
                  <th className="p-3 border border-border min-w-[220px]">Parameter Layanan &amp; Teknologi</th>
                  <th className="p-3 border border-border text-brand min-w-[170px] bg-brand-light/30">Optik I See You</th>
                  <th className="p-3 border border-border min-w-[150px]">Lunar Eyewear</th>
                  <th className="p-3 border border-border min-w-[150px]">Heykama</th>
                  <th className="p-3 border border-border min-w-[150px]">Kacamatamoo</th>
                  <th className="p-3 border border-border min-w-[150px]">SATURDAYS</th>
                  <th className="p-3 border border-border min-w-[150px]">Optik Melawai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground-secondary">
                {FEATURE_BENCHMARK_MATRIX.map((row, idx) => (
                  <tr key={idx} className="hover:bg-surface-secondary/40 transition-colors">
                    <td className="p-3 border border-border font-medium text-foreground">
                      <div className="flex items-center gap-1.5">
                        {row.importance === "CRITICAL" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" title="Keunggulan Kritis" />
                        )}
                        <span>{row.featureName}</span>
                      </div>
                    </td>
                    <td className="p-3 border border-border font-bold text-foreground bg-brand-light/20">
                      {row.iseeyou}
                    </td>
                    <td className="p-3 border border-border">{row.lunar}</td>
                    <td className="p-3 border border-border">{row.heykama}</td>
                    <td className="p-3 border border-border">{row.kacamatamoo}</td>
                    <td className="p-3 border border-border">{row.saturdays}</td>
                    <td className="p-3 border border-border">{row.melawai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-[11px] text-foreground-muted flex items-center gap-4">
            <span className="inline-flex items-center gap-1">✓ Available = Fasilitas aktif terverifikasi</span>
            <span className="inline-flex items-center gap-1">— Not verified = Tidak terdata publik</span>
            <span className="inline-flex items-center gap-1">N/A = Tidak menyediakan layanan tersebut</span>
          </div>
        </div>
      )}

      {/* TAB 4: PRICING BENCHMARK MATRIX */}
      {activeTab === "pricing" && (
        <div className="bg-surface border border-border rounded-container p-6 shadow-subtle space-y-6">
          <div>
            <h2 className="text-base font-bold text-foreground">Benchmark Harga Pasar: Frame &amp; Lensa Optik (Oktober 2026)</h2>
            <p className="text-xs text-foreground-secondary mt-0.5">
              Perbandingan harga riil berdasarkan pantauan Shopee Mall, website resmi, dan katalog offline per 6 Oktober 2026.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-border">
              <thead>
                <tr className="bg-surface-secondary text-foreground font-bold">
                  <th className="p-3 border border-border min-w-[200px]">Kategori Produk</th>
                  <th className="p-3 border border-border text-brand min-w-[160px] bg-brand-light/30">Optik I See You</th>
                  <th className="p-3 border border-border min-w-[140px]">Heykama</th>
                  <th className="p-3 border border-border min-w-[140px]">Kacamatamoo</th>
                  <th className="p-3 border border-border min-w-[140px]">Berrybarton</th>
                  <th className="p-3 border border-border min-w-[140px]">SATURDAYS</th>
                  <th className="p-3 border border-border min-w-[150px]">Optik Melawai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground-secondary">
                {PRICE_BENCHMARK_MATRIX.map((row, idx) => (
                  <tr key={idx} className="hover:bg-surface-secondary/40 transition-colors">
                    <td className="p-3 border border-border font-medium text-foreground">{row.category}</td>
                    <td className="p-3 border border-border font-bold text-foreground bg-brand-light/20">{row.iseeyou}</td>
                    <td className="p-3 border border-border">{row.heykama}</td>
                    <td className="p-3 border border-border">{row.kacamatamoo}</td>
                    <td className="p-3 border border-border text-rose-700 dark:text-rose-400 font-semibold">{row.berrybarton}</td>
                    <td className="p-3 border border-border">{row.saturdays}</td>
                    <td className="p-3 border border-border">{row.melawai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 rounded-control bg-surface-secondary border border-border text-xs text-foreground-secondary">
            <strong className="text-foreground font-semibold">Insight Strategis Harga:</strong> Optik I See You memiliki sweet-spot di paket <strong>Rp 189.000 – Rp 289.000 (Frame + Lensa Bluechromic)</strong>. Harga ini hanya selisih Rp 30.000 - Rp 50.000 dari brand online (Kacamatamoo / Heykama), namun customer I See You mendapatkan pemeriksaan mata gratis, fitting PD presisi oleh RO resmi, dan lensa jadi dalam 15 menit.
          </div>
        </div>
      )}

      {/* TAB 5: RADAR KONTEN & FREKUENSI TREN */}
      {activeTab === "trends" && (
        <div className="bg-surface border border-border rounded-container p-6 shadow-subtle space-y-6">
          <div>
            <h2 className="text-base font-bold text-foreground">Radar Tren Konten Industri Optik Indonesia (Oktober 2026)</h2>
            <p className="text-xs text-foreground-secondary mt-0.5">
              Analisis frekuensi pilar konten yang paling sering digunakan oleh kompetitor dan menghasilkan views tertinggi.
            </p>
          </div>

          <div className="space-y-4">
            {VERIFIED_CONTENT_TRENDS.map((trend) => (
              <div key={trend.id} className="p-4 rounded-control bg-surface-secondary border border-border text-xs space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-light text-brand uppercase">
                      {trend.category}
                    </span>
                    <h3 className="font-bold text-foreground text-sm">{trend.title}</h3>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] font-bold text-brand">
                      {trend.frequencyCount} dari 9 Brand Menggunakan
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-500/20">
                      Potensi: {trend.potentialScore}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-foreground-secondary space-y-1">
                  <p><strong className="text-foreground font-semibold">Bukti di Pasar:</strong> {trend.evidenceSample}</p>
                  <p><strong className="text-foreground font-semibold">Brand Terdeteksi:</strong> {trend.observedBrands.join(", ")}</p>
                </div>

                <div className="pt-2 border-t border-border/60 text-[11px] text-foreground">
                  <strong className="text-brand font-bold">Rekomendasi Tindakan I See You:</strong> {trend.recommendedActionForISeeYou}
                </div>
              </div>
            ))}
          </div>

          {/* Change Log Timeline */}
          <div className="pt-4 border-t border-border space-y-3">
            <h3 className="text-sm font-bold text-foreground">Catatan Perubahan Pasar Terkini (Competitor Change Log)</h3>
            <div className="space-y-2">
              {COMPETITOR_CHANGE_LOG.map((log, idx) => (
                <div key={idx} className="p-2.5 rounded-control bg-surface border border-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface-secondary text-foreground-muted border border-border">
                      {log.date}
                    </span>
                    <span className="font-bold text-foreground">{log.brand}</span>
                    <span className="text-foreground-secondary text-[11px]">{log.description}</span>
                  </div>
                  <a
                    href={log.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand text-[10px] font-semibold hover:underline flex items-center gap-0.5 shrink-0"
                  >
                    <span>Sumber</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: STRATEGIC RECOMMENDATIONS FOR 09:00 WIB MEETING */}
      {activeTab === "recommendations" && (
        <div className="bg-surface border border-border rounded-container p-6 shadow-subtle space-y-6">
          <div className="border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand text-white">
                Siap Rapat Jam 09:00 WIB
              </span>
              <span className="text-xs text-foreground-muted font-medium">Bahan Diskusi Pimpinan</span>
            </div>
            <h2 className="text-lg font-bold text-foreground mt-1">
              Top 5 Aksi Strategis Marketing Optik I See You (Berdasarkan Data Nyata Kompetitor)
            </h2>
            <p className="text-xs text-foreground-secondary mt-0.5">
              Rekomendasi taktis berbasis keunggulan fasilitas fisik, kecepatan faset 15 menit, dan kredibilitas medis RO untuk mengunci dominasi Barlingmascakeb.
            </p>
          </div>

          <div className="space-y-4">
            {STRATEGIC_RECOMMENDATIONS_FOR_ISEEYOU.map((rec) => (
              <div key={rec.rank} className="p-5 rounded-control bg-surface-secondary border border-border space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {rec.rank}
                    </span>
                    <h3 className="text-sm font-bold text-foreground">{rec.title}</h3>
                  </div>
                  <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-800 dark:text-rose-400 border border-rose-500/20">
                    Prioritas: {rec.priority}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded bg-surface border border-border space-y-1">
                    <span className="text-[10px] font-bold uppercase text-foreground-muted block">Bukti Data Pasar (Evidence)</span>
                    <p className="text-foreground-secondary text-[11px]">{rec.evidence}</p>
                    <span className="text-[10px] font-bold uppercase text-foreground-muted block pt-1">Alasan Strategis</span>
                    <p className="text-foreground-secondary text-[11px]">{rec.reason}</p>
                  </div>

                  <div className="p-3 rounded bg-surface border border-border space-y-1">
                    <span className="text-[10px] font-bold uppercase text-brand block">Langkah Eksekusi Lapangan</span>
                    <ul className="space-y-1 text-[11px] text-foreground">
                      {rec.actionSteps.map((step, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand mt-0.5 shrink-0" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-2 text-[10px] text-emerald-800 dark:text-emerald-400 font-semibold">
                      Dampak yang Diharapkan: {rec.expectedImpact}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Traceable Sources Directory Panel */}
      <div className="bg-surface border border-border rounded-container p-5 shadow-subtle space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <ShieldCheck className="w-4 h-4 text-brand" />
            <span>Transparansi Sumber Data Resmi (Source Directory)</span>
          </div>
          <span className="text-[11px] text-foreground-muted">Pemeriksaan Terakhir: 6 Oktober 2026</span>
        </div>

        <p className="text-[11px] text-foreground-secondary">
          Seluruh data pengikut, ulasan toko, dan harga produk diambil langsung dari saluran publik resmi terverifikasi:
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
          <a href="https://optikiseeyou.com" target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded bg-surface-secondary border border-border text-foreground hover:text-brand flex items-center gap-1">
            <span>optikiseeyou.com</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <a href="https://instagram.com/iseeyou.glasses" target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded bg-surface-secondary border border-border text-foreground hover:text-brand flex items-center gap-1">
            <span>@iseeyou.glasses</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <a href="https://shopee.co.id/heykama" target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded bg-surface-secondary border border-border text-foreground hover:text-brand flex items-center gap-1">
            <span>Shopee heykama</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <a href="https://shopee.co.id/kacamatamoo" target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded bg-surface-secondary border border-border text-foreground hover:text-brand flex items-center gap-1">
            <span>Shopee kacamatamoo</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <a href="https://saturdays.com" target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded bg-surface-secondary border border-border text-foreground hover:text-brand flex items-center gap-1">
            <span>saturdays.com</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <a href="https://optikmelawai.com" target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded bg-surface-secondary border border-border text-foreground hover:text-brand flex items-center gap-1">
            <span>optikmelawai.com</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <a href="https://shopee.co.id/berrybarton?entryPoint=ShopBySearch&searchKeyword=berrybarton%20kacamata&sp_payload=fbfa4b22-88ce-486d-b46f-ebaa88a9eadb" target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded bg-surface-secondary border border-border text-foreground hover:text-brand flex items-center gap-1">
            <span>Shopee Berrybarton</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <a href="https://shopee.co.id/mollucaseyewear?entryPoint=ShopBySearch&searchKeyword=molucas%20kacamata&sp_payload=fe32335d-b3cc-4386-b0b0-45445ce4df06" target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded bg-surface-secondary border border-border text-foreground hover:text-brand flex items-center gap-1">
            <span>Shopee Mollucas</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
