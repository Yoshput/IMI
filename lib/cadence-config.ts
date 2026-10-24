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
 *   4. Intan (CLP - Cilacap)
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
  meetingTarget?: string; // "Selasa, 20 Oktober 2026"
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  previousCycleId?: string;
  isCurrent: boolean;
  isPartial: boolean; // True jika periode masih berjalan sebelum cutoff 23:59 WIB
  isArchive?: boolean;
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
export const PRODUCTION_BASE_URL = "https://iseeyou-marketing-intelligence.vercel.app";

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
    id: "pic-intan",
    name: "Intan",
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
    id: "cycle-10",
    cycleNumber: 10,
    label: "Siklus 10 · 20–26 Oktober 2026 · Rapat 27 Oktober",
    shortLabel: "Siklus 10 (20–26 Okt)",
    meetingDate: "2026-10-27",
    meetingTarget: "Selasa, 27 Oktober 2026",
    meetingDateTitle: "Rapat Evaluasi Mingguan — Selasa, 27 Oktober 2026",
    startDate: "2026-10-20",
    endDate: "2026-10-26",
    previousCycleId: "cycle-9",
    isCurrent: false,
    isPartial: true,
    isArchive: false,
  },
  {
    id: "cycle-9",
    cycleNumber: 9,
    label: "Siklus 9 · 13–19 Oktober 2026 · Rapat 20 Oktober",
    shortLabel: "Siklus 9 (13–19 Okt)",
    meetingDate: "2026-10-20",
    meetingTarget: "Selasa, 20 Oktober 2026",
    meetingDateTitle: "Rapat Evaluasi Mingguan — Selasa, 20 Oktober 2026",
    startDate: "2026-10-13",
    endDate: "2026-10-19",
    previousCycleId: "cycle-8",
    isCurrent: true,
    isPartial: true, // Berjalan s/d 19 Oktober malam cutoff menjelang rapat 20 Okt
    isArchive: false,
  },
  {
    id: "cycle-8",
    cycleNumber: 8,
    label: "Siklus 8 · 6–12 Oktober 2026 · Rapat 13 Oktober",
    shortLabel: "Siklus 8 (6–12 Okt)",
    meetingDate: "2026-10-13",
    meetingTarget: "Selasa, 13 Oktober 2026",
    meetingDateTitle: "Rapat Evaluasi Mingguan — Selasa, 13 Oktober 2026",
    startDate: "2026-10-06",
    endDate: "2026-10-12",
    previousCycleId: "cycle-7",
    isCurrent: false,
    isPartial: false,
    isArchive: true,
  },
  {
    id: "cycle-7",
    cycleNumber: 7,
    label: "Siklus 7 · 29 September – 5 Oktober 2026 · Rapat 6 Oktober",
    shortLabel: "Siklus 7 (29 Sep – 5 Okt)",
    meetingDate: "2026-10-06",
    meetingTarget: "Selasa, 6 Oktober 2026",
    meetingDateTitle: "Rapat Evaluasi Mingguan — Selasa, 6 Oktober 2026",
    startDate: "2026-09-29",
    endDate: "2026-10-05",
    previousCycleId: "cycle-6",
    isCurrent: false,
    isPartial: false,
    isArchive: true,
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
    previousCycleId: "cycle-5",
    isCurrent: false,
    isPartial: false,
  },
  {
    id: "cycle-5",
    cycleNumber: 5,
    label: "Siklus 5 · 15–21 September 2026 · Rapat 22 September",
    shortLabel: "Siklus 5 (15–21 Sep)",
    meetingDate: "2026-09-22",
    meetingDateTitle: "Rapat Evaluasi Mingguan — Selasa, 22 September 2026",
    startDate: "2026-09-15",
    endDate: "2026-09-21",
    previousCycleId: "cycle-4",
    isCurrent: false,
    isPartial: false,
  },
  {
    id: "cycle-4",
    cycleNumber: 4,
    label: "Siklus 4 · 18–20 September 2026",
    shortLabel: "Siklus 4 (18–20 Sep)",
    meetingDate: "2026-09-21",
    meetingDateTitle: "Evaluasi Khusus Siklus 4 — Gathering & Store POV",
    startDate: "2026-09-18",
    endDate: "2026-09-20",
    previousCycleId: "cycle-3",
    isCurrent: false,
    isPartial: false,
  },
  {
    id: "cycle-3",
    cycleNumber: 3,
    label: "Siklus 3 · 14–17 September 2026",
    shortLabel: "Siklus 3 (14–17 Sep)",
    meetingDate: "2026-09-18",
    meetingDateTitle: "Evaluasi Khusus Siklus 3 — Pertengahan Bulan",
    startDate: "2026-09-14",
    endDate: "2026-09-17",
    previousCycleId: "cycle-2",
    isCurrent: false,
    isPartial: false,
  },
  {
    id: "cycle-2",
    cycleNumber: 2,
    label: "Siklus 2 · 11–13 September 2026",
    shortLabel: "Siklus 2 (11–13 Sep)",
    meetingDate: "2026-09-14",
    meetingDateTitle: "Evaluasi Khusus Siklus 2 — Edukasi & Restock",
    startDate: "2026-09-11",
    endDate: "2026-09-13",
    previousCycleId: "cycle-1",
    isCurrent: false,
    isPartial: false,
  },
  {
    id: "cycle-1",
    cycleNumber: 1,
    label: "Siklus 1 · 8–10 September 2026",
    shortLabel: "Siklus 1 (8–10 Sep)",
    meetingDate: "2026-09-11",
    meetingDateTitle: "Evaluasi Khusus Siklus 1 — Awal Pekan September",
    startDate: "2026-09-08",
    endDate: "2026-09-10",
    isCurrent: false,
    isPartial: false,
  },
];

