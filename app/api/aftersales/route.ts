import { NextRequest, NextResponse } from "next/server";
import {
  INITIAL_CUSTOMERS,
  CustomerAftersalesRecord,
  FollowUpStatus,
} from "@/lib/aftersales";

export const dynamic = "force-dynamic";

let inMemoryCustomers: CustomerAftersalesRecord[] = [...INITIAL_CUSTOMERS];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const branch = searchParams.get("branch");
  const status = searchParams.get("status");
  const query = searchParams.get("q");

  let filtered = [...inMemoryCustomers];

  if (branch && branch !== "all") {
    filtered = filtered.filter(
      (c) => c.branchKey.toLowerCase() === branch.toLowerCase() || c.city.toLowerCase() === branch.toLowerCase()
    );
  }

  if (status && status !== "all") {
    filtered = filtered.filter((c) => c.status === status);
  }

  if (query && query.trim()) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.frameModel.toLowerCase().includes(q) ||
        c.lensType.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    success: true,
    data: filtered,
    total: filtered.length,
    counts: {
      total: inMemoryCustomers.length,
      belum_dihubungi: inMemoryCustomers.filter((c) => c.status === "belum_dihubungi").length,
      sudah_dihubungi: inMemoryCustomers.filter((c) => c.status === "sudah_dihubungi").length,
      selesai_puas: inMemoryCustomers.filter((c) => c.status === "selesai_puas").length,
      butuh_garansi: inMemoryCustomers.filter((c) => c.status === "butuh_garansi").length,
    },
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, notes, newLog } = body;

    const idx = inMemoryCustomers.findIndex((c) => c.id === id);
    if (idx === -1) {
      return NextResponse.json({ success: false, error: "Customer tidak ditemukan" }, { status: 404 });
    }

    if (status) {
      inMemoryCustomers[idx].status = status as FollowUpStatus;
    }
    if (notes !== undefined) {
      inMemoryCustomers[idx].notes = notes;
    }
    if (newLog) {
      inMemoryCustomers[idx].logs.push({
        id: `l-${Date.now()}`,
        date: new Date().toISOString().replace("T", " ").slice(0, 16),
        type: newLog.type || "whatsapp_message",
        actor: newLog.actor || "Staff Aftersales",
        note: newLog.note || "Tindak lanjut customer",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Data customer aftersales berhasil diperbarui",
      data: inMemoryCustomers[idx],
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
