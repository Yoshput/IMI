"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProposalFollowerRow } from "./SponsorProposalDocument";

interface Props {
  followers: ProposalFollowerRow[];
  sourceUrl: string;
}

interface MerchantPackage {
  id: string;
  name: string;
  tagline: string;
  benefits: string[];
}

interface MerchantProposalData {
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
  proposalTitle: string;
  proposalSubtitle: string;
  proposalTheme: string;
  organizerName: string;
  partnershipTerm: string;
  voucherQuotaInfo: string;
  backgroundText1: string;
  backgroundText2: string;
  backgroundText3: string;
  picName: string;
  picRole: string;
  picWa: string;
  headName: string;
  headRole: string;
  packages: MerchantPackage[];
}

const STORAGE_KEY = "isy_proposal_merchant_b2b_v2";

const DEFAULT_MERCHANT_DATA: MerchantProposalData = {
  docNo: "018/MKT-ISY/PROP-B2B/X/2026",
  docAttachment: "1 (Satu) Berkas Proposal Kemitraan B2B",
  docSubject: "Penawaran Kemitraan Strategis B2B: Barter Voucher, Cross-Display Meja Kasir & Publikasi Digital",
  letterCity: "Purwokerto",
  letterDate: "20 Oktober 2026",
  recipientTitle: "Pimpinan / Brand & Marketing Manager",
  recipientCompany: "[Nama Perusahaan / Brand Merchant]",
  recipientCity: "di Tempat",
  letterIntro:
    "Dalam rangka memperluas ekosistem promosi bersama dan memberikan nilai tambah (customer privilege) bagi pelanggan loyal kedua belah pihak, kami dari Divisi Strategic Partnership & Marketing Optik I See You bermaksud mengajukan penawaran program kemitraan strategis Business-to-Business (B2B) jangka panjang bersama perusahaan/brand yang Bapak/Ibu pimpin.",
  letterClosing:
    "Demikian surat penawaran kemitraan strategis B2B ini kami sampaikan. Besar harapan kami agar dapat terjalin kolaborasi saling menguntungkan (win-win synergy) yang memperkuat penetrasi pasar kedua belah pihak di wilayah operasional kita. Atas perhatian dan kerja sama yang baik, kami ucapkan terima kasih.",
  proposalTitle: "PROPOSAL KEMITRAAN MERCHANT B2B",
  proposalSubtitle: "Program Sinergi Cross-Promotion, Pertukaran Voucher & Aktivasi Ritel Jangka Panjang",
  proposalTheme: "Kolaborasi Lintas-Industri Tanpa Biaya Tunai: Memaksimalkan Nilai Tambah Pelanggan & Pertukaran Trafik Gerai Ritel Fisik",
  organizerName: "Divisi Marketing & Strategic Partnership, Optik I See You",
  partnershipTerm: "Kemitraan Berkelanjutan (Evaluasi Berkala per 3 / 6 Bulan)",
  voucherQuotaInfo: "Alokasi Fleksibel (Disesuaikan Melalui Diskusi Bersama Sesuai Kapasitas Penyerapan)",
  backgroundText1:
    "Dinamika perilaku konsumen ritel modern saat ini sangat dipengaruhi oleh program apresiasi dan nilai tambah (privilege) saat bertransaksi. Optik I See You telah dipercaya oleh lebih dari 1.000.000 (satu juta) pembeli dan pelanggan kacamata di 4 cabang, mencakup beragam tingkatan grade konsumen: mulai dari kalangan profesional, dokter, ASN, dan pengusaha (Grade A & B) yang membutuhkan lensa kacamata berkualitas, hingga segmen keluarga mapan dan mahasiswa/generasi muda yang aktif berbelanja. Kolaborasi kemitraan B2B melalui pertukaran voucher belanja dan display kasir terbukti menjadi strategi paling efektif (zero cash fee) dalam mempertemukan kedua basis konsumen yang berdaya beli tinggi.",
  backgroundText2:
    "Optik I See You menginisiasi Program Kemitraan Merchant B2B ini secara inklusif. Kami membuka peluang kolaborasi seluas-luasnya bagi sesama klinik kecantikan, salon & spa, pusat kebugaran/olahraga, kuliner, Fashion, maupun industri jasa lainnya untuk tumbuh bersama, serta terbuka bekerja sama dengan perusahaan-perusahaan Bapak/Ibu demi memperkaya pilihan bagi pelanggan kita bersama. Kuota penawaran voucher dapat disesuaikan dengan diskusi bersama guna menjalin benefit bagi seluruh pelanggan.",
  backgroundText3:
    "Melalui sinergi jangka panjang ini, mitra merchant memperoleh fasilitas terpadu: penyaluran voucher promo ke tangan pembeli kacamata Optik I See You, display tent card/brosur di meja kasir 4 cabang (Purwokerto, Purbalingga, Cilacap, Wonosobo), penayangan video promosi di TV Showroom Purwokerto, serta eksposur publikasi digital melalui Instagram Story resmi @iseeyou.glasses (244.000+ followers).",
  picName: "Yossika Putra",
  picRole: "Staff Kemitraan & Sponsorship Marketing",
  picWa: "0877-7868-3766",
  headName: "Raja Satria",
  headRole: "Head of Marketing & Strategic Communication",
  packages: [
    {
      id: "cross-voucher",
      name: "1. SKEMA PERTUKARAN VOUCHER (CROSS-VOUCHER PRIVILEGE)",
      tagline: "Pertukaran Kuota Voucher Fleksibel (Disesuaikan Melalui Diskusi Bersama)",
      benefits: [
        "Optik I See You mengalokasikan voucher resmi belanja/pemeriksaan kacamata (nominal Rp 50.000 - Rp 100.000) untuk dibagikan secara eksklusif kepada customer mitra.",
        "Mitra Merchant menyediakan voucher potongan harga / diskon treatment / free service untuk dibagikan kepada pelanggan Optik I See You saat transaksi di kasir.",
        "Jumlah kuota voucher disepakati melalui diskusi bersama dan dapat di-restock berkala tiap bulan sesuai kapasitas penyerapan transaksi.",
        "Terbuka untuk perusahaan-perusahaan Bapak/Ibu, berbagai klinik kecantikan, salon & spa, hingga brand gaya hidup lainnya demi memperkaya pilihan bagi pelanggan kita bersama.",
      ],
    },
    {
      id: "cross-display",
      name: "2. SKEMA DISPLAY BROSUR & FLYER MEJA KASIR (STORE-TO-STORE)",
      tagline: "Penempatan Media Promosi Fisik di Titik Pembayaran 4 Cabang",
      benefits: [
        "Penempatan materi promosi fisik (tent card, brosur, atau flyer) mitra di area meja kasir 4 lokasi cabang resmi Optik I See You (Purwokerto, Purbalingga, Cilacap, dan Wonosobo).",
        "Mitra merchant menempatkan tent card / flyer resmi Optik I See You di area meja kasir/resepsionis outlet mitra.",
        "Materi display menjangkau ribuan pengunjung harian yang datang untuk pemeriksaan refraksi mata, fitting kacamata, dan transaksi optik.",
      ],
    },
    {
      id: "digital-story",
      name: "3. SKEMA PROMOSI DIGITAL & KOLABORASI MEDIA SOSIAL",
      tagline: "Eksposur Audiens Digital ke 244.000+ Followers Resmi & Giveaway Bersama",
      benefits: [
        "Penayangan video promosi bersama / ulasan layanan merchant di Instagram Story resmi @iseeyou.glasses (244.000+ followers) secara terjadwal.",
        "Pencantuman mention akun resmi dan link tautan langsung ke platform mitra merchant.",
        "Kolaborasi konten interaktif media sosial, program Giveaway kacamata & voucher merchant bersama, serta promosi silang (cross-promotion) untuk melipatgandakan interaksi audiens.",
      ],
    },
    {
      id: "tv-showroom",
      name: "4. SKEMA TAYANG TV SHOWROOM (PURWOKERTO)",
      tagline: "Eksposur Video Komersial di Layar TV Showroom Utama",
      benefits: [
        "Penayangan video profil atau video promosi komersial mitra merchant pada layar TV Showroom Optik I See You Purwokerto.",
        "Video diputar berulang setiap hari di area tunggu pemeriksaan mata yang selalu ramai pengunjung.",
        "Menegaskan citra prestisius mitra di hadapan audiens keluarga, profesional, dan mahasiswa di pusat kota Purwokerto.",
      ],
    },
  ],
};

