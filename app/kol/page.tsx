import React from "react";
import { Metadata } from "next";
import { KolPartnershipModule } from "@/features/kol/components/KolPartnershipModule";

export const metadata: Metadata = {
  title: "KOL & Creator Partnership Management | Optik I See You",
  description:
    "Pusat strategi kemitraan KOL, sistem evaluasi visual vs jangkauan, barter produk kacamata kirim ke rumah tanpa visit toko, 14 tahapan collaboration pipeline, generator pesan WhatsApp, dan pelacakan campaign.",
};

export default function KolPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <KolPartnershipModule />
      </div>
    </div>
  );
}
