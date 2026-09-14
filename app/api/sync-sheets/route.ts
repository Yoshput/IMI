import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

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

    branchConfigs.forEach((cfg) => {
      const sheet = workbook.Sheets[cfg.sheetName];
      if (!sheet) return;
      const rawRows: any[] = XLSX.utils.sheet_to_json(sheet);

      const parsedRows = rawRows
        .map((row, idx) => {
          const reportDate = parseExcelDate(row["Tanggal Laporan"] || row["Cap waktu"]);
          const igFollowers = normalizeFollowers(row["Jumlah Followers (Instagram)"], cfg.isKFollowers);
          const tiktokFollowers = normalizeFollowers(row["Jumlah Followers (Tik-Tok)"], cfg.isKFollowers);

          return {
            id: `${cfg.sheetName.toLowerCase()}-${idx}`,
            sheetKey: cfg.sheetName,
            branch: cfg.branchName,
            branchKey: cfg.branchKey,
            city: cfg.city,
            pic: row["Pengisi Laporan"] || cfg.picDefault,
            timestamp: parseExcelDate(row["Cap waktu"]),
            reportDate: reportDate,
            reelsTitle: row["Judul Reels"] || row["Judul Reels 2"] || "-",
            secondReelsTitle: row["Judul Reels 2"] && row["Judul Reels 2"] !== "-" ? row["Judul Reels 2"] : undefined,
            contentPillar: row["Konten Pilar"] || "Umum",
            reelsLink: row["Link Reels Instagram"] || "",
            feedLink: row["Link Feed/Carousel Instagram"] || "",
            threadsLink: row["  Link Instagram Threads   "] || row["Link Instagram Threads"] || "",
            tiktokLink: row["Link Video Tik- Tok (mirorring)"] || "",
            igFollowers: igFollowers,
            tiktokFollowers: tiktokFollowers,
            viewers: cleanNumber(row["Jumlah Viewers"]),
            likes: cleanNumber(row["Jumlah Like"]),
            bonus: row["Bonus"] || "-",
            obstacle: row["Kendala Content Creator"] || "-",
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

    const topPerformers: any[] = [];
    Object.entries(allBranchReels).forEach(([, rows]) => {
      rows.forEach((r) => {
        if (r.viewers > 1500) {
          topPerformers.push({
            branch: r.branch,
            pic: r.pic,
            date: r.reportDate,
            title: r.reelsTitle,
            pillar: r.contentPillar,
            viewers: r.viewers,
            likes: r.likes,
            reelsLink: r.reelsLink,
          });
        }
      });
    });
    topPerformers.sort((a, b) => b.viewers - a.viewers);

    const questionCounts: Record<string, number> = {};
    storyItems.forEach((s) => {
      if (s.frequentQuestions && s.frequentQuestions !== "-") {
        const items = s.frequentQuestions.split(/[,;\n]/).map((t: string) => t.trim()).filter(Boolean);
        items.forEach((it: string) => {
          questionCounts[it] = (questionCounts[it] || 0) + 1;
        });
      }
    });

    const obstacleLogs: any[] = [];
    storyItems.forEach((s) => {
      if (s.obstacle && s.obstacle !== "-" && s.obstacle !== "tidak ada" && s.obstacle !== "belum ada") {
        obstacleLogs.push({
          date: s.reportDate,
          pic: "Nuha",
          role: "Story PWT",
          obstacle: s.obstacle,
          areaToImprove: s.areaToImprove,
        });
      }
    });
    Object.entries(allBranchReels).forEach(([sheet, rows]) => {
      rows.forEach((r) => {
        if (r.obstacle && r.obstacle !== "-" && r.obstacle !== "tidak ada" && r.obstacle !== "belum ada" && r.obstacle !== "libur") {
          obstacleLogs.push({
            date: r.reportDate,
            pic: r.pic,
            role: `${sheet}`,
            obstacle: r.obstacle,
            areaToImprove: "-",
          });
        }
      });
    });

    const output = {
      syncTimestamp: new Date().toISOString(),
      sourceUrl:
        "https://docs.google.com/spreadsheets/d/1BU0fIDP656Y-eue55bWVSxeaixSeFJwR3GP1n8kwBYc/edit?usp=sharing",
      picTracker: picTracker,
      storyData: storyItems,
      branchReels: allBranchReels,
      dailyFollowersTracker: allFollowerDaily,
      executiveRecap: {
        meetingTarget: "Selasa Depan (Weekly Executive Board: HRD, Head, Finance, Owner)",
        latestTotalNetworkFollowers: {
          instagram: 226581 + 6195 + 3946 + 7361 + 1248,
          tiktok: 87200 + 979 + 3031 + 42 + 541,
        },
        topViralReels: topPerformers.slice(0, 8),
        frequentStoryInquiries: Object.entries(questionCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([topic, count]) => ({ topic, count })),
        obstacleLogs: obstacleLogs.slice(-12).reverse(),
      },
    };

    const outPath = path.join(process.cwd(), "lib/real-sheets-data.json");
    try {
      fs.writeFileSync(outPath, JSON.stringify(output, null, 2), "utf-8");
    } catch {
      // Di serverless environment seperti Vercel, filesystem bersifat read-only.
      // Data tetap berhasil diparsing dan dikirimkan langsung via response JSON.
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
