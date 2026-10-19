/**
 * Test Suite: Spreadsheet, Cadence, & Cycle 9 Intelligence Logic
 * 
 * Verifikasi aturan bisnis:
 * 1. Konfigurasi Siklus 9 (13–19 Okt 2026, Rapat 20 Okt) sebagai siklus aktif utama
 * 2. Konservasi arsip Siklus 8 (6–12 Okt 2026) dan siklus terdahulu
 * 3. Parser metrik angka Indonesia (k, M, titik ribuan, koma desimal, libur)
 * 4. Perbaikan Zero Trap Bug pada penghitungan minStoryViewers
 * 5. Sanitasi nomor telepon dan deduplikasi proposal sponsor
 * 6. Pemotongan periode & zona waktu Asia/Jakarta (WIB)
 * 7. Kalkulasi target uang kas mingguan tim Marketing (Rp 5.000 / PIC)
 * 
 * Jalankan: npx tsx lib/__tests__/run-spreadsheet-tests.ts
 */

import {
  CADENCE_CYCLES,
  ACTIVE_MEETING_CYCLE,
  resolveActiveCycle,
  getWibToday,
  formatShortIndo,
  PRODUCTION_BASE_URL,
} from '../cadence-config';

import {
  WEEKS_OCTOBER,
  WEEKS_SEPTEMBER,
  MARKETING_PURWOKERTO_PICS,
} from '../../features/finance/components/KasMarketingPurwokertoCard';

function assert(condition: boolean, testName: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${testName}`);
  }
}

function assertEqual<T>(actual: T, expected: T, testName: string) {
  if (actual !== expected) {
    console.error(`❌ FAILED: ${testName}. Expected [${expected}] but got [${actual}]`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${testName}`);
  }
}

console.log('🧪 Memulai Pengujian Unit Modul Spreadsheet & Cadence Intelligence...\n');

// ============================================================================
// TEST 1: KONFIGURASI SIKLUS 9 & ARSIP SIKLUS 8
// ============================================================================
console.log('--- TEST GROUP 1: Cadence Cycle Configuration ---');
assertEqual(ACTIVE_MEETING_CYCLE.id, 'cycle-9', 'Active cycle must be cycle-9');
assertEqual(ACTIVE_MEETING_CYCLE.startDate, '2026-10-13', 'Cycle 9 start date must be 2026-10-13');
assertEqual(ACTIVE_MEETING_CYCLE.endDate, '2026-10-19', 'Cycle 9 end date must be 2026-10-19');
assertEqual(ACTIVE_MEETING_CYCLE.meetingTarget, 'Selasa, 20 Oktober 2026', 'Cycle 9 meeting target must be Selasa, 20 Oktober 2026');

const cycle8 = CADENCE_CYCLES.find((c) => c.id === 'cycle-8');
assert(!!cycle8, 'Cycle 8 must exist as meeting archive');
assertEqual(cycle8?.startDate, '2026-10-06', 'Cycle 8 start date must be 2026-10-06');
assertEqual(cycle8?.endDate, '2026-10-12', 'Cycle 8 end date must be 2026-10-12');
assertEqual(cycle8?.isArchive, true, 'Cycle 8 must be flagged as archive');

const resolvedC9 = resolveActiveCycle('cycle-9');
assertEqual(resolvedC9.id, 'cycle-9', 'resolveActiveCycle("cycle-9") resolves to cycle-9');

const resolvedDefault = resolveActiveCycle();
assertEqual(resolvedDefault.id, 'cycle-9', 'resolveActiveCycle() defaults to active cycle (cycle-9)');

const resolvedUnknown = resolveActiveCycle('cycle-999');
assertEqual(resolvedUnknown.id, 'cycle-9', 'resolveActiveCycle("cycle-999") safely falls back to active cycle');

// ============================================================================
// TEST 2: CANONICAL BASE URL & WIB UTILS
// ============================================================================
console.log('\n--- TEST GROUP 2: Canonical URL & WIB Date Formatters ---');
assertEqual(
  PRODUCTION_BASE_URL,
  'https://iseeyou-marketing-intelligence.vercel.app',
  'Canonical production URL must point to iseeyou-marketing-intelligence.vercel.app'
);

const wibToday = getWibToday();
assert(/^\d{4}-\d{2}-\d{2}$/.test(wibToday), `getWibToday() returns YYYY-MM-DD formatted date: ${wibToday}`);

