"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export interface ProposalFollowerRow {
  account: string;
  label: string;
  igFollowers: number;
  tiktokFollowers: number;
  asOf: string | null;
  isSecondBrand?: boolean;
}

interface Props {
  followers: ProposalFollowerRow[];
  sourceUrl: string;
}

export interface SpeakerItem {
  name: string;
  role: string;
  topic: string;
  highlight: string;
}

export interface RundownItem {
  time: string;
  activity: string;
  picOrSpeaker: string;
  notes: string;
}

export interface BudgetItem {
  item: string;
  qty: string;
  unitCost: string;
  totalCost: string;
}

export interface RevenueItem {
  source: string;
  description: string;
  projection: string;
}

export interface PackageTier {
  id: string;
  name: string;
  tagline: string;
  price: string;
  benefits: string[];
}

export interface ProposalData {
  docNo: string;
  docAttachment: string;
  docSubject: string;
  letterCity: string;
  letterDate: string;
  recipientTitle: string;
  recipientCompany: string;
  recipientCity: string;
  letterIntro: string;
  letterClosing: string;
  eventName: string;
  eventSubtitle: string;
  eventTheme: string;
  eventOrganizer: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  eventParticipants: string;
  eventFormat: string;
  backgroundText1: string;
  backgroundText2: string;
  backgroundText3: string;
  speakers: SpeakerItem[];
  rundown: RundownItem[];
  budgetExpenses: BudgetItem[];
  revenueProjections: RevenueItem[];
  picName: string;
  picRole: string;
  picWa: string;
  picEmail: string;
  headName: string;
  headRole: string;
  bankName: string;
  bankAccountNo: string;
  bankAccountName: string;
  packages: PackageTier[];
}

const STORAGE_KEY = "isy_proposal_sponsor_formal_v6";
const LEGACY_STORAGE_KEY = "isy_proposal_sponsor_formal_v5";

const DEFAULT_DATA: ProposalData = {
  docNo: "024/MKT-ISY/PROP-SPONSOR/X/2026",
  docAttachment: "1 (Satu) Berkas Proposal Kerjasama",
  docSubject:
    "Permohonan Kerjasama Sponsorship & Kolaborasi Mitra 'Fun Workshop: Unlock Your Influence'",
  letterCity: "Purwokerto",
  letterDate: "27 Oktober 2026",
  recipientTitle: "Pimpinan / Brand & Marketing Manager",
  recipientCompany: "[Nama Perusahaan / Brand Mitra]",
  recipientCity: "di Tempat",
  letterIntro:
    "Sehubungan dengan rencana pelaksanaan program workshop kreatif dan sinergi branding bertajuk 'Fun Workshop: Unlock Your Influence — Buka Kelas Konten & Digital Brand Collaboration', kami dari Divisi Marketing & Strategic Partnership Optik I See You bermaksud mengajukan penawaran kerjasama sponsorship serta sinergi kemitraan Business-to-Business (B2B) kepada instansi / brand yang Bapak/Ibu pimpin.",
  letterClosing:
    "Demikian surat penawaran kerjasama sponsorship ini kami sampaikan. Besar harapan kami agar terjalin kolaborasi B2B yang saling menguntungkan (win-win synergy) dan berdampak nyata bagi pertumbuhan kedua belah pihak. Atas perhatian dan kesempatan yang diberikan, kami ucapkan terima kasih.",
  eventName: "FUN WORKSHOP: UNLOCK YOUR INFLUENCE",
  eventSubtitle: "Buka Kelas Konten & Digital Brand Collaboration",
  eventTheme:
    "Personal Branding in This Economy: How to Branding Brand by ISY (Story, Feed, Reels) & Personal Branding di Era Digital",
  eventOrganizer: "Divisi Marketing & Strategic Partnership, Optik I See You",
  eventDate: "Sabtu, 14 November 2026",
  eventTime: "08.00 – 13.00 WIB",
  eventVenue: "Gedung FISIP UNSOED / Balai Soetdja / Gedung Hetero Space Purwokerto",
  eventParticipants:
    "50 – 80 Peserta Terpilih (Kreator konten, pegiat media sosial, mahasiswa, UMKM, dan perwakilan tim kreatif brand)",
  eventFormat:
    "Workshop edukasi interaktif, bedah formula visual ritel, live demo produk brand sponsor, showcase booth & B2B networking",
  backgroundText1:
    "Di tengah dinamika lanskap digital dan kondisi ekonomi saat ini, kemampuan membangun personal branding dan citra merek (brand identity) yang relevan, otentik, dan berdampak merupakan kunci utama bagi kreator maupun pelaku bisnis untuk tetap tumbuh dan bersaing.",
  backgroundText2:
    "Optik I See You menginisiasi 'Fun Workshop: Unlock Your Influence' sebagai ruang kolaboratif yang mempertemukan talenta kreator lokal dengan brand-brand unggulan di wilayah Banyumas Raya dan sekitarnya. Acara ini bukan sekadar seminar satu arah, melainkan kelas praktik langsung pembuatan konten (Story, Feed, Reels) yang membedah bagaimana Optik I See You membangun citra brand hingga memiliki lebih dari 1.000.000 basis pelanggan ritel.",
  backgroundText3:
    "Bagi mitra sponsor, kegiatan ini memberikan eksposur multi-dimensi: live demo produk dan interaksi langsung dengan audiens potensial di panggung workshop, aktivasi sampling di lokasi, penayangan materi video/iklan di layar TV Showroom Purwokerto selama periode kemitraan, penempatan media promosi di meja kasir 4 gerai ritel (Purwokerto, Purbalingga, Cilacap, Wonosobo), serta publikasi digital melalui kanal resmi @iseeyou.glasses (244.000+ followers).",
  speakers: [
    {
      name: "Ilya / Ilyaken (@ilyaken)",
      role: "Creative & Brand Content Lead, Optik I See You",
      topic: "How to Branding Brand by ISY (Story, Feed, Reels)",
      highlight:
        "Menceritakan pengalaman nyata sebagai crew ISY dalam membranding Optik I See You: menyusun formula visual estetis ritel, rahasia storytelling komersial yang engage, hingga mengonversi interaksi konten media sosial menjadi 1.000.000+ transaksi pelanggan.",
    },
    {
      name: "Bekti N",
      role: "Digital Content Creator & Influencer Strategist",
      topic: "Personal Branding in This Economy: Unlock Your Influence",
      highlight:
        "Strategi membangun persona digital yang kredibel dan bernilai komersial tinggi, taktik monetisasi audiens di tengah pergeseran ekonomi digital, serta kiat menarik kolaborasi brand papan atas.",
    },
    {
      name: "Syahrul",
      role: "Digital Marketer & Co-Speaker",
      topic: "Personal Branding di Era Digital & Content Ecosystem",
      highlight:
        "Optimalisasi algoritma multi-platform (Instagram, TikTok), ekosistem distribusi konten video vertikal, dan sinergi mutualisme antara kreator independen dan industri ritel modern.",
    },
    {
      name: "Nuha & Yos",
      role: "Master of Ceremony (MC & Interactive Lead)",
      topic: "Moderator Workshop, Live Product Demo & Games",
      highlight:
        "Memandu interaktivitas workshop, memfasilitasi live try-on & unboxing produk mitra sponsor, serta mengawal penyerahan doorprize kolaboratif.",
    },
  ],
  rundown: [
    {
      time: "08.00 – 08.30 WIB",
      activity: "Registrasi Peserta & Check-In Mandiri",
      picOrSpeaker: "PIC: Nuha & Tim Registrasi",
      notes: "Pemeriksaan tiket, pembagian Official Workshop Starter Kit & Goodie Bag sponsor",
    },
    {
      time: "08.30 – 09.00 WIB",
      activity: "Booth Exploration & Interactive Showcase",
      picOrSpeaker: "Tim Panitia & Mitra Sponsor",
      notes: "Peserta bebas berinteraksi di stand sponsor, mencoba produk, & networking santai",
    },
    {
      time: "09.00 – 09.10 WIB",
      activity: "Pembukaan Acara, Sambutan & Ice Breaking",
      picOrSpeaker: "MC: Nuha & Yos",
      notes: "Opening speech, perkenalan jajaran narasumber & pemanasan mini games interaktif",
    },
    {
      time: "09.10 – 10.30 WIB",
      activity: "Acara Inti 1: 'How to Branding Brand by ISY' + Q&A",
      picOrSpeaker: "Narasumber: Ilya (@ilyaken)",
      notes: "Bedah formula konten ritel ISY (Story, Feed, Reels), tips visual & sharing crew ISY",
    },
    {
      time: "10.30 – 11.00 WIB",
      activity: "Sesi Eksklusif: Live Demo Produk Brand Sponsor & Sampling",
      picOrSpeaker: "MC + Perwakilan Brand Sponsor",
      notes: "Live demo produk sponsor di panggung, sesi unboxing, try-on & sampling ke peserta",
    },
    {
      time: "11.00 – 12.30 WIB",
      activity: "Acara Inti 2: 'Unlock Your Influence: Personal Branding' + Q&A",
      picOrSpeaker: "Narasumber: Bekti N & Syahrul",
      notes: "Membangun personal branding di era digital, monetisasi pengaruh & kolaborasi brand",
    },
    {
      time: "12.30 – 13.00 WIB",
      activity: "Interactive Games, Doorprize Sponsor & Foto Bersama",
      picOrSpeaker: "MC: Nuha & Yos",
      notes: "Penyerahan plakat apresiasi, pembagian hadiah/voucher sponsor & dokumentasi",
    },
  ],
  budgetExpenses: [
    {
      item: "Sewa Tempat / Ruangan Acara",
      qty: "1 Paket",
      unitCost: "Rp 2.000.000,-",
      totalCost: "Rp 2.000.000,-",
    },
    {
      item: "Konsumsi Peserta & Panitia (Snack Box + Lunch Box 110 Pax)",
      qty: "110 Pax",
      unitCost: "Rp 15.500,- (avg)",
      totalCost: "Rp 1.700.000,-",
    },
    {
      item: "Cetak Backdrop Panggung & Banner Utama (5x5 m)",
      qty: "1 Paket",
      unitCost: "Rp 200.000,-",
      totalCost: "Rp 200.000,-",
    },
    {
      item: "Merchandise & Starter Kit Peserta (Tote Bag, Notebook, ID Card)",
      qty: "100 Paket",
      unitCost: "Rp 15.000,-",
      totalCost: "Rp 1.500.000,-",
    },
    {
      item: "Cetak Brosur, Booklet Workshop & Voucher Cetak",
      qty: "1 Paket",
      unitCost: "Rp 100.000,-",
      totalCost: "Rp 100.000,-",
    },
    {
      item: "Hadiah Games, Kuis Interaktif & Doorprize",
      qty: "1 Paket",
      unitCost: "Rp 600.000,-",
      totalCost: "Rp 600.000,-",
    },
    {
      item: "Honorarium Bintang Tamu (Bekti N)",
      qty: "1 Orang",
      unitCost: "Rp 1.000.000,-",
      totalCost: "Rp 1.000.000,-",
    },
    {
      item: "Honorarium & Akomodasi KOL Partner",
      qty: "1 Paket",
      unitCost: "Rp 500.000,-",
      totalCost: "Rp 500.000,-",
    },
    {
      item: "Dana Taktis & Cadangan Operasional Panitia",
      qty: "1 Paket",
      unitCost: "Rp 500.000,-",
      totalCost: "Rp 500.000,-",
    },
  ],
  revenueProjections: [
    {
      source: "Registrasi Tiket Peserta (50 – 80 Peserta)",
      description: "Tiket reguler workshop @ Rp 30.000 (atau opsi bundling Florasea @ Rp 65.000)",
      projection: "Rp 1.500.000 – Rp 2.400.000",
    },
    {
      source: "Biaya Registrasi Booth Sponsor On-Site",
      description: "4 Stand / Booth showcase komersial di venue acara @ Rp 300.000",
      projection: "Rp 1.200.000,-",
    },
    {
      source: "Target Sponsorship & Barter Sinergi Mitra",
      description: "Paket Platinum, Gold, Bronze, serta In-Kind / In-Keep barter ekuivalen",
      projection: "Rp 3.900.000 – Rp 4.500.000",
    },
  ],
  picName: "Yossika Putra",
  picRole: "Staff Kemitraan & Sponsorship Marketing",
  picWa: "0877-7868-3766",
  picEmail: "",
  headName: "Raja Satria",
  headRole: "Head of Marketing & Strategic Communication",
  bankName: "Bank Central Asia (BCA) KCU Purwokerto",
  bankAccountNo: "046-189-2231",
  bankAccountName: "Optik I See You",
  packages: [
    {
      id: "platinum",
      name: "PAKET PLATINUM (SPONSOR UTAMA)",
      tagline: "Eksklusivitas On-Site, Panggung Utama & Jaringan Ritel 4 Cabang",
      price: "Rp 5.000.000,-",
      benefits: [
        "Hak membuka 1 (satu) booth / stand promosi interaktif eksklusif di lokasi acara (Area Utama / Foyer).",
        "Sesi presentasi & demo produk brand di panggung utama selama 15 menit.",
        "Penayangan video profil / iklan komersial di layar TV Showroom Purwokerto selama 1 (satu) bulan penuh.",
        "Display materi promosi (flyer / voucher) di meja kasir seluruh lokasi 4 cabang (Purwokerto, Purbalingga, Cilacap, Wonosobo).",
        "Pencantuman logo ukuran BESAR pada backdrop panggung, x-banner, flyer cetak, sertifikat, dan frame photobooth.",
        "Penyertaan produk sampling / voucher resmi di dalam goodie bag seluruh peserta dan narasumber.",
        "Penyebutan (ad-lips) nama brand oleh Master of Ceremony (MC) sebanyak 10 kali selama acara.",
        "1 (satu) kali penayangan video Reels/Feed dedicated di akun Instagram resmi @iseeyou.glasses (244.000+ followers).",
      ],
    },
    {
      id: "gold",
      name: "PAKET GOLD (SPONSOR MADYA)",
      tagline: "Visibilitas Panggung, Ritel Display & Kampanye Digital",
      price: "Rp 3.000.000,-",
      benefits: [
        "Sesi presentasi & demo produk brand di panggung utama selama 10 menit.",
        "Penayangan video profil / iklan di layar TV Showroom Purwokerto selama 2 (dua) minggu.",
        "Display materi promosi (flyer/voucher) di meja kasir seluruh 4 lokasi cabang Optik I See You.",
        "Pencantuman logo ukuran SEDANG pada backdrop panggung, banner kegiatan, dan materi publikasi digital.",
        "Hak menyertakan voucher belanja / sample produk dalam goodie bag seluruh peserta.",
        "Penyebutan (ad-lips) nama brand oleh MC sebanyak 5 kali selama workshop berlangsung.",
        "Joint feed post kolaborasi di media sosial resmi Optik I See You.",
      ],
    },
    {
      id: "bronze",
      name: "PAKET BRONZE (SPONSOR PENDAMPING)",
      tagline: "Eksposur Acara, Sesi Demo Produk & Display Gerai",
      price: "Rp 1.500.000,-",
      benefits: [
        "Sesi Demo Produk dari brand sponsor (5–7 menit) pada slot khusus demo produk panggung & live trial peserta.",
        "Hak membuka mini showcase / stand display sample produk di area interactive showcase venue.",
        "Display poster & brosur materi promosi di meja kasir 4 lokasi cabang Optik I See You.",
        "Pencantuman logo ukuran STANDAR pada backdrop panggung utama dan e-flyer resmi kegiatan.",
        "Hak menyertakan flyer / voucher promosi resmi ke dalam goodie bag peserta workshop.",
        "Mention dan tag apresiasi sponsorship di Instagram Story resmi Optik I See You (@iseeyou.glasses).",
      ],
    },
    {
      id: "in_kind",
      name: "PAKET IN-KIND / IN-KEEP & CUSTOM COLLABORATION",
      tagline: "Sinergi Fleksibel, Barter Fasilitas, Demo Produk & Custom Kemitraan",
      price: "Barter Ekuivalen / Custom Offer",
      benefits: [
        "Sesi Demo Produk dari brand sponsor pada slot khusus demo produk (10.30 – 11.00 WIB) & tester showcase di lokasi.",
        "Opsi Penawaran Custom Mandiri: Mitra leluasa merumuskan skema kolaborasi sesuai kapabilitas brand (seperti penyediaan konsumsi, merchandise, tote bag, goodie bag kit, make-up & hair styling, atau fasilitas venue).",
        "Skema Tukar Voucher (Cross-Voucher): Penyertaan voucher diskon / treatment mitra ke dalam Official Goodie Bag peserta & penukaran voucher belanja kacamata Optik I See You untuk pelanggan setia mitra.",
        "Skema Tukar Display Meja Kasir (Cross-Brochure): Penempatan brosur, flyer, atau tent card promosi mitra di area kasir 4 lokasi cabang ritel Optik I See You.",
        "Display produk tester / sampling di area venue event serta publikasi apresiasi kemitraan di Instagram Story @iseeyou.glasses (244.000+ followers).",
      ],
    },
  ],
};

