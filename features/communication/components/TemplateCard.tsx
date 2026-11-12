"use client";

import React, { useState, useMemo } from "react";
import {
  Copy,
  Check,
  Edit3,
  RotateCcw,
  Send,
  MessageCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sliders,
  Sparkles,
  Info,
} from "lucide-react";
import {
  CommunicationTemplate,
  applyPlaceholdersToText,
  generateWhatsAppShareUrl,
  MODEL_PRIMARY_PIC,
} from "@/lib/communication-templates-data";

interface TemplateCardProps {
  template: CommunicationTemplate;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Initialize placeholder state if any
  const initialPlaceholderValues = useMemo(() => {
    const vals: Record<string, string> = {};
    template.placeholders?.forEach((p) => {
      vals[p.key] = p.defaultValue;
    });
    return vals;
  }, [template.placeholders]);

  const [placeholderValues, setPlaceholderValues] = useState<Record<string, string>>(
    initialPlaceholderValues
  );

  // Custom text override (if user directly modified the textarea)
  const [customText, setCustomText] = useState<string>("");
  const [isDirectTextModified, setIsDirectTextModified] = useState(false);

  // Compute active text to display and copy
  const activeText = useMemo(() => {
    if (isDirectTextModified && customText) {
      return customText;
    }
    if (template.placeholders && template.placeholders.length > 0) {
      return applyPlaceholdersToText(template.content, placeholderValues);
    }
    return template.content;
  }, [template.content, template.placeholders, placeholderValues, isDirectTextModified, customText]);

  // Handle Copy Template
  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);

    // Global toast event as required by design system
    window.dispatchEvent(
      new CustomEvent("app-toast", {
        detail: {
          title: "Template berhasil disalin.",
          message: `"${template.title}" siap ditempel di WhatsApp.`,
          type: "success",
        },
      })
    );

    setTimeout(() => setCopied(false), 2400);
  };

  // Handle Placeholder Change
  const handlePlaceholderChange = (key: string, value: string) => {
    const updated = { ...placeholderValues, [key]: value };
    setPlaceholderValues(updated);
    setIsDirectTextModified(false);
    setCustomText("");
  };

  // Handle Reset to Default
  const handleReset = () => {
    setPlaceholderValues(initialPlaceholderValues);
    setIsDirectTextModified(false);
    setCustomText("");
  };

  // WhatsApp Share URL
  const waShareUrl = useMemo(() => {
    return generateWhatsAppShareUrl(activeText);
  }, [activeText]);

  const isModelTemplate = template.category === "model";

  return (
    <div
      className={`relative flex flex-col rounded-2xl bg-surface border transition-all duration-200 shadow-subtle hover:shadow-elevated ${
        isEditing
          ? "border-emerald-600/50 ring-1 ring-emerald-500/20"
          : "border-border hover:border-emerald-700/30 dark:hover:border-emerald-500/30"
      }`}
    >
      {/* Top Meta Bar */}
      <div className="p-4 sm:p-5 border-b border-border/70 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800">
              {template.templateNumber}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                template.category === "model"
                  ? "bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60"
                  : template.subcategory === "partnership"
                  ? "bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60"
                  : "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60"
              }`}
            >
              {template.badge}
            </span>
          </div>

          {template.placeholders && template.placeholders.length > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <Sliders className="w-2.5 h-2.5" />
              Placeholder Aktif
            </span>
          )}
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
            {template.title}
          </h3>
          <p className="text-xs text-foreground-secondary mt-1 leading-relaxed">
            {template.description}
          </p>
        </div>
      </div>

      {/* Message Preview or Editor Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
        {!isEditing ? (
          /* Static Preview Box */
          <div className="relative group">
            <div className="p-3.5 sm:p-4 rounded-xl bg-surface-secondary/70 dark:bg-black/30 border border-border/80 font-sans text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-line select-text">
              {activeText}
            </div>

            {/* Hint overlay */}
            <div className="flex items-center justify-between text-[11px] text-foreground-muted mt-2 px-1">
              <span>{activeText.split("\n").length} baris pesan · Siap kirim</span>
              {isModelTemplate && (
                <span className="text-purple-700 dark:text-purple-300 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Mengarahkan ke PIC Yossika
                </span>
              )}
            </div>
          </div>
        ) : (
          /* Interactive Edit Before Copy Mode */
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Quick Placeholder Inputs (if available) */}
            {template.placeholders && template.placeholders.length > 0 && (
              <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <Sliders className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    Kustomisasi Placeholder:
                  </span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-[10px] text-foreground-muted hover:text-foreground flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    Reset Default
                  </button>
                </div>

                <div className="space-y-2.5">
                  {template.placeholders.map((p) => {
                    if (p.type === "select" && p.options) {
                      return (
                        <div key={p.key} className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <label className="text-[11px] font-semibold text-foreground-secondary w-36 shrink-0">
                            {p.label}:
                          </label>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {p.options.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => handlePlaceholderChange(p.key, opt)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                                  placeholderValues[p.key] === opt
                                    ? "bg-[#124734] text-white shadow-xs"
                                    : "bg-surface border border-border text-foreground hover:bg-surface-secondary"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={p.key} className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                        <label className="text-[11px] font-semibold text-foreground-secondary w-36 shrink-0">
                          {p.label}:
                        </label>
                        <input
                          type="text"
                          value={placeholderValues[p.key] || ""}
                          onChange={(e) => handlePlaceholderChange(p.key, e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-surface border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-600"
                          placeholder={p.placeholder}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Direct Text Editor Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-foreground">
                  Pratinjau &amp; Edit Langsung Pesan:
                </label>
                <span className="text-[10px] text-foreground-muted">
                  Bebas diedit sesuai kebutuhan situasi
                </span>
              </div>
              <textarea
                value={activeText}
                onChange={(e) => {
                  setCustomText(e.target.value);
                  setIsDirectTextModified(true);
                }}
                rows={7}
                className="w-full p-3.5 rounded-xl bg-surface border border-border text-foreground font-sans text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all resize-y"
              />
            </div>
          </div>
        )}

        {/* Action Buttons Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border/60">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Primary Action: Copy Template */}
            <button
              type="button"
              onClick={() => handleCopy(activeText)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer ${
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-[#124734] hover:bg-[#185c43] text-white"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Template Berhasil Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Pesan</span>
                </>
              )}
            </button>

            {/* Toggle Edit Before Copy */}
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95 ${
                isEditing
                  ? "bg-surface-secondary text-foreground border-border"
                  : "bg-surface text-foreground-secondary hover:text-foreground border-border hover:bg-surface-secondary"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? "Selesai Edit" : "Edit Pesan"}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct WhatsApp launcher */}
            <a
              href={waShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-emerald-300/40 dark:border-emerald-800/50 transition-colors cursor-pointer"
              title="Buka WhatsApp dengan pesan ini"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kirim via WA</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>

            {/* Model Recruitment extra: Quick PIC link */}
            {isModelTemplate && (
              <a
                href={MODEL_PRIMARY_PIC.waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold text-purple-800 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-purple-300/40 dark:border-purple-800/50 transition-colors cursor-pointer"
                title="Hubungi PIC Utama Yossika"
              >
                <span>PIC Yossika</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
