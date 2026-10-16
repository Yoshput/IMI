export type CanonicalBranchId =
  | "all"
  | "purwokerto"
  | "purbalingga"
  | "cilacap"
  | "wonosobo"
  | "lunar_tegal";

export function normalizeBranchId(raw?: string | null): CanonicalBranchId {
  if (!raw) return "all";
  const s = raw.toLowerCase().trim();
  if (s.includes("semua") || s === "all") return "all";
  if (s.includes("purwokerto") || s.includes("pwt") || s.includes("iseeyou.glasses")) return "purwokerto";
  if (s.includes("purbalingga") || s.includes("pbg") || s.includes("iseeyou.purbalingga")) return "purbalingga";
  if (s.includes("cilacap") || s.includes("clp") || s.includes("iseeyou.cilacap")) return "cilacap";
  if (s.includes("wonosobo") || s.includes("wns") || s.includes("iseeyou.wonosobo")) return "wonosobo";
  if (s.includes("lunar") || s.includes("tegal") || s.includes("tgl") || s.includes("lunareyewear")) return "lunar_tegal";
  return "all";
}

export function matchesBranch(itemBranch?: string | null, selectedBranch?: string | null): boolean {
  const target = normalizeBranchId(selectedBranch);
  if (target === "all") return true;
  return normalizeBranchId(itemBranch) === target;
}

export interface CanonicalBranchMeta {
  id: CanonicalBranchId;
  label: string;
  name: string;
  city: string;
  code: string;
  handle: string;
  url: string;
  picName: string;
}

export const CANONICAL_BRANCHES: CanonicalBranchMeta[] = [
  {
    id: "all",
    label: "Semua Cabang (5)",
    name: "Seluruh Jaringan (5 Cabang)",
    city: "Semua Kota",
    code: "ALL",
    handle: "@iseeyou.glasses & Jaringan",
    url: "https://www.instagram.com/iseeyou.glasses/",
    picName: "6 PIC Cabang",
  },
  {
    id: "purwokerto",
    label: "Purwokerto Pusat",
    name: "Optik I See You Purwokerto (Pusat)",
    city: "Purwokerto",
    code: "PWT",
    handle: "@iseeyou.glasses",
    url: "https://www.instagram.com/iseeyou.glasses/",
    picName: "Ilya (Reels) & Nuha (Story)",
  },
  {
    id: "purbalingga",
    label: "Purbalingga",
    name: "Optik I See You Purbalingga",
    city: "Purbalingga",
    code: "PBG",
    handle: "@iseeyou.purbalingga",
    url: "https://www.instagram.com/iseeyou.purbalingga/",
    picName: "Ajun",
  },
  {
    id: "cilacap",
    label: "Cilacap",
    name: "Optik I See You Cilacap",
    city: "Cilacap",
    code: "CLP",
    handle: "@iseeyou.cilacap",
    url: "https://www.instagram.com/iseeyou.cilacap/",
    picName: "Arum",
  },
  {
    id: "wonosobo",
    label: "Wonosobo",
    name: "Optik I See You Wonosobo",
    city: "Wonosobo",
    code: "WNS",
    handle: "@iseeyou.wonosobo",
    url: "https://www.instagram.com/iseeyou.wonosobo/",
    picName: "Febi",
  },
  {
    id: "lunar_tegal",
    label: "Lunar Tegal",
    name: "Lunar Eyewear Tegal (Second Brand)",
    city: "Tegal",
    code: "TGL",
    handle: "@lunareyewear.co",
    url: "https://www.instagram.com/lunareyewear.co",
    picName: "Amanda",
  },
];

export interface BranchAccount {
  id: string;
  name: string;
  handle: string;
  url: string;
  city: string;
  picName: string;
  picRole: string;
  sheetKey: string;
  tag: "Pusat & Lab" | "Cabang" | "Second Brand";
}

export const OFFICIAL_BRANCH_ACCOUNTS: BranchAccount[] = [
  {
    id: "pwt",
    name: "Optik I See You Purwokerto (Pusat)",
    handle: "@iseeyou.glasses",
    url: "https://www.instagram.com/iseeyou.glasses/",
    city: "Purwokerto",
    picName: "Ilya (Reels) & Nuha (Story)",
    picRole: "Pusat & Distribusi Konten Utama",
    sheetKey: "Rekap PWT & Story",
    tag: "Pusat & Lab",
  },
  {
    id: "pbg",
    name: "Optik I See You Purbalingga",
    handle: "@iseeyou.purbalingga",
    url: "https://www.instagram.com/iseeyou.purbalingga/",
    city: "Purbalingga",
    picName: "Ajun",
    picRole: "PIC Reels Instagram & TikTok",
    sheetKey: "Rekap PBG",
    tag: "Cabang",
  },
  {
    id: "clp",
    name: "Optik I See You Cilacap",
    handle: "@iseeyou.cilacap",
    url: "https://www.instagram.com/iseeyou.cilacap/",
    city: "Cilacap",
    picName: "Arum",
    picRole: "PIC Reels Instagram & TikTok",
    sheetKey: "Rekap CLP",
    tag: "Cabang",
  },
  {
    id: "wns",
    name: "Optik I See You Wonosobo",
    handle: "@iseeyou.wonosobo",
    url: "https://www.instagram.com/iseeyou.wonosobo/",
    city: "Wonosobo",
    picName: "Febi",
    picRole: "PIC Reels Instagram & TikTok",
    sheetKey: "Rekap WNS",
    tag: "Cabang",
  },
  {
    id: "tgl",
    name: "Lunar Eyewear Tegal",
    handle: "@lunareyewear.co",
    url: "https://www.instagram.com/lunareyewear.co",
    city: "Tegal",
    picName: "Amanda",
    picRole: "PIC Reels Instagram & TikTok (Second Brand)",
    sheetKey: "Rekap TGL",
    tag: "Second Brand",
  },
];
