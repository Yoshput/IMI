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
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  LayoutGrid,
  Table as TableIcon,
  Building2,
  MessageSquare,
  AlertTriangle,
  Handshake,
  PhoneCall,
  ThumbsUp,
  ThumbsDown,
  Hourglass,
  ArrowUpRight,
  Info,
  Tag,
  Gift,
  Send,
  CalendarCheck,
  CalendarX,
  Layers,
  CheckCircle,
  X,
  Maximize2,
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
  { label: string; color: string; bg: string; icon: React.ElementType; desc: string; short: string }
> = {
  pending: {
    label: "Menunggu Keputusan",
    short: "Pending",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    icon: Hourglass,
    desc: "Proposal belum diputuskan oleh manajemen",
  },
  approved: {
    label: "Disetujui",
    short: "Disetujui",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    icon: ThumbsUp,
    desc: "Disetujui untuk kerja sama sponsorship",
  },
  rejected: {
    label: "Ditolak",
    short: "Ditolak",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    icon: ThumbsDown,
    desc: "Tidak memenuhi kriteria atau jadwal terlalu mepet",
  },
  negotiate: {
    label: "Negosiasi Voucher",
    short: "Nego Voucher",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    icon: Handshake,
    desc: "Tawarkan kerja sama barter paket voucher diskon",
  },
  contact: {
    label: "Perlu Dihubungi",
    short: "Hubungi",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    icon: PhoneCall,
    desc: "Perlu konfirmasi tanggal pelaksanaan atau teknis kerja sama",
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
  if (!dateStr) return "Tanggal belum ditentukan";
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
  if (days < 0) return { label: `Selesai (${Math.abs(days)} hari lalu)`, color: "text-neutral-500 dark:text-neutral-400", bg: "bg-neutral-500/10 border-neutral-500/20", isPast: true };
  if (days === 0) return { label: "Hari Ini", color: "text-red-600 dark:text-red-400 font-bold", bg: "bg-red-500/20 border-red-500/40", isPast: false };
  if (days === 1) return { label: "Besok (H-1)", color: "text-red-600 dark:text-red-400 font-bold", bg: "bg-red-500/15 border-red-500/30", isPast: false };
  if (days <= 7) return { label: `H-${days} Hari (Prioritas)`, color: "text-red-600 dark:text-red-400 font-bold", bg: "bg-red-500/10 border-red-500/20", isPast: false };
  if (days <= 14) return { label: `H-${days} Hari`, color: "text-amber-600 dark:text-amber-400 font-semibold", bg: "bg-amber-500/10 border-amber-500/20", isPast: false };
  if (days <= 30) return { label: `H-${days} Hari`, color: "text-blue-600 dark:text-blue-400 font-medium", bg: "bg-blue-500/10 border-blue-500/20", isPast: false };
  return { label: `H-${days} Hari`, color: "text-emerald-600 dark:text-emerald-400 font-medium", bg: "bg-emerald-500/10 border-emerald-500/20", isPast: false };
};

const extractEventCategory = (name: string, desc: string): string => {
  const combined = `${name} ${desc}`.toLowerCase();
  if (combined.includes("konser") || combined.includes("music") || combined.includes("band") || combined.includes("festival"))
    return "Konser & Festival Musik";
  if (combined.includes("ospek") || combined.includes("orma") || combined.includes("pbak") || combined.includes("pkkmb") || combined.includes("orientasi") || combined.includes("ortepa"))
    return "Orientasi Mahasiswa";
  if (combined.includes("seminar") || combined.includes("workshop") || combined.includes("pelatihan") || combined.includes("webinar") || combined.includes("diklat"))
    return "Seminar & Workshop Edukasi";
  if (combined.includes("olahraga") || combined.includes("sport") || combined.includes("porsema") || combined.includes("porsoed"))
    return "Pekan Olahraga Mahasiswa";
  if (combined.includes("seni") || combined.includes("pameran") || combined.includes("kreasi") || combined.includes("choral"))
    return "Pentas Seni & Budaya";
  if (combined.includes("lomba") || combined.includes("kompetisi") || combined.includes("competition") || combined.includes("bmcc"))
    return "Kompetisi Bisnis & Lomba";
  if (combined.includes("sosial") || combined.includes("bakti") || combined.includes("masyarakat") || combined.includes("kbi"))
    return "Bakti Sosial & Pengabdian";
  if (combined.includes("investasi") || combined.includes("ekonomi") || combined.includes("bisnis") || combined.includes("entrepreneur"))
    return "Bisnis, Finansial & Karir";
  if (combined.includes("agama") || combined.includes("islam") || combined.includes("maulid") || combined.includes("ta'aruf"))
    return "Kegiatan Keagamaan";
  return "Kegiatan Mahasiswa & Umum";
};

/**
 * Format proper Indonesian title case for applicant names
 * Example: "WITDYA ROSYANNA INDAH PRATIWI" -> "Witdya Rosyanna"
 */
const formatPersonName = (rawName: string): string => {
  if (!rawName || rawName.trim() === "-" || rawName.trim() === "") return "Panitia";
  let clean = rawName.replace(/^(Kak|Mas|Mba|Mbak|Pak|Bu)\s+/i, "").trim();
  clean = clean
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const words = clean.split(" ");
  if (words.length > 2) {
    return `${words[0]} ${words[1]}`;
  }
  return clean;
};

/**
 * Professional, human business communication via WhatsApp
 * Strictly no broken emojis, no AI buzzwords, 100% clean formatting
 */
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
  const name = formatPersonName(applicantName);

  const lines = [
    `Selamat siang Kak ${name}, salam kenal dari tim Partnership Optik I See You Cabang ${cleanBranch}.`,
    ``,
    `Kami telah menerima dan meninjau pengajuan proposal sponsorship untuk kegiatan "${eventName.trim()}".`,
    ``,
    `Terkait penawaran kerja sama tersebut, pihak manajemen kami tertarik untuk mendiskusikan kemungkinan dukungan sponsorship dari Optik I See You.`,
    ``,
    `Apakah ada kontak koordinator sponsorship atau panitia terkait yang dapat kami hubungi untuk membahas teknis kesepakatan lebih lanjut?`,
    ``,
    `Terima kasih atas perhatian dan kerja samanya.`,
    ``,
    `Salam hormat,`,
    `Tim Marketing & Partnership`,
    `Optik I See You Cabang ${cleanBranch}`,
  ];

  return `https://wa.me/${clean}?text=${encodeURIComponent(lines.join("\n"))}`;
};

