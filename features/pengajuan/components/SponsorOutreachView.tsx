"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  Phone,
  Building2,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  FileText,
  User,
  Tag,
  ArrowUpRight,
  ShieldCheck,
  Layers,
  MapPin,
  Instagram,
  AlertTriangle,
  Info,
  RotateCcw,
  Star,
  ChevronDown,
} from "lucide-react";
import {
  SponsorLead,
  B2BCategory,
  B2BRegion,
  VerificationStatus,
  OutreachStatus,
  INITIAL_SPONSOR_LEADS,
  buildSponsorPitchText,
  buildB2BVoucherPitchText,
  buildWhatsAppLink,
} from "@/lib/sponsor-leads-data";
import { B2BEvidenceModal } from "./B2BEvidenceModal";

const STORAGE_KEY = "imi_sponsor_leads_data_v3";

const STATUS_CONFIG: Record<
  OutreachStatus,
  { label: string; badge: string; icon: React.ComponentType<{ className?: string }> }
> = {
  "Belum Dihubungi": {
    label: "Belum Dihubungi",
    badge: "bg-surface-secondary text-foreground-secondary border-border",
    icon: Clock,
  },
  "Chat Terkirim": {
    label: "Chat Terkirim",
    badge: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    icon: Send,
  },
  "Menunggu Respon": {
    label: "Menunggu Respon",
    badge: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    icon: AlertCircle,
  },
  Negosiasi: {
    label: "Negosiasi",
    badge: "bg-purple-500/10 text-purple-500 border-purple-500/30",
    icon: Layers,
  },
  "Deal Disetujui": {
    label: "Deal Disetujui",
    badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
    icon: CheckCircle2,
  },
  Ditolak: {
    label: "Ditolak / Belum Pas",
    badge: "bg-rose-500/10 text-rose-500 border-rose-500/30",
    icon: AlertCircle,
  },
};

const CATEGORY_COLORS: Record<B2BCategory, string> = {
  "F&B": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30",
  "Fashion & Apparel": "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
  "Beauty & Cosmetics": "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/30",
  "Health & Wellness": "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30",
  Entertainment: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
  "Lifestyle & Retail": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  Other: "bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/30",
};

const REGION_BADGES: Record<B2BRegion, string> = {
  Purbalingga: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
  Cilacap: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30",
  Wonosobo: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  Purwokerto: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
};

const CATEGORIES_LIST: { key: string; label: string; countCat?: B2BCategory }[] = [
  { key: "all", label: "Semua Kategori" },
  { key: "F&B", label: "F&B (Kuliner & Kafe)", countCat: "F&B" },
  { key: "Beauty & Cosmetics", label: "Beauty & Cosmetics", countCat: "Beauty & Cosmetics" },
  { key: "Fashion & Apparel", label: "Fashion & Apparel", countCat: "Fashion & Apparel" },
  { key: "Lifestyle & Retail", label: "Lifestyle & Retail", countCat: "Lifestyle & Retail" },
  { key: "Health & Wellness", label: "Health & Wellness", countCat: "Health & Wellness" },
  { key: "Entertainment", label: "Entertainment", countCat: "Entertainment" },
];

