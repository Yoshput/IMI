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
    picName: "Mba Ilya (Reels) & Mba Nuha (Story)",
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
    picName: "Mba Ajun",
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
    picName: "Mba Arum",
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
    picName: "Mba Febi",
    picRole: "PIC Reels Instagram & TikTok",
    sheetKey: "Rekap WNS",
    tag: "Cabang",
  },
  {
    id: "lunar",
    name: "Lunar Eyewear Tegal",
    handle: "@lunareyewear.co",
    url: "https://www.instagram.com/lunareyewear.co",
    city: "Tegal",
    picName: "Mba Amanda",
    picRole: "PIC Reels Instagram & TikTok (Second Brand)",
    sheetKey: "Rekap TGL",
    tag: "Second Brand",
  },
];
