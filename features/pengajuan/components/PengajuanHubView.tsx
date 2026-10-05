"use client";

import React, { useState, useEffect } from "react";
import {
  Handshake,
  Home,
  MessageSquare,
  FileText,
  Calendar,
  Users,
  MapPin,
  Clock,
  ExternalLink,
  CheckCircle2,
  Send,
  Copy,
  Check,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Eye,
  AlertCircle,
  Stethoscope,
  Building2,
  Sparkles,
} from "lucide-react";
import {
  SponsorSubmissionItem,
  MARKETING_STAFF_PHONE,
  buildSponsorWhatsAppUrl,
  buildSponsorWhatsAppMessage,
  HomeServiceSubmissionItem,
  BRANCH_CS_CONFIG,
  buildHomeServiceWhatsAppUrl,
  buildHomeServiceWhatsAppMessage,
} from "@/lib/pengajuan-service";

export const PengajuanHubView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"sponsor" | "homeservice">("sponsor");

  // Sponsor state
  const [sponsorList, setSponsorList] = useState<SponsorSubmissionItem[]>([]);
  const [isSponsorLoading, setIsSponsorLoading] = useState(false);
  const [sponsorBranchFilter, setSponsorBranchFilter] = useState("all");
  const [sponsorSearch, setSponsorSearch] = useState("");
  const [copiedSponsorId, setCopiedSponsorId] = useState<string | null>(null);

  // Sponsor Form
  const [sApplicantName, setSApplicantName] = useState("");
  const [sInstitution, setSInstitution] = useState("");
  const [sPhone, setSPhone] = useState("");
  const [sTargetBranch, setSTargetBranch] = useState("Purwokerto (Pusat)");
  const [sEventName, setSEventName] = useState("");
  const [sEventDate, setSEventDate] = useState("");
  const [sDescription, setSDescription] = useState("");
  const [sTargetAudience, setSTargetAudience] = useState<number | string>(100);
  const [sProposalUrl, setSProposalUrl] = useState("");
  const [sOfferedBenefits, setSOfferedBenefits] = useState("");
  const [sIsSubmitting, setSIsSubmitting] = useState(false);
  const [sSuccessMsg, setSSuccessMsg] = useState<string | null>(null);
  const [sLastSubmittedItem, setSLastSubmittedItem] = useState<SponsorSubmissionItem | null>(null);

  // Home Service state
  const [homeServiceList, setHomeServiceList] = useState<HomeServiceSubmissionItem[]>([]);
  const [isHsLoading, setIsHsLoading] = useState(false);
  const [hsBranchFilter, setHsBranchFilter] = useState("all");
  const [hsSearch, setHsSearch] = useState("");

  // Home Service Form
  const [hsCustomerName, setHsCustomerName] = useState("");
  const [hsCustomerPhone, setHsCustomerPhone] = useState("");
  const [hsBranchKey, setHsBranchKey] = useState<"pwt" | "pbg" | "clp" | "wns">("pwt");
  const [hsServiceDate, setHsServiceDate] = useState("");
  const [hsServiceTime, setHsServiceTime] = useState("10:00");
  const [hsAddress, setHsAddress] = useState("");
  const [hsParticipantCount, setHsParticipantCount] = useState<number | string>(1);
  const [hsComplaint, setHsComplaint] = useState("");
  const [hsIsSubmitting, setHsIsSubmitting] = useState(false);
  const [hsSuccessMsg, setHsSuccessMsg] = useState<string | null>(null);
  const [hsLastSubmittedItem, setHsLastSubmittedItem] = useState<HomeServiceSubmissionItem | null>(null);

  // Fetch Sponsor submissions
  const fetchSponsors = async () => {
    setIsSponsorLoading(true);
    try {
      const res = await fetch("/api/sponsor-submission");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setSponsorList(json.data);
      }
    } catch (e) {
      console.error("Gagal load data sponsor:", e);
    } finally {
      setIsSponsorLoading(false);
    }
  };

  // Fetch Home Service submissions
  const fetchHomeServices = async () => {
    setIsHsLoading(true);
    try {
      const res = await fetch("/api/home-service-submission");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setHomeServiceList(json.data);
      }
    } catch (e) {
      console.error("Gagal load data home service:", e);
    } finally {
      setIsHsLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
    fetchHomeServices();
  }, []);

  // Submit Sponsor Form
  const handleSponsorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sApplicantName.trim() || !sEventName.trim()) {
      alert("Nama pemohon dan nama kegiatan wajib diisi!");
      return;
    }
    setSIsSubmitting(true);
    setSSuccessMsg(null);
    try {
      const res = await fetch("/api/sponsor-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicantName: sApplicantName,
          institution: sInstitution,
          applicantPhone: sPhone,
          targetBranch: sTargetBranch,
          eventName: sEventName,
          eventDate: sEventDate,
          description: sDescription,
          targetAudience: Number(sTargetAudience) || 100,
          proposalUrl: sProposalUrl,
          offeredBenefits: sOfferedBenefits,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setSSuccessMsg("Pengajuan sponsorship berhasil dikirim dan tersimpan di database!");
        setSLastSubmittedItem(json.data);
        fetchSponsors();
        // Reset form fields
        setSApplicantName("");
        setSInstitution("");
        setSPhone("");
        setSEventName("");
        setSEventDate("");
        setSDescription("");
        setSTargetAudience(100);
        setSProposalUrl("");
        setSOfferedBenefits("");
      } else {
        alert(json.error || "Gagal mengirim pengajuan");
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setSIsSubmitting(false);
    }
  };

  // Submit Home Service Form
  const handleHsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hsCustomerName.trim() || !hsAddress.trim() || !hsServiceDate.trim()) {
      alert("Nama, alamat, dan tanggal jadwal wajib diisi!");
      return;
    }
    setHsIsSubmitting(true);
    setHsSuccessMsg(null);
    try {
      const res = await fetch("/api/home-service-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: hsCustomerName,
          customerPhone: hsCustomerPhone,
          branchKey: hsBranchKey,
          serviceDate: hsServiceDate,
          serviceTime: hsServiceTime,
          address: hsAddress,
          participantCount: Number(hsParticipantCount) || 1,
          complaint: hsComplaint,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setHsSuccessMsg("Booking Home Service berhasil diajukan dan dijadwalkan!");
        setHsLastSubmittedItem(json.data);
        fetchHomeServices();
        // Reset form fields
        setHsCustomerName("");
        setHsCustomerPhone("");
        setHsServiceDate("");
        setHsServiceTime("10:00");
        setHsAddress("");
        setHsParticipantCount(1);
        setHsComplaint("");
      } else {
        alert(json.error || "Gagal mengirim booking");
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setHsIsSubmitting(false);
    }
  };

  // Filtered lists
  const filteredSponsors = sponsorList.filter((item) => {
    if (sponsorBranchFilter !== "all" && !item.targetBranch.toLowerCase().includes(sponsorBranchFilter.toLowerCase())) {
      return false;
    }
    if (sponsorSearch.trim()) {
      const q = sponsorSearch.toLowerCase();
      const matchName = item.applicantName.toLowerCase().includes(q);
      const matchInst = item.institution.toLowerCase().includes(q);
      const matchEvent = item.eventName.toLowerCase().includes(q);
      return matchName || matchInst || matchEvent;
    }
    return true;
  });

  const filteredHomeServices = homeServiceList.filter((item) => {
    if (hsBranchFilter !== "all" && item.branchKey !== hsBranchFilter) {
      return false;
    }
    if (hsSearch.trim()) {
      const q = hsSearch.toLowerCase();
      const matchName = item.customerName.toLowerCase().includes(q);
      const matchAddr = item.address.toLowerCase().includes(q);
      return matchName || matchAddr;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-surface border border-border rounded-container p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-light text-brand">
              Portal Layanan Mandiri &amp; Pengajuan Resmi
            </span>
            <span className="text-xs text-foreground-muted">
              optikiseeyou.com
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mt-1 tracking-tight">
            Pengajuan Sponsorship &amp; Booking Home Service
          </h1>
          <p className="text-xs text-foreground-secondary mt-1 max-w-2xl">
            Sistem pengajuan resmi terintegrasi tanpa Google Form. Terkoneksi langsung ke database persisten serta routing WhatsApp otomatis ke Staff Marketing (Mas Yoshput) dan CS 4 Cabang Optik I See You.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-secondary rounded-xl border border-border shrink-0 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("sponsor")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "sponsor"
                ? "bg-foreground text-surface shadow-subtle"
                : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            <Handshake className="w-4 h-4 text-amber-500" />
            <span>Pengajuan Sponsorship ({sponsorList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("homeservice")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "homeservice"
                ? "bg-foreground text-surface shadow-subtle"
                : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            <Home className="w-4 h-4 text-teal-500" />
            <span>Booking Home Service ({homeServiceList.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PENGAJUAN SPONSORSHIP */}
      {/* ========================================================================= */}
      {activeTab === "sponsor" && (
        <div className="space-y-6">
          {/* Information & Direct Contact Banner */}
          <div className="p-4 rounded-xl border border-amber-300/80 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-start gap-2.5">
              <Handshake className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sm block text-amber-950 dark:text-amber-100">
                  Direct WhatsApp ke Staff Marketing: Mas Yoshput ({MARKETING_STAFF_PHONE})
                </span>
                <p className="text-[12px] font-medium text-amber-900 dark:text-amber-200 mt-0.5 leading-relaxed">
                  Setiap pengajuan sponsor yang masuk langsung dapat diteruskan ke nomor WhatsApp resmi Marketing dengan format pesan template terstruktur dan tautan proposal Google Drive.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <a
                href="/proposal-sponsor"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#800020] hover:bg-[#600018] text-white font-bold text-xs whitespace-nowrap shadow-xs transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Proposal &quot;Buka Class Konten&quot; (PDF)</span>
              </a>
              <a
                href={`https://wa.me/62${MARKETING_STAFF_PHONE.replace(/^0/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs whitespace-nowrap shadow-xs transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat Mas Yoshput WA</span>
              </a>
            </div>
          </div>

          {/* Grid: Form Input (Left) & Live Submissions List (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 5 Cols: Form Pengajuan Baru */}
            <div className="lg:col-span-5 bg-surface border border-border rounded-xl p-5 shadow-subtle space-y-4">
              <div className="border-b border-border pb-3">
                <span className="text-[10px] uppercase font-bold text-foreground-muted tracking-wider block">
                  Formulir Pengajuan Baru
                </span>
                <h3 className="text-base font-bold text-foreground">
                  Daftarkan Proposal Event Anda
                </h3>
                <p className="text-xs text-foreground-muted mt-0.5">
                  Isi data di bawah ini. Proposal PDF/link Google Drive akan otomatis dicatat ke database.
                </p>
              </div>

              {sSuccessMsg && (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 text-xs space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{sSuccessMsg}</span>
                  </div>
                  {sLastSubmittedItem && (
                    <div className="pt-2 border-t border-emerald-500/20 space-y-2">
                      <p className="text-[11px]">
                        Langkah berikutnya: Kirimkan pesan konfirmasi langsung ke WhatsApp Mas Yoshput sekarang.
                      </p>
                      <a
                        href={buildSponsorWhatsAppUrl(sLastSubmittedItem)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim Format Proposal ke WhatsApp Marketing</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleSponsorSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Nama Pemohon / PIC <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Fajar Pratama"
                    value={sApplicantName}
                    onChange={(e) => setSApplicantName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface-secondary text-foreground focus:outline-none focus:border-brand"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-foreground block mb-1">
                      Instansi / Kampus / Organisasi
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: BEM FEB Unsoed"
                      value={sInstitution}
                      onChange={(e) => setSInstitution(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface-secondary text-foreground focus:outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-foreground block mb-1">
                      No. WhatsApp Pemohon
                    </label>
                    <input
                      type="tel"
                      placeholder="Contoh: 081234567890"
                      value={sPhone}
                      onChange={(e) => setSPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface-secondary text-foreground focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-foreground block mb-1">
                      Target Cabang Optik I See You
                    </label>
                    <select
                      value={sTargetBranch}
                      onChange={(e) => setSTargetBranch(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface-secondary text-foreground focus:outline-none focus:border-brand font-semibold"
                    >
                      <option value="Purwokerto (Pusat)">Purwokerto (Pusat)</option>
                      <option value="Purbalingga">Purbalingga</option>
                      <option value="Cilacap">Cilacap</option>
                      <option value="Wonosobo">Wonosobo</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-foreground block mb-1">
                      Target Berapa Orang (Peserta) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={10}
                      placeholder="Contoh: 500"
                      value={sTargetAudience}
                      onChange={(e) => setSTargetAudience(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface-secondary text-foreground focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Nama Kegiatan / Event <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: National Economics Summit 2026"
                    value={sEventName}
                    onChange={(e) => setSEventName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface-secondary text-foreground focus:outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Tanggal Pelaksanaan Event
                  </label>
                  <input
                    type="date"
                    value={sEventDate}
                    onChange={(e) => setSEventDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface-secondary text-foreground focus:outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Resume Ringkas Kegiatan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Jelaskan ringkasan konsep kegiatan, latar belakang acara, serta sasaran audiens..."
                    value={sDescription}
                    onChange={(e) => setSDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface-secondary text-foreground focus:outline-none focus:border-brand resize-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Link File Proposal (Google Drive / PDF / Dokumen)
                  </label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/..."
                    value={sProposalUrl}
                    onChange={(e) => setSProposalUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface-secondary text-foreground focus:outline-none focus:border-brand"
                  />
                  <span className="text-[10px] text-foreground-muted mt-0.5 block">
                    Pastikan akses tautan Google Drive disetel ke &quot;Siapa saja yang memiliki link&quot;.
                  </span>
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Benefit yang Ditawarkan untuk Optik I See You
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Pemasangan logo di backdrop utama, adlibs MC 4x, promosi IG Story, booth konsultasi..."
                    value={sOfferedBenefits}
                    onChange={(e) => setSOfferedBenefits(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface-secondary text-foreground focus:outline-none focus:border-brand resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sIsSubmitting}
                  className="w-full py-2.5 rounded-lg bg-foreground text-surface font-bold text-xs hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 shadow-subtle disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sIsSubmitting ? "Menyimpan Pengajuan..." : "Kirim Pengajuan Sponsorship"}</span>
                </button>
              </form>
            </div>

            {/* Right 7 Cols: List Pengajuan Sponsorship Masuk */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground">
                      Daftar Pengajuan Sponsorship Masuk
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-secondary text-foreground-secondary border border-border">
                      {filteredSponsors.length} Proposal
                    </span>
                  </div>
                  <span className="text-xs text-foreground-muted">
                    Rekapitulasi proposal yang diajukan melalui web portal optikiseeyou.com
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-foreground-muted absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Cari event/instansi..."
                      value={sponsorSearch}
                      onChange={(e) => setSponsorSearch(e.target.value)}
                      className="pl-8 pr-2.5 py-1.5 rounded-lg border border-border bg-surface-secondary text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-brand w-36 sm:w-44"
                    />
                  </div>

                  <select
                    value={sponsorBranchFilter}
                    onChange={(e) => setSponsorBranchFilter(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-border bg-surface-secondary text-xs text-foreground font-semibold focus:outline-none"
                  >
                    <option value="all">Semua Cabang</option>
                    <option value="Purwokerto">Purwokerto</option>
                    <option value="Purbalingga">Purbalingga</option>
                    <option value="Cilacap">Cilacap</option>
                    <option value="Wonosobo">Wonosobo</option>
                  </select>

                  <button
                    onClick={fetchSponsors}
                    title="Refresh data"
                    className="p-1.5 rounded-lg border border-border bg-surface-secondary text-foreground hover:bg-surface transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSponsorLoading ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Submissions Cards */}
              <div className="space-y-3">
                {filteredSponsors.length === 0 ? (
                  <div className="p-8 text-center bg-surface border border-border rounded-xl text-foreground-muted text-xs">
                    Belum ada data pengajuan sponsorship yang sesuai filter.
                  </div>
                ) : (
                  filteredSponsors.map((item) => {
                    const waUrl = buildSponsorWhatsAppUrl(item);
                    const waText = buildSponsorWhatsAppMessage(item);
                    const isCopied = copiedSponsorId === item.id;

                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl border border-border bg-surface hover:border-foreground-muted/40 transition-all space-y-3 shadow-2xs"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-border pb-2.5">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
                                {item.targetBranch}
                              </span>
                              <span className="text-[10px] text-foreground-muted flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{item.eventDate || "Tanggal belum ditentukan"}</span>
                              </span>
                              <span className="text-[10px] text-foreground-muted">
                                Dibuat: {new Date(item.createdAt).toLocaleDateString("id-ID")}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-foreground mt-1">
                              {item.eventName}
                            </h4>
                            <span className="text-xs text-foreground-secondary">
                              <strong>{item.applicantName}</strong> · {item.institution} {item.applicantPhone && `(${item.applicantPhone})`}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 flex items-center gap-1">
                              <Users className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                              <span>{item.targetAudience} Orang</span>
                            </span>
                          </div>
                        </div>

                        {/* Resume Kegiatan */}
                        <div className="text-xs space-y-1">
                          <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                            Resume Singkat Kegiatan:
                          </span>
                          <p className="text-foreground-secondary leading-relaxed bg-surface-secondary/40 p-2.5 rounded-lg border border-border/60">
                            {item.description}
                          </p>
                        </div>

                        {/* Benefit */}
                        {item.offeredBenefits && (
                          <div className="text-xs space-y-0.5">
                            <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                              Benefit Ditawarkan:
                            </span>
                            <p className="text-foreground-secondary text-[11px]">
                              {item.offeredBenefits}
                            </p>
                          </div>
                        )}

                        {/* Actions: Link Proposal & Direct WA to Yoshput */}
                        <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-2">
                          <div>
                            {item.proposalUrl ? (
                              <a
                                href={item.proposalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:underline"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Buka Proposal (Google Drive / Cloud)</span>
                                <ExternalLink className="w-3 h-3 text-brand" />
                              </a>
                            ) : (
                              <span className="text-[11px] text-foreground-muted italic">
                                Belum ada file proposal terlampir
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(waText);
                                setCopiedSponsorId(item.id);
                                setTimeout(() => setCopiedSponsorId(null), 2500);
                              }}
                              className="px-2.5 py-1 rounded-lg border border-border bg-surface-secondary hover:bg-surface text-foreground text-xs font-semibold transition-colors flex items-center gap-1"
                              title="Salin template format pesan WA"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-500" />
                                  <span className="text-emerald-600 font-bold">Tersalin</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-foreground-muted" />
                                  <span>Salin Teks WA</span>
                                </>
                              )}
                            </button>

                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                              title={`Hubungi Mas Yoshput (${MARKETING_STAFF_PHONE}) via WhatsApp`}
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>Hubungi Mas Yoshput via WA</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BOOKING HOME SERVICE */}
      {/* ========================================================================= */}
      {activeTab === "homeservice" && (
        <div className="space-y-6">
          {/* Information & Branch Routing Banner */}
          <div className="p-4 rounded-xl border border-teal-300/80 dark:border-teal-700/60 bg-teal-50 dark:bg-teal-950/40 text-teal-950 dark:text-teal-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-start gap-2.5">
              <Stethoscope className="w-5 h-5 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sm block text-teal-950 dark:text-teal-100">
                  Layanan Home Service Optik I See You — 4 Cabang Resmi
                </span>
                <p className="text-[12px] font-medium text-teal-900 dark:text-teal-200 mt-0.5 leading-relaxed">
                  Pemeriksaan refraksi mata profesional dan fitting koleksi frame langsung ke rumah atau kantor. Jadwal otomatis tersambung ke WhatsApp CS masing-masing cabang terdekat.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap shrink-0">
              {Object.entries(BRANCH_CS_CONFIG).map(([k, cfg]) => (
                <a
                  key={k}
                  href={`https://wa.me/62${cfg.csPhone.replace(/^0/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-surface border border-border text-[11px] font-semibold text-foreground hover:border-teal-500 transition-colors flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  <span>CS {cfg.city} ({cfg.csPhone})</span>
                </a>
              ))}
            </div>
          </div>

          {/* Grid: Form Input (Left) & Live Schedule (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 5 Cols: Form Booking Home Service */}
            <div className="lg:col-span-5 bg-surface border border-border rounded-xl p-5 shadow-subtle space-y-4">
              <div className="border-b border-border pb-3">
                <span className="text-[10px] uppercase font-bold text-foreground-muted tracking-wider block">
                  Booking Layanan Lokasi
                </span>
                <h3 className="text-base font-bold text-foreground">
                  Formulir Home Service
                </h3>
                <p className="text-xs text-foreground-muted mt-0.5">
                  Jadwalkan kunjungan tim refraksionis optik langsung ke tempat Anda.
                </p>
              </div>

              {hsSuccessMsg && (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 text-xs space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{hsSuccessMsg}</span>
                  </div>
                  {hsLastSubmittedItem && (
                    <div className="pt-2 border-t border-emerald-500/20 space-y-2">
                      <p className="text-[11px]">
                        Langkah berikutnya: Konfirmasi jadwal ke CS Cabang {hsLastSubmittedItem.targetBranch} via WhatsApp.
                      </p>
                      <a
                        href={buildHomeServiceWhatsAppUrl(hsLastSubmittedItem.branchKey, hsLastSubmittedItem)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim Booking via WhatsApp ke CS {BRANCH_CS_CONFIG[hsLastSubmittedItem.branchKey]?.city}</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleHsSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Nama Pemesan / Klien <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ibu Ratna Dewi"
                    value={hsCustomerName}
                    onChange={(e) => setHsCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface-secondary text-foreground focus:outline-none focus:border-brand"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-foreground block mb-1">
                      No. WhatsApp Klien
                    </label>
                    <input
                      type="tel"
                      placeholder="Contoh: 081229384756"
                      value={hsCustomerPhone}
                      onChange={(e) => setHsCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface-secondary text-foreground focus:outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-foreground block mb-1">
                      Cabang Terdekat <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={hsBranchKey}
                      onChange={(e) => setHsBranchKey(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface-secondary text-foreground focus:outline-none focus:border-brand font-semibold"
                    >
                      <option value="pwt">Purwokerto (Pusat)</option>
                      <option value="pbg">Purbalingga</option>
                      <option value="clp">Cilacap</option>
                      <option value="wns">Wonosobo</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-foreground block mb-1">
                      Tanggal Kunjungan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={hsServiceDate}
                      onChange={(e) => setHsServiceDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface-secondary text-foreground focus:outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-foreground block mb-1">
                      Jam Kunjungan yang Diinginkan
                    </label>
                    <input
                      type="time"
                      value={hsServiceTime}
                      onChange={(e) => setHsServiceTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface-secondary text-foreground focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Alamat Lengkap / Lokasi Kunjungan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Sebutkan alamat lengkap, RT/RW, nama komplek/perumahan, atau patokan lokasi..."
                    value={hsAddress}
                    onChange={(e) => setHsAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface-secondary text-foreground focus:outline-none focus:border-brand resize-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Jumlah Orang yang Diperiksa
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={hsParticipantCount}
                    onChange={(e) => setHsParticipantCount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface-secondary text-foreground focus:outline-none focus:border-brand"
                  />
                  <span className="text-[10px] text-foreground-muted mt-0.5 block">
                    Bisa untuk perorangan, anggota keluarga, maupun staf/karyawan instansi.
                  </span>
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Keluhan Mata / Kebutuhan Kacamata
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Buram saat melihat jauh, mata cepat lelah di depan laptop, ingin ganti lensa progresif..."
                    value={hsComplaint}
                    onChange={(e) => setHsComplaint(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface-secondary text-foreground focus:outline-none focus:border-brand resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={hsIsSubmitting}
                  className="w-full py-2.5 rounded-lg bg-foreground text-surface font-bold text-xs hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 shadow-subtle disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{hsIsSubmitting ? "Menyimpan Jadwal..." : "Jadwalkan Home Service"}</span>
                </button>
              </form>
            </div>

            {/* Right 7 Cols: List Jadwal Home Service Masuk */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground">
                      Daftar Permintaan Jadwal Home Service
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-secondary text-foreground-secondary border border-border">
                      {filteredHomeServices.length} Jadwal
                    </span>
                  </div>
                  <span className="text-xs text-foreground-muted">
                    Rekapitulasi booking kunjungan periksa mata ke rumah/kantor 4 cabang
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-foreground-muted absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Cari nama/alamat..."
                      value={hsSearch}
                      onChange={(e) => setHsSearch(e.target.value)}
                      className="pl-8 pr-2.5 py-1.5 rounded-lg border border-border bg-surface-secondary text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-brand w-36 sm:w-44"
                    />
                  </div>

                  <select
                    value={hsBranchFilter}
                    onChange={(e) => setHsBranchFilter(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-border bg-surface-secondary text-xs text-foreground font-semibold focus:outline-none"
                  >
                    <option value="all">Semua Cabang</option>
                    <option value="pwt">Purwokerto</option>
                    <option value="pbg">Purbalingga</option>
                    <option value="clp">Cilacap</option>
                    <option value="wns">Wonosobo</option>
                  </select>

                  <button
                    onClick={fetchHomeServices}
                    title="Refresh data"
                    className="p-1.5 rounded-lg border border-border bg-surface-secondary text-foreground hover:bg-surface transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isHsLoading ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Schedules Cards */}
              <div className="space-y-3">
                {filteredHomeServices.length === 0 ? (
                  <div className="p-8 text-center bg-surface border border-border rounded-xl text-foreground-muted text-xs">
                    Belum ada data jadwal home service yang sesuai filter.
                  </div>
                ) : (
                  filteredHomeServices.map((item) => {
                    const cfg = BRANCH_CS_CONFIG[item.branchKey] || BRANCH_CS_CONFIG.pwt;
                    const waUrl = buildHomeServiceWhatsAppUrl(item.branchKey, item);
                    const waText = buildHomeServiceWhatsAppMessage(item);

                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl border border-border bg-surface hover:border-foreground-muted/40 transition-all space-y-3 shadow-2xs"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-border pb-2.5">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800">
                                {cfg.label}
                              </span>
                              <span className="text-[10px] font-semibold text-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-teal-600" />
                                <span>{item.serviceDate} · Pukul {item.serviceTime} WIB</span>
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-foreground mt-1">
                              {item.customerName}
                            </h4>
                            <span className="text-xs text-foreground-secondary">
                              No. HP: <strong>{item.customerPhone || "-"}</strong> · Peserta: <strong>{item.participantCount} orang</strong>
                            </span>
                          </div>

                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-surface-secondary text-foreground-secondary border border-border">
                            CS {cfg.city}: {cfg.csPhone}
                          </span>
                        </div>

                        {/* Lokasi Alamat */}
                        <div className="text-xs space-y-1">
                          <span className="text-[10px] uppercase font-bold text-foreground-muted block flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-brand" />
                            Lokasi / Alamat Lengkap Kunjungan:
                          </span>
                          <p className="text-foreground-secondary leading-relaxed bg-surface-secondary/40 p-2.5 rounded-lg border border-border/60">
                            {item.address}
                          </p>
                        </div>

                        {/* Keluhan Mata */}
                        {item.complaint && item.complaint !== "-" && (
                          <div className="text-xs space-y-0.5">
                            <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                              Keluhan Mata / Kebutuhan Lensa:
                            </span>
                            <p className="text-foreground-secondary text-[11px]">
                              {item.complaint}
                            </p>
                          </div>
                        )}

                        {/* Action Direct WA ke CS Cabang */}
                        <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[10px] text-foreground-muted">
                            Didaftarkan: {new Date(item.createdAt).toLocaleDateString("id-ID")}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(waText);
                                alert("Format teks booking WhatsApp tersalin ke clipboard!");
                              }}
                              className="px-2.5 py-1 rounded-lg border border-border bg-surface-secondary hover:bg-surface text-foreground text-xs font-semibold transition-colors flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3 text-foreground-muted" />
                              <span>Salin Format WA</span>
                            </button>

                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                              title={`Hubungi CS ${cfg.city} (${cfg.csPhone}) via WhatsApp`}
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>Hubungi CS Cabang via WA</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
