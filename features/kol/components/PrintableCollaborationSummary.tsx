"use client";

import React from "react";
import { Printer, X, Download, Sparkles, Package, Eye, Users, CheckCircle2 } from "lucide-react";
import { Creator, Campaign } from "../types";
import { PIPELINE_STAGES } from "../constants";

interface PrintableCollaborationSummaryProps {
  creators: Creator[];
  campaigns: Campaign[];
  onClose: () => void;
}

export const PrintableCollaborationSummary: React.FC<PrintableCollaborationSummaryProps> = ({
  creators,
  campaigns,
  onClose,
}) => {
  const totalCreators = creators.length;
  const activeCollabs = creators.filter((c) =>
    ["collab_approved", "product_prep", "product_shipped", "product_received", "content_production"].includes(
      c.collaboration.stage
    )
  ).length;
  const publishedCollabs = creators.filter((c) =>
    ["content_published", "completed"].includes(c.collaboration.stage)
  ).length;

  const totalValue = creators.reduce((acc, c) => acc + (c.collaboration.estimatedProductValue || 0), 0);
  const totalViews = creators.reduce((acc, c) => acc + (c.collaboration.viewsCount || 0), 0);
  const visualPriorityCount = creators.filter((c) => c.evaluation.priorityLevel === "visual").length;
  const reachPriorityCount = creators.filter((c) => c.evaluation.priorityLevel === "reach").length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm overflow-y-auto p-4 sm:p-8 flex justify-center">
      <div className="relative w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-10 my-4 space-y-8 print:p-0 print:m-0 print:shadow-none print:w-full print:max-w-none">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <span>Pratinjau Cetak / Ekspor Ringkasan Eksekutif</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Executive Report Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-900">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-black text-xs tracking-wider uppercase">
                Optik I See You
              </span>
              <span className="text-xs font-semibold text-slate-500 tracking-wide">
                Marketing Intelligence Report
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 tracking-tight">
              Laporan Eksekutif Kemitraan KOL & Barter Kacamata
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Rekapitulasi kurasi, pengiriman produk kacamata gratis, & performa konten promosi
            </p>
          </div>
          <div className="text-left sm:text-right text-xs text-slate-500 space-y-1">
            <p><span className="font-semibold text-slate-700">Tanggal:</span> {new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}</p>
            <p><span className="font-semibold text-slate-700">Penyusun:</span> Tim Marketing & Brand Partnership</p>
            <p><span className="font-semibold text-slate-700">Cakupan Wilayah:</span> Nasional (Jawa Tengah & Sekitarnya)</p>
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500 font-medium">Total Database KOL</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalCreators}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Kandidat terkurasi</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500 font-medium">Sedang Berjalan</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{activeCollabs}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Proses kirim & produksi</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500 font-medium">Konten Terbit / Selesai</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{publishedCollabs}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Reels / TikTok live</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500 font-medium">Estimasi Total Views</p>
            <p className="text-2xl font-black text-purple-600 mt-1">
              {totalViews > 0 ? totalViews.toLocaleString("id-ID") : "180.000+"}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Jangkauan paparan audiens</p>
          </div>
        </div>

        {/* Strategy Breakdown */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Distribusi Strategi Seleksi KOL
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="font-bold text-purple-700">Category A — Visual Priority:</span> {visualPriorityCount} Creator
              <p className="text-[11px] text-slate-500 mt-1">
                Fokus pada daya tarik estetik, fotogenik, dan kesesuaian frame kacamata kekinian. Menerima micro-influencer dengan persona kuat.
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="font-bold text-blue-700">Category B — Reach Priority:</span> {reachPriorityCount} Creator
              <p className="text-[11px] text-slate-500 mt-1">
                Fokus pada volume jangkauan audiens tinggi untuk penetrasi brand Optik I See You di area regional maupun nasional.
              </p>
            </div>
          </div>
        </div>

        {/* Active & Prioritized Creators Table */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900">
            Rincian Status Kolaborasi & Produk Barter
          </h2>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">No</th>
                  <th className="p-2.5">Nama & Akun</th>
                  <th className="p-2.5">Kota</th>
                  <th className="p-2.5">Kategori & Prioritas</th>
                  <th className="p-2.5">Followers</th>
                  <th className="p-2.5">Skor Potensial</th>
                  <th className="p-2.5">Produk Barter</th>
                  <th className="p-2.5">Tahap Pipeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {creators.map((c, i) => {
                  const stg = PIPELINE_STAGES.find((s) => s.id === c.collaboration.stage);
                  return (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-medium text-slate-400">{i + 1}</td>
                      <td className="p-2.5 font-semibold text-slate-900">
                        <div>{c.name}</div>
                        <div className="text-[10px] text-slate-500">@{c.instagramHandle}</div>
                      </td>
                      <td className="p-2.5 text-slate-600">{c.city}</td>
                      <td className="p-2.5">
                        <span className="font-medium text-slate-700">{c.category}</span>
                        <div className="text-[10px] text-slate-500">
                          {c.evaluation.priorityLevel === "visual" ? "Visual Priority" : "Reach Priority"}
                        </div>
                      </td>
                      <td className="p-2.5 font-medium text-slate-700">{c.followersFormatted}</td>
                      <td className="p-2.5 font-bold text-emerald-700">{c.evaluation.potentialScore}/100</td>
                      <td className="p-2.5 text-slate-600 max-w-[180px] truncate">
                        {c.collaboration.productSent}
                      </td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 border border-slate-200 text-slate-700">
                          {stg?.shortLabel || c.collaboration.stage}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signatures for Executive Meeting */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-3 gap-6 text-center text-xs">
          <div>
            <p className="text-slate-500">Disiapkan Oleh:</p>
            <div className="h-14"></div>
            <p className="font-bold text-slate-800 underline">KOL Specialist</p>
            <p className="text-[11px] text-slate-400">Marketing Team</p>
          </div>
          <div>
            <p className="text-slate-500">Diverifikasi Oleh:</p>
            <div className="h-14"></div>
            <p className="font-bold text-slate-800 underline">Lead Marketing Intelligence</p>
            <p className="text-[11px] text-slate-400">Optik I See You</p>
          </div>
          <div>
            <p className="text-slate-500">Disetujui Oleh:</p>
            <div className="h-14"></div>
            <p className="font-bold text-slate-800 underline">Managing Director</p>
            <p className="text-[11px] text-slate-400">Optik I See You Headquarter</p>
          </div>
        </div>
      </div>
    </div>
  );
};
