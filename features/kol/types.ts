/**
 * KOL & CREATOR PARTNERSHIP MANAGEMENT TYPES
 * Optik I See You | Marketing Intelligence Dashboard
 * 
 * Modul terpadu untuk pencarian, evaluasi, penjangkauan, barter produk kacamata,
 * pipeline kolaborasi, generator pesan WA/DM, serta pelacakan kampanye.
 */

export type PlatformType = "instagram" | "tiktok" | "multi";

export type ContentCategoryType =
  | "hijab_fashion"
  | "aesthetic_lifestyle"
  | "daily_vlog"
  | "beauty_makeup"
  | "campus_student"
  | "eyewear_fashion"
  | "creative_comedy"
  | "other";

export type PriorityLevelType = "visual" | "reach" | "standard";

export type PartnershipType = "product_barter" | "paid" | "hybrid";

export type PipelineStage =
  | "candidate_identified"   // 1. Kandidat Ditemukan
  | "under_review"          // 2. Sedang Ditinjau
  | "ready_to_contact"      // 3. Siap Dihubungi
  | "message_sent"          // 4. Pesan Terkirim
  | "waiting_response"      // 5. Menunggu Balasan
  | "negotiation"           // 6. Negosiasi & Barter
  | "collab_approved"       // 7. Kolaborasi Disetujui
  | "product_prep"          // 8. Penyiapan Produk
  | "product_shipped"       // 9. Produk Dikirim
  | "product_received"      // 10. Produk Diterima
  | "content_production"    // 11. Produksi Konten
  | "content_published"     // 12. Konten Tayang
  | "completed"             // 13. Selesai & Evaluasi
  | "rejected";             // 14. Ditolak / Batal

export interface StatusHistoryEntry {
  stage: PipelineStage;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface CreatorEvaluation {
  visualScore: number;          // 1–10: daya tarik visual, fotogenik, grid estetik
  brandingScore: number;        // 1–10: kecocokan branding dengan eyewear kekinian
  reachScore: number;           // 1–10: jangkauan audiens & follower volume
  contentQualityScore: number;  // 1–10: kualitas produksi video & komunikasi
  potentialScore: number;       // Skor tertimbang keseluruhan (0–100)
  internalNotes?: string;
  priorityLevel: PriorityLevelType; // Category A: Visual Priority vs Category B: Reach Priority
  evaluatedAt?: string;
  evaluatedBy?: string;
}

export interface CreatorCollaboration {
  partnershipType: PartnershipType;
  productSent: string;           // Nama kacamata/lensa yang dikirimkan (Barter)
  estimatedProductValue: number; // Estimasi nilai produk (Rp)
  shippingCost?: number;         // Biaya ongkos kirim (Rp)
  deliveryAddress?: string;      // Alamat rumah creator (Akses internal terbatas)
  recipientPhone?: string;       // No HP penerima paket
  courierReceipt?: string;       // Nomor resi ekspedisi (J&T / SiCepat dll)
  contactDate?: string;          // Tanggal awal dihubungi
  responseStatus: "not_contacted" | "contacted" | "replied" | "declined" | "ghosted";
  stage: PipelineStage;
  nextFollowUpDate?: string;     // Tanggal reminder follow-up berikutnya
  contentDeadline?: string;      // Batas waktu tayang konten
  publicationDate?: string;      // Tanggal konten resmi dipublikasikan
  publishedUrl?: string;         // Link video Reels / TikTok yang sudah tayang
  campaignId?: string;           // ID kampanye terkait
  campaignName?: string;         // Nama kampanye terkait
  deliverables: string;          // Bentuk konten yang disepakati (e.g. "1 Reels IG + 1 TikTok + 2 Story")
  viewsCount?: number;           // Views aktual video hasil kolaborasi
  likesCount?: number;           // Likes aktual
  commentsCount?: number;        // Komentar aktual
  statusHistory: StatusHistoryEntry[];
}

export interface Creator {
  id: string;
  name: string;
  instagramHandle: string;
  instagramUrl: string;
  tiktokHandle?: string;
  tiktokUrl?: string;
  profileImg?: string;
  city: string;
  contactWa: string;
  email?: string;

  // Audience
  platform: PlatformType;
  instagramFollowers: number;
  tiktokFollowers?: number;
  followersFormatted: string;
  avgViews?: number;
  avgLikes?: number;
  avgComments?: number;
  engagementRate: number;
  primaryAudience: string;
  category: ContentCategoryType;
  socialBladeGrade?: string;

  // Evaluation
  evaluation: CreatorEvaluation;

  // Collaboration
  collaboration: CreatorCollaboration;

  // Timestamps
  createdAt: string;
  updatedAt: string;

  // Legacy compatibility fields
  branchId?: string;
  branchName?: string;
  brand?: string;
  handle?: string;
  status?: string;
  notes?: string;
  benefits?: string[];
  rateCard?: any;
  owningRights?: any;
  pitchTemplate?: string;
  barterStrategy?: any;
  contentFocus?: string;
  rateCardImage?: string | null;
  rateCardPdf?: string | null;
  rateCardNote?: string;
}

export interface Campaign {
  id: string;
  name: string;
  objective: string;
  startDate: string;
  endDate: string;
  status: "active" | "planned" | "completed";
  participatingCreatorIds: string[];
  totalProductsAllocated: number;
  totalShippingCosts: number;
  totalCollaborationCosts: number;
  totalPublishedContent: number;
  totalViews: number;
  totalReach: number;
  averageEngagement: number;
  notes?: string;
}

export type MessageTone = "semi_formal" | "formal" | "casual";
export type MessageChannel = "whatsapp" | "instagram_dm";

export interface MessageTemplateConfig {
  id: string;
  key: string;
  title: string;
  category: "outreach" | "follow_up" | "deal" | "shipping" | "production" | "appreciation";
  badge: string;
  description: string;
  tones: {
    semi_formal: string;
    formal: string;
    casual: string;
  };
}

export type KolSubmodule =
  | "overview"
  | "database"
  | "evaluate"
  | "pipeline"
  | "messages"
  | "campaigns";
