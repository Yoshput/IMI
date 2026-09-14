import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import { getCachedInstagramData } from "@/lib/instagram-realtime";

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

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "lib/real-sheets-data.json");
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      return NextResponse.json({ success: true, data });
    }
    return NextResponse.json({ success: false, error: "File not found" }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const sheetUrl =
      "https://docs.google.com/spreadsheets/d/1BU0fIDP656Y-eue55bWVSxeaixSeFJwR3GP1n8kwBYc/export?format=xlsx";

    const res = await fetch(sheetUrl);
    if (!res.ok) {
      throw new Error(`Gagal fetch Google Sheets: ${res.statusText}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const workbook = XLSX.read(buffer, { type: "buffer" });

    // 1. Process Rekap Story PWT (Mba Nuha)
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
    const branchConfigs = [
      { sheetName: "Rekap PWT", picDefault: "Mba Ilya", branchName: "Purwokerto (Pusat)", city: "Purwokerto", branchKey: "PWT", isKFollowers: true },
      { sheetName: "Rekap PBG", picDefault: "Mba Ajun", branchName: "Purbalingga", city: "Purbalingga", branchKey: "PBG", isKFollowers: false },
      { sheetName: "Rekap TGL", picDefault: "Mba Amanda", branchName: "Lunar Eyewear Tegal (Second Brand)", city: "Tegal", branchKey: "TGL", isKFollowers: false },
      { sheetName: "Rekap CLP", picDefault: "Mba Arum", branchName: "Cilacap", city: "Cilacap", branchKey: "CLP", isKFollowers: false },
      { sheetName: "Rekap WNS", picDefault: "Mba Febi", branchName: "Wonosobo", city: "Wonosobo", branchKey: "WNS", isKFollowers: false },
    ];

    const allBranchReels: Record<string, any[]> = {};
    const allFollowerDaily: Record<string, any[]> = {};

    const resolveReelsTitle = (title1: any, title2: any) => {
      const clean = (t: any) => String(t || "").trim();
      const t1 = clean(title1);
      const t2 = clean(title2);
      const isInvalid = (t: string) =>
        !t ||
        t === "-" ||
        t.toLowerCase() === "libur" ||
        t.toLowerCase() === "tidak ada" ||
        t.toLowerCase() === "belum ada";

      if (isInvalid(t1) && !isInvalid(t2)) return t2;
      if (!isInvalid(t1) && isInvalid(t2)) return t1;
      if (!isInvalid(t1) && !isInvalid(t2)) return t1;
      if (t1.toLowerCase() === "libur" || t2.toLowerCase() === "libur") return "(Libur / Off Duty)";
      return t1 || t2 || "-";
    };

    branchConfigs.forEach((cfg) => {
      const sheet = workbook.Sheets[cfg.sheetName];
      if (!sheet) return;
      const rawRows: any[] = XLSX.utils.sheet_to_json(sheet);

      // Pre-pass: map known video titles to active Instagram links
      const titleToLinkMap: Record<string, string> = {};
      rawRows.forEach((row) => {
        const link = String(row["Link Reels Instagram"] || "").trim();
        if (link && link.startsWith("http")) {
          const t1 = String(row["Judul Reels"] || "").trim().toLowerCase();
          const t2 = String(row["Judul Reels 2"] || "").trim().toLowerCase();
          if (t1 && t1 !== "libur" && t1 !== "-") titleToLinkMap[t1] = link;
          if (t2 && t2 !== "libur" && t2 !== "-") titleToLinkMap[t2] = link;
        }
      });

      const parsedRows = rawRows
        .map((row, idx) => {
          const reportDate = parseExcelDate(row["Tanggal Laporan"] || row["Cap waktu"]);
          const igFollowers = normalizeFollowers(row["Jumlah Followers (Instagram)"], cfg.isKFollowers);
          const tiktokFollowers = normalizeFollowers(row["Jumlah Followers (Tik-Tok)"], cfg.isKFollowers);

          const actualTitle = resolveReelsTitle(row["Judul Reels"], row["Judul Reels 2"]);
          let actualLink = String(row["Link Reels Instagram"] || "").trim();
          if (!actualLink.startsWith("http")) {
            actualLink = titleToLinkMap[actualTitle.toLowerCase()] || "";
          }

          const cleanLink = (url: any) => {
            const s = String(url || "").trim();
            if (!s || s.toLowerCase() === "libur" || s === "-" || !s.startsWith("http")) return "";
            return s;
          };

          return {
            id: `${cfg.sheetName.toLowerCase()}-${idx}`,
            sheetKey: cfg.sheetName,
            branch: cfg.branchName,
            branchKey: cfg.branchKey,
            city: cfg.city,
            pic: row["Pengisi Laporan"] || cfg.picDefault,
            timestamp: parseExcelDate(row["Cap waktu"]),
            reportDate: reportDate,
            reelsTitle: actualTitle,
            secondReelsTitle: row["Judul Reels 2"] && row["Judul Reels 2"] !== "-" && row["Judul Reels 2"].toLowerCase() !== "libur" ? row["Judul Reels 2"] : undefined,
            contentPillar: row["Konten Pilar"] || "Umum",
            reelsLink: cleanLink(actualLink),
            feedLink: cleanLink(row["Link Feed/Carousel Instagram"]),
            threadsLink: cleanLink(row["  Link Instagram Threads   "] || row["Link Instagram Threads"]),
            tiktokLink: cleanLink(row["Link Video Tik- Tok (mirorring)"]),
            igFollowers: igFollowers,
            tiktokFollowers: tiktokFollowers,
            viewers: cleanNumber(row["Jumlah Viewers"] || row["Jumlah Viewer (Reels Instagram)"]),
            likes: cleanNumber(row["Jumlah Like"] || row["Jumlah Likes (Reels Instagram)"]),
            bonus: row["Bonus"] || "-",
            obstacle: (row["Kendala Content Creator"] || row["Kendala"] || "-").trim()
          };
        })
        .filter((r) => r.reportDate);

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
        const igDelta = prev ? current.igFollowers - prev.igFollowers : 0;
        const ttDelta = prev ? current.tiktokFollowers - prev.tiktokFollowers : 0;
        return {
          date: current.date,
          igFollowers: current.igFollowers,
          igDelta: igDelta,
          tiktokFollowers: current.tiktokFollowers,
          ttDelta: ttDelta,
          reelsTitle: current.reelsTitle,
          viewers: current.viewers,
          likes: current.likes,
        };
      });
    });

    const picTracker = [
      { pic: "Mba Nuha", role: "Rekap Story PWT", branch: "Purwokerto (Pusat)", sheetKey: "Rekap Story PWT", data: storyItems },
      { pic: "Mba Ilya", role: "Rekap Reels PWT", branch: "Purwokerto (Pusat)", sheetKey: "Rekap PWT", data: allBranchReels["Rekap PWT"] || [] },
      { pic: "Mba Ajun", role: "Rekap Reels PBG", branch: "Purbalingga", sheetKey: "Rekap PBG", data: allBranchReels["Rekap PBG"] || [] },
      { pic: "Mba Amanda", role: "Rekap Reels TGL", branch: "Lunar Eyewear Tegal (Second Brand)", sheetKey: "Rekap TGL", data: allBranchReels["Rekap TGL"] || [] },
      { pic: "Mba Arum", role: "Rekap Reels CLP", branch: "Cilacap", sheetKey: "Rekap CLP", data: allBranchReels["Rekap CLP"] || [] },
      { pic: "Mba Febi", role: "Rekap Reels WNS", branch: "Wonosobo", sheetKey: "Rekap WNS", data: allBranchReels["Rekap WNS"] || [] },
    ].map((p) => {
      const dates = p.data.map((d: any) => d.reportDate).filter(Boolean).sort();
      const latestDate = dates.length > 0 ? dates[dates.length - 1] : "Belum pernah";
      const totalEntries = p.data.length;
      const isUpToDate = latestDate >= "2026-09-11";
      let daysBehind = 0;
      if (latestDate && latestDate.includes("-")) {
        const diff = Math.floor((new Date("2026-09-14").getTime() - new Date(latestDate).getTime()) / (1000 * 3600 * 24));
        daysBehind = Math.max(0, diff);
      }

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

    const igLiveCache = getCachedInstagramData();

    // Helper: Extract weekly evaluation data for a given 7-day period
    const buildPeriodRecap = (startDate: string, endDate: string, meetingDateTitle: string, meetingStatus: string) => {
      const weeklyReels: any[] = [];
      Object.entries(allBranchReels).forEach(([sheet, rows]) => {
        rows.forEach((r) => {
          if (r.reportDate >= startDate && r.reportDate <= endDate) {
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
              date: r.reportDate,
              title: r.reelsTitle,
              secondTitle: r.secondReelsTitle,
              pillar: r.contentPillar,
              viewers: r.viewers,
              likes: liveIg && liveIg.likes ? liveIg.likes : r.likes,
              igLikesFormatted: liveIg?.likesFormatted,
              igComments: liveIg?.comments,
              igCaption: liveIg?.caption || "",
              reelsLink: r.reelsLink,
              tiktokLink: r.tiktokLink,
            });
          }
        });
      });
      // Sort by viewers descending
      weeklyReels.sort((a, b) => b.viewers - a.viewers);

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
      weeklyReels.forEach((r) => {
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
        totalReelsUploaded: weeklyReels.length,
        totalStoriesRecorded: weeklyStories.length,
        totalDmInquiries: totalDms,
        topViralReels: weeklyReels.slice(0, 8),
        allWeeklyReels: weeklyReels,
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

    const output = {
      syncTimestamp: new Date().toISOString(),
      sourceUrl:
        "https://docs.google.com/spreadsheets/d/1BU0fIDP656Y-eue55bWVSxeaixSeFJwR3GP1n8kwBYc/edit?usp=sharing",
      officialAccounts: [
        { name: "Optik I See You Purwokerto (Pusat)", handle: "@iseeyou.glasses", url: "https://www.instagram.com/iseeyou.glasses/", city: "Purwokerto", pic: "Mba Ilya & Mba Nuha" },
        { name: "Optik I See You Purbalingga", handle: "@iseeyou.purbalingga", url: "https://www.instagram.com/iseeyou.purbalingga/", city: "Purbalingga", pic: "Mba Ajun" },
        { name: "Optik I See You Cilacap", handle: "@iseeyou.cilacap", url: "https://www.instagram.com/iseeyou.cilacap/", city: "Cilacap", pic: "Mba Arum" },
        { name: "Optik I See You Wonosobo", handle: "@iseeyou.wonosobo", url: "https://www.instagram.com/iseeyou.wonosobo/", city: "Wonosobo", pic: "Mba Febi" },
        { name: "Lunar Eyewear Tegal (Second Brand)", handle: "@lunareyewear.co", url: "https://www.instagram.com/lunareyewear.co", city: "Tegal", pic: "Mba Amanda" },
      ],
      picTracker: picTracker,
      storyData: storyItems,
      branchReels: allBranchReels,
      dailyFollowersTracker: allFollowerDaily,
      executiveRecap: {
        meetingTarget: "Selasa Depan (Weekly Executive Board: HRD, Head, Finance, Owner)",
        liveFollowersByBranch: igLiveCache?.accounts || null,
        igLiveCache: igLiveCache || null,
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
      // Vercel serverless read-only
    }

    return NextResponse.json({
      success: true,
      message: "Sinkronisasi Google Sheets berhasil!",
      data: output,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
