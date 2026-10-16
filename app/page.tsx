import type { Metadata } from "next";
import { LandingView } from "@/features/landing/components/LandingView";
import "@/features/landing/landing.css";

export const metadata: Metadata = {
  title: "I See You Marketing Intelligence | Workspace Optik I See You & Lunar Eyewear",
  description:
    "Platform marketing intelligence terpadu untuk memantau performa konten Reels & Story, sinkronisasi laporan 6 PIC, analitik 5 cabang (Purwokerto, Purbalingga, Cilacap, Wonosobo, Tegal), riset kompetitor, KOL, dan aftersales.",
  keywords: [
    "Optik I See You",
    "Lunar Eyewear",
    "Marketing Intelligence",
    "Workspace Marketing",
    "Optik Purwokerto",
    "Optik Purbalingga",
    "Optik Cilacap",
    "Optik Wonosobo",
    "Optik Tegal",
    "Social Blade Tracker",
    "Aftersales CRM",
  ],
  authors: [{ name: "Tim Marketing Optik I See You & Lunar Eyewear" }],
  alternates: {
    canonical: "https://iseeyou-marketing-intelligence.vercel.app",
  },
  openGraph: {
    title: "I See You Marketing Intelligence | Workspace Optik I See You & Lunar Eyewear",
    description:
      "Platform marketing intelligence terpadu untuk memantau performa konten Reels & Story, sinkronisasi laporan 6 PIC, analitik 5 cabang (Purwokerto, Purbalingga, Cilacap, Wonosobo, Tegal), riset kompetitor, KOL, dan aftersales.",
    url: "https://iseeyou-marketing-intelligence.vercel.app",
    siteName: "I See You Marketing Intelligence",
    images: [
      {
        url: "/brand/logo-isy-dark.png",
        width: 800,
        height: 400,
        alt: "I See You Marketing Intelligence",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "I See You Marketing Intelligence | Workspace Optik I See You & Lunar Eyewear",
    description:
      "Platform marketing intelligence terpadu untuk memantau performa konten Reels & Story, sinkronisasi laporan 6 PIC, analitik 5 cabang, riset kompetitor, KOL, dan aftersales.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  return <LandingView />;
}
