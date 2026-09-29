import { ContentItem } from "@/types";
import defaultData from "./real-sheets-data.json";
import liveCache from "./instagram-live-cache.json";

export function extractShortcode(input?: string | null): string | null {
  if (!input) return null;
  const match = input.match(/\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
  if (match && match[1]) return match[1];
  if (/^[A-Za-z0-9_-]{8,15}$/.test(input.trim())) {
    return input.trim();
  }
  return null;
}

export function getRealContentItems(
  cacheOverride?: any,
  period: "weekly" | "monthly" = "monthly"
): ContentItem[] {
  const cache = cacheOverride || liveCache;
  const items: ContentItem[] = [];

  // Build index by shortcode from live Instagram cache
  const liveMap = new Map<string, any>();
  if (cache && cache.reels) {
    for (const [url, data] of Object.entries(cache.reels as Record<string, any>)) {
      const code = extractShortcode(url);
      if (code) {
        const existing = liveMap.get(code);
        if (!existing || (data.likes && Number(data.likes) > (Number(existing.likes) || 0))) {
          liveMap.set(code, data);
        }
      }
    }
  }

  // Helper to resolve clean branch metadata from Google Sheets sheetKey
  const getBranchMeta = (sheetKey: string) => {
    const k = (sheetKey || "").toLowerCase();
    if (k.includes("tgl") || k.includes("tegal")) {
      return { key: "tgl", name: "Lunar Eyewear Tegal (Second Brand)" };
    }
    if (k.includes("pbg") || k.includes("purbalingga")) {
      return { key: "pbg", name: "Optik I See You Purbalingga" };
    }
    if (k.includes("clp") || k.includes("cilacap")) {
      return { key: "clp", name: "Optik I See You Cilacap" };
    }
    if (k.includes("wns") || k.includes("wonosobo")) {
      return { key: "wns", name: "Optik I See You Wonosobo" };
    }
    return { key: "pwt", name: "Purwokerto (Pusat)" };
  };

  const branchReels = (defaultData as any).branchReels || {};
  const seenCodes = new Set<string>();

  // Date filter criteria:
  // Weekly: 22 September 2026 to 28 September 2026 (W39 Rapat)
  // Monthly: 01 September 2026 to 30 September 2026 (Hanya konten bulan berjalan)
  const isEligibleDate = (dateStr: string) => {
    if (!dateStr || !dateStr.startsWith("2026-09")) return false;
    if (period === "weekly") {
      return dateStr >= "2026-09-22" && dateStr <= "2026-09-28";
    }
    return dateStr >= "2026-09-01" && dateStr <= "2026-09-30";
  };

  Object.entries(branchReels).forEach(([sheetKey, list]: [string, any]) => {
    if (!Array.isArray(list)) return;
    const meta = getBranchMeta(sheetKey);

    list.forEach((r) => {
      if (r.isDayOff) return;
      const dateStr = r.uploadDate || r.reportDate || "";
      if (!isEligibleDate(dateStr)) return;

      const rawLink = (r.reelsLink || r.feedCarouselLink || "").trim();
      if (!rawLink || rawLink === "-" || !rawLink.includes("instagram.com")) return;

      // Extract clean shortcode
      const code = extractShortcode(rawLink);
      if (code && seenCodes.has(code)) return;
      if (code) seenCodes.add(code);

      const liveData = code ? liveMap.get(code) : null;

      // 100% Real metrics from Google Sheets with live verified cache enhancement
      const sheetViewers = Number(r.viewers) || 0;
      const reach = liveData && Number(liveData.viewers) > sheetViewers ? Number(liveData.viewers) : sheetViewers;

      const sheetLikes = Number(r.likes) || 0;
      const likes = liveData && Number(liveData.likes) > sheetLikes ? Number(liveData.likes) : sheetLikes;

      const sheetComments = Number(r.comments) || 0;
      const comments = liveData && liveData.comments !== undefined ? Number(liveData.comments) : sheetComments;

      const shares = Number(r.shares) || (liveData && liveData.shares ? Number(liveData.shares) : 0);
      const saves = Number(r.saves) || 0;

      const isReel = rawLink.includes("/reel/");
      const format: ContentItem["format"] = isReel ? "reels" : "carousel";

      // Real title directly from the PIC's entry in Google Sheets
      let title = (r.reelsTitle || "").trim();
      if (!title || title === "-") {
        if (liveData && liveData.caption) {
          const cleanCaptionFirstLine = liveData.caption.split("\n")[0].replace(/["']/g, "").trim();
          title = cleanCaptionFirstLine.substring(0, 80) || `Konten ${meta.name} (${dateStr})`;
        } else {
          title = `Konten ${meta.name} (${dateStr})`;
        }
      }

      // Clean canonical post URL
      const cleanPostUrl = code
        ? `https://www.instagram.com/${isReel ? "reel" : "p"}/${code}/`
        : rawLink.split("?")[0];

      const engagementRate = reach > 0
        ? parseFloat((((likes + comments + shares + saves) / reach) * 100).toFixed(1))
        : (likes > 0 ? 5.0 : 0);

      const observation = liveData && liveData.likes > 0
        ? `Data sinkronisasi live Instagram: ${likes.toLocaleString("id-ID")} likes, ${comments} komentar.`
        : `Tercatat pada Google Sheets Rekap ${meta.name} per ${dateStr}: ${reach.toLocaleString("id-ID")} viewers, ${likes} likes.`;

      items.push({
        id: `content-${r.id || code || Math.random().toString(36).substring(7)}`,
        title,
        captionPreview: liveData?.caption?.substring(0, 160) || (r.obstacle && r.obstacle !== "-" ? `Catatan PIC: "${r.obstacle}"` : `Dipublikasikan oleh ${r.pic} (${meta.name}).`),
        format,
        category: r.contentPillar && r.contentPillar !== "Umum" ? r.contentPillar : "Edukasi & Solusi Mata",
        publishDate: dateStr,
        reach,
        likes,
        comments,
        saves,
        shares,
        engagementRate,
        saveRate: 0,
        rank: 99,
        isDominantPerformer: false,
        keyObservation: observation,
        source: liveData && liveData.likes > 0 ? "instagram_insights" : "sheets_sync",
        isDemo: false,
        thumbnail: `/api/ig-thumbnail?url=${encodeURIComponent(cleanPostUrl)}`,
        branchName: meta.name,
        branchKey: meta.key,
        pic: r.pic,
        postUrl: cleanPostUrl,
      });
    });
  });

  // Sort strictly by reach / viewers descending and assign true rank
  items.sort((a, b) => b.reach - a.reach);
  items.forEach((it, idx) => {
    it.rank = idx + 1;
    it.isDominantPerformer = idx === 0;
  });

  return items;
}
