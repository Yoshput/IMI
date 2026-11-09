import { ContentItem, DesignDatabaseItem, MonthlyPeriod, WeekFilterKey } from "@/types";

export interface WeekPeriodOption {
  key: WeekFilterKey;
  label: string;
  shortLabel: string;
  startDay: number;
  endDay: number;
}

/**
 * Daftar opsi minggu dalam satu bulan:
 * - Minggu 1: Tgl 1 - 7
 * - Minggu 2: Tgl 8 - 14
 * - Minggu 3: Tgl 15 - 21
 * - Minggu 4 (Bulanan Penuh M1-M4): Gabungan Minggu 1 s.d. 4 (Default Bulanan)
 * - Minggu 4 Saja: Tgl 22 s.d. Akhir Bulan
 */
export function getWeekOptions(monthKey: string): WeekPeriodOption[] {
  const [yearStr, monthStr] = (monthKey || "2026-10").split("-");
  const year = parseInt(yearStr, 10) || 2026;
  const month = parseInt(monthStr, 10) || 10;
  const lastDay = new Date(year, month, 0).getDate();

  return [
    {
      key: "w4_monthly",
      label: `Minggu 4 (Bulanan M1-M4 · 1 - ${lastDay} Penuh)`,
      shortLabel: "Minggu 4 (Bulanan M1-M4)",
      startDay: 1,
      endDay: lastDay,
    },
    {
      key: "w1",
      label: "Minggu 1 (Tgl 1 - 7)",
      shortLabel: "Minggu 1 (1-7)",
      startDay: 1,
      endDay: 7,
    },
    {
      key: "w2",
      label: "Minggu 2 (Tgl 8 - 14)",
      shortLabel: "Minggu 2 (8-14)",
      startDay: 8,
      endDay: 14,
    },
    {
      key: "w3",
      label: "Minggu 3 (Tgl 15 - 21)",
      shortLabel: "Minggu 3 (15-21)",
      startDay: 15,
      endDay: 21,
    },
    {
      key: "w4_only",
      label: `Minggu 4 Saja (Tgl 22 - ${lastDay})`,
      shortLabel: `Minggu 4 (22-${lastDay})`,
      startDay: 22,
      endDay: lastDay,
    },
  ];
}

/**
 * Memeriksa apakah tanggal berada di dalam rentang minggu yang dipilih.
 */
export function isDateInWeek(dateStr: string, weekKey: WeekFilterKey): boolean {
  if (weekKey === "w4_monthly") return true; // Full month
  const iso = normalizeDateToISO(dateStr);
  if (!iso || !iso.includes("-")) return true;
  const parts = iso.split("-");
  const day = parseInt(parts[2], 10);
  if (isNaN(day)) return true;

  if (weekKey === "w1") return day >= 1 && day <= 7;
  if (weekKey === "w2") return day >= 8 && day <= 14;
  if (weekKey === "w3") return day >= 15 && day <= 21;
  if (weekKey === "w4_only") return day >= 22;
  return true;
}

/**
 * Format label judul periode laporan (misal: "Minggu 1 (1 - 7 Oktober 2026)" atau "Rekap Bulanan M1-M4 (Oktober 2026)")
 */
export function formatPeriodHeader(monthKey: string, weekKey: WeekFilterKey = "w4_monthly"): string {
  const monthLabel = formatMonthLabel(monthKey);
  const [yearStr, monthStr] = (monthKey || "2026-10").split("-");
  const year = parseInt(yearStr, 10) || 2026;
  const month = parseInt(monthStr, 10) || 10;
  const lastDay = new Date(year, month, 0).getDate();

  if (weekKey === "w1") return `Minggu 1 (1 - 7 ${monthLabel})`;
  if (weekKey === "w2") return `Minggu 2 (8 - 14 ${monthLabel})`;
  if (weekKey === "w3") return `Minggu 3 (15 - 21 ${monthLabel})`;
  if (weekKey === "w4_only") return `Minggu 4 (22 - ${lastDay} ${monthLabel})`;
  return `Rekap Bulanan M1 - M4 (${monthLabel})`;
}

/**
 * Format suffix file ekspor PDF/PPT (misal: "2026-10_Minggu-1" atau "2026-10_Bulanan_M1-M4")
 */
export function getFilePeriodSuffix(monthKey: string, weekKey: WeekFilterKey = "w4_monthly"): string {
  if (weekKey === "w1") return `${monthKey}_Minggu-1`;
  if (weekKey === "w2") return `${monthKey}_Minggu-2`;
  if (weekKey === "w3") return `${monthKey}_Minggu-3`;
  if (weekKey === "w4_only") return `${monthKey}_Minggu-4`;
  return `${monthKey}_Bulanan_M1-M4`;
}

const MONTH_NAMES_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

/**
 * Mengembalikan bulan berjalan format "YYYY-MM" (contoh: "2026-11").
 */
export function getCurrentMonthKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

/**
 * Mengubah "2026-10" menjadi "Oktober 2026", "2026-11" menjadi "November 2026", dst.
 */
