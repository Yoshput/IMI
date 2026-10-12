import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  Venue,
  Event,
  OutreachActivity,
  OutreachTemplate,
  SurveyForm,
  Evidence,
  VenueIntelligenceState,
  VenueCategory,
  OutreachStatus,
  createEmptyVenue,
  createEmptyEvent,
  createEmptySurvey,
  generateId,
  calculateVenueScore,
  calculateResponseRate,
  calculateSurveyConversion,
  getCategoryLabel,
  getOutreachStatusLabel,
  DEFAULT_SCORE_WEIGHTS,
  DEFAULT_KPI_TARGETS,
} from './venue-types';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'venue-intelligence.json');
const TMP_DATA_FILE_PATH = path.join(os.tmpdir(), 'venue-intelligence.json');

// In-memory cache for serverless environments (e.g. Vercel)
let inMemoryVenueState: VenueIntelligenceState | null = null;

/**
 * Membaca data keseluruhan intelijen venue dari venue-intelligence.json
 * Mendukung read-only serverless di Vercel dengan fallback /tmp dan in-memory cache
 */
export function getVenueData(): VenueIntelligenceState {
  if (inMemoryVenueState) {
    return inMemoryVenueState;
  }

  const defaultState: VenueIntelligenceState = {
    venues: [],
    events: [],
    outreachActivities: [],
    templates: [],
    surveyForms: [],
    budgets: [],
    attendanceRecords: [],
    kpiTargets: DEFAULT_KPI_TARGETS,
    scoreWeights: DEFAULT_SCORE_WEIGHTS,
  };

  try {
    // 1. Cek apakah ada data di /tmp yang pernah disimpan di sesi serverless ini
    let targetPath: string | null = null;
    if (fs.existsSync(TMP_DATA_FILE_PATH)) {
      targetPath = TMP_DATA_FILE_PATH;
    } else if (fs.existsSync(DATA_FILE_PATH)) {
      targetPath = DATA_FILE_PATH;
    }

    if (!targetPath) {
      inMemoryVenueState = defaultState;
      saveVenueData(defaultState);
      return defaultState;
    }

    const raw = fs.readFileSync(targetPath, 'utf-8');
    const parsed = JSON.parse(raw);

    inMemoryVenueState = {
      venues: Array.isArray(parsed.venues) ? parsed.venues : [],
      events: Array.isArray(parsed.events) ? parsed.events : [],
      outreachActivities: Array.isArray(parsed.outreachActivities) ? parsed.outreachActivities : [],
      templates: Array.isArray(parsed.templates) ? parsed.templates : [],
      surveyForms: Array.isArray(parsed.surveyForms) ? parsed.surveyForms : [],
      budgets: Array.isArray(parsed.budgets) ? parsed.budgets : [],
      attendanceRecords: Array.isArray(parsed.attendanceRecords) ? parsed.attendanceRecords : [],
      kpiTargets: parsed.kpiTargets || DEFAULT_KPI_TARGETS,
      scoreWeights: parsed.scoreWeights || DEFAULT_SCORE_WEIGHTS,
    };

    return inMemoryVenueState;
  } catch (error) {
    console.warn('Warning reading venue-intelligence.json:', error);
    inMemoryVenueState = defaultState;
    return inMemoryVenueState;
  }
}

/**
 * Menyimpan data keseluruhan ke venue-intelligence.json
 * Mendukung graceful write fallback pada read-only serverless (Vercel)
 */
export function saveVenueData(state: VenueIntelligenceState): void {
  // Selalu perbarui state in-memory
  inMemoryVenueState = state;

  // 1. Coba simpan ke folder data utama (berhasil di local dev / VPS persistent)
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(state, null, 2), 'utf-8');
    return;
  } catch (primaryErr) {
    console.warn('Primary file write skipped (read-only filesystem on serverless):', primaryErr);
  }

  // 2. Fallback: simpan ke /tmp (direktori yang selalu writable di Vercel / AWS Lambda)
  try {
    fs.writeFileSync(TMP_DATA_FILE_PATH, JSON.stringify(state, null, 2), 'utf-8');
  } catch (tmpErr) {
    console.warn('Could not write to /tmp storage:', tmpErr);
  }
}

// ============================================================================
// VENUE OPERATIONS
// ============================================================================

