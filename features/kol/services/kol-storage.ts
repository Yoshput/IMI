import {
  Creator,
  Campaign,
  PipelineStage,
  PriorityLevelType,
  PlatformType,
  ContentCategoryType,
  PartnershipType,
} from "../types";
import { INITIAL_CAMPAIGNS } from "../constants";
import initialKolData from "@/lib/kol-data.json";

const STORAGE_KEY_CREATORS = "iseeyou_kol_creators_v2";
const STORAGE_KEY_CAMPAIGNS = "iseeyou_kol_campaigns_v2";

/**
 * Memetakan data lama dari kol-data.json ke schema Creator lengkap
 */
export function mapLegacyKolToCreator(item: any): Creator {
  const branchName = item.branchName || (item.branchId === "tegal" ? "Tegal" : item.branchId?.toUpperCase() || "Purwokerto");
  const platform: PlatformType = item.platform?.toLowerCase().includes("tiktok") && item.platform?.toLowerCase().includes("instagram")
    ? "multi"
    : item.platform?.toLowerCase().includes("tiktok")
    ? "tiktok"
    : "instagram";

  // Hitung estimasi skor berdasarkan data yang ada
  const followers = Number(item.followers) || 30000;
  const engagement = Number(item.engagementRate) || 5.0;
  
  // Tentukan Category A (Visual Priority) vs Category B (Reach Priority)
  const isHighFollowers = followers >= 75000;
  const isHighEngagement = engagement >= 6.5;
  const priorityLevel: PriorityLevelType = isHighFollowers
    ? "reach"
    : isHighEngagement || item.niche?.toLowerCase().includes("aesthetic") || item.niche?.toLowerCase().includes("fashion")
    ? "visual"
    : "standard";

  // Pemetaan stage awal
  let stage: PipelineStage = (item.stage as PipelineStage) || "candidate_identified";
  const statusStr = (item.status || "").toLowerCase();
  if (statusStr.includes("deal") || statusStr.includes("disetujui")) {
    stage = "collab_approved";
  } else if (statusStr.includes("kirim") || statusStr.includes("shipped")) {
    stage = "product_shipped";
  } else if (statusStr.includes("terima") || statusStr.includes("received")) {
    stage = "product_received";
  } else if (statusStr.includes("produksi") || statusStr.includes("production")) {
    stage = "content_production";
  } else if (statusStr.includes("tayang") || statusStr.includes("publish")) {
    stage = "content_published";
  } else if (statusStr.includes("selesai") || statusStr.includes("complete")) {
    stage = "completed";
  } else if (statusStr.includes("tunggu") || statusStr.includes("negosiasi")) {
    stage = "negotiation";
  } else if (statusStr.includes("chat") || statusStr.includes("rekomendasi")) {
    stage = "ready_to_contact";
  }

  // Tentukan kategori konten
  let category: ContentCategoryType = "aesthetic_lifestyle";
  const nicheLower = (item.niche || "").toLowerCase();
  if (nicheLower.includes("hijab")) category = "hijab_fashion";
  else if (nicheLower.includes("kuliner") || nicheLower.includes("vlog") || nicheLower.includes("daily")) category = "daily_vlog";
  else if (nicheLower.includes("beauty") || nicheLower.includes("makeup")) category = "beauty_makeup";
  else if (nicheLower.includes("mahasiswa") || nicheLower.includes("kampus")) category = "campus_student";
  else if (nicheLower.includes("kacamata") || nicheLower.includes("fashion")) category = "eyewear_fashion";

  const visualScore = priorityLevel === "visual" ? 9 : 8;
  const brandingScore = 9;
  const reachScore = Math.min(10, Math.max(5, Math.round((followers / 50000) * 8)));
  const contentQualityScore = isHighEngagement ? 9 : 8;
  const potentialScore = Math.min(98, Math.round((visualScore * 3.5) + (brandingScore * 2.5) + (reachScore * 2.0) + (contentQualityScore * 2.0)));

  return {
    id: item.id || `kol-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    name: item.name || "Creator",
    instagramHandle: (item.handle || item.name || "").replace(/[@]/g, "").trim(),
    instagramUrl: item.instagramUrl || `https://www.instagram.com/${(item.handle || "").replace(/[@]/g, "")}/`,
    tiktokHandle: item.tiktokUrl ? item.tiktokUrl.split("@")[1]?.replace(/[/]/g, "") : undefined,
    tiktokUrl: item.tiktokUrl || undefined,
    profileImg: item.profileImg || undefined,
    city: branchName,
    contactWa: item.contactWa && item.contactWa !== "-" ? item.contactWa : "087778683766",
    email: undefined,

    platform,
    instagramFollowers: followers,
    tiktokFollowers: platform === "multi" || platform === "tiktok" ? Math.round(followers * 0.85) : undefined,
    followersFormatted: item.followersFormatted || `${(followers / 1000).toFixed(1)}K`,
    avgViews: Math.round(followers * (engagement / 100) * 3.2),
    avgLikes: Math.round(followers * (engagement / 100)),
    avgComments: Math.round(followers * (engagement / 100) * 0.08),
    engagementRate: engagement,
    primaryAudience: item.audienceFit || "Audiens Lokal Jawa Tengah (18–28 tahun)",
    category,
    socialBladeGrade: item.socialBladeGrade || "B+",

    evaluation: {
      visualScore,
      brandingScore,
      reachScore,
      contentQualityScore,
      potentialScore,
      internalNotes: item.notes || "KOL kurasi prioritas barter produk kacamata Optik I See You.",
      priorityLevel,
      evaluatedAt: "2026-11-19",
      evaluatedBy: "Tim Marketing I See You",
    },

    collaboration: {
      partnershipType: "product_barter",
      productSent: "1 Paket Kacamata Lengkap (Frame Pilihan + Lensa Anti-Radiasi Blue Ray)",
      estimatedProductValue: 450000,
      shippingCost: 25000,
      deliveryAddress: `Jl. Alamat Rumah ${item.name}, ${branchName}, Jawa Tengah (Akses Internal Tim Marketing)`,
      recipientPhone: item.contactWa && item.contactWa !== "-" ? item.contactWa : "087778683766",
      courierReceipt: stage === "product_shipped" ? "JP9823482736" : undefined,
      contactDate: "2026-11-10",
      responseStatus: stage === "candidate_identified" ? "not_contacted" : "replied",
      stage,
      nextFollowUpDate: "2026-11-21",
      contentDeadline: "2026-11-28",
      publicationDate: stage === "content_published" || stage === "completed" ? "2026-11-15" : undefined,
      publishedUrl: item.videoUrl || undefined,
      campaignId: "camp-pastel-q4",
      campaignName: "Barter Launching Frame Hexagonal Pastel Q4 2026",
      deliverables: "1 Video Reels Try-On/Review + 2 Instagram Stories + Tag @iseeyou.glasses",
      viewsCount: stage === "content_published" || stage === "completed" ? 18400 : undefined,
      likesCount: stage === "content_published" || stage === "completed" ? 1420 : undefined,
      commentsCount: stage === "content_published" || stage === "completed" ? 86 : undefined,
      statusHistory: [
        {
          stage: "candidate_identified",
          timestamp: "2026-11-01 10:00:00",
          note: "Scouting awal media sosial",
          updatedBy: "Lead Marketing",
        },
        ...(stage !== "candidate_identified" ? [{
          stage,
          timestamp: "2026-11-10 14:30:00",
          note: item.status || "Pembaruan status pipeline kolaborasi barter",
          updatedBy: "Marketing Team",
        }] : []),
      ],
    },

    createdAt: "2026-11-01",
    updatedAt: "2026-11-19",

    // Backward compatibility
    branchId: item.branchId,
    branchName: item.branchName,
    brand: item.brand,
    handle: item.handle,
    status: item.status,
    notes: item.notes,
    benefits: item.benefits,
    rateCard: item.rateCard,
    owningRights: item.owningRights,
    pitchTemplate: item.pitchTemplate,
    barterStrategy: item.barterStrategy,
    contentFocus: item.contentFocus,
    rateCardImage: item.rateCardImage,
    rateCardPdf: item.rateCardPdf,
    rateCardNote: item.rateCardNote,
  };
}

