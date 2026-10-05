import React from "react";
import { Metadata } from "next";
import { PengajuanHubView } from "@/features/pengajuan/components/PengajuanHubView";

export const metadata: Metadata = {
  title: "Pengajuan Sponsorship & Home Service | Optik I See You",
  description:
    "Portal layanan mandiri pengajuan proposal sponsorship dan booking Home Service pemeriksaan mata 4 cabang Optik I See You.",
};

export default function PengajuanPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <PengajuanHubView />
    </main>
  );
}
