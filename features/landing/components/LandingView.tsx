'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  Video,
  Users,
  Eye,
  Glasses,
  Target,
  MapPin,
  CheckCircle2,
  Circle,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  BarChart3,
  MessageSquare,
  Gift,
  Building2,
  Calendar,
  Layers,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

import { ACTIVE_MEETING_CYCLE } from '@/lib/cadence-config';

interface BranchData {
  id: string;
  name: string;
  subtitle: string;
  handle: string;
  followers: number;
  followersFormatted: string;
  reelsCount: number;
  storyPace: string;
  picName: string;
  picCount: number;
  engagementRate: string;
  growth: string;
  focus: string;
}

const INITIAL_BRANCHES: BranchData[] = [
  {
    id: 'all',
    name: 'Semua Jaringan',
    subtitle: 'Optik I See You & Lunar Eyewear',
    handle: '@iseeyou.glasses + 4 cabang',
    followers: 344100,
    followersFormatted: '344.100',
    reelsCount: 40,
    storyPace: '100% On Schedule',
    picName: '6/6 PIC Aktif',
    picCount: 6,
    engagementRate: '8.5%',
    growth: '+2.512 minggu ini',
    focus: 'Sentralisasi strategi konten & kolaborasi B2B lintas 5 wilayah',
  },
  {
    id: 'pwt',
    name: 'Purwokerto',
    subtitle: 'Optik I See You · Flagship Pusat',
    handle: '@iseeyou.glasses',
    followers: 232400,
    followersFormatted: '232.4K',
    reelsCount: 18,
    storyPace: '4-6 Story/Hari',
    picName: 'Rian & Nabila',
    picCount: 2,
    engagementRate: '9.2%',
    growth: '+1.850 minggu ini',
    focus: 'Edukasi lensa premium, fashion frame titanium, & event kampus',
  },
  {
    id: 'pbg',
    name: 'Purbalingga',
    subtitle: 'Optik I See You · Cabang Purbalingga',
    handle: '@iseeyou.purbalingga',
    followers: 28400,
    followersFormatted: '28.4K',
    reelsCount: 7,
    storyPace: '3-4 Story/Hari',
    picName: 'Fani',
    picCount: 1,
    engagementRate: '7.8%',
    growth: '+210 minggu ini',
    focus: 'Segmen pekerja industri, mahasiswa, & promo barter kacamata',
  },
  {
    id: 'clp',
    name: 'Cilacap',
    subtitle: 'Optik I See You · Cabang Cilacap',
    handle: '@iseeyou.cilacap',
    followers: 36100,
    followersFormatted: '36.1K',
    reelsCount: 6,
    storyPace: '3-4 Story/Hari',
    picName: 'Dimas',
    picCount: 1,
    engagementRate: '8.1%',
    growth: '+240 minggu ini',
    focus: 'Komunitas olahraga, instansi BUMN pesisir, & promo pelajar',
  },
  {
    id: 'wns',
    name: 'Wonosobo',
    subtitle: 'Optik I See You · Cabang Wonosobo',
    handle: '@iseeyou.wonosobo',
    followers: 21900,
    followersFormatted: '21.9K',
    reelsCount: 5,
    storyPace: '2-3 Story/Hari',
    picName: 'Anisa',
    picCount: 1,
    engagementRate: '8.6%',
    growth: '+112 minggu ini',
    focus: 'Wisatawan Dieng, pelajar daerah dingin (anti-fog lens), & instansi',
  },
  {
    id: 'tgl',
    name: 'Lunar Tegal',
    subtitle: 'Lunar Eyewear · Boutique Tegal',
    handle: '@lunareyewear.co',
    followers: 25300,
    followersFormatted: '25.3K',
    reelsCount: 4,
    storyPace: '3 Story/Hari',
    picName: 'Yoga',
    picCount: 1,
    engagementRate: '8.9%',
    growth: '+100 minggu ini',
    focus: 'Frame boutique curated, eyewear high-fashion, & segmen D2C Tegal',
  },
];

export const BRANCHES = INITIAL_BRANCHES;

const TARGET_MODULES = [
  { id: '/dashboard', label: 'Dashboard Eksekutif', detail: 'Ringkasan KPI & 6 PIC' },
  { id: '/spreadsheet', label: 'Spreadsheet 6 PIC', detail: 'Sinkronisasi Sheets Harian' },
  { id: '/social-blade', label: 'Social Blade Realtime', detail: 'Meta Graph Instagram Live' },
  { id: '/content', label: 'Content Hub & Reels', detail: 'Jurnal 40 Konten & Ide' },
  { id: '/pengajuan', label: 'Pengajuan & Sponsor B2B', detail: '11 Leads & Template WA' },
  { id: '/aftersales', label: 'Aftersales CRM Lensa', detail: '4.106 Pasien & Garansi' },
  { id: '/venue', label: 'Venue Event & Gedung', detail: '17 Lokasi Termasuk Jatingayom' },
  { id: '/proposal-sponsor', label: 'Proposal Sponsor Publik', detail: 'Dokumen Resmi B2B' },
];

