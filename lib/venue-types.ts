/**
 * Venue & Event Intelligence - Core Type Definitions & Data Model
 * 
 * Sistem Intelijen Venue & Manajemen Event untuk ISeeYou Marketing Intelligence.
 * Semua label dan dokumentasi disajikan dalam Bahasa Indonesia dengan TypeScript strict mode.
 */

// ============================================================================
// 1. ENUMS & UNION TYPES
// ============================================================================

/**
 * Kategori klasifikasi venue
 */
export type VenueCategory =
  | 'kampus'
  | 'gedung_pertemuan'
  | 'hotel'
  | 'coworking'
  | 'creative_space'
  | 'kafe_restoran'
  | 'komunitas'
  | 'lainnya';

/**
 * Status operasional tempat/venue
 */
export type OperationalStatus =
  | 'active'
  | 'temporarily_closed'
  | 'permanently_closed'
  | 'unknown'
  | 'under_renovation';

/**
 * Status verifikasi data atau klaim bukti
 */
export type VerificationStatus =
  | 'verified'
  | 'partially_verified'
  | 'unverified'
  | 'conflicting'
  | 'stale'
  | 'rejected';

/**
 * Tipe sumber bukti atau rujukan data
 */
export type SourceType =
  | 'official_website'
  | 'official_contact_page'
  | 'official_brochure'
  | 'official_social_media'
  | 'direct_confirmation'
  | 'reputable_directory'
  | 'user_provided'
  | 'unverified_lead';

/**
 * Tahapan alur komunikasi dan penjajakan (Outreach)
 */
export type OutreachStatus =
  | 'new_lead'
  | 'researching'
  | 'ready_to_contact'
  | 'contacted'
  | 'awaiting_response'
  | 'follow_up_due'
  | 'replied'
  | 'survey_scheduled'
  | 'survey_completed'
  | 'proposal_requested'
  | 'negotiation'
  | 'awaiting_approval'
  | 'approved'
  | 'booked_confirmed'
  | 'rejected'
  | 'lost'
  | 'on_hold';

/**
 * Tipe sewa venue
 */
export type RentalType =
  | 'per_jam'
  | 'setengah_hari'
  | 'sehari'
  | 'per_sesi'
  | 'per_paket';

/**
 * Kategori pos anggaran event
 */
export type BudgetCategory =
  | 'sewa_venue'
  | 'konsumsi'
  | 'honor_narasumber'
  | 'transportasi'
  | 'peralatan'
  | 'dekorasi_branding'
  | 'dokumentasi'
  | 'materi_promosi'
  | 'merchandise'
  | 'operasional'
  | 'pajak'
  | 'contingency';

/**
 * Saluran komunikasi penjangkauan
 */
export type OutreachChannel =
  | 'whatsapp'
  | 'email'
  | 'telepon'
  | 'phone'
  | 'instagram_dm'
  | 'kunjungan_langsung'
  | 'lainnya';

/**
 * Prioritas tugas
 */
export type TaskPriority = 'rendah' | 'sedang' | 'tinggi' | 'kritis';

/**
 * Status pelaksanaan tugas
 */
export type TaskStatus =
  | 'belum_mulai'
  | 'dalam_proses'
  | 'selesai'
  | 'tertunda'
  | 'dibatalkan';

/**
 * Status checklist survei / persiapan
 */
export type ChecklistStatus = 'pass' | 'fail' | 'na' | 'unknown';

/**
 * Tingkat risiko
 */
export type RiskLevel = 'rendah' | 'sedang' | 'tinggi' | 'kritis';

/**
 * Status persetujuan event
 */
export type ApprovalStatus =
  | 'draft'
  | 'diajukan'
  | 'disetujui'
  | 'ditolak'
  | 'revisi';

/**
 * Status siklus hidup event
 */
export type EventStatus =
  | 'perencanaan'
  | 'persiapan'
  | 'berlangsung'
  | 'selesai'
  | 'dibatalkan';

/**
 * Hak penggunaan aset
 */
export type AssetUsageRights =
  | 'internal_only'
  | 'public_promotional'
  | 'restricted'
  | 'commercial';

/**
 * Keaslian aset multimedia
 */
export type AssetAuthenticity =
  | 'asli'
  | 'diedit'
  | 'ilustrasi'
  | 'tidak_terverifikasi';

/**
 * Jenis berkas aset
 */
export type AssetFileType = 'image' | 'video' | 'pdf' | 'document' | 'other';


// ============================================================================
// 2. VENUE & DETAIL INTERFACES
// ============================================================================

/**
 * Kapasitas ruangan berdasarkan tata letak meja/kursi
 */
export interface CapacityLayout {
  theater: number | null;
  classroom: number | null;
  ushape: number | null;
  standing: number | null;
  boardroom: number | null;
}

/**
 * Opsi paket penyewaan tempat
 */
export interface RentalOption {
  type: RentalType;
  duration: string | null;
  price: number | null;
  currency: string;
  unit: string | null;
  notes: string | null;
  validUntil: string | null;
  sourceUrl: string | null;
}

/**
 * Rincian komponen harga venue
 */
