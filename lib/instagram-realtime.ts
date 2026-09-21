import https from "https";
import fs from "fs";
import path from "path";

export interface IgAccountLive {
  id: string;
  name: string;
  handle: string;
  url: string;
  city: string;
  picName: string;
  followers: number;
  followersFormatted: string;
  following: number;
  posts: number;
  bioTitle?: string;
  lastUpdated: string;
}

export interface IgReelLive {
  url: string;
  likes: number;
  likesFormatted: string;
  comments: number;
  caption: string;
  lastUpdated: string;
}

export interface IgLiveCache {
  lastSync: string;
  nextSyncEstimated: string;
  accounts: Record<string, IgAccountLive>;
  reels: Record<string, IgReelLive>;
}

const CACHE_FILE = path.join(process.cwd(), "lib/instagram-live-cache.json");

export function parseFollowerNumber(str: string | null | undefined): number {
  if (!str) return 0;
  const clean = str.replace(/,/g, "").trim().toUpperCase();
  if (clean.endsWith("K")) {
    return Math.round(parseFloat(clean.slice(0, -1)) * 1000);
  }
  if (clean.endsWith("M")) {
    return Math.round(parseFloat(clean.slice(0, -1)) * 1000000);
  }
  return parseInt(clean, 10) || 0;
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
              const m = descMatch.match(/([0-9.,KMkm]+)\s+Followers,\s+([0-9.,KMkm]+)\s+Following,\s+([0-9.,KMkm]+)\s+Posts/i);
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
              title: titleMatch || null,
            });
          });
        })
        .on("error", () => resolve({ followers: null, following: null, posts: null, title: null }));
    } catch {
      resolve({ followers: null, following: null, posts: null, title: null });
    }
  });
}

export function fetchIgReelRaw(url: string): Promise<{
  likes: string | null;
  comments: string | null;
  caption: string;
}> {
  return new Promise((resolve) => {
    try {
      if (!url || !url.startsWith("http")) {
        return resolve({ likes: null, comments: null, caption: "" });
      }
      const u = new URL(url);
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
              const m = descMatch.match(/([0-9.,KMkm]+)\s+likes,\s+([0-9.,KMkm]+)\s+comments\s*-\s*([^\s:]+)\s+on\s+([^:]+):\s*["']?([\s\S]*?)["']?\.?$/i);
              if (m) {
                likes = m[1];
                comments = m[2];
                caption = m[5] || "";
              } else {
                caption = descMatch;
              }

              // Decode common entities
              caption = caption
                .replace(/&quot;/g, '"')
                .replace(/&#x27;/g, "'")
                .replace(/&amp;/g, "&")
                .replace(/&#x1f62d;/g, "😭")
                .replace(/&#x1f917;/g, "🤗")
                .replace(/&#x2764;&#xfe0f;&#x200d;&#x1f525;/g, "❤️‍🔥")
                .replace(/&#x1f4cd;/g, "📍")
                .replace(/&#x2705;/g, "✅");
            }

            resolve({ likes, comments, caption });
          });
        })
        .on("error", () => resolve({ likes: null, comments: null, caption: "" }));
    } catch {
      resolve({ likes: null, comments: null, caption: "" });
    }
  });
}

export function getCachedInstagramData(): IgLiveCache {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
    }
  } catch (err) {
    console.error("Failed to read IG cache:", err);
  }

  // Fallback defaults
  return {
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
        posts: 2946,
        lastUpdated: new Date().toISOString(),
      },
      pbg: {
        id: "pbg",
        name: "Optik I See You Purbalingga",
        handle: "@iseeyou.purbalingga",
        url: "https://www.instagram.com/iseeyou.purbalingga/",
        city: "Purbalingga",
        picName: "Ajun",
        followers: 6196,
        followersFormatted: "6,196",
        following: 6,
        posts: 572,
        lastUpdated: new Date().toISOString(),
      },
      clp: {
        id: "clp",
        name: "Optik I See You Cilacap",
        handle: "@iseeyou.cilacap",
        url: "https://www.instagram.com/iseeyou.cilacap/",
        city: "Cilacap",
        picName: "Arum",
        followers: 7395,
        followersFormatted: "7,395",
        following: 6,
        posts: 1412,
        lastUpdated: new Date().toISOString(),
      },
      wns: {
        id: "wns",
        name: "Optik I See You Wonosobo",
        handle: "@iseeyou.wonosobo",
        url: "https://www.instagram.com/iseeyou.wonosobo/",
        city: "Wonosobo",
        picName: "Febi",
        followers: 1255,
        followersFormatted: "1,255",
        following: 6,
        posts: 343,
        lastUpdated: new Date().toISOString(),
      },
      lunar: {
        id: "lunar",
        name: "Lunar Eyewear Tegal",
        handle: "@lunareyewear.co",
        url: "https://www.instagram.com/lunareyewear.co",
        city: "Tegal",
        picName: "Amanda",
        followers: 3986,
        followersFormatted: "3,986",
        following: 5,
        posts: 359,
        lastUpdated: new Date().toISOString(),
      },
    },
    reels: {},
  };
}

export function saveCachedInstagramData(data: IgLiveCache) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save IG cache:", err);
  }
}
