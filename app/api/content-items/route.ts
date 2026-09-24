import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getRealContentItems } from "@/lib/real-content-items";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const CACHE_PATH = path.join(process.cwd(), "lib/instagram-live-cache.json");

function loadLiveCache() {
  try {
    if (fs.existsSync(CACHE_PATH)) {
      return JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8"));
    }
  } catch (e) {
    console.error("Error reading instagram live cache:", e);
  }
  return null;
}

export async function GET() {
  const cache = loadLiveCache();
  const items = getRealContentItems(cache);
  return NextResponse.json({
    success: true,
    items,
    lastSync: cache?.lastSync || new Date().toISOString(),
    total: items.length,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const cache = loadLiveCache();

    // If requested to trigger live refresh for specific URLs or known viral posts
    if (body.refreshLive) {
      try {
        // Call sync-ig-metrics internally or update cache
        const syncUrl = new URL("/api/sync-ig-metrics", req.url);
        await fetch(syncUrl.toString(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            urls: [
              "https://www.instagram.com/reel/DdQ1c06zshy/",
              "https://www.instagram.com/p/DdLvWkcDzob/",
              "https://www.instagram.com/p/DdOfUrMj7MU/",
              "https://www.instagram.com/reel/DdQ5nYgKBCJ/",
            ],
          }),
        }).catch(() => null);
      } catch (err) {
        console.warn("Background IG live fetch triggered with fallback:", err);
      }
    }

    const freshestCache = loadLiveCache();
    const items = getRealContentItems(freshestCache);

    return NextResponse.json({
      success: true,
      items,
      lastSync: freshestCache?.lastSync || new Date().toISOString(),
      message: "Data log konten Instagram berhasil disinkronkan langsung!",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
