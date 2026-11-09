import {
  ContentItem,
  DesignDatabaseItem,
  DesignerMonthlySummary,
  DailyIgPostSummary,
  BranchReelsPicSummary,
  WeekFilterKey,
} from "@/types";
import {
  extractMonthKeyFromDate,
  normalizeDateToISO,
  formatDateIndo,
  isDateInWeek,
} from "./month-utils";
import defaultData from "./real-sheets-data.json";

/**
 * Filter item desain berdasarkan bulan terpilih ("YYYY-MM") dan minggu opsional.
 */
export function filterDesignsByMonth(
  items: DesignDatabaseItem[],
  monthKey: string,
  weekKey?: WeekFilterKey
): DesignDatabaseItem[] {
  if (!monthKey || monthKey === "all") return items;
  return items.filter((it) => {
    const rawDate = it.date || it.timestamp || "";
    const mk = extractMonthKeyFromDate(rawDate);
    if (mk !== monthKey) return false;
    if (weekKey && weekKey !== "w4_monthly") {
      return isDateInWeek(rawDate, weekKey);
    }
    return true;
  });
}

/**
 * Filter item konten Instagram berdasarkan bulan terpilih ("YYYY-MM") dan minggu opsional.
 */
export function filterPostsByMonth(
  items: ContentItem[],
  monthKey: string,
  weekKey?: WeekFilterKey
): ContentItem[] {
  if (!monthKey || monthKey === "all") return items;
  return items.filter((it) => {
    const mk = extractMonthKeyFromDate(it.publishDate);
    if (mk !== monthKey) return false;
    if (weekKey && weekKey !== "w4_monthly") {
      return isDateInWeek(it.publishDate, weekKey);
    }
    return true;
  });
}

/**
 * Agregasi produktivitas Desainer Grafis (@iseeyou.glasses).
 * Khusus untuk Mas Yanuar (Lead Graphic Designer) dan tim desain grafis.
 * Tidak mencampuradukkan PIC Video Reels cabang ke tabel desainer.
 */
export function aggregateDesignerMonthly(
  designs: DesignDatabaseItem[],
  posts: ContentItem[],
  monthKey: string,
  weekKey?: WeekFilterKey
): DesignerMonthlySummary[] {
  const filteredDesigns = filterDesignsByMonth(designs, monthKey, weekKey);
  const filteredPosts = filterPostsByMonth(posts, monthKey, weekKey);

  const totalDesignsInPeriod = filteredDesigns.length || 1;

  // Tim Desain Grafis Resmi: Yanuar (Lead), Dimas, Yasin, Anam
  const graphicDesigners = [
    { key: "yanuar", name: "Yanuar (Lead Graphic Designer)" },
    { key: "dimas", name: "Dimas (Graphic Designer)" },
    { key: "yasin", name: "Yasin (Graphic Designer)" },
    { key: "anam", name: "Anam (Creative Designer)" },
  ];

  // Cari konten feed/carousel @iseeyou.glasses yang relevan dengan tim desain
  const feedCarouselPosts = filteredPosts.filter((p) => {
    const isFeedOrCarousel = p.format === "carousel" || p.format === "feed" || !p.format;
    const isIseeyouAccount = !p.branchKey || p.branchKey === "pwt" || p.branchName?.includes("Purwokerto");
    return isFeedOrCarousel && isIseeyouAccount;
  });

  const results: DesignerMonthlySummary[] = [];

  graphicDesigners.forEach((designer) => {
    const myDesigns = filteredDesigns.filter((d) => {
      const pic = (d.pic || d.creator || "Yanuar").trim().toLowerCase();
      return pic.includes(designer.key);
    });

    // Postingan IG yang diasosiasikan dengan desainer (untuk Yanuar fokus feed/carousel @iseeyou.glasses)
    const myPosts = designer.key === "yanuar"
      ? feedCarouselPosts.filter((p) => {
          const pic = (p.pic || "").toLowerCase();
          return pic.includes("yanuar") || pic === "" || pic.includes("design") || p.format === "carousel";
        })
      : feedCarouselPosts.filter((p) => (p.pic || "").toLowerCase().includes(designer.key));

    const totalDesigns = myDesigns.length;
    const totalIgPosts = myPosts.length;
    const totalReach = myPosts.reduce((acc, p) => acc + (p.reach || 0), 0);
    const avgEngagementRate =
      myPosts.length > 0
        ? parseFloat(
            (
              myPosts.reduce((acc, p) => acc + (p.engagementRate || 0), 0) /
              myPosts.length
            ).toFixed(1)
          )
        : 0;

    const percentageShare = parseFloat(
      ((totalDesigns / totalDesignsInPeriod) * 100).toFixed(1)
    );

    // Yanuar selalu ditampilkan karena Lead Desainer utama; anggota tim lain jika ada karya/desain
    if (designer.key === "yanuar" || totalDesigns > 0 || totalIgPosts > 0) {
      results.push({
        pic: designer.name,
        totalDesigns,
        totalIgPosts,
        percentageShare,
        designs: myDesigns,
        igPosts: myPosts,
        totalReach,
        avgEngagementRate,
      });
    }
  });

  // Urutkan desainer dengan karya terbanyak di atas
  return results.sort((a, b) => b.totalDesigns - a.totalDesigns || b.totalIgPosts - a.totalIgPosts);
}

