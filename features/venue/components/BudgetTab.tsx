"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";
import type { Event, EventBudget, BudgetCategory } from "@/lib/venue-types";
import { getBudgetCategoryLabel } from "@/lib/venue-types";
import { Wallet, TrendingUp, TrendingDown, Minus, FileQuestion } from "lucide-react";

const BUDGET_CATEGORIES: BudgetCategory[] = [
  "sewa_venue", "konsumsi", "honor_narasumber", "transportasi", "peralatan",
  "dekorasi_branding", "dokumentasi", "materi_promosi", "merchandise", "operasional", "pajak", "contingency",
];

export const BudgetTab: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/venue-events");
        const json = await res.json();
        if (json.success && json.data) setEvents(json.data);
      } catch { /* empty */ }
      setLoading(false);
    })();
  }, []);

  const selectedEvent = events.find((e) => e.id === selectedEventId);
  const budget = selectedEvent?.budget;

  const fmtCurrency = (v: number | null | undefined) => {
    if (v === null || v === undefined) return "—";
    return `Rp${formatNumber(v)}`;
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <Wallet className="w-10 h-10 text-foreground-muted mb-3" />
        <h3 className="text-sm font-semibold text-foreground">Belum Ada Event</h3>
        <p className="text-xs text-foreground-muted mt-1">Buat event terlebih dahulu untuk mengelola anggaran.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Event Selector */}
      <div>
        <label className="block text-[11px] font-semibold text-foreground-secondary mb-1.5">Pilih Event</label>
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="px-3 py-2 bg-surface border border-border rounded-control text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40 w-full max-w-md"
        >
          <option value="">— Pilih event —</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>{ev.name}</option>
          ))}
        </select>
      </div>

      {!selectedEventId && (
        <div className="flex flex-col items-center py-12 text-center">
          <FileQuestion className="w-8 h-8 text-foreground-muted mb-2" />
          <p className="text-xs text-foreground-muted">Pilih event untuk melihat anggaran.</p>
        </div>
      )}

      {selectedEventId && (
        <>
          {/* Budget Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Estimasi Total", value: budget?.totalEstimated, icon: Wallet, color: "text-blue-600 dark:text-blue-400" },
              { label: "Disetujui", value: budget?.totalApproved, icon: Wallet, color: "text-emerald-600 dark:text-emerald-400" },
              { label: "Aktual", value: budget?.totalActual, icon: Wallet, color: "text-foreground" },
              {
                label: "Variance",
                value: budget?.variance,
                icon: budget?.variance && budget.variance > 0 ? TrendingUp : budget?.variance && budget.variance < 0 ? TrendingDown : Minus,
                color: budget?.variance && budget.variance > 0
                  ? "text-red-600 dark:text-red-400"
                  : budget?.variance && budget.variance < 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-foreground-muted",
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="bg-surface rounded-container border border-border p-4">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className={cn("w-3.5 h-3.5", card.color)} />
                    <span className="text-caption font-medium">{card.label}</span>
                  </div>
                  <div className={cn("text-lg font-bold", card.color)}>
                    {card.value !== null && card.value !== undefined
                      ? fmtCurrency(card.value)
                      : <span className="text-foreground-muted text-sm italic">Belum dapat dihitung</span>
                    }
                  </div>
                </div>
              );
            })}
          </div>

          {/* Budget Items Table */}
          <div className="bg-surface rounded-container border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground">Rincian Anggaran</h3>
            </div>
            {!budget || !budget.items || budget.items.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-xs text-foreground-muted italic">Belum ada item anggaran ditambahkan untuk event ini.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-surface-secondary/50">
                      <th className="text-left px-4 py-2.5 font-semibold text-foreground-secondary">Kategori</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-foreground-secondary">Deskripsi</th>
                      <th className="text-right px-4 py-2.5 font-semibold text-foreground-secondary">Estimasi</th>
                      <th className="text-right px-4 py-2.5 font-semibold text-foreground-secondary">Penawaran</th>
                      <th className="text-right px-4 py-2.5 font-semibold text-foreground-secondary">Disetujui</th>
                      <th className="text-right px-4 py-2.5 font-semibold text-foreground-secondary">Aktual</th>
                      <th className="text-right px-4 py-2.5 font-semibold text-foreground-secondary">Dibayar</th>
                      <th className="text-right px-4 py-2.5 font-semibold text-foreground-secondary">Sisa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budget.items.map((item) => (
                      <tr key={item.id} className="border-b border-border/50">
                        <td className="px-4 py-2"><span className="inline-block px-2 py-0.5 rounded-full bg-surface-subtle text-[10px] font-medium">{getBudgetCategoryLabel(item.category)}</span></td>
                        <td className="px-4 py-2 text-foreground">{item.description || "—"}</td>
                        <td className="px-4 py-2 text-right text-foreground-secondary">{fmtCurrency(item.estimatedCost)}</td>
                        <td className="px-4 py-2 text-right text-foreground-secondary">{fmtCurrency(item.quotedCost)}</td>
                        <td className="px-4 py-2 text-right text-foreground-secondary">{fmtCurrency(item.approvedBudget)}</td>
                        <td className="px-4 py-2 text-right text-foreground">{fmtCurrency(item.actualCost)}</td>
                        <td className="px-4 py-2 text-right text-foreground-secondary">{fmtCurrency(item.paidAmount)}</td>
                        <td className="px-4 py-2 text-right text-foreground-secondary">{fmtCurrency(item.outstandingAmount)}</td>
                      </tr>
                    ))}
                    {/* Totals */}
                    <tr className="bg-surface-secondary/50 font-semibold">
                      <td className="px-4 py-2.5" colSpan={2}>Total</td>
                      <td className="px-4 py-2.5 text-right">{fmtCurrency(budget.totalEstimated)}</td>
                      <td className="px-4 py-2.5 text-right">{fmtCurrency(budget.totalQuoted)}</td>
                      <td className="px-4 py-2.5 text-right">{fmtCurrency(budget.totalApproved)}</td>
                      <td className="px-4 py-2.5 text-right">{fmtCurrency(budget.totalActual)}</td>
                      <td className="px-4 py-2.5 text-right">{fmtCurrency(budget.totalPaid)}</td>
                      <td className="px-4 py-2.5 text-right">{fmtCurrency(budget.totalOutstanding)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
