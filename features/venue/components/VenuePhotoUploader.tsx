'use client';

import React, { useState, useRef } from 'react';
import { Upload, Sparkles, CheckCircle, AlertCircle, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { compressImageToWebP, formatByteSize, CompressionResult } from '@/lib/image-compression';
import { VenueAsset } from '@/lib/venue-types';

interface VenuePhotoUploaderProps {
  venueId: string;
  venueName: string;
  onAssetAdded: (newAsset: VenueAsset) => void;
  onCancel?: () => void;
}

export const VenuePhotoUploader: React.FC<VenuePhotoUploaderProps> = ({
  venueId,
  venueName,
  onAssetAdded,
  onCancel,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [description, setDescription] = useState('');
  const [attribution, setAttribution] = useState(`Dokumentasi ${venueName}`);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Proses file gambar: kompresi WebP instan langsung di client-side
  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Hanya berkas format gambar (JPG, PNG, HEIC, WebP) yang didukung.');
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      // Kompresi instan via HTML5 Canvas
      const result = await compressImageToWebP(file, {
        maxWidth: 1400,
        maxHeight: 1400,
        quality: 0.82,
      });

      setCompressionResult(result);
      if (!description.trim()) {
        const cleanName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
        setDescription(`Dokumentasi ${cleanName}`);
      }
    } catch (err: any) {
      console.error('Error compressing image:', err);
      setError(err.message || 'Gagal mengompresi gambar ke format WebP.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Upload file WebP yang sudah dikompresi ke server
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compressionResult) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', compressionResult.file);
      formData.append('venueId', venueId);
      formData.append('description', description.trim() || `Dokumentasi ${venueName}`);
      formData.append('altText', description.trim() || venueName);
      formData.append('attribution', attribution.trim());

      const res = await fetch('/api/venues/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menyimpan foto ke server.');
      }

      if (data.asset) {
        onAssetAdded(data.asset);
      }

      // Reset
      setCompressionResult(null);
      setDescription('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengunggah foto.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setCompressionResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onCancel) onCancel();
  };

  return (
    <div className="p-4 rounded-xl border border-brand/30 bg-surface shadow-xs space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b border-border/70 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-brand/10 text-brand">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground">Unggah &amp; Kompres Foto Venue</h4>
            <p className="text-[10px] text-foreground-muted">
              Auto-kompresi WebP instan di browser &mdash; loading ultra ringan dan hemat memori
            </p>
          </div>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={handleReset}
            className="p-1 rounded text-foreground-muted hover:text-foreground hover:bg-surface-secondary"
            title="Batal"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-status-errorBg/30 border border-status-error/30 text-status-error text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Area Dropzone & Input */}
      {!compressionResult && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-brand bg-brand/5 scale-[1.01]'
              : 'border-border hover:border-brand/50 hover:bg-surface-secondary/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/jpg"
            onChange={handleFileChange}
            className="hidden"
          />

          {isProcessing ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <Loader2 className="w-8 h-8 text-brand animate-spin" />
              <p className="text-xs font-semibold text-foreground">Memproses &amp; Mengompresi ke WebP...</p>
              <p className="text-[11px] text-foreground-muted">Mengoptimasi resolusi &amp; ukuran gambar...</p>
            </div>
          ) : (
            <>
              <div className="p-3 rounded-full bg-brand/10 text-brand">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Tarik foto ke sini atau <span className="text-brand underline">Pilih Berkas</span>
                </p>
                <p className="text-[10px] text-foreground-muted mt-1">
                  Mendukung JPG, PNG, WebP (akan otomatis dikonversi ke WebP &le; 100KB)
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Hasil Kompresi Instan & Preview */}
      {compressionResult && (
        <form onSubmit={handleUpload} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-surface-secondary/50 p-3 rounded-xl border border-border">
            {/* Thumbnail Preview */}
            <div className="relative aspect-video sm:aspect-square w-full rounded-lg overflow-hidden border border-border bg-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={compressionResult.dataUrl}
                alt="Preview WebP"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[9px] font-bold bg-brand text-white shadow-xs">
                WebP Ready
              </span>
            </div>

            {/* Statistik Kompresi */}
            <div className="sm:col-span-2 flex flex-col justify-between space-y-2 text-xs">
              <div>
                <div className="flex items-center gap-1.5 text-status-success font-bold text-xs mb-1.5">
                  <CheckCircle className="w-4 h-4" />
                  <span>Kompresi WebP Berhasil &amp; Siap Ditampilkan</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-foreground-secondary">
                  <div className="p-2 rounded bg-surface border border-border/80">
                    <span className="text-foreground-muted block text-[10px]">Ukuran Asli:</span>
                    <span className="font-semibold text-foreground">
                      {formatByteSize(compressionResult.originalSize)}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-status-successBg/40 border border-status-success/30">
                    <span className="text-status-success block text-[10px] font-medium">Ukuran WebP:</span>
                    <span className="font-bold text-status-success">
                      {formatByteSize(compressionResult.compressedSize)}
                      {compressionResult.savingsPercent > 0 && ` (-${compressionResult.savingsPercent}%)`}
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-foreground-muted mt-1.5 flex items-center gap-2">
                  <span>Dimensi: {compressionResult.width} &times; {compressionResult.height} px</span>
                  <span>&bull;</span>
                  <span>Format: image/webp</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setCompressionResult(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="text-[11px] text-foreground-muted hover:text-foreground underline"
                >
                  Ganti Foto Lain
                </button>
              </div>
            </div>
          </div>

          {/* Form Input Detail Foto */}
          <div className="space-y-2.5 text-xs">
            <div>
              <label className="block text-foreground-secondary font-medium text-[11px] mb-1">
                Keterangan / Deskripsi Foto <span className="text-status-error">*</span>
              </label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Misal: Gatra Event Space Indoor (Kapasitas 100 pax)"
                className="w-full px-3 py-2 rounded-control bg-surface border border-border text-foreground text-xs focus:outline-hidden focus:ring-1 focus:ring-brand"
              />
            </div>

            <div>
              <label className="block text-foreground-secondary font-medium text-[11px] mb-1">
                Sumber / Atribusi
              </label>
              <input
                type="text"
                value={attribution}
                onChange={(e) => setAttribution(e.target.value)}
                placeholder="Misal: Dokumentasi Resmi Venue / Pricelist 2026"
                className="w-full px-3 py-2 rounded-control bg-surface border border-border text-foreground text-xs focus:outline-hidden focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/70">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-control text-xs font-semibold text-foreground-muted hover:text-foreground hover:bg-surface-secondary"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand text-white text-xs font-bold hover:bg-brand-hover transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Menyimpan...
                </>
              ) : (
                <>
                  <ImageIcon className="w-3.5 h-3.5" /> Simpan Foto ke Galeri
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
