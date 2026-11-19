"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Award,
  TrendingUp,
  Camera,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Eye,
  Video,
  ShieldCheck,
  Send,
  Plus,
  Sliders,
  Glasses,
} from "lucide-react";
import { Creator, PriorityLevelType } from "../types";

interface KolEvaluateSubmoduleProps {
  creators: Creator[];
  onSelectCreator: (creator: Creator) => void;
  onAddNewCreator: () => void;
  onOpenMessageGenerator: (creator: Creator) => void;
}

export const KolEvaluateSubmodule: React.FC<KolEvaluateSubmoduleProps> = ({
  creators,
  onSelectCreator,
  onAddNewCreator,
  onOpenMessageGenerator,
}) => {
  // Simulator State untuk Evaluator Interaktif
  const [simName, setSimName] = useState("Kandidat Baru");
  const [simHandle, setSimHandle] = useState("username_ig");
  const [simFollowers, setSimFollowers] = useState(35000);
  const [simVisualScore, setSimVisualScore] = useState(9);
  const [simBrandingScore, setSimBrandingScore] = useState(9);
  const [simReachScore, setSimReachScore] = useState(7);
  const [simQualityScore, setSimQualityScore] = useState(8);

  // Kalkulasi Skor Tertimbang
  // Visual: 35%, Branding: 25%, Reach: 20%, Content Quality: 20%
  const calculatedPotential = Math.round(
    simVisualScore * 3.5 +
    simBrandingScore * 2.5 +
    simReachScore * 2.0 +
    simQualityScore * 2.0
  );

  // Klasifikasi Otomatis Berdasarkan Aturan Master Plan §4
  const recommendedCategory: PriorityLevelType =
    simFollowers >= 75000 && simReachScore >= 8
      ? "reach"
      : simVisualScore >= 8 && simBrandingScore >= 8
      ? "visual"
      : "standard";

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. SOP SELECTION STRATEGY HERO                                            */}
      {/* ========================================================================= */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-subtle space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                Selection Strategy &amp; Scorecard (Master Plan §4)
              </span>
              <span className="text-xs text-foreground-muted">
                Standar Penilaian Objektif Tim Marketing
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-foreground tracking-tight">
              Strategi Evaluasi &amp; Kualifikasi Creator Kacamata
            </h2>
            <p className="text-xs sm:text-sm text-foreground-secondary mt-1 leading-relaxed">
              Optik I See You tidak menolak creator hanya karena followers kecil. Kami membagi kandidat
              menjadi dua pilar strategis: <strong>Visual Priority</strong> (cocok untuk katalog &amp; try-on)
              dan <strong>Reach Priority</strong> (cocok untuk jangkauan luas &amp; awareness promo).
            </p>
          </div>

          <button
            type="button"
            onClick={onAddNewCreator}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 self-start lg:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Input Evaluasi Creator Baru</span>
          </button>
        </div>

        {/* 2 Strategic Pillar Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Pillar A: Visual Priority */}
          <div className="p-5 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-800 dark:text-purple-300 border border-purple-500/30">
                Pilar A · Visual Priority
              </span>
              <span className="text-xs font-bold text-purple-700 dark:text-purple-400">
                Micro-influencers Welcome
              </span>
            </div>

            <h3 className="font-serif font-bold text-base text-purple-950 dark:text-purple-200">
              Kandidat Prioritas Visual &amp; Fotogenik
            </h3>

            <p className="text-xs text-foreground-secondary leading-relaxed">
              Creator dengan daya tarik visual kuat, feed Instagram rapi, personal branding estetik,
              dan sangat fotogenik memakai kacamata/softlens.
            </p>

            <ul className="space-y-1.5 text-xs text-foreground-secondary">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>Followers 10K–50K dengan engagement rate tinggi (&gt;5%)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>Cocok untuk video close-up fitting frame &amp; tutorial look</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>Sangat efektif untuk sistem barter kacamata komplit</span>
              </li>
            </ul>
          </div>

          {/* Pillar B: Reach Priority */}
          <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-500/30">
                Pilar B · Reach Priority
              </span>
              <span className="text-xs font-bold text-blue-700 dark:text-blue-400">
                Macro &amp; Viral Creators
              </span>
            </div>

            <h3 className="font-serif font-bold text-base text-blue-950 dark:text-blue-200">
              Kandidat Prioritas Jangkauan Massal
            </h3>

            <p className="text-xs text-foreground-secondary leading-relaxed">
              Creator dengan basis audiens besar dan rata-rata penonton video tinggi, cocok untuk penyebaran
              info program periksa mata gratis dan promo diskon voucher secara cepat.
            </p>

            <ul className="space-y-1.5 text-xs text-foreground-secondary">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Followers &gt;75K dengan rata-rata views puluhan ribu</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Konten berfokus pada hiburan lokal, kuliner, dan lifestyle</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Model barter dapat dikombinasikan dengan voucher belanja followers</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. INTERACTIVE EVALUATION CALCULATOR (MATRIX SIMULATOR)                    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Sliders & Scoring Inputs */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-subtle space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <span>Kalkulator &amp; Matriks Penilaian Manual Creator</span>
              </h3>
              <p className="text-xs text-foreground-secondary">
                Uji coba penilaian kandidat secara objektif berdasarkan 4 pilar pemasaran kacamata.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              Bobot Standar
            </span>
          </div>

          {/* Quick Meta Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-foreground-muted block mb-1">Nama Creator</label>
              <input
                type="text"
                value={simName}
                onChange={(e) => setSimName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-surface-secondary border border-border text-xs text-foreground font-medium"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-foreground-muted block mb-1">Username IG</label>
              <input
                type="text"
                value={simHandle}
                onChange={(e) => setSimHandle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-surface-secondary border border-border text-xs text-foreground font-medium"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-foreground-muted block mb-1">Estimasi Followers</label>
              <input
                type="number"
                value={simFollowers}
                onChange={(e) => setSimFollowers(Number(e.target.value) || 0)}
                className="w-full px-3 py-1.5 rounded-xl bg-surface-secondary border border-border text-xs text-foreground font-medium"
              />
            </div>
          </div>

          {/* 4 Score Sliders */}
          <div className="space-y-4 pt-2">
            {/* Slider 1: Visual Appeal */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-purple-600" />
                  <span>1. Visual Appeal &amp; Fotogenik (Bobot 35%)</span>
                </span>
                <span className="font-black text-purple-700 dark:text-purple-300 text-sm">
                  {simVisualScore} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={simVisualScore}
                onChange={(e) => setSimVisualScore(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <p className="text-[11px] text-foreground-muted">
                Kerapian grid foto, penampilan fotogenik, daya tarik visual saat memakai frame kacamata.
              </p>
            </div>

            {/* Slider 2: Branding Compatibility */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <Glasses className="w-3.5 h-3.5 text-emerald-600" />
                  <span>2. Kecocokan Branding Kacamata (Bobot 25%)</span>
                </span>
                <span className="font-black text-emerald-700 dark:text-emerald-300 text-sm">
                  {simBrandingScore} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={simBrandingScore}
                onChange={(e) => setSimBrandingScore(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <p className="text-[11px] text-foreground-muted">
                Relevansi audiens dengan produk Optik I See You (remaja, mahasiswa, profesional muda).
              </p>
            </div>

            {/* Slider 3: Audience Reach */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                  <span>3. Jangkauan Audiens &amp; Views (Bobot 20%)</span>
                </span>
                <span className="font-black text-blue-700 dark:text-blue-300 text-sm">
                  {simReachScore} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={simReachScore}
                onChange={(e) => setSimReachScore(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-foreground-muted">
                Jumlah followers aktif dan rata-rata tayangan per video Reels/TikTok.
              </p>
            </div>

            {/* Slider 4: Content Quality */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-amber-600" />
                  <span>4. Kualitas Produksi &amp; Komunikasi (Bobot 20%)</span>
                </span>
                <span className="font-black text-amber-700 dark:text-amber-300 text-sm">
                  {simQualityScore} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={simQualityScore}
                onChange={(e) => setSimQualityScore(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <p className="text-[11px] text-foreground-muted">
                Kualitas audio jernih, lighting rapi, ekspresi percaya diri, dan kemampuan review produk.
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: Instant Recommendation Card */}
        <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-subtle flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">
              Hasil Rekomendasi Sistem
            </span>

            {/* Score Ring / Box */}
            <div className="p-4 rounded-2xl bg-surface-secondary/70 border border-border text-center space-y-1">
              <span className="text-3xl font-black text-foreground">{calculatedPotential}</span>
              <span className="text-xs text-foreground-muted block">Skor Potensial (0–100)</span>
            </div>

            {/* Category Recommendation Pill */}
            <div className="p-3.5 rounded-xl border space-y-1 bg-surface">
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">
                Kategori Strategis
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                    recommendedCategory === "visual"
                      ? "bg-purple-100 text-purple-900 border-purple-300"
                      : recommendedCategory === "reach"
                      ? "bg-blue-100 text-blue-900 border-blue-300"
                      : "bg-surface-secondary text-foreground border-border"
                  }`}
                >
                  {recommendedCategory === "visual"
                    ? "Category A · Visual Priority"
                    : recommendedCategory === "reach"
                    ? "Category B · Reach Priority"
                    : "Standard Candidate"}
                </span>
              </div>
              <p className="text-[11px] text-foreground-secondary mt-1">
                {recommendedCategory === "visual"
                  ? "Sangat direkomendasikan untuk barter produk kacamata estetik dan foto katalog try-on."
                  : recommendedCategory === "reach"
                  ? "Direkomendasikan untuk promosi awareness jangkauan luas dan penayangan kampanye serentak."
                  : "Kandidat memenuhi syarat dasar, disarankan untuk uji coba barter produk frame standar."}
              </p>
            </div>

            {/* Suggested Barter Package */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
              <span className="font-bold text-emerald-900 dark:text-emerald-200 block">
                Paket Barter Produk yang Disarankan:
              </span>
              <p className="text-[11px] text-foreground-secondary">
                1 Paket Kacamata Lengkap (Frame Pilihan + Lensa Anti-Radiasi Blue Ray) kirim langsung ke rumah.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onAddNewCreator}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>Simpan Sebagai Creator Terverifikasi</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. TOP SCORING CREATORS SHOWCASE                                          */}
      {/* ========================================================================= */}
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Daftar Creator dengan Skor Tertinggi Saat Ini</span>
            </h3>
            <p className="text-xs text-foreground-secondary">
              Urutan creator berdasarkan hasil evaluasi 4 faktor penilaian di database.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {creators
            .sort((a, b) => (b.evaluation.potentialScore || 0) - (a.evaluation.potentialScore || 0))
            .slice(0, 3)
            .map((c, idx) => (
              <div
                key={c.id}
                onClick={() => onSelectCreator(c)}
                className="p-4 rounded-xl bg-surface-secondary/60 hover:bg-surface border border-border transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-200 font-black text-xs flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                    Skor: {c.evaluation.potentialScore}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                    {c.name} (@{c.instagramHandle})
                  </h4>
                  <p className="text-[11px] text-foreground-muted">
                    {c.city} · {c.followersFormatted} followers · ER {c.engagementRate}%
                  </p>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-[11px]">
                  <span className="text-purple-700 dark:text-purple-300 font-semibold">
                    Visual: {c.evaluation.visualScore}/10
                  </span>
                  <span className="text-blue-700 dark:text-blue-300 font-semibold">
                    Reach: {c.evaluation.reachScore}/10
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