export interface VenueFilterParams {
  q?: string;
  category?: VenueCategory | string;
  outreachStatus?: OutreachStatus | string;
  minCapacity?: number;
  maxCapacity?: number;
}

/**
 * Mendapatkan daftar venue dengan filter opsional
 */
export function getVenues(filters?: VenueFilterParams): Venue[] {
  const data = getVenueData();
  let venues = [...data.venues];

  if (!filters) return venues;

  const { q, category, outreachStatus, minCapacity, maxCapacity } = filters;

  if (q && q.trim()) {
    const query = q.toLowerCase().trim();
    venues = venues.filter((v) => {
      const matchName = v.name?.toLowerCase().includes(query);
      const matchCity = v.city?.toLowerCase().includes(query);
      const matchDistrict = v.district?.toLowerCase().includes(query);
      const matchAddress = v.address?.toLowerCase().includes(query);
      const matchAlt = v.nameAlternatives?.some((alt) => alt.toLowerCase().includes(query));
      return matchName || matchCity || matchDistrict || matchAddress || matchAlt;
    });
  }

  if (category && category !== 'all') {
    venues = venues.filter((v) => v.category === category);
  }

  if (outreachStatus && outreachStatus !== 'all') {
    venues = venues.filter((v) => v.outreachStatus === outreachStatus);
  }

  if (minCapacity !== undefined && !isNaN(minCapacity)) {
    venues = venues.filter((v) => (v.capacityTotal ?? 0) >= minCapacity);
  }

  if (maxCapacity !== undefined && !isNaN(maxCapacity)) {
    venues = venues.filter((v) => v.capacityTotal !== null && v.capacityTotal <= maxCapacity);
  }

  return venues;
}

/**
 * Mendapatkan satu venue berdasarkan ID
 */
export function getVenueById(id: string): Venue | null {
  const data = getVenueData();
  const venue = data.venues.find((v) => v.id === id);
  return venue || null;
}

/**
 * Menambahkan venue baru
 */
export function createVenue(venueInput: Partial<Venue> & { name: string }): Venue {
  if (!venueInput.name || !venueInput.name.trim()) {
    throw new Error('Nama venue wajib diisi');
  }

  const data = getVenueData();
  const empty = createEmptyVenue();
  const now = new Date().toISOString();

  const newVenue: Venue = {
    ...empty,
    ...venueInput,
    id: venueInput.id || generateId(),
    name: venueInput.name.trim(),
    createdAt: now,
    updatedAt: now,
  };

  // Hitung skor otomatis jika belum dihitung
  if (!newVenue.score) {
    newVenue.score = calculateVenueScore(newVenue, data.scoreWeights);
  }

  data.venues.unshift(newVenue);
  saveVenueData(data);
  return newVenue;
}

/**
 * Memperbarui venue (partial update)
 */
export function updateVenue(id: string, updates: Partial<Venue>): Venue | null {
  const data = getVenueData();
  const index = data.venues.findIndex((v) => v.id === id);

  if (index === -1) {
    return null;
  }

  const existing = data.venues[index];
  const updatedVenue: Venue = {
    ...existing,
    ...updates,
    id: existing.id, // ID tidak boleh berubah
    updatedAt: new Date().toISOString(),
  };

  // Re-kalkulasi skor setelah perubahan data
  updatedVenue.score = calculateVenueScore(updatedVenue, data.scoreWeights);

  data.venues[index] = updatedVenue;
  saveVenueData(data);
  return updatedVenue;
}

/**
 * Melakukan soft delete / pengarsipan venue dengan mengubah operationalStatus
 */
export function archiveVenue(id: string, status: 'permanently_closed' | 'temporarily_closed' = 'permanently_closed'): Venue | null {
  return updateVenue(id, {
    operationalStatus: status,
    internalNotes: `Diarsipkan pada ${new Date().toISOString()}`,
  });
}

// ============================================================================
// OUTREACH ACTIVITIES OPERATIONS
// ============================================================================

/**
 * Mendapatkan seluruh aktivitas penjangkauan, opsional filter per venueId
 */
export function getOutreachActivities(venueId?: string): OutreachActivity[] {
  const data = getVenueData();
  if (!venueId) {
    return data.outreachActivities;
  }
  return data.outreachActivities.filter((act) => act.venueId === venueId);
}

