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

function estimateViewers(likes: number): number {
  if (likes >= 10000) return likes * 25;
  if (likes >= 1000) return likes * 40;
  if (likes >= 100) return likes * 60;
  if (likes >= 10) return likes * 100;
  return likes * 150;
}

async function fetchReelMeta(url: string): Promise<{ likes: number; comments: number; caption: string; success: boolean }> {
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
        timeout: 12000,
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
            // Extract caption from the description
            const colonIdx = descMatch[1].indexOf(": ");
            if (colonIdx > -1) caption = descMatch[1].slice(colonIdx + 2, colonIdx + 300);
          }
          resolve({ likes, comments, caption, success: true });
        });
      });
      // @ts-ignore
      req.on("error", () => resolve({ likes: 0, comments: 0, caption: "", success: false }));
      // @ts-ignore
      req.on("timeout", () => { req.destroy(); resolve({ likes: 0, comments: 0, caption: "", success: false }); });
    } catch {
      resolve({ likes: 0, comments: 0, caption: "", success: false });
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const extraUrls: string[] = body.urls || [];

    // Load cache
    let cache: any = { lastSync: null, accounts: {}, reels: {} };
    if (fs.existsSync(CACHE_PATH)) {
      try { cache = JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8")); } catch { /* ignore */ }
    }

    const existingUrls = Object.keys(cache.reels || {});
    const allUrls = [...new Set([...existingUrls, ...extraUrls])];

    const results: { url: string; status: string; likes: number; viewers: number }[] = [];
    let added = 0, updated = 0;

    for (const url of allUrls) {
      const meta = await fetchReelMeta(url);
      if (!meta.success || meta.likes === 0) {
        results.push({ url, status: "no_data", likes: 0, viewers: 0 });
        continue;
      }

      const existing = cache.reels[url] || {};
      const isNew = !cache.reels[url];
      const existingViewers = existing.viewers || 0;
      const finalLikes = Math.max(existing.likes || 0, meta.likes || 0);
      const finalComments = Math.max(existing.comments || 0, meta.comments || 0);
      // Preserve verified viewers if already set, else estimate
      const viewers = existingViewers > 0 ? existingViewers : estimateViewers(finalLikes);

      cache.reels[url] = {
        url,
        likes: finalLikes,
        likesFormatted: formatNumber(finalLikes),
        viewers,
        viewersFormatted: formatNumber(viewers),
        comments: finalComments,
        caption: meta.caption || existing.caption || "",
        lastUpdated: new Date().toISOString(),
      };

      if (isNew) { added++; results.push({ url, status: "added", likes: meta.likes, viewers }); }
      else { updated++; results.push({ url, status: "updated", likes: meta.likes, viewers }); }

      // Small delay between requests
      await new Promise((r) => setTimeout(r, 600));
    }

    cache.lastSync = new Date().toISOString();
    cache.nextSyncEstimated = new Date(Date.now() + 3600000).toISOString();
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: `Auto-sync IG selesai! Ditambah: ${added}, Diperbarui: ${updated}`,
      added,
      updated,
      total: allUrls.length,
      results,
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
