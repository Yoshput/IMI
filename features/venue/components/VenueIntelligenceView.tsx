"use client";

import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";
import {
  Building2,
  MessageSquare,
  Calendar,
  ClipboardCheck,
  Wallet,
  MapPin,
  CheckCircle2,
  Bell,
  BarChart3,
  Loader2,
  Scale,
  FileText,
} from "lucide-react";
import { StateRenderer } from "@/components/shared/StateRenderer";
import { VenueDatabaseTab } from "./VenueDatabaseTab";
import { VenueCompareView } from "./VenueCompareView";
import { OutreachTab } from "./OutreachTab";
import { EventPlannerTab } from "./EventPlannerTab";
import { SurveyTab } from "./SurveyTab";
import { BudgetTab } from "./BudgetTab";
import { VenueReportsTab } from "./VenueReportsTab";

interface DashboardStats {
  totalVenues: number;
  verifiedVenues: number;
  followUpsDue: number;
  totalEvents: number;
  planningEvents: number;
  totalOutreach: number;
  averageScore: number;
  responseRate: number;
}

const tabs = [
  { id: "database", label: "Database Venue", icon: Building2 },
  { id: "compare", label: "Komparasi", icon: Scale },
  { id: "outreach", label: "Outreach CRM", icon: MessageSquare },
  { id: "events", label: "Event Planner", icon: Calendar },
  { id: "survey", label: "Survei Lapangan", icon: ClipboardCheck },
  { id: "budget", label: "Anggaran", icon: Wallet },
  { id: "reports", label: "Laporan & Ekspor", icon: FileText },
] as const;

type TabId = (typeof tabs)[number]["id"];

export const VenueIntelligenceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("database");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [viewState, setViewState] = useState<"loading" | "success" | "empty" | "error">("loading");

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/venue-dashboard");
      const json = await res.json();
      if (json.success && json.data) {
        setStats(json.data);
        setViewState("success");
      } else {
        setViewState("error");
      }
    } catch {
      setViewState("error");
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const kpiCards = [
    {
      label: "Total Venue",
      value: stats?.totalVenues ?? 0,
      icon: MapPin,
      color: "text-brand",
    },
    {
      label: "Terverifikasi",
      value: stats?.verifiedVenues ?? 0,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Perlu Follow-up",
      value: stats?.followUpsDue ?? 0,
      icon: Bell,
      color: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Event Direncanakan",
      value: stats?.planningEvents ?? 0,
      icon: Calendar,
      color: "text-blue-600 dark:text-blue-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-brand uppercase tracking-wider mb-1">
          <MapPin className="w-3.5 h-3.5" />
          Venue & Event Intelligence
        </div>
        <h1 className="heading-page">Intelijen Venue & Pengelolaan Event</h1>
        <p className="text-secondary-body mt-1">
          Riset, verifikasi, dan kelola venue untuk Content Creation Class, workshop, dan kegiatan promosi brand.
        </p>
      </div>

      <StateRenderer
        status={viewState}
        onRetry={fetchStats}
        emptyTitle="Belum Ada Data Venue"
        emptyDescription="Mulai dengan menambahkan kandidat venue baru ke database."
      >
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {kpiCards.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.label}
                className="bg-surface rounded-container border border-border p-4 flex flex-col gap-1"
              >
                <div className="flex items-center gap-1.5">
                  <Icon className={cn("w-3.5 h-3.5", kpi.color)} />
                  <span className="text-caption font-medium">{kpi.label}</span>
                </div>
                <span className="text-2xl font-bold text-foreground">
                  {formatNumber(kpi.value)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 border-b border-border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors shrink-0",
                  isActive
                    ? "bg-foreground text-surface font-semibold shadow-xs"
                    : "text-foreground-secondary hover:text-foreground hover:bg-surface-secondary"
                )}
              >
                <Icon className="w-3.5 h-3.5 shrink-0 opacity-85" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === "database" && <VenueDatabaseTab onStatsChange={fetchStats} />}
          {activeTab === "compare" && <VenueCompareView />}
          {activeTab === "outreach" && <OutreachTab />}
          {activeTab === "events" && <EventPlannerTab />}
          {activeTab === "survey" && <SurveyTab />}
          {activeTab === "budget" && <BudgetTab />}
          {activeTab === "reports" && <VenueReportsTab />}
        </div>
      </StateRenderer>
    </div>
  );
};
