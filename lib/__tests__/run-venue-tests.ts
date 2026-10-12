/**
 * Test Suite: Venue & Event Intelligence Domain Logic & Formula Calculations
 * 
 * Verifikasi aturan bisnis:
 * 1. Scoring Engine & Normalisasi Bobot 100%
 * 2. Kalkulasi Anggaran & Varians (actualCost - approvedBudget)
 * 3. Metrik KPI (Response Rate, Survey Conversion, Attendance Rate, Evidence Coverage)
 * 4. Perlindungan Pembagian Nol (Cost per Attendee & Cost per Lead mengembalikan null jika denominator <= 0)
 * 5. Label formatters dalam Bahasa Indonesia
 * 
 * Jalankan: npx tsx lib/__tests__/run-venue-tests.ts
 */

import {
  createEmptyVenue,
  calculateVenueScore,
  calculateBudgetTotals,
  calculateCostPerAttendee,
  calculateCostPerLead,
  calculateResponseRate,
  calculateSurveyConversion,
  calculateAttendanceRate,
  calculateEvidenceCoverage,
  getCategoryLabel,
  getOutreachStatusLabel,
  DEFAULT_SCORE_WEIGHTS,
  Venue,
  BudgetItem,
  OutreachActivity,
  AttendanceRecord,
} from '../venue-types';

function assert(condition: boolean, testName: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${testName}`);
  }
}

function assertEqual(actual: unknown, expected: unknown, testName: string) {
  if (actual !== expected) {
    console.error(`❌ FAILED: ${testName}. Expected [${expected}] but got [${actual}]`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${testName}`);
  }
}

console.log('🧪 Memulai Pengujian Unit Modul Venue & Event Intelligence...\n');

// ============================================================================
// TEST 1: BOBOT SKOR HARUS 100% (1.0)
// ============================================================================
const totalWeight =
  DEFAULT_SCORE_WEIGHTS.costFit +
  DEFAULT_SCORE_WEIGHTS.capacityFit +
  DEFAULT_SCORE_WEIGHTS.audienceRelevance +
  DEFAULT_SCORE_WEIGHTS.facilityQuality +
  DEFAULT_SCORE_WEIGHTS.accessibilityLocation +
  DEFAULT_SCORE_WEIGHTS.collaborationPotential;

assert(Math.abs(totalWeight - 1.0) < 0.001, 'Bobot awal penilaian venue totalnya tepat 100% (1.0)');

// ============================================================================
// TEST 2: PERHITUNGAN SKOR VENUE & NORMALISASI (0-100)
// ============================================================================
const sampleVenue = createEmptyVenue();
sampleVenue.name = 'Hetero Space Banyumas';
sampleVenue.category = 'coworking';
sampleVenue.capacityTotal = 100;
sampleVenue.rentalOptions = [
  {
    type: 'sehari',
    duration: '8 jam',
    price: 1500000,
    currency: 'IDR',
    unit: 'hari',
    notes: 'Paket sewa Gatra Event Space',
    validUntil: null,
    sourceUrl: 'https://hetero.space',
  },
];
sampleVenue.brandingPermissions = {
  backdrop: true,
  banner: true,
  booth: true,
  productDisplay: true,
  logoSponsor: true,
  qrCode: true,
  promoMaterial: true,
  notes: 'Semua media branding diizinkan',
};
sampleVenue.googleMapsUrl = 'https://maps.google.com/?q=Hetero+Space';
sampleVenue.coordinates = { lat: -7.4243, lng: 109.2432 };

const scoreResult = calculateVenueScore(sampleVenue, DEFAULT_SCORE_WEIGHTS);
assert(scoreResult.normalizedScore >= 0 && scoreResult.normalizedScore <= 100, 'Skor ternormalisasi berada dalam rentang valid 0–100');
assert(scoreResult.costFit > 4.0, 'Kesesuaian biaya tinggi untuk harga terjangkau (<= 1.5jt)');
assert(scoreResult.collaborationPotential > 4.5, 'Potensi kolaborasi tinggi ketika seluruh perizinan branding aktif');

