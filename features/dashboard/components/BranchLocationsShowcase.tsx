"use client";

import React, { useState } from "react";
import { MapPin, Building2, Eye, Sparkles, X, ChevronRight } from "lucide-react";

interface BranchData {
  id: string;
  name: string;
  city: string;
  address: string;
  isMainBranch?: boolean;
  coverImage: string;
  gallery: string[];
  activeCampaign: string;
  localReachShare: string;
  weeklyInquiries: number;
  highlightNotes: string;
}

export const BRANCH_LOCATIONS: BranchData[] = [
  {
    id: "br-pwt",
    name: "Optik I See You — Purwokerto",
    city: "Purwokerto (Pusat)",
    address: "Jl. Prof. Dr. HR Boenyamin No. 78, Banyumas",
    isMainBranch: true,
    coverImage: "/lokasi/purwokerto/IMG_1544.webp",
    gallery: [
      "/lokasi/purwokerto/IMG_1544.webp",
      "/lokasi/purwokerto/IMG_1543.webp",
      "/lokasi/purwokerto/IMG_1546.webp",
    ],
    activeCampaign: "Reels POV Try-on & Lab Faset Lensa Cepat",
    localReachShare: "58% dari total reach",
    weeklyInquiries: 42,
    highlightNotes:
      "Pusat produksi konten utama & lab refraksi cepat. Menargetkan segmen mahasiswa Unsoed, UMP, dan Telkom Purwokerto.",
  },
  {
    id: "br-pbg",
    name: "Optik I See You — Purbalingga",
    city: "Purbalingga",
    address: "Jl. Jenderal Soedirman No. 112, Purbalingga",
    coverImage: "/lokasi/purbalingga/IMG_8526.webp",
    gallery: [
      "/lokasi/purbalingga/IMG_8526.webp",
      "/lokasi/purbalingga/IMG_8525.webp",
      "/lokasi/purbalingga/IMG_8533.webp",
    ],
    activeCampaign: "Katalog Restock Frame Korean Aesthetic",
    localReachShare: "18% dari total reach",
    weeklyInquiries: 14,
    highlightNotes:
      "Interior display oval modern dan pencahayaan kurva. Konten carousel foto frame titanium restock paling diminati.",
  },
  {
    id: "br-clp",
    name: "Optik I See You — Cilacap",
    city: "Cilacap",
    address: "Jl. Gatot Subroto No. 45, Cilacap",
    coverImage: "/lokasi/cilacap/IMG_6716.webp",
    gallery: [
      "/lokasi/cilacap/IMG_6716.webp",
      "/lokasi/cilacap/IMG_7453.webp",
      "/lokasi/cilacap/IMG_7455.webp",
    ],
    activeCampaign: "Edukasi Lensa Bluechromic Pesisir Pantai",
    localReachShare: "14% dari total reach",
    weeklyInquiries: 11,
    highlightNotes:
      "Fasade hijau signature Optik I See You. Konten demo transisi lensa di bawah matahari pesisir menghasilkan interaksi tinggi.",
  },
  {
    id: "br-wsb",
    name: "Optik I See You — Wonosobo",
    city: "Wonosobo",
    address: "Jl. Ahmad Yani No. 89, Wonosobo",
    coverImage: "/lokasi/wonosobo/IMG_4474.webp",
    gallery: [
      "/lokasi/wonosobo/IMG_4474.webp",
      "/lokasi/wonosobo/IMG_4475.webp",
      "/lokasi/wonosobo/IMG_4476.webp",
    ],
    activeCampaign: "Weekend Eyewear Community & Cek Mata Gratis",
    localReachShare: "10% dari total reach",
    weeklyInquiries: 8,
    highlightNotes:
      "Outlet area dataran tinggi dengan basis pelanggan setia. Fokus pada edukasi perawatan kacamata anti embun dan anti gores.",
  },
];

export const BranchLocationsShowcase: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<{ src: string; title: string } | null>(null);

  return (
    <div className="space-y-4 mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-foreground-secondary">
              Jaringan Cabang & Aktivitas Outlet Fisik
            </h2>
          </div>
          <p className="text-sm text-foreground mt-0.5">
            Dokumentasi foto lokasi asli 4 cabang Optik I See You untuk sinkronisasi konten lokal & evaluasi manajemen
          </p>
        </div>
        <span className="text-[11px] text-foreground-muted font-medium">
          4 Outlet Aktif · Banyumas Raya
        </span>
      </div>

      {/* 4 Branch Location Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {BRANCH_LOCATIONS.map((branch) => (
          <div
            key={branch.id}
            className="group rounded-container bg-surface border border-border hover:border-brand/40 transition-all shadow-subtle flex flex-col overflow-hidden"
          >
            {/* Real Store Photo Container */}
            <div
              className="relative aspect-[4/3] w-full overflow-hidden cursor-pointer bg-surface-secondary"
              onClick={() => setSelectedPhoto({ src: branch.coverImage, title: branch.name })}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={branch.coverImage}
                alt={branch.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

              {/* Tag Badges on Photo */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                {branch.isMainBranch ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand text-white uppercase tracking-wider shadow-sm">
                    Pusat & Lab
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white uppercase tracking-wider">
                    Cabang
                  </span>
                )}
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/90 text-foreground shadow-sm">
                  {branch.gallery.length} Foto
                </span>
              </div>

              {/* Bottom Label on Photo */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                <div className="flex items-center gap-1 text-[11px] font-medium opacity-90">
                  <MapPin className="w-3 h-3 text-amber-300" />
                  <span>{branch.city}</span>
                </div>
                <h4 className="text-xs font-bold leading-snug line-clamp-1">
                  {branch.name.replace("Optik I See You — ", "")}
                </h4>
              </div>
            </div>

            {/* Branch Content Context */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-foreground-muted tracking-wider block">
                  Kampanye Aktif
                </span>
                <span className="font-semibold text-brand block mt-0.5 text-[11px] leading-tight">
                  {branch.activeCampaign}
                </span>
              </div>

              <div className="pt-2 border-t border-border/80 flex items-center justify-between text-[11px]">
                <span className="text-foreground-secondary">Kontribusi Reach:</span>
                <span className="font-bold text-foreground">{branch.localReachShare}</span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-foreground-secondary">Inbound DM:</span>
                <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded">
                  {branch.weeklyInquiries} tanya lokasi
                </span>
              </div>

              <p className="text-[11px] text-foreground-muted italic leading-relaxed pt-1 border-t border-border/60">
                &ldquo;{branch.highlightNotes}&rdquo;
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Modal for Photo Preview */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="max-w-2xl w-full bg-surface rounded-dialog border border-border shadow-elevated overflow-hidden animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-border flex items-center justify-between bg-surface-secondary">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand" />
                <h3 className="text-xs font-bold text-foreground">
                  {selectedPhoto.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-1 rounded-control text-foreground-muted hover:text-foreground hover:bg-surface"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative aspect-[4/3] bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-3 text-[11px] text-foreground-secondary bg-surface-secondary text-center">
              Foto dokumentasi interior/eksterior resmi Optik I See You.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
