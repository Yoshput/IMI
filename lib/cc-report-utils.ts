import {
  ContentItem,
  DesignDatabaseItem,
  DesignerMonthlySummary,
  DailyIgPostSummary,
} from "@/types";
import {
  extractMonthKeyFromDate,
  normalizeDateToISO,
  formatDateIndo,
} from "./month-utils";

/**
 * Filter item desain berdasarkan bulan terpilih ("YYYY-MM").
 */
export function filterDesignsByMonth(
  items: DesignDatabaseItem[],
  monthKey: string
): DesignDatabaseItem[] {
  if (!monthKey || monthKey === "all") return items;
  return items.filter((it) => {
    const mk = extractMonthKeyFromDate(it.date || it.timestamp || "");
    return mk === monthKey;
  });
}

/**
 * Filter item konten Instagram berdasarkan bulan terpilih ("YYYY-MM").
 */
export function filterPostsByMonth(
  items: ContentItem[],
  monthKey: string
): ContentItem[] {
  if (!monthKey || monthKey === "all") return items;
  return items.filter((it) => {
    const mk = extractMonthKeyFromDate(it.publishDate);
    return mk === monthKey;
  });
}

/**
 * Agregasi produktivitas bulanan per desainer / PIC.
 */
export function aggregateDesignerMonthly(
  designs: DesignDatabaseItem[],
  posts: ContentItem[],
  monthKey: string
): DesignerMonthlySummary[] {
  const filteredDesigns = filterDesignsByMonth(designs, monthKey);
  const filteredPosts = filterPostsByMonth(posts, monthKey);

  const totalDesignsInMonth = filteredDesigns.length || 1;

  // Kumpulkan seluruh PIC unik dari desain dan post
  const picMap = new Map<
    string,
    {
      designs: DesignDatabaseItem[];
      posts: ContentItem[];
    }
  >();

  // Inisialisasi desainer kunci agar selalu tercantum rapi
  const defaultPics = ["Yanuar", "Dimas", "Yasin", "anam"];
  defaultPics.forEach((name) => {
    picMap.set(name.toLowerCase(), { designs: [], posts: [] });
  });

  filteredDesigns.forEach((des) => {
    const rawPic = des.pic || des.creator || "Yanuar";
    const key = rawPic.trim().toLowerCase();
    if (!picMap.has(key)) {
      picMap.set(key, { designs: [], posts: [] });
    }
    picMap.get(key)!.designs.push(des);
  });

  filteredPosts.forEach((post) => {
    const rawPic = post.pic || "Yanuar";
    const key = rawPic.trim().toLowerCase();
    if (!picMap.has(key)) {
      picMap.set(key, { designs: [], posts: [] });
    }
    picMap.get(key)!.posts.push(post);
  });

  const results: DesignerMonthlySummary[] = [];

  picMap.forEach((val, key) => {
    // Normalisasi display name
    let displayName = key.charAt(0).toUpperCase() + key.slice(1);
    if (key === "yanuar") displayName = "Yanuar (Lead Graphic Designer)";
    if (key === "dimas") displayName = "Dimas (Graphic Designer)";
    if (key === "yasin") displayName = "Yasin (Graphic Designer)";
    if (key === "anam") displayName = "Anam (Creative Designer)";

    const totalDesigns = val.designs.length;
    const totalIgPosts = val.posts.length;

    // Hitung reach & ER
    const totalReach = val.posts.reduce((acc, p) => acc + (p.reach || 0), 0);
    const avgEngagementRate =
      val.posts.length > 0
        ? parseFloat(
            (
              val.posts.reduce((acc, p) => acc + (p.engagementRate || 0), 0) /
              val.posts.length
            ).toFixed(1)
          )
        : 0;

    const percentageShare = parseFloat(
      ((totalDesigns / totalDesignsInMonth) * 100).toFixed(1)
    );

    // Jangan tampilkan jika tidak ada karya dan bukan default
    if (totalDesigns === 0 && totalIgPosts === 0 && !defaultPics.map(d => d.toLowerCase()).includes(key)) {
      return;
    }

    results.push({
      pic: displayName,
      totalDesigns,
      totalIgPosts,
      percentageShare,
      designs: val.designs,
      igPosts: val.posts,
      totalReach,
      avgEngagementRate,
    });
  });

  // Urutkan desainer dengan karya terbanyak di atas
  return results.sort((a, b) => b.totalDesigns - a.totalDesigns || b.totalIgPosts - a.totalIgPosts);
}

/**
 * Agregasi kronologis tanggal per tanggal (Date-by-Date Tracker) dalam sebulan.
 */
export function aggregateDailyPosting(
  designs: DesignDatabaseItem[],
  posts: ContentItem[],
  monthKey: string
): DailyIgPostSummary[] {
  const filteredDesigns = filterDesignsByMonth(designs, monthKey);
  const filteredPosts = filterPostsByMonth(posts, monthKey);

  const [yearStr, monthStr] = (monthKey || "2026-10").split("-");
  const year = parseInt(yearStr, 10) || 2026;
  const month = parseInt(monthStr, 10) || 10;
  const daysInMonth = new Date(year, month, 0).getDate();

  // Map keyed by "YYYY-MM-DD"
  const dateMap = new Map<
    string,
    {
      posts: ContentItem[];
      designs: DesignDatabaseItem[];
    }
  >();

  // Inisialisasi seluruh hari dalam bulan
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    dateMap.set(dateStr, { posts: [], designs: [] });
  }

  // Masukkan postingan IG ke tanggal masing-masing
  filteredPosts.forEach((post) => {
    const iso = normalizeDateToISO(post.publishDate);
    if (dateMap.has(iso)) {
      dateMap.get(iso)!.posts.push(post);
    } else {
      dateMap.set(iso, { posts: [post], designs: [] });
    }
  });

  // Masukkan desain ke tanggal masing-masing
  filteredDesigns.forEach((des) => {
    const iso = normalizeDateToISO(des.date || des.timestamp);
    if (dateMap.has(iso)) {
      dateMap.get(iso)!.designs.push(des);
    } else {
      dateMap.set(iso, { posts: [], designs: [des] });
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
