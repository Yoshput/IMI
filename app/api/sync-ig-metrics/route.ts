import { NextRequest, NextResponse } from "next/server";
import https from "https";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const CACHE_PATH = path.join(process.cwd(), "lib/instagram-live-cache.json");

function parseMetricStr(str: string): number {
  if (!str) return 0;
  const s = str.replace(/,/g, "").trim().toUpperCase();
  if (s.endsWith("M")) return Math.round(parseFloat(s) * 1000000);
  if (s.endsWith("K")) return Math.round(parseFloat(s) * 1000);
  return parseInt(s, 10) || 0;
}

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

async function fetchReelMeta(url: string): Promise<{ url: string; likes: number; comments: number; caption: string; success: boolean }> {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const options = {
        hostname: u.hostname,
        path: u.pathname,
        headers: {
          "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
          Accept: "text/html,application/xhtml+xml",
        },
        timeout: 3500,
      };
      // @ts-ignore
      const req = https.get(options, (res: any) => {
        let html = "";
        res.on("data", (c: any) => (html += c));
        res.on("end", () => {
          const descMatch = html.match(/content="([^"]*likes,[^"]*comments[^"]*)"/i);
          let likes = 0, comments = 0, caption = "";
          if (descMatch) {
            const likesMatch = descMatch[1].match(/([\d.,KMkm]+)\s+likes/i);
            const commentsMatch = descMatch[1].match(/([\d.,KMkm]+)\s+comments/i);
            if (likesMatch) likes = parseMetricStr(likesMatch[1]);
            if (commentsMatch) comments = parseMetricStr(commentsMatch[1]);
            const colonIdx = descMatch[1].indexOf(": ");
            if (colonIdx > -1) caption = descMatch[1].slice(colonIdx + 2, colonIdx + 300);
          }
          resolve({ url, likes, comments, caption, success: true });
        });
      });
      // @ts-ignore
      req.on("error", () => resolve({ url, likes: 0, comments: 0, caption: "", success: false }));
      // @ts-ignore
      req.on("timeout", () => { req.destroy(); resolve({ url, likes: 0, comments: 0, caption: "", success: false }); });
    } catch {
      resolve({ url, likes: 0, comments: 0, caption: "", success: false });
    }
  });
}

// Fast concurrent batch processor
async function batchFetch(urls: string[], concurrency = 4): Promise<{ url: string; likes: number; comments: number; caption: string; success: boolean }[]> {
  const results: any[] = [];
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(batch.map((u) => fetchReelMeta(u)));
    for (const r of batchResults) {
      if (r.status === "fulfilled") {
        results.push(r.value);
      }
    }
  }
  return results;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const extraUrls: string[] = body.urls || [];
    const syncAll: boolean = !!body.syncAll;

    // Load cache
    let cache: any = { lastSync: null, accounts: {}, reels: {} };
    if (fs.existsSync(CACHE_PATH)) {
      try { cache = JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8")); } catch { /* ignore */ }
    }

    // Determine target URLs to fetch
    // If specific URLs requested, ONLY fetch those requested URLs! (Fast & responsive)
    let targetUrls: string[] = [];
    if (extraUrls.length > 0) {
      targetUrls = [...new Set(extraUrls)];
    } else if (syncAll) {
      targetUrls = Object.keys(cache.reels || {});
    } else {
      // Default fast sync: top 5 high-impact posts
      targetUrls = [
        "https://www.instagram.com/reel/DdQ1c06zshy/",
        "https://www.instagram.com/reel/DdRCcGzvG8h/",
        "https://www.instagram.com/p/DdLvWkcDzob/",
        "https://www.instagram.com/p/DdOfUrMj7MU/",
        "https://www.instagram.com/p/DdoN0GED_8f/",
      ];
    }

    // Fetch concurrently with fast timeout
    const fetchedResults = await batchFetch(targetUrls, 4);

    let added = 0;
    let updated = 0;
    const finalResults: { url: string; status: string; likes: number; viewers: number }[] = [];

    for (const meta of fetchedResults) {
      if (!meta.success || meta.likes === 0) {
        finalResults.push({ url: meta.url, status: "no_data_or_cached", likes: 0, viewers: 0 });
        continue;
      }

      const existing = cache.reels[meta.url] || {};
      const isNew = !cache.reels[meta.url];
      const finalLikes = Math.max(existing.likes || 0, meta.likes || 0);
      const finalComments = Math.max(existing.comments || 0, meta.comments || 0);
      const viewers = existing.viewers || 0; // Strictly preserve verified viewers, ZERO fake multiplier

      cache.reels[meta.url] = {
        url: meta.url,
        likes: finalLikes,
        likesFormatted: formatNumber(finalLikes),
        viewers,
        viewersFormatted: formatNumber(viewers),
        comments: finalComments,
        caption: meta.caption || existing.caption || "",
        lastUpdated: new Date().toISOString(),
      };

      if (isNew) {
        added++;
        finalResults.push({ url: meta.url, status: "added", likes: meta.likes, viewers });
      } else {
        updated++;
        finalResults.push({ url: meta.url, status: "updated", likes: meta.likes, viewers });
      }
    }

    cache.lastSync = new Date().toISOString();
    cache.nextSyncEstimated = new Date(Date.now() + 3600000).toISOString();
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: `Sinkronisasi cepat live Instagram selesai! Ditambah: ${added}, Diperbarui: ${updated}`,
      added,
      updated,
      total: targetUrls.length,
      results: finalResults,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// GET: return current cache summary
export async function GET() {
  try {
    if (!fs.existsSync(CACHE_PATH)) {
      return NextResponse.json({ success: false, error: "Cache not found" }, { status: 404 });
    }
    const cache = JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8"));
    const reelCount = Object.keys(cache.reels || {}).length;
    const reels = Object.values(cache.reels || {}).map((r: any) => ({
      url: r.url,
      likes: r.likes,
      viewers: r.viewers,
      lastUpdated: r.lastUpdated,
    }));
    return NextResponse.json({
      success: true,
      lastSync: cache.lastSync,
      nextSyncEstimated: cache.nextSyncEstimated,
      reelCount,
      reels,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