/**
 * Mengambil seluruh daftar creator (dengan fallback localStorage & lib/kol-data.json)
 */
export function getStoredCreators(): Creator[] {
  if (typeof window === "undefined") {
    return (initialKolData as any[]).map(mapLegacyKolToCreator);
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY_CREATORS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Gagal membaca creators dari localStorage:", e);
  }

  // Fallback ke data json bawaan dan simpan ke localStorage
  const initial = (initialKolData as any[]).map(mapLegacyKolToCreator);
  saveCreatorsLocally(initial);
  return initial;
}

/**
 * Menyimpan daftar creator ke localStorage
 */
export function saveCreatorsLocally(creators: Creator[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_CREATORS, JSON.stringify(creators));
  } catch (e) {
    console.error("Gagal menyimpan creators ke localStorage:", e);
  }
}

/**
 * Mengambil daftar kampanye (dengan fallback localStorage & INITIAL_CAMPAIGNS)
 */
export function getStoredCampaigns(): Campaign[] {
  if (typeof window === "undefined") {
    return INITIAL_CAMPAIGNS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY_CAMPAIGNS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Gagal membaca campaigns dari localStorage:", e);
  }

  saveCampaignsLocally(INITIAL_CAMPAIGNS);
  return INITIAL_CAMPAIGNS;
}