export interface VenuePricing {
  description: string;
  amount: number | null;
  currency: string;
  unit: string | null;
  period: string | null;
  validFrom: string | null;
  validUntil: string | null;
  sourceUrl: string | null;
  verificationStatus: VerificationStatus;
}

/**
 * Fasilitas yang tersedia di venue
 */
export interface VenueFacility {
  name: string;
  available: boolean | null;
  notes: string | null;
  verificationStatus: VerificationStatus;
}

/**
 * Izin pemasangan media promosi dan aktivasi brand
 */
export interface BrandingPermission {
  backdrop: boolean | null;
  banner: boolean | null;
  booth: boolean | null;
  productDisplay: boolean | null;
  logoSponsor: boolean | null;
  qrCode: boolean | null;
  promoMaterial: boolean | null;
  notes: string | null;
}

/**
 * Entitas Bukti (Evidence & Source Registry)
 */
export interface Evidence {
  evidenceId: string;
  venueId: string;
  claimField: string;
  claimValue: string;
  sourceUrl: string;
  sourceTitle: string;
  sourceType: SourceType;
  publisher: string | null;
  retrievedAt: string;
  publishedAt: string | null;
  validUntil: string | null;
  verificationMethod: string;
  verificationStatus: VerificationStatus;
  confidenceLevel: number; // 0 - 100
  evidenceNotes: string | null;
  screenshotAssetId: string | null;
  reviewerId: string | null;
  reviewedAt: string | null;
}

/**
 * Aset berkas/foto/dokumen venue
 */
export interface VenueAsset {
  assetId: string;
  venueId: string;
  sourceUrl: string;
  capturedAt: string | null;
  uploader: string;
  description: string;
  usageRights: AssetUsageRights;
  authenticityStatus: AssetAuthenticity;
  verificationStatus: VerificationStatus;
  altText: string;
  attribution: string | null;
  fileType: AssetFileType;
  filePath: string;
}

/**
 * Bobot penilaian venue (Konfigurasi skor)
 */
export interface ScoreWeights {
  costFit: number;
  capacityFit: number;
  audienceRelevance: number;
  facilityQuality: number;
  accessibilityLocation: number;
  collaborationPotential: number;
}

/**
 * Hasil penilaian dan skor kelayakan venue
 */
export interface VenueScore {
  venueId: string;
  costFit: number; // 0 - 5
  capacityFit: number; // 0 - 5
  audienceRelevance: number; // 0 - 5
  facilityQuality: number; // 0 - 5
  accessibilityLocation: number; // 0 - 5
  collaborationPotential: number; // 0 - 5
  weights: ScoreWeights;
  normalizedScore: number; // 0 - 100
  dataCompleteness: number; // 0 - 100 persen kelengkapan data
  verifiedClaimsCount: number;
  unknownClaimsCount: number;
  scoreExplanation: string;
  scoredAt: string;
}

/**
 * Entitas Utama Venue
 */
export interface Venue {
  id: string; // Format UUID
  name: string; // Nama resmi
  nameAlternatives: string[]; // Variasi nama lain
  category: VenueCategory;
  address: string | null;
  city: string | null;
  district: string | null;
  coordinates: { lat: number; lng: number } | null;
  googleMapsUrl: string | null;
  websiteUrl: string | null;
  instagramHandle: string | null;
  socialMediaUrls: { platform: string; url: string }[];
  phone: string | null;
  whatsappBusiness: string | null;
  email: string | null;
  picName: string | null; // Hanya jika terbuka untuk publik
  picRole: string | null;
  capacityTotal: number | null;
  capacityByLayout: CapacityLayout;
  roomSize: string | null;
  rentalOptions: RentalOption[];
  pricing: VenuePricing[];
  deposit: string | null;
  additionalFees: string | null;
  taxInfo: string | null;
  cancellationPolicy: string | null;
  facilities: VenueFacility[];
  brandingPermissions: BrandingPermission;
  externalEventPolicy: string | null;
  targetAudience: string[];
  strengths: string[];
  limitations: string[];
  operationalStatus: OperationalStatus;
  lastVerifiedAt: string | null;
  verificationNotes: string | null;
  internalNotes: string | null;
  internalOwner: string | null;
  createdAt: string;
  updatedAt: string;
  outreachStatus: OutreachStatus;
  score: VenueScore | null;
  evidences: Evidence[];
  assets: VenueAsset[];
  isAmbiguous: boolean;
  ambiguityNotes: string | null;
}


// ============================================================================
// 3. OUTREACH & KOMUNIKASI INTERFACES
// ============================================================================

/**
 * Riwayat perubahan status penjangkauan
 */
export interface OutreachStatusLog {
  status: OutreachStatus;
  timestamp: string;
  note?: string;
}

/**
 * Aktivitas penjangkauan dan komunikasi dengan venue
 */
export interface OutreachActivity {
  id: string;
  venueId: string;
  contactTarget: string;
  channel: OutreachChannel;
  sentAt: string;
  messagePreview: string;
  responsePreview: string | null;
  requirementsSent: string[];
  quotedPrice: number | null;
  quotedAt: string | null;
  nextFollowUp: string | null;
  internalOwner: string;
  lostReason: string | null;
  attachments: { name: string; url: string }[];
  statusHistory: OutreachStatusLog[];
}

