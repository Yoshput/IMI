"use client";

import React, { useState } from "react";
import {
  X,
  User,
  Phone,
  Glasses,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  Send,
  ShieldAlert,
  Sparkles,
  History,
  FileText,
  Eye,
  ExternalLink,
} from "lucide-react";
import { CustomerAftersalesRecord, FollowUpStatus } from "@/lib/aftersales";

interface CustomerDetailModalProps {
  customer: CustomerAftersalesRecord;
  onClose: () => void;
  onUpdateCustomer: (updated: CustomerAftersalesRecord) => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  onClose,
  onUpdateCustomer,
}) => {
  const [status, setStatus] = useState<FollowUpStatus>(customer.status);
  const [notes, setNotes] = useState(customer.notes);
  const [newNoteInput, setNewNoteInput] = useState("");
  const [saving, setSaving] = useState(false);

  const getWaMessage = () => {
    return encodeURIComponent(
      `Halo Kak ${customer.name}, perkenalkan kami dari Tim Layanan Pelanggan Optik I See You Cabang ${customer.city}.\n\n` +
      `Bagaimana kenyamanan kacamata ${customer.frameModel} dengan lensa ${customer.lensType} yang diambil tanggal ${customer.pickupDate} kemarin? Apakah pandangan sudah nyaman dan pas digunakan? 😊\n\n` +
      `Jika butuh penyetelan kacamata (re-fitting frame) atau ada kendala, silakan mampir langsung ke store kami ya Kak. Layanan gratis selamanya! ✨`
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/aftersales", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: customer.id,
          status,
          notes,
          newLog: newNoteInput.trim()
            ? {
                type: "whatsapp_message",
                actor: "CS Aftersales",
                note: newNoteInput.trim(),
              }
            : undefined,
        }),
      });
      const result = await res.json();
      if (result.success && result.data) {
        onUpdateCustomer(result.data);
        setNewNoteInput("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-surface border border-border rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-elevated flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-border flex items-start justify-between sticky top-0 bg-surface/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-light text-brand flex items-center justify-center font-bold text-sm">
              {customer.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">{customer.name}</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-surface-secondary border border-border text-foreground-secondary">
                  {customer.city}
                </span>
              </div>
              <p className="text-xs text-foreground-muted flex items-center gap-2 mt-0.5">
                <span>{customer.phone}</span>
                <span>·</span>
                <span className="capitalize">Channel: {customer.inquiryChannel.replace(/_/g, " ")}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-secondary transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 flex-1">
          {/* Action Quick Bar: WhatsApp Direct Link */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Follow-up kacamata & kepuasan customer langsung via WhatsApp resmi</span>
            </div>
            <a
              href={`https://wa.me/${customer.phone}?text=${getWaMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all shadow-subtle text-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Chat WhatsApp</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>

          {/* Resep Kacamata (Optical Prescription Details) */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-brand" />
              Resep Pemeriksaan Mata (Refraksi)
            </h3>
            <div className="border border-border rounded-xl overflow-hidden text-xs">
              <table className="w-full text-center">
                <thead className="bg-surface-secondary text-foreground-secondary text-[10px] uppercase border-b border-border">
                  <tr>
                    <th className="py-2 px-3 text-left">Mata</th>
                    <th className="py-2 px-3">Sferis (SPH)</th>
                    <th className="py-2 px-3">Silinder (CYL)</th>
                    <th className="py-2 px-3">Axis</th>
                    <th className="py-2 px-3">Add (Baca)</th>
                    <th className="py-2 px-3">PD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-foreground tabular-nums font-mono">
                  <tr>
                    <td className="py-2.5 px-3 text-left font-sans font-semibold text-foreground-secondary">
                      Kanan (OD)
                    </td>
                    <td className="py-2.5 px-3 font-bold">{customer.prescription.odSph}</td>
                    <td className="py-2.5 px-3">{customer.prescription.odCyl}</td>
                    <td className="py-2.5 px-3">{customer.prescription.odAxis ? `${customer.prescription.odAxis}°` : "–"}</td>
                    <td className="py-2.5 px-3">{customer.prescription.add || "–"}</td>
                    <td className="py-2.5 px-3 row-span-2 align-middle font-sans font-medium text-foreground-secondary">
                      {customer.prescription.pd} mm
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-left font-sans font-semibold text-foreground-secondary">
                      Kiri (OS)
                    </td>
                    <td className="py-2.5 px-3 font-bold">{customer.prescription.osSph}</td>
                    <td className="py-2.5 px-3">{customer.prescription.osCyl}</td>
                    <td className="py-2.5 px-3">{customer.prescription.osAxis ? `${customer.prescription.osAxis}°` : "–"}</td>
                    <td className="py-2.5 px-3">{customer.prescription.add || "–"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Kacamata & Lensa Dibeli */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-border bg-surface-secondary/30 space-y-1">
              <span className="text-[10px] text-foreground-muted block font-semibold uppercase tracking-wider">
                Model Frame Kacamata
              </span>
              <p className="font-bold text-foreground text-sm flex items-center gap-1.5">
                <Glasses className="w-4 h-4 text-brand shrink-0" />
                {customer.frameModel}
              </p>
              <span className="text-[11px] text-foreground-muted block">
                Total Transaksi: Rp {customer.totalTransaction.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-surface-secondary/30 space-y-1">
              <span className="text-[10px] text-foreground-muted block font-semibold uppercase tracking-wider">
                Spesifikasi Lensa
              </span>
              <p className="font-bold text-foreground text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
                {customer.lensType}
              </p>
              <span className="text-[11px] text-foreground-muted block">
                Tgl Periksa: {customer.examDate} · Diambil: {customer.pickupDate}
              </span>
            </div>
          </div>

          {/* Status Follow-up & Editable Notes */}
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label className="text-xs font-bold text-foreground">
                Status Layanan Aftersales:
              </label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="belum_dihubungi">⏳ Belum Dihubungi</option>
                <option value="sudah_dihubungi">💬 Sudah Dihubungi (Respon)</option>
                <option value="selesai_puas">✅ Selesai (Puas / Bintang 5)</option>
                <option value="butuh_garansi">⚠️ Perlu Garansi / Re-fitting</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Catatan Keluhan / Kepuasan Customer:
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Tambah Log Interaksi Baru (misal hasil telepon/chat hari ini):
              </label>
              <input
                type="text"
                placeholder="Tulis catatan tindak lanjut..."
                value={newNoteInput}
                onChange={(e) => setNewNoteInput(e.target.value)}
                className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>

          {/* Timeline Riwayat Interaksi */}
          <div className="space-y-2 pt-2 border-t border-border">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-foreground-muted" />
              Riwayat Interaksi & Jejak Aktivitas Customer
            </h3>
            <div className="space-y-2">
              {customer.logs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-lg border border-border/80 bg-surface-secondary/20 text-xs flex items-start gap-2.5"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-brand mt-1.5 shrink-0" />
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between text-[10px] text-foreground-muted">
                      <span className="font-semibold text-foreground">{log.actor}</span>
                      <span className="tabular-nums">{log.date}</span>
                    </div>
                    <p className="text-foreground-secondary">{log.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary/20 flex items-center justify-end gap-2 sticky bottom-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-surface transition-all"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-foreground text-surface text-xs font-semibold hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
};
