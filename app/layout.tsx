import type { Metadata } from "next";
import "./globals.css";
import { AppNav } from "@/components/shared/AppNav";
import { FooterDevToggle } from "@/components/shared/FooterDevToggle";

export const metadata: Metadata = {
  title: "I See You — Marketing Intelligence",
  description: "Internal marketing intelligence platform for Optik I See You Purwokerto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-background text-foreground flex flex-col antialiased">
        <AppNav />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
        <footer className="w-full border-t border-border bg-surface py-4 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-foreground-muted">
            <div>
              <span>Optik I See You (Purwokerto) — Sistem Intelijen Marketing Internal</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Data Provenance: Value + Date + Source</span>
              <span>·</span>
              <span className="text-amber-700 font-medium">Simulasi Data Seed</span>
              <span>·</span>
              <FooterDevToggle />
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
