"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  Users,
  Database,
  SlidersHorizontal,
  Kanban,
  MessageSquare,
  Flag,
  Plus,
  Printer,
  Download,
  Sparkles,
  RefreshCw,
  Package,
} from "lucide-react";
import {
  Creator,
  Campaign,
  KolSubmodule,
  PipelineStage,
} from "../types";
import {
  getStoredCreators,
  saveCreatorsLocally,
  persistCreator,
  deleteStoredCreator,
  updateCreatorPipelineStage,
  getStoredCampaigns,
  saveCampaignsLocally,
  exportCreatorsCSV,
} from "../services/kol-storage";

// Submodules
import { KolOverviewSubmodule } from "./KolOverviewSubmodule";
import { KolDatabaseSubmodule } from "./KolDatabaseSubmodule";
import { KolEvaluateSubmodule } from "./KolEvaluateSubmodule";
import { KolPipelineSubmodule } from "./KolPipelineSubmodule";
import { KolMessageGeneratorSubmodule } from "./KolMessageGeneratorSubmodule";
import { KolCampaignTrackingSubmodule } from "./KolCampaignTrackingSubmodule";

// Modals
import { CreatorDetailModal } from "./CreatorDetailModal";
import { CreatorFormModal } from "./CreatorFormModal";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { CampaignFormModal } from "./CampaignFormModal";
import { PrintableCollaborationSummary } from "./PrintableCollaborationSummary";

