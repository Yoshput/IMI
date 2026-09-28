 "use client";

import React, { useState, useEffect } from "react";
import {
  Coins,
  CheckCircle2,
  XCircle,
  Copy,
  MessageCircle,
  Phone,
  Calendar,
  AlertCircle,
  Check,
  RotateCcw,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

export interface KasPicMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  waNumber: string;
}

export const MARKETING_PURWOKERTO_PICS: KasPicMember[] = [
  {
    id: "raja",
    name: "Raja Satria",
    role: "Head Marketing of Content",
    phone: "+62 813-8848-609",
    waNumber: "628138848609",
  },
  {
    id: "reels-pic",
    name: "PIC Reels (Ilya)",
    role: "Reels PIC & Talent",
    phone: "+62 822-2514-2833",
    waNumber: "6282225142833",
  },
  {
    id: "story-pic",
    name: "Nuha (Story PIC)",
    role: "Story PIC & Engagement",
    phone: "+62 823-2086-7641",
    waNumber: "6282320867641",
  },
  {
    id: "yanuar",
    name: "Yanuar",
    role: "Design Grafis I See You",
    phone: "+62 838-7119-3462",
    waNumber: "6283871193462",
  },
  {
    id: "renra",
    name: "Renra",
    role: "Aftersales Specialist",
    phone: "+62 878-2600-8866",
    waNumber: "6287826008866",
  },
  {
    id: "yossika",
    name: "Yossika",
    role: "Marketing Staff & Coordinator",
    phone: "+62 877-7868-3766",
    waNumber: "6287778683766",
  },
];

const WEEKS_SEPTEMBER = [
  { id: "w1", label: "Minggu 1 (1–7 Sep 2026)" },
  { id: "w2", label: "Minggu 2 (8–14 Sep 2026)" },
  { id: "w3", label: "Minggu 3 (15–21 Sep 2026)" },
  { id: "w4", label: "Minggu 4 (22–28 Sep 2026) — Berjalan" },
];

const STORAGE_KEY = "kas_marketing_pwt_v1";

