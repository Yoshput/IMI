import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const KOL_FILE_PATH = path.join(process.cwd(), "lib", "kol-data.json");

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branch = searchParams.get("branch");

    if (!fs.existsSync(KOL_FILE_PATH)) {
      return NextResponse.json({ success: false, error: "KOL data file not found" }, { status: 404 });
    }

    const rawData = fs.readFileSync(KOL_FILE_PATH, "utf-8");
    let kols = JSON.parse(rawData);

    if (branch && branch !== "all") {
      kols = kols.filter((k: any) => k.branchId === branch);
    }

    return NextResponse.json({
      success: true,
      total: kols.length,
      data: kols,
      meta: {
        lastUpdated: new Date().toISOString(),
        branches: ["Purwokerto", "Purbalingga", "Cilacap", "Wonosobo", "Lunar Eyewear Tegal"],
        totalBranches: 5,
        targetPerBranch: 3
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch KOL data" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, notes, customRateCard } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing KOL id" }, { status: 400 });
    }

    if (!fs.existsSync(KOL_FILE_PATH)) {
      return NextResponse.json({ success: false, error: "KOL data file not found" }, { status: 404 });
    }

    const rawData = fs.readFileSync(KOL_FILE_PATH, "utf-8");
    const kols = JSON.parse(rawData);

    const index = kols.findIndex((k: any) => k.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: "KOL not found" }, { status: 404 });
    }

    if (status !== undefined) kols[index].status = status;
    if (notes !== undefined) kols[index].notes = notes;
    if (customRateCard !== undefined) kols[index].rateCard = { ...kols[index].rateCard, ...customRateCard };

    fs.writeFileSync(KOL_FILE_PATH, JSON.stringify(kols, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: `KOL ${kols[index].name} updated successfully`,
      data: kols[index]
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update KOL data" },
      { status: 500 }
    );
  }
}
