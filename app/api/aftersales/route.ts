import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import {
  CustomerAftersalesRecord,
  FollowUpStatus,
} from "@/lib/aftersales";

export const dynamic = "force-dynamic";

const AFTERSALES_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/10lKjuzUvWhnUKbKNEo4opo4MiQoesZKW4NhY9sQ4T8w/export?format=xlsx";

let cachedData: {
  customers: CustomerAftersalesRecord[];
  topFrames: { frame: string; count: number }[];
  topLenses: { lens: string; count: number }[];
  totalFeedback: number;
  totalComplaints: number;
  totalReviews: number;
  lastSync: string;
} | null = null;

let lastSyncTimestamp = 0;

function parseExcelDate(serial: any): string {
  if (!serial) return new Date().toISOString().slice(0, 10);
  if (typeof serial === "number") {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    const y = date_info.getFullYear();
    const m = String(date_info.getMonth() + 1).padStart(2, "0");
    const d = String(date_info.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  const s = String(serial).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  return s;
}

function sanitizePhone(raw: any): string {
  if (!raw) return "";
  let clean = String(raw).replace(/[^0-9]/g, "");
  if (clean.startsWith("0")) {
    clean = "62" + clean.slice(1);
  } else if (clean.startsWith("8")) {
    clean = "628" + clean.slice(1);
  }
  return clean;
}

// Download helper with redirect handling
function downloadBuffer(url: string): Promise<Buffer> {
  const https = require("https");
  return new Promise((resolve, reject) => {
    https.get(url, (res: any) => {
      if (res.statusCode === 302 || res.statusCode === 307) {
        https.get(res.headers.location, (res2: any) => {
          const chunks: Buffer[] = [];
          res2.on("data", (c: Buffer) => chunks.push(c));
          res2.on("end", () => resolve(Buffer.concat(chunks)));
        }).on("error", reject);
      } else {
        const chunks: Buffer[] = [];
        res.on("data", (c: Buffer) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      }
    }).on("error", reject);
  });
}

async function fetchGoogleSheetsAftersales() {
  const buffer = await downloadBuffer(AFTERSALES_SHEET_URL);
  const workbook = XLSX.read(buffer, { type: "buffer" });

  // 1. Parse REKAP DATA (Feedback & Complaints)
  const rekapSheet = workbook.Sheets["REKAP DATA"];
  const rawRekap: any[] = rekapSheet ? XLSX.utils.sheet_to_json(rekapSheet) : [];

  // 2. Parse DATA CUSTOMER (Prescriptions, frame, and lenses)
  const customerSheet = workbook.Sheets["DATA CUSTOMER"];
  const rawCustomers: any[] = customerSheet ? XLSX.utils.sheet_to_json(customerSheet) : [];

  // Build customer index by sanitized phone
  const custByPhone = new Map<string, any>();
  const frameCounts: Record<string, number> = {};
  const lensCounts: Record<string, number> = {};

  rawCustomers.forEach((c) => {
    const p = sanitizePhone(c["NO.WHATSAPP"]);
    if (p && !custByPhone.has(p)) {
      custByPhone.set(p, c);
    }

    // Top frame model computation
    const f = String(c["JENIS BARANG"] || "").trim();
    const fLow = f.toLowerCase();
    if (f && f !== "." && f !== "-" && !fLow.includes("sendiri") && !fLow.includes("lensa only") && fLow !== "kacamata") {
      frameCounts[f] = (frameCounts[f] || 0) + 1;
    }

    // Top lens computation
    let l = String(c["JENIS LENSA"] || "").trim().toUpperCase();
    if (l && l !== "." && l !== "-") {
      if (l === "BLUERAY" || l === "BLUERAY HOYA") l = "BLURAY";
      if (l === "B.DRIVE") l = "BLUE DRIVE";
      lensCounts[l] = (lensCounts[l] || 0) + 1;
    }
  });

  const topFrames = Object.entries(frameCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([frame, count]) => ({ frame, count }));

  const topLenses = Object.entries(lensCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([lens, count]) => ({ lens, count }));

  const parsedList: CustomerAftersalesRecord[] = [];
  let totalComplaints = 0;
  let totalReviews = 0;

  // Branch resolver
  const resolveBranch = (candidate: string) => {
    const b = (candidate || "").toLowerCase();
    if (b.includes("cilacap") || b.includes("clp")) return { name: "Cilacap", key: "CLP" as const, city: "Cilacap" };
    if (b.includes("purbalingga") || b.includes("pbg")) return { name: "Purbalingga", key: "PBG" as const, city: "Purbalingga" };
    if (b.includes("wonosobo") || b.includes("wns")) return { name: "Wonosobo", key: "WNS" as const, city: "Wonosobo" };
    if (b.includes("tegal") || b.includes("lunar")) return { name: "Lunar Eyewear Tegal", key: "TGL" as const, city: "Tegal" };
    return { name: "Purwokerto (Pusat)", key: "PWT" as const, city: "Purwokerto" };
  };

  // Process 1: ALL entries from REKAP DATA (240 real records of complaints & reviews)
  rawRekap.forEach((r, idx) => {
    const phone = sanitizePhone(r["Nomor Hp"]);
    const jenis = String(r["Jenis Laporan"] || "Review").trim();
    const isComplaint = jenis.toLowerCase().includes("komplain");

    if (isComplaint) totalComplaints++;
    else totalReviews++;

    const matchedCust = phone ? custByPhone.get(phone) : null;
    const branchMeta = resolveBranch(r["Cabang"] || matchedCust?.["ALAMAT (KEC)"]);
    const examDate = parseExcelDate(r["Timestamp"] || matchedCust?.["TGL PERIKSA"]);

    const status: FollowUpStatus = isComplaint ? "butuh_garansi" : "selesai_puas";

    parsedList.push({
      id: `rekap-fb-${idx}`,
      name: String(r["Nama Pelanggan"] || matchedCust?.["NAMA LENGKAP"] || "Pelanggan Optik").trim(),
      phone: phone || "6281200000000",
      branch: branchMeta.name,
      branchKey: branchMeta.key,
      city: branchMeta.city,
      examDate,
      pickupDate: examDate,
      frameModel: String(matchedCust?.["JENIS BARANG"] || "Frame Optik").trim(),
      lensType: String(matchedCust?.["JENIS LENSA"] || "Lensa Kacamata").trim(),
      totalTransaction: matchedCust ? 650000 : 450000,
      prescription: {
        odSph: String(matchedCust?.["SPH KANAN"] || "0.00").trim(),
        odCyl: String(matchedCust?.["CYL KANAN (AXSIS = X)"] || "0.00").trim(),
        osSph: String(matchedCust?.["SPH KIRI"] || "0.00").trim(),
        osCyl: String(matchedCust?.["CYL KIRI (AXSIS = X)"] || "0.00").trim(),
        add: String(matchedCust?.["ADD"] || "").replace(".", "").trim() || undefined,
        pd: String(matchedCust?.["PD"] || "63").trim(),
      },
      status,
      notes: `${jenis.toUpperCase()}: "${r["isi Review/Komplain"] || "-"}"${r["Saran Customer (Perbaikan)"] && r["Saran Customer (Perbaikan)"] !== "-" ? ` | Saran: "${r["Saran Customer (Perbaikan)"]}"` : ""}`,
      inquiryChannel: "walk_in",
      satisfactionScore: isComplaint ? 2 : 5,
      logs: [
        {
          id: `log-fb-${idx}`,
          date: examDate,
          type: "whatsapp_message",
          actor: "CS Aftersales",
          note: `Log ${jenis} tercatat di sheet REKAP DATA: "${r["isi Review/Komplain"] || "-"}"`,
        },
      ],
    });
  });

  // Process 2: Recent customers from DATA CUSTOMER who haven't submitted review yet
  const recentSlice = rawCustomers.slice(-100).reverse();
  recentSlice.forEach((row, idx) => {
    const phone = sanitizePhone(row["NO.WHATSAPP"]);
    // Avoid duplicate if already added via REKAP DATA
    if (parsedList.some((p) => p.phone === phone)) return;

    const branchMeta = resolveBranch(row["ALAMAT (KEC)"] || "");
    const examDate = parseExcelDate(row["TGL PERIKSA"]);

    parsedList.push({
      id: `cust-row-${idx}`,
      name: String(row["NAMA LENGKAP"] || "Pelanggan Optik").trim(),
      phone: phone || "6281200000000",
      branch: branchMeta.name,
      branchKey: branchMeta.key,
      city: branchMeta.city,
      examDate,
      pickupDate: examDate,
      frameModel: String(row["JENIS BARANG"] || "Frame Optik").trim(),
      lensType: String(row["JENIS LENSA"] || "Single Vision").trim(),
      totalTransaction: 550000,
      prescription: {
        odSph: String(row["SPH KANAN"] || "0.00").trim(),
        odCyl: String(row["CYL KANAN (AXSIS = X)"] || "0.00").trim(),
        osSph: String(row["SPH KIRI"] || "0.00").trim(),
        osCyl: String(row["CYL KIRI (AXSIS = X)"] || "0.00").trim(),
        add: String(row["ADD"] || "").replace(".", "").trim() || undefined,
        pd: String(row["PD"] || "63").trim(),
      },
      status: "belum_dihubungi",
      notes: row["CATATAN"] && row["CATATAN"] !== "." ? String(row["CATATAN"]).trim() : `Kecamatan: ${row["ALAMAT (KEC)"] || "-"}`,
      inquiryChannel: "walk_in",
      logs: [
        {
          id: `log-exam-${idx}`,
          date: examDate,
          type: "store_visit",
          actor: "RO Cabang",
          note: `Pemeriksaan mata selesai (${branchMeta.name}). Frame: ${row["JENIS BARANG"] || "-"}`,
        },
      ],
    });
  });

  return {
    customers: parsedList,
    topFrames,
    topLenses,
    totalFeedback: rawRekap.length,
    totalComplaints,
    totalReviews,
    lastSync: new Date().toISOString(),
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const forceFresh = searchParams.get("fresh") === "true";
    const branch = searchParams.get("branch");
    const status = searchParams.get("status");
    const query = searchParams.get("q");

    const CACHE_TTL_MS = 3 * 60 * 1000;
    const now = Date.now();

    if (!cachedData || forceFresh || now - lastSyncTimestamp > CACHE_TTL_MS) {
      try {
        const live = await fetchGoogleSheetsAftersales();
        if (live && live.customers.length > 0) {
          cachedData = live;
          lastSyncTimestamp = now;
        }
      } catch (err) {
        console.error("Gagal sinkron live spreadsheet aftersales:", err);
      }
    }

    if (!cachedData) {
      return NextResponse.json(
        { success: false, error: "Gagal memuat data live spreadsheet" },
        { status: 502 }
      );
    }

    let filtered = [...cachedData.customers];

    if (branch && branch !== "all") {
      filtered = filtered.filter(
        (c) =>
          c.branchKey.toLowerCase() === branch.toLowerCase() ||
          c.city.toLowerCase() === branch.toLowerCase()
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
          c.lensType.toLowerCase().includes(q) ||
          c.notes.toLowerCase().includes(q)
      );
    }

    const counts = {
      total: cachedData.customers.length,
      belum_dihubungi: cachedData.customers.filter((c) => c.status === "belum_dihubungi").length,
      sudah_dihubungi: cachedData.customers.filter((c) => c.status === "sudah_dihubungi").length,
      selesai_puas: cachedData.customers.filter((c) => c.status === "selesai_puas").length,
      butuh_garansi: cachedData.customers.filter((c) => c.status === "butuh_garansi").length,
      totalComplaints: cachedData.totalComplaints,
      totalReviews: cachedData.totalReviews,
    };

    return NextResponse.json({
      success: true,
      data: filtered,
      counts,
      topFrames: cachedData.topFrames,
      topLenses: cachedData.topLenses,
      lastSync: cachedData.lastSync,
      source: "Google Spreadsheet 10lKjuzUvWhnUKbKNEo4opo4MiQoesZKW4NhY9sQ4T8w",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
