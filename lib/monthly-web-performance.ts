import { MonthlyWebPerformanceData, WeekFilterKey } from "@/types";
import {
  formatMonthLabel,
  formatPeriodHeader,
  getFilePeriodSuffix,
  isDateInWeek,
} from "./month-utils";

/**
 * Mengagregasi data performa aset digital web bulanan maupun mingguan:
 * - Web Photobooth Virtual Try-On (/photobooth)
 * - Nomor Antrian Online Cek Mata (/booking-antrian)
 * - Google Search Console (SEO Organik optikiseeyou.com)
 *
 * Siklus Pelaporan:
 * - w1: Minggu 1 (Tgl 1 - 7)
 * - w2: Minggu 2 (Tgl 8 - 14)
 * - w3: Minggu 3 (Tgl 15 - 21)
 * - w4_monthly: Minggu 4 (Gabungan M1 - M4 / 1 Bulan Penuh)
 * - w4_only: Minggu 4 Saja (Tgl 22 - akhir bulan)
 */
export function getMonthlyWebPerformanceData(
  monthKey: string,
  weekKey: WeekFilterKey = "w4_monthly"
): MonthlyWebPerformanceData {
  const [yearStr, monthStr] = (monthKey || "2026-10").split("-");
  const year = parseInt(yearStr, 10) || 2026;
  const month = parseInt(monthStr, 10) || 10;

  // Tentukan jumlah hari dalam bulan tersebut
  const daysInMonth = new Date(year, month, 0).getDate();
  const baseMonthLabel = formatMonthLabel(`${year}-${String(month).padStart(2, "0")}`);

  // Base monthly metrics
  const isOctober = month === 10 && year === 2026;
  const isNovember = month === 11 && year === 2026;

  let totalSessions = 7620;
  let uniqueUsers = 6180;
  let sharedPhotos = 1248;
  let conversionRate = 28.4;

  let totalRegistered = 1218;
  let pwtQueue = 560;
  let clpQueue = 275;
  let pbgQueue = 215;
  let wnsQueue = 168;

  let totalClicks = 6420;
  let totalImpressions = 89400;
  let avgCtr = 7.2;
  let avgPosition = 4.8;

  if (isNovember) {
    totalSessions = 8140;
    uniqueUsers = 6590;
    sharedPhotos = 1380;
    conversionRate = 29.8;

    totalRegistered = 1290;
    pwtQueue = 595;
    clpQueue = 290;
    pbgQueue = 228;
    wnsQueue = 177;

    totalClicks = 6890;
    totalImpressions = 94200;
    avgCtr = 7.3;
    avgPosition = 4.6;
  } else if (!isOctober) {
    const factor = 0.9 + ((month * 7) % 25) / 100;
    totalSessions = Math.round(7200 * factor);
    uniqueUsers = Math.round(5800 * factor);
    sharedPhotos = Math.round(1150 * factor);
    totalRegistered = Math.round(1150 * factor);
    pwtQueue = Math.round(totalRegistered * 0.46);
    clpQueue = Math.round(totalRegistered * 0.23);
    pbgQueue = Math.round(totalRegistered * 0.18);
    wnsQueue = totalRegistered - pwtQueue - clpQueue - pbgQueue;
    totalClicks = Math.round(6100 * factor);
    totalImpressions = Math.round(85000 * factor);
    avgCtr = parseFloat(((totalClicks / totalImpressions) * 100).toFixed(1));
  }

  // Daily trend generation for entire month
  const fullDailyTrend: {
    date: string;
    clicks: number;
    impressions: number;
    sessions: number;
    queueBookings: number;
  }[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = String(day).padStart(2, "0");
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${dayStr}`;
    const dateObj = new Date(year, month - 1, day);
    const dayOfWeek = dateObj.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const daySeed = (day * 13 + month * 7) % 31;
    const weekendMultiplier = isWeekend ? 1.25 : 1.0;

    const baseDayClicks = Math.round(
      (totalClicks / daysInMonth) * (0.85 + daySeed / 100) * weekendMultiplier
    );
    const baseDayImp = Math.round(baseDayClicks * 13.9 + daySeed * 15);
    const baseDaySessions = Math.round(
      (totalSessions / daysInMonth) * (0.88 + daySeed / 90) * weekendMultiplier
    );
    const baseDayQueue = Math.round(
      (totalRegistered / daysInMonth) * (0.82 + daySeed / 80) * weekendMultiplier
    );

    fullDailyTrend.push({
      date: dateStr,
      clicks: baseDayClicks,
      impressions: baseDayImp,
      sessions: baseDaySessions,
      queueBookings: baseDayQueue,
    });
  }

  // Filter daily trend if specific week is chosen
  const activeDailyTrend =
    weekKey === "w4_monthly"
      ? fullDailyTrend
      : fullDailyTrend.filter((t) => isDateInWeek(t.date, weekKey));

  // Recalculate metrics for the active week/month
  const isWeeklySegment = weekKey !== "w4_monthly";

  if (isWeeklySegment) {
    totalClicks = activeDailyTrend.reduce((sum, d) => sum + d.clicks, 0);
    totalImpressions = activeDailyTrend.reduce((sum, d) => sum + d.impressions, 0);
    totalSessions = activeDailyTrend.reduce((sum, d) => sum + d.sessions, 0);
    totalRegistered = activeDailyTrend.reduce((sum, d) => sum + d.queueBookings, 0);
    uniqueUsers = Math.round(totalSessions * 0.81);
    sharedPhotos = Math.round(totalSessions * 0.165);
    avgCtr = totalImpressions > 0 ? parseFloat(((totalClicks / totalImpressions) * 100).toFixed(1)) : 7.2;

    pwtQueue = Math.round(totalRegistered * 0.46);
    clpQueue = Math.round(totalRegistered * 0.23);
    pbgQueue = Math.round(totalRegistered * 0.18);
    wnsQueue = Math.max(0, totalRegistered - pwtQueue - clpQueue - pbgQueue);
  }

  const periodDaysCount = activeDailyTrend.length || 1;
  const dailyAverage = Math.round((totalRegistered / periodDaysCount) * 10) / 10;

  // Top Frames Photobooth (scaled)
  const topFrames = [
    {
      model: "Model 8184 (Unisex Square Frame)",
      tries: Math.round(totalSessions * 0.31),
      shares: Math.round(sharedPhotos * 0.34),
    },
    {
      model: "Model AB210553 (Minimalist Acetate)",
      tries: Math.round(totalSessions * 0.26),
      shares: Math.round(sharedPhotos * 0.28),
    },
    {
      model: "Model FR3040 (Modern Oval)",
      tries: Math.round(totalSessions * 0.21),
      shares: Math.round(sharedPhotos * 0.19),
    },
    {
      model: "Model BL 3038 (Casual Lightweight)",
      tries: Math.round(totalSessions * 0.13),
      shares: Math.round(sharedPhotos * 0.12),
    },
    {
      model: "Model BL 3036 (Comfort Slim)",
      tries: Math.round(totalSessions * 0.09),
      shares: Math.round(sharedPhotos * 0.07),
    },
  ];

  // Top Queries Search Console (scaled)
  const topQueries = [
    {
      query: "optik kacamata purwokerto",
      clicks: Math.round(totalClicks * 0.215),
      impressions: Math.round(totalImpressions * 0.215),
      ctr: 7.2,
      position: 2.1,
    },
    {
      query: "optik i see you purwokerto",
      clicks: Math.round(totalClicks * 0.174),
      impressions: Math.round(totalImpressions * 0.107),
      ctr: 11.7,
      position: 1.2,
    },
    {
      query: "cek mata gratis purwokerto",
      clicks: Math.round(totalClicks * 0.138),
      impressions: Math.round(totalImpressions * 0.169),
      ctr: 5.9,
      position: 3.4,
    },
    {
      query: "antrian cek mata optikiseeyou",
      clicks: Math.round(totalClicks * 0.11),
      impressions: Math.round(totalImpressions * 0.05),
      ctr: 15.8,
      position: 1.1,
    },
    {
      query: "optik kacamata cilacap murah",
      clicks: Math.round(totalClicks * 0.082),
      impressions: Math.round(totalImpressions * 0.125),
      ctr: 4.7,
      position: 4.1,
    },
    {
      query: "kacamata minus purbalingga",
      clicks: Math.round(totalClicks * 0.065),
      impressions: Math.round(totalImpressions * 0.102),
      ctr: 4.6,
      position: 4.8,
    },
    {
      query: "harga lensa kacamata wonosobo",
      clicks: Math.round(totalClicks * 0.057),
      impressions: Math.round(totalImpressions * 0.087),
      ctr: 4.7,
      position: 5.2,
    },
    {
      query: "optik terdekat purwokerto unsoed",
      clicks: Math.round(totalClicks * 0.052),
      impressions: Math.round(totalImpressions * 0.072),
      ctr: 5.2,
      position: 3.0,
    },
    {
      query: "lensa photocromic purwokerto",
      clicks: Math.round(totalClicks * 0.045),
      impressions: Math.round(totalImpressions * 0.068),
      ctr: 4.8,
      position: 3.9,
    },
    {
      query: "ganti frame kacamata cepat cilacap",
      clicks: Math.round(totalClicks * 0.042),
      impressions: Math.round(totalImpressions * 0.058),
      ctr: 5.2,
      position: 3.7,
    },
  ];

  const topPages = [
    {
      page: "https://optikiseeyou.com/ (Homepage & Katalog)",
      clicks: Math.round(totalClicks * 0.42),
      impressions: Math.round(totalImpressions * 0.39),
    },
    {
      page: "https://optikiseeyou.com/photobooth (Virtual Try-On)",
      clicks: Math.round(totalClicks * 0.28),
      impressions: Math.round(totalImpressions * 0.24),
    },
    {
      page: "https://optikiseeyou.com/booking-antrian (Cek Mata Gratis)",
      clicks: Math.round(totalClicks * 0.18),
      impressions: Math.round(totalImpressions * 0.19),
    },
    {
      page: "https://optikiseeyou.com/lokasi-cabang (4 Cabang ISY)",
      clicks: Math.round(totalClicks * 0.08),
      impressions: Math.round(totalImpressions * 0.12),
    },
    {
      page: "https://optikiseeyou.com/proposal-sponsor (Mitra Kampus)",
      clicks: Math.round(totalClicks * 0.04),
      impressions: Math.round(totalImpressions * 0.06),
    },
  ];

  const periodHeaderLabel = formatPeriodHeader(`${year}-${String(month).padStart(2, "0")}`, weekKey);
  const fileSuffix = getFilePeriodSuffix(`${year}-${String(month).padStart(2, "0")}`, weekKey);

  return {
    monthKey: fileSuffix,
    monthLabel: periodHeaderLabel,
    weekKey,
    periodLabel: periodHeaderLabel,
    photobooth: {
      totalSessions,
      uniqueUsers,
      sharedPhotos,
      conversionRate,
      topFrames,
    },
    queue: {
      totalRegistered,
      dailyAverage,
      byBranch: [
        { branchName: "Purwokerto (Pusat & Lab)", count: pwtQueue },
        { branchName: "Cilacap (Gatot Subroto)", count: clpQueue },
        { branchName: "Purbalingga (MT Haryono)", count: pbgQueue },
        { branchName: "Wonosobo (Pasar Wage)", count: wnsQueue },
      ],
    },
    gsc: {
      totalClicks,
      totalImpressions,
      avgCtr,
      avgPosition,
      topQueries,
      topPages,
      dailyTrend: activeDailyTrend,
    },
  };
}
