import { NextResponse } from "next/server";
import { getTemplates, createTemplate, updateTemplate } from "@/lib/venue-service";

export const dynamic = "force-dynamic";

/**
 * GET /api/venue-templates
 * Daftar seluruh template komunikasi penjangkauan
 */
export async function GET() {
  try {
    const templates = getTemplates();
    return NextResponse.json({ success: true, total: templates.length, data: templates });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memuat template";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/**
 * POST /api/venue-templates
 * Buat template baru
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body?.name || !body?.body) {
      return NextResponse.json(
        { success: false, error: "Nama dan body template wajib diisi" },
        { status: 400 }
      );
    }
    const created = createTemplate(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal membuat template";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/**
 * PUT /api/venue-templates
 * Update template berdasarkan id di body
 */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body?.id) {
      return NextResponse.json(
        { success: false, error: "ID template wajib diisi" },
        { status: 400 }
      );
    }
    const updated = updateTemplate(body.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Template tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui template";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
