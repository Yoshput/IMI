import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/venue-service";

export const dynamic = "force-dynamic";

/**
 * GET /api/venue-dashboard
 * Statistik ringkasan modul Venue & Event Intelligence
 */
export async function GET() {
  try {
    const stats = getDashboardStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memuat statistik";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
