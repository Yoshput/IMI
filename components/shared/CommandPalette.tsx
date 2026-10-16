'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  LayoutGrid,
  Table2,
  TrendingUp,
  Video,
  Briefcase,
  Glasses,
  Target,
  Camera,
  MapPin,
  BarChart2,
  FileText,
  Copy,
  Download,
  Check,
  Building2,
  ArrowRight,
  X,
  ExternalLink,
  Sparkles,
  Database,
  Wallet,
  Lock,
  User,
} from 'lucide-react';
import { downloadCSV } from '@/lib/export-csv';
import { exportWorkspaceBackup } from '@/lib/backup-service';
import initialKolData from '@/lib/kol-data.json';
import { LOCAL_BRANCH_COMPETITORS, COMPETITORS_UNIVERSE } from '@/features/competitors/data/competitors-radar-data';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

// Pre-configured modules
const MODULES = [
  { label: 'Dashboard Eksekutif', category: 'Eksekutif & Rekap', path: '/dashboard', icon: LayoutGrid, desc: 'Ringkasan KPI, 6 PIC, & evaluasi mingguan' },
  { label: 'Finance & Bonus PIC 🔒', category: 'Eksekutif & Rekap', path: '/finance', icon: Wallet, desc: 'Laporan keuangan, insentif kreator & kalkulasi bonus H+3' },
  { label: 'Report Eksekutif & Evaluasi 🔒', category: 'Eksekutif & Rekap', path: '/reports', icon: FileText, desc: 'Weekly management evaluation report & strategi cabang' },
  { label: 'Spreadsheet Rekap 6 PIC', category: 'Eksekutif & Rekap', path: '/spreadsheet', icon: Table2, desc: 'Rekap harian Sheets, story & omset kacamata' },
  { label: 'Social Blade Realtime', category: 'Sosial & Konten', path: '/social-blade', icon: TrendingUp, desc: 'Instagram Meta Graph real-time growth tracker' },
  { label: 'Konten & Reels Hub', category: 'Sosial & Konten', path: '/content', icon: Video, desc: 'Jurnal 40 konten, video viral, & ide kreatif' },
  { label: 'Pengajuan & Sponsor B2B', category: 'Kemitraan & Pelanggan', path: '/pengajuan', icon: Briefcase, desc: '11 Leads sponsor, barter voucher & proposal pitching' },
  { label: 'Aftersales CRM Lensa', category: 'Kemitraan & Pelanggan', path: '/aftersales', icon: Glasses, desc: '4.106 Pasien (Bluray, Photocromic, Bluecromic)' },
  { label: 'Radar 27 Kompetitor', category: 'Riset & Pertumbuhan', path: '/competitors', icon: Target, desc: 'Database 27 optik ritel & D2C Barlingmascakeb' },
  { label: 'Database 14 KOL Lokal', category: 'Riset & Pertumbuhan', path: '/kol', icon: Camera, desc: 'Kreator Banyumas, Cilacap, Purbalingga & Tegal' },
  { label: '17 Venue Event & Gedung', category: 'Riset & Pertumbuhan', path: '/venue', icon: MapPin, desc: 'Jatingayom, Hetero Space, Aston, Java Heritage' },
  { label: 'Meta Graph Analytics', category: 'Eksekutif & Rekap', path: '/analytics', icon: BarChart2, desc: 'Jangkauan, impresi, profil demographics' },
  { label: 'Proposal Sponsor Publik', category: 'Dokumen Resmi', path: '/proposal-sponsor', icon: FileText, desc: 'Template proposal formal B2B tanpa emoji' },
];

const SEARCHABLE_PICS = [
  { name: 'Ilya', branch: 'Purwokerto (Pusat)', role: 'PIC Konten Reels', path: '/content?branch=purwokerto' },
  { name: 'Nuha', branch: 'Purwokerto (Pusat)', role: 'PIC Konten Story IG', path: '/dashboard?branch=purwokerto' },
  { name: 'Ajun', branch: 'Purbalingga', role: 'PIC Konten Reels & TikTok', path: '/content?branch=purbalingga' },
  { name: 'Amanda', branch: 'Lunar Eyewear Tegal', role: 'PIC Konten Reels & TikTok', path: '/content?branch=lunar_tegal' },
  { name: 'Arum', branch: 'Cilacap', role: 'PIC Konten Reels & TikTok', path: '/content?branch=cilacap' },
  { name: 'Febi', branch: 'Wonosobo', role: 'PIC Konten Reels & TikTok', path: '/content?branch=wonosobo' },
];

