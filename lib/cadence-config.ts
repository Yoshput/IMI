/**
 * UNIFIED CADENCE & CYCLE CONFIGURATION
 * Single Source of Truth for I See You Marketing Intelligence (IMI)
 * 
 * Aturan Bisnis & Integritas:
 * - Timezone: Asia/Jakarta (WIB)
 * - Meeting Date: 2026-10-13 (Selasa)
 * - Active Evaluation Period: Siklus 8 (6–12 Oktober 2026)
 * - Previous Evaluation Period: Siklus 7 (29 September – 5 Oktober 2026)
 * - Historical Periods: Siklus 1 - 6
 * - 6 PIC Cabang:
 *   1. Nuha (Story PWT)
 *   2. Ilya (Reels PWT)
 *   3. Ajun (PBG - Purbalingga)
 *   4. Arum (CLP - Cilacap)
 *   5. Febi (WNS - Wonosobo)
 *   6. Amanda (TGL - Lunar Eyewear Tegal / Second Brand)
 */

export interface EvaluationCycle {
  id: string;
  cycleNumber: number;
  label: string;
  shortLabel: string;
  meetingDate: string; // YYYY-MM-DD
  meetingDateTitle: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  previousCycleId?: string;
  isCurrent: boolean;
  isPartial: boolean; // True jika periode masih berjalan sebelum cutoff 23:59 WIB
}

export interface PicDefinition {
  id: string;
  name: string;
  role: string;
  branchKey: "PWT" | "PBG" | "CLP" | "WNS" | "TGL";
  branchName: string;
  channel: "story" | "reels" | "all";
  sheetTab: string;
}

export const TIMEZONE_WIB = "Asia/Jakarta";

export const PIC_DEFINITIONS: PicDefinition[] = [
  {
    id: "pic-nuha",
    name: "Nuha",
    role: "Story PWT",
    branchKey: "PWT",
    branchName: "Purwokerto (Pusat)",
    channel: "story",
    sheetTab: "Rekap Story PWT",
  },
  {
    id: "pic-ilya",
    name: "Ilya",
    role: "Reels PWT",
    branchKey: "PWT",
    branchName: "Purwokerto (Pusat)",
    channel: "reels",
    sheetTab: "Rekap PWT",
  },
  {
    id: "pic-ajun",
    name: "Ajun",
    role: "PIC Purbalingga",
    branchKey: "PBG",
    branchName: "Purbalingga",
    channel: "all",
    sheetTab: "Rekap PBG",
  },
  {
    id: "pic-arum",
    name: "Arum",
    role: "PIC Cilacap",
    branchKey: "CLP",
    branchName: "Cilacap",
    channel: "all",
    sheetTab: "Rekap CLP",
  },
  {
    id: "pic-febi",
    name: "Febi",
    role: "PIC Wonosobo",
    branchKey: "WNS",
    branchName: "Wonosobo",
    channel: "all",
    sheetTab: "Rekap WNS",
  },
  {
    id: "pic-amanda",
    name: "Amanda",
    role: "PIC Tegal (Lunar Eyewear)",
    branchKey: "TGL",
    branchName: "Lunar Eyewear Tegal (Second Brand)",
    channel: "all",
    sheetTab: "Rekap TGL",
  },
];

export const EVALUATION_CYCLES: EvaluationCycle[] = [
  {
    id: "cycle-8",
    cycleNumber: 8,
    label: "Siklus 8 · 6–12 Oktober 2026 · Rapat 13 Oktober",
    shortLabel: "Siklus 8 (6–12 Okt)",
    meetingDate: "2026-10-13",
    meetingDateTitle: "Rapat Evaluasi Mingguan — Selasa, 13 Oktober 2026",
    startDate: "2026-10-06",
    endDate: "2026-10-12",
    previousCycleId: "cycle-7",
    isCurrent: true,
    isPartial: false, // Per 12 Oktober 2026 sore/malam menjelang rapat 13 Okt
  },
  {
    id: "cycle-7",
    cycleNumber: 7,
    label: "Siklus 7 · 29 September – 5 Oktober 2026 · Rapat 6 Oktober",
    shortLabel: "Siklus 7 (29 Sep – 5 Okt)",
    meetingDate: "2026-10-06",
    meetingDateTitle: "Rapat Evaluasi Mingguan — Selasa, 6 Oktober 2026",
    startDate: "2026-09-29",
    endDate: "2026-10-05",
    previousCycleId: "cycle-6",
    isCurrent: false,
    isPartial: false,
  },
  {
    id: "cycle-6",
    cycleNumber: 6,
    label: "Siklus 6 · 22–28 September 2026 · Rapat 29 September",
    shortLabel: "Siklus 6 (22–28 Sep)",
    meetingDate: "2026-09-29",
    meetingDateTitle: "Rapat Evaluasi Mingguan — Selasa, 29 September 2026",
    startDate: "2026-09-22",
    endDate: "2026-09-28",
    isCurrent: false,
    isPartial: false,
  },
];

// Active Cycle for Meeting
export const ACTIVE_MEETING_CYCLE: EvaluationCycle = EVALUATION_CYCLES[0];

/**
 * Format string tanggal WIB
 */
export function formatWibDateTime(date: Date = new Date()): string {
  return date.toLocaleString("id-ID", {
    timeZone: TIMEZONE_WIB,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }) + " WIB";
}

/**
 * Cek apakah tanggal YYYY-MM-DD masuk ke dalam rentang siklus tertentu
 */
export function isDateInCycle(dateStr: string | null | undefined, cycle: EvaluationCycle = ACTIVE_MEETING_CYCLE): boolean {
  if (!dateStr) return false;
  const d = dateStr.slice(0, 10);
  return d >= cycle.startDate && d <= cycle.endDate;
}
