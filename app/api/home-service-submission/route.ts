import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

import {
  HomeServiceSubmissionItem,
  BRANCH_CS_CONFIG,
  buildHomeServiceWhatsAppUrl,
} from "@/lib/pengajuan-service";

const getFilePath = () => path.join(process.cwd(), "data", "home-service-submissions.json");

function loadSubmissions(): HomeServiceSubmissionItem[] {
  try {
    const p = getFilePath();
    if (fs.existsSync(p)) {
      const data = fs.readFileSync(p, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Failed to load home service submissions:", e);
  }
  return [];
}

function saveSubmissions(list: HomeServiceSubmissionItem[]): void {
  try {
    const dir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(getFilePath(), JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.warn("Could not write to disk (expected on read-only serverless):", e);
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const branch = searchParams.get("branch");

    let list = loadSubmissions();

    if (branch && branch !== "all") {
      list = list.filter((i) => i.branchKey === branch || i.targetBranch.toLowerCase().includes(branch.toLowerCase()));
    }

    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      count: list.length,
      data: list,
      branches: BRANCH_CS_CONFIG,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.customerName || !body.address || !body.serviceDate) {
      return NextResponse.json(
        { success: false, error: "Nama pelanggan, alamat, dan tanggal jadwal wajib diisi" },
        { status: 400 }
      );
    }

    const bKey = (body.branchKey || "pwt").toLowerCase() as "pwt" | "pbg" | "clp" | "wns";
    const branchConfig = BRANCH_CS_CONFIG[bKey] || BRANCH_CS_CONFIG.pwt;

    const newItem: HomeServiceSubmissionItem = {
      id: `hs-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      customerName: String(body.customerName || "").trim(),
      customerPhone: String(body.customerPhone || "").trim(),
      targetBranch: branchConfig.name,
      branchKey: bKey,
      csPhone: branchConfig.csPhone,
      serviceDate: String(body.serviceDate || "").trim(),
      serviceTime: String(body.serviceTime || "10:00").trim(),
      address: String(body.address || "").trim(),
      participantCount: Number(body.participantCount) || 1,
      complaint: String(body.complaint || "-").trim(),
      status: "pending",
      notes: "Permintaan booking baru via web portal optikiseeyou.com",
    };

    const currentList = loadSubmissions();
    currentList.unshift(newItem);
    saveSubmissions(currentList);

    const waUrl = buildHomeServiceWhatsAppUrl(bKey, newItem);

    return NextResponse.json({
      success: true,
      message: "Jadwal Home Service berhasil diajukan!",
      data: newItem,
      waDirectUrl: waUrl,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