/**
 * Menambahkan aktivitas penjangkauan baru
 */
export function createOutreachActivity(
  input: Partial<OutreachActivity> & { venueId: string }
): OutreachActivity {
  if (!input.venueId) {
    throw new Error('venueId wajib diisi');
  }

  const data = getVenueData();
  const now = new Date().toISOString();

  const newActivity: OutreachActivity = {
    id: input.id || generateId(),
    venueId: input.venueId,
    contactTarget: input.contactTarget || '-',
    channel: input.channel || 'whatsapp',
    sentAt: input.sentAt || now,
    messagePreview: input.messagePreview || '',
    responsePreview: input.responsePreview || null,
    requirementsSent: input.requirementsSent || [],
    quotedPrice: input.quotedPrice ?? null,
    quotedAt: input.quotedAt || null,
    nextFollowUp: input.nextFollowUp || null,
    internalOwner: input.internalOwner || 'Tim Marketing',
    lostReason: input.lostReason || null,
    attachments: input.attachments || [],
    statusHistory: input.statusHistory || [
      {
        status: 'contacted',
        timestamp: now,
        note: 'Kontak pertama dikirimkan',
      },
    ],
  };

  data.outreachActivities.unshift(newActivity);

  // Sync status venue jika ada
  const venueIndex = data.venues.findIndex((v) => v.id === input.venueId);
  if (venueIndex !== -1) {
    const latestStatus = newActivity.statusHistory[newActivity.statusHistory.length - 1]?.status;
    if (latestStatus) {
      data.venues[venueIndex].outreachStatus = latestStatus;
      data.venues[venueIndex].updatedAt = now;
    }
  }

  saveVenueData(data);
  return newActivity;
}

/**
 * Memperbarui aktivitas penjangkauan
 */
export function updateOutreachActivity(
  id: string,
  updates: Partial<OutreachActivity>
): OutreachActivity | null {
  const data = getVenueData();
  const index = data.outreachActivities.findIndex((a) => a.id === id);

  if (index === -1) {
    return null;
  }

  const existing = data.outreachActivities[index];
  const updatedActivity: OutreachActivity = {
    ...existing,
    ...updates,
    id: existing.id,
  };

  data.outreachActivities[index] = updatedActivity;

  // Sync status venue jika statusHistory berubah
  if (updates.statusHistory && updates.statusHistory.length > 0) {
    const venueIndex = data.venues.findIndex((v) => v.id === updatedActivity.venueId);
    if (venueIndex !== -1) {
      const latestStatus = updates.statusHistory[updates.statusHistory.length - 1]?.status;
      if (latestStatus) {
        data.venues[venueIndex].outreachStatus = latestStatus;
        data.venues[venueIndex].updatedAt = new Date().toISOString();
      }
    }
  }

  saveVenueData(data);
  return updatedActivity;
}

// ============================================================================
// EVENTS OPERATIONS
// ============================================================================

/**
 * Mendapatkan daftar seluruh event
 */
export function getEvents(): Event[] {
  const data = getVenueData();
  return data.events;
}

/**
 * Menambahkan event baru
 */
export function createEvent(input: Partial<Event> & { name: string }): Event {
  if (!input.name || !input.name.trim()) {
    throw new Error('Nama event wajib diisi');
  }

  const data = getVenueData();
  const empty = createEmptyEvent();

  const newEvent: Event = {
    ...empty,
    ...input,
    id: input.id || generateId(),
    name: input.name.trim(),
  };

  // Kaitkan referensi venue jika venueId tersedia
  if (newEvent.venueId) {
    const venue = data.venues.find((v) => v.id === newEvent.venueId);
    if (venue) {
      newEvent.venue = venue;
      newEvent.location = venue.name;
    }
  }

  data.events.unshift(newEvent);
  saveVenueData(data);
  return newEvent;
}

/**
 * Memperbarui event
 */
