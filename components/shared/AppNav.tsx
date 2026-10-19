"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  LayoutGrid,
  Table2,
  TrendingUp,
  Video,
  Briefcase,
  Glasses,
  Target,
  Camera,
  MapPin,
  BarChart2,
  FileText,
  ClipboardCheck,
  Wallet,
  Lock,
  Search,
  Menu,
  X,
  ChevronDown,
  Building2,
  Layers,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { ACTIVE_MEETING_CYCLE } from "@/lib/cadence-config";

import { useBranch } from "@/context/BranchContext";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  isLocked?: boolean;
  badge?: string;
}

interface NavCategory {
  title: string;
  items: NavItem[];
}

const NAV_CATEGORIES: NavCategory[] = [
  {
    title: "Eksekutif & Rekap",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
      { label: "Spreadsheet", href: "/spreadsheet", icon: Table2 },
      { label: "Analytics", href: "/analytics", icon: BarChart2 },
      { label: "Finance 🔒", href: "/finance", icon: Wallet, isLocked: true },
      { label: "Report Eksekutif 🔒", href: "/reports", icon: ClipboardCheck, isLocked: true },
    ],
  },
  {
    title: "Sosial & Konten",
    items: [
      { label: "Social Blade", href: "/social-blade", icon: TrendingUp },
      { label: "Konten", href: "/content", icon: Video },
    ],
  },
  {
    title: "Riset & Pertumbuhan",
    items: [
      { label: "Kompetitor", href: "/competitors", icon: Target },
      { label: "KOL", href: "/kol", icon: Camera },
      { label: "Venue", href: "/venue", icon: MapPin },
    ],
  },
  {
    title: "Kemitraan & Pelanggan",
    items: [
      { label: "Pengajuan", href: "/pengajuan", icon: Briefcase },
      { label: "Aftersales", href: "/aftersales", icon: Glasses },
    ],
  },
];

