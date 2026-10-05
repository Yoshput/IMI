import type { Metadata } from "next";
import "./globals.css";
import { AppNav } from "@/components/shared/AppNav";
import { FooterDevToggle } from "@/components/shared/FooterDevToggle";
import { ProductByBadge } from "@/components/shared/ProductByBadge";

export const metadata: Metadata = {
  title: "Optik I See You & Lunar Eyewear · Marketing Intelligence System",
  description: "Enterprise multi-channel marketing intelligence and operational CRM dashboard for Optik I See You (Purwokerto, Purbalingga, Cilacap, Wonosobo) & Lunar Eyewear Tegal.",
  icons: {
    icon: "/brand/imi-icon.png",
    shortcut: "/brand/imi-icon.png",
    apple: "/brand/imi-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("isy_theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d){document.documentElement.classList.add("dark");}else{document.documentElement.classList.remove("dark");}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground flex flex-col antialiased">
        <AppNav />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
        <footer className="w-full border-t border-border bg-surface py-4 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] text-foreground-muted">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">Optik I See You & Lunar Eyewear</span>
              <span className="hidden sm:inline">— Marketing Intelligence Enterprise System</span>
            </div>
            <div className="flex items-center justify-center my-1 md:my-0">
              <ProductByBadge />
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-emerald-800 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse" />
                Live Sync Active
              </span>
              <span>·</span>
              <span className="hidden lg:inline">Meta Graph & Sheets Data Engine</span>
              <span className="hidden lg:inline">·</span>
              <FooterDevToggle />
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
