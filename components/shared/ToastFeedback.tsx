"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type?: "success" | "info" | "warning";
}

export function ToastFeedback() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleToastEvent = (e: CustomEvent<Omit<ToastItem, "id">>) => {
      const newToast: ToastItem = {
        id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: e.detail.title,
        message: e.detail.message,
        type: e.detail.type || "success",
      };

      setToasts((prev) => [...prev, newToast]);

      // Auto dismiss after 3.2s
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3200);
    };

    window.addEventListener("app-toast" as any, handleToastEvent);
    return () => window.removeEventListener("app-toast" as any, handleToastEvent);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-[99999] flex flex-col gap-2 pointer-events-none max-w-sm w-full"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto p-3.5 rounded-xl bg-surface dark:bg-[#121E19] border border-[#124734]/20 dark:border-emerald-500/30 shadow-xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === "warning" ? (
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            ) : toast.type === "info" ? (
              <Info className="w-4 h-4 text-blue-500" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-foreground leading-tight">
              {toast.title}
            </h4>
            {toast.message && (
              <p className="text-[11px] text-foreground-secondary mt-0.5 leading-snug">
                {toast.message}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="p-1 rounded-full text-foreground-muted hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
