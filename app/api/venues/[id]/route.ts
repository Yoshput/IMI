import { NextRequest, NextResponse } from "next/server";
import { getVenueById, updateVenue, archiveVenue } from "@/lib/venue-service";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/venues/[id]
 * Get single venue by ID
 */
export async function GET(
  _req: NextRequest,
  context: RouteParams
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID venue tidak boleh kosong" },
        { status: 400 }
      );
    }

    const venue = getVenueById(id);

    if (!venue) {
      return NextResponse.json(
        { success: false, error: `Venue dengan ID "${id}" tidak ditemukan` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: venue,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Gagal memuat detail venue",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/venues/[id]
 * Update venue (partial update)
 */
export async function PUT(
  req: NextRequest,
  context: RouteParams
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID venue tidak boleh kosong" },
        { status: 400 }
      );
    }

    const body = await req.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Format request body tidak valid" },
        { status: 400 }
      );
    }

    const updated = updateVenue(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Venue dengan ID "${id}" tidak ditemukan` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Venue "${updated.name}" berhasil diperbarui`,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Gagal memperbarui venue",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/venues/[id]
 * Archive venue (soft delete by setting operationalStatus to permanently_closed)
 */
export async function DELETE(
  _req: NextRequest,
  context: RouteParams
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID venue tidak boleh kosong" },
        { status: 400 }
      );
    }

    const archived = archiveVenue(id, "permanently_closed");

    if (!archived) {
      return NextResponse.json(
        { success: false, error: `Venue dengan ID "${id}" tidak ditemukan` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Venue "${archived.name}" berhasil diarsipkan`,
      data: archived,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Gagal mengarsipkan venue",
      },
      { status: 500 }
    );
  }
}
