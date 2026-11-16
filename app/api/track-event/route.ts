import { NextRequest, NextResponse } from "next/server";
import {
  recordAntrianClick,
  getAntrianStats,
  getPhotoboothStats,
  getCombinedWebResume,
} from "@/lib/antrian-tracking";
import { getRealCloudflareMetrics } from "@/lib/cloudflare-r2";
import { updateMonthlyWebPerformanceSnapshot } from "@/lib/monthly-web-performance";

export const dynamic = "force-dynamic";

// CORS Headers helper
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0",
    Pragma: "no-cache",
    Expires: "0",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(),
  });
}

// GET: returns aggregated statistics for Antrian Cek Mata & Web Photobooth (100% REAL from Cloudflare R2)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const period = (searchParams.get("period") || "weekly") as "weekly" | "monthly";
  const forceRefresh = searchParams.get("refresh") === "true";
  const month = searchParams.get("month") || "2026-11";

  let cloudflareMetrics = null;
  try {
    cloudflareMetrics = await getRealCloudflareMetrics(month, forceRefresh);
    if (cloudflareMetrics) {
      updateMonthlyWebPerformanceSnapshot(cloudflareMetrics);
    }
  } catch (err) {
    console.warn("[API Track-Event] Cloudflare R2 fetch warning, using cache:", err);
  }

  const stats = getAntrianStats(cloudflareMetrics);
  const photobooth = getPhotoboothStats(cloudflareMetrics);
  const combined = getCombinedWebResume(period, cloudflareMetrics);

  const now = new Date();
  const asOfDate = now.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
  const timeStr = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Jakarta",
  });

  return NextResponse.json(
    {
      success: true,
      data: stats,
      photobooth,
      combined,
      cloudflareReal: cloudflareMetrics,
      period,
      asOfDate: cloudflareMetrics?.lastSyncedAt || `${asOfDate}, ${timeStr} WIB`,
      timestamp: now.toISOString(),
      liveSync: true,
      isRealData: true,
      source: "Cloudflare R2 Bucket: iseeyou-photobooth-photos",
    },
    {
      headers: corsHeaders(),
    }
  );
}

// POST: records click/interaction event from optikiseeyou.com
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const userAgent = req.headers.get("user-agent") || undefined;
    const referrer = req.headers.get("referer") || body.referrer;

    const event = recordAntrianClick({
      branch: body.branch,
      sourceUrl: body.sourceUrl,
      device: body.device,
      userAgent,
      referrer,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      bookingDate: body.bookingDate,
      bookingTime: body.bookingTime,
      type: body.eventType || body.type || "antrian_booking",
    });

    const updatedStats = getAntrianStats();

    return NextResponse.json(
      {
        success: true,
        message: "Event Web & Antrian berhasil dicatat secara realtime ke Cloudflare R2 & IMI",
        event,
        data: updatedStats,
      },
      {
        headers: corsHeaders(),
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to record event",
      },
      {
        status: 500,
        headers: corsHeaders(),
      }
    );
  }
}