const fmt = (n: number) => n.toLocaleString("id-ID");

export const MerchantProposalDocument: React.FC<Props> = ({ followers }) => {
  const [data, setData] = useState<MerchantProposalData>(DEFAULT_MERCHANT_DATA);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [fontFamily, setFontFamily] = useState<"times" | "georgia" | "garamond" | "arial">("times");
  const [lineSpacing, setLineSpacing] = useState<"1.2" | "1.35" | "1.5">("1.35");
  const [isSavedNotice, setIsSavedNotice] = useState<boolean>(false);

  // Load from local storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setData({ ...DEFAULT_MERCHANT_DATA, ...parsed });
      }
    } catch (e) {
      console.error("Gagal membaca storage merchant:", e);
    }
  }, []);

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
    if (confirm("Kembalikan seluruh isi proposal merchant ke draf default Optik I See You?")) {
      setData(DEFAULT_MERCHANT_DATA);
      localStorage.removeItem(STORAGE_KEY);
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 2500);
    }
  };

  const updateField = (field: keyof MerchantProposalData, val: any) => {
    setData((prev) => ({ ...prev, [field]: val }));
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

  // Formal Kop Surat Component
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
            OPTIK I SEE YOU
          </h2>
          <p className="text-[8.5pt] text-gray-800 tracking-wide font-medium">
            Jaringan Ritel Kacamata &amp; Layanan Pemeriksaan Mata Terpadu
          </p>
          <p className="text-[7.5pt] text-gray-700 mt-0.5">
            Lokasi Cabang: Purwokerto · Purbalingga · Cilacap · Wonosobo
          </p>
          <p className="text-[7.5pt] text-gray-700">
            Website: www.optikiseeyou.com · Layanan Kemitraan B2B: 0877-7868-3766
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
      <div className="mt-2 border-t-[0.75px] border-black" />
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 py-6 px-2 sm:px-4 print:p-0 print:m-0 print:bg-white print:w-full print:min-h-0">
      {/* FLOATING ACTION TOOLBAR */}
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
              <Link
                href="/proposal-sponsor"
                className="px-2.5 py-1 rounded-md font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-white/60 transition-all flex items-center gap-1"
                title="Buka Proposal Sponsor Event (Kelas Konten)"
              >
                <span className="text-[10px]">←</span>
                <span>1. Proposal Sponsor Event</span>
              </Link>
              <span className="px-2.5 py-1 rounded-md font-bold bg-white text-emerald-900 shadow-2xs">
                2. Proposal Merchant B2B
              </span>
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

        {/* Quick Fill Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-200 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[280px]">
            <span className="font-semibold text-neutral-700 whitespace-nowrap">Target Merchant:</span>
            <input
              type="text"
              value={data.recipientCompany}
              onChange={(e) => updateField("recipientCompany", e.target.value)}
              placeholder="Contoh: Merayu Spa Purbalingga"
              className="flex-1 max-w-[320px] px-2.5 py-1 bg-neutral-50 border border-neutral-300 rounded text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-neutral-500 font-medium mr-1">Isi Cepat:</span>
            {[
              { label: "Umum / Universal", company: "[Nama Perusahaan / Brand Merchant]", title: "Pimpinan / Brand & Marketing Manager" },
              { label: "Merayu Spa", company: "Merayu Spa Purbalingga", title: "Kak Nisrina Khoirunnisa S (Account Executive)" },
              { label: "Navagreen", company: "Navagreen Purwokerto", title: "Pimpinan & Tim Marketing" },
              { label: "Reta Clinic", company: "Reta Beauty Clinic", title: "Pimpinan & Tim Sponsorship" },
              { label: "Baby Glows", company: "Baby Glows", title: "Pimpinan & Tim Manajemen" },
              { label: "Taylor De Virdis", company: "Taylor De Virdis", title: "Pimpinan & Tim Manajemen" },
              { label: "Inul Vista", company: "Inul Vista Purwokerto", title: "Mas Wahyu & Tim Marketing" },
              { label: "Rita Padel", company: "Rita Padel Club", title: "Pimpinan & Tim Manajemen" },
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

        {/* Font controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-200 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-neutral-700">Font:</span>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value as any)}
                className="px-2 py-1 bg-neutral-50 border border-neutral-300 rounded text-xs font-serif"
              >
                <option value="times">Times New Roman (Standar Formal)</option>
                <option value="georgia">Georgia (Serif Elegan)</option>
                <option value="garamond">Garamond (Klasik)</option>
                <option value="arial">Arial (Modern)</option>
              </select>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-neutral-700">Spasi:</span>
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

          <div className="text-[11px] text-neutral-500">
            {isEditing ? (
              <span className="text-amber-700 font-semibold">Klik teks bergaris bawah kuning di lembar dokumen untuk mengedit</span>
            ) : (
              "Aktifkan 'Mode Edit' untuk mengubah teks langsung pada dokumen"
            )}
          </div>
        </div>
      </div>

      {/* DOCUMENT PAGES (A4 FORMAL SHEETS) */}
      <div className="proposal-doc max-w-[210mm] mx-auto space-y-8 print:space-y-0 text-black print:w-full print:max-w-none print:m-0 print:p-0" style={fontStyle}>
        
        {/* ==================================================== */}
        {/* HALAMAN 1: COVER FORMAL                             */}
        {/* ==================================================== */}
        <section className="proposal-page bg-white p-[20mm] min-h-[297mm] shadow-lg print:shadow-none border border-neutral-200 print:border-none relative flex flex-col justify-between print:justify-start print:min-h-0 print:h-auto print:break-after-page">
          <div className="flex items-center justify-between border-b-[2px] border-black pb-4">
            <img src="/brand/logo-isy-dark.png" alt="Optik I See You" className="h-11 w-auto object-contain" />
            <div className="text-right">
              <img src="/brand/logo-for-every-you.png" alt="for every you" className="h-7 w-auto object-contain ml-auto opacity-90" />
              <p className="text-[8pt] text-gray-700 mt-1 uppercase tracking-wider font-semibold">
                Strategic Partnership &amp; Merchant Privilege
              </p>
            </div>
          </div>

          <div className="my-auto py-10 text-center print:my-4 print:py-4">
            <p className="text-[11pt] tracking-[0.2em] font-bold text-gray-700 uppercase mb-3">
              PENAWARAN KEMITRAAN STRATEGIS B2B (MERCHANT)
            </p>
            <h1 className="text-[24pt] font-extrabold uppercase tracking-tight text-black leading-tight border-y-2 border-black py-4 my-2">
              <EditSpan value={data.proposalTitle} onChange={(v) => updateField("proposalTitle", v)} tag="span" />
            </h1>
            <p className="text-[12pt] font-semibold text-gray-900 mt-3">
              <EditSpan value={data.proposalSubtitle} onChange={(v) => updateField("proposalSubtitle", v)} tag="span" />
            </p>
            <p className="text-[10pt] italic text-gray-700 mt-2 max-w-[150mm] mx-auto">
              &quot;<EditSpan value={data.proposalTheme} onChange={(v) => updateField("proposalTheme", v)} tag="span" />&quot;
            </p>
          </div>

          <div className="space-y-6 pt-4 border-t border-gray-400">
            <div className="grid grid-cols-2 gap-6 text-[10pt]">
              <div className="border border-black p-4">
                <span className="text-[8pt] uppercase font-bold tracking-widest text-gray-600 block mb-1">
                  Ditujukan Kepada:
                </span>
                <p className="font-bold text-[11pt] text-black">
                  <EditSpan value={data.recipientCompany} onChange={(v) => updateField("recipientCompany", v)} tag="span" />
                </p>
                <p className="text-gray-800 text-[9.5pt] mt-0.5">
                  u.p. <EditSpan value={data.recipientTitle} onChange={(v) => updateField("recipientTitle", v)} tag="span" />
                </p>
              </div>

              <div className="border border-black p-4">
                <span className="text-[8pt] uppercase font-bold tracking-widest text-gray-600 block mb-1">
                  Penyelenggara Resmi:
                </span>
                <p className="font-bold text-[10.5pt] text-black">
                  DIVISI STRATEGIC PARTNERSHIP &amp; MARKETING
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
              Dokumen Resmi Kemitraan B2B Merchant · Tahun 2026 · www.optikiseeyou.com
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* HALAMAN 2: SURAT PENGANTAR RESMI                    */}
        {/* ==================================================== */}
        <section className="proposal-page bg-white p-[20mm] min-h-[297mm] shadow-lg print:shadow-none border border-neutral-200 print:border-none print:break-after-page text-[10.5pt]">
          <FormalKopSurat />

          <div className="flex justify-between items-start mb-6 text-[10pt] gap-6">
            <table className="text-[10pt] flex-1 max-w-[65%]">
              <tbody>
                <tr>
                  <td className="w-20 font-bold align-top">Nomor</td>
                  <td className="w-4 align-top">:</td>
                  <td><EditSpan value={data.docNo} onChange={(v) => updateField("docNo", v)} tag="span" /></td>
                </tr>
                <tr>
                  <td className="font-bold align-top">Lampiran</td>
                  <td className="align-top">:</td>
                  <td><EditSpan value={data.docAttachment} onChange={(v) => updateField("docAttachment", v)} tag="span" /></td>
                </tr>
                <tr>
                  <td className="font-bold align-top">Perihal</td>
                  <td className="align-top">:</td>
                  <td className="font-bold leading-snug"><EditSpan value={data.docSubject} onChange={(v) => updateField("docSubject", v)} tag="span" /></td>
                </tr>
              </tbody>
            </table>
            <div className="text-right shrink-0 whitespace-nowrap pt-0.5">
              <p className="whitespace-nowrap font-medium text-[10pt]">
                <EditSpan value={data.letterCity} onChange={(v) => updateField("letterCity", v)} tag="span" />{", "}
                <EditSpan value={data.letterDate} onChange={(v) => updateField("letterDate", v)} tag="span" />
              </p>
            </div>
          </div>

          <div className="mb-5 text-[10.5pt]">
            <p>Kepada Yth.</p>
            <p className="font-bold"><EditSpan value={data.recipientTitle} onChange={(v) => updateField("recipientTitle", v)} tag="span" /></p>
            <p className="font-bold text-[11pt]"><EditSpan value={data.recipientCompany} onChange={(v) => updateField("recipientCompany", v)} tag="span" /></p>
            <p><EditSpan value={data.recipientCity} onChange={(v) => updateField("recipientCity", v)} tag="span" /></p>
          </div>

          <div className={`space-y-3.5 text-justify ${lineHeightClass}`}>
            <p>Dengan hormat,</p>
            <p><EditSpan value={data.letterIntro} onChange={(v) => updateField("letterIntro", v)} tag="span" /></p>
            <p>
              Optik I See You merupakan jaringan ritel kacamata terkemuka yang mengoperasikan 4 lokasi cabang di Purwokerto, Purbalingga, Cilacap, dan Wonosobo. Kami memiliki basis pasar terdata lebih dari <b>1.000.000 (satu juta) pembeli dan pelanggan loyal</b> dengan beragam segmentasi grade konsumen (Grade A &amp; B profesional, dokter, ASN, keluarga mapan, hingga kalangan muda produktif), serta diperkuat ekosistem digital dengan lebih dari <b>{fmt(totalAll)} pengikut</b> di media sosial. Melalui kemitraan merchant B2B ini, kami menawarkan program kolaborasi saling menguntungkan tanpa biaya uang tunai (Zero Cash Fee), di mana kedua pihak saling bertukar benefit voucher loyalitas pelanggan dan menempatkan media promosi meja kasir.
            </p>
            <p>
              Kemitraan ini dirancang fleksibel dan berkelanjutan, di mana kuota penawaran voucher dapat disesuaikan dengan diskusi bersama guna menjalin benefit bagi seluruh pelanggan, serta terbuka bekerja sama dengan perusahaan-perusahaan Bapak/Ibu demi memperkaya pilihan bagi pelanggan kita bersama.
            </p>
            <p>
              Bersama surat ini, kami sampaikan penjelasan skema fasilitas kemitraan, profil jaringan ritel dan basis pasar, serta lembar formulir kesepakatan (MoU) untuk menjadi dasar tindak lanjut kerja sama.
            </p>
            <p><EditSpan value={data.letterClosing} onChange={(v) => updateField("letterClosing", v)} tag="span" /></p>
          </div>

          {/* Tanda Tangan Formal */}
          <div className="mt-8 pt-4 flex justify-between items-end text-[10pt]">
            <div>
              <p>Hormat kami,</p>
              <p className="font-semibold text-gray-800">Divisi Kemitraan &amp; Sponsorship</p>
              <div className="h-16 flex items-end"></div>
              <p className="font-bold underline text-[10.5pt]">
                <EditSpan value={data.picName} onChange={(v) => updateField("picName", v)} tag="span" />
              </p>
              <p className="text-gray-700 text-[9pt]">
                <EditSpan value={data.picRole} onChange={(v) => updateField("picRole", v)} tag="span" />
              </p>
            </div>

            <div className="text-right">
              <p>Mengetahui,</p>
              <p className="font-semibold text-gray-800">Head of Marketing</p>
              <div className="h-16 flex items-end justify-end"></div>
              <p className="font-bold underline text-[10.5pt]">
                <EditSpan value={data.headName} onChange={(v) => updateField("headName", v)} tag="span" />
              </p>
              <p className="text-gray-700 text-[9pt]">
                <EditSpan value={data.headRole} onChange={(v) => updateField("headRole", v)} tag="span" />
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* HALAMAN 3: LATAR BELAKANG & PRINSIP KEMITRAAN       */}
        {/* ==================================================== */}
        <section className="proposal-page bg-white p-[20mm] min-h-[297mm] shadow-lg print:shadow-none border border-neutral-200 print:border-none print:break-after-page text-[10.5pt]">
          <FormalKopSurat />

          <h3 className="text-[12pt] font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-3">
            BAB I. LATAR BELAKANG &amp; PRINSIP KEMITRAAN MERCHANT
          </h3>

          <div className={`space-y-3 text-justify ${lineHeightClass}`}>
            <p>
              <b>1.1 Latar Belakang Kemitraan B2B &amp; Basis Pasar Konsumen</b>
              <br />
              <EditSpan value={data.backgroundText1} onChange={(v) => updateField("backgroundText1", v)} tag="span" />
            </p>
            <p>
              <b>1.2 Karakteristik &amp; Inklusivitas Kolaborasi</b>
              <br />
              <EditSpan value={data.backgroundText2} onChange={(v) => updateField("backgroundText2", v)} tag="span" />
            </p>
            <p>
              <b>1.3 Sinergi Multi-Kanal (Offline, Display Kasir &amp; Digital)</b>
              <br />
              <EditSpan value={data.backgroundText3} onChange={(v) => updateField("backgroundText3", v)} tag="span" />
            </p>

            <div className="border border-black p-3.5 bg-neutral-50 mt-2 text-[9.5pt]">
              <p className="font-bold text-black uppercase mb-1">Prinsip Pokok Kerja Sama Merchant Optik I See You:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-800">
                <li><b>Zero Cash Fee (Murni Barter Sinergi):</b> Tidak ada biaya sewa tempat, biaya pendaftaran, atau potongan komisi uang tunai antar-pihak.</li>
                <li><b>Alokasi Voucher Terukur:</b> Kuota voucher disesuaikan melalui diskusi bersama sesuai kapasitas penyerapan transaksi dan dapat diisi ulang (restock) secara rutin setiap bulan.</li>
                <li><b>Inklusif &amp; Kolaboratif:</b> Terbuka bekerja sama dengan perusahaan-perusahaan Bapak/Ibu demi memperkaya pilihan benefit bagi pelanggan kita bersama.</li>
                <li><b>Jangka Panjang &amp; Evaluatif:</b> Kemitraan bersifat jangka panjang dengan evaluasi performa penyerapan voucher setiap 3 bulan sekali.</li>
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-[12pt] font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-3">
              BAB II. DESKRIPSI &amp; IDENTITAS KEMITRAAN
            </h3>
            <table className="w-full border-collapse border border-black text-[10pt]">
              <tbody>
                <tr className="border-b border-black">
                  <td className="w-[32%] py-2 px-3 font-bold bg-neutral-100 border-r border-black">Nama Program</td>
                  <td className="py-2 px-3 font-semibold"><EditSpan value={data.proposalTitle} onChange={(v) => updateField("proposalTitle", v)} tag="span" /></td>
                </tr>
                <tr className="border-b border-black">
                  <td className="py-2 px-3 font-bold bg-neutral-100 border-r border-black">Penyelenggara</td>
                  <td className="py-2 px-3"><EditSpan value={data.organizerName} onChange={(v) => updateField("organizerName", v)} tag="span" /></td>
                </tr>
                <tr className="border-b border-black">
                  <td className="py-2 px-3 font-bold bg-neutral-100 border-r border-black">Durasi Kemitraan</td>
                  <td className="py-2 px-3 font-semibold"><EditSpan value={data.partnershipTerm} onChange={(v) => updateField("partnershipTerm", v)} tag="span" /></td>
                </tr>
                <tr className="border-b border-black">
                  <td className="py-2 px-3 font-bold bg-neutral-100 border-r border-black">Ketentuan Kuota Voucher</td>
                  <td className="py-2 px-3"><EditSpan value={data.voucherQuotaInfo} onChange={(v) => updateField("voucherQuotaInfo", v)} tag="span" /></td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-bold bg-neutral-100 border-r border-black">Cakupan Lokasi Cabang</td>
                  <td className="py-2 px-3">Purwokerto, Purbalingga, Cilacap, dan Wonosobo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ==================================================== */}
        {/* HALAMAN 4: RUANG LINGKUP & BENTUK FASILITAS         */}
        {/* ==================================================== */}
        <section className="proposal-page bg-white p-[20mm] min-h-[297mm] shadow-lg print:shadow-none border border-neutral-200 print:border-none print:break-after-page text-[10.5pt]">
          <FormalKopSurat />

          <h3 className="text-[12pt] font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-4">
            BAB III. RUANG LINGKUP &amp; 4 PILAR FASILITAS MERCHANT
          </h3>

          <p className={`text-justify mb-4 ${lineHeightClass}`}>
            Kami menyediakan 4 (empat) pilar fasilitas kemitraan yang saling terintegrasi guna memastikan materi promosi dan voucher mitra merchant tersampaikan secara optimal kepada target audiens:
          </p>

          <div className="space-y-3.5">
            {data.packages.map((pkg) => (
              <div key={pkg.id} className="border border-black p-3.5">
                <div className="border-b border-black pb-1 mb-2">
                  <h4 className="font-bold text-[10.5pt] tracking-wide text-black uppercase">{pkg.name}</h4>
                  <p className="text-[8.5pt] text-gray-700 italic">{pkg.tagline}</p>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[9.5pt]">
                  {pkg.benefits.map((b, bIdx) => (
                    <li key={bIdx} className="leading-snug">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 border border-dashed border-gray-500 bg-neutral-50 text-[9pt] italic text-gray-700">
            * Catatan Khusus: Penayangan video komersial TV Showroom tersedia khusus di cabang Purwokerto, sedangkan untuk cabang Purbalingga, Cilacap, dan Wonosobo difokuskan pada penempatan display brosur / flyer meja kasir dan voucher barter.
          </div>
        </section>

        {/* ==================================================== */}
        {/* HALAMAN 5: PROFIL JARINGAN CABANG & AUDIENS RETAIL  */}
        {/* ==================================================== */}
        <section className="proposal-page bg-white p-[20mm] min-h-[297mm] shadow-lg print:shadow-none border border-neutral-200 print:border-none print:break-after-page text-[10.5pt]">
          <FormalKopSurat />

          <h3 className="text-[12pt] font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-3">
            BAB IV. JARINGAN CABANG, BASIS PASAR &amp; PAPARAN MEDIA MERCHANT
          </h3>

          <p className={`text-justify mb-3 ${lineHeightClass}`}>
            Sebagai mitra merchant resmi, materi display dan voucher pihak mitra akan terekspos di jaringan toko fisik Optik I See You yang berlokasi strategis di 4 kabupaten utama:
          </p>

          <p className="font-bold text-[10.5pt] mb-1.5">4.1 Rekapitulasi Lokasi Cabang Fisik</p>
          <table className="w-full border-collapse border border-black text-[9pt] mb-4">
            <thead>
              <tr className="bg-neutral-100 border-b border-black">
                <th className="py-1.5 px-3 text-left border-r border-black font-bold">Lokasi Cabang</th>
                <th className="py-1.5 px-3 text-left border-r border-black font-bold">Wilayah &amp; Karakteristik</th>
                <th className="py-1.5 px-3 text-left font-bold">Fasilitas Merchant</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-black">
                <td className="py-1.5 px-3 border-r border-black font-semibold">Purwokerto</td>
                <td className="py-1.5 px-3 border-r border-black">Pusat kota, kawasan kampus &amp; perkantoran</td>
                <td className="py-1.5 px-3">Layar TV Showroom &amp; Meja Display Kasir</td>
              </tr>
              <tr className="border-b border-black">
                <td className="py-1.5 px-3 border-r border-black font-semibold">Purbalingga</td>
                <td className="py-1.5 px-3 border-r border-black">Sentra niaga, perkantoran &amp; keluarga muda</td>
                <td className="py-1.5 px-3">Meja Display Kasir &amp; Display Brosur / Flyer</td>
              </tr>
              <tr className="border-b border-black">
                <td className="py-1.5 px-3 border-r border-black font-semibold">Cilacap</td>
                <td className="py-1.5 px-3 border-r border-black">Kawasan residensial &amp; industri aktif</td>
                <td className="py-1.5 px-3">Meja Display Kasir &amp; Display Brosur / Flyer</td>
              </tr>
              <tr>
                <td className="py-1.5 px-3 border-r border-black font-semibold">Wonosobo</td>
                <td className="py-1.5 px-3 border-r border-black">Pusat kota &amp; jalur pariwisata Dieng</td>
                <td className="py-1.5 px-3">Meja Display Kasir &amp; Display Brosur / Flyer</td>
              </tr>
            </tbody>
          </table>

          <p className="font-bold text-[10.5pt] mb-1.5">4.2 Jangkauan Media Sosial Terintegrasi</p>
          <table className="w-full border-collapse border border-black text-[9pt] mb-3">
            <thead>
              <tr className="bg-neutral-100 border-b border-black">
                <th className="py-1.5 px-3 text-left border-r border-black font-bold">Akun Resmi</th>
                <th className="py-1.5 px-3 text-left border-r border-black font-bold">Lokasi Cabang</th>
                <th className="py-1.5 px-3 text-right border-r border-black font-bold">Followers IG</th>
                <th className="py-1.5 px-3 text-right font-bold">Followers TikTok</th>
              </tr>
            </thead>
            <tbody>
              {followers.map((fRow) => (
                <tr key={fRow.account} className="border-b border-black">
                  <td className="py-1 px-3 border-r border-black font-semibold">{fRow.account}</td>
                  <td className="py-1 px-3 border-r border-black text-gray-800">{fRow.label}</td>
                  <td className="py-1 px-3 border-r border-black text-right tabular-nums">{fmt(fRow.igFollowers)}</td>
                  <td className="py-1 px-3 text-right tabular-nums">{fRow.tiktokFollowers ? fmt(fRow.tiktokFollowers) : "-"}</td>
                </tr>
              ))}
              <tr className="bg-neutral-100 font-bold border-t-2 border-black">
                <td colSpan={2} className="py-1.5 px-3 border-r border-black uppercase">Total Jangkauan Komulatif</td>
                <td className="py-1.5 px-3 border-r border-black text-right tabular-nums">{fmt(totalIg)}</td>
                <td className="py-1.5 px-3 text-right tabular-nums">{fmt(totalTt)}</td>
              </tr>
            </tbody>
          </table>

          {/* 4.3 Profil Basis Pasar Pelanggan & Grade Konsumen */}
          <div className="border border-black p-3 bg-neutral-50 text-[9pt]">
            <p className="font-bold text-black uppercase mb-1 flex items-center justify-between">
              <span>4.3 Basis Pasar Pelanggan (1.000.000+ Pembeli) &amp; Segmentasi Grade Konsumen</span>
              <span className="text-[7.5pt] font-semibold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                Database Ritel Terintegrasi
              </span>
            </p>
            <p className="text-gray-800 text-justify mb-2 leading-relaxed text-[8.5pt]">
              Optik I See You tidak hanya didukung oleh komunitas digital yang kuat, melainkan memiliki rekam jejak pasar riil lebih dari <b>1.000.000 (satu juta) transaksi pembeli dan rekam medis kacamata</b> di 4 kabupaten. Profil konsumen terbagi dalam segmentasi grade yang matang:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[8pt]">
              <div className="border border-neutral-300 bg-white p-2 rounded">
                <p className="font-bold text-black text-[8.5pt] mb-0.5">Grade A &amp; B (Purchasing Power Tinggi)</p>
                <p className="text-gray-700 leading-snug">
                  Segmen eksekutif, dokter, tenaga medis, ASN/BUMN, pengusaha, dan keluarga mapan. Mengutamakan lensa premium dan layanan berkelas; audiens primer untuk penukaran voucher klinik estetika, spa, gaya hidup, dan kuliner.
                </p>
              </div>
              <div className="border border-neutral-300 bg-white p-2 rounded">
                <p className="font-bold text-black text-[8.5pt] mb-0.5">Grade C+ &amp; Generasi Produktif / Gen-Z</p>
                <p className="text-gray-700 leading-snug">
                  Segmen mahasiswa (Unsoed, UMP, Telkom), pelajar, kreator konten, dan keluarga muda aktif. Sangat responsif terhadap tren Fashion kacamata kekinian, program giveaway, dan voucher diskon belanja langsung.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* HALAMAN 6: PROSEDUR & NARAHUBUNG                    */}
        {/* ==================================================== */}
        <section className="proposal-page bg-white p-[20mm] min-h-[297mm] shadow-lg print:shadow-none border border-neutral-200 print:border-none print:break-after-page text-[10.5pt]">
          <FormalKopSurat />

          <h3 className="text-[12pt] font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-4">
            BAB V. PROSEDUR PELAKSANAAN &amp; NARAHUBUNG RESMI
          </h3>

          <div className={`space-y-4 text-justify ${lineHeightClass}`}>
            <div>
              <p className="font-bold mb-1">5.1 Alur Konfirmasi &amp; Aktivasi Kemitraan</p>
              <ol className="list-decimal pl-6 space-y-1.5 text-[10pt]">
                <li>Calon mitra merchant menyepakati rincian skema voucher dan menandatangani lembar kesepakatan MoU pada halaman lampiran.</li>
                <li>Kedua belah pihak saling menyerahkan lembar voucher fisik (kuota disepakati melalui diskusi bersama) dan materi display meja kasir.</li>
                <li>Tim Optik I See You mendistribusikan voucher mitra ke 4 gerai kasir dan menjadwalkan penayangan Instagram Story / TV Showroom.</li>
                <li>Kedua belah pihak melakukan monitoring berkala atas penyerapan voucher dan dapat melakukan restock voucher kapan saja.</li>
              </ol>
            </div>

            <div>
              <p className="font-bold mb-1">5.2 Layanan Narahubung Resmi Kemitraan</p>
              <p className="text-[10pt] mb-2">Untuk koordinasi penyerahan voucher, materi display, dan jadwal publikasi:</p>
              <div className="border border-black p-3 text-[10pt] grid grid-cols-2 gap-2 bg-neutral-50">
                <div>
                  <span className="text-gray-600 block text-[8.5pt]">PIC Kemitraan B2B:</span>
                  <span className="font-bold"><EditSpan value={data.picName} onChange={(v) => updateField("picName", v)} tag="span" /></span>
                  <span className="text-gray-700 block text-[9pt]"><EditSpan value={data.picRole} onChange={(v) => updateField("picRole", v)} tag="span" /></span>
                </div>
                <div>
                  <span className="text-gray-600 block text-[8.5pt]">WhatsApp Resmi Kemitraan:</span>
                  <span className="font-bold text-[11pt]"><EditSpan value={data.picWa} onChange={(v) => updateField("picWa", v)} tag="span" /></span>
                  <span className="text-gray-600 block text-[8pt] mt-0.5">Layanan Senin – Minggu (09.00 – 21.00 WIB)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* HALAMAN 7: LEMBAR KESEPAKATAN MOU MERCHANT B2B      */}
        {/* ==================================================== */}
        <section className="proposal-page bg-white p-[20mm] min-h-[297mm] shadow-lg print:shadow-none border border-neutral-200 print:border-none print:break-after-page text-[10.5pt] flex flex-col justify-between print:justify-start print:min-h-0 print:h-auto">
          <div>
            <FormalKopSurat />

            <h3 className="text-[12pt] font-bold uppercase tracking-wider text-black text-center border-b-2 border-black pb-1 mb-4">
              LEMBAR KESEPAKATAN KERJASAMA MERCHANT B2B (MoU)
            </h3>

            <p className="text-justify text-[10pt] mb-4 leading-relaxed">
              Yang bertanda tangan di bawah ini, bersepakat untuk menjalin kemitraan strategis B2B (barter voucher, cross-display kasir, dan promosi bersama) antara <b>Optik I See You</b> dengan pihak Merchant Mitra:
            </p>

            <table className="w-full border-collapse border border-black text-[9.5pt] mb-5">
              <tbody>
                <tr className="border-b border-black">
                  <td className="w-[35%] py-2 px-3 font-semibold bg-neutral-100 border-r border-black">Nama Brand / Perusahaan</td>
                  <td className="py-2 px-3 font-bold"><EditSpan value={data.recipientCompany} onChange={(v) => updateField("recipientCompany", v)} tag="span" /></td>
                </tr>
                <tr className="border-b border-black">
                  <td className="py-2 px-3 font-semibold bg-neutral-100 border-r border-black">Alamat Domisili Gerai/Kantor</td>
                  <td className="py-2 px-3 text-gray-500 italic">[Tuliskan alamat lengkap outlet / kantor mitra]</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="py-2 px-3 font-semibold bg-neutral-100 border-r border-black">Nama Penanggung Jawab (PIC)</td>
                  <td className="py-2 px-3 font-semibold"><EditSpan value={data.recipientTitle} onChange={(v) => updateField("recipientTitle", v)} tag="span" /></td>
                </tr>
                <tr className="border-b border-black">
                  <td className="py-2 px-3 font-semibold bg-neutral-100 border-r border-black">Bentuk Voucher yang Disediakan</td>
                  <td className="py-2 px-3 text-gray-700">[Contoh: Voucher Diskon Rp 120.000 / Diskon 20% Treatment / Produk Trial]</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="py-2 px-3 font-semibold bg-neutral-100 border-r border-black">Alokasi Jumlah Voucher per Bulan</td>
                  <td className="py-2 px-3 font-semibold">[Contoh: 50 lembar / 100 lembar (Disesuaikan Melalui Diskusi Bersama)]</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold bg-neutral-100 border-r border-black">Durasi Awal Kesepakatan</td>
                  <td className="py-2 px-3">3 (Tiga) Bulan dan dapat diperpanjang otomatis</td>
                </tr>
              </tbody>
            </table>

            <p className="text-[9.5pt] text-gray-800 italic text-justify leading-relaxed">
              Surat kesepakatan ini dibuat dengan itikad baik dalam 2 (dua) rangkap bermaterai cukup dan memiliki kekuatan hukum yang sama bagi kedua belah pihak.
            </p>
          </div>

          {/* Kolom Tanda Tangan Formal 2 Pihak */}
          <div className="pt-6 border-t border-gray-400 mt-6 text-[10pt]">
            <div className="text-right mb-4">
              <p>Disepakati di Purwokerto, pada tanggal: ....................................... 2026</p>
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
                  <EditSpan value={data.picName} onChange={(v) => updateField("picName", v)} tag="span" />
                </p>
                <p className="text-gray-700 text-[8.5pt]">
                  <EditSpan value={data.picRole} onChange={(v) => updateField("picRole", v)} tag="span" />
                </p>
              </div>

              {/* Pihak Kedua */}
              <div className="text-center border border-black p-4">
                <p className="font-bold uppercase text-[9.5pt]">PIHAK KEDUA</p>
                <p className="text-[8.5pt] text-gray-700">Mitra Merchant</p>
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

      {/* Global Print Stylesheet */}
      <style jsx global>{`
        @media print {
          nav, header, footer, .no-print, [data-no-print="true"] {
            display: none !important;
          }
          body, html {
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
            margin: 12mm 14mm 12mm 14mm;
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
