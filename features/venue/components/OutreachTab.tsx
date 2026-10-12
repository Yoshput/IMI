'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { cn, formatDateIndo } from '@/lib/utils';
import {
  Venue,
  OutreachStatus,
  OutreachTemplate,
  getOutreachStatusLabel,
} from '@/lib/venue-types';
import {
  Copy,
  Check,
  Search,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Clock,
  Calendar,
  Building2,
  Mail,
  Phone,
  MessageSquare,
  Sparkles,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

const PIPELINE_STAGES: OutreachStatus[] = [
  'new_lead',
  'researching',
  'ready_to_contact',
  'contacted',
  'awaiting_response',
  'follow_up_due',
  'replied',
  'survey_scheduled',
  'survey_completed',
  'proposal_requested',
  'negotiation',
  'awaiting_approval',
  'approved',
  'booked_confirmed',
];

interface OutreachTabProps {
  initialVenues?: Venue[];
  initialTemplates?: OutreachTemplate[];
}

export const OutreachTab: React.FC<OutreachTabProps> = ({
  initialVenues,
  initialTemplates,
}) => {
  const [venues, setVenues] = useState<Venue[]>(initialVenues || []);
  const [templates, setTemplates] = useState<OutreachTemplate[]>(initialTemplates || []);
  const [isLoadingVenues, setIsLoadingVenues] = useState(!initialVenues);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(!initialTemplates);
  const [venueError, setVenueError] = useState<string | null>(null);
  const [templateError, setTemplateError] = useState<string | null>(null);

  // Search & Filter state
  const [pipelineSearch, setPipelineSearch] = useState('');
  const [hideEmptyStages, setHideEmptyStages] = useState(false);
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState<string>('all');
  const [templateSearch, setTemplateSearch] = useState('');

  // Template expand & copy states
  const [expandedTemplateIds, setExpandedTemplateIds] = useState<Record<string, boolean>>({});
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);

  // Fetch Venues
  const fetchVenues = async () => {
    try {
      setIsLoadingVenues(true);
      setVenueError(null);
      const res = await fetch('/api/venues');
      if (!res.ok) {
        throw new Error('Gagal mengambil data venue dari server');
      }
      const json = await res.json();
      const list = Array.isArray(json) ? json : json.data || [];
      setVenues(list);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data venue';
      setVenueError(msg);
    } finally {
      setIsLoadingVenues(false);
    }
  };

  // Fetch Templates
  const fetchTemplates = async () => {
    try {
      setIsLoadingTemplates(true);
      setTemplateError(null);
      const res = await fetch('/api/venue-templates');
      if (!res.ok) {
        throw new Error('Gagal mengambil data template komunikasi');
      }
      const json = await res.json();
      const list = Array.isArray(json) ? json : json.data || [];
      setTemplates(list);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat template';
      setTemplateError(msg);
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  useEffect(() => {
    if (!initialVenues) {
      fetchVenues();
    }
  }, [initialVenues]);

  useEffect(() => {
    if (!initialTemplates) {
      fetchTemplates();
    }
  }, [initialTemplates]);

  // Group venues by stage
  const venuesByStage = useMemo(() => {
    const map: Record<OutreachStatus, Venue[]> = {
      new_lead: [],
      researching: [],
      ready_to_contact: [],
      contacted: [],
      awaiting_response: [],
      follow_up_due: [],
      replied: [],
      survey_scheduled: [],
      survey_completed: [],
      proposal_requested: [],
      negotiation: [],
      awaiting_approval: [],
      approved: [],
      booked_confirmed: [],
      rejected: [],
      lost: [],
      on_hold: [],
    };

    const query = pipelineSearch.trim().toLowerCase();
    const filtered = venues.filter((v) => {
      if (!query) return true;
      return (
        v.name.toLowerCase().includes(query) ||
        (v.city && v.city.toLowerCase().includes(query)) ||
        (v.district && v.district.toLowerCase().includes(query))
      );
    });

    filtered.forEach((venue) => {
      const status = venue.outreachStatus || 'new_lead';
      if (map[status]) {
        map[status].push(venue);
      } else {
        map['new_lead'].push(venue);
      }
    });

    return map;
  }, [venues, pipelineSearch]);

  // Toggle template expansion
  const toggleTemplateExpand = (id: string) => {
    setExpandedTemplateIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Copy template body to clipboard
  const handleCopyTemplate = async (template: OutreachTemplate) => {
    try {
      await navigator.clipboard.writeText(template.body);
      setCopiedTemplateId(template.id);
      setTimeout(() => {
        setCopiedTemplateId((prev) => (prev === template.id ? null : prev));
      }, 2500);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = template.body;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedTemplateId(template.id);
      setTimeout(() => {
        setCopiedTemplateId((prev) => (prev === template.id ? null : prev));
      }, 2500);
    }
  };

  // Template categories for filter
  const templateCategories = useMemo(() => {
    const cats = new Set<string>();
    templates.forEach((t) => {
      if (t.category) cats.add(t.category);
    });
    return Array.from(cats);
  }, [templates]);

  // Filtered templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      const matchesCat =
        templateCategoryFilter === 'all' || tpl.category === templateCategoryFilter;
      const q = templateSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        tpl.name.toLowerCase().includes(q) ||
        tpl.category.toLowerCase().includes(q) ||
        tpl.body.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [templates, templateCategoryFilter, templateSearch]);

  // Channel badge styling helper
  const getChannelBadge = (channel: string) => {
    const ch = channel.toLowerCase();
    if (ch.includes('wa') || ch === 'whatsapp') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <MessageSquare className="w-3 h-3" />
          WhatsApp
        </span>
      );
    }
    if (ch.includes('email') || ch.includes('surat')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          <Mail className="w-3 h-3" />
          Email
        </span>
      );
    }
    if (ch.includes('telp') || ch.includes('telepon') || ch === 'phone') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <Phone className="w-3 h-3" />
          Telepon
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-subtle text-foreground-secondary border border-border">
        {channel}
      </span>
    );
  };

  // Helper to render template body with highlighted {{variable}}
  const renderTemplateBodyWithVariables = (body: string) => {
    const parts = body.split(/(\{\{[^}]+\}\})/g);
    return (
      <p className="text-body whitespace-pre-wrap text-foreground leading-relaxed select-text">
        {parts.map((part, index) => {
          if (part.startsWith('{{') && part.endsWith('}}')) {
            return (
              <span
                key={index}
                className="inline-block text-brand font-semibold bg-brand/10 dark:bg-brand/20 px-1 py-0.5 rounded text-xs border border-brand/20 mx-0.5"
              >
                {part}
              </span>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </p>
    );
  };

  return (
    <div className="w-full space-y-10">
      {/* ==================================================================== */}
      {/* SECTION A: PIPELINE VIEW                                             */}
      {/* ==================================================================== */}
      <section className="space-y-4">
        {/* Pipeline Controls & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="heading-section text-foreground flex items-center gap-2">
              Pipeline Penjangkauan (CRM)
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-brand/10 text-brand border border-brand/20">
                {venues.length} Venue
              </span>
            </h2>
            <p className="text-secondary-body text-sm text-foreground-secondary">
              Pemantauan tahapan komunikasi dan negosiasi sewa tempat secara terstruktur.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 text-foreground-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={pipelineSearch}
                onChange={(e) => setPipelineSearch(e.target.value)}
                placeholder="Cari nama venue..."
                className="pl-9 pr-3 py-1.5 text-xs rounded-control bg-surface border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <button
              onClick={() => setHideEmptyStages(!hideEmptyStages)}
              className={cn(
                'text-xs px-3 py-1.5 rounded-control border transition-colors flex items-center gap-1.5 font-medium',
                hideEmptyStages
                  ? 'bg-brand text-white border-brand'
                  : 'bg-surface border-border text-foreground hover:bg-surface-subtle'
              )}
            >
              {hideEmptyStages ? 'Tampilkan Semua Tahap' : 'Sembunyikan Tahap Kosong'}
            </button>

            <button
              onClick={fetchVenues}
              disabled={isLoadingVenues}
              title="Segarkan data venue"
              className="p-1.5 rounded-control bg-surface border border-border text-foreground-secondary hover:text-foreground hover:bg-surface-subtle transition-colors"
            >
              <RefreshCw className={cn('w-4 h-4', isLoadingVenues && 'animate-spin')} />
            </button>
          </div>
        </div>

        {/* Pipeline Error State */}
        {venueError && (
          <div className="p-4 rounded-container bg-status-errorBg border border-status-error/30 text-status-error text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{venueError}</span>
            </div>
            <button
              onClick={fetchVenues}
              className="px-2.5 py-1 text-xs font-semibold bg-white text-status-error border border-status-error/40 rounded-control hover:bg-white/80"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Pipeline Loading Skeleton */}
        {isLoadingVenues && (
          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="min-w-[220px] max-w-[240px] flex-shrink-0 bg-surface-secondary/50 rounded-container p-3 border border-border/40 space-y-3"
              >
                <div className="h-4 w-3/4 bg-border/40 rounded" />
                <div className="h-20 bg-surface rounded-control border border-border/40" />
                <div className="h-20 bg-surface rounded-control border border-border/40" />
              </div>
            ))}
          </div>
        )}

        {/* Pipeline Board */}
        {!isLoadingVenues && (
          <div className="flex gap-3 overflow-x-auto pb-4 pt-1 items-start scrollbar-thin">
            {PIPELINE_STAGES.map((stage) => {
              const stageVenues = venuesByStage[stage] || [];
              const isEmpty = stageVenues.length === 0;

              if (hideEmptyStages && isEmpty) {
                return null;
              }

              return (
                <div
                  key={stage}
                  className={cn(
                    'min-w-[220px] max-w-[250px] flex-shrink-0 bg-surface-secondary/50 rounded-container p-3 border border-border/40 flex flex-col gap-2.5 transition-opacity duration-200',
                    isEmpty && 'opacity-60 hover:opacity-100'
                  )}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-1 border-b border-border/40">
                    <span className="text-xs font-bold text-foreground truncate mr-2" title={getOutreachStatusLabel(stage)}>
                      {getOutreachStatusLabel(stage)}
                    </span>
                    <span
                      className={cn(
                        'text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0',
                        stageVenues.length > 0
                          ? 'bg-brand/10 text-brand dark:bg-brand/20 dark:text-brand-light'
                          : 'bg-surface-subtle text-foreground-muted'
                      )}
                    >
                      {stageVenues.length}
                    </span>
                  </div>

                  {/* Stage Venue Cards */}
                  <div className="flex flex-col gap-2 min-h-[100px]">
                    {stageVenues.length === 0 ? (
                      <div className="h-24 flex flex-col items-center justify-center text-center p-2 rounded-control border border-dashed border-border/50 text-[11px] text-foreground-muted">
                        Belum ada venue di tahap ini
                      </div>
                    ) : (
                      stageVenues.map((venue) => {
                        const lastActivityDate = venue.updatedAt || venue.createdAt;
                        return (
                          <div
                            key={venue.id}
                            className="bg-surface rounded-control border border-border p-3 shadow-subtle hover:shadow-elevated transition-shadow flex flex-col gap-2 group"
                          >
                            <div className="flex items-start justify-between gap-1">
                              <h4 className="text-xs font-bold text-foreground leading-snug line-clamp-2">
                                {venue.name}
                              </h4>
                            </div>

                            {/* Location & Details */}
                            {(venue.city || venue.district) && (
                              <p className="text-[11px] text-foreground-secondary flex items-center gap-1 truncate">
                                <Building2 className="w-3 h-3 text-foreground-muted shrink-0" />
                                <span>{[venue.district, venue.city].filter(Boolean).join(', ')}</span>
                              </p>
                            )}

                            {/* Activity Info */}
                            <div className="pt-2 border-t border-border/50 flex flex-col gap-1 text-[11px] text-foreground-muted">
                              <div className="flex items-center justify-between gap-1" title="Aktivitas terakhir">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 shrink-0" />
                                  Aktivitas:
                                </span>
                                <span className="font-medium text-foreground truncate">
                                  {lastActivityDate ? formatDateIndo(lastActivityDate) : 'Belum diketahui'}
                                </span>
                              </div>

                              <div className="flex items-center justify-between gap-1" title="Tindak lanjut berikutnya">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 shrink-0" />
                                  Follow-up:
                                </span>
                                <span className="font-medium text-foreground truncate">
                                  Belum dijadwalkan
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ==================================================================== */}
      {/* SECTION B: TEMPLATE LIBRARY                                          */}
      {/* ==================================================================== */}
      <section className="space-y-5 pt-4 border-t border-border">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="heading-section text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand" />
              Pustaka Template Komunikasi
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-surface-subtle text-foreground-secondary border border-border">
                {templates.length} Template
              </span>
            </h2>
            <p className="text-secondary-body text-sm text-foreground-secondary">
              Naskah komunikasi siap pakai untuk permohonan kerja sama, izin penggunaan tempat, dan negosiasi rate card.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter Category */}
            {templateCategories.length > 0 && (
              <select
                value={templateCategoryFilter}
                onChange={(e) => setTemplateCategoryFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-control bg-surface border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="all">Semua Kategori</option>
                {templateCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}

            {/* Search Template */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-foreground-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={templateSearch}
                onChange={(e) => setTemplateSearch(e.target.value)}
                placeholder="Cari naskah template..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-control bg-surface border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <button
              onClick={fetchTemplates}
              disabled={isLoadingTemplates}
              title="Segarkan daftar template"
              className="p-1.5 rounded-control bg-surface border border-border text-foreground-secondary hover:text-foreground hover:bg-surface-subtle transition-colors"
            >
              <RefreshCw className={cn('w-4 h-4', isLoadingTemplates && 'animate-spin')} />
            </button>
          </div>
        </div>

        {/* Template Error State */}
        {templateError && (
          <div className="p-4 rounded-container bg-status-errorBg border border-status-error/30 text-status-error text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{templateError}</span>
            </div>
            <button
              onClick={fetchTemplates}
              className="px-2.5 py-1 text-xs font-semibold bg-white text-status-error border border-status-error/40 rounded-control hover:bg-white/80"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Template Loading Skeleton */}
        {isLoadingTemplates && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-surface rounded-container border border-border p-4 h-48 space-y-3"
              >
                <div className="h-4 w-2/3 bg-border/40 rounded" />
                <div className="h-3 w-1/3 bg-border/30 rounded" />
                <div className="h-16 bg-surface-subtle rounded-control" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoadingTemplates && filteredTemplates.length === 0 && (
          <div className="p-10 rounded-container border border-dashed border-border bg-surface text-center flex flex-col items-center justify-center space-y-2">
            <HelpCircle className="w-8 h-8 text-foreground-muted" />
            <h4 className="text-sm font-bold text-foreground">Tidak Ada Template</h4>
            <p className="text-xs text-foreground-secondary max-w-sm">
              Tidak ditemukan template komunikasi yang sesuai dengan kriteria filter atau pencarian Anda.
            </p>
          </div>
        )}

        {/* Template Grid */}
        {!isLoadingTemplates && filteredTemplates.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => {
              const isExpanded = !!expandedTemplateIds[template.id];
              const isCopied = copiedTemplateId === template.id;

              return (
                <div
                  key={template.id}
                  className="bg-surface rounded-container border border-border p-4 shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    {/* Header: Name and Badges */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-sm text-foreground leading-snug">
                          {template.name}
                        </h3>
                        {template.isDefault && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-brand/10 text-brand border border-brand/20 shrink-0">
                            Bawaan
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {getChannelBadge(template.channel)}
                        {template.category && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface-subtle text-foreground-secondary border border-border/60">
                            {template.category}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Email Subject if available */}
                    {template.subject && (
                      <div className="text-xs bg-surface-subtle/70 p-2 rounded-control border border-border/50 text-foreground-secondary">
                        <span className="font-semibold text-foreground mr-1">Subjek:</span>
                        {template.subject}
                      </div>
                    )}

                    {/* Template Content Preview / Expanded Body */}
                    <div className="bg-surface-secondary/60 rounded-control border border-border/60 p-3 text-xs">
                      {isExpanded ? (
                        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                          {renderTemplateBodyWithVariables(template.body)}
                        </div>
                      ) : (
                        <div
                          onClick={() => toggleTemplateExpand(template.id)}
                          className="cursor-pointer group"
                        >
                          <p className="line-clamp-3 text-foreground-secondary leading-relaxed group-hover:text-foreground transition-colors">
                            {template.body}
                          </p>
                          <span className="inline-block mt-2 text-[11px] font-semibold text-brand hover:underline">
                            Klik untuk membuka teks lengkap...
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => toggleTemplateExpand(template.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-foreground-secondary hover:text-foreground transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" />
                          Ringkas
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" />
                          Lihat Lengkap
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyTemplate(template)}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control text-xs font-semibold transition-all shadow-subtle',
                        isCopied
                          ? 'bg-status-success text-white'
                          : 'bg-brand text-white hover:bg-brand-hover'
                      )}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Tersalin!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Salin ke Clipboard
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
