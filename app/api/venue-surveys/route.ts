import { NextRequest, NextResponse } from "next/server";
import { getSurveys, createSurvey, updateSurvey, deleteSurvey } from "@/lib/venue-service";

export const dynamic = "force-dynamic";

/**
 * GET /api/venue-surveys
 * List surveys with optional ?venueId filter
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const venueId = searchParams.get("venueId") || undefined;
    const surveys = getSurveys(venueId);
    return NextResponse.json({ success: true, total: surveys.length, data: surveys });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memuat data survei";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/**
 * POST /api/venue-surveys
 * Create a new survey form
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body?.venueId) {
      return NextResponse.json({ success: false, error: "venueId wajib diisi" }, { status: 400 });
    }
    const created = createSurvey(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal membuat formulir survei";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/**
 * PUT /api/venue-surveys
 * Update survey form
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body?.id) {
      return NextResponse.json({ success: false, error: "id survei wajib diisi" }, { status: 400 });
    }
    const updated = updateSurvey(body.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Survei tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui survei";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/venue-surveys
 * Delete survey form
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "id survei wajib diisi" }, { status: 400 });
    }
    const deleted = deleteSurvey(id);
    return NextResponse.json({ success: deleted });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal menghapus survei";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
