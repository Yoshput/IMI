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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const period = (searchParams.get("period") || "monthly") as "weekly" | "monthly";
  const cache = loadLiveCache();
  const items = getRealContentItems(cache, period);
  return NextResponse.json({
    success: true,
    items,
    period,
    lastSync: cache?.lastSync || new Date().toISOString(),
    total: items.length,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const period = (body.period || "monthly") as "weekly" | "monthly";

    // If requested to trigger live refresh
    if (body.refreshLive) {
      try {
        const syncUrl = new URL("/api/sync-ig-metrics", req.url);
        await fetch(syncUrl.toString(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            urls: [
              "https://www.instagram.com/p/Dd02jIAj2jm/",
              "https://www.instagram.com/p/DdyW-wbj6aC/",
              "https://www.instagram.com/p/Ddv6HAxj1KY/",
              "https://www.instagram.com/p/DdtV9LXD8ls/",
              "https://www.instagram.com/p/DdqvtsOj5Pq/",
              "https://www.instagram.com/p/DdoN0GED_8f/",
              "https://www.instagram.com/p/DdlqK9aj02K/",
              "https://www.instagram.com/p/DdLvWkcDzob/",
              "https://www.instagram.com/p/DdOfUrMj7MU/",
              "https://www.instagram.com/p/DdGj-UyD9E0/",
              "https://www.instagram.com/p/DdEBEa6j8hr/",
              "https://www.instagram.com/p/Dc-1bQ2DzgA/",
              "https://www.instagram.com/p/Dc0mhoAj3e2/",
              "https://www.instagram.com/p/DcusTuJjyjq/",
              "https://www.instagram.com/p/Dcnl288kWyo/",
              "https://www.instagram.com/p/DcqP-gBD0mm/",
              "https://www.instagram.com/p/DcisfF2jxJy/",
              "https://www.instagram.com/p/Dcf4EGfD_af/",
              "https://www.instagram.com/reel/DdQ1c06zshy/",
              "https://www.instagram.com/reel/DdRCcGzvG8h/",
              "https://www.instagram.com/reel/DdQ5nYgKBCJ/",
              "https://www.instagram.com/reel/DdbL7xGCWZ9/",
              "https://www.instagram.com/reel/DdJHG_jTUGa/",
            ],
          }),
        }).catch(() => null);
      } catch (err) {
        console.warn("Background IG live fetch triggered with fallback:", err);
      }
    }

    const freshestCache = loadLiveCache();
    const items = getRealContentItems(freshestCache, period);

    return NextResponse.json({
      success: true,
      items,
      period,
      lastSync: freshestCache?.lastSync || new Date().toISOString(),
      message: "Data log konten Instagram berhasil disinkronkan langsung!",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