export const KolPartnershipModule: React.FC = () => {
  const [activeSubmodule, setActiveSubmodule] = useState<KolSubmodule>("overview");
  const [creators, setCreators] = useState<Creator[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Selected states for modals
  const [selectedCreatorForDetail, setSelectedCreatorForDetail] = useState<Creator | null>(null);
  const [selectedCreatorForForm, setSelectedCreatorForForm] = useState<Creator | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [creatorToDelete, setCreatorToDelete] = useState<Creator | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCampaignForForm, setSelectedCampaignForForm] = useState<Campaign | null>(null);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isPrintSummaryOpen, setIsPrintSummaryOpen] = useState(false);

  // Preselected creator for Message Generator
  const [preselectedCreatorForMessage, setPreselectedCreatorForMessage] = useState<Creator | null>(null);

  // Initial load
  useEffect(() => {
    const loadedCreators = getStoredCreators();
    const loadedCampaigns = getStoredCampaigns();
    setCreators(loadedCreators);
    setCampaigns(loadedCampaigns);
    setIsLoaded(true);

    // Sync with API in background
    fetch("/api/kol")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.creators) && data.creators.length > 0) {
          // Keep API creators if they have full schema or merge
          setCreators((prev) => (prev.length > 0 ? prev : data.creators));
        }
      })
      .catch((err) => {
        console.warn("Background API fetch error (using local storage):", err);
      });
  }, []);

  // Creator handlers
  const handleSaveCreator = async (creator: Creator) => {
    startTransition(async () => {
      const updated = await persistCreator(creator);
      setCreators(updated);
      if (selectedCreatorForDetail && selectedCreatorForDetail.id === creator.id) {
        setSelectedCreatorForDetail(creator);
      }
    });
  };

  const handleDeleteCreator = async (creatorId: string) => {
    startTransition(async () => {
      const updated = await deleteStoredCreator(creatorId);
      setCreators(updated);
      if (selectedCreatorForDetail?.id === creatorId) {
        setSelectedCreatorForDetail(null);
      }
    });
  };

  const handleUpdateStage = async (creatorId: string, newStage: PipelineStage, note?: string) => {
    startTransition(async () => {
      const updated = await updateCreatorPipelineStage(creatorId, newStage, note);
      setCreators(updated);
      if (selectedCreatorForDetail && selectedCreatorForDetail.id === creatorId) {
        const found = updated.find((c) => c.id === creatorId);
        if (found) setSelectedCreatorForDetail(found);
      }
    });
  };

  const handleOpenMessageForCreator = (creator: Creator) => {
    setPreselectedCreatorForMessage(creator);
    setActiveSubmodule("messages");
    if (selectedCreatorForDetail) {
      setSelectedCreatorForDetail(null);
    }
  };

  // Campaign handlers
  const handleSaveCampaign = (campaign: Campaign) => {
    const existingIndex = campaigns.findIndex((c) => c.id === campaign.id);
    let updatedCampaigns: Campaign[];
    if (existingIndex >= 0) {
      campaigns[existingIndex] = campaign;
      updatedCampaigns = [...campaigns];
    } else {
      updatedCampaigns = [campaign, ...campaigns];
    }
    setCampaigns(updatedCampaigns);
    saveCampaignsLocally(updatedCampaigns);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900/40 via-slate-900 to-slate-900/90 border border-emerald-500/20 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" /> Barter Produk Kacamata Nasional
              </span>
              <span className="text-xs text-slate-400">
                • {creators.length} Creator Terdaftar
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              KOL & Creator Partnership Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Sistem manajemen terintegrasi untuk penemuan, evaluasi visual vs reach, pengiriman kacamata gratis ke rumah creator tanpa visit toko, hingga pemantauan 14 tahapan pipeline kolaborasi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                setSelectedCreatorForForm(null);
                setIsFormModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Creator</span>
            </button>

            <button
              onClick={() => setIsPrintSummaryOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
              title="Cetak Ringkasan Eksekutif untuk Rapat Tim"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Cetak Laporan</span>
            </button>

            <button
              onClick={() => exportCreatorsCSV(creators)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
              title="Unduh Data Database KOL ke format CSV / Excel"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Submodule Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1 sm:gap-2 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveSubmodule("overview")}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeSubmodule === "overview"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 rounded-t-xl"
              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Overview & Ringkasan</span>
        </button>

        <button
          onClick={() => setActiveSubmodule("database")}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeSubmodule === "database"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 rounded-t-xl"
              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Creator Database</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {creators.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubmodule("evaluate")}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeSubmodule === "evaluate"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 rounded-t-xl"
              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Find & Evaluate</span>
        </button>

        <button
          onClick={() => setActiveSubmodule("pipeline")}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeSubmodule === "pipeline"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 rounded-t-xl"
              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <Kanban className="w-4 h-4" />
          <span>Collaboration Pipeline</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
            14 Tahap
          </span>
        </button>

        <button
          onClick={() => setActiveSubmodule("messages")}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeSubmodule === "messages"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 rounded-t-xl"
              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Message Generator</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">
            9 Template
          </span>
        </button>

        <button
          onClick={() => setActiveSubmodule("campaigns")}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeSubmodule === "campaigns"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 rounded-t-xl"
              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>Campaign Tracking</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold">
            {campaigns.length}
          </span>
        </button>
      </div>

      {/* Main Submodule Content View */}
      <div className="transition-opacity duration-200">
        {activeSubmodule === "overview" && (
          <KolOverviewSubmodule
            creators={creators}
            campaigns={campaigns}
            onNavigateSubmodule={(submodule) => setActiveSubmodule(submodule)}
            onSelectCreator={(creator) => setSelectedCreatorForDetail(creator)}
          />
        )}

        {activeSubmodule === "database" && (
          <KolDatabaseSubmodule
            creators={creators}
            onSelectCreator={(creator) => setSelectedCreatorForDetail(creator)}
            onEditCreator={(creator) => {
              setSelectedCreatorForForm(creator);
              setIsFormModalOpen(true);
            }}
            onDeleteCreator={(creator) => {
              setCreatorToDelete(creator);
              setIsDeleteModalOpen(true);
            }}
            onAddNewCreator={() => {
              setSelectedCreatorForForm(null);
              setIsFormModalOpen(true);
            }}
            onOpenMessageGenerator={handleOpenMessageForCreator}
          />
        )}

        {activeSubmodule === "evaluate" && (
          <KolEvaluateSubmodule
            creators={creators}
            onSelectCreator={(creator) => setSelectedCreatorForDetail(creator)}
            onAddNewCreator={() => {
              setSelectedCreatorForForm(null);
              setIsFormModalOpen(true);
            }}
            onOpenMessageGenerator={handleOpenMessageForCreator}
          />
        )}

        {activeSubmodule === "pipeline" && (
          <KolPipelineSubmodule
            creators={creators}
            onSelectCreator={(creator) => setSelectedCreatorForDetail(creator)}
            onUpdateCreatorStage={handleUpdateStage}
            onOpenMessageGenerator={handleOpenMessageForCreator}
            onAddNewCreator={() => {
              setSelectedCreatorForForm(null);
              setIsFormModalOpen(true);
            }}
          />
        )}

        {activeSubmodule === "messages" && (
          <KolMessageGeneratorSubmodule
            creators={creators}
            initialCreator={preselectedCreatorForMessage}
            onUpdateCreatorStage={handleUpdateStage}
          />
        )}

        {activeSubmodule === "campaigns" && (
          <KolCampaignTrackingSubmodule
            campaigns={campaigns}
            creators={creators}
            onSelectCreator={(creator) => setSelectedCreatorForDetail(creator)}
            onAddNewCampaign={() => {
              setSelectedCampaignForForm(null);
              setIsCampaignModalOpen(true);
            }}
          />
        )}
      </div>

      {/* MODALS */}
      {/* 1. Creator Detail Modal */}
      <CreatorDetailModal
        creator={selectedCreatorForDetail}
        onClose={() => setSelectedCreatorForDetail(null)}
        onEdit={(creator) => {
          setSelectedCreatorForForm(creator);
          setIsFormModalOpen(true);
        }}
        onDelete={(creator) => {
          setCreatorToDelete(creator);
          setIsDeleteModalOpen(true);
        }}
        onOpenMessageGenerator={handleOpenMessageForCreator}
        onUpdateStage={handleUpdateStage}
      />

      {/* 2. Creator Form Modal (Add/Edit) */}
      <CreatorFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedCreatorForForm(null);
        }}
        onSave={handleSaveCreator}
        initialData={selectedCreatorForForm}
      />

      {/* 3. Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteModalOpen}
        creator={creatorToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCreatorToDelete(null);
        }}
        onConfirm={handleDeleteCreator}
      />

      {/* 4. Campaign Form Modal */}
      <CampaignFormModal
        isOpen={isCampaignModalOpen}
        onClose={() => {
          setIsCampaignModalOpen(false);
          setSelectedCampaignForForm(null);
        }}
        onSave={handleSaveCampaign}
        initialData={selectedCampaignForForm}
      />

      {/* 5. Printable Collaboration Summary */}
      {isPrintSummaryOpen && (
        <PrintableCollaborationSummary
          creators={creators}
          campaigns={campaigns}
          onClose={() => setIsPrintSummaryOpen(false)}
        />
      )}
    </div>
  );
};
