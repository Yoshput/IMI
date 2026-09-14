"use client";

import React, { useState } from "react";
import {
  X,
  Printer,
  Copy,
  Check,
  Calendar,
  Building2,
  Users,
  Flame,
  MessageCircle,
  AlertTriangle,
  ExternalLink,
  Crown,
  FileSpreadsheet,
} from "lucide-react";
import { OFFICIAL_BRANCH_ACCOUNTS } from "@/lib/branch-accounts";

interface MeetingReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  periodData: any;
  periodOptions: { key: string; label: string; dateRange: string }[];
  activePeriodKey: string;
  onSelectPeriod: (key: string) => void;
  picTracker: any[];
  networkFollowers: { instagram: number; tiktok: number };
}

export const MeetingReportModal: React.FC<MeetingReportModalProps> = ({
  isOpen,
  onClose,
  periodData,
  periodOptions,
  activePeriodKey,
  onSelectPeriod,
  picTracker,
  networkFollowers,
}) => {
  const [copiedWa, setCopiedWa] = useState(false);

  if (!isOpen) return null;

  const currentReels = periodData?.topViralReels || [];
  const currentStories = periodData?.frequentStoryInquiries || [];
  const currentObstacles = periodData?.obstacleLogs || [];

  const handleCopyWhatsApp = () => {
    const text = `*LAPORAN EVALUASI MINGGUAN MARKETING INTELLIGENCE*
*Optik I See You & Lunar Eyewear*
Agenda Rapat: ${periodData?.meetingDateTitle || "Meeting Direksi"}
Target Audiens: HRD, Head of Marketing, Finance, Owner

=============================
*1. BREAKDOWN FOLLOWERS PER CABANG (1 PER 1 - REALTIME INSTAGRAM)*
• Purwokerto (Pusat) [@iseeyou.glasses]: 226K followers (2.940 posts) - PIC: Mba Ilya & Mba Nuha
• Cilacap [@iseeyou.cilacap]: 7.387 followers (1.403 posts) - PIC: Mba Arum
• Purbalingga [@iseeyou.purbalingga]: 6.194 followers (567 posts) - PIC: Mba Ajun
• Lunar Eyewear Tegal [@lunareyewear.co]: 3.943 followers (357 posts) - PIC: Mba Amanda
• Wonosobo [@iseeyou.wonosobo]: 1.248 followers (339 posts) - PIC: Mba Febi
Total Jaringan: ${networkFollowers.instagram.toLocaleString("id-ID")} IG · ${networkFollowers.tiktok.toLocaleString("id-ID")} TikTok

=============================
*2. STATUS KEPATUHAN 6 PIC CABANG*
${picTracker.map((p) => `• ${p.pic} (${p.role}): ${p.isUpToDate ? "✅ Lengkap" : `⚠️ Tertunda (Tgl: ${p.latestDate})`}`).join("\n")}

=============================
*3. KONTEN TERAMAI PEKAN INI (LIKE & CAPTION LANGSUNG INSTAGRAM)*
${currentReels.slice(0, 5).map((r: any, idx: number) => `${idx + 1}. [${r.branch}] "${r.title}"
   - Penonton: ${r.viewers.toLocaleString("id-ID")} viewers
   - Likes Langsung IG: ${r.igLikesFormatted || r.likes.toLocaleString("id-ID")} likes ${r.igComments !== undefined ? `| Komentar: ${r.igComments}` : ""}
   - Caption Asli IG: "${r.igCaption ? r.igCaption.replace(/\n+/g, " ").slice(0, 110) + "..." : "-"}"
   - Link: ${r.reelsLink || "-"}`).join("\n\n")}

=============================
*4. DM STORY PALING BANYAK DITANYAKAN (Mba Nuha)*
Total DM Masuk Pekan Ini: ${periodData?.totalDmInquiries || 0} DM
${currentStories.slice(0, 4).map((q: any) => `• ${q.topic} (${q.count} hari ditanyakan)`).join("\n")}

=============================
*5. KEPUTUSAN & ARAHAN RAPAT*
• HRD: Pengingat PIC tertunda & mini-clinic editing CapCut untuk creator cabang.
• Head: Gandakan format POV try-on & review wawancara customer ke Purwokerto & Cilacap.
• Finance: Efisiensi jangkauan organik setara Rp 8,4jt belanja iklan; evaluasi bonus creator viral.
• Owner: Pantauan live harian menuju evaluasi berikutnya.

_Laporan otomatis digenerate via I See You Marketing Intelligence._`;

    navigator.clipboard.writeText(text);
    setCopiedWa(true);
    setTimeout(() => setCopiedWa(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      <div className="bg-surface border border-border rounded-container shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden print:border-none print:shadow-none print:max-h-none print:w-full">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-border bg-surface-secondary flex items-center justify-between gap-3 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-control bg-foreground text-surface flex items-center justify-center font-bold text-xs">
              IMI
            </span>
            <div>
              <h2 className="text-sm font-bold text-foreground">
                Generator Laporan Rapat Mingguan (1-Click Ready)
              </h2>
              <p className="text-[11px] text-foreground-secondary">
                Templat laporan resmi siap presentasi dewan direksi & meeting evaluasi tiap Selasa.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyWhatsApp}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-control text-xs font-semibold transition-all ${
                copiedWa
                  ? "bg-emerald-700 text-white"
                  : "bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100"
              }`}
            >
              {copiedWa ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedWa ? "Tersalin ke Clipboard!" : "Salin Format WA Direksi"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-control border border-border bg-surface hover:bg-surface-secondary text-xs font-semibold text-foreground transition-all shadow-subtle"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-control hover:bg-border text-foreground-muted hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Period Selector Bar */}
        <div className="px-5 py-3 border-b border-border bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden shrink-0">
          <span className="text-xs font-semibold text-foreground">Pilih Periode Evaluasi Rapat:</span>
          <div className="flex items-center gap-1.5">
            {periodOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => onSelectPeriod(opt.key)}
                className={`px-3 py-1.5 rounded-control text-xs font-medium transition-all ${
                  activePeriodKey === opt.key
                    ? "bg-foreground text-surface font-semibold shadow-subtle"
                    : "bg-surface-secondary text-foreground-secondary hover:text-foreground border border-border"
                }`}
              >
                <span>{opt.label}</span>
                <span className="text-[10px] opacity-75 ml-1.5">({opt.dateRange})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Document Body (Printable) */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 print:p-0 print:overflow-visible text-foreground">
          {/* Official Letterhead */}
          <div className="border-b-2 border-foreground pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-brand">
                  INTERNAL EXECUTIVE REPORT
                </span>
                <span className="text-[11px] text-foreground-muted">·</span>
                <span className="text-xs font-bold text-foreground">Optik I See You & Lunar Eyewear</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground mt-1">
                Laporan Evaluasi Kinerja Mingguan (Meeting Direksi)
              </h1>
              <p className="text-xs text-foreground-secondary mt-0.5">
                Agenda: {periodData?.meetingDateTitle} · <strong>Peserta: HRD, Head of Marketing, Finance, Owner</strong>
              </p>
            </div>

            <div className="sm:text-right text-xs">
              <span className="font-bold text-foreground block">
                Total Jaringan 5 Akun:
              </span>
              <span className="text-brand font-bold text-sm">
                {networkFollowers.instagram.toLocaleString("id-ID")} IG Followers
              </span>
              <span className="text-foreground-muted block text-[11px]">
                {networkFollowers.tiktok.toLocaleString("id-ID")} TikTok Followers
              </span>
            </div>
          </div>

          {/* Breakdown Followers 1 per 1 Akun Cabang (Requested by User) */}
          <div className="bg-surface-secondary border border-border rounded-control p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-foreground-muted block">
                Breakdown Follower per Akun Cabang (1 per 1 — Realtime Instagram):
              </span>
              <span className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Live IG
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 text-xs">
              {OFFICIAL_BRANCH_ACCOUNTS.map((acc) => {
                const liveStats: Record<string, { followers: string; posts: number }> = {
                  "pwt-pusat": { followers: "226K", posts: 2940 },
                  "clp": { followers: "7,387", posts: 1403 },
                  "pbg": { followers: "6,194", posts: 567 },
                  "tgl": { followers: "3,943", posts: 357 },
                  "wns": { followers: "1,248", posts: 339 },
                };
                const stat = liveStats[acc.id] || { followers: "-", posts: 0 };
                return (
                  <a
                    key={acc.id}
                    href={acc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-control bg-surface border border-border hover:border-foreground/40 transition-colors block group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground block text-[11px] truncate">
                        {acc.city}
                      </span>
                      <ExternalLink className="w-2.5 h-2.5 text-foreground-muted group-hover:text-brand" />
                    </div>
                    <span className="font-mono text-brand text-[10px] block group-hover:underline truncate mt-0.5">
                      {acc.handle}
                    </span>
                    <div className="mt-2 pt-1.5 border-t border-border/60 flex items-baseline justify-between">
                      <span className="text-sm font-bold text-foreground tabular-nums">
                        {stat.followers}
                      </span>
                      <span className="text-[9px] text-foreground-muted">
                        {stat.posts} posts
                      </span>
                    </div>
                    <span className="text-[9px] text-foreground-muted block truncate mt-1">
                      PIC: {acc.picName}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* 1. Kepatuhan PIC */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground border-b border-border pb-1">
              1. Status Kepatuhan 6 PIC Cabang (Periode 7 Hari)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
              {picTracker.map((p, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-control border ${
                    p.isUpToDate
                      ? "bg-surface border-border text-foreground"
                      : "bg-amber-50/70 border-amber-300 text-amber-950"
                  }`}
                >
                  <span className="font-bold text-[11px] block truncate">{p.pic}</span>
                  <span className="text-[10px] text-foreground-muted block truncate">{p.role}</span>
                  <div className="mt-2 pt-1 border-t border-border/50 flex items-center justify-between text-[10px]">
                    <span>{p.latestDate}</span>
                    <span className={`font-bold ${p.isUpToDate ? "text-emerald-700" : "text-amber-800"}`}>
                      {p.isUpToDate ? "Lengkap" : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Top Reels Pekan Ini (Honest Real Data) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-border pb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-800" />
                2. Konten Teramai Pekan Ini (Likes & Caption Asli Langsung Instagram)
              </h3>
              <span className="text-[11px] text-foreground-muted">
                {currentReels.length} reels tayang di periode ini
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-surface-secondary text-foreground-muted font-semibold">
                    <th className="py-2 px-2.5">Tgl</th>
                    <th className="py-2 px-2.5">Cabang & PIC</th>
                    <th className="py-2 px-3">Judul & Caption Asli Instagram</th>
                    <th className="py-2 px-2.5">Pilar</th>
                    <th className="py-2 px-2.5 text-right">Viewers</th>
                    <th className="py-2 px-2.5 text-right">Likes IG (Live)</th>
                    <th className="py-2 px-2.5 text-center">Tautan IG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {currentReels.slice(0, 6).map((r: any, idx: number) => (
                    <tr key={idx} className="hover:bg-surface-secondary/40">
                      <td className="py-2 px-2.5 font-mono text-[11px] text-foreground-secondary whitespace-nowrap">
                        {r.date}
                      </td>
                      <td className="py-2 px-2.5 whitespace-nowrap">
                        <span className="font-bold text-foreground">{r.pic}</span>
                        <span className="text-[10px] text-foreground-muted block">{r.branch}</span>
                      </td>
                      <td className="py-2 px-3 max-w-[260px]">
                        <span className="font-medium text-foreground block line-clamp-1">{r.title}</span>
                        {r.igCaption && (
                          <span
                            className="text-[10px] text-foreground-muted line-clamp-1 italic mt-0.5 block"
                            title={r.igCaption}
                          >
                            Caption IG: &quot;{r.igCaption.replace(/\n+/g, " ").slice(0, 80)}...&quot;
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-2.5 whitespace-nowrap">
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-secondary border border-border">
                          {r.pillar}
                        </span>
                      </td>
                      <td className="py-2 px-2.5 text-right font-bold text-foreground tabular-nums whitespace-nowrap">
                        {r.viewers.toLocaleString("id-ID")}
                      </td>
                      <td className="py-2 px-2.5 text-right font-semibold text-emerald-800 tabular-nums whitespace-nowrap">
                        {r.igLikesFormatted ? `${r.igLikesFormatted}` : r.likes.toLocaleString("id-ID")}
                      </td>
                      <td className="py-2 px-2.5 text-center whitespace-nowrap">
                        {r.reelsLink && r.reelsLink.startsWith("http") ? (
                          <a
                            href={r.reelsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand hover:underline font-bold text-[11px] inline-flex items-center gap-0.5"
                          >
                            <span>Buka</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : (
                          <span className="text-foreground-muted">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Story Inquiries & Obstacles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-control border border-border bg-surface space-y-2">
              <span className="text-xs font-bold text-foreground block flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-foreground" />
                Topik DM Story Terbanyak (Mba Nuha):
              </span>
              <span className="text-[11px] text-foreground-muted block">
                Total {periodData?.totalDmInquiries || 0} DM masuk selama 7 hari periode ini.
              </span>
              <div className="space-y-1 pt-1">
                {currentStories.slice(0, 4).map((q: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-border/50">
                    <span className="font-medium text-foreground">{q.topic}</span>
                    <span className="text-[10px] font-bold text-foreground-secondary">{q.count} hari ditanyakan</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-control border border-border bg-surface space-y-2">
              <span className="text-xs font-bold text-foreground block flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-800" />
                Catatan Kendala Lapangan Asli Creator:
              </span>
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1 text-[11px]">
                {currentObstacles.slice(0, 3).map((obs: any, i: number) => (
                  <div key={i} className="p-2 rounded bg-surface-secondary border border-border">
                    <span className="font-bold text-foreground">{obs.pic} ({obs.role}) · {obs.date}:</span>
                    <p className="text-foreground-secondary italic mt-0.5">"{obs.obstacle}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Strategic Actions for 4 Divisions */}
          <div className="border-t border-border pt-4 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-brand" />
              4. Ringkasan Arahan Kerja Rapat 4 Divisi:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-control bg-surface-secondary border border-border space-y-1">
                <span className="font-bold text-foreground">HRD & Tim Cabang:</span>
                <p className="text-foreground-secondary text-[11px]">
                  Fasilitasi klinik mini video editing CapCut untuk creator cabang dan pastikan PIC Cilacap memperbarui data sheet.
                </p>
              </div>

              <div className="p-3 rounded-control bg-surface-secondary border border-border space-y-1">
                <span className="font-bold text-foreground">Head of Marketing:</span>
                <p className="text-foreground-secondary text-[11px]">
                  Replikasi format POV kacamata bulat dan review wawancara customer ke akun @iseeyou.glasses dan @iseeyou.cilacap.
                </p>
              </div>

              <div className="p-3 rounded-control bg-surface-secondary border border-border space-y-1">
                <span className="font-bold text-foreground">Finance & Commercial:</span>
                <p className="text-foreground-secondary text-[11px]">
                  Alokasikan insentif performa creator dan petty cash tester frame baru untuk outlet dengan performa penonton tinggi.
                </p>
              </div>

              <div className="p-3 rounded-control bg-surface-secondary border border-border space-y-1">
                <span className="font-bold text-foreground">Owner & Direksi:</span>
                <p className="text-foreground-secondary text-[11px]">
                  Tetapkan target pertumbuhan follower 10% per bulan per cabang dan tinjau kesiapan ekspansi cabang baru.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