// ============================================================================
// TEST 3: KALKULASI BUDGET & VARIANCE
// Variance = actualCost - approvedBudget
// ============================================================================
const budgetItems: BudgetItem[] = [
  {
    id: 'b-1',
    category: 'sewa_venue',
    description: 'Sewa ruang workshop',
    estimatedCost: 2000000,
    quotedCost: 1800000,
    approvedBudget: 1800000,
    actualCost: 1750000,
    paidAmount: 1750000,
    outstandingAmount: 0,
    currency: 'IDR',
    notes: null,
    sourceUrl: null,
  },
  {
    id: 'b-2',
    category: 'konsumsi',
    description: 'Snack & kopi 30 peserta',
    estimatedCost: 750000,
    quotedCost: 750000,
    approvedBudget: 750000,
    actualCost: 800000, // over budget by 50.000
    paidAmount: 800000,
    outstandingAmount: 0,
    currency: 'IDR',
    notes: null,
    sourceUrl: null,
  },
];

const budgetTotals = calculateBudgetTotals(budgetItems);
assertEqual(budgetTotals.totalApproved, 2550000, 'Total approved budget dihitung dengan benar');
assertEqual(budgetTotals.totalActual, 2550000, 'Total actual cost dihitung dengan benar');
assertEqual(budgetTotals.variance, 0, 'Variance = totalActual - totalApproved (2.550.000 - 2.550.000 = 0)');

// Test over budget variance
budgetItems[1].actualCost = 900000;
const overBudgetTotals = calculateBudgetTotals(budgetItems);
assertEqual(overBudgetTotals.variance, 100000, 'Variance bernilai positif (+100.000) saat biaya riil melebihi anggaran disetujui');

// ============================================================================
// TEST 4: PERLINDUNGAN PEMBAGIAN NOL (COST PER ATTENDEE & COST PER LEAD)
// Aturan: Harus mengembalikan null jika peserta / lead = 0 atau belum ada biaya riil
// ============================================================================
assertEqual(calculateCostPerAttendee(2500000, 0), null, 'Cost per attendee mengembalikan null saat peserta = 0 (tanpa NaN/Infinity)');
assertEqual(calculateCostPerAttendee(0, 50), null, 'Cost per attendee mengembalikan null saat actual cost = 0');
assertEqual(calculateCostPerAttendee(2500000, 50), 50000, 'Cost per attendee benar dihitung saat input valid (2.500.000 / 50 = 50.000)');

assertEqual(calculateCostPerLead(2500000, 0), null, 'Cost per lead mengembalikan null saat leads = 0 (tanpa NaN/Infinity)');
assertEqual(calculateCostPerLead(2500000, 25), 100000, 'Cost per lead benar dihitung saat input valid (2.500.000 / 25 = 100.000)');

// ============================================================================
// TEST 5: KALKULASI KPI OUTREACH & KEHADIRAN
// ============================================================================
const sampleActivities: OutreachActivity[] = [
  {
    id: 'act-1',
    venueId: 'v-1',
    contactTarget: '08123456789',
    channel: 'whatsapp',
    sentAt: '2026-10-01T10:00:00Z',
    messagePreview: 'Permintaan proposal kerja sama',
    responsePreview: 'Tentu, silakan kirim jadwal survei',
    requirementsSent: [],
    quotedPrice: 1500000,
    quotedAt: '2026-10-02T10:00:00Z',
    nextFollowUp: null,
    internalOwner: 'Tim Marketing',
    lostReason: null,
    attachments: [],
    statusHistory: [{ status: 'replied', timestamp: '2026-10-02T10:00:00Z' }],
  },
  {
    id: 'act-2',
    venueId: 'v-2',
    contactTarget: 'email@hotel.com',
    channel: 'email',
    sentAt: '2026-10-01T10:00:00Z',
    messagePreview: 'Pricelist request',
    responsePreview: null,
    requirementsSent: [],
    quotedPrice: null,
    quotedAt: null,
    nextFollowUp: '2026-10-05T10:00:00Z',
    internalOwner: 'Tim Marketing',
    lostReason: null,
    attachments: [],
    statusHistory: [{ status: 'contacted', timestamp: '2026-10-01T10:00:00Z' }],
  },
];

