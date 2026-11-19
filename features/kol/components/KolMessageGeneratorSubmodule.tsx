"use client";

import React, { useState, useMemo } from "react";
import {
  MessageSquare,
  Send,
  Copy,
  Check,
  ExternalLink,
  SlidersHorizontal,
  Sparkles,
  Instagram,
  Phone,
  Package,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  RotateCcw,
} from "lucide-react";
import { Creator, MessageTone, MessageChannel, PipelineStage } from "../types";
import { MESSAGE_TEMPLATES } from "../constants";

interface KolMessageGeneratorSubmoduleProps {
  creators: Creator[];
  initialCreator?: Creator | null;
  onUpdateCreatorStage?: (creatorId: string, newStage: PipelineStage, note?: string) => void;
}

export const KolMessageGeneratorSubmodule: React.FC<KolMessageGeneratorSubmoduleProps> = ({
  creators,
  initialCreator,
  onUpdateCreatorStage,
}) => {
  // Selected creator from database or custom input
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>(initialCreator?.id || (creators[0]?.id || ""));
  const [customCreatorName, setCustomCreatorName] = useState("");
  const [customHandle, setCustomHandle] = useState("");

  // Settings
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>("A");
  const [channel, setChannel] = useState<MessageChannel>("whatsapp");
  const [tone, setTone] = useState<MessageTone>("semi_formal");

  // Custom variables
  const [productDetails, setProductDetails] = useState("1 Paket Kacamata Lengkap (Frame Pilihan + Lensa Anti-Radiasi Blue Ray)");
  const [deliverables, setDeliverables] = useState("1 Video Reels Try-On/Review + 2 Instagram Stories");
  const [campaignName, setCampaignName] = useState("Barter Launching Frame Hexagonal Pastel Q4 2026");
  const [courierReceipt, setCourierReceipt] = useState("JP9823482736 (J&T Express)");
  const [deadline, setDeadline] = useState("Sabtu, 28 November 2026");
  const [estimatedValue, setEstimatedValue] = useState("Rp 450.000");

  // Manual edited content override
  const [editedContent, setEditedContent] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [markedSent, setMarkedSent] = useState(false);

  // Active creator details
  const activeCreator = useMemo(() => {
    return creators.find((c) => c.id === selectedCreatorId);
  }, [creators, selectedCreatorId]);

  const creatorName = activeCreator?.name || customCreatorName || "Kak";
  const creatorHandle = activeCreator?.instagramHandle || customHandle || "kreator";
  const contactPhone = activeCreator?.contactWa || "087778683766";

  // Selected template object
  const activeTemplate = useMemo(() => {
    return MESSAGE_TEMPLATES.find((t) => t.key === selectedTemplateKey) || MESSAGE_TEMPLATES[0];
  }, [selectedTemplateKey]);

  // Compute generated text
  const baseText = activeTemplate.tones[tone] || activeTemplate.tones.semi_formal;

  const generatedMessage = useMemo(() => {
    if (editedContent !== null) return editedContent;

    let res = baseText;
    res = res.replace(/\[Nama\]/g, creatorName);
    res = res.replace(/\[Username\]/g, `@${creatorHandle}`);
    res = res.replace(/\[Produk\]/g, productDetails);
    res = res.replace(/\[Deliverables\]/g, deliverables);
    res = res.replace(/\[Campaign\]/g, campaignName);
    res = res.replace(/\[No Resi\]/g, courierReceipt);
    res = res.replace(/\[Ekspedisi \/ Kurir\]/g, "J&T Express Reguler");
    res = res.replace(/\[Estimasi Tiba\]/g, "1–2 hari kerja");
    res = res.replace(/\[Deadline\]/g, deadline);
    res = res.replace(/\[Estimasi Nilai\]/g, estimatedValue);

    return res;
  }, [
    baseText,
    creatorName,
    creatorHandle,
    productDetails,
    deliverables,
    campaignName,
    courierReceipt,
    deadline,
    estimatedValue,
    editedContent,
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleResetEdit = () => {
    setEditedContent(null);
  };

  const handleMarkAsSent = () => {
    if (!activeCreator || !onUpdateCreatorStage) return;

    let targetStage: PipelineStage = "message_sent";
    if (selectedTemplateKey === "B") targetStage = "waiting_response";
    else if (selectedTemplateKey === "C" || selectedTemplateKey === "D") targetStage = "collab_approved";
    else if (selectedTemplateKey === "E") targetStage = "product_prep";
    else if (selectedTemplateKey === "F") targetStage = "product_shipped";
    else if (selectedTemplateKey === "G") targetStage = "product_received";
    else if (selectedTemplateKey === "H") targetStage = "content_production";
    else if (selectedTemplateKey === "I") targetStage = "completed";

    onUpdateCreatorStage(
      activeCreator.id,
      targetStage,
      `Pesan Template ${selectedTemplateKey} (${activeTemplate.title}) dikirim via ${channel.toUpperCase()}`
    );

    setMarkedSent(true);
    setTimeout(() => setMarkedSent(false), 3000);
  };

  const getWhatsAppLink = () => {
    const cleanPhone = contactPhone.replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith("0") ? `62${cleanPhone.slice(1)}` : cleanPhone;
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(generatedMessage)}`;
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. HEADER & OPERATIONAL CONCEPT BANNER                                    */}
      {/* ========================================================================= */}
      <div className="rounded-2xl p-5 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-surface border border-emerald-500/25 shadow-subtle space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-foreground">
                AI / Smart Collaboration Message Generator (Master Plan §7)
              </h3>
              <p className="text-xs text-foreground-secondary">
                Generator pesan penawaran resmi barter kacamata via WhatsApp &amp; Instagram DM dengan gaya bahasa natural.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-500/20">
              Prinsip: Barter Kirim ke Rumah (Tanpa Visit Store)
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN 2-COLUMN WORKSPACE                                                */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Configuration & Template Chooser (5 Cols) */}
        <div className="lg:col-span-5 bg-surface border border-border rounded-2xl p-5 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground-secondary">
              1. Pilih Creator &amp; Konfigurasi
            </h4>
            <span className="text-[10px] text-foreground-muted">Sesuai SOP I See You</span>
          </div>

          {/* Select Creator from Database */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-foreground">Pilih Creator Terdaftar:</label>
            <select
              value={selectedCreatorId}
              onChange={(e) => {
                setSelectedCreatorId(e.target.value);
                setEditedContent(null);
              }}
              className="w-full px-3 py-2 rounded-xl bg-surface-secondary border border-border text-xs text-foreground font-semibold focus:ring-1 focus:ring-emerald-600"
            >
              <option value="">-- Input Bebas / Custom --</option>
              {creators.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (@{c.instagramHandle}) — {c.city} ({c.followersFormatted})
                </option>
              ))}
            </select>
          </div>

          {/* Custom Name / Handle if not selected */}
          {!selectedCreatorId && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-[10px] font-semibold text-foreground-muted">Nama Panggilan</label>
                <input
                  type="text"
                  value={customCreatorName}
                  onChange={(e) => setCustomCreatorName(e.target.value)}
                  placeholder="Misal: Siska"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-surface-secondary border border-border text-xs text-foreground"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-foreground-muted">Username IG</label>
                <input
                  type="text"
                  value={customHandle}
                  onChange={(e) => setCustomHandle(e.target.value)}
                  placeholder="Misal: siska_style"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-surface-secondary border border-border text-xs text-foreground"
                />
              </div>
            </div>
          )}

          {/* Channel & Tone Selectors */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* Channel */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-foreground">Kanal Pengiriman:</label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-surface-secondary rounded-xl border border-border">
                <button
                  type="button"
                  onClick={() => setChannel("whatsapp")}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    channel === "whatsapp"
                      ? "bg-emerald-700 text-white shadow-2xs"
                      : "text-foreground-secondary hover:text-foreground"
                  }`}
                >
                  <Phone className="w-3 h-3" />
                  <span>WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChannel("instagram_dm")}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    channel === "instagram_dm"
                      ? "bg-pink-700 text-white shadow-2xs"
                      : "text-foreground-secondary hover:text-foreground"
                  }`}
                >
                  <Instagram className="w-3 h-3" />
                  <span>DM IG</span>
                </button>
              </div>
            </div>

            {/* Tone */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-foreground">Gaya Bahasa (Tone):</label>
              <select
                value={tone}
                onChange={(e) => {
                  setTone(e.target.value as MessageTone);
                  setEditedContent(null);
                }}
                className="w-full px-3 py-2 rounded-xl bg-surface-secondary border border-border text-xs text-foreground font-semibold focus:ring-1 focus:ring-emerald-600"
              >
                <option value="semi_formal">Semi-Formal (Ramah &amp; Profesional)</option>
                <option value="formal">Formal (Sopan &amp; Elegan)</option>
                <option value="casual">Casual (Akrab &amp; Santai)</option>
              </select>
            </div>
          </div>

          {/* 9 Templates A-I Vertical Chooser */}
          <div className="space-y-1.5 pt-2">
            <label className="text-[11px] font-bold text-foreground">Pilih Template Alur Kolaborasi:</label>
            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 no-scrollbar border border-border rounded-xl p-2 bg-surface-secondary/30">
              {MESSAGE_TEMPLATES.map((tpl) => (
                <div
                  key={tpl.key}
                  onClick={() => {
                    setSelectedTemplateKey(tpl.key);
                    setEditedContent(null);
                  }}
                  className={`p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                    selectedTemplateKey === tpl.key
                      ? "bg-emerald-600/10 border-emerald-500 text-foreground font-bold shadow-2xs"
                      : "bg-surface border-border/70 text-foreground-secondary hover:bg-surface-secondary hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{tpl.title}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-surface-secondary text-foreground-muted uppercase font-bold">
                      {tpl.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Inputs Accordion */}
          <div className="space-y-2 pt-2 border-t border-border">
            <span className="text-[11px] font-bold text-foreground block">Detail Barter &amp; Deliverables:</span>

            <div className="space-y-1.5 text-xs">
              <div>
                <label className="text-[10px] text-foreground-muted block">Paket Produk Barter</label>
                <input
                  type="text"
                  value={productDetails}
                  onChange={(e) => {
                    setProductDetails(e.target.value);
                    setEditedContent(null);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-surface-secondary border border-border text-xs text-foreground"
                />
              </div>

              <div>
                <label className="text-[10px] text-foreground-muted block">Deliverables Konten</label>
                <input
                  type="text"
                  value={deliverables}
                  onChange={(e) => {
                    setDeliverables(e.target.value);
                    setEditedContent(null);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-surface-secondary border border-border text-xs text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-foreground-muted block">Nama Campaign</label>
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => {
                      setCampaignName(e.target.value);
                      setEditedContent(null);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface-secondary border border-border text-xs text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-foreground-muted block">Estimasi Nilai Barter</label>
                  <input
                    type="text"
                    value={estimatedValue}
                    onChange={(e) => {
                      setEstimatedValue(e.target.value);
                      setEditedContent(null);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface-secondary border border-border text-xs text-foreground"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Message Preview & Instant Send/Copy (7 Cols) */}
        <div className="lg:col-span-7 bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-subtle space-y-4 flex flex-col justify-between min-h-[520px]">
          <div className="space-y-3">
            {/* Header Preview & Badges */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  2. Preview Pesan Siap Kirim ({channel === "whatsapp" ? "WhatsApp" : "Instagram DM"})
                </h4>
              </div>

              <div className="flex items-center gap-2">
                {editedContent !== null && (
                  <button
                    type="button"
                    onClick={handleResetEdit}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 hover:underline"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Format Asli</span>
                  </button>
                )}
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                  {tone === "semi_formal" ? "Semi-Formal" : tone === "formal" ? "Formal" : "Casual"}
                </span>
              </div>
            </div>

            {/* Target Creator Mini Banner */}
            <div className="p-3 rounded-xl bg-surface-secondary/70 border border-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">{creatorName}</span>
                <span className="text-foreground-muted">(@{creatorHandle})</span>
                {activeCreator && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface border border-border text-foreground-secondary">
                    {activeCreator.city}
                  </span>
                )}
              </div>
              <div className="text-[11px] font-mono text-foreground-muted">
                Kontak WA: {contactPhone}
              </div>
            </div>

            {/* Live Message Editable Textarea */}
            <div className="relative">
              <textarea
                rows={14}
                value={generatedMessage}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-4 rounded-xl bg-surface-secondary/40 border border-border text-xs text-foreground font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all resize-y"
                placeholder="Pesan kolaborasi..."
              />
              <span className="absolute right-3 bottom-3 text-[10px] text-foreground-muted">
                Bisa diedit manual sebelum disalin
              </span>
            </div>
          </div>

          {/* Action Buttons Bar */}
          <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-subtle ${
                copied
                  ? "bg-emerald-700 text-white"
                  : "bg-surface-secondary hover:bg-border text-foreground border border-border"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Tersalin ke Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-foreground-muted" />
                  <span>Salin Pesan ke Clipboard</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Mark as Sent button */}
              {activeCreator && onUpdateCreatorStage && (
                <button
                  type="button"
                  onClick={handleMarkAsSent}
                  className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    markedSent
                      ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border-emerald-500"
                      : "bg-surface hover:bg-surface-secondary text-foreground border-border"
                  }`}
                  title="Pindahkan status creator di pipeline otomatis"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{markedSent ? "Status Diperbarui!" : "Tandai Terkirim"}</span>
                </button>
              )}

              {/* Direct WhatsApp Web Launch */}
              {channel === "whatsapp" ? (
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Buka WhatsApp Web</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              ) : (
                <a
                  href={activeCreator?.instagramUrl || `https://www.instagram.com/${creatorHandle}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-pink-700 hover:bg-pink-600 text-white font-bold text-xs transition-all shadow-md active:scale-95"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Buka Profil Instagram</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
