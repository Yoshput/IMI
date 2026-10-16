/**
 * Pure, isomorphic Instagram string & entity utilities
 * Safe for both Client Components and Server-side code (zero Node.js dependencies).
 */

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
  viewers?: number;
  viewersFormatted?: string;
  caption: string;
  format?: "reels" | "carousel" | "feed";
  lastUpdated: string;
  title?: string;
  coverTitle?: string;
}

export interface IgLiveCache {
  lastSync: string;
  nextSyncEstimated: string;
  accounts: Record<string, IgAccountLive>;
  reels: Record<string, IgReelLive>;
  pendingSyncUrls?: string[];
}

/**
 * Universal HTML Entity Decoder
 * Mengonversi seluruh entitas HTML (hexadecimal, desimal, dan named entities) menjadi teks & emoji asli.
 */
export function decodeHtmlEntities(text: string | null | undefined): string {
  if (!text) return "";
  let s = String(text);

  // Hexadecimal entities: &#x1f62d; or &#X1F62D;
  s = s.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
    try {
      const codePoint = parseInt(hex, 16);
      if (!isNaN(codePoint) && codePoint > 0 && codePoint <= 0x10ffff) {
        return String.fromCodePoint(codePoint);
      }
    } catch {
      // ignore
    }
    return "";
  });

  // Decimal entities: &#128557; or &#064;
  s = s.replace(/&#(\d+);/g, (_, dec) => {
    try {
      const codePoint = parseInt(dec, 10);
      if (!isNaN(codePoint) && codePoint > 0 && codePoint <= 0x10ffff) {
        return String.fromCodePoint(codePoint);
      }
    } catch {
      // ignore
    }
    return "";
  });

  // Named entities
  const namedEntities: Record<string, string> = {
    "&quot;": '"',
    "&amp;": "&",
    "&apos;": "'",
    "&lt;": "<",
    "&gt;": ">",
    "&nbsp;": " ",
    "&bull;": "•",
    "&copy;": "©",
    "&trade;": "™",
    "&reg;": "®",
    "&mdash;": "—",
    "&ndash;": "–",
    "&hellip;": "…",
  };

  s = s.replace(/&(quot|amp|apos|lt|gt|nbsp|bull|copy|trade|reg|mdash|ndash|hellip);/gi, (match) => {
    return namedEntities[match.toLowerCase()] || match;
  });

  return s.trim();
}

/**
 * Ekstraksi shortcode kanonikal 8–15 karakter dari URL Instagram apapun
 * (/reel/, /reels/, /p/, /tv/, query parameter diabaikan).
 */
export function extractCanonicalShortcode(input?: string | null): string | null {
  if (!input) return null;
  const clean = input.trim();
  const match = clean.match(/\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]{8,15})/i);
  if (match && match[1]) {
    return match[1];
  }
  if (/^[A-Za-z0-9_-]{8,15}$/.test(clean)) {
    return clean;
  }
  return null;
}

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
