"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Search,
  X,
  SlidersHorizontal,
  Handshake,
  Camera,
  Layers,
  Sparkles,
  ShieldCheck,
  Send,
  HelpCircle,
  FileText,
  UserCheck,
} from "lucide-react";
import {
  COMMUNICATION_TEMPLATES,
  TemplateCategory,
  SubCategory,
  MODEL_PRIMARY_PIC,
} from "@/lib/communication-templates-data";
import { CentralizedPicCard } from "./CentralizedPicCard";
import { TemplateCard } from "./TemplateCard";

export const CommunicationCenterView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | TemplateCategory>("all");
  const [activeSubCategory, setActiveSubCategory] = useState<"all" | SubCategory>("all");

  // Filter templates based on category, subcategory, and search query
  const filteredTemplates = useMemo(() => {
    return COMMUNICATION_TEMPLATES.filter((tpl) => {
      // Category filter
      if (activeCategory !== "all" && tpl.category !== activeCategory) {
        return false;
      }

      // Subcategory filter (if within sponsorship & partnership)
      if (
        activeCategory === "sponsorship" &&
        activeSubCategory !== "all" &&
        tpl.subcategory !== activeSubCategory
      ) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inTitle = tpl.title.toLowerCase().includes(query);
        const inNumber = tpl.templateNumber.toLowerCase().includes(query);
        const inDesc = tpl.description.toLowerCase().includes(query);
        const inContent = tpl.content.toLowerCase().includes(query);
        const inBadge = tpl.badge.toLowerCase().includes(query);
        const inTags = tpl.tags.some((t) => t.toLowerCase().includes(query));

        return inTitle || inNumber || inDesc || inContent || inBadge || inTags;
      }

      return true;
    });
  }, [activeCategory, activeSubCategory, searchQuery]);

  // Counts for tabs
  const countAll = COMMUNICATION_TEMPLATES.length;
  const countSponsorship = COMMUNICATION_TEMPLATES.filter((t) => t.category === "sponsorship").length;
  const countModel = COMMUNICATION_TEMPLATES.filter((t) => t.category === "model").length;

  const countSubSponsorship = COMMUNICATION_TEMPLATES.filter((t) => t.subcategory === "sponsorship").length;
  const countSubPartnership = COMMUNICATION_TEMPLATES.filter((t) => t.subcategory === "partnership").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* ========================================================================= */}
      {/* 1. PAGE HEADER                                                            */}
      {/* ========================================================================= */}
      <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-subtle">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800">
                Marketing Intelligence · Komunikasi &amp; Operasional
              </span>
              <span className="text-[11px] font-medium text-foreground-muted">
                PIC Sentral Model: <strong>{MODEL_PRIMARY_PIC.name} ({MODEL_PRIMARY_PIC.phoneDisplay})</strong>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-serif font-black text-foreground mt-1.5 tracking-tight">
              Marketing Communication Center
            </h1>
            <p className="text-xs sm:text-sm text-foreground-secondary mt-1 max-w-3xl leading-relaxed">
              Pusat template komunikasi dan koordinasi Marketing Optik I See You. Dirancang untuk mempercepat respon operasional
              sponsorship kegiatan, follow-up kemitraan, dan pendekatan talent model katalog melalui WhatsApp secara terstandar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              href="/pengajuan"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface border border-border hover:bg-surface-secondary text-foreground font-bold text-xs shadow-2xs transition-all active:scale-95"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Portal Pengajuan B2B</span>
            </Link>
            <a
              href={MODEL_PRIMARY_PIC.waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#124734] hover:bg-[#185c43] text-white font-bold text-xs shadow-xs transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp PIC Utama</span>
            </a>
          </div>
        </div>

        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-border">
          <div className="p-3 rounded-xl bg-surface-secondary/60 border border-border/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">
              Total Template
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-black text-foreground">{countAll}</span>
              <span className="text-[11px] text-foreground-secondary">Pesan Baku</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-secondary/60 border border-border/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">
              Sponsor &amp; Mitra
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-black text-emerald-700 dark:text-emerald-400">{countSponsorship}</span>
              <span className="text-[11px] text-foreground-secondary">Template (10 Alur)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-secondary/60 border border-border/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">
              Talent &amp; Model
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-black text-purple-700 dark:text-purple-400">{countModel}</span>
              <span className="text-[11px] text-foreground-secondary">Template (5 Pendekatan)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-secondary/60 border border-border/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">
              Satu Pintu PIC
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xs font-black text-foreground truncate">{MODEL_PRIMARY_PIC.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CATEGORY TABS & SEARCH BAR                                             */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Main Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-surface border border-border overflow-x-auto no-scrollbar shadow-2xs">
            {/* Tab: Semua */}
            <button
              type="button"
              onClick={() => {
                setActiveCategory("all");
                setActiveSubCategory("all");
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === "all"
                  ? "bg-[#124734] text-white shadow-xs"
                  : "text-foreground-secondary hover:text-foreground hover:bg-surface-secondary"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Semua Template</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  activeCategory === "all"
                    ? "bg-white/20 text-white"
                    : "bg-surface-secondary text-foreground-muted"
                }`}
              >
                {countAll}
              </span>
            </button>

            {/* Tab: Sponsorship & Partnership */}
            <button
              type="button"
              onClick={() => {
                setActiveCategory("sponsorship");
                setActiveSubCategory("all");
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === "sponsorship"
                  ? "bg-[#124734] text-white shadow-xs"
                  : "text-foreground-secondary hover:text-foreground hover:bg-surface-secondary"
              }`}
            >
              <Handshake className="w-3.5 h-3.5" />
              <span>Sponsorship &amp; Partnership</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  activeCategory === "sponsorship"
                    ? "bg-white/20 text-white"
                    : "bg-surface-secondary text-foreground-muted"
                }`}
              >
                {countSponsorship}
              </span>
            </button>

            {/* Tab: Model Recruitment */}
            <button
              type="button"
              onClick={() => {
                setActiveCategory("model");
                setActiveSubCategory("all");
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === "model"
                  ? "bg-[#124734] text-white shadow-xs"
                  : "text-foreground-secondary hover:text-foreground hover:bg-surface-secondary"
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Model Recruitment</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  activeCategory === "model"
                    ? "bg-white/20 text-white"
                    : "bg-surface-secondary text-foreground-muted"
                }`}
              >
                {countModel}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px] sm:min-w-[320px]">
            <Search className="w-4 h-4 text-foreground-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari template, kata kunci, nomor..."
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-surface border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Subcategory Pills for Sponsorship & Partnership */}
        {activeCategory === "sponsorship" && (
          <div className="flex items-center gap-2 pt-1 animate-in fade-in duration-150">
            <span className="text-[11px] font-semibold text-foreground-muted">Sub-kategori:</span>
            <button
              type="button"
              onClick={() => setActiveSubCategory("all")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                activeSubCategory === "all"
                  ? "bg-emerald-800 text-white"
                  : "bg-surface border border-border text-foreground-secondary hover:text-foreground"
              }`}
            >
              Semua ({countSponsorship})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubCategory("sponsorship")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                activeSubCategory === "sponsorship"
                  ? "bg-emerald-800 text-white"
                  : "bg-surface border border-border text-foreground-secondary hover:text-foreground"
              }`}
            >
              Sponsorship ({countSubSponsorship})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubCategory("partnership")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                activeSubCategory === "partnership"
                  ? "bg-emerald-800 text-white"
                  : "bg-surface border border-border text-foreground-secondary hover:text-foreground"
              }`}
            >
              Partnership ({countSubPartnership})
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. CENTRALIZED PIC SECTION (PROMINENT ON MODEL TAB & RECRUITMENT)         */}
      {/* ========================================================================= */}
      {(activeCategory === "model" || (activeCategory === "all" && !searchQuery)) && (
        <div className="animate-in fade-in duration-200">
          <CentralizedPicCard />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TEMPLATES GRID                                                         */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground-secondary">
              Daftar Template Tersedia
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-surface-secondary border border-border text-foreground-muted">
              {filteredTemplates.length} Template
            </span>
          </div>

          <div className="text-[11px] text-foreground-muted hidden sm:block">
            Klik <strong>Salin Pesan</strong> untuk meng-copy ke WhatsApp clipboard
          </div>
        </div>

        {filteredTemplates.length === 0 ? (
          /* Empty Search State */
          <div className="p-12 text-center rounded-2xl bg-surface border border-border shadow-subtle space-y-3">
            <Search className="w-8 h-8 text-foreground-muted mx-auto" />
            <h3 className="text-sm font-bold text-foreground">
              Tidak Ada Template yang Cocok
            </h3>
            <p className="text-xs text-foreground-secondary max-w-sm mx-auto">
              Tidak ditemukan template yang memuat kata kunci <strong>&quot;{searchQuery}&quot;</strong> pada kategori yang dipilih.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
                setActiveSubCategory("all");
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface-secondary hover:bg-surface border border-border text-xs font-bold text-foreground cursor-pointer"
            >
              <span>Reset Pencarian</span>
            </button>
          </div>
        ) : (
          /* 2-Column Responsive Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. FOOTER OPERATIONAL GUIDELINE NOTE                                      */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-xl bg-surface border border-border text-xs text-foreground-secondary flex items-start gap-3">
        <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-foreground">
            Pedoman Standar Bahasa Komunikasi Marketing Optik I See You:
          </p>
          <p className="leading-relaxed">
            Gunakan gaya bahasa Indonesia yang natural, ramah, dan profesional. Selalu awali dengan sapaan sopan dan akhiri dengan ucapan terima kasih.
            Untuk calon model katalog, pastikan tidak memberikan konfirmasi jadwal atau kompensasi secara mandiri melainkan mengarahkan ke kontak resmi PIC Yossika Putra Erlangga.
          </p>
        </div>
      </div>
    </div>
  );
};
