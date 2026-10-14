import type { Metadata } from "next";
import "./globals.css";
import { AppFrame } from "@/components/shared/AppFrame";

export const metadata: Metadata = {
  metadataBase: new URL("https://iseeyou-marketing-intelligence.vercel.app"),
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
        <AppFrame>{children}</AppFrame>
      </body>
    </html>
  );
}
