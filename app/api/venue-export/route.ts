import { NextResponse } from "next/server";
import { exportVenuesCSV } from "@/lib/venue-service";

export const dynamic = "force-dynamic";

/**
 * GET /api/venue-export
 * Export all venues as CSV
 */
export async function GET() {
  try {
    const csvData = exportVenuesCSV();
    const dateStr = new Date().toISOString().slice(0, 10);
    return new NextResponse(csvData, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="venue-intelligence-${dateStr}.csv"`,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal mengekspor data CSV";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
