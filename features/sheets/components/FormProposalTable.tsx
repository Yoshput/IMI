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
  Send,
  CalendarCheck,
  CalendarX,
  Layers,
  CheckCircle,
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
  sheetNote?: string;
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
  { label: string; color: string; bg: string; icon: React.ElementType; desc: string }
> = {
  pending: {
    label: "Menunggu Keputusan",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    icon: Hourglass,
    desc: "Proposal belum diputuskan oleh pimpinan / tim marketing",
  },
  approved: {
    label: "Disetujui",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    icon: ThumbsUp,
    desc: "Disetujui untuk kerja sama sponsorship (voucher / dana)",
  },
  rejected: {
    label: "Ditolak",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    icon: ThumbsDown,
    desc: "Tidak sesuai kriteria, jadwal mepet, atau budget penuh",
  },
  negotiate: {
    label: "Negosiasi (Barter Voucher)",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    icon: Handshake,
    desc: "Ajukan barter paket voucher belanja (contoh: 5-10 vou @50K) tanpa tunai",
  },
  contact: {
    label: "Hubungi Pengaju",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    icon: PhoneCall,
    desc: "Perlu konfirmasi tanggal, rincian benefit, atau proposal fisik",
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
  if (!dateStr) return "Tanggal Belum Ditentukan";
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
    if (isNaN(eventDate.getTime())) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  } catch {
    return null;
  }
};