/**
 * Menyimpan daftar kampanye ke localStorage
 */
export function saveCampaignsLocally(campaigns: Campaign[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(campaigns));
  } catch (e) {
    console.error("Gagal menyimpan campaigns ke localStorage:", e);
  }
}

/**
 * Update atau tambah Creator tunggal
 */
export async function persistCreator(creator: Creator): Promise<Creator[]> {
  const current = getStoredCreators();
  const index = current.findIndex((c) => c.id === creator.id);

  let updated: Creator[];
  if (index >= 0) {
    current[index] = { ...creator, updatedAt: new Date().toISOString() };
    updated = [...current];
  } else {
    updated = [{ ...creator, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...current];
  }

  saveCreatorsLocally(updated);

  // Sync background ke server API jika tersedia
  try {
    await fetch("/api/kol", {
      method: index >= 0 ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(creator),
    });
  } catch (err) {
    console.warn("Server API sync skipped or failed:", err);
  }

  return updated;
}

/**
 * Hapus Creator tunggal
 */
export async function deleteStoredCreator(id: string): Promise<Creator[]> {
  const current = getStoredCreators();
  const filtered = current.filter((c) => c.id !== id);
  saveCreatorsLocally(filtered);

  try {
    await fetch(`/api/kol?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.warn("Server API delete sync skipped or failed:", err);
  }

  return filtered;
}

/**
 * Pindahkan tahap pipeline untuk Creator
 */
export async function updateCreatorPipelineStage(
  creatorId: string,
  newStage: PipelineStage,
  note?: string
): Promise<Creator[]> {
  const creators = getStoredCreators();
  const target = creators.find((c) => c.id === creatorId);
  if (!target) return creators;

  const now = new Date().toLocaleString("id-ID");
  const newHistoryEntry = {
    stage: newStage,
    timestamp: now,
    note: note || `Tahap diubah ke ${newStage}`,
    updatedBy: "Marketing Staff",
  };

  target.collaboration.stage = newStage;
  target.collaboration.statusHistory = [newHistoryEntry, ...(target.collaboration.statusHistory || [])];
  target.updatedAt = new Date().toISOString();

  return persistCreator(target);
}

/**
 * Export Creator Database ke format CSV
 */
export function exportCreatorsCSV(creators: Creator[], filename = "kol-creators-database.csv"): void {
  const headers = [
    "ID",
    "Nama Creator",
    "Instagram",
    "TikTok",
    "Platform",
    "Kota/Lokasi",
    "Kategori",
    "Followers IG",
    "Followers TikTok",
    "Engagement Rate (%)",
    "Prioritas",
    "Visual Score (1-10)",
    "Branding Score (1-10)",
    "Reach Score (1-10)",
    "Content Quality (1-10)",
    "Skor Potensial (0-100)",
    "Tipe Kemitraan",
    "Tahap Pipeline",
    "Produk Barter",
    "Nilai Produk (Rp)",
    "Deliverables",
    "Kontak WA",
    "Catatan Internal",
  ];

  const escapeCSV = (val: any) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = creators.map((c) => [
    escapeCSV(c.id),
    escapeCSV(c.name),
    escapeCSV(`@${c.instagramHandle}`),
    escapeCSV(c.tiktokHandle ? `@${c.tiktokHandle}` : "-"),
    escapeCSV(c.platform),
    escapeCSV(c.city),
    escapeCSV(c.category),
    escapeCSV(c.instagramFollowers),
    escapeCSV(c.tiktokFollowers || "-"),
    escapeCSV(`${c.engagementRate}%`),
    escapeCSV(c.evaluation.priorityLevel === "visual" ? "Category A (Visual Priority)" : c.evaluation.priorityLevel === "reach" ? "Category B (Reach Priority)" : "Standard"),
    escapeCSV(c.evaluation.visualScore),
    escapeCSV(c.evaluation.brandingScore),
    escapeCSV(c.evaluation.reachScore),
    escapeCSV(c.evaluation.contentQualityScore),
    escapeCSV(c.evaluation.potentialScore),
    escapeCSV(c.collaboration.partnershipType),
    escapeCSV(c.collaboration.stage),
    escapeCSV(c.collaboration.productSent),
    escapeCSV(c.collaboration.estimatedProductValue),
    escapeCSV(c.collaboration.deliverables),
    escapeCSV(c.contactWa),
    escapeCSV(c.evaluation.internalNotes || "-"),
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