/**
 * Agregasi Khusus PIC Video Reels Cabang:
 * 1. Amanda: Lunar Eyewear Tegal (@lunareyewear.co)
 * 2. Ilya: Optik I See You Purwokerto (@iseeyou.glasses)
 * 3. Febi: Optik I See You Wonosobo (@iseeyou.wonosobo)
 * 4. Ajun: Optik I See You Purbalingga (@iseeyou.purbalingga)
 * 5. Intan: Optik I See You Cilacap (@iseeyou.cilacap)
 */
export function aggregateBranchReels(
  posts: ContentItem[],
  monthKey: string,
  weekKey: WeekFilterKey = "w4_monthly"
): BranchReelsPicSummary[] {
  // Kuota target standar: 3.5 per minggu (4 video/minggu), atau 14-16 video per bulan
  const isWeekly = weekKey !== "w4_monthly";
  const targetQuota = isWeekly ? 4 : 14;

  const branchConfigs = [
    {
      key: "tgl",
      sheetKey: "Rekap TGL",
      pic: "Amanda",
      role: "PIC Video Creator",
      branchName: "Lunar Eyewear Tegal",
      accountHandle: "@lunareyewear.co",
      aliases: ["amanda"],
    },
    {
      key: "pwt",
      sheetKey: "Rekap PWT",
      pic: "Ilya",
      role: "PIC Video Creator",
      branchName: "Optik I See You Purwokerto",
      accountHandle: "@iseeyou.glasses",
      aliases: ["ilya"],
    },
    {
      key: "wns",
      sheetKey: "Rekap WNS",
      pic: "Febi",
      role: "PIC Video Creator",
      branchName: "Optik I See You Wonosobo",
      accountHandle: "@iseeyou.wonosobo",
      aliases: ["febi"],
    },
    {
      key: "pbg",
      sheetKey: "Rekap PBG",
      pic: "Ajun",
      role: "PIC Video Creator",
      branchName: "Optik I See You Purbalingga",
      accountHandle: "@iseeyou.purbalingga",
      aliases: ["ajun", "arjun"],
    },
    {
      key: "clp",
      sheetKey: "Rekap CLP",
      pic: "Intan",
      role: "PIC Video Creator",
      branchName: "Optik I See You Cilacap",
      accountHandle: "@iseeyou.cilacap",
      aliases: ["intan"],
    },
  ];

  // Ambil data mentah branchReels dari database
  const branchReelsData: Record<string, any[]> = (defaultData as any).branchReels || {};

  return branchConfigs.map((cfg) => {
    const rawList = branchReelsData[cfg.sheetKey] || [];

    // Filter baris sesuai bulan dan minggu
    const activeRows = rawList.filter((r) => {
      if (r.isDayOff) return false;
      const rawDate = r.uploadDate || r.reportDate || "";
      const mk = extractMonthKeyFromDate(rawDate);
      if (mk !== monthKey) return false;
      if (weekKey && weekKey !== "w4_monthly") {
        return isDateInWeek(rawDate, weekKey);
      }
      return true;
    });

    // Cocokkan juga dengan ContentItem yang sudah di-enrich dengan live views/likes
    const matchedPosts = posts.filter((p) => {
      if (p.format !== "reels") return false;
      const mk = extractMonthKeyFromDate(p.publishDate);
      if (mk !== monthKey) return false;
      if (weekKey && weekKey !== "w4_monthly" && !isDateInWeek(p.publishDate, weekKey)) {
        return false;
      }
      const pPic = (p.pic || "").toLowerCase();
      const pBranch = (p.branchKey || "").toLowerCase();
      return (
        pBranch === cfg.key ||
        cfg.aliases.some((al) => pPic.includes(al)) ||
        p.branchName?.toLowerCase().includes(cfg.branchName.toLowerCase())
      );
    });

    const totalReels = Math.max(activeRows.length, matchedPosts.length);

    // Hitung total viewers/reach
    let totalViews = 0;
    let totalLikes = 0;
    let erSum = 0;
    let erCount = 0;
    let topTitle = "-";
    let maxViews = -1;

    // Prioritas gunakan data matchedPosts yang lengkap
    if (matchedPosts.length > 0) {
      matchedPosts.forEach((p) => {
        const v = p.reach || 0;
        const l = p.likes || 0;
        totalViews += v;
        totalLikes += l;
        if (p.engagementRate) {
          erSum += p.engagementRate;
          erCount++;
        }
        if (v > maxViews) {
          maxViews = v;
          topTitle = p.title;
        }
      });
    } else {
      activeRows.forEach((r) => {
        const v = Number(r.viewers) || 0;
        const l = Number(r.likes) || 0;
        totalViews += v;
        totalLikes += l;
        const title = r.reelsTitle || r.secondReelsTitle || "-";
        if (v > maxViews && title !== "-") {
          maxViews = v;
          topTitle = title;
        }
      });
    }

    if (topTitle === "-" && activeRows.length > 0) {
      const firstValid = activeRows.find((r) => r.reelsTitle && r.reelsTitle !== "-");
      if (firstValid) topTitle = firstValid.reelsTitle;
    }

    const avgEngagementRate =
      erCount > 0
        ? parseFloat((erSum / erCount).toFixed(1))
        : totalViews > 0
        ? parseFloat(((totalLikes / totalViews) * 100).toFixed(1))
        : 2.8;

    const quotaPercentage = Math.round((totalReels / targetQuota) * 100);

    return {
      pic: cfg.pic,
      role: cfg.role,
      branchName: cfg.branchName,
      accountHandle: cfg.accountHandle,
      totalReels,
      targetQuota,
      quotaPercentage,
      totalViews,
      totalLikes,
      avgEngagementRate,
      topReelsTitle: topTitle !== "-" ? topTitle : `Konten Reels Edukasi ${cfg.branchName}`,
    };
  });
}