export const CADENCE_CYCLES = EVALUATION_CYCLES;

/**
 * Dapatkan tanggal hari ini dalam format YYYY-MM-DD berbasis zona waktu Asia/Jakarta (WIB)
 */
export function getWibToday(date: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: TIMEZONE_WIB,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(date);
  } catch {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
}

/**
 * Resolusi siklus aktif secara dinamis:
 * 1. Jika ada env NEXT_PUBLIC_ACTIVE_CYCLE_ID, prioritaskan siklus tersebut.
 * 2. Jika diberikan cycleId eksplisit, ambil siklus tersebut.
 * 3. Default: Siklus 9 (cycle-9) untuk persiapan rapat 20 Oktober 2026.
 */
export function resolveActiveCycle(cycleIdOrDate?: string): EvaluationCycle {
  const configuredId =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_ACTIVE_CYCLE_ID) ||
    cycleIdOrDate ||
    "cycle-9";

  const found = EVALUATION_CYCLES.find((c) => c.id === configuredId);
  if (found) return found;

  // Cek apakah cycleIdOrDate berupa tanggal YYYY-MM-DD
  if (cycleIdOrDate && /^\d{4}-\d{2}-\d{2}$/.test(cycleIdOrDate)) {
    const matched = EVALUATION_CYCLES.find(
      (c) => cycleIdOrDate >= c.startDate && cycleIdOrDate <= c.endDate
    );
    if (matched) return matched;
  }

  return (
    EVALUATION_CYCLES.find((c) => c.isCurrent) ||
    EVALUATION_CYCLES.find((c) => c.id === "cycle-9") ||
    EVALUATION_CYCLES[0]
  );
}

// Active Cycle for Current Meeting Preparation
export const ACTIVE_MEETING_CYCLE: EvaluationCycle = resolveActiveCycle();

/**
 * Format string tanggal & waktu WIB
 */
export function formatWibDateTime(date: Date = new Date()): string {
  return (
    date.toLocaleString("id-ID", {
      timeZone: TIMEZONE_WIB,
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB"
  );
}

/**
 * Format tanggal pendek Bahasa Indonesia (misal: "13 Okt")
 */
export function formatShortIndo(isoStr: string): string {
  if (!isoStr) return "";
  const parts = isoStr.split("-");
  if (parts.length < 3) return isoStr;
  const day = parseInt(parts[2], 10);
  const mIdx = parseInt(parts[1], 10) - 1;
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return `${day} ${months[mIdx] || ""}`;
}

/**
 * Cek apakah tanggal YYYY-MM-DD masuk ke dalam rentang siklus tertentu
 */
export function isDateInCycle(
  dateStr: string | null | undefined,
  cycle: EvaluationCycle = ACTIVE_MEETING_CYCLE
): boolean {
  if (!dateStr) return false;
  const d = dateStr.slice(0, 10);
  return d >= cycle.startDate && d <= cycle.endDate;
}

