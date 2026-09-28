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

  const stats = getAntrianStats();
  const photobooth = getPhotoboothStats();
  const combined = getCombinedWebResume(period);

  return NextResponse.json(
    {
      success: true,
      data: stats,
      photobooth,
      combined,
      period,
      asOfDate: "2026-09-28",
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

    return NextResponse.json(
      {
        success: true,
        message: "Event Web & Antrian berhasil dicatat",
        event,
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