/**
 * Template pesan penjangkauan
 */
export interface OutreachTemplate {
  id: string;
  name: string;
  category: string;
  channel: OutreachChannel;
  subject: string | null;
  body: string; // Mendukung format variabel seperti {{nama_venue}}, {{tanggal_event}}, dsb.
  variables: string[];
  requiredVariables?: string[];
  isDefault: boolean;
}


// ============================================================================
// 4. EVENT PLANNER, TASK, RUNDOWN & SURVEY INTERFACES
// ============================================================================

/**
 * Butir item rundown acara
 */
export interface RundownItem {
  time: string;
  duration: string;
  activity: string;
  pic: string;
  notes: string | null;
}

/**
 * Tugas operasional event
 */
export interface EventTask {
  id: string;
  title: string;
  pic: string;
  deadline: string;
  priority: TaskPriority;
  status: TaskStatus;
  dependencies: string[]; // ID tugas sebelumnya
  completionEvidence: string | null;
  notes: string | null;
}

/**
 * Butir checklist verifikasi survei atau kesiapan
 */
export interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  status: ChecklistStatus;
  notes: string | null;
  photoEvidence: string | null;
  riskLevel: RiskLevel | null;
  recommendation: string | null;
}

/**
 * Bagian-bagian formulir survei lokasi (C8)
 */
export interface SurveySections {
  location: ChecklistItem[];
  room: ChecklistItem[];
  contentProduction: ChecklistItem[];
  branding: ChecklistItem[];
  commercial: ChecklistItem[];
  documentation: ChecklistItem[];
}

/**
 * Formulir survei venue lapangan
 */
export interface SurveyForm {
  id: string;
  venueId: string;
  surveyDate: string;
  surveyor: string;
  sections: SurveySections;
  overallRecommendation: 'direkomendasikan' | 'dipertimbangkan' | 'tidak_direkomendasikan' | null;
  notes: string | null;
}

/**
 * Rincian narasumber atau pengisi acara
 */
export interface EventSpeaker {
  name: string;
  topic: string;
  role?: string;
}

/**
 * Anggota tim internal penanggung jawab
 */
export interface EventTeamMember {
  name: string;
  role: string;
  contact?: string;
}

/**
 * Mitra atau sponsor eksternal
 */
export interface EventPartner {
  name: string;
  role: string;
  contact?: string;
}

/**
 * Risiko dan mitigasi event
 */
export interface EventRisk {
  risk: string;
  mitigation: string;
  severity: 'rendah' | 'sedang' | 'tinggi';
}

/**
 * Target metrik KPI event
 */
export interface EventKPITarget {
  metric: string;
  target: number | string;
  achieved?: number | string;
}

/**
 * Entitas Event (C7 Event Planner)
 */
export interface Event {
  id: string;
  name: string;
  businessObjective: string;
  targetAudience: string[];
  targetAttendees: number;
  date: string;
  time: string;
  location: string;
  venueId: string | null;
  venue: Venue | null;
  duration: string;
  concept: string;
  speakers: EventSpeaker[];
  capacity: number;
  budgetId: string | null;
  budget: EventBudget | null;
  internalTeam: EventTeamMember[];
  externalPartners: EventPartner[];
  approvalStatus: ApprovalStatus;
  rundown: RundownItem[];
  tasks: EventTask[];
  risks: EventRisk[];
  checklist: ChecklistItem[];
  documentationPlan: string;
  contentDistributionPlan: string;
  kpis: EventKPITarget[];
  postEventEvaluation: string | null;
  status: EventStatus;
}


// ============================================================================
// 5. BUDGET & ATTENDANCE INTERFACES
// ============================================================================

/**
 * Butir pengeluaran anggaran
 */
export interface BudgetItem {
  id: string;
  category: BudgetCategory;
  description: string;
  estimatedCost: number;
  quotedCost: number | null;
  approvedBudget: number;
  actualCost: number | null;
  paidAmount: number;
  outstandingAmount: number;
  currency: string;
  notes: string | null;
  sourceUrl: string | null;
}

/**
 * Anggaran keseluruhan event (C9)
 */
export interface EventBudget {
  eventId: string;
  items: BudgetItem[];
  totalEstimated: number;
  totalQuoted: number;
  totalApproved: number;
  totalActual: number;
  totalPaid: number;
  totalOutstanding: number;
  variance: number; // actualCost - approvedBudget
  currency: string;
  notes: string | null;
}

/**
 * Umpan balik evaluasi event
 */
export interface EventFeedback {
  score: number; // 1 - 5
  notes: string;
}

/**
 * Rekam kehadiran dan performa pasca event (C10)
 */