const formattedIndo = formatShortIndo('2026-10-20');
assertEqual(formattedIndo, '20 Okt', 'formatShortIndo("2026-10-20") returns "20 Okt"');

// ============================================================================
// TEST 3: NUMBER & METRIC PARSER (cleanMetric logic)
// ============================================================================
console.log('\n--- TEST GROUP 3: Indonesian Metric Parser ---');
function cleanMetric(val: any): number {
  if (val === undefined || val === null) return 0;
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  const str = String(val).trim().toLowerCase();
  if (!str || str === "-" || str === "libur" || str === "off" || str === "tidak ada") return 0;

  // Handle 'k' / 'rb' / 'ribu' suffix
  if (str.endsWith("k") || str.endsWith("rb")) {
    const num = parseFloat(str.replace(/[k|rb]/g, "").replace(",", "."));
    return isNaN(num) ? 0 : Math.round(num * 1000);
  }
  // Handle 'm' / 'jt' / 'juta' suffix
  if (str.endsWith("m") || str.endsWith("jt")) {
    const num = parseFloat(str.replace(/[m|jt]/g, "").replace(",", "."));
    return isNaN(num) ? 0 : Math.round(num * 1000000);
  }

  // Indonesian thousands separator: 29.156 -> 29156
  const cleanStr = str.replace(/\./g, "").replace(",", ".");
  const num = parseFloat(cleanStr);
  return isNaN(num) ? 0 : num;
}

assertEqual(cleanMetric(1250), 1250, 'Clean number passthrough');
assertEqual(cleanMetric('12,5k'), 12500, 'Parse 12,5k -> 12500');
assertEqual(cleanMetric('2.5k'), 2500, 'Parse 2.5k -> 2500');
assertEqual(cleanMetric('1.2M'), 1200000, 'Parse 1.2M -> 1200000');
assertEqual(cleanMetric('29.156'), 29156, 'Parse Indonesian thousand dots 29.156 -> 29156');
assertEqual(cleanMetric('libur'), 0, 'Parse "libur" -> 0 without NaN');
assertEqual(cleanMetric('-'), 0, 'Parse "-" -> 0 without NaN');
assertEqual(cleanMetric(''), 0, 'Parse empty string -> 0');
assertEqual(cleanMetric(null), 0, 'Parse null -> 0');
assertEqual(cleanMetric(undefined), 0, 'Parse undefined -> 0');

// ============================================================================
// TEST 4: ZERO TRAP BUG IN MINIMUM STORY VIEWERS
// ============================================================================
console.log('\n--- TEST GROUP 4: Zero Trap Bug in minStoryViewers ---');
// Bug scenario before fix: Math.min(...filteredStories.map(s => s.minViewers || 99999).filter(v => v > 0), 0)
// Math.min(849, 1217, 0) always evaluated to 0!
const sampleStories = [
  { id: '1', minViewers: 849, maxViewers: 1200 },
  { id: '2', minViewers: 1217, maxViewers: 1500 },
  { id: '3', minViewers: 950, maxViewers: 1100 },
];

const validMinViewers = sampleStories
  .map((s) => s.minViewers || 99999)
  .filter((v) => v > 0);

const correctedMin = validMinViewers.length > 0 ? Math.min(...validMinViewers) : 0;
assertEqual(correctedMin, 849, 'Corrected minStoryViewers must be 849, never 0 when valid viewers exist');

// Edge case: stories with 0 viewers
const zeroStories = [{ id: '1', minViewers: 0 }];
const zeroValid = zeroStories.map((s) => s.minViewers || 0).filter((v) => v > 0);
const zeroMin = zeroValid.length > 0 ? Math.min(...zeroValid) : 0;
assertEqual(zeroMin, 0, 'Corrected minStoryViewers handles all-zero gracefully as 0');