const responseRate = calculateResponseRate(sampleActivities);
assertEqual(responseRate, 50.0, 'Response rate tepat 50% (1 respons dari 2 aktivitas kontak)');

const attendanceRecord: AttendanceRecord = {
  eventId: 'ev-1',
  targetRegistrants: 50,
  actualRegistrants: 40,
  attendees: 36,
  completedClass: 35,
  consentedLeads: 28,
  relevantLeads: 24,
  storeVisitsFromEvent: 12,
  attributedSales: 4500000,
  contentProduced: 18,
  impressions: 45000,
  interactions: 3200,
  saves: 420,
  shares: 180,
  clicks: 650,
  qrCodeUsage: 45,
  campaignLinkUsage: 88,
  participantFeedback: { score: 4.8, notes: 'Sangat bermanfaat' },
  partnerFeedback: { score: 4.9, notes: 'Kolaborasi sukses' },
  attributionSource: 'Event Content Creation Class PWT',
  measurementPeriod: 'Oktober 2026',
};

const attendanceRate = calculateAttendanceRate(attendanceRecord);
assertEqual(attendanceRate, 90.0, 'Attendance rate tepat 90% (36 hadir dari 40 pendaftar aktual)');

// ============================================================================
// TEST 6: EVIDENCE COVERAGE
// ============================================================================
sampleVenue.evidences = [
  {
    evidenceId: 'ev-1',
    venueId: sampleVenue.id,
    claimField: 'Kapasitas',
    claimValue: '100 pax',
    sourceUrl: 'https://hetero.space',
    sourceTitle: 'Website Hetero Space',
    sourceType: 'official_website',
    publisher: 'Pemprov Jateng',
    retrievedAt: '2026-10-11T12:00:00Z',
    publishedAt: null,
    validUntil: null,
    verificationMethod: 'Pemeriksaan publik',
    verificationStatus: 'verified',
    confidenceLevel: 95,
    evidenceNotes: null,
    screenshotAssetId: null,
    reviewerId: 'Tim Marketing',
    reviewedAt: null,
  },
  {
    evidenceId: 'ev-2',
    venueId: sampleVenue.id,
    claimField: 'Harga',
    claimValue: 'Rp1.500.000',
    sourceUrl: 'https://hetero.space',
    sourceTitle: 'Pricelist',
    sourceType: 'official_brochure',
    publisher: null,
    retrievedAt: '2026-10-11T12:00:00Z',
    publishedAt: null,
    validUntil: null,
    verificationMethod: 'Pemeriksaan brosur',
    verificationStatus: 'unverified',
    confidenceLevel: 60,
    evidenceNotes: null,
    screenshotAssetId: null,
    reviewerId: 'Tim Marketing',
    reviewedAt: null,
  },
];

const evidenceCoverage = calculateEvidenceCoverage(sampleVenue);
assertEqual(evidenceCoverage, 50.0, 'Evidence coverage tepat 50% (1 dari 2 bukti berstatus verified)');

// ============================================================================
// TEST 7: LABEL FORMATTERS
// ============================================================================
assertEqual(getCategoryLabel('coworking'), 'Coworking Space', 'Label kategori coworking terformat');
assertEqual(getCategoryLabel('hotel'), 'Hotel & Ballroom', 'Label kategori hotel terformat');
assertEqual(getOutreachStatusLabel('new_lead'), 'Lead Baru', 'Label status new_lead terformat');
assertEqual(getOutreachStatusLabel('booked_confirmed'), 'Terkonfirmasi & Dipesan', 'Label status booked_confirmed terformat');

console.log('\n🎉 SELURUH PENGUJIAN LOGIKA & FORMULA BISNIS BERHASIL 100%!');
