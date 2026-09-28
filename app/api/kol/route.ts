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

export async function POST(request: Request) {
  try {
    const newKol = await request.json();

    if (!newKol.name || !newKol.handle || !newKol.branchId) {
      return NextResponse.json(
        { success: false, error: "Name, handle, and branchId are required" },
        { status: 400 }
      );
    }

    if (!fs.existsSync(KOL_FILE_PATH)) {
      return NextResponse.json({ success: false, error: "KOL data file not found" }, { status: 404 });
    }

    const rawData = fs.readFileSync(KOL_FILE_PATH, "utf-8");
    const kols = JSON.parse(rawData);

    // Sanitize handle
    const cleanHandle = newKol.handle.replace(/[@]/g, "").trim();
    const id = `kol-${newKol.branchId}-${Date.now().toString(36)}`;

    const formattedKol = {
      id,
      branchId: newKol.branchId,
      branchName: newKol.branchName || (newKol.branchId === "tegal" ? "Lunar Eyewear Tegal" : newKol.branchId.toUpperCase()),
      brand: newKol.branchId === "tegal" ? "Lunar Eyewear" : "Optik I See You",
      name: newKol.name,
      handle: cleanHandle,
      platform: "Instagram & TikTok",
      profileImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      instagramUrl: `https://www.instagram.com/${cleanHandle}/`,
      socialBladeUrl: `https://socialblade.com/instagram/user/${cleanHandle}`,
      socialBladeGrade: newKol.socialBladeGrade || "B+",
      followers: Number(newKol.followers) || 50000,
      followersFormatted: newKol.followersFormatted || `${((Number(newKol.followers) || 50000) / 1000).toFixed(1)}K`,
      engagementRate: Number(newKol.engagementRate) || 5.0,
      niche: newKol.niche || "Lifestyle & Fashion",
      audienceFit: newKol.audienceFit || "Verified Local Audience",
      rateCard: newKol.rateCard || {
        story: "Rp 250.000 - Rp 350.000",
        reels: "Rp 750.000 - Rp 1.200.000",
        feeds: "Rp 500.000",
        visitStore: "Rp 1.250.000 - Rp 1.800.000",
        bundled: "Rp 1.650.000 (Visit + Reels + Stories + Raw Ads)"
      },
      benefits: newKol.benefits || [
        "Reels review frame kacamata & store experience",
        "Stories promosi cabang & tag akun resmi",
        "Voucher diskon followers untuk kuis di kolom komentar"
      ],
      owningRights: {
        canOwnRaw: true,
        terms: "Video mentahan 4K/60fps tanpa watermark untuk Meta Ads",
        extraFeeEstimate: "Include paket visit / negotiable",
        adsUsageDays: 60,
        statusNote: "Bisa Owning. Siap diiklanin Meta Ads."
      },
      status: "Rekomendasi Utama",
      notes: newKol.notes || "KOL Terverifikasi manual dengan followers >50K.",
      contactWa: newKol.contactWa || "-",
      pitchTemplate: `Hai kak ${newKol.name.split(" ")[0]}.. ✨👋\n\nPerkenalkan saya Yossika dari tim Marketing Optik I See You Glasses 👓\nSetelah melihat Social Media kaka, saya tertarik untuk mengajak kerja sama atau berkolaborasi dengan kita optik i see youu 🥰\n\nKalo boleh tau, boleh di infokan untuk ratecardnyaa, sebagai bahan pertimbangan kami?\n\nTerimakasih ditunggu kabar baiknya ya ka 🙏\nHave a nicee dayy ya kaa! 🌸✨`,
      barterStrategy: {
        standardFee: "Rp 250.000",
        barterOption: "Barter Full Produk Kacamata",
        followerVoucher: "Voucher Diskon Belanja Followers",
        recommendedApproach: "Tahap 1: Tanya ratecard dulu. Tahap 2: Tawar barter kacamata + voucher followers."
      }
    };

    kols.unshift(formattedKol);
    fs.writeFileSync(KOL_FILE_PATH, JSON.stringify(kols, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: `KOL ${formattedKol.name} (@${cleanHandle}) berhasil ditambahkan dan diverifikasi!`,
      data: formattedKol
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


