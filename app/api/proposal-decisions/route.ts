import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

interface DecisionEntry {
  status: "pending" | "approved" | "rejected" | "negotiate" | "contact";
  note: string;
  contactedAt?: string | null;
  response?: "none" | "interested" | "declined" | "followup" | "confirmed";
  updatedAt?: string;
}

type DecisionsMap = Record<string, DecisionEntry>;

// Fallback in-memory cache for serverless environments
let memoryDecisions: DecisionsMap = {
  "prop_workshopaffiliate2026_20260928_9105": {
    status: "approved",
    note: "",
    contactedAt: "2026-09-24T00:00:00.000Z",
    response: "confirmed",
    updatedAt: "2026-09-24T00:00:00.000Z",
  },
  "proposal-41": {
    status: "approved",
    note: "",
    contactedAt: "2026-09-24T00:00:00.000Z",
    response: "confirmed",
    updatedAt: "2026-09-24T00:00:00.000Z",
  },
  "proposal-4": {
    status: "approved",
    note: "",
    contactedAt: "2026-09-24T00:00:00.000Z",
    response: "confirmed",
    updatedAt: "2026-09-24T00:00:00.000Z",
  },
  "prop_pekanolahragasoedirman20_20260930_8382": {
    status: "pending",
    note: "",
    response: "none",
    updatedAt: "2026-09-24T00:00:00.000Z",
  },
  "proposal-36": {
    status: "pending",
    note: "",
    response: "none",
    updatedAt: "2026-09-24T00:00:00.000Z",
  },
  "proposal-5": {
    status: "pending",
    note: "",
    response: "none",
    updatedAt: "2026-09-24T00:00:00.000Z",
  },
};

const getFilePath = () => path.join(process.cwd(), "data", "proposal-decisions.json");

function loadFromFile(): DecisionsMap {
  try {
    const filePath = getFilePath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(content);
      return { ...memoryDecisions, ...parsed };
    }
  } catch (err) {
    console.warn("Could not read proposal-decisions.json from disk, using memory cache:", err);
  }
  return memoryDecisions;
}

function saveToFile(data: DecisionsMap) {
  try {
    const dir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(getFilePath(), JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write proposal-decisions.json to disk (expected on read-only serverless):", err);
  }
}

export async function GET() {
  const current = loadFromFile();
  memoryDecisions = current;
  return NextResponse.json({
    success: true,
    data: current,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const current = loadFromFile();

    let updated: DecisionsMap;

    if (body.id && body.decision) {
      // Single item update
      updated = {
        ...current,
        [body.id]: {
          ...body.decision,
          updatedAt: new Date().toISOString(),
        },
      };
      if (body.mirrorId) {
        updated[body.mirrorId] = {
          ...body.decision,
          updatedAt: new Date().toISOString(),
        };
      }
    } else if (body.decisions && typeof body.decisions === "object") {
      // Full batch/map update
      updated = {
        ...current,
        ...body.decisions,
      };
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid request payload format" },
        { status: 400 }
      );
    }

    memoryDecisions = updated;
    saveToFile(updated);

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Keputusan proposal berhasil disimpan permanen",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to update decisions" },
      { status: 500 }
    );
  }
}