const getUrgencyBadge = (days: number | null) => {
  if (days === null) return { label: "Jadwal Belum Pasti", color: "text-foreground-muted", bg: "bg-surface-secondary border-border" };
  if (days < 0) return { label: `Sudah Lewat (${Math.abs(days)} hari lalu)`, color: "text-neutral-500 dark:text-neutral-400", bg: "bg-neutral-500/10 border-neutral-500/20", isPast: true };
  if (days === 0) return { label: "HARI INI!", color: "text-red-600 dark:text-red-400 font-extrabold animate-pulse", bg: "bg-red-500/20 border-red-500/40", isPast: false };
  if (days === 1) return { label: "Besok (H-1)!", color: "text-red-600 dark:text-red-400 font-bold", bg: "bg-red-500/15 border-red-500/30", isPast: false };
  if (days <= 7) return { label: `H-${days} Hari (Mendesak)`, color: "text-red-600 dark:text-red-400 font-bold", bg: "bg-red-500/10 border-red-500/20", isPast: false };
  if (days <= 14) return { label: `H-${days} Hari (Segera)`, color: "text-amber-600 dark:text-amber-400 font-semibold", bg: "bg-amber-500/10 border-amber-500/20", isPast: false };
  if (days <= 30) return { label: `H-${days} Hari`, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", isPast: false };
  return { label: `H-${days} Hari (Mendatang)`, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", isPast: false };
};

const extractEventCategory = (name: string, desc: string): string => {
  const combined = `${name} ${desc}`.toLowerCase();
  if (combined.includes("konser") || combined.includes("music") || combined.includes("band") || combined.includes("festival"))
    return "🎵 Konser / Festival Musik";
  if (combined.includes("ospek") || combined.includes("orma") || combined.includes("pbak") || combined.includes("pkkmb") || combined.includes("orientasi") || combined.includes("ortepa"))
    return "🎓 Orientasi Mahasiswa / Maba";
  if (combined.includes("seminar") || combined.includes("workshop") || combined.includes("pelatihan") || combined.includes("webinar") || combined.includes("diklat"))
    return "📚 Seminar & Workshop Edukasi";
  if (combined.includes("olahraga") || combined.includes("sport") || combined.includes("porsema") || combined.includes("porsoed"))
    return "🏅 Pekan Olahraga Mahasiswa";
  if (combined.includes("seni") || combined.includes("pameran") || combined.includes("kreasi") || combined.includes("choral"))
    return "🎨 Pentas Seni & Budaya";
  if (combined.includes("lomba") || combined.includes("kompetisi") || combined.includes("competition") || combined.includes("bmcc"))
    return "🏆 Lomba / Kompetisi Bisnis";
  if (combined.includes("sosial") || combined.includes("bakti") || combined.includes("masyarakat") || combined.includes("kbi"))
    return "🤝 Bakti Sosial & Komunitas";
  if (combined.includes("investasi") || combined.includes("ekonomi") || combined.includes("bisnis") || combined.includes("entrepreneur"))
    return "💼 Bisnis, Keuangan & Karir";
  if (combined.includes("agama") || combined.includes("islam") || combined.includes("maulid") || combined.includes("ta'aruf"))
    return "🕌 Kegiatan Religi & Keagamaan";
  return "📌 Event Mahasiswa & Komunitas";
};

const formatWhatsAppUrl = (
  rawPhone: string,
  eventName: string,
  applicantName: string,
  targetBranch: string
): string => {
  let clean = (rawPhone || "").replace(/[^0-9]/g, "");
  if (clean.startsWith("08")) {
    clean = "628" + clean.slice(2);
  } else if (clean.startsWith("8")) {
    clean = "628" + clean.slice(1);
  }
  const cleanBranch = targetBranch.trim() || "Purwokerto";
  const name = applicantName && applicantName !== "-" ? applicantName : "Panitia";
  const msg =
    `Halo Kak ${name},\n\n` +
    `Salam hangat dari Manajemen Optik I See You Cabang ${cleanBranch}.\n\n` +
    `Menindaklanjuti pengajuan proposal kerja sama sponsorship untuk event:\n` +
    `📌 *${eventName}*\n\n` +
    `Kami tertarik untuk mendiskusikan opsi kolaborasi & paket sponsorship (voucher belanja kacamata / materi promosi brand). Apakah bisa kami minta kontak penanggung jawab sponsorship untuk pembahasan kesepakatan lebih lanjut?\n\n` +
    `Terima kasih! 🙏\n_Optik I See You Marketing Intelligence_`;
  return `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`;
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
  const [timeFilter, setTimeFilter] = useState<"upcoming" | "all" | "past">("upcoming");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [decisions, setDecisions] = useState<ProposalDecision>(loadDecisions);
  const [noteEditing, setNoteEditing] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [modalItem, setModalItem] = useState<FormProposalItem | null>(null);

  const sheetUrl =
    "https://docs.google.com/spreadsheets/d/1BU0fIDP656Y-eue55bWVSxeaixSeFJwR3GP1n8kwBYc/edit?gid=1296355126#gid=1296355126";

  // Filter out corrupted/empty rows
  const validItems = useMemo(() => {
    return items.filter(
      (i) =>
        Boolean(i.eventName && i.eventName.trim() !== "-" && i.eventName.length > 2) ||
        Boolean(i.institution && i.institution.trim() !== "-" && i.institution.length > 2)
    );
  }, [items]);

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
    const days = getDaysUntilEvent(item.eventDate);
    const urgency = getUrgencyBadge(days);
    const text = `[REKAP PROPOSAL SPONSORSHIP - OPTIK I SEE YOU ${item.targetBranch.toUpperCase()}]
📌 Event: ${item.eventName}
🏫 Penyelenggara: ${item.institution}
📅 Pelaksanaan Acara: ${formatDate(item.eventDate)} (${urgency?.label || "Jadwal Belum Pasti"})
👤 Kontak Pengaju: ${item.applicantName} (${item.applicantPhone})
📍 Cabang Target: ${item.targetBranch}
${item.sheetNote ? `🏷️ Catatan Negosiasi Tim: ${item.sheetNote}` : ""}

📝 Deskripsi Acara:
${item.description}

🎁 Benefit Yang Ditawarkan:
${item.benefit}

📄 Link File Proposal: ${item.fileUrl || "Tidak ada file lampiran"}

⚡ Status Rekomendasi: ${STATUS_CONFIG[decision?.status || "pending"].label}
${decision?.note ? `📝 Catatan Tambahan: ${decision.note}` : ""}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const branches = useMemo(
    () => Array.from(new Set(validItems.map((i) => i.targetBranch).filter(Boolean))),
    [validItems]
  );

  // Filtered proposals
  const filteredItems = useMemo(() => {
    return validItems.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        item.eventName.toLowerCase().includes(q) ||
        item.institution.toLowerCase().includes(q) ||
        item.applicantName.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.benefit.toLowerCase().includes(q) ||
        (item.sheetNote && item.sheetNote.toLowerCase().includes(q));

      const matchBranch =
        selectedBranch === "all" ||
        item.targetBranch.toLowerCase().includes(selectedBranch.toLowerCase());

      const decision = decisions[item.id];
      const currentStatus = decision?.status || "pending";
      const matchStatus = selectedStatus === "all" || currentStatus === selectedStatus;

      // Time filter logic
      const days = getDaysUntilEvent(item.eventDate);
      let matchTime = true;
      if (timeFilter === "upcoming") {
        // Event is upcoming (today or future), or date not specified yet
        matchTime = days === null || days >= 0;
      } else if (timeFilter === "past") {
        // Event has already passed
        matchTime = days !== null && days < 0;
      }

      return matchSearch && matchBranch && matchStatus && matchTime;
    });
  }, [validItems, searchQuery, selectedBranch, selectedStatus, timeFilter, decisions]);

  // Comprehensive KPI Statistics
  const stats = useMemo(() => {
    const all = validItems.length;
    let upcoming = 0;
    let past = 0;
    let urgent = 0;

    validItems.forEach((i) => {
      const d = getDaysUntilEvent(i.eventDate);
      if (d === null || d >= 0) {
        upcoming++;
        if (d !== null && d <= 14) urgent++;
      } else {
        past++;
      }
    });

    const approved = validItems.filter((i) => decisions[i.id]?.status === "approved").length;
    const pending = validItems.filter((i) => !decisions[i.id] || decisions[i.id]?.status === "pending").length;
    const rejected = validItems.filter((i) => decisions[i.id]?.status === "rejected").length;
    const negotiate = validItems.filter((i) => decisions[i.id]?.status === "negotiate").length;
    const contact = validItems.filter((i) => decisions[i.id]?.status === "contact").length;

    return { all, upcoming, past, urgent, approved, pending, rejected, negotiate, contact };
  }, [validItems, decisions]);

  return (
    <div className="space-y-6">
      {/* ─── Header Banner ─── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600/10 via-surface to-blue-600/5 border border-border/80 p-6 md:p-8 shadow-subtle">
        <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-violet-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-36 h-36 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

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
                Tersinkron Otomatis dari Sheet
              </span>
              {stats.urgent > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-bold animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {stats.urgent} Event Mendesak (≤14 hari)
                </span>
              )}
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                Daftar Proposal Kerja Sama & Sponsorship Masuk
              </h2>
              <p className="text-xs sm:text-sm text-foreground-secondary mt-1.5 max-w-2xl leading-relaxed">
                Filter cerdas menampilkan <strong>khusus event aktif yang berlangsung hari ini ke depan</strong> agar relevan untuk diputuskan kerja sama dan negosiasi paket voucher oleh pimpinan / atasan.
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
                <span>{isSyncing ? "Menyinkronkan..." : "Cek Proposal Terbaru"}</span>
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
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-border/60">
          <div className="p-3 rounded-2xl bg-violet-500/5 border border-violet-500/20">
            <span className="text-[10px] font-bold text-violet-700 dark:text-violet-300 block uppercase tracking-wider">
              Aktif / Mendatang
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-violet-600 dark:text-violet-400">{stats.upcoming}</span>
              <span className="text-[10px] text-foreground-secondary">Proposal</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20">
            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 block uppercase tracking-wider">
              Menunggu Respon
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats.pending}</span>
              <span className="text-[10px] text-foreground-secondary">Pending</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-purple-500/5 border border-purple-500/20">
            <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 block uppercase tracking-wider">
              Negosiasi Voucher
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-purple-600 dark:text-purple-400">{stats.negotiate}</span>
              <span className="text-[10px] text-foreground-secondary">Nego</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 block uppercase tracking-wider">
              Disetujui
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.approved}</span>
              <span className="text-[10px] text-foreground-secondary">Deal</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-blue-500/5 border border-blue-500/20">
            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 block uppercase tracking-wider">
              Perlu Dihubungi
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{stats.contact}</span>
              <span className="text-[10px] text-foreground-secondary">Follow-up</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-surface-secondary/60 border border-border/50">
            <span className="text-[10px] font-medium text-foreground-muted block uppercase tracking-wider">
              Total Seluruh Data
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-extrabold text-foreground">{stats.all}</span>
              <span className="text-[10px] text-foreground-muted">({stats.past} lewat)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Control Bar: Time Segment Switch + Search & Filters ─── */}
      <div className="space-y-3">
        {/* Time Segment Tab Selector (iOS Style) */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-surface border border-border p-2 rounded-2xl shadow-subtle">
          <div className="flex items-center gap-1.5 bg-surface-secondary/70 p-1 rounded-xl">
            <button
              onClick={() => setTimeFilter("upcoming")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeFilter === "upcoming"
                  ? "bg-foreground text-surface shadow-subtle"
                  : "text-foreground-secondary hover:text-foreground"
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Event Aktif & Mendatang</span>
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  timeFilter === "upcoming"
                    ? "bg-surface/20 text-surface"
                    : "bg-surface border border-border text-foreground"
                }`}
              >
                {stats.upcoming}
              </span>
            </button>

            <button
              onClick={() => setTimeFilter("all")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeFilter === "all"
                  ? "bg-foreground text-surface shadow-subtle"
                  : "text-foreground-secondary hover:text-foreground"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Semua Proposal</span>
              <span className="text-[10px] text-foreground-muted">({stats.all})</span>
            </button>

            <button
              onClick={() => setTimeFilter("past")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeFilter === "past"
                  ? "bg-foreground text-surface shadow-subtle"
                  : "text-foreground-secondary hover:text-foreground"
              }`}
            >
              <CalendarX className="w-3.5 h-3.5 text-neutral-400" />
              <span>Sudah Lewat (Expired)</span>
              <span className="text-[10px] text-foreground-muted">({stats.past})</span>
            </button>
          </div>

          <div className="flex items-center gap-1 self-end sm:self-auto shrink-0">
            <button
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "cards"
                  ? "bg-foreground text-surface shadow-subtle"
                  : "text-foreground-secondary hover:text-foreground"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kartu</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "table"
                  ? "bg-foreground text-surface shadow-subtle"
                  : "text-foreground-secondary hover:text-foreground"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Tabel</span>
            </button>
          </div>
        </div>

        {/* Search, Branch, Status Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-foreground-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari event, institusi, pengaju, atau catatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-surface border border-border text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-violet-400/40 transition-all shadow-subtle"
              />
            </div>

            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-3.5 py-2 rounded-full bg-surface border border-border text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-violet-400/40 shadow-subtle"
            >
              <option value="all">Semua Cabang ({validItems.length})</option>
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b} ({validItems.filter((i) => i.targetBranch === b).length})
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-3.5 py-2 rounded-full bg-surface border border-border text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-violet-400/40 shadow-subtle"
            >
              <option value="all">Semua Status Keputusan</option>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>
                  {cfg.label}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-foreground-secondary font-medium px-1">
            Menampilkan <strong>{filteredItems.length}</strong> proposal{" "}
            {timeFilter === "upcoming" ? "(Event Mendatang)" : timeFilter === "past" ? "(Sudah Lewat)" : "(Semua)"}
          </div>
        </div>
      </div>

      {/* ─── Empty State ─── */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 rounded-3xl bg-surface border border-dashed border-border p-8 shadow-subtle">
          <FileText className="w-12 h-12 text-foreground-muted mx-auto mb-3 opacity-40" />
          <h3 className="text-sm font-bold text-foreground">Tidak Ada Proposal yang Sesuai Filter</h3>
          <p className="text-xs text-foreground-secondary mt-1.5 max-w-md mx-auto leading-relaxed">
            {timeFilter === "upcoming"
              ? "Tidak ada event mendatang dengan kriteria pencarian ini. Anda bisa mengubah kata kunci atau memilih tab 'Semua Proposal' untuk melihat riwayat data."
              : "Coba ubah kata kunci pencarian atau reset filter cabang/status."}
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedBranch("all");
              setSelectedStatus("all");
              setTimeFilter("upcoming");
            }}
            className="mt-4 px-4 py-2 rounded-full bg-surface-secondary hover:bg-surface-secondary/80 text-xs font-bold text-foreground border border-border transition-all shadow-subtle"
          >
            Reset Semua Filter
          </button>
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
            const waUrl = formatWhatsAppUrl(
              item.applicantPhone,
              item.eventName,
              item.applicantName,
              item.targetBranch
            );

            return (
              <div
                key={item.id}
                className={`rounded-3xl bg-surface border transition-all duration-300 flex flex-col shadow-subtle group ${
                  urgency?.isPast
                    ? "opacity-75 border-border/60 hover:opacity-100"
                    : currentStatus === "approved"
                    ? "border-emerald-500/30 hover:border-emerald-500/60"
                    : currentStatus === "negotiate"
                    ? "border-purple-500/30 hover:border-purple-500/60"
                    : currentStatus === "rejected"
                    ? "border-red-500/20 opacity-70 hover:opacity-100"
                    : "border-border/80 hover:border-violet-500/40"
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
                      <span className="text-[11px] font-medium text-foreground-muted px-2.5 py-0.5 rounded-full bg-surface-secondary border border-border">
                        {category}
                      </span>
                      {urgency && (
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${urgency.bg} ${urgency.color}`}>
                          {urgency.label}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleCopy(item)}
                        className="p-1.5 rounded-full hover:bg-surface-secondary text-foreground-muted hover:text-foreground transition-colors"
                        title="Salin rincian format rekap"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Event Name */}
                  <h3 className="mt-3 text-base font-bold text-foreground tracking-tight leading-snug group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {item.eventName}
                  </h3>

                  {/* Institution & Event Date */}
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-foreground-secondary font-medium">
                      <Building2 className="w-3.5 h-3.5 text-foreground-muted shrink-0" />
                      <span className="truncate">{item.institution}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-foreground font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                      <span>Pelaksanaan: {formatDate(item.eventDate)}</span>
                    </div>
                  </div>

                  {/* Note from Sheet Column 1 (if exists) */}
                  {item.sheetNote && (
                    <div className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                      <Tag className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>
                        <strong>Catatan Tim di Sheet:</strong> {item.sheetNote}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body: Executive Briefing */}
                <div className="p-5 space-y-4 flex-1">
                  {/* Brief Description */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-foreground-muted uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Info className="w-3 h-3 text-violet-500" />
                        Penjelasan Singkat Acara
                      </span>
                    </div>
                    <p
                      className={`text-xs text-foreground-secondary leading-relaxed ${
                        isExpanded ? "" : "line-clamp-3"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>

                  {/* Benefits Offered */}
                  <div className="space-y-1.5 p-3.5 rounded-2xl bg-surface-secondary/50 border border-border/60">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-foreground uppercase tracking-wider">
                      <Gift className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Benefit yang Ditawarkan ke Optik:</span>
                    </div>
                    <p
                      className={`text-xs text-foreground-secondary leading-relaxed ${
                        isExpanded ? "" : "line-clamp-2"
                      }`}
                    >
                      {item.benefit}
                    </p>
                  </div>

                  {/* Toggle Full Details */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline"
                  >
                    {isExpanded ? (
                      <>
                        <span>Tutup Rincian</span>
                        <ChevronUp className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        <span>Lihat Selengkapnya</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  {/* Applicant Contact & Quick Action */}
                  <div className="pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-foreground-muted block">Pengaju Proposal:</span>
                      <div className="font-bold text-foreground flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-foreground-muted" />
                        <span>{item.applicantName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.fileUrl && (
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-surface hover:bg-surface-secondary text-xs font-semibold text-foreground transition-all shadow-subtle"
                          title="Buka File Proposal di Google Drive"
                        >
                          <FileText className="w-3.5 h-3.5 text-violet-500" />
                          <span>File PDF</span>
                          <ArrowUpRight className="w-3 h-3 text-foreground-muted" />
                        </a>
                      )}

                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-subtle hover:scale-[1.02] active:scale-95"
                        title="Langsung chat panitia via WhatsApp"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Hubungi WA</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Decision Control for Owner/Manager */}
                <div className="p-4 bg-surface-secondary/40 border-t border-border/60 rounded-b-3xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-foreground-muted uppercase tracking-wider">
                      Keputusan / Arahan Owner:
                    </span>

                    <div className="flex flex-wrap items-center gap-1">
                      {(
                        Object.entries(STATUS_CONFIG) as [
                          DecisionStatus,
                          (typeof STATUS_CONFIG)[DecisionStatus],
                        ][]
                      ).map(([key, cfg]) => {
                        const isSelected = currentStatus === key;
                        const Ico = cfg.icon;
                        return (
                          <button
                            key={key}
                            onClick={() => updateDecision(item.id, key)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                              isSelected
                                ? `${cfg.bg} ${cfg.color} border shadow-subtle scale-105`
                                : "text-foreground-muted hover:text-foreground hover:bg-surface-secondary"
                            }`}
                            title={cfg.desc}
                          >
                            <Ico className="w-3 h-3" />
                            <span>{cfg.label.split(" ")[0]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notes for Management */}
                  <div>
                    {isEditingNote ? (
                      <div className="space-y-2">
                        <textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Tulis instruksi kesepakatan (misal: Berikan 10 voucher potongan 50rb, syarat logo backdrop)..."
                          className="w-full p-2.5 rounded-2xl bg-surface border border-violet-400 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-violet-400/40 resize-none"
                          rows={2}
                          autoFocus
                        />
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setNoteEditing(null)}
                            className="px-3 py-1 rounded-full text-xs font-semibold text-foreground-muted hover:text-foreground"
                          >
                            Batal
                          </button>
                          <button
                            onClick={() => {
                              updateNote(item.id, noteText);
                              setNoteEditing(null);
                            }}
                            className="px-3.5 py-1 rounded-full bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 shadow-subtle"
                          >
                            Simpan Catatan
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setNoteText(decision?.note || "");
                          setNoteEditing(item.id);
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-surface border border-dashed border-border hover:border-violet-500/40 transition-all text-xs text-foreground-muted hover:text-foreground"
                      >
                        <MessageSquare className="w-3.5 h-3.5 shrink-0 text-violet-500" />
                        <span className={`flex-1 text-left truncate ${decision?.note ? "text-foreground font-semibold" : ""}`}>
                          {decision?.note || "Tambah catatan kesepakatan pimpinan / instruksi tim..."}
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
                  <th className="py-3 px-4 min-w-[140px]">Jadwal Event</th>
                  <th className="py-3 px-4">Cabang</th>
                  <th className="py-3 px-4 min-w-[200px]">Event & Kategori</th>
                  <th className="py-3 px-4 min-w-[180px]">Penyelenggara</th>
                  <th className="py-3 px-4">Pengaju & WhatsApp</th>
                  <th className="py-3 px-4 min-w-[280px]">Benefit Sponsorship</th>
                  <th className="py-3 px-4">Catatan Sheet</th>
                  <th className="py-3 px-4 min-w-[150px]">Keputusan</th>
                  <th className="py-3 px-4 text-right min-w-[90px]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredItems.map((item) => {
                  const badge = getBranchBadge(item.targetBranch);
                  const decision = decisions[item.id];
                  const currentStatus: DecisionStatus = decision?.status || "pending";
                  const statusCfg = STATUS_CONFIG[currentStatus];
                  const days = getDaysUntilEvent(item.eventDate);
                  const urgency = getUrgencyBadge(days);
                  const waUrl = formatWhatsAppUrl(
                    item.applicantPhone,
                    item.eventName,
                    item.applicantName,
                    item.targetBranch
                  );

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-surface-secondary/30 transition-colors ${
                        urgency?.isPast ? "opacity-70" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-foreground">{formatDate(item.eventDate)}</div>
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
                        <div className="text-[10px] text-foreground-muted mt-0.5">
                          {extractEventCategory(item.eventName, item.description)}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-foreground-secondary font-medium">{item.institution}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-foreground">{item.applicantName}</div>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 font-semibold"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{item.applicantPhone}</span>
                        </a>
                      </td>
                      <td className="py-3.5 px-4 text-foreground-secondary leading-relaxed max-w-xs">
                        <p className="line-clamp-2">{item.benefit}</p>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {item.sheetNote ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                            {item.sheetNote}
                          </span>
                        ) : (
                          <span className="text-[11px] text-foreground-muted">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={currentStatus}
                          onChange={(e) => updateDecision(item.id, e.target.value as DecisionStatus)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border focus:outline-none cursor-pointer ${statusCfg.bg} ${statusCfg.color}`}
                        >
                          {(
                            Object.entries(STATUS_CONFIG) as [
                              DecisionStatus,
                              (typeof STATUS_CONFIG)[DecisionStatus],
                            ][]
                          ).map(([key, cfg]) => (
                            <option key={key} value={key}>
                              {cfg.label}
                            </option>
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
                            className="p-1.5 rounded-full hover:bg-surface-secondary text-foreground-muted hover:text-foreground inline-flex items-center transition-colors mr-1"
                            title="Buka File Proposal"
                          >
                            <FileText className="w-3.5 h-3.5 text-violet-500" />
                          </a>
                        )}
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-full hover:bg-surface-secondary text-emerald-600 inline-flex items-center transition-colors"
                          title="Chat WhatsApp Panitia"
                        >
                          <Send className="w-3.5 h-3.5" />
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

      {/* ─── Executive Summary Card for Owner / Board Presentation ─── */}
      <div className="rounded-3xl bg-gradient-to-br from-surface to-violet-500/5 border border-violet-500/15 p-6 space-y-4 shadow-subtle">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-violet-500/10 text-violet-600">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Ringkasan Eksekutif untuk Presentasi Owner / Rapat Direksi
              </h3>
              <p className="text-xs text-foreground-secondary">
                Format siap pakai untuk evaluasi kelayakan kerja sama dan kesepakatan harga sponsorship cabang.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const activeProposals = validItems.filter((i) => {
                const d = getDaysUntilEvent(i.eventDate);
                return d === null || d >= 0;
              });
              const summary = `📊 *RINGKASAN PROPOSAL SPONSORSHIP - OPTIK I SEE YOU*
Tanggal Laporan: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}

🎯 *Status Proposal:*
• Total Event Aktif / Mendatang: ${stats.upcoming} kegiatan
• Mendesak (≤14 Hari): ${stats.urgent} kegiatan
• Disetujui: ${stats.approved}
• Negosiasi Voucher: ${stats.negotiate}
• Menunggu Keputusan: ${stats.pending}
• Perlu Dihubungi: ${stats.contact}

🏢 *Distribusi Cabang Target:*
${branches.map((b) => `• ${b}: ${validItems.filter((i) => i.targetBranch === b).length} proposal`).join("\n")}

🔥 *Event Mendatang yang Perlu Segera Diputuskan:*
${
  activeProposals
    .slice(0, 8)
    .map(
      (i, idx) =>
        `${idx + 1}. *${i.eventName}* (${i.institution})\n   📅 ${formatDate(i.eventDate)} | Cabang: ${i.targetBranch}${
          i.sheetNote ? ` | Catatan: ${i.sheetNote}` : ""
        }\n   👤 PIC Panitia: ${i.applicantName} (${i.applicantPhone})`
    )
    .join("\n\n") || "Tidak ada"
}

_Disusun otomatis oleh I See You Marketing Intelligence Hub_`;
              navigator.clipboard.writeText(summary);
              alert("Ringkasan eksekutif telah disalin ke clipboard! Siap dikirim ke WhatsApp Owner/Atasan.");
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-foreground text-surface text-xs font-bold hover:bg-foreground/90 transition-all shadow-subtle active:scale-95"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Salin Ringkasan untuk WhatsApp Owner</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-surface-secondary/40 border border-border/60 space-y-2">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              Pedoman Rekomendasi Kerja Sama
            </h4>
            <ul className="text-xs text-foreground-secondary space-y-1.5 leading-relaxed">
              <li>
                • <strong>Prioritas Utama:</strong> Acara orientasi kampus & festival musik karena massa mahasiswa 500–2.000 orang sangat cocok untuk produk kacamata antiradiasi & frame fashion.
              </li>
              <li>
                • <strong>Strategi Anggaran:</strong> Utamakan penawaran <em>Barter Voucher Belanja Potongan Rp50.000 / Rp100.000</em> (5–10 lembar) tanpa dana tunai, dengan imbalan adlibs MC, logo backdrop, dan ulasan Google Maps.
              </li>
              <li>
                • <strong>Batas Waktu:</strong> Proposal dengan waktu kurang dari 7 hari sebaiknya segera diputuskan via WhatsApp agar materi promosi tidak terlambat dicetak oleh panitia.
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-surface-secondary/40 border border-border/60 space-y-2">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-violet-500" />
              Sebaran Proposal per Cabang
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {branches.map((b) => {
                const count = validItems.filter((i) => i.targetBranch === b).length;
                const upcomingBranchCount = validItems.filter(
                  (i) => i.targetBranch === b && (getDaysUntilEvent(i.eventDate) === null || (getDaysUntilEvent(i.eventDate) || 0) >= 0)
                ).length;
                const badge = getBranchBadge(b);
                return (
                  <div key={b} className="p-2 rounded-xl bg-surface border border-border/50 flex items-center justify-between">
                    <span className="font-bold text-foreground">{b}</span>
                    <span className="text-[11px] font-extrabold text-violet-600 dark:text-violet-400">
                      {upcomingBranchCount} aktif <span className="text-foreground-muted font-normal">/ {count}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