export function LandingView() {
  const router = useRouter();
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [activeMiniTab, setActiveMiniTab] = useState<number>(0);

  // Bento Interactive States
  const [activeBentoFilter, setActiveBentoFilter] = useState<'konten' | 'sheets' | 'analytics' | 'social'>('konten');
  const [picChecklist, setPicChecklist] = useState<Record<string, boolean>>({
    rian: true,
    nabila: true,
    fani: true,
    dimas: true,
    anisa: true,
    yoga: false,
  });

  // Quick Launcher State
  const [launcherBranch, setLauncherBranch] = useState<string>('all');
  const [launcherModule, setLauncherModule] = useState<string>('/dashboard');
  const [rememberPreference, setRememberPreference] = useState<boolean>(true);

  const [branches, setBranches] = useState<BranchData[]>(INITIAL_BRANCHES);
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(true);

  // Initial load preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem('isy_active_branch');
      if (saved && INITIAL_BRANCHES.some((b) => b.id === saved)) {
        setSelectedBranchId(saved);
        setLauncherBranch(saved);
      }
    } catch {
      // LocalStorage not available
    }
  }, []);

  // Dynamic live sync from Google Sheets and Instagram endpoints
  useEffect(() => {
    let isMounted = true;
    async function loadLiveMetrics() {
      try {
        setIsLoadingLive(true);
        const [sheetsRes, igRes] = await Promise.allSettled([
          fetch('/api/sync-sheets').then((r) => r.json()),
          fetch('/api/instagram-realtime').then((r) => r.json()),
        ]);

        if (!isMounted) return;

        let igAccounts: Record<string, any> = {};
        if (igRes.status === 'fulfilled' && igRes.value?.success && igRes.value?.data?.accounts) {
          igAccounts = igRes.value.data.accounts;
        }

        let branchReelsData: Record<string, any[]> = {};
        let spreadsheetFollowers: Record<string, any> = {};
        if (sheetsRes.status === 'fulfilled' && sheetsRes.value?.success && sheetsRes.value?.data) {
          branchReelsData = sheetsRes.value.data.branchReels || {};
          spreadsheetFollowers = sheetsRes.value.data.spreadsheetFollowersByBranch || {};
          if (Object.keys(igAccounts).length === 0 && sheetsRes.value.data.executiveRecap?.liveFollowersByBranch) {
            igAccounts = sheetsRes.value.data.executiveRecap.liveFollowersByBranch;
          }
        }

        setBranches((prevBranches) => {
          const branchIds = ['pwt', 'pbg', 'clp', 'wns', 'tgl'];
          const metricsByBranch: Record<string, { followers: number; followersFormatted: string; reelsCount: number; er: string }> = {};

          let totalFollowers = 0;
          let totalReels = 0;
          let totalLikes = 0;
          let totalComments = 0;
          let totalPostsWithMetrics = 0;

          branchIds.forEach((bId) => {
            const initial = INITIAL_BRANCHES.find((b) => b.id === bId);
            const igKey = bId === 'tgl' ? (igAccounts['tgl'] ? 'tgl' : 'lunar') : bId;
            const sheetKey = bId === 'pwt' ? 'purwokerto' : bId === 'pbg' ? 'purbalingga' : bId === 'clp' ? 'cilacap' : bId === 'wns' ? 'wonosobo' : 'lunar_tegal';

            const igAcc = igAccounts[igKey];
            const sFollowers = spreadsheetFollowers[sheetKey];
            const reelsList = branchReelsData[sheetKey] || [];

            let followersVal = initial?.followers || 0;
            let followersFormatted = initial?.followersFormatted || '';

            if (igAcc?.followers && igAcc.followers > 0) {
              followersVal = igAcc.followers;
              if (followersVal >= 10000) {
                followersFormatted = `${(followersVal / 1000).toFixed(1)}K`;
              } else if (followersVal >= 1000) {
                followersFormatted = new Intl.NumberFormat('id-ID').format(followersVal);
              } else {
                followersFormatted = String(followersVal);
              }
            } else if (sFollowers?.instagram && sFollowers.instagram > 0) {
              followersVal = sFollowers.instagram;
              if (followersVal >= 10000) {
                followersFormatted = `${(followersVal / 1000).toFixed(1)}K`;
              } else if (followersVal >= 1000) {
                followersFormatted = new Intl.NumberFormat('id-ID').format(followersVal);
              } else {
                followersFormatted = String(followersVal);
              }
            }

            let reelsCount = initial?.reelsCount || 0;
            if (reelsList.length > 0) {
              reelsCount = reelsList.length;
            }

            let calculatedER = initial?.engagementRate || '8.0%';
            if (reelsList.length > 0 && followersVal > 0) {
              let branchLikes = 0;
              let branchComments = 0;
              let branchReelsWithMetrics = 0;
              reelsList.forEach((r: any) => {
                const likes = Number(r.likes) || 0;
                const comments = Number(r.comments) || 0;
                if (likes > 0 || comments > 0) {
                  branchLikes += likes;
                  branchComments += comments;
                  branchReelsWithMetrics++;
                  totalLikes += likes;
                  totalComments += comments;
                  totalPostsWithMetrics++;
                }
              });
              if (branchReelsWithMetrics > 0) {
                const avgEngagement = (branchLikes + branchComments) / branchReelsWithMetrics;
                const erNum = (avgEngagement / followersVal) * 100;
                if (erNum > 0 && erNum < 50) {
                  calculatedER = `${erNum.toFixed(1)}%`;
                }
              }
            }

            totalFollowers += followersVal;
            totalReels += reelsCount;

            metricsByBranch[bId] = {
              followers: followersVal,
              followersFormatted,
              reelsCount,
              er: calculatedER,
            };
          });

          let aggregateER = '8.5%';
          if (totalFollowers > 0 && totalPostsWithMetrics > 0) {
            const avgEng = (totalLikes + totalComments) / totalPostsWithMetrics;
            const netER = (avgEng / totalFollowers) * 100;
            if (netER > 0 && netER < 50) {
              aggregateER = `${netER.toFixed(1)}%`;
            }
          }

          const aggregateFollowers = totalFollowers > 0 ? totalFollowers : 344100;
          const aggregateFollowersFormatted = new Intl.NumberFormat('id-ID').format(aggregateFollowers);
          const aggregateReels = totalReels > 0 ? totalReels : 40;

          return prevBranches.map((branch) => {
            if (branch.id === 'all') {
              return {
                ...branch,
                followers: aggregateFollowers,
                followersFormatted: aggregateFollowersFormatted,
                reelsCount: aggregateReels,
                engagementRate: aggregateER,
              };
            }

            const updated = metricsByBranch[branch.id];
            if (updated) {
              return {
                ...branch,
                followers: updated.followers,
                followersFormatted: updated.followersFormatted,
                reelsCount: updated.reelsCount,
                engagementRate: updated.er,
              };
            }

            return branch;
          });
        });
      } catch (err) {
        console.warn('Failed to load dynamic metrics for Landing Sandbox:', err);
      } finally {
        if (isMounted) {
          setIsLoadingLive(false);
        }
      }
    }

    loadLiveMetrics();

    return () => {
      isMounted = false;
    };
  }, []);

  const currentBranch = branches.find((b) => b.id === selectedBranchId) || branches[0];

  const handleLaunchSystem = (overrideBranch?: string, overrideModule?: string) => {
    const branchToUse = overrideBranch || launcherBranch;
    const moduleToUse = overrideModule || launcherModule;

    if (rememberPreference) {
      try {
        localStorage.setItem('isy_active_branch', branchToUse);
        localStorage.setItem(
          'imi.workspace.v1',
          JSON.stringify({ version: 1, branch: branchToUse, timestamp: Date.now() })
        );
      } catch {
        // ignore
      }
    }

    const separator = moduleToUse.includes('?') ? '&' : '?';
    router.push(`${moduleToUse}${separator}branch=${branchToUse}`);
  };

  const toggleChecklist = (id: string) => {
    setPicChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedPics = Object.values(picChecklist).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#F8F5ED] text-[#183C30] font-sans antialiased selection:bg-[#124734]/15 selection:text-[#124734]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#F8F5ED]/90 backdrop-blur-md border-b border-[#124734]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/logo-isy-dark.png"
                alt="Optik I See You"
                className="h-7 w-auto object-contain transition-transform group-hover:scale-102"
              />
              <div className="border-l border-[#124734]/20 pl-2.5 ml-1">
                <span className="text-[12px] font-bold tracking-tight text-[#183C30] block leading-tight">
                  Marketing Intelligence
                </span>
                <span className="text-[9px] uppercase tracking-wider font-semibold text-[#124734]/70 block">
                  B2B Command Center
                </span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-[13px] font-medium text-[#2D3A34]">
            <a href="#hero-sandbox" className="hover:text-[#124734] transition-colors">
              Workspace Live
            </a>
            <a href="#bento-features" className="hover:text-[#124734] transition-colors">
              Fitur Terpadu
            </a>
            <a href="#quick-launch" className="hover:text-[#124734] transition-colors">
              Alur Kerja
            </a>
            <a href="#branch-network" className="hover:text-[#124734] transition-colors">
              5 Cabang
            </a>
            <Link
              href="/proposal-sponsor"
              className="text-[#124734] font-semibold hover:underline underline-offset-4"
            >
              Proposal Sponsor
            </Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleLaunchSystem()}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#124734] hover:bg-[#0E3829] text-white text-[13px] font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <span>Masuk ke Sistem</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* HERO SECTION WITH INTERACTIVE WORKSPACE SANDBOX */}
        <section
          id="hero-sandbox"
          className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden border-b border-[#124734]/10"
        >
          {/* Subtle Ambient Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[380px] bg-gradient-to-b from-[#124734]/8 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#124734]/8 text-[#124734] text-[11px] font-semibold tracking-wider uppercase mb-5">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                Live Marketing Command Center · 5 Cabang
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#183C30] tracking-tight leading-[1.12]">
                Lihat{' '}
                <span className="font-serif italic font-normal text-[#124734] underline decoration-[#124734]/30 decoration-2 underline-offset-4">
                  lebih jelas
                </span>
                .<br />
                <span className="text-[#2D3A34]">Kerja lebih terarah.</span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-[#5C6B64] leading-relaxed max-w-2xl mx-auto">
                Platform terpadu untuk memantau performa 40 Reels, rekap 6 PIC harian, analitik 5
                cabang, riset 27 kompetitor, 14 KOL, 17 venue, dan aftersales CRM.
              </p>

              {/* Branch Selector Pill Strip */}
              <div className="mt-8 flex items-center justify-center flex-wrap gap-2">
                <span className="text-[11px] font-semibold text-[#5C6B64] uppercase tracking-wider mr-1">
                  Pilih Cabang:
                </span>
                {branches.map((branch) => {
                  const isSelected = branch.id === selectedBranchId;
                  return (
                    <button
                      key={branch.id}
                      type="button"
                      onClick={() => setSelectedBranchId(branch.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-[#124734] text-white shadow-sm scale-105'
                          : 'bg-white hover:bg-[#F3EFE6] text-[#2D3A34] border border-[#124734]/15 hover:border-[#124734]/30'
                      }`}
                    >
                      {branch.name}
                      {branch.id === 'all' && ' (5)'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* LIVE INTERACTIVE HERO WORKSPACE SANDBOX CONTAINER */}
            <div className="relative mx-auto max-w-5xl rounded-3xl bg-white border border-[#124734]/15 shadow-[0_16px_50px_-10px_rgba(18,71,52,0.12)] overflow-hidden">
              {/* Sandbox Header / Status Bar */}
              <div className="bg-[#F3EFE6] px-5 py-3.5 border-b border-[#124734]/12 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#E5E0D5]" />
                    <span className="w-3 h-3 rounded-full bg-[#E5E0D5]" />
                    <span className="w-3 h-3 rounded-full bg-[#E5E0D5]" />
                  </span>
                  <div className="h-4 w-px bg-[#124734]/15 mx-1" />
                  <span className="text-xs font-bold text-[#183C30] flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#124734]" />
                    {currentBranch.name}
                  </span>
                  <span className="text-[11px] text-[#5C6B64] font-medium hidden sm:inline">
                    · {currentBranch.subtitle}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold text-[#16A34A] bg-[#16A34A]/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${isLoadingLive ? 'bg-[#EAB308]' : 'bg-[#16A34A]'} animate-pulse`} />
                    {isLoadingLive ? 'Sinkronisasi Live...' : 'Live Sandbox'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleLaunchSystem(currentBranch.id)}
                    className="text-xs font-semibold text-[#124734] hover:underline flex items-center gap-1"
                  >
                    Buka Modul Ini <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Dynamic KPI Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#124734]/10 bg-white border-b border-[#124734]/10">
                <div className="p-4 sm:p-5">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#5C6B64] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#124734]" /> Followers Jaringan
                  </span>
                  <div className="mt-1.5 flex items-baseline gap-2">
                    {isLoadingLive ? (
                      <span className="inline-block h-8 w-24 bg-[#E5E0D5]/70 rounded-md animate-pulse my-0.5" />
                    ) : (
                      <span className="text-2xl sm:text-3xl font-bold text-[#183C30] tabular-nums tracking-tight">
                        {currentBranch.followersFormatted}
                      </span>
                    )}
                    <span className="text-[11px] font-semibold text-[#16A34A]">
                      {currentBranch.growth}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#5C6B64] block mt-0.5 font-medium truncate">
                    {currentBranch.handle}
                  </span>
                </div>

                <div className="p-4 sm:p-5">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#5C6B64] flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-[#124734]" /> Produksi Reels
                  </span>
                  <div className="mt-1.5 flex items-baseline gap-2">
                    {isLoadingLive ? (
                      <span className="inline-block h-8 w-14 bg-[#E5E0D5]/70 rounded-md animate-pulse my-0.5" />
                    ) : (
                      <span className="text-2xl sm:text-3xl font-bold text-[#183C30] tabular-nums tracking-tight">
                        {currentBranch.reelsCount}
                      </span>
                    )}
                    <span className="text-[11px] text-[#5C6B64]">Reels terdata</span>
                  </div>
                  <span className="text-[11px] text-[#124734] font-medium block mt-0.5">
                    ER: {currentBranch.engagementRate} rata-rata
                  </span>
                </div>

                <div className="p-4 sm:p-5">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#5C6B64] flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#124734]" /> Story Harian
                  </span>
                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span className="text-lg sm:text-xl font-bold text-[#183C30] tracking-tight">
                      {currentBranch.storyPace}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#16A34A] font-semibold block mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#16A34A]" /> Konsistensi terjaga
                  </span>
                </div>

                <div className="p-4 sm:p-5">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#5C6B64] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#124734]" /> Status Tim PIC
                  </span>
                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span className="text-lg sm:text-xl font-bold text-[#183C30] tracking-tight truncate">
                      {currentBranch.picName}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#5C6B64] block mt-1 font-medium line-clamp-2 leading-relaxed">
                    {currentBranch.focus}
                  </span>
                </div>
              </div>

              {/* 4 MINI-TABS SWITCHER */}
              <div className="bg-[#F8F5ED]/70 px-5 pt-3 border-b border-[#124734]/10 flex items-center gap-2 sm:gap-4 overflow-x-auto">
                {[
                  { id: 0, label: '1. Ringkasan Eksekutif', icon: BarChart3 },
                  { id: 1, label: '2. Top Reels & Konten', icon: Video },
                  { id: 2, label: '3. Radar Kompetitor', icon: Target },
                  { id: 3, label: '4. Aftersales & Lensa', icon: Glasses },
                ].map((tab) => {
                  const isActive = activeMiniTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveMiniTab(tab.id)}
                      className={`pb-3 px-2 text-xs sm:text-sm font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'border-[#124734] text-[#124734]'
                          : 'border-transparent text-[#5C6B64] hover:text-[#183C30]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* MINI-TAB CONTENT PANELS */}
              <div className="p-5 sm:p-7 min-h-[340px] bg-white">
                {/* TAB 0: Ringkasan Eksekutif */}
                {activeMiniTab === 0 && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F3EFE6] p-4 rounded-2xl border border-[#124734]/10">
                      <div>
                        <span className="text-xs font-semibold text-[#124734] uppercase tracking-wider block">
                          Evaluasi {ACTIVE_MEETING_CYCLE.shortLabel} · 2026
                        </span>
                        <h4 className="text-base font-bold text-[#183C30] mt-0.5">
                          Progress Laporan 6 PIC & Sinkronisasi Sheets
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-[#16A34A]/15 text-[#16A34A] text-xs font-bold tabular-nums">
                          92% Selesai
                        </span>
                        <button
                          type="button"
                          onClick={() => handleLaunchSystem(currentBranch.id, '/spreadsheet')}
                          className="px-3 py-1.5 rounded-lg bg-[#124734] text-white text-xs font-semibold hover:bg-[#0E3829]"
                        >
                          Lihat Sheets
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Branch Activity Progress */}
                      <div className="border border-[#124734]/12 rounded-2xl p-4 bg-[#F8F5ED]/40">
                        <span className="text-xs font-bold text-[#183C30] mb-3 block">
                          Tingkat Kepatuhan Rekap Harian PIC:
                        </span>
                        <div className="space-y-3">
                          {[
                            { name: 'Purwokerto (Rian & Nabila)', rate: 100 },
                            { name: 'Purbalingga (Fani)', rate: 86 },
                            { name: 'Cilacap (Dimas)', rate: 100 },
                            { name: 'Wonosobo (Anisa)', rate: 80 },
                            { name: 'Lunar Tegal (Yoga)', rate: 100 },
                          ].map((item) => (
                            <div key={item.name} className="space-y-1">
                              <div className="flex justify-between text-xs text-[#2D3A34]">
                                <span>{item.name}</span>
                                <span className="font-bold tabular-nums text-[#124734]">
                                  {item.rate}%
                                </span>
                              </div>
                              <div className="w-full bg-[#E5E0D5] h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-[#124734] h-full rounded-full transition-all duration-500"
                                  style={{ width: `${item.rate}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Strategic Summary */}
                      <div className="border border-[#124734]/12 rounded-2xl p-4 bg-[#F8F5ED]/40 flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-bold text-[#183C30] mb-2 block">
                            Fokus Strategis Wilayah Aktif:
                          </span>
                          <p className="text-xs text-[#5C6B64] leading-relaxed">
                            {currentBranch.focus}
                          </p>
                          <div className="mt-4 pt-3 border-t border-[#124734]/10 space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-[#5C6B64]">Akun Instagram:</span>
                              <span className="font-semibold text-[#183C30]">
                                {currentBranch.handle}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#5C6B64]">PIC Penanggung Jawab:</span>
                              <span className="font-semibold text-[#183C30]">
                                {currentBranch.picName}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#5C6B64]">Total Audience:</span>
                              <span className="font-semibold text-[#124734] tabular-nums">
                                {currentBranch.followersFormatted} Followers
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-[#124734]/10">
                          <span className="text-[11px] text-[#5C6B64]">
                            Disinkronkan otomatis dari Google Sheets & Meta Graph API
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 1: Top Reels & Konten */}
                {activeMiniTab === 1 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#183C30]">
                        Top 3 Reels dengan Retensi & Engagement Tertinggi:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleLaunchSystem(currentBranch.id, '/content')}
                        className="text-xs font-semibold text-[#124734] hover:underline flex items-center gap-1"
                      >
                        Buka Katalog 40 Konten <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                      {[
                        {
                          title: 'Rekomendasi Frame Titanium Anti-Patah',
                          branch: 'Purwokerto Pusat',
                          views: '128.4K',
                          likes: '4.8K',
                          er: '9.4%',
                          badge: 'Paling Banyak Disimpan',
                        },
                        {
                          title: 'Tes Lensa Bluecromic Outdoor vs Indoor',
                          branch: 'Purbalingga',
                          views: '44.2K',
                          likes: '2.1K',
                          er: '8.2%',
                          badge: 'Konversi Tertinggi',
                        },
                        {
                          title: 'Promo Barter Pelajar Kacamata Gratis',
                          branch: 'Cilacap',
                          views: '38.6K',
                          likes: '1.9K',
                          er: '7.9%',
                          badge: 'Viral Komunitas',
                        },
                      ].map((reel, idx) => (
                        <div
                          key={idx}
                          className="border border-[#124734]/15 rounded-2xl p-4 bg-[#F8F5ED]/50 hover:bg-[#F3EFE6] hover:border-[#124734]/30 transition-all duration-200"
                        >
                          <div className="inline-block px-2 py-0.5 rounded-full bg-[#124734]/10 text-[#124734] text-[10px] font-bold mb-2">
                            {reel.badge}
                          </div>
                          <h5 className="text-xs font-bold text-[#183C30] line-clamp-2 mb-1">
                            {reel.title}
                          </h5>
                          <span className="text-[11px] text-[#5C6B64] block mb-3">
                            {reel.branch}
                          </span>
                          <div className="pt-2 border-t border-[#124734]/10 flex items-center justify-between text-xs tabular-nums font-semibold text-[#183C30]">
                            <span>{reel.views} Views</span>
                            <span>{reel.likes} Likes</span>
                            <span className="text-[#16A34A]">{reel.er} ER</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 2: Radar Kompetitor */}
                {activeMiniTab === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#183C30]">
                        Radar Pemetaan 27 Kompetitor Retail & D2C Barlingmascakeb:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleLaunchSystem(currentBranch.id, '/competitors')}
                        className="text-xs font-semibold text-[#124734] hover:underline flex items-center gap-1"
                      >
                        Lihat 27 Kompetitor <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-[#124734]/15">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#F3EFE6] text-[#183C30] font-bold border-b border-[#124734]/12">
                          <tr>
                            <th className="p-3">Nama Kompetitor</th>
                            <th className="p-3">Kategori</th>
                            <th className="p-3">Harga Rata-rata</th>
                            <th className="p-3">Kelemahan Konten</th>
                            <th className="p-3">Peluang Optik I See You</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#124734]/10 bg-white">
                          {[
                            {
                              name: 'Optik Melawai PWT',
                              cat: 'Nasional / Korporat',
                              price: 'Rp 1.200K+',
                              weakness: 'Konten kaku, tidak relevan gen-Z',
                              usp: 'Fashion-forward, ramah pelajar, custom lens',
                            },
                            {
                              name: 'Optik Seis Rita Mall',
                              cat: 'Nasional / Mall',
                              price: 'Rp 1.500K+',
                              weakness: 'Jarang interaksi di Instagram',
                              usp: 'Reels edukasi lokal & diskon barter komunitas',
                            },
                            {
                              name: 'Optik Modern PWT',
                              cat: 'Lokal Tradisional',
                              price: 'Rp 350K - 700K',
                              weakness: 'Visual minim estetika lifestyle',
                              usp: 'Experience store modern + kacamata gratis barter',
                            },
                            {
                              name: 'SATURDAYS / Bridges',
                              cat: 'D2C Eyewear',
                              price: 'Rp 795K - 1.295K',
                              weakness: 'Tidak ada cabang fisik lokal',
                              usp: 'Layanan fisik langsung 20 menit jadi',
                            },
                          ].map((comp, idx) => (
                            <tr key={idx} className="hover:bg-[#F8F5ED]">
                              <td className="p-3 font-bold text-[#183C30]">{comp.name}</td>
                              <td className="p-3 text-[#5C6B64]">{comp.cat}</td>
                              <td className="p-3 tabular-nums font-semibold text-[#183C30]">
                                {comp.price}
                              </td>
                              <td className="p-3 text-[#5C6B64]">{comp.weakness}</td>
                              <td className="p-3 text-[#124734] font-semibold">{comp.usp}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB 3: Aftersales & Lensa */}
                {activeMiniTab === 3 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-[#183C30] block">
                          Proporsi Penjualan 4.106 Lensa Aftersales CRM:
                        </span>
                        <span className="text-[11px] text-[#5C6B64]">
                          Total Pasien Terdata: 4.106 Pasang Kacamata
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleLaunchSystem(currentBranch.id, '/aftersales')}
                        className="text-xs font-semibold text-[#124734] hover:underline flex items-center gap-1"
                      >
                        Kelola CRM Pasien <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        {
                          name: 'Lensa Bluray',
                          count: '2.393',
                          pct: '58.3%',
                          desc: 'Perlindungan radiasi gadget pelajar & pekerja kantor',
                          bg: 'bg-[#124734]',
                          color: 'text-[#124734]',
                        },
                        {
                          name: 'Lensa Photocromic',
                          count: '949',
                          pct: '23.1%',
                          desc: 'Transisi gelap saat terpapar sinar UV outdoor',
                          bg: 'bg-[#16A34A]',
                          color: 'text-[#16A34A]',
                        },
                        {
                          name: 'Lensa Bluecromic',
                          count: '764',
                          pct: '18.6%',
                          desc: 'Kombinasi proteksi bluray + transisi otomatis',
                          bg: 'bg-[#C88A35]',
                          color: 'text-[#C88A35]',
                        },
                      ].map((lens, idx) => (
                        <div
                          key={idx}
                          className="border border-[#124734]/15 rounded-2xl p-4 bg-[#F8F5ED]/40"
                        >
                          <span className="text-xs font-bold text-[#183C30] block">{lens.name}</span>
                          <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-[#183C30] tabular-nums">
                              {lens.count}
                            </span>
                            <span className={`text-xs font-bold tabular-nums ${lens.color}`}>
                              ({lens.pct})
                            </span>
                          </div>
                          <div className="w-full bg-[#E5E0D5] h-2 rounded-full overflow-hidden my-3">
                            <div
                              className={`${lens.bg} h-full rounded-full`}
                              style={{ width: lens.pct }}
                            />
                          </div>
                          <p className="text-[11px] text-[#5C6B64] leading-relaxed">{lens.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sandbox Footer Action CTA */}
              <div className="bg-[#F3EFE6] px-5 py-4 border-t border-[#124734]/12 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs text-[#5C6B64]">
                  Menampilkan data operasional aktual Optik I See You & Lunar Eyewear.
                </span>
                <button
                  type="button"
                  onClick={() => handleLaunchSystem(currentBranch.id)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-[#124734] hover:bg-[#0E3829] text-white text-xs font-bold shadow-sm transition-all"
                >
                  <span>Buka Workspace Cabang Ini</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: BENTO GRID INTERAKTIF (PANDANGAN YANG UTUH) */}
        <section id="bento-features" className="py-20 md:py-28 bg-[#F8F5ED]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-bold tracking-wider uppercase text-[#124734]">
                Arsitektur B2B Marketing Terpadu
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#183C30] mt-2 tracking-tight">
                Pekerjaan yang terhubung.<br />
                <span className="font-serif italic font-normal text-[#124734]">
                  Pandangan yang utuh.
                </span>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#5C6B64] leading-relaxed">
                Setiap data dari media sosial, tim cabang, hingga kemitraan dirangkai dalam satu
                sistem agar evaluasi mingguan berjalan objektif dan terukur.
              </p>
            </div>

            {/* BENTO GRID 3 BESAR + 2 PENDUKUNG */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* CARD 1: KONTEN & PERFORMA (Col-span 7) */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#124734]/15 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-[#124734] uppercase tracking-wider bg-[#124734]/8 px-3 py-1 rounded-full">
                      Modul 01 · Konten & Media
                    </span>
                    <span className="text-xs font-bold text-[#16A34A] flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                      Live Pulse
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-[#183C30]">
                    Reels & Story Pulse Tracker
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#5C6B64] leading-relaxed">
                    Pantau 40 konten aktif, metrik reach, shares, dan saves dari Instagram Meta
                    Graph tanpa perlu berpindah aplikasi.
                  </p>

                  {/* Interactive Filter Pills inside Card */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {[
                      { id: 'konten', label: 'Jurnal Konten', sub: '40 Reels' },
                      { id: 'sheets', label: 'Rekap Spreadsheet', sub: '6 PIC' },
                      { id: 'analytics', label: 'Analytics Meta', sub: 'Reach & ER' },
                      { id: 'social', label: 'Social Blade', sub: 'Realtime +1.4K' },
                    ].map((pill) => (
                      <button
                        key={pill.id}
                        type="button"
                        onClick={() => setActiveBentoFilter(pill.id as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                          activeBentoFilter === pill.id
                            ? 'bg-[#124734] text-white shadow-xs'
                            : 'bg-[#F3EFE6] text-[#2D3A34] hover:bg-[#E5E0D5]'
                        }`}
                      >
                        {pill.label}{' '}
                        <span className="text-[10px] opacity-80">({pill.sub})</span>
                      </button>
                    ))}
                  </div>

                  {/* Dynamic Preview Container */}
                  <div className="mt-5 p-4 rounded-2xl bg-[#F8F5ED] border border-[#124734]/10 text-xs">
                    {activeBentoFilter === 'konten' && (
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-[#183C30] block">
                            Top Performing Reel: Frame Titanium Anti-Patah
                          </span>
                          <span className="text-[#5C6B64]">
                            128.4K Views · 4.8K Likes · 9.4% ER
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-[#16A34A]/15 text-[#16A34A] font-bold text-[10px]">
                          Trending
                        </span>
                      </div>
                    )}
                    {activeBentoFilter === 'sheets' && (
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-[#183C30] block">
                            Status Sinkronisasi 6 PIC Cabang
                          </span>
                          <span className="text-[#5C6B64]">
                            Purwokerto, Purbalingga, Cilacap, Wonosobo, Tegal
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-[#124734]/15 text-[#124734] font-bold text-[10px]">
                          100% Synced
                        </span>
                      </div>
                    )}
                    {activeBentoFilter === 'analytics' && (
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-[#183C30] block">
                            Pertumbuhan Jangkauan (Reach)
                          </span>
                          <span className="text-[#5C6B64]">
                            +24.8% vs siklus sebelumnya di seluruh cabang
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-[#16A34A]/15 text-[#16A34A] font-bold text-[10px]">
                          +18.4K Reach
                        </span>
                      </div>
                    )}
                    {activeBentoFilter === 'social' && (
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-[#183C30] block">
                            Instagram Tracker Live
                          </span>
                          <span className="text-[#5C6B64]">
                            Total {branches[0]?.followersFormatted || '344.100'} Followers ({branches[0]?.growth || '+2.512 minggu ini'})
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-[#124734]/15 text-[#124734] font-bold text-[10px]">
                          Grade A-
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#124734]/10 flex items-center justify-between">
                  <span className="text-xs text-[#5C6B64]">
                    Modul terkait: Konten, Spreadsheet, Social Blade
                  </span>
                  <Link
                    href="/content"
                    className="text-xs font-bold text-[#124734] hover:underline flex items-center gap-1"
                  >
                    Buka Jurnal Konten <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* CARD 2: TIM & OPERASIONAL (Col-span 5) */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#124734]/15 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-[#124734] uppercase tracking-wider bg-[#124734]/8 px-3 py-1 rounded-full">
                      Modul 02 · Tim & Operasional
                    </span>
                    <span className="text-xs font-bold text-[#124734] tabular-nums">
                      {completedPics}/6 Selesai
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-[#183C30]">
                    Live Checklist 6 PIC
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#5C6B64] leading-relaxed">
                    Simulasi live checklist harian tiap PIC cabang. Klik centang untuk mencoba demo
                    interaktif:
                  </p>

                  {/* Interactive Checklist Simulation */}
                  <div className="mt-4 space-y-2">
                    {[
                      { id: 'rian', name: 'Rian (PWT Pusat)', task: 'Rekap Story & Lensa' },
                      { id: 'nabila', name: 'Nabila (PWT Pusat)', task: 'Jadwal Reels Baru' },
                      { id: 'fani', name: 'Fani (Purbalingga)', task: 'Story Promo Pelajar' },
                      { id: 'dimas', name: 'Dimas (Cilacap)', task: 'Follow-up Leads WA' },
                      { id: 'anisa', name: 'Anisa (Wonosobo)', task: 'Update Stok Frame' },
                      { id: 'yoga', name: 'Yoga (Lunar Tegal)', task: 'Kurasi High-End Frame' },
                    ].map((pic) => {
                      const isChecked = !!picChecklist[pic.id];
                      return (
                        <button
                          key={pic.id}
                          type="button"
                          onClick={() => toggleChecklist(pic.id)}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors text-left cursor-pointer ${
                            isChecked
                              ? 'bg-[#16A34A]/8 text-[#183C30]'
                              : 'bg-[#F8F5ED] text-[#5C6B64] hover:bg-[#F3EFE6]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isChecked ? (
                              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-[#5C6B64]/50 shrink-0" />
                            )}
                            <span className="font-semibold">{pic.name}</span>
                          </div>
                          <span className="text-[10px] text-[#5C6B64]">{pic.task}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#124734]/10 flex items-center justify-between">
                  <span className="text-xs text-[#5C6B64]">Terintegrasi Google Sheets</span>
                  <Link
                    href="/spreadsheet"
                    className="text-xs font-bold text-[#124734] hover:underline flex items-center gap-1"
                  >
                    Buka Spreadsheet <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* CARD 3: RISET & KEPUTUSAN (Col-span 4) */}
              <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-[#124734]/15 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-[#124734] uppercase tracking-wider bg-[#124734]/8 px-3 py-1 rounded-full">
                    Modul 03 · Riset Pasar
                  </span>
                  <h3 className="text-lg font-bold text-[#183C30] mt-3">
                    27 Kompetitor & 14 KOL
                  </h3>
                  <p className="mt-1 text-xs text-[#5C6B64] leading-relaxed">
                    Database intelijen 27 optik kompetitor di Barlingmascakeb + daftar 14 kreator
                    KOL lokal siap kolaborasi.
                  </p>
                  <div className="mt-4 p-3 rounded-2xl bg-[#F8F5ED] space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#5C6B64]">Total Kompetitor:</span>
                      <span className="font-bold text-[#183C30] tabular-nums">27 Brand</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5C6B64]">Database KOL Lokal:</span>
                      <span className="font-bold text-[#183C30] tabular-nums">14 Kreator</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5C6B64]">Database Venue Acara:</span>
                      <span className="font-bold text-[#124734] tabular-nums">17 Lokasi</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#124734]/10">
                  <Link
                    href="/competitors"
                    className="text-xs font-bold text-[#124734] hover:underline flex items-center justify-between"
                  >
                    <span>Eksplorasi Radar Kompetitor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* CARD 4: KEMITRAAN & SPONSOR B2B (Col-span 4) */}
              <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-[#124734]/15 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-[#124734] uppercase tracking-wider bg-[#124734]/8 px-3 py-1 rounded-full">
                    Modul 04 · Kemitraan B2B
                  </span>
                  <h3 className="text-lg font-bold text-[#183C30] mt-3">
                    11 Sponsor Leads & Barter
                  </h3>
                  <p className="mt-1 text-xs text-[#5C6B64] leading-relaxed">
                    Skema penawaran B2B: Barter 10 voucher Rp50rb + 10 voucher kacamata gratis untuk
                    event Creative Content Masterclass.
                  </p>
                  <div className="mt-4 p-3 rounded-2xl bg-[#F8F5ED] space-y-1.5 text-xs">
                    <div className="flex justify-between font-medium">
                      <span className="text-[#5C6B64]">Leads Aktif:</span>
                      <span className="text-[#183C30]">Baby Glows, Navagreen, Inul Vizta</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5C6B64]">Skema Barter:</span>
                      <span className="font-bold text-[#16A34A]">10x 50rb + 10 Kacamata</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#124734]/10">
                  <Link
                    href="/pengajuan"
                    className="text-xs font-bold text-[#124734] hover:underline flex items-center justify-between"
                  >
                    <span>Buka Generator Pitching WA</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* CARD 5: AFTERSALES CRM INTELLIGENCE (Col-span 4) */}
              <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-[#124734]/15 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-[#124734] uppercase tracking-wider bg-[#124734]/8 px-3 py-1 rounded-full">
                    Modul 05 · Aftersales CRM
                  </span>
                  <h3 className="text-lg font-bold text-[#183C30] mt-3">
                    4.106 Pasien & Garansi Lensa
                  </h3>
                  <p className="mt-1 text-xs text-[#5C6B64] leading-relaxed">
                    Database rekap pelanggan lensa Bluray, Photocromic, dan Bluecromic disertai
                    reminder otomatis kenyamanan penglihatan.
                  </p>
                  <div className="mt-4 p-3 rounded-2xl bg-[#F8F5ED] space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#5C6B64]">Lensa Bluray:</span>
                      <span className="font-bold text-[#183C30] tabular-nums">2.393 (58.3%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5C6B64]">Photocromic:</span>
                      <span className="font-bold text-[#183C30] tabular-nums">949 (23.1%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5C6B64]">Bluecromic:</span>
                      <span className="font-bold text-[#183C30] tabular-nums">764 (18.6%)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#124734]/10">
                  <Link
                    href="/aftersales"
                    className="text-xs font-bold text-[#124734] hover:underline flex items-center justify-between"
                  >
                    <span>Kelola Data Aftersales</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: QUICK-LAUNCH WORKSPACE SELECTOR */}
        <section id="quick-launch" className="py-20 md:py-24 bg-[#124734] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5">
                <span className="text-xs font-bold tracking-wider uppercase text-[#16A34A] bg-[#16A34A]/20 px-3 py-1 rounded-full">
                  Pintu Masuk Terpadu
                </span>
                <h2 className="text-3xl sm:text-4xl font-semibold mt-4 tracking-tight leading-tight">
                  Lebih sedikit langkah.<br />
                  <span className="font-serif italic font-normal text-[#F3EFE6]/90">
                    Lebih banyak fokus.
                  </span>
                </h2>
                <p className="mt-4 text-sm text-[#F3EFE6]/80 leading-relaxed">
                  Pilih fokus cabang dan modul tujuan kerja Anda. Preferensi akan diingat di browser
                  perangkat ini agar kunjungan berikutnya langsung membuka konteks yang relevan.
                </p>
                <div className="mt-6 flex items-center gap-3 text-xs text-[#F3EFE6]/70">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  <span>Tanpa perlu membuat akun baru atau kata sandi berulang</span>
                </div>
              </div>

              {/* Quick Launch Interactive Selector Card */}
              <div className="lg:col-span-7 bg-white text-[#183C30] rounded-3xl p-6 sm:p-8 shadow-2xl">
                <h3 className="text-xl font-bold mb-1">Quick-Launch Selector</h3>
                <p className="text-xs text-[#5C6B64] mb-5">
                  Tentukan cabang dan modul awal sebelum masuk ke dashboard:
                </p>

                <div className="space-y-4">
                  {/* Select Branch */}
                  <div>
                    <label className="text-xs font-bold text-[#183C30] block mb-1.5">
                      1. Pilih Fokus Wilayah Cabang:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {branches.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setLauncherBranch(b.id)}
                          className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all border cursor-pointer ${
                            launcherBranch === b.id
                              ? 'bg-[#124734] text-white border-[#124734] shadow-xs'
                              : 'bg-[#F8F5ED] text-[#2D3A34] border-[#124734]/15 hover:border-[#124734]/30'
                          }`}
                        >
                          <span className="block truncate">{b.name}</span>
                          <span className="text-[10px] opacity-75 block truncate">
                            {b.id === 'all' ? '5 Wilayah' : b.handle}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Select Target Module */}
                  <div>
                    <label className="text-xs font-bold text-[#183C30] block mb-1.5">
                      2. Pilih Modul Awal:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {TARGET_MODULES.map((mod) => (
                        <button
                          key={mod.id}
                          type="button"
                          onClick={() => setLauncherModule(mod.id)}
                          className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all border cursor-pointer ${
                            launcherModule === mod.id
                              ? 'bg-[#124734] text-white border-[#124734] shadow-xs'
                              : 'bg-[#F8F5ED] text-[#2D3A34] border-[#124734]/15 hover:border-[#124734]/30'
                          }`}
                        >
                          <span className="block truncate">{mod.label}</span>
                          <span className="text-[9px] opacity-75 block truncate">{mod.detail}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Remember Device Option */}
                  <label className="flex items-center gap-2 pt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberPreference}
                      onChange={(e) => setRememberPreference(e.target.checked)}
                      className="w-4 h-4 rounded text-[#124734] focus:ring-[#124734]"
                    />
                    <span className="text-xs text-[#5C6B64]">
                      Ingat preferensi cabang di perangkat ini
                    </span>
                  </label>

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={() => handleLaunchSystem()}
                    className="w-full py-3.5 px-6 rounded-full bg-[#124734] hover:bg-[#0E3829] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Masuk ke Sistem Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: INTERACTIVE NETWORK MAP / BRANCH SWITCHER CARDS */}
        <section id="branch-network" className="py-20 md:py-28 bg-[#F8F5ED]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold tracking-wider uppercase text-[#124734]">
                Jaringan Tersebar, Standar Terpusat
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#183C30] mt-2 tracking-tight">
                Dekat dengan{' '}
                <span className="font-serif italic font-normal text-[#124734]">
                  setiap cabang.
                </span>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#5C6B64] leading-relaxed">
                Empat cabang Optik I See You dan satu butik Lunar Eyewear Tegal. Pantau dinamika
                pasar lokal masing-masing wilayah secara presisi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches.slice(1).map((branch) => (
                <div
                  key={branch.id}
                  className="bg-white rounded-3xl p-6 border border-[#124734]/15 shadow-sm hover:shadow-md hover:border-[#124734]/35 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-[#124734] bg-[#124734]/8 px-2.5 py-1 rounded-full">
                        {branch.subtitle}
                      </span>
                      <span className="text-xs font-bold text-[#16A34A] tabular-nums">
                        {branch.growth}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#183C30]">{branch.name}</h3>
                    <a
                      href={`https://instagram.com/${branch.handle.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#124734] font-semibold hover:underline inline-flex items-center gap-1 mt-0.5"
                    >
                      {branch.handle} <ExternalLink className="w-3 h-3" />
                    </a>

                    <p className="mt-3 text-xs text-[#5C6B64] leading-relaxed">{branch.focus}</p>

                    <div className="mt-4 pt-4 border-t border-[#124734]/10 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[#5C6B64]">Followers:</span>
                        <span className="font-bold text-[#183C30] tabular-nums">
                          {branch.followersFormatted}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5C6B64]">Produksi Reels:</span>
                        <span className="font-bold text-[#183C30] tabular-nums">
                          {branch.reelsCount} Reels (ER {branch.engagementRate})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5C6B64]">PIC Cabang:</span>
                        <span className="font-semibold text-[#183C30]">{branch.picName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#124734]/10">
                    <button
                      type="button"
                      onClick={() => handleLaunchSystem(branch.id)}
                      className="w-full py-2.5 px-4 rounded-full bg-[#F3EFE6] hover:bg-[#124734] text-[#183C30] hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Buka Workspace Cabang Ini</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* CARD NETWORK TOTAL SUMMARY */}
              <div className="bg-[#F3EFE6] rounded-3xl p-6 border border-[#124734]/20 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#124734] bg-[#124734]/12 px-2.5 py-1 rounded-full">
                      Konsolidasi Seluruh Jaringan
                    </span>
                    <span className="text-xs font-bold text-[#16A34A]">5 Cabang Aktif</span>
                  </div>

                  <h3 className="text-xl font-bold text-[#183C30]">Total Ekosistem</h3>
                  <span className="text-xs text-[#5C6B64] block mt-0.5">
                    Optik I See You & Lunar Eyewear
                  </span>

                  <div className="mt-5 space-y-3">
                    <div className="p-3 bg-white rounded-2xl border border-[#124734]/10">
                      <span className="text-[10px] uppercase font-bold text-[#5C6B64] block">
                        Total Followers Media Sosial
                      </span>
                      <span className="text-2xl font-bold text-[#183C30] tabular-nums">
                        {branches[0]?.followersFormatted || '344.100'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-white rounded-xl border border-[#124734]/10">
                        <span className="text-[10px] text-[#5C6B64] block">Total Reels</span>
                        <span className="font-bold text-[#183C30] tabular-nums">
                          {branches[0]?.reelsCount || 40} Konten
                        </span>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-[#124734]/10">
                        <span className="text-[10px] text-[#5C6B64] block">PIC Terdata</span>
                        <span className="font-bold text-[#183C30] tabular-nums">
                          {branches[0]?.picName || '6 Penanggung Jawab'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#124734]/15">
                  <button
                    type="button"
                    onClick={() => handleLaunchSystem('all')}
                    className="w-full py-2.5 px-4 rounded-full bg-[#124734] hover:bg-[#0E3829] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>Masuk ke Seluruh Jaringan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: FINAL CTA */}
        <section className="py-20 md:py-24 bg-[#F8F5ED] border-t border-[#124734]/10 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold tracking-wider uppercase text-[#124734]">
              I See You Intelligence
            </span>
            <h2 className="text-4xl sm:text-5xl font-semibold text-[#183C30] mt-3 tracking-tight">
              Workspace Anda.<br />
              <span className="font-serif italic font-normal text-[#124734]">
                Siap dilanjutkan.
              </span>
            </h2>
            <p className="mt-4 text-base text-[#5C6B64] max-w-xl mx-auto">
              Akses seluruh 10 modul pemasaran, analitik, dan manajemen tim marketing Optik I See
              You dalam satu langkah.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleLaunchSystem()}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#124734] hover:bg-[#0E3829] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Masuk ke Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                href="/proposal-sponsor"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-[#F3EFE6] text-[#183C30] text-sm font-semibold border border-[#124734]/15 transition-all"
              >
                Lihat Proposal Sponsor B2B
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#124734]/12 bg-[#F3EFE6] py-12 text-xs text-[#5C6B64]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-isy-dark.png"
              alt="Optik I See You"
              className="h-6 w-auto object-contain"
            />
            <div className="border-l border-[#124734]/20 pl-3">
              <span className="font-bold text-[#183C30] block">
                Optik I See You & Lunar Eyewear
              </span>
              <span>Marketing Intelligence Executive Command Center</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/proposal-sponsor" className="hover:text-[#124734] hover:underline">
              Proposal Sponsor
            </Link>
            <a href="#hero-sandbox" className="hover:text-[#124734] hover:underline">
              Kembali ke Atas
            </a>
            <span className="text-[#16A34A] font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              Live Sync Active
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
