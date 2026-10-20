import React from "react";
import { Metadata } from "next";
import sheetsData from "@/lib/real-sheets-data.json";
import {
  MerchantProposalDocument,
} from "@/features/pengajuan/components/MerchantProposalDocument";
import { ProposalFollowerRow } from "@/features/pengajuan/components/SponsorProposalDocument";

export const metadata: Metadata = {
  title: "Proposal Kemitraan Merchant B2B | Optik I See You",
  description:
    "Proposal resmi penawaran kemitraan strategis B2B barter voucher, cross-display kasir, dan promosi digital Optik I See You.",
};

const ACCOUNTS: { key: string; account: string; label: string }[] = [
  { key: "PWT", account: "@iseeyou.glasses", label: "Purwokerto (Pusat)" },
  { key: "PBG", account: "@iseeyou.purbalingga", label: "Purbalingga" },
  { key: "CLP", account: "@iseeyou.cilacap", label: "Cilacap" },
  { key: "WNS", account: "@iseeyou.wonosobo", label: "Wonosobo" },
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
    };
  });
}

export default function ProposalMerchantPage() {
  const followers = buildFollowerRows();
  const sourceUrl = (sheetsData as any).sourceUrl || "";
  return <MerchantProposalDocument followers={followers} sourceUrl={sourceUrl} />;
}
