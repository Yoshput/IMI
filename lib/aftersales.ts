// Aftersales CRM Model, Database & Helpers for Optik I See You

export const AFTERSALES_CS_PHONE = "+62 821-4601-328";
export const AFTERSALES_CS_PHONE_RAW = "628214601328";
export const AFTERSALES_CS_WA_URL = "https://wa.me/628214601328";

export type FollowUpStatus =
  | "belum_dihubungi"
  | "sudah_dihubungi"
  | "selesai_puas"
  | "butuh_garansi";

export interface CustomerPrescription {
  odSph: string; // Kanan Sferis
  odCyl: string; // Kanan Silinder
  odAxis?: string;
  osSph: string; // Kiri Sferis
  osCyl: string; // Kiri Silinder
  osAxis?: string;
  add?: string;  // Baca dekat
  pd: string;   // Pupil distance (mm)
}

export interface CustomerInteractionLog {
  id: string;
  date: string;
  type: "whatsapp_message" | "phone_call" | "store_visit" | "web_antrian_click";
  actor: string;
  note: string;
}

export interface CustomerAftersalesRecord {
  id: string;
  name: string;
  phone: string;
  branch: string;
  branchKey: "PWT" | "CLP" | "PBG" | "WNS" | "TGL";
  city: string;
  timestamp: string; // Exact ISO timestamp from Column A (e.g. "2026-09-24T16:16:12.000Z")
  timestampFormatted: string; // Formatted datetime string (e.g. "24 Sep 2026, 16:16 WIB")
  timestampDate: string; // Date string for filtering (e.g. "2026-09-24")
  reportType: "Review" | "Komplain" | "Pemeriksaan";
  examDate: string;
  pickupDate: string;
  frameModel: string;
  lensType: string;
  totalTransaction: number;
  prescription: CustomerPrescription;
  status: FollowUpStatus;
  notes: string;
  feedbackText?: string;
  suggestionText?: string;
  inquiryChannel: "web_antrian" | "walk_in" | "instagram_dm" | "tiktok_dm";
  satisfactionScore?: number; // 1-5
  logs: CustomerInteractionLog[];
}

// 100% Real data is synced live from Google Spreadsheet ID 10lKjuzUvWhnUKbKNEo4opo4MiQoesZKW4NhY9sQ4T8w
export const INITIAL_CUSTOMERS: CustomerAftersalesRecord[] = [];
