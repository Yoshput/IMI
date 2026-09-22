import { NextRequest, NextResponse } from "next/server";
import { recordAntrianClick, getAntrianStats } from "@/lib/antrian-tracking";

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

// GET: returns aggregated statistics for Antrian Cek Mata
export async function GET() {
  const stats = getAntrianStats();
  return NextResponse.json(
    { success: true, data: stats },
    {
      headers: corsHeaders(),
    }
  );
}

// POST: records click event from optikiseeyou.com
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
    });

    return NextResponse.json(
      {
        success: true,
        message: "Event Antrian Cek Mata berhasil dicatat",
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
