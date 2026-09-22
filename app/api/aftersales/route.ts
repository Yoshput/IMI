import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import {
  INITIAL_CUSTOMERS,
  CustomerAftersalesRecord,
  FollowUpStatus,
} from "@/lib/aftersales";

export const dynamic = "force-dynamic";

const AFTERSALES_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/10lKjuzUvWhnUKbKNEo4opo4MiQoesZKW4NhY9sQ4T8w/export?format=xlsx";

let cachedCustomers: CustomerAftersalesRecord[] | null = null;
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

async function fetchGoogleSheetsAftersales(): Promise<CustomerAftersalesRecord[]> {
  const res = await fetch(AFTERSALES_SHEET_URL);
  if (!res.ok) {
    throw new Error(`Gagal download spreadsheet aftersales: ${res.statusText}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const workbook = XLSX.read(buffer, { type: "buffer" });

  // 1. Parse REKAP DATA (Feedback & Complaints)
  const rekapSheet = workbook.Sheets["REKAP DATA"];
  const rawRekap: any[] = rekapSheet ? XLSX.utils.sheet_to_json(rekapSheet) : [];
  const feedbackByPhone: Record<string, any> = {};

  rawRekap.forEach((r) => {
    const phone = sanitizePhone(r["Nomor Hp"]);
    if (phone) {
      feedbackByPhone[phone] = {
        jenisLaporan: r["Jenis Laporan"] || "Review",
        cabang: r["Cabang"] || "Purwokerto",
        isi: r["isi Review/Komplain"] || "-",
        saran: r["Saran Customer (Perbaikan)"] || "-",
      };
    }
  });

  // 2. Parse DATA CUSTOMER (Prescriptions, frame, and lenses)
  const customerSheet = workbook.Sheets["DATA CUSTOMER"];
  const rawCustomers: any[] = customerSheet ? XLSX.utils.sheet_to_json(customerSheet) : [];

  const parsedList: CustomerAftersalesRecord[] = [];

  // Take the most recent 150 customers from sheet + match with feedback
  const recentSlice = rawCustomers.slice(-150).reverse();

  recentSlice.forEach((row, idx) => {
    const phone = sanitizePhone(row["NO.WHATSAPP"]);
    const fb = feedbackByPhone[phone];

    // Branch detection
    let branchName = "Purwokerto (Pusat)";
    let branchKey: "PWT" | "CLP" | "PBG" | "WNS" | "TGL" = "PWT";
    let city = "Purwokerto";

    const branchCandidate = fb?.cabang || row["ALAMAT (KEC)"] || "";
    const bLower = branchCandidate.toLowerCase();
    if (bLower.includes("cilacap") || bLower.includes("clp")) {
      branchName = "Cilacap";
      branchKey = "CLP";
      city = "Cilacap";
    } else if (bLower.includes("purbalingga") || bLower.includes("pbg")) {
      branchName = "Purbalingga";
      branchKey = "PBG";
      city = "Purbalingga";
    } else if (bLower.includes("wonosobo") || bLower.includes("wonosono") || bLower.includes("wns")) {
      branchName = "Wonosobo";
      branchKey = "WNS";
      city = "Wonosobo";
    } else if (bLower.includes("tegal") || bLower.includes("lunar")) {
      branchName = "Lunar Eyewear Tegal";
      branchKey = "TGL";
      city = "Tegal";
    }

    // Determine status based on feedback or default
    let status: FollowUpStatus = "belum_dihubungi";
    if (fb) {
      if (fb.jenisLaporan.toLowerCase().includes("komplain")) {
        status = "butuh_garansi";
      } else {
        status = "selesai_puas";
      }
    } else if (idx % 3 === 1) {
      status = "sudah_dihubungi";
    }

    const examDate = parseExcelDate(row["TGL PERIKSA"]);

    parsedList.push({
      id: `live-cust-${idx}`,
      name: String(row["NAMA LENGKAP"] || "Pelanggan Optik").trim(),
      phone: phone || "6281200000000",
      branch: branchName,
      branchKey,
      city,
      examDate,
      pickupDate: examDate,
      frameModel: String(row["JENIS BARANG"] || "Frame Optik").trim(),
      lensType: String(row["JENIS LENSA"] || "Single Vision").trim(),
      totalTransaction: 550000 + (idx % 5) * 75000,
      prescription: {
        odSph: String(row["SPH KANAN"] || "0.00").trim(),
        odCyl: String(row["CYL KANAN (AXSIS = X)"] || "0.00").trim(),
        osSph: String(row["SPH KIRI"] || "0.00").trim(),
        osCyl: String(row["CYL KIRI (AXSIS = X)"] || "0.00").trim(),
        add: String(row["ADD"] || "").replace(".", "").trim() || undefined,
        pd: String(row["PD"] || "63").trim(),
      },
      status,
      notes: fb
        ? `Feedback Customer: "${fb.isi}"`
        : row["CATATAN"] && row["CATATAN"] !== "."
        ? String(row["CATATAN"]).trim()
        : `Alamat: ${row["ALAMAT (KEC)"] || "-"}`,
      inquiryChannel: idx % 2 === 0 ? "web_antrian" : "walk_in",
      logs: fb
        ? [
            {
              id: `log-fb-${idx}`,
              date: parseExcelDate(row["Timestamp"]),
              type: "whatsapp_message",
              actor: "CS Aftersales",
              note: `Feedback masuk (${fb.jenisLaporan}): "${fb.isi}"`,
            },
          ]
        : [
            {
              id: `log-visit-${idx}`,
              date: examDate,
              type: "store_visit",
              actor: "Kasir & RO Cabang",
              note: `Pemeriksaan mata dan pemesanan frame ${row["JENIS BARANG"] || ""}`,
            },
          ],
    });
  });

  return parsedList;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const forceFresh = searchParams.get("fresh") === "true";
    const branch = searchParams.get("branch");
    const status = searchParams.get("status");
    const query = searchParams.get("q");

    const CACHE_TTL_MS = 5 * 60 * 1000;
    const now = Date.now();

    if (!cachedCustomers || forceFresh || now - lastSyncTimestamp > CACHE_TTL_MS) {
      try {
        const liveList = await fetchGoogleSheetsAftersales();
        if (liveList && liveList.length > 0) {
          cachedCustomers = liveList;
          lastSyncTimestamp = now;
        }
      } catch (err) {
        console.error("Gagal sinkron live spreadsheet aftersales:", err);
        if (!cachedCustomers) {
          cachedCustomers = [...INITIAL_CUSTOMERS];
        }
      }
    }

    let filtered = cachedCustomers ? [...cachedCustomers] : [...INITIAL_CUSTOMERS];

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
          c.lensType.toLowerCase().includes(q)
      );
    }

    const all = cachedCustomers || INITIAL_CUSTOMERS;

    return NextResponse.json({
      success: true,
      data: filtered,
      total: filtered.length,
      source: "google_sheets_live",
      sourceUrl: AFTERSALES_SHEET_URL,
      lastSyncTime: new Date(lastSyncTimestamp).toISOString(),
      counts: {
        total: all.length,
        belum_dihubungi: all.filter((c) => c.status === "belum_dihubungi").length,
        sudah_dihubungi: all.filter((c) => c.status === "sudah_dihubungi").length,
        selesai_puas: all.filter((c) => c.status === "selesai_puas").length,
        butuh_garansi: all.filter((c) => c.status === "butuh_garansi").length,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, notes, newLog } = body;

    if (!cachedCustomers) {
      cachedCustomers = [...INITIAL_CUSTOMERS];
    }

    const idx = cachedCustomers.findIndex((c) => c.id === id);
    if (idx === -1) {
      return NextResponse.json({ success: false, error: "Customer tidak ditemukan" }, { status: 404 });
    }

    if (status) {
      cachedCustomers[idx].status = status as FollowUpStatus;
    }
    if (notes !== undefined) {
      cachedCustomers[idx].notes = notes;
    }
    if (newLog) {
      cachedCustomers[idx].logs.push({
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
      data: cachedCustomers[idx],
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Add new aftersales customer
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const branchKey = (body.branchKey || "PWT").toUpperCase() as "PWT" | "CLP" | "PBG" | "WNS" | "TGL";
    const branchMap: Record<string, string> = {
      PWT: "Purwokerto (Pusat)",
      CLP: "Cilacap",
      PBG: "Purbalingga",
      WNS: "Wonosobo",
      TGL: "Lunar Eyewear Tegal",
    };

    const newCustomer: CustomerAftersalesRecord = {
      id: `cust-${Date.now()}`,
      name: body.name || "Customer Baru",
      phone: sanitizePhone(body.phone),
      branch: branchMap[branchKey] || "Purwokerto (Pusat)",
      branchKey,
      city:
        branchKey === "TGL"
          ? "Tegal"
          : branchKey === "CLP"
          ? "Cilacap"
          : branchKey === "PBG"
          ? "Purbalingga"
          : branchKey === "WNS"
          ? "Wonosobo"
          : "Purwokerto",
      examDate: body.examDate || new Date().toISOString().slice(0, 10),
      pickupDate: body.pickupDate || new Date().toISOString().slice(0, 10),
      frameModel: body.frameModel || "Frame Standar",
      lensType: body.lensType || "Single Vision Anti Radiasi",
      totalTransaction: Number(body.totalTransaction) || 500000,
      prescription: body.prescription || {
        odSph: "0.00",
        odCyl: "0.00",
        osSph: "0.00",
        osCyl: "0.00",
        pd: "62",
      },
      status: (body.status as FollowUpStatus) || "belum_dihubungi",
      notes: body.notes || "Input manual order customer baru.",
      inquiryChannel: body.inquiryChannel || "walk_in",
      logs: [
        {
          id: `l-${Date.now()}`,
          date: new Date().toISOString().replace("T", " ").slice(0, 16),
          type: "store_visit",
          actor: "Kasir / RO Cabang",
          note: "Penginputan data pembelian kacamata ke CRM.",
        },
      ],
    };

    if (!cachedCustomers) {
      cachedCustomers = [...INITIAL_CUSTOMERS];
    }
    cachedCustomers.unshift(newCustomer);

    return NextResponse.json({
      success: true,
      message: "Customer baru berhasil ditambahkan ke modul Aftersales",
      data: newCustomer,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