export interface BarterEvaluation {
  isViable: boolean;
  tier: "approved" | "priority" | "negotiable" | "unlikely";
  tierLabel: string;
  badgeClass: string;
  reason: string;
}

export const evaluateBarterVoucher = (item: FormProposalItem): BarterEvaluation => {
  const note = (item.sheetNote || "").toLowerCase();
  const benefit = (item.benefit || "").toLowerCase();
  const desc = (item.description || "").toLowerCase();
  const name = (item.eventName || "").toLowerCase();
  const combined = `${name} ${benefit} ${desc} ${note}`;

  // 1. Sudah disetujui voucher di catatan spreadsheet oleh atasan
  if (note.includes("vou") || note.includes("voucher")) {
    return {
      isViable: true,
      tier: "approved",
      tierLabel: "Disetujui Voucher",
      badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
      reason: `Catatan resmi spreadsheet: ${item.sheetNote}`,
    };
  }

  // 2. Terbuka secara tertulis atau benefit in-kind/branding jelas (Google review, sawalla, in-kind)
  if (
    combined.includes("in-kind") ||
    combined.includes("inkind") ||
    combined.includes("fleksibel") ||
    combined.includes("google review") ||
    combined.includes("ulasan") ||
    item.id === "proposal-33" ||
    item.id === "proposal-47" ||
    item.id === "proposal-9"
  ) {
    return {
      isViable: true,
      tier: "priority",
      tierLabel: "Prioritas Barter",
      badgeClass: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/25",
      reason: "Tersedia paket In-Kind resmi / benefit barter branding riil (Google review, fleksibilitas kerja sama).",
    };
  }

  // 3. Hanya menuntut dana tunai tetap tanpa opsi barter & skala kecil
  if (
    item.id === "proposal-27" ||
    (benefit.includes("mulai dari rp") && !benefit.includes("in-kind") && !combined.includes("adlibs") && !combined.includes("booth"))
  ) {
    return {
      isViable: false,
      tier: "unlikely",
      tierLabel: "Kurang Sesuai",
      badgeClass: "bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20",
      reason: "Penawaran terfokus pada donasi dana tunai tetap, tidak mencantumkan paket barter produk/voucher.",
    };
  }

  // 4. Potensial ditawarkan barter voucher (Event mahasiswa, ada logo/adlibs MC/booth/pembagian voucher)
  return {
    isViable: true,
    tier: "negotiable",
    tierLabel: "Potensial Barter",
    badgeClass: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/25",
    reason: "Segmen mahasiswa/pelajar relevan kacamata; dapat diajukan paket voucher sponsorship / hadiah doorprize.",
  };
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

/**
 * Convert a Google Drive share URL to an embeddable preview URL.
 * Handles formats:
 *   https://drive.google.com/file/d/FILE_ID/view?...
 *   https://drive.google.com/open?id=FILE_ID
 *   https://docs.google.com/...
 */
const getGoogleDrivePreviewUrl = (url: string): string | null => {
  if (!url) return null;
  // Already a preview URL
  if (url.includes("/preview")) return url;
  // Format: /file/d/FILE_ID/view or /file/d/FILE_ID/...
  const fileMatch = url.match(/\/file\/d\/([^/?]+)/);
  if (fileMatch) return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
  // Format: ?id=FILE_ID or &id=FILE_ID
  const idMatch = url.match(/[?&]id=([^&]+)/);
  if (idMatch) return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
  // Fallback: cannot convert
  return null;
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
  const [barterOnly, setBarterOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [decisions, setDecisions] = useState<ProposalDecision>(loadDecisions);
  const [noteEditing, setNoteEditing] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>("");

  const sheetUrl =
    "https://docs.google.com/spreadsheets/d/1BU0fIDP656Y-eue55bWVSxeaixSeFJwR3GP1n8kwBYc/edit?gid=1296355126#gid=1296355126";

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
    const statusLabel = STATUS_CONFIG[decision?.status || "pending"].label;

    const lines = [
      `REKAP PENGAJUAN SPONSORSHIP - OPTIK I SEE YOU`,
      `Cabang Target   : ${item.targetBranch}`,
      `----------------------------------------`,
      `Nama Kegiatan   : ${item.eventName}`,
      `Penyelenggara   : ${item.institution}`,
      `Jadwal Acara    : ${formatDate(item.eventDate)} (${urgency?.label || "Jadwal Belum Pasti"})`,
      `Kontak Pengaju  : ${item.applicantName} (${item.applicantPhone})`,
      item.sheetNote ? `Catatan Sheet   : ${item.sheetNote}` : null,
      `----------------------------------------`,
      `Deskripsi Kegiatan:`,
      item.description,
      ``,
      `Benefit yang Ditawarkan:`,
      item.benefit,
      ``,
      item.fileUrl ? `Tautan Dokumen Proposal: ${item.fileUrl}` : null,
      `----------------------------------------`,
      `Status Arahan   : ${statusLabel}`,
      decision?.note ? `Catatan Tindak Lanjut: ${decision.note}` : null,
    ].filter(Boolean);

    navigator.clipboard.writeText(lines.join("\n"));
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const branches = useMemo(
    () => Array.from(new Set(validItems.map((i) => i.targetBranch).filter(Boolean))),
    [validItems]
  );

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

      const days = getDaysUntilEvent(item.eventDate);
      let matchTime = true;
      if (timeFilter === "upcoming") {
        matchTime = days === null || days >= 0;
      } else if (timeFilter === "past") {
        matchTime = days !== null && days < 0;
      }

      if (barterOnly) {
        const barter = evaluateBarterVoucher(item);
        if (!barter.isViable) return false;
      }

      return matchSearch && matchBranch && matchStatus && matchTime;
    });
  }, [validItems, searchQuery, selectedBranch, selectedStatus, timeFilter, barterOnly, decisions]);

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
    const barterViable = validItems.filter((i) => {
      const d = getDaysUntilEvent(i.eventDate);
      const isUpcoming = d === null || d >= 0;
      return isUpcoming && evaluateBarterVoucher(i).isViable;
    }).length;

    return { all, upcoming, past, urgent, approved, pending, rejected, negotiate, contact, barterViable };
  }, [validItems, decisions]);

  const openPreview = (fileUrl: string, title: string) => {
    const embedUrl = getGoogleDrivePreviewUrl(fileUrl);
    if (embedUrl) {
      setPreviewUrl(embedUrl);
      setPreviewTitle(title);
    } else {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="space-y-6">
      {/* PDF Preview Modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-6 bg-black/70"
          onClick={(e) => { if (e.target === e.currentTarget) { setPreviewUrl(null); setPreviewTitle(""); } }}
        >
          <div className="relative w-full max-w-4xl h-[88vh] bg-surface rounded-2xl border border-border flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-secondary/70 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-violet-500 shrink-0" />
                <span className="text-sm font-bold text-foreground truncate">{previewTitle || "Dokumen Proposal"}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={previewUrl.replace("/preview", "/view")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-surface hover:bg-surface-secondary text-xs font-semibold text-foreground transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka di Drive</span>
                </a>
                <button
                  onClick={() => { setPreviewUrl(null); setPreviewTitle(""); }}
                  className="p-1.5 rounded-full hover:bg-surface-secondary text-foreground-muted hover:text-foreground transition-colors"
                  title="Tutup Preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* Iframe */}
            <div className="flex-1 bg-neutral-100 dark:bg-neutral-900">
              <iframe
                src={previewUrl}
                className="w-full h-full border-0"
                title="Dokumen Proposal"
                allow="fullscreen"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* KHUSUS MOBILE LAYOUT (iOS Safari, iPhone, Android Phone, iPad Portrait) */}
      {/* ========================================================================= */}
      <div className="block md:hidden space-y-4">
        {/* Mobile Header Card */}
        <div className="rounded-3xl bg-surface border border-border p-5 shadow-subtle space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-700 dark:text-violet-300 text-xs font-bold border border-violet-500/20">
              <FileText className="w-3.5 h-3.5" />
              Proposal Sponsorship
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Sinkronisasi Aktif
            </span>
          </div>

          <div>
            <h2 className="text-lg font-bold text-foreground tracking-tight">
              Proposal Masuk & Negosiasi
            </h2>
            <p className="text-xs text-foreground-secondary mt-1 leading-relaxed">
              Disaring otomatis khusus kegiatan mendatang untuk ditindaklanjuti secara cepat.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            {onSync && (
              <button
                onClick={onSync}
                disabled={isSyncing}
                className="flex-1 min-h-[44px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl bg-foreground text-surface text-xs font-bold active:scale-95 transition-all shadow-subtle disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                <span>{isSyncing ? "Menyinkronkan..." : "Perbarui Data"}</span>
              </button>
            )}
            <a
              href={sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-border bg-surface-secondary text-xs font-semibold text-foreground active:scale-95 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-violet-500" />
              <span>Buka Sheet</span>
            </a>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60">
            <div className="p-2.5 rounded-2xl bg-surface-secondary border border-border text-center">
              <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider block">Aktif</span>
              <span className="text-xl font-extrabold text-violet-600 dark:text-violet-400 block mt-0.5">{stats.upcoming}</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-surface-secondary border border-border text-center">
              <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider block">Pending</span>
              <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400 block mt-0.5">{stats.pending}</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-surface-secondary border border-border text-center">
              <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider block">Disetujui</span>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 block mt-0.5">{stats.approved}</span>
            </div>
          </div>
        </div>

        {/* Mobile Time Filter: iOS Segmented Control */}
        <div className="bg-surface border border-border p-1.5 rounded-2xl flex items-center gap-1 shadow-subtle">
          <button
            onClick={() => setTimeFilter("upcoming")}
            className={`flex-1 min-h-[42px] flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-xs font-bold transition-all ${
              timeFilter === "upcoming"
                ? "bg-foreground text-surface shadow-subtle"
                : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Aktif ({stats.upcoming})</span>
          </button>
          <button
            onClick={() => setTimeFilter("all")}
            className={`flex-1 min-h-[42px] flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-xs font-semibold transition-all ${
              timeFilter === "all"
                ? "bg-foreground text-surface shadow-subtle"
                : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            <span>Semua ({stats.all})</span>
          </button>
          <button
            onClick={() => setTimeFilter("past")}
            className={`flex-1 min-h-[42px] flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-xs font-semibold transition-all ${
              timeFilter === "past"
                ? "bg-foreground text-surface shadow-subtle"
                : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            <span>Selesai ({stats.past})</span>
          </button>
        </div>

        {/* Mobile Quick Barter Voucher Filter */}
        <button
          onClick={() => {
            setBarterOnly(!barterOnly);
            if (!barterOnly) setTimeFilter("upcoming");
          }}
          className={`w-full min-h-[42px] flex items-center justify-between px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all shadow-subtle ${
            barterOnly
              ? "bg-violet-600 text-white border-violet-500 shadow-subtle"
              : "bg-surface border-border text-foreground hover:bg-surface-secondary"
          }`}
        >
          <span className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5" />
            <span>Seleksi Barter Voucher (Arahan Atasan)</span>
          </span>
          <span
            className={`text-[11px] px-2.5 py-0.5 rounded-full font-extrabold ${
              barterOnly
                ? "bg-white/20 text-white"
                : "bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20"
            }`}
          >
            {stats.barterViable} Proposal
          </span>
        </button>

        {/* Mobile Search & Branch Filter */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-foreground-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kegiatan, kampus, atau nama pengaju..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-2xl bg-surface border border-border text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-violet-400/40 shadow-subtle"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
            <button
              onClick={() => setSelectedBranch("all")}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedBranch === "all"
                  ? "bg-foreground text-surface shadow-subtle"
                  : "bg-surface border border-border text-foreground-secondary"
              }`}
            >
              Semua Cabang
            </button>
            {branches.map((b) => {
              const count = validItems.filter((i) => i.targetBranch === b).length;
              const isSel = selectedBranch === b;
              return (
                <button
                  key={b}
                  onClick={() => setSelectedBranch(b)}
                  className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isSel
                      ? "bg-violet-600 text-white shadow-subtle font-bold"
                      : "bg-surface border border-border text-foreground-secondary"
                  }`}
                >
                  {b} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Proposal Card List */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-14 rounded-3xl bg-surface border border-dashed border-border p-6 shadow-subtle">
            <FileText className="w-10 h-10 text-foreground-muted mx-auto mb-2 opacity-40" />
            <h3 className="text-sm font-bold text-foreground">Tidak Ada Proposal yang Sesuai</h3>
            <p className="text-xs text-foreground-secondary mt-1 max-w-xs mx-auto">
              Silakan reset pencarian atau pilih tab "Semua Proposal".
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const badge = getBranchBadge(item.targetBranch);
              const decision = decisions[item.id];
              const currentStatus: DecisionStatus = decision?.status || "pending";
              const statusCfg = STATUS_CONFIG[currentStatus];
              const days = getDaysUntilEvent(item.eventDate);
              const urgency = getUrgencyBadge(days);
              const category = extractEventCategory(item.eventName, item.description);
              const barter = evaluateBarterVoucher(item);
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
                  className={`rounded-3xl bg-surface border p-4 shadow-subtle transition-all space-y-3.5 ${
                    urgency?.isPast
                      ? "opacity-75 border-border/70"
                      : currentStatus === "approved"
                      ? "border-emerald-500/40"
                      : currentStatus === "negotiate"
                      ? "border-purple-500/40"
                      : "border-border/80"
                  }`}
                >
                  {/* Card Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5 flex-1">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        {item.targetBranch}
                      </span>
                      {urgency && (
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${urgency.bg} ${urgency.color}`}>
                          {urgency.label}
                        </span>
                      )}
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${barter.badgeClass}`}>
                        {barter.tierLabel}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(item)}
                      className="p-2 rounded-xl bg-surface-secondary active:scale-95 text-foreground-muted"
                      title="Salin Rincian Acara"
                    >
                      {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Title & Organization */}
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-foreground leading-snug tracking-tight">
                      {item.eventName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-foreground-secondary">
                      <Building2 className="w-3.5 h-3.5 text-foreground-muted shrink-0" />
                      <span className="truncate">{item.institution}</span>
                    </div>
                  </div>

                  {/* Date Chip */}
                  <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-surface-secondary/70 border border-border/50 text-xs text-foreground font-semibold">
                    <Calendar className="w-4 h-4 text-violet-500 shrink-0" />
                    <span>Jadwal: {formatDate(item.eventDate)}</span>
                  </div>

                  {/* Barter Analysis Chip */}
                  <div className="flex items-start gap-2 p-2.5 rounded-2xl bg-surface-secondary/50 border border-border/60 text-xs">
                    <Tag className="w-3.5 h-3.5 text-violet-500 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-bold text-foreground block">Analisis Barter Voucher:</span>
                      <span className="text-foreground-secondary leading-relaxed block">{barter.reason}</span>
                    </div>
                  </div>

                  {/* Note from Sheet if exists */}
                  {item.sheetNote && (
                    <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                      <Tag className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        <strong>Catatan Tim di Sheet:</strong> {item.sheetNote}
                      </span>
                    </div>
                  )}

                  {/* Benefits & Description */}
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-2xl bg-surface-secondary/50 border border-border/50 space-y-1">
                      <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider block">
                        Benefit Sponsorship yang Ditawarkan:
                      </span>
                      <p className={`text-foreground-secondary leading-relaxed ${isExpanded ? "" : "line-clamp-2"}`}>
                        {item.benefit}
                      </p>
                    </div>

                    {isExpanded && (
                      <div className="p-3 rounded-2xl bg-surface-secondary/30 border border-border/50 space-y-1">
                        <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider block">
                          Deskripsi Lengkap Kegiatan:
                        </span>
                        <p className="text-foreground-secondary leading-relaxed whitespace-pre-line">
                          {item.description}
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="text-xs font-bold text-violet-600 dark:text-violet-400 inline-flex items-center gap-1"
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
                  </div>

                  {/* Applicant Info */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
                    <div className="text-foreground-secondary">
                      <span className="text-[10px] text-foreground-muted block">Pengaju Proposal:</span>
                      <span className="font-bold text-foreground">{item.applicantName}</span>
                    </div>
                    <span className="text-[11px] font-mono text-foreground-muted">{item.applicantPhone}</span>
                  </div>

                  {/* Direct WhatsApp Action Button */}
                  <div className="space-y-2 pt-1">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full min-h-[48px] py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Hubungi Panitia via WhatsApp</span>
                    </a>

                    <div className="flex items-center gap-2">
                      {item.fileUrl && (
                        <button
                          onClick={() => openPreview(item.fileUrl, item.eventName)}
                          className="flex-1 min-h-[42px] py-2 px-3 rounded-xl border border-violet-500/30 bg-violet-500/5 text-xs font-semibold text-violet-700 dark:text-violet-300 flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Preview Proposal</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleCopy(item)}
                        className="flex-1 min-h-[42px] py-2 px-3 rounded-xl border border-border bg-surface-secondary text-xs font-semibold text-foreground flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Memo</span>
                      </button>
                    </div>
                  </div>

                  {/* Decision Selector for Owner */}
                  <div className="pt-2 border-t border-border/50 space-y-2">
                    <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider block">
                      Status Keputusan Manajemen:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(
                        Object.entries(STATUS_CONFIG) as [
                          DecisionStatus,
                          (typeof STATUS_CONFIG)[DecisionStatus],
                        ][]
                      ).map(([key, cfg]) => {
                        const isSel = currentStatus === key;
                        const Ico = cfg.icon;
                        return (
                          <button
                            key={key}
                            onClick={() => updateDecision(item.id, key)}
                            className={`min-h-[38px] px-2 py-1.5 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 transition-all ${
                              isSel
                                ? `${cfg.bg} ${cfg.color} border font-bold shadow-subtle`
                                : "bg-surface-secondary/70 text-foreground-muted border border-border/50"
                            }`}
                          >
                            <Ico className="w-3 h-3" />
                            <span>{cfg.short}</span>
                          </button>
                        );
                      })}
                    </div>

                    {isEditingNote ? (
                      <div className="space-y-2 pt-1">
                        <textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Tuliskan catatan tindak lanjut atau arahan pimpinan..."
                          className="w-full p-2.5 rounded-xl bg-surface border border-violet-400 text-xs text-foreground focus:outline-none"
                          rows={2}
                          autoFocus
                        />
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setNoteEditing(null)}
                            className="px-3 py-1 text-xs text-foreground-muted"
                          >
                            Batal
                          </button>
                          <button
                            onClick={() => {
                              updateNote(item.id, noteText);
                              setNoteEditing(null);
                            }}
                            className="px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-bold"
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
                        className="w-full min-h-[38px] flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-secondary/60 border border-dashed border-border text-xs text-foreground-muted"
                      >
                        <MessageSquare className="w-3.5 h-3.5 shrink-0 text-violet-500" />
                        <span className="truncate">
                          {decision?.note || "Tambah catatan kesepakatan manajemen..."}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* KHUSUS DESKTOP / WEB LAYOUT (Windows Chrome, MacBook Safari, PC Browser) */}
      {/* ========================================================================= */}
      <div className="hidden md:block space-y-6">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-surface border border-border p-6 md:p-8 shadow-subtle">
          <div className="relative flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20 text-xs font-bold tracking-tight">
                  <FileText className="w-3.5 h-3.5" />
                  Form Proposal Sponsorship
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Sinkronisasi Otomatis Aktif
                </span>
                {stats.urgent > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-bold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {stats.urgent} Kegiatan Prioritas (&le;14 hari)
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                  Daftar Pengajuan Kerja Sama Sponsorship Masuk
                </h2>
                <p className="text-xs sm:text-sm text-foreground-secondary mt-1.5 max-w-2xl leading-relaxed">
                  Penyaringan otomatis difokuskan pada kegiatan aktif yang berlangsung saat ini dan di masa mendatang untuk evaluasi kelayakan kerja sama cabang.
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
                  <span>{isSyncing ? "Menyinkronkan..." : "Sinkronisasi Data"}</span>
                </button>
              )}
              <a
                href={sheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-surface-secondary/70 hover:bg-surface-secondary text-xs font-semibold text-foreground transition-all shadow-subtle hover:border-violet-400/40 active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5 text-violet-600" />
                <span>Buka Google Sheets Asli</span>
              </a>
            </div>
          </div>

          {/* KPI Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-border/60">
            <div className="p-3 rounded-2xl bg-surface-secondary border border-border">
              <span className="text-[10px] font-bold text-foreground-muted block uppercase tracking-wider">
                Aktif & Mendatang
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-black text-violet-600 dark:text-violet-400">{stats.upcoming}</span>
                <span className="text-[10px] text-foreground-secondary">Proposal</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-surface-secondary border border-border">
              <span className="text-[10px] font-bold text-foreground-muted block uppercase tracking-wider">
                Menunggu Arahan
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats.pending}</span>
                <span className="text-[10px] text-foreground-secondary">Pending</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-surface-secondary border border-border">
              <span className="text-[10px] font-bold text-foreground-muted block uppercase tracking-wider">
                Negosiasi Voucher
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-black text-purple-600 dark:text-purple-400">{stats.negotiate}</span>
                <span className="text-[10px] text-foreground-secondary">Nego</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-surface-secondary border border-border">
              <span className="text-[10px] font-bold text-foreground-muted block uppercase tracking-wider">
                Disetujui
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.approved}</span>
                <span className="text-[10px] text-foreground-secondary">Disetujui</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-surface-secondary border border-border">
              <span className="text-[10px] font-bold text-foreground-muted block uppercase tracking-wider">
                Perlu Dihubungi
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{stats.contact}</span>
                <span className="text-[10px] text-foreground-secondary">Follow-up</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-surface-secondary border border-border">
              <span className="text-[10px] font-bold text-foreground-muted block uppercase tracking-wider">
                Total Arsip
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-bold text-foreground">{stats.all}</span>
                <span className="text-[10px] text-foreground-muted">({stats.past} selesai)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Filter Controls */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-surface border border-border p-2 rounded-2xl shadow-subtle">
            <div className="flex items-center gap-1.5 bg-surface-secondary p-1 rounded-xl">
              <button
                onClick={() => setTimeFilter("upcoming")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  timeFilter === "upcoming"
                    ? "bg-foreground text-surface shadow-subtle"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Kegiatan Aktif & Mendatang</span>
                <span
                  className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
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
                <CalendarX className="w-3.5 h-3.5" />
                <span>Kegiatan Selesai (Arsip)</span>
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
                <span>Tampilan Kartu</span>
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
                <span>Tampilan Tabel</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-foreground-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama kegiatan, penyelenggara, kontak..."
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

              <button
                onClick={() => {
                  setBarterOnly(!barterOnly);
                  if (!barterOnly) setTimeFilter("upcoming");
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border transition-all shadow-subtle ${
                  barterOnly
                    ? "bg-violet-600 text-white border-violet-500 shadow-subtle"
                    : "bg-surface border-border text-foreground hover:bg-surface-secondary"
                }`}
                title="Saring proposal yang direkomendasikan barter voucher"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Khusus Barter Voucher</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    barterOnly ? "bg-white/20 text-white" : "bg-violet-500/10 text-violet-700 dark:text-violet-300"
                  }`}
                >
                  {stats.barterViable}
                </span>
              </button>
            </div>

            <div className="text-xs text-foreground-secondary font-medium px-1">
              Menampilkan <strong>{filteredItems.length}</strong> proposal
            </div>
          </div>
        </div>

        {/* Desktop Cards / Table Content */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 rounded-3xl bg-surface border border-dashed border-border p-8 shadow-subtle">
            <FileText className="w-12 h-12 text-foreground-muted mx-auto mb-3 opacity-40" />
            <h3 className="text-sm font-bold text-foreground">Tidak Ada Proposal yang Sesuai</h3>
            <p className="text-xs text-foreground-secondary mt-1.5 max-w-md mx-auto leading-relaxed">
              Silakan sesuaikan kriteria pencarian atau pilih tab "Semua Proposal".
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedBranch("all");
                setSelectedStatus("all");
                setTimeFilter("upcoming");
                setBarterOnly(false);
              }}
              className="mt-4 px-4 py-2 rounded-full bg-surface-secondary hover:bg-surface-secondary/80 text-xs font-bold text-foreground border border-border transition-all shadow-subtle"
            >
              Reset Filter
            </button>
          </div>
        ) : viewMode === "cards" ? (
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
              const barter = evaluateBarterVoucher(item);
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
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${barter.badgeClass}`}>
                          {barter.tierLabel}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleCopy(item)}
                          className="p-1.5 rounded-full hover:bg-surface-secondary text-foreground-muted hover:text-foreground transition-colors"
                          title="Salin rincian memo"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <h3 className="mt-3 text-base font-bold text-foreground tracking-tight leading-snug group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {item.eventName}
                    </h3>

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

                    {/* Barter Analysis Chip */}
                    <div className="mt-2.5 flex items-start gap-2 p-2.5 rounded-xl bg-surface-secondary/50 border border-border/60 text-xs">
                      <Tag className="w-3.5 h-3.5 text-violet-500 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="font-bold text-foreground block">Analisis Barter Voucher:</span>
                        <span className="text-foreground-secondary leading-relaxed block">{barter.reason}</span>
                      </div>
                    </div>

                    {item.sheetNote && (
                      <div className="mt-2.5 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                        <Tag className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>
                          <strong>Catatan Tim di Sheet:</strong> {item.sheetNote}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-4 flex-1">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-foreground-muted uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <Info className="w-3 h-3 text-violet-500" />
                          Ringkasan Acara
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

                    <div className="space-y-1.5 p-3.5 rounded-2xl bg-surface-secondary/50 border border-border/60">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-foreground uppercase tracking-wider">
                        <Gift className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Benefit yang Ditawarkan:</span>
                      </div>
                      <p
                        className={`text-xs text-foreground-secondary leading-relaxed ${
                          isExpanded ? "" : "line-clamp-2"
                        }`}
                      >
                        {item.benefit}
                      </p>
                    </div>

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
                          <button
                            onClick={() => openPreview(item.fileUrl, item.eventName)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/5 hover:bg-violet-500/10 text-xs font-semibold text-violet-700 dark:text-violet-300 transition-all shadow-subtle"
                            title="Preview Dokumen Proposal"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Preview Proposal</span>
                          </button>
                        )}

                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-subtle hover:scale-[1.02] active:scale-95"
                          title="Hubungi panitia via WhatsApp"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Hubungi via WA</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Decision Control */}
                  <div className="p-4 bg-surface-secondary/40 border-t border-border/60 rounded-b-3xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-foreground-muted uppercase tracking-wider">
                        Keputusan Manajemen:
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
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                                isSelected
                                  ? `${cfg.bg} ${cfg.color} border shadow-subtle font-bold scale-105`
                                  : "text-foreground-muted hover:text-foreground hover:bg-surface-secondary"
                              }`}
                              title={cfg.desc}
                            >
                              <Ico className="w-3 h-3" />
                              <span>{cfg.short}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      {isEditingNote ? (
                        <div className="space-y-2">
                          <textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Tuliskan arahan kesepakatan (contoh: Tawarkan barter 10 voucher belanja 50rb)..."
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
                            {decision?.note || "Tambah catatan kesepakatan manajemen..."}
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
          /* Table View */
          <div className="rounded-3xl bg-surface border border-border overflow-hidden shadow-subtle">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-secondary/60 border-b border-border text-foreground-muted font-bold text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4 min-w-[140px]">Jadwal Acara</th>
                    <th className="py-3 px-4">Cabang</th>
                    <th className="py-3 px-4 min-w-[200px]">Kegiatan & Kategori</th>
                    <th className="py-3 px-4 min-w-[180px]">Penyelenggara</th>
                    <th className="py-3 px-4">Kontak Pengaju</th>
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
                    const barter = evaluateBarterVoucher(item);
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
                            <span className={`text-[10px] font-semibold ${urgency.color}`}>{urgency.label}</span>
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
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className="text-[10px] text-foreground-muted">
                              {extractEventCategory(item.eventName, item.description)}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${barter.badgeClass}`}>
                              {barter.tierLabel}
                            </span>
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
                            <span className="text-[11px] text-foreground-muted">-</span>
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
                            title="Salin Memo"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          {item.fileUrl && (
                            <button
                              onClick={() => openPreview(item.fileUrl, item.eventName)}
                              className="p-1.5 rounded-full hover:bg-violet-500/10 text-violet-500 hover:text-violet-600 inline-flex items-center transition-colors mr-1"
                              title="Preview Dokumen Proposal"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-full hover:bg-surface-secondary text-emerald-600 inline-flex items-center transition-colors"
                            title="Hubungi Panitia via WhatsApp"
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
      </div>

      {/* Shared Executive Memo Summary */}
      <div className="rounded-3xl bg-surface border border-border p-5 md:p-6 space-y-4 shadow-subtle">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">
              Ringkasan Laporan Pengajuan Sponsorship
            </h3>
            <p className="text-xs text-foreground-secondary">
              Format memo resmi untuk evaluasi kelayakan kerja sama dan kesepakatan sponsorship cabang.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <button
              onClick={() => {
                const barterProposals = validItems.filter((i) => {
                  const d = getDaysUntilEvent(i.eventDate);
                  const isUpcoming = d === null || d >= 0;
                  return isUpcoming && evaluateBarterVoucher(i).isViable;
                });

                const tierOrder: Record<string, number> = { priority: 1, approved: 2, negotiable: 3, unlikely: 4 };
                barterProposals.sort((a, b) => {
                  const tA = tierOrder[evaluateBarterVoucher(a).tier] || 99;
                  const tB = tierOrder[evaluateBarterVoucher(b).tier] || 99;
                  if (tA !== tB) return tA - tB;
                  return (a.eventDate || "").localeCompare(b.eventDate || "");
                });

                const todayStr = new Date().toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                });

                const lines = [
                  `REKAP SELEKSI PROPOSAL BARTER VOUCHER - OPTIK I SEE YOU`,
                  `Tanggal Laporan : ${todayStr}`,
                  `Total Rekomendasi: ${barterProposals.length} Proposal Mendatang`,
                  `Prinsip Kerja Sama: Barter Voucher Diskon Belanja (Bukan Support Dana Tunai)`,
                  `========================================`,
                  ``,
                  ...barterProposals.map((item, idx) => {
                    const barter = evaluateBarterVoucher(item);
                    const urgency = getUrgencyBadge(getDaysUntilEvent(item.eventDate));
                    const d = formatDate(item.eventDate);
                    return [
                      `${idx + 1}. [${barter.tierLabel.toUpperCase()}] ${item.eventName}`,
                      `   Penyelenggara : ${item.institution}`,
                      `   Jadwal Acara  : ${d} (${urgency?.label || "-"}) | Cabang: ${item.targetBranch}`,
                      `   Kontak Panitia: ${item.applicantName} (${item.applicantPhone})`,
                      `   Alasan Masuk  : ${barter.reason}`,
                      item.sheetNote ? `   Catatan Sheet : ${item.sheetNote}` : null,
                      ``,
                    ].filter(Boolean).join("\n");
                  }),
                  `----------------------------------------`,
                  `STRATEGI NEGOSIASI BARTER:`,
                  `1. Tawarkan paket 5-10 lembar voucher belanja (misal voucher potongan Rp50.000 atau Rp100.000).`,
                  `2. Target imbal balik: Logo backdrop, adlibs MC, ulasan Google Maps, dan publikasi story/konten media sosial.`,
                  `3. Voucher menjadi alat penarik pengunjung (customer acquisition) agar datang langsung ke cabang Optik I See You.`,
                ];

                navigator.clipboard.writeText(lines.join("\n"));
                alert("Rekapan proposal barter voucher untuk atasan telah disalin ke clipboard.");
              }}
              className="flex-1 sm:flex-initial min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition-all shadow-subtle active:scale-95"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Salin Rekap Barter Voucher</span>
            </button>

            <button
              onClick={() => {
                const activeProposals = validItems.filter((i) => {
                  const d = getDaysUntilEvent(i.eventDate);
                  return d === null || d >= 0;
                });
                const todayStr = new Date().toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                });

                const summaryLines = [
                  `LAPORAN PENGAJUAN SPONSORSHIP - OPTIK I SEE YOU`,
                  `Tanggal Laporan: ${todayStr}`,
                  `========================================`,
                  ``,
                  `STATUS PROPOSAL:`,
                  `- Kegiatan Aktif / Mendatang : ${stats.upcoming}`,
                  `- Rekomendasi Barter Voucher : ${stats.barterViable}`,
                  `- Prioritas (<= 14 Hari)     : ${stats.urgent}`,
                  `- Disetujui                  : ${stats.approved}`,
                  `- Negosiasi Paket Voucher    : ${stats.negotiate}`,
                  `- Menunggu Keputusan         : ${stats.pending}`,
                  `- Perlu Dihubungi            : ${stats.contact}`,
                  ``,
                  `SEBARAN CABANG:`,
                  ...branches.map((b) => `- Cabang ${b}: ${validItems.filter((i) => i.targetBranch === b).length} proposal`),
                  ``,
                  `DAFTAR KEGIATAN PRIORITAS MENDATANG:`,
                  ...activeProposals.slice(0, 8).map((i, idx) => {
                    const d = formatDate(i.eventDate);
                    const note = i.sheetNote ? ` [Catatan: ${i.sheetNote}]` : "";
                    return `${idx + 1}. ${i.eventName}\n   Penyelenggara: ${i.institution}\n   Tanggal: ${d} | Cabang: ${i.targetBranch}${note}\n   Kontak: ${i.applicantName} (${i.applicantPhone})`;
                  }),
                  ``,
                  `----------------------------------------`,
                  `Disusun oleh Tim Partnership Optik I See You`,
                ];

                navigator.clipboard.writeText(summaryLines.join("\n"));
                alert("Ringkasan laporan telah disalin ke clipboard.");
              }}
              className="flex-1 sm:flex-initial min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-foreground text-surface text-xs font-bold hover:bg-foreground/90 transition-all shadow-subtle active:scale-95"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Salin Ringkasan Laporan</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-surface-secondary/50 border border-border space-y-2">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Pedoman Rekomendasi Kerja Sama
            </h4>
            <ul className="text-xs text-foreground-secondary space-y-1.5 leading-relaxed">
              <li>
                &bull; <strong>Prioritas Utama:</strong> Kegiatan orientasi kampus dan festival mahasiswa dengan perkiraan peserta 500-2.000 orang.
              </li>
              <li>
                &bull; <strong>Strategi Anggaran:</strong> Utamakan penawaran barter voucher belanja diskon kacamata (5-10 lembar) tanpa dana tunai, dengan imbalan pencantuman logo backdrop, adlibs MC, dan ulasan Google Maps.
              </li>
              <li>
                &bull; <strong>Batas Waktu:</strong> Proposal dengan jadwal kurang dari 7 hari agar segera dihubungi agar materi promosi panitia belum ditutup.
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-surface-secondary/50 border border-border space-y-2">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
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
                  <div key={b} className="p-2.5 rounded-xl bg-surface border border-border flex items-center justify-between">
                    <span className="font-bold text-foreground">{b}</span>
                    <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400">
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