export const AppNav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedBranchId, setSelectedBranchId, branches } = useBranch();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const navRef = React.useRef<HTMLElement | null>(null);

  const openCommandPalette = () => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  const isCurrentActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/";
    }
    if (href === "/reports") {
      return pathname === "/reports" || pathname === "/report";
    }
    return pathname.startsWith(href);
  };

  // Close drawer and dropdown on path change
  useEffect(() => {
    setIsDrawerOpen(false);
    setOpenCategory(null);
  }, [pathname]);

  // Click outside to dismiss dropdown and Escape key listener
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenCategory(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenCategory(null);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const handleCategoryMouseEnter = (title: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenCategory(title);
  };

  const handleCategoryMouseLeave = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setOpenCategory(null);
    }, 240); // 240ms safe hover buffer to prevent accidental dismiss
  };

  const handleDropdownMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleDropdownMouseLeave = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setOpenCategory(null);
    }, 240);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. STICKY DESKTOP & TABLET TOP HEADER                                      */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-30 w-full bg-[#F8F5ED]/95 dark:bg-[#0D1612]/95 backdrop-blur-md border-b border-[#124734]/15 dark:border-[#124734]/30 transition-colors">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Brand Logo & Tagline */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/imi-icon.png"
                  alt="Optik I See You"
                  className="w-8 h-8 rounded-lg object-contain ring-1 ring-[#124734]/15 shadow-2xs group-hover:scale-105 transition-transform bg-white"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/logo-isy-dark.png"
                  alt="Optik I See You"
                  className="h-6 w-auto object-contain transition-opacity group-hover:opacity-90 dark:hidden"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/logo-isy-white.png"
                  alt="Optik I See You"
                  className="h-6 w-auto object-contain transition-opacity group-hover:opacity-90 hidden dark:block"
                />
                <div className="hidden xl:block border-l border-[#124734]/20 dark:border-white/20 pl-2">
                  <span className="text-[11px] font-bold tracking-tight text-[#183C30] dark:text-emerald-200 block leading-tight">
                    Marketing Intelligence
                  </span>
                  <span className="text-[9px] uppercase font-semibold text-[#124734] dark:text-emerald-400 block">
                    B2B Command Center
                  </span>
                </div>
              </Link>

              {/* Global Branch Selector Pill (Desktop / Tablet) */}
              <div className="hidden sm:flex items-center gap-1.5 ml-2 bg-[#F3EFE6] dark:bg-[#14221C] px-2.5 py-1 rounded-full border border-[#124734]/15">
                <Building2 className="w-3.5 h-3.5 text-[#124734] dark:text-emerald-400" />
                <select
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  className="bg-transparent text-xs font-bold text-[#183C30] dark:text-emerald-200 focus:outline-none cursor-pointer pr-1"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id} className="text-black bg-white">
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Desktop Navigation: Grouped Categories (lg: and above) */}
            <nav
              ref={navRef}
              aria-label="Navigasi Utama 4 Kategori"
              className="hidden lg:flex items-center gap-1 xl:gap-2"
            >
              {NAV_CATEGORIES.map((cat) => {
                const hasActiveChild = cat.items.some((item) => isCurrentActive(item.href));
                const isOpen = openCategory === cat.title;

                return (
                  <div
                    key={cat.title}
                    className="relative"
                    onMouseEnter={() => handleCategoryMouseEnter(cat.title)}
                    onMouseLeave={handleCategoryMouseLeave}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenCategory((prev) => (prev === cat.title ? null : cat.title))}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer select-none ${
                        hasActiveChild
                          ? "bg-[#124734] text-white shadow-xs"
                          : isOpen
                          ? "bg-[#EAE5DA] dark:bg-[#1C2C24] text-[#124734] dark:text-emerald-300 ring-1 ring-[#124734]/20"
                          : "text-[#2D3A34] dark:text-emerald-100/80 hover:bg-[#F3EFE6] dark:hover:bg-[#14221C]"
                      }`}
                    >
                      <span>{cat.title}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-current" : "opacity-70"
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu on Hover / Click with Zero-Gap Bridge */}
                    <div
                      onMouseEnter={handleDropdownMouseEnter}
                      onMouseLeave={handleDropdownMouseLeave}
                      className={`absolute top-full left-0 pt-2 w-56 z-50 transition-all duration-200 ease-out origin-top ${
                        isOpen
                          ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                      }`}
                    >
                      {/* Invisible hover bridge to eliminate any gap disconnection */}
                      <div className="absolute -top-3 left-0 right-0 h-4 pointer-events-auto" />

                      <div className="bg-white/95 dark:bg-[#14221C]/95 backdrop-blur-2xl rounded-2xl shadow-[0_12px_36px_-4px_rgba(0,0,0,0.14),0_2px_8px_rgba(0,0,0,0.06)] border border-[#124734]/15 dark:border-white/10 p-1.5 space-y-0.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#5C6B64] dark:text-emerald-400/80 px-2.5 py-1 mb-1 border-b border-[#124734]/10 dark:border-white/10 flex items-center justify-between">
                          <span>{cat.title}</span>
                          <span className="text-[9px] text-[#5C6B64]/70 dark:text-emerald-400/50 lowercase">
                            {cat.items.length} menu
                          </span>
                        </div>
                        {cat.items.map((item) => {
                          const Icon = item.icon;
                          const active = isCurrentActive(item.href);
                          return (
                            <Link
                              key={item.href}
                              href={`${item.href}${selectedBranchId !== "all" ? `?branch=${selectedBranchId}` : ""}`}
                              onClick={() => setOpenCategory(null)}
                              className={`group/item flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                                active
                                  ? "bg-[#124734] text-white shadow-xs"
                                  : "text-[#2D3A34] dark:text-emerald-100 hover:bg-[#F3EFE6] dark:hover:bg-[#1B2D26] hover:text-[#124734] dark:hover:text-emerald-200"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                                    active
                                      ? "bg-white/20 text-white"
                                      : "bg-[#124734]/5 dark:bg-white/5 text-[#124734] dark:text-emerald-400 group-hover/item:bg-[#124734]/15 dark:group-hover/item:bg-white/10"
                                  }`}
                                >
                                  <Icon className="w-3.5 h-3.5 shrink-0" />
                                </div>
                                <span>{item.label}</span>
                              </div>
                              {item.isLocked && (
                                <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold border border-amber-500/20">
                                  <Lock className="w-2.5 h-2.5" />
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Dedicated Finance & Report Quick Pill (🔒) */}
              <Link
                href={`/finance${selectedBranchId !== "all" ? `?branch=${selectedBranchId}` : ""}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  pathname === "/finance" || pathname === "/reports" || pathname === "/report"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-amber-800 dark:text-amber-300 bg-amber-500/15 dark:bg-amber-950/40 border border-amber-500/25 hover:bg-amber-500/25"
                }`}
                title="Buka Halaman Keuangan & Laporan Eksekutif (Memerlukan Password)"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Finance &amp; Report 🔒</span>
              </Link>

              {/* Proposal Sponsor Direct Link */}
              <Link
                href="/proposal-sponsor"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  pathname === "/proposal-sponsor"
                    ? "bg-[#124734] text-white shadow-xs"
                    : "text-[#124734] dark:text-emerald-300 bg-[#124734]/8 dark:bg-emerald-950/40 hover:bg-[#124734]/15"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Proposal B2B</span>
              </Link>
            </nav>

            {/* Header Controls: Search Palette, Theme Toggle, Live Status & Mobile Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Command Palette Button (⌘K) */}
              <button
                type="button"
                onClick={openCommandPalette}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F3EFE6] dark:bg-[#14221C] text-[#2D3A34] dark:text-emerald-100 hover:bg-[#E5E0D5] text-xs font-medium border border-[#124734]/15 transition-all cursor-pointer"
                title="Buka Command Palette (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-[#124734] dark:text-emerald-400" />
                <span className="hidden sm:inline">Cari</span>
                <kbd className="hidden md:inline-block text-[10px] font-bold bg-white dark:bg-[#1B2D26] px-1.5 py-0.5 rounded border border-[#124734]/10 text-[#5C6B64]">
                  ⌘K
                </kbd>
              </button>

              {/* Theme Toggle Button */}
              <ThemeToggle variant="icon" />

              {/* Period & Live Sync Status (Desktop) */}
              <div className="hidden 2xl:flex items-center gap-1.5 pl-2 border-l border-[#124734]/15 text-right">
                <span className="text-[11px] font-semibold text-[#183C30] dark:text-emerald-100">
                  {ACTIVE_MEETING_CYCLE.shortLabel}
                </span>
                <span className="text-[10px] text-[#16A34A] font-semibold inline-flex items-center gap-1 bg-[#16A34A]/10 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                  Live Sync
                </span>
              </div>

              {/* Mobile Drawer Hamburger Button (< lg) */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                className="lg:hidden p-2 rounded-xl bg-[#F3EFE6] dark:bg-[#14221C] text-[#183C30] dark:text-emerald-100 hover:bg-[#E5E0D5] transition-colors cursor-pointer"
                aria-label="Buka Menu Navigasi"
              >
                {isDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MOBILE SLIDE-OVER DRAWER NAVIGATION (< lg)                             */}
      {/* ========================================================================= */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-black/50 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div
            className="fixed inset-y-0 right-0 w-full max-w-xs sm:max-w-sm bg-[#F8F5ED] dark:bg-[#0D1612] text-[#183C30] dark:text-emerald-100 shadow-2xl p-5 overflow-y-auto flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Drawer Top */}
              <div className="flex items-center justify-between pb-4 border-b border-[#124734]/15">
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/brand/imi-icon.png" alt="Optik I See You" className="w-7 h-7 rounded-lg" />
                  <div>
                    <span className="text-xs font-bold block leading-tight">I See You Intelligence</span>
                    <span className="text-[10px] text-[#5C6B64] block">Navigasi Terpadu</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-[#F3EFE6] text-[#5C6B64]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Branch Selector in Mobile Drawer */}
              <div className="my-4 p-3 bg-white dark:bg-[#14221C] rounded-2xl border border-[#124734]/15">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#5C6B64] block mb-1.5">
                  Fokus Cabang Aktif:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {branches.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setSelectedBranchId(b.id);
                        setIsDrawerOpen(false);
                      }}
                      className={`p-2 rounded-xl text-xs font-semibold text-left transition-colors ${
                        selectedBranchId === b.id
                          ? "bg-[#124734] text-white"
                          : "bg-[#F8F5ED] dark:bg-[#1B2D26] text-[#2D3A34] dark:text-emerald-100 hover:bg-[#F3EFE6]"
                      }`}
                    >
                      <span className="block truncate">{b.code}</span>
                      <span className="text-[10px] opacity-75 block truncate">{b.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Grouped Category Navigation Links */}
              <div className="space-y-4">
                {NAV_CATEGORIES.map((cat) => (
                  <div key={cat.title}>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C6B64] block mb-1.5 px-2">
                      {cat.title}
                    </span>
                    <div className="space-y-1">
                      {cat.items.map((item) => {
                        const Icon = item.icon;
                        const active = isCurrentActive(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={`${item.href}${selectedBranchId !== "all" ? `?branch=${selectedBranchId}` : ""}`}
                            onClick={() => setIsDrawerOpen(false)}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                              active
                                ? "bg-[#124734] text-white shadow-xs"
                                : "text-[#2D3A34] dark:text-emerald-100 hover:bg-white dark:hover:bg-[#14221C]"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="w-4 h-4 opacity-80" />
                              <span>{item.label}</span>
                            </div>
                            {item.isLocked && (
                              <Lock className="w-3.5 h-3.5 text-amber-500" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Additional Links in Drawer */}
                <div className="pt-2 border-t border-[#124734]/15 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C6B64] block mb-1.5 px-2">
                    Dokumen & Eksternal
                  </span>
                  <Link
                    href={`/finance${selectedBranchId !== "all" ? `?branch=${selectedBranchId}` : ""}`}
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-amber-900 dark:text-amber-300 bg-amber-500/15 dark:bg-amber-950/40 border border-amber-500/20"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Finance &amp; Report Eksekutif 🔒</span>
                  </Link>
                  <Link
                    href="/proposal-sponsor"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-[#124734] dark:text-emerald-300 bg-[#124734]/10 dark:bg-emerald-950/50"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Proposal Sponsor B2B (A4)</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Drawer Bottom Status */}
            <div className="pt-4 border-t border-[#124734]/15 text-[11px] text-[#5C6B64] flex items-center justify-between">
              <span>{ACTIVE_MEETING_CYCLE.shortLabel} · Optik I See You</span>
              <button
                type="button"
                onClick={() => {
                  setIsDrawerOpen(false);
                  openCommandPalette();
                }}
                className="font-bold text-[#124734] dark:text-emerald-300 underline"
              >
                Buka Command Palette
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MOBILE BOTTOM QUICK-BAR (< md)                                         */}
      {/* ========================================================================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F8F5ED]/95 dark:bg-[#0D1612]/95 backdrop-blur-lg border-t border-[#124734]/15 dark:border-[#124734]/30 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-5 gap-1 text-center">
          {[
            { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
            { label: "Sheets", href: "/spreadsheet", icon: Table2 },
            { label: "Social", href: "/social-blade", icon: TrendingUp },
            { label: "Konten", href: "/content", icon: Video },
          ].map((item) => {
            const Icon = item.icon;
            const active = isCurrentActive(item.href);
            return (
              <Link
                key={item.href}
                href={`${item.href}${selectedBranchId !== "all" ? `?branch=${selectedBranchId}` : ""}`}
                className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-semibold transition-colors ${
                  active
                    ? "text-[#124734] dark:text-emerald-300 bg-[#124734]/12 dark:bg-emerald-950/60 font-bold"
                    : "text-[#5C6B64] dark:text-emerald-100/70 hover:text-[#183C30]"
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}

          {/* 5th button: Lainnya (Drawer Toggle) */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-semibold text-[#5C6B64] dark:text-emerald-100/70 hover:text-[#183C30]"
          >
            <Layers className="w-4 h-4 mb-0.5 text-[#124734] dark:text-emerald-400" />
            <span>Lainnya</span>
          </button>
        </div>
      </div>
    </>
  );
};
