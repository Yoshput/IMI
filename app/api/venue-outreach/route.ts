import { NextRequest, NextResponse } from "next/server";
import {
  getOutreachActivities,
  createOutreachActivity,
  updateOutreachActivity,
} from "@/lib/venue-service";

export const dynamic = "force-dynamic";

/**
 * GET /api/venue-outreach
 * List all outreach activities, optionally filtered by venueId query param
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const venueId = searchParams.get("venueId") || undefined;

    const activities = getOutreachActivities(venueId);

    return NextResponse.json({
      success: true,
      total: activities.length,
      data: activities,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Gagal memuat aktivitas outreach",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/venue-outreach
 * Create new outreach activity (requires venueId)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Format request body tidak valid" },
        { status: 400 }
      );
    }

    if (!body.venueId || typeof body.venueId !== "string" || !body.venueId.trim()) {
      return NextResponse.json(
        { success: false, error: "venueId wajib diisi" },
        { status: 400 }
      );
    }

    const createdActivity = createOutreachActivity(body);

    return NextResponse.json(
      {
        success: true,
        message: "Aktivitas outreach berhasil dicatat",
        data: createdActivity,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Gagal mencatat aktivitas outreach",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/venue-outreach
 * Update outreach activity (include id in body)
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Format request body tidak valid" },
        { status: 400 }
      );
    }

    const { id, ...updates } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "id aktivitas outreach wajib disertakan dalam request body" },
        { status: 400 }
      );
    }

    const updated = updateOutreachActivity(id, updates);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Aktivitas outreach dengan ID "${id}" tidak ditemukan` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Aktivitas outreach berhasil diperbarui",
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Gagal memperbarui aktivitas outreach",
      },
      { status: 500 }
    );
  }
}