export interface AttendanceRecord {
  eventId: string;
  targetRegistrants: number;
  actualRegistrants: number;
  attendees: number;
  completedClass: number;
  consentedLeads: number;
  relevantLeads: number;
  storeVisitsFromEvent: number;
  attributedSales: number;
  contentProduced: number;
  impressions: number;
  interactions: number;
  saves: number;
  shares: number;
  clicks: number;
  qrCodeUsage: number;
  campaignLinkUsage: number;
  participantFeedback: EventFeedback | null;
  partnerFeedback: EventFeedback | null;
  attributionSource: string | null;
  measurementPeriod: string | null;
}


// ============================================================================
// 6. TARGET KPI & STATE KESELURUHAN
// ============================================================================

/**
 * Target standar KPI Intelijen Venue & Event
 */
export interface KPITargets {
  candidatesIdentified?: number;
  adequateSources?: number;
  contactsVerified?: number;
  venuesContacted?: number;
  substantiveResponses?: number;
  venueSurveys?: number;
  recommendedVenues?: number;
  finalDecisions?: number;
  minimumResponseRate: number; // Dalam persentase (%) misal 60
  minimumSurveyConversion: number; // Dalam persentase (%) misal 40
  minimumAttendanceRate: number; // Dalam persentase (%) misal 75
  minimumEvidenceCoverage: number; // Dalam persentase (%) misal 80
  targetCostPerAttendee: number; // Dalam IDR
  targetCostPerLead: number; // Dalam IDR
}

/**
 * State utama module Venue Intelligence
 */
export interface VenueIntelligenceState {
  venues: Venue[];
  events: Event[];
  outreachActivities: OutreachActivity[];
  templates: OutreachTemplate[];
  surveyForms: SurveyForm[];
  budgets: EventBudget[];
  attendanceRecords: AttendanceRecord[];
  kpiTargets: KPITargets;
  scoreWeights?: ScoreWeights;
}


// ============================================================================
// 7. BOBOT DEFAULT & KONFIGURASI
// ============================================================================

export const DEFAULT_SCORE_WEIGHTS: ScoreWeights = {
  costFit: 0.25,
  capacityFit: 0.20,
  audienceRelevance: 0.20,
  facilityQuality: 0.15,
  accessibilityLocation: 0.10,
  collaborationPotential: 0.10,
};

export const DEFAULT_KPI_TARGETS: KPITargets = {
  candidatesIdentified: 15,
  adequateSources: 10,
  contactsVerified: 8,
  venuesContacted: 6,
  substantiveResponses: 3,
  venueSurveys: 2,
  recommendedVenues: 1,
  finalDecisions: 1,
  minimumResponseRate: 60,
  minimumSurveyConversion: 40,
  minimumAttendanceRate: 75,
  minimumEvidenceCoverage: 80,
  targetCostPerAttendee: 150000,
  targetCostPerLead: 250000,
};


// ============================================================================
// 8. FUNGSI PEMBANTU (HELPER FUNCTIONS)
// ============================================================================

/**
 * Menghasilkan UUID acak yang aman
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Membuat objek Venue baru dengan nilai default
 */
export function createEmptyVenue(): Venue {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    name: '',
    nameAlternatives: [],
    category: 'lainnya',
    address: null,
    city: null,
    district: null,
    coordinates: null,
    googleMapsUrl: null,
    websiteUrl: null,
    instagramHandle: null,
    socialMediaUrls: [],
    phone: null,
    whatsappBusiness: null,
    email: null,
    picName: null,
    picRole: null,
    capacityTotal: null,
    capacityByLayout: {
      theater: null,
      classroom: null,
      ushape: null,
      standing: null,
      boardroom: null,
    },
    roomSize: null,
    rentalOptions: [],
    pricing: [],
    deposit: null,
    additionalFees: null,
    taxInfo: null,
    cancellationPolicy: null,
    facilities: [],
    brandingPermissions: {
      backdrop: null,
      banner: null,
      booth: null,
      productDisplay: null,
      logoSponsor: null,
      qrCode: null,
      promoMaterial: null,
      notes: null,
    },
    externalEventPolicy: null,
    targetAudience: [],
    strengths: [],
    limitations: [],
    operationalStatus: 'unknown',
    lastVerifiedAt: null,
    verificationNotes: null,
    internalNotes: null,
    internalOwner: null,
    createdAt: now,
    updatedAt: now,
    outreachStatus: 'new_lead',
    score: null,
    evidences: [],
    assets: [],
    isAmbiguous: false,
    ambiguityNotes: null,
  };
}

/**
 * Membuat objek Event baru dengan nilai default
 */
export function createEmptyEvent(): Event {
  return {
    id: generateId(),
    name: '',
    businessObjective: '',
    targetAudience: [],
    targetAttendees: 0,
    date: '',
    time: '',
    location: '',
    venueId: null,
    venue: null,
    duration: '',
    concept: '',
    speakers: [],
    capacity: 0,
    budgetId: null,
    budget: null,
    internalTeam: [],
    externalPartners: [],
    approvalStatus: 'draft',
    rundown: [],
    tasks: [],
    risks: [],
    checklist: [],
    documentationPlan: '',
    contentDistributionPlan: '',
    kpis: [],
    postEventEvaluation: null,
    status: 'perencanaan',
  };
}

/**
 * Membuat entitas EventBudget baru untuk event tertentu
 */
