"use client";

import React, { useEffect, useState, useRef } from "react";

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

interface PackageTier {
  id: string;
  name: string;
  tagline: string;
  price: string;
  benefits: string[];
}

interface ProposalData {
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

const STORAGE_KEY = "isy_proposal_sponsor_formal_v4";

const DEFAULT_DATA: ProposalData = {
  docNo: "024/MKT-ISY/PROP-SPONSOR/X/2026",
  docAttachment: "1 (Satu) Berkas Proposal Kerjasama",
  docSubject: "Permohonan Kerjasama Sponsorship & Sinergi Kemitraan B2B 'Creative Content Masterclass 2026'",
  letterCity: "Purwokerto",
  letterDate: "15 Oktober 2026",
  recipientTitle: "Pimpinan / Brand & Marketing Manager",
  recipientCompany: "[Nama Perusahaan / Brand Mitra]",
  recipientCity: "di Tempat",
  letterIntro:
    "Sehubungan dengan rencana pelaksanaan program pengembangan kreator konten digital dan sinergi industri kreatif bertajuk 'Creative Content Masterclass 2026: Buka Kelas Konten', kami dari Divisi Strategic Partnership & Marketing Optik I See You bermaksud mengajukan penawaran kerjasama sponsorship serta kolaborasi bisnis Business-to-Business (B2B) kepada perusahaan/brand yang Bapak/Ibu pimpin.",
  letterClosing:
    "Demikian surat penawaran kerjasama sponsorship ini kami sampaikan. Besar harapan kami agar terjalin kolaborasi B2B yang saling menguntungkan (win-win synergy) dan berdampak nyata bagi pertumbuhan kedua belah pihak. Atas perhatian dan kesempatan yang diberikan, kami ucapkan terima kasih.",
  eventName: "CREATIVE CONTENT MASTERCLASS 2026",
  eventSubtitle: "Buka Kelas Konten: Masterclass Kreator Digital & Kolaborasi Brand Masa Kini",
  eventTheme: "Elevate Your Visuals, Scale Your Impact: Strategi Produksi Konten Komersial, Estetika Ritel & Kolaborasi Brand Masa Kini",
  eventOrganizer: "Divisi Marketing & Strategic Partnership, Optik I See You & Lunar Eyewear",
  eventDate: "Sabtu, 14 November 2026",
  eventTime: "09.00 – 15.00 WIB",
  eventVenue: "Creative Hall & Event Space Banyumas Raya",
  eventParticipants: "50 Peserta Terpilih (Kreator konten, influencer lokal, pegiat media sosial, dan tim kreatif brand)",
  eventFormat: "Workshop intensif pembuatan konten, bedah studi kasus komersial, unboxing produk sponsor, mini booth expo, dan sesi B2B networking",
  backgroundText1:
    "Perkembangan lanskap digital saat ini menuntut brand dan pelaku bisnis untuk terus hadir dengan konten visual yang otentik, estetis, dan bernilai komersial tinggi. Bagi brand lokal dan regional di wilayah Banyumas Raya dan sekitarnya, kolaborasi terpadu bersama kreator konten aktif merupakan strategi pemasaran yang paling efektif dalam menjangkau audiens muda, mahasiswa, hingga segmen keluarga modern.",
  backgroundText2:
    "Optik I See You bersama Lunar Eyewear menginisiasi program 'Creative Content Masterclass 2026: Buka Kelas Konten'. Program ini dirancang bukan sekadar seminar teori satu arah, melainkan inkubator praktik di mana 50 peserta kreator terpilih langsung memproduksi konten video promosi dan ulasan produk mitra sponsor secara riil di lokasi.",
  backgroundText3:
    "Melalui kemitraan B2B ini, brand mitra memperoleh aktivasi multi-kanal: tatap muka langsung dan sampling produk kepada kreator, penempatan materi promosi (brosur/voucher) di meja kasir 4 gerai ritel, penayangan video di TV Showroom, serta publikasi digital melalui media sosial resmi @iseeyou.glasses (244.000+ followers).",
  picName: "Yoshput",
  picRole: "Staff Kemitraan & Sponsorship Marketing",
  picWa: "0877-7868-3766",
  picEmail: "marketing@optikiseeyou.com",
  headName: "Mas Raja",
  headRole: "Head of Marketing & Strategic Communication",
  bankName: "Bank Central Asia (BCA) KCU Purwokerto",
  bankAccountNo: "046-189-2231",
  bankAccountName: "Optik I See You",
  packages: [
    {
      id: "platinum",
      name: "PAKET PLATINUM (SPONSOR UTAMA)",
      tagline: "Eksklusivitas On-Site & Jaringan Ritel 4 Kota",
      price: "Rp 5.000.000,-",
      benefits: [
        "Hak pembukaan 1 (satu) booth/stand promosi interaktif eksklusif di lokasi acara.",
        "Penayangan video profil / iklan komersial di layar TV Showroom 4 cabang ritel selama 1 (satu) bulan penuh.",
        "Sesi presentasi / product demo di panggung utama selama 15 menit.",
        "Pencantuman logo ukuran BESAR pada backdrop panggung, x-banner, flyer cetak, dan frame photobooth.",
        "Penyertaan produk sampling / voucher resmi di dalam goodie bag seluruh peserta dan narasumber.",
        "Penyebutan (ad-lips) nama brand oleh Master of Ceremony (MC) sebanyak 10 kali selama acara.",
        "1 (satu) kali penayangan video Reels/Feed dedicated di akun Instagram resmi @iseeyou.glasses.",
      ],
    },
    {
      id: "gold",
      name: "PAKET GOLD (SPONSOR MADYA)",
      tagline: "Visibilitas Ritel & Digital Kampanye",
      price: "Rp 3.000.000,-",
      benefits: [
        "Penayangan video profil / iklan produk di layar TV Showroom 4 cabang ritel selama 2 (dua) minggu.",
        "Pencantuman logo ukuran SEDANG pada backdrop panggung, banner kegiatan, dan materi publikasi digital.",
        "Display materi promosi (flyer/voucher) di meja kasir 4 gerai cabang Optik I See You.",
        "Hak menyertakan voucher belanja / materi promosi dalam goodie bag peserta.",
        "Penyebutan (ad-lips) nama brand oleh MC sebanyak 5 kali selama acara.",
        "Joint feed post kolaborasi di media sosial resmi Optik I See You.",
      ],
    },
    {
      id: "silver",
      name: "PAKET SILVER (SPONSOR PENDAMPING)",
      tagline: "Eksposur Event & Media Sosial",
      price: "Rp 1.500.000,-",
      benefits: [
        "Penayangan slide poster promosi di layar TV Showroom 4 cabang ritel selama 1 (satu) minggu.",
        "Pencantuman logo ukuran STANDAR pada banner utama dan e-flyer publikasi.",
        "Penyertaan flyer / voucher promosi ke dalam goodie bag peserta.",
        "Mention dan tag apresiasi sponsorship di Instagram Story resmi Optik I See You.",
      ],
    },
    {
      id: "barter",
      name: "PAKET KEMITRAAN B2B & BARTER SINERGI (CROSS-PROMOTION)",
      tagline: "Sinergi Ritel Store-to-Store: Tukar Voucher, Display Meja Kasir & Goodie Bag",
      price: "Non-Tunai / Barter Ekuivalen",
      benefits: [
        "Skema Tukar Voucher (Cross-Voucher): Penyertaan 50 pcs voucher diskon / treatment mitra ke dalam Official Goodie Bag peserta & penukaran voucher belanja kacamata Optik I See You untuk pelanggan setia mitra.",
        "Skema Tukar Display Meja Kasir (Cross-Brochure): Penempatan brosur, flyer, atau tent card promosi mitra di area kasir 4 gerai cabang ritel Optik I See You (Purwokerto, Purbalingga, Cilacap, Wonosobo).",
        "Penayangan materi promosi / slide produk mitra pada layar TV Showroom seluruh gerai cabang selama periode kegiatan.",
        "Hak penyediaan tester produk / sampling di area venue event serta apresiasi kemitraan di Instagram Story @iseeyou.glasses (244.000+ followers).",
      ],
    },
  ],
};

const fmt = (n: number) => n.toLocaleString("id-ID");

export const SponsorProposalDocument: React.FC<Props> = ({ followers }) => {
  const [data, setData] = useState<ProposalData>(DEFAULT_DATA);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [fontFamily, setFontFamily] = useState<"times" | "georgia" | "garamond" | "arial">("times");
  const [lineSpacing, setLineSpacing] = useState<"1.2" | "1.35" | "1.5">("1.35");
  const [isSavedNotice, setIsSavedNotice] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"document" | "quickForm">("document");

  // Load from local storage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setData({ ...DEFAULT_DATA, ...parsed });
      }
    } catch (e) {
      console.error("Gagal membaca storage proposal:", e);
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

  const handleReset = () => {
    if (confirm("Kembalikan seluruh isi proposal ke draf formal default?")) {
      setData(DEFAULT_DATA);
      localStorage.removeItem(STORAGE_KEY);
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 2500);
    }
  };

  const updateField = (field: keyof ProposalData, val: any) => {
    setData((prev) => ({ ...prev, [field]: val }));
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
    isBlock?: boolean;
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
    <div className="border-b-[2.5px] border-black pb-3 mb-6">
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
            OPTIK I SEE YOU &amp; LUNAR EYEWEAR
          </h2>
          <p className="text-[8.5pt] text-gray-800 tracking-wide font-medium">
            Jaringan Ritel Kacamata &amp; Layanan Pemeriksaan Mata Terpadu
          </p>
          <p className="text-[7.5pt] text-gray-700 mt-0.5">
            Gerai: Purwokerto (Pusat) · Purbalingga · Cilacap · Wonosobo · Lunar Eyewear Tegal
          </p>
          <p className="text-[7.5pt] text-gray-700">
            Website: www.optikiseeyou.com · Layanan Kemitraan: 0877-7868-3766 · Email: marketing@optikiseeyou.com
          </p>
        </div>

        {/* Right: Slogan "for every you" Logo */}
        <div className="flex items-center justify-end">
          <img
            src="/brand/logo-for-every-you.png"
            alt="for every you"
            className="h-8 w-auto object-contain opacity-90"
          />
        </div>
      </div>
      {/* Formal Double Rule */}
      <div className="mt-2 border-t-[0.75px] border-black" />
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 py-6 px-2 sm:px-4 print:p-0 print:bg-white">
      {/* ======================================================== */}
      {/* FLOATING ACTION TOOLBAR (NO PRINT)                      */}
      {/* ======================================================== */}
      <div className="no-print max-w-[210mm] mx-auto mb-6 bg-white border border-neutral-300 rounded-xl p-4 shadow-md sticky top-4 z-50">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide text-neutral-950 uppercase">
                Proposal Sponsorship Resmi
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-neutral-200 text-neutral-800 rounded">
                Standar Formal Korporat
              </span>
              {isSavedNotice && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-green-100 text-green-800 border border-green-300 rounded">
                  ✓ Tersimpan
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-600 mt-0.5">
              Format baku persuratan korporat bebas ikon/ornamen AI. Dilengkapi KOP resmi Optik I See You &amp; slogan &quot;for every you&quot;.
            </p>
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
              {isEditing ? "✎ Mode Edit Aktif" : "Mode Edit"}
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
              title="Reset ke template default"
            >
              Reset
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-800 text-white hover:bg-emerald-900 shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Cetak / Simpan PDF (A4)</span>
            </button>
          </div>
        </div>

        {/* Second Row: Target Recipient Customizer (Universal for Any Brand) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-200 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[280px]">
            <span className="font-semibold text-neutral-700 whitespace-nowrap">Target Mitra / Perusahaan:</span>
            <input
              type="text"
              value={data.recipientCompany}
              onChange={(e) => updateField("recipientCompany", e.target.value)}
              placeholder="Contoh: PT Nuha Cosmetindo / Baby Glows"
              className="flex-1 max-w-[320px] px-2.5 py-1 bg-neutral-50 border border-neutral-300 rounded text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-neutral-500 font-medium mr-1">Isi Cepat:</span>
            {[
              { label: "Umum / Universal", company: "[Nama Perusahaan / Brand Mitra]", title: "Pimpinan / Brand & Marketing Manager" },
              { label: "Baby Glows", company: "Baby Glows", title: "Pimpinan & Tim Manajemen" },
              { label: "Nuha Cosmetindo", company: "PT Nuha Cosmetindo", title: "Pimpinan & Tim Marketing" },
              { label: "Taylor De Virdis", company: "Taylor De Virdis", title: "Pimpinan & Tim Manajemen" },
              { label: "Inul Vista", company: "Inul Vista Purwokerto", title: "Mas Wahyu & Tim Marketing" },
              { label: "B2B Clinic", company: "B2B Clinic", title: "Pimpinan & Tim Marketing" },
              { label: "Navagreen", company: "Navagreen Purwokerto", title: "Tim Marketing & Kemitraan" },
              { label: "Reta Clinic", company: "Reta Beauty Clinic", title: "Tim Sponsorship & Promosi" },
              { label: "Rita Group", company: "Rita Supermall Purwokerto", title: "Tim Promosi & Partnership" },
              { label: "Merayu Spa", company: "Merayu Spa Purwokerto", title: "Pimpinan & Tim Manajemen" },
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
                  Klik langsung pada teks bergaris bawah kuning di dokumen untuk mengedit
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
        <section className="proposal-page bg-white p-[20mm] min-h-[297mm] shadow-lg print:shadow-none border border-neutral-200 print:border-none relative flex flex-col justify-between print:break-after-page">
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
                className="h-9 w-auto object-contain ml-auto"
              />
              <p className="text-[8pt] text-gray-700 mt-1 uppercase tracking-wider font-semibold">
                Marketing Intelligence &amp; Event Initiative
              </p>
            </div>
          </div>

          {/* Title Area */}
          <div className="my-auto py-10 text-center">
            <p className="text-[11pt] tracking-[0.2em] font-bold text-gray-700 uppercase mb-3">
              PROPOSAL PENAWARAN KERJASAMA SPONSORSHIP
            </p>
            <h1 className="text-[26pt] font-extrabold uppercase tracking-tight text-black leading-tight border-y-2 border-black py-4 my-2">
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
            <p className="text-[10pt] italic text-gray-700 mt-2 max-w-[150mm] mx-auto">
              &quot;
              <EditSpan
                value={data.eventTheme}
                onChange={(v) => updateField("eventTheme", v)}
                tag="span"
              />
              &quot;
            </p>
          </div>

          {/* Submission Info Box */}
          <div className="space-y-6 pt-4 border-t border-gray-400">
            <div className="grid grid-cols-2 gap-6 text-[10pt]">
              <div className="border border-black p-4">
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

              <div className="border border-black p-4">
                <span className="text-[8pt] uppercase font-bold tracking-widest text-gray-600 block mb-1">
                  Penyelenggara Resmi:
                </span>
                <p className="font-bold text-[10.5pt] text-black">
                  DIVISI MARKETING &amp; KEMITRAAN
                </p>
                <p className="text-[9.5pt] text-gray-800">
                  Optik I See You &amp; Lunar Eyewear
                </p>
                <p className="text-[8.5pt] text-gray-600 mt-1">
                  Purwokerto · Purbalingga · Cilacap · Wonosobo · Tegal
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
        <section className="proposal-page bg-white p-[20mm] min-h-[297mm] shadow-lg print:shadow-none border border-neutral-200 print:border-none print:break-after-page text-[10.5pt]">
          <FormalKopSurat />

          {/* Surat Metadata */}
          <div className="flex justify-between items-start mb-6 text-[10pt]">
            <table className="text-[10pt]">
              <tbody>
                <tr>
                  <td className="w-24 font-bold align-top">Nomor</td>
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
                  <td className="font-bold">
                    <EditSpan
                      value={data.docSubject}
                      onChange={(v) => updateField("docSubject", v)}
                      tag="span"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="text-right">
              <p>
                <EditSpan
                  value={data.letterCity}
                  onChange={(v) => updateField("letterCity", v)}
                  tag="span"
                />
                ,{" "}
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
              Optik I See You saat ini mengoperasikan 4 gerai ritel di Purwokerto (Pusat), Purbalingga,
              Cilacap, dan Wonosobo, serta didukung second brand Lunar Eyewear Tegal. Dalam rangka
              membangun sinergi industri kreatif lokal, kami menginisiasi kelas konten terapan yang
              mempertemukan kreator muda dengan brand rekanan.
            </p>
            <p>
              Melalui program ini, pihak sponsor akan memperoleh hak eksposur terpadu: aktivasi booth di
              lokasi acara, penayangan materi video/poster promosi di seluruh layar TV showroom gerai
              resmi, hak penyertaan voucher/sample produk di goodie bag peserta, serta publikasi digital
              di jejaring media sosial kami yang menjangkau lebih dari{" "}
              <b>{fmt(totalAll)} pengikut</b>.
            </p>
            <p>
              Bersama surat ini, kami lampirkan rincian kegiatan, pilihan paket sponsorship, serta
              ketentuan kerjasama untuk menjadi pertimbangan Bapak/Ibu.
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
          <div className="mt-8 pt-4 flex justify-between items-end text-[10pt]">
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
        {/* HALAMAN 3: LATAR BELAKANG & DETAIL KEGIATAN         */}
        {/* ==================================================== */}
        <section className="proposal-page bg-white p-[20mm] min-h-[297mm] shadow-lg print:shadow-none border border-neutral-200 print:border-none print:break-after-page text-[10.5pt]">
          <FormalKopSurat />

          <div className="mb-6">
            <h3 className="text-[12pt] font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-3">
              BAB I. LATAR BELAKANG &amp; TUJUAN KEGIATAN
            </h3>

            <div className={`space-y-2.5 text-justify ${lineHeightClass}`}>
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

              <p className="pt-1">
                <b>1.2 Tujuan Kegiatan</b>
              </p>
              <ol className="list-decimal pl-6 space-y-1">
                <li>
                  Memberikan pelatihan teknis produksi konten video dan foto yang berkarakter komersial
                  kepada 50 peserta terpilih.
                </li>
                <li>
                  Membuka ruang kolaborasi langsung antara brand mitra sponsor dengan audiens Gen-Z dan
                  kreator lokal melalui sesi unboxing, demonstrasi produk, dan live try-on.
                </li>
                <li>
                  Memberikan eksposur berkelanjutan bagi mitra di 4 showroom cabang Optik I See You serta
                  kanal media sosial resmi.
                </li>
              </ol>
            </div>
          </div>

          <div>
            <h3 className="text-[12pt] font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-3">
              BAB II. DESKRIPSI &amp; PELAKSANAAN KEGIATAN
            </h3>

            <table className="w-full border-collapse border border-black text-[10pt] mb-4">
              <tbody>
                <tr className="border-b border-black">
                  <td className="w-[32%] py-2 px-3 font-bold bg-neutral-100 border-r border-black">
                    Nama Kegiatan
                  </td>
                  <td className="py-2 px-3 font-semibold">
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
                  <td className="py-2 px-3 font-bold bg-neutral-100 border-r border-black">
                    Tema Acara
                  </td>
                  <td className="py-2 px-3 italic">
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
                  <td className="py-2 px-3 font-bold bg-neutral-100 border-r border-black">
                    Penyelenggara
                  </td>
                  <td className="py-2 px-3">
                    <EditSpan
                      value={data.eventOrganizer}
                      onChange={(v) => updateField("eventOrganizer", v)}
                      tag="span"
                    />
                  </td>
                </tr>
                <tr className="border-b border-black">
                  <td className="py-2 px-3 font-bold bg-neutral-100 border-r border-black">
                    Hari, Tanggal
                  </td>
                  <td className="py-2 px-3 font-semibold">
                    <EditSpan
                      value={data.eventDate}
                      onChange={(v) => updateField("eventDate", v)}
                      tag="span"
                    />
                  </td>
                </tr>
                <tr className="border-b border-black">
                  <td className="py-2 px-3 font-bold bg-neutral-100 border-r border-black">
                    Waktu Pelaksanaan
                  </td>
                  <td className="py-2 px-3">
                    <EditSpan
                      value={data.eventTime}
                      onChange={(v) => updateField("eventTime", v)}
                      tag="span"
                    />
                  </td>
                </tr>
                <tr className="border-b border-black">
                  <td className="py-2 px-3 font-bold bg-neutral-100 border-r border-black">
                    Tempat / Lokasi
                  </td>
                  <td className="py-2 px-3 font-semibold">
                    <EditSpan
                      value={data.eventVenue}
                      onChange={(v) => updateField("eventVenue", v)}
                      tag="span"
                    />
                  </td>
                </tr>
                <tr className="border-b border-black">
                  <td className="py-2 px-3 font-bold bg-neutral-100 border-r border-black">
                    Target Peserta
                  </td>
                  <td className="py-2 px-3">
                    <EditSpan
                      value={data.eventParticipants}
                      onChange={(v) => updateField("eventParticipants", v)}
                      tag="span"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-bold bg-neutral-100 border-r border-black">
                    Format Kegiatan
                  </td>
                  <td className="py-2 px-3">
                    <EditSpan
                      value={data.eventFormat}
                      onChange={(v) => updateField("eventFormat", v)}
                      tag="span"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ==================================================== */}
        {/* HALAMAN 4: PROFIL JARINGAN & AUDIENS RETAIL         */}
        {/* ==================================================== */}
        <section className="proposal-page bg-white p-[20mm] min-h-[297mm] shadow-lg print:shadow-none border border-neutral-200 print:border-none print:break-after-page text-[10.5pt]">
          <FormalKopSurat />

          <h3 className="text-[12pt] font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-3">
            BAB III. JARINGAN RETAIL &amp; PAPARAN MEDIA SPONSOR
          </h3>

          <p className={`text-justify mb-4 ${lineHeightClass}`}>
            Optik I See You memberikan nilai tambah unik yang tidak dimiliki event konvensional:{" "}
            <b>eksposur berkelanjutan di jaringan toko ritel fisik</b>. Setiap materi video dan poster
            sponsor berkesempatan tayang di layar TV showroom 4 cabang selama periode kerjasama,
            disaksikan langsung oleh pengunjung yang datang untuk fitting frame dan pemeriksaan refraksi
            mata harian.
          </p>

          <p className="font-bold text-[10.5pt] mb-1.5">3.1 Rekapitulasi Jaringan Cabang Ritel</p>
          <table className="w-full border-collapse border border-black text-[9.5pt] mb-5">
            <thead>
              <tr className="bg-neutral-100 border-b border-black">
                <th className="py-2 px-3 text-left border-r border-black font-bold">Cabang Gerai</th>
                <th className="py-2 px-3 text-left border-r border-black font-bold">Wilayah &amp; Karakteristik</th>
                <th className="py-2 px-3 text-left font-bold">Fasilitas Tayang Sponsor</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-black">
                <td className="py-2 px-3 border-r border-black font-semibold">Purwokerto (Pusat)</td>
                <td className="py-2 px-3 border-r border-black">Pusat kota, dekat kawasan kampus &amp; kantor</td>
                <td className="py-2 px-3">Layar TV Showroom, Meja Display Kasir</td>
              </tr>
              <tr className="border-b border-black">
                <td className="py-2 px-3 border-r border-black font-semibold">Purbalingga</td>
                <td className="py-2 px-3 border-r border-black">Area sentra niaga &amp; keluarga muda</td>
                <td className="py-2 px-3">Layar TV Showroom, Display Flyer</td>
              </tr>
              <tr className="border-b border-black">
                <td className="py-2 px-3 border-r border-black font-semibold">Cilacap</td>
                <td className="py-2 px-3 border-r border-black">Kawasan residensial &amp; industri aktif</td>
                <td className="py-2 px-3">Layar TV Showroom, Meja Display Kasir</td>
              </tr>
              <tr className="border-b border-black">
                <td className="py-2 px-3 border-r border-black font-semibold">Wonosobo</td>
                <td className="py-2 px-3 border-r border-black">Pusat kota &amp; jalur pariwisata Dieng</td>
                <td className="py-2 px-3">Layar TV Showroom, Display Flyer</td>
              </tr>
              <tr>
                <td className="py-2 px-3 border-r border-black font-semibold">Lunar Eyewear Tegal</td>
                <td className="py-2 px-3 border-r border-black">Second brand optik modern Gen-Z</td>
                <td className="py-2 px-3">Layar TV Showroom &amp; Cross-Promotion</td>
              </tr>
            </tbody>
          </table>

          <p className="font-bold text-[10.5pt] mb-1.5">3.2 Jangkauan Media Sosial Terintegrasi</p>
          <table className="w-full border-collapse border border-black text-[9.5pt] mb-2">
            <thead>
              <tr className="bg-neutral-100 border-b border-black">
                <th className="py-2 px-3 text-left border-r border-black font-bold">Akun Resmi</th>
                <th className="py-2 px-3 text-left border-r border-black font-bold">Gerai Wilayah</th>
                <th className="py-2 px-3 text-right border-r border-black font-bold">Followers IG</th>
                <th className="py-2 px-3 text-right font-bold">Followers TikTok</th>
              </tr>
            </thead>
            <tbody>
              {followers.map((fRow, idx) => (
                <tr key={fRow.account} className="border-b border-black">
                  <td className="py-1.5 px-3 border-r border-black font-semibold">{fRow.account}</td>
                  <td className="py-1.5 px-3 border-r border-black text-gray-800">{fRow.label}</td>
                  <td className="py-1.5 px-3 border-r border-black text-right tabular-nums">
                    {fmt(fRow.igFollowers)}
                  </td>
                  <td className="py-1.5 px-3 text-right tabular-nums">
                    {fRow.tiktokFollowers ? fmt(fRow.tiktokFollowers) : "-"}
                  </td>
                </tr>
              ))}
              <tr className="bg-neutral-100 font-bold border-t-2 border-black">
                <td colSpan={2} className="py-2 px-3 border-r border-black uppercase">
                  Total Jangkauan Komulatif Jaringan
                </td>
                <td className="py-2 px-3 border-r border-black text-right tabular-nums">
                  {fmt(totalIg)}
                </td>
                <td className="py-2 px-3 text-right tabular-nums">{fmt(totalTt)}</td>
              </tr>
            </tbody>
          </table>
          <p className="text-[8.5pt] text-gray-600 italic">
            * Data tercatat berdasarkan rekapitulasi audit PIC resmi per Oktober 2026.
          </p>
        </section>

        {/* ==================================================== */}
        {/* HALAMAN 5: PAKET SPONSORSHIP RESMI                  */}
        {/* ==================================================== */}
        <section className="proposal-page bg-white p-[20mm] min-h-[297mm] shadow-lg print:shadow-none border border-neutral-200 print:border-none print:break-after-page text-[10.5pt]">
          <FormalKopSurat />

          <h3 className="text-[12pt] font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-4">
            BAB IV. BENTUK KERJASAMA &amp; PAKET SPONSORSHIP
          </h3>

          <p className={`text-justify mb-5 ${lineHeightClass}`}>
            Kami menyediakan 4 (empat) opsi kemitraan yang dapat disesuaikan dengan kebutuhan promosi
            serta target anggaran pemasaran instansi/brand Bapak/Ibu:
          </p>

          <div className="space-y-4">
            {data.packages.map((pkg, pIdx) => (
              <div key={pkg.id} className="border border-black p-3.5">
                <div className="flex justify-between items-baseline border-b border-black pb-1.5 mb-2">
                  <div>
                    <h4 className="font-bold text-[11pt] tracking-wide text-black">
                      <EditSpan
                        value={pkg.name}
                        onChange={(v) => updatePackage(pIdx, { name: v })}
                        tag="span"
                      />
                    </h4>
                    <p className="text-[8.5pt] text-gray-700 italic">
                      <EditSpan
                        value={pkg.tagline}
                        onChange={(v) => updatePackage(pIdx, { tagline: v })}
                        tag="span"
                      />
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[11.5pt] text-black">
                      <EditSpan
                        value={pkg.price}
                        onChange={(v) => updatePackage(pIdx, { price: v })}
                        tag="span"
                      />
                    </span>
                  </div>
                </div>

                <ul className="list-disc pl-5 space-y-1 text-[9.5pt]">
                  {pkg.benefits.map((b, bIdx) => (
                    <li key={bIdx} className="leading-snug">
                      <EditSpan
                        value={b}
                        onChange={(v) => updateBenefit(pIdx, bIdx, v)}
                        tag="span"
                      />
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => removeBenefit(pIdx, bIdx)}
                          className="ml-2 text-red-600 hover:underline text-[8pt] no-print"
                          title="Hapus butir ini"
                        >
                          [Hapus]
                        </button>
                      )}
                    </li>
                  ))}
                </ul>

                {isEditing && (
                  <button
                    type="button"
                    onClick={() => addBenefit(pIdx)}
                    className="mt-2 text-blue-700 hover:underline text-[8.5pt] font-semibold no-print"
                  >
                    + Tambah Fasilitas Paket
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ==================================================== */}
        {/* HALAMAN 6: PROSEDUR, KONTRAK, & NARAHUBUNG          */}
        {/* ==================================================== */}
        <section className="proposal-page bg-white p-[20mm] min-h-[297mm] shadow-lg print:shadow-none border border-neutral-200 print:border-none print:break-after-page text-[10.5pt]">
          <FormalKopSurat />

          <h3 className="text-[12pt] font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-4">
            BAB V. KETENTUAN, PEMBAYARAN, &amp; NARAHUBUNG
          </h3>

          <div className={`space-y-4 text-justify ${lineHeightClass}`}>
            <div>
              <p className="font-bold mb-1">5.1 Alur Konfirmasi &amp; Pelaksanaan</p>
              <ol className="list-decimal pl-6 space-y-1.5 text-[10pt]">
                <li>
                  Calon mitra sponsor memilih paket kerjasama yang diminati dan mengisi Lembar
                  Kesepakatan Sponsor pada halaman lampiran proposal ini.
                </li>
                <li>
                  Tim Kemitraan Optik I See You menerbitkan Surat Perjanjian Kerjasama (MoU) resmi
                  beserta invoice penagihan resmi.
                </li>
                <li>
                  Mitra menyerahkan materi promosi (file logo resolusi tinggi vektor/PNG, file video/iklan
                  format MP4 1080p, dan materi cetak) paling lambat <b>H-7</b> sebelum tanggal kegiatan.
                </li>
                <li>
                  Pihak penyelenggara menyampaikan laporan bukti tayang (foto &amp; video dokumentasi
                  kegiatan serta penayangan di gerai) maksimal H+7 setelah acara berakhir.
                </li>
              </ol>
            </div>

            <div>
              <p className="font-bold mb-1">5.2 Mekanisme Pembayaran</p>
              <p className="text-[10pt] mb-2">
                Pembayaran biaya sponsorship dilakukan dalam 2 (dua) tahap sebagai berikut:
              </p>
              <table className="w-full border-collapse border border-black text-[9.5pt] mb-3">
                <thead>
                  <tr className="bg-neutral-100 border-b border-black">
                    <th className="py-1.5 px-3 text-left border-r border-black font-bold">Tahap</th>
                    <th className="py-1.5 px-3 text-left border-r border-black font-bold">Jatuh Tempo</th>
                    <th className="py-1.5 px-3 text-right font-bold">Nominal Pembayaran</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-black">
                    <td className="py-1.5 px-3 border-r border-black font-semibold">Tahap I (DP)</td>
                    <td className="py-1.5 px-3 border-r border-black">Saat penandatanganan MoU kerjasama</td>
                    <td className="py-1.5 px-3 text-right font-bold">50% dari total nilai paket</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 border-r border-black font-semibold">Tahap II (Pelunasan)</td>
                    <td className="py-1.5 px-3 border-r border-black">Paling lambat H-3 sebelum pelaksanaan acara</td>
                    <td className="py-1.5 px-3 text-right font-bold">50% sisa pelunasan</td>
                  </tr>
                </tbody>
              </table>

              <p className="text-[10pt]">
                Seluruh pembayaran disalurkan via transfer ke rekening resmi penyelenggara:
              </p>
              <div className="border border-black p-3 bg-neutral-50 mt-1.5 text-[9.5pt]">
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
              <p className="font-bold mb-1">5.3 Layanan Narahubung Resmi</p>
              <p className="text-[10pt] mb-2">
                Untuk koordinasi teknis, pertanyaan paket, dan penyerahan materi kerjasama, silakan
                menghubungi kontak resmi panitia:
              </p>
              <div className="border border-black p-3 text-[10pt] grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-600 block text-[8.5pt]">PIC Kemitraan:</span>
                  <span className="font-bold">
                    <EditSpan
                      value={data.picName}
                      onChange={(v) => updateField("picName", v)}
                      tag="span"
                    />
                  </span>
                  <span className="text-gray-700 block text-[9pt]">
                    <EditSpan
                      value={data.picRole}
                      onChange={(v) => updateField("picRole", v)}
                      tag="span"
                    />
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 block text-[8.5pt]">WhatsApp Resmi:</span>
                  <span className="font-bold">
                    <EditSpan
                      value={data.picWa}
                      onChange={(v) => updateField("picWa", v)}
                      tag="span"
                    />
                  </span>
                  <span className="text-gray-700 block text-[9pt]">
                    <EditSpan
                      value={data.picEmail}
                      onChange={(v) => updateField("picEmail", v)}
                      tag="span"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* HALAMAN 7: LEMBAR KESEPAKATAN SPONSOR (FORMULIR MOU)*/}
        {/* ==================================================== */}
        <section className="proposal-page bg-white p-[20mm] min-h-[297mm] shadow-lg print:shadow-none border border-neutral-200 print:border-none print:break-after-page text-[10.5pt] flex flex-col justify-between">
          <div>
            <FormalKopSurat />

            <h3 className="text-[12pt] font-bold uppercase tracking-wider text-black text-center border-b-2 border-black pb-1 mb-4">
              LEMBAR KESEPAKATAN KERJASAMA SPONSORSHIP
            </h3>

            <p className="text-justify text-[10pt] mb-4 leading-relaxed">
              Yang bertanda tangan di bawah ini, menyatakan bersedia berpartisipasi sebagai Mitra Sponsor
              dalam penyelenggaraan program <b>&quot;{data.eventName}&quot;</b> yang diselenggarakan oleh
              Optik I See You &amp; Lunar Eyewear:
            </p>

            <table className="w-full border-collapse border border-black text-[9.5pt] mb-5">
              <tbody>
                <tr className="border-b border-black">
                  <td className="w-[35%] py-2 px-3 font-semibold bg-neutral-100 border-r border-black">
                    Nama Perusahaan / Brand
                  </td>
                  <td className="py-2 px-3">
                    <EditSpan
                      value={data.recipientCompany}
                      onChange={(v) => updateField("recipientCompany", v)}
                      tag="span"
                    />
                  </td>
                </tr>
                <tr className="border-b border-black">
                  <td className="py-2 px-3 font-semibold bg-neutral-100 border-r border-black">
                    Alamat Lengkap Perusahaan
                  </td>
                  <td className="py-2 px-3 text-gray-500 italic">
                    [Tuliskan alamat domisili kantor / brand mitra]
                  </td>
                </tr>
                <tr className="border-b border-black">
                  <td className="py-2 px-3 font-semibold bg-neutral-100 border-r border-black">
                    Nama Penanggung Jawab
                  </td>
                  <td className="py-2 px-3">
                    <EditSpan
                      value={data.recipientTitle}
                      onChange={(v) => updateField("recipientTitle", v)}
                      tag="span"
                    />
                  </td>
                </tr>
                <tr className="border-b border-black">
                  <td className="py-2 px-3 font-semibold bg-neutral-100 border-r border-black">
                    Nomor Telepon / WhatsApp
                  </td>
                  <td className="py-2 px-3 text-gray-500 italic">[Nomor kontak aktif penanggung jawab]</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="py-2 px-3 font-semibold bg-neutral-100 border-r border-black align-top">
                    Paket Kerjasama yang Dipilih
                  </td>
                  <td className="py-2 px-3 space-y-1">
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
                      <span>Paket Silver (Rp 1.500.000,-)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border border-black inline-block" />
                      <span>Paket Barter / In-Kind (Nilai Produk / Goodie Bag)</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold bg-neutral-100 border-r border-black align-top">
                    Catatan Khusus Kemitraan
                  </td>
                  <td className="py-2 px-3 text-gray-500 italic">
                    [Kebutuhan khusus atau penyesuaian deliverables bila ada]
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="text-[9.5pt] text-gray-800 italic text-justify leading-relaxed">
              Surat kesepakatan ini dibuat dalam keadaan sadar dan ditandatangani oleh pejabat yang
              berwenang untuk dijadikan dasar penerbitan Surat Perjanjian Kerjasama (MoU) resmi.
            </p>
          </div>

          {/* Kolom Tanda Tangan Formal 2 Pihak */}
          <div className="pt-6 border-t border-gray-400 mt-6 text-[10pt]">
            <div className="text-right mb-4">
              <p>
                Disepakati pada tanggal: ....................................... 2026
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Pihak Pertama */}
              <div className="text-center border border-black p-4">
                <p className="font-bold uppercase text-[9.5pt]">PIHAK PERTAMA</p>
                <p className="text-[8.5pt] text-gray-700">Penyelenggara (Optik I See You)</p>
                <div className="h-20 flex items-center justify-center text-gray-400 text-xs italic">
                  [Tanda Tangan &amp; Stempel]
                </div>
                <p className="font-bold underline text-[10pt]">
                  <EditSpan
                    value={data.picName}
                    onChange={(v) => updateField("picName", v)}
                    tag="span"
                  />
                </p>
                <p className="text-gray-700 text-[8.5pt]">
                  <EditSpan
                    value={data.picRole}
                    onChange={(v) => updateField("picRole", v)}
                    tag="span"
                  />
                </p>
              </div>

              {/* Pihak Kedua */}
              <div className="text-center border border-black p-4">
                <p className="font-bold uppercase text-[9.5pt]">PIHAK KEDUA</p>
                <p className="text-[8.5pt] text-gray-700">Mitra Sponsor</p>
                <div className="h-20 flex items-center justify-center text-gray-400 text-xs border border-dashed border-gray-300 w-24 mx-auto my-1">
                  Materai Rp 10.000
                </div>
                <p className="font-bold underline text-[10pt]">
                  ( ................................................. )
                </p>
                <p className="text-gray-700 text-[8.5pt]">Nama Terang &amp; Jabatan</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
