import type { Metadata } from "next";
import { LandingView } from "@/features/landing/components/LandingView";
import "@/features/landing/landing.css";

export const metadata: Metadata = {
  title: "I See You Intelligence | Workspace Marketing Enterprise",
  description:
    "Ruang kerja marketing terpadu Optik I See You (Purwokerto, Purbalingga, Cilacap, Wonosobo) dan Lunar Eyewear Tegal. Konten, aktivitas cabang, riset kompetitor, kemitraan KOL, venue, aftersales CRM, dan evaluasi mingguan dalam satu sistem cerdas.",
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
  openGraph: {
    title: "I See You Intelligence · Enterprise Marketing Workspace",
    description:
      "Ruang kerja marketing terpadu Optik I See You dan Lunar Eyewear. Lihat performa konten, satukan aktivitas 5 cabang, dan bawa konteks ke setiap keputusan evaluasi mingguan.",
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
    title: "I See You Intelligence · Workspace Marketing",
    description:
      "Ruang kerja marketing Optik I See You & Lunar Eyewear. Konten, cabang, dan evaluasi mingguan dalam satu workspace.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  return <LandingView />;
}
