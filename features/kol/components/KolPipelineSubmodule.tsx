"use client";

import React, { useState } from "react";
import {
  Layers,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Clock,
  Sparkles,
  MapPin,
  MessageCircle,
  ExternalLink,
  Plus,
  Package,
  CheckCircle2,
  AlertCircle,
  Filter,
} from "lucide-react";
import { Creator, PipelineStage } from "../types";
import { PIPELINE_STAGES } from "../constants";

interface KolPipelineSubmoduleProps {
  creators: Creator[];
  onSelectCreator: (creator: Creator) => void;
  onUpdateCreatorStage: (creatorId: string, newStage: PipelineStage, note?: string) => void;
  onOpenMessageGenerator: (creator: Creator) => void;
  onAddNewCreator: () => void;
}

export const KolPipelineSubmodule: React.FC<KolPipelineSubmoduleProps> = ({
  creators,
  onSelectCreator,
  onUpdateCreatorStage,
  onOpenMessageGenerator,
  onAddNewCreator,
}) => {
  const [stageGroupFilter, setStageGroupFilter] = useState<"all" | "early" | "active" | "fulfillment" | "final">("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");

  // Filter stages based on group for better readability if desired
  const displayedStages = PIPELINE_STAGES.filter((stg) => {
    if (stageGroupFilter === "early") {
      return stg.order >= 1 && stg.order <= 4; // Candidate to Message Sent
    }
    if (stageGroupFilter === "active") {
      return stg.order >= 5 && stg.order <= 7; // Waiting Response to Approved
    }
    if (stageGroupFilter === "fulfillment") {
      return stg.order >= 8 && stg.order <= 10; // Prep to Received
    }
    if (stageGroupFilter === "final") {
      return stg.order >= 11 && stg.order <= 14; // Production to Completed/Rejected
    }
    return true;
  });

  const handleMoveStage = (e: React.MouseEvent, creatorId: string, currentStage: PipelineStage, direction: "next" | "prev") => {
    e.stopPropagation();
    const currentIndex = PIPELINE_STAGES.findIndex((s) => s.id === currentStage);
    if (currentIndex === -1) return;

    const nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= 0 && nextIndex < PIPELINE_STAGES.length) {
      const targetStage = PIPELINE_STAGES[nextIndex].id;
      onUpdateCreatorStage(creatorId, targetStage, `Dipindahkan via Kanban Pipeline ke ${PIPELINE_STAGES[nextIndex].label}`);
    }
  };

  const handleStageSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, creatorId: string) => {
    const targetStage = e.target.value as PipelineStage;
    const stageLabel = PIPELINE_STAGES.find((s) => s.id === targetStage)?.label || targetStage;
    onUpdateCreatorStage(creatorId, targetStage, `Dipindahkan via Dropdown Kanban ke ${stageLabel}`);
  };

  return (
    <div className="space-y-4">
      {/* ========================================================================= */}
      {/* 1. TOP PIPELINE CONTROLS                                                  */}
      {/* ========================================================================= */}
      <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Collaboration Pipeline Kanban (14 Stages)</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-secondary text-foreground-secondary border border-border">
              {creators.length} Total Creator
            </span>
          </div>
          <p className="text-xs text-foreground-secondary mt-1">
            Geser dan kelola alur kerja sama barter produk kacamata dengan mudah dari tahap penemuan hingga tayang.
          </p>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Stage Group Filter Pills */}
          <div className="flex items-center p-1 rounded-xl bg-surface-secondary border border-border text-xs">
            <button
              onClick={() => setStageGroupFilter("all")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                stageGroupFilter === "all" ? "bg-surface text-foreground shadow-2xs" : "text-foreground-secondary"
              }`}
            >
              Semua (14)
            </button>
            <button
              onClick={() => setStageGroupFilter("early")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                stageGroupFilter === "early" ? "bg-surface text-foreground shadow-2xs" : "text-foreground-secondary"
              }`}
            >
              Outreach (1–4)
            </button>
            <button
              onClick={() => setStageGroupFilter("active")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                stageGroupFilter === "active" ? "bg-surface text-foreground shadow-2xs" : "text-foreground-secondary"
              }`}
            >
              Deal &amp; Barter (5–7)
            </button>
            <button
              onClick={() => setStageGroupFilter("fulfillment")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                stageGroupFilter === "fulfillment" ? "bg-surface text-foreground shadow-2xs" : "text-foreground-secondary"
              }`}
            >
              Pengiriman (8–10)
            </button>
            <button
              onClick={() => setStageGroupFilter("final")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                stageGroupFilter === "final" ? "bg-surface text-foreground shadow-2xs" : "text-foreground-secondary"
              }`}
            >
              Tayang (11–14)
            </button>
          </div>

          <button
            onClick={onAddNewCreator}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Kandidat Baru</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. HORIZONTAL SCROLLABLE KANBAN BOARD                                     */}
      {/* ========================================================================= */}
      <div className="overflow-x-auto pb-4 no-scrollbar">
        <div className="flex items-start gap-3.5 min-w-[1280px]">
          {displayedStages.map((stg) => {
            const stageCreators = creators.filter((c) => c.collaboration.stage === stg.id);
            const totalStageFollowers = stageCreators.reduce((acc, c) => acc + (c.instagramFollowers || 0), 0);

            return (
              <div
                key={stg.id}
                className="w-72 shrink-0 rounded-2xl bg-surface-secondary/50 border border-border flex flex-col max-h-[80vh] shadow-2xs"
              >
                {/* Column Header */}
                <div className={`p-3.5 rounded-t-2xl border-b border-border ${stg.colorBg}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black truncate ${stg.colorText}`}>
                      {stg.label}
                    </span>
                    <span className="w-5 h-5 rounded-full bg-surface text-foreground font-black text-[11px] flex items-center justify-center border border-border shadow-2xs shrink-0">
                      {stageCreators.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-foreground-muted mt-1">
                    <span className="truncate">{stg.description}</span>
                  </div>
                  {totalStageFollowers > 0 && (
                    <div className="text-[10px] text-foreground-secondary font-semibold mt-1">
                      Reach: {(totalStageFollowers / 1000).toFixed(0)}K audiens
                    </div>
                  )}
                </div>

                {/* Column Cards List */}
                <div className="p-2.5 overflow-y-auto space-y-2.5 flex-1 min-h-[140px]">
                  {stageCreators.length === 0 ? (
                    <div className="p-4 text-center rounded-xl border border-dashed border-border/70 text-[11px] text-foreground-muted italic">
                      Belum ada creator di tahap ini.
                    </div>
                  ) : (
                    stageCreators.map((creator) => {
                      const isVisual = creator.evaluation.priorityLevel === "visual";
                      const isReach = creator.evaluation.priorityLevel === "reach";
                      const currentIndex = PIPELINE_STAGES.findIndex((s) => s.id === creator.collaboration.stage);

                      return (
                        <div
                          key={creator.id}
                          onClick={() => onSelectCreator(creator)}
                          className="p-3 rounded-xl bg-surface border border-border hover:border-emerald-500/40 shadow-2xs hover:shadow-subtle transition-all cursor-pointer space-y-2 group"
                        >
                          {/* Top: Name & Handle */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h5 className="font-bold text-xs text-foreground truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                                {creator.name}
                              </h5>
                              <span className="text-[11px] text-foreground-muted truncate block">
                                @{creator.instagramHandle}
                              </span>
                            </div>

                            <span
                              className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded border shrink-0 ${
                                isVisual
                                  ? "bg-purple-50 text-purple-700 border-purple-200"
                                  : isReach
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-surface-secondary text-foreground-muted border-border"
                              }`}
                            >
                              {isVisual ? "Visual" : isReach ? "Reach" : "Std"}
                            </span>
                          </div>

                          {/* Location & Audience */}
                          <div className="flex items-center justify-between text-[11px] text-foreground-secondary pt-1 border-t border-border/60">
                            <span className="flex items-center gap-1 truncate">
                              <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                              {creator.city}
                            </span>
                            <span className="font-bold text-foreground shrink-0">
                              {creator.followersFormatted}
                            </span>
                          </div>

                          {/* Barter Product Tag */}
                          <div className="text-[10px] text-foreground-secondary flex items-start gap-1 p-1.5 rounded bg-surface-secondary/70 border border-border/50">
                            <Package className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{creator.collaboration.productSent}</span>
                          </div>

                          {/* Next Follow-up Alert (if any) */}
                          {creator.collaboration.nextFollowUpDate && (
                            <div className="flex items-center gap-1 text-[10px] text-amber-800 dark:text-amber-300 font-semibold">
                              <Clock className="w-3 h-3" />
                              <span>Follow-up: {creator.collaboration.nextFollowUpDate}</span>
                            </div>
                          )}

                          {/* Quick Stage Mover Controls */}
                          <div className="pt-2 border-t border-border flex items-center justify-between gap-1" onClick={(e) => e.stopPropagation()}>
                            {/* Prev Stage Button */}
                            <button
                              type="button"
                              disabled={currentIndex <= 0}
                              onClick={(e) => handleMoveStage(e, creator.id, creator.collaboration.stage, "prev")}
                              className="p-1 rounded bg-surface-secondary hover:bg-border text-foreground-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              title="Kembali ke tahap sebelumnya"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>

                            {/* Dropdown Stage Switcher */}
                            <select
                              value={creator.collaboration.stage}
                              onChange={(e) => handleStageSelectChange(e, creator.id)}
                              className="flex-1 text-[10px] font-semibold bg-surface border border-border rounded px-1.5 py-0.5 text-foreground truncate focus:outline-none focus:ring-1 focus:ring-emerald-600"
                            >
                              {PIPELINE_STAGES.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.shortLabel}
                                </option>
                              ))}
                            </select>

                            {/* Next Stage Button */}
                            <button
                              type="button"
                              disabled={currentIndex >= PIPELINE_STAGES.length - 1}
                              onClick={(e) => handleMoveStage(e, creator.id, creator.collaboration.stage, "next")}
                              className="p-1 rounded bg-surface-secondary hover:bg-border text-foreground-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              title="Lanjut ke tahap berikutnya"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
