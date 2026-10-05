"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  BarChart3,
  FileText,
  FileSpreadsheet,
  Compass,
  HeartHandshake,
  Handshake,
  Coins,
  Users,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

interface NavItem {
  name: string;
  shortName: string;
  href: string;
  icon: React.ElementType;
  isLocked?: boolean;
}

const navItems: NavItem[] = [
  { name: "Dashboard Utama", shortName: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Aftersales CRM", shortName: "CRM", href: "/aftersales", icon: HeartHandshake },
  { name: "Pengajuan & Layanan", shortName: "Pengajuan", href: "/pengajuan", icon: Handshake },
  { name: "Spreadsheet Rekap", shortName: "Sheet", href: "/spreadsheet", icon: FileSpreadsheet },
  { name: "Competitor Radar", shortName: "Kompetitor", href: "/competitors", icon: Compass },
  { name: "KOL & Endorsement", shortName: "KOL", href: "/kol", icon: Users },
  { name: "Content Intelligence", shortName: "Content", href: "/content", icon: Film },
  { name: "Analytics Meta", shortName: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Reports Direksi", shortName: "Reports", href: "/reports", icon: FileText, isLocked: true },
  { name: "Finance & Budget", shortName: "Finance", href: "/finance", icon: Coins, isLocked: true },
];

export const AppNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 w-full bg-surface/90 backdrop-blur-md border-b border-border transition-colors">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Brand Identity: Logo & Application Emblem */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/imi-icon.png"
              alt="IMI System Logo"
              width={34}
              height={34}
              style={{ width: 34, height: 34, maxWidth: 34, maxHeight: 34 }}
              className="w-8.5 h-8.5 min-w-8.5 min-h-8.5 max-w-8.5 max-h-8.5 rounded-xl object-contain ring-1 ring-border/80 shadow-2xs group-hover:scale-105 transition-transform shrink-0 bg-white"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-isy-dark.png"
              alt="Optik I See You"
              className="h-6 sm:h-7 w-auto object-contain transition-opacity group-hover:opacity-90 dark:hidden"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-isy-white.png"
              alt="Optik I See You"
              className="h-6 sm:h-7 w-auto object-contain transition-opacity group-hover:opacity-90 hidden dark:block"
            />
            <div className="hidden lg:block border-l border-border pl-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold tracking-tight text-foreground">
                  Marketing Intelligence
                </span>
                <span className="text-[9px] uppercase font-semibold px-1.5 py-0.5 rounded bg-brand-light text-brand">
                  4+1 Cabang
                </span>
              </div>
              <span className="text-[10px] text-foreground-muted block">
                Optik I See You + Lunar
              </span>
            </div>
          </Link>

          {/* Desktop & Laptop Icon Dock Navigation (Clean, Compact, No Overflow) */}
          <nav
            aria-label="Navigasi Utama"
            className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-surface-secondary/70 dark:bg-surface-secondary/50 border border-border/70 shadow-2xs backdrop-blur-xs"
          >
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === "/dashboard" && pathname === "/") ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <div key={item.href} className="relative group">
                  <Link
                    href={item.href}
                    aria-label={item.name}
                    className={`relative flex items-center justify-center w-8.5 h-8.5 lg:w-9 lg:h-9 rounded-xl transition-all duration-150 active:scale-95 ${
                      isActive
                        ? "bg-foreground text-surface font-semibold shadow-subtle ring-1 ring-border"
                        : "text-foreground-secondary hover:text-foreground hover:bg-surface"
                    }`}
                  >
                    <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />

                    {/* Active dot indicator */}
                    {isActive && (
                      <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-brand" />
                    )}

                    {/* Locked badge */}
                    {item.isLocked && (
                      <span
                        title="Terkunci khusus otorisasi Direksi"
                        className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-surface shadow-2xs"
                      />
                    )}
                  </Link>

                  {/* Rich Floating Tooltip on Hover */}
                  <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1 text-[11px] font-medium text-surface shadow-lg opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150 z-50 flex items-center gap-1.5">
                    <span>{item.name}</span>
                    {item.isLocked && (
                      <span className="text-[9px] text-amber-300 font-semibold">(Terkunci)</span>
                    )}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-foreground" />
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Right Header Area: Compact Theme Toggle & Status Info */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Theme Toggle - Clean Compact Icon Button */}
            <ThemeToggle variant="icon" />

            {/* Status Live Sync & Week Info (visible on xl+ laptop/desktop screens) */}
            <div className="hidden xl:flex items-center gap-2 pl-2 border-l border-border">
              <div className="text-right">
                <span className="text-[11px] font-bold text-foreground block leading-tight">
                  Week 40 · 2026
                </span>
                <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-medium flex items-center justify-end gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse" />
                  Live Sync
                </span>
              </div>
            </div>

            {/* Secondary Brand Tagline (visible on large 2xl screens) */}
            <div className="hidden 2xl:flex items-center pl-2 border-l border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/logo-for-every-you.png"
                alt="for every you"
                className="h-5 w-auto object-contain opacity-85 hover:opacity-100 transition-opacity dark:hidden"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/logo-for-every-you-white.png"
                alt="for every you"
                className="h-5 w-auto object-contain opacity-85 hover:opacity-100 transition-opacity hidden dark:block"
              />
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar (iOS Tab Bar Style for < md) */}
        <div className="flex md:hidden border-t border-border/60 py-2 items-center gap-1 overflow-x-auto px-2 scroll-smooth">
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
                className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-1.5 rounded-control text-[10px] font-medium transition-all shrink-0 active:scale-95 ${
                  isActive
                    ? "text-brand font-bold bg-brand-light"
                    : "text-foreground-secondary hover:text-foreground hover:bg-surface-secondary"
                }`}
              >
                <div className="relative">
                  <Icon className="w-4 h-4 mb-0.5" />
                  {item.isLocked && (
                    <span className="absolute -top-1 -right-1.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
                  )}
                </div>
                <span className="truncate">{item.shortName}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};