const SEARCHABLE_BRANCHES = [
  { name: 'Purwokerto (Pusat & Lab)', code: 'PWT', path: '/dashboard?branch=purwokerto', desc: 'Optik I See You Purwokerto (Pusat)' },
  { name: 'Purbalingga', code: 'PBG', path: '/dashboard?branch=purbalingga', desc: 'Optik I See You Purbalingga' },
  { name: 'Cilacap', code: 'CLP', path: '/dashboard?branch=cilacap', desc: 'Optik I See You Cilacap' },
  { name: 'Wonosobo', code: 'WNS', path: '/dashboard?branch=wonosobo', desc: 'Optik I See You Wonosobo' },
  { name: 'Lunar Tegal', code: 'TGL', path: '/dashboard?branch=lunar_tegal', desc: 'Lunar Eyewear Tegal (Second Brand)' },
];

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setCopiedText(null);
    }
  }, [isOpen]);

  // Global hotkey: Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else window.dispatchEvent(new CustomEvent('open-command-palette'));
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Toast feedback
  const triggerToast = (msg: string) => {
    setCopiedText(msg);
    setTimeout(() => setCopiedText(null), 3000);
  };

  const navigateTo = (path: string) => {
    onClose();
    router.push(path);
  };

  // Quick Actions
  const handleCopyPitchWA = () => {
    const text = `Selamat pagi/siang Rekan Brand Partner,\n\nSalam hormat dari Tim Business Development & Marketing Optik I See You & Lunar Eyewear.\n\nKami mengundang brand Anda untuk berkolaborasi dalam Creative Content Masterclass 2026 yang akan dihadiri oleh para kreator, mahasiswa, dan profesional muda di Barlingmascakeb.\n\nSkema Kemitraan Barter:\n- 10 Voucher Belanja Kacamata Rp50.000\n- 10 Voucher Kacamata Gratis (Free Frame & Lens)\n\nDetail proposal resmi dapat ditinjau melalui tautan berikut:\nhttps://iseeyou-marketing-intelligence.vercel.app/proposal-sponsor\n\nTerima kasih. Kami siap berdiskusi lebih lanjut via WhatsApp ini.`;
    navigator.clipboard.writeText(text);
    triggerToast('Template Pitching WA B2B berhasil disalin!');
  };

  const handleCopyDirectorReport = () => {
    const text = `LAPORAN EVALUASI MINGGUAN DIREKSI - OPTIK I SEE YOU & LUNAR EYEWEAR\nPeriode: Siklus 8 (6–12 Oktober 2026)\n\n1. KONTEN & REACH:\n- Total 40 Konten Reels Terdata\n- 18 Reels Purwokerto, 7 Purbalingga, 6 Cilacap, 5 Wonosobo, 4 Tegal\n- Total Audience: 244.587 Followers (+1.482 minggu ini)\n\n2. REKAP PIC 5 CABANG:\n- Kepatuhan Laporan: 92% (5/6 PIC On-Schedule)\n\n3. AFTERSALES CRM:\n- Total 4.106 Pasang Kacamata Terdata\n- Bluray: 2.393 | Photocromic: 949 | Bluecromic: 764\n\n4. SPONSORSHIP B2B:\n- 11 Brand Leads Terhubung (Baby Glows, Navagreen, Inul Vizta, dll.)\n\nDashboard: https://iseeyou-marketing-intelligence.vercel.app/dashboard`;
    navigator.clipboard.writeText(text);
    triggerToast('Ringkasan Evaluasi Direksi berhasil disalin!');
  };

  const handleExportVenuesCSV = () => {
    window.open('/api/venue-export', '_blank');
    triggerToast('Mengunduh CSV 17 Venue Gedung...');
  };

  const handleExportKolCSV = () => {
    const headers = ['Nama KOL', 'Akun Instagram', 'Wilayah', 'Followers', 'Engagement Rate', 'Kategori', 'Status Outreach'];
    const rows = (initialKolData as any[]).map((k) => [
      k.name,
      k.handle,
      k.city || k.location,
      k.followers,
      k.engagementRate,
      k.niche || k.category,
      k.status || 'Tersedia',
    ]);
    downloadCSV(`kol-intelligence-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
    triggerToast('Mengunduh CSV 14 KOL...');
  };

  const handleExportCompetitorsCSV = () => {
    const headers = ['Nama Kompetitor', 'Kategori', 'Wilayah', 'Level Ancaman', 'Rentang Harga', 'USP/Kelemahan'];
    const rows = [...LOCAL_BRANCH_COMPETITORS, ...COMPETITORS_UNIVERSE].map((c: any) => [
      c.name,
      c.category,
      c.branchLocation || c.tier || 'Nasional',
      c.threatLevel || 'Sedang',
      c.priceRange || 'Rp 400K - 1.200K',
      c.strategyNotes || c.description || '-',
    ]);
    downloadCSV(`competitors-intelligence-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
    triggerToast('Mengunduh CSV 27 Kompetitor...');
  };

  // Filtered lists
  const filteredModules = useMemo(() => {
    if (!query) return MODULES;
    const q = query.toLowerCase();
    return MODULES.filter((m) => m.label.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q) || m.category.toLowerCase().includes(q));
  }, [query]);

  const filteredCompetitors = useMemo(() => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    return [...LOCAL_BRANCH_COMPETITORS, ...COMPETITORS_UNIVERSE]
      .filter((c: any) => c.name.toLowerCase().includes(q) || (c.branchLocation && c.branchLocation.toLowerCase().includes(q)))
      .slice(0, 5);
  }, [query]);

  const filteredKols = useMemo(() => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    return (initialKolData as any[])
      .filter((k) => k.name.toLowerCase().includes(q) || k.handle.toLowerCase().includes(q) || (k.city && k.city.toLowerCase().includes(q)))
      .slice(0, 5);
  }, [query]);

  const filteredPics = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return SEARCHABLE_PICS.filter(
      (p) => p.name.toLowerCase().includes(q) || p.branch.toLowerCase().includes(q) || p.role.toLowerCase().includes(q)
    );
  }, [query]);

  const filteredBranches = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return SEARCHABLE_BRANCHES.filter(
      (b) => b.name.toLowerCase().includes(q) || b.code.toLowerCase().includes(q) || b.desc.toLowerCase().includes(q)
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-[#F8F5ED] text-[#183C30] rounded-3xl shadow-2xl border border-[#124734]/15 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#124734]/12 flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#124734] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik nama modul, 27 kompetitor, 14 KOL, 17 venue, atau aksi cepat..."
            className="w-full bg-transparent text-sm sm:text-base font-medium text-[#183C30] placeholder-[#5C6B64] focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-full hover:bg-[#F3EFE6] text-[#5C6B64]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-[#F3EFE6] text-[#5C6B64] rounded border border-[#124734]/10">
            ESC
          </kbd>
        </div>

        {/* Toast Alert */}
        {copiedText && (
          <div className="bg-[#16A34A] text-white px-4 py-2 text-xs font-semibold flex items-center justify-between animate-in slide-in-from-top-1">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4" /> {copiedText}
            </span>
          </div>
        )}

        {/* Scrollable Results Area */}
        <div className="p-4 overflow-y-auto space-y-5">
          {/* Section: Quick Actions */}
          {!query && (
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#5C6B64] block mb-2 px-2">
                Aksi Cepat & Ekspor Data
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopyPitchWA}
                  className="p-2.5 rounded-xl bg-white hover:bg-[#F3EFE6] border border-[#124734]/10 text-left text-xs font-semibold flex items-center justify-between text-[#183C30] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Copy className="w-4 h-4 text-[#124734]" />
                    <span>Salin Pitching WA Sponsor B2B</span>
                  </span>
                  <span className="text-[10px] text-[#16A34A] font-bold">Barter</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyDirectorReport}
                  className="p-2.5 rounded-xl bg-white hover:bg-[#F3EFE6] border border-[#124734]/10 text-left text-xs font-semibold flex items-center justify-between text-[#183C30] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#124734]" />
                    <span>Salin Laporan WA Direksi</span>
                  </span>
                  <span className="text-[10px] text-[#124734] font-bold">Siklus 8</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportVenuesCSV}
                  className="p-2.5 rounded-xl bg-white hover:bg-[#F3EFE6] border border-[#124734]/10 text-left text-xs font-semibold flex items-center justify-between text-[#183C30] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-[#124734]" />
                    <span>Export CSV 17 Venue Gedung</span>
                  </span>
                  <span className="text-[10px] text-[#5C6B64]">.csv</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportKolCSV}
                  className="p-2.5 rounded-xl bg-white hover:bg-[#F3EFE6] border border-[#124734]/10 text-left text-xs font-semibold flex items-center justify-between text-[#183C30] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-[#124734]" />
                    <span>Export CSV 14 KOL Lokal</span>
                  </span>
                  <span className="text-[10px] text-[#5C6B64]">.csv</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCompetitorsCSV}
                  className="p-2.5 rounded-xl bg-white hover:bg-[#F3EFE6] border border-[#124734]/10 text-left text-xs font-semibold flex items-center justify-between text-[#183C30] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-[#124734]" />
                    <span>Export CSV 27 Kompetitor</span>
                  </span>
                  <span className="text-[10px] text-[#5C6B64]">.csv</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    exportWorkspaceBackup();
                    triggerToast('File cadangan JSON berhasil diunduh!');
                  }}
                  className="p-2.5 rounded-xl bg-white hover:bg-[#F3EFE6] border border-[#124734]/10 text-left text-xs font-semibold flex items-center justify-between text-[#183C30] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#124734]" />
                    <span>Cadangkan Workspace (JSON)</span>
                  </span>
                  <span className="text-[10px] text-[#16A34A] font-bold">Backup</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('/proposal-sponsor')}
                  className="p-2.5 rounded-xl bg-[#124734] text-white hover:bg-[#0E3829] text-left text-xs font-semibold flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#F3EFE6]" />
                    <span>Buka Dokumen Proposal A4</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Section: Competitors Search Results (if matching) */}
          {filteredCompetitors.length > 0 && (
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#5C6B64] block mb-2 px-2">
                Kompetitor Ditemukan ({filteredCompetitors.length})
              </span>
              <div className="space-y-1.5">
                {filteredCompetitors.map((comp: any, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => navigateTo('/competitors')}
                    className="w-full p-2.5 rounded-xl bg-white hover:bg-[#F3EFE6] border border-[#124734]/10 text-left text-xs flex items-center justify-between text-[#183C30] transition-colors"
                  >
                    <div>
                      <span className="font-bold block">{comp.name}</span>
                      <span className="text-[11px] text-[#5C6B64]">
                        {comp.category} · {comp.branchLocation || 'Nasional'}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-[#124734] flex items-center gap-1">
                      Buka Radar <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section: KOLs Search Results (if matching) */}
          {filteredKols.length > 0 && (
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#5C6B64] block mb-2 px-2">
                KOL Kreator Ditemukan ({filteredKols.length})
              </span>
              <div className="space-y-1.5">
                {filteredKols.map((kol: any, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => navigateTo('/kol')}
                    className="w-full p-2.5 rounded-xl bg-white hover:bg-[#F3EFE6] border border-[#124734]/10 text-left text-xs flex items-center justify-between text-[#183C30] transition-colors"
                  >
                    <div>
                      <span className="font-bold block">{kol.name} ({kol.handle})</span>
                      <span className="text-[11px] text-[#5C6B64]">
                        {kol.city} · {kol.followers} Followers · ER {kol.engagementRate}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-[#124734] flex items-center gap-1">
                      Lihat Profil <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section: PIC Cabang Search Results */}
          {filteredPics.length > 0 && (
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#5C6B64] block mb-2 px-2">
                PIC Cabang Ditemukan ({filteredPics.length})
              </span>
              <div className="space-y-1.5">
                {filteredPics.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => navigateTo(p.path)}
                    className="w-full p-2.5 rounded-xl bg-white hover:bg-[#F3EFE6] border border-[#124734]/10 text-left text-xs flex items-center justify-between text-[#183C30] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-xs">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold block">{p.name} ({p.branch})</span>
                        <span className="text-[11px] text-[#5C6B64]">{p.role}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-[#124734] flex items-center gap-1">
                      Audit PIC <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section: Branches Search Results */}
          {filteredBranches.length > 0 && (
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#5C6B64] block mb-2 px-2">
                Cabang Ditemukan ({filteredBranches.length})
              </span>
              <div className="space-y-1.5">
                {filteredBranches.map((b, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => navigateTo(b.path)}
                    className="w-full p-2.5 rounded-xl bg-white hover:bg-[#F3EFE6] border border-[#124734]/10 text-left text-xs flex items-center justify-between text-[#183C30] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold block">{b.name} ({b.code})</span>
                        <span className="text-[11px] text-[#5C6B64]">{b.desc}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-[#124734] flex items-center gap-1">
                      Buka Cabang <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section: Modules Navigation */}
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#5C6B64] block mb-2 px-2">
              Modul Marketing Intelligence ({filteredModules.length})
            </span>
            <div className="space-y-1.5">
              {filteredModules.map((mod) => {
                const Icon = mod.icon;
                return (
                  <button
                    key={mod.path}
                    type="button"
                    onClick={() => navigateTo(mod.path)}
                    className="w-full p-2.5 rounded-xl bg-white hover:bg-[#F3EFE6] border border-[#124734]/10 text-left text-xs flex items-center justify-between text-[#183C30] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#124734]/10 text-[#124734] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{mod.label}</span>
                          <span className="text-[10px] text-[#5C6B64] bg-[#F3EFE6] px-2 py-0.5 rounded-full font-medium">
                            {mod.category}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#5C6B64] block mt-0.5">
                          {mod.desc}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#5C6B64]" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#F3EFE6] border-t border-[#124734]/12 flex items-center justify-between text-[11px] text-[#5C6B64]">
          <span>Gunakan panah untuk bernavigasi, Enter untuk memilih.</span>
          <span className="font-semibold text-[#124734]">Optik I See You & Lunar Eyewear</span>
        </div>
      </div>
    </div>
  );
}
