import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";

export const dynamic = "force-dynamic";

function extractShortcode(input: string): string | null {
  if (!input) return null;
  const match = input.match(/\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
  if (match && match[1]) return match[1];
  if (/^[A-Za-z0-9_-]{8,15}$/.test(input.trim())) {
    return input.trim();
  }
  return null;
}

// In-memory cache for compressed WebP buffers to ensure ultra-fast 0ms response
const bufferCache = new Map<string, { buffer: Buffer; expiresAt: number }>();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url") || "";
  const rawCode = searchParams.get("code") || "";
  const tier = (searchParams.get("tier") || "thumb").toLowerCase() as "thumb" | "preview" | "zoom";
  const shortcode = extractShortcode(rawUrl) || extractShortcode(rawCode);

  if (!shortcode) {
    return new NextResponse("Invalid Instagram post URL or code", { status: 400 });
  }

  const cacheKey = `${shortcode}-${tier}`;
  const cached = bufferCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return new NextResponse(new Uint8Array(cached.buffer), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=604800, immutable",
        "X-Cache": "HIT",
      },
    });
  }

  let sourceBuffer: Buffer | null = null;

  // 1. Check local static covers first (ultra crisp local backups)
  if (shortcode === "DdOfUrMj7MU") {
    const filePath = path.join(process.cwd(), "public", "covers", "edukasi-lupa-kedip.png");
    if (fs.existsSync(filePath)) {
      sourceBuffer = fs.readFileSync(filePath);
    }
  } else if (shortcode === "DdLvWkcDzob" || shortcode === "DdIvWkcDzoh") {
    const filePath = path.join(process.cwd(), "public", "covers", "trend-dewasa-passwordnya.png");
    if (fs.existsSync(filePath)) {
      sourceBuffer = fs.readFileSync(filePath);
    }
  } else if (shortcode === "DdQ1c06zshy") {
    const filePath = path.join(process.cwd(), "public", "covers", "lunar-mata-minus.png");
    if (fs.existsSync(filePath)) {
      sourceBuffer = fs.readFileSync(filePath);
    }
  }

  // 2. If not local, fetch live from Instagram CDN
  if (!sourceBuffer) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4500);

      const igMediaUrl = `https://www.instagram.com/p/${shortcode}/media/?size=l`;
      const res = await fetch(igMediaUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        },
        redirect: "follow",
      });

      clearTimeout(timeout);

      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer();
        sourceBuffer = Buffer.from(arrayBuffer);
      }
    } catch (err) {
      // fallback handled below
    }
  }

  // 3. Process with 3-Tier WebP Compression via sharp
  if (sourceBuffer) {
    try {
      let transformer = sharp(sourceBuffer);

      if (tier === "thumb") {
        // Tier 1: Dari Jauh (Square, 240x240, WebP Q75, ~8-12KB)
        transformer = transformer
          .resize(240, 240, { fit: "cover", position: "centre" })
          .webp({ quality: 75, effort: 4 });
      } else if (tier === "preview") {
        // Tier 2: Pas di Klik (Apple Card Preview, max 640px, WebP Q85, ~40-50KB)
        transformer = transformer
          .resize({ width: 640, withoutEnlargement: true })
          .webp({ quality: 85, effort: 4 });
      } else {
        // Tier 3: Di Zoom (High-Res Zoomable Lightbox, max 1280px, WebP Q92, crisp)
        transformer = transformer
          .resize({ width: 1280, withoutEnlargement: true })
          .webp({ quality: 92, effort: 4 });
      }

      const webpBuffer = await transformer.toBuffer();

      // Cache for 2 hours in-memory
      bufferCache.set(cacheKey, {
        buffer: webpBuffer,
        expiresAt: Date.now() + 2 * 60 * 60 * 1000,
      });

      return new NextResponse(new Uint8Array(webpBuffer), {
        headers: {
          "Content-Type": "image/webp",
          "Cache-Control": "public, max-age=604800, s-maxage=604800, immutable",
          "X-Compression-Tier": tier,
          "X-Image-Size": `${webpBuffer.length} bytes`,
        },
      });
    } catch (sharpError) {
      // If sharp failed for any reason, return original buffer
      return new NextResponse(new Uint8Array(sourceBuffer), {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=86400",
        },
      });
    }
  }

  // 4. Fallback: High Quality Branded SVG placeholder
  const svgFallback = `
    <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#121820"/>
      <circle cx="200" cy="180" r="50" fill="#202A36" stroke="#2DD4BF" stroke-width="3"/>
      <path d="M185 165 L225 180 L185 195 Z" fill="#2DD4BF"/>
      <text x="200" y="260" fill="#E2E8F0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Instagram Reels Cover</text>
      <text x="200" y="282" fill="#94A3B8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" text-anchor="middle">@iseeyou.glasses</text>
    </svg>
  `.trim();

  return new NextResponse(svgFallback, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
