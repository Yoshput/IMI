"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  BarChart3,
  FileText,
  Glasses,
  FileSpreadsheet,
  Compass,
  HeartHandshake,
  Coins,
  Lock,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  isLocked?: boolean;
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Aftersales CRM", href: "/aftersales", icon: HeartHandshake },
  { name: "Spreadsheet Rekap", href: "/spreadsheet", icon: FileSpreadsheet },
  { name: "Competitor Radar", href: "/competitors", icon: Compass },
  { name: "Content", href: "/content", icon: Film },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Reports", href: "/reports", icon: FileText, isLocked: true },
  { name: "Finance", href: "/finance", icon: Coins, isLocked: true },
];

export const AppNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 w-full bg-surface/90 backdrop-blur-md border-b border-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity: Logo Optik I See You di Kiri Atas */}
          <Link href="/dashboard" className="flex items-center gap-3 group shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-isy-dark.png"
              alt="Optik I See You"
              className="h-8 sm:h-9 w-auto object-contain transition-opacity group-hover:opacity-90"
            />
            <div className="hidden sm:block border-l border-border pl-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold tracking-tight text-foreground">
                  Marketing Intelligence
                </span>
                <span className="text-[9px] uppercase font-semibold px-1.5 py-0.2 rounded bg-brand-light text-brand">
                  4+1 Cabang
                </span>
              </div>
              <span className="text-[10px] text-foreground-muted block">
                Optik I See You (PWT · PBG · CLP · WNS) + Lunar Tegal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-control text-xs font-medium transition-all ${
                    isActive
                      ? "bg-foreground text-surface font-semibold shadow-subtle"
                      : "text-foreground-secondary hover:text-foreground hover:bg-surface-secondary"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.name}</span>
                  {item.isLocked && (
                    <Lock className="w-2.5 h-2.5 opacity-60 text-amber-500 ml-0.5" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Semi-compact Navigation for medium screens */}
          <nav className="hidden md:flex xl:hidden items-center gap-1">
            {navItems.slice(0, 6).map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-control text-xs font-medium transition-all ${
                    isActive
                      ? "bg-foreground text-surface font-semibold shadow-subtle"
                      : "text-foreground-secondary hover:text-foreground hover:bg-surface-secondary"
                  }`}
                  title={item.name}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-[11px]">{item.name.split(" ")[0]}</span>
                </Link>
              );
            })}
            <Link
              href="/finance"
              className={`flex items-center gap-1 px-2 py-1.5 rounded-control text-xs font-medium ${
                pathname.startsWith("/finance")
                  ? "bg-foreground text-surface font-semibold"
                  : "text-foreground-secondary hover:bg-surface-secondary"
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <Lock className="w-2.5 h-2.5 text-amber-500" />
            </Link>
          </nav>

          {/* Right Header Area: Brand Tagline Mark */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden lg:block text-right">
              <span className="text-xs font-semibold text-foreground block">
                Week 37 · 2026
              </span>
              <span className="text-[10px] text-foreground-muted block">
                Target: 2 Post/Hari
              </span>
            </div>

            <div className="h-5 w-px bg-border hidden lg:block" />

            <div className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/logo-for-every-you.png"
                alt="for every you"
                className="h-5 sm:h-5.5 w-auto object-contain opacity-85 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar (iOS Tab Bar Style) */}
        <div className="flex md:hidden border-t border-border/60 py-2 items-center gap-1 overflow-x-auto px-2 scroll-smooth">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center min-w-[58px] min-h-[44px] py-1 px-2 rounded-control text-[10px] font-medium transition-all shrink-0 active:scale-95 ${
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
                <span className="truncate">{item.name.split(" ")[0]}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};