export function updateEvent(id: string, updates: Partial<Event>): Event | null {
  const data = getVenueData();
  const index = data.events.findIndex((e) => e.id === id);

  if (index === -1) {
    return null;
  }

  const existing = data.events[index];
  const updatedEvent: Event = {
    ...existing,
    ...updates,
    id: existing.id,
  };

  if (updatedEvent.venueId && (!updatedEvent.venue || updatedEvent.venue.id !== updatedEvent.venueId)) {
    const venue = data.venues.find((v) => v.id === updatedEvent.venueId);
    if (venue) {
      updatedEvent.venue = venue;
      updatedEvent.location = venue.name;
    }
  }

  if (updatedEvent.budget) {
    const bIndex = data.budgets.findIndex((b) => b.eventId === id);
    if (bIndex !== -1) {
      data.budgets[bIndex] = updatedEvent.budget;
    } else {
      data.budgets.push(updatedEvent.budget);
    }
  }

  data.events[index] = updatedEvent;
  saveVenueData(data);
  return updatedEvent;
}

// ============================================================================
// TEMPLATES OPERATIONS
// ============================================================================

/**
 * Mendapatkan daftar template penjangkauan
 */
export function getTemplates(): OutreachTemplate[] {
  const data = getVenueData();
  return data.templates;
}

/**
 * Menambahkan template baru
 */
export function createTemplate(
  input: Partial<OutreachTemplate> & { name: string; body: string }
): OutreachTemplate {
  if (!input.name || !input.name.trim()) {
    throw new Error('Nama template wajib diisi');
  }
  if (!input.body || !input.body.trim()) {
    throw new Error('Konten body template wajib diisi');
  }

  const data = getVenueData();

  // Ekstrak variabel dari format {{nama_variabel}}
  const varMatches = input.body.match(/\{\{([a-zA-Z0-9_-]+)\}\}/g) || [];
  const extractedVars = Array.from(new Set(varMatches));

  const newTemplate: OutreachTemplate = {
    id: input.id || `tpl-${Date.now().toString(36)}`,
    name: input.name.trim(),
    category: input.category || 'Umum',
    channel: input.channel || 'whatsapp',
    subject: input.subject || null,
    body: input.body,
    variables: input.variables && input.variables.length > 0 ? input.variables : extractedVars,
    requiredVariables: input.requiredVariables || [],
    isDefault: input.isDefault ?? false,
  };

  data.templates.push(newTemplate);
  saveVenueData(data);
  return newTemplate;
}

/**
 * Memperbarui template
 */
export function updateTemplate(
  id: string,
  updates: Partial<OutreachTemplate>
): OutreachTemplate | null {
  const data = getVenueData();
  const index = data.templates.findIndex((t) => t.id === id);

  if (index === -1) {
    return null;
  }

  const existing = data.templates[index];
  const updatedTemplate: OutreachTemplate = {
    ...existing,
    ...updates,
    id: existing.id,
  };

  if (updates.body) {
    const varMatches = updates.body.match(/\{\{([a-zA-Z0-9_-]+)\}\}/g) || [];
    updatedTemplate.variables = Array.from(new Set(varMatches));
  }

  data.templates[index] = updatedTemplate;
  saveVenueData(data);
  return updatedTemplate;
}

// ============================================================================
// DASHBOARD STATS
// ============================================================================

export interface DashboardStats {
  totalVenues: number;
  activeVenues: number;
  verifiedVenues: number;
  needsVerification: number;
  followUpsDue: number;
  surveyScheduledOrDone: number;
  bookedConfirmedVenues: number;
  totalEvents: number;
  planningEvents: number;
  completedEvents: number;
  totalOutreach: number;
  averageScore: number;
  responseRate: number;
  surveyConversion: number;
  kpiTargets: VenueIntelligenceState['kpiTargets'];
}

/**
 * Mengambil ringkasan statistik untuk dashboard intelijen venue
 */