export function formatMonthLabel(monthKey: string): string {
  if (!monthKey) return "";
  const parts = monthKey.split("-");
  if (parts.length === 2) {
    const year = parts[0];
    const monthIdx = parseInt(parts[1], 10) - 1;
    if (monthIdx >= 0 && monthIdx < 12) {
      return `${MONTH_NAMES_ID[monthIdx]} ${year}`;
    }
  }
  // Fallback if format is "M/YYYY" or "MM/YYYY"
  if (monthKey.includes("/")) {
    const slashParts = monthKey.split("/");
    if (slashParts.length === 2) {
      const monthIdx = parseInt(slashParts[0], 10) - 1;
      const year = slashParts[1];
      if (monthIdx >= 0 && monthIdx < 12) {
        return `${MONTH_NAMES_ID[monthIdx]} ${year}`;
      }
    }
  }
  return monthKey;
}

/**
 * Mengekstrak "YYYY-MM" dari berbagai format string tanggal:
 * - ISO: "2026-10-13", "2026-10-13T12:00:00Z"
 * - Sheets M/D/YYYY atau MM/DD/YYYY: "10/28/2026", "6/23/2026 3:30:00"
 * - Sheets D/M/YYYY jika tahun di belakang
 */
export function extractMonthKeyFromDate(dateStr: string): string | null {
  if (!dateStr || typeof dateStr !== "string") return null;
  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  // 1. ISO format: YYYY-MM-DD
  const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})(?:-\d{1,2})?/);
  if (isoMatch) {
    const year = isoMatch[1];
    const month = isoMatch[2].padStart(2, "0");
    return `${year}-${month}`;
  }

  // 2. Google Sheets format: M/D/YYYY or MM/DD/YYYY (may have timestamp)
  const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (slashMatch) {
    let p1 = parseInt(slashMatch[1], 10);
    let p2 = parseInt(slashMatch[2], 10);
    const year = slashMatch[3];

    // Check if p1 is month (standard Google Sheets Form Responses: MM/DD/YYYY)
    // If p1 > 12, then p1 is day and p2 is month
    let month = p1;
    if (p1 > 12 && p2 <= 12) {
      month = p2;
    }
    return `${year}-${String(month).padStart(2, "0")}`;
  }

  // 3. Fallback date parse
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  }

  return null;
}

/**
 * Menormalisasi tanggal input/posting ke "YYYY-MM-DD" agar konsisten diurutkan.
 */
export function normalizeDateToISO(dateStr: string): string {
  if (!dateStr || typeof dateStr !== "string") return "";
  const trimmed = dateStr.trim();

  // If already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  // If ISO with time
  const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2].padStart(2, "0")}-${isoMatch[3].padStart(2, "0")}`;
  }

  // If slash format M/D/YYYY or MM/DD/YYYY
  const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (slashMatch) {
    let p1 = parseInt(slashMatch[1], 10);
    let p2 = parseInt(slashMatch[2], 10);
    const year = slashMatch[3];

    let month = p1;
    let day = p2;
    if (p1 > 12 && p2 <= 12) {
      day = p1;
      month = p2;
    }
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return trimmed;
}

/**
 * Mengubah "2026-10-13" menjadi "13 Oktober 2026"
 */
export function formatDateIndo(dateStr: string): string {
  const iso = normalizeDateToISO(dateStr);
  if (!iso || !iso.includes("-")) return dateStr;
  const parts = iso.split("-");
  if (parts.length === 3) {
    const year = parts[0];
    const monthIdx = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    if (monthIdx >= 0 && monthIdx < 12) {
      return `${day} ${MONTH_NAMES_ID[monthIdx]} ${year}`;
    }
  }
  return dateStr;
}

/**
 * Mengumpulkan daftar unik seluruh bulan yang memiliki data + selalu menyertakan
 * bulan berjalan (getCurrentMonthKey()) serta "2026-10" dan "2026-11", diurutkan dari terbaru ke terlama.
 */
export function getAvailableMonths(
  contentItems: ContentItem[] = [],
  designItems: DesignDatabaseItem[] = []
): MonthlyPeriod[] {
  const monthKeySet = new Set<string>();

  // Always include current month and known key operational months
  monthKeySet.add(getCurrentMonthKey());
  monthKeySet.add("2026-11");
  monthKeySet.add("2026-10");
  monthKeySet.add("2026-09");

  // Extract from content items
  contentItems.forEach((item) => {
    const mk = extractMonthKeyFromDate(item.publishDate);
    if (mk) monthKeySet.add(mk);
  });

  // Extract from design items
  designItems.forEach((item) => {
    const mk = extractMonthKeyFromDate(item.date || item.timestamp);
    if (mk) monthKeySet.add(mk);
  });

  // Sort descending (latest month first)
  const sortedKeys = Array.from(monthKeySet).sort((a, b) => b.localeCompare(a));

  return sortedKeys.map((key) => ({
    monthKey: key,
    label: formatMonthLabel(key),
  }));
}