export const KasMarketingPurwokertoCard: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState<string>("w4");
  const [paymentState, setPaymentState] = useState<Record<string, Record<string, boolean>>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    // Default initial state: w1, w2, w3 mostly paid, w4 currently in collection
    return {
      w1: { raja: true, "reels-pic": true, "story-pic": true, yanuar: true, renra: true, yossika: true },
      w2: { raja: true, "reels-pic": true, "story-pic": true, yanuar: true, renra: true, yossika: true },
      w3: { raja: true, "reels-pic": true, "story-pic": true, yanuar: true, renra: false, yossika: true },
      w4: { raja: true, "reels-pic": true, "story-pic": false, yanuar: true, renra: false, yossika: true },
    };
  });

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(paymentState));
    } catch (e) {
      // ignore
    }
  }, [paymentState]);

  const togglePayment = (weekId: string, memberId: string) => {
    setPaymentState((prev) => {
      const weekData = prev[weekId] || {};
      const current = !!weekData[memberId];
      return {
        ...prev,
        [weekId]: {
          ...weekData,
          [memberId]: !current,
        },
      };
    });
  };

  const markAll = (weekId: string, status: boolean) => {
    setPaymentState((prev) => {
      const updatedWeek: Record<string, boolean> = {};
      MARKETING_PURWOKERTO_PICS.forEach((m) => {
        updatedWeek[m.id] = status;
      });
      return {
        ...prev,
        [weekId]: updatedWeek,
      };
    });
  };

  // Calculations
  const currentWeekPayments = paymentState[selectedWeek] || {};
  const paidCountInSelectedWeek = MARKETING_PURWOKERTO_PICS.filter((m) => currentWeekPayments[m.id]).length;
  const totalPicCount = MARKETING_PURWOKERTO_PICS.length;
  const kasRatePerWeek = 5000;
  const collectedInSelectedWeek = paidCountInSelectedWeek * kasRatePerWeek;
  const targetInSelectedWeek = totalPicCount * kasRatePerWeek;

  // Monthly totals across all 4 weeks
  let totalMonthlyCollected = 0;
  WEEKS_SEPTEMBER.forEach((w) => {
    const wp = paymentState[w.id] || {};
    MARKETING_PURWOKERTO_PICS.forEach((m) => {
      if (wp[m.id]) totalMonthlyCollected += kasRatePerWeek;
    });
  });

  const getWaReminderUrl = (member: KasPicMember, weekLabel: string) => {
    const message = `Halo Kak ${member.name}, salam semangat dari tim Marketing Purwokerto! 🙏🏼\n\nSekadar pengingat ramah untuk uang kas mingguan tim Marketing (Rp 5.000) periode *${weekLabel}* yaa.\n\nBisa langsung diserahkan atau transfer ke bendahara kas. Terima kasih banyak atas kerja sama dan dukungannya! ✨`;
    return `https://wa.me/${member.waNumber}?text=${encodeURIComponent(message)}`;
  };

  const handleCopyRecapGroup = () => {
    const weekObj = WEEKS_SEPTEMBER.find((w) => w.id === selectedWeek) || WEEKS_SEPTEMBER[3];
    const paidMembers = MARKETING_PURWOKERTO_PICS.filter((m) => currentWeekPayments[m.id]);
    const unpaidMembers = MARKETING_PURWOKERTO_PICS.filter((m) => !currentWeekPayments[m.id]);

    const text = `💰 *REKAP UANG KAS TIM MARKETING PURWOKERTO (6 PIC)*
📅 Periode: *${weekObj.label}*
💵 Tarif Kas: Rp 5.000 / PIC / Minggu
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 *STATUS PEMBAYARAN:*
• Terkumpul: Rp ${collectedInSelectedWeek.toLocaleString("id-ID")} / Rp ${targetInSelectedWeek.toLocaleString("id-ID")} (${paidCountInSelectedWeek}/${totalPicCount} PIC)
• Total Saldo Kas Terkumpul Bulan September: *Rp ${totalMonthlyCollected.toLocaleString("id-ID")}*

✅ *SUDAH BAYAR (LUNAS):*
${paidMembers.length > 0 ? paidMembers.map((m, i) => `${i + 1}. ${m.name} (${m.role})`).join("\n") : "- Belum ada"}

⏳ *BELUM BAYAR:*
${unpaidMembers.length > 0 ? unpaidMembers.map((m, i) => `${i + 1}. ${m.name} (${m.phone})`).join("\n") : "✨ Alhamdulillah semua PIC sudah lunas!"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_Catatan: Uang kas digunakan untuk keperluan operasional tim kreatif, snack rapat mingguan, dan kebutuhan tim marketing Optik I See You Purwokerto._`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-subtle space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
              <Coins className="w-3 h-3 text-amber-600" />
              <span>KAS MARKETING PURWOKERTO</span>
            </span>
            <span className="text-xs text-foreground-muted">
              6 PIC · Rp 5.000 / Minggu / PIC
            </span>
          </div>
          <h2 className="text-base font-bold text-foreground">
            Buku Kas Mingguan Tim Marketing Optik I See You
          </h2>
          <p className="text-xs text-foreground-muted">
            Monitoring penarikan iuran kas mingguan untuk 6 PIC Marketing Purwokerto (Head, Reels, Story, Desain Grafis, Aftersales, dan Koordinator).
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyRecapGroup}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface-secondary text-xs font-semibold text-foreground hover:bg-surface-secondary/80 transition-all shadow-subtle"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 font-bold">Rekap Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Rekap WA Group</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Week Selector Tabs & Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-3 flex items-center gap-1.5 p-1 bg-surface-secondary rounded-xl border border-border overflow-x-auto">
          {WEEKS_SEPTEMBER.map((w) => {
            const isSelected = selectedWeek === w.id;
            const weekPayments = paymentState[w.id] || {};
            const count = MARKETING_PURWOKERTO_PICS.filter((m) => weekPayments[m.id]).length;
            const isAllPaid = count === totalPicCount;

            return (
              <button
                key={w.id}
                onClick={() => setSelectedWeek(w.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-foreground text-surface shadow-subtle"
                    : "text-foreground-secondary hover:text-foreground hover:bg-surface/50"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{w.label}</span>
                <span
                  className={`ml-1 px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    isSelected
                      ? "bg-surface/20 text-surface"
                      : isAllPaid
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-amber-500/10 text-amber-600"
                  }`}
                >
                  {count}/6 Lunas
                </span>
              </button>
            );
          })}
        </div>

        {/* Monthly Accumulation Card */}
        <div className="p-3 rounded-xl border border-border bg-amber-500/5 dark:bg-amber-500/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 block">
              Total Kas Terkumpul (Sep)
            </span>
            <div className="text-lg font-bold text-foreground tabular-nums mt-0.5">
              Rp {totalMonthlyCollected.toLocaleString("id-ID")}
            </div>
          </div>
          <Coins className="w-6 h-6 text-amber-500 shrink-0" />
        </div>
      </div>

      {/* Selected Week Progress Bar */}
      <div className="p-3.5 rounded-xl border border-border bg-surface-secondary/30 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-foreground">
            Progres Pembayaran Kas: {WEEKS_SEPTEMBER.find((w) => w.id === selectedWeek)?.label}
          </span>
          <span className="tabular-nums text-foreground">
            Rp {collectedInSelectedWeek.toLocaleString("id-ID")} / Rp {targetInSelectedWeek.toLocaleString("id-ID")}{" "}
            <span className="text-foreground-muted font-normal">({paidCountInSelectedWeek}/{totalPicCount} PIC)</span>
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-border overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              paidCountInSelectedWeek === totalPicCount ? "bg-emerald-500" : "bg-amber-500"
            }`}
            style={{ width: `${(paidCountInSelectedWeek / totalPicCount) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-foreground-muted pt-1">
          <span>Tarif resmi: Rp 5.000 / orang setiap minggu</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => markAll(selectedWeek, true)}
              className="text-[10px] font-semibold text-emerald-600 hover:underline"
            >
              Tandai Semua Lunas
            </button>
            <span>·</span>
            <button
              onClick={() => markAll(selectedWeek, false)}
              className="text-[10px] font-semibold text-foreground-muted hover:underline"
            >
              Reset Belum Bayar
            </button>
          </div>
        </div>
      </div>

      {/* PIC Members Table */}
      <div className="overflow-x-auto border border-border rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-secondary text-foreground-secondary border-b border-border text-[10px] uppercase font-semibold">
            <tr>
              <th className="py-2.5 px-4 w-12 text-center">No</th>
              <th className="py-2.5 px-4">Nama PIC &amp; Posisi</th>
              <th className="py-2.5 px-4">Kontak WhatsApp</th>
              <th className="py-2.5 px-4 text-center">Status Iuran (Rp 5.000)</th>
              <th className="py-2.5 px-4 text-right">Aksi &amp; Reminder</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {MARKETING_PURWOKERTO_PICS.map((member, idx) => {
              const isPaid = !!currentWeekPayments[member.id];
              const weekLabel = WEEKS_SEPTEMBER.find((w) => w.id === selectedWeek)?.label || selectedWeek;

              return (
                <tr
                  key={member.id}
                  className={`transition-colors ${
                    isPaid ? "hover:bg-surface-secondary/30" : "bg-red-500/5 hover:bg-red-500/10"
                  }`}
                >
                  <td className="py-3 px-4 text-center font-mono text-foreground-muted">{idx + 1}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                      <span>{member.name}</span>
                      {member.id === "yossika" && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-brand-light text-brand font-bold border border-brand/20">
                          Saya (Koordinator)
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-foreground-muted block">{member.role}</span>
                  </td>
                  <td className="py-3 px-4">
                    <a
                      href={`https://wa.me/${member.waNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-foreground hover:text-brand transition-colors inline-flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-emerald-600" />
                      <span>{member.phone}</span>
                    </a>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => togglePayment(selectedWeek, member.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                        isPaid
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                          : "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30 hover:bg-red-500/20"
                      }`}
                    >
                      {isPaid ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>LUNAS (Rp 5k)</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-red-600" />
                          <span>BELUM BAYAR</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {!isPaid ? (
                      <a
                        href={getWaReminderUrl(member, weekLabel)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-subtle"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Kirim Reminder WA</span>
                      </a>
                    ) : (
                      <span className="text-[11px] text-emerald-600 font-semibold inline-flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Terkonfirmasi
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-3 rounded-lg border border-border/80 bg-surface-secondary/20 text-xs text-foreground-muted flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Status kas otomatis tersimpan di perangkat Anda. Data siap ditunjukkan saat evaluasi internal.</span>
        </div>
        <span className="text-[11px] font-mono text-foreground-muted shrink-0">
          6 PIC · Purwokerto Store &amp; Creative Studio
        </span>
      </div>
    </div>
  );
};
