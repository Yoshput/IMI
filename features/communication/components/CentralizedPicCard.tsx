"use client";

import React, { useState } from "react";
import {
  Phone,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { MODEL_PRIMARY_PIC } from "@/lib/communication-templates-data";

export const CentralizedPicCard: React.FC = () => {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(MODEL_PRIMARY_PIC.phoneDisplay);
    setCopiedPhone(true);

    // Trigger global dashboard toast feedback
    window.dispatchEvent(
      new CustomEvent("app-toast", {
        detail: {
          title: "Nomor WhatsApp Disalin",
          message: `${MODEL_PRIMARY_PIC.phoneDisplay} (${MODEL_PRIMARY_PIC.name}) berhasil disalin ke clipboard.`,
          type: "success",
        },
      })
    );

    setTimeout(() => setCopiedPhone(false), 2500);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/90 via-[#124734] to-emerald-950 text-white p-5 sm:p-6 shadow-warm border border-emerald-500/30">
      {/* Decorative ambient backdrop */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Identity & Badges */}
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
              <ShieldCheck className="w-3 h-3 text-emerald-300" />
              PIC Utama Model Recruitment
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-200/80">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Satu Pintu Koordinasi Talent
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
              {MODEL_PRIMARY_PIC.name}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 font-medium mt-0.5">
              {MODEL_PRIMARY_PIC.role} – {MODEL_PRIMARY_PIC.organization}
            </p>
          </div>

          {/* Centralized rule callout */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-black/25 border border-emerald-400/20 text-emerald-100 text-xs leading-relaxed">
            <UserCheck className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
            <p>
              <strong>Aturan Utama:</strong> {MODEL_PRIMARY_PIC.note}
            </p>
          </div>
        </div>

        {/* Right: Contact Information & Interactive Action Buttons */}
        <div className="flex flex-col sm:items-end justify-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/30 border border-emerald-400/30 w-fit">
            <Phone className="w-4 h-4 text-emerald-300" />
            <span className="font-mono text-base sm:text-lg font-bold tracking-wider text-white">
              {MODEL_PRIMARY_PIC.phoneDisplay}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 1. Salin Nomor WhatsApp */}
            <button
              type="button"
              onClick={handleCopyPhone}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/25 text-white font-bold text-xs border border-white/20 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              {copiedPhone ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="text-emerald-200">Nomor Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-white" />
                  <span>SALIN NOMOR WHATSAPP</span>
                </>
              )}
            </button>

            {/* 2. Hubungi PIC */}
            <a
              href={MODEL_PRIMARY_PIC.waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>HUBUNGI PIC</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </div>

          {/* SOP Guidelines Toggle */}
          <button
            type="button"
            onClick={() => setShowGuidelines(!showGuidelines)}
            className="text-[11px] text-emerald-200/80 hover:text-white underline underline-offset-2 transition-colors self-start sm:self-end mt-1 cursor-pointer"
          >
            {showGuidelines ? "Tutup SOP Operasional Staff" : "Lihat Batasan SOP Staff Marketing"}
          </button>
        </div>
      </div>

      {/* Collapsible SOP Guidelines for Marketing Staff */}
      {showGuidelines && (
        <div className="mt-5 pt-4 border-t border-emerald-500/20 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs animate-in fade-in duration-200">
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-400/20">
            <h4 className="font-bold text-emerald-200 flex items-center gap-1.5 mb-2">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Yang Boleh Dilakukan Staff:
            </h4>
            <ul className="space-y-1.5 text-emerald-100/90 list-disc list-inside">
              {MODEL_PRIMARY_PIC.rulesForStaff.allowed.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/20">
            <h4 className="font-bold text-rose-200 flex items-center gap-1.5 mb-2">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              Larangan Keras Staff (Hanya Wewenang PIC):
            </h4>
            <ul className="space-y-1.5 text-rose-100/90 list-disc list-inside">
              {MODEL_PRIMARY_PIC.rulesForStaff.forbidden.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
