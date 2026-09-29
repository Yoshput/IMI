import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import {
  CustomerAftersalesRecord,
  FollowUpStatus,
} from "@/lib/aftersales";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

/**
 * Robust Timestamp & Datetime Parser for Google Sheets Column A
 * Supports:
 * 1. Excel serial number with time fraction (e.g. 46210.37741545139)
 * 2. Formatted datetime strings (e.g. "24/09/2026 16:16:12" or "7/7/2026 9:03:29")
 * 3. ISO strings or plain date strings
 */
function parseTimestamp(raw: any): {
  dateObj: Date | null;
  iso: string;
  formatted: string;
  dateOnly: string;
} {
  if (raw === null || raw === undefined || raw === "" || raw === "-" || raw === ".") {
    return { dateObj: null, iso: "", formatted: "-", dateOnly: "" };
  }

  let dateObj: Date | null = null;

  if (typeof raw === "number") {
    // Excel serial number with exact millisecond time fraction
    const ms = Math.round((raw - 25569) * 86400 * 1000);
    const d = new Date(ms);
    if (!isNaN(d.getTime())) {
      dateObj = d;
    }
  } else {
    const s = String(raw).trim();
    const parsedIso = new Date(s);
    if (!isNaN(parsedIso.getTime()) && s.includes("-") && s.includes("T")) {
      dateObj = parsedIso;
    } else {
      // Regex for DD/MM/YYYY or M/D/YYYY or YYYY-MM-DD with optional HH:mm:ss
      const match = s.match(
        /^(\d{1,4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/
      );
      if (match) {
        let [_, p1, p2, p3, hr, min, sec] = match;
        let y: number, m: number, day: number;
        if (p1.length === 4) {
          y = parseInt(p1, 10);
          m = parseInt(p2, 10) - 1;
          day = parseInt(p3, 10);
        } else if (p3.length === 4) {
          if (parseInt(p1, 10) > 12) {
            day = parseInt(p1, 10);
            m = parseInt(p2, 10) - 1;
            y = parseInt(p3, 10);
          } else {
            m = parseInt(p1, 10) - 1;
            day = parseInt(p2, 10);
            y = parseInt(p3, 10);
          }
        } else {
          day = parseInt(p1, 10);
          m = parseInt(p2, 10) - 1;
          y = 2000 + parseInt(p3, 10);
        }
        const d = new Date(
          Date.UTC(
            y,
            m,
            day,
            parseInt(hr || "0", 10),
            parseInt(min || "0", 10),
            parseInt(sec || "0", 10)
          )
        );
        if (!isNaN(d.getTime())) {
          dateObj = d;
        }
      }
    }
  }

  if (!dateObj) {
    return { dateObj: null, iso: "", formatted: "-", dateOnly: "" };
  }

  const iso = dateObj.toISOString();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  const y = dateObj.getUTCFullYear();
  const m = months[dateObj.getUTCMonth()];
  const d = String(dateObj.getUTCDate()).padStart(2, "0");
  const hh = String(dateObj.getUTCHours()).padStart(2, "0");
  const mm = String(dateObj.getUTCMinutes()).padStart(2, "0");
  const formatted = `${d} ${m} ${y}, ${hh}:${mm} WIB`;
  const dateOnly = `${y}-${String(dateObj.getUTCMonth() + 1).padStart(2, "0")}-${d}`;

  return { dateObj, iso, formatted, dateOnly };
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
    https
      .get(url, (res: any) => {
        if (res.statusCode === 302 || res.statusCode === 307) {
          https
            .get(res.headers.location, (res2: any) => {
              const chunks: Buffer[] = [];
              res2.on("data", (c: Buffer) => chunks.push(c));
              res2.on("end", () => resolve(Buffer.concat(chunks)));
            })
            .on("error", reject);
        } else {
          const chunks: Buffer[] = [];
          res.on("data", (c: Buffer) => chunks.push(c));
          res.on("end", () => resolve(Buffer.concat(chunks)));
        }
      })
      .on("error", reject);
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
    if (
      f &&
      f !== "." &&
      f !== "-" &&
      !fLow.includes("sendiri") &&
      !fLow.includes("lensa only") &&
      fLow !== "kacamata"
    ) {
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
    if (b.includes("cilacap") || b.includes("clp"))
      return { name: "Cilacap", key: "CLP" as const, city: "Cilacap" };
    if (b.includes("purbalingga") || b.includes("pbg"))
      return { name: "Purbalingga", key: "PBG" as const, city: "Purbalingga" };
    if (b.includes("wonosobo") || b.includes("wns"))
      return { name: "Wonosobo", key: "WNS" as const, city: "Wonosobo" };
    if (b.includes("tegal") || b.includes("lunar"))
      return { name: "Lunar Eyewear Tegal", key: "TGL" as const, city: "Tegal" };
    return { name: "Purwokerto (Pusat)", key: "PWT" as const, city: "Purwokerto" };
  };

  // Process 1: ALL entries from REKAP DATA (239 real records of complaints & reviews)
  rawRekap.forEach((r, idx) => {
    const phone = sanitizePhone(r["Nomor Hp"]);
    const jenis = String(r["Jenis Laporan"] || "Review").trim();
    const isComplaint = jenis.toLowerCase().includes("komplain");

    if (isComplaint) totalComplaints++;
    else totalReviews++;

    const matchedCust = phone ? custByPhone.get(phone) : null;
    const branchMeta = resolveBranch(r["Cabang"] || matchedCust?.["ALAMAT (KEC)"]);

    // Extract exact Timestamp from Column A
    const parsedTs = parseTimestamp(r["Timestamp"] || matchedCust?.["Timestamp"]);
    const examDate = parsedTs.dateOnly || "2026-09-27";

    const status: FollowUpStatus = isComplaint ? "butuh_garansi" : "selesai_puas";
    const feedbackText = String(r["isi Review/Komplain"] || "").trim();
    const suggestionText = String(r["Saran Customer (Perbaikan)"] || "").trim();

    parsedList.push({
      id: `rekap-fb-${idx}`,
      name: String(
        r["Nama Pelanggan"] || matchedCust?.["NAMA LENGKAP"] || "Pelanggan Optik"
      ).trim(),
      phone: phone || "6281200000000",
      branch: branchMeta.name,
      branchKey: branchMeta.key,
      city: branchMeta.city,
      timestamp: parsedTs.iso,
      timestampFormatted: parsedTs.formatted,
      timestampDate: parsedTs.dateOnly,
      reportType: isComplaint ? "Komplain" : "Review",
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
      notes: `${jenis.toUpperCase()}: "${feedbackText || "-"}"${
        suggestionText && suggestionText !== "-" ? ` | Saran: "${suggestionText}"` : ""
      }`,
      feedbackText,
      suggestionText,
      inquiryChannel: "walk_in",
      satisfactionScore: isComplaint ? 2 : 5,
      logs: [
        {
          id: `log-fb-${idx}`,
          date: examDate,
          type: "whatsapp_message",
          actor: "CS Aftersales",
          note: `Log ${jenis} tercatat di sheet REKAP DATA: "${feedbackText || "-"}"`,
        },
      ],
    });
  });

  // Process 2: Recent customers from DATA CUSTOMER (covering all of September 2026 + recent)
  const recentSlice = rawCustomers.slice(-500).reverse();
  recentSlice.forEach((row, idx) => {
    const phone = sanitizePhone(row["NO.WHATSAPP"]);
    // Avoid duplicate if already added via REKAP DATA
    if (parsedList.some((p) => p.phone === phone && phone !== "6281200000000")) return;

    const branchMeta = resolveBranch(row["ALAMAT (KEC)"] || "");
    const parsedTs = parseTimestamp(row["Timestamp"] || row["TGL PERIKSA"]);
    const examDate = parsedTs.dateOnly || "2026-09-27";

    parsedList.push({
      id: `cust-row-${idx}`,
      name: String(row["NAMA LENGKAP"] || "Pelanggan Optik").trim(),
      phone: phone || "6281200000000",
      branch: branchMeta.name,
      branchKey: branchMeta.key,
      city: branchMeta.city,
      timestamp: parsedTs.iso,
      timestampFormatted: parsedTs.formatted,
      timestampDate: parsedTs.dateOnly,
      reportType: "Pemeriksaan",
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
      notes:
        row["CATATAN"] && row["CATATAN"] !== "."
          ? String(row["CATATAN"]).trim()
          : `Kecamatan: ${row["ALAMAT (KEC)"] || "-"}`,
      inquiryChannel: "walk_in",
      logs: [
        {
          id: `log-exam-${idx}`,
          date: examDate,
          type: "store_visit",
          actor: "RO Cabang",
          note: `Pemeriksaan mata selesai (${branchMeta.name}). Frame: ${
            row["JENIS BARANG"] || "-"
          }`,
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
    const reportType = searchParams.get("reportType");
    const query = searchParams.get("q");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const preset = searchParams.get("preset");
    const sort = searchParams.get("sort") || "newest";

    const CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL for fast background sync
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

    // Branch filter
    if (branch && branch !== "all") {
      filtered = filtered.filter(
        (c) =>
          c.branchKey.toLowerCase() === branch.toLowerCase() ||
          c.city.toLowerCase() === branch.toLowerCase()
      );
    }

    // Status filter
    if (status && status !== "all") {
      filtered = filtered.filter((c) => c.status === status);
    }

    // Report Type filter (Review, Komplain, Pemeriksaan)
    if (reportType && reportType !== "all") {
      filtered = filtered.filter(
        (c) => c.reportType.toLowerCase() === reportType.toLowerCase()
      );
    }

    // Text search query
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

    // Preset Date Filtering
    // Reference date: 2026-09-29
    if (preset && preset !== "all") {
      if (preset === "today") {
        filtered = filtered.filter((c) => c.timestampDate === "2026-09-29");
      } else if (preset === "7days") {
        filtered = filtered.filter(
          (c) => c.timestampDate >= "2026-09-22" && c.timestampDate <= "2026-09-29"
        );
      } else if (preset === "30days") {
        filtered = filtered.filter(
          (c) => c.timestampDate >= "2026-08-31" && c.timestampDate <= "2026-09-29"
        );
      } else if (preset === "this_month") {
        filtered = filtered.filter(
          (c) => c.timestampDate >= "2026-09-01" && c.timestampDate <= "2026-09-30"
        );
      }
    } else if (startDate || endDate) {
      if (startDate) {
        filtered = filtered.filter((c) => c.timestampDate >= startDate);
      }
      if (endDate) {
        filtered = filtered.filter((c) => c.timestampDate <= endDate);
      }
    }

    // Sorting by Timestamp
    filtered.sort((a, b) => {
      const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      if (sort === "oldest") {
        return timeA - timeB;
      }
      // default: newest
      return timeB - timeA;
    });

    const counts = {
      total: cachedData.customers.length,
      filtered: filtered.length,
      belum_dihubungi: cachedData.customers.filter((c) => c.status === "belum_dihubungi").length,
      sudah_dihubungi: cachedData.customers.filter((c) => c.status === "sudah_dihubungi").length,
      selesai_puas: cachedData.customers.filter((c) => c.status === "selesai_puas").length,
      butuh_garansi: cachedData.customers.filter((c) => c.status === "butuh_garansi").length,
      totalComplaints: cachedData.totalComplaints,
      totalReviews: cachedData.totalReviews,
    };

    const response = NextResponse.json({
      success: true,
      data: filtered,
      counts,
      topFrames: cachedData.topFrames,
      topLenses: cachedData.topLenses,
      lastSync: cachedData.lastSync,
      source: "Google Spreadsheet 10lKjuzUvWhnUKbKNEo4opo4MiQoesZKW4NhY9sQ4T8w",
    });

    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, notes, newLog } = body;

    if (!cachedData || !id) {
      return NextResponse.json(
        { success: false, error: "Data atau ID tidak ditemukan" },
        { status: 400 }
      );
    }

    const idx = cachedData.customers.findIndex((c) => c.id === id);
    if (idx === -1) {
      return NextResponse.json(
        { success: false, error: "Pelanggan tidak ditemukan" },
        { status: 404 }
      );
    }

    const existing = cachedData.customers[idx];
    const updated: CustomerAftersalesRecord = {
      ...existing,
      status: status || existing.status,
      notes: notes !== undefined ? notes : existing.notes,
      logs: newLog
        ? [
            {
              id: `log-${Date.now()}`,
              date: new Date().toISOString().slice(0, 10),
              type: newLog.type || "whatsapp_message",
              actor: newLog.actor || "CS Aftersales",
              note: newLog.note || "Update status",
            },
            ...existing.logs,
          ]
        : existing.logs,
    };

    cachedData.customers[idx] = updated;

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      branchKey,
      frameModel,
      lensType,
      totalTransaction,
      prescription,
      notes,
      status,
    } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: "Nama dan nomor WhatsApp wajib diisi" },
        { status: 400 }
      );
    }

    const branchMap: Record<string, { name: string; city: string }> = {
      PWT: { name: "Purwokerto (Pusat)", city: "Purwokerto" },
      CLP: { name: "Cilacap", city: "Cilacap" },
      PBG: { name: "Purbalingga", city: "Purbalingga" },
      WNS: { name: "Wonosobo", city: "Wonosobo" },
      TGL: { name: "Lunar Eyewear Tegal", city: "Tegal" },
    };

    const bMeta = branchMap[branchKey] || { name: "Purwokerto (Pusat)", city: "Purwokerto" };
    const now = new Date();
    const iso = now.toISOString();
    const dateOnly = iso.slice(0, 10);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    const formatted = `${String(now.getUTCDate()).padStart(2, "0")} ${
      months[now.getUTCMonth()]
    } ${now.getUTCFullYear()}, ${String(now.getUTCHours()).padStart(2, "0")}:${String(
      now.getUTCMinutes()
    ).padStart(2, "0")} WIB`;

    const newRecord: CustomerAftersalesRecord = {
      id: `manual-${Date.now()}`,
      name: name.trim(),
      phone: sanitizePhone(phone),
      branch: bMeta.name,
      branchKey: (branchKey as any) || "PWT",
      city: bMeta.city,
      timestamp: iso,
      timestampFormatted: formatted,
      timestampDate: dateOnly,
      reportType: "Pemeriksaan",
      examDate: dateOnly,
      pickupDate: dateOnly,
      frameModel: frameModel?.trim() || "Frame Optik",
      lensType: lensType?.trim() || "Single Vision",
      totalTransaction: totalTransaction || 550000,
      prescription: prescription || {
        odSph: "-1.00",
        odCyl: "0.00",
        osSph: "-1.00",
        osCyl: "0.00",
        pd: "63",
      },
      status: status || "belum_dihubungi",
      notes: notes?.trim() || "Input pendaftaran customer baru",
      inquiryChannel: "walk_in",
      logs: [
        {
          id: `log-init-${Date.now()}`,
          date: dateOnly,
          type: "store_visit",
          actor: "RO Cabang",
          note: `Data pendaftaran pelanggan baru (${bMeta.name})`,
        },
      ],
    };

    if (cachedData) {
      cachedData.customers.unshift(newRecord);
    }

    return NextResponse.json({ success: true, data: newRecord });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