export const SponsorOutreachView: React.FC = () => {
  const [leads, setLeads] = useState<SponsorLead[]>(INITIAL_SPONSOR_LEADS);
  const [selectedLeadId, setSelectedLeadId] = useState<string>(INITIAL_SPONSOR_LEADS[0].id);
  const [senderName, setSenderName] = useState("Yossika Putra");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [verificationFilter, setVerificationFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"default" | "name" | "rating" | "verified">("default");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedPreview, setCopiedPreview] = useState(false);
  const [pitchMode, setPitchMode] = useState<"voucher" | "event">("voucher");
  const [modalLead, setModalLead] = useState<SponsorLead | null>(null);

  // Load persisted leads state from localStorage (non-destructive merge)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge to preserve existing statuses while hydrating rich verified fields
          const merged = INITIAL_SPONSOR_LEADS.map((init) => {
            const match = parsed.find((p: any) => p.id === init.id);
            if (match) {
              return {
                ...init,
                status: match.status || match.outreachStatus || init.status,
                outreachStatus: match.outreachStatus || match.status || init.outreachStatus,
                lastFollowUp: match.lastFollowUp || init.lastFollowUp,
              };
            }
            return init;
          });
          setLeads(merged);
          return;
        }
      }
    } catch {
      // ignore JSON parse error
    }
  }, []);

  const saveLeads = (newLeads: SponsorLead[]) => {
    setLeads(newLeads);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newLeads));
    } catch {
      // ignore
    }
  };

  const updateLeadStatus = (id: string, newStatus: OutreachStatus) => {
    const updated = leads.map((l) =>
      l.id === id
        ? {
            ...l,
            status: newStatus,
            outreachStatus: newStatus,
            lastFollowUp: new Date().toISOString(),
          }
        : l
    );
    saveLeads(updated);
  };

  const selectedLead = useMemo(() => {
    return leads.find((l) => l.id === selectedLeadId) || leads[0];
  }, [leads, selectedLeadId]);

  const activePitchText = useMemo(() => {
    if (!selectedLead) return "";
    return pitchMode === "voucher"
      ? buildB2BVoucherPitchText(selectedLead, senderName)
      : buildSponsorPitchText(selectedLead, senderName);
  }, [selectedLead, pitchMode, senderName]);

  const handleCopyPitch = (lead: SponsorLead) => {
    const text =
      pitchMode === "voucher"
        ? buildB2BVoucherPitchText(lead, senderName)
        : buildSponsorPitchText(lead, senderName);
    navigator.clipboard.writeText(text);
    setCopiedId(lead.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyActivePreview = () => {
    navigator.clipboard.writeText(activePitchText);
    setCopiedPreview(true);
    setTimeout(() => setCopiedPreview(false), 2500);
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setRegionFilter("all");
    setVerificationFilter("all");
    setStatusFilter("all");
    setSortBy("default");
  };

  // Filtered & Sorted Leads
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        const matchesSearch =
          !searchQuery ||
          lead.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (lead.phone && lead.phone.includes(searchQuery)) ||
          (lead.address && lead.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
          lead.notes.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = categoryFilter === "all" || lead.category === categoryFilter;
        const matchesRegion = regionFilter === "all" || lead.region === regionFilter;
        const matchesVerification =
          verificationFilter === "all" || lead.verificationStatus === verificationFilter;
        const matchesStatus =
          statusFilter === "all" || lead.outreachStatus === statusFilter || lead.status === statusFilter;

        return matchesSearch && matchesCategory && matchesRegion && matchesVerification && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return a.brandName.localeCompare(b.brandName);
        }
        if (sortBy === "rating") {
          return (b.rating || 0) - (a.rating || 0);
        }
        if (sortBy === "verified") {
          const rank = { verified: 3, partially_verified: 2, needs_review: 1, rejected: 0 };
          return rank[b.verificationStatus] - rank[a.verificationStatus];
        }
        return 0; // default initial order
      });
  }, [leads, searchQuery, categoryFilter, regionFilter, verificationFilter, statusFilter, sortBy]);

  // KPI calculations
  const totalLeads = leads.length;
  const verifiedLeads = leads.filter((l) => l.verificationStatus === "verified").length;
  const uncontactedLeads = leads.filter((l) => l.outreachStatus === "Belum Dihubungi").length;
  const inProgressLeads = leads.filter(
    (l) => l.outreachStatus === "Menunggu Respon" || l.outreachStatus === "Negosiasi" || l.outreachStatus === "Chat Terkirim"
  ).length;
  const dealLeads = leads.filter((l) => l.outreachStatus === "Deal Disetujui").length;

  const regCounts = useMemo(() => ({
    Purbalingga: leads.filter((l) => l.region === "Purbalingga").length,
    Cilacap: leads.filter((l) => l.region === "Cilacap").length,
    Wonosobo: leads.filter((l) => l.region === "Wonosobo").length,
    Purwokerto: leads.filter((l) => l.region === "Purwokerto").length,
  }), [leads]);

  const verifCounts = useMemo(() => ({
    verified: leads.filter((l) => l.verificationStatus === "verified").length,
    partially_verified: leads.filter((l) => l.verificationStatus === "partially_verified").length,
    needs_review: leads.filter((l) => l.verificationStatus === "needs_review").length,
  }), [leads]);

  return (
    <div className="space-y-6">
      {/* Evidence & Details Modal */}
      <B2BEvidenceModal lead={modalLead} onClose={() => setModalLead(null)} />

      {/* Header Banner & Live CRM Metrics */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-surface to-surface-secondary border border-border shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand/10 text-brand border border-brand/20">
                Direktori Mitra B2B Multi-Kategori &amp; Sponsor
              </span>
              <span className="text-xs text-foreground-muted font-medium">
                Cakupan: Purbalingga · Cilacap · Wonosobo · Purwokerto
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Direktori Prospek Kemitraan B2B &amp; Sponsorship
            </h2>
            <p className="text-xs sm:text-sm text-foreground-secondary max-w-3xl leading-relaxed">
              Direktori terverifikasi untuk pertukaran voucher belanja kasir, brosur silang (store-to-store),
              promosi media sosial (@iseeyou.glasses), dan paket sponsor event.
              Seluruh opsi kemitraan berstatus <strong>usulan internal</strong> hingga MoU resmi disepakati.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/proposal-merchant"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-foreground hover:bg-surface-secondary transition-colors shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-brand" />
              <span>Dokumen B2B</span>
              <ArrowUpRight className="w-3 h-3 text-foreground-muted" />
            </Link>
            <Link
              href="/proposal-sponsor"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-foreground hover:bg-surface-secondary transition-colors shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>Proposal Event</span>
              <ArrowUpRight className="w-3 h-3 text-foreground-muted" />
            </Link>
          </div>
        </div>

        {/* Quick KPI stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5 pt-4 border-t border-border">
          <div className="p-3 rounded-xl bg-surface border border-border/80">
            <span className="text-[11px] text-foreground-muted font-medium block">Total Prospek</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-foreground">{totalLeads}</span>
              <span className="text-xs text-foreground-muted">Mitra</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface border border-border/80">
            <span className="text-[11px] text-foreground-muted font-medium block">Terverifikasi Faktual</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{verifiedLeads}</span>
              <span className="text-xs text-foreground-muted">/ {totalLeads}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface border border-border/80">
            <span className="text-[11px] text-foreground-muted font-medium block">Belum Dihubungi</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-neutral-500">{uncontactedLeads}</span>
              <span className="text-xs text-foreground-muted">Prospek</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface border border-border/80">
            <span className="text-[11px] text-foreground-muted font-medium block">Follow-up / Nego</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-amber-500">{inProgressLeads}</span>
              <span className="text-xs text-foreground-muted">Brand</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface border border-border/80 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-foreground-muted font-medium block">Deal Disetujui</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-emerald-500">{dealLeads}</span>
              <span className="text-xs text-foreground-muted">Partnered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Merchant Cards & Filters (7 Cols) | Right Live Chat Preview (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Filter Controls & Directory List (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES_LIST.map((cat) => {
              const count = cat.countCat
                ? leads.filter((l) => l.category === cat.countCat).length
                : leads.length;
              const isActive = categoryFilter === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setCategoryFilter(cat.key)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-foreground text-surface shadow-xs"
                      : "bg-surface border border-border text-foreground-secondary hover:text-foreground hover:bg-surface-secondary"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isActive ? "bg-surface/20 text-surface" : "bg-surface-secondary text-foreground-muted"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Multilevel Filter Bar */}
          <div className="p-4 rounded-xl bg-surface border border-border space-y-3 shadow-2xs">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
                <input
                  type="text"
                  placeholder="Cari nama merchant, alamat, PIC, atau no telp..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-secondary border border-border text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>

              {/* City / Region Filter */}
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-surface-secondary border border-border text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
              >
                <option value="all">Semua Wilayah</option>
                <option value="Purbalingga">Purbalingga ({regCounts.Purbalingga})</option>
                <option value="Cilacap">Cilacap ({regCounts.Cilacap})</option>
                <option value="Wonosobo">Wonosobo ({regCounts.Wonosobo})</option>
                <option value="Purwokerto">Purwokerto ({regCounts.Purwokerto})</option>
              </select>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-xl bg-surface-secondary border border-border text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
              >
                <option value="default">Urutan Default</option>
                <option value="name">Nama (A - Z)</option>
                <option value="rating">Rating Google Maps</option>
                <option value="verified">Tingkat Verifikasi</option>
              </select>
            </div>

            {/* Secondary Filters: Verification & Outreach Status */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-foreground-muted text-[11px] font-medium">Verifikasi:</span>
                  <select
                    value={verificationFilter}
                    onChange={(e) => setVerificationFilter(e.target.value)}
                    className="px-2 py-1 rounded-lg bg-surface-secondary border border-border text-[11px] font-semibold text-foreground focus:outline-none"
                  >
                    <option value="all">Semua</option>
                    <option value="verified">Verified ({verifCounts.verified})</option>
                    <option value="partially_verified">Partially Verified ({verifCounts.partially_verified})</option>
                    <option value="needs_review">Needs Review ({verifCounts.needs_review})</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-foreground-muted text-[11px] font-medium">Status Chat:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-2 py-1 rounded-lg bg-surface-secondary border border-border text-[11px] font-semibold text-foreground focus:outline-none"
                  >
                    <option value="all">Semua Status</option>
                    <option value="Belum Dihubungi">Belum Dihubungi</option>
                    <option value="Chat Terkirim">Chat Terkirim</option>
                    <option value="Menunggu Respon">Menunggu Respon</option>
                    <option value="Negosiasi">Negosiasi</option>
                    <option value="Deal Disetujui">Deal Disetujui</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>
                </div>
              </div>

              {(searchQuery || categoryFilter !== "all" || regionFilter !== "all" || verificationFilter !== "all" || statusFilter !== "all" || sortBy !== "default") && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-brand hover:underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Filter</span>
                </button>
              )}
            </div>
          </div>

          {/* List Count Notice */}
          <div className="flex items-center justify-between text-xs text-foreground-muted px-1">
            <span>
              Menampilkan <strong>{filteredLeads.length}</strong> dari <strong>{totalLeads}</strong> merchant kemitraan
            </span>
            {categoryFilter === "F&B" && (
              <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400">
                15 Kandidat F&amp;B Lengkap (Purbalingga, Cilacap, Wonosobo)
              </span>
            )}
          </div>

          {/* Merchant Cards List */}
          <div className="space-y-3">
            {filteredLeads.map((lead, idx) => {
              const isSelected = lead.id === selectedLeadId;
              const directWaLink = lead.cleanPhone
                ? buildWhatsAppLink(
                    lead.cleanPhone,
                    pitchMode === "voucher"
                      ? buildB2BVoucherPitchText(lead, senderName)
                      : buildSponsorPitchText(lead, senderName)
                  )
                : "#";

              const isWaDisabled = !lead.cleanPhone;

              return (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLeadId(lead.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-brand/5 border-brand ring-1 ring-brand/30 shadow-xs"
                      : "bg-surface border-border hover:border-brand/40 hover:bg-surface-secondary/40"
                  }`}
                >
                  {/* Top Row: Category, City, Verification Badge, Status Dropdown */}
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-mono text-foreground-muted font-bold">
                          #{String(idx + 1).padStart(2, "0")}
                        </span>
                        <h4 className="font-black text-sm text-foreground">{lead.brandName}</h4>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            CATEGORY_COLORS[lead.category] || "bg-surface-secondary text-foreground-secondary border-border"
                          }`}
                        >
                          {lead.category}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            REGION_BADGES[lead.region] || "bg-surface-secondary text-foreground-secondary border-border"
                          }`}
                        >
                          {lead.region}
                        </span>

                        {/* Verification Status Badge */}
                        {lead.verificationStatus === "verified" ? (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        ) : lead.verificationStatus === "partially_verified" ? (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                            <Info className="w-3 h-3" />
                            <span>Partial</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Needs Review</span>
                          </span>
                        )}
                      </div>

                      {/* Contact Info & Verified Links */}
                      <div className="flex items-center gap-3 text-xs text-foreground-secondary flex-wrap pt-0.5">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-foreground-muted" />
                          <span>{lead.contactPerson || "Tim Manajemen"}</span>
                        </span>

                        {lead.phone ? (
                          <span className="flex items-center gap-1 font-mono text-[11px] text-foreground font-semibold">
                            <Phone className="w-3 h-3 text-emerald-600" />
                            <span>{lead.phone}</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-foreground-muted italic">
                            (Nomor telepon null)
                          </span>
                        )}

                        {lead.rating && (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-foreground">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span>{lead.rating.toFixed(1)}</span>
                          </span>
                        )}

                        {lead.mapsUrl && (
                          <a
                            href={lead.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-0.5 text-[11px] font-bold text-brand hover:underline"
                            title="Buka Google Maps"
                          >
                            <MapPin className="w-3 h-3" />
                            <span>Maps</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}

                        {lead.instagramUrl && (
                          <a
                            href={lead.instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-0.5 text-[11px] font-bold text-pink-600 dark:text-pink-400 hover:underline"
                            title="Buka Instagram"
                          >
                            <Instagram className="w-3 h-3" />
                            <span>IG</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Status Dropdown */}
                    <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={lead.outreachStatus}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as OutreachStatus)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-xl border cursor-pointer focus:outline-none ${
                          STATUS_CONFIG[lead.outreachStatus]?.badge
                        }`}
                      >
                        <option value="Belum Dihubungi">Belum Dihubungi</option>
                        <option value="Chat Terkirim">Chat Terkirim</option>
                        <option value="Menunggu Respon">Menunggu Respon</option>
                        <option value="Negosiasi">Negosiasi</option>
                        <option value="Deal Disetujui">Deal Disetujui</option>
                        <option value="Ditolak">Ditolak</option>
                      </select>
                    </div>
                  </div>

                  {/* Address Summary */}
                  {lead.address && (
                    <p className="text-[11px] text-foreground-muted mt-1.5 line-clamp-1">
                      <span className="font-semibold text-foreground-secondary">Alamat:</span> {lead.address}
                    </p>
                  )}

                  {/* Proposed Collaboration Box */}
                  <div className="text-[11px] text-foreground-secondary mt-2 leading-relaxed bg-surface-secondary/70 p-2.5 rounded-xl border border-border/70 space-y-1">
                    <p>
                      <span className="font-bold text-foreground">Angle Kolaborasi:</span> {lead.collaborationAngle}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-foreground-muted pt-0.5">
                      <span><strong>Voucher:</strong> {lead.voucherOption}</span>
                      <span><strong>Display:</strong> {lead.brochureOption}</span>
                    </div>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-border/60">
                    <span className="text-[11px] text-foreground-muted flex items-center gap-1 font-medium">
                      <Tag className="w-3 h-3 text-brand" />
                      <span>Paket: <strong className="text-foreground">{lead.recommendedPackage}</strong></span>
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {/* Detail & Bukti Modal Trigger */}
                      <button
                        type="button"
                        onClick={() => setModalLead(lead)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-surface border border-border text-[11px] font-bold text-foreground hover:bg-surface-secondary transition-colors"
                        title="Lihat bukti audit verifikasi"
                      >
                        <ShieldCheck className="w-3 h-3 text-brand" />
                        <span>Detail &amp; Bukti</span>
                      </button>

                      {/* Copy Chat WhatsApp */}
                      <button
                        type="button"
                        onClick={() => handleCopyPitch(lead)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-surface border border-border text-[11px] font-bold text-foreground hover:bg-surface-secondary transition-colors"
                        title="Salin naskah chat WhatsApp"
                      >
                        {copiedId === lead.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-500 font-bold">Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-foreground-muted" />
                            <span>Salin Chat</span>
                          </>
                        )}
                      </button>

                      {/* Chat WA (Disabled if phone is null) */}
                      {isWaDisabled ? (
                        <div className="relative group">
                          <button
                            type="button"
                            disabled
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 text-[11px] font-bold cursor-not-allowed opacity-60"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>Chat WA</span>
                          </button>
                          <div className="absolute bottom-full right-0 mb-1.5 hidden group-hover:block z-20 w-48 p-2 rounded-lg bg-neutral-900 text-white text-[10px] leading-tight shadow-lg">
                            Nomor kontak belum terverifikasi publik. Silakan lakukan audiensi fisik langsung.
                          </div>
                        </div>
                      ) : (
                        <a
                          href={directWaLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors shadow-2xs"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Chat WA</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredLeads.length === 0 && (
              <div className="p-8 text-center bg-surface rounded-2xl border border-border space-y-3">
                <AlertCircle className="w-8 h-8 text-foreground-muted mx-auto" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-foreground">Tidak Ada Merchant yang Cocok</h4>
                  <p className="text-xs text-foreground-secondary">
                    Tidak ditemukan merchant yang sesuai dengan kombinasi filter dan pencarian aktif.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface-secondary border border-border text-xs font-bold text-foreground hover:bg-surface transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Kembalikan Semua Filter</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Chat WhatsApp Pitch Preview (5 Cols - Sticky) */}
        <div className="lg:col-span-5 sticky top-20 space-y-4">
          <div className="rounded-2xl border border-border bg-surface shadow-md overflow-hidden">
            {/* Mode Switcher: Penjajakan Barter Voucher vs Proposal Event */}
            <div className="p-2 bg-surface-secondary border-b border-border">
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-surface rounded-xl border border-border">
                <button
                  type="button"
                  onClick={() => setPitchMode("voucher")}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-0.5 ${
                    pitchMode === "voucher"
                      ? "bg-brand text-white shadow-xs"
                      : "text-foreground-secondary hover:text-foreground hover:bg-surface-secondary"
                  }`}
                >
                  <span>1. Barter Voucher B2B</span>
                  <span className="text-[10px] font-normal opacity-90">Penjajakan Awal (50 Pcs/Bln)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPitchMode("event")}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-0.5 ${
                    pitchMode === "event"
                      ? "bg-brand text-white shadow-xs"
                      : "text-foreground-secondary hover:text-foreground hover:bg-surface-secondary"
                  }`}
                >
                  <span>2. Proposal Event</span>
                  <span className="text-[10px] font-normal opacity-90">Sponsorship Masterclass</span>
                </button>
              </div>
            </div>

            {/* Header chat mockup */}
            <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm shrink-0">
                  {selectedLead.brandName.substring(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm leading-tight truncate">
                    {selectedLead.brandName}
                  </h4>
                  <p className="text-[10px] text-emerald-100 flex items-center gap-1 truncate">
                    <User className="w-3 h-3 shrink-0" />
                    <span>{selectedLead.contactPerson} ({selectedLead.region})</span>
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white tracking-wide shrink-0">
                Format Resmi
              </span>
            </div>

            {/* Customizer: Sender Name */}
            <div className="p-3 bg-surface-secondary border-b border-border flex items-center justify-between gap-3 text-xs">
              <span className="text-foreground-secondary font-medium">Nama Pengirim (Marketing):</span>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Nama Pengirim"
                className="w-36 px-2.5 py-1 rounded-lg bg-surface border border-border text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-brand text-right"
              />
            </div>

            {/* Chat bubble body */}
            <div className="p-4 bg-[#0c1410] dark:bg-[#0c1410] max-h-[460px] overflow-y-auto space-y-3 font-sans text-xs">
              <div className="bg-[#1f2c34] text-[#e9edef] p-3.5 rounded-2xl rounded-tl-xs shadow-xs border border-white/5 space-y-2 leading-relaxed whitespace-pre-wrap selection:bg-brand selection:text-white">
                {activePitchText}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-surface border-t border-border flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyActivePreview}
                  className="flex-1 py-2 px-3 rounded-xl border border-border hover:bg-surface-secondary text-xs font-bold text-foreground flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedPreview ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-500 font-bold">Pesan Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-foreground-muted" />
                      <span>Salin Naskah Chat</span>
                    </>
                  )}
                </button>

                {selectedLead.cleanPhone ? (
                  <a
                    href={buildWhatsAppLink(selectedLead.cleanPhone, activePitchText)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Kirim WhatsApp</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="flex-1 py-2 px-3 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed opacity-60"
                    title="Nomor telepon tidak tersedia"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Nomor Belum Ada</span>
                  </button>
                )}
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-foreground-muted">
                <span>Rekomendasi: <strong>{selectedLead.recommendedPackage}</strong></span>
                <span className="text-emerald-500 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Data Faktual
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
