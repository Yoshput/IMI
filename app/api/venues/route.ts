import { NextRequest, NextResponse } from "next/server";
import { getVenues, createVenue, VenueFilterParams } from "@/lib/venue-service";

export const dynamic = "force-dynamic";

/**
 * GET /api/venues
 * List all venues with optional query parameters:
 * - q: text search (nama, alamat, kota, kecamatan, alternatif)
 * - category: kategori venue
 * - outreachStatus: status penjangkauan
 * - minCapacity: kapasitas minimum
 * - maxCapacity: kapasitas maksimum
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || undefined;
    const category = searchParams.get("category") || undefined;
    const outreachStatus = searchParams.get("outreachStatus") || undefined;
    const minCapStr = searchParams.get("minCapacity");
    const maxCapStr = searchParams.get("maxCapacity");

    const filters: VenueFilterParams = {
      q,
      category,
      outreachStatus,
      minCapacity: minCapStr ? parseInt(minCapStr, 10) : undefined,
      maxCapacity: maxCapStr ? parseInt(maxCapStr, 10) : undefined,
    };

    const venues = getVenues(filters);

    return NextResponse.json({
      success: true,
      total: venues.length,
      data: venues,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Gagal memuat data venue",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/venues
 * Create a new venue. Required: name
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
        { success: false, error: "Nama venue wajib diisi" },
        { status: 400 }
      );
    }

    const createdVenue = createVenue(body);

    return NextResponse.json(
      {
        success: true,
        message: `Venue "${createdVenue.name}" berhasil ditambahkan`,
        data: createdVenue,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Gagal menambahkan venue",
      },
      { status: 500 }
    );
  }
}