export function createEmptyBudget(eventId: string): EventBudget {
  return {
    eventId,
    items: [],
    totalEstimated: 0,
    totalQuoted: 0,
    totalApproved: 0,
    totalActual: 0,
    totalPaid: 0,
    totalOutstanding: 0,
    variance: 0,
    currency: 'IDR',
    notes: null,
  };
}

/**
 * Membuat formulir survei lokasi baru dengan item checklist standar
 */
export function createEmptySurvey(venueId: string): SurveyForm {
  const now = new Date().toISOString().split('T')[0];
  return {
    id: generateId(),
    venueId,
    surveyDate: now,
    surveyor: '',
    sections: {
      location: [
        {
          id: generateId(),
          category: 'Akses & Parkir',
          item: 'Kemudahan akses transportasi umum & jalan utama',
          status: 'unknown',
          notes: null,
          photoEvidence: null,
          riskLevel: null,
          recommendation: null,
        },
        {
          id: generateId(),
          category: 'Akses & Parkir',
          item: 'Kapasitas parkir motor & mobil memadai',
          status: 'unknown',
          notes: null,
          photoEvidence: null,
          riskLevel: null,
          recommendation: null,
        },
      ],
      room: [
        {
          id: generateId(),
          category: 'Fisik Ruangan',
          item: 'Kapasitas ruangan sesuai kebutuhan layout',
          status: 'unknown',
          notes: null,
          photoEvidence: null,
          riskLevel: null,
          recommendation: null,
        },
        {
          id: generateId(),
          category: 'Kenyamanan',
          item: 'Suhu pendingin udara (AC) & sirkulasi udara baik',
          status: 'unknown',
          notes: null,
          photoEvidence: null,
          riskLevel: null,
          recommendation: null,
        },
        {
          id: generateId(),
          category: 'Fasilitas Dasar',
          item: 'Kebersihan toilet & ketersediaan musala',
          status: 'unknown',
          notes: null,
          photoEvidence: null,
          riskLevel: null,
          recommendation: null,
        },
      ],
      contentProduction: [
        {
          id: generateId(),
          category: 'Audio Visual',
          item: 'Kualitas proyektor / videotron & layar tajam',
          status: 'unknown',
          notes: null,
          photoEvidence: null,
          riskLevel: null,
          recommendation: null,
        },
        {
          id: generateId(),
          category: 'Audio Visual',
          item: 'Sistem tata suara (sound system) & mikrofon jernih',
          status: 'unknown',
          notes: null,
          photoEvidence: null,
          riskLevel: null,
          recommendation: null,
        },
        {
          id: generateId(),
          category: 'Listrik & Internet',
          item: 'Daya listrik mencukupi & cadangan genset tersedia',
          status: 'unknown',
          notes: null,
          photoEvidence: null,
          riskLevel: null,
          recommendation: null,
        },
        {
          id: generateId(),
          category: 'Listrik & Internet',
          item: 'Kecepatan Wi-Fi stabil untuk livestream/presentasi',
          status: 'unknown',
          notes: null,
          photoEvidence: null,
          riskLevel: null,
          recommendation: null,
        },
      ],
      branding: [
        {
          id: generateId(),
          category: 'Visibilitas Brand',
          item: 'Izin dan area peletakan banner / backdrop strategis',
          status: 'unknown',
          notes: null,
          photoEvidence: null,
          riskLevel: null,
          recommendation: null,
        },
        {
          id: generateId(),
          category: 'Aktivasi',
          item: 'Area booth / display produk memadai tanpa menghalangi jalan',
          status: 'unknown',
          notes: null,
          photoEvidence: null,
          riskLevel: null,
          recommendation: null,
        },
      ],
      commercial: [
        {
          id: generateId(),
          category: 'Ketentuan Komersial',
          item: 'Kebijakan catering / konsumsi luar diizinkan tanpa denda berlebih',
          status: 'unknown',
          notes: null,
          photoEvidence: null,
          riskLevel: null,
          recommendation: null,
        },
        {
          id: generateId(),
          category: 'Ketentuan Komersial',
          item: 'Waktu loading barang (loading in/out) fleksibel dan tanpa biaya tambahan',
          status: 'unknown',
          notes: null,
          photoEvidence: null,
          riskLevel: null,
          recommendation: null,
        },
      ],
      documentation: [
        {
          id: generateId(),
          category: 'Pencahayaan',
          item: 'Pencahayaan ruangan mendukung perekaman video & foto',
          status: 'unknown',
          notes: null,
          photoEvidence: null,
          riskLevel: null,
          recommendation: null,
        },
        {
          id: generateId(),
          category: 'Dokumentasi',
          item: 'Sudut pandang (angle) kamera luas tanpa pilar penghalang',
          status: 'unknown',
          notes: null,
          photoEvidence: null,
          riskLevel: null,
          recommendation: null,
        },
      ],
    },
    overallRecommendation: null,
    notes: null,
  };
}


// ============================================================================
// 9. LABEL FORMATTERS (BAHASA INDONESIA)
// ============================================================================

/**
 * Mendapatkan teks deskripsi Bahasa Indonesia untuk Status Penjangkauan
 */
