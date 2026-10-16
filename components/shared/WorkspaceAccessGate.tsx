'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

interface WorkspaceAccessGateProps {
  children: React.ReactNode;
}

export function WorkspaceAccessGate({ children }: WorkspaceAccessGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState('');
  const [selectedRole, setSelectedRole] = useState('Marketing Lead / PIC Cabang');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      const isAuth = localStorage.getItem('isy_workspace_auth');
      const branchPref = localStorage.getItem('isy_active_branch');
      // If user unlocked previously or selected branch via landing page entry button
      if (isAuth === 'true' || branchPref) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(true); // Fallback for environments without localStorage
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Valid passcodes: 'optik2026', 'iseeyou', 'admin', or role confirmation
    const trimmed = passcode.trim().toLowerCase();
    if (trimmed === 'optik2026' || trimmed === 'iseeyou' || trimmed === 'admin' || trimmed === '') {
      if (rememberDevice) {
        try {
          localStorage.setItem('isy_workspace_auth', 'true');
          localStorage.setItem('isy_workspace_role', selectedRole);
        } catch {
          // ignore
        }
      }
      setIsAuthenticated(true);
    } else {
      setErrorMsg('Kata sandi internal salah. Gunakan sandi internal optik2026 atau konfirmasi peran Anda.');
    }
  };

  // While checking localStorage
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F5ED]">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#124734]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" />
          <span>Memverifikasi izin akses workspace...</span>
        </div>
      </div>
    );
  }

  // If already authenticated
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Access Gate Modal Screen
  return (
    <div className="min-h-screen bg-[#F8F5ED] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-[#124734]/15 shadow-xl text-[#183C30]">
        <div className="text-center mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-isy-dark.png"
            alt="Optik I See You"
            className="h-7 w-auto mx-auto object-contain mb-3"
          />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#124734]/8 text-[#124734] text-[11px] font-bold uppercase tracking-wider mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Proteksi Akses Internal</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Verifikasi Tim Workspace</h2>
          <p className="mt-1.5 text-xs text-[#5C6B64] leading-relaxed">
            Sistem memuat data internal kas 6 PIC cabang, riset 27 kompetitor Barlingmascakeb, dan
            4.106 rekap aftersales lensa.
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#183C30] block mb-1">
              Pilih Peran Anda di Tim:
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#124734]/20 bg-[#F8F5ED] text-xs font-semibold text-[#183C30] focus:outline-none focus:ring-2 focus:ring-[#124734]"
            >
              <option value="Direksi / Owner">Direksi / Pemilik Perusahaan</option>
              <option value="Marketing Lead / PIC Cabang">Marketing Lead / PIC Cabang</option>
              <option value="Auditor Internal & Keuangan">Auditor Internal & Keuangan</option>
              <option value="Kreator & Tim Konten">Kreator & Tim Konten</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-[#183C30]">
                Passcode Akses (Opsional / Default: optik2026):
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder="Masukkan passcode atau langsung klik Buka"
                className="w-full p-2.5 pr-10 rounded-xl border border-[#124734]/20 bg-[#F8F5ED] text-xs font-medium text-[#183C30] placeholder-[#5C6B64] focus:outline-none focus:ring-2 focus:ring-[#124734]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-[#5C6B64] hover:text-[#183C30]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errorMsg && <p className="text-[11px] text-red-600 mt-1 font-medium">{errorMsg}</p>}
          </div>

          <label className="flex items-center gap-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.target.checked)}
              className="w-4 h-4 rounded text-[#124734] focus:ring-[#124734]"
            />
            <span className="text-xs text-[#5C6B64]">
              Ingat perangkat ini (tidak perlu verifikasi lagi)
            </span>
          </label>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-full bg-[#124734] hover:bg-[#0E3829] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Buka Akses Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#124734]/10 text-center">
          <Link
            href="/"
            className="text-xs font-semibold text-[#124734] hover:underline"
          >
            ← Kembali ke Beranda Publik
          </Link>
        </div>
      </div>
    </div>
  );
}
