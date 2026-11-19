"use client";

import React, { useState } from "react";
import {
  Rocket,
  Plus,
  Calendar,
  Package,
  TrendingUp,
  DollarSign,
  Eye,
  Video,
  CheckCircle2,
  Users,
  ExternalLink,
  ChevronRight,
  Sparkles,
  BarChart2,
} from "lucide-react";
import { Campaign, Creator } from "../types";

interface KolCampaignTrackingSubmoduleProps {
  campaigns: Campaign[];
  creators: Creator[];
  onSelectCreator: (creator: Creator) => void;
  onAddNewCampaign: () => void;
}

export const KolCampaignTrackingSubmodule: React.FC<KolCampaignTrackingSubmoduleProps> = ({
  campaigns,
  creators,
  onSelectCreator,
  onAddNewCampaign,
}) => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaigns[0]?.id || "");

  const activeCampaign = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

  // Get creators participating in this campaign
  const campaignCreators = creators.filter((c) => {
    if (!activeCampaign) return false;
    return (
      c.collaboration.campaignId === activeCampaign.id ||
      activeCampaign.participatingCreatorIds?.includes(c.id)
    );
  });

  // Calculate actual aggregated metrics from assigned creators
  const actualPublishedCount = campaignCreators.filter(
    (c) => c.collaboration.stage === "content_published" || c.collaboration.stage === "completed"
  ).length;

  const actualTotalViews = campaignCreators.reduce((acc, c) => acc + (c.collaboration.viewsCount || 0), 0);
  const actualTotalProducts = campaignCreators.length;
  const actualShippingCost = campaignCreators.length * 25000;

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & NEW CAMPAIGN TRIGGER                                      */}
      {/* ========================================================================= */}
      <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
              Campaign Tracking Engine (Master Plan §8)
            </span>
            <span className="text-xs text-foreground-muted">
              Monitoring Efektivitas Barter Kacamata
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-foreground mt-1 tracking-tight">
            Pelacakan Kampanye Kolaborasi Influencer
          </h2>
          <p className="text-xs sm:text-sm text-foreground-secondary mt-1 max-w-2xl">
            Alokasi produk kacamata barter, biaya logistik ekspedisi, jadwal tayang konten,
            serta total jangkauan impresi dari para creator yang berpartisipasi.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddNewCampaign}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 self-start md:self-center cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Kampanye Baru</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. CAMPAIGN SELECTOR TABS & SUMMARY CARDS                                 */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {campaigns.map((camp) => (
          <button
            key={camp.id}
            onClick={() => setSelectedCampaignId(camp.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border shrink-0 ${
              selectedCampaignId === camp.id
                ? "bg-emerald-800 text-white border-emerald-900 shadow-subtle"
                : "bg-surface border-border text-foreground-secondary hover:text-foreground hover:bg-surface-secondary"
            }`}
          >
            <span>{camp.name}</span>
            <span className={`ml-2 text-[10px] px-1.5 py-0.2 rounded-full font-black ${
              selectedCampaignId === camp.id ? "bg-white/20 text-white" : "bg-surface-secondary text-foreground-muted"
            }`}>
              {camp.status === "active" ? "Aktif" : "Selesai"}
            </span>
          </button>
        ))}
      </div>

      {activeCampaign && (
        <div className="space-y-6">
          {/* Campaign Detail Banner */}
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-subtle space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Detail Kampanye Terpilih
                </span>
                <h3 className="text-lg font-black text-foreground mt-0.5">
                  {activeCampaign.name}
                </h3>
                <p className="text-xs text-foreground-secondary mt-1">
                  <strong>Tujuan:</strong> {activeCampaign.objective}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-foreground-muted shrink-0 font-medium">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Periode: {activeCampaign.startDate} s/d {activeCampaign.endDate}</span>
              </div>
            </div>

            {/* 6 Key Campaign Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
              {/* Card 1: Creators Count */}
              <div className="p-3 rounded-xl bg-surface-secondary/70 border border-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">
                  Partisipan
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-black text-foreground">{campaignCreators.length}</span>
                  <span className="text-[10px] text-foreground-muted">creator</span>
                </div>
              </div>

              {/* Card 2: Allocated Products */}
              <div className="p-3 rounded-xl bg-surface-secondary/70 border border-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                  Kacamata Barter
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-black text-emerald-800 dark:text-emerald-300">
                    {activeCampaign.totalProductsAllocated || actualTotalProducts}
                  </span>
                  <span className="text-[10px] text-foreground-muted">paket</span>
                </div>
              </div>

              {/* Card 3: Shipping Costs */}
              <div className="p-3 rounded-xl bg-surface-secondary/70 border border-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">
                  Biaya Ongkir
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-base font-black text-foreground">
                    Rp {((activeCampaign.totalShippingCosts || actualShippingCost) / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>

              {/* Card 4: Published Content */}
              <div className="p-3 rounded-xl bg-surface-secondary/70 border border-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">
                  Video Tayang
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-black text-foreground">
                    {activeCampaign.totalPublishedContent || actualPublishedCount}
                  </span>
                  <span className="text-[10px] text-foreground-muted">konten</span>
                </div>
              </div>

              {/* Card 5: Total Views */}
              <div className="p-3 rounded-xl bg-surface-secondary/70 border border-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 block">
                  Total Views
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-black text-blue-800 dark:text-blue-300">
                    {((activeCampaign.totalViews || actualTotalViews) / 1000).toFixed(1)}K
                  </span>
                </div>
              </div>

              {/* Card 6: Average ER */}
              <div className="p-3 rounded-xl bg-surface-secondary/70 border border-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 block">
                  Rata-rata ER
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-black text-purple-800 dark:text-purple-300">
                    {activeCampaign.averageEngagement}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. PARTICIPATING CREATORS TABLE FOR THIS CAMPAIGN                         */}
          {/* ========================================================================= */}
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Daftar Creator di Kampanye Ini</span>
                </h4>
                <p className="text-xs text-foreground-secondary">
                  Status pengiriman paket kacamata dan deliverables konten dari setiap partisipan.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-surface-secondary/70 border-b border-border text-[11px] font-bold uppercase tracking-wider text-foreground-muted">
                    <th className="py-2.5 px-4">Nama Creator</th>
                    <th className="py-2.5 px-3">Kota</th>
                    <th className="py-2.5 px-3">Produk Kacamata Barter</th>
                    <th className="py-2.5 px-3">Status Pipeline</th>
                    <th className="py-2.5 px-3">Deliverables</th>
                    <th className="py-2.5 px-3 text-right">Views</th>
                    <th className="py-2.5 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {campaignCreators.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-foreground-muted">
                        Belum ada creator yang dialokasikan ke kampanye ini.
                      </td>
                    </tr>
                  ) : (
                    campaignCreators.map((creator) => (
                      <tr
                        key={creator.id}
                        onClick={() => onSelectCreator(creator)}
                        className="hover:bg-surface-secondary/40 transition-colors cursor-pointer group"
                      >
                        <td className="py-3 px-4">
                          <span className="font-bold text-foreground block group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                            {creator.name}
                          </span>
                          <span className="text-[11px] text-foreground-muted">
                            @{creator.instagramHandle}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-foreground-secondary whitespace-nowrap">
                          {creator.city}
                        </td>
                        <td className="py-3 px-3 text-foreground-secondary max-w-xs truncate">
                          {creator.collaboration.productSent}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-secondary text-foreground-secondary border border-border">
                            {creator.collaboration.stage}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-foreground-secondary max-w-xs truncate">
                          {creator.collaboration.deliverables}
                        </td>
                        <td className="py-3 px-3 text-right font-black text-foreground tabular-nums">
                          {creator.collaboration.viewsCount ? creator.collaboration.viewsCount.toLocaleString("id-ID") : "-"}
                        </td>
                        <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => onSelectCreator(creator)}
                            className="p-1 rounded-lg bg-surface-secondary hover:bg-border text-foreground transition-colors"
                            title="Buka Profil Lengkap"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
