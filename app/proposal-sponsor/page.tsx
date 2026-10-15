import React from "react";
import { Metadata } from "next";
import sheetsData from "@/lib/real-sheets-data.json";
import {
  SponsorProposalDocument,
  ProposalFollowerRow,
} from "@/features/pengajuan/components/SponsorProposalDocument";

export const metadata: Metadata = {
  title: "Proposal Sponsorship & Kemitraan B2B · Creative Content Masterclass 2026 | Optik I See You",
  description:
    "Proposal resmi pengajuan sponsorship & kemitraan strategis B2B program Creative Content Masterclass 2026 oleh Optik I See You & Lunar Eyewear.",
};

const ACCOUNTS: { key: string; account: string; label: string; isSecondBrand?: boolean }[] = [
  { key: "PWT", account: "@iseeyou.glasses", label: "Purwokerto (Pusat)" },
  { key: "PBG", account: "@iseeyou.purbalingga", label: "Purbalingga" },
  { key: "CLP", account: "@iseeyou.cilacap", label: "Cilacap" },
  { key: "WNS", account: "@iseeyou.wonosobo", label: "Wonosobo" },
  { key: "TGL", account: "@lunareyewear.co", label: "Lunar Eyewear Tegal", isSecondBrand: true },
];

function buildFollowerRows(): ProposalFollowerRow[] {
  const tracker = ((sheetsData as any).dailyFollowersTracker || {}) as Record<
    string,
    { date: string; igFollowers: number; tiktokFollowers: number }[]
  >;

  return ACCOUNTS.map((a) => {
    const rows = tracker[a.key] || [];
    const last = rows.length ? rows[rows.length - 1] : null;
    return {
      account: a.account,
      label: a.label,
      igFollowers: last?.igFollowers || 0,
      tiktokFollowers: last?.tiktokFollowers || 0,
      asOf: last?.date || null,
      isSecondBrand: a.isSecondBrand,
    };
  });
}

export default function ProposalSponsorPage() {
  const followers = buildFollowerRows();
  const sourceUrl = (sheetsData as any).sourceUrl || "";
  return <SponsorProposalDocument followers={followers} sourceUrl={sourceUrl} />;
}
