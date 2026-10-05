import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

import {
  SponsorSubmissionItem,
  MARKETING_STAFF_PHONE,
  buildSponsorWhatsAppUrl,
} from "@/lib/pengajuan-service";

const getFilePath = () => path.join(process.cwd(), "data", "sponsor-submissions.json");

function loadSubmissions(): SponsorSubmissionItem[] {
  try {
    const p = getFilePath();
    if (fs.existsSync(p)) {
      const data = fs.readFileSync(p, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Failed to load sponsor submissions:", e);
  }
  return [];
}

function saveSubmissions(list: SponsorSubmissionItem[]): void {
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
    const status = searchParams.get("status");

    let list = loadSubmissions();

    if (branch && branch !== "all") {
      list = list.filter((i) => i.targetBranch.toLowerCase().includes(branch.toLowerCase()));
    }
    if (status && status !== "all") {
      list = list.filter((i) => i.status === status);
    }

    // Sort newest first
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      count: list.length,
      data: list,
      marketingPhone: MARKETING_STAFF_PHONE,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.applicantName || !body.eventName) {
      return NextResponse.json(
        { success: false, error: "Nama pengaju dan nama event/kegiatan wajib diisi" },
        { status: 400 }
      );
    }

    const newItem: SponsorSubmissionItem = {
      id: `spons-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      applicantName: String(body.applicantName || "").trim(),
      institution: String(body.institution || "-").trim(),
      applicantPhone: String(body.applicantPhone || "").trim(),
      targetBranch: String(body.targetBranch || "Purwokerto (Pusat)").trim(),
      eventName: String(body.eventName || "").trim(),
      eventDate: String(body.eventDate || "").trim(),
      description: String(body.description || "-").trim(),
      targetAudience: Number(body.targetAudience) || 100,
      proposalUrl: String(body.proposalUrl || "").trim(),
      offeredBenefits: String(body.offeredBenefits || "-").trim(),
      status: "pending",
      notes: "Pengajuan baru via portal web optikiseeyou.com",
    };

    const currentList = loadSubmissions();
    currentList.unshift(newItem);
    saveSubmissions(currentList);

    const waUrl = buildSponsorWhatsAppUrl(newItem);

    return NextResponse.json({
      success: true,
      message: "Pengajuan proposal sponsorship berhasil disimpan!",
      data: newItem,
      waDirectUrl: waUrl,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
