'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppNav } from './AppNav';
import { FooterDevToggle } from './FooterDevToggle';
import { ProductByBadge } from './ProductByBadge';
import { CommandPalette } from './CommandPalette';
import { WorkspaceAccessGate } from './WorkspaceAccessGate';
import { BranchProvider } from '@/context/BranchContext';

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Listen for open-command-palette event from AppNav, buttons, or keys
  useEffect(() => {
    const handleOpen = () => setIsCommandPaletteOpen(true);
    window.addEventListener('open-command-palette', handleOpen);
    return () => window.removeEventListener('open-command-palette', handleOpen);
  }, []);

  // Landing page ('/') is 100% self-contained with its own navigation and footer
  if (pathname === '/') {
    return (
      <BranchProvider>
        {children}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
        />
      </BranchProvider>
    );
  }

  // Public Proposal Sponsor page ('/proposal-sponsor') is accessible without internal gate
  if (pathname === '/proposal-sponsor') {
    return (
      <BranchProvider>
        {children}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
        />
      </BranchProvider>
    );
  }

  // All other dashboard and internal modules are protected by WorkspaceAccessGate
  return (
    <BranchProvider>
      <WorkspaceAccessGate>
        <AppNav />
        <main className="flex-1 w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-7 pb-24 md:pb-8">
          {children}
        </main>

        <footer className="w-full border-t border-[#124734]/15 bg-[#F3EFE6] dark:bg-[#0D1612] py-4 mt-auto mb-14 md:mb-0">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] text-[#5C6B64] dark:text-emerald-100/70">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#183C30] dark:text-emerald-200">
                Optik I See You & Lunar Eyewear
              </span>
              <span className="hidden sm:inline">
                — Multi-Branch Marketing Intelligence Command Center
              </span>
            </div>
            <div className="flex items-center justify-center my-1 md:my-0">
              <ProductByBadge />
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="hover:text-[#124734] dark:hover:text-emerald-300 underline underline-offset-4"
              >
                Tentang Workspace
              </Link>
              <span className="inline-flex items-center gap-1.5 text-[#16A34A] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                Live Sync Active
              </span>
              <span>·</span>
              <span className="hidden lg:inline">Meta Graph & Sheets Data Engine</span>
              <span>·</span>
              <FooterDevToggle />
            </div>
          </div>
        </footer>

        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
        />
      </WorkspaceAccessGate>
    </BranchProvider>
  );
}