export function getDashboardStats(): DashboardStats {
  const data = getVenueData();
  const venues = data.venues;
  const events = data.events;
  const outreach = data.outreachActivities;

  const totalVenues = venues.length;
  const activeVenues = venues.filter((v) => v.operationalStatus === 'active').length;

  const verifiedVenues = venues.filter((v) => {
    return v.evidences.some((e) => e.verificationStatus === 'verified');
  }).length;

  const needsVerification = venues.filter((v) => {
    return (
      v.evidences.length === 0 ||
      v.evidences.some((e) => e.verificationStatus === 'unverified' || e.verificationStatus === 'stale')
    );
  }).length;

  const followUpsDue = venues.filter(
    (v) => v.outreachStatus === 'follow_up_due' || v.outreachStatus === 'awaiting_response'
  ).length;

  const surveyScheduledOrDone = venues.filter(
    (v) => v.outreachStatus === 'survey_scheduled' || v.outreachStatus === 'survey_completed'
  ).length;

  const bookedConfirmedVenues = venues.filter((v) => v.outreachStatus === 'booked_confirmed').length;

  const totalEvents = events.length;
  const planningEvents = events.filter((e) => e.status === 'perencanaan' || e.status === 'persiapan').length;
  const completedEvents = events.filter((e) => e.status === 'selesai').length;

  const totalOutreach = outreach.length;

  // Rata-rata skor venue
  const scoredVenues = venues.filter((v) => v.score !== null);
  const averageScore =
    scoredVenues.length > 0
      ? Math.round(
          scoredVenues.reduce((sum, v) => sum + (v.score?.normalizedScore ?? 0), 0) / scoredVenues.length
        )
      : 0;

  const responseRate = calculateResponseRate(outreach);
  const surveyConversion = calculateSurveyConversion(outreach);

  return {
    totalVenues,
    activeVenues,
    verifiedVenues,
    needsVerification,
    followUpsDue,
    surveyScheduledOrDone,
    bookedConfirmedVenues,
    totalEvents,
    planningEvents,
    completedEvents,
    totalOutreach,
    averageScore,
    responseRate,
    surveyConversion,
    kpiTargets: data.kpiTargets,
  };
}

// ============================================================================
// SURVEY FORMS OPERATIONS (C8)
// ============================================================================

export function getSurveys(venueId?: string): SurveyForm[] {
  const data = getVenueData();
  if (!venueId) return data.surveyForms;
  return data.surveyForms.filter((s) => s.venueId === venueId);
}

export function createSurvey(input: Partial<SurveyForm> & { venueId: string }): SurveyForm {
  const data = getVenueData();
  const empty = createEmptySurvey(input.venueId);
  const newSurvey: SurveyForm = {
    ...empty,
    ...input,
    id: input.id || generateId(),
  };

  data.surveyForms.unshift(newSurvey);

  // Auto-update venue status to survey_completed or survey_scheduled
  const venueIndex = data.venues.findIndex((v) => v.id === input.venueId);
  if (venueIndex !== -1) {
    data.venues[venueIndex].outreachStatus = 'survey_completed';
    data.venues[venueIndex].updatedAt = new Date().toISOString();
  }

  saveVenueData(data);
  return newSurvey;
}

export function updateSurvey(id: string, updates: Partial<SurveyForm>): SurveyForm | null {
  const data = getVenueData();
  const index = data.surveyForms.findIndex((s) => s.id === id);
  if (index === -1) return null;

  const existing = data.surveyForms[index];
  const updatedSurvey: SurveyForm = {
    ...existing,
    ...updates,
    id: existing.id,
  };

  data.surveyForms[index] = updatedSurvey;
  saveVenueData(data);
  return updatedSurvey;
}

export function deleteSurvey(id: string): boolean {
  const data = getVenueData();
  const index = data.surveyForms.findIndex((s) => s.id === id);
  if (index === -1) return false;

  data.surveyForms.splice(index, 1);
  saveVenueData(data);
  return true;
}

// ============================================================================
// EVIDENCE OPERATIONS (C2)
// ============================================================================

export function addEvidence(venueId: string, evidenceInput: Omit<Evidence, 'evidenceId' | 'venueId'> & { evidenceId?: string }): Evidence | null {
  const data = getVenueData();
  const venueIndex = data.venues.findIndex((v) => v.id === venueId);
  if (venueIndex === -1) return null;

  const newEvidence: Evidence = {
    evidenceId: evidenceInput.evidenceId || generateId(),
    venueId,
    claimField: evidenceInput.claimField,
    claimValue: evidenceInput.claimValue,
    sourceUrl: evidenceInput.sourceUrl,
    sourceTitle: evidenceInput.sourceTitle,
    sourceType: evidenceInput.sourceType,
    publisher: evidenceInput.publisher || null,
    retrievedAt: evidenceInput.retrievedAt || new Date().toISOString(),
    publishedAt: evidenceInput.publishedAt || null,
    validUntil: evidenceInput.validUntil || null,
    verificationMethod: evidenceInput.verificationMethod || 'Pemeriksaan URL Publik',
    verificationStatus: evidenceInput.verificationStatus || 'unverified',
    confidenceLevel: evidenceInput.confidenceLevel ?? 70,
    evidenceNotes: evidenceInput.evidenceNotes || null,
    screenshotAssetId: evidenceInput.screenshotAssetId || null,
    reviewerId: evidenceInput.reviewerId || 'Tim Marketing',
    reviewedAt: evidenceInput.reviewedAt || new Date().toISOString(),
  };

  data.venues[venueIndex].evidences.unshift(newEvidence);
  data.venues[venueIndex].lastVerifiedAt = new Date().toISOString();
  data.venues[venueIndex].updatedAt = new Date().toISOString();
  data.venues[venueIndex].score = calculateVenueScore(data.venues[venueIndex], data.scoreWeights);

  saveVenueData(data);
  return newEvidence;
}

