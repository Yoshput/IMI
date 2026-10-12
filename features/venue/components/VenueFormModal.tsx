'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  Venue,
  VenueCategory,
  OperationalStatus,
  createEmptyVenue,
  getCategoryLabel,
  getOperationalStatusLabel,
} from '@/lib/venue-types';
import { X, Loader2, AlertCircle } from 'lucide-react';

export interface VenueFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  venue?: Venue | null; // If provided, edit mode
}

const CATEGORY_OPTIONS: VenueCategory[] = [
  'kampus',
  'gedung_pertemuan',
  'hotel',
  'coworking',
  'creative_space',
  'kafe_restoran',
  'komunitas',
  'lainnya',
];

const OPERATIONAL_STATUS_OPTIONS: OperationalStatus[] = [
  'active',
  'temporarily_closed',
  'permanently_closed',
  'unknown',
  'under_renovation',
];

const STANDARD_FACILITIES = [
  'Proyektor',
  'Layar',
  'Mikrofon',
  'Sound System',
  'Wi-Fi',
  'Listrik Memadai',
  'Meja & Kursi',
  'AC',
  'Parkir',
  'Aksesibilitas',
  'Area Praktik',
];

export const VenueFormModal: React.FC<VenueFormModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  venue,
}) => {
  const isEditMode = Boolean(venue && venue.id);

  // Form states
  // 1. Info Dasar
  const [name, setName] = useState('');
  const [nameAlternativesText, setNameAlternativesText] = useState('');
  const [category, setCategory] = useState<VenueCategory>('lainnya');
  const [operationalStatus, setOperationalStatus] = useState<OperationalStatus>('unknown');
  const [isAmbiguous, setIsAmbiguous] = useState(false);
  const [ambiguityNotes, setAmbiguityNotes] = useState('');

  // 2. Lokasi
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');

  // 3. Kontak
  const [phone, setPhone] = useState('');
  const [whatsappBusiness, setWhatsappBusiness] = useState('');
  const [email, setEmail] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [picName, setPicName] = useState('');
  const [picRole, setPicRole] = useState('');

  // 4. Kapasitas
  const [capacityTotal, setCapacityTotal] = useState<string>('');
  const [layoutTheater, setLayoutTheater] = useState<string>('');
  const [layoutClassroom, setLayoutClassroom] = useState<string>('');
  const [layoutUshape, setLayoutUshape] = useState<string>('');
  const [layoutStanding, setLayoutStanding] = useState<string>('');
  const [roomSize, setRoomSize] = useState('');

  // 5. Fasilitas (checked = true, unchecked = false or null)
  const [facilitiesChecked, setFacilitiesChecked] = useState<Record<string, boolean>>({});

  // 6. Izin Branding (checked = true)
  const [brandingPermissions, setBrandingPermissions] = useState({
    backdrop: false,
    banner: false,
    booth: false,
    productDisplay: false,
    logoSponsor: false,
    qrCode: false,
    promoMaterial: false,
  });

  // 7. Catatan
  const [strengthsText, setStrengthsText] = useState('');
  const [limitationsText, setLimitationsText] = useState('');
  const [targetAudienceText, setTargetAudienceText] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [internalOwner, setInternalOwner] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Initialize or reset form when isOpen or venue changes
  useEffect(() => {
    if (!isOpen) {
      setIsDirty(false);
      setErrorMessage(null);
      return;
    }

    if (venue) {
      setName(venue.name || '');
      setNameAlternativesText(venue.nameAlternatives ? venue.nameAlternatives.join(', ') : '');
      setCategory(venue.category || 'lainnya');
      setOperationalStatus(venue.operationalStatus || 'unknown');
      setIsAmbiguous(Boolean(venue.isAmbiguous));
      setAmbiguityNotes(venue.ambiguityNotes || '');

      setAddress(venue.address || '');
      setCity(venue.city || '');
      setDistrict(venue.district || '');
      setGoogleMapsUrl(venue.googleMapsUrl || '');

      setPhone(venue.phone || '');
      setWhatsappBusiness(venue.whatsappBusiness || '');
      setEmail(venue.email || '');
      setWebsiteUrl(venue.websiteUrl || '');
      setInstagramHandle((venue.instagramHandle || '').replace(/^@/, ''));
      setPicName(venue.picName || '');
      setPicRole(venue.picRole || '');

      setCapacityTotal(venue.capacityTotal !== null && venue.capacityTotal !== undefined ? String(venue.capacityTotal) : '');
      setLayoutTheater(venue.capacityByLayout?.theater !== null && venue.capacityByLayout?.theater !== undefined ? String(venue.capacityByLayout.theater) : '');
      setLayoutClassroom(venue.capacityByLayout?.classroom !== null && venue.capacityByLayout?.classroom !== undefined ? String(venue.capacityByLayout.classroom) : '');
      setLayoutUshape(venue.capacityByLayout?.ushape !== null && venue.capacityByLayout?.ushape !== undefined ? String(venue.capacityByLayout.ushape) : '');
      setLayoutStanding(venue.capacityByLayout?.standing !== null && venue.capacityByLayout?.standing !== undefined ? String(venue.capacityByLayout.standing) : '');
      setRoomSize(venue.roomSize || '');

      // Facilities
      const facMap: Record<string, boolean> = {};
      STANDARD_FACILITIES.forEach((name) => {
        const found = venue.facilities?.find((f) => f.name.toLowerCase() === name.toLowerCase());
        facMap[name] = Boolean(found?.available);
      });
      // Also check any existing venue facilities not in standard
      venue.facilities?.forEach((f) => {
        if (f.available) {
          facMap[f.name] = true;
        }
      });
      setFacilitiesChecked(facMap);

      // Branding
      setBrandingPermissions({
        backdrop: Boolean(venue.brandingPermissions?.backdrop),
        banner: Boolean(venue.brandingPermissions?.banner),
        booth: Boolean(venue.brandingPermissions?.booth),
        productDisplay: Boolean(venue.brandingPermissions?.productDisplay),
        logoSponsor: Boolean(venue.brandingPermissions?.logoSponsor),
        qrCode: Boolean(venue.brandingPermissions?.qrCode),
        promoMaterial: Boolean(venue.brandingPermissions?.promoMaterial),
      });

      // Notes & extra
      setStrengthsText(venue.strengths ? venue.strengths.join('\n') : '');
      setLimitationsText(venue.limitations ? venue.limitations.join('\n') : '');
      setTargetAudienceText(venue.targetAudience ? venue.targetAudience.join(', ') : '');
      setInternalNotes(venue.internalNotes || '');
      setInternalOwner(venue.internalOwner || '');
    } else {
      const empty = createEmptyVenue();
      setName('');
      setNameAlternativesText('');
      setCategory(empty.category);
      setOperationalStatus(empty.operationalStatus);
      setIsAmbiguous(false);
      setAmbiguityNotes('');

      setAddress('');
      setCity('');
      setDistrict('');
      setGoogleMapsUrl('');

      setPhone('');
      setWhatsappBusiness('');
      setEmail('');
      setWebsiteUrl('');
      setInstagramHandle('');
      setPicName('');
      setPicRole('');

      setCapacityTotal('');
      setLayoutTheater('');
      setLayoutClassroom('');
      setLayoutUshape('');
      setLayoutStanding('');
      setRoomSize('');

      const facMap: Record<string, boolean> = {};
      STANDARD_FACILITIES.forEach((name) => {
        facMap[name] = false;
      });
      setFacilitiesChecked(facMap);

      setBrandingPermissions({
        backdrop: false,
        banner: false,
        booth: false,
        productDisplay: false,
        logoSponsor: false,
        qrCode: false,
        promoMaterial: false,
      });

      setStrengthsText('');
      setLimitationsText('');
      setTargetAudienceText('');
      setInternalNotes('');
      setInternalOwner('');
    }

    setIsDirty(false);
    setErrorMessage(null);
  }, [isOpen, venue]);

  if (!isOpen) return null;

  const handleFacilityToggle = (facName: string) => {
    setIsDirty(true);
    setFacilitiesChecked((prev) => ({
      ...prev,
      [facName]: !prev[facName],
    }));
  };

  const handleBrandingToggle = (key: keyof typeof brandingPermissions) => {
    setIsDirty(true);
    setBrandingPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleClose = () => {
    if (isDirty) {
      const confirmLeave = window.confirm(
        'Perubahan yang belum disimpan akan hilang. Apakah Anda yakin ingin menutup formulir ini?'
      );
      if (!confirmLeave) return;
    }
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Nama venue wajib diisi.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // Parse array fields
      const nameAlternatives = nameAlternativesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const strengths = strengthsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const limitations = limitationsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const targetAudience = targetAudienceText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      // Parse facilities
      const facilities = Object.entries(facilitiesChecked).map(([fName, isChecked]) => ({
        name: fName,
        available: isChecked,
        notes: null,
        verificationStatus: isChecked ? ('unverified' as const) : ('unverified' as const),
      }));

      // Parse capacity
      const parseNum = (val: string): number | null => {
        const trimmed = val.trim();
        if (!trimmed) return null;
        const n = parseInt(trimmed, 10);
        return isNaN(n) ? null : n;
      };

      const cleanInstagram = instagramHandle.trim()
        ? instagramHandle.trim().startsWith('@')
          ? instagramHandle.trim()
          : `@${instagramHandle.trim()}`
        : null;

      const payload: Partial<Venue> = {
        name: name.trim(),
        nameAlternatives,
        category,
        operationalStatus,
        isAmbiguous,
        ambiguityNotes: isAmbiguous ? ambiguityNotes.trim() || null : null,

        address: address.trim() || null,
        city: city.trim() || null,
        district: district.trim() || null,
        googleMapsUrl: googleMapsUrl.trim() || null,

        phone: phone.trim() || null,
        whatsappBusiness: whatsappBusiness.trim() || null,
        email: email.trim() || null,
        websiteUrl: websiteUrl.trim() || null,
        instagramHandle: cleanInstagram,
        picName: picName.trim() || null,
        picRole: picRole.trim() || null,

        capacityTotal: parseNum(capacityTotal),
        capacityByLayout: {
          theater: parseNum(layoutTheater),
          classroom: parseNum(layoutClassroom),
          ushape: parseNum(layoutUshape),
          standing: parseNum(layoutStanding),
          boardroom: venue?.capacityByLayout?.boardroom ?? null,
        },
        roomSize: roomSize.trim() || null,

        facilities,
        brandingPermissions: {
          backdrop: brandingPermissions.backdrop,
          banner: brandingPermissions.banner,
          booth: brandingPermissions.booth,
          productDisplay: brandingPermissions.productDisplay,
          logoSponsor: brandingPermissions.logoSponsor,
          qrCode: brandingPermissions.qrCode,
          promoMaterial: brandingPermissions.promoMaterial,
          notes: venue?.brandingPermissions?.notes ?? null,
        },

        strengths,
        limitations,
        targetAudience,
        internalNotes: internalNotes.trim() || null,
        internalOwner: internalOwner.trim() || null,
      };

      const url = isEditMode && venue?.id ? `/api/venues/${venue.id}` : '/api/venues';
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Terjadi kesalahan saat menyimpan data venue.');
      }

      // Local storage backup for multi-instance serverless continuity
      if (typeof window !== 'undefined' && data.data) {
        try {
          const cacheStr = localStorage.getItem('local_venue_cache');
          const cacheList: Venue[] = cacheStr ? JSON.parse(cacheStr) : [];
          const filtered = cacheList.filter((v) => v.id !== data.data.id);
          localStorage.setItem('local_venue_cache', JSON.stringify([data.data, ...filtered]));
        } catch {
          // ignore
        }
      }

      setIsDirty(false);
      onSaved();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Terjadi kesalahan yang tidak terduga.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-8 px-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="bg-surface max-w-2xl w-full rounded-dialog border border-border shadow-elevated max-h-[90vh] flex flex-col mb-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-surface z-10 rounded-t-dialog">
          <div>
            <h2 className="text-base font-bold text-foreground">
              {isEditMode ? 'Edit Venue' : 'Tambah Venue Baru'}
            </h2>
            <p className="text-xs text-foreground-muted mt-0.5">
              {isEditMode
                ? 'Perbarui detail data intelijen dan operasional venue'
                : 'Lengkapi profil venue untuk riset dan penjajakan kerjasama'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-control text-foreground-muted hover:text-foreground hover:bg-surface-secondary transition-colors"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
          {errorMessage && (
            <div className="p-3.5 rounded-control bg-status-errorBg border border-status-error/30 text-status-error text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Info Dasar */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground border-b border-border pb-2">
              1. Info Dasar
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-foreground-secondary mb-1.5">
                Nama Venue <span className="text-status-error">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Contoh: Auditorium Graha Widya"
                className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-control text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-foreground-secondary mb-1.5">
                Nama Alternatif / Singkatan (pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={nameAlternativesText}
                onChange={(e) => {
                  setNameAlternativesText(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Contoh: GKU 1, Hall Utama Barat"
                className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-control text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-foreground-secondary mb-1.5">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value as VenueCategory);
                    setIsDirty(true);
                  }}
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-control text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {getCategoryLabel(cat)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-foreground-secondary mb-1.5">
                  Status Operasional
                </label>
                <select
                  value={operationalStatus}
                  onChange={(e) => {
                    setOperationalStatus(e.target.value as OperationalStatus);
                    setIsDirty(true);
                  }}
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-control text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                >
                  {OPERATIONAL_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {getOperationalStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-3 bg-surface-secondary rounded-control border border-border space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-foreground">
                <input
                  type="checkbox"
                  checked={isAmbiguous}
                  onChange={(e) => {
                    setIsAmbiguous(e.target.checked);
                    setIsDirty(true);
                  }}
                  className="rounded border-border text-brand focus:ring-brand/40 w-4 h-4"
                />
                <span>Tandai sebagai data ambigu / butuh investigasi lanjut?</span>
              </label>

              {isAmbiguous && (
                <div>
                  <label className="block text-[11px] font-semibold text-foreground-secondary mb-1">
                    Catatan Keambiguan
                  </label>
                  <textarea
                    rows={2}
                    value={ambiguityNotes}
                    onChange={(e) => {
                      setAmbiguityNotes(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="Contoh: Lokasi memiliki dua alamat berbeda di Google Maps dan Instagram..."
                    className="w-full px-3 py-2 bg-surface border border-border rounded-control text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 2. Lokasi */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground border-b border-border pb-2">
              2. Lokasi
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-foreground-secondary mb-1.5">
                Alamat Lengkap
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Jl. Sukarno Hatta No. 12..."
                className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-control text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-foreground-secondary mb-1.5">
                  Kota / Kabupaten
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Contoh: Surabaya"
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-control text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-foreground-secondary mb-1.5">
                  Kecamatan
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Contoh: Gubeng"
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-control text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-foreground-secondary mb-1.5">
                Link Google Maps
              </label>
              <input
                type="url"
                value={googleMapsUrl}
                onChange={(e) => {
                  setGoogleMapsUrl(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="https://maps.app.goo.gl/..."
                className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-control text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>
          </div>

          {/* 3. Kontak */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground border-b border-border pb-2">
              3. Kontak
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-foreground-secondary mb-1.5">
                  Telepon
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="031-1234567"
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-control text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-foreground-secondary mb-1.5">
                  WhatsApp Bisnis
                </label>
                <input
                  type="tel"
                  value={whatsappBusiness}
                  onChange={(e) => {
                    setWhatsappBusiness(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="08123456789"
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-control text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-foreground-secondary mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="venue@domain.com"
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-control text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-foreground-secondary mb-1.5">
                  Website
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => {
                    setWebsiteUrl(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="https://venue.co.id"
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-control text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-foreground-secondary mb-1.5">
                  Instagram
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-foreground-muted text-sm font-medium">
                    @
                  </span>
                  <input
                    type="text"
                    value={instagramHandle}
                    onChange={(e) => {
                      setInstagramHandle(e.target.value.replace(/^@/, ''));
                      setIsDirty(true);
                    }}
                    placeholder="namavenue"
                    className="w-full pl-7 pr-3 py-2 bg-surface-secondary border border-border rounded-control text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-foreground-secondary mb-1.5">
                  Nama PIC
                </label>
                <input
                  type="text"
                  value={picName}
                  onChange={(e) => {
                    setPicName(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Budi Santoso"
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-control text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-foreground-secondary mb-1.5">
                  Jabatan PIC
                </label>
                <input
                  type="text"
                  value={picRole}
                  onChange={(e) => {
                    setPicRole(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Sales & Event Manager"
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-control text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>
            </div>
          </div>

          {/* 4. Kapasitas */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground border-b border-border pb-2">
              4. Kapasitas & Ruangan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-foreground-secondary mb-1.5">
                  Kapasitas Total (Orang)
                </label>
                <input
                  type="number"
                  min="0"
                  value={capacityTotal}
                  onChange={(e) => {
                    setCapacityTotal(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Contoh: 300"
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-control text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-foreground-secondary mb-1.5">
                  Ukuran Ruangan
                </label>
                <input
                  type="text"
                  value={roomSize}
                  onChange={(e) => {
                    setRoomSize(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Contoh: 20m x 15m (300 m²)"
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-control text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-foreground-secondary mb-1">
                  Theater
                </label>
                <input
                  type="number"
                  min="0"
                  value={layoutTheater}
                  onChange={(e) => {
                    setLayoutTheater(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-control text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-foreground-secondary mb-1">
                  Classroom
                </label>
                <input
                  type="number"
                  min="0"
                  value={layoutClassroom}
                  onChange={(e) => {
                    setLayoutClassroom(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-control text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-foreground-secondary mb-1">
                  U-Shape
                </label>
                <input
                  type="number"
                  min="0"
                  value={layoutUshape}
                  onChange={(e) => {
                    setLayoutUshape(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-control text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-foreground-secondary mb-1">
                  Standing
                </label>
                <input
                  type="number"
                  min="0"
                  value={layoutStanding}
                  onChange={(e) => {
                    setLayoutStanding(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-control text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>
            </div>
          </div>

          {/* 5. Fasilitas */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground border-b border-border pb-2">
              5. Fasilitas yang Tersedia
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {STANDARD_FACILITIES.map((facility) => {
                const checked = Boolean(facilitiesChecked[facility]);
                return (
                  <label
                    key={facility}
                    className={cn(
                      'flex items-center gap-2.5 p-2 rounded-control border cursor-pointer transition-colors text-xs font-medium',
                      checked
                        ? 'bg-brand/10 border-brand/40 text-foreground font-semibold'
                        : 'bg-surface-secondary border-border text-foreground-secondary hover:text-foreground'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleFacilityToggle(facility)}
                      className="rounded border-border text-brand focus:ring-brand/40 w-4 h-4"
                    />
                    <span>{facility}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 6. Izin Branding */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground border-b border-border pb-2">
              6. Izin Branding & Promosi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { key: 'backdrop', label: 'Backdrop Panggung / Photowall' },
                { key: 'banner', label: 'Banner & Roll-up Standing' },
                { key: 'booth', label: 'Booth Aktivasi / Registrasi' },
                { key: 'productDisplay', label: 'Display Produk & Tester' },
                { key: 'logoSponsor', label: 'Pemasangan Logo Sponsor' },
                { key: 'qrCode', label: 'Pemasangan QR Code Standee' },
                { key: 'promoMaterial', label: 'Penyebaran Brosur & Materi Promosi' },
              ].map((item) => {
                const k = item.key as keyof typeof brandingPermissions;
                const checked = Boolean(brandingPermissions[k]);
                return (
                  <label
                    key={item.key}
                    className={cn(
                      'flex items-center gap-2.5 p-2 rounded-control border cursor-pointer transition-colors text-xs font-medium',
                      checked
                        ? 'bg-brand/10 border-brand/40 text-foreground font-semibold'
                        : 'bg-surface-secondary border-border text-foreground-secondary hover:text-foreground'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleBrandingToggle(k)}
                      className="rounded border-border text-brand focus:ring-brand/40 w-4 h-4"
                    />
                    <span>{item.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 7. Catatan */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground border-b border-border pb-2">
              7. Catatan Analisis & Tim Internal
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-foreground-secondary mb-1.5">
                Keunggulan Venue (satu baris per butir)
              </label>
              <textarea
                rows={2}
                value={strengthsText}
                onChange={(e) => {
                  setStrengthsText(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Lokasi strategis di pusat kota&#10;Parkir mobil sangat luas&#10;Tata suara jernih"
                className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-control text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-foreground-secondary mb-1.5">
                Keterbatasan / Risiko (satu baris per butir)
              </label>
              <textarea
                rows={2}
                value={limitationsText}
                onChange={(e) => {
                  setLimitationsText(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Akses lift barang terbatas&#10;Dilarang membawa catering luar"
                className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-control text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-foreground-secondary mb-1.5">
                Target Audiens yang Relevan (pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={targetAudienceText}
                onChange={(e) => {
                  setTargetAudienceText(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Mahasiswa, Komunitas Startup, Profesional Muda"
                className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-control text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-foreground-secondary mb-1.5">
                  Catatan Internal Tim
                </label>
                <textarea
                  rows={2}
                  value={internalNotes}
                  onChange={(e) => {
                    setInternalNotes(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Catatan rahasia atau instruksi negosiasi..."
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-control text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-foreground-secondary mb-1.5">
                  PIC Internal Penanggung Jawab
                </label>
                <input
                  type="text"
                  value={internalOwner}
                  onChange={(e) => {
                    setInternalOwner(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Contoh: Rian - Event Coordinator"
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-control text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-surface rounded-b-dialog sticky bottom-0">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-border text-foreground-secondary hover:text-foreground hover:bg-surface-secondary rounded-control text-xs font-semibold transition-all disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2 bg-foreground text-surface font-semibold rounded-control text-xs hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 shadow-subtle"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
              </>
            ) : isEditMode ? (
              'Simpan Perubahan'
            ) : (
              'Tambah Venue'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
