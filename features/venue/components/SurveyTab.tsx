'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { formatDateIndo } from '@/lib/utils';
import {
  SurveyForm,
  ChecklistItem,
  ChecklistStatus,
  Venue,
  createEmptySurvey,
  generateId,
} from '@/lib/venue-types';
import {
  ClipboardCheck,
  Plus,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  User,
  CheckCircle2,
  XCircle,
  HelpCircle,
  MinusCircle,
  Building,
  AlertTriangle,
  FileText,
  Search,
} from 'lucide-react';

interface SurveyTabProps {
  initialVenues?: Venue[];
  initialSurveys?: SurveyForm[];
  onSurveyCreated?: (survey: SurveyForm) => void;
  onSurveyUpdated?: (survey: SurveyForm) => void;
}

export const SurveyTab: React.FC<SurveyTabProps> = ({
  initialVenues,
  initialSurveys,
  onSurveyCreated,
  onSurveyUpdated,
}) => {
  const [venues, setVenues] = useState<Venue[]>(initialVenues || []);
  const [surveys, setSurveys] = useState<SurveyForm[]>(initialSurveys || []);
  const [isLoading, setIsLoading] = useState(!initialVenues);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterVenue, setSelectedFilterVenue] = useState<string>('all');

  // Expandable survey card states
  const [expandedSurveyIds, setExpandedSurveyIds] = useState<Record<string, boolean>>({});

  // Modal / Form state for creating new survey
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedVenueForNew, setSelectedVenueForNew] = useState<string>('');
  const [newSurveyorName, setNewSurveyorName] = useState('');
  const [newSurveyDate, setNewSurveyDate] = useState(new Date().toISOString().split('T')[0]);

  // Load venues if not provided
  useEffect(() => {
    if (!initialVenues) {
      const fetchVenues = async () => {
        try {
          setIsLoading(true);
          const res = await fetch('/api/venues');
          if (res.ok) {
            const data = await res.json();
            const loadedVenues = Array.isArray(data) ? data : data.venues || [];
            setVenues(loadedVenues);
          }
        } catch (err) {
          setError('Gagal memuat daftar venue untuk survei.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchVenues();
    }
  }, [initialVenues]);

  // Toggle card expansion
  const toggleExpand = (id: string) => {
    setExpandedSurveyIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Helper to get Venue Name
  const getVenueName = (venueId: string): string => {
    const v = venues.find((item) => item.id === venueId);
    return v ? v.name : 'Venue Tidak Diketahui';
  };

  // Helper to calculate survey completion percentage
  const calculateCompletion = (survey: SurveyForm): { percentage: number; passCount: number; failCount: number; total: number } => {
    const allItems: ChecklistItem[] = [
      ...survey.sections.location,
      ...survey.sections.room,
      ...survey.sections.contentProduction,
      ...survey.sections.branding,
      ...survey.sections.commercial,
      ...survey.sections.documentation,
    ];
    if (allItems.length === 0) return { percentage: 0, passCount: 0, failCount: 0, total: 0 };
    const answered = allItems.filter((i) => i.status !== 'unknown').length;
    const passCount = allItems.filter((i) => i.status === 'pass').length;
    const failCount = allItems.filter((i) => i.status === 'fail').length;
    return {
      percentage: Math.round((answered / allItems.length) * 100),
      passCount,
      failCount,
      total: allItems.length,
    };
  };

  // Status badge styling helper
  const renderStatusBadge = (status: ChecklistStatus) => {
    switch (status) {
      case 'pass':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-status-successBg text-status-success border border-status-success/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Lolos (Pass)
          </span>
        );
      case 'fail':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-status-errorBg text-status-error border border-status-error/30">
            <XCircle className="w-3.5 h-3.5" />
            Gagal (Fail)
          </span>
        );
      case 'na':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-subtle text-foreground-muted border border-border">
            <MinusCircle className="w-3.5 h-3.5" />
            N/A
          </span>
        );
      case 'unknown':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-status-warningBg text-status-warning border border-status-warning/30">
            <HelpCircle className="w-3.5 h-3.5" />
            Belum Dicek
          </span>
        );
    }
  };

  // Recommendation Badge
  const renderRecommendationBadge = (rec: SurveyForm['overallRecommendation']) => {
    if (rec === 'direkomendasikan') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-status-successBg text-status-success border border-status-success/40">
          Direkomendasikan
        </span>
      );
    }
    if (rec === 'dipertimbangkan') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-status-warningBg text-status-warning border border-status-warning/40">
          Dipertimbangkan
        </span>
      );
    }
    if (rec === 'tidak_direkomendasikan') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-status-errorBg text-status-error border border-status-error/40">
          Tidak Direkomendasikan
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-surface-secondary text-foreground-muted border border-border">
        Belum Dievaluasi
      </span>
    );
  };

  // Handler: Update checklist item status inline
  const handleUpdateItemStatus = (
    surveyId: string,
    sectionKey: keyof SurveyForm['sections'],
    itemId: string,
    newStatus: ChecklistStatus
  ) => {
    const updatedSurveys = surveys.map((s) => {
      if (s.id !== surveyId) return s;
      const updatedSection = s.sections[sectionKey].map((item) =>
        item.id === itemId ? { ...item, status: newStatus } : item
      );
      return {
        ...s,
        sections: {
          ...s.sections,
          [sectionKey]: updatedSection,
        },
      };
    });
    setSurveys(updatedSurveys);
    const target = updatedSurveys.find((s) => s.id === surveyId);
    if (target && onSurveyUpdated) {
      onSurveyUpdated(target);
    }
  };

  // Handler: Update overall recommendation
  const handleUpdateRecommendation = (
    surveyId: string,
    rec: SurveyForm['overallRecommendation']
  ) => {
    const updatedSurveys = surveys.map((s) => {
      if (s.id !== surveyId) return s;
      return { ...s, overallRecommendation: rec };
    });
    setSurveys(updatedSurveys);
    const target = updatedSurveys.find((s) => s.id === surveyId);
    if (target && onSurveyUpdated) {
      onSurveyUpdated(target);
    }
  };

  // Handler: Create new survey
  const handleCreateSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVenueForNew) return;

    const newSurvey = createEmptySurvey(selectedVenueForNew);
    newSurvey.surveyor = newSurveyorName.trim() || 'Tim Intelijen';
    newSurvey.surveyDate = newSurveyDate;

    const updated = [newSurvey, ...surveys];
    setSurveys(updated);
    setExpandedSurveyIds((prev) => ({ ...prev, [newSurvey.id]: true }));
    setIsCreateModalOpen(false);
    setSelectedVenueForNew('');
    setNewSurveyorName('');

    if (onSurveyCreated) {
      onSurveyCreated(newSurvey);
    }
  };

  // Filtered surveys
  const filteredSurveys = surveys.filter((survey) => {
    const venueName = getVenueName(survey.venueId).toLowerCase();
    const surveyor = survey.surveyor.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = venueName.includes(query) || surveyor.includes(query);
    const matchesVenue = selectedFilterVenue === 'all' || survey.venueId === selectedFilterVenue;
    return matchesSearch && matchesVenue;
  });

  return (
    <div className="space-y-6">
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-5 rounded-container border border-border shadow-subtle">
        <div>
          <h2 className="heading-section text-foreground flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-brand" />
            Survei Lokasi & Verifikasi Lapangan
          </h2>
          <p className="text-secondary-body text-foreground-secondary mt-1">
            Daftar formulir inspeksi fisik, kelayakan teknis, visibilitas branding, dan kepatuhan komersial venue.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-control bg-brand hover:bg-brand-hover text-white text-sm font-medium transition-colors shadow-subtle shrink-0"
        >
          <Plus className="w-4 h-4" />
          Survei Venue Baru
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama venue atau surveyor..."
            className="w-full pl-10 pr-4 py-2 rounded-control bg-surface border border-border text-foreground placeholder:text-foreground-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <select
          value={selectedFilterVenue}
          onChange={(e) => setSelectedFilterVenue(e.target.value)}
          aria-label="Filter berdasarkan venue"
          className="px-3.5 py-2 rounded-control bg-surface border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        >
          <option value="all">Semua Venue ({surveys.length})</option>
          {venues.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="p-12 text-center bg-surface rounded-container border border-border animate-pulse">
          <ClipboardCheck className="w-8 h-8 text-foreground-muted mx-auto mb-2 animate-bounce" />
          <p className="text-foreground-muted text-sm">Memuat data survei venue...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-status-errorBg text-status-error rounded-container border border-status-error/30 text-sm">
          {error}
        </div>
      ) : filteredSurveys.length === 0 ? (
        <div className="p-12 text-center bg-surface rounded-container border border-border">
          <ClipboardCheck className="w-12 h-12 text-foreground-muted mx-auto mb-3 opacity-60" />
          <h3 className="text-foreground font-semibold text-base">Belum Ada Formulir Survei</h3>
          <p className="text-foreground-secondary text-sm mt-1 max-w-md mx-auto">
            {searchQuery || selectedFilterVenue !== 'all'
              ? 'Tidak ditemukan survei yang sesuai dengan kriteria pencarian.'
              : 'Belum ada catatan survei fisik venue. Pilih venue dan mulai pencatatan hasil inspeksi teknis lapangan.'}
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-control bg-brand hover:bg-brand-hover text-white text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Mulai Survei Baru
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSurveys.map((survey) => {
            const completion = calculateCompletion(survey);
            const isExpanded = expandedSurveyIds[survey.id] ?? false;
            const venueName = getVenueName(survey.venueId);

            return (
              <div
                key={survey.id}
                className="bg-surface rounded-container border border-border shadow-subtle overflow-hidden transition-all duration-200"
              >
                {/* Header Card */}
                <div
                  onClick={() => toggleExpand(survey.id)}
                  className="p-5 cursor-pointer hover:bg-surface-secondary/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-foreground text-base flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-brand" />
                        {venueName}
                      </h3>
                      {renderRecommendationBadge(survey.overallRecommendation)}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-foreground-secondary">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-foreground-muted" />
                        {formatDateIndo(survey.surveyDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-foreground-muted" />
                        Surveyor: <strong className="text-foreground font-medium">{survey.surveyor || 'Tidak dicatat'}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Progress & Quick Stats */}
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end gap-1 min-w-[130px]">
                      <div className="flex items-center justify-between w-full text-xs font-medium">
                        <span className="text-foreground-secondary">Kelengkapan:</span>
                        <span className="text-brand font-semibold">{completion.percentage}%</span>
                      </div>
                      <div className="w-full bg-surface-subtle h-2 rounded-full overflow-hidden border border-border-subtle">
                        <div
                          className="bg-brand h-full transition-all duration-300"
                          style={{ width: `${completion.percentage}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-foreground-muted">
                        {completion.passCount} Lolos • {completion.failCount} Gagal
                      </span>
                    </div>

                    <button
                      type="button"
                      aria-label={isExpanded ? 'Tutup rincian survei' : 'Buka rincian survei'}
                      className="p-2 rounded-control hover:bg-surface-secondary text-foreground-secondary"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Sections Details */}
                {isExpanded && (
                  <div className="border-t border-border p-5 space-y-6 bg-surface-secondary/20">
                    {/* Overall Recommendation Selector */}
                    <div className="p-4 rounded-control bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">Kesimpulan & Rekomendasi Tim</h4>
                        <p className="text-xs text-foreground-muted mt-0.5">
                          Tentukan kelayakan venue untuk penyelenggaraan event ISeeYou.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(['direkomendasikan', 'dipertimbangkan', 'tidak_direkomendasikan'] as const).map(
                          (recOption) => {
                            const isSelected = survey.overallRecommendation === recOption;
                            return (
                              <button
                                key={recOption}
                                type="button"
                                onClick={() => handleUpdateRecommendation(survey.id, recOption)}
                                className={cn(
                                  'px-3 py-1.5 rounded-control text-xs font-medium border transition-colors',
                                  isSelected
                                    ? recOption === 'direkomendasikan'
                                      ? 'bg-status-successBg text-status-success border-status-success/50'
                                      : recOption === 'dipertimbangkan'
                                      ? 'bg-status-warningBg text-status-warning border-status-warning/50'
                                      : 'bg-status-errorBg text-status-error border-status-error/50'
                                    : 'bg-surface hover:bg-surface-secondary text-foreground-secondary border-border'
                                )}
                              >
                                {recOption === 'direkomendasikan'
                                  ? 'Direkomendasikan'
                                  : recOption === 'dipertimbangkan'
                                  ? 'Dipertimbangkan'
                                  : 'Tidak Direkomendasikan'}
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>

                    {/* 6 Inspection Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Section 1: Lokasi & Akses */}
                      <ChecklistSectionCard
                        title="1. Lokasi & Aksesibilitas"
                        items={survey.sections.location}
                        sectionKey="location"
                        surveyId={survey.id}
                        onStatusChange={handleUpdateItemStatus}
                      />

                      {/* Section 2: Fisik Ruangan */}
                      <ChecklistSectionCard
                        title="2. Fisik & Kondisi Ruangan"
                        items={survey.sections.room}
                        sectionKey="room"
                        surveyId={survey.id}
                        onStatusChange={handleUpdateItemStatus}
                      />

                      {/* Section 3: Audio Visual & Listrik */}
                      <ChecklistSectionCard
                        title="3. Audio Visual, Internet & Listrik"
                        items={survey.sections.contentProduction}
                        sectionKey="contentProduction"
                        surveyId={survey.id}
                        onStatusChange={handleUpdateItemStatus}
                      />

                      {/* Section 4: Branding & Display */}
                      <ChecklistSectionCard
                        title="4. Izin Branding & Display Produk"
                        items={survey.sections.branding}
                        sectionKey="branding"
                        surveyId={survey.id}
                        onStatusChange={handleUpdateItemStatus}
                      />

                      {/* Section 5: Komersial & Catering */}
                      <ChecklistSectionCard
                        title="5. Ketentuan Komersial & Operasional"
                        items={survey.sections.commercial}
                        sectionKey="commercial"
                        surveyId={survey.id}
                        onStatusChange={handleUpdateItemStatus}
                      />

                      {/* Section 6: Dokumentasi & Visual */}
                      <ChecklistSectionCard
                        title="6. Dokumentasi & Pencahayaan"
                        items={survey.sections.documentation}
                        sectionKey="documentation"
                        surveyId={survey.id}
                        onStatusChange={handleUpdateItemStatus}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Buat Survei Baru */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-dialog max-w-md w-full p-6 shadow-elevated space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-semibold text-foreground text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-brand" />
                Buat Formulir Survei Venue
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-foreground-muted hover:text-foreground text-lg leading-none p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSurvey} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Pilih Venue Sasaran <span className="text-status-error">*</span>
                </label>
                <select
                  required
                  value={selectedVenueForNew}
                  onChange={(e) => setSelectedVenueForNew(e.target.value)}
                  className="w-full px-3 py-2 rounded-control bg-surface border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  <option value="">-- Pilih salah satu venue --</option>
                  {venues.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.city || 'Kota belum diset'})
                    </option>
                  ))}
                </select>
                {venues.length === 0 && (
                  <p className="text-xs text-status-warning mt-1">
                    Belum ada venue terdaftar. Silakan tambahkan venue terlebih dahulu.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Nama Surveyor / Penilai <span className="text-status-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ahmad - Event Specialist"
                  value={newSurveyorName}
                  onChange={(e) => setNewSurveyorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-control bg-surface border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Tanggal Pelaksanaan Survei
                </label>
                <input
                  type="date"
                  value={newSurveyDate}
                  onChange={(e) => setNewSurveyDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-control bg-surface border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-control border border-border text-foreground-secondary hover:bg-surface-secondary text-sm transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!selectedVenueForNew}
                  className="px-4 py-2 rounded-control bg-brand hover:bg-brand-hover text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Mulai Checklist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for Checklist Section Card
interface ChecklistSectionCardProps {
  title: string;
  items: ChecklistItem[];
  sectionKey: keyof SurveyForm['sections'];
  surveyId: string;
  onStatusChange: (
    surveyId: string,
    sectionKey: keyof SurveyForm['sections'],
    itemId: string,
    newStatus: ChecklistStatus
  ) => void;
}

const ChecklistSectionCard: React.FC<ChecklistSectionCardProps> = ({
  title,
  items,
  sectionKey,
  surveyId,
  onStatusChange,
}) => {
  return (
    <div className="p-4 rounded-control bg-surface border border-border space-y-3">
      <h5 className="font-semibold text-xs uppercase tracking-wider text-foreground-secondary border-b border-border/60 pb-2">
        {title}
      </h5>
      <div className="space-y-2.5">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-2.5 rounded-control bg-surface-secondary/40 border border-border/50 text-xs flex flex-col gap-2"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-medium text-foreground flex-1 leading-snug">
                {item.item}
              </span>
            </div>
            {/* Quick status selector */}
            <div className="flex items-center justify-between gap-1 pt-1 border-t border-border/40">
              <span className="text-[11px] text-foreground-muted">{item.category}</span>
              <div className="flex items-center gap-1">
                {(['pass', 'fail', 'na', 'unknown'] as ChecklistStatus[]).map((status) => {
                  const isActive = item.status === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => onStatusChange(surveyId, sectionKey, item.id, status)}
                      className={cn(
                        'px-2 py-0.5 rounded text-[10px] font-medium transition-colors',
                        isActive
                          ? status === 'pass'
                            ? 'bg-status-success text-white'
                            : status === 'fail'
                            ? 'bg-status-error text-white'
                            : status === 'na'
                            ? 'bg-foreground-muted text-white'
                            : 'bg-status-warning text-black'
                          : 'bg-surface hover:bg-surface-secondary text-foreground-muted border border-border/60'
                      )}
                    >
                      {status === 'pass' ? 'Pass' : status === 'fail' ? 'Fail' : status === 'na' ? 'N/A' : '?'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
