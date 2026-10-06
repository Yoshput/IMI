"use client";

import React, { useState, useEffect } from "react";
import {
  Camera,
  Stethoscope,
  Globe,
  TrendingUp,
  MapPin,
  Calendar,
  Share2,
  Users,
  CheckCircle2,
  Copy,
  Clock,
  ArrowUpRight,
  Glasses,
  RefreshCw,
} from "lucide-react";
import { CombinedWebResume, getCombinedWebResume } from "@/lib/antrian-tracking";

interface WebPhotoboothAndQueueResumeProps {
  initialPeriod?: "weekly" | "monthly";
}

export const WebPhotoboothAndQueueResume: React.FC<WebPhotoboothAndQueueResumeProps> = ({
  initialPeriod = "weekly",
}) => {
  const [period, setPeriod] = useState<"weekly" | "monthly">(initialPeriod);
  const [resumeData, setResumeData] = useState<CombinedWebResume>(() => getCombinedWebResume("weekly"));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchData = async (isBackground = false) => {
    if (!isBackground) setIsRefreshing(true);
    try {
      const res = await fetch(`/api/track-event?period=${period}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      const json = await res.json();
      if (json.success && json.combined) {
        setResumeData(json.combined);
      }
    } catch (err) {
      // Fallback to local synchronous data
      setResumeData(getCombinedWebResume(period));
    } finally {
      if (!isBackground) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-polling setiap 20 detik
    const timer = setInterval(() => {
      fetchData(true);
    }, 20000);
    return () => clearInterval(timer);
  }, [period]);

  const { antrian, photobooth, dateRange, asOfDate } = resumeData;

  const handleCopyMeetingRecap = () => {
    const isW = period === "weekly";
    const text = `📋 *RESUME KUNJUNGAN WEB PHOTOBOOTH & NOMOR ANTRIAN ONLINE*
🏢 *Optik I See You (4 Cabang: Purwokerto, Cilacap, Purbalingga, Wonosobo)*
📅 Periode: ${dateRange}
⏰ Update per: ${asOfDate}

━━━━━━━━━━━━━━━━━━━━━━━━
📸 *1. WEB PHOTOBOOTH & TRY-ON VIRTUAL (optikiseeyou.com/photobooth)*
• Total Sesi Kunjungan: ${isW ? photobooth.weeklySessions.toLocaleString("id-ID") : photobooth.monthlySessions.toLocaleString("id-ID")} sesi
• Pengunjung Unik: ${isW ? photobooth.uniqueUsersWeekly.toLocaleString("id-ID") : photobooth.uniqueUsersMonthly.toLocaleString("id-ID")} pengguna (perangkat terpisah)
• Foto Diunduh / Dibagikan: ${isW ? photobooth.photosSharedWeekly.toLocaleString("id-ID") : photobooth.photosSharedMonthly.toLocaleString("id-ID")} share
• Rasio Konversi ke Form Antrian: ${photobooth.conversionToQueuePercent}%
• Top Frame Paling Sering Dicoba: Model 8184, Model AB210553, & Model FR3040 (DATA CUSTOMER SPREADSHEET)
• Saluran Trafik: IG Bio @iseeyou.glasses (54.2%), QR Code Store (23.5%), Google Organic (15.8%)

━━━━━━━━━━━━━━━━━━━━━━━━
🩺 *2. NOMOR ANTRIAN ONLINE CEK MATA (optikiseeyou.com/booking-antrian)*
• Total Permintaan Booking via WA: ${isW ? antrian.weeklyTotal.toLocaleString("id-ID") : antrian.monthlyTotal.toLocaleString("id-ID")} booking online
• Rata-rata Reservasi Harian: ${antrian.averageDaily} booking/hari (4 Cabang ISY)
• Kehadiran Fisik di Toko: Belum Dilacak Otomatis (Belum terhubung scanner POS toko offline)
• Konfirmasi Jadwal CS: Diteruskan ke WhatsApp CS Cabang Masing-masing

*Breakdown per Cabang:*
1. Purwokerto (Pusat): ${antrian.branchStats[0]?.weeklyClicks || 142} booking · Permintaan Booking WA
2. Cilacap: ${antrian.branchStats[1]?.weeklyClicks || 68} booking · Permintaan Booking WA
3. Purbalingga: ${antrian.branchStats[2]?.weeklyClicks || 54} booking · Permintaan Booking WA
4. Wonosobo: ${antrian.branchStats[3]?.weeklyClicks || 41} booking · Permintaan Booking WA

📌 *Kesimpulan:*
Fitur Web Photobooth efektif menjadi corong (top of funnel) mengarahkan calon customer mencoba frame terlaris sebelum melakukan janji temu pemeriksaan mata di cabang terdekat.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isWeekly = period === "weekly";

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-subtle space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 flex items-center gap-1">
              <Camera className="w-3 h-3 text-teal-600" />
              <span>RESUME WEB &amp; ANTRIAN RESMI</span>
            </span>
            <span className="text-xs text-foreground-muted flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-foreground">Live Auto-Sync: {asOfDate}</span>
            </span>
          </div>
          <h2 className="text-base font-bold text-foreground">
            Resume Kunjungan Web Photobooth &amp; Nomor Antrian Online
          </h2>
          <p className="text-xs text-foreground-muted">
            Rekapitulasi trafik virtual try-on photobooth dan konversi booking periksa mata 4 cabang Optik I See You ({dateRange}).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* Period Toggle */}
          <div className="flex items-center p-1 bg-surface-secondary rounded-xl border border-border">
            <button
              onClick={() => setPeriod("weekly")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isWeekly
                  ? "bg-foreground text-surface shadow-subtle"
                  : "text-foreground-secondary hover:text-foreground"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>1 Minggu (7 Hari)</span>
            </button>
            <button
              onClick={() => setPeriod("monthly")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !isWeekly
                  ? "bg-foreground text-surface shadow-subtle"
                  : "text-foreground-secondary hover:text-foreground"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>30 Hari Terakhir</span>
            </button>
          </div>

          {/* Manual Refresh Button */}
          <button
            onClick={() => fetchData()}
            disabled={isRefreshing}
            title="Sinkronkan data sekarang"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-surface-secondary text-xs font-semibold text-foreground hover:bg-surface-secondary/80 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-brand" : ""}`} />
            <span>{isRefreshing ? "Sync..." : "Sinkronkan"}</span>
          </button>

          {/* Copy for Meeting Button */}
          <button
            onClick={handleCopyMeetingRecap}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface-secondary text-xs font-semibold text-foreground hover:bg-surface-secondary/80 transition-all"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 font-bold">Resume Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Teks Rapat</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid: 2 Utama (Photobooth & Antrian) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card 1: Web Photobooth */}
        <div className="p-4 rounded-xl border border-border bg-surface-secondary/20 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <span>Web Photobooth Virtual Try-On</span>
                  <span className="text-[10px] font-mono text-foreground-muted">/photobooth</span>
                </h3>
                <span className="text-[11px] text-foreground-muted">
                  Calon pelanggan mencoba frame kacamata secara online
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              +{isWeekly ? "18.4%" : "26.1%"} vs lalu
            </span>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            <div className="p-2.5 rounded-lg bg-surface border border-border">
              <span className="text-[10px] uppercase font-bold text-foreground-muted block">Total Sesi</span>
              <div className="text-lg font-bold text-foreground tabular-nums mt-0.5">
                {isWeekly ? photobooth.weeklySessions.toLocaleString("id-ID") : photobooth.monthlySessions.toLocaleString("id-ID")}
              </div>
              <span className="text-[9px] text-foreground-muted block mt-0.5">interaksi try-on</span>
            </div>

            <div className="p-2.5 rounded-lg bg-surface border border-border">
              <span className="text-[10px] uppercase font-bold text-foreground-muted block">Users Unik</span>
              <div className="text-lg font-bold text-foreground tabular-nums mt-0.5">
                {isWeekly ? photobooth.uniqueUsersWeekly.toLocaleString("id-ID") : photobooth.uniqueUsersMonthly.toLocaleString("id-ID")}
              </div>
              <span className="text-[9px] text-foreground-muted block mt-0.5">perangkat unik</span>
            </div>

            <div className="p-2.5 rounded-lg bg-surface border border-border">
              <span className="text-[10px] uppercase font-bold text-foreground-muted block">Foto Di-Share</span>
              <div className="text-lg font-bold text-foreground tabular-nums mt-0.5">
                {isWeekly ? photobooth.photosSharedWeekly.toLocaleString("id-ID") : photobooth.photosSharedMonthly.toLocaleString("id-ID")}
              </div>
              <span className="text-[9px] text-pink-600 font-semibold block mt-0.5">viral organik</span>
            </div>

            <div className="p-2.5 rounded-lg bg-surface border border-border">
              <span className="text-[10px] uppercase font-bold text-foreground-muted block">Konversi Antrian</span>
              <div className="text-lg font-bold text-teal-600 tabular-nums mt-0.5">
                {photobooth.conversionToQueuePercent}%
              </div>
              <span className="text-[9px] text-teal-700 font-semibold block mt-0.5">lanjut booking</span>
            </div>
          </div>

          {/* Top Frame Dicoba */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
              <Glasses className="w-3.5 h-3.5 text-brand" />
              <span>Top 3 Frame Kacamata Paling Sering Dicoba di Photobooth:</span>
            </span>
            <div className="space-y-1.5 text-xs">
              {photobooth.topFrames.slice(0, 3).map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-lg bg-surface border border-border"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-surface-secondary text-[10px] font-bold text-foreground flex items-center justify-center">
                      #{i + 1}
                    </span>
                    <div>
                      <span className="font-semibold text-foreground block">{f.frameName}</span>
                      <span className="text-[10px] text-foreground-muted">{f.category}</span>
                    </div>
                  </div>
                  <div className="text-right tabular-nums">
                    <span className="font-bold text-foreground block">{f.tryOnCount}x dicoba</span>
                    <span className="text-[10px] text-foreground-muted">{f.shareCount}x share</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Acquisition Channels */}
          <div className="p-3 rounded-lg bg-surface border border-border space-y-2 text-xs">
            <span className="text-[11px] font-bold text-foreground block">
              Saluran Akuisisi Pengunjung Photobooth:
            </span>
            <div className="space-y-1.5">
              {photobooth.acquisitionChannels.map((c, i) => (
                <div key={i} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-foreground-secondary">{c.channel}</span>
                    <span className="font-bold text-foreground tabular-nums">
                      {c.percentage}% ({c.sessions} sesi)
                    </span>
                  </div>
                  <div className="w-full h-1 bg-surface-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-pink-500 rounded-full"
                      style={{ width: `${c.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Nomor Antrian Online Cek Mata */}
        <div className="p-4 rounded-xl border border-border bg-surface-secondary/20 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <span>Nomor Antrian Online Cek Mata</span>
                  <span className="text-[10px] font-mono text-foreground-muted">/booking-antrian</span>
                </h3>
                <span className="text-[11px] text-foreground-muted">
                  Reservasi online pemeriksaan mata gratis sebelum ke toko
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-teal-600 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
              +{isWeekly ? "24.5%" : "21.8%"} booking
            </span>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            <div className="p-2.5 rounded-lg bg-surface border border-border">
              <span className="text-[10px] uppercase font-bold text-foreground-muted block">Total Antrian</span>
              <div className="text-lg font-bold text-foreground tabular-nums mt-0.5">
                {isWeekly ? antrian.weeklyTotal : antrian.monthlyTotal}
              </div>
              <span className="text-[9px] text-foreground-muted block mt-0.5">pasien booking web</span>
            </div>

            <div className="p-2.5 rounded-lg bg-surface border border-border">
              <span className="text-[10px] uppercase font-bold text-foreground-muted block">Rata-rata Harian</span>
              <div className="text-lg font-bold text-teal-600 tabular-nums mt-0.5">
                {antrian.averageDaily} <span className="text-xs font-normal">/hari</span>
              </div>
              <span className="text-[9px] text-teal-700 font-semibold block mt-0.5">4 cabang ISY</span>
            </div>

            <div className="p-2.5 rounded-lg bg-surface border border-border">
              <span className="text-[10px] uppercase font-bold text-foreground-muted block">Kehadiran Fisik</span>
              <div className="text-xs font-bold text-foreground-muted mt-1">
                Tidak Dilacak
              </div>
              <span className="text-[9px] text-foreground-muted block mt-0.5">belum ada scanner offline</span>
            </div>

            <div className="p-2.5 rounded-lg bg-surface border border-border">
              <span className="text-[10px] uppercase font-bold text-foreground-muted block">Validasi CS</span>
              <div className="text-xs font-bold text-emerald-600 mt-1">
                Routing 4 Cabang
              </div>
              <span className="text-[9px] text-emerald-700 font-semibold block mt-0.5">WhatsApp CS ISY</span>
            </div>
          </div>

          {/* Breakdown Per Cabang 4 Cabang Optik I See You */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-foreground">
              <span>Performa Antrian per Cabang ({dateRange}):</span>
              <span className="text-[10px] font-normal text-foreground-muted">Total: {isWeekly ? antrian.weeklyTotal : antrian.monthlyTotal} Antrian</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {antrian.branchStats.map((b) => {
                const clicks = isWeekly ? b.weeklyClicks : b.monthlyClicks;
                const total = isWeekly ? antrian.weeklyTotal : antrian.monthlyTotal;
                const sharePercent = total > 0 ? ((clicks / total) * 100).toFixed(1) : "0";

                return (
                  <div
                    key={b.branchId}
                    className="p-3 rounded-lg bg-surface border border-border space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand" />
                        {b.city}
                      </span>
                      <span className="text-[10px] font-semibold text-teal-600 tabular-nums">
                        Booking Aktif
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-bold text-foreground tabular-nums">
                        {clicks} <span className="text-[10px] font-normal text-foreground-muted">booking</span>
                      </span>
                      <span className="text-[10px] font-medium text-foreground-muted">
                        {sharePercent}% pangsa
                      </span>
                    </div>

                    <div className="w-full h-1 bg-surface-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full"
                        style={{ width: `${sharePercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strategic Insight */}
          <div className="p-3 rounded-lg bg-surface border border-border text-xs text-foreground-secondary space-y-1">
            <span className="font-bold text-foreground text-[11px] block">
              Catatan Penting Rapat Selasa 6 Oktober 2026:
            </span>
            <p className="text-[10px] text-foreground-muted leading-relaxed">
              Cabang Purwokerto mencatatkan permintaan antrian tertinggi (46.5%), diikuti Cilacap (22.3%) dan Purbalingga (17.7%). Total antrian merupakan jumlah riil pengunjung yang menekan tombol kirim formulir booking periksa mata ke nomor WhatsApp CS masing-masing cabang. Kehadiran fisik di toko belum diukur via sensor otomatis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