const fmt = (n: number) => n.toLocaleString("id-ID");

function sanitizeProposalData(d: ProposalData): ProposalData {
  const cleanStr = (s: string) =>
    (s || "")
      .replace(/OPTIK I SEE YOU & LUNAR EYEWEAR/gi, "OPTIK I SEE YOU")
      .replace(/Optik I See You & Lunar Eyewear/gi, "Optik I See You")
      .replace(/Optik I See You bersama Lunar Eyewear/gi, "Optik I See You")
      .replace(/,\s*serta didukung second brand Lunar Eyewear Tegal/gi, "")
      .replace(/serta didukung second brand Lunar Eyewear Tegal\.?/gi, "")
      .replace(/·\s*Lunar Eyewear Tegal/gi, "")
      .replace(/\s*& Lunar Eyewear/gi, "")
      .replace(/Lunar Eyewear Tegal/gi, "Optik I See You");

  return {
    ...d,
    docSubject: cleanStr(d.docSubject),
    letterIntro: cleanStr(d.letterIntro),
    letterClosing: cleanStr(d.letterClosing),
    eventName: cleanStr(d.eventName),
    eventSubtitle: cleanStr(d.eventSubtitle),
    eventTheme: cleanStr(d.eventTheme),
    eventOrganizer: cleanStr(d.eventOrganizer),
    eventVenue: cleanStr(d.eventVenue),
    eventParticipants: cleanStr(d.eventParticipants),
    eventFormat: cleanStr(d.eventFormat),
    backgroundText1: cleanStr(d.backgroundText1),
    backgroundText2: cleanStr(d.backgroundText2),
    backgroundText3: cleanStr(d.backgroundText3),
    speakers: (d.speakers && d.speakers.length > 0 ? d.speakers : DEFAULT_DATA.speakers).map((sp) => ({
      name: cleanStr(sp.name),
      role: cleanStr(sp.role),
      topic: cleanStr(sp.topic),
      highlight: cleanStr(sp.highlight),
    })),
    rundown: (d.rundown && d.rundown.length > 0 ? d.rundown : DEFAULT_DATA.rundown).map((rd) => ({
      time: cleanStr(rd.time),
      activity: cleanStr(rd.activity),
      picOrSpeaker: cleanStr(rd.picOrSpeaker),
      notes: cleanStr(rd.notes),
    })),
    budgetExpenses: (d.budgetExpenses && d.budgetExpenses.length > 0 ? d.budgetExpenses : DEFAULT_DATA.budgetExpenses).map(
      (bg) => ({
        item: cleanStr(bg.item),
        qty: cleanStr(bg.qty),
        unitCost: cleanStr(bg.unitCost),
        totalCost: cleanStr(bg.totalCost),
      })
    ),
    revenueProjections: (d.revenueProjections && d.revenueProjections.length > 0
      ? d.revenueProjections
      : DEFAULT_DATA.revenueProjections
    ).map((rv) => ({
      source: cleanStr(rv.source),
      description: cleanStr(rv.description),
      projection: cleanStr(rv.projection),
    })),
    packages: (d.packages && d.packages.length > 0 ? d.packages : DEFAULT_DATA.packages).map((p) => ({
      ...p,
      name: cleanStr(p.name),
      tagline: cleanStr(p.tagline),
      benefits: (p.benefits || []).map((b) => cleanStr(b)),
    })),
  };
}

function checkHasLunar(d: ProposalData): boolean {
  return /lunar/i.test(JSON.stringify(d));
}

