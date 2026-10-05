"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Table2,
  Video,
  Briefcase,
  Glasses,
  Target,
  Camera,
  BarChart2,
  ClipboardCheck,
  Wallet,
  Lock,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  isLocked?: boolean;
}

// Every icon is content-relevant to Optik I See You retail marketing operations:
// LayoutGrid -> Weekly marketing dashboard overview
// Table2 -> 5-branch Google Sheets tabulated database
// Video -> Reels & video performance tracker
// Briefcase -> B2B sponsorship outreach & partnership proposals
// Glasses -> Eyewear warranty & aftersales customer care
// Target -> Local optical competitor monitoring
// Camera -> KOL & creator endorsement productions
// BarChart2 -> Instagram Meta Graph analytics
// ClipboardCheck -> Executive director audit reports (locked)
// Wallet -> Branch marketing budget allocation (locked)
const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "Spreadsheet", href: "/spreadsheet", icon: Table2 },
  { label: "Konten", href: "/content", icon: Video },
  { label: "Pengajuan", href: "/pengajuan", icon: Briefcase },
  { label: "Aftersales", href: "/aftersales", icon: Glasses },
  { label: "Kompetitor", href: "/competitors", icon: Target },
  { label: "KOL", href: "/kol", icon: Camera },
  { label: "Analytics", href: "/analytics", icon: BarChart2 },
  { label: "Laporan", href: "/reports", icon: ClipboardCheck, isLocked: true },
  { label: "Keuangan", href: "/finance", icon: Wallet, isLocked: true },
];

export const AppNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 w-full bg-surface/95 border-b border-border transition-colors">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-15 gap-2 lg:gap-4">
          {/* Brand Identity: Optik I See You Enterprise Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/imi-icon.png"
              alt="Optik I See You IMI"
              width={32}
              height={32}
              style={{ width: 32, height: 32, maxWidth: 32, maxHeight: 32 }}
              className="w-8 h-8 min-w-8 min-h-8 max-w-8 max-h-8 rounded-lg object-contain ring-1 ring-border/80 shadow-2xs group-hover:scale-105 transition-transform shrink-0 bg-white"
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
            <div className="hidden 2xl:block border-l border-border pl-2">
              <span className="text-[11px] font-bold tracking-tight text-foreground block leading-tight">
                Marketing Intelligence
              </span>
              <span className="text-[9px] uppercase font-semibold text-brand block">
                4+1 Cabang
              </span>
            </div>
          </Link>

          {/* Clean Desktop Navigation: Relevant Icons with Legible Indonesian Labels */}
          <nav
            aria-label="Navigasi Utama"
            className="hidden md:flex items-center gap-0.5 lg:gap-1 overflow-x-auto py-1"
          >
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === "/dashboard" && pathname === "/") ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                    isActive
                      ? "bg-foreground text-surface font-semibold shadow-xs"
                      : "text-foreground-secondary hover:text-foreground hover:bg-surface-secondary"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0 opacity-85" />
                  <span>{item.label}</span>
                  {item.isLocked && (
                    <Lock
                      aria-label="Terkunci otorisasi direksi"
                      className="w-2.5 h-2.5 text-amber-500 opacity-80 shrink-0 ml-0.5"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Header Controls: Compact Theme Toggle and Sync Status */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme Toggle Button */}
            <ThemeToggle variant="icon" />

            {/* Sync Status Badge (visible on xl+ laptop displays) */}
            <div className="hidden xl:flex items-center gap-1.5 pl-2 border-l border-border text-right">
              <span className="text-[11px] font-semibold text-foreground">
                Week 40 · 2026
              </span>
              <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-medium inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse" />
                Live Sync
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar: Horizontal Scroll with Content-Relevant Icons (< md) */}
        <div className="flex md:hidden border-t border-border/60 py-2 items-center gap-1 overflow-x-auto scroll-smooth">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/dashboard" && pathname === "/") ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-1.5 rounded-lg text-[10px] font-medium transition-colors shrink-0 ${
                  isActive
                    ? "text-brand font-bold bg-brand-light"
                    : "text-foreground-secondary hover:text-foreground hover:bg-surface-secondary"
                }`}
              >
                <div className="relative">
                  <Icon className="w-4 h-4 mb-0.5" />
                  {item.isLocked && (
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-amber-500" />
                  )}
                </div>
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};
