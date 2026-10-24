import https from "https";
import fs from "fs";
import path from "path";

// Re-export pure types and string parsing utilities
export * from "./instagram-utils";
import {
  decodeHtmlEntities,
  parseFollowerNumber,
  IgLiveCache,
} from "./instagram-utils";

const PRIMARY_CACHE_FILE = path.join(process.cwd(), "lib/instagram-live-cache.json");
const TMP_CACHE_FILE = "/tmp/instagram-live-cache.json";

// In-memory cache for Vercel serverless persistence across warm executions
declare global {
  // eslint-disable-next-line no-var
  var __imiLiveCache: IgLiveCache | undefined;
}

export function fetchIgProfileRaw(url: string): Promise<{
  followers: string | null;
  following: string | null;
  posts: string | null;
  title: string | null;
}> {
  return new Promise((resolve) => {
    try {
      const normalizedUrl = url.endsWith("/") ? url : `${url}/`;
      const u = new URL(normalizedUrl);
      const options = {
        hostname: u.hostname,
        path: u.pathname,
        headers: {
          "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
          Accept: "*/*",
        },
      };

      https
        .get(options, (res) => {
          let html = "";
          res.on("data", (c) => (html += c));
          res.on("end", () => {
            const descMatch = (html.match(/<meta\s+(?:property|name)=["'](?:og:description|description)["']\s+content=["']([^"']*)["']/i) || [])[1];
            const titleMatch = (html.match(/<title>([^<]+)<\/title>/i) || [])[1];

            let followers = null;
            let following = null;
            let posts = null;

            if (descMatch) {
              const decodedDesc = decodeHtmlEntities(descMatch);
              const m = decodedDesc.match(/([0-9.,KMkm]+)\s+Followers,\s+([0-9.,KMkm]+)\s+Following,\s+([0-9.,KMkm]+)\s+Posts/i);
              if (m) {
                followers = m[1];
                following = m[2];
                posts = m[3];
              }
            }

            resolve({
              followers,
              following,
              posts,
              title: titleMatch ? decodeHtmlEntities(titleMatch) : null,
            });
          });
        })
        .on("error", () => resolve({ followers: null, following: null, posts: null, title: null }));
    } catch {
      resolve({ followers: null, following: null, posts: null, title: null });
    }
  });
}

/**
 * Fetch Instagram post/reel raw metadata with multi-format parsing and universal decoding.
 */
export function fetchIgReelRaw(url: string): Promise<{
  likes: string | null;
  comments: string | null;
  caption: string;
  format: "reels" | "carousel" | "feed";
}> {
  return new Promise((resolve) => {
    try {
      if (!url || !url.startsWith("http")) {
        return resolve({ likes: null, comments: null, caption: "", format: "reels" });
      }
      const u = new URL(url);
      const isReelUrl = u.pathname.includes("/reel/") || u.pathname.includes("/reels/");
      const defaultFormat = isReelUrl ? "reels" : "carousel";

      const options = {
        hostname: u.hostname,
        path: u.pathname,
        headers: {
          "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
          Accept: "*/*",
        },
      };

      https
        .get(options, (res) => {
          let html = "";
          res.on("data", (c) => (html += c));
          res.on("end", () => {
            const descMatch = (html.match(/<meta\s+(?:property|name)=["'](?:og:description|description)["']\s+content=["']([^"']*)["']/i) || [])[1];
            let likes = null;
            let comments = null;
            let caption = "";

            if (descMatch) {
              const decoded = decodeHtmlEntities(descMatch);
              const m = decoded.match(/([0-9.,KMkm]+)\s+likes,\s+([0-9.,KMkm]+)\s+comments\s*-\s*([^\s:]+)\s+on\s+([^:]+):\s*["']?([\s\S]*?)["']?\.?$/i);
              if (m) {
                likes = m[1];
                comments = m[2];
                caption = m[5] || "";
              } else {
                caption = decoded;
              }
            }

            resolve({
              likes,
              comments,
              caption: decodeHtmlEntities(caption),
              format: defaultFormat,
            });
          });
        })
        .on("error", () => resolve({ likes: null, comments: null, caption: "", format: defaultFormat }));
    } catch {
      resolve({ likes: null, comments: null, caption: "", format: "reels" });
    }
  });
}

/**
 * Tarik live profile feed discovery untuk akun cabang tertentu
 */
export async function fetchBranchLiveFeed(username: string): Promise<{
  success: boolean;
  username: string;
  followers?: number;
  postsCount?: number;
  recentItems: {
    shortcode: string;
    caption: string;
    format: "reels" | "carousel" | "feed";
    likes: number;
    comments: number;
    views: number;
    url: string;
  }[];
}> {
  const cleanUsername = username.replace(/^@/, "").trim();
  const profileUrl = `https://www.instagram.com/${cleanUsername}/`;
  const prof = await fetchIgProfileRaw(profileUrl);

  const followersNum = parseFollowerNumber(prof.followers);
  const postsNum = parseFollowerNumber(prof.posts);

  return {
    success: true,
    username: cleanUsername,
    followers: followersNum,
    postsCount: postsNum,
    recentItems: [],
  };
}

/**
 * Mengambil cache Instagram dari memory global, /tmp/ (Vercel Serverless), atau lib/ (repo)
 */
export function getCachedInstagramData(): IgLiveCache {
  // 1. Cek in-memory cache global
  if (globalThis.__imiLiveCache) {
    return globalThis.__imiLiveCache;
  }

  // 2. Cek /tmp/ filesystem (diizinkan tulis di Vercel serverless)
  try {
    if (fs.existsSync(TMP_CACHE_FILE)) {
      const data = JSON.parse(fs.readFileSync(TMP_CACHE_FILE, "utf-8"));
      globalThis.__imiLiveCache = data;
      return data;
    }
  } catch {
    // fallback
  }

  // 3. Cek primary cache file
  try {
    if (fs.existsSync(PRIMARY_CACHE_FILE)) {
      const data = JSON.parse(fs.readFileSync(PRIMARY_CACHE_FILE, "utf-8"));
      globalThis.__imiLiveCache = data;
      return data;
    }
  } catch (err) {
    console.error("Failed to read IG cache:", err);
  }

  // Fallback defaults jika berkas belum ada
  const fallback: IgLiveCache = {
    lastSync: new Date().toISOString(),
    nextSyncEstimated: new Date(Date.now() + 3600000).toISOString(),
    accounts: {
      pwt: {
        id: "pwt",
        name: "Optik I See You Purwokerto (Pusat)",
        handle: "@iseeyou.glasses",
        url: "https://www.instagram.com/iseeyou.glasses/",
        city: "Purwokerto",
        picName: "Ilya (Reels) & Nuha (Story)",
        followers: 226000,
        followersFormatted: "226K",
        following: 112,
        posts: 2970,
        bioTitle: "kacamata purwokerto murah (@iseeyou.glasses) • Instagram photos and videos",
        lastUpdated: new Date().toISOString(),
      },
      pbg: {
        id: "pbg",
        name: "Optik I See You Purbalingga",
        handle: "@iseeyou.purbalingga",
        url: "https://www.instagram.com/iseeyou.purbalingga/",
        city: "Purbalingga",
        picName: "Ajun",
        followers: 6250,
        followersFormatted: "6,250",
        following: 6,
        posts: 595,
        bioTitle: "Optik Purbalingga (@iseeyou.purbalingga) • Instagram photos and videos",
        lastUpdated: new Date().toISOString(),
      },
      clp: {
        id: "clp",
        name: "Optik I See You Cilacap",
        handle: "@iseeyou.cilacap",
        url: "https://www.instagram.com/iseeyou.cilacap/",
        city: "Cilacap",
        picName: "Intan",
        followers: 7425,
        followersFormatted: "7,425",
        following: 6,
        posts: 1430,
        bioTitle: "Optik Cilacap (@iseeyou.cilacap) • Instagram photos and videos",
        lastUpdated: new Date().toISOString(),
      },
      wns: {
        id: "wns",
        name: "Optik I See You Wonosobo",
        handle: "@iseeyou.wonosobo",
        url: "https://www.instagram.com/iseeyou.wonosobo/",
        city: "Wonosobo",
        picName: "Febi",
        followers: 1290,
        followersFormatted: "1,290",
        following: 6,
        posts: 365,
        bioTitle: "Kacamata Murah Wonosobo (@iseeyou.wonosobo) • Instagram photos and videos",
        lastUpdated: new Date().toISOString(),
      },
      lunar: {
        id: "lunar",
        name: "Lunar Eyewear Tegal",
        handle: "@lunareyewear.co",
        url: "https://www.instagram.com/lunareyewear.co",
        city: "Tegal",
        picName: "Amanda",
        followers: 4100,
        followersFormatted: "4,100",
        following: 5,
        posts: 382,
        bioTitle: "Kacamata Tegal Murah (@lunareyewear.co) • Instagram photos and videos",
        lastUpdated: new Date().toISOString(),
      },
    },
    reels: {},
  };

  globalThis.__imiLiveCache = fallback;
  return fallback;
}

/**
 * Menyimpan cache Instagram ke memory global, /tmp/, dan primary cache file jika writable
 */
export function saveCachedInstagramData(data: IgLiveCache) {
  globalThis.__imiLiveCache = data;

  try {
    fs.writeFileSync(TMP_CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // /tmp write fallback
  }

  try {
    fs.writeFileSync(PRIMARY_CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // Read-only filesystem in Vercel production is expected; memory & /tmp cache handles runtime
  }
}