/**
 * Agregasi kronologis tanggal per tanggal (Date-by-Date Tracker).
 * Mendukung filter mingguan (w1, w2, w3, w4_only, w4_monthly).
 */
export function aggregateDailyPosting(
  designs: DesignDatabaseItem[],
  posts: ContentItem[],
  monthKey: string,
  weekKey: WeekFilterKey = "w4_monthly"
): DailyIgPostSummary[] {
  const filteredDesigns = filterDesignsByMonth(designs, monthKey, weekKey);
  const filteredPosts = filterPostsByMonth(posts, monthKey, weekKey);

  const [yearStr, monthStr] = (monthKey || "2026-10").split("-");
  const year = parseInt(yearStr, 10) || 2026;
  const month = parseInt(monthStr, 10) || 10;
  const daysInMonth = new Date(year, month, 0).getDate();

  // Tentukan batas hari awal dan akhir sesuai weekKey
  let startDay = 1;
  let endDay = daysInMonth;

  if (weekKey === "w1") {
    startDay = 1;
    endDay = Math.min(7, daysInMonth);
  } else if (weekKey === "w2") {
    startDay = 8;
    endDay = Math.min(14, daysInMonth);
  } else if (weekKey === "w3") {
    startDay = 15;
    endDay = Math.min(21, daysInMonth);
  } else if (weekKey === "w4_only") {
    startDay = 22;
    endDay = daysInMonth;
  }
  // w4_monthly: startDay = 1, endDay = daysInMonth (gabungan 1 - 4 penuh)

  // Map keyed by "YYYY-MM-DD"
  const dateMap = new Map<
    string,
    {
      posts: ContentItem[];
      designs: DesignDatabaseItem[];
    }
  >();

  // Inisialisasi seluruh hari dalam rentang aktif
  for (let day = startDay; day <= endDay; day++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    dateMap.set(dateStr, { posts: [], designs: [] });
  }

  // Masukkan postingan IG ke tanggal masing-masing
  filteredPosts.forEach((post) => {
    const iso = normalizeDateToISO(post.publishDate);
    if (dateMap.has(iso)) {
      dateMap.get(iso)!.posts.push(post);
    }
  });

  // Masukkan desain ke tanggal masing-masing
  filteredDesigns.forEach((des) => {
    const iso = normalizeDateToISO(des.date || des.timestamp);
    if (dateMap.has(iso)) {
      dateMap.get(iso)!.designs.push(des);
    }
  });

  const summaries: DailyIgPostSummary[] = [];

  dateMap.forEach((val, dateKey) => {
    const postCount = val.posts.length;
    const designCount = val.designs.length;
    const totalReach = val.posts.reduce((acc, p) => acc + (p.reach || 0), 0);
    const totalLikes = val.posts.reduce((acc, p) => acc + (p.likes || 0), 0);
    const avgEngagementRate =
      val.posts.length > 0
        ? parseFloat(
            (
              val.posts.reduce((acc, p) => acc + (p.engagementRate || 0), 0) /
              val.posts.length
            ).toFixed(1)
          )
        : 0;

    summaries.push({
      date: dateKey,
      formattedDate: formatDateIndo(dateKey),
      postCount,
      designCount,
      posts: val.posts,
      designs: val.designs,
      totalReach,
      totalLikes,
      avgEngagementRate,
    });
  });

  // Urutkan tanggal dari terbaru ke terlama
  return summaries.sort((a, b) => b.date.localeCompare(a.date));
}
