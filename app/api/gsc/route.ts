import { NextRequest, NextResponse } from "next/server";
import { fetchGscReport } from "@/lib/gsc";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const timeframe = (searchParams.get("timeframe") || "weekly") as "weekly" | "monthly";

    const report = await fetchGscReport(timeframe === "monthly" ? "monthly" : "weekly");
    return NextResponse.json({ success: true, data: report });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
