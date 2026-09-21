"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  Calendar,
  MapPin,
  User,
  Phone,
  Search,
  RefreshCw,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  LayoutGrid,
  Table as TableIcon,
  TrendingUp,
  Star,
  Building2,
  BadgeCheck,
  MessageSquare,
  AlertTriangle,
  Filter,
  Award,
  Handshake,
  PhoneCall,
  ThumbsUp,
  ThumbsDown,
  Hourglass,
  ArrowUpRight,
  Info,
  Tag,
  Gift,
  Target,
} from "lucide-react";

export interface FormProposalItem {
  id: string;
  timestamp: string | null;
  institution: string;
  targetBranch: string;
  eventName: string;
  eventDate: string | null;
  description: string;
  benefit: string;
  applicantName: string;
  applicantPhone: string;
  fileUrl: string;
}

interface FormProposalTableProps {
  items: FormProposalItem[];
  onSync?: () => Promise<void> | void;
  isSyncing?: boolean;
}

type DecisionStatus = "pending" | "approved" | "rejected" | "negotiate" | "contact";

interface ProposalDecision {
  [id: string]: {
    status: DecisionStatus;
    note: string;
  };
}

const STATUS_CONFIG: Record<
  DecisionStatus,
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  pending: {
    label: "Menunggu Keputusan",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    icon: Hourglass,
  },
  approved: {
    label: "Disetujui",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    icon: ThumbsUp,
  },
  rejected: {
    label: "Ditolak",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    icon: ThumbsDown,
  },
  negotiate: {
    label: "Negosiasi Harga",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    icon: Handshake,
  },
  contact: {
    label: "Hubungi Pengaju",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    icon: PhoneCall,
  },
};

