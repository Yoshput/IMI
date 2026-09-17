import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

function extractShortcode(input: string): string | null {
  if (!input) return null;
  const match = input.match(/\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
  if (match && match[1]) return match[1];
  // If bare code
  if (/^[A-Za-z0-9_-]{8,15}$/.test(input.trim())) {
    return input.trim();
  }
  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url") || "";
  const rawCode = searchParams.get("code") || "";
  const shortcode = extractShortcode(rawUrl) || extractShortcode(rawCode);

  if (!shortcode) {
    return new NextResponse("Invalid Instagram post URL or code", { status: 400 });
  }

  // 1. Check local static covers first (100% instant & pristine)
  if (shortcode === "DdOfUrMj7MU") {
    const filePath = path.join(process.cwd(), "public", "covers", "edukasi-lupa-kedip.png");
    if (fs.existsSync(filePath)) {
      const buffer = fs.readFileSync(filePath);
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=604800, immutable",
        },
      });
    }
  }

  if (shortcode === "DdLvWkcDzob") {
    const filePath = path.join(process.cwd(), "public", "covers", "trend-dewasa-passwordnya.png");
    if (fs.existsSync(filePath)) {
      const buffer = fs.readFileSync(filePath);
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=604800, immutable",
        },
      });
    }
  }

  // 2. Fetch live media cover from Instagram CDN
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
      const contentType = res.headers.get("content-type") || "image/jpeg";

      return new NextResponse(new Uint8Array(arrayBuffer), {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
        },
      });
    }
  } catch (err) {
    // fallback below
  }

  // 3. Fallback: High Quality Branded SVG placeholder
  const svgFallback = `
    <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#121820"/>
      <circle cx="200" cy="180" r="50" fill="#202A36" stroke="#2DD4BF" stroke-width="3"/>
      <path d="M185 165 L225 180 L185 195 Z" fill="#2DD4BF"/>
      <text x="200" y="260" fill="#E2E8F0" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Instagram Reels Cover</text>
      <text x="200" y="282" fill="#94A3B8" font-family="sans-serif" font-size="11" text-anchor="middle">@iseeyou.glasses</text>
    </svg>
  `.trim();

  return new NextResponse(svgFallback, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
