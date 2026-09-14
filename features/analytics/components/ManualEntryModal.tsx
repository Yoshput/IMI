"use client";

import React, { useState } from "react";
import { MetricRecord, DataSource } from "@/types";
import { X, PlusCircle, CheckCircle } from "lucide-react";

interface ManualEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecord: (record: MetricRecord) => void;
}

export const ManualEntryModal: React.FC<ManualEntryModalProps> = ({
  isOpen,
  onClose,
  onAddRecord,
}) => {
  const [metricKey, setMetricKey] = useState("weekly_reach");
  const [label, setLabel] = useState("Weekly Account Reach");
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("akun");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [source, setSource] = useState<DataSource>("manual");
  const [sourceLabel, setSourceLabel] = useState("Manual Entry oleh Tim Konten");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleMetricChange = (key: string) => {
    setMetricKey(key);
    switch (key) {
      case "weekly_reach":
        setLabel("Weekly Account Reach");
        setUnit("akun unik");
        break;
      case "followers":
        setLabel("Total Followers");
        setUnit("akun");
        break;
      case "engagement":
        setLabel("Total Content Interactions");
        setUnit("interaksi");
        break;
      case "inbound_dm":
        setLabel("Inbound DM Pertanyaan Produk");
        setUnit("pesan");
        break;
      case "save_rate":
        setLabel("Avg Save Rate");
        setUnit("%");
        break;
      default:
        setLabel("Custom Metric");
        setUnit("satuan");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue <= 0) {
      setErrorMessage("Mohon masukkan angka metrik yang valid dan lebih besar dari 0.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newRecord: MetricRecord = {
        id: `m-manual-${Date.now()}`,
        key: metricKey,
        label,
        value: numericValue,
        unit,
        date,
        source,
        sourceLabel: source === "manual" ? "Manual Log Form" : "Instagram Insights (Manual Sync)",
        isDemo: false,
        notes: notes.trim() || "Pencatatan manual rutin oleh tim konten Optik I See You",
      };

      onAddRecord(newRecord);
      setIsSubmitting(false);
      setSuccessNotice(true);

      setTimeout(() => {
        setSuccessNotice(false);
        onClose();
        setValue("");
        setNotes("");
      }, 900);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-dialog bg-surface border border-border shadow-elevated overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface-secondary">
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Catat Metrik Baru (Manual Entry)
            </h3>
            <p className="text-[11px] text-foreground-secondary mt-0.5">
              Data dicatat ke audit log tanpa menghapus riwayat historis sebelumnya (AGENT §07).
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-control text-foreground-muted hover:text-foreground hover:bg-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-control bg-status-errorBg border border-status-error/30 text-status-error">
              {errorMessage}
            </div>
          )}

          {successNotice && (
            <div className="p-3 rounded-control bg-status-successBg border border-status-success/30 text-status-success flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Metrik berhasil dicatat ke dalam sistem log!</span>
            </div>
          )}

          {/* Metric Selector */}
          <div>
            <label className="font-semibold text-foreground block mb-1">
              Pilih Jenis Metrik
            </label>
            <select
              value={metricKey}
              onChange={(e) => handleMetricChange(e.target.value)}
              className="w-full px-3 py-2 rounded-control bg-surface border border-border text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="weekly_reach">Weekly Account Reach (Jangkauan Akun)</option>
              <option value="followers">Total Followers Instagram</option>
              <option value="engagement">Total Interaksi (Likes + Saves + Comments)</option>
              <option value="inbound_dm">Jumlah DM Pertanyaan Produk / Alamat</option>
              <option value="save_rate">Rata-rata Save Rate Konten (%)</option>
            </select>
          </div>

          {/* Value & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-foreground block mb-1">
                Nilai Metrik ({unit})
              </label>
              <input
                type="number"
                step="any"
                required
                placeholder="Contoh: 15200"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3 py-2 rounded-control bg-surface border border-border text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">
                Tanggal Pengamatan
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-control bg-surface border border-border text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>

          {/* Source Selector */}
          <div>
            <label className="font-semibold text-foreground block mb-1">
              Sumber Data (Provenance)
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as DataSource)}
              className="w-full px-3 py-2 rounded-control bg-surface border border-border text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="manual">Manual Entry (Pencatatan langsung tim konten)</option>
              <option value="instagram_insights">Instagram Insights App (Salin dari dashboard IG)</option>
              <option value="csv_import">Export / File Spreadsheet</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="font-semibold text-foreground block mb-1">
              Catatan Konteks (Penyebab Naik/Turun)
            </label>
            <textarea
              rows={3}
              placeholder="Contoh: Lonjakan reach setelah video edukasi lensa diposting jam 19.00 WIB."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-control bg-surface border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-control text-foreground-secondary hover:text-foreground hover:bg-surface-secondary transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-control bg-brand text-white font-semibold hover:bg-brand-hover transition-colors disabled:opacity-50"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Menyimpan..." : "Simpan ke History"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