export function getOutreachStatusLabel(status: OutreachStatus): string {
  const labels: Record<OutreachStatus, string> = {
    new_lead: 'Lead Baru',
    researching: 'Riset Awal',
    ready_to_contact: 'Siap Dihubungi',
    contacted: 'Sudah Dihubungi',
    awaiting_response: 'Menunggu Balasan',
    follow_up_due: 'Jadwal Follow-up',
    replied: 'Sudah Membalas',
    survey_scheduled: 'Survei Dijadwalkan',
    survey_completed: 'Survei Selesai',
    proposal_requested: 'Permintaan Proposal',
    negotiation: 'Negosiasi',
    awaiting_approval: 'Menunggu Persetujuan',
    approved: 'Disetujui',
    booked_confirmed: 'Terkonfirmasi & Dipesan',
    rejected: 'Ditolak',
    lost: 'Batal / Hilang',
    on_hold: 'Ditangguhkan',
  };
  return labels[status] || status;
}

/**
 * Mendapatkan teks deskripsi Bahasa Indonesia untuk Status Verifikasi
 */
export function getVerificationStatusLabel(status: VerificationStatus): string {
  const labels: Record<VerificationStatus, string> = {
    verified: 'Terverifikasi',
    partially_verified: 'Terverifikasi Sebagian',
    unverified: 'Belum Terverifikasi',
    conflicting: 'Ada Konflik Data',
    stale: 'Kedaluwarsa (Perlu Pembaruan)',
    rejected: 'Ditolak / Data Keliru',
  };
  return labels[status] || status;
}

/**
 * Mendapatkan teks deskripsi Bahasa Indonesia untuk Kategori Venue
 */
export function getCategoryLabel(category: VenueCategory): string {
  const labels: Record<VenueCategory, string> = {
    kampus: 'Kampus / Universitas',
    gedung_pertemuan: 'Gedung Pertemuan / Convention',
    hotel: 'Hotel & Ballroom',
    coworking: 'Coworking Space',
    creative_space: 'Creative Space / Galeri',
    kafe_restoran: 'Kafe & Restoran',
    komunitas: 'Ruang Komunitas',
    lainnya: 'Lainnya',
  };
  return labels[category] || category;
}

/**
 * Mendapatkan teks deskripsi Bahasa Indonesia untuk Status Operasional
 */
export function getOperationalStatusLabel(status: OperationalStatus): string {
  const labels: Record<OperationalStatus, string> = {
    active: 'Beroperasi Aktif',
    temporarily_closed: 'Tutup Sementara',
    permanently_closed: 'Tutup Permanen',
    unknown: 'Belum Diketahui',
    under_renovation: 'Dalam Renovasi',
  };
  return labels[status] || status;
}

/**
 * Mendapatkan teks deskripsi Bahasa Indonesia untuk Kategori Anggaran
 */
export function getBudgetCategoryLabel(category: BudgetCategory): string {
  const labels: Record<BudgetCategory, string> = {
    sewa_venue: 'Sewa Venue & Ruangan',
    konsumsi: 'Konsumsi & F&B',
    honor_narasumber: 'Honor Narasumber & Pembicara',
    transportasi: 'Transportasi & Akomodasi',
    peralatan: 'Sewa Peralatan Audio/Visual',
    dekorasi_branding: 'Dekorasi & Material Branding',
    dokumentasi: 'Dokumentasi & Produksi Konten',
    materi_promosi: 'Materi Promosi & Iklan',
    merchandise: 'Merchandise & Souvenir',
    operasional: 'Operasional & Perizinan',
    pajak: 'Pajak & Retribusi',
    contingency: 'Dana Cadangan (Contingency)',
  };
  return labels[category] || category;
}

/**
 * Mendapatkan teks deskripsi Bahasa Indonesia untuk Tipe Sumber Bukti
 */
export function getSourceTypeLabel(type: SourceType): string {
  const labels: Record<SourceType, string> = {
    official_website: 'Situs Resmi',
    official_contact_page: 'Halaman Kontak Resmi',
    official_brochure: 'Brosur / Rate Card Resmi',
    official_social_media: 'Media Sosial Resmi',
    direct_confirmation: 'Konfirmasi Langsung Pengelola',
    reputable_directory: 'Direktori Kredibel',
    user_provided: 'Data Masukan Pengguna',
    unverified_lead: 'Lead Belum Terverifikasi',
  };
  return labels[type] || type;
}


// ============================================================================
// 10. KALKULASI & ANALITIK
// ============================================================================

/**
 * Menghitung skor venue secara objektif dengan bobot terkonfigurasi.
 * Normalisasi skor hanya menghitung kriteria yang memiliki data nyata (bukan nilai unknown/default).
 */
