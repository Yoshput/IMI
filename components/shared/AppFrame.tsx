'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppNav } from './AppNav';
import { FooterDevToggle } from './FooterDevToggle';
import { ProductByBadge } from './ProductByBadge';

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/') return <>{children}</>;
  return (
    <>
      <AppNav />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">{children}</main>
      <footer className="w-full border-t border-border bg-surface py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] text-foreground-muted">
          <div className="flex items-center gap-2"><span className="font-semibold text-foreground">Optik I See You & Lunar Eyewear</span><span className="hidden sm:inline">— Marketing Intelligence Enterprise System</span></div>
          <div className="flex items-center justify-center my-1 md:my-0"><ProductByBadge /></div>
          <div className="flex items-center gap-3">
            <Link href="/?intro=1" className="hover:text-foreground underline underline-offset-4">Tentang workspace</Link>
            <span className="inline-flex items-center gap-1.5 text-emerald-800 font-medium"><span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse" />Live Sync Active</span>
            <span>·</span><span className="hidden lg:inline">Meta Graph & Sheets Data Engine</span><span className="hidden lg:inline">·</span><FooterDevToggle />
          </div>
        </div>
      </footer>
    </>
  );
}