const getBranchBadge = (branch: string) => {
  const b = (branch || "").toLowerCase();
  if (b.includes("purbalingga") || b.includes("pbg"))
    return { bg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20", dot: "bg-emerald-500", label: "Purbalingga" };
  if (b.includes("cilacap") || b.includes("clp"))
    return { bg: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20", dot: "bg-cyan-500", label: "Cilacap" };
  if (b.includes("wonosobo") || b.includes("wns"))
    return { bg: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20", dot: "bg-purple-500", label: "Wonosobo" };
  if (b.includes("tegal") || b.includes("lunar") || b.includes("tgl"))
    return { bg: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20", dot: "bg-amber-500", label: "Lunar Tegal" };
  return { bg: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20", dot: "bg-blue-500", label: "Purwokerto" };
};

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return dateStr;
  }
};

const getDaysUntilEvent = (dateStr: string | null): number | null => {
  if (!dateStr) return null;
  try {
    const eventDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  } catch {
    return null;
  }
};

const getUrgencyBadge = (days: number | null) => {
  if (days === null) return null;
  if (days < 0) return { label: "Sudah Lewat", color: "text-foreground-muted", bg: "bg-surface-secondary border-border" };
  if (days <= 7) return { label: `${days} hari lagi`, color: "text-red-600 dark:text-red-400", bg: "bg-red-500/10 border-red-500/20" };
  if (days <= 30) return { label: `${days} hari lagi`, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" };
  return { label: `${days} hari lagi`, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" };
};

const extractEventCategory = (name: string, desc: string): string => {
  const combined = `${name} ${desc}`.toLowerCase();
  if (combined.includes("konser") || combined.includes("music") || combined.includes("band") || combined.includes("festival"))
    return "🎵 Konser / Festival";
  if (combined.includes("ospek") || combined.includes("orma") || combined.includes("pbak") || combined.includes("pkkmb") || combined.includes("orientasi"))
    return "🎓 Orientasi Mahasiswa";
  if (combined.includes("seminar") || combined.includes("workshop") || combined.includes("pelatihan") || combined.includes("webinar"))
    return "📚 Seminar / Workshop";
  if (combined.includes("olahraga") || combined.includes("sport") || combined.includes("porsema") || combined.includes("porsoed"))
    return "🏅 Olahraga";
  if (combined.includes("seni") || combined.includes("pameran") || combined.includes("kreasi"))
    return "🎨 Seni & Budaya";
  if (combined.includes("lomba") || combined.includes("kompetisi") || combined.includes("competition"))
    return "🏆 Kompetisi";
  if (combined.includes("sosial") || combined.includes("bakti") || combined.includes("masyarakat"))
    return "🤝 Sosial / Bakti";
  if (combined.includes("investasi") || combined.includes("ekonomi") || combined.includes("bisnis") || combined.includes("entrepreneur"))
    return "💼 Bisnis / Ekonomi";
  if (combined.includes("agama") || combined.includes("islam") || combined.includes("maulid") || combined.includes("kajian"))
    return "🕌 Keagamaan";
  return "📌 Event Umum";
};

const STORAGE_KEY = "proposal-decisions-v1";

const loadDecisions = (): ProposalDecision => {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveDecisions = (decisions: ProposalDecision) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
  } catch {}
};

export const FormProposalTable: React.FC<FormProposalTableProps> = ({
  items = [],
  onSync,
  isSyncing = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | DecisionStatus>("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [decisions, setDecisions] = useState<ProposalDecision>(loadDecisions);
  const [noteEditing, setNoteEditing] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [selectedCard, setSelectedCard] = useState<FormProposalItem | null>(null);

  const sheetUrl =
    "https://docs.google.com/spreadsheets/d/1BU0fIDP656Y-eue55bWVSxeaixSeFJwR3GP1n8kwBYc/edit?gid=1296355126#gid=1296355126";

  const updateDecision = (id: string, status: DecisionStatus) => {
    const updated = {
      ...decisions,
      [id]: { status, note: decisions[id]?.note || "" },
    };
    setDecisions(updated);
    saveDecisions(updated);
  };

  const updateNote = (id: string, note: string) => {
    const updated = {
      ...decisions,
      [id]: { status: decisions[id]?.status || "pending", note },
    };
    setDecisions(updated);
    saveDecisions(updated);
  };

  const handleCopy = (item: FormProposalItem) => {
    const decision = decisions[item.id];
    const text = `[PROPOSAL SPONSOR - ${item.targetBranch.toUpperCase()}]
📌 Event: ${item.eventName}
🏫 Penyelenggara: ${item.institution}
📅 Tanggal: ${formatDate(item.eventDate)}
👤 Pengaju: ${item.applicantName}
📞 No. HP: ${item.applicantPhone}

📝 Deskripsi:
${item.description}

🎁 Benefit yang Ditawarkan:
${item.benefit}

📄 File Proposal: ${item.fileUrl || "Tidak ada file"}
${decision ? `\n✅ Keputusan: ${STATUS_CONFIG[decision.status].label}${decision.note ? `\n📝 Catatan: ${decision.note}` : ""}` : ""}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const branches = useMemo(
    () => Array.from(new Set(items.map((i) => i.targetBranch).filter(Boolean))),
    [items]
  );

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        item.eventName.toLowerCase().includes(q) ||
        item.institution.toLowerCase().includes(q) ||
        item.applicantName.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.benefit.toLowerCase().includes(q);

      const matchBranch =
        selectedBranch === "all" ||
        item.targetBranch.toLowerCase().includes(selectedBranch.toLowerCase());

      const decision = decisions[item.id];
      const currentStatus = decision?.status || "pending";
      const matchStatus = selectedStatus === "all" || currentStatus === selectedStatus;

      return matchSearch && matchBranch && matchStatus;
    });
  }, [items, searchQuery, selectedBranch, selectedStatus, decisions]);

  // Stats
  const stats = useMemo(() => {
    const all = items.length;
    const approved = items.filter((i) => decisions[i.id]?.status === "approved").length;
    const pending = items.filter((i) => !decisions[i.id] || decisions[i.id]?.status === "pending").length;
    const rejected = items.filter((i) => decisions[i.id]?.status === "rejected").length;
    const negotiate = items.filter((i) => decisions[i.id]?.status === "negotiate").length;
    const contact = items.filter((i) => decisions[i.id]?.status === "contact").length;
    const urgent = items.filter((i) => {
      const d = getDaysUntilEvent(i.eventDate);
      return d !== null && d >= 0 && d <= 14;
    }).length;
    return { all, approved, pending, rejected, negotiate, contact, urgent };
  }, [items, decisions]);

  return (
    <div className="space-y-6">
      {/* ─── Header Banner ─── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600/10 via-surface to-blue-600/5 border border-border/80 p-6 md:p-8 shadow-subtle">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-violet-500/5 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-blue-500/5 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20 text-xs font-bold tracking-tight">
                <FileText className="w-3.5 h-3.5" />
                Form Proposal Sponsorship
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Auto-Sync Aktif
              </span>
              {stats.urgent > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-bold animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {stats.urgent} Mendesak ≤14 hari
                </span>
              )}
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                Daftar Proposal Kerja Sama & Sponsorship Event
              </h2>
              <p className="text-xs sm:text-sm text-foreground-secondary mt-1.5 max-w-2xl leading-relaxed">
                Ringkasan seluruh proposal masuk dari mahasiswa, komunitas, dan instansi yang mengajukan kerja sama sponsorship kepada{" "}
                <strong>Optik I See You</strong>. Dilengkapi penjelasan isi proposal, benefit yang ditawarkan, dan alat bantu pengambilan keputusan untuk disampaikan ke Owner/Atasan.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {onSync && (
              <button
                onClick={onSync}
                disabled={isSyncing}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-foreground text-surface text-xs font-bold hover:bg-foreground/90 transition-all shadow-subtle disabled:opacity-50 active:scale-95"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                <span>{isSyncing ? "Menyinkronkan..." : "Cek Proposal Baru"}</span>
              </button>
            )}
            <a
              href={sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border/80 bg-surface-secondary/70 hover:bg-surface-secondary text-xs font-semibold text-foreground transition-all shadow-subtle hover:border-violet-400/40 active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5 text-violet-600" />
              <span>Buka Google Sheets</span>
            </a>
          </div>
        </div>

        {/* ─── KPI Stats Strip ─── */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-6 pt-5 border-t border-border/60">
          {[
            { label: "Total Masuk", value: stats.all, color: "text-foreground", sub: "Proposal" },
            { label: "Menunggu", value: stats.pending, color: "text-amber-600 dark:text-amber-400", sub: "Pending" },
            { label: "Disetujui", value: stats.approved, color: "text-emerald-600 dark:text-emerald-400", sub: "Approved" },
            { label: "Ditolak", value: stats.rejected, color: "text-red-500 dark:text-red-400", sub: "Rejected" },
            { label: "Negosiasi", value: stats.negotiate, color: "text-purple-600 dark:text-purple-400", sub: "Nego" },
            { label: "Perlu Hubungi", value: stats.contact, color: "text-blue-600 dark:text-blue-400", sub: "Follow-up" },
          ].map((s) => (
            <div key={s.label} className="p-3 rounded-2xl bg-surface-secondary/50 border border-border/50">
              <span className="text-[10px] font-medium text-foreground-muted block">{s.label}</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className={`text-2xl font-extrabold ${s.color}`}>{s.value}</span>
                <span className="text-[10px] text-foreground-secondary">{s.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Filters ─── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-foreground-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari event, institusi, atau pengaju..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-surface border border-border text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-violet-400/40 transition-all"
            />
          </div>

          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-3.5 py-2 rounded-full bg-surface border border-border text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-violet-400/40"
          >
            <option value="all">Semua Cabang</option>
            {branches.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-3.5 py-2 rounded-full bg-surface border border-border text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-violet-400/40"
          >
            <option value="all">Semua Status</option>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 bg-surface border border-border rounded-full p-1 self-end sm:self-auto shrink-0">
          <button
            onClick={() => setViewMode("cards")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${viewMode === "cards" ? "bg-foreground text-surface shadow-subtle" : "text-foreground-secondary hover:text-foreground"}`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Kartu</span>
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${viewMode === "table" ? "bg-foreground text-surface shadow-subtle" : "text-foreground-secondary hover:text-foreground"}`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Tabel</span>
          </button>
        </div>
      </div>

      {/* ─── Empty State ─── */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-surface border border-dashed border-border p-8">
          <FileText className="w-12 h-12 text-foreground-muted mx-auto mb-3 opacity-40" />
          <h3 className="text-sm font-bold text-foreground">Tidak ada proposal yang cocok</h3>
          <p className="text-xs text-foreground-secondary mt-1 max-w-sm mx-auto">
            Ubah filter atau kata kunci pencarian Anda.
          </p>
        </div>
      ) : viewMode === "cards" ? (
        /* ─── Cards View ─── */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredItems.map((item) => {
            const badge = getBranchBadge(item.targetBranch);
            const decision = decisions[item.id];
            const currentStatus: DecisionStatus = decision?.status || "pending";
            const statusCfg = STATUS_CONFIG[currentStatus];
            const StatusIcon = statusCfg.icon;
            const days = getDaysUntilEvent(item.eventDate);
            const urgency = getUrgencyBadge(days);
            const category = extractEventCategory(item.eventName, item.description);
            const isExpanded = expandedId === item.id;
            const isEditingNote = noteEditing === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-3xl bg-surface border transition-all duration-300 flex flex-col shadow-subtle group ${
                  currentStatus === "approved"
                    ? "border-emerald-500/30 hover:border-emerald-500/50"
                    : currentStatus === "rejected"
                    ? "border-red-500/20 opacity-70 hover:opacity-100"
                    : "border-border/80 hover:border-violet-500/30"
                } hover:shadow-elevated`}
              >
                {/* Card Header */}
                <div className="p-5 pb-4 border-b border-border/50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1.5 flex-1">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        {item.targetBranch}
                      </span>
                      <span className="text-[11px] font-medium text-foreground-muted px-2 py-0.5 rounded-full bg-surface-secondary border border-border">
                        {category}
                      </span>
                      {urgency && (
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${urgency.bg} ${urgency.color}`}>
                          {urgency.label}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleCopy(item)}
                      className="p-1.5 rounded-full hover:bg-surface-secondary text-foreground-muted hover:text-foreground transition-colors shrink-0"
                      title="Salin rincian proposal"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Event Name */}
                  <h3 className="mt-3 text-base font-bold text-foreground tracking-tight leading-snug group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {item.eventName}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-foreground-secondary font-medium">
                    <Building2 className="w-3.5 h-3.5 text-foreground-muted shrink-0" />
                    <span className="truncate">{item.institution}</span>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="p-5 space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-3.5 h-3.5 text-violet-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider block">Tanggal Event</span>
                        <span className="text-xs font-semibold text-foreground">{formatDate(item.eventDate)}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <User className="w-3.5 h-3.5 text-violet-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider block">Pengaju</span>
                        <span className="text-xs font-semibold text-foreground">{item.applicantName}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 col-span-2">
                      <Phone className="w-3.5 h-3.5 text-violet-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider block">No. HP / WhatsApp</span>
                        <a
                          href={`https://wa.me/${item.applicantPhone.replace(/\D/g, "").replace(/^0/, "62")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                        >
                          {item.applicantPhone}
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="rounded-2xl bg-violet-500/5 border border-violet-500/10 p-3.5">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Info className="w-3.5 h-3.5 text-violet-500" />
                      <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">Tentang Event / Kegiatan</span>
                    </div>
                    <p className={`text-xs text-foreground-secondary leading-relaxed ${!isExpanded && item.description.length > 200 ? "line-clamp-3" : ""}`}>
                      {item.description}
                    </p>
                  </div>

                  {/* Benefit */}
                  <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/10 p-3.5">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Gift className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Benefit yang Ditawarkan</span>
                    </div>
                    <p className={`text-xs text-foreground-secondary leading-relaxed ${!isExpanded && item.benefit.length > 150 ? "line-clamp-3" : ""}`}>
                      {item.benefit}
                    </p>
                  </div>

                  {(item.description.length > 200 || item.benefit.length > 150) && (
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="text-[11px] font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1 w-full"
                    >
                      {isExpanded ? (
                        <><ChevronUp className="w-3 h-3" />Tutup detail</>
                      ) : (
                        <><ChevronDown className="w-3 h-3" />Baca selengkapnya</>
                      )}
                    </button>
                  )}

                  {/* File Proposal */}
                  {item.fileUrl && (
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-surface-secondary border border-border hover:border-violet-500/30 hover:bg-violet-500/5 transition-all text-xs font-semibold text-foreground group/file"
                    >
                      <FileText className="w-4 h-4 text-violet-500 shrink-0" />
                      <span className="flex-1 truncate">Buka File Proposal PDF</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-foreground-muted group-hover/file:text-violet-500 transition-colors" />
                    </a>
                  )}
                </div>

                {/* ─── Decision Panel ─── */}
                <div className="p-5 pt-0 mt-auto space-y-3">
                  <div className="pt-3 border-t border-border/50">
                    <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider block mb-2">
                      Keputusan Owner / Atasan:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(Object.entries(STATUS_CONFIG) as [DecisionStatus, typeof STATUS_CONFIG[DecisionStatus]][]).map(([key, cfg]) => {
                        const Icon = cfg.icon;
                        const isActive = currentStatus === key;
                        return (
                          <button
                            key={key}
                            onClick={() => updateDecision(item.id, key)}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-bold border transition-all active:scale-95 ${
                              isActive
                                ? `${cfg.bg} ${cfg.color} shadow-subtle`
                                : "bg-surface border-border text-foreground-muted hover:text-foreground hover:bg-surface-secondary"
                            }`}
                          >
                            <Icon className="w-3 h-3" />
                            <span>{cfg.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Note input */}
                  <div>
                    {isEditingNote ? (
                      <div className="space-y-2">
                        <textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Tulis catatan / instruksi untuk proposal ini..."
                          rows={3}
                          className="w-full px-3.5 py-2.5 rounded-2xl bg-surface border border-border text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-violet-400/40 resize-none transition-all"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              updateNote(item.id, noteText);
                              setNoteEditing(null);
                            }}
                            className="flex-1 py-2 rounded-full bg-foreground text-surface text-xs font-bold hover:bg-foreground/90 transition-all"
                          >
                            Simpan Catatan
                          </button>
                          <button
                            onClick={() => setNoteEditing(null)}
                            className="py-2 px-4 rounded-full border border-border text-xs font-semibold text-foreground-secondary hover:text-foreground transition-all"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setNoteText(decision?.note || "");
                          setNoteEditing(item.id);
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-surface-secondary/60 border border-dashed border-border hover:border-violet-500/30 transition-all text-xs text-foreground-muted hover:text-foreground"
                      >
                        <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                        <span className={`flex-1 text-left truncate ${decision?.note ? "text-foreground font-medium" : ""}`}>
                          {decision?.note || "Tambah catatan / instruksi tindak lanjut..."}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ─── Table View ─── */
        <div className="rounded-3xl bg-surface border border-border overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-secondary/60 border-b border-border text-foreground-muted font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 min-w-[140px]">Tanggal Event</th>
                  <th className="py-3 px-4">Cabang</th>
                  <th className="py-3 px-4 min-w-[200px]">Event / Kegiatan</th>
                  <th className="py-3 px-4 min-w-[180px]">Penyelenggara</th>
                  <th className="py-3 px-4">Pengaju</th>
                  <th className="py-3 px-4 min-w-[320px]">Benefit Ditawarkan</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right min-w-[100px]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredItems.map((item) => {
                  const badge = getBranchBadge(item.targetBranch);
                  const decision = decisions[item.id];
                  const currentStatus: DecisionStatus = decision?.status || "pending";
                  const statusCfg = STATUS_CONFIG[currentStatus];
                  const StatusIcon = statusCfg.icon;
                  const days = getDaysUntilEvent(item.eventDate);
                  const urgency = getUrgencyBadge(days);
                  return (
                    <tr key={item.id} className="hover:bg-surface-secondary/30 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-foreground">{formatDate(item.eventDate)}</div>
                        {urgency && (
                          <span className={`text-[10px] font-bold ${urgency.color}`}>{urgency.label}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {item.targetBranch}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-foreground">{item.eventName}</div>
                        <div className="text-[11px] text-foreground-muted mt-0.5">{extractEventCategory(item.eventName, item.description)}</div>
                      </td>
                      <td className="py-3.5 px-4 text-foreground-secondary font-medium">{item.institution}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-foreground">{item.applicantName}</div>
                        <a
                          href={`https://wa.me/${item.applicantPhone.replace(/\D/g, "").replace(/^0/, "62")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5"
                        >
                          {item.applicantPhone}
                        </a>
                      </td>
                      <td className="py-3.5 px-4 text-foreground-secondary leading-relaxed max-w-xs">
                        <p className="line-clamp-2">{item.benefit}</p>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={currentStatus}
                          onChange={(e) => updateDecision(item.id, e.target.value as DecisionStatus)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border focus:outline-none cursor-pointer ${statusCfg.bg} ${statusCfg.color}`}
                        >
                          {(Object.entries(STATUS_CONFIG) as [DecisionStatus, typeof STATUS_CONFIG[DecisionStatus]][]).map(([key, cfg]) => (
                            <option key={key} value={key}>{cfg.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleCopy(item)}
                          className="p-1.5 rounded-full hover:bg-surface-secondary text-foreground-muted hover:text-foreground transition-colors mr-1"
                          title="Salin Rincian"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        {item.fileUrl && (
                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-full hover:bg-surface-secondary text-foreground-muted hover:text-foreground inline-flex items-center transition-colors"
                            title="Buka File Proposal"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <a
                          href={`https://wa.me/${item.applicantPhone.replace(/\D/g, "").replace(/^0/, "62")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-full hover:bg-surface-secondary text-foreground-muted hover:text-foreground inline-flex items-center transition-colors"
                          title="Chat WhatsApp Pengaju"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Summary for Owner Presentation ─── */}
      <div className="rounded-3xl bg-gradient-to-br from-surface to-violet-500/5 border border-violet-500/10 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-violet-500" />
          <h3 className="text-sm font-bold text-foreground">Ringkasan untuk Dipresentasikan ke Owner / Atasan</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Status Keputusan</h4>
            <div className="space-y-1.5">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                const count = items.filter((i) => (decisions[i.id]?.status || "pending") === key).length;
                const Ico = cfg.icon;
                return (
                  <div key={key} className="flex items-center justify-between text-xs">
                    <div className={`flex items-center gap-1.5 font-semibold ${cfg.color}`}>
                      <Ico className="w-3.5 h-3.5" />
                      <span>{cfg.label}</span>
                    </div>
                    <span className="font-bold text-foreground">{count} proposal</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Distribusi per Cabang</h4>
            <div className="space-y-1.5">
              {branches.map((b) => {
                const count = items.filter((i) => i.targetBranch === b).length;
                const badge = getBranchBadge(b);
                return (
                  <div key={b} className="flex items-center justify-between text-xs">
                    <div className={`flex items-center gap-1.5 font-semibold ${badge.bg.split(" ")[1]}`}>
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{b}</span>
                    </div>
                    <span className="font-bold text-foreground">{count} proposal</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="pt-4 border-t border-border/50 flex flex-wrap gap-2.5">
          <a
            href={sheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-subtle active:scale-95"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Lihat Semua di Google Sheets
          </a>
          <button
            onClick={() => {
              const summary = `RINGKASAN PROPOSAL SPONSORSHIP - OPTIK I SEE YOU\n\nTotal Masuk: ${stats.all} proposal\nDisetujui: ${stats.approved} | Pending: ${stats.pending} | Negosiasi: ${stats.negotiate} | Perlu Hubungi: ${stats.contact} | Ditolak: ${stats.rejected}\n\nPer Cabang:\n${branches.map((b) => `  ${b}: ${items.filter((i) => i.targetBranch === b).length} proposal`).join("\n")}\n\nProposal yang perlu tindak lanjut segera:\n${items.filter((i) => { const d = getDaysUntilEvent(i.eventDate); return d !== null && d >= 0 && d <= 14 && (decisions[i.id]?.status || "pending") === "pending"; }).map((i) => `  - ${i.eventName} (${i.institution}) - ${formatDate(i.eventDate)}`).join("\n") || "  Tidak ada"}`;
              navigator.clipboard.writeText(summary);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-surface hover:bg-surface-secondary text-xs font-semibold text-foreground transition-all shadow-subtle active:scale-95"
          >
            <Copy className="w-3.5 h-3.5" />
            Salin Ringkasan untuk Owner
          </button>
        </div>
      </div>
    </div>
  );
};
