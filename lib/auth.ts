// Authentication & Gatekeeper utilities for Sensitive Sections (Finance, Bonus, Reports)
import { cookies } from "next/headers";

export type SensitiveSection = "finance" | "reports";

// Default passwords (dapat dioverride via environment variables)
const DEFAULT_PASSWORDS: Record<SensitiveSection, string> = {
  finance: process.env.FINANCE_ACCESS_PASSWORD || "isyfinance2026",
  reports: process.env.REPORTS_ACCESS_PASSWORD || "isyreport2026",
};

export const SESSION_COOKIE_NAMES: Record<SensitiveSection, string> = {
  finance: "isy_finance_session",
  reports: "isy_reports_session",
};

// Simple SHA-256 hash using Web Crypto API (works in Node.js & Edge runtimes)
export async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str + "_salt_isy_marketing_2026");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Generate secure session token based on section & day
export async function generateSessionToken(section: SensitiveSection): Promise<string> {
  const targetPassword = DEFAULT_PASSWORDS[section];
  const payload = `${section}:${targetPassword}:granted:${new Date().toISOString().slice(0, 10)}`;
  return await hashString(payload);
}

// Verify input password
export async function verifyPassword(
  section: SensitiveSection,
  inputPassword: string
): Promise<boolean> {
  if (!inputPassword) return false;
  const expectedPassword = DEFAULT_PASSWORDS[section];
  return inputPassword.trim() === expectedPassword.trim();
}

// Verify session from cookies (Server Component / Route Handler helper)
export async function isSectionUnlocked(section: SensitiveSection): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const cookieName = SESSION_COOKIE_NAMES[section];
    const sessionCookie = cookieStore.get(cookieName)?.value;
    if (!sessionCookie) return false;

    const expectedToken = await generateSessionToken(section);
    return sessionCookie === expectedToken;
  } catch {
    return false;
  }
}
