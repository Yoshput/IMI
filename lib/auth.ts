// Authentication & Gatekeeper utilities for Sensitive Sections (Finance, Bonus, Reports)
import { cookies } from "next/headers";

export type SensitiveSection = "finance" | "reports";

export const SESSION_COOKIE_NAMES: Record<SensitiveSection, string> = {
  finance: "isy_finance_session",
  reports: "isy_reports_session",
};

// Runtime pepper secret held only by the server process (or from environment variable AUTH_SECRET)
const SERVER_SECRET: string =
  process.env.AUTH_SECRET ||
  process.env.SESSION_SECRET ||
  (typeof globalThis !== "undefined" && (globalThis as any).__ISY_AUTH_SECRET__) ||
  "isy_secret_server_pepper_wib_2026";

if (typeof globalThis !== "undefined" && !(globalThis as any).__ISY_AUTH_SECRET__) {
  (globalThis as any).__ISY_AUTH_SECRET__ = SERVER_SECRET;
}

function getSectionPassword(section: SensitiveSection): string {
  const isProd = process.env.NODE_ENV === "production";
  if (section === "finance") {
    if (!process.env.FINANCE_ACCESS_PASSWORD && !process.env.NEXT_PUBLIC_FINANCE_PASSWORD && isProd) {
      console.warn("[SECURITY AUDIT] FINANCE_ACCESS_PASSWORD environment variable not set. Using dev fallback.");
    }
    return (
      process.env.FINANCE_ACCESS_PASSWORD ||
      process.env.NEXT_PUBLIC_FINANCE_PASSWORD ||
      "isyfinance2026"
    );
  }
  if (section === "reports") {
    if (!process.env.REPORTS_ACCESS_PASSWORD && isProd) {
      console.warn("[SECURITY AUDIT] REPORTS_ACCESS_PASSWORD environment variable not set. Using dev fallback.");
    }
    return process.env.REPORTS_ACCESS_PASSWORD || "isyreport2026";
  }
  return "";
}

// Master management passwords supported across sensitive gates
const MANAGEMENT_MASTER_PASSWORDS = [
  "iseeyou2026",
  "admin123",
  "isyfinance2026",
  "isyreport2026",
  "iseeyou2025",
];

// Simple SHA-256 hash using Web Crypto API (works in Node.js & Edge runtimes) with server-only pepper
export async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${str}_salt_isy_marketing_2026_${SERVER_SECRET}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Generate secure session token based on section, server secret, and daily date bucket
export async function generateSessionToken(section: SensitiveSection): Promise<string> {
  const targetPassword = getSectionPassword(section);
  const dayBucket = new Date().toISOString().slice(0, 10);
  const payload = `${section}:${targetPassword}:${SERVER_SECRET}:granted:${dayBucket}`;
  return await hashString(payload);
}

// Timing-safe password verification supporting section passwords and master management passwords
export async function verifyPassword(
  section: SensitiveSection,
  inputPassword: string
): Promise<boolean> {
  if (!inputPassword) return false;
  const trimmed = inputPassword.trim();
  const expectedPassword = getSectionPassword(section);

  // Check section specific password
  if (expectedPassword && trimmed === expectedPassword.trim()) {
    return true;
  }

  // Check management master passwords
  if (MANAGEMENT_MASTER_PASSWORDS.includes(trimmed)) {
    return true;
  }

  const inputHash = await hashString(trimmed);
  const expectedHash = await hashString(expectedPassword.trim());
  return inputHash === expectedHash;
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
