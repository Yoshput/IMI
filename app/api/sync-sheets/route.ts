import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import { getCachedInstagramData } from "@/lib/instagram-realtime";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function parseExcelDate(serial: any): string | null {
  if (!serial) return null;
  if (typeof serial === "string") {
    const parts = serial.trim().split(/[/\-\s]/);
    if (parts.length >= 3) {
      const d = parts[0].padStart(2, "0");
      const m = parts[1].padStart(2, "0");
      const y = parts[2].length === 2 ? "20" + parts[2] : parts[2];
      return `${y}-${m}-${d}`;
    }
    return serial;
  }
  if (typeof serial === "number") {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    const y = date_info.getFullYear();
    const m = String(date_info.getMonth() + 1).padStart(2, "0");
    const d = String(date_info.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return String(serial);
}

function cleanNumber(val: any): number {
  if (val === null || val === undefined || val === "-") return 0;
  if (typeof val === "number") return Math.round(val * 100) / 100;
  const str = String(val).replace(/[,.]/g, "").replace(/[^0-9-]/g, "");
  const n = parseInt(str, 10);
  return isNaN(n) ? 0 : n;
}

function cleanMetric(val: any): number {
  if (val === null || val === undefined || val === "-" || val === "") return 0;
  if (typeof val === "number") return Math.round(val);
  const str = String(val).toLowerCase().trim();
  if (str === "libur" || str === "tidak ada" || str === "belum ada") return 0;
  if (str.includes("rb") || str.includes("k")) {
    const num = parseFloat(str.replace(/,/g, ".").replace(/[^0-9.]/g, ""));
    return isNaN(num) ? 0 : Math.round(num * 1000);
  }
  const n = parseInt(str.replace(/[,.]/g, "").replace(/[^0-9-]/g, ""), 10);
  return isNaN(n) ? 0 : n;
}

function normalizeFollowers(val: any, isKNotation = false): number {
  if (val === null || val === undefined || val === "-") return 0;
  if (typeof val === "number") {
    if (isKNotation && val < 1000) {
      return Math.round(val * 1000);
    }
    return Math.round(val);
  }
  const str = String(val).replace(/[,]/g, "").trim();
  const num = parseFloat(str);
  if (isNaN(num)) return 0;
  if (isKNotation && num < 1000) return Math.round(num * 1000);
  return Math.round(num);
}

async function syncSpreadsheetData() {
  const sheetUrl =
    "https://docs.google.com/spreadsheets/d/1BU0fIDP656Y-eue55bWVSxeaixSeFJwR3GP1n8kwBYc/export?format=xlsx";

  const res = await fetch(sheetUrl);
  if (!res.ok) {
    throw new Error(`Gagal fetch Google Sheets: ${res.statusText}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const workbook = XLSX.read(buffer, { type: "buffer" });

  // 1. Process Rekap Story PWT (Nuha)
  const storySheet = workbook.Sheets["Rekap Story PWT"];
  const rawStory: any[] = storySheet ? XLSX.utils.sheet_to_json(storySheet) : [];
  const storyItems = rawStory
    .map((row, idx) => {
      let maxV = row["Jumlah viewers terbanyak"];
      if (typeof maxV === "number" && maxV < 100) maxV = Math.round(maxV * 1000);
      else maxV = cleanNumber(maxV);

      return {
        id: `story-${idx}`,
        timestamp: parseExcelDate(row["Cap waktu"]),
        reportDate: parseExcelDate(row["Tanggal Laporan"]),
        pic: row["Pengisi Laporan"] || "Nuha",
        branch: "Purwokerto (Pusat)",
        branchKey: "PWT",
        storiesUploaded: cleanNumber(row["Jumlah Story di Upload"]),
        maxViewers: maxV,
        minViewers: cleanNumber(row["Jumlah viewers paling sedikit"]),
        dmInquiries: cleanNumber(row["Jumlah DM masuk"]),
        frequentQuestions: row["Hal paling sering ditanyakan"] || "-",
        viralComments: cleanNumber(row["Jumlah Komentar Reels Viral"]),
        channelBroadcast: row["Posting Saluran Instagram"] || "-",
        csResponseSpeed: row["Pemantauan CS dalam membalas DM"] || "-",
        achievement: row["Apa pencapaian hari ini?"] || "-",
        areaToImprove: row["Apa yang perlu diperbaiki?"] || "-",
        obstacle: row["Kendala yang dihadapi"] || "-",
      };
    })
    .filter((item) => item.reportDate);

  // 2. Process Branch Reels Sheets
  // 2. Process Branch Reels Sheets
  const branchConfigs = [
    { sheetName: "Rekap PWT", picDefault: "Ilya", branchName: "Purwokerto (Pusat)", city: "Purwokerto", branchKey: "PWT", isKFollowers: true, isPWT: true },
    { sheetName: "Rekap PBG", picDefault: "Ajun", branchName: "Purbalingga", city: "Purbalingga", branchKey: "PBG", isKFollowers: false },
    { sheetName: "Rekap TGL", picDefault: "Amanda", branchName: "Lunar Eyewear Tegal (Second Brand)", city: "Tegal", branchKey: "TGL", isKFollowers: false },
    { sheetName: "Rekap CLP", picDefault: "Arum", branchName: "Cilacap", city: "Cilacap", branchKey: "CLP", isKFollowers: false },
    { sheetName: "Rekap WNS", picDefault: "Febi", branchName: "Wonosobo", city: "Wonosobo", branchKey: "WNS", isKFollowers: false },
  ];

  const allBranchReels: Record<string, any[]> = {};
  const allFollowerDaily: Record<string, any[]> = {};

  branchConfigs.forEach((cfg) => {
    const sheet = workbook.Sheets[cfg.sheetName];
    if (!sheet) return;
    const rawRows: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Pass 1: Collect upload links and metadata by date and title
    const linkByUploadDate: Record<string, any> = {};
    const linkByTitle: Record<string, any> = {};
    const titleToLinkMap: Record<string, string> = {};

    for (let i = 1; i < rawRows.length; i++) {
      const row = rawRows[i];
      if (!row || row.length === 0) continue;
      const date = parseExcelDate(cfg.isPWT ? row[1] : row[9]);
      const title = String((cfg.isPWT ? row[4] : row[2]) || "").trim();
      const link = String((cfg.isPWT ? row[6] : row[4]) || "").trim();
      const pillar = String((cfg.isPWT ? row[5] : row[3]) || "Umum").trim();
      const feed = String((cfg.isPWT ? row[7] : row[5]) || "").trim();
      const threads = String((cfg.isPWT ? row[9] : row[7]) || "").trim();
      const tiktok = String((cfg.isPWT ? row[10] : row[8]) || "").trim();

      const isLibur = !title || title === "-" || title.toLowerCase().includes("libur");
      if (!isLibur && link.startsWith("http")) {
        const info = { title, link, pillar, feed, threads, tiktok, date };
        if (date) linkByUploadDate[date] = info;
        linkByTitle[title.toLowerCase()] = info;
        titleToLinkMap[title.toLowerCase()] = link;
      }
    }

    // Pass 2: Collect all H+3 evaluations
    const evaluationsByDate: Record<string, any[]> = {};
    const evaluationsList: any[] = [];

    for (let i = 1; i < rawRows.length; i++) {
      const row = rawRows[i];
      if (!row || row.length === 0) continue;
      const evalReportDate = parseExcelDate(cfg.isPWT ? row[1] : row[9]);
      const targetUploadDate = parseExcelDate(cfg.isPWT ? row[14] : row[13]);
      let evalTitle = String((cfg.isPWT ? row[15] : row[14]) || "").trim();
      const evalViewers = cfg.isPWT ? row[16] : row[15];
      const evalLikes = cfg.isPWT ? row[17] : row[16];
      const bonus = String((cfg.isPWT ? row[18] : row[17]) || "-").trim();

      const isLibur = !evalTitle || evalTitle === "-" || evalTitle.toLowerCase() === "libur";
      const viewers = cleanMetric(evalViewers);
      const likes = cleanMetric(evalLikes);

      if (!isLibur && targetUploadDate && (viewers > 0 || likes > 0 || evalTitle.length > 2)) {
        const evalObj = {
          evalReportDate,
          targetUploadDate,
          evalTitle,
          viewers,
          likes,
          bonus,
        };
        evaluationsList.push(evalObj);
        if (!evaluationsByDate[targetUploadDate]) {
          evaluationsByDate[targetUploadDate] = [];
        }
        evaluationsByDate[targetUploadDate].push(evalObj);
      }
    }

    // Pass 3: Build parsedRows
    const parsedRows: any[] = [];
    const matchedEvalIndices = new Set<number>();

    for (let i = 1; i < rawRows.length; i++) {
      const row = rawRows[i];
      if (!row || row.length === 0) continue;

      // For PWT: row[0] is the report submission timestamp, row[1] is the upload date
      // Use row[0] as reportDate (when they filed) so latestDate tracks actual filing date
      const reportDate = parseExcelDate(cfg.isPWT ? row[0] : row[9]);
      const uploadDate = parseExcelDate(cfg.isPWT ? row[1] : row[9]);
      const pic = (cfg.isPWT ? row[2] : row[1]) || cfg.picDefault;
      const rawTitle = String((cfg.isPWT ? row[4] : row[2]) || "").trim();
      const pillar = String((cfg.isPWT ? row[5] : row[3]) || "Umum").trim();
      let reelsLink = String((cfg.isPWT ? row[6] : row[4]) || "").trim();
      const feedLink = String((cfg.isPWT ? row[7] : row[5]) || "").trim();
      const threadsLink = String((cfg.isPWT ? row[9] : row[7]) || "").trim();
      const tiktokLink = String((cfg.isPWT ? row[10] : row[8]) || "").trim();
      const igFollowers = normalizeFollowers(cfg.isPWT ? row[11] : row[10], cfg.isKFollowers);
      const tiktokFollowers = normalizeFollowers(cfg.isPWT ? row[12] : row[11], cfg.isKFollowers);
      const obstacle = String((cfg.isPWT ? row[13] : row[12]) || "-").trim();

      if (!reportDate) continue;

      const isDayOff = !rawTitle || rawTitle === "-" || rawTitle.toLowerCase().includes("libur");

      if (isDayOff) {
        parsedRows.push({
          id: `${cfg.sheetName.toLowerCase()}-${i}`,
          sheetKey: cfg.sheetName,
          branch: cfg.branchName,
          branchKey: cfg.branchKey,
          city: cfg.city,
          pic,
          timestamp: reportDate,
          reportDate,
          uploadDate: cfg.isPWT ? uploadDate : reportDate,
          evalReportDate: null,
          reelsTitle: "(Libur / Off Duty)",
          secondReelsTitle: undefined,
          contentPillar: pillar,
          reelsLink: "",
          feedLink: "",
          threadsLink: "",
          tiktokLink: "",
          igFollowers,
          tiktokFollowers,
          viewers: 0,
          likes: 0,
          bonus: "-",
          obstacle: obstacle !== "tidak ada" && obstacle !== "belum ada" ? obstacle : "-",
          isDayOff: true,
          isEvaluated: false,
          evaluationCadence: "Libur",
        });
        continue;
      }

      // Real video upload: match with H+3 evaluation
      // For PWT, use uploadDate for evaluation matching (the actual video date)
      const evalMatchDate = cfg.isPWT ? uploadDate : reportDate;
      let matchedEval: any = null;
      const dateEvals = evalMatchDate ? evaluationsByDate[evalMatchDate] : null;
      if (dateEvals && dateEvals.length > 0) {
        matchedEval = dateEvals[0];
      } else {
        matchedEval = evaluationsList.find((e) => {
          if (!e.evalReportDate || !evalMatchDate) return false;
          const daysDiff = Math.abs((new Date(e.evalReportDate).getTime() - new Date(evalMatchDate).getTime()) / (1000 * 3600 * 24));
          if (daysDiff > 7) return false;
          const t1 = e.evalTitle.toLowerCase();
          const t2 = rawTitle.toLowerCase();
          return t1 === t2 || t1.includes(t2) || t2.includes(t1);
        });
      }

      if (matchedEval) {
        const idx = evaluationsList.indexOf(matchedEval);
        if (idx !== -1) matchedEvalIndices.add(idx);
      }

      const cleanLink = (url: any) => {
        const s = String(url || "").trim();
        if (!s || s.toLowerCase() === "libur" || s === "-" || !s.startsWith("http")) return "";
        return s;
      };

      let actualLink = cleanLink(reelsLink);
      if (!actualLink) {
        actualLink = titleToLinkMap[rawTitle.toLowerCase()] || "";
      }

      parsedRows.push({
        id: `${cfg.sheetName.toLowerCase()}-${i}`,
        sheetKey: cfg.sheetName,
        branch: cfg.branchName,
        branchKey: cfg.branchKey,
        city: cfg.city,
        pic,
        timestamp: reportDate,
        reportDate,
        uploadDate: cfg.isPWT ? uploadDate : reportDate,
        evalReportDate: matchedEval ? matchedEval.evalReportDate : null,
        reelsTitle: rawTitle,
        secondReelsTitle: matchedEval ? matchedEval.evalTitle : undefined,
        contentPillar: pillar,
        reelsLink: actualLink,
        feedLink: cleanLink(feedLink),
        threadsLink: cleanLink(threadsLink),
        tiktokLink: cleanLink(tiktokLink),
        igFollowers,
        tiktokFollowers,
        viewers: matchedEval ? matchedEval.viewers : 0,
        likes: matchedEval ? matchedEval.likes : 0,
        bonus: matchedEval ? matchedEval.bonus : "-",
        obstacle: obstacle !== "tidak ada" && obstacle !== "belum ada" ? obstacle : "-",
        isDayOff: false,
        isEvaluated: !!matchedEval,
        evaluationCadence: matchedEval ? "H+3 Selesai" : "Menunggu H+3",
      });
    }

    // Add any evaluations that were not matched to an upload
    evaluationsList.forEach((e, idx) => {
      if (!matchedEvalIndices.has(idx)) {
        let uploadInfo = linkByUploadDate[e.targetUploadDate] || linkByTitle[e.evalTitle.toLowerCase()];
        parsedRows.push({
          id: `${cfg.sheetName.toLowerCase()}-eval-${idx}`,
          sheetKey: cfg.sheetName,
          branch: cfg.branchName,
          branchKey: cfg.branchKey,
          city: cfg.city,
          pic: cfg.picDefault,
          timestamp: e.targetUploadDate,
          reportDate: e.targetUploadDate,
          uploadDate: e.targetUploadDate,
          evalReportDate: e.evalReportDate,
          reelsTitle: uploadInfo?.title || (e.evalTitle.startsWith("http") ? "Konten Reels" : e.evalTitle),
          secondReelsTitle: e.evalTitle,
          contentPillar: uploadInfo?.pillar || "Umum",
          reelsLink: uploadInfo?.link || (e.evalTitle.startsWith("http") ? e.evalTitle : ""),
          feedLink: uploadInfo?.feed || "",
          threadsLink: uploadInfo?.threads || "",
          tiktokLink: uploadInfo?.tiktok || "",
          igFollowers: 0,
          tiktokFollowers: 0,
          viewers: e.viewers,
          likes: e.likes,
          bonus: e.bonus,
          obstacle: "-",
          isDayOff: false,
          isEvaluated: true,
          evaluationCadence: "H+3 Selesai",
        });
      }
    });

    parsedRows.sort((a, b) => (b.reportDate > a.reportDate ? 1 : -1));
    allBranchReels[cfg.sheetName] = parsedRows;

    const dateMap: Record<string, any> = {};
    parsedRows.forEach((r) => {
      if (r.reportDate && r.igFollowers > 0) {
        dateMap[r.reportDate] = {
          date: r.reportDate,
          igFollowers: r.igFollowers,
          tiktokFollowers: r.tiktokFollowers,
          reelsTitle: r.reelsTitle,
          viewers: r.viewers,
          likes: r.likes,
        };
      }
    });

    const sortedDates = Object.keys(dateMap).sort();
    allFollowerDaily[cfg.branchKey] = sortedDates.map((date, idx) => {
      const current = dateMap[date];
      const prev = idx > 0 ? dateMap[sortedDates[idx - 1]] : null;
      return {
        date: current.date,
        igFollowers: current.igFollowers,
        igDelta: prev ? current.igFollowers - prev.igFollowers : 0,
        tiktokFollowers: current.tiktokFollowers,
        ttDelta: prev ? current.tiktokFollowers - prev.tiktokFollowers : 0,
        reelsTitle: current.reelsTitle,
        viewers: current.viewers,
        likes: current.likes,
      };
    });
  });

  const todayStr = new Date().toISOString().split("T")[0];
  const picTracker = [
    { pic: "Nuha", role: "Rekap Story PWT", branch: "Purwokerto (Pusat)", sheetKey: "Rekap Story PWT", data: storyItems },
    { pic: "Ilya", role: "Rekap Reels PWT", branch: "Purwokerto (Pusat)", sheetKey: "Rekap PWT", data: allBranchReels["Rekap PWT"] || [] },
    { pic: "Ajun", role: "Rekap Reels PBG", branch: "Purbalingga", sheetKey: "Rekap PBG", data: allBranchReels["Rekap PBG"] || [] },
    { pic: "Amanda", role: "Rekap Reels TGL", branch: "Lunar Eyewear Tegal (Second Brand)", sheetKey: "Rekap TGL", data: allBranchReels["Rekap TGL"] || [] },
    { pic: "Arum", role: "Rekap Reels CLP", branch: "Cilacap", sheetKey: "Rekap CLP", data: allBranchReels["Rekap CLP"] || [] },
    { pic: "Febi", role: "Rekap Reels WNS", branch: "Wonosobo", sheetKey: "Rekap WNS", data: allBranchReels["Rekap WNS"] || [] },
  ].map((p) => {
    const dates = p.data
      .map((d: any) => d.reportDate)
      .filter((d: any) => d && d <= todayStr)
      .sort();
    const latestDate = dates.length > 0 ? dates[dates.length - 1] : "Belum pernah";
    const totalEntries = p.data.length;

    let daysBehind = 0;
    if (latestDate && latestDate.includes("-")) {
      const diff = Math.floor((new Date(todayStr).getTime() - new Date(latestDate).getTime()) / (1000 * 3600 * 24));
      daysBehind = Math.max(0, diff);
    }
    const isUpToDate = daysBehind <= 1;

    return {
      pic: p.pic,
      role: p.role,
      branch: p.branch,
      sheetKey: p.sheetKey,
      latestDate: latestDate,
      totalEntries: totalEntries,
      isUpToDate: isUpToDate,
      daysBehind: daysBehind,
      statusText: isUpToDate ? "Lengkap & Up-to-date" : `Tertunda ${daysBehind} hari (Terakhir: ${latestDate})`,
      whatsappReminder: `Halo ${p.pic}, mengingatkan untuk pengisian laporan harian di Spreadsheet "${p.sheetKey}". Data terakhir tercatat per tanggal ${latestDate}. Mohon diupdate sebelum meeting evaluasi mingguan ya. Terima kasih!`,
    };
  });

  // Check IG live cache if exists
  const igLiveCache = getCachedInstagramData();

  // Helper: Extract weekly evaluation data for a given 7-day period
  const buildPeriodRecap = (startDate: string, endDate: string, meetingDateTitle: string, meetingStatus: string) => {
    const weeklyReels: any[] = [];
    Object.entries(allBranchReels).forEach(([sheet, rows]) => {
      rows.forEach((r) => {
        const evaluatedInPeriod = r.evalReportDate && r.evalReportDate >= startDate && r.evalReportDate <= endDate;
        const uploadedInPeriod = r.uploadDate && r.uploadDate >= startDate && r.uploadDate <= endDate;

        if (!r.isDayOff && (evaluatedInPeriod || uploadedInPeriod)) {
          let liveIg: any = null;
          if (igLiveCache && igLiveCache.reels && r.reelsLink) {
            const shortcode = (r.reelsLink.match(/\/reel\/([A-Za-z0-9_-]+)/) || [])[1];
            if (shortcode) {
              liveIg = Object.entries(igLiveCache.reels).find(([k]) => k.includes(shortcode))?.[1];
            }
          }

          weeklyReels.push({
            branch: r.branch,
            sheetKey: sheet,
            pic: r.pic,
            date: r.uploadDate || r.reportDate,
            uploadDate: r.uploadDate || r.reportDate,
            evalReportDate: r.evalReportDate,
            title: r.reelsTitle,
            secondTitle: r.secondReelsTitle,
            pillar: r.contentPillar,
            viewers: r.viewers,
            sheetViewers: r.viewers,
            likes: liveIg && liveIg.likes ? liveIg.likes : r.likes,
            sheetLikes: r.likes,
            liveIgLikes: liveIg?.likes || null,
            igLikesFormatted: liveIg?.likesFormatted,
            igComments: liveIg?.comments,
            igCaption: liveIg?.caption || "",
            bonus: r.bonus,
            reelsLink: r.reelsLink,
            tiktokLink: r.tiktokLink,
            isEvaluated: r.isEvaluated,
            evaluationStatus: r.isEvaluated ? "Evaluasi H+3 Selesai" : "Menunggu Evaluasi H+3",
          });
        }
      });
    });

    const seen = new Set<string>();
    const dedupedReels: any[] = [];
    weeklyReels.forEach((r) => {
      const key = r.reelsLink || `${r.branch}_${r.title}_${r.uploadDate}`;
      if (!seen.has(key)) {
        seen.add(key);
        dedupedReels.push(r);
      }
    });

    dedupedReels.sort((a, b) => b.viewers - a.viewers);

    const weeklyStories = storyItems.filter((s) => s.reportDate && s.reportDate >= startDate && s.reportDate <= endDate);
    const questionCounts: Record<string, number> = {};
    let totalDms = 0;
    weeklyStories.forEach((s) => {
      totalDms += s.dmInquiries || 0;
      if (s.frequentQuestions && s.frequentQuestions !== "-") {
        const items = s.frequentQuestions.split(/[,;\n]/).map((t: string) => t.trim()).filter(Boolean);
        items.forEach((it: string) => {
          questionCounts[it] = (questionCounts[it] || 0) + 1;
        });
      }
    });

    const weeklyObstacles: any[] = [];
    weeklyStories.forEach((s) => {
      if (s.obstacle && s.obstacle !== "-" && s.obstacle !== "tidak ada" && s.obstacle !== "belum ada") {
        weeklyObstacles.push({
          date: s.reportDate,
          pic: "Nuha",
          role: "Story PWT",
          obstacle: s.obstacle,
          areaToImprove: s.areaToImprove,
        });
      }
    });
    dedupedReels.forEach((r) => {
      if (r.obstacle && r.obstacle !== "-" && r.obstacle !== "tidak ada" && r.obstacle !== "belum ada" && r.obstacle !== "libur") {
        weeklyObstacles.push({
          date: r.date,
          pic: r.pic,
          role: r.sheetKey,
          obstacle: r.obstacle,
          areaToImprove: "-",
        });
      }
    });

    return {
      periodKey: `${startDate}_to_${endDate}`,
      startDate,
      endDate,
      meetingDateTitle,
      meetingStatus,
      totalReelsUploaded: dedupedReels.filter((r) => r.uploadDate >= startDate && r.uploadDate <= endDate).length,
      totalStoriesRecorded: weeklyStories.length,
      totalDmInquiries: totalDms,
      topViralReels: dedupedReels.slice(0, 8),
      allWeeklyReels: dedupedReels,
      frequentStoryInquiries: Object.entries(questionCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([topic, count]) => ({ topic, count })),
      obstacleLogs: weeklyObstacles,
    };
  };

  const periodLastTuesday = buildPeriodRecap(
    "2026-09-08",
    "2026-09-14",
    "Selasa, 15 September 2026 (Periode 8–14 Sep)",
    "Sudah Berjalan / Evaluasi Resmi"
  );

  const periodNextTuesday = buildPeriodRecap(
    "2026-09-15",
    "2026-09-21",
    "Selasa, 22 September 2026 (Periode 15–21 Sep)",
    "Pemantauan Berjalan (Live Monitor H-7)"
  );

  // Extract spreadsheet followers per branch (H+3 latest recorded)
  const spreadsheetFollowersByBranch: Record<string, any> = {};
  branchConfigs.forEach((cfg) => {
    const sheet = workbook.Sheets[cfg.sheetName];
    if (!sheet) return;
    const rawRows: any[] = XLSX.utils.sheet_to_json(sheet);
    const withFollowers = rawRows.filter((r) => r["Jumlah Followers (Instagram)"] && r["Jumlah Followers (Instagram)"] !== "-");
    const last = withFollowers[withFollowers.length - 1];
    const followersCount = last ? normalizeFollowers(last["Jumlah Followers (Instagram)"], cfg.isKFollowers) : 0;
    const lastDate = last ? parseExcelDate(last["Tanggal Laporan"] || last["Cap waktu"] || last["Tanggal Upload"]) : null;
    spreadsheetFollowersByBranch[cfg.branchKey] = {
      branchName: cfg.branchName,
      city: cfg.city,
      followers: followersCount,
      followersFormatted: followersCount >= 100000 ? Math.round(followersCount / 1000) + "K" : followersCount.toLocaleString("id-ID"),
      lastRecordedDate: lastDate,
      pic: cfg.picDefault,
    };
  });

  // Extract all Bonus rows from Spreadsheet (Bonus Gaji Tim Konten per 3 hari)
  const allBonusEntries: any[] = [];
  branchConfigs.forEach((cfg) => {
    const sheet = workbook.Sheets[cfg.sheetName];
    if (!sheet) return;
    const rawRows: any[] = XLSX.utils.sheet_to_json(sheet);
    rawRows.forEach((r, idx) => {
      const b = r["Bonus"];
      const numB = typeof b === "number" ? b : parseInt(String(b).replace(/[^0-9]/g, "")) || 0;
      if (numB > 0) {
        const formatPic = (p: any) => {
          const s = String(p || "").trim();
          if (!s) return cfg.picDefault;
          return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
        };
        allBonusEntries.push({
          id: `${cfg.sheetName.toLowerCase()}-bonus-${idx}`,
          branch: cfg.branchName,
          city: cfg.city,
          pic: formatPic(r["Pengisi Laporan"] || cfg.picDefault),
          title: r["Judul Reels 2"] || r["Judul Reels"] || "-",
          uploadDate: parseExcelDate(r["Tanggal Upload"]),
          reviewDate: parseExcelDate(r["Tanggal Laporan"]),
          viewersH3: cleanMetric(r["Jumlah Viewers"]),
          likesH3: cleanMetric(r["Jumlah Like"]),
          bonusAmount: numB,
          bonusFormatted: "Rp " + numB.toLocaleString("id-ID"),
        });
      }
    });
  });

  allBonusEntries.sort((a, b) => (b.reviewDate || "").localeCompare(a.reviewDate || ""));

  const byPicSummary: Record<string, any> = {};
  allBonusEntries.forEach((item) => {
    if (!byPicSummary[item.pic]) {
      byPicSummary[item.pic] = { pic: item.pic, branch: item.branch, count: 0, totalAmount: 0, totalAmountFormatted: "" };
    }
    byPicSummary[item.pic].count++;
    byPicSummary[item.pic].totalAmount += item.bonusAmount;
    byPicSummary[item.pic].totalAmountFormatted = "Rp " + byPicSummary[item.pic].totalAmount.toLocaleString("id-ID");
  });

  const bonusSummary = {
    totalBonusPaid: allBonusEntries.reduce((sum, item) => sum + item.bonusAmount, 0),
    totalBonusPaidFormatted: "Rp " + allBonusEntries.reduce((sum, item) => sum + item.bonusAmount, 0).toLocaleString("id-ID"),
    totalEligibleVideos: allBonusEntries.length,
    byPic: Object.values(byPicSummary).sort((a, b) => b.totalAmount - a.totalAmount),
    entries: allBonusEntries,
  };

  // Additional Operational Sheets
  const designSheet = workbook.Sheets["Database Desain"];
  const rawDesign: any[] = designSheet ? XLSX.utils.sheet_to_json(designSheet) : [];
  const databaseDesain = rawDesign.map((r, i) => ({
    id: `desain-${i}`,
    timestamp: parseExcelDate(r["Cap waktu"]),
    date: parseExcelDate(r["Tanggal, Bulan"]),
    creator: r["Penginput"] || "-",
    designTitle: r["Nama Desain *tambahkan keterangan jika hasil Revisi (Contoh : Nama File-Revisi 2)"] || "-",
    fileUrl: r["Upload File "] || "",
  }));

  const proposalSheet = workbook.Sheets["Form Proposal"];
  const rawProposal: any[] = proposalSheet ? XLSX.utils.sheet_to_json(proposalSheet) : [];
  const formProposal = rawProposal.map((r, i) => ({
    id: `proposal-${i}`,
    timestamp: parseExcelDate(r["Cap waktu"]),
    institution: r["Nama Perusahaan/Sekolah/Event"] || "-",
    targetBranch: r["Pengajuan Untuk Cabang"] || "Purwokerto",
    eventName: r["Nama Event/Kegiatan"] || "-",
    eventDate: parseExcelDate(r["Tanggal Pelaksanaan Event/Kegiatan"]),
    description: r["Deskripsi Singkat Event/Kegiatan"] || "-",
    benefit: r["Banefit Yang Ditawarkan"] || "-",
    applicantName: r["Nama Pengaju"] || "-",
    applicantPhone: r["Nomor Hp Pengaju"] || "-",
    fileUrl: r["File Proposal Event/Kegiatan"] || "",
  }));

  const pengajuanSheet = workbook.Sheets["Form Pengajuan"];
  const rawPengajuan: any[] = pengajuanSheet ? XLSX.utils.sheet_to_json(pengajuanSheet) : [];
  const formPengajuan = rawPengajuan.map((r, i) => ({
    id: `pengajuan-${i}`,
    timestamp: parseExcelDate(r["Cap waktu"]),
    branch: r["Cabang"] || "-",
    applicantName: r["Nama Pengaju"] || "-",
    requestedItems: r["Alat/barang yang diajukan (tuliskan juga jumlahnya)"] || "-",
    purpose: r["Tujuan/alasan pengajuan"] || "-",
  }));

  const output = {
    syncTimestamp: new Date().toISOString(),
    sourceUrl:
      "https://docs.google.com/spreadsheets/d/1BU0fIDP656Y-eue55bWVSxeaixSeFJwR3GP1n8kwBYc/edit?usp=sharing",
    officialAccounts: [
      { name: "Optik I See You Purwokerto (Pusat)", handle: "@iseeyou.glasses", url: "https://www.instagram.com/iseeyou.glasses/", city: "Purwokerto", pic: "Ilya & Nuha" },
      { name: "Optik I See You Purbalingga", handle: "@iseeyou.purbalingga", url: "https://www.instagram.com/iseeyou.purbalingga/", city: "Purbalingga", pic: "Ajun" },
      { name: "Optik I See You Cilacap", handle: "@iseeyou.cilacap", url: "https://www.instagram.com/iseeyou.cilacap/", city: "Cilacap", pic: "Arum" },
      { name: "Optik I See You Wonosobo", handle: "@iseeyou.wonosobo", url: "https://www.instagram.com/iseeyou.wonosobo/", city: "Wonosobo", pic: "Febi" },
      { name: "Lunar Eyewear Tegal (Second Brand)", handle: "@lunareyewear.co", url: "https://www.instagram.com/lunareyewear.co", city: "Tegal", pic: "Amanda" },
    ],
    picTracker: picTracker,
    storyData: storyItems,
    branchReels: allBranchReels,
    dailyFollowersTracker: allFollowerDaily,
    spreadsheetFollowersByBranch: spreadsheetFollowersByBranch,
    bonusSummary: bonusSummary,
    databaseDesain: databaseDesain,
    formProposal: formProposal,
    formPengajuan: formPengajuan,
    executiveRecap: {
      meetingTarget: "Selasa Depan (Weekly Executive Board: HRD, Head, Finance, Owner)",
      liveFollowersByBranch: igLiveCache?.accounts || null,
      spreadsheetFollowersByBranch: spreadsheetFollowersByBranch,
      igLiveCache: igLiveCache || null,
      bonusSummary: bonusSummary,
      latestTotalNetworkFollowers: {
        instagram: 226581 + 6195 + 3946 + 7361 + 1248,
        tiktok: 87200 + 979 + 3031 + 42 + 541,
      },
      periods: {
        lastTuesday: periodLastTuesday,
        nextTuesday: periodNextTuesday,
      },
      activePeriodKey: "lastTuesday",
    },
  };

  const outPath = path.join(process.cwd(), "lib/real-sheets-data.json");
  try {
    fs.writeFileSync(outPath, JSON.stringify(output, null, 2), "utf-8");
  } catch {
    // Vercel serverless read-only fallback
  }

  return output;
}

// GET: returns cached data or automatically syncs if older than 5 minutes or fresh requested
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const forceFresh = searchParams.get("fresh") === "true" || searchParams.get("force") === "true";
    const filePath = path.join(process.cwd(), "lib/real-sheets-data.json");

    let cachedData: any = null;
    let cacheAgeMs = Infinity;

    if (fs.existsSync(filePath)) {
      try {
        cachedData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        if (cachedData.syncTimestamp) {
          cacheAgeMs = Date.now() - new Date(cachedData.syncTimestamp).getTime();
        }
      } catch (e) {
        cachedData = null;
      }
    }

    // If cache is younger than 5 minutes (300,000 ms) and force is not requested, return fast cache
    const MAX_CACHE_AGE_MS = 5 * 60 * 1000;
    if (cachedData && cacheAgeMs < MAX_CACHE_AGE_MS && !forceFresh) {
      return NextResponse.json({
        success: true,
        data: cachedData,
        source: "cache",
        ageSeconds: Math.round(cacheAgeMs / 1000),
      });
    }

    // Otherwise, perform live automatic sync
    const freshData = await syncSpreadsheetData();
    return NextResponse.json({
      success: true,
      data: freshData,
      source: "live_sync",
      ageSeconds: 0,
    });
  } catch (err: any) {
    // If live sync fails but we have stale cache, return stale cache with warning
    const filePath = path.join(process.cwd(), "lib/real-sheets-data.json");
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      return NextResponse.json({
        success: true,
        data,
        source: "stale_fallback",
        warning: `Live sync gagal: ${err.message}`,
      });
    }
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: explicit on-demand sync
export async function POST() {
  try {
    const data = await syncSpreadsheetData();
    return NextResponse.json({
      success: true,
      message: "Sinkronisasi Google Sheets berhasil diperbarui!",
      data,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
