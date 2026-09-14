"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Film, BarChart3, FileText, Glasses, FileSpreadsheet, Compass } from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Spreadsheet Rekap", href: "/spreadsheet", icon: FileSpreadsheet },
  { name: "Competitor Radar", href: "/competitors", icon: Compass },
  { name: "Content", href: "/content", icon: Film },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Reports", href: "/reports", icon: FileText },
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
                <span className="text-[9px] uppercase font-semibold px-1 py-0.2 rounded bg-brand-light text-brand">
                  4 Cabang
                </span>
              </div>
              <span className="text-[10px] text-foreground-muted block">
                Purwokerto · Purbalingga · Cilacap · Wonosobo
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-control text-xs font-medium transition-all ${
                    isActive
                      ? "bg-foreground text-surface font-semibold shadow-subtle"
                      : "text-foreground-secondary hover:text-foreground hover:bg-surface-secondary"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Header Area: Logo 'For Every You' di Kanan Atas */}
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

            {/* Logo 'For Every You' di Kanan Atas (Brand Tagline Mark) */}
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

        {/* Mobile Navigation Bar (DESIGN.md §28: Recompose for Mobile) */}
        <div className="flex md:hidden border-t border-border/60 py-2 items-center justify-around gap-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 py-1 rounded-control text-[11px] font-medium transition-colors ${
                  isActive
                    ? "text-brand font-bold bg-brand-light"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span>{item.name === "Dashboard" ? "Overview" : item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};
