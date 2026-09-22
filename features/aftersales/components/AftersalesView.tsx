"use client";

import React, { useState, useEffect } from "react";
import {
  HeartHandshake,
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Send,
  Eye,
  Glasses,
  MapPin,
  ExternalLink,
  ChevronRight,
  Plus,
} from "lucide-react";
import {
  CustomerAftersalesRecord,
  FollowUpStatus,
} from "@/lib/aftersales";
import { CustomerDetailModal } from "./CustomerDetailModal";

export const AftersalesView: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerAftersalesRecord[]>([]);
  const [counts, setCounts] = useState({
    total: 0,
    belum_dihubungi: 0,
    sudah_dihubungi: 0,
    selesai_puas: 0,
    butuh_garansi: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerAftersalesRecord | null>(null);

  const fetchCustomers = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedBranch !== "all") params.set("branch", selectedBranch);
      if (selectedStatus !== "all") params.set("status", selectedStatus);
      if (searchQuery.trim()) params.set("q", searchQuery.trim());

      const res = await fetch(`/api/aftersales?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setCustomers(json.data);
        if (json.counts) {
          setCounts(json.counts);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [selectedBranch, selectedStatus, searchQuery]);

  const handleUpdateCustomer = (updated: CustomerAftersalesRecord) => {
    setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setSelectedCustomer(updated);
    fetchCustomers();
  };

  const getStatusBadge = (status: FollowUpStatus) => {
    switch (status) {
      case "belum_dihubungi":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" /> Belum Dihubungi
          </span>
        );
      case "sudah_dihubungi":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
            <CheckCircle2 className="w-3 h-3" /> Sudah Dihubungi
          </span>
        );
      case "selesai_puas":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Selesai / Puas
          </span>
        );
      case "butuh_garansi":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20">
            <ShieldAlert className="w-3 h-3" /> Perlu Garansi
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-light text-brand border border-brand/20 flex items-center gap-1">
              <HeartHandshake className="w-3 h-3" /> CRM & AFTERSALES
            </span>
            <span className="text-xs text-foreground-muted">5 Cabang Operasional</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Layanan Aftersales & Kepuasan Pelanggan
          </h1>
          <p className="text-xs text-foreground-secondary mt-1">
            Sistem rekam medis kacamata, status follow-up kenyamanan lensa, garansi, dan retensi customer. Klik baris customer untuk melihat detail lengkap.
          </p>
        </div>
      </div>

      {/* KPI Status Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <button
          onClick={() => setSelectedStatus("belum_dihubungi")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedStatus === "belum_dihubungi"
              ? "border-amber-500 bg-amber-500/10 shadow-subtle"
              : "border-border bg-surface hover:bg-surface-secondary/50"
          }`}
        >
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Belum Dihubungi
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-foreground tabular-nums">
            {counts.belum_dihubungi}
          </div>
          <span className="text-[10px] text-foreground-muted block mt-0.5">
            Perlu dihubungi H+3/H+7
          </span>
        </button>

        <button
          onClick={() => setSelectedStatus("sudah_dihubungi")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedStatus === "sudah_dihubungi"
              ? "border-blue-500 bg-blue-500/10 shadow-subtle"
              : "border-border bg-surface hover:bg-surface-secondary/50"
          }`}
        >
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
              Sedang Dihubungi
            </span>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-foreground tabular-nums">
            {counts.sudah_dihubungi}
          </div>
          <span className="text-[10px] text-foreground-muted block mt-0.5">
            Menunggu feedback kenyamanan
          </span>
        </button>

        <button
          onClick={() => setSelectedStatus("butuh_garansi")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedStatus === "butuh_garansi"
              ? "border-red-500 bg-red-500/10 shadow-subtle"
              : "border-border bg-surface hover:bg-surface-secondary/50"
          }`}
        >
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
              Perlu Garansi / Servis
            </span>
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400 tabular-nums">
            {counts.butuh_garansi}
          </div>
          <span className="text-[10px] text-red-600/80 block mt-0.5">
            Re-fitting atau kendala lensa
          </span>
        </button>

        <button
          onClick={() => setSelectedStatus("selesai_puas")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedStatus === "selesai_puas"
              ? "border-emerald-500 bg-emerald-500/10 shadow-subtle"
              : "border-border bg-surface hover:bg-surface-secondary/50"
          }`}
        >
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Selesai & Puas
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {counts.selesai_puas}
          </div>
          <span className="text-[10px] text-emerald-600/80 block mt-0.5">
            Review bintang 5 / nyaman
          </span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-border bg-surface p-4 shadow-subtle space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, no WA, lensa..."
                className="w-full pl-9 pr-3 py-1.5 bg-surface-secondary border border-border rounded-lg text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            {/* Branch Filter */}
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-2.5 py-1.5 bg-surface-secondary border border-border rounded-lg text-xs text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="all">Semua Cabang (5 Cabang)</option>
              <option value="pwt">Purwokerto (Pusat)</option>
              <option value="clp">Cilacap</option>
              <option value="pbg">Purbalingga</option>
              <option value="wns">Wonosobo</option>
              <option value="tgl">Lunar Eyewear Tegal</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 bg-surface-secondary border border-border rounded-lg text-xs text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="all">Semua Status</option>
              <option value="belum_dihubungi">Belum Dihubungi</option>
              <option value="sudah_dihubungi">Sudah Dihubungi</option>
              <option value="selesai_puas">Selesai / Puas</option>
              <option value="butuh_garansi">Perlu Garansi</option>
            </select>
          </div>

          <span className="text-[11px] text-foreground-muted self-end md:self-auto">
            Ditemukan {customers.length} data customer
          </span>
        </div>

        {/* Customer Interactive Table */}
        <div className="overflow-x-auto border border-border/80 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary text-foreground-secondary border-b border-border text-[10px] uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-3">Nama Pelanggan</th>
                <th className="py-2.5 px-3">Cabang</th>
                <th className="py-2.5 px-3">Model Kacamata & Lensa</th>
                <th className="py-2.5 px-3">Ukuran Resep (R/L)</th>
                <th className="py-2.5 px-3">Status Aftersales</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-foreground-muted">
                    Memuat data CRM customer...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-foreground-muted">
                    Tidak ada customer yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                customers.map((cust) => (
                  <tr
                    key={cust.id}
                    onClick={() => setSelectedCustomer(cust)}
                    className="hover:bg-brand-light/30 cursor-pointer transition-colors group"
                  >
                    {/* Name & Phone */}
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-foreground group-hover:text-brand transition-colors flex items-center gap-1.5">
                        <span>{cust.name}</span>
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-brand" />
                      </div>
                      <span className="text-[10px] text-foreground-muted block">{cust.phone}</span>
                    </td>

                    {/* Branch */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="font-medium text-foreground">{cust.city}</span>
                      <span className="text-[10px] text-foreground-muted block">
                        Ambil: {cust.pickupDate}
                      </span>
                    </td>

                    {/* Frame & Lens */}
                    <td className="py-2.5 px-3 max-w-xs">
                      <p className="font-medium text-foreground truncate">{cust.frameModel}</p>
                      <p className="text-[10px] text-foreground-muted truncate">{cust.lensType}</p>
                    </td>

                    {/* Prescription snippet */}
                    <td className="py-2.5 px-3 font-mono text-[11px] tabular-nums whitespace-nowrap">
                      <div>R: {cust.prescription.odSph} {cust.prescription.odCyl !== "0.00" ? cust.prescription.odCyl : ""}</div>
                      <div className="text-foreground-muted">L: {cust.prescription.osSph} {cust.prescription.osCyl !== "0.00" ? cust.prescription.osCyl : ""}</div>
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {getStatusBadge(cust.status)}
                    </td>

                    {/* Action */}
                    <td className="py-2.5 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedCustomer(cust)}
                        className="px-2.5 py-1 rounded bg-surface border border-border text-[11px] font-semibold text-foreground-secondary hover:text-foreground hover:bg-surface-secondary transition-all"
                      >
                        Detail Lengkap
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drill-down Customer Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onUpdateCustomer={handleUpdateCustomer}
        />
      )}
    </div>
  );
};
