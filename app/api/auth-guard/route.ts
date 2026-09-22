import { NextRequest, NextResponse } from "next/server";
import {
  SensitiveSection,
  verifyPassword,
  generateSessionToken,
  SESSION_COOKIE_NAMES,
  isSectionUnlocked,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET: Check unlock status for a section
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section") as SensitiveSection;

  if (!section || (section !== "finance" && section !== "reports")) {
    return NextResponse.json({ success: false, error: "Invalid section" }, { status: 400 });
  }

  const unlocked = await isSectionUnlocked(section);
  return NextResponse.json({ success: true, unlocked, section });
}

// POST: Verify password and set session cookie
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { section, password } = body as { section: SensitiveSection; password: string };

    if (!section || (section !== "finance" && section !== "reports")) {
      return NextResponse.json({ success: false, error: "Bagian tidak valid" }, { status: 400 });
    }

    const isValid = await verifyPassword(section, password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Password salah. Silakan coba lagi." },
        { status: 401 }
      );
    }

    const token = await generateSessionToken(section);
    const cookieName = SESSION_COOKIE_NAMES[section];

    const response = NextResponse.json({
      success: true,
      message: `Akses bagian ${section.toUpperCase()} berhasil dibuka!`,
      section,
    });

    // Set cookie: 8 hours expiry
    response.cookies.set({
      name: cookieName,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 8 * 60 * 60, // 8 hours
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE: Lock / logout from section
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section") as SensitiveSection;

  if (!section || (section !== "finance" && section !== "reports")) {
    return NextResponse.json({ success: false, error: "Invalid section" }, { status: 400 });
  }

  const cookieName = SESSION_COOKIE_NAMES[section];
  const response = NextResponse.json({
    success: true,
    message: `Bagian ${section.toUpperCase()} telah dikunci kembali.`,
  });

  response.cookies.set({
    name: cookieName,
    value: "",
    path: "/",
    maxAge: 0,
  });

  return response;
}
