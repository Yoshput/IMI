import React from "react";
import { AlertCircle, FileQuestion, RefreshCw } from "lucide-react";

interface StateRendererProps {
  status: "loading" | "success" | "empty" | "error";
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  errorMessage?: string;
  skeletonHeight?: string;
  children: React.ReactNode;
}

export const StateRenderer: React.FC<StateRendererProps> = ({
  status,
  onRetry,
  emptyTitle = "Belum Ada Data Tersedia",
  emptyDescription = "Data untuk modul ini belum dicatat dalam periode yang dipilih.",
  emptyActionLabel,
  onEmptyAction,
  errorMessage = "Gagal memuat data dari sumber penyimpanan.",
  skeletonHeight = "h-48",
  children,
}) => {
  if (status === "loading") {
    return (
      <div className="w-full space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="border-b border-border pb-6 space-y-3">
          <div className="h-3 w-48 skeleton rounded" />
          <div className="h-8 w-72 skeleton rounded" />
          <div className="h-4 w-36 skeleton rounded" />
        </div>

        {/* Asymmetric Metric Cards Skeleton (mimicking final KPI layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7 h-44 rounded-container skeleton border border-border p-6 flex flex-col justify-between">
            <div className="h-3 w-28 bg-black/10 rounded" />
            <div className="h-10 w-40 bg-black/10 rounded" />
            <div className="h-3 w-3/4 bg-black/10 rounded" />
          </div>
          <div className="lg:col-span-5 h-44 rounded-container skeleton border border-border p-6 flex flex-col justify-between">
            <div className="h-3 w-24 bg-black/10 rounded" />
            <div className="h-10 w-28 bg-black/10 rounded" />
            <div className="h-3 w-2/3 bg-black/10 rounded" />
          </div>
        </div>

        {/* Content Table Skeleton */}
        <div className="rounded-container border border-border overflow-hidden bg-surface p-5 space-y-4">
          <div className="h-4 w-40 skeleton rounded" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 py-2 border-b border-border/50">
                <div className="w-6 h-6 skeleton rounded" />
                <div className="w-10 h-10 skeleton rounded-control shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-3/5 skeleton rounded" />
                  <div className="h-2.5 w-1/4 skeleton rounded" />
                </div>
                <div className="w-16 h-4 skeleton rounded" />
                <div className="w-16 h-4 skeleton rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="w-full p-8 sm:p-10 rounded-container bg-status-errorBg border border-status-error/20 flex flex-col items-center text-center justify-center space-y-4 shadow-subtle">
        <div className="w-12 h-12 rounded-full bg-status-error/10 flex items-center justify-center text-status-error shadow-xs">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="max-w-md space-y-1.5">
          <h4 className="text-sm font-bold text-status-error">
            Gagal Memuat Data Evaluasi (Error State — DESIGN §32)
          </h4>
          <p className="text-xs text-foreground leading-relaxed">
            {errorMessage}
          </p>
          <div className="pt-2 text-[11px] text-foreground-secondary border-t border-status-error/15 text-left space-y-1">
            <p><span className="font-semibold text-foreground">Kemungkinan penyebab:</span> Koneksi ke data store terputus atau file data belum diinisialisasi.</p>
            <p><span className="font-semibold text-foreground">Langkah tindakan:</span> Muat ulang halaman atau klik tombol sinkronisasi di bawah.</p>
          </div>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-white text-status-error border border-status-error/30 rounded-control hover:bg-white/80 transition-colors shadow-subtle"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Coba Sinkronkan Ulang
          </button>
        )}
      </div>
    );
  }

  if (status === "empty") {
    return (
      <div className="w-full p-10 rounded-container bg-surface border border-border flex flex-col items-center text-center justify-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-surface-subtle flex items-center justify-center text-foreground-muted">
          <FileQuestion className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">{emptyTitle}</h4>
          <p className="text-xs text-foreground-secondary mt-1 max-w-sm">{emptyDescription}</p>
        </div>
        {emptyActionLabel && onEmptyAction && (
          <button
            onClick={onEmptyAction}
            className="mt-2 px-3 py-1.5 text-xs font-medium bg-brand text-white rounded-control hover:bg-brand-hover transition-colors"
          >
            {emptyActionLabel}
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
};
