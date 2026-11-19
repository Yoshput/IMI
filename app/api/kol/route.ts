import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { mapLegacyKolToCreator } from "@/features/kol/services/kol-storage";

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

    // Also map to rich Creator schema
    const creators = kols.map(mapLegacyKolToCreator);

    return NextResponse.json({
      success: true,
      total: kols.length,
      data: kols,
      creators,
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
    const { id, status, notes, customRateCard, ...rest } = body;

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
      // If not found in legacy array, we can still append or respond not found
      return NextResponse.json({ success: false, error: "KOL not found" }, { status: 404 });
    }

    // Support legacy patch and full Creator update
    if (status !== undefined) kols[index].status = status;
    if (notes !== undefined) kols[index].notes = notes;
    if (customRateCard !== undefined) kols[index].rateCard = { ...kols[index].rateCard, ...customRateCard };

    // If body contains updated Creator fields
    if (rest.name) kols[index].name = rest.name;
    if (rest.instagramHandle) {
      kols[index].handle = rest.instagramHandle.replace(/[@]/g, "").trim();
      kols[index].instagramUrl = `https://www.instagram.com/${kols[index].handle}/`;
    }
    if (rest.contactWa) kols[index].contactWa = rest.contactWa;
    if (rest.city) kols[index].branchName = rest.city;
    if (rest.collaboration) {
      if (rest.collaboration.stage) kols[index].status = rest.collaboration.stage;
      if (rest.collaboration.productSent) kols[index].productSent = rest.collaboration.productSent;
    }

    fs.writeFileSync(KOL_FILE_PATH, JSON.stringify(kols, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: `KOL ${kols[index].name} updated successfully`,
      data: kols[index],
      creator: mapLegacyKolToCreator(kols[index])
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update KOL data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Check either Creator object schema or legacy newKol schema
    const name = payload.name;
    const handle = payload.instagramHandle || payload.handle;
    const branchId = payload.branchId || (payload.city ? payload.city.toLowerCase().replace(/\s+/g, "-") : "purwokerto");

    if (!name || !handle) {
      return NextResponse.json(
        { success: false, error: "Name and handle/instagramHandle are required" },
        { status: 400 }
      );
    }

    if (!fs.existsSync(KOL_FILE_PATH)) {
      return NextResponse.json({ success: false, error: "KOL data file not found" }, { status: 404 });
    }

    const rawData = fs.readFileSync(KOL_FILE_PATH, "utf-8");
    const kols = JSON.parse(rawData);

    // Sanitize handle
    const cleanHandle = handle.replace(/[@]/g, "").trim();
    const id = payload.id || `kol-${branchId}-${Date.now().toString(36)}`;

    const formattedKol = {
      id,
      branchId,
      branchName: payload.city || payload.branchName || "Purwokerto",
      brand: branchId === "tegal" ? "Lunar Eyewear" : "Optik I See You",
      name,
      handle: cleanHandle,
      platform: payload.platform === "multi" ? "Instagram & TikTok" : payload.platform === "tiktok" ? "TikTok" : "Instagram",
      profileImg: payload.profileImg || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      instagramUrl: payload.instagramUrl || `https://www.instagram.com/${cleanHandle}/`,
      tiktokUrl: payload.tiktokUrl || undefined,
      socialBladeUrl: `https://socialblade.com/instagram/user/${cleanHandle}`,
      socialBladeGrade: payload.socialBladeGrade || "B+",
      followers: Number(payload.instagramFollowers || payload.followers) || 25000,
      followersFormatted: payload.followersFormatted || `${((Number(payload.instagramFollowers || payload.followers) || 25000) / 1000).toFixed(1)}K`,
      engagementRate: Number(payload.engagementRate) || 5.0,
      niche: payload.category || payload.niche || "Aesthetic & Fashion",
      audienceFit: payload.primaryAudience || payload.audienceFit || "Verified Local Audience",
      rateCard: payload.rateCard || {
        story: "Rp 250.000 - Rp 350.000",
        reels: "Rp 750.000 - Rp 1.200.000",
        feeds: "Rp 500.000",
        visitStore: "Rp 1.250.000 - Rp 1.800.000",
        bundled: "Rp 1.650.000 (Visit + Reels + Stories + Raw Ads)"
      },
      benefits: payload.benefits || [
        "Reels review frame kacamata barter dikirim langsung ke rumah",
        "Stories promosi kode voucher followers",
        "Tag resmi akun @iseeyou.glasses"
      ],
      owningRights: payload.owningRights || {
        canOwnRaw: true,
        terms: "Video mentahan 4K/60fps tanpa watermark untuk Meta Ads",
        extraFeeEstimate: "Include paket barter / negotiable",
        adsUsageDays: 60,
        statusNote: "Bisa Owning. Siap diiklanin Meta Ads."
      },
      status: payload.collaboration?.stage || payload.status || "Kandidat Ditemukan",
      notes: payload.evaluation?.internalNotes || payload.notes || "KOL Terdaftar di sistem barter kacamata.",
      contactWa: payload.contactWa || "-",
      pitchTemplate: `Halo Kak ${name.split(" ")[0]}! Salam dari Optik I See You. Kami tertarik mengajak kolaborasi barter kacamata gratis kirim ke rumah tanpa perlu visit store...`,
      barterStrategy: payload.barterStrategy || {
        standardFee: "Barter Full Produk Kacamata",
        barterOption: "Barter Full Produk Kacamata",
        followerVoucher: "Voucher Diskon Belanja Followers",
        recommendedApproach: "Kirim produk kacamata langsung ke alamat rumah creator."
      }
    };

    kols.unshift(formattedKol);
    fs.writeFileSync(KOL_FILE_PATH, JSON.stringify(kols, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: `KOL ${formattedKol.name} (@${cleanHandle}) berhasil ditambahkan dan diverifikasi!`,
      data: formattedKol,
      creator: mapLegacyKolToCreator(formattedKol)
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to add KOL" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
    }

    if (!fs.existsSync(KOL_FILE_PATH)) {
      return NextResponse.json({ success: false, error: "KOL data file not found" }, { status: 404 });
    }

    const rawData = fs.readFileSync(KOL_FILE_PATH, "utf-8");
    let kols = JSON.parse(rawData);
    kols = kols.filter((k: any) => k.id !== id);

    fs.writeFileSync(KOL_FILE_PATH, JSON.stringify(kols, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: "KOL deleted successfully"
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete KOL" },
      { status: 500 }
    );
  }
}
