'use client';

import React, { useState, useEffect } from 'react';
import { cn, formatNumber, formatDateIndo } from '@/lib/utils';
import {
  Venue,
  SourceType,
  VerificationStatus,
  getCategoryLabel,
  getOperationalStatusLabel,
  getVerificationStatusLabel,
  getSourceTypeLabel,
} from '@/lib/venue-types';
import {
  X,
  Pencil,
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  User,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Building,
  DollarSign,
  Layers,
  Sparkles,
  BarChart3,
  FileCheck,
  AlertTriangle,
  Loader2,
  Share2,
  Plus,
  Trash2,
  Camera,
  Image as ImageIcon,
  ZoomIn,
} from 'lucide-react';

export interface VenueDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  venueId: string | null;
  onEdit: (venue: Venue) => void;
}

export const VenueDetailModal: React.FC<VenueDetailModalProps> = ({
  isOpen,
  onClose,
  venueId,
  onEdit,
}) => {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ src: string; caption: string } | null>(null);

  // Collapsible section states (all expanded by default for quick glance)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (key: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Evidence state & handlers
  const [showAddEvidence, setShowAddEvidence] = useState(false);
  const [claimField, setClaimField] = useState('Kapasitas Ruangan');
  const [claimValue, setClaimValue] = useState('');
  const [sourceTitle, setSourceTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceType, setSourceType] = useState<SourceType>('official_website');
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('verified');
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [savingEvidence, setSavingEvidence] = useState(false);

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!venueId || !sourceUrl.trim() || !claimValue.trim()) return;
    setSavingEvidence(true);
    try {
      const res = await fetch('/api/venue-evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venueId,
          claimField,
          claimValue: claimValue.trim(),
          sourceTitle: sourceTitle.trim() || claimField,
          sourceUrl: sourceUrl.trim(),
          sourceType,
          verificationStatus,
          evidenceNotes: evidenceNotes.trim() || null,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setVenue((prev) => (prev ? { ...prev, evidences: [data.data, ...(prev.evidences || [])] } : null));
        setShowAddEvidence(false);
        setClaimValue('');
        setSourceTitle('');
        setSourceUrl('');
        setEvidenceNotes('');
      }
    } catch {
      // ignore
    } finally {
      setSavingEvidence(false);
    }
  };

  const handleDeleteEvidence = async (evidenceId: string) => {
    if (!venueId || !confirm('Hapus bukti rujukan ini?')) return;
    try {
      const res = await fetch(`/api/venue-evidence?venueId=${venueId}&evidenceId=${evidenceId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setVenue((prev) =>
          prev ? { ...prev, evidences: prev.evidences.filter((e) => e.evidenceId !== evidenceId) } : null
        );
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!isOpen || !venueId) {
      setVenue(null);
      setError(null);
      return;
    }

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/venues/${venueId}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Gagal memuat detail venue.');
        }
        setVenue(data.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Terjadi kendala saat mengambil data venue.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [isOpen, venueId]);

  if (!isOpen) return null;

  // Helper for displaying unknown text
  const renderValueOrUnknown = (value: string | number | null | undefined, unit = '') => {
    if (value === null || value === undefined || value === '') {
      return <span className="italic text-foreground-muted">Belum diketahui</span>;
    }
    return (
      <span className="text-foreground font-medium">
        {typeof value === 'number' ? formatNumber(value) : value}
        {unit ? ` ${unit}` : ''}
      </span>
    );
  };

  // Helper for boolean badge
  const renderBoolBadge = (val: boolean | null | undefined, label: string) => {
    if (val === true) {
      return (
        <div className="flex items-center justify-between p-2.5 rounded-control bg-status-successBg/30 border border-status-success/30 text-xs">
          <span className="text-foreground font-medium">{label}</span>
          <span className="flex items-center gap-1 font-semibold text-status-success">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> Tersedia
          </span>
        </div>
      );
    }
    if (val === false) {
      return (
        <div className="flex items-center justify-between p-2.5 rounded-control bg-status-errorBg/20 border border-status-error/30 text-xs">
          <span className="text-foreground font-medium">{label}</span>
          <span className="flex items-center gap-1 font-semibold text-status-error">
            <XCircle className="w-4 h-4 shrink-0" /> Tidak Tersedia
          </span>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-between p-2.5 rounded-control bg-status-warningBg/20 border border-status-warning/30 text-xs">
        <span className="text-foreground font-medium">{label}</span>
        <span className="flex items-center gap-1 font-semibold text-status-warning">
          <HelpCircle className="w-4 h-4 shrink-0" /> Belum Diketahui
        </span>
      </div>
    );
  };

  // Helper score bar color
  const getScoreColor = (val: number) => {
    if (val < 2.0) return 'bg-status-error';
    if (val < 3.5) return 'bg-status-warning';
    return 'bg-status-success';
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-8 px-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-surface max-w-3xl w-full rounded-dialog border border-border shadow-elevated max-h-[90vh] flex flex-col mb-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-surface z-10 rounded-t-dialog">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-control bg-brand/10 text-brand">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {venue?.name || 'Detail Venue'}
              </h2>
              <p className="text-xs text-foreground-muted">
                {venue ? getCategoryLabel(venue.category) : 'Memuat data...'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {venue && (
              <button
                type="button"
                onClick={() => onEdit(venue)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-surface-secondary border border-border text-foreground hover:bg-surface-subtle text-xs font-semibold transition-colors"
                title="Edit Venue"
              >
                <Pencil className="w-3.5 h-3.5 text-brand" />
                <span>Edit</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-control text-foreground-muted hover:text-foreground hover:bg-surface-secondary transition-colors"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="overflow-y-auto p-6 space-y-5 flex-1">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Loader2 className="w-8 h-8 text-brand animate-spin mb-3" />
              <p className="text-xs text-foreground-muted">Memuat data profil venue...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-control bg-status-errorBg border border-status-error/30 text-status-error text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Terjadi Kesalahan</p>
                <p className="mt-0.5 text-foreground-secondary">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && venue && (
            <>
              {/* 1. Info Dasar */}
              <div className="border border-border rounded-container overflow-hidden bg-surface-secondary/40">
                <button
                  type="button"
                  onClick={() => toggleSection('info')}
                  className="w-full flex items-center justify-between p-4 bg-surface text-left font-bold text-sm text-foreground border-b border-border hover:bg-surface-secondary/50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-brand" /> 1. Info Dasar
                  </span>
                  {collapsedSections['info'] ? (
                    <ChevronDown className="w-4 h-4 text-foreground-muted" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-foreground-muted" />
                  )}
                </button>

                {!collapsedSections['info'] && (
                  <div className="p-4 space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-foreground-secondary block mb-0.5">Nama Resmi:</span>
                        <span className="font-semibold text-foreground text-sm">{venue.name}</span>
                      </div>
                      <div>
                        <span className="text-foreground-secondary block mb-0.5">Nama Alternatif:</span>
                        {venue.nameAlternatives && venue.nameAlternatives.length > 0 ? (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {venue.nameAlternatives.map((alt, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded bg-surface border border-border text-[11px]"
                              >
                                {alt}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="italic text-foreground-muted">Belum diketahui</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60">
                      <div>
                        <span className="text-foreground-secondary block mb-1">Kategori:</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand/10 text-brand border border-brand/20">
                          {getCategoryLabel(venue.category)}
                        </span>
                      </div>
                      <div>
                        <span className="text-foreground-secondary block mb-1">Status Operasional:</span>
                        <span
                          className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
                            venue.operationalStatus === 'active'
                              ? 'bg-status-successBg text-status-success border border-status-success/30'
                              : venue.operationalStatus === 'temporarily_closed' ||
                                venue.operationalStatus === 'under_renovation'
                              ? 'bg-status-warningBg text-status-warning border border-status-warning/30'
                              : venue.operationalStatus === 'permanently_closed'
                              ? 'bg-status-errorBg text-status-error border border-status-error/30'
                              : 'bg-surface text-foreground-muted border border-border'
                          )}
                        >
                          {getOperationalStatusLabel(venue.operationalStatus)}
                        </span>
                      </div>
                    </div>

                    {venue.isAmbiguous && (
                      <div className="p-3 rounded-control bg-status-warningBg/30 border border-status-warning/40 text-foreground flex items-start gap-2 mt-2">
                        <AlertTriangle className="w-4 h-4 text-status-warning shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-status-warning text-xs">
                            Status: Data Ambigu / Perlu Investigasi
                          </p>
                          <p className="text-[11px] text-foreground-secondary mt-0.5">
                            {venue.ambiguityNotes || 'Terdapat perbedaan data antar sumber.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 2. Galeri Foto & Dokumentasi Venue */}
              <div className="border border-border rounded-container overflow-hidden bg-surface-secondary/40">
                <button
                  type="button"
                  onClick={() => toggleSection('galeri')}
                  className="w-full flex items-center justify-between p-4 bg-surface text-left font-bold text-sm text-foreground border-b border-border hover:bg-surface-secondary/50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-brand" /> 2. Galeri Foto &amp; Visual Venue ({venue.assets?.length || 0})
                  </span>
                  {collapsedSections['galeri'] ? (
                    <ChevronDown className="w-4 h-4 text-foreground-muted" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-foreground-muted" />
                  )}
                </button>

                {!collapsedSections['galeri'] && (
                  <div className="p-4 space-y-3 text-xs">
                    {venue.assets && venue.assets.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {venue.assets.map((asset, idx) => (
                          <div
                            key={asset.assetId || idx}
                            onClick={() => setSelectedImage({ src: asset.filePath || asset.sourceUrl, caption: asset.description || asset.altText })}
                            className="group relative rounded-xl overflow-hidden border border-border bg-surface hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                          >
                            <div className="relative w-full h-44 sm:h-48 bg-surface-secondary overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={asset.filePath || asset.sourceUrl}
                                alt={asset.altText || venue.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white font-semibold text-xs">
                                <ZoomIn className="w-4 h-4" /> Perbesar Foto
                              </div>
                              {asset.attribution && (
                                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] backdrop-blur-xs font-medium">
                                  {asset.attribution}
                                </div>
                              )}
                            </div>
                            <div className="p-2.5 bg-surface text-[11px] text-foreground border-t border-border/60">
                              <p className="font-medium line-clamp-2">{asset.description || asset.altText}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-foreground-muted italic">
                        Belum ada berkas foto dokumentasi yang diunggah untuk venue ini.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* 3. Lokasi */}
              <div className="border border-border rounded-container overflow-hidden bg-surface-secondary/40">
                <button
                  type="button"
                  onClick={() => toggleSection('lokasi')}
                  className="w-full flex items-center justify-between p-4 bg-surface text-left font-bold text-sm text-foreground border-b border-border hover:bg-surface-secondary/50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand" /> 3. Lokasi &amp; Akses
                  </span>
                  {collapsedSections['lokasi'] ? (
                    <ChevronDown className="w-4 h-4 text-foreground-muted" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-foreground-muted" />
                  )}
                </button>

                {!collapsedSections['lokasi'] && (
                  <div className="p-4 space-y-3 text-xs">
                    <div>
                      <span className="text-foreground-secondary block mb-0.5">Alamat Lengkap:</span>
                      {renderValueOrUnknown(venue.address)}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60">
                      <div>
                        <span className="text-foreground-secondary block mb-0.5">Kota / Kabupaten:</span>
                        {renderValueOrUnknown(venue.city)}
                      </div>
                      <div>
                        <span className="text-foreground-secondary block mb-0.5">Kecamatan:</span>
                        {renderValueOrUnknown(venue.district)}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/60 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-foreground-secondary block mb-0.5">Koordinat GPS:</span>
                        {venue.coordinates ? (
                          <span className="font-mono text-[11px] text-foreground">
                            {venue.coordinates.lat}, {venue.coordinates.lng}
                          </span>
                        ) : (
                          <span className="italic text-foreground-muted">Belum diketahui</span>
                        )}
                      </div>

                      {venue.googleMapsUrl ? (
                        <a
                          href={venue.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-brand text-white text-xs font-semibold hover:bg-brand-hover transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Buka Google Maps
                        </a>
                      ) : (
                        <span className="italic text-foreground-muted">Link Maps belum ada</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Kontak */}
              <div className="border border-border rounded-container overflow-hidden bg-surface-secondary/40">
                <button
                  type="button"
                  onClick={() => toggleSection('kontak')}
                  className="w-full flex items-center justify-between p-4 bg-surface text-left font-bold text-sm text-foreground border-b border-border hover:bg-surface-secondary/50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-brand" /> 3. Kontak & Narahubung
                  </span>
                  {collapsedSections['kontak'] ? (
                    <ChevronDown className="w-4 h-4 text-foreground-muted" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-foreground-muted" />
                  )}
                </button>

                {!collapsedSections['kontak'] && (
                  <div className="p-4 space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-foreground-secondary block mb-1">Telepon Kantor:</span>
                        {venue.phone ? (
                          <a
                            href={`tel:${venue.phone}`}
                            className="text-brand hover:underline flex items-center gap-1 font-medium"
                          >
                            <Phone className="w-3.5 h-3.5 shrink-0" /> {venue.phone}
                          </a>
                        ) : (
                          <span className="italic text-foreground-muted">Belum diketahui</span>
                        )}
                      </div>

                      <div>
                        <span className="text-foreground-secondary block mb-1">WhatsApp Bisnis:</span>
                        {venue.whatsappBusiness ? (
                          <a
                            href={`https://wa.me/${venue.whatsappBusiness.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand hover:underline flex items-center gap-1 font-medium"
                          >
                            <Share2 className="w-3.5 h-3.5 shrink-0" /> {venue.whatsappBusiness}
                          </a>
                        ) : (
                          <span className="italic text-foreground-muted">Belum diketahui</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60">
                      <div>
                        <span className="text-foreground-secondary block mb-1">Email Resmi:</span>
                        {venue.email ? (
                          <a
                            href={`mailto:${venue.email}`}
                            className="text-brand hover:underline flex items-center gap-1 font-medium"
                          >
                            <Mail className="w-3.5 h-3.5 shrink-0" /> {venue.email}
                          </a>
                        ) : (
                          <span className="italic text-foreground-muted">Belum diketahui</span>
                        )}
                      </div>

                      <div>
                        <span className="text-foreground-secondary block mb-1">Website:</span>
                        {venue.websiteUrl ? (
                          <a
                            href={venue.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand hover:underline flex items-center gap-1 font-medium truncate"
                          >
                            <Globe className="w-3.5 h-3.5 shrink-0" /> {venue.websiteUrl}
                          </a>
                        ) : (
                          <span className="italic text-foreground-muted">Belum diketahui</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60">
                      <div>
                        <span className="text-foreground-secondary block mb-1">Instagram:</span>
                        {venue.instagramHandle ? (
                          <a
                            href={`https://instagram.com/${venue.instagramHandle.replace(/^@/, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand hover:underline flex items-center gap-1 font-medium"
                          >
                            <Instagram className="w-3.5 h-3.5 shrink-0" /> {venue.instagramHandle}
                          </a>
                        ) : (
                          <span className="italic text-foreground-muted">Belum diketahui</span>
                        )}
                      </div>

                      <div>
                        <span className="text-foreground-secondary block mb-1">Person in Charge (PIC):</span>
                        {venue.picName ? (
                          <div className="flex items-center gap-1 text-foreground font-medium">
                            <User className="w-3.5 h-3.5 text-foreground-muted shrink-0" />
                            <span>
                              {venue.picName} {venue.picRole ? `(${venue.picRole})` : ''}
                            </span>
                          </div>
                        ) : (
                          <span className="italic text-foreground-muted">Belum diketahui</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Kapasitas & Ruangan */}
              <div className="border border-border rounded-container overflow-hidden bg-surface-secondary/40">
                <button
                  type="button"
                  onClick={() => toggleSection('kapasitas')}
                  className="w-full flex items-center justify-between p-4 bg-surface text-left font-bold text-sm text-foreground border-b border-border hover:bg-surface-secondary/50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-brand" /> 4. Kapasitas & Ruangan
                  </span>
                  {collapsedSections['kapasitas'] ? (
                    <ChevronDown className="w-4 h-4 text-foreground-muted" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-foreground-muted" />
                  )}
                </button>

                {!collapsedSections['kapasitas'] && (
                  <div className="p-4 space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-foreground-secondary block mb-0.5">Kapasitas Maksimal:</span>
                        {renderValueOrUnknown(venue.capacityTotal, 'Orang')}
                      </div>
                      <div>
                        <span className="text-foreground-secondary block mb-0.5">Dimensi Ruangan:</span>
                        {renderValueOrUnknown(venue.roomSize)}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/60">
                      <span className="text-foreground-secondary block mb-2 font-medium">
                        Kapasitas Berdasarkan Tata Letak (Layout):
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        <div className="p-2.5 rounded-control bg-surface border border-border text-center">
                          <span className="text-[10px] text-foreground-muted uppercase block font-semibold">
                            Theater
                          </span>
                          <span className="text-sm font-bold text-foreground">
                            {venue.capacityByLayout?.theater !== null &&
                            venue.capacityByLayout?.theater !== undefined
                              ? formatNumber(venue.capacityByLayout.theater)
                              : '-'}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-control bg-surface border border-border text-center">
                          <span className="text-[10px] text-foreground-muted uppercase block font-semibold">
                            Classroom
                          </span>
                          <span className="text-sm font-bold text-foreground">
                            {venue.capacityByLayout?.classroom !== null &&
                            venue.capacityByLayout?.classroom !== undefined
                              ? formatNumber(venue.capacityByLayout.classroom)
                              : '-'}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-control bg-surface border border-border text-center">
                          <span className="text-[10px] text-foreground-muted uppercase block font-semibold">
                            U-Shape
                          </span>
                          <span className="text-sm font-bold text-foreground">
                            {venue.capacityByLayout?.ushape !== null &&
                            venue.capacityByLayout?.ushape !== undefined
                              ? formatNumber(venue.capacityByLayout.ushape)
                              : '-'}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-control bg-surface border border-border text-center">
                          <span className="text-[10px] text-foreground-muted uppercase block font-semibold">
                            Standing
                          </span>
                          <span className="text-sm font-bold text-foreground">
                            {venue.capacityByLayout?.standing !== null &&
                            venue.capacityByLayout?.standing !== undefined
                              ? formatNumber(venue.capacityByLayout.standing)
                              : '-'}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-control bg-surface border border-border text-center">
                          <span className="text-[10px] text-foreground-muted uppercase block font-semibold">
                            Boardroom
                          </span>
                          <span className="text-sm font-bold text-foreground">
                            {venue.capacityByLayout?.boardroom !== null &&
                            venue.capacityByLayout?.boardroom !== undefined
                              ? formatNumber(venue.capacityByLayout.boardroom)
                              : '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Harga & Sewa */}
              <div className="border border-border rounded-container overflow-hidden bg-surface-secondary/40">
                <button
                  type="button"
                  onClick={() => toggleSection('harga')}
                  className="w-full flex items-center justify-between p-4 bg-surface text-left font-bold text-sm text-foreground border-b border-border hover:bg-surface-secondary/50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-brand" /> 5. Skema Harga & Ketentuan Sewa
                  </span>
                  {collapsedSections['harga'] ? (
                    <ChevronDown className="w-4 h-4 text-foreground-muted" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-foreground-muted" />
                  )}
                </button>

                {!collapsedSections['harga'] && (
                  <div className="p-4 space-y-3 text-xs">
                    {venue.rentalOptions && venue.rentalOptions.length > 0 ? (
                      <div>
                        <span className="text-foreground-secondary block mb-1.5 font-medium">
                          Paket Sewa Tersedia:
                        </span>
                        <div className="overflow-x-auto rounded-control border border-border bg-surface">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-surface-secondary text-foreground-secondary border-b border-border text-[11px]">
                              <tr>
                                <th className="p-2 font-semibold">Tipe Sewa</th>
                                <th className="p-2 font-semibold">Durasi</th>
                                <th className="p-2 font-semibold">Harga</th>
                                <th className="p-2 font-semibold">Keterangan</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {venue.rentalOptions.map((opt, i) => (
                                <tr key={i} className="hover:bg-surface-subtle">
                                  <td className="p-2 font-semibold capitalize text-foreground">
                                    {opt.type.replace('_', ' ')}
                                  </td>
                                  <td className="p-2 text-foreground-secondary">
                                    {opt.duration || '-'}
                                  </td>
                                  <td className="p-2 font-medium text-foreground">
                                    {opt.price !== null
                                      ? `${opt.currency || 'IDR'} ${formatNumber(opt.price)}`
                                      : 'Sesuai Proposal'}
                                  </td>
                                  <td className="p-2 text-foreground-secondary">
                                    {opt.notes || '-'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <p className="text-foreground-muted italic">
                        Belum ada opsi paket sewa yang terdaftar.
                      </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60">
                      <div>
                        <span className="text-foreground-secondary block mb-0.5">Uang Muka / Deposit:</span>
                        {renderValueOrUnknown(venue.deposit)}
                      </div>
                      <div>
                        <span className="text-foreground-secondary block mb-0.5">Biaya Tambahan / Listrik:</span>
                        {renderValueOrUnknown(venue.additionalFees)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60">
                      <div>
                        <span className="text-foreground-secondary block mb-0.5">Informasi Pajak (PPN/PPh):</span>
                        {renderValueOrUnknown(venue.taxInfo)}
                      </div>
                      <div>
                        <span className="text-foreground-secondary block mb-0.5">Kebijakan Pembatalan:</span>
                        {renderValueOrUnknown(venue.cancellationPolicy)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 6. Fasilitas */}
              <div className="border border-border rounded-container overflow-hidden bg-surface-secondary/40">
                <button
                  type="button"
                  onClick={() => toggleSection('fasilitas')}
                  className="w-full flex items-center justify-between p-4 bg-surface text-left font-bold text-sm text-foreground border-b border-border hover:bg-surface-secondary/50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand" /> 6. Fasilitas Venue
                  </span>
                  {collapsedSections['fasilitas'] ? (
                    <ChevronDown className="w-4 h-4 text-foreground-muted" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-foreground-muted" />
                  )}
                </button>

                {!collapsedSections['fasilitas'] && (
                  <div className="p-4 space-y-3 text-xs">
                    {venue.facilities && venue.facilities.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {venue.facilities.map((fac, idx) => (
                          <div key={idx}>
                            {renderBoolBadge(fac.available, fac.name)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-foreground-muted italic">
                        Belum ada data fasilitas yang ditambahkan.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* 7. Izin Branding */}
              <div className="border border-border rounded-container overflow-hidden bg-surface-secondary/40">
                <button
                  type="button"
                  onClick={() => toggleSection('branding')}
                  className="w-full flex items-center justify-between p-4 bg-surface text-left font-bold text-sm text-foreground border-b border-border hover:bg-surface-secondary/50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand" /> 7. Izin Branding & Aktivasi Brand
                  </span>
                  {collapsedSections['branding'] ? (
                    <ChevronDown className="w-4 h-4 text-foreground-muted" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-foreground-muted" />
                  )}
                </button>

                {!collapsedSections['branding'] && (
                  <div className="p-4 space-y-2 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {renderBoolBadge(venue.brandingPermissions?.backdrop, 'Backdrop / Photowall')}
                      {renderBoolBadge(venue.brandingPermissions?.banner, 'Banner / Standing Roll-up')}
                      {renderBoolBadge(venue.brandingPermissions?.booth, 'Booth Aktivasi / Registrasi')}
                      {renderBoolBadge(venue.brandingPermissions?.productDisplay, 'Display Produk & Tester')}
                      {renderBoolBadge(venue.brandingPermissions?.logoSponsor, 'Pemasangan Logo Sponsor')}
                      {renderBoolBadge(venue.brandingPermissions?.qrCode, 'QR Code Standing Display')}
                      {renderBoolBadge(venue.brandingPermissions?.promoMaterial, 'Penyebaran Flyer / Brosur')}
                    </div>

                    {venue.brandingPermissions?.notes && (
                      <div className="pt-2 border-t border-border/60">
                        <span className="text-foreground-secondary block mb-1">Catatan Izin Branding:</span>
                        <p className="text-foreground">{venue.brandingPermissions.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 8. Penilaian Skor */}
              <div className="border border-border rounded-container overflow-hidden bg-surface-secondary/40">
                <button
                  type="button"
                  onClick={() => toggleSection('skor')}
                  className="w-full flex items-center justify-between p-4 bg-surface text-left font-bold text-sm text-foreground border-b border-border hover:bg-surface-secondary/50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-brand" /> 8. Penilaian Skor Kelayakan
                  </span>
                  {collapsedSections['skor'] ? (
                    <ChevronDown className="w-4 h-4 text-foreground-muted" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-foreground-muted" />
                  )}
                </button>

                {!collapsedSections['skor'] && (
                  <div className="p-4 space-y-4 text-xs">
                    {venue.score ? (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-surface rounded-control border border-border">
                          <div>
                            <span className="text-foreground-secondary text-[11px] block">
                              Total Skor Terkoreksi:
                            </span>
                            <div className="flex items-baseline gap-1 mt-0.5">
                              <span className="text-2xl font-black text-brand">
                                {venue.score.normalizedScore}
                              </span>
                              <span className="text-xs text-foreground-muted font-bold">/ 100</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-foreground-secondary text-[11px] block">
                              Kelengkapan Data:
                            </span>
                            <div className="flex items-baseline gap-1 mt-0.5">
                              <span className="text-2xl font-black text-foreground">
                                {venue.score.dataCompleteness}%
                              </span>
                              <span className="text-xs text-foreground-muted font-medium">
                                ({venue.score.verifiedClaimsCount} klaim terverifikasi)
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Breakdown bars */}
                        <div className="space-y-2.5">
                          {[
                            { label: 'Kesesuaian Anggaran (Cost Fit)', val: venue.score.costFit },
                            { label: 'Kesesuaian Kapasitas (Capacity Fit)', val: venue.score.capacityFit },
                            { label: 'Relevansi Target Audiens (Audience)', val: venue.score.audienceRelevance },
                            { label: 'Kualitas Fasilitas (Facility)', val: venue.score.facilityQuality },
                            { label: 'Aksesibilitas & Lokasi (Location)', val: venue.score.accessibilityLocation },
                            { label: 'Potensi Kolaborasi (Collaboration)', val: venue.score.collaborationPotential },
                          ].map((item, idx) => {
                            const pct = Math.min(Math.max((item.val / 5) * 100, 0), 100);
                            return (
                              <div key={idx} className="space-y-1">
                                <div className="flex justify-between items-center text-[11px]">
                                  <span className="font-semibold text-foreground-secondary">
                                    {item.label}
                                  </span>
                                  <span className="font-bold text-foreground">
                                    {item.val.toFixed(1)} / 5.0
                                  </span>
                                </div>
                                <div className="h-2 w-full bg-surface-secondary rounded-full overflow-hidden border border-border/40">
                                  <div
                                    style={{ width: `${pct}%` }}
                                    className={cn('h-full transition-all duration-300', getScoreColor(item.val))}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {venue.score.scoreExplanation && (
                          <div className="p-3 rounded-control bg-surface border border-border">
                            <span className="text-foreground-secondary text-[11px] block font-semibold mb-1">
                              Penjelasan & Justifikasi Skor:
                            </span>
                            <p className="text-foreground leading-relaxed text-xs">
                              {venue.score.scoreExplanation}
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-foreground-muted italic">
                        Belum ada kalkulasi skor kelayakan untuk venue ini.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* 9. Bukti & Sumber */}
              <div className="border border-border rounded-container overflow-hidden bg-surface-secondary/40">
                <button
                  type="button"
                  onClick={() => toggleSection('bukti')}
                  className="w-full flex items-center justify-between p-4 bg-surface text-left font-bold text-sm text-foreground border-b border-border hover:bg-surface-secondary/50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-brand" /> 9. Bukti & Sumber Terverifikasi
                  </span>
                  {collapsedSections['bukti'] ? (
                    <ChevronDown className="w-4 h-4 text-foreground-muted" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-foreground-muted" />
                  )}
                </button>

                {!collapsedSections['bukti'] && (
                  <div className="p-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground-secondary">
                        Daftar Bukti & Rujukan Terverifikasi ({venue.evidences?.length || 0})
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowAddEvidence(!showAddEvidence)}
                        className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-brand text-white rounded-control hover:bg-brand-hover transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        {showAddEvidence ? "Batal" : "Tambah Bukti"}
                      </button>
                    </div>

                    {/* Inline Add Evidence Form */}
                    {showAddEvidence && (
                      <form onSubmit={handleAddEvidence} className="p-3 rounded-control bg-surface border border-brand/40 space-y-2">
                        <div className="font-bold text-foreground text-xs">Tambah Catatan Bukti Baru</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-semibold text-foreground-secondary block mb-0.5">Bidang Klaim</label>
                            <input
                              value={claimField}
                              onChange={(e) => setClaimField(e.target.value)}
                              placeholder="cth: Kapasitas, Harga Sewa"
                              className="w-full px-2 py-1 text-xs border border-border rounded bg-surface-secondary text-foreground"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-semibold text-foreground-secondary block mb-0.5">Nilai Klaim *</label>
                            <input
                              value={claimValue}
                              onChange={(e) => setClaimValue(e.target.value)}
                              placeholder="cth: 300 pax, Rp2.500.000/hari"
                              className="w-full px-2 py-1 text-xs border border-border rounded bg-surface-secondary text-foreground"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-semibold text-foreground-secondary block mb-0.5">Judul Sumber</label>
                            <input
                              value={sourceTitle}
                              onChange={(e) => setSourceTitle(e.target.value)}
                              placeholder="cth: Website Resmi Hotel ASTON"
                              className="w-full px-2 py-1 text-xs border border-border rounded bg-surface-secondary text-foreground"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-semibold text-foreground-secondary block mb-0.5">URL Rujukan *</label>
                            <input
                              value={sourceUrl}
                              onChange={(e) => setSourceUrl(e.target.value)}
                              placeholder="https://..."
                              type="url"
                              className="w-full px-2 py-1 text-xs border border-border rounded bg-surface-secondary text-foreground"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-semibold text-foreground-secondary block mb-0.5">Kategori Sumber</label>
                            <select
                              value={sourceType}
                              onChange={(e) => setSourceType(e.target.value as SourceType)}
                              className="w-full px-2 py-1 text-xs border border-border rounded bg-surface-secondary text-foreground"
                            >
                              <option value="official_website">Situs Resmi</option>
                              <option value="official_brochure">Brosur / Rate Card</option>
                              <option value="official_social_media">Media Sosial Resmi</option>
                              <option value="direct_confirmation">Konfirmasi Langsung</option>
                              <option value="reputable_directory">Direktori Kredibel</option>
                              <option value="user_provided">Masukan Pengguna</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-semibold text-foreground-secondary block mb-0.5">Status Verifikasi</label>
                            <select
                              value={verificationStatus}
                              onChange={(e) => setVerificationStatus(e.target.value as VerificationStatus)}
                              className="w-full px-2 py-1 text-xs border border-border rounded bg-surface-secondary text-foreground"
                            >
                              <option value="verified">Terverifikasi Penuh</option>
                              <option value="partially_verified">Terverifikasi Sebagian</option>
                              <option value="unverified">Belum Terverifikasi</option>
                              <option value="conflicting">Ada Konflik</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-foreground-secondary block mb-0.5">Catatan Bukti</label>
                          <input
                            value={evidenceNotes}
                            onChange={(e) => setEvidenceNotes(e.target.value)}
                            placeholder="Catatan tambahan keabsahan bukti..."
                            className="w-full px-2 py-1 text-xs border border-border rounded bg-surface-secondary text-foreground"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setShowAddEvidence(false)}
                            className="px-2.5 py-1 text-[11px] border border-border rounded text-foreground-secondary"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            disabled={savingEvidence}
                            className="px-3 py-1 text-[11px] font-semibold bg-brand text-white rounded disabled:opacity-50"
                          >
                            {savingEvidence ? "Menyimpan..." : "Simpan Bukti"}
                          </button>
                        </div>
                      </form>
                    )}

                    {venue.evidences && venue.evidences.length > 0 ? (
                      <div className="space-y-2.5">
                        {venue.evidences.map((ev) => (
                          <div
                            key={ev.evidenceId}
                            className="p-3 rounded-control bg-surface border border-border space-y-1.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-foreground text-xs">
                                {ev.sourceTitle || ev.claimField}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-brand/10 text-brand">
                                  {getVerificationStatusLabel(ev.verificationStatus)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteEvidence(ev.evidenceId)}
                                  className="text-foreground-muted hover:text-status-error p-1 rounded"
                                  title="Hapus Bukti"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="text-[11px] text-foreground-secondary">
                              <p>
                                <span className="font-semibold">Klaim:</span> {ev.claimField} = &ldquo;{ev.claimValue}&rdquo;
                              </p>
                              <p>
                                <span className="font-semibold">Tipe Sumber:</span> {getSourceTypeLabel(ev.sourceType)}
                              </p>
                              {ev.publisher && (
                                <p>
                                  <span className="font-semibold">Penerbit:</span> {ev.publisher}
                                </p>
                              )}
                              {ev.evidenceNotes && (
                                <p className="italic text-foreground-muted mt-0.5">
                                  Catatan: {ev.evidenceNotes}
                                </p>
                              )}
                            </div>

                            {ev.sourceUrl && (
                              <a
                                href={ev.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-brand hover:underline text-[11px] font-medium pt-1"
                              >
                                <ExternalLink className="w-3 h-3" /> Buka Tautan Bukti Rujukan
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-foreground-muted italic">
                        Belum ada dokumen bukti rujukan yang dilampirkan.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* 10. Catatan */}
              <div className="border border-border rounded-container overflow-hidden bg-surface-secondary/40">
                <button
                  type="button"
                  onClick={() => toggleSection('catatan')}
                  className="w-full flex items-center justify-between p-4 bg-surface text-left font-bold text-sm text-foreground border-b border-border hover:bg-surface-secondary/50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-brand" /> 10. Catatan Khusus & Tim Internal
                  </span>
                  {collapsedSections['catatan'] ? (
                    <ChevronDown className="w-4 h-4 text-foreground-muted" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-foreground-muted" />
                  )}
                </button>

                {!collapsedSections['catatan'] && (
                  <div className="p-4 space-y-3 text-xs">
                    <div>
                      <span className="text-foreground-secondary block mb-1 font-semibold">
                        Keunggulan Venue:
                      </span>
                      {venue.strengths && venue.strengths.length > 0 ? (
                        <ul className="list-disc list-inside space-y-0.5 text-foreground">
                          {venue.strengths.map((str, i) => (
                            <li key={i}>{str}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="italic text-foreground-muted">Belum diketahui</span>
                      )}
                    </div>

                    <div className="pt-2 border-t border-border/60">
                      <span className="text-foreground-secondary block mb-1 font-semibold">
                        Keterbatasan / Kendala:
                      </span>
                      {venue.limitations && venue.limitations.length > 0 ? (
                        <ul className="list-disc list-inside space-y-0.5 text-status-error">
                          {venue.limitations.map((lim, i) => (
                            <li key={i}>{lim}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="italic text-foreground-muted">Belum diketahui</span>
                      )}
                    </div>

                    <div className="pt-2 border-t border-border/60">
                      <span className="text-foreground-secondary block mb-1 font-semibold">
                        Target Audiens yang Relevan:
                      </span>
                      {venue.targetAudience && venue.targetAudience.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {venue.targetAudience.map((aud, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-full bg-surface border border-border text-[11px] font-medium"
                            >
                              {aud}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="italic text-foreground-muted">Belum diketahui</span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60">
                      <div>
                        <span className="text-foreground-secondary block mb-0.5 font-semibold">
                          Catatan Internal:
                        </span>
                        {renderValueOrUnknown(venue.internalNotes)}
                      </div>
                      <div>
                        <span className="text-foreground-secondary block mb-0.5 font-semibold">
                          Penanggung Jawab Internal (Owner):
                        </span>
                        {renderValueOrUnknown(venue.internalOwner)}
                      </div>
                    </div>

                    {venue.updatedAt && (
                      <div className="pt-2 border-t border-border/60 text-[10px] text-foreground-muted text-right">
                        Terakhir diperbarui: {formatDateIndo(venue.updatedAt)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-surface rounded-b-dialog sticky bottom-0">
          <span className="text-[11px] text-foreground-muted">
            {venue?.id ? `ID: ${venue.id}` : ''}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-border text-foreground-secondary hover:text-foreground hover:bg-surface-secondary rounded-control text-xs font-semibold transition-all"
          >
            Tutup
          </button>
        </div>
      </div>

      {/* Full Resolution Photo Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-surface rounded-2xl overflow-hidden shadow-2xl border border-border flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3.5 bg-surface border-b border-border">
              <span className="text-xs font-bold text-foreground line-clamp-1">
                {selectedImage.caption}
              </span>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="p-1 rounded-full hover:bg-surface-secondary text-foreground-muted hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 sm:p-4 bg-black/95 flex items-center justify-center max-h-[75vh] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage.src}
                alt={selectedImage.caption}
                className="max-w-full max-h-[72vh] object-contain rounded-lg shadow-lg"
              />
            </div>
            <div className="p-3 bg-surface-secondary border-t border-border flex items-center justify-between text-xs">
              <span className="text-[11px] text-foreground-secondary font-medium truncate max-w-md">
                {selectedImage.caption}
              </span>
              <a
                href={selectedImage.src}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-brand font-bold hover:underline text-xs shrink-0"
              >
                Resolusi Asli <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