export function calculateVenueScore(
  venue: Venue,
  weights: ScoreWeights = DEFAULT_SCORE_WEIGHTS
): VenueScore {
  // Evaluasi kelengkapan data & klaim
  const keyFieldsToCheck: (unknown)[] = [
    venue.name,
    venue.address,
    venue.phone || venue.whatsappBusiness || venue.email,
    venue.capacityTotal,
    venue.rentalOptions.length > 0 ? true : null,
    venue.facilities.length > 0 ? true : null,
    venue.googleMapsUrl,
    venue.socialMediaUrls.length > 0 || venue.instagramHandle ? true : null,
    venue.brandingPermissions.backdrop !== null || venue.brandingPermissions.banner !== null ? true : null,
    venue.operationalStatus !== 'unknown' ? true : null,
  ];

  const knownFieldsCount = keyFieldsToCheck.filter((f) => f !== null && f !== undefined && f !== '').length;
  const dataCompleteness = Math.round((knownFieldsCount / keyFieldsToCheck.length) * 100);

  const verifiedClaimsCount = venue.evidences.filter(
    (e) => e.verificationStatus === 'verified'
  ).length;

  const unknownClaimsCount = venue.evidences.filter(
    (e) => e.verificationStatus === 'unverified' || e.verificationStatus === 'stale'
  ).length;

  // Nilai kriteria (0-5)
  // 1. Kesesuaian Biaya (Cost Fit): Apakah ada opsi sewa jelas dan terjangkau
  let costFit = 3.0;
  if (venue.rentalOptions.length > 0) {
    const minPrice = Math.min(
      ...venue.rentalOptions.map((o) => o.price ?? 999999999)
    );
    if (minPrice <= 1500000) costFit = 4.8;
    else if (minPrice <= 3000000) costFit = 4.2;
    else if (minPrice <= 5000000) costFit = 3.5;
    else if (minPrice <= 10000000) costFit = 2.8;
    else costFit = 2.0;
  }

  // 2. Kesesuaian Kapasitas (Capacity Fit)
  let capacityFit = 3.0;
  if (venue.capacityTotal !== null) {
    if (venue.capacityTotal >= 50 && venue.capacityTotal <= 300) {
      capacityFit = 4.7; // Sweet spot untuk target workshop/seminar
    } else if (venue.capacityTotal > 300) {
      capacityFit = 4.0;
    } else if (venue.capacityTotal >= 20) {
      capacityFit = 3.5;
    } else {
      capacityFit = 2.2;
    }
  }

  // 3. Relevansi Audiens (Audience Relevance)
  let audienceRelevance = 3.0;
  if (['kampus', 'coworking', 'creative_space'].includes(venue.category)) {
    audienceRelevance = 4.6;
  } else if (['hotel', 'gedung_pertemuan'].includes(venue.category)) {
    audienceRelevance = 4.0;
  } else if (venue.category === 'kafe_restoran') {
    audienceRelevance = 3.6;
  }

  // 4. Kualitas Fasilitas (Facility Quality)
  let facilityQuality = 3.0;
  if (venue.facilities.length > 0) {
    const availableCount = venue.facilities.filter((f) => f.available === true).length;
    const ratio = availableCount / venue.facilities.length;
    facilityQuality = Math.min(5.0, Math.max(1.0, Number((ratio * 5).toFixed(1))));
  }

  // 5. Kemudahan Akses & Lokasi (Accessibility Location)
  let accessibilityLocation = 3.0;
  if (venue.googleMapsUrl && venue.coordinates) {
    accessibilityLocation = 4.5;
  } else if (venue.address && venue.city) {
    accessibilityLocation = 3.8;
  }

  // 6. Potensi Kolaborasi (Collaboration Potential)
  let collaborationPotential = 3.0;
  const bp = venue.brandingPermissions;
  const permissionCount = [
    bp.backdrop,
    bp.banner,
    bp.booth,
    bp.productDisplay,
    bp.logoSponsor,
    bp.qrCode,
    bp.promoMaterial,
  ].filter((p) => p === true).length;

  if (permissionCount >= 5) collaborationPotential = 4.8;
  else if (permissionCount >= 3) collaborationPotential = 4.0;
  else if (permissionCount >= 1) collaborationPotential = 3.2;

  // Hitung Skor Tertimbang Normal (0-100)
  const weightedSum =
    costFit * weights.costFit +
    capacityFit * weights.capacityFit +
    audienceRelevance * weights.audienceRelevance +
    facilityQuality * weights.facilityQuality +
    accessibilityLocation * weights.accessibilityLocation +
    collaborationPotential * weights.collaborationPotential;

  const totalWeight =
    weights.costFit +
    weights.capacityFit +
    weights.audienceRelevance +
    weights.facilityQuality +
    weights.accessibilityLocation +
    weights.collaborationPotential;

  const rawScoreOutOfFive = totalWeight > 0 ? weightedSum / totalWeight : 0;
  const normalizedScore = Math.min(100, Math.max(0, Math.round((rawScoreOutOfFive / 5) * 100)));

  let scoreExplanation = 'Venue memiliki potensi standar untuk pelaksanaan kegiatan.';
  if (normalizedScore >= 80) {
    scoreExplanation = 'Sangat direkomendasikan: kesesuaian fasilitas, biaya, dan fleksibilitas branding sangat baik.';
  } else if (normalizedScore >= 65) {
    scoreExplanation = 'Direkomendasikan dengan catatan: perhatikan negosiasi biaya dan verifikasi izin branding.';
  } else if (normalizedScore < 50) {
    scoreExplanation = 'Kurang direkomendasikan: kelengkapan fasilitas atau keterbatasan izin promosi memerlukan alternatif.';
  }

  return {
    venueId: venue.id,
    costFit,
    capacityFit,
    audienceRelevance,
    facilityQuality,
    accessibilityLocation,
    collaborationPotential,
    weights,
    normalizedScore,
    dataCompleteness,
    verifiedClaimsCount,
    unknownClaimsCount,
    scoreExplanation,
    scoredAt: new Date().toISOString(),
  };
}

