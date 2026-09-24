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
  Info,
  Phone,
} from "lucide-react";
import {
  CustomerAftersalesRecord,
  FollowUpStatus,
  AFTERSALES_CS_PHONE,
  AFTERSALES_CS_WA_URL,
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
  const [showAddModal, setShowAddModal] = useState(false);

  // New customer form state
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newBranch, setNewBranch] = useState<"PWT" | "CLP" | "PBG" | "WNS" | "TGL">("PWT");
  const [newFrame, setNewFrame] = useState("");
  const [newLens, setNewLens] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newOdSph, setNewOdSph] = useState("");
  const [newOsSph, setNewOsSph] = useState("");
  const [newNotes, setNewNotes] = useState("");

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

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    try {
      const res = await fetch("/api/aftersales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          phone: newPhone.trim(),
          branchKey: newBranch,
          frameModel: newFrame.trim() || "Frame Optik I See You",
          lensType: newLens.trim() || "Bluechromic Anti Radiasi",
          totalTransaction: parseInt(newPrice) || 650000,
          prescription: {
            odSph: newOdSph || "-1.50",
            odCyl: "0.00",
            osSph: newOsSph || "-1.50",
            osCyl: "0.00",
            pd: "62",
          },
          notes: newNotes.trim() || "Input kasir / RO cabang",
          status: "belum_dihubungi",
        }),
      });
      const result = await res.json();
      if (result.success) {
        setShowAddModal(false);
        // reset form
        setNewName("");
        setNewPhone("");
        setNewFrame("");
        setNewLens("");
        setNewPrice("");
        setNewOdSph("");
        setNewOsSph("");
        setNewNotes("");
        fetchCustomers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [isSyncing, setIsSyncing] = useState(false);

  const handleLiveSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/aftersales?fresh=true");
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
      setIsSyncing(false);
    }
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
            Sistem rekam medis kacamata, status follow-up kenyamanan frame/lensa, review Google Maps, dan retensi customer. Klik baris customer untuk membuka detail lengkap & kirim WA.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleLiveSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-xs font-semibold text-foreground transition-all shadow-subtle disabled:opacity-50"
          >
            <span className={`w-2 h-2 rounded-full bg-emerald-500 ${isSyncing ? "animate-ping" : ""}`} />
            <span>{isSyncing ? "Menyinkronkan..." : "Sinkronkan Google Sheets"}</span>
          </button>

          <a
            href="https://docs.google.com/spreadsheets/d/10lKjuzUvWhnUKbKNEo4opo4MiQoesZKW4NhY9sQ4T8w/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-xs font-semibold text-foreground-secondary hover:text-foreground transition-all shadow-subtle"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Spreadsheet Asli</span>
          </a>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-foreground text-surface text-xs font-semibold hover:opacity-90 transition-all shadow-subtle"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Customer</span>
          </button>
        </div>
      </div>

      {/* Origin of Data Informative Banner */}
      <div className="p-3.5 rounded-xl bg-surface-secondary/40 border border-border flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-foreground flex items-center gap-1.5">
            <span>Terhubung Langsung ke Google Sheets Database Aftersales</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-normal">
              5.775+ Data Customer & 187 Log Feedback
            </span>
          </span>
          <p className="text-foreground-secondary text-[11px] leading-relaxed">
            Data customer di halaman ini ditarik langsung dari sheet <strong>DATA CUSTOMER</strong> (resep refraksi, ukuran lensa, model frame) dan sheet <strong>REKAP DATA</strong> (review & komplain 5 cabang) di spreadsheet Google Sheets Optik I See You.
          </p>
        </div>
      </div>

      {/* Official CS Aftersales Contact Bar */}
      <div className="p-3.5 rounded-xl bg-surface border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">WhatsApp CS Aftersales Resmi:</span>
              <span className="font-mono font-bold text-emerald-800 dark:text-emerald-400 text-xs sm:text-sm">
                {AFTERSALES_CS_PHONE}
              </span>
            </div>
            <p className="text-foreground-secondary text-[11px]">
              Kanal resmi layanan garansi, follow-up kenyamanan lensa, dan respon ulasan Google Maps 5 cabang.
            </p>
          </div>
        </div>
        <a
          href={AFTERSALES_CS_WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-all shadow-subtle shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Chat WhatsApp CS</span>
          <ExternalLink className="w-3 h-3 opacity-80" />
        </a>
      </div>

      {/* KPI Status Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <button
          onClick={() => setSelectedStatus(selectedStatus === "belum_dihubungi" ? "all" : "belum_dihubungi")}
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
          onClick={() => setSelectedStatus(selectedStatus === "sudah_dihubungi" ? "all" : "sudah_dihubungi")}
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
          onClick={() => setSelectedStatus(selectedStatus === "butuh_garansi" ? "all" : "butuh_garansi")}
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
          onClick={() => setSelectedStatus(selectedStatus === "selesai_puas" ? "all" : "selesai_puas")}
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
                placeholder="Cari nama, no WA, frame, lensa..."
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
                        Detail & WA
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

      {/* Add New Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-border rounded-2xl max-w-lg w-full p-5 shadow-elevated space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Tambah Data Pelanggan Baru (Aftersales)
                </h3>
                <p className="text-xs text-foreground-muted">
                  Catat riwayat pembelian kacamata untuk monitoring berkala.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-foreground-muted hover:text-foreground text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Dimas Arya"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">Nomor WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 6281229837411"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Cabang Pembelian</label>
                  <select
                    value={newBranch}
                    onChange={(e: any) => setNewBranch(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
                  >
                    <option value="PWT">Purwokerto (Pusat)</option>
                    <option value="CLP">Cilacap</option>
                    <option value="PBG">Purbalingga</option>
                    <option value="WNS">Wonosobo</option>
                    <option value="TGL">Lunar Eyewear Tegal</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">Total Transaksi (Rp)</label>
                  <input
                    type="number"
                    placeholder="650000"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Model Frame Kacamata</label>
                <input
                  type="text"
                  placeholder="Contoh: Vintage Titanium Round Black Gold"
                  value={newFrame}
                  onChange={(e) => setNewFrame(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Jenis Lensa</label>
                <input
                  type="text"
                  placeholder="Contoh: Bluechromic Night Drive (Anti Silau)"
                  value={newLens}
                  onChange={(e) => setNewLens(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Ukuran Kanan (OD SPH)</label>
                  <input
                    type="text"
                    placeholder="-1.50"
                    value={newOdSph}
                    onChange={(e) => setNewOdSph(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-brand font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">Ukuran Kiri (OS SPH)</label>
                  <input
                    type="text"
                    placeholder="-1.75"
                    value={newOsSph}
                    onChange={(e) => setNewOsSph(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-brand font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Catatan Staf / Keluhan Awal</label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Customer kerja depan monitor 8 jam sehari..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-foreground-secondary hover:text-foreground"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-foreground text-surface font-semibold hover:opacity-90"
                >
                  Simpan Pelanggan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