export function updateEvidence(venueId: string, evidenceId: string, updates: Partial<Evidence>): Evidence | null {
  const data = getVenueData();
  const venueIndex = data.venues.findIndex((v) => v.id === venueId);
  if (venueIndex === -1) return null;

  const evidenceIndex = data.venues[venueIndex].evidences.findIndex((e) => e.evidenceId === evidenceId);
  if (evidenceIndex === -1) return null;

  const existing = data.venues[venueIndex].evidences[evidenceIndex];
  const updatedEvidence: Evidence = {
    ...existing,
    ...updates,
    evidenceId: existing.evidenceId,
    venueId: existing.venueId,
  };

  data.venues[venueIndex].evidences[evidenceIndex] = updatedEvidence;
  data.venues[venueIndex].lastVerifiedAt = new Date().toISOString();
  data.venues[venueIndex].updatedAt = new Date().toISOString();
  data.venues[venueIndex].score = calculateVenueScore(data.venues[venueIndex], data.scoreWeights);

  saveVenueData(data);
  return updatedEvidence;
}

export function deleteEvidence(venueId: string, evidenceId: string): boolean {
  const data = getVenueData();
  const venueIndex = data.venues.findIndex((v) => v.id === venueId);
  if (venueIndex === -1) return false;

  const evidenceIndex = data.venues[venueIndex].evidences.findIndex((e) => e.evidenceId === evidenceId);
  if (evidenceIndex === -1) return false;

  data.venues[venueIndex].evidences.splice(evidenceIndex, 1);
  data.venues[venueIndex].updatedAt = new Date().toISOString();
  data.venues[venueIndex].score = calculateVenueScore(data.venues[venueIndex], data.scoreWeights);

  saveVenueData(data);
  return true;
}

// ============================================================================
// CSV EXPORT (C3)
// ============================================================================

export function exportVenuesCSV(): string {
  const data = getVenueData();
  const headers = [
    'ID',
    'Nama Resmi',
    'Kategori',
    'Kota',
    'Kecamatan',
    'Alamat',
    'Telepon',
    'WhatsApp Bisnis',
    'Instagram',
    'Website',
    'Kapasitas Total',
    'Status Operasional',
    'Status Penjangkauan',
    'Skor Kelayakan (0-100)',
    'Kelengkapan Data (%)',
    'Jumlah Bukti Terverifikasi',
    'Nama Ambigu?',
  ];

  const escapeCSV = (val: unknown) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = data.venues.map((v) => [
    escapeCSV(v.id),
    escapeCSV(v.name),
    escapeCSV(getCategoryLabel(v.category)),
    escapeCSV(v.city || '-'),
    escapeCSV(v.district || '-'),
    escapeCSV(v.address || '-'),
    escapeCSV(v.phone || '-'),
    escapeCSV(v.whatsappBusiness || '-'),
    escapeCSV(v.instagramHandle || '-'),
    escapeCSV(v.websiteUrl || '-'),
    escapeCSV(v.capacityTotal !== null ? v.capacityTotal : 'Belum diketahui'),
    escapeCSV(v.operationalStatus),
    escapeCSV(getOutreachStatusLabel(v.outreachStatus)),
    escapeCSV(v.score?.normalizedScore ?? 'Belum dinilai'),
    escapeCSV(v.score?.dataCompleteness ?? 0),
    escapeCSV(v.score?.verifiedClaimsCount ?? 0),
    escapeCSV(v.isAmbiguous ? 'Ya' : 'Tidak'),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}