/**
 * Menghitung akumulasi total anggaran event beserta variansnya.
 * Variance = actualCost - approvedBudget (nilai positif menandakan over-budget).
 */
export function calculateBudgetTotals(items: BudgetItem[]): {
  totalEstimated: number;
  totalQuoted: number;
  totalApproved: number;
  totalActual: number;
  totalPaid: number;
  totalOutstanding: number;
  variance: number;
} {
  let totalEstimated = 0;
  let totalQuoted = 0;
  let totalApproved = 0;
  let totalActual = 0;
  let totalPaid = 0;
  let totalOutstanding = 0;

  for (const item of items) {
    totalEstimated += item.estimatedCost || 0;
    totalQuoted += item.quotedCost || 0;
    totalApproved += item.approvedBudget || 0;
    totalActual += item.actualCost || 0;
    totalPaid += item.paidAmount || 0;
    totalOutstanding += item.outstandingAmount || 0;
  }

  // Variance: actualCost - approvedBudget
  const variance = totalActual - totalApproved;

  return {
    totalEstimated,
    totalQuoted,
    totalApproved,
    totalActual,
    totalPaid,
    totalOutstanding,
    variance,
  };
}

/**
 * Menghitung tingkat balasan penjangkauan (Response Rate %)
 * Penjajakan yang mendapatkan respon / total aktivitas penjangkauan
 */
export function calculateResponseRate(activities: OutreachActivity[]): number {
  if (!activities || activities.length === 0) return 0;

  const respondedCount = activities.filter((act) => {
    return (
      act.responsePreview !== null ||
      [
        'replied',
        'survey_scheduled',
        'survey_completed',
        'proposal_requested',
        'negotiation',
        'awaiting_approval',
        'approved',
        'booked_confirmed',
        'rejected',
      ].includes(act.statusHistory[act.statusHistory.length - 1]?.status || '')
    );
  }).length;

  return Number(((respondedCount / activities.length) * 100).toFixed(1));
}

/**
 * Menghitung konversi survei (Survey Conversion %)
 * Persentase aktivitas penjangkauan yang berhasil mencapai tahap survei lokasi
 */
export function calculateSurveyConversion(activities: OutreachActivity[]): number {
  if (!activities || activities.length === 0) return 0;

  const surveyStageCount = activities.filter((act) => {
    return act.statusHistory.some((history) =>
      [
        'survey_scheduled',
        'survey_completed',
        'proposal_requested',
        'negotiation',
        'awaiting_approval',
        'approved',
        'booked_confirmed',
      ].includes(history.status)
    );
  }).length;

  return Number(((surveyStageCount / activities.length) * 100).toFixed(1));
}

/**
 * Menghitung rasio kehadiran peserta (Attendance Rate %)
 * Peserta hadir / Target pendaftar atau pendaftar aktual
 */
export function calculateAttendanceRate(record: AttendanceRecord): number {
  if (!record) return 0;
  const denominator = record.actualRegistrants > 0 ? record.actualRegistrants : record.targetRegistrants;
  if (!denominator || denominator <= 0) return 0;

  const rate = (record.attendees / denominator) * 100;
  return Number(Math.min(100, Math.max(0, rate)).toFixed(1));
}

/**
 * Menghitung cakupan klaim terverifikasi pada venue (Evidence Coverage %)
 */
export function calculateEvidenceCoverage(venue: Venue): number {
  if (!venue || !venue.evidences || venue.evidences.length === 0) return 0;

  const verifiedCount = venue.evidences.filter(
    (e) => e.verificationStatus === 'verified'
  ).length;

  return Number(((verifiedCount / venue.evidences.length) * 100).toFixed(1));
}

/**
 * Menghitung biaya per peserta hadir (Cost Per Attendee)
 * Mengembalikan null jika peserta 0 atau belum ada biaya aktual
 */
export function calculateCostPerAttendee(
  totalActualCost: number,
  attendees: number
): number | null {
  if (!attendees || attendees <= 0 || !totalActualCost || totalActualCost <= 0) {
    return null;
  }
  return Math.round(totalActualCost / attendees);
}

/**
 * Menghitung biaya per lead yang didapat (Cost Per Lead)
 * Mengembalikan null jika jumlah leads 0 atau belum ada biaya aktual
 */
export function calculateCostPerLead(
  totalActualCost: number,
  leads: number
): number | null {
  if (!leads || leads <= 0 || !totalActualCost || totalActualCost <= 0) {
    return null;
  }
  return Math.round(totalActualCost / leads);
}
