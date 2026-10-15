"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import {
  SponsorLead,
  INITIAL_SPONSOR_LEADS,
  buildSponsorPitchText,
  buildWhatsAppLink,
} from "@/lib/sponsor-leads-data";

const STORAGE_KEY = "imi_sponsor_leads_data_v1";

const STATUS_CONFIG: Record<
  SponsorLead["status"],
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
    icon: Sparkles,
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

const CATEGORY_COLORS: Record<string, string> = {
  "Skincare & Clinic": "bg-pink-500/10 text-pink-500 border-pink-500/30",
  "Fashion & Tailor": "bg-indigo-500/10 text-indigo-500 border-indigo-500/30",
  Entertainment: "bg-cyan-500/10 text-cyan-500 border-cyan-500/30",
  Sports: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
  "Retail & Mall": "bg-amber-500/10 text-amber-500 border-amber-500/30",
  "Wellness & Spa": "bg-teal-500/10 text-teal-500 border-teal-500/30",
};

export const SponsorOutreachView: React.FC = () => {
  const [leads, setLeads] = useState<SponsorLead[]>(INITIAL_SPONSOR_LEADS);
  const [selectedLeadId, setSelectedLeadId] = useState<string>(INITIAL_SPONSOR_LEADS[0].id);
  const [senderName, setSenderName] = useState("Yoshput");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedPreview, setCopiedPreview] = useState(false);

  // Load persisted leads state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge to preserve newly defined leads
          const merged = INITIAL_SPONSOR_LEADS.map((init) => {
            const match = parsed.find((p: SponsorLead) => p.id === init.id);
            return match ? { ...init, ...match } : init;
          });
          setLeads(merged);
          return;
        }
      }
    } catch {
      // ignore
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

  const updateLeadStatus = (id: string, newStatus: SponsorLead["status"]) => {
    const updated = leads.map((l) =>
      l.id === id ? { ...l, status: newStatus, lastFollowUp: new Date().toISOString() } : l
    );
    saveLeads(updated);
  };

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || leads[0];
  const activePitchText = selectedLead ? buildSponsorPitchText(selectedLead, senderName) : "";

  const handleCopyPitch = (lead: SponsorLead) => {
    const text = buildSponsorPitchText(lead, senderName);
    navigator.clipboard.writeText(text);
    setCopiedId(lead.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyActivePreview = () => {
    navigator.clipboard.writeText(activePitchText);
    setCopiedPreview(true);
    setTimeout(() => setCopiedPreview(false), 2500);
  };

  // Filtered Leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      !searchQuery ||
      lead.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery);

    const matchesCategory = categoryFilter === "all" || lead.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // KPI calculations
  const totalLeads = leads.length;
  const contactedLeads = leads.filter((l) => l.status !== "Belum Dihubungi").length;
  const inProgressLeads = leads.filter((l) => l.status === "Menunggu Respon" || l.status === "Negosiasi").length;
  const dealLeads = leads.filter((l) => l.status === "Deal Disetujui").length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-surface to-surface-secondary border border-border shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand/10 text-brand border border-brand/20">
                Outreach CRM & Sponsorship Event
              </span>
              <span className="text-xs text-foreground-muted font-medium">Buka Kelas Konten 2026</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Daftar Sponsor Prospektif & Template WhatsApp
            </h2>
            <p className="text-xs sm:text-sm text-foreground-secondary max-w-2xl">
              11 target brand lokal dan regional Purwokerto untuk pengajuan kerja sama sponsorship kelas konten kreator
              Optik I See You. Klik kirim via WhatsApp atau salin draf untuk follow-up cepat.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/proposal-sponsor"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-control bg-surface border border-border text-xs font-semibold text-foreground hover:bg-surface-secondary transition-colors shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-brand" />
              Lihat Proposal Resmi
              <ArrowUpRight className="w-3 h-3 text-foreground-muted" />
            </Link>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-border">
          <div className="p-3 rounded-xl bg-surface border border-border/80">
            <span className="text-[11px] text-foreground-muted font-medium block">Total Target Sponsor</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-foreground">{totalLeads}</span>
              <span className="text-xs text-foreground-muted">Brand</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface border border-border/80">
            <span className="text-[11px] text-foreground-muted font-medium block">Sudah Dihubungi</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-blue-500">{contactedLeads}</span>
              <span className="text-xs text-foreground-muted">/ {totalLeads}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface border border-border/80">
            <span className="text-[11px] text-foreground-muted font-medium block">Dalam Penjajakan / Nego</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-amber-500">{inProgressLeads}</span>
              <span className="text-xs text-foreground-muted">Brand</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface border border-border/80">
            <span className="text-[11px] text-foreground-muted font-medium block">Deal Kerja Sama</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-emerald-500">{dealLeads}</span>
              <span className="text-xs text-foreground-muted">Closing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left List (11 Brands) | Right Live Chat Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Brand List & Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Filters */}
          <div className="p-4 rounded-xl bg-surface border border-border space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
                <input
                  type="text"
                  placeholder="Cari nama brand, PIC, atau no HP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-control bg-surface-secondary border border-border text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-control bg-surface-secondary border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="Skincare & Clinic">Skincare & Clinic</option>
                  <option value="Fashion & Tailor">Fashion & Tailor</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Sports">Sports</option>
                  <option value="Retail & Mall">Retail & Mall</option>
                  <option value="Wellness & Spa">Wellness & Spa</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-control bg-surface-secondary border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
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
          </div>

          {/* List of Sponsor Leads */}
          <div className="space-y-2.5">
            {filteredLeads.map((lead, idx) => {
              const isSelected = lead.id === selectedLeadId;
              const StatusIcon = STATUS_CONFIG[lead.status]?.icon || Clock;
              const directWaLink = buildWhatsAppLink(
                lead.cleanPhone,
                buildSponsorPitchText(lead, senderName)
              );

              return (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLeadId(lead.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-brand/5 border-brand ring-1 ring-brand/30 shadow-xs"
                      : "bg-surface border-border hover:border-brand/40 hover:bg-surface-secondary/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-foreground-muted font-mono">
                          #{String(idx + 1).padStart(2, "0")}
                        </span>
                        <h4 className="font-bold text-sm text-foreground">{lead.brandName}</h4>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            CATEGORY_COLORS[lead.category] || "bg-surface-secondary text-foreground-secondary border-border"
                          }`}
                        >
                          {lead.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-foreground-secondary flex-wrap pt-0.5">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-foreground-muted" />
                          {lead.contactPerson}
                        </span>
                        <span className="flex items-center gap-1 font-mono text-[11px] text-foreground">
                          <Phone className="w-3 h-3 text-brand" />
                          {lead.phone}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge & Dropdown */}
                    <div className="shrink-0">
                      <select
                        value={lead.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          updateLeadStatus(lead.id, e.target.value as SponsorLead["status"])
                        }
                        className={`text-[11px] font-semibold px-2 py-1 rounded-full border cursor-pointer focus:outline-none ${
                          STATUS_CONFIG[lead.status]?.badge
                        }`}
                      >
                        <option value="Belum Dihubungi">⏳ Belum Dihubungi</option>
                        <option value="Chat Terkirim">📤 Chat Terkirim</option>
                        <option value="Menunggu Respon">💬 Menunggu Respon</option>
                        <option value="Negosiasi">🤝 Negosiasi</option>
                        <option value="Deal Disetujui">✅ Deal Disetujui</option>
                        <option value="Ditolak">❌ Ditolak</option>
                      </select>
                    </div>
                  </div>

                  <p className="text-[11px] text-foreground-secondary mt-2 line-clamp-2 leading-relaxed bg-surface-secondary/60 p-2 rounded-lg border border-border/50">
                    <span className="font-semibold text-foreground">Angle Kolaborasi:</span> {lead.notes}
                  </p>

                  <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-border/60">
                    <span className="text-[11px] text-foreground-muted flex items-center gap-1 font-medium">
                      <Tag className="w-3 h-3 text-brand" /> Rekomendasi:{" "}
                      <strong className="text-foreground font-semibold">{lead.recommendedPackage}</strong>
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleCopyPitch(lead)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-control bg-surface border border-border text-[11px] font-semibold text-foreground hover:bg-surface-secondary transition-colors"
                        title="Salin chat WhatsApp"
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

                      <a
                        href={directWaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-control bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors shadow-2xs"
                      >
                        <MessageSquare className="w-3 h-3" />
                        Chat WA
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredLeads.length === 0 && (
              <div className="p-8 text-center bg-surface rounded-xl border border-border text-foreground-muted text-xs">
                Tidak ada sponsor yang sesuai dengan kriteria pencarian.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Chat WhatsApp Pitch Preview (5 Cols) */}
        <div className="lg:col-span-5 sticky top-20 space-y-4">
          <div className="rounded-2xl border border-border bg-surface shadow-md overflow-hidden">
            {/* Header chat mockup */}
            <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                  {selectedLead.brandName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm leading-tight">{selectedLead.brandName}</h4>
                  <p className="text-[10px] text-emerald-100 flex items-center gap-1">
                    <User className="w-3 h-3" /> {selectedLead.contactPerson} ({selectedLead.phone})
                  </p>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white">
                WA Pitch Preview
              </span>
            </div>

            {/* Customizer: Sender Name */}
            <div className="p-3 bg-surface-secondary border-b border-border flex items-center justify-between gap-3 text-xs">
              <span className="text-foreground-secondary font-medium">Nama Pengirim (Anda):</span>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Nama Pengirim"
                className="w-36 px-2 py-1 rounded bg-surface border border-border text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-brand text-right"
              />
            </div>

            {/* Chat bubble body */}
            <div className="p-4 bg-[#0c1410] dark:bg-[#0c1410] max-h-[500px] overflow-y-auto space-y-3 font-sans text-xs">
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
                  className="flex-1 py-2 px-3 rounded-control border border-border hover:bg-surface-secondary text-xs font-semibold text-foreground flex items-center justify-center gap-1.5 transition-colors"
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

                <a
                  href={buildWhatsAppLink(selectedLead.cleanPhone, activePitchText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-control bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Kirim WhatsApp</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-foreground-muted">
                <span>Target: <strong>{selectedLead.recommendedPackage}</strong></span>
                <span className="text-emerald-500 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Link Proposal Terintegrasi
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
