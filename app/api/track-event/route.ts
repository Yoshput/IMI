import { NextRequest, NextResponse } from "next/server";
import {
  recordAntrianClick,
  getAntrianStats,
  getPhotoboothStats,
  getCombinedWebResume,
} from "@/lib/antrian-tracking";

export const dynamic = "force-dynamic";

// CORS Headers helper
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0",
    "Pragma": "no-cache",
    "Expires": "0",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(),
  });
}

// GET: returns aggregated statistics for Antrian Cek Mata & Web Photobooth
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const period = (searchParams.get("period") || "weekly") as "weekly" | "monthly";
  const action = searchParams.get("action");

  // Live simulation trigger for testing real-time increment in UI
  if (action === "ping" || action === "simulate") {
    const branch = searchParams.get("branch") || "pwt";
    recordAntrianClick({
      branch,
      sourceUrl: "https://optikiseeyou.com/booking-antrian?action=live_test",
      device: "mobile",
      referrer: "https://optikiseeyou.com",
      type: "antrian_booking",
    });
  }

  const stats = getAntrianStats();
  const photobooth = getPhotoboothStats();
  const combined = getCombinedWebResume(period);

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
      period,
      asOfDate: `${asOfDate}, ${timeStr} WIB`,
      timestamp: now.toISOString(),
      liveSync: true,
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
      type: body.eventType || body.type || "antrian_booking",
    });

    const updatedStats = getAntrianStats();

    return NextResponse.json(
      {
        success: true,
        message: "Event Web & Antrian berhasil dicatat secara realtime",
        event,
        data: updatedStats,
      },
      {
        headers: corsHeaders(),
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      {
        status: 500,
        headers: corsHeaders(),
      }
    );
  }
}
