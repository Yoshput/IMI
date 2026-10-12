import { NextRequest, NextResponse } from "next/server";
import { getEvents, createEvent, updateEvent } from "@/lib/venue-service";

export const dynamic = "force-dynamic";

/**
 * GET /api/venue-events
 * List all events
 */
export async function GET() {
  try {
    const events = getEvents();

    return NextResponse.json({
      success: true,
      total: events.length,
      data: events,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Gagal memuat data event",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/venue-events
 * Create new event (requires name)
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

    if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: "Nama event wajib diisi" },
        { status: 400 }
      );
    }

    const createdEvent = createEvent(body);

    return NextResponse.json(
      {
        success: true,
        message: `Event "${createdEvent.name}" berhasil dibuat`,
        data: createdEvent,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Gagal membuat event",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/venue-events
 * Update event (include id in body)
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
        { success: false, error: "id event wajib disertakan dalam request body" },
        { status: 400 }
      );
    }

    const updated = updateEvent(id, updates);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Event dengan ID "${id}" tidak ditemukan` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Event "${updated.name}" berhasil diperbarui`,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Gagal memperbarui event",
      },
      { status: 500 }
    );
  }
}
