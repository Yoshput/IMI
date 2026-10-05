import React from "react";
import { Metadata } from "next";
import { PengajuanHubView } from "@/features/pengajuan/components/PengajuanHubView";

export const metadata: Metadata = {
  title: "Pengajuan Proposal Sponsorship | Optik I See You",
  description:
    "Portal resmi pengajuan proposal kerja sama sponsorship Optik I See You.",
};

export default function SponsorPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <PengajuanHubView />
    </main>
  );
}