export const SponsorProposalDocument: React.FC<Props> = ({ followers }) => {
  const [data, setData] = useState<ProposalData>(DEFAULT_DATA);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [fontFamily, setFontFamily] = useState<"times" | "georgia" | "garamond" | "arial">("times");
  const [lineSpacing, setLineSpacing] = useState<"1.2" | "1.35" | "1.5">("1.35");
  const [isSavedNotice, setIsSavedNotice] = useState<boolean>(false);

  // Load from local storage on mount with migration and sanitization
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const merged = { ...DEFAULT_DATA, ...parsed };
        const sanitized = sanitizeProposalData(merged);
        setData(sanitized);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
      } else {
        // First initialization of v6 schema
        setData(DEFAULT_DATA);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
      }
    } catch (e) {
      console.error("Gagal membaca storage proposal:", e);
      setData(DEFAULT_DATA);
    }
  }, []);

  // Save to local storage
  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 2500);
    } catch (e) {
      console.error("Gagal menyimpan ke storage:", e);
    }
  };

  const hasLunar = checkHasLunar(data);

  const handleReset = () => {
    if (confirm("Kembalikan seluruh isi proposal ke draf formal default Fun Workshop Optik I See You?")) {
      setData(DEFAULT_DATA);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 2500);
    }
  };

  const handlePrint = () => {
    if (hasLunar) {
      alert(
        "Peringatan: Proposal masih memuat nama atau atribusi 'Lunar'. Sesuai ketentuan, Optik I See You merupakan satu-satunya pihak penyelenggara proposal ini. Silakan bersihkan atribusi Lunar terlebih dahulu sebelum mencetak dokumen final."
      );
      return;
    }
    window.print();
  };

  const handleCleanLunar = () => {
    setData((prev) => sanitizeProposalData(prev));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizeProposalData(data)));
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 2500);
    } catch (e) {
      console.error("Gagal menyimpan ke storage:", e);
    }
  };

  const updateField = (field: keyof ProposalData, val: any) => {
    setData((prev) => ({ ...prev, [field]: val }));
  };

  const updateSpeaker = (idx: number, patch: Partial<SpeakerItem>) => {
    setData((prev) => {
      const copy = [...prev.speakers];
      copy[idx] = { ...copy[idx], ...patch };
      return { ...prev, speakers: copy };
    });
  };

  const updateRundown = (idx: number, patch: Partial<RundownItem>) => {
    setData((prev) => {
      const copy = [...prev.rundown];
      copy[idx] = { ...copy[idx], ...patch };
      return { ...prev, rundown: copy };
    });
  };

  const updateBudgetExpense = (idx: number, patch: Partial<BudgetItem>) => {
    setData((prev) => {
      const copy = [...prev.budgetExpenses];
      copy[idx] = { ...copy[idx], ...patch };
      return { ...prev, budgetExpenses: copy };
    });
  };

  const updateRevenueProjection = (idx: number, patch: Partial<RevenueItem>) => {
    setData((prev) => {
      const copy = [...prev.revenueProjections];
      copy[idx] = { ...copy[idx], ...patch };
      return { ...prev, revenueProjections: copy };
    });
  };

  const updatePackage = (idx: number, patch: Partial<PackageTier>) => {
    setData((prev) => {
      const copy = [...prev.packages];
      copy[idx] = { ...copy[idx], ...patch };
      return { ...prev, packages: copy };
    });
  };

  const updateBenefit = (pkgIdx: number, bIdx: number, val: string) => {
    setData((prev) => {
      const copy = [...prev.packages];
      const bCopy = [...copy[pkgIdx].benefits];
      bCopy[bIdx] = val;
      copy[pkgIdx] = { ...copy[pkgIdx], benefits: bCopy };
      return { ...prev, packages: copy };
    });
  };

  const addBenefit = (pkgIdx: number) => {
    setData((prev) => {
      const copy = [...prev.packages];
      copy[pkgIdx] = {
        ...copy[pkgIdx],
        benefits: [...copy[pkgIdx].benefits, "Fasilitas baru sponsor (klik untuk edit)"],
      };
      return { ...prev, packages: copy };
    });
  };

  const removeBenefit = (pkgIdx: number, bIdx: number) => {
    setData((prev) => {
      const copy = [...prev.packages];
      const bCopy = copy[pkgIdx].benefits.filter((_, i) => i !== bIdx);
      copy[pkgIdx] = { ...copy[pkgIdx], benefits: bCopy };
      return { ...prev, packages: copy };
    });
  };

  const totalIg = followers.reduce((s, r) => s + r.igFollowers, 0);
  const totalTt = followers.reduce((s, r) => s + r.tiktokFollowers, 0);
  const totalAll = totalIg + totalTt;

  const fontStyle =
    fontFamily === "times"
      ? { fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }
      : fontFamily === "georgia"
      ? { fontFamily: 'Georgia, "Palatino Linotype", serif' }
      : fontFamily === "garamond"
      ? { fontFamily: 'Garamond, "EB Garamond", serif' }
      : { fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif' };

  const lineHeightClass =
    lineSpacing === "1.2"
      ? "leading-[1.25]"
      : lineSpacing === "1.5"
      ? "leading-[1.65]"
      : "leading-[1.45]";

  // Editable Text Component
  const EditSpan: React.FC<{
    value: string;
    onChange: (val: string) => void;
    className?: string;
    placeholder?: string;
    tag?: "span" | "p" | "h1" | "h2" | "h3" | "div";
  }> = ({ value, onChange, className = "", placeholder = "", tag = "span" }) => {
    const ref = useRef<HTMLSpanElement>(null);

    const onBlur = () => {
      if (ref.current) {
        const text = ref.current.innerText.trim();
        onChange(text || placeholder);
      }
    };

    const TagName = tag as any;

    if (!isEditing) {
      return <TagName className={className}>{value || placeholder}</TagName>;
    }

    return (
      <TagName
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onBlur={onBlur}
        className={`${className} outline-none transition-colors border-b border-dashed border-gray-400 hover:border-black bg-amber-50/50 hover:bg-amber-100/60 px-0.5 rounded cursor-text focus:bg-white focus:ring-1 focus:ring-black focus:border-solid`}
        title="Klik untuk mengedit teks"
      >
        {value}
      </TagName>
    );
  };

  // Formal Kop Surat / Letterhead Component
  const FormalKopSurat = () => (
    <div className="border-b-[2.5px] border-black pb-3 mb-5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Official ISY Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/brand/logo-isy-dark.png"
            alt="Logo Optik I See You"
            className="h-10 w-auto object-contain"
          />
        </div>

        {/* Center: Official Entity Info */}
        <div className="text-center flex-1 px-2">
          <h2 className="text-[13pt] font-bold tracking-wider uppercase text-black">
            OPTIK I SEE YOU
          </h2>
          <p className="text-[8.5pt] text-gray-800 tracking-wide font-medium">
            Jaringan Ritel Kacamata &amp; Layanan Pemeriksaan Mata Terpadu
          </p>
          <p className="text-[7.5pt] text-gray-700 mt-0.5">
            Lokasi Cabang: Purwokerto · Purbalingga · Cilacap · Wonosobo
          </p>
          <p className="text-[7.5pt] text-gray-700">
            Website: www.optikiseeyou.com · Layanan Kemitraan: 0877-7868-3766
          </p>
        </div>

        {/* Right: Slogan "for every you" Logo */}
        <div className="flex items-center justify-end">
          <img
            src="/brand/logo-for-every-you.png"
            alt="for every you"
            className="h-6 sm:h-7 w-auto object-contain opacity-85"
          />
        </div>
      </div>
      {/* Formal Double Rule */}
      <div className="mt-2 border-t-[0.75px] border-black" />
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 py-6 px-2 sm:px-4 print:p-0 print:m-0 print:bg-white print:w-full print:min-h-0">
      {/* ======================================================== */}
      {/* FLOATING ACTION TOOLBAR (NO PRINT)                      */}
      {/* ======================================================== */}
      <div className="no-print max-w-[210mm] mx-auto mb-6 bg-white border border-neutral-300 rounded-xl p-4 shadow-md sticky top-4 z-50">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Tombol Kembali ke Portal Pengajuan */}
            <Link
              href="/pengajuan"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 transition-all shadow-2xs hover:border-neutral-400"
              title="Kembali ke Portal Pengajuan & Outreach CRM"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-neutral-700" />
              <span>Kembali</span>
            </Link>

            <div className="h-4 w-px bg-neutral-300 mx-0.5 hidden sm:block" />

            {/* Segmented Switcher antar 2 Proposal */}
            <div className="inline-flex items-center p-0.5 bg-neutral-100 border border-neutral-300 rounded-lg text-xs">
              <span className="px-2.5 py-1 rounded-md font-bold bg-white text-neutral-950 shadow-2xs">
                1. Proposal Sponsor Event
              </span>
              <Link
                href="/proposal-merchant"
                className="px-2.5 py-1 rounded-md font-semibold text-neutral-600 hover:text-emerald-800 hover:bg-white/60 transition-all flex items-center gap-1"
                title="Buka Proposal Kemitraan Merchant B2B Jangka Panjang"
              >
                <span>2. Proposal Merchant B2B</span>
                <span className="text-[10px]">→</span>
              </Link>
            </div>

            {isSavedNotice && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-green-100 text-green-800 border border-green-300 rounded animate-fade-in">
                ✓ Tersimpan
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                isEditing
                  ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                  : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200 border-neutral-300"
              }`}
            >
              {isEditing ? "✎ Selesai Edit" : "Mode Edit"}
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-800 text-white hover:bg-black transition-colors"
            >
              Simpan
            </button>
            <button
              onClick={handleReset}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
              title="Reset ke template default workshop"
            >
              Reset
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-800 text-white hover:bg-emerald-900 shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Cetak / Simpan PDF (A4)</span>
            </button>
          </div>
        </div>

        {/* Second Row: Target Recipient Customizer (Universal + Verified Leads) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-200 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[280px]">
            <span className="font-semibold text-neutral-700 whitespace-nowrap">Target Mitra / Perusahaan:</span>
            <input
              type="text"
              value={data.recipientCompany}
              onChange={(e) => updateField("recipientCompany", e.target.value)}
              placeholder="Contoh: Lumino Deluna Purwokerto / Ma-Ri Matcha"
              className="flex-1 max-w-[320px] px-2.5 py-1 bg-neutral-50 border border-neutral-300 rounded text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-neutral-500 font-medium mr-1">Isi Cepat:</span>
            {[
              { label: "Umum / Universal", company: "[Nama Perusahaan / Brand Mitra]", title: "Pimpinan / Brand & Marketing Manager" },
              { label: "Lumino Deluna", company: "Lumino Deluna Purwokerto", title: "Pimpinan & Tim Manajemen Kafe" },
              { label: "Ma-Ri Matcha", company: "Ma-Ri Matcha & Cake by Mimosa Patisserie", title: "Owner & Tim Brand Partnership" },
              { label: "Nuha Cosmetindo", company: "PT Nuha Cosmetindo", title: "Pimpinan & Tim Marketing" },
              { label: "Baby Glows", company: "Baby Glows Purwokerto", title: "Pimpinan & Tim Manajemen" },
              { label: "Merayu Spa", company: "Merayu Spa Purbalingga", title: "Kak Nisrina Khoirunnisa S (Account Executive)" },
              { label: "Taylor De Virdis", company: "Taylor De Virdis Purwokerto", title: "Pimpinan & Tim Manajemen" },
              { label: "Inul Vista", company: "Inul Vista Purwokerto", title: "Mas Wahyu & Tim Marketing" },
              { label: "Navagreen", company: "Navagreen Purwokerto", title: "Tim Marketing & Kemitraan" },
              { label: "Reta Clinic", company: "Reta Beauty Clinic", title: "Tim Sponsorship & Promosi" },
              { label: "Rita Group", company: "Rita Supermall Purwokerto", title: "Tim Promosi & Partnership" },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  updateField("recipientCompany", p.company);
                  updateField("recipientTitle", p.title);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all ${
                  data.recipientCompany === p.company
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border-neutral-300"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Warning Banner if Lunar Attribution is Present */}
        {hasLunar && (
          <div className="no-print mt-3 p-3 bg-amber-50 border border-amber-300 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-800">⚠️ Perhatian:</span>
              <span>
                Draf ini memuat atribusi <b>&quot;Lunar&quot;</b>. Sesuai ketentuan, Optik I See You merupakan satu-satunya penyelenggara. Bersihkan atribusi sebelum cetak/simpan PDF final.
              </span>
            </div>
            <button
              type="button"
              onClick={handleCleanLunar}
              className="px-3 py-1 bg-amber-800 hover:bg-amber-900 text-white rounded font-bold shadow-sm transition-all"
            >
              Bersihkan Otomatis Atribusi Lunar
            </button>
          </div>
        )}

        {/* Third Row: Typography & Style Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-200 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-neutral-700">Jenis Font:</span>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value as any)}
                className="px-2 py-1 bg-neutral-50 border border-neutral-300 rounded text-xs font-serif"
              >
                <option value="times">Times New Roman (Standar Formal)</option>
                <option value="georgia">Georgia (Serif Elegan)</option>
                <option value="garamond">Garamond (Klasik)</option>
                <option value="arial">Arial (Modern Bersih)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-neutral-700">Spasi Baris:</span>
              <select
                value={lineSpacing}
                onChange={(e) => setLineSpacing(e.target.value as any)}
                className="px-2 py-1 bg-neutral-50 border border-neutral-300 rounded text-xs"
              >
                <option value="1.2">1.2 (Rapat)</option>
                <option value="1.35">1.35 (Standar Formal)</option>
                <option value="1.5">1.5 (Renggang)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-neutral-500">
              {isEditing ? (
                <span className="text-amber-700 font-semibold">
                  Klik langsung pada teks bergaris bawah kuning di lembar proposal untuk mengedit
                </span>
              ) : (
                "Aktifkan 'Mode Edit' untuk mengubah teks langsung di lembar dokumen"
              )}
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* DOCUMENT PAGES (A4 FORMAL SHEETS)                       */}
      {/* ======================================================== */}
      <div
        className="proposal-doc max-w-[210mm] mx-auto space-y-8 print:space-y-0 text-black"
        style={fontStyle}
      >
        {/* ==================================================== */}
        {/* HALAMAN 1: COVER FORMAL                             */}
        {/* ==================================================== */}
        <section className="proposal-page proposal-cover-page bg-white p-[18mm] sm:p-[20mm] min-h-[297mm] shadow-lg print:shadow-none border border-neutral-200 print:border-none relative flex flex-col justify-between print:break-after-page">
          {/* Header Logos */}
          <div className="flex items-center justify-between border-b-[2px] border-black pb-4">
            <img
              src="/brand/logo-isy-dark.png"
              alt="Optik I See You"
              className="h-12 w-auto object-contain"
            />
            <div className="text-right">
              <img
                src="/brand/logo-for-every-you.png"
                alt="for every you"
                className="h-7 w-auto object-contain ml-auto opacity-90"
              />
              <p className="text-[8pt] text-gray-700 mt-1 uppercase tracking-wider font-semibold">
                Marketing Intelligence &amp; Event Initiative
              </p>
            </div>
          </div>

          {/* Title Area */}
          <div className="my-auto py-8 text-center print:my-auto print:py-0">
            <p className="text-[11pt] tracking-[0.2em] font-bold text-gray-700 uppercase mb-3">
              PROPOSAL PENAWARAN KERJASAMA SPONSORSHIP
            </p>
            <h1 className="text-[25pt] font-extrabold uppercase tracking-tight text-black leading-tight border-y-2 border-black py-4 my-2">
              <EditSpan
                value={data.eventName}
                onChange={(v) => updateField("eventName", v)}
                tag="span"
              />
            </h1>
            <p className="text-[13pt] font-semibold text-gray-900 mt-3">
              <EditSpan
                value={data.eventSubtitle}
                onChange={(v) => updateField("eventSubtitle", v)}
                tag="span"
              />
            </p>
            <div className="mt-3 max-w-[160mm] mx-auto text-left border-l-2 border-black pl-3 py-1 bg-neutral-50/60">
              <p className="text-[8.5pt] uppercase tracking-wider font-bold text-gray-600 mb-0.5">
                Tema Utama &amp; Fokus Pembahasan:
              </p>
              <p className="text-[9.5pt] italic text-gray-800 leading-snug">
                &quot;
                <EditSpan
                  value={data.eventTheme}
                  onChange={(v) => updateField("eventTheme", v)}
                  tag="span"
                />
                &quot;
              </p>
            </div>
          </div>

          {/* Submission Info Box */}
          <div className="space-y-5 pt-4 border-t border-gray-400">
            <div className="grid grid-cols-2 gap-6 text-[10pt]">
              <div className="border border-black p-4 bg-neutral-50/30">
                <span className="text-[8pt] uppercase font-bold tracking-widest text-gray-600 block mb-1">
                  Diajukan Kepada:
                </span>
                <p className="font-bold text-[11pt] text-black">
                  <EditSpan
                    value={data.recipientCompany}
                    onChange={(v) => updateField("recipientCompany", v)}
                    tag="span"
                  />
                </p>
                <p className="text-gray-800 text-[9.5pt] mt-0.5">
                  u.p.{" "}
                  <EditSpan
                    value={data.recipientTitle}
                    onChange={(v) => updateField("recipientTitle", v)}
                    tag="span"
                  />
                </p>
              </div>

              <div className="border border-black p-4 bg-neutral-50/30">
                <span className="text-[8pt] uppercase font-bold tracking-widest text-gray-600 block mb-1">
                  Penyelenggara Resmi:
                </span>
                <p className="font-bold text-[10.5pt] text-black">
                  DIVISI MARKETING &amp; KEMITRAAN
                </p>
                <p className="text-[9.5pt] text-gray-800 font-semibold">
                  Optik I See You
                </p>
                <p className="text-[8.5pt] text-gray-600 mt-1">
                  Lokasi Cabang: Purwokerto · Purbalingga · Cilacap · Wonosobo
                </p>
              </div>
            </div>

            <div className="text-center text-[9pt] text-gray-600 pt-2 border-t border-gray-300">
              Tahun Anggaran 2026 · Dokumen Resmi Perusahaan · www.optikiseeyou.com
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* HALAMAN 2: SURAT PENGANTAR FORMAL                   */}
        {/* ==================================================== */}
        <section className="proposal-page bg-white p-[18mm] sm:p-[20mm] min-h-[297mm] shadow-lg print:shadow-none border border-neutral-200 print:border-none print:break-after-page text-[10.5pt]">
          <FormalKopSurat />

          {/* Surat Metadata */}
          <div className="flex justify-between items-start mb-5 text-[10pt] gap-6">
            <table className="text-[10pt] flex-1 max-w-[65%]">
              <tbody>
                <tr>
                  <td className="w-20 font-bold align-top">Nomor</td>
                  <td className="w-4 align-top">:</td>
                  <td>
                    <EditSpan
                      value={data.docNo}
                      onChange={(v) => updateField("docNo", v)}
                      tag="span"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="font-bold align-top">Lampiran</td>
                  <td className="align-top">:</td>
                  <td>
                    <EditSpan
                      value={data.docAttachment}
                      onChange={(v) => updateField("docAttachment", v)}
                      tag="span"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="font-bold align-top">Perihal</td>
                  <td className="align-top">:</td>
                  <td className="font-bold leading-snug">
                    <EditSpan
                      value={data.docSubject}
                      onChange={(v) => updateField("docSubject", v)}
                      tag="span"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="text-right shrink-0 whitespace-nowrap pt-0.5">
              <p className="whitespace-nowrap font-medium text-[10pt]">
                <EditSpan
                  value={data.letterCity}
                  onChange={(v) => updateField("letterCity", v)}
                  tag="span"
                />
                {", "}
                <EditSpan
                  value={data.letterDate}
                  onChange={(v) => updateField("letterDate", v)}
                  tag="span"
                />
              </p>
            </div>
          </div>

          {/* Kepada Yth */}
          <div className="mb-5 text-[10.5pt]">
            <p>Kepada Yth.</p>
            <p className="font-bold">
              <EditSpan
                value={data.recipientTitle}
                onChange={(v) => updateField("recipientTitle", v)}
                tag="span"
              />
            </p>
            <p className="font-bold text-[11pt]">
              <EditSpan
                value={data.recipientCompany}
                onChange={(v) => updateField("recipientCompany", v)}
                tag="span"
              />
            </p>
            <p>
              <EditSpan
                value={data.recipientCity}
                onChange={(v) => updateField("recipientCity", v)}
                tag="span"
              />
            </p>
          </div>

          {/* Isi Surat Pengantar */}
          <div className={`space-y-3.5 text-justify ${lineHeightClass}`}>
            <p>Dengan hormat,</p>
            <p>
              <EditSpan
                value={data.letterIntro}
                onChange={(v) => updateField("letterIntro", v)}
                tag="span"
              />
            </p>
            <p>
              Optik I See You merupakan jaringan ritel kacamata terkemuka yang mengoperasikan 4 lokasi cabang di Purwokerto, Purbalingga, Cilacap, dan Wonosobo. Kami memiliki basis pasar terdata lebih dari <b>1.000.000 (satu juta) pembeli dan pelanggan loyal</b> dengan segmentasi daya beli matang (profesional muda, ASN, pengusaha, keluarga modern, serta komunitas mahasiswa produktif), serta diperkuat jejaring media sosial terintegrasi dengan lebih dari <b>{fmt(totalAll)} pengikut</b>.
            </p>
            <p>
              Melalui program &quot;{data.eventName}&quot;, pihak mitra sponsor akan memperoleh hak eksposur menyeluruh: slot presentasi &amp; demo produk di hadapan puluhan kreator aktif, penayangan video promosi di layar TV Showroom Purwokerto, display media promosi di meja kasir 4 gerai ritel, hak pembagian produk sampling / voucher ke dalam goodie bag peserta, serta publikasi promosi digital di jejaring media sosial kami.
            </p>
            <p>
              Bersama surat ini, kami lampirkan rincian kegiatan, susunan rundown, profil narasumber, rencana anggaran biaya (RAB), pilihan paket sponsorship, serta lembar kesepakatan kerjasama untuk menjadi pertimbangan Bapak/Ibu.
            </p>
            <p>
              <EditSpan
                value={data.letterClosing}
                onChange={(v) => updateField("letterClosing", v)}
                tag="span"
              />
            </p>
          </div>

          {/* Tanda Tangan Formal Surat Pengantar */}
          <div className="mt-7 pt-3 flex justify-between items-end text-[10pt]">
            <div>
              <p>Hormat kami,</p>
              <p className="font-semibold text-gray-800">Divisi Kemitraan &amp; Sponsorship</p>
              <div className="h-16 flex items-end">
                {/* Space for signature */}
              </div>
              <p className="font-bold underline text-[10.5pt]">
                <EditSpan
                  value={data.picName}
                  onChange={(v) => updateField("picName", v)}
                  tag="span"
                />
              </p>
              <p className="text-gray-700 text-[9pt]">
                <EditSpan
                  value={data.picRole}
                  onChange={(v) => updateField("picRole", v)}
                  tag="span"
                />
              </p>
            </div>

            <div className="text-right">
              <p>Mengetahui,</p>
              <p className="font-semibold text-gray-800">Head of Marketing</p>
              <div className="h-16 flex items-end justify-end">
                {/* Space for signature */}
              </div>
              <p className="font-bold underline text-[10.5pt]">
                <EditSpan
                  value={data.headName}
                  onChange={(v) => updateField("headName", v)}
                  tag="span"
                />
              </p>
              <p className="text-gray-700 text-[9pt]">
                <EditSpan
                  value={data.headRole}
                  onChange={(v) => updateField("headRole", v)}
                  tag="span"
                />
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* HALAMAN 3: BAB I & BAB II (DESKRIPSI & PEMBICARA)   */}
        {/* ==================================================== */}
        <section className="proposal-page bg-white p-[18mm] sm:p-[20mm] min-h-[297mm] shadow-lg print:shadow-none border border-neutral-200 print:border-none print:break-after-page text-[10pt]">
          <FormalKopSurat />

          {/* BAB I */}
          <div className="mb-4">
            <h3 className="text-[11.5pt] font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-2">
              BAB I. LATAR BELAKANG &amp; TUJUAN KEGIATAN
            </h3>

            <div className={`space-y-2 text-justify ${lineHeightClass}`}>
              <p>
                <b>1.1 Latar Belakang</b>
                <br />
                <EditSpan
                  value={data.backgroundText1}
                  onChange={(v) => updateField("backgroundText1", v)}
                  tag="span"
                />
              </p>
              <p>
                <EditSpan
                  value={data.backgroundText2}
                  onChange={(v) => updateField("backgroundText2", v)}
                  tag="span"
                />
              </p>
              <p>
                <EditSpan
                  value={data.backgroundText3}
                  onChange={(v) => updateField("backgroundText3", v)}
                  tag="span"
                />
              </p>

              <p className="pt-0.5">
                <b>1.2 Tujuan Kegiatan</b>
              </p>
              <ol className="list-decimal pl-5 space-y-0.5">
                <li>
                  Memberikan edukasi praktis mengenai personal branding dan strategi produksi konten visual komersial (Story, Feed, Reels) yang mampu menaikkan nilai tawar kreator maupun brand.
                </li>
                <li>
                  Membuka wadah interaksi riil antara brand mitra sponsor dengan audiens Gen-Z, kreator konten, dan UMKM melalui demo produk langsung, live trial, dan booth showcase.
                </li>
                <li>
                  Memberikan sarana eksposur multi-kanal berkelanjutan bagi mitra di jaringan toko ritel Optik I See You (Purwokerto, Purbalingga, Cilacap, Wonosobo) dan media sosial.
                </li>
              </ol>
            </div>
          </div>

          {/* BAB II */}
          <div>
            <h3 className="text-[11.5pt] font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-2">
              BAB II. DESKRIPSI ACARA &amp; PROFIL PEMBICARA
            </h3>

            {/* Event Data Table */}
            <table className="w-full border-collapse border border-black text-[9pt] mb-3">
              <tbody>
                <tr className="border-b border-black">
                  <td className="w-[28%] py-1 px-2.5 font-bold bg-neutral-100 border-r border-black">
                    Nama Kegiatan
                  </td>
                  <td className="py-1 px-2.5 font-semibold">
                    <EditSpan
                      value={data.eventName}
                      onChange={(v) => updateField("eventName", v)}
                      tag="span"
                    />{" "}
                    —{" "}
                    <EditSpan
                      value={data.eventSubtitle}
                      onChange={(v) => updateField("eventSubtitle", v)}
                      tag="span"
                    />
                  </td>
                </tr>
                <tr className="border-b border-black">
                  <td className="py-1 px-2.5 font-bold bg-neutral-100 border-r border-black">
                    Tema &amp; Subtema
                  </td>
                  <td className="py-1 px-2.5 italic">
                    &quot;
                    <EditSpan
                      value={data.eventTheme}
                      onChange={(v) => updateField("eventTheme", v)}
                      tag="span"
                    />
                    &quot;
                  </td>
                </tr>
                <tr className="border-b border-black">
                  <td className="py-1 px-2.5 font-bold bg-neutral-100 border-r border-black">
                    Penyelenggara
                  </td>
                  <td className="py-1 px-2.5">
                    <EditSpan
                      value={data.eventOrganizer}
                      onChange={(v) => updateField("eventOrganizer", v)}
                      tag="span"
                    />
                  </td>
                </tr>
                <tr className="border-b border-black">
                  <td className="py-1 px-2.5 font-bold bg-neutral-100 border-r border-black">
                    Hari, Tanggal &amp; Waktu
                  </td>
                  <td className="py-1 px-2.5 font-semibold">
                    <EditSpan
                      value={data.eventDate}
                      onChange={(v) => updateField("eventDate", v)}
                      tag="span"
                    />
                    {" · "}
                    <EditSpan
                      value={data.eventTime}
                      onChange={(v) => updateField("eventTime", v)}
                      tag="span"
                    />
                  </td>
                </tr>
                <tr className="border-b border-black">
                  <td className="py-1 px-2.5 font-bold bg-neutral-100 border-r border-black">
                    Lokasi / Venue
                  </td>
                  <td className="py-1 px-2.5 font-semibold">
                    <EditSpan
                      value={data.eventVenue}
                      onChange={(v) => updateField("eventVenue", v)}
                      tag="span"
                    />
                  </td>
                </tr>
                <tr className="border-b border-black">
                  <td className="py-1 px-2.5 font-bold bg-neutral-100 border-r border-black">
                    Target Peserta
                  </td>
                  <td className="py-1 px-2.5">
                    <EditSpan
                      value={data.eventParticipants}
                      onChange={(v) => updateField("eventParticipants", v)}
                      tag="span"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="py-1 px-2.5 font-bold bg-neutral-100 border-r border-black">
                    Format Kegiatan
                  </td>
                  <td className="py-1 px-2.5">
                    <EditSpan
                      value={data.eventFormat}
                      onChange={(v) => updateField("eventFormat", v)}
                      tag="span"
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Speakers List Section */}
            <p className="font-bold text-[9.5pt] mb-1.5 uppercase tracking-wide">
              2.2 Jajaran Narasumber &amp; Master of Ceremony (MC)
            </p>
            <div className="grid grid-cols-2 gap-2 text-[8.5pt]">
              {data.speakers.map((sp, sIdx) => (
                <div
                  key={sIdx}
                  className="border border-black p-2 bg-neutral-50/50 flex flex-col justify-between"
                >
                  <div>
                    <div className="border-b border-gray-300 pb-1 mb-1">
                      <p className="font-bold text-[9.5pt] text-black">
                        <EditSpan
                          value={sp.name}
                          onChange={(v) => updateSpeaker(sIdx, { name: v })}
                          tag="span"
                        />
                      </p>
                      <p className="text-[8pt] text-gray-700 font-medium">
                        <EditSpan
                          value={sp.role}
                          onChange={(v) => updateSpeaker(sIdx, { role: v })}
                          tag="span"
                        />
                      </p>
                    </div>
                    <p className="font-semibold text-emerald-950 text-[8pt] mb-0.5">
                      Topik: &quot;
                      <EditSpan
                        value={sp.topic}
                        onChange={(v) => updateSpeaker(sIdx, { topic: v })}
                        tag="span"
                      />
                      &quot;
                    </p>
                    <p className="text-gray-700 text-[8pt] leading-tight text-justify">
                      <EditSpan
                        value={sp.highlight}
                        onChange={(v) => updateSpeaker(sIdx, { highlight: v })}
                        tag="span"
                      />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* HALAMAN 4: BAB III (SUSUNAN ACARA & RUNDOWN)        */}
        {/* ==================================================== */}
        <section className="proposal-page bg-white p-[18mm] sm:p-[20mm] min-h-[297mm] shadow-lg print:shadow-none border border-neutral-200 print:border-none print:break-after-page text-[10pt]">
          <FormalKopSurat />

          <h3 className="text-[11.5pt] font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-3">
            BAB III. SUSUNAN ACARA &amp; RUNDOWN PELAKSANAAN
          </h3>

          <p className={`text-justify mb-3 text-[9.5pt] ${lineHeightClass}`}>
            Rangkaian acara disusun secara terstruktur untuk menjamin kenyamanan peserta, kedalaman materi workshop, serta memberikan alokasi waktu eksklusif bagi mitra sponsor dalam memperkenalkan produk dan berinteraksi langsung dengan audiens:
          </p>

          <p className="font-bold text-[9.5pt] mb-1.5 uppercase">3.1 Rundown Acara Workshop (Peserta &amp; Panggung)</p>
          <table className="w-full border-collapse border border-black text-[8.5pt] mb-4">
            <thead>
              <tr className="bg-neutral-100 border-b border-black">
                <th className="w-[18%] py-1.5 px-2 text-left border-r border-black font-bold">Waktu</th>
                <th className="w-[32%] py-1.5 px-2 text-left border-r border-black font-bold">Agenda Kegiatan</th>
                <th className="w-[24%] py-1.5 px-2 text-left border-r border-black font-bold">PIC / Pembicara</th>
                <th className="py-1.5 px-2 text-left font-bold">Keterangan Teknis</th>
              </tr>
            </thead>
            <tbody>
              {data.rundown.map((rd, rIdx) => (
                <tr
                  key={rIdx}
                  className={`border-b border-black ${
                    rd.activity.includes("Demo Produk") ? "bg-amber-50/60 font-semibold" : ""
                  }`}
                >
                  <td className="py-1.5 px-2 border-r border-black font-semibold whitespace-nowrap align-top">
                    <EditSpan
                      value={rd.time}
                      onChange={(v) => updateRundown(rIdx, { time: v })}
                      tag="span"
                    />
                  </td>
                  <td className="py-1.5 px-2 border-r border-black align-top">
                    <EditSpan
                      value={rd.activity}
                      onChange={(v) => updateRundown(rIdx, { activity: v })}
                      tag="span"
                    />
                  </td>
                  <td className="py-1.5 px-2 border-r border-black text-gray-800 align-top">
                    <EditSpan
                      value={rd.picOrSpeaker}
                      onChange={(v) => updateRundown(rIdx, { picOrSpeaker: v })}
                      tag="span"
                    />
                  </td>
                  <td className="py-1.5 px-2 text-gray-700 align-top">
                    <EditSpan
                      value={rd.notes}
                      onChange={(v) => updateRundown(rIdx, { notes: v })}
                      tag="span"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Rundown Teknis Loading & Persiapan Mitra */}
          <div className="border border-black p-3 bg-neutral-50 text-[8.5pt] space-y-2">
            <p className="font-bold text-black uppercase flex items-center justify-between border-b border-black pb-1">
              <span>3.2 Rundown Teknis Persiapan &amp; Loading Mitra Sponsor (H-1 s.d. Hari H)</span>
              <span className="text-[7.5pt] font-semibold text-neutral-800 bg-neutral-200 px-2 py-0.5 rounded">
                Panduan Operasional Mitra
              </span>
            </p>
            <div className="grid grid-cols-3 gap-2 pt-0.5 text-[8pt]">
              <div className="border border-neutral-300 bg-white p-2 rounded">
                <p className="font-bold text-black mb-0.5">07.00 – 07.45 WIB</p>
                <p className="text-gray-700 leading-snug">
                  <b>Loading In &amp; Setting Booth:</b> Pemasangan roll banner, tata display sample produk, flyer di stand, serta penyerahan tester/voucher ke meja registrasi.
                </p>
              </div>
              <div className="border border-neutral-300 bg-white p-2 rounded">
                <p className="font-bold text-black mb-0.5">07.45 – 08.00 WIB</p>
                <p className="text-gray-700 leading-snug">
                  <b>Technical Briefing MC:</b> Koordinasi MC (Nuha &amp; Yos) bersama PIC brand untuk persiapan alur sesi Live Demo Produk panggung (10.30 WIB).
                </p>
              </div>
              <div className="border border-neutral-300 bg-white p-2 rounded">
                <p className="font-bold text-black mb-0.5">13.00 – 13.30 WIB</p>
                <p className="text-gray-700 leading-snug">
                  <b>Loading Out &amp; Serah Terima:</b> Penutupan booth, rekapitulasi data prospek/audiens, dan serah terima dokumentasi publikasi kemitraan oleh panitia.
                </p>
              </div>
            </div>
            <p className="text-[7.5pt] text-gray-600 italic">
              * Panitia menyediakan tim pendamping khusus untuk membantu setup materi display, kelistrikan booth, dan kelancaran live trial produk sponsor.
            </p>
          </div>
        </section>

        {/* ==================================================== */}
        {/* HALAMAN 5: BAB IV (JARINGAN RETAIL & PAPARAN MEDIA) */}
        {/* ==================================================== */}
        <section className="proposal-page bg-white p-[18mm] sm:p-[20mm] min-h-[297mm] shadow-lg print:shadow-none border border-neutral-200 print:border-none print:break-after-page text-[10pt]">
          <FormalKopSurat />

          <h3 className="text-[11.5pt] font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-3">
            BAB IV. JARINGAN RETAIL &amp; PAPARAN MEDIA SPONSOR
          </h3>

          <p className={`text-justify mb-3 text-[9.5pt] ${lineHeightClass}`}>
            Optik I See You memberikan nilai tambah unik yang tidak dimiliki event konvensional:{" "}
            <b>eksposur berkelanjutan di jaringan toko ritel fisik</b>. Setiap materi video dan poster
            sponsor berkesempatan tayang di layar TV showroom 4 cabang selama periode kerjasama,
            disaksikan langsung oleh pengunjung yang datang untuk fitting frame dan pemeriksaan refraksi
            mata harian.
          </p>

          <p className="font-bold text-[9.5pt] mb-1">4.1 Rekapitulasi Jaringan Cabang Ritel</p>
          <table className="w-full border-collapse border border-black text-[8.5pt] mb-4">
            <thead>
              <tr className="bg-neutral-100 border-b border-black">
                <th className="py-1.5 px-2.5 text-left border-r border-black font-bold">Lokasi Cabang</th>
                <th className="py-1.5 px-2.5 text-left border-r border-black font-bold">Wilayah &amp; Karakteristik</th>
                <th className="py-1.5 px-2.5 text-left font-bold">Fasilitas Tayang Sponsor</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-black">
                <td className="py-1.5 px-2.5 border-r border-black font-semibold">Purwokerto</td>
                <td className="py-1.5 px-2.5 border-r border-black">Pusat kota, kawasan pendidikan tinggi &amp; pusat bisnis</td>
                <td className="py-1.5 px-2.5">Layar TV Showroom &amp; Meja Display Kasir</td>
              </tr>
              <tr className="border-b border-black">
                <td className="py-1.5 px-2.5 border-r border-black font-semibold">Purbalingga</td>
                <td className="py-1.5 px-2.5 border-r border-black">Area sentra niaga aktif &amp; segmen keluarga muda</td>
                <td className="py-1.5 px-2.5">Meja Display Kasir &amp; Display Brosur / Flyer</td>
              </tr>
              <tr className="border-b border-black">
                <td className="py-1.5 px-2.5 border-r border-black font-semibold">Cilacap</td>
                <td className="py-1.5 px-2.5 border-r border-black">Kawasan residensial berkembang &amp; sentra industri</td>
                <td className="py-1.5 px-2.5">Meja Display Kasir &amp; Display Brosur / Flyer</td>
              </tr>
              <tr>
                <td className="py-1.5 px-2.5 border-r border-black font-semibold">Wonosobo</td>
                <td className="py-1.5 px-2.5 border-r border-black">Pusat kota &amp; koridor strategis pariwisata Dieng</td>
                <td className="py-1.5 px-2.5">Meja Display Kasir &amp; Display Brosur / Flyer</td>
              </tr>
            </tbody>
          </table>

          <p className="font-bold text-[9.5pt] mb-1">4.2 Jangkauan Media Sosial Terintegrasi</p>
          <table className="w-full border-collapse border border-black text-[8.5pt] mb-2">
            <thead>
              <tr className="bg-neutral-100 border-b border-black">
                <th className="py-1.5 px-2.5 text-left border-r border-black font-bold">Akun Resmi</th>
                <th className="py-1.5 px-2.5 text-left border-r border-black font-bold">Lokasi Cabang</th>
                <th className="py-1.5 px-2.5 text-right border-r border-black font-bold">Followers IG</th>
                <th className="py-1.5 px-2.5 text-right font-bold">Followers TikTok</th>
              </tr>
            </thead>
            <tbody>
              {followers.map((fRow) => (
                <tr key={fRow.account} className="border-b border-black">
                  <td className="py-1 px-2.5 border-r border-black font-semibold">{fRow.account}</td>
                  <td className="py-1 px-2.5 border-r border-black text-gray-800">{fRow.label}</td>
                  <td className="py-1 px-2.5 border-r border-black text-right tabular-nums">
                    {fmt(fRow.igFollowers)}
                  </td>
                  <td className="py-1 px-2.5 text-right tabular-nums">
                    {fRow.tiktokFollowers ? fmt(fRow.tiktokFollowers) : "-"}
                  </td>
                </tr>
              ))}
              <tr className="bg-neutral-100 font-bold border-t-2 border-black">
                <td colSpan={2} className="py-1.5 px-2.5 border-r border-black uppercase">
                  Total Jangkauan Komulatif Jaringan
                </td>
                <td className="py-1.5 px-2.5 border-r border-black text-right tabular-nums">
                  {fmt(totalIg)}
                </td>
                <td className="py-1.5 px-2.5 text-right tabular-nums">{fmt(totalTt)}</td>
              </tr>
            </tbody>
          </table>
          <p className="text-[8pt] text-gray-600 italic mb-3">
            * Data tercatat berdasarkan rekapitulasi audit PIC resmi per Oktober 2026.
          </p>

          {/* 4.3 Profil Basis Pasar Pelanggan */}
          <div className="border border-black p-3 bg-neutral-50 text-[8.5pt]">
            <p className="font-bold text-black uppercase mb-1 flex items-center justify-between border-b border-black pb-1">
              <span>4.3 Basis Pasar Pelanggan (1.000.000+ Pembeli) &amp; Segmentasi Grade Konsumen</span>
              <span className="text-[7.5pt] font-semibold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                Database Ritel Terintegrasi
              </span>
            </p>
            <p className="text-gray-800 text-justify mb-2 leading-relaxed text-[8pt]">
              Optik I See You didukung basis pasar riil lebih dari <b>1.000.000 (satu juta) transaksi pembeli dan rekam medis kacamata</b> di 4 kabupaten. Profil konsumen terbagi dalam segmentasi grade yang matang:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[8pt]">
              <div className="border border-neutral-300 bg-white p-2 rounded">
                <p className="font-bold text-black text-[8.5pt] mb-0.5">Grade A &amp; B (Purchasing Power Tinggi)</p>
                <p className="text-gray-700 leading-snug">
                  Segmen eksekutif, dokter, tenaga medis, ASN/BUMN, pengusaha, dan keluarga mapan. Sangat potensial untuk sponsor perbankan, otomotif, klinik estetika, f&amp;b lifestyle, dan brand gaya hidup premium.
                </p>
              </div>
              <div className="border border-neutral-300 bg-white p-2 rounded">
                <p className="font-bold text-black text-[8.5pt] mb-0.5">Grade C+ &amp; Generasi Produktif / Gen-Z</p>
                <p className="text-gray-700 leading-snug">
                  Segmen mahasiswa (Unsoed, UMP, Telkom), kreator konten digital, dan komunitas muda aktif. Sangat responsif terhadap tren konten digital, teknologi, kafe kekinian, dan aktivasi booth interaktif.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* HALAMAN 6: BAB V (RENCANA ANGGARAN BIAYA - RAB)     */}
        {/* ==================================================== */}
        <section className="proposal-page bg-white p-[18mm] sm:p-[20mm] min-h-[297mm] shadow-lg print:shadow-none border border-neutral-200 print:border-none print:break-after-page text-[10pt]">
          <FormalKopSurat />

          <h3 className="text-[11.5pt] font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-3">
            BAB V. RENCANA ANGGARAN BIAYA (RAB) KEGIATAN
          </h3>

          <p className={`text-justify mb-3 text-[9.5pt] ${lineHeightClass}`}>
            Penyusunan anggaran dirancang secara transparan dan efisien guna memastikan terselenggaranya kegiatan berkualitas tinggi dengan alokasi operasional yang terukur:
          </p>

          <p className="font-bold text-[9.5pt] mb-1.5 uppercase">5.1 Rincian Rencana Anggaran Pengeluaran (RAB Operasional)</p>
          <table className="w-full border-collapse border border-black text-[8.5pt] mb-4">
            <thead>
              <tr className="bg-neutral-100 border-b border-black">
                <th className="w-8 py-1.5 px-2 text-center border-r border-black font-bold">No</th>
                <th className="py-1.5 px-2.5 text-left border-r border-black font-bold">Komponen / Item Kebutuhan</th>
                <th className="w-24 py-1.5 px-2 text-center border-r border-black font-bold">Volume / Qty</th>
                <th className="w-32 py-1.5 px-2 text-right border-r border-black font-bold">Biaya Satuan</th>
                <th className="w-32 py-1.5 px-2 text-right font-bold">Total Biaya</th>
              </tr>
            </thead>
            <tbody>
              {data.budgetExpenses.map((bItem, bIdx) => (
                <tr key={bIdx} className="border-b border-black">
                  <td className="py-1.5 px-2 text-center border-r border-black">{bIdx + 1}</td>
                  <td className="py-1.5 px-2.5 border-r border-black font-medium">
                    <EditSpan
                      value={bItem.item}
                      onChange={(v) => updateBudgetExpense(bIdx, { item: v })}
                      tag="span"
                    />
                  </td>
                  <td className="py-1.5 px-2 text-center border-r border-black text-gray-800">
                    <EditSpan
                      value={bItem.qty}
                      onChange={(v) => updateBudgetExpense(bIdx, { qty: v })}
                      tag="span"
                    />
                  </td>
                  <td className="py-1.5 px-2 text-right border-r border-black text-gray-800 tabular-nums">
                    <EditSpan
                      value={bItem.unitCost}
                      onChange={(v) => updateBudgetExpense(bIdx, { unitCost: v })}
                      tag="span"
                    />
                  </td>
                  <td className="py-1.5 px-2 text-right font-bold tabular-nums">
                    <EditSpan
                      value={bItem.totalCost}
                      onChange={(v) => updateBudgetExpense(bIdx, { totalCost: v })}
                      tag="span"
                    />
                  </td>
                </tr>
              ))}
              <tr className="bg-neutral-100 font-bold border-t-2 border-black">
                <td colSpan={4} className="py-1.5 px-2.5 border-r border-black text-right uppercase">
                  TOTAL KEBUTUHAN ANGGARAN PENGELUARAN
                </td>
                <td className="py-1.5 px-2 text-right text-[9.5pt] text-black tabular-nums">
                  Rp 8.100.000,-
                </td>
              </tr>
            </tbody>
          </table>

          <p className="font-bold text-[9.5pt] mb-1.5 uppercase">5.2 Rencana &amp; Target Sumber Pemasukan</p>
          <table className="w-full border-collapse border border-black text-[8.5pt] mb-3">
            <thead>
              <tr className="bg-neutral-100 border-b border-black">
                <th className="w-8 py-1.5 px-2 text-center border-r border-black font-bold">No</th>
                <th className="w-48 py-1.5 px-2.5 text-left border-r border-black font-bold">Sumber Pemasukan</th>
                <th className="py-1.5 px-2.5 text-left border-r border-black font-bold">Deskripsi / Skema</th>
                <th className="w-44 py-1.5 px-2 text-right font-bold">Proyeksi Nominal</th>
              </tr>
            </thead>
            <tbody>
              {data.revenueProjections.map((rItem, rIdx) => (
                <tr key={rIdx} className="border-b border-black">
                  <td className="py-1.5 px-2 text-center border-r border-black">{rIdx + 1}</td>
                  <td className="py-1.5 px-2.5 border-r border-black font-semibold">
                    <EditSpan
                      value={rItem.source}
                      onChange={(v) => updateRevenueProjection(rIdx, { source: v })}
                      tag="span"
                    />
                  </td>
                  <td className="py-1.5 px-2.5 border-r border-black text-gray-800">
                    <EditSpan
                      value={rItem.description}
                      onChange={(v) => updateRevenueProjection(rIdx, { description: v })}
                      tag="span"
                    />
                  </td>
                  <td className="py-1.5 px-2 text-right font-bold tabular-nums">
                    <EditSpan
                      value={rItem.projection}
                      onChange={(v) => updateRevenueProjection(rIdx, { projection: v })}
                      tag="span"
                    />
                  </td>
                </tr>
              ))}
              <tr className="bg-neutral-100 font-bold border-t-2 border-black">
                <td colSpan={3} className="py-1.5 px-2.5 border-r border-black text-right uppercase">
                  ESTIMASI TOTAL PEMASUKAN &amp; DUKUNGAN MITRA
                </td>
                <td className="py-1.5 px-2 text-right text-[9pt] text-black tabular-nums">
                  Rp 6.600.000 – Rp 8.100.000,-
                </td>
              </tr>
            </tbody>
          </table>

          {/* Catatan Finansial Penjaminan */}
          <div className="border border-black p-3 bg-neutral-50 text-[8.5pt]">
            <p className="font-bold text-black uppercase mb-0.5">
              5.3 Kebijakan Finansial &amp; Jaminan Kepastian Kegiatan
            </p>
            <p className="text-gray-800 text-justify leading-relaxed text-[8pt]">
              Setiap selisih kebutuhan anggaran operasional dijamin dan disubsidi penuh oleh alokasi anggaran kemitraan Divisi Marketing Optik I See You. Hal ini memberikan kepastian 100% terselenggaranya kegiatan secara profesional tanpa risiko pembatalan, sehingga memberikan jaminan ROI dan ketercapaian deliverables promosi yang maksimal bagi seluruh mitra sponsor yang berpartisipasi.
            </p>
          </div>
        </section>

        {/* ==================================================== */}
        {/* HALAMAN 7: BAB VI (4 PAKET SPONSORSHIP RESMI)       */}
        {/* ==================================================== */}
        <section className="proposal-page bg-white p-[18mm] sm:p-[20mm] min-h-[297mm] shadow-lg print:shadow-none border border-neutral-200 print:border-none print:break-after-page text-[10pt]">
          <FormalKopSurat />

          <h3 className="text-[11.5pt] font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-3">
            BAB VI. BENTUK KERJASAMA &amp; PAKET SPONSORSHIP
          </h3>

          <p className={`text-justify mb-3 text-[9.5pt] ${lineHeightClass}`}>
            Kami menyediakan 4 (empat) pilihan paket sponsorship yang dirancang fleksibel, terjangkau, dan berdampak nyata bagi pertumbuhan brand mitra:
          </p>

          <div className="grid grid-cols-2 gap-2.5 text-[8.5pt]">
            {data.packages.map((pkg, pIdx) => (
              <div
                key={pkg.id}
                className="border border-black p-2.5 flex flex-col justify-between bg-neutral-50/40"
              >
                <div>
                  <div className="border-b border-black pb-1 mb-1.5">
                    <div className="flex justify-between items-baseline gap-2">
                      <h4 className="font-bold text-[9pt] tracking-wide text-black leading-snug">
                        <EditSpan
                          value={pkg.name}
                          onChange={(v) => updatePackage(pIdx, { name: v })}
                          tag="span"
                        />
                      </h4>
                      <span className="font-bold text-[9.5pt] text-black whitespace-nowrap">
                        <EditSpan
                          value={pkg.price}
                          onChange={(v) => updatePackage(pIdx, { price: v })}
                          tag="span"
                        />
                      </span>
                    </div>
                    <p className="text-[7.5pt] text-gray-700 italic mt-0.5">
                      <EditSpan
                        value={pkg.tagline}
                        onChange={(v) => updatePackage(pIdx, { tagline: v })}
                        tag="span"
                      />
                    </p>
                  </div>

                  <ul className="list-disc pl-3.5 space-y-1 text-[7.5pt] text-gray-800">
                    {pkg.benefits.map((b, bIdx) => (
                      <li key={bIdx} className="leading-tight">
                        <EditSpan
                          value={b}
                          onChange={(v) => updateBenefit(pIdx, bIdx, v)}
                          tag="span"
                        />
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => removeBenefit(pIdx, bIdx)}
                            className="ml-1 text-red-600 hover:underline text-[7pt] no-print"
                            title="Hapus butir ini"
                          >
                            [x]
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {isEditing && (
                  <button
                    type="button"
                    onClick={() => addBenefit(pIdx)}
                    className="mt-1.5 text-blue-700 hover:underline text-[7pt] font-semibold no-print"
                  >
                    + Tambah Fasilitas Paket
                  </button>
                )}
              </div>
            ))}
          </div>

          <p className="text-[8pt] text-gray-600 italic mt-3">
            * Khusus Kategori 3 (Bronze) dan Kategori 4 (In-Kind / Custom), seluruh mitra mendapatkan hak istimewa <b>Sesi Live Demo Produk</b> dan trial langsung oleh audiens.
          </p>
        </section>

        {/* ==================================================== */}
        {/* HALAMAN 8: BAB VII (PROSEDUR, PEMBAYARAN & KONTAK)  */}
        {/* ==================================================== */}
        <section className="proposal-page bg-white p-[18mm] sm:p-[20mm] min-h-[297mm] shadow-lg print:shadow-none border border-neutral-200 print:border-none print:break-after-page text-[10pt]">
          <FormalKopSurat />

          <h3 className="text-[11.5pt] font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-4">
            BAB VII. KETENTUAN, PEMBAYARAN, &amp; NARAHUBUNG
          </h3>

          <div className={`space-y-4 text-justify ${lineHeightClass}`}>
            <div>
              <p className="font-bold mb-1 text-[9.5pt]">7.1 Alur Konfirmasi &amp; Pelaksanaan Kerjasama</p>
              <ol className="list-decimal pl-5 space-y-1 text-[9pt]">
                <li>
                  Calon mitra sponsor memilih paket kerjasama (Platinum, Gold, Bronze, atau In-Kind / Custom) dan menandatangani Lembar Kesepakatan Sponsor pada halaman lampiran.
                </li>
                <li>
                  Tim Kemitraan Optik I See You menerbitkan invoice penagihan resmi serta Surat Perjanjian Kerjasama (MoU) definitif.
                </li>
                <li>
                  Mitra menyerahkan materi publikasi (file logo resolusi tinggi, materi iklan video MP4 1080p, dan flyer cetak) paling lambat <b>H-5</b> sebelum tanggal kegiatan.
                </li>
                <li>
                  Penyelenggara menyampaikan laporan bukti tayang (foto &amp; video dokumentasi kegiatan, live demo produk panggung, serta display gerai ritel) maksimal H+7 setelah acara berakhir.
                </li>
              </ol>
            </div>

            <div>
              <p className="font-bold mb-1 text-[9.5pt]">7.2 Mekanisme Pembayaran Sponsorship</p>
              <p className="text-[9pt] mb-2">
                Pembayaran paket tunai dilakukan dalam 2 (dua) termin transfer resmi sebagai berikut:
              </p>
              <table className="w-full border-collapse border border-black text-[8.5pt] mb-2.5">
                <thead>
                  <tr className="bg-neutral-100 border-b border-black">
                    <th className="py-1 px-3 text-left border-r border-black font-bold">Tahap</th>
                    <th className="py-1 px-3 text-left border-r border-black font-bold">Jatuh Tempo Pembayaran</th>
                    <th className="py-1 px-3 text-right font-bold">Nominal Pembayaran</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-black">
                    <td className="py-1.5 px-3 border-r border-black font-semibold">Tahap I (Uang Muka / DP)</td>
                    <td className="py-1.5 px-3 border-r border-black">Saat penandatanganan Lembar Kesepakatan MoU</td>
                    <td className="py-1.5 px-3 text-right font-bold">50% dari total nilai paket</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 border-r border-black font-semibold">Tahap II (Pelunasan)</td>
                    <td className="py-1.5 px-3 border-r border-black">Paling lambat H-3 sebelum pelaksanaan acara</td>
                    <td className="py-1.5 px-3 text-right font-bold">50% sisa pelunasan</td>
                  </tr>
                </tbody>
              </table>

              <p className="text-[8.5pt] mb-1">
                Seluruh pembayaran disalurkan via transfer ke rekening resmi penyelenggara:
              </p>
              <div className="border border-black p-2.5 bg-neutral-50 text-[9pt]">
                <p>
                  Nama Bank:{" "}
                  <b>
                    <EditSpan
                      value={data.bankName}
                      onChange={(v) => updateField("bankName", v)}
                      tag="span"
                    />
                  </b>
                </p>
                <p>
                  Nomor Rekening:{" "}
                  <b className="tracking-wider">
                    <EditSpan
                      value={data.bankAccountNo}
                      onChange={(v) => updateField("bankAccountNo", v)}
                      tag="span"
                    />
                  </b>
                </p>
                <p>
                  Atas Nama:{" "}
                  <b>
                    <EditSpan
                      value={data.bankAccountName}
                      onChange={(v) => updateField("bankAccountName", v)}
                      tag="span"
                    />
                  </b>
                </p>
              </div>
            </div>

            <div>
              <p className="font-bold mb-1 text-[9.5pt]">7.3 Layanan Narahubung Resmi</p>
              <p className="text-[9pt] mb-2">
                Untuk diskusi paket, kustomisasi skema barter in-kind, atau serah terima materi, silakan hubungi kontak panitia:
              </p>
              <div className="border border-black p-3 text-[9pt] grid grid-cols-2 gap-3">
                <div>
                  <span className="text-gray-600 block text-[8pt]">PIC Kemitraan &amp; Sponsorship:</span>
                  <span className="font-bold text-[9.5pt]">
                    <EditSpan
                      value={data.picName}
                      onChange={(v) => updateField("picName", v)}
                      tag="span"
                    />
                  </span>
                  <span className="text-gray-700 block text-[8.5pt]">
                    <EditSpan
                      value={data.picRole}
                      onChange={(v) => updateField("picRole", v)}
                      tag="span"
                    />
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 block text-[8pt]">WhatsApp Resmi Kemitraan:</span>
                  <span className="font-bold text-[10.5pt]">
                    <EditSpan
                      value={data.picWa}
                      onChange={(v) => updateField("picWa", v)}
                      tag="span"
                    />
                  </span>
                  <span className="text-gray-600 block text-[7.5pt] mt-0.5">Layanan Senin – Minggu (08.00 – 21.00 WIB)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* HALAMAN 9: LEMBAR KESEPAKATAN SPONSOR (FORMULIR MOU)*/}
        {/* ==================================================== */}
        <section className="proposal-page bg-white p-[18mm] sm:p-[20mm] min-h-[297mm] shadow-lg print:shadow-none border border-neutral-200 print:border-none print:break-after-page text-[10pt] flex flex-col justify-between">
          <div>
            <FormalKopSurat />

            <h3 className="text-[11.5pt] font-bold uppercase tracking-wider text-black text-center border-b-2 border-black pb-1 mb-3">
              LEMBAR KESEPAKATAN KERJASAMA SPONSORSHIP (MoU)
            </h3>

            <p className="text-justify text-[9.5pt] mb-3 leading-relaxed">
              Yang bertanda tangan di bawah ini, menyatakan persetujuan untuk berpartisipasi dan bersinergi sebagai Mitra Sponsor dalam program <b>&quot;{data.eventName}&quot;</b> yang diselenggarakan oleh Optik I See You:
            </p>

            <table className="w-full border-collapse border border-black text-[9pt] mb-3">
              <tbody>
                <tr className="border-b border-black">
                  <td className="w-[32%] py-1.5 px-3 font-semibold bg-neutral-100 border-r border-black">
                    Nama Perusahaan / Brand
                  </td>
                  <td className="py-1.5 px-3">
                    <EditSpan
                      value={data.recipientCompany}
                      onChange={(v) => updateField("recipientCompany", v)}
                      tag="span"
                    />
                  </td>
                </tr>
                <tr className="border-b border-black">
                  <td className="py-1.5 px-3 font-semibold bg-neutral-100 border-r border-black">
                    Alamat Domisili Kantor / Brand
                  </td>
                  <td className="py-1.5 px-3 text-gray-500 italic">
                    [Tuliskan alamat domisili kantor / gerai mitra]
                  </td>
                </tr>
                <tr className="border-b border-black">
                  <td className="py-1.5 px-3 font-semibold bg-neutral-100 border-r border-black">
                    Nama Penanggung Jawab &amp; Jabatan
                  </td>
                  <td className="py-1.5 px-3">
                    <EditSpan
                      value={data.recipientTitle}
                      onChange={(v) => updateField("recipientTitle", v)}
                      tag="span"
                    />
                  </td>
                </tr>
                <tr className="border-b border-black">
                  <td className="py-1.5 px-3 font-semibold bg-neutral-100 border-r border-black">
                    Nomor WhatsApp / Telepon Aktif
                  </td>
                  <td className="py-1.5 px-3 text-gray-500 italic">[Nomor telepon / kontak aktif PIC mitra]</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="py-1.5 px-3 font-semibold bg-neutral-100 border-r border-black align-top">
                    Pilihan Paket Kemitraan
                  </td>
                  <td className="py-1.5 px-3 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border border-black inline-block" />
                      <span>Paket Platinum (Rp 5.000.000,-)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border border-black inline-block" />
                      <span>Paket Gold (Rp 3.000.000,-)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border border-black inline-block" />
                      <span>Paket Bronze (Rp 1.500.000,-) — Termasuk Sesi Live Demo Produk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border border-black inline-block" />
                      <span>Paket In-Kind / In-Keep &amp; Custom Collaboration (Barter Produk / Fasilitas)</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 font-semibold bg-neutral-100 border-r border-black align-top">
                    Catatan Khusus Kemitraan / Barter
                  </td>
                  <td className="py-1.5 px-3 text-gray-500 italic">
                    [Tuliskan rincian barang barter konsumsi, merchandise, goodie bag, atau penawaran custom brand]
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="text-[8.5pt] text-gray-800 italic text-justify leading-relaxed">
              Surat kesepakatan ini dibuat dalam keadaan sadar dan ditandatangani oleh pejabat yang
              berwenang untuk dijadikan dasar penerbitan Surat Perjanjian Kerjasama (MoU) resmi.
            </p>
          </div>

          {/* Kolom Tanda Tangan Formal 2 Pihak */}
          <div className="pt-4 border-t border-gray-400 mt-4 text-[9.5pt]">
            <div className="text-right mb-3">
              <p>
                Disepakati pada tanggal: ....................................... 2026
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Pihak Pertama */}
              <div className="text-center border border-black p-3">
                <p className="font-bold uppercase text-[9pt]">PIHAK PERTAMA</p>
                <p className="text-[8pt] text-gray-700">Penyelenggara (Optik I See You)</p>
                <div className="h-16 flex items-center justify-center text-gray-400 text-xs italic">
                  [Tanda Tangan &amp; Stempel]
                </div>
                <p className="font-bold underline text-[9.5pt]">
                  <EditSpan
                    value={data.picName}
                    onChange={(v) => updateField("picName", v)}
                    tag="span"
                  />
                </p>
                <p className="text-gray-700 text-[8pt]">
                  <EditSpan
                    value={data.picRole}
                    onChange={(v) => updateField("picRole", v)}
                    tag="span"
                  />
                </p>
              </div>

              {/* Pihak Kedua */}
              <div className="text-center border border-black p-3">
                <p className="font-bold uppercase text-[9pt]">PIHAK KEDUA</p>
                <p className="text-[8pt] text-gray-700">Mitra Sponsor</p>
                <div className="h-16 flex items-center justify-center text-gray-400 text-xs border border-dashed border-gray-300 w-24 mx-auto my-0.5">
                  Materai Rp 10.000
                </div>
                <p className="font-bold underline text-[9.5pt]">
                  ( ................................................. )
                </p>
                <p className="text-gray-700 text-[8pt]">Nama Terang &amp; Jabatan</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Global Print Stylesheet */}
      <style jsx global>{`
        @media print {
          nav,
          header,
          footer,
          .no-print,
          [data-no-print="true"] {
            display: none !important;
          }
          body,
          html {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            color: black !important;
            font-size: 10pt !important;
            width: 100% !important;
            max-width: 100% !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm 12mm 10mm 12mm;
          }
          .proposal-doc {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
          }
          .proposal-page {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: 0 !important;
            height: auto !important;
            page-break-after: always !important;
            break-after: page !important;
            box-sizing: border-box !important;
            display: block !important;
          }
          .proposal-cover-page {
            height: 275mm !important;
            min-height: 275mm !important;
            max-height: 275mm !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            box-sizing: border-box !important;
            page-break-after: always !important;
            break-after: page !important;
          }
          .proposal-page:last-child {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          table {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          img {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};
