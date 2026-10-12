import { NextRequest, NextResponse } from "next/server";
import { addEvidence, updateEvidence, deleteEvidence } from "@/lib/venue-service";

export const dynamic = "force-dynamic";

/**
 * POST /api/venue-evidence
 * Add new evidence to a venue
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body?.venueId || !body?.claimField || !body?.sourceUrl) {
      return NextResponse.json(
        { success: false, error: "venueId, claimField, dan sourceUrl wajib diisi" },
        { status: 400 }
      );
    }
    const created = addEvidence(body.venueId, body);
    if (!created) {
      return NextResponse.json({ success: false, error: "Venue tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal menambahkan bukti";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/**
 * PUT /api/venue-evidence
 * Update evidence claim
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body?.venueId || !body?.evidenceId) {
      return NextResponse.json(
        { success: false, error: "venueId dan evidenceId wajib diisi" },
        { status: 400 }
      );
    }
    const updated = updateEvidence(body.venueId, body.evidenceId, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Bukti tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui bukti";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/venue-evidence
 * Remove evidence
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const venueId = searchParams.get("venueId");
    const evidenceId = searchParams.get("evidenceId");
    if (!venueId || !evidenceId) {
      return NextResponse.json(
        { success: false, error: "venueId dan evidenceId wajib disertakan" },
        { status: 400 }
      );
    }
    const deleted = deleteEvidence(venueId, evidenceId);
    return NextResponse.json({ success: deleted });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal menghapus bukti";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
