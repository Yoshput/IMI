"use client";

import React, { useState, useEffect } from "react";
import { Lock, Unlock, KeyRound, ShieldAlert, Eye, EyeOff, Loader2 } from "lucide-react";

interface SensitiveGateProps {
  section: "finance" | "reports";
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const SensitiveGate: React.FC<SensitiveGateProps> = ({
  section,
  title,
  subtitle = "Area ini memerlukan otentikasi kredensial khusus untuk menjaga kerahasiaan data internal.",
  children,
}) => {
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check initial cookie status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/auth-guard?section=${section}`);
        const data = await res.json();
        if (data.success && data.unlocked) {
          setIsUnlocked(true);
        } else {
          setIsUnlocked(false);
        }
      } catch {
        setIsUnlocked(false);
      }
    };
    checkStatus();
  }, [section]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Masukkan password terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth-guard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, password }),
      });
      const result = await res.json();

      if (res.ok && result.success) {
        setIsUnlocked(true);
        setPassword("");
      } else {
        setError(result.error || "Password salah. Silakan periksa kembali.");
      }
    } catch {
      setError("Gagal menghubungi server otentikasi.");
    } finally {
      setLoading(false);
    }
  };

  const handleLock = async () => {
    try {
      await fetch(`/api/auth-guard?section=${section}`, { method: "DELETE" });
      setIsUnlocked(false);
    } catch {
      // fallback
    }
  };

  // Initial loading state
  if (isUnlocked === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <Loader2 className="w-8 h-8 text-brand animate-spin mb-3" />
        <p className="text-xs text-foreground-muted">Memeriksa izin akses keamanan...</p>
      </div>
    );
  }

  // If locked, show security gate UI
  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-surface border border-border rounded-2xl shadow-elevated transition-all">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-5 mx-auto">
          <Lock className="w-6 h-6" />
        </div>

        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-400 mb-2">
            <ShieldAlert className="w-3 h-3" /> Area Dilindungi Password
          </span>
          <h2 className="text-xl font-bold text-foreground tracking-tight">{title}</h2>
          <p className="text-xs text-foreground-muted mt-2 leading-relaxed">{subtitle}</p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-foreground-secondary mb-1.5">
              Password Akses {section === "finance" ? "Finance & Bonus" : "Laporan Eksekutif"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground-muted">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Masukkan kata sandi..."
                className="w-full pl-9 pr-10 py-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-all"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-foreground-muted hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-foreground text-surface font-semibold text-xs hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Memverifikasi...
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4" /> Buka Akses Halaman
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-border/60 text-center">
          <p className="text-[11px] text-foreground-muted">
            Butuh akses? Hubungi Admin Marketing atau HRD/Finance I See You.
          </p>
        </div>
      </div>
    );
  }

  // If unlocked, render children with top bar lock controls
  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl text-xs">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium">
          <Unlock className="w-3.5 h-3.5" />
          <span>
            Sesi Otentikasi Aktif (Bagian {section === "finance" ? "Finance & Bonus" : "Report"} Terbuka)
          </span>
        </div>
        <button
          onClick={handleLock}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-border text-[11px] font-semibold text-foreground-secondary hover:text-foreground hover:bg-surface-secondary transition-all"
        >
          <Lock className="w-3 h-3 text-amber-600" />
          <span>Kunci Kembali</span>
        </button>
      </div>
      {children}
    </div>
  );
};
