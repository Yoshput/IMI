"use client";

import React, { useState, useEffect } from "react";
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
  History,
  FileText,
  Eye,
  ExternalLink,
  Copy,
  Star,
  Globe,
  MessageSquare,
} from "lucide-react";
import {
  CustomerAftersalesRecord,
  FollowUpStatus,
  AFTERSALES_CS_PHONE,
  AFTERSALES_CS_WA_URL,
} from "@/lib/aftersales";

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
  const [selectedTemplate, setSelectedTemplate] = useState<"kenyamanan" | "google_maps" | "garansi">("kenyamanan");
  const [customMessage, setCustomMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // Link Google Maps per branch
  const branchMapsLinks: Record<string, string> = {
    PWT: "https://maps.app.goo.gl/OptikISeeYouPurwokerto",
    CLP: "https://maps.app.goo.gl/OptikISeeYouCilacap",
    PBG: "https://maps.app.goo.gl/OptikISeeYouPurbalingga",
    WNS: "https://maps.app.goo.gl/OptikISeeYouWonosobo",
    TGL: "https://maps.app.goo.gl/LunarEyewearTegal",
  };

  const currentMapLink = branchMapsLinks[customer.branchKey] || "https://maps.google.com/?q=Optik+I+See+You";

  // Template generation
  useEffect(() => {
    const isLunarTegal =
      customer.branchKey === "TGL" ||
      customer.city.toLowerCase().includes("tegal") ||
      customer.branch.toLowerCase().includes("lunar");

    const brandName = isLunarTegal ? "Lunar Eyewear Tegal" : `Optik I See You Cabang ${customer.city}`;
    const brandShort = isLunarTegal ? "Lunar Eyewear" : "Optik I See You";

    let msg = "";
    if (selectedTemplate === "kenyamanan") {
      msg = isLunarTegal
        ? `Selamat siang Kak ${customer.name}, salam hangat dari Tim Layanan Pelanggan Lunar Eyewear Tegal.

Semoga Kak ${customer.name} senantiasa dalam keadaan sehat dan lancar aktivitasnya.

Menindaklanjuti pengambilan kacamata pada tanggal ${customer.pickupDate} kemarin:
• Model Frame: ${customer.frameModel}
• Jenis Lensa: ${customer.lensType}

Kami ingin menanyakan pengalaman dan kenyamanan Kakak selama menggunakan kacamata tersebut:
1. Apakah posisi frame terasa pas di wajah, hidung, dan telinga (tidak terasa menekan atau melorot)?
2. Apakah adaptasi lensa sudah jernih dan nyaman untuk penglihatan harian?

Apabila dirasa kurang pas atau membutuhkan penyetelan ulang (re-fitting frame), silakan mampir langsung ke store Lunar Eyewear Tegal (Jl. Werkudoro, Ruko Langon Square No. 2, Tegal Timur). Layanan stel kacamata dan pembersihan lensa tersedia gratis untuk Kakak.

Boleh luangkan waktu 1 menit untuk membalas pesan ini ya Kak? Masukan dari Kakak sangat berharga untuk peningkatan pelayanan kami.

Terima kasih banyak atas kepercayaan Kak ${customer.name} kepada Lunar Eyewear Tegal.`
        : `Selamat siang Kak ${customer.name}, salam hangat dari Tim Layanan Pelanggan Optik I See You Cabang ${customer.city}.

Semoga Kak ${customer.name} senantiasa dalam keadaan sehat dan lancar aktivitasnya.

Menindaklanjuti pengambilan kacamata pada tanggal ${customer.pickupDate} kemarin:
• Model Frame: ${customer.frameModel}
• Jenis Lensa: ${customer.lensType}

Kami ingin menanyakan pengalaman dan kenyamanan Kakak selama menggunakan kacamata tersebut:
1. Apakah posisi frame terasa pas di wajah, hidung, dan telinga (tidak terasa menekan atau melorot)?
2. Apakah adaptasi lensa sudah jernih dan nyaman untuk melihat jarak jauh maupun membaca?

Apabila dirasa kurang pas atau membutuhkan penyetelan ulang (re-fitting frame), silakan mampir langsung ke store Optik I See You ${customer.city}. Layanan stel kacamata dan pembersihan lensa tersedia gratis selamanya untuk Kakak.

Boleh luangkan waktu 1 menit untuk membalas pesan ini ya Kak? Masukan dari Kakak sangat berharga agar kami dapat terus memberikan pelayanan terbaik.

Informasi pemeriksaan mata berkala 4 cabang resmi dapat dicek melalui website:
https://optikiseeyou.com

Terima kasih banyak atas kepercayaan Kak ${customer.name} kepada Optik I See You.`;
    } else if (selectedTemplate === "google_maps") {
      msg = isLunarTegal
        ? `Halo Kak ${customer.name}, terima kasih banyak telah mempercayakan pembuatan kacamata ${customer.frameModel} di Lunar Eyewear Tegal.

Bagaimana kacamata dan lensa ${customer.lensType}-nya sejauh ini Kak? Semoga selalu nyaman menemani aktivitas harian.

Jika Kakak merasa puas dengan hasil kacamata dan keramahan staf kami, kami akan sangat berterima kasih apabila Kakak berkenan meluangkan 1 menit untuk memberikan ulasan bintang 5 di Google Maps resmi Lunar Eyewear Tegal:
${currentMapLink}

Setiap ulasan dari Kak ${customer.name} sangat berarti bagi tim kami untuk terus bersemangat menghadirkan eyewear terbaik di Kota Tegal.

Apabila ada kendala dudukan frame atau ingin konsultasi, silakan hubungi WhatsApp CS Layanan Pelanggan kami di ${AFTERSALES_CS_PHONE}.

Terima kasih banyak atas dukungan dan kepercayaannya ya Kak. Sehat selalu.`
        : `Halo Kak ${customer.name}, terima kasih banyak telah mempercayakan pembuatan kacamata ${customer.frameModel} di Optik I See You Cabang ${customer.city}.

Bagaimana kacamata dan lensa ${customer.lensType}-nya sejauh ini Kak? Semoga selalu nyaman menemani aktivitas harian.

Jika Kakak merasa puas dengan hasil kacamata dan keramahan staf kami, kami akan sangat berterima kasih apabila Kakak berkenan meluangkan 1 menit untuk memberikan ulasan bintang 5 serta sedikit kesan di Google Maps resmi kami:
${currentMapLink}

Setiap ulasan dari Kak ${customer.name} sangat berarti bagi tim kami untuk terus bersemangat memberikan pelayanan prima bagi masyarakat ${customer.city}.

Kakak juga dapat mendaftarkan rekan atau keluarga untuk booking antrian cek mata gratis tanpa antri di:
https://optikiseeyou.com/booking-antrian

Untuk bantuan atau layanan garansi, WhatsApp CS Aftersales kami selalu aktif di ${AFTERSALES_CS_PHONE}.

Terima kasih banyak atas dukungan dan kepercayaannya ya Kak. Sehat selalu.`;
    } else {
      msg = isLunarTegal
        ? `Selamat siang Kak ${customer.name}, kami dari Tim Aftersales dan Jaminan Mutu Lunar Eyewear Tegal.

Mengingatkan kembali bahwa kacamata ${customer.frameModel} dengan lensa ${customer.lensType} yang Kakak ambil pada ${customer.pickupDate} dilindungi oleh fasilitas Garansi Lunar Eyewear:
- Garansi penyetelan frame & nosepad gratis
- Garansi pembersihan berkala di store
- Konsultasi kenyamanan penglihatan

Apakah saat ini ada kendala pada dudukan frame atau kenyamanan pandangan mata Kakak?

Store Lunar Eyewear Tegal:
Jl. Werkudoro, Ruko Langon Square No. 2, Tegal Timur
Kontak WhatsApp CS: ${AFTERSALES_CS_PHONE}

Silakan balas pesan ini apabila ada yang bisa kami bantu ya Kak. Terima kasih banyak.`
        : `Selamat siang Kak ${customer.name}, kami dari Tim Aftersales dan Jaminan Mutu Optik I See You Cabang ${customer.city}.

Mengingatkan kembali bahwa kacamata ${customer.frameModel} dengan lensa ${customer.lensType} yang Kakak ambil pada ${customer.pickupDate} dilindungi oleh fasilitas Garansi Resmi Optik I See You:
- Garansi penyetelan frame & nosepad gratis selamanya
- Garansi pembersihan ultrasonik berkala di seluruh cabang
- Konsultasi perkembangan refraksi penglihatan

Apakah saat ini ada kendala pada dudukan frame atau kenyamanan pandangan mata Kakak?

Layanan CS & Garansi Aftersales: ${AFTERSALES_CS_PHONE}
Cek info cabang resmi: https://optikiseeyou.com

Silakan balas pesan ini apabila ada yang bisa kami bantu ya Kak. Terima kasih banyak.`;
    }

    setCustomMessage(msg);
  }, [selectedTemplate, customer, currentMapLink]);

  const handleCopy = () => {
    navigator.clipboard.writeText(customMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          {/* WhatsApp Professional Composer Section */}
          <div className="p-4 rounded-xl bg-surface-secondary/40 border border-border space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/70 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-foreground">
                  Draft Pesan WhatsApp Follow-up & Review
                </span>
              </div>

              {/* Template Selector Pills */}
              <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
                <button
                  onClick={() => setSelectedTemplate("kenyamanan")}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    selectedTemplate === "kenyamanan"
                      ? "bg-emerald-600 text-white shadow-subtle"
                      : "bg-surface border border-border text-foreground-secondary hover:text-foreground"
                  }`}
                >
                  1. Cek Frame & Lensa
                </button>
                <button
                  onClick={() => setSelectedTemplate("google_maps")}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    selectedTemplate === "google_maps"
                      ? "bg-emerald-600 text-white shadow-subtle"
                      : "bg-surface border border-border text-foreground-secondary hover:text-foreground"
                  }`}
                >
                  2. Review Google Maps
                </button>
                <button
                  onClick={() => setSelectedTemplate("garansi")}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    selectedTemplate === "garansi"
                      ? "bg-emerald-600 text-white shadow-subtle"
                      : "bg-surface border border-border text-foreground-secondary hover:text-foreground"
                  }`}
                >
                  3. Garansi & Web
                </button>
              </div>
            </div>

            {/* Editable Message Preview */}
            <div>
              <textarea
                rows={7}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full p-3 rounded-lg bg-surface border border-border text-xs text-foreground font-sans leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1.5 text-[10px] text-foreground-muted">
                <Globe className="w-3 h-3 text-brand" />
                <span>Termasuk link web optikiseeyou.com & link review Google Maps cabang</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold text-foreground-secondary hover:text-foreground hover:bg-surface-secondary transition-all"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-foreground-muted" />
                      <span>Salin Pesan</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://wa.me/${customer.phone}?text=${encodeURIComponent(customMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all shadow-subtle text-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Buka Chat WhatsApp</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>
            </div>
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
                <Eye className="w-4 h-4 text-brand shrink-0" />
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
                <option value="belum_dihubungi">Belum Dihubungi</option>
                <option value="sudah_dihubungi">Sudah Dihubungi (Merespon)</option>
                <option value="selesai_puas">Selesai (Puas / Bintang 5)</option>
                <option value="butuh_garansi">Perlu Garansi / Re-fitting</option>
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
                Tambah Log Interaksi Baru:
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
