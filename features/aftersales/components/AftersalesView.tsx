"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  HeartHandshake,
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Send,
  Eye,
  Glasses,
  MapPin,
  ExternalLink,
  ChevronRight,
  Plus,
  Info,
  Phone,
  Calendar,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  RefreshCw,
  MessageSquare,
} from "lucide-react";
import {
  CustomerAftersalesRecord,
  FollowUpStatus,
  AFTERSALES_CS_PHONE,
  AFTERSALES_CS_WA_URL,
} from "@/lib/aftersales";
import { CustomerDetailModal } from "./CustomerDetailModal";

type DatePreset = "all" | "today" | "7days" | "30days" | "this_month" | "custom";
type SortOrder = "newest" | "oldest";

export const AftersalesView: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerAftersalesRecord[]>([]);
  const [counts, setCounts] = useState({
    total: 0,
    filtered: 0,
    belum_dihubungi: 0,
    sudah_dihubungi: 0,
    selesai_puas: 0,
    butuh_garansi: 0,
    totalComplaints: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("");

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedReportType, setSelectedReportType] = useState("all");
  
  // Date filter state
  const [datePreset, setDatePreset] = useState<DatePreset>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  // Selection modal
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerAftersalesRecord | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New customer form state
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newBranch, setNewBranch] = useState<"PWT" | "CLP" | "PBG" | "WNS" | "TGL">("PWT");
  const [newFrame, setNewFrame] = useState("");
  const [newLens, setNewLens] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newOdSph, setNewOdSph] = useState("");
  const [newOsSph, setNewOsSph] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const [topFrames, setTopFrames] = useState<{ frame: string; count: number }[]>([]);
  const [topLenses, setTopLenses] = useState<{ lens: string; count: number }[]>([]);

  // Fetch logic with parameters
  const fetchCustomers = useCallback(
    async (forceFresh = false) => {
      if (forceFresh) setIsSyncing(true);
      try {
        const params = new URLSearchParams();
        if (forceFresh) params.set("fresh", "true");
        if (selectedBranch !== "all") params.set("branch", selectedBranch);
        if (selectedStatus !== "all") params.set("status", selectedStatus);
        if (selectedReportType !== "all") params.set("reportType", selectedReportType);
        if (searchQuery.trim()) params.set("q", searchQuery.trim());
        
        // Date parameters
        if (datePreset !== "custom" && datePreset !== "all") {
          params.set("preset", datePreset);
        } else if (datePreset === "custom") {
          if (startDate) params.set("startDate", startDate);
          if (endDate) params.set("endDate", endDate);
        }

        params.set("sort", sortOrder);

        const res = await fetch(`/api/aftersales?${params.toString()}`);
        const json = await res.json();
        if (json.success) {
          setCustomers(json.data);
          if (json.counts) {
            setCounts(json.counts);
          }
          if (json.topFrames) setTopFrames(json.topFrames);
          if (json.topLenses) setTopLenses(json.topLenses);
          if (json.lastSync) {
            const dateObj = new Date(json.lastSync);
            setLastSyncTime(
              dateObj.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }) + " WIB"
            );
          }
        }
      } catch (e) {
        console.error("Gagal mengambil data aftersales:", e);
      } finally {
        setLoading(false);
        if (forceFresh) setIsSyncing(false);
      }
    },
    [
      selectedBranch,
      selectedStatus,
      selectedReportType,
      searchQuery,
      datePreset,
      startDate,
      endDate,
      sortOrder,
    ]
  );

  // Initial fetch and fetch when dependencies change
  useEffect(() => {
    fetchCustomers(false);
  }, [fetchCustomers]);

  // Mandatory Real-time Synchronization: Background fetch every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Background revalidation without full screen loading
      fetchCustomers(false);
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchCustomers]);

  const handleUpdateCustomer = (updated: CustomerAftersalesRecord) => {
    setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setSelectedCustomer(updated);
    fetchCustomers(false);
  };

  const handlePresetClick = (preset: DatePreset) => {
    setDatePreset(preset);
    if (preset !== "custom") {
      setStartDate("");
      setEndDate("");
    }
  };

  const handleCustomDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDatePreset("custom");
    fetchCustomers(false);
  };

  const handleResetFilters = () => {
    setDatePreset("all");
    setStartDate("");
    setEndDate("");
    setSelectedBranch("all");
    setSelectedStatus("all");
    setSelectedReportType("all");
    setSearchQuery("");
    setSortOrder("newest");
  };

  const handleManualSync = () => {
    fetchCustomers(true);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"));
  };

  const getStatusBadge = (status: FollowUpStatus) => {
    switch (status) {
      case "belum_dihubungi":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" /> Belum Dihubungi
          </span>
        );
      case "sudah_dihubungi":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
            <CheckCircle2 className="w-3 h-3" /> Sudah Dihubungi
          </span>
        );
      case "selesai_puas":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Selesai / Puas
          </span>
        );
      case "butuh_garansi":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20">
            <ShieldAlert className="w-3 h-3" /> Perlu Garansi
          </span>
        );
    }
  };

  const getReportTypeBadge = (type: "Review" | "Komplain" | "Pemeriksaan") => {
    switch (type) {
      case "Komplain":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30">
            <ShieldAlert className="w-3 h-3" /> Komplain
          </span>
        );
      case "Review":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            <MessageSquare className="w-3 h-3" /> Review
          </span>
        );
      case "Pemeriksaan":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30">
            <Eye className="w-3 h-3" /> Periksa Mata
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-light text-brand border border-brand/20 flex items-center gap-1">
              <HeartHandshake className="w-3 h-3" /> CRM & AFTERSALES REALTIME
            </span>
            <span className="text-xs text-foreground-muted flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync Google Sheets
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Layanan Aftersales &amp; Kepuasan Pelanggan
          </h1>
          <p className="text-xs text-foreground-secondary mt-1">
            Monitoring rekam medis refraksi kacamata, follow-up kenyamanan, penanganan komplain, dan retensi pelanggan 5 cabang Optik I See You.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Manual Refresh / Revalidation Button */}
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-xs font-semibold text-foreground transition-all shadow-subtle disabled:opacity-50"
            title="Tarik pembaruan data terbaru dari Google Sheets"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-brand ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Menyinkronkan..." : "Sinkronkan Sekarang"}</span>
          </button>

          <a
            href="https://docs.google.com/spreadsheets/d/10lKjuzUvWhnUKbKNEo4opo4MiQoesZKW4NhY9sQ4T8w/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-xs font-semibold text-foreground-secondary hover:text-foreground transition-all shadow-subtle"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Spreadsheet Asli</span>
          </a>
        </div>
      </div>

      {/* Sync Status Banner */}
      <div className="p-3 rounded-xl bg-surface-secondary/40 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-foreground-secondary text-[11px]">
            Sumber Data: Google Spreadsheet ID <code>10lKjuzUvWhn...</code> (Sheet <strong>REKAP DATA</strong> &amp; <strong>DATA CUSTOMER</strong>).
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-foreground-muted">
          <span>Sinkronisasi Otomatis Tiap 60 Detik</span>
          {lastSyncTime && (
            <span className="font-mono font-semibold text-foreground bg-surface px-2 py-0.5 rounded border border-border">
              Update: {lastSyncTime}
            </span>
          )}
        </div>
      </div>

      {/* Official CS Aftersales Contact Bar */}
      <div className="p-3.5 rounded-xl bg-surface border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">WhatsApp CS Aftersales Resmi:</span>
              <span className="font-mono font-bold text-emerald-800 dark:text-emerald-400 text-xs sm:text-sm">
                {AFTERSALES_CS_PHONE}
              </span>
            </div>
            <p className="text-foreground-secondary text-[11px]">
              Kanal resmi tindak lanjut garansi, keluhan baut/fitting, respon ulasan Google Maps, dan konsultasi refraksi.
            </p>
          </div>
        </div>
        <a
          href={AFTERSALES_CS_WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-all shadow-subtle shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Chat WhatsApp CS</span>
          <ExternalLink className="w-3 h-3 opacity-80" />
        </a>
      </div>

      {/* KPI Status Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <button
          onClick={() =>
            setSelectedStatus(
              selectedStatus === "belum_dihubungi" ? "all" : "belum_dihubungi"
            )
          }
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedStatus === "belum_dihubungi"
              ? "border-amber-500 bg-amber-500/10 shadow-subtle"
              : "border-border bg-surface hover:bg-surface-secondary/50"
          }`}
        >
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Belum Dihubungi
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-foreground tabular-nums">
            {counts.belum_dihubungi}
          </div>
          <span className="text-[10px] text-foreground-muted block mt-0.5">
            Perlu dihubungi H+3 / H+7
          </span>
        </button>

        <button
          onClick={() =>
            setSelectedStatus(
              selectedStatus === "sudah_dihubungi" ? "all" : "sudah_dihubungi"
            )
          }
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedStatus === "sudah_dihubungi"
              ? "border-blue-500 bg-blue-500/10 shadow-subtle"
              : "border-border bg-surface hover:bg-surface-secondary/50"
          }`}
        >
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
              Sedang Dihubungi
            </span>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-foreground tabular-nums">
            {counts.sudah_dihubungi}
          </div>
          <span className="text-[10px] text-foreground-muted block mt-0.5">
            Menunggu respon customer
          </span>
        </button>

        <button
          onClick={() =>
            setSelectedStatus(
              selectedStatus === "butuh_garansi" ? "all" : "butuh_garansi"
            )
          }
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedStatus === "butuh_garansi"
              ? "border-red-500 bg-red-500/10 shadow-subtle"
              : "border-border bg-surface hover:bg-surface-secondary/50"
          }`}
        >
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
              Perlu Garansi / Servis
            </span>
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400 tabular-nums">
            {counts.butuh_garansi}
          </div>
          <span className="text-[10px] text-red-600/80 block mt-0.5">
            {counts.totalComplaints} log komplain riil
          </span>
        </button>

        <button
          onClick={() =>
            setSelectedStatus(
              selectedStatus === "selesai_puas" ? "all" : "selesai_puas"
            )
          }
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedStatus === "selesai_puas"
              ? "border-emerald-500 bg-emerald-500/10 shadow-subtle"
              : "border-border bg-surface hover:bg-surface-secondary/50"
          }`}
        >
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Selesai &amp; Puas
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {counts.selesai_puas}
          </div>
          <span className="text-[10px] text-emerald-600/80 block mt-0.5">
            {counts.totalReviews} review positif
          </span>
        </button>
      </div>

      {/* Realtime Trend Frame & Lens Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Frames */}
        <div className="p-4 rounded-xl border border-border bg-surface shadow-subtle space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-brand-light text-brand">
                <Glasses className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-foreground">
                  Top Model Frame Terlaris (Database Riil Toko)
                </h3>
                <p className="text-[10px] text-foreground-muted">
                  Dihitung otomatis dari 6.062+ rekam transaksi DATA CUSTOMER
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-secondary text-foreground border border-border">
              Live Sheets
            </span>
          </div>

          <div className="space-y-1.5">
            {topFrames.length === 0 ? (
              <p className="text-xs text-foreground-muted py-2">Memuat data model frame...</p>
            ) : (
              topFrames.slice(0, 5).map((tf, idx) => (
                <div
                  key={tf.frame}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-surface-secondary/50 hover:bg-surface-secondary transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand/10 text-brand font-bold text-[10px] flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="font-semibold text-foreground">{tf.frame}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-foreground">{tf.count}</span>
                    <span className="text-[10px] text-foreground-muted">transaksi</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Lenses */}
        <div className="p-4 rounded-xl border border-border bg-surface shadow-subtle space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-foreground">
                  Top Jenis Lensa Paling Diminati
                </h3>
                <p className="text-[10px] text-foreground-muted">
                  Preferensi jenis lensa pilihan customer Optik I See You
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
              Verified
            </span>
          </div>

          <div className="space-y-1.5">
            {topLenses.length === 0 ? (
              <p className="text-xs text-foreground-muted py-2">Memuat data lensa...</p>
            ) : (
              topLenses.slice(0, 5).map((tl, idx) => (
                <div
                  key={tl.lens}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-surface-secondary/50 hover:bg-surface-secondary transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-600 font-bold text-[10px] flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="font-semibold text-foreground">{tl.lens}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-blue-700 dark:text-blue-400">
                      {tl.count.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[10px] text-foreground-muted">pasien</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* FILTER & TIMESTAMP CONTROL SYSTEM (MANDATE POINT 1 & 2) */}
      <div className="rounded-xl border border-border bg-surface p-4 shadow-subtle space-y-4">
        {/* Date Preset Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-border pb-3.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5 mr-1">
              <Calendar className="w-3.5 h-3.5 text-brand" />
              <span>Filter Tanggal Input (Timestamp):</span>
            </span>

            <div className="flex items-center gap-1 p-1 bg-surface-secondary rounded-xl border border-border overflow-x-auto max-w-full">
              <button
                onClick={() => handlePresetClick("all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  datePreset === "all"
                    ? "bg-foreground text-surface shadow-subtle"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
              >
                Semua Data
              </button>

              <button
                onClick={() => handlePresetClick("today")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  datePreset === "today"
                    ? "bg-foreground text-surface shadow-subtle"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
              >
                Hari Ini (29 Sep)
              </button>

              <button
                onClick={() => handlePresetClick("7days")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  datePreset === "7days"
                    ? "bg-foreground text-surface shadow-subtle"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
              >
                7 Hari Terakhir
              </button>

              <button
                onClick={() => handlePresetClick("30days")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  datePreset === "30days"
                    ? "bg-foreground text-surface shadow-subtle"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
              >
                30 Hari Terakhir
              </button>

              <button
                onClick={() => handlePresetClick("this_month")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  datePreset === "this_month"
                    ? "bg-foreground text-surface shadow-subtle"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
              >
                Bulan Ini (September 2026)
              </button>
            </div>
          </div>

          {/* Sorting Toggle: Newest vs Oldest */}
          <div className="flex items-center gap-2 self-start lg:self-auto">
            <button
              onClick={toggleSortOrder}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface-secondary text-xs font-semibold text-foreground hover:bg-surface-secondary/80 transition-all shadow-2xs"
              title="Urutkan berdasarkan Timestamp Column A"
            >
              {sortOrder === "newest" ? (
                <>
                  <ArrowDownWideNarrow className="w-3.5 h-3.5 text-brand" />
                  <span>Terbaru ke Terlama</span>
                </>
              ) : (
                <>
                  <ArrowUpNarrowWide className="w-3.5 h-3.5 text-blue-600" />
                  <span>Terlama ke Terbaru</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Custom Date Range Form & Filters Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 flex-wrap">
          {/* Custom Date Inputs */}
          <form
            onSubmit={handleCustomDateSubmit}
            className="flex items-center gap-2 flex-wrap text-xs"
          >
            <span className="text-[11px] font-semibold text-foreground-secondary">
              Rentang Kustom:
            </span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setDatePreset("custom");
              }}
              className="px-2.5 py-1 bg-surface-secondary border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            />
            <span className="text-foreground-muted">s/d</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setDatePreset("custom");
              }}
              className="px-2.5 py-1 bg-surface-secondary border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            />
            {(startDate || endDate || datePreset !== "all") && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-2 py-1 rounded text-[11px] font-semibold text-foreground-muted hover:text-foreground hover:underline"
              >
                Reset Filter
              </button>
            )}
          </form>

          {/* Secondary Select Dropdowns: Branch, Status, ReportType */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Report Type Filter */}
            <select
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(e.target.value)}
              className="px-2.5 py-1.5 bg-surface-secondary border border-border rounded-lg text-xs text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="all">Semua Tipe Laporan</option>
              <option value="Review">Ulasan / Review ({counts.totalReviews})</option>
              <option value="Komplain">Komplain / Masalah ({counts.totalComplaints})</option>
              <option value="Pemeriksaan">Pemeriksaan Baru</option>
            </select>

            {/* Branch Filter */}
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-2.5 py-1.5 bg-surface-secondary border border-border rounded-lg text-xs text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="all">Semua Cabang (5 Cabang)</option>
              <option value="pwt">Purwokerto (Pusat)</option>
              <option value="clp">Cilacap</option>
              <option value="pbg">Purbalingga</option>
              <option value="wns">Wonosobo</option>
              <option value="tgl">Lunar Eyewear Tegal</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 bg-surface-secondary border border-border rounded-lg text-xs text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="all">Semua Status CRM</option>
              <option value="belum_dihubungi">Belum Dihubungi</option>
              <option value="sudah_dihubungi">Sudah Dihubungi</option>
              <option value="selesai_puas">Selesai / Puas</option>
              <option value="butuh_garansi">Perlu Garansi</option>
            </select>
          </div>
        </div>

        {/* Search input and result counter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, no WhatsApp, isi komplain, model frame..."
              className="w-full pl-9 pr-3 py-1.5 bg-surface-secondary border border-border rounded-lg text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-foreground-muted">
            <span>
              Menampilkan <strong className="text-foreground">{customers.length}</strong> dari{" "}
              {counts.total} entri data
            </span>
          </div>
        </div>

        {/* Customer Interactive Table */}
        <div className="overflow-x-auto border border-border/80 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary text-foreground-secondary border-b border-border text-[10px] uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-3">Waktu Input (Timestamp)</th>
                <th className="py-2.5 px-3">Nama Pelanggan</th>
                <th className="py-2.5 px-3">Tipe &amp; Cabang</th>
                <th className="py-2.5 px-3">Kacamata &amp; Catatan Asli</th>
                <th className="py-2.5 px-3">Resep (R/L)</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-foreground-muted">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-brand" />
                      <span>Menyinkronkan data dari Google Sheets...</span>
                    </div>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-foreground-muted space-y-2">
                    <p className="font-semibold text-foreground">
                      Tidak ada data yang sesuai dengan filter tanggal atau kriteria pencarian.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-xs font-semibold text-foreground hover:bg-surface-secondary/80"
                    >
                      Reset Semua Filter
                    </button>
                  </td>
                </tr>
              ) : (
                customers.map((cust) => (
                  <tr
                    key={cust.id}
                    onClick={() => setSelectedCustomer(cust)}
                    className="hover:bg-brand-light/30 cursor-pointer transition-colors group"
                  >
                    {/* Exact Timestamp Column A */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-foreground font-medium">
                        <Clock className="w-3 h-3 text-brand shrink-0" />
                        <span>{cust.timestampFormatted || cust.examDate}</span>
                      </div>
                      <span className="text-[9px] text-foreground-muted block pl-4.5">
                        Tgl Periksa: {cust.examDate}
                      </span>
                    </td>

                    {/* Name & Phone */}
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-foreground group-hover:text-brand transition-colors flex items-center gap-1.5">
                        <span>{cust.name}</span>
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-brand" />
                      </div>
                      <span className="text-[10px] font-mono text-foreground-muted block">
                        {cust.phone}
                      </span>
                    </td>

                    {/* Report Type & Branch */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="mb-1">{getReportTypeBadge(cust.reportType)}</div>
                      <span className="font-medium text-foreground text-[11px] flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-brand" />
                        {cust.city}
                      </span>
                    </td>

                    {/* Frame, Lens & Actual Feedback / Notes */}
                    <td className="py-2.5 px-3 max-w-sm">
                      <div className="font-semibold text-foreground truncate">
                        {cust.frameModel} · <span className="text-foreground-muted font-normal">{cust.lensType}</span>
                      </div>
                      {cust.feedbackText ? (
                        <p className="text-[10px] text-foreground-secondary line-clamp-2 italic mt-0.5 bg-surface-secondary/40 p-1 rounded border border-border/40">
                          &quot;{cust.feedbackText}&quot;
                        </p>
                      ) : (
                        <p className="text-[10px] text-foreground-muted truncate mt-0.5">
                          {cust.notes}
                        </p>
                      )}
                    </td>

                    {/* Prescription snippet */}
                    <td className="py-2.5 px-3 font-mono text-[11px] tabular-nums whitespace-nowrap">
                      <div>
                        R: {cust.prescription.odSph}{" "}
                        {cust.prescription.odCyl !== "0.00" ? cust.prescription.odCyl : ""}
                      </div>
                      <div className="text-foreground-muted">
                        L: {cust.prescription.osSph}{" "}
                        {cust.prescription.osCyl !== "0.00" ? cust.prescription.osCyl : ""}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {getStatusBadge(cust.status)}
                    </td>

                    {/* Action */}
                    <td
                      className="py-2.5 px-3 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setSelectedCustomer(cust)}
                        className="px-2.5 py-1 rounded bg-surface border border-border text-[11px] font-semibold text-foreground-secondary hover:text-foreground hover:bg-surface-secondary transition-all"
                      >
                        Detail &amp; WA
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drill-down Customer Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onUpdateCustomer={handleUpdateCustomer}
        />
      )}
    </div>
  );
};