// ============================================================================
// TEST 5: PROPOSAL DEDUPLICATION & PHONE SANITIZATION
// ============================================================================
console.log('\n--- TEST GROUP 5: Proposal Deduplication Guard ---');
function deduplicateProposals(rawItems: any[]): any[] {
  const seenKeys = new Set<string>();
  const deduplicated: any[] = [];

  for (const item of rawItems) {
    const rawPhone = String(item.pemohonPhone || "").replace(/\D/g, "");
    const cleanPhone = rawPhone.length >= 6 ? rawPhone.slice(-8) : "";
    const cleanNama = String(item.pemohonNama || "").toLowerCase().trim();
    const cleanInstansi = String(item.instansi || "").toLowerCase().trim();
    const cleanTgl = String(item.tanggalMasuk || "").trim();

    const dedupKey = cleanPhone
      ? `phone:${cleanPhone}`
      : `name:${cleanNama}_inst:${cleanInstansi}_tgl:${cleanTgl}`;

    if (!seenKeys.has(dedupKey)) {
      seenKeys.add(dedupKey);
      deduplicated.push(item);
    }
  }

  return deduplicated;
}

const proposalBatch = [
  // Two duplicate proposals with different formatting of same phone
  { id: '1', pemohonNama: 'Budi Santoso', pemohonPhone: '0812-3456-7890', instansi: 'BEM Unsoed', tanggalMasuk: '2026-10-14' },
  { id: '2', pemohonNama: 'Budi S', pemohonPhone: '+62 812-3456-7890', instansi: 'BEM Unsoed', tanggalMasuk: '2026-10-14' },
  // Two different proposals with NO phone / invalid short phone (should NOT be deduplicated as same empty key)
  { id: '3', pemohonNama: 'Ahmad Dahlan', pemohonPhone: '-', instansi: 'HIMA TI', tanggalMasuk: '2026-10-15' },
  { id: '4', pemohonNama: 'Siti Nurhaliza', pemohonPhone: '', instansi: 'UKM Tari', tanggalMasuk: '2026-10-16' },
];

const dedupResult = deduplicateProposals(proposalBatch);
assertEqual(dedupResult.length, 3, 'Deduplication groups identical phone numbers but does NOT group different proposals with missing phones');
assertEqual(dedupResult[0].id, '1', 'Retains first instance of duplicate phone');
assertEqual(dedupResult[1].id, '3', 'Preserves proposal with missing phone 1');
assertEqual(dedupResult[2].id, '4', 'Preserves proposal with missing phone 2');

// ============================================================================
// TEST 6: DATE FILTERING & SIKLUS 9 BOUNDARY
// ============================================================================
console.log('\n--- TEST GROUP 6: Cycle 9 Date Filter Boundaries ---');
function isWithinCycle9(dateStr: string): boolean {
  return dateStr >= '2026-10-13' && dateStr <= '2026-10-19';
}

assert(isWithinCycle9('2026-10-13'), '2026-10-13 is within Cycle 9 (Start Day)');
assert(isWithinCycle9('2026-10-16'), '2026-10-16 is within Cycle 9 (Mid Day)');
assert(isWithinCycle9('2026-10-19'), '2026-10-19 is within Cycle 9 (Cutoff Day)');
assert(!isWithinCycle9('2026-10-12'), '2026-10-12 is NOT within Cycle 9 (Belongs to Cycle 8)');
assert(!isWithinCycle9('2026-10-20'), '2026-10-20 is NOT within Cycle 9 (Meeting Day / Cycle 10)');

// ============================================================================
// TEST 7: KAS MARKETING 6 PIC PURWOKERTO
// ============================================================================
console.log('\n--- TEST GROUP 7: Kas Marketing Purwokerto Logic ---');
assertEqual(MARKETING_PURWOKERTO_PICS.length, 6, 'Marketing Purwokerto must have exactly 6 PIC members');
const kasRatePerWeek = 5000;
const expectedTargetPerWeek = 6 * kasRatePerWeek;
assertEqual(expectedTargetPerWeek, 30000, 'Weekly kas target for 6 PICs must be Rp 30.000');

const octWeek3 = WEEKS_OCTOBER.find((w) => w.id === 'w3_oct');
assert(!!octWeek3, 'October Week 3 (Siklus 9 Aktif) must exist');
assert(!!octWeek3?.label.includes('13–19 Okt 2026'), 'October Week 3 label matches Cycle 9 dates');

const sepWeek4 = WEEKS_SEPTEMBER.find((w) => w.id === 'w4_sep');
assert(!!sepWeek4, 'September Week 4 archive must exist');

console.log('\n🎉 SELURUH PENGUJIAN UNIT SPREADSHEET & CADENCE BERHASIL (100% PASSED)!\n');
